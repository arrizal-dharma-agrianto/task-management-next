import { Footer } from "./sections/Footer";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { LogoTicker } from "./sections/LogoTicker";
import { OurTeam } from "./sections/OurTeam";
import { ProductShowcase } from "./sections/ProductShowcase";
import type { Metadata } from "next";
import clsx from "clsx";
import { DM_Sans } from "next/font/google";
const dmSans = DM_Sans({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Task Management Crackin'Code Studio",
  description: "Template created by Frontend Tribe",
};

export default function Home() {
  return (
    <div id="home" >
      <div className={clsx(dmSans.className, "antialiased bg-[#EAEEFE]")}>
        <Header />
        <Hero />
        <LogoTicker />
        <ProductShowcase />
        <OurTeam />
        <Footer />
      </div>
    </div>
  );
}
