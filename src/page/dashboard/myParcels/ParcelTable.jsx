// src/components/ParcelTable.jsx
import React from "react";
import { format } from "date-fns"; // aita kii kaj kore ?
import { FaTrash, FaEye, FaMoneyBillWave } from "react-icons/fa";

// 👉 Dummy props: parcels = array of parcel data
const ParcelTable = ({ parcels, onView, onDelete, onPay }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="table table-zebra w-full">
        {/* 📌 Table Head */}
        <thead>
          <tr className="text-base">
            <th>#</th>
            <th>Title</th>
             <th>Type</th>
            <th>Created At</th>
            <th>Cost (৳)</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>

        {/* 📦 Table Body */}
        <tbody>
          {parcels?.map((parcel, index) => (
            <tr key={parcel._id}>
              <td>{index + 1}</td>

              {/* 📌 Title */}
              <td className="">{parcel.title}</td>

              {/* 📄 Document or Non-document */}
              <td>{parcel.weight ? "Non-Document" : "Document"}</td>

              {/* 🕒 Creation Date (Formatted) */}
              <td>{format(new Date(parcel.creation_date), "dd MMM yyyy p")}</td>

              {/* 💸 Cost */}
              <td>৳{parcel.cost}</td>

              {/* 💳 Payment Status with Badge */}
              <td>
                {parcel.payment_status === "paid" ? (
                  <span className="badge badge-success">Paid</span>
                ) : (
                  <span className="badge badge-error">Unpaid</span>
                )}
              </td>

              {/* ⚙️ Actions: View | Pay | Delete */}
              <td className="flex gap-2">
                <button
                  onClick={() => onView(parcel._id)}
                  className="btn btn-sm btn-info text-white"
                  title="View"
                >
                  <FaEye />
                </button>
                {parcel.payment_status !== "paid" && (
                  <button
                    onClick={() => onPay(parcel._id)}
                    className="btn btn-sm btn-warning text-white"
                    title="Pay"
                  >
                    <FaMoneyBillWave />
                  </button>
                )}
                <button
                  onClick={() => onDelete(parcel._id)}
                  className="btn btn-sm btn-error text-white"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParcelTable;
