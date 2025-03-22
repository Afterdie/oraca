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

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { VisualiseBubbleProps } from "./VisualiseBubble";

const TextInput = () => {
  const [loading, setLoading] = useState(false);
  const queryEditorValue = useSelector(
    (state: RootState) => state.queryInput.value,
  );
  const dispatch = useDispatch();

  const getReply = async (userInput: string, query: string | null) => {
    dispatch(
      updateChat([
        {
          content: { message: userInput, graph: null },
          time: Date.now(),
          thinking: false,
        },
        {
          content: { message: "Hmmm lemme think 🤔...", graph: null },
          time: Date.now(),
          thinking: true,
        },
      ]),
    );
    setLoading(true);

    try {
      const backendURL = process.env.NEXT_PUBLIC_QUERY_BACKEND;
      const config = sessionStorage.getItem("config");
      if (!config) return;

      const parsedConfig = JSON.parse(config);
      let metadata = null;
      const connection_string = parsedConfig.connection_string;

      if (!connection_string) metadata = getMetadata();

      const response = await fetch(`${backendURL}chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput, query, connection_string, metadata }),
      });

      const result = await response.json();

      if (result.success) {
        const message: string = result.data.message || "Nothing much to say.";
        removeLastMessage();
        dispatch(
          updateChat([
            {
              content: { message: message, graph: null },
              time: Date.now(),
              thinking: false,
            },
          ]),
        );

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

  const getGraph = async (userInput: string, query: string | null) => {
    dispatch(
      updateChat([
        {
          content: { message: userInput, graph: null },
          time: Date.now(),
          thinking: false,
        },
        {
          content: {
            message: "Dotting the dots lining the lines 🧑‍🎨...",
            graph: null,
          },
          time: Date.now(),
          thinking: true,
        },
      ]),
    );
    setLoading(true);

    try {
      const backendURL = process.env.NEXT_PUBLIC_QUERY_BACKEND;
      const config = sessionStorage.getItem("config");
      if (!config) return;

      const parsedConfig = JSON.parse(config);
      let metadata = null;
      const connection_string = parsedConfig.connection_string;

      if (!connection_string) metadata = getMetadata();

      const response = await fetch(`${backendURL}graph`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput, query, connection_string, metadata }),
      });

      const result = await response.json();
      if (result.success) {
        const data = result.data;
        const message: string = data.message || "Nothing much to say.";

        const graph: VisualiseBubbleProps = {
          graph: data.graph.toLowerCase(),
          chartData: data.chartData,
        };

        removeLastMessage();
        dispatch(
          updateChat([
            {
              content: {
                message: message,
                graph: graph,
              },
              time: Date.now(),
              thinking: false,
            },
          ]),
        );
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

  const [includeQuery, setIncludeQuery] = useState(true);
  const [vis, setVis] = useState(false);
  let query: string | null = null;

  const handleButtonClick = () => {
    if (userInput.trim() && !loading) {
      if (includeQuery) query = queryEditorValue;
      if (vis)
        //absolutely no reason to query but oh well
        getGraph(userInput, query);
      else getReply(userInput, query);

      dispatch(updateUserInput(""));
    }
  };

  return (
    <div className="absolute bottom-0 flex w-full items-end justify-center">
      <div className="bg-muted-foreground/10 z-50 flex max-h-[190px] w-[70%] max-w-[400px] flex-col gap-2 rounded-3xl p-2 transition-all duration-300 ease-in-out hover:-translate-y-2">
        <Textarea
          className="w-full resize-none border-none pl-2 drop-shadow-none focus-visible:ring-0"
          placeholder="Ask Oraca questions about your database 🔍"
          value={userInput}
          onChange={(e) => dispatch(updateUserInput(e.target.value))}
        />
        <div className="flex flex-row justify-between">
          <div className="flex gap-2">
            <HoverCard>
              <HoverCardTrigger>
                <Button
                  onClick={() => setIncludeQuery(!includeQuery)}
                  className={`rounded-4xl border-2 hover:border-blue-400 hover:bg-blue-100 hover:text-blue-400 ${includeQuery ? "border-blue-400 bg-blue-100 text-blue-400" : "border-slate-400 bg-transparent text-slate-400"}`}
                  disabled={loading}
                >
                  Query
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="p-2 text-sm">
                Enabling this allows Oraca to access the query in the editor
              </HoverCardContent>
            </HoverCard>

            <Button
              onClick={() => setVis(!vis)}
              className={`rounded-4xl border-2 hover:border-blue-400 hover:bg-blue-100 hover:text-blue-400 ${vis ? "border-blue-400 bg-blue-100 text-blue-400" : "border-slate-400 bg-transparent text-slate-400"}`}
              disabled={loading}
            >
              Visualise
            </Button>
          </div>
          <Button
            className="rounded-4xl"
            disabled={loading}
            onClick={handleButtonClick}
          >
            run
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextInput;
