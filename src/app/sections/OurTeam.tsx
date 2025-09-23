
import team2 from '@/assets/images/alfi.png';
import team3 from '@/assets/images/rifky.png';
import Image from 'next/image';

export const OurTeam = () => {
  return (
    <section className="py-32" id='our-team'>
      <div className="container mx-auto px-4">
        <div className="section-heading text-center">
          <h2 className="section-title text-3xl md:text-4xl font-bold">Meet Our Team</h2>
          <p className="section-description mt-5 text-gray-600 max-w-xl mx-auto">
            Our passionate team is committed to driving the success of your projects through collaboration, innovation, and dedication.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 mt-12 md:flex-row md:justify-center">
          <div className="text-center">
            <Image
              src='/assets/images/hikari.jpg'
              alt="Hikari"
              width={240}
              height={240}
              className="rounded-full shadow-md mx-auto"
            />
            <p className="mt-3 font-semibold">Hikari</p>
            {/* <p className="text-sm text-gray-500">Product Designer</p> */}
          </div>

          <div className="text-center">
            <Image
              src='/assets/images/alfi.png'
              alt="Alfi"
              width={240}
              height={240}
              className="rounded-full shadow-md mx-auto"
            />
            <p className="mt-3 font-semibold">Alfi</p>
            {/* <p className="text-sm text-gray-500">Frontend Developer</p> */}
          </div>

          <div className="text-center">
            <Image
              src='/assets/images/rifky.png'
              alt="Rifky"
              width={240}
              height={240}
              className="rounded-full shadow-md mx-auto"
            />
            <p className="mt-3 font-semibold">Rifky</p>
            {/* <p className="text-sm text-gray-500"></p> */}
          </div>
        </div>
      </div>
    </section>
  );
};
