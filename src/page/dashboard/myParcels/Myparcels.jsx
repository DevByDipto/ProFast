import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import ParcelTable from "./ParcelTable";
import Swal from "sweetalert2";
import { useNavigate} from "react-router";

const Myparcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate()
  const { data: parcels = [],refetch } = useQuery({
    queryKey: ["my-Parcels", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });
  console.log(parcels);


  // Dummy function for now
  const handleView = (parcel) => {
    console.log("Viewing", parcel);
  };

  const handlePay = (id) => {
    navigate(`/dashboard/payment/${id}`)
  };

  const handleDelete = (parcelId) => {
    console.log({parcelId});
    
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // 🔗 Call DELETE API
        axiosSecure
          .delete(`/parcels/${parcelId}`)
          .then((res) => {
            if (res.data?.deletedCount > 0) {
              Swal.fire("Deleted!", "Parcel has been deleted.", "success");
            }
             refetch() 
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("Error!", "Something went wrong!", "error");
          });
      }
    });
  };

  return (
    <div>
      <h2>this is Myparcels{parcels.length}</h2>
      <ParcelTable
        parcels={parcels}
        onView={handleView}
        onPay={handlePay}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Myparcels;
