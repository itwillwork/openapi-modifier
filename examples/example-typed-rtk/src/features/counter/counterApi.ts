/// <reference path="../../api/types/generated-counter-api-types.d.ts" />

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const counterApi = createApi({
  reducerPath: 'counterApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4010/api' }),
  endpoints: (builder) => ({
    getCounter: builder.query<Paths.GetCounter.Responses.$200, Paths.GetCounter.QueryParameters>({
      query: (params) => ({
        url: '/counter',
        params,
      }),
    }),
    saveCounter: builder.mutation<
      Paths.SaveCounter.Responses.$200,
      Paths.SaveCounter.RequestBody
    >({
      query: (body) => ({
        url: '/counter',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetCounterQuery, useSaveCounterMutation } = counterApi; 