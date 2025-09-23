import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center" id='contact'>
      <div className="container mx-auto">
        <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:h-full before:w-full before:blur before:bg-[linear-gradient(to_right,#fcba03,#FFFFFF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute">
          <Image src="/assets/images/crackin.jpeg" height={40} width={40} alt='SaaS logo' className='relative' />
        </div>
        <nav className='flex flex-col md:flex-row md:justify-center gap-6 mt-6'>
          <a href="#features">Features</a>
          <a href="#our-team">Our Team</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className='flex justify-center gap-6 mt-6 bg-white'>
          <Image src="/assets/images/social-x.svg" height={40} width={40} alt='SaaS logo' className='relative' />
          <Image src="/assets/images/social-insta.svg" height={40} width={40} alt='SaaS logo' className='relative' />
          <Image src="/assets/images/social-linkedin.svg" height={40} width={40} alt='SaaS logo' className='relative' />
        </div>
        <p className='mt-6'>
          &copy; 2025 Crackin Code
        </p>
      </div>
    </footer>
  );
};
