import Axios from "axios";
import { RefreshTokenResponse } from "@/types/api";

export const api = Axios.create({
baseURL: import.meta.env.VITE_API_URL,
withCredentials: true,
});

const refreshClient = Axios.create({
baseURL: import.meta.env.VITE_API_URL,
withCredentials: true,
});

export const apiLogout = async () => {
try {
await api.post("/logout/");
} catch {}
sessionStorage.removeItem("accessToken");
};

api.interceptors.request.use((config) => {
const token = sessionStorage.getItem("accessToken");

if (token) {
config.headers.Authorization = `Bearer ${token}`;
}

config.headers.Accept = "application/json";

return config;
});

let refreshPromise: Promise<string> | null = null;
api.interceptors.response.use(
(response) => response.data,

async (error) => {
const originalRequest = error.config;

if (error.response?.status !== 401 || originalRequest._retry) {
  return Promise.reject(error);
}

originalRequest._retry = true;

try {

  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/token/refresh/")
      .then((res: { data: RefreshTokenResponse }) => {
        const newToken = res.data.access;

        sessionStorage.setItem("accessToken", newToken);

        return newToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  const newAccessToken = await refreshPromise;

  originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

  return api(originalRequest);
} catch (refreshError) {

  await apiLogout();
  window.location.href = "/login/";

  return Promise.reject(refreshError);
}

}
);