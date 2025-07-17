import { useQuery } from '@tanstack/react-query';
import { FaUserPlus } from 'react-icons/fa';
// import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useState } from 'react';
import RiderAssignModal from './RiderAssignModal';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

export default function AssignRider() {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);

  const {
    data: parcels = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['parcel-collection'],
    queryFn: async () => {
      const res = await axiosSecure.get(
        '/parcels?payment_status=paid&delivery_status=not_collected'
      );
      return res.data;
    },
  });

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError) return <div className="p-6 text-red-600">Failed to load parcels</div>;

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-semibold mb-6">Pending Parcel Collection</h2>

      <div className="overflow-x-auto w-full">
        <table className="table w-full border">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Tracking ID</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Weight</th>
              <th>Cost</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td>{parcel.title}</td>
                <td>{parcel.tracking_id}</td>
                <td>{parcel.sender_name}</td>
                <td>{parcel.receiver_name}</td>
                <td>{parcel.weight} kg</td>
                <td>৳{parcel.cost}</td>
                <td>
                  <button
                    onClick={() => setSelectedParcel(parcel)}
                    className="flex items-center gap-1 text-white bg-blue-600 px-3 py-1 rounded"
                  >
                    <FaUserPlus />
                    Assign Rider
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal */}
      {selectedParcel && (
        <RiderAssignModal
          parcel={selectedParcel}
          closeModal={() => setSelectedParcel(null)}
          onAssigned={refetch} // 📌 refetch after assigning
        />
      )}
    </div>
  );
}
