import React, { useState } from "react";
import { useForm } from "react-hook-form";
// import useAuth from "../../hooks/useAuth";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { useLoaderData } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const RiderForm = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure()
  const serviCenters = useLoaderData()
  const [region,setRegion] = useState()
  const [district,setDistrict] = useState([])
  

    const uniqueRegion = new Set(serviCenters.map((center)=> center.region))
   const uniqeRegionArray = [...uniqueRegion]
    const baseOnRegionDistrict = serviCenters.filter((center)=> center.region == region).map((center)=> center.district)
    console.log(baseOnRegionDistrict);
    
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      name: user?.displayName,
      email: user?.email,
      status: "pending",
    };

    try {
      const res = await axiosSecure.post("/riders", riderData);
      if (res.data.insertedId) {
        alert("Application submitted successfully!");
        // reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto bg-base-100 p-8 rounded-md shadow-md grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <h2 className="col-span-2 text-2xl font-bold text-primary mb-4">
        Tell us about yourself
      </h2>

      {/* Name (read only) */}
      <div>
        <label className="label">Your Name</label>
        <input
          type="text"
          value={user?.displayName || ""}
          readOnly
          className="input input-bordered w-full bg-base-200"
        />
      </div>

      {/* Email (read only) */}
      <div>
        <label className="label">Your Email</label>
        <input
          type="email"
          value={user?.email || ""}
          readOnly
          className="input input-bordered w-full bg-base-200"
        />
      </div>

      {/* Age */}
      <div>
        <label className="label">Your Age</label>
        <input
          type="number"
          {...register("age", { required: true })}
          placeholder="Enter your age"
          className="input input-bordered w-full"
        />
        {errors.age && <p className="text-error">Age is required</p>}
      </div>

      {/* Region */}
     <div>
  <label className="label">Your Region</label>
  <select
    {...register("region", { required: true })}
    className="select select-bordered w-full"
    defaultValue=""
    onChange={(e)=>setRegion(e.target.value)}
  >
    <option disabled value="">Select your region</option>
    {uniqeRegionArray.map((region, index) => (
      <option key={index} value={region}>
        {region}
      </option>
    ))}
  </select>
  {errors.region && <p className="text-error">Region is required</p>}
</div>


      {/* District */}
        <div>
  <label className="label">Your District</label>
  <select
    {...register("district", { required: true })}
    className="select select-bordered w-full"
    defaultValue=""
    
  >
    <option disabled value="">{region ? "Select your District":"please fisrt select a region"}</option>
    {baseOnRegionDistrict.map((district, index) => (
      <option key={index} value={district}>
        {district}
      </option>
    ))}
  </select>
  {errors.region && <p className="text-error">Region is required</p>}
</div>

      {/* Phone */}
      <div>
        <label className="label">Phone Number</label>
        <input
          type="text"
          {...register("phone", { required: true })}
          placeholder="Enter phone number"
          className="input input-bordered w-full"
        />
        {errors.phone && <p className="text-error">Phone is required</p>}
      </div>

      {/* NID */}
      <div>
        <label className="label">National ID Number</label>
        <input
          type="text"
          {...register("nid", { required: true })}
          placeholder="Enter your NID"
          className="input input-bordered w-full"
        />
        {errors.nid && <p className="text-error">NID is required</p>}
      </div>

      {/* Bike Brand */}
      <div>
        <label className="label">Bike Brand</label>
        <input
          type="text"
          {...register("bikeBrand", { required: true })}
          placeholder="e.g. Honda, TVS"
          className="input input-bordered w-full"
        />
        {errors.bikeBrand && <p className="text-error">Bike brand is required</p>}
      </div>

      {/* Bike Registration */}
      <div>
        <label className="label">Bike Registration Number</label>
        <input
          type="text"
          {...register("bikeRegNumber", { required: true })}
          placeholder="e.g. Dhaka Metro-B-1234"
          className="input input-bordered w-full"
        />
        {errors.bikeRegNumber && <p className="text-error">Bike registration is required</p>}
      </div>

      {/* Submit */}
      <div className="col-span-2 mt-4">
        <button type="submit" className="btn btn-primary text-black w-full">
          Submit
        </button>
      </div>
    </form>
  );
};

export default RiderForm;
