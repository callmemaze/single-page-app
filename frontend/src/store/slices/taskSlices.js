import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/task/" }),
  endpoints: (builder) => ({
    createTask: builder.mutation({
      query: (task) => {
        return {
          url: "/create-task",
          method: "POST",
          body: task,
          credentials: "include",
        };
      },
    }),
    getTask: builder.query({
      query: () => {
        return {
          url: `/`,
          method: "GET",
          credentials: "include",
        };
      },
    }),
    deleteTask: builder.mutation({
      query: (id) => {
        return {
          url: `/delete/${id}`,
          method: "DELETE",
          credentials: "include",
        };
      },
    }),
    updateTask: builder.mutation({
      query: (args) => {
        const { id, values } = args;
        return {
          url: `/update/${id}`,
          method: "POST",
          body: values,
          credentials: "include",
        };
      },
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetTaskQuery,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} = taskApi;
