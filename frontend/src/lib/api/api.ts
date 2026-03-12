/// <reference types="vite/client" />
import { createApiClient } from "./api-client";
import { authService } from "./auth-service";
import { setupInterceptors } from "./setup-interceptors";

const api = createApiClient(import.meta.env.VITE_APIS_URL);
const refreshClient = createApiClient(import.meta.env.VITE_APIS_URL);

setupInterceptors(api, {
  refreshClient,
  getToken: () => {
    const token = authService.getAccessToken();
    return token;
  },
  setToken: (t) => authService.setAccessToken(t),
  clearToken: () => authService.clearAccessToken(),
  onLogout: () => (window.location.href = "/login/"),
});
export const apiLogout = async ()=>{
    await refreshClient.post('/logout/'); // Invalidate the refresh token on the server
}

export { api };