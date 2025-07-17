import axios from "axios";
import React from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`, // তোমার server URL এখানে দাও
});

const useAxiosSecure = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  axiosSecure.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
    return config;
  });

  axiosSecure.interceptors.response.use(
    (res) => {
      return res;
    },
    (err) => {
      console.log({ err });
      const status = err.status;
      if (status == 403) {
        navigate("/forbiden");
      } else if (status == 401) {
        logoutUser()
          .then(() => {
            navigate("/login");
          })
          .catch(() => {});
      }
      return Promise.reject(err);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
