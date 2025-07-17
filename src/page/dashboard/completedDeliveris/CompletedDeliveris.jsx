import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CompletedDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ✅ fetch completed parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completedParcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/rider/completed-parcels?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // ✅ mutation to cash out
  const cashoutMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/rider/cashout/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        Swal.fire("Success!", "Cash out successful!", "success");
        queryClient.invalidateQueries(["completedParcels", user?.email]);
      }
    },
    onError: () => {
      Swal.fire("Error!", "Something went wrong!", "error");
    },
  });

  // ✅ trigger cashout with confirmation
  const handleCashout = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You want to cash out this parcel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cash Out!",
    });

    if (confirm.isConfirmed) {
      cashoutMutation.mutate(id);
    }
  };

  // ✅ income calculator
  const calculateIncome = (parcel) => {
    const sameDistrict = parcel.sender_district === parcel.receiver_district;
    return sameDistrict ? parcel.cost * 0.8 : parcel.cost * 0.3;
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Completed Deliveries</h2>

      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th>#</th>
              <th>Parcel ID</th>
              <th>Pickup Date</th>
              <th>Delivery Date</th>
              <th>Total Cost</th>
              <th>Rider Income</th>
              <th>Cashout</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td>{parcel._id}</td>
                <td>{new Date(parcel.assigned_at).toLocaleDateString()}</td>
                <td>{new Date(parcel.delivered_at).toLocaleDateString()}</td>
                <td>{parcel.cost}৳</td>
                <td>{calculateIncome(parcel).toFixed(2)}৳</td>
                <td>
                  {parcel.cashout_status === "cashed_out" ? (
                    <span className="text-green-600 font-semibold">Cashed Out</span>
                  ) : (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleCashout(parcel._id)}
                      disabled={cashoutMutation.isPending}
                    >
                      {cashoutMutation.isPending ? "Processing..." : "Cash Out"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {parcels.length === 0 && !isLoading && (
          <p className="text-center text-gray-500 mt-4">No completed deliveries found.</p>
        )}
      </div>
    </div>
  );
};

export default CompletedDeliveries;
