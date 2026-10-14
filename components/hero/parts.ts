// Procedural BusGuard hardware, ported from the original Three.js hero and upgraded to
// physically based materials. No model download: the whole unit is built from primitives.
import * as THREE from "three";

const ACCENT = 0xec7c34;

type MatOpts = { r?: number; m?: number; cc?: number; emissive?: number; ei?: number };
const cache = new Map<string, THREE.MeshPhysicalMaterial>();
function mat(color: number, { r = 0.5, m = 0.2, cc = 0, emissive, ei = 0 }: MatOpts = {}) {
  const key = `${color}|${r}|${m}|${cc}|${emissive ?? ""}|${ei}`;
  let mt = cache.get(key);
  if (!mt) {
    mt = new THREE.MeshPhysicalMaterial({
      color,
      roughness: r,
      metalness: m,
      clearcoat: cc,
      clearcoatRoughness: 0.35,
      emissive: emissive ?? 0x000000,
      emissiveIntensity: ei,
    });
    cache.set(key, mt);
  }
  return mt;
}

const geoCache = new Map<string, THREE.BufferGeometry>();
const g = <T extends THREE.BufferGeometry>(key: string, make: () => T): T => {
  let geo = geoCache.get(key) as T | undefined;
  if (!geo) {
    geo = make();
    geoCache.set(key, geo);
  }
  return geo;
};
const B = (w: number, h: number, d: number) => g(`b${w}|${h}|${d}`, () => new THREE.BoxGeometry(w, h, d));
const C = (rt: number, rb: number, h: number, s = 28) => g(`c${rt}|${rb}|${h}|${s}`, () => new THREE.CylinderGeometry(rt, rb, h, s));
const T = (r: number, t: number, rs = 8, ts = 32) => g(`t${r}|${t}|${rs}|${ts}`, () => new THREE.TorusGeometry(r, t, rs, ts));
const Ci = (r: number, s: number) => g(`ci${r}|${s}`, () => new THREE.CircleGeometry(r, s));
const Sp = (r: number, w: number, h: number) => g(`s${r}|${w}|${h}`, () => new THREE.SphereGeometry(r, w, h));

function M(geo: THREE.BufferGeometry, m: THREE.Material) {
  const o = new THREE.Mesh(geo, m);
  o.castShadow = true;
  o.receiveShadow = true;
  return o;
}

// Shared palette
const P = {
  shell: () => mat(0x57504a, { r: 0.5, m: 0.3, cc: 0.5 }),
  inner: () => mat(0x2c2825, { r: 0.75, m: 0.05 }),
  edge: () => mat(0x8f8a84, { r: 0.32, m: 1 }),
  accent: () => mat(ACCENT, { r: 0.3, m: 0.6, emissive: ACCENT, ei: 0.35 }),
  rubber: () => mat(0x0d0c0b, { r: 0.95, m: 0 }),
  pcb: () => mat(0x1a4d2a, { r: 0.55, m: 0.08, cc: 0.6 }),
  gold: () => mat(0xd9a640, { r: 0.22, m: 1 }),
  chip: () => mat(0x161517, { r: 0.3, m: 0.6 }),
  silver: () => mat(0xc8c6c2, { r: 0.28, m: 1 }),
  alu: () => mat(0x9a958f, { r: 0.4, m: 1 }),
  dark: () => mat(0x1d1c1f, { r: 0.5, m: 0.45 }),
  glass: () => mat(0x05080c, { r: 0.04, m: 0.9, cc: 1 }),
  label: () => mat(0xe9e4dc, { r: 0.85, m: 0 }),
  cream: () => mat(0xd9d1b8, { r: 0.85, m: 0 }),
};

