import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { parcelId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { isPending, data: parcelInfo } = useQuery({
    queryKey: ["parcel", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcel/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return "....loding";
  }

  const amount = parcelInfo.cost;
  const amountIncents = amount * 100;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (card == null) {
      return;
    }
    // validate the card
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
      console.log("[error]", error);
    } else {
      setError("");
      console.log("[PaymentMethod]", paymentMethod); //client side e aita create korar por samne aitar ar kaj kii ?? kono kaj nah thakle toiri keno korsi ??
      // step-2 create payment instance
      const res = await axiosSecure.post("/create-payment-intent", {
        amountIncents,
        parcelId,
      });

      const clientSecret = res.data.clientSecret;

      //step-3 confirme payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName, // You can collect this from the user
            email: user.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        setError("");
        if (result.paymentIntent.status === "succeeded") {
          console.log("Payment successful!");
          console.log(result);

          // mark parcel payed also create a payment history
          const paymentInfo = {
            parcelId,
            userEmail: user.email,
            amount,
            method: result.paymentIntent.payment_method_types,
            transactionId: result.paymentIntent.id,
          };
          const res = await axiosSecure.post("/save", paymentInfo);
          if (res.data.insertResult.insertedId) {
            console.log("paymen success");
            Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              html: `<strong>Transaction ID:</strong><br><code>${result.paymentIntent.id}</code>`,
              confirmButtonText: "Go to My Parcel",
            }).then(() => {
              navigate("/dashboard/my-parcels"); // redirect after confirmation
            });
          }
        }
      }
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 p-5 w-8/12 mx-auto mt-10"
      >
        <CardElement />
        <button
          className="btn btn-primary text-black w-full mt-5"
          type="submit"
          disabled={!stripe}
        >
          Pay parcel delevary cost ${parcelInfo.cost}
        </button>
        <p className="text-red-500">{error}</p>
      </form>
    </div>
  );
};

export default PaymentForm;
