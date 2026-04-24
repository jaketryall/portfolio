"use client";

/**
 * Single source of motion signals for the whole site.
 * One GSAP ticker loop, one velocity reading, one scroll progress — every
 * consumer subscribes to the same bus, so the page shares a heartbeat.
 */
import gsap from "gsap";

export type MotionState = {
  time: number;           // seconds since ticker start
  scrollY: number;        // current scrollY in px
  scrollProgress: number; // 0..1 through the document
  scrollVelocity: number; // -1..1, smoothed delta per tick
  heartbeat: number;      // 0..1 sine, 1.2s period — for idle pulses
};

type Listener = (s: MotionState) => void;

class Bus {
  private listeners = new Set<Listener>();
  private started = false;
  private state: MotionState = {
    time: 0,
    scrollY: 0,
    scrollProgress: 0,
    scrollVelocity: 0,
    heartbeat: 0,
  };
  private lastScrollY = 0;
  private smoothedVelocity = 0;

  private start() {
    if (this.started || typeof window === "undefined") return;
    this.started = true;

    gsap.ticker.add((time) => {
      const scrollY = window.scrollY || 0;
      const docH =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress =
        docH > 0 ? gsap.utils.clamp(0, 1, scrollY / docH) : 0;

      const deltaY = scrollY - this.lastScrollY;
      this.lastScrollY = scrollY;
      const rawV = gsap.utils.clamp(-1, 1, deltaY / 40);
      // exponential smoothing so velocity decays naturally
      this.smoothedVelocity = this.smoothedVelocity * 0.8 + rawV * 0.2;

      // 1.2s period heartbeat — 0..1 sine
      const heartbeat = (Math.sin(time * (Math.PI * 2) / 1.2) + 1) / 2;

      this.state = {
        time,
        scrollY,
        scrollProgress,
        scrollVelocity: this.smoothedVelocity,
        heartbeat,
      };

      this.listeners.forEach((cb) => cb(this.state));
    });
  }

  subscribe(cb: Listener): () => void {
    this.start();
    this.listeners.add(cb);
    cb(this.state);
    return () => {
      this.listeners.delete(cb);
    };
  }

  get(): MotionState {
    return this.state;
  }
}

export const motionBus = new Bus();