export function buildHousing() {
  const grp = new THREE.Group();
  const W = 2.4, H = 1.35, D = 1.55, TH = 0.092;
  const add = (w: number, h: number, d: number, x: number, y: number, z: number, m: THREE.Material) => {
    const o = M(B(w, h, d), m);
    o.position.set(x, y, z);
    grp.add(o);
    return o;
  };
  add(W, TH, D, 0, -H / 2 + TH / 2, 0, P.shell());
  add(TH, H, D, -W / 2 + TH / 2, 0, 0, P.shell());
  add(TH, H, D, W / 2 - TH / 2, 0, 0, P.shell());
  add(W, H, TH, 0, 0, -D / 2 + TH / 2, P.shell());
  add(W, H, TH, 0, 0, D / 2 - TH / 2, P.shell());
  const eW = 0.03;
  [[W / 2 - eW / 2, H / 2 - eW / 2], [-W / 2 + eW / 2, H / 2 - eW / 2], [W / 2 - eW / 2, -H / 2 + eW / 2], [-W / 2 + eW / 2, -H / 2 + eW / 2]].forEach(([x, y]) =>
    add(eW, eW, D + 0.002, x, y, 0, P.edge())
  );
  add(W, 0.018, 0.018, 0, H / 2 - 0.009, D / 2, P.accent());
  add(W, 0.018, 0.018, 0, -H / 2 + 0.009, D / 2, P.accent());
  add(0.52, 0.4, 0.14, 0.5, 0.04, D / 2 + 0.03, P.inner());
  const ring = M(T(0.19, 0.018, 10, 40), P.accent());
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0.5, 0.04, D / 2 + 0.01);
  grp.add(ring);
  add(W - 0.2, 0.05, D - 0.2, 0, -H / 2 + TH + 0.025, 0, P.inner());
  [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(([sx, sz]) => {
    const p = [sx * (W / 2 - 0.2), -H / 2 + TH, sz * (D / 2 - 0.2)] as const;
    const boss = M(C(0.04, 0.04, 0.1, 12), P.dark());
    boss.position.set(...p);
    grp.add(boss);
    const screw = M(C(0.018, 0.018, 0.05, 10), P.alu());
    screw.position.set(p[0], p[1] + 0.075, p[2]);
    grp.add(screw);
    const foot = M(C(0.065, 0.078, 0.065, 16), P.rubber());
    foot.position.set(sx * (W / 2 - 0.18), -H / 2 - 0.044, sz * (D / 2 - 0.18));
    grp.add(foot);
  });
  for (let i = 0; i < 5; i++) add(0.32, 0.028, 0.018, -0.5 + i * 0.26, 0.2, -D / 2 + 0.005, P.inner());
  add(0.7, 0.14, 0.005, -0.6, -0.35, D / 2 + 0.002, P.label());
  return grp;
}

export function buildPCB() {
  const grp = new THREE.Group();
  const board = M(B(1.82, 0.046, 1.16), P.pcb());
  grp.add(board);
  const soc = M(B(0.34, 0.036, 0.34), P.chip());
  soc.position.set(-0.24, 0.041, 0.02);
  grp.add(soc);
  const hs = M(B(0.28, 0.009, 0.28), P.alu());
  hs.position.set(-0.24, 0.066, 0.02);
  grp.add(hs);
  const ram = M(B(0.22, 0.03, 0.18), P.chip());
  ram.position.set(0.14, 0.038, -0.12);
  grp.add(ram);
  const wf = M(B(0.14, 0.018, 0.12), P.silver());
  wf.position.set(0.38, 0.032, 0.2);
  grp.add(wf);
  [-0.22, 0.22].forEach((z) => {
    const port = M(B(0.165, 0.078, 0.068), P.silver());
    port.position.set(0.91, 0.062, z);
    grp.add(port);
  });
  const eth = M(B(0.148, 0.095, 0.235), P.alu());
  eth.position.set(0.91, 0.075, 0.43);
  grp.add(eth);
  const gpio = M(B(0.88, 0.028, 0.152), P.inner());
  gpio.position.set(-0.42, 0.037, -0.47);
  grp.add(gpio);
  const pin = C(0.0078, 0.0078, 0.065, 6);
  for (let col = 0; col < 2; col++)
    for (let i = 0; i < 13; i++) {
      const p = M(pin, P.gold());
      p.position.set(-0.81 + i * 0.068, 0.044, -0.44 + col * 0.068);
      grp.add(p);
    }
  // Deterministic traces (no Math.random so every render matches the poster)
  for (let i = 0; i < 14; i++) {
    const len = 0.45 + ((i * 37) % 9) * 0.07;
    const tr = M(B(len, 0.0028, 0.007), P.gold());
    tr.position.set(-0.45 + ((i * 53) % 7) * 0.09, 0.024, -0.36 + i * 0.05);
    grp.add(tr);
  }
  [[0.3, -0.32], [0.55, 0.08], [-0.5, 0.28], [0.15, 0.34]].forEach(([x, z]) => {
    const cap = M(C(0.022, 0.022, 0.055, 12), P.dark());
    cap.position.set(x, 0.05, z);
    grp.add(cap);
  });
  [{ c: 0x34ff7a, x: 0.7 }, { c: ACCENT, x: 0.59 }].forEach(({ c, x }) => {
    const led = M(Sp(0.016, 10, 10), mat(c, { r: 0.2, m: 0, emissive: c, ei: 3 }));
    led.position.set(x, 0.038, -0.39);
    grp.add(led);
  });
  return grp;
}

