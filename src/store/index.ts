import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './userApi';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    // Handles userApi state
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),

  // Enable Redux DevTools only in development mode
  devTools: process.env.NODE_ENV !== 'production',
});

// RootState type represents the complete Redux state tree
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch type represents the dispatch function with correct typings
export type AppDispatch = typeof store.dispatch;
