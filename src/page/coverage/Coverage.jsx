// src/pages/Coverage.jsx
import React from "react";
import DistrictMap from "./DistrictMap";
import { useLoaderData } from "react-router";

const Coverage = () => {
  const cerviceCenterData = useLoaderData()
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">
        We are available in 64 districts
      </h2>

      {/* 🔍 Search Box will be implemented later */}

      <DistrictMap serviceCenters={cerviceCenterData} />
    </div>
  );
};

export default Coverage;
