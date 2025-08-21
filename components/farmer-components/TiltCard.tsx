"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";
import { useRef } from "react";

export default function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Faster + snappier tilt
  const rotateX = useSpring(useTransform(y, [0, 1], [20, -20]), {
    stiffness: 200, // higher stiffness → faster response
    damping: 15, // lower damping → less lag
    mass: 0.5, // lighter → moves quicker
  });

  const rotateY = useSpring(useTransform(x, [0, 1], [-20, 20]), {
    stiffness: 200,
    damping: 15,
    mass: 0.5,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width;
    const yPos = (e.clientY - rect.top) / rect.height;
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    animate(x, 0.5, { duration: 0.25, ease: "easeOut" }); // snappy reset
    animate(y, 0.5, { duration: 0.25, ease: "easeOut" });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className="w-full h-full border-2 border-white rounded-2xl shadow-lg cursor-pointer select-none focus:outline-none"
    >
      {children}
    </motion.div>
  );
}
