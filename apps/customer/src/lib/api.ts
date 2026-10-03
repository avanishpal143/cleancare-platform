import axios, { AxiosError, AxiosInstance } from 'axios';
import type { ApiResponse } from '@cleancare/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://cleancare-platform.onrender.com/api';

// ---- Axios instance ----
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ---- Request interceptor — attach JWT ----
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('cc_access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Response interceptor — refresh token on 401 ----
let isRefreshing = false;
let failedQueue: Array<{ resolve: (t: string) => void; reject: (e: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token!)
  );
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status === 401 && !original?._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers!.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('cc_refresh_token');
      if (!refreshToken) {
        isRefreshing = false;
        clearAuth();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
          `${API_URL}/auth/refresh`,
          { refreshToken }
        );
        const newToken = data.data!.accessToken;
        localStorage.setItem('cc_access_token', newToken);
        localStorage.setItem('cc_refresh_token', data.data!.refreshToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export function clearAuth() {
  localStorage.removeItem('cc_access_token');
  localStorage.removeItem('cc_refresh_token');
  localStorage.removeItem('cc_user');
}

// ---- Helper to extract data or throw friendly error ----
export async function apiGet<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  const { data } = await api.get<ApiResponse<T>>(path, { params });
  if (!data.success) throw new Error(data.error || 'Request failed');
  return data.data as T;
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const { data } = await api.post<ApiResponse<T>>(path, body);
  if (!data.success) throw new Error(data.error || 'Request failed');
  return data.data as T;
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  const { data } = await api.put<ApiResponse<T>>(path, body);
  if (!data.success) throw new Error(data.error || 'Request failed');
  return data.data as T;
}

export async function apiDelete<T>(path: string): Promise<T> {
  const { data } = await api.delete<ApiResponse<T>>(path);
  if (!data.success) throw new Error(data.error || 'Request failed');
  return data.data as T;
}

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const msg = (error.response?.data as ApiResponse)?.error;
    if (msg) return msg;
    if (error.response?.status === 429) return 'Too many requests. Please wait a moment.';
    if (error.response?.status === 503) return 'Service temporarily unavailable.';
    if (error.code === 'ECONNABORTED') return 'Request timed out. Check your connection.';
    if (!error.response) return 'No internet connection.';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}

export default api;