export function buildEdgeProcessor() {
  const grp = new THREE.Group();
  const enc = M(B(0.65, 0.24, 0.48), mat(0x1c1f2a, { r: 0.4, m: 0.6, cc: 0.3 }));
  grp.add(enc);
  for (let i = -0.2; i <= 0.2001; i += 0.05) {
    const fin = M(B(0.6, 0.072, 0.018), P.alu());
    fin.position.set(0, 0.156, i);
    grp.add(fin);
  }
  const base = M(B(0.6, 0.014, 0.46), P.silver());
  base.position.y = 0.127;
  grp.add(base);
  const lbl = M(B(0.006, 0.095, 0.38), P.label());
  lbl.position.set(0.332, 0, 0);
  grp.add(lbl);
  [0x34ff7a, 0xffb020, ACCENT].forEach((c, i) => {
    const led = M(Sp(0.013, 10, 10), mat(c, { r: 0.2, m: 0, emissive: c, ei: 3 }));
    led.position.set(0.335, 0.075, -0.1 + i * 0.1);
    grp.add(led);
  });
  const term = M(B(0.24, 0.115, 0.058), mat(0x1f5a2c, { r: 0.45, m: 0.2 }));
  term.position.set(0.04, 0.005, 0.27);
  grp.add(term);
  const din = M(B(0.6, 0.052, 0.118), P.alu());
  din.position.y = -0.146;
  grp.add(din);
  return grp;
}

export function buildAccelerometer() {
  const grp = new THREE.Group();
  const sub = M(B(0.38, 0.014, 0.3), mat(0x1a3fa8, { r: 0.55, m: 0.1, cc: 0.5 }));
  grp.add(sub);
  const ic = M(B(0.155, 0.035, 0.155), P.chip());
  ic.position.set(0.02, 0.025, 0.02);
  grp.add(ic);
  for (let i = 0; i < 6; i++) {
    const p = M(C(0.008, 0.008, 0.068, 6), P.gold());
    p.position.set(-0.13 + i * 0.052, 0.022, -0.13);
    grp.add(p);
  }
  return grp;
}

export function buildWifiAntenna() {
  const grp = new THREE.Group();
  const puck = M(C(0.175, 0.175, 0.048, 32), P.dark());
  grp.add(puck);
  const top = M(C(0.155, 0.155, 0.006, 32), P.silver());
  top.position.y = 0.027;
  grp.add(top);
  const stub = M(C(0.022, 0.03, 0.36, 16), P.dark());
  stub.position.y = 0.232;
  grp.add(stub);
  for (let i = 0; i < 5; i++) {
    const tr = M(T(0.031, 0.003, 6, 16), P.silver());
    tr.position.y = 0.05 + i * 0.012;
    tr.rotation.x = Math.PI / 2;
    grp.add(tr);
  }
  const tip = M(Sp(0.026, 16, 16), P.accent());
  tip.position.y = 0.414;
  grp.add(tip);
  const cable = M(C(0.018, 0.018, 0.62, 10), P.rubber());
  cable.rotation.x = Math.PI / 2;
  cable.position.set(0, 0.005, -0.36);
  grp.add(cable);
  const sma = M(C(0.03, 0.03, 0.078, 16), P.gold());
  sma.rotation.x = Math.PI / 2;
  sma.position.set(0, 0.005, -0.66);
  grp.add(sma);
  return grp;
}

