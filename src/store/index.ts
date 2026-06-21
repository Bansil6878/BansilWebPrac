import { configureStore } from '@reduxjs/toolkit';
import favouritesReducer from './favouritesSlice';
import filterReducer from './filterSlice';

export const store = configureStore({
  reducer: {
    filters: filterReducer,
    favourites: favouritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
