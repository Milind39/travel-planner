"use client";

import { useEffect } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

type CountUpStatProps = {
  value: number;
  label: string;
  suffix?: string;
  decimals?: number;
};

export default function CountUpStat({
  value,
  label,
  suffix = "",
  decimals = 0,
}: CountUpStatProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  // motion value starting at 0
  const motionValue = useMotionValue(0);

  // spring wrapping the motionValue
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 20,
  });

  // transform springValue → text output
  const displayValue = useTransform(
    springValue,
    (latest) => `${latest.toFixed(decimals)}${suffix}`
  );

  useEffect(() => {
    if (inView) {
      motionValue.set(value); // animate when visible
    }
  }, [inView, value, motionValue]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <motion.p className="text-4xl font-bold text-indigo-600">
        {displayValue}
      </motion.p>
      <p className="text-gray-800 text-xl">{label}</p>
    </div>
  );
}
