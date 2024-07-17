import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./slices/userSlices.js";
import { setupListeners } from "@reduxjs/toolkit/query";
import { taskApi } from "./slices/taskSlices.js";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(taskApi.middleware),
});
setupListeners(store.dispatch);

export default store;
