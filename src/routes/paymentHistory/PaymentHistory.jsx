import React from 'react'
import useAuth from '../../hooks/useAuth'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { useQueries, useQuery } from '@tanstack/react-query'

const PaymentHistory = () => {
    const {user} = useAuth()
    const axiosSecure= useAxiosSecure()
        const {isPending,data:payments=[]} = useQuery({
        queryKey:['payments',user.email],
        queryFn: async()=>{
            const res = await axiosSecure.get(`/history?email=${user.email}`)
            return res.data
        }
    })

if(isPending){
    return'........loading'
}
console.log(payments);



  return (

    <div>
        <table className="table table-zebra w-full">
  <thead>
    <tr>
      <th>#</th>
      <th>Amount</th>
      <th>Transaction ID</th>
      <th>Parcel ID</th>
      <th>Paid At</th>
    </tr>
  </thead>
  <tbody>
    {payments.map((payment, index) => (
      <tr key={payment.transactionId}>
        <td>{index + 1}</td>
        <td>{payment.parcelId}</td>
        <td>৳ {payment.amount}</td>
        <td>{payment.transactionId}</td>
        <td>{payment.paid_at}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>

  )
}

export default PaymentHistory