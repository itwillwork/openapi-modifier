import { fetchPetById } from './fetchPetById';
/// <reference path="./types/generated-api-types.d.ts" />

// Universal error type
export class ApiError<E = unknown> extends Error {
  code: number;
  details?: E;

  constructor(message: string, code: number, details?: E) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

// Universal result type
export type ApiResult<T, E = unknown> = [ApiError<E> | null, T | null];

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Base GET method
  async get<T, E = unknown>(path: string, options?: RequestInit): Promise<ApiResult<T, E>> {
    const url = `${this.baseUrl}${path}`;
    try {
      const res = await fetch(url, { ...options, method: 'GET' });
      if (!res.ok) {
        let details: E | undefined = undefined;
        try {
          details = await res.json();
        } catch {}
        const error: ApiError<E> = new ApiError(res.statusText, res.status, details);
        return [error, null];
      }
      const data = (await res.json()) as T;
      return [null, data];
    } catch (e: any) {
      const error: ApiError<E> = new ApiError(e?.message || 'Network error', -1);
      return [error, null];
    }
  }

  // Base POST method
  async post<T, E = unknown, P = unknown>(path: string, body?: P, options?: RequestInit): Promise<ApiResult<T, E>> {
    const url = `${this.baseUrl}${path}`;
    try {
      const res = await fetch(url, {
        ...options,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        let error: ApiError<E> = Object.assign(new Error(res.statusText), { code: res.status });
        let details: E | undefined = undefined;
        try {
          details = await res.json();
        } catch {}
        if (details) error.details = details;
        return [error, null];
      }
      const data = (await res.json()) as T;
      return [null, data];
    } catch (e: any) {
      const error: ApiError<E> = Object.assign(new Error(e?.message || 'Network error'), { code: -1 });
      return [error, null];
    }
  }

  // Base PUT method
  async put<T, E = unknown, P = unknown>(path: string, body?: P, options?: RequestInit): Promise<ApiResult<T, E>> {
    const url = `${this.baseUrl}${path}`;
    try {
      const res = await fetch(url, {
        ...options,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        let error: ApiError<E> = Object.assign(new Error(res.statusText), { code: res.status });
        let details: E | undefined = undefined;
        try {
          details = await res.json();
        } catch {}
        if (details) error.details = details;
        return [error, null];
      }
      const data = (await res.json()) as T;
      return [null, data];
    } catch (e: any) {
      const error: ApiError<E> = Object.assign(new Error(e?.message || 'Network error'), { code: -1 });
      return [error, null];
    }
  }

  // Specific method for fetchPetById, using the base get
  async fetchPetByIdSafe(petId: number): Promise<ApiResult<Paths.GetPetById.Responses.$200, Paths.GetPetById.Responses.$404>> {
    return this.get<Paths.GetPetById.Responses.$200, Paths.GetPetById.Responses.$404>(`/api/v3/pet/${petId}`);
  }
} 