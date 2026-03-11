import { AxiosInstance } from "axios";

type Options = {
  refreshClient: AxiosInstance;
  getToken: () => string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  onLogout: () => void;
};

export function setupInterceptors(api: AxiosInstance, options: Options) {
  const { refreshClient, getToken, setToken, clearToken, onLogout } = options;

  let refreshPromise: Promise<string> | null = null;

  api.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers.Accept = "application/json";
    return config;
  });

  api.interceptors.response.use(
    (res) => res.data,
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
            .then((res) => {
              const token = res.data.access;
              setToken(token);
              return token;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const token = await refreshPromise;

        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      } catch (err) {
        clearToken();
        onLogout();
        return Promise.reject(err);
      }
    }
  );
}