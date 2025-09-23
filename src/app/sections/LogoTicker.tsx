'use client';

import Image from 'next/image';
import { motion } from "framer-motion";

export const LogoTicker = () => {
  return (
    <div className='py-8 md:py-12 bg-white'>
      <div className='container mx-auto'>
        <div className='flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]'>
          <motion.div
            className="flex gap-14 flex-none pr-14"
            animate={{
              translateX: '-10%',
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            <Image
              src='/assets/images/node.png'
              alt="Acme Logo"
              className='logo-ticker-image'
              width={100}
              height={100}
            />
            <Image
              src='/assets/images/shaden.png'
              alt="Quantum Logo"
              className='logo-ticker-image'
              width={100}
              height={100}
            />
            <Image
              src='/assets/images/Next.png'
              alt="Echo Logo"
              className='logo-ticker-image'
              width={100}
              height={100}
            />
            <Image
              src='/assets/images/Tailwind.png'
              alt="Celestial Logo"
              className='logo-ticker-image'
              width={100}
              height={100}
            />
            <Image
              src='/assets/images/prisma.png'
              alt="Pulse Logo"
              className='logo-ticker-image'
              width={100}
              height={100}
            />
            <Image
              src='/assets/images/supabase.png'
              alt="Apex Logo"
              className='logo-ticker-image'
              width={100}
              height={100}
            />


            <Image
              src='/assets/images/Tailwind.png'
              alt="Acme Logo"
              className='logo-ticker-image'
              width={100}
              height={100}
            />
            <Image
              src='/assets/images/shaden.png'
              alt="Quantum Logo"
              className='logo-ticker-image'
              width={100}
              height={100}
            />
            <Image
              src='/assets/images/Next.png'
              alt="Echo Logo"
              className='logo-ticker-image'
              width={100}
              height={100}
            />
            <Image
              src='/assets/images/Tailwind.png'
              alt="Celestial Logo"
              className='logo-ticker-image'
              width={100}
              height={100}
            />
            <Image
              src='/assets/images/prisma.png'
              alt="Pulse Logo"
              className='logo-ticker-image'
              width={100}
              height={100}
            />
            <Image
              src='/assets/images/supabase.png'
              alt="Apex Logo"
              className='logo-ticker-image'
              width={100}
              height={100}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
