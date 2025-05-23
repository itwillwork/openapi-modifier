import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface CounterResponse {
  value: number;
}

interface CounterRequest {
  value: number;
}

export const counterApi = createApi({
  reducerPath: 'counterApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4010/api' }),
  endpoints: (builder) => ({
    getCounter: builder.query<CounterResponse, void>({
      query: () => 'counter',
    }),
    saveCounter: builder.mutation<CounterResponse, CounterRequest>({
      query: (body) => ({
        url: 'counter',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetCounterQuery, useSaveCounterMutation } = counterApi; 