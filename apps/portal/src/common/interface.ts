export interface ErrorResponse {
  extensions?: {
    originalError?: {
      message?: string;
    };
  };
  message?: string;
}

export interface ResponseData {
  errors?: ErrorResponse[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}
