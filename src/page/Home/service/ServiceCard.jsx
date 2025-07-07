import React from "react";

const ServiceCard = ({service}) => {
    const { icon: Icon, title, description } = service
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:bg-[#CAEB66] transition-colors duration-300 text-center">
      <div className="text-4xl text-primary mb-4 flex justify-center">
        <Icon />
      </div>
      <h3 className="text-xl text-[#03373D] font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;
