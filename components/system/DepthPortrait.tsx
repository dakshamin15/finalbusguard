"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motionOK } from "@/lib/motion";

/*
 * A portrait that comes alive on hover.
 *  1. Focus pull: the frame starts soft and monochrome, then racks into focus, color
 *     floods in, and the lens pushes in slightly (~0.75s).
 *  2. Depth parallax: a per-photo depth map (generated offline with Depth Anything V2)
 *     shifts near pixels against far ones as the cursor moves, so the subject separates
 *     from the background like a 3D photo. Background keeps a touch of portrait-mode blur.
 * Raw WebGL, renders only while something is changing. Falls back to the plain image.
 */

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_img;
uniform sampler2D u_depth;
uniform vec2 u_mouse;
uniform float u_focus;
uniform float u_scale;
uniform float u_imgAspect;
uniform float u_blur;

vec2 cover(vec2 uv) {
  // Square canvas, object-cover the image (keep the top of the frame: faces sit high).
  if (u_imgAspect > 1.0) uv.x = (uv.x - 0.5) / u_imgAspect + 0.5;
  else uv.y = (uv.y - 0.5) * u_imgAspect + 0.5;
  return uv;
}

void main() {
  vec2 uv = cover(v_uv);
  uv = (uv - 0.5) / u_scale + 0.5;

  // Depth parallax with one refinement step (reduces stretching at edges).
  float strength = 0.036;
  float d = texture2D(u_depth, uv).r;
  vec2 off = u_mouse * (d - 0.5) * strength;
  d = texture2D(u_depth, uv + off).r;
  off = u_mouse * (d - 0.5) * strength;
  vec2 suv = uv + off;

  // Lens focus (driven by an autofocus "hunt" curve) + light portrait-mode bokeh once settled.
  float bg = smoothstep(0.55, 0.2, d);
  float radius = max(u_blur, 0.0035 * bg * u_focus);
  vec3 col = vec3(0.0);
  float wsum = 0.0;
  for (int i = 0; i < 12; i++) {
    float a = float(i) * 0.5236;
    vec2 o = vec2(cos(a), sin(a)) * radius;
    float w = 1.0;
    col += texture2D(u_img, suv + o).rgb * w;
    col += texture2D(u_img, suv + o * 0.5).rgb * w;
    wsum += 2.0 * w;
  }
  col += texture2D(u_img, suv).rgb * 2.0;
  wsum += 2.0;
  col /= wsum;

  // Monochrome to color, with a slight warm lift as it lands.
  float g = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(g), col, u_focus);
  col *= mix(0.92, 1.03, u_focus);

  // Gentle lens vignette.
  float vig = smoothstep(0.85, 0.35, length(v_uv - 0.5));
  col *= mix(0.86, 1.0, vig);

  gl_FragColor = vec4(col, 1.0);
}`;

type Props = { src: string; depth: string; alt: string; sizes: string; className?: string };

export default function DepthPortrait({ src, depth, alt, sizes, className = "" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const c = canvas.current;
    const w = wrap.current;
    if (!c || !w || !motionOK()) return;
    const gl = c.getContext("webgl", { antialias: false, premultipliedAlpha: false, alpha: true });
    if (!gl) return;

    const sh = (type: number, srcText: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, srcText);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uMouse = U("u_mouse"), uFocus = U("u_focus"), uScale = U("u_scale"), uAspect = U("u_imgAspect"), uBlur = U("u_blur");

    const load = (url: string, unit: number) =>
      new Promise<HTMLImageElement>((res, rej) => {
        const im = new window.Image();
        im.onload = () => {
          const t = gl.createTexture();
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, t);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
          res(im);
        };
        im.onerror = rej;
        im.src = url;
      });

    // State
    let focus = 0, focusT = 0, scale = 1, scaleT = 1;
    let mx = 0, my = 0, tx = 0, ty = 0;
    let raf = 0, alive = true;
    const REST_BLUR = 0.0045;
    let blur = REST_BLUR, huntStart = -1;
    // Autofocus hunt: overshoot soft, snap sharp, small correction, settle (seconds -> blur radius).
    const HUNT: [number, number][] = [[0, REST_BLUR], [0.1, 0.013], [0.32, 0.0], [0.44, 0.0032], [0.6, 0.0]];
    const hunt = (t: number) => {
      for (let i = 1; i < HUNT.length; i++) {
        if (t <= HUNT[i][0]) {
          const [t0, v0] = HUNT[i - 1];
          const [t1, v1] = HUNT[i];
          const k = (t - t0) / (t1 - t0);
          const e = k * k * (3 - 2 * k);
          return v0 + (v1 - v0) * e;
        }
      }
      return 0;
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = c.getBoundingClientRect();
      c.width = Math.max(1, Math.round(r.width * dpr));
      c.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, c.width, c.height);
    };

    const frame = () => {
      raf = 0;
      // Focus pull eases quickly in, a little slower out.
      const k = focusT > focus ? 0.085 : 0.06;
      focus += (focusT - focus) * k;
      scale += (scaleT - scale) * 0.07;
      mx += (tx - mx) * 0.09;
      my += (ty - my) * 0.09;
      let hunting = false;
      if (huntStart >= 0) {
        const t = (performance.now() - huntStart) / 1000;
        blur = hunt(t);
        hunting = t < 0.62;
      } else {
        blur += (REST_BLUR - blur) * 0.06;
      }
      gl.uniform1f(uBlur, blur);
      gl.uniform1f(uFocus, focus);
      gl.uniform1f(uScale, scale);
      gl.uniform2f(uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      const moving = hunting || Math.abs(REST_BLUR - blur) > 0.0002 && huntStart < 0 || Math.abs(focusT - focus) > 0.002 || Math.abs(scaleT - scale) > 0.0005 || Math.abs(tx - mx) > 0.002 || Math.abs(ty - my) > 0.002;
      if (moving && alive) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const enter = () => {
      huntStart = performance.now();
      focusT = 1;
      scaleT = 1.07;
      kick();
    };
    const leave = () => {
      huntStart = -1;
      focusT = 0;
      scaleT = 1;
      tx = 0;
      ty = 0;
      kick();
    };
    const move = (e: PointerEvent) => {
      const r = w.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      kick();
    };

    // Hover target is the whole card, so the effect starts as soon as you reach it.
    const host = (w.closest("article") as HTMLElement | null) ?? w;
    const fine = window.matchMedia("(pointer: fine)").matches;

    let io: IntersectionObserver | null = null;
    Promise.all([load(src, 0), load(depth, 1)])
      .then(([im]) => {
        if (!alive) return;
        gl.uniform1i(U("u_img"), 0);
        gl.uniform1i(U("u_depth"), 1);
        gl.uniform1f(uAspect, im.naturalWidth / im.naturalHeight);
        gl.uniform1f(uBlur, REST_BLUR);
        resize();
        frame();
        setReady(true);
        if (fine) {
          host.addEventListener("pointerenter", enter);
          host.addEventListener("pointerleave", leave);
          host.addEventListener("pointermove", move);
        } else {
          // Touch: play the focus pull once when the portrait scrolls into view.
          io = new IntersectionObserver(
            ([e]) => {
              if (e.isIntersecting) {
                enter();
                io?.disconnect();
              }
            },
            { threshold: 0.6 }
          );
          io.observe(w);
        }
      })
      .catch(() => {});

    const ro = new ResizeObserver(() => {
      resize();
      kick();
    });
    ro.observe(c);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointermove", move);
    };
  }, [src, depth]);

  return (
    <div ref={wrap} className={`relative h-full w-full ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className={`object-cover object-top transition-opacity duration-500 ${ready ? "opacity-0" : "grayscale"}`} />
      <canvas ref={canvas} aria-hidden="true" className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}
