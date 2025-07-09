import axios from 'axios';
import React from 'react'

const axiosSecure = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`, // তোমার server URL এখানে দাও
});

const useAxiosSecure = () => {

  return axiosSecure
}

export default useAxiosSecure