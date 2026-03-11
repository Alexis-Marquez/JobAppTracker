let accessToken: string | null = sessionStorage.getItem("accessToken");

export const authService = {
  getAccessToken() {
    return accessToken;
  },

  setAccessToken(token: string) {
    accessToken = token;
    sessionStorage.setItem("accessToken", token);
  },

  clearAccessToken() {
    accessToken = null;
    sessionStorage.removeItem("accessToken");
  },
};