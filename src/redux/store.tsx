import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import ecomSlice from './ecomSlice'

export const store = configureStore({
  reducer: {
    ecom:ecomSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;