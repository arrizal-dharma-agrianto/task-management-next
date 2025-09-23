"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

export const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latestValue) => console.log(latestValue));

  return (
    <section
      ref={heroRef}
      className="pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#fcba03,#EAEEFE_100%)] overflow-x-clip"
    >
      <div className="container mx-auto px-4">
        <div className="md:flex items-center relative">
          <div className="md:w-[478px] z-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#1a1a1a] text-transparent bg-clip-text mt-6">
              <span> Crackin&apos;Code</span>
              <div className="text-4xl md:text-5xl">Task Management</div>
            </h1>
            <p className="text-xl text-[#010D3E] tracking-tight mt-6">
              With an intuitive interface and collaborative features, this system helps you plan, monitor, and complete tasks in a more structured and timely manner.
            </p>
            <div className="flex gap-1 items-center mt-[30px]">
              <button className="btn btn-primary">Start Now</button>
              <button className="btn btn-text gap-1">
                <span>Register</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
            <motion.img
              src="/assets/images/TASKlogo.png"
              alt="Task Logo"
              className="absolute left-[-60px] md:h-full md:w-auto md:max-w-none"
              animate={{
                translateY: [-30, 30],
              }}
              transition={{
                repeat: Infinity,
                repeatType: 'mirror',
                duration: 3,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
