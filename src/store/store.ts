import { configureStore, PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { Block } from "@blocknote/core";
import { MessageTypes } from "@/app/comps/tabs/Conversation";
import { Metadata } from "@/utils/metadata";
import { RowData } from "@/utils/sqlEngine";

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
    value: null as RowData[] | null,
    duration: null as string | null,
  },
  reducers: {
    updateResult: (
      state,
      action: PayloadAction<{ value: RowData[]; duration: string }>,
    ) => {
      state.value = action.payload.value;
      state.duration = action.payload.duration;
    },
  },
});

const schemaSlice = createSlice({
  name: "schema",
  initialState: { value: {} as Metadata },
  reducers: {
    updateSchema: (state, action: PayloadAction<Metadata>) => {
      state.value = action.payload;
    },
  },
});

const docsSlice = createSlice({
  name: "docs",
  initialState: { value: [] as Block[], loading: false },
  reducers: {
    updateDocs: (state, action: PayloadAction<Block[]>) => {
      state.value = action.payload;
    },
    loadDocs: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    value: [] as MessageTypes[],
    userInput: "" as string,
    thinking: false,
  },
  reducers: {
    updateChat: (state, action: PayloadAction<MessageTypes[]>) => {
      state.value = [...state.value, ...action.payload];
    },
    removeMessage: (state, action: PayloadAction<number>) => {
      if (action.payload > 0 && action.payload <= state.value.length) {
        state.value.splice(-action.payload, action.payload);
      }
    },
    updateUserInput: (state, action: PayloadAction<string>) => {
      state.userInput = action.payload;
    },
  },
});

// Export Actions
export const { updateQuery } = inputSlice.actions;
export const { updateResult } = outputSlice.actions;
export const { updateSchema } = schemaSlice.actions;
export const { updateDocs, loadDocs } = docsSlice.actions;
export const { updateChat, removeMessage, updateUserInput } = chatSlice.actions;

// Create Store
export const store = configureStore({
  reducer: {
    queryInput: inputSlice.reducer,
    queryOutput: outputSlice.reducer,
    schemaUpdate: schemaSlice.reducer,
    docsUpdate: docsSlice.reducer,
    docsLoad: docsSlice.reducer,
    chatUpdate: chatSlice.reducer,
    chatRemove: chatSlice.reducer,
    userInputUpdate: chatSlice.reducer,
  },
});

// Store Type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
