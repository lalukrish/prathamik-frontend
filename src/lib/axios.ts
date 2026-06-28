
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

interface CustomAxiosRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;

let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(true);
    }
  });

  failedQueue = [];
};

const getStoredUser = () => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};

const updateAccessToken = (token: string) => {
  const user = getStoredUser();

  if (!user) return;

  user.token = token;

  localStorage.setItem(
    "user",
    JSON.stringify(user),
  );
};

const logout = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("user");
  localStorage.removeItem("userRole");

  window.location.href = "/";
};

api.interceptors.request.use(
  (config) => {
    
    const user = getStoredUser();
  console.log("Stored User:", user);

    if (
      user?.token &&
      config.headers
    ) {
      config.headers.Authorization =
        `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  async (
    error: AxiosError<{
      code?: string;
    }>
  ) => {
    const originalRequest =
      error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // refresh API itself failed
    if (
      originalRequest.url?.includes(
        "/auth/refresh-token"
      )
    ) {
      logout();
      return Promise.reject(error);
    }

    const tokenExpired =
      error.response?.status === 401 &&
      error.response?.data?.code ===
        "TOKEN_EXPIRED";

    if (
      tokenExpired &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(
          (resolve, reject) => {
            failedQueue.push({
              resolve,
              reject,
            });
          },
        )
          .then(() => {
            const user =
              getStoredUser();

            if (
              user?.token &&
              originalRequest.headers
            ) {
              originalRequest.headers.Authorization =
                `Bearer ${user.token}`;
            }

            return api(originalRequest);
          })
          .catch((err) =>
            Promise.reject(err),
          );
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response =
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            {},
            {
              withCredentials: true,
            },
          );

        const accessToken =
          response.data.data.accessToken;

        updateAccessToken(accessToken);

        if (
          originalRequest.headers
        ) {
          originalRequest.headers.Authorization =
            `Bearer ${accessToken}`;
        }

        processQueue(null);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        logout();

        return Promise.reject(
          refreshError,
        );
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;