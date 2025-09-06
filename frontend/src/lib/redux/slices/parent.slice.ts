import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { QUERY_KEY } from "@/constants/querry-key";
import api from "@/lib/axios";
import type { RootState } from "@/lib/redux/stores";

export interface Parent {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface ParentsState {
  parents: Parent[];
  loading: boolean;
  error: string | null;
}

const initialState: ParentsState = {
  parents: [],
  loading: false,
  error: null,
};

export const fetchParents = createAsyncThunk<Parent[]>(
  `${QUERY_KEY.PARENTS}/fetchParents`,
  async () => {
    const response = await api.get<Parent[]>(`/${QUERY_KEY.PARENTS}`);
    return response.data;
  }
);

const parentsSlice = createSlice({
  name: QUERY_KEY.PARENTS,
  initialState,
  reducers: {
    addParent: (state, action: PayloadAction<Parent>) => {
      state.parents.push(action.payload);
    },
    updateParent: (state, action: PayloadAction<Parent>) => {
      const index = state.parents.findIndex(
        (parent) => parent.id === action.payload.id
      );
      if (index !== -1) state.parents[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParents.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchParents.fulfilled,
        (state, action: PayloadAction<Parent[]>) => {
          state.parents = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchParents.rejected, (state, action) => {
        state.error = action.error.message || "Lấy dữ liệu thất bại";
        state.loading = false;
      });
  },
});

export const { addParent, updateParent } = parentsSlice.actions;
export const selectParents = (state: RootState) => state.parents.parents;
export const selectLoading = (state: RootState) => state.parents.loading;
export const selectError = (state: RootState) => state.parents.error;
export default parentsSlice.reducer;
