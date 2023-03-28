import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken } from './token';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

const BACKEND_URL = 'https://12.react.pages.academy/six-cities';
const REQUEST_TIMEOUT = 5000;
const TIMOUT_ERROR_CODE = 'ECONNABORTED';

const StatusCodeMapping: Record<number, boolean> = {
  [StatusCodes.BAD_REQUEST]: true,
  [StatusCodes.NOT_FOUND]: true
};

const shouldDisplayError = (response: AxiosResponse) => StatusCodeMapping[response.status];

const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT
  });

  api.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers['x-token'] = token;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ error: string }>) => {
      if (error && error.code === TIMOUT_ERROR_CODE) {
        toast.error(error.message, { toastId: TIMOUT_ERROR_CODE });
      }

      if (error.response && shouldDisplayError(error.response)) {
        toast.error(error.response.data.error, { toastId: BACKEND_URL });
      }

      throw error;
    });

  return api;
};

export { createAPI };
