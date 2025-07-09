import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router";
import useAuth from "../../hook/useAuth";
import { v4 as uuidv4 } from "uuid";
import useAxiosSecure from "../../hook/useAxiosSecure";

const generateTrackingId = () => {
  return `TRK-${uuidv4()}`;
};

const ParcelForm = () => {
  const axiosSecure = useAxiosSecure();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [type, setType] = useState("document");

  //   const [serviceCenters, setServiceCenters] = useState([]);
  const [senderDistricts, setSenderDistricts] = useState([]);
  const [receiverDistricts, setReceiverDistricts] = useState([]);
  const serviceCenters = useLoaderData();
  const { user } = useAuth();

  // Extract unique regions
  const uniqueRegions = [...new Set(serviceCenters.map((item) => item.region))];

  const onSubmit = async (data) => {
    const isWithinCity = data.sender_center === data.receiver_center;

    // calculate cost
    const cost = calculateCost(data, isWithinCity);
    const tracking_id = generateTrackingId();

    // cost breakdown as list items with some spacing and font weight
    const breakdownHtml = `
    <ul style="list-style-type: disc; padding-left: 20px; margin: 0;">
      <li style="margin-bottom: 6px;">
        <strong>Parcel Type:</strong> ${data.type}
      </li>
      <li style="margin-bottom: 6px;">
        <strong>Weight:</strong> ${data.weight || "N/A"} kg
      </li>
      <li style="margin-bottom: 6px;">
        <strong>From:</strong> ${data.sender_center} (${data.sender_region})
      </li>
      <li style="margin-bottom: 6px;">
        <strong>To:</strong> ${data.receiver_center} (${data.receiver_region})
      </li>
      <li style="margin-top: 12px; font-weight: 600;">Cost Details:</li>
      <li style="margin-left: 20px; margin-bottom: 4px;">${
        data.type === "document"
          ? isWithinCity
            ? "Document Delivery (Within City): ৳60"
            : "Document Delivery (Outside City): ৳80"
          : parseFloat(data.weight || 0) <= 3
          ? isWithinCity
            ? "Non-Document (Up to 3kg, Within City): ৳110"
            : "Non-Document (Up to 3kg, Outside City): ৳150"
          : isWithinCity
          ? `Non-Document (>3kg, Within City): ৳110 base + ৳${(
              (parseFloat(data.weight || 0) - 3) *
              40
            ).toFixed(2)} (extra)`
          : `Non-Document (>3kg, Outside City): ৳150 base + ৳${(
              (parseFloat(data.weight || 0) - 3) *
              40
            ).toFixed(2)} (extra) + ৳40 (extra charge)`
      }</li>
    </ul>
  `;

    const result = await Swal.fire({
      title: "Confirm Your Parcel",
      html: `
      <div style="text-align: left; font-size: 15px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        ${breakdownHtml}
        <p style="margin-top: 18px; font-size: 20px; font-weight: 700; color: #16a34a;">
          Total Cost: ৳${cost}
        </p>
      </div>
    `,
      icon: "info",
      confirmButtonText: "✅ Confirm Booking",
      cancelButtonText: "❌ Cancel",
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      focusConfirm: false,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      width: 480,
    });

    if (result.isConfirmed) {
      const parcelInfo = {
        ...data,
        cost,
        tracking_id,
        creation_date: new Date().toISOString(),
        created_by: user?.email,
        payment_status: "unpid",
        delivery_status: "not_collected",
      };

      console.log("✅ Saved Parcel:", parcelInfo);

      //save data to the server
      axiosSecure.post("/parcels", parcelInfo).then((res) => {
        if (res.data.insertedId) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your parcel is booked",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });

      toast.success("Parcel booked successfully!", { duration: 4000 });
    } else {
      toast("Booking Cancelled", { icon: "❌" });
    }
  };

  const calculateCost = (data, isWithinCity) => {
    if (data.type === "document") {
      return isWithinCity ? 60 : 80;
    } else {
      const weight = parseFloat(data.weight || 0);
      if (weight <= 3) {
        return isWithinCity ? 110 : 150;
      } else {
        const extra = (weight - 3) * 40;
        return isWithinCity ? 110 + extra : 150 + extra + 40;
      }
    }
  };

  return (
    <div className="bg-base-100 p-6 rounded-xl shadow-xl max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Add Parcel</h2>
      <p className="text-base-content mb-6">Enter your parcel details</p>

      {/* Parcel Type */}
      <div className="flex gap-6 items-center mb-6">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="type"
            value="document"
            checked={type === "document"}
            onChange={() => setType("document")}
            className="radio radio-success"
          />
          Document
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="type"
            value="non-document"
            checked={type === "non-document"}
            onChange={() => setType("non-document")}
            className="radio radio-warning"
          />
          Non-Document
        </label>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Parcel Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Parcel Name</label>
            <input
              type="text"
              {...register("title", { required: true })}
              placeholder="Parcel Name"
              className="input input-bordered w-full"
            />
            {errors.title && <span className="text-error">Required</span>}
          </div>

          {type === "non-document" && (
            <div>
              <label className="label">Parcel Weight (KG)</label>
              <input
                type="number"
                step="0.01"
                {...register("weight")}
                placeholder="Parcel Weight"
                className="input input-bordered w-full"
              />
            </div>
          )}
        </div>

        {/* Sender & Receiver */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sender */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Sender Details</h3>
            <div className="space-y-3">
              <input
                type="text"
                {...register("sender_name", { required: true })}
                placeholder="Sender Name"
                className="input input-bordered w-full"
              />
              <input
                type="text"
                {...register("sender_contact", { required: true })}
                placeholder="Sender Contact"
                className="input input-bordered w-full"
              />

              <select
                {...register("sender_region", { required: true })}
                onChange={(e) => {
                  const selected = e.target.value;
                  const filtered = serviceCenters
                    .filter((item) => item.region === selected)
                    .map((item) => item.district);
                  setSenderDistricts(filtered);
                }}
                className="select select-bordered w-full"
              >
                <option value="">Select Region</option>
                {uniqueRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>

              <select
                {...register("sender_center", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Pickup Center</option>
                {senderDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <input
                type="text"
                {...register("sender_address", { required: true })}
                placeholder="Sender Address"
                className="input input-bordered w-full"
              />
              <textarea
                {...register("pickup_instruction", { required: true })}
                placeholder="Pickup Instruction"
                className="textarea textarea-bordered w-full"
              />
            </div>
          </div>

          {/* Receiver */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Receiver Details</h3>
            <div className="space-y-3">
              <input
                type="text"
                {...register("receiver_name", { required: true })}
                placeholder="Receiver Name"
                className="input input-bordered w-full"
              />
              <input
                type="text"
                {...register("receiver_contact", { required: true })}
                placeholder="Receiver Contact"
                className="input input-bordered w-full"
              />

              <select
                {...register("receiver_region", { required: true })}
                onChange={(e) => {
                  const selected = e.target.value;
                  const filtered = serviceCenters
                    .filter((item) => item.region === selected)
                    .map((item) => item.district);
                  setReceiverDistricts(filtered);
                }}
                className="select select-bordered w-full"
              >
                <option value="">Select Region</option>
                {uniqueRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>

              <select
                {...register("receiver_center", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Delivery Center</option>
                {receiverDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <input
                type="text"
                {...register("receiver_address", { required: true })}
                placeholder="Receiver Address"
                className="input input-bordered w-full"
              />
              <textarea
                {...register("delivery_instruction", { required: true })}
                placeholder="Delivery Instruction"
                className="textarea textarea-bordered w-full"
              />
            </div>
          </div>
        </div>

        <p className="text-sm mt-4 text-muted">* PickUp Time 4pm–7pm Approx.</p>

        <div className="text-start">
          <button className="btn btn-primary text-black px-6">
            Proceed to Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParcelForm;
