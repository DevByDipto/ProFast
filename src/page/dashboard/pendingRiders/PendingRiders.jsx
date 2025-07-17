import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PendingRiders = () => {
  const  axiosSecure  = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);

  // 🔄 Fetch pending riders
  const { data: riders = [], refetch, isLoading } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });
console.log(riders);
console.log(riders.email);

  const handleStatusChange = async (id, newStatus,email) => {
    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `You want to mark this rider as ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${newStatus}`,
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      const res = await axiosSecure.patch(`/riders/status/${id}`, {
        status: newStatus,
        email: email
      });
      console.log(res.data,'riderUpdate');
      
      if (res.data.riderUpdate.modifiedCount > 0) {
        Swal.fire("Updated!", `Rider is now ${newStatus}.`, "success");
        refetch();
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Pending Riders</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Region</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider, index) => (
                <tr key={rider._id}>
                  <td>{index + 1}</td>
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.region}</td>
                  <td>{rider.phone}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleStatusChange(rider._id, "active",rider.email)}
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleStatusChange(rider._id, "rejected")}
                    >
                      <FaTimes />
                    </button>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => setSelectedRider(rider)}
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rider Details Modal */}
      {selectedRider && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-base-200 p-6 rounded-md w-full max-w-md shadow-lg relative">
            <h3 className="text-lg font-semibold mb-2">Rider Details</h3>
            <p><strong>Name:</strong> {selectedRider.name}</p>
            <p><strong>Email:</strong> {selectedRider.email}</p>
            <p><strong>Phone:</strong> {selectedRider.phone}</p>
            <p><strong>Region:</strong> {selectedRider.region}</p>
            <p><strong>District:</strong> {selectedRider.district}</p>
            <p><strong>Bike:</strong> {selectedRider.bikeBrand} ({selectedRider.bikeRegNumber})</p>
            <p><strong>Status:</strong> {selectedRider.status}</p>

            <button
              className="btn btn-sm btn-outline absolute top-2 right-2"
              onClick={() => setSelectedRider(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;
