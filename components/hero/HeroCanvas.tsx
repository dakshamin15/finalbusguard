"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { PIECES, buildHousing, type PieceKey } from "./parts";

export type CalloutKey = "housing" | PieceKey;
export type HeroCanvasProps = {
  progress: MutableRefObject<number>;
  labels: MutableRefObject<Partial<Record<CalloutKey, HTMLElement | null>>>;
  onReady?: () => void;
  active: boolean;
};

declare global {
  interface Window {
    __bgCapture?: (p: number) => Promise<string>;
  }
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// Where each callout anchors on the assembled unit (local to the unit group).
const ANCHORS: Partial<Record<CalloutKey, [number, number, number]>> = {
  housing: [-1.2, -0.3, 0.78],
  varifocal: [0.5, 0.04, 0.92],
  wifi: [0.18, 0.12, 0.4],
  edgeProc: [-0.58, 0.29, -0.12],
  pcb: [0.75, -0.38, 0.2],
};
const LOCK_AT: Record<PieceKey, number> = { pcb: 0, edgeProc: 0, accel: 0, wifi: 0, varifocal: 0, piCam: 0 };
PIECES.forEach((p, i) => (LOCK_AT[p.key] = 0.12 + i * 0.085 + 0.2));

const DIR = new THREE.Vector3(0.5, 0.66, 0.68).normalize();

function Unit({ progress, labels, onReady }: Omit<HeroCanvasProps, "active">) {
  const group = useRef<THREE.Group>(null);
  const kicker = useRef<THREE.PointLight>(null);
  const { camera, size, gl, scene } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const sp = useRef(progress.current);
  const override = useRef<number | null>(null);
  const ready = useRef(false);

  const housing = useMemo(() => buildHousing(), []);
  const pieces = useMemo(
    () =>
      PIECES.map((p) => {
        const obj = p.build();
        obj.position.fromArray(p.start[0]);
        obj.rotation.fromArray(p.start[1] as [number, number, number]);
        return { ...p, obj };
      }),
    []
  );

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });

    if (process.env.NODE_ENV === "development") {
      window.__bgCapture = async (p: number) => {
        override.current = p;
        sp.current = p;
        await new Promise((r) => setTimeout(r, 400));
        gl.render(scene, camera);
        return gl.domElement.toDataURL("image/png");
      };
    }
    return () => window.removeEventListener("pointermove", move);
  }, [gl, scene, camera]);

  const v = useMemo(() => new THREE.Vector3(), []);
  const v2 = useMemo(() => new THREE.Vector3(), []);
  const q0 = useMemo(() => new THREE.Euler(), []);

  useFrame((state, dt) => {
    const target = override.current ?? progress.current;
    sp.current += (target - sp.current) * Math.min(1, dt * 7);
    const p = sp.current;
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    const aspect = size.width / size.height;
    const wide = aspect > 1.25;
    // Unit sits right of the headline at rest, then glides to center as it assembles.
    const centerT = smooth(0.02, 0.3, p);
    // Frame the unit to the right of the headline (wide) or below it (narrow) via a view offset,
    // so shadows and callout projection stay consistent with what is rendered.
    const cam = camera as THREE.PerspectiveCamera;
    const shiftX = wide ? THREE.MathUtils.lerp(size.width * 0.2, 0, centerT) : 0;
    const shiftY = wide ? 0 : THREE.MathUtils.lerp(size.height * 0.16, 0, centerT);
    cam.setViewOffset(size.width, size.height, -shiftX, -shiftY, size.width, size.height);
    g.rotation.y = THREE.MathUtils.lerp(-0.62, -0.32, smooth(0.0, 1, p)) + Math.sin(t * 0.25) * 0.03 * (1 - p) + pointer.current.x * 0.06;
    g.rotation.x = THREE.MathUtils.lerp(0.06, 0.0, p) + pointer.current.y * 0.025;

    pieces.forEach((pc, i) => {
      const a = 0.12 + i * 0.085;
      const lt = clamp((p - a) / 0.2);
      const e = easeOut(lt);
      const float = (1 - e) * 0.08;
      v.fromArray(pc.start[0]).lerp(v2.fromArray(pc.final[0]), e);
      pc.obj.position.set(v.x + Math.sin(t * 0.7 + i) * float, v.y + Math.cos(t * 0.6 + i * 1.7) * float, v.z);
      q0.set(
        THREE.MathUtils.lerp(pc.start[1][0], pc.final[1][0], e) + Math.sin(t * 0.4 + i) * float,
        THREE.MathUtils.lerp(pc.start[1][1], pc.final[1][1], e),
        THREE.MathUtils.lerp(pc.start[1][2], pc.final[1][2], e)
      );
      pc.obj.rotation.copy(q0);
      const bump = lt > 0.82 && lt < 1 ? Math.sin(((lt - 0.82) / 0.18) * Math.PI) * 0.035 : 0;
      pc.obj.scale.setScalar(1 + bump);
    });

    // Camera dollies in as the unit completes.
    const dist = THREE.MathUtils.lerp(wide ? 14.5 : 16, wide ? 9.6 : 11.5, smooth(0.12, 0.95, p));
    camera.position.copy(DIR).multiplyScalar(dist);
    camera.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();

    if (kicker.current) kicker.current.intensity = 30 * smooth(0.82, 1, p);

    // Project callout anchors to screen space. Only transform/opacity are written.
    const L = labels.current;
    (Object.keys(ANCHORS) as CalloutKey[]).forEach((k) => {
      const el = L[k];
      if (!el) return;
      v.fromArray(ANCHORS[k]!);
      g.localToWorld(v);
      v.project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      const lockAt = k === "housing" ? 0.12 : LOCK_AT[k as PieceKey];
      const on = p > lockAt + 0.02 && p < 1.01;
      const want = on ? "1" : "0";
      if (el.dataset.on !== want) {
        el.dataset.on = want;
      }
    });

    if (!ready.current) {
      ready.current = true;
      requestAnimationFrame(() => onReady?.());
    }
  });

  return (
    <>
      <group ref={group}>
        <primitive object={housing} />
        {pieces.map((pc) => (
          <primitive key={pc.key} object={pc.obj} />
        ))}
        <pointLight ref={kicker} position={[0, 0.6, -2.2]} color="#ec7c34" intensity={0} distance={9} decay={1.6} />
      </group>
      <ContactShadows position={[0, -0.78, 0]} opacity={0.6} scale={14} blur={2.6} far={4} resolution={512} color="#000000" />
    </>
  );
}

export default function HeroCanvas({ progress, labels, onReady, active }: HeroCanvasProps) {
  const [dpr, setDpr] = useState(1.5);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={dpr}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 30, near: 0.1, far: 60, position: [5.2, 3.4, 7.8] }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(Math.min(1.75, window.devicePixelRatio))} />
      <ambientLight intensity={0.08} />
      <directionalLight position={[6, 9, 6]} intensity={1.6} color="#fff3e6" />
      <directionalLight position={[-7, 3, -4]} intensity={1.2} color="#cfe0ff" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#fff4ea" position={[0, 6, 2]} rotation-x={Math.PI / 2} scale={[10, 6, 1]} />
        <Lightformer form="rect" intensity={4} color="#ffffff" position={[-6, 1.5, -1]} rotation-y={Math.PI / 2} scale={[1.2, 7, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#dfe8ff" position={[6, 1, 2]} rotation-y={-Math.PI / 2} scale={[1.2, 7, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#ec7c34" position={[0, -1, -6]} scale={[12, 2, 1]} />
        <Lightformer form="ring" intensity={1.2} color="#ffffff" position={[3, 3, 6]} scale={2} />
      </Environment>
      <Unit progress={progress} labels={labels} onReady={onReady} />
    </Canvas>
  );
}
