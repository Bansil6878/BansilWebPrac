import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios';

const BASE_URL = 'https://rickandmortyapi.com/api';
const TIMEOUT_MS = 10000;
const RATE_LIMIT_RETRY_DELAY_MS = 1500;

type RetryConfig = InternalAxiosRequestConfig & {
  _rateLimitRetried?: boolean;
};

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
  },
});

export function isRateLimitError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 429;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** User-friendly message derived from an Axios or unknown error */
export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string }>;

    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }

    if (!axiosError.response) {
      return 'Network error. Check your internet connection.';
    }

    const status = axiosError.response.status;
    const serverMessage = axiosError.response.data?.error;

    if (status === 429) {
      return 'Too many requests. Please wait a moment.';
    }

    if (serverMessage) {
      return serverMessage;
    }

    if (status === 404) {
      return 'No results found.';
    }

    if (status >= 500) {
      return 'Server error. Please try again later.';
    }

    return `Request failed (${status}).`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong.';
}

function getFullUrl(config: { baseURL?: string; url?: string }): string {
  return `${config.baseURL ?? ''}${config.url ?? ''}`;
}

function rejectApiError(error: unknown): Promise<never> {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  const message = getApiErrorMessage(error);
  return Promise.reject(new ApiError(message, status));
}

apiClient.interceptors.request.use(config => {
  const method = config.method?.toUpperCase() ?? 'GET';
  const url = getFullUrl(config);
  console.log(`[API REQ] ${method} ${url}`, config.params ?? '');
  return config;
});

apiClient.interceptors.response.use(
  response => {
    console.log(
      `[API RES] ${response.status} ${response.config.url}`,
      response.data,
    );
    return response;
  },
  async (error: unknown) => {
    if (isAxiosError(error)) {
      console.log(
        `[API ERR] ${error.response?.status ?? 'NETWORK'} ${error.config?.url}`,
        error.response?.data ?? error.message,
      );

      const config = error.config as RetryConfig | undefined;
      if (error.response?.status === 429 && config && !config._rateLimitRetried) {
        config._rateLimitRetried = true;
        await delay(RATE_LIMIT_RETRY_DELAY_MS);
        return apiClient.request(config);
      }
    }

    return rejectApiError(error);
  },
);
