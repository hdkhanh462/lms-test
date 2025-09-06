import { configureStore } from "@reduxjs/toolkit";

import parentsReducer from "@/lib/redux/slices/parent.slice";

const store = configureStore({
  reducer: {
    parents: parentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
