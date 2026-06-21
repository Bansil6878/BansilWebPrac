import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CharacterGender, CharacterStatus } from '../types/api.types';

export interface FilterState {
  search: string;
  status: CharacterStatus | '';
  gender: CharacterGender | '';
}

const initialState: FilterState = {
  search: '',
  status: '',
  gender: '',
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setStatus(state, action: PayloadAction<CharacterStatus | ''>) {
      state.status = action.payload;
    },
    setGender(state, action: PayloadAction<CharacterGender | ''>) {
      state.gender = action.payload;
    },
    resetFilters(state) {
      state.search = '';
      state.status = '';
      state.gender = '';
    },
  },
});

export const { setSearch, setStatus, setGender, resetFilters } =
  filterSlice.actions;
export default filterSlice.reducer;
