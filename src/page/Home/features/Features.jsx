import React from "react";
import { FaMapMarkedAlt, FaShieldAlt, FaPhoneAlt } from "react-icons/fa";
import liveTracking from '../../../assets/live-tracking.png'
import safeDelivery from '../../../assets/safe-delivery.png'

const features = [
  {
    id: 1,
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    img: liveTracking,
  },
  {
    id: 2,
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    img: safeDelivery,
  },
  {
    id: 3,
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    img: safeDelivery,
  },
];

const Features = () => {
  return (
    <section className="my-16 px-4 md:px-8 lg:px-16">
      <div className="space-y-6">
        {features.map(({ id, title, description, img }) => (
          <div
            key={id}
            className="bg-white rounded-2xl p-8 flex items-center gap-20 shadow-sm hover:shadow-md transition-all"
          >
            {/* img */}
           <div >
            <img className="max-w-[200px] " src={img} alt="" />
           </div>

            {/* Text Content */}
            <div>
              <h3 className="text-xl font-semibold text-primary mb-4">{title}</h3>
              <p className="text-gray-600 text-sm">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
