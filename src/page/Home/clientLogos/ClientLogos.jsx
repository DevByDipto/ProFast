import React from "react";
import Marquee from "react-fast-marquee";

// লোগো ইমেজগুলো import করো
import amazon from "../../../assets/brands/amazon.png";
import amazon_vector from "../../../assets/brands/amazon_vector.png";
import casio from "../../../assets/brands/casio.png";
import moonstar from "../../../assets/brands/moonstar.png";
import randstad from "../../../assets/brands/randstad.png";
import start from "../../../assets/brands/start.png";
import people from "../../../assets/brands/start-people.png";


const logos = [amazon, amazon_vector, casio, moonstar, randstad, start, people];

const ClientLogos = () => {
  return (
    <section className="my-20 px-4 md:px-8 lg:px-16">
      {/* টাইটেল */}
      <h2 className="text-3xl font-bold text-center mb-10" style={{ color: "#03373D" }}>
        We've helped thousands of sales teams
      </h2>

      {/* লোগো মারকুই */}
      <Marquee
        direction="right"
        speed={40}
        gradient={false}
        pauseOnHover={true}
      >
        {logos.map((logo, index) => (
          <div
            key={index}
            className="mx-[50px] flex items-center justify-center"
          >
            <img
              src={logo}
              alt={`logo-${index}`}
              className="max-w-[123px]  object-contain"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default ClientLogos;
