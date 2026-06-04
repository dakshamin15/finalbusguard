"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BusGuardHero() {
  const canvasRef    = useRef(null);
  const titleWrapRef = useRef(null);
  const brandWordRef = useRef(null);
  const brandSubRef  = useRef(null);
  const dotsRef      = useRef(null);
  const revealWrapRef= useRef(null);
  const revealWordRef= useRef(null);
  const revealSubRef = useRef(null);

  useEffect(() => {
    const canvas     = canvasRef.current;    if (!canvas) return;
    const titleWrap  = titleWrapRef.current;
    const brandWord  = brandWordRef.current;
    const brandSub   = brandSubRef.current;
    const dotsEl     = dotsRef.current;
    const revealWrap = revealWrapRef.current;
    const revealWord = revealWordRef.current;
    const revealSub  = revealSubRef.current;

    // ── Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // ── Scene / dot-grid background
    const scene = new THREE.Scene();
    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = 40; bgCanvas.height = 40;
    const bgCtx = bgCanvas.getContext("2d");
    bgCtx.fillStyle = "#f2f2ef"; bgCtx.fillRect(0, 0, 40, 40);
    bgCtx.fillStyle = "rgba(0,0,0,0.13)"; bgCtx.beginPath(); bgCtx.arc(20, 20, 1.4, 0, Math.PI * 2); bgCtx.fill();
    const bgTex = new THREE.CanvasTexture(bgCanvas);
    bgTex.wrapS = bgTex.wrapT = THREE.RepeatWrapping; bgTex.repeat.set(80, 45);
    scene.background = bgTex;

    // ── Camera
    const camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight, 0.05, 120);
    camera.position.set(5.2, 3.4, 7.8); camera.lookAt(0, 0.15, 0);

    // ── Lighting
    const key = new THREE.DirectionalLight(0xfff6e8, 3.0);
    key.position.set(9, 14, 9); key.castShadow = true;
    key.shadow.mapSize.width = key.shadow.mapSize.height = 4096;
    key.shadow.camera.left = key.shadow.camera.bottom = -6;
    key.shadow.camera.right = key.shadow.camera.top = 6;
    key.shadow.camera.near = 0.5; key.shadow.camera.far = 40;
    key.shadow.bias = -0.0002; key.shadow.normalBias = 0.02;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xd0e4ff, 1.2); fill.position.set(-10, 6, -3); scene.add(fill);
    const bounce = new THREE.DirectionalLight(0xfff8f0, 0.4); bounce.position.set(0, -8, 4); scene.add(bounce);
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const rim = new THREE.DirectionalLight(0xe8f4ff, 0.5); rim.position.set(-2, 3, -10); scene.add(rim);
    const gnd = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.10 }));
    gnd.rotation.x = -Math.PI / 2; gnd.position.y = -1.3; gnd.receiveShadow = true; scene.add(gnd);

    // ── Material / geometry helpers
    const S = (c, r = 0.5, m = 0.2, x = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m, ...x });
    const M = (geo, mat) => { const o = new THREE.Mesh(geo, mat); o.castShadow = true; o.receiveShadow = true; return o; };
    const B = (w, h, d, s = 2) => new THREE.BoxGeometry(w, h, d, s, s, s);
    const C = (rt, rb, h, s = 28) => new THREE.CylinderGeometry(rt, rb, h, s);
    const T = (r, t, rs = 8, ts = 32) => new THREE.TorusGeometry(r, t, rs, ts);

    // ── Housing dimensions
    const W = 2.4, H = 1.35, D = 1.55, TH = 0.092;

    // ── Build housing as separable parts (base + 4 walls + edge extras)
    function buildHousingParts() {
      const shell  = S(0x252530, 0.42, 0.45);
      const inner  = S(0x18181f, 0.75, 0.05);
      const accent = S(0xf97316, 0.28, 0.72);
      const rubber = S(0x0f0f14, 0.97, 0.0);
      const edgeS  = S(0x3c3c50, 0.25, 0.75);

      // ── BASE (floor + tray + posts + feet)
      const base = new THREE.Group();
      const floor = M(B(W, TH, D), shell); floor.position.set(0, -H/2 + TH/2, 0); base.add(floor);
      const tray = M(B(W-0.2, 0.05, D-0.2), inner); tray.position.y = -H/2 + TH + 0.025; base.add(tray);
      for (let x = -0.75; x <= 0.75; x += 0.38) {
        const ch = M(B(0.038, 0.032, D-0.25), S(0x111116, 0.85, 0.05)); ch.position.set(x, -H/2+TH+0.04, 0); base.add(ch);
      }
      [[-W/2+0.2,-H/2+TH,D/2-0.2],[W/2-0.2,-H/2+TH,D/2-0.2],[-W/2+0.2,-H/2+TH,-D/2+0.2],[W/2-0.2,-H/2+TH,-D/2+0.2]].forEach(p => {
        const boss = M(C(0.04,0.04,0.1,10), S(0x303038,0.5,0.3)); boss.position.set(...p); base.add(boss);
        const screw = M(C(0.018,0.018,0.05,8), S(0xaaa870,0.2,0.92)); screw.position.set(p[0],p[1]+0.075,p[2]); base.add(screw);
      });
      [[-W/2+0.18,-H/2-0.044,D/2-0.18],[W/2-0.18,-H/2-0.044,D/2-0.18],[-W/2+0.18,-H/2-0.044,-D/2+0.18],[W/2-0.18,-H/2-0.044,-D/2+0.18]].forEach(p => {
        const f = M(C(0.065,0.078,0.065,14), rubber); f.position.set(...p); base.add(f);
      });

      // ── LEFT WALL (group center = final world pos = (-W/2+TH/2, 0, 0))
      // Decorations in local space (relative to group center):
      //   piAp world=(-W/2+0.015, 0.06, 0.08) → local=(0.015-TH/2, 0.06, 0.08)=(-0.031, 0.06, 0.08)
      //   piFrame world=(-W/2, 0.06, 0.08) → local=(-TH/2, 0.06, 0.08)=(-0.046, 0.06, 0.08)
      const leftWall = new THREE.Group();
      leftWall.add(M(B(TH, H, D), shell));
      const piAp = M(B(0.055, 0.16, 0.24), inner); piAp.position.set(-0.031, 0.06, 0.08); leftWall.add(piAp);
      const piFrame = M(T(0.08, 0.012, 8, 20), accent); piFrame.rotation.z = Math.PI/2; piFrame.position.set(-0.046, 0.06, 0.08); leftWall.add(piFrame);

      // ── RIGHT WALL (center = (W/2-TH/2, 0, 0))
      const rightWall = new THREE.Group();
      rightWall.add(M(B(TH, H, D), shell));

      // ── BACK WALL (center = (0, 0, -D/2+TH/2))
      // vent slits: world=(-0.5+i*0.26, 0.2, -D/2+0.005) → local z = 0.005-TH/2 = -0.041
      const backWall = new THREE.Group();
      backWall.add(M(B(W, H, TH), shell));
      for (let i = 0; i < 5; i++) {
        const v = M(B(0.32, 0.028, 0.018), inner); v.position.set(-0.5+i*0.26, 0.2, -0.041); backWall.add(v);
      }

      // ── FRONT WALL (center = (0, 0, D/2-TH/2) = (0,0,0.729))
      // All decorations in local space (relative to front wall center):
      //   camRecess world z=D/2+0.03=0.805 → local z=0.805-0.729=0.076
      //   camRing   world z=D/2+0.01=0.785 → local z=0.056
      //   lensShadow world z=D/2+0.065=0.84 → local z=0.111
      //   aLine top: y=H/2-0.009=0.666, z=TH/2=0.046
      //   aBot: y=-H/2+0.009=-0.666, z=0.046
      //   plate: world=(-0.6,-0.35,D/2+0.002) → local z=0.048
      const frontWall = new THREE.Group();
      frontWall.add(M(B(W, H, TH), shell));
      const camRecess = M(B(0.52, 0.40, 0.14), inner); camRecess.position.set(0.50, 0.04, 0.076); frontWall.add(camRecess);
      const camRing = M(T(0.19, 0.018, 10, 32), accent); camRing.rotation.x = Math.PI/2; camRing.position.set(0.50, 0.04, 0.056); frontWall.add(camRing);
      const lensShadow = M(new THREE.CircleGeometry(0.17, 28), inner); lensShadow.rotation.x = Math.PI/2; lensShadow.position.set(0.50, 0.04, 0.111); frontWall.add(lensShadow);
      const aLine = M(B(W, 0.018, 0.018), accent); aLine.position.set(0, H/2-0.009, 0.046); frontWall.add(aLine);
      const aBot  = M(B(W, 0.018, 0.018), accent); aBot.position.set(0, -H/2+0.009, 0.046); frontWall.add(aBot);
      const plate = M(B(0.7, 0.14, 0.005), S(0xeeeeea, 0.85, 0.02)); plate.position.set(-0.6, -0.35, 0.048); frontWall.add(plate);

      // ── EXTRAS: edge strips (hidden until walls close)
      const extras = new THREE.Group();
      const eW = 0.03;
      [[W/2-eW/2,H/2-eW/2],[-W/2+eW/2,H/2-eW/2],[W/2-eW/2,-H/2+eW/2],[-W/2+eW/2,-H/2+eW/2]].forEach(([x,y]) => {
        const ec = M(B(eW, eW, D+0.002), edgeS); ec.position.set(x, y, 0); extras.add(ec);
      });
      extras.visible = false;

      return { base, leftWall, rightWall, backWall, frontWall, extras };
    }

    const { base: hBase, leftWall: hLeft, rightWall: hRight, backWall: hBack, frontWall: hFront, extras: hExtras } = buildHousingParts();
    scene.add(hBase, hLeft, hRight, hBack, hFront, hExtras);

    // Wall final positions (upright)
    hLeft.position.set(-W/2+TH/2, 0, 0);
    hRight.position.set(W/2-TH/2, 0, 0);
    hBack.position.set(0, 0, -D/2+TH/2);
    hFront.position.set(0, 0, D/2-TH/2);

    // Wall animation data: [group, startPos, startRot, endPos, endRot, delay]
    // Flat positions computed by rotating each wall 90° outward around its bottom edge
    // Left: pivot (-W/2, -H/2). Center rel to pivot=(TH/2,H/2). After rot.z=-PI/2: (H/2,-TH/2). World=(H/2-W/2, -H/2-TH/2)
    // Right: pivot (W/2,-H/2). Center rel=(-TH/2,H/2). After rot.z=+PI/2: (-H/2,-TH/2). World=(W/2-H/2,-H/2-TH/2)
    // Back: pivot (0,-H/2,-D/2). Center rel=(0,H/2,TH/2). After rot.x=-PI/2: (0,TH/2,-H/2). World=(0,-H/2+TH/2,-D/2-H/2)
    // Front: pivot (0,-H/2,D/2). Center rel=(0,H/2,-TH/2). After rot.x=+PI/2: (0,TH/2,H/2). World=(0,-H/2+TH/2,D/2+H/2)
    const WALLS = [
      { grp: hLeft,  sp: [H/2-W/2,  -H/2-TH/2, 0],      sr: [0, 0, -Math.PI/2], ep: [-W/2+TH/2, 0, 0],       er: [0,0,0], delay: 0.00 },
      { grp: hRight, sp: [W/2-H/2,  -H/2-TH/2, 0],      sr: [0, 0,  Math.PI/2], ep: [ W/2-TH/2, 0, 0],       er: [0,0,0], delay: 0.08 },
      { grp: hBack,  sp: [0, -H/2+TH/2, -D/2-H/2],      sr: [-Math.PI/2, 0, 0], ep: [0, 0, -D/2+TH/2],       er: [0,0,0], delay: 0.04 },
      { grp: hFront, sp: [0, -H/2+TH/2,  D/2+H/2],      sr: [ Math.PI/2, 0, 0], ep: [0, 0,  D/2-TH/2],       er: [0,0,0], delay: 0.14 },
    ];

    // Apply flat start positions
    WALLS.forEach(({ grp, sp, sr }) => { grp.position.set(...sp); grp.rotation.set(...sr); });

    // ── PCB
    function buildPCB() {
      const g = new THREE.Group();
      const pcbMat = S(0x1e6622, 0.58, 0.06), goldMat = S(0xe0aa18, 0.18, 0.92);
      const chipMat = S(0x18181e, 0.28, 0.78), silv = S(0xb8b8c4, 0.28, 0.82), creaMat = S(0xddd5b0, 0.88, 0.02);
      const board = M(B(1.82, 0.046, 1.16, 3, 1, 3), pcbMat); g.add(board);
      for (let i = 0; i < 6; i++) { const sl = M(B(1.6+Math.random()*0.1, 0.002, 0.008), creaMat); sl.position.set(-0.3+Math.random()*0.2, 0.024, -0.3+i*0.11); g.add(sl); }
      const soc = M(B(0.34, 0.036, 0.34), chipMat); soc.position.set(-0.24, 0.041, 0.02); g.add(soc);
      const hs = M(B(0.28, 0.009, 0.28), S(0x8a8870, 0.12, 0.95)); hs.position.set(-0.24, 0.066, 0.02); g.add(hs);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const b = M(C(0.007,0.007,0.012,6), goldMat); b.position.set(-0.34+c*0.055, 0.038, -0.065+r*0.055); g.add(b); }
      const ram = M(B(0.22, 0.030, 0.18), chipMat); ram.position.set(0.14, 0.038, -0.12); g.add(ram);
      const rmDot = M(new THREE.CircleGeometry(0.008,8), S(0xffffff,0.5,0)); rmDot.rotation.x=-Math.PI/2; rmDot.position.set(0.06,0.054,-0.18); g.add(rmDot);
      const wfMod = M(B(0.14, 0.018, 0.12), S(0xc8c8b8,0.25,0.80)); wfMod.position.set(0.38,0.032,0.2); g.add(wfMod);
      const ant = M(B(0.05, 0.003, 0.09), goldMat); ant.position.set(0.42,0.042,0.2); g.add(ant);
      [-0.22, 0.22].forEach(z => {
        const port=M(B(0.165,0.078,0.068),silv); port.position.set(0.91,0.062,z); g.add(port);
        const cav=M(B(0.12,0.052,0.044),S(0x444452,0.6)); cav.position.set(0.94,0.062,z); g.add(cav);
        const rim=M(B(0.005,0.078,0.068),S(0xd0d0c0,0.2,0.9)); rim.position.set(0.825,0.062,z); g.add(rim);
      });
      const eth=M(B(0.148,0.095,0.235),S(0xb8a468,0.38,0.45)); eth.position.set(0.91,0.075,0.43); g.add(eth);
      const ec=M(B(0.105,0.062,0.19),S(0x444452,0.6)); ec.position.set(0.94,0.075,0.43); g.add(ec);
      [{c:0xffaa00,z:0.32},{c:0x00ff44,z:0.52}].forEach(({c,z})=>{ const l=M(B(0.018,0.018,0.005),S(c,0.2,0,{emissive:c,emissiveIntensity:3})); l.position.set(0.9,0.095,z); g.add(l); });
      const hdmi=M(B(0.115,0.056,0.168),S(0x222228,0.5,0.42)); hdmi.position.set(-0.64,0.048,0.56); g.add(hdmi);
      const uPow=M(B(0.075,0.036,0.058),S(0x888888,0.38,0.6)); uPow.position.set(-0.84,0.038,0.56); g.add(uPow);
      const aud=M(C(0.030,0.030,0.068,14),S(0x22aacc,0.28,0.65)); aud.rotation.z=Math.PI/2; aud.position.set(-0.44,0.040,0.56); g.add(aud);
      const gpioBase=M(B(0.88,0.028,0.152),S(0x111116,0.82)); gpioBase.position.set(-0.42,0.037,-0.47); g.add(gpioBase);
      for (let col=0;col<2;col++) for(let i=0;i<13;i++){const pin=M(C(0.0078,0.0078,0.065,6),goldMat); pin.position.set(-0.81+i*0.068,0.044,-0.44+col*0.068); g.add(pin);}
      const sd=M(B(0.17,0.016,0.105),silv); sd.position.set(0.22,-0.022,-0.54); g.add(sd);
      [{c:0x00ff55,x:0.70,z:-0.39},{c:0xff4400,x:0.59,z:-0.39}].forEach(({c,x,z})=>{const l=M(new THREE.SphereGeometry(0.016,10,10),S(c,0.2,0,{emissive:c,emissiveIntensity:3.5})); l.position.set(x,0.038,z); g.add(l);});
      for(let i=0;i<18;i++){const tr=M(B(0.35+Math.random()*0.8,0.0028,0.007),goldMat); tr.position.set(-0.5+Math.random()*0.9,0.024,-0.38+i*0.045); g.add(tr);}
      [[0.3,0,-0.32],[0.55,0,0.08],[-0.5,0,0.28],[0.15,0,0.34]].forEach(([x,,z])=>{
        const cap=M(C(0.022,0.022,0.055,10),S(0x1a1a1a,0.55,0.15)); cap.position.set(x,0.05,z); g.add(cap);
        const ct=M(new THREE.CircleGeometry(0.019,10),S(0x888870,0.2,0.8)); ct.rotation.x=-Math.PI/2; ct.position.set(x,0.078,z); g.add(ct);
      });
      [[-0.82,0,0.50],[0.82,0,0.50],[-0.82,0,-0.50],[0.82,0,-0.50]].forEach(p=>{const h=M(C(0.030,0.030,0.052,12),S(0xf0edd0,0.9,0)); h.position.set(...p); g.add(h);});
      return g;
    }

    function buildAccelerometer() {
      const g = new THREE.Group();
      const pcb=S(0x1a44cc,0.58,0.08), gold=S(0xe0aa18,0.18,0.92), chip=S(0x18181e,0.28,0.78);
      const sub=M(B(0.38,0.014,0.30),pcb); g.add(sub);
      const silk=M(B(0.28,0.002,0.08),S(0xeeeeee,0.9,0)); silk.position.set(0,0.008,-0.06); g.add(silk);
      const ic=M(B(0.155,0.035,0.155),chip); ic.position.set(0.02,0.025,0.02); g.add(ic);
      const mDot=M(new THREE.CircleGeometry(0.01,8),S(0xffffff,0.5,0)); mDot.rotation.x=-Math.PI/2; mDot.position.set(-0.04,0.044,-0.04); g.add(mDot);
      for(let i=0;i<4;i++){const side=[[0.08,0,0.02],[-0.04,0,0.1],[-0.08,0,0.02],[-0.04,0,-0.06]]; const pad=M(B(0.026,0.003,0.008),gold); pad.position.set(side[i][0]+0.02,0.045,side[i][2]+0.02); g.add(pad);}
      [[-0.1,0.05,0.08],[0.12,0.05,-0.08],[0.13,0.05,0.1]].forEach(p=>{const c=M(B(0.025,0.022,0.018),S(0xddaa20,0.4,0.25)); c.position.set(...p); g.add(c);});
      for(let i=0;i<6;i++){const pin=M(C(0.008,0.008,0.068,6),gold); pin.position.set(-0.13+i*0.052,0.022,-0.13); g.add(pin);}
      [[-0.16,0,0.12],[0.16,0,0.12],[-0.16,0,-0.12],[0.16,0,-0.12]].forEach(p=>{const h=M(C(0.016,0.016,0.018,8),S(0xf0edd0,0.9,0)); h.position.set(...p); g.add(h);});
      const fpc=M(B(0.09,0.010,0.105),S(0xf5c020,0.5,0.1)); fpc.position.set(0.08,0.004,0.20); g.add(fpc);
      return g;
    }

    function buildEdgeProcessor() {
      const g = new THREE.Group();
      const body=S(0x18204a,0.38,0.52), silv=S(0xc0c0c8,0.18,0.88), grn=S(0x228822,0.45,0.2);
      const enc=M(B(0.65,0.24,0.48),body); g.add(enc);
      for(let i=-0.2;i<=0.2;i+=0.05){const fin=M(B(0.60,0.072,0.018),silv); fin.position.set(0,0.156,i); g.add(fin);}
      const hBase=M(B(0.60,0.014,0.46),S(0xd0d0c8,0.2,0.85)); hBase.position.y=0.127; g.add(hBase);
      const face=M(B(0.004,0.22,0.46),S(0x222848,0.4,0.5)); face.position.x=0.328; g.add(face);
      const lbl=M(B(0.006,0.095,0.38),S(0xeeeeea,0.88,0.02)); lbl.position.set(0.332,0,0); g.add(lbl);
      [{c:0x00ff55},{c:0xffaa00},{c:0xff3333}].forEach(({c},i)=>{
        const led=M(new THREE.SphereGeometry(0.013,10,10),S(c,0.2,0,{emissive:c,emissiveIntensity:3})); led.position.set(0.335,0.075,-0.1+i*0.1); g.add(led);
        const lr=M(T(0.018,0.004,6,14),S(0x333340,0.4,0.5)); lr.rotation.y=Math.PI/2; lr.position.set(0.335,0.075,-0.1+i*0.1); g.add(lr);
      });
      const term=M(B(0.24,0.115,0.058),grn); term.position.set(0.04,0.005,0.27); g.add(term);
      for(let i=-0.08;i<=0.08;i+=0.08){
        const sc=M(C(0.014,0.014,0.062,8),S(0xb0a060,0.18,0.92)); sc.rotation.x=Math.PI/2; sc.position.set(i,0.04,0.3); g.add(sc);
        const sl=M(B(0.002,0.018,0.014),S(0x333330,0.5,0.3)); sl.rotation.x=Math.PI/2; sl.position.set(i,0.04,0.333); g.add(sl);
      }
      const eth=M(B(0.044,0.082,0.175),S(0xaaa860,0.35,0.55)); eth.position.set(0.35,0.008,0.04); g.add(eth);
      const ec=M(B(0.025,0.055,0.138),S(0x444452,0.6)); ec.position.set(0.366,0.008,0.04); g.add(ec);
      const din=M(B(0.60,0.052,0.118),S(0x8888a0,0.28,0.72)); din.position.y=-0.146; g.add(din);
      const notch=M(B(0.16,0.052,0.045),S(0x111116,0.8,0.1)); notch.position.set(0,-0.146,0); g.add(notch);
      const pwr=M(C(0.025,0.025,0.058,14),S(0x333338,0.5,0.3)); pwr.rotation.z=Math.PI/2; pwr.position.set(0.355,-0.06,-0.14); g.add(pwr);
      const pwrPin=M(C(0.008,0.008,0.06,8),S(0xe0aa18,0.18,0.92)); pwrPin.rotation.z=Math.PI/2; pwrPin.position.set(0.385,-0.06,-0.14); g.add(pwrPin);
      return g;
    }

    function buildWifiAntenna() {
      const g = new THREE.Group();
      const puck=M(C(0.175,0.175,0.048,28),S(0x222228,0.55,0.32)); g.add(puck);
      const topRing=M(C(0.155,0.155,0.006,28),S(0xc8c8c0,0.15,0.88)); topRing.position.y=0.027; g.add(topRing);
      const inner=M(C(0.11,0.11,0.008,24),S(0x111116,0.95,0.02)); inner.position.y=0.028; g.add(inner);
      const sRing=M(T(0.155,0.007,8,28),S(0xaaaaaa,0.2,0.88)); sRing.position.y=0.026; g.add(sRing);
      const boot=M(C(0.036,0.032,0.038,14),S(0x111116,0.9,0.05)); boot.position.y=0.043; g.add(boot);
      const stub=M(C(0.022,0.030,0.36,14),S(0x1e1e24,0.6,0.28)); stub.position.y=0.232; g.add(stub);
      for(let i=0;i<5;i++){const tr=M(T(0.031,0.003,6,14),S(0xaaaaaa,0.2,0.85)); tr.position.y=0.05+i*0.012; g.add(tr);}
      const tip=M(new THREE.SphereGeometry(0.026,14,14),S(0x2a2a30,0.5,0.3)); tip.position.y=0.414; g.add(tip);
      const cable=M(C(0.018,0.018,0.62,10),S(0x0a0a0e,0.88,0.04)); cable.rotation.x=Math.PI/2; cable.position.set(0,0.005,-0.36); g.add(cable);
      const braid=M(C(0.022,0.020,0.08,10),S(0xb8b8a8,0.3,0.8)); braid.rotation.x=Math.PI/2; braid.position.set(0,0.005,-0.28); g.add(braid);
      const sma=M(C(0.030,0.030,0.078,14),S(0xe0b020,0.18,0.92)); sma.rotation.x=Math.PI/2; sma.position.set(0,0.005,-0.66); g.add(sma);
      for(let i=0;i<6;i++){const kr=M(T(0.033,0.0038,6,14),S(0xc89e10,0.25,0.9)); kr.rotation.y=Math.PI/2; kr.position.set(0,0.005,-0.635+i*0.013); g.add(kr);}
      const cPin=M(C(0.006,0.006,0.06,8),S(0xe0b020,0.15,0.95)); cPin.rotation.x=Math.PI/2; cPin.position.set(0,0.005,-0.71); g.add(cPin);
      return g;
    }

    function buildBuzzerSet() {
      const g = new THREE.Group();
      [[-0.24,0,0],[0,0,0.24],[0.24,0,-0.09]].forEach(off=>{
        const bg=new THREE.Group();
        const body=M(C(0.112,0.112,0.082,24),S(0x1a1a22,0.52,0.38)); bg.add(body);
        const fm=M(C(0.098,0.098,0.005,24),S(0x28282e,0.6,0.18)); fm.position.y=0.044; bg.add(fm);
        [[0.078,0.006,0x303038],[0.055,0.005,0x383840],[0.032,0.004,0x404048]].forEach(([r,t,c])=>{
          const gr=M(T(r,t,7,24),S(c,0.45,0.28)); gr.position.y=0.044; gr.rotation.x=Math.PI/2; bg.add(gr);
        });
        const dome=M(new THREE.SphereGeometry(0.022,14,8,0,Math.PI*2,0,Math.PI/2),S(0x484850,0.38,0.22)); dome.position.y=0.047; bg.add(dome);
        const chamf=M(T(0.11,0.008,8,24),S(0x2e2e38,0.35,0.55)); chamf.position.y=-0.042; chamf.rotation.x=Math.PI/2; bg.add(chamf);
        const flange=M(B(0.285,0.022,0.098),S(0x525260,0.35,0.65)); flange.position.y=-0.052; bg.add(flange);
        [-0.11,0.11].forEach(x=>{
          const hole=M(C(0.016,0.016,0.025,10),S(0x7a7a8a,0.28,0.75)); hole.position.set(x,-0.052,0); bg.add(hole);
          const sc=M(C(0.024,0.024,0.010,10),S(0xb0a860,0.22,0.88)); sc.position.set(x,-0.04,0); bg.add(sc);
        });
        const rw=M(C(0.0095,0.0095,0.34,8),S(0xcc2020,0.6,0.04)); rw.position.set(0.058,0.21,0); rw.rotation.z=0.26; bg.add(rw);
        const rb=M(C(0.014,0.011,0.028,8),S(0x111116,0.9,0.02)); rb.position.set(0.065,0.042,0); bg.add(rb);
        const bw=M(C(0.0095,0.0095,0.34,8),S(0x0a0a0e,0.72,0.04)); bw.position.set(-0.058,0.21,0); bw.rotation.z=-0.26; bg.add(bw);
        const bb=M(C(0.014,0.011,0.028,8),S(0x111116,0.9,0.02)); bb.position.set(-0.065,0.042,0); bg.add(bb);
        bg.position.set(...off); g.add(bg);
      });
      return g;
    }

    // ── Varifocal camera: barrel along +Z, final pos puts lens through front face camRecess
    // lens at local z=0.540; final pos z=0.31 → lens world z=0.85 (through front face at z=0.729)
    function buildCamera() {
      const g = new THREE.Group();
      const darkMat=S(0x24242c,0.52,0.42), pcbGrn=S(0x1e6622,0.58,0.06);
      const box1=M(B(0.21,0.19,0.215),darkMat); box1.position.z=-0.055; g.add(box1);
      const pcbBack=M(B(0.17,0.15,0.005),pcbGrn); pcbBack.position.z=-0.163; g.add(pcbBack);
      const usb=M(B(0.045,0.038,0.062),S(0x888888,0.35,0.75)); usb.position.set(0,-0.04,-0.165); g.add(usb);
      const usbCav=M(B(0.032,0.025,0.042),S(0x444452,0.6)); usbCav.position.set(0,-0.04,-0.166); g.add(usbCav);
      const bolt=M(C(0.015,0.015,0.025,10),S(0x888870,0.2,0.9)); bolt.rotation.z=Math.PI/2; bolt.position.set(0.112,0.065,-0.055); g.add(bolt);
      const flange=M(C(0.098,0.104,0.018,24),S(0x1e1e24,0.45,0.55)); flange.rotation.x=Math.PI/2; flange.position.z=0.06; g.add(flange);
      const bar1=M(C(0.092,0.100,0.16,24),S(0x1a1a22,0.48,0.48)); bar1.rotation.x=Math.PI/2; bar1.position.z=0.185; g.add(bar1);
      const zRing=M(C(0.100,0.100,0.072,24),S(0x323240,0.42,0.38)); zRing.rotation.x=Math.PI/2; zRing.position.z=0.11; g.add(zRing);
      for(let i=0;i<20;i++){const kn=M(B(0.0038,0.0038,0.072),S(0x464654,0.6,0.3)); const a=(i/20)*Math.PI*2; kn.position.set(Math.cos(a)*0.100,Math.sin(a)*0.100,0.11); g.add(kn);}
      const bar2=M(C(0.076,0.088,0.20,24),S(0x181820,0.44,0.52)); bar2.rotation.x=Math.PI/2; bar2.position.z=0.365; g.add(bar2);
      const fRing=M(C(0.082,0.082,0.058,24),S(0x2e2e3c,0.38,0.42)); fRing.rotation.x=Math.PI/2; fRing.position.z=0.28; g.add(fRing);
      for(let i=0;i<8;i++){const mk=M(B(0.0025,0.025,0.003),S(0xddddcc,0.9,0)); const a=(i/8)*Math.PI*2; mk.position.set(Math.cos(a)*0.082,Math.sin(a)*0.082,0.31); g.add(mk);}
      const bar3=M(C(0.068,0.074,0.07,24),S(0x111118,0.42,0.55)); bar3.rotation.x=Math.PI/2; bar3.position.z=0.500; g.add(bar3);
      const fBezel=M(T(0.070,0.010,8,24),S(0xb0b0c0,0.18,0.88)); fBezel.rotation.x=Math.PI/2; fBezel.position.z=0.538; g.add(fBezel);
      const glass=M(new THREE.CircleGeometry(0.062,28),S(0x0a1e38,0.04,0.96,{emissive:0x001428,emissiveIntensity:0.7})); glass.rotation.x=Math.PI/2; glass.position.z=0.540; g.add(glass);
      const hilight=M(new THREE.CircleGeometry(0.022,16),S(0x2255aa,0.04,0.96,{emissive:0x1133aa,emissiveIntensity:0.9})); hilight.rotation.x=Math.PI/2; hilight.position.z=0.542; g.add(hilight);
      const cable=M(C(0.017,0.017,0.6,10),S(0x0a0a0e,0.88,0.04)); cable.position.set(0.06,-0.2,-0.24); cable.rotation.z=0.38; g.add(cable);
      return g;
    }

    function buildPiCamera() {
      const g = new THREE.Group();
      const pcb=S(0x1e6622,0.58,0.06), gold=S(0xe0aa18,0.18,0.92), chip=S(0x18181e,0.28,0.78);
      const board=M(B(0.235,0.014,0.30,2,1,2),pcb); g.add(board);
      const ic=M(B(0.112,0.020,0.112),chip); ic.position.set(0,0.017,0.02); g.add(ic);
      const die=M(B(0.065,0.004,0.065),S(0x0a0a14,0.2,0.5)); die.position.set(0,0.029,0.02); g.add(die);
      for(let i=0;i<5;i++){const pad=M(B(0.012,0.003,0.005),gold); pad.position.set(-0.04+i*0.02,0.024,0.075); g.add(pad);}
      const lMount=M(C(0.032,0.036,0.028,16),S(0x1a1a22,0.5,0.45)); lMount.position.set(0,0.031,0.02); g.add(lMount);
      const lBody=M(C(0.026,0.028,0.022,16),S(0x111118,0.42,0.52)); lBody.position.set(0,0.052,0.02); g.add(lBody);
      const lGlass=M(new THREE.CircleGeometry(0.020,14),S(0x0a1e38,0.04,0.96,{emissive:0x001020,emissiveIntensity:0.6})); lGlass.position.set(0,0.064,0.02); g.add(lGlass);
      const lRing=M(T(0.024,0.004,7,16),S(0x444450,0.35,0.5)); lRing.position.set(0,0.063,0.02); g.add(lRing);
      [[0.08,0.007,0.1],[-0.08,0.007,-0.1],[0.09,0.007,-0.05]].forEach(([x,y,z])=>{const c=M(B(0.024,0.018,0.016),S(0xddaa20,0.4,0.28)); c.position.set(x,y,z); g.add(c);});
      [[-0.06,0.006,0.1],[0.06,0.006,0.1]].forEach(([x,y,z])=>{
        const r=M(B(0.020,0.012,0.010),S(0x444438,0.6,0.1)); r.position.set(x,y,z); g.add(r);
        const stripe=M(B(0.002,0.014,0.012),S(0xc8a020,0.5,0.5)); stripe.position.set(x-0.004,y,z); g.add(stripe);
      });
      const fpc=M(B(0.058,0.006,0.5),S(0xf5c020,0.48,0.12)); fpc.position.set(0.015,-0.003,-0.36); g.add(fpc);
      const zif=M(B(0.072,0.014,0.055),S(0xddbb44,0.4,0.3)); zif.position.set(0.015,0.004,-0.115); g.add(zif);
      [[-0.1,0,0.13],[0.1,0,0.13],[-0.1,0,-0.13],[0.1,0,-0.13]].forEach(p=>{const h=M(C(0.018,0.018,0.018,10),S(0xf0edd0,0.9,0)); h.position.set(...p); g.add(h);});
      return g;
    }

    const pcb       = buildPCB();
    const accel     = buildAccelerometer();
    const edgeProc  = buildEdgeProcessor();
    const wifi      = buildWifiAntenna();
    const buzzers   = buildBuzzerSet();
    const varifocal = buildCamera();
    const piCam     = buildPiCamera();
    scene.add(pcb, accel, edgeProc, wifi, buzzers, varifocal, piCam);

    // ── Assembly sequence
    // varifocal: rotation [0,0,0] so barrel faces +Z, lens at local z=0.54 → world z=0.31+0.54=0.85 (through camRecess)
    const PIECES = [
      { obj: pcb,       key:"pcb",       name:"Raspberry Pi 3B+",       final:{p:[0,-0.44,0.02],        r:[0,0,0]},            start:{p:[0,-6.5,0.3],         r:[0,0.4,0]}           },
      { obj: edgeProc,  key:"edgeProc",  name:"Edge Processor",          final:{p:[-0.58,-0.08,-0.12],   r:[0,0,0]},            start:{p:[-7,0.6,-0.12],       r:[0,-0.6,0]}          },
      { obj: accel,     key:"accel",     name:"3-Axis Accelerometer",    final:{p:[0.48,0.12,0.22],       r:[0,0,0]},            start:{p:[6,3.5,1.2],          r:[0,0.8,0.4]}         },
      { obj: wifi,      key:"wifi",      name:"WiFi Antenna",            final:{p:[0.18,-0.30,0.40],      r:[0,0,0]},            start:{p:[1.5,-6,3.8],         r:[0.5,0,0]}           },
      { obj: buzzers,   key:"buzzers",   name:"100dB Buzzers x3",        final:{p:[-0.62,0.24,0.08],      r:[0,-0.25,0]},        start:{p:[-6.5,4.5,0.8],       r:[0,-0.5,0.3]}        },
      { obj: varifocal, key:"varifocal", name:"1080p Varifocal Camera",  final:{p:[0.50,0.04,0.31],       r:[0,0,0]},            start:{p:[0.50,2.8,5.5],       r:[0.4,0.05,0.06]}     },
      { obj: piCam,     key:"piCam",     name:"Pi Camera Module",        final:{p:[-1.06,0.07,0.09],      r:[0,Math.PI/2,0]},    start:{p:[-6.5,3.5,0.9],       r:[0.25,Math.PI/2-0.5,0]} },
    ];

    PIECES.forEach(({ obj, start }) => { obj.position.set(...start.p); obj.rotation.set(...start.r); });

    const PAIR_GAP = 0.85, PIECE_DURATION = 1.6;
    const PAIRS = [[0,1],[2,3],[4,5],[6]];
    PIECES.forEach((p, i) => {
      const pairIdx = PAIRS.findIndex(pair => pair.includes(i));
      p.delay = pairIdx * PAIR_GAP + PAIRS[pairIdx].indexOf(i) * 0.15;
    });

    const TOTAL_ANIM  = PAIRS.length * PAIR_GAP + PIECE_DURATION; // ~5.0s
    const CLOSE_DUR   = 1.4;  // walls fold up
    const HOLD        = 1.6;
    const EXPLODE_DUR = 0.9;
    const PAUSE_BEFORE_REVEAL = 0.25;
    const REVEAL_DUR  = 2.2;

    const EXPLODE = [
      { p:[0,-8,0],    r:[0,0.4,0] },
      { p:[-8,0.6,-1], r:[0,-0.6,0] },
      { p:[7,4,2],     r:[0,0.8,0.4] },
      { p:[2,-7,4],    r:[0.5,0,0] },
      { p:[-7,5,1],    r:[0,-0.5,0.3] },
      { p:[1.0,2.5,8], r:[0.4,0.1,0.1] }, // varifocal flies out front
      { p:[-7,4,1],    r:[0.3,Math.PI/2-0.5,0] },
    ];

    // Progress dots
    const dotEls = PIECES.map(() => {
      const d = document.createElement("div");
      d.style.cssText = "width:6px;height:6px;border-radius:50%;background:#ccc;transition:background 0.5s,transform 0.5s;flex-shrink:0;";
      dotsEl.appendChild(d); return d;
    });

    // ── Easing
    function easeOutQuint(t) { return 1 - Math.pow(1-t, 5); }
    function easeInQuint(t)  { return t*t*t*t*t; }
    // Slight overshoot for wall closing (mechanical feel)
    function easeOutBack(t) {
      const c1 = 1.5, c3 = c1 + 1;
      return 1 + c3 * Math.pow(t-1, 3) + c1 * Math.pow(t-1, 2);
    }
    function lerp(a, b, t) { return a + (b-a)*t; }

    // ── State
    let et = 0, phaseT = 0, phase = "assembling";
    let sceneRotY = 0, idleT = 0, camTargetY = 2.8;
    let prevTime = performance.now() / 1000;

    // ── Title helpers (unchanged)
    function triggerTitleIntro() {
      titleWrap.style.animation = "none";
      titleWrap.classList.remove("bgh-slide-in");
      brandWord.classList.remove("bgh-pop");
      brandSub.classList.remove("bgh-show");
      brandWord.style.transform = "translateY(56px)"; brandWord.style.opacity = "0";
      void titleWrap.offsetWidth;
      setTimeout(() => { titleWrap.style.animation = ""; titleWrap.classList.add("bgh-slide-in"); }, 200);
      setTimeout(() => brandWord.classList.add("bgh-pop"), 1000);
      setTimeout(() => brandSub.classList.add("bgh-show"), 1550);
    }
    function hideTitleBar() {
      titleWrap.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      titleWrap.style.opacity = "0"; titleWrap.style.transform = "translateX(-50%) translateY(-40px)";
    }
    function resetTitleBar() {
      titleWrap.style.transition = "none"; titleWrap.style.opacity = "0";
      titleWrap.style.transform = "translateX(-50%) translateY(-80px)";
    }
    function triggerReveal() {
      revealWrap.style.opacity = "1"; revealWord.classList.remove("bgh-big-pop"); revealSub.classList.remove("bgh-show");
      revealWord.style.transform = "translateY(140px)"; revealWord.style.opacity = "0";
      revealWrap.classList.add("bgh-reveal-show");
      setTimeout(() => revealWord.classList.add("bgh-big-pop"), 100);
      setTimeout(() => revealSub.classList.add("bgh-show"), 780);
    }
    function hideReveal() {
      revealWrap.style.opacity = "0"; revealWrap.classList.remove("bgh-reveal-show");
      revealWord.classList.remove("bgh-big-pop"); revealSub.classList.remove("bgh-show");
    }

    function resetWalls() {
      WALLS.forEach(({ grp, sp, sr }) => { grp.position.set(...sp); grp.rotation.set(...sr); });
      hExtras.visible = false;
    }

    function finalizeWalls() {
      WALLS.forEach(({ grp, ep, er }) => { grp.position.set(...ep); grp.rotation.set(...er); });
      hExtras.visible = true;
    }

    function resetCycle() {
      et = 0; phaseT = 0; phase = "assembling"; sceneRotY = 0; idleT = 0;
      hideReveal(); resetTitleBar(); resetWalls();
      PIECES.forEach(({ obj, start }) => { obj.position.set(...start.p); obj.rotation.set(...start.r); });
      dotEls.forEach(d => { d.style.background = "#ccc"; d.style.transform = "scale(1)"; });
      setTimeout(triggerTitleIntro, 80);
    }

    triggerTitleIntro();

    // ── Scroll lock
    let hasScrolledAway = false, lockedToReveal = false;
    function lockToReveal() {
      if (lockedToReveal) return; lockedToReveal = true; phase = "locked";
      const allObjs = [hBase, hLeft, hRight, hBack, hFront, hExtras, ...PIECES.map(p => p.obj)];
      allObjs.forEach(obj => obj.traverse(c => { if (c.isMesh && c.material) { c.material.transparent = true; c.material.opacity = 0; } }));
      hideTitleBar();
      revealWrap.style.opacity = "1"; revealWrap.classList.add("bgh-reveal-show");
      revealWord.style.transform = "translateY(0)"; revealWord.style.opacity = "1";
      revealSub.classList.add("bgh-show");
    }
    function onScroll() {
      if (window.scrollY > 80) hasScrolledAway = true;
      if (hasScrolledAway && window.scrollY < 40 && !lockedToReveal) lockToReveal();
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Animation loop
    let animId;
    function tick() {
      animId = requestAnimationFrame(tick);
      const now = performance.now() / 1000;
      const dt = Math.min(now - prevTime, 0.035); prevTime = now;

      if (lockedToReveal) { renderer.render(scene, camera); return; }

      et += dt; phaseT += dt;

      // ── Phase transitions
      if (phase === "assembling" && phaseT >= TOTAL_ANIM) {
        phase = "closing"; phaseT = 0;
        hExtras.visible = true; // edge strips appear as walls close
      }
      if (phase === "closing" && phaseT >= CLOSE_DUR) {
        phase = "holding"; phaseT = 0; idleT = 0;
        finalizeWalls();
      }
      if (phase === "holding" && phaseT >= HOLD) {
        phase = "exploding"; phaseT = 0; hideTitleBar();
      }
      if (phase === "exploding" && phaseT >= EXPLODE_DUR + PAUSE_BEFORE_REVEAL) {
        phase = "revealing"; phaseT = 0; triggerReveal();
      }
      if (phase === "revealing" && phaseT >= REVEAL_DUR) { resetCycle(); return; }

      // ── Animate wall closing
      if (phase === "closing") {
        WALLS.forEach(({ grp, sp, sr, ep, er, delay }) => {
          const localT = Math.max(0, Math.min(1, (phaseT - delay) / (CLOSE_DUR * 0.85)));
          const ease = easeOutBack(localT);
          grp.position.set(lerp(sp[0],ep[0],ease), lerp(sp[1],ep[1],ease), lerp(sp[2],ep[2],ease));
          grp.rotation.set(lerp(sr[0],er[0],ease), lerp(sr[1],er[1],ease), lerp(sr[2],er[2],ease));
        });
      }
      // Keep walls flat during assembly
      if (phase === "assembling") {
        WALLS.forEach(({ grp, sp, sr }) => { grp.position.set(...sp); grp.rotation.set(...sr); });
      }

      // ── Animate interior pieces
      PIECES.forEach(({ obj, start, final, delay }, i) => {
        if (phase === "assembling" || phase === "holding" || phase === "closing") {
          const t01 = Math.max(0, Math.min(1, (et - delay) / PIECE_DURATION));
          const ease = easeOutQuint(t01);
          obj.position.set(lerp(start.p[0],final.p[0],ease), lerp(start.p[1],final.p[1],ease), lerp(start.p[2],final.p[2],ease));
          obj.rotation.set(lerp(start.r[0],final.r[0],ease), lerp(start.r[1],final.r[1],ease), lerp(start.r[2],final.r[2],ease));
          if (t01 > 0.04) { dotEls[i].style.background = "#111"; dotEls[i].style.transform = "scale(1.35)"; }
        }
        if (phase === "exploding" || phase === "revealing") {
          const ex = EXPLODE[i];
          const t01 = Math.max(0, Math.min(1, phaseT / EXPLODE_DUR));
          const ease = easeInQuint(t01);
          obj.position.set(lerp(final.p[0],ex.p[0],ease), lerp(final.p[1],ex.p[1],ease), lerp(final.p[2],ex.p[2],ease));
          obj.rotation.set(lerp(final.r[0],ex.r[0],ease), lerp(final.r[1],ex.r[1],ease), lerp(final.r[2],ex.r[2],ease));
        }
      });

      // ── Opacity for housing + pieces
      const allObjs = [hBase, hLeft, hRight, hBack, hFront, hExtras, ...PIECES.map(p => p.obj)];
      if (phase === "exploding") {
        const opacity = lerp(1, 0, easeInQuint(Math.min(phaseT / EXPLODE_DUR, 1)));
        allObjs.forEach(obj => obj.traverse(c => { if (c.isMesh && c.material) { c.material.transparent = true; c.material.opacity = opacity; } }));
      } else if (phase === "revealing") {
        allObjs.forEach(obj => obj.traverse(c => { if (c.isMesh && c.material) { c.material.transparent = true; c.material.opacity = 0; } }));
      } else {
        allObjs.forEach(obj => obj.traverse(c => { if (c.isMesh && c.material) { c.material.transparent = false; c.material.opacity = 1; } }));
      }

      // ── Scene rotation
      if (phase === "holding") { idleT += dt; sceneRotY = lerp(sceneRotY, Math.sin(idleT * 0.22) * 0.28, 0.014); }
      else if (phase === "exploding") { sceneRotY = lerp(sceneRotY, sceneRotY + 0.008, 0.1); }
      else { sceneRotY = lerp(sceneRotY, 0, 0.025); }
      scene.rotation.y = sceneRotY;

      camTargetY = 2.8 + Math.sin(et * 0.2) * 0.05;
      camera.position.y = lerp(camera.position.y, camTargetY, 0.03);
      renderer.render(scene, camera);
    }
    tick();

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      while (dotsEl && dotsEl.firstChild) dotsEl.removeChild(dotsEl.firstChild);
      renderer.dispose();
    };
  }, []);

  return (
    <section style={{ height: "100vh", width: "100%", position: "relative", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9 }}>
        <div ref={titleWrapRef} className="bgh-title-wrap">
          <div style={{ overflow: "hidden", lineHeight: 1.1, paddingBottom: 4 }}>
            <span ref={brandWordRef} className="bgh-brand-word">BusGuard</span>
          </div>
          <span ref={brandSubRef} className="bgh-brand-sub">Intelligent Bus Safety System</span>
        </div>
        <div ref={dotsRef} style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7, alignItems: "center" }} />
        <div ref={revealWrapRef} className="bgh-reveal-wrap">
          <div style={{ overflow: "hidden", lineHeight: 1.05, paddingBottom: 8 }}>
            <span ref={revealWordRef} className="bgh-reveal-word">BUSGUARD</span>
          </div>
          <span ref={revealSubRef} className="bgh-reveal-sub">School Bus Safety, Reimagined</span>
        </div>
      </div>
    </section>
  );
}
