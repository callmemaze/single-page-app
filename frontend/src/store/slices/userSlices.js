import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/auth/" }),
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (user) => {
        return {
          url: "/signup",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    loginUser: builder.mutation({
      query: (user) => {
        return {
          url: `/signin`,
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
        };
      },
    }),
    logoutUser: builder.mutation({
      query: () => {
        return {
          url: `/logout`,
          method: "POST",
          body: {},
          credentials: "include",
        };
      },
    }),
    getUser: builder.query({
      query: () => {
        return {
          url: `/me`,
          method: "GET",
          credentials: "include",
        };
      },
    }),
  }),
});

export const {
  useCreateUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUserQuery,
} = authApi;
