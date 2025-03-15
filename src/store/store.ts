import { configureStore, PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { QueryExecResult } from "sql.js";
import { Block } from "@blocknote/core";

const inputSlice = createSlice({
  name: "query",
  initialState: { value: "--its queryin' time\nSELECT * FROM oraczen" },
  reducers: {
    updateQuery: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

const outputSlice = createSlice({
  name: "query",
  initialState: {
    value: null as QueryExecResult[] | null,
    duration: null as string | null,
  },
  reducers: {
    updateResult: (
      state,
      action: PayloadAction<{ value: QueryExecResult[]; duration: string }>,
    ) => {
      state.value = action.payload.value;
      state.duration = action.payload.duration;
    },
  },
});

const docsSlice = createSlice({
  name: "docs",
  initialState: { value: [] as Block[] },
  reducers: {
    updateDocs: (state, action: PayloadAction<Block[]>) => {
      state.value = action.payload;
    },
  },
});

// Export Actions
export const { updateQuery } = inputSlice.actions;
export const { updateResult } = outputSlice.actions;
export const { updateDocs } = docsSlice.actions;

// Create Store
export const store = configureStore({
  reducer: {
    queryInput: inputSlice.reducer,
    queryOutput: outputSlice.reducer,
    docsUpdate: docsSlice.reducer,
  },
});

// Store Type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
