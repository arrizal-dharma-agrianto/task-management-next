import { ArrowRight, MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
        <p className="text-white/60 hidden md:block">
        </p>
        <div className="inline-flex gap-1 items-center">
          <p>Join Us</p>
          <ArrowRight className="h-4 w-4 inline-flex justify-center items-center" />
        </div>
      </div>
      <div className="py-5">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Image src="/assets/images/crackin.jpeg" alt="Saas logo" height={40} width={40} />
            <MenuIcon className="h-5 w-5 md:hidden" />
            <nav className="hidden md:flex gap-6 text-black/60 items-center">
              <a href="#home">Home</a>
              <a href="#features">Features</a>
              <a href="#our-team">Our Team</a>
              <a href="#contact">Contact</a>
              <Link href='/login' className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex align-items justify-center tracking-tight">Log In</Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
