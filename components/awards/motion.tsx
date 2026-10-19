import React, { useEffect, useMemo, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

/**
 * Small animation building blocks for the awards pages. Every one of them
 * checks the visitor's "reduce motion" setting and falls back to a still,
 * fully readable version.
 */

/** Counts up to `value` the first time it scrolls into view. */
export const CountUp: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [shown, setShown] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setShown(value);
      return;
    }
    if (!inView) return;
    const controls = animate(0, value, { duration: 1.1, ease: 'easeOut', onUpdate: (v) => setShown(Math.round(v)) });
    return () => controls.stop();
  }, [value, inView, reduce]);

  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString()}
    </span>
  );
};

/** A horizontal bar that fills to `percent` when it scrolls into view. */
export const AnimatedBar: React.FC<{ percent: number; className?: string; barClassName?: string }> = ({
  percent,
  className = '',
  barClassName = 'bg-primary',
}) => {
  const reduce = useReducedMotion();
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-[#e5e7eb] dark:bg-white/10 ${className}`} role="presentation">
      <motion.div
        className={`h-full rounded-full ${barClassName}`}
        initial={{ width: reduce ? `${percent}%` : 0 }}
        whileInView={{ width: `${percent}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
};

/** 3D tilt that follows the pointer. Plain wrapper when motion is reduced. */
export const TiltCard: React.FC<{ children: React.ReactNode; className?: string; strength?: number }> = ({
  children,
  className,
  strength = 8,
}) => {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), { stiffness: 200, damping: 20 });

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
};

/** Gentle up-and-down float for decorative elements. */
export const Float: React.FC<{ children: React.ReactNode; className?: string; distance?: number; duration?: number }> = ({
  children,
  className,
  distance = 10,
  duration = 3.2,
}) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      animate={reduce ? undefined : { y: [0, -distance, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

/** A green dot that pulses to signal "live". */
export const LiveDot: React.FC<{ className?: string }> = ({ className = 'bg-green' }) => {
  const reduce = useReducedMotion();
  return (
    <span className="relative inline-flex h-2.5 w-2.5" aria-hidden="true">
      {reduce ? null : <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${className}`} />}
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${className}`} />
    </span>
  );
};

/** Live countdown to `endsAt`, ticking every second. */
export const Countdown: React.FC<{ endsAt: string }> = ({ endsAt }) => {
  const target = useMemo(() => Date.parse(endsAt), [endsAt]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const left = Math.max(0, target - now);
  if (left === 0) return <span className="font-bold">Voting has closed</span>;

  const parts = [
    { label: 'Days', value: Math.floor(left / 86_400_000) },
    { label: 'Hours', value: Math.floor((left / 3_600_000) % 24) },
    { label: 'Min', value: Math.floor((left / 60_000) % 60) },
    { label: 'Sec', value: Math.floor((left / 1000) % 60) },
  ];

  return (
    <div className="flex gap-2" role="timer" aria-label="Time left to vote">
      {parts.map((p) => (
        <div key={p.label} className="min-w-14 rounded-xl bg-white/15 px-3 py-2 text-center backdrop-blur">
          <div className="text-2xl font-black tabular-nums text-white">{String(p.value).padStart(2, '0')}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/80">{p.label}</div>
        </div>
      ))}
    </div>
  );
};

const CONFETTI_COLORS = ['#fcd116', '#ce1126', '#006b3f', '#ffffff', '#f59e0b', '#38bdf8'];

/** One-shot confetti burst, e.g. after a confirmed vote. */
export const Confetti: React.FC<{ pieces?: number }> = ({ pieces = 48 }) => {
  const reduce = useReducedMotion();
  const items = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.6,
        rotate: (Math.random() - 0.5) * 900,
        drift: (Math.random() - 0.5) * 160,
        size: 6 + Math.random() * 8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })),
    [pieces],
  );
  if (reduce) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {items.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 block rounded-sm"
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 1.6, backgroundColor: p.color }}
          initial={{ y: -40, opacity: 1, rotate: 0 }}
          animate={{ y: '105vh', x: p.drift, opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
};

export const staggerParent = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
export const riseIn = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } };
