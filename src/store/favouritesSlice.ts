import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addFavourite,
  getFavourites,
  removeFavourite,
} from '../services/favouritesDb';
import { Character } from '../types/api.types';

export interface FavouritesState {
  items: Character[];
  isLoaded: boolean;
  isLoading: boolean;
}

const initialState: FavouritesState = {
  items: [],
  isLoaded: false,
  isLoading: false,
};

export const loadFavouritesFromDb = createAsyncThunk(
  'favourites/load',
  async () => getFavourites(),
);

export const addFavouriteToDb = createAsyncThunk(
  'favourites/add',
  async (character: Character) => {
    await addFavourite(character);
    return character;
  },
);

export const removeFavouriteFromDb = createAsyncThunk(
  'favourites/remove',
  async (characterId: number) => {
    await removeFavourite(characterId);
    return characterId;
  },
);

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadFavouritesFromDb.pending, state => {
        state.isLoading = true;
      })
      .addCase(loadFavouritesFromDb.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoaded = true;
        state.isLoading = false;
      })
      .addCase(loadFavouritesFromDb.rejected, state => {
        state.isLoading = false;
      })
      .addCase(addFavouriteToDb.fulfilled, (state, action) => {
        const exists = state.items.some(c => c.id === action.payload.id);
        if (!exists) {
          state.items.push(action.payload);
        }
      })
      .addCase(removeFavouriteFromDb.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
      });
  },
});

export default favouritesSlice.reducer;

export function selectIsFavourite(
  favourites: Character[],
  characterId: number,
): boolean {
  return favourites.some(c => c.id === characterId);
}
