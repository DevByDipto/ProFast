import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

export default function PendingDeliveries() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [loadingId, setLoadingId] = useState(null);

  const {
    data: parcels = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['rider-deliveries'],
    queryFn: async () => {
      const res = await axiosSecure.get(`/rider/parcels?email=${user.email}`);
      return res.data;
    },
  });

  const handleStatusUpdate = async (parcel) => {
    const { _id, delivery_status } = parcel;
    let newStatus;

    if (delivery_status === 'rider_assign') {
      newStatus = 'in_transit';
    } else if (delivery_status === 'in_transit') {
      newStatus = 'delivered';
    } else {
      return;
    }

    try {
      setLoadingId(_id);
      const res = await axiosSecure.patch(`/parcels/update-status/${_id}`, {
        status: newStatus,
      });

      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: 'success',
          title: `Status updated to "${newStatus.replace('_', ' ')}"`,
          timer: 2000,
          showConfirmButton: false,
        });
        refetch();
      }
    } catch (err) {
      console.error('❌ Failed to update:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Could not update status. Try again later.',
      });
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-semibold mb-6">Pending Deliveries</h2>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border text-sm">
          <thead>
            <tr>
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">Title</th>
              <th className="border px-3 py-2">Tracking ID</th>
              <th className="border px-3 py-2">Receiver</th>
              <th className="border px-3 py-2">Contact</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => {
              const isDelivered = parcel.delivery_status === 'delivered';
              const nextLabel =
                parcel.delivery_status === 'rider_assign'
                  ? 'Marked Picked Up'
                  : parcel.delivery_status === 'in_transit'
                  ? 'Mark Delivered'
                  : 'Delivered';

              return (
                <tr key={parcel._id}>
                  <td className="border px-3 py-2 text-center">{index + 1}</td>
                  <td className="border px-3 py-2">{parcel.title}</td>
                  <td className="border px-3 py-2">{parcel.tracking_id}</td>
                  <td className="border px-3 py-2">{parcel.receiver_name}</td>
                  <td className="border px-3 py-2">{parcel.receiver_contact}</td>
                  <td className="border px-3 py-2 text-center">
                    {parcel.delivery_status}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => handleStatusUpdate(parcel)}
                      className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                      disabled={isDelivered || loadingId === parcel._id}
                    >
                      {loadingId === parcel._id ? 'Updating...' : nextLabel}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
