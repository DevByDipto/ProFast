import { useQuery } from '@tanstack/react-query';
// import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

export default function RiderAssignModal({ parcel, closeModal, onAssigned }) {
  const axiosSecure = useAxiosSecure();

  const { data: riders = [], isLoading } = useQuery({
    queryKey: ['riders', parcel.sender_center],
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders?district=${parcel.sender_center}`);
      return res.data;
    },
  });
console.log(riders);

  const handleAssign = async (rider) => {
    try {
      await axiosSecure.patch(`/parcels/assign/${parcel._id}`, {
        assigned_rider_id: rider._id,
        assigned_rider_email: rider._email,
        assigned_rider_name: rider.name,
        assigned_at: new Date(),
      });

      Swal.fire({
        icon: 'success',
        title: 'Rider assigned!',
        text: `${rider.name} is now delivering this parcel.`,
        timer: 2000,
        showConfirmButton: false,
      });

      closeModal();
      onAssigned(); // ✅ refetch parcels list

    } catch (err) {
      console.error('Assignment failed:', err);
      Swal.fire({
        icon: 'error',
        title: 'Assignment Failed',
        text: 'Something went wrong. Please try again.',
      });
    }
  };

  // Prevent background scroll when modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'auto');
  }, []);

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div
        className="w-[700px] max-w-full max-h-[90vh] overflow-y-auto p-6 rounded border border-gray-300 bg-neutral-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Select Rider for: {parcel.tracking_id}</h3>
          <button onClick={closeModal} className="text-lg font-bold px-2">✖</button>
        </div>

        {isLoading ? (
          <p>Loading riders...</p>
        ) : riders.length === 0 ? (
          <p>No available riders in this district.</p>
        ) : (
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border px-2 py-1">#</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Contact</th>
                <th className="border px-2 py-1">District</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider, index) => (
                <tr key={rider._id}>
                  <td className="border px-2 py-1 text-center">{index + 1}</td>
                  <td className="border px-2 py-1">{rider.name}</td>
                  <td className="border px-2 py-1">{rider.contact}</td>
                  <td className="border px-2 py-1">{rider.district}</td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => handleAssign(rider)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
