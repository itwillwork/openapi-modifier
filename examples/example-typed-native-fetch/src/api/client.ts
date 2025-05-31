import { fetchPetById } from './fetchPetById';
/// <reference path="./types/generated-api-types.d.ts" />

// Типы для ошибок
interface FetchPetByIdNotFoundError extends Error {
  code: 404;
}

interface FetchPetByIdBadRequestError extends Error {
  code: 400;
}

interface FetchPetByIdDefaultError extends Error {
  code: number;
}

// Тип кортежа результата
export type FetchPetByIdResult = [
  FetchPetByIdNotFoundError | FetchPetByIdBadRequestError | FetchPetByIdDefaultError | null,
  Paths.GetPetById.Responses.$200 | null
];

// Универсальный тип ошибки
export interface ApiError<E = unknown> extends Error {
  code: number;
  details?: E;
}

// Универсальный тип результата
export type ApiResult<T, E = unknown> = [ApiError<E> | null, T | null];

// Базовый метод GET
export async function get<T, E = unknown>(url: string, options?: RequestInit): Promise<ApiResult<T, E>> {
  try {
    const res = await fetch(url, { ...options, method: 'GET' });
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

// Базовый метод POST
export async function post<T, E = unknown, P = unknown>(url: string, body?: P, options?: RequestInit): Promise<ApiResult<T, E>> {
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

// Базовый метод PUT
export async function put<T, E = unknown, P = unknown>(url: string, body?: P, options?: RequestInit): Promise<ApiResult<T, E>> {
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

// Объединяем методы в класс
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Базовый метод GET
  async get<T, E = unknown>(path: string, options?: RequestInit): Promise<ApiResult<T, E>> {
    const url = `${this.baseUrl}${path}`;
    try {
      const res = await fetch(url, { ...options, method: 'GET' });
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

  // Базовый метод POST
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

  // Базовый метод PUT
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

  // Специфичный метод для fetchPetById, использующий базовый get
  async fetchPetByIdSafe(petId: number): Promise<FetchPetByIdResult> {
    const [error, data] = await this.get<Paths.GetPetById.Responses.$200>(`/api/v3/pet/${petId}`);

    // Можно добавить специфическую обработку ошибок здесь, если нужно
    // Например, преобразовать стандартные ApiError в более специфичные ошибки PetById
    if (error) {
      if (error.code === 404) return [Object.assign(new Error(error.message), { code: 404 }), null] as FetchPetByIdResult;
      if (error.code === 400) return [Object.assign(new Error(error.message), { code: 400 }), null] as FetchPetByIdResult;
      return [Object.assign(new Error(error.message), { code: error.code }), null] as FetchPetByIdResult;
    }

    return [null, data];
  }
} 