export function buildCamera() {
  const grp = new THREE.Group();
  const box = M(B(0.21, 0.19, 0.215), P.dark());
  box.position.z = -0.055;
  grp.add(box);
  const cyl = (rt: number, rb: number, h: number, z: number, m: THREE.Material) => {
    const o = M(C(rt, rb, h, 32), m);
    o.rotation.x = Math.PI / 2;
    o.position.z = z;
    grp.add(o);
  };
  cyl(0.098, 0.104, 0.018, 0.06, P.dark());
  cyl(0.092, 0.1, 0.16, 0.185, mat(0x19181c, { r: 0.45, m: 0.5 }));
  cyl(0.1, 0.1, 0.072, 0.11, P.alu());
  cyl(0.076, 0.088, 0.2, 0.365, mat(0x161519, { r: 0.42, m: 0.55 }));
  cyl(0.082, 0.082, 0.058, 0.28, P.accent());
  cyl(0.068, 0.074, 0.07, 0.5, P.dark());
  const bezel = M(T(0.07, 0.01, 10, 32), P.silver());
  bezel.position.z = 0.538;
  grp.add(bezel);
  const glass = M(Ci(0.062, 32), P.glass());
  glass.position.z = 0.54;
  grp.add(glass);
  const glint = M(Ci(0.018, 16), mat(0x3a6bd8, { r: 0.05, m: 0.8, emissive: 0x2a54c0, ei: 1.2 }));
  glint.position.set(0.018, 0.018, 0.542);
  grp.add(glint);
  return grp;
}

export function buildPiCamera() {
  const grp = new THREE.Group();
  grp.add(M(B(0.235, 0.014, 0.3), P.pcb()));
  const ic = M(B(0.112, 0.02, 0.112), P.chip());
  ic.position.set(0, 0.017, 0.02);
  grp.add(ic);
  const lm = M(C(0.032, 0.036, 0.028, 16), P.dark());
  lm.position.set(0, 0.031, 0.02);
  grp.add(lm);
  const lg = M(Ci(0.02, 16), P.glass());
  lg.rotation.x = -Math.PI / 2;
  lg.position.set(0, 0.046, 0.02);
  grp.add(lg);
  const fpc = M(B(0.058, 0.006, 0.5), mat(0xe0a92a, { r: 0.45, m: 0.15 }));
  fpc.position.set(0.015, -0.003, -0.36);
  grp.add(fpc);
  return grp;
}

export type PieceKey = "pcb" | "edgeProc" | "accel" | "wifi" | "varifocal" | "piCam";

/** Assembly order and the pose each piece flies in from (exploded) and locks to (final). */
export const PIECES: { key: PieceKey; build: () => THREE.Group; final: [number[], number[]]; start: [number[], number[]] }[] = [
  { key: "pcb", build: buildPCB, final: [[0, -0.44, 0.02], [0, 0, 0]], start: [[0.2, -3.4, 0.6], [0.35, 0.5, -0.1]] },
  { key: "edgeProc", build: buildEdgeProcessor, final: [[-0.58, -0.08, -0.12], [0, 0, 0]], start: [[-3.6, 0.9, -0.6], [0.2, -0.8, 0.3]] },
  { key: "accel", build: buildAccelerometer, final: [[0.48, 0.12, 0.22], [0, 0, 0]], start: [[3.3, 1.5, 0.4], [0.6, 0.9, 0.4]] },
  { key: "wifi", build: buildWifiAntenna, final: [[0.18, -0.3, 0.4], [0, 0, 0]], start: [[1.6, -2.6, 2.4], [0.7, 0.2, 0.3]] },
  { key: "varifocal", build: buildCamera, final: [[0.5, 0.04, 0.38], [0, 0, 0]], start: [[2.9, 0.6, 3.4], [0.2, 0.7, 0.18]] },
  { key: "piCam", build: buildPiCamera, final: [[-1.06, 0.07, 0.09], [0, Math.PI / 2, 0]], start: [[-3.3, -1.6, 1.4], [0.6, Math.PI / 2 - 0.9, 0.3]] },
];
