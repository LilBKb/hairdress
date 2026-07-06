import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { tokenStorage } from '../store/token/tokenStorage'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8080';

export const apiClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	}
});

apiClient.interceptors.request.use((config) => {
	const token = tokenStorage.getAccessToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// 401 -> refresh -> retry
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
	refreshSubscribers.push(cb);
}

function onTokenRefreshed(token: string) {
	refreshSubscribers.forEach((cb) => cb(token));
	refreshSubscribers = [];
}

const SKIP_REFRESH_ENDPOINTS = ['/api/v1/auth/login', '/api/v1/auth/refresh', '/api/v1/auth/register'];

apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as typeof error.config & { _retry?: boolean };
		const url = originalRequest.url || '';

		if (error.response?.status === 401 && !originalRequest._retry && !SKIP_REFRESH_ENDPOINTS.some(u => url.includes(u))) {
			if (isRefreshing) {
				return new Promise((resolve) => {
					subscribeTokenRefresh((token: string) => {
						originalRequest.headers!.Authorization = `Bearer ${token}`;
						resolve(apiClient(originalRequest));
					});
				});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			const refreshTokenSnapshot = tokenStorage.getRefreshToken();	

			try {
				if (!refreshTokenSnapshot)  throw new Error('No refresh token available');

				const {data} = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, { refresh_token: refreshTokenSnapshot });

				tokenStorage.setTokens(data.access_token, data.refresh_token);
				onTokenRefreshed(data.access_token);
				originalRequest.headers!.Authorization = `Bearer ${data.access_token}`;
				return apiClient(originalRequest!);
			} catch {
				const currentRefreshToken = tokenStorage.getRefreshToken();
				if (currentRefreshToken === refreshTokenSnapshot) {
					tokenStorage.clearTokens();
					window.dispatchEvent(new Event('auth:session-expired'));
				}
				return Promise.reject(error);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);

// ─── GET request deduplication ────────────────────────────────────────────────
// If the exact same GET request (URL + serialised params) is already in-flight,
// return the existing promise instead of opening a second network connection.
//
// This makes React StrictMode's intentional double-firing of useEffect harmless
// for every component in the app without any per-component boilerplate.
{
  const pending = new Map<string, Promise<AxiosResponse>>();
  const _get = apiClient.get.bind(apiClient);

  apiClient.get = (url: string, config?: AxiosRequestConfig) => {
    const key = config?.params
      ? `${url}\0${JSON.stringify(config.params)}`
      : url;

    const hit = pending.get(key);
    if (hit) return hit;

    const req = _get(url, config).finally(() => pending.delete(key));
    pending.set(key, req);
    return req;
  };
}