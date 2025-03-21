"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RootState,
  updateQuery,
  removeMessage,
  updateChat,
  updateUserInput,
} from "@/store/store";
import { getMetadata } from "@/utils/schema";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const TextInput = () => {
  const [loading, setLoading] = useState(false);
  const queryEditorValue = useSelector(
    (state: RootState) => state.queryInput.value,
  );
  const dispatch = useDispatch();

  const getReply = async (userInput: string, query: string | null) => {
    dispatch(updateChat([{ content: userInput, time: Date.now() }]));
    setLoading(true);

    const config = sessionStorage.getItem("config");
    if (!config) return;

    try {
      const backendURL = process.env.NEXT_PUBLIC_QUERY_BACKEND;
      const config = sessionStorage.getItem("config");
      if (!config) return;

      const parsedConfig = JSON.parse(config);
      let metadata = null;
      const connection_string = parsedConfig.connection_string;

      if (!connection_string) metadata = getMetadata();

      console.log({ userInput, query, connection_string, metadata });
      const response = await fetch(`${backendURL}chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput, query, connection_string, metadata }),
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        const message = result.data.message || "Nothing much to say.";
        dispatch(updateChat([{ content: message, time: Date.now() }]));

        const query = result.data.query;
        if (query) dispatch(updateQuery(query));
      }
    } catch (error) {
      if (error instanceof Error)
        console.error("Failed to get reply", error.message);
      else console.error("Unknown error while generating reply");
      removeLastMessage();
    } finally {
      setLoading(false);
    }
  };

  const removeLastMessage = () => {
    dispatch(removeMessage());
  };
  const userInput = useSelector(
    (state: RootState) => state.userInputUpdate.userInput,
  );

  const [includeQuery, setIncludeQuery] = useState(false);
  let query: string | null = null;

  const handleButtonClick = () => {
    if (userInput.trim() && !loading) {
      if (includeQuery) query = queryEditorValue;
      getReply(userInput, query);
      dispatch(updateUserInput(""));
    }
  };

  return (
    <div className="absolute bottom-0 flex w-full items-end justify-center">
      <div className="z-50 flex max-h-[190px] w-[70%] max-w-[400px] flex-col gap-2 rounded-3xl border bg-white p-2 transition-all duration-300 ease-in-out hover:-translate-y-2">
        <Textarea
          className="w-full resize-none border-none pl-2 focus-visible:ring-0"
          placeholder="Talk to your database"
          value={userInput}
          onChange={(e) => dispatch(updateUserInput(e.target.value))}
        />
        <div className="flex flex-row justify-between">
          <Button
            onClick={() => setIncludeQuery(!includeQuery)}
            className={`rounded-4xl border-2 ${includeQuery ? "border-blue-400 bg-blue-100 text-blue-400 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-400" : "border-slate-400 bg-slate-100 text-slate-400 hover:border-blue-400 hover:bg-blue-100 hover:text-blue-400"}`}
            disabled={loading}
          >
            Query
          </Button>

          <Button
            className="rounded-4xl"
            disabled={loading}
            onClick={handleButtonClick}
          >
            Run
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextInput;
