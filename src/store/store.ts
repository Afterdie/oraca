import { configureStore, PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { QueryExecResult } from "sql.js";
import { Block } from "@blocknote/core";
import { MessageTypes } from "@/app/comps/tabs/Conversation";

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

const schemaSlice = createSlice({
  name: "schema",
  initialState: { value: null as QueryExecResult[] | null },
  reducers: {
    updateSchema: (state, action: PayloadAction<QueryExecResult[]>) => {
      state.value = action.payload;
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

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    value: [] as MessageTypes[],
  },
  reducers: {
    updateChat: (state, action: PayloadAction<MessageTypes[]>) => {
      state.value = [...state.value, ...action.payload];
    },
    removeMessage: (state) => {
      if (state.value.length > 0) {
        state.value.pop(); // Remove last entry from array
      }
    },
  },
});

// Export Actions
export const { updateQuery } = inputSlice.actions;
export const { updateResult } = outputSlice.actions;
export const { updateSchema } = schemaSlice.actions;
export const { updateDocs } = docsSlice.actions;
export const { updateChat, removeMessage } = chatSlice.actions;

// Create Store
export const store = configureStore({
  reducer: {
    queryInput: inputSlice.reducer,
    queryOutput: outputSlice.reducer,
    schemaUpdate: schemaSlice.reducer,
    docsUpdate: docsSlice.reducer,
    chatUpdate: chatSlice.reducer,
    chatRemove: chatSlice.reducer,
  },
});

// Store Type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
