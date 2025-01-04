export type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
};

export type Tquery = Record<string, unknown>;
