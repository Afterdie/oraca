"use client";
import { useState, useEffect } from "react";
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
import { toast } from "sonner";

import { VisualiseBubbleProps } from "./VisualiseBubble";

const TextInput = () => {
  const backendURL = process.env.NEXT_PUBLIC_QUERY_BACKEND;

  const [config, setConfig] = useState<{
    connection_string: string | null;
    provider: string | null;
  } | null>({
    connection_string: null,
    provider: null,
  });

  useEffect(() => {
    const storedConfig = sessionStorage.getItem("config");
    if (storedConfig) setConfig(JSON.parse(storedConfig));
  }, []);

  const [loading, setLoading] = useState(false);

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
      if (!config) throw new Error("Reconnect to database");

      const connection_string = config.connection_string;
      const metadata = connection_string ? null : getMetadata();

      const response = await fetch(`${backendURL}chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput, query, connection_string, metadata }),
      });

      if (!response.ok)
        throw new Error(`Invalid server response ${response.status}`);

      const result = await response.json();

      if (result.success) {
        const message: string = result.data.message || "Nothing much to say.";
        dispatch(removeMessage());
        dispatch(
          updateChat([
            {
              content: { message: message, graph: null },
              time: Date.now(),
              thinking: false,
            },
          ]),
        );

        const newQuery = result.data.query;
        if (newQuery) dispatch(updateQuery(newQuery));
      } else toast.error(`Failed to get reply: ${result.message}`);
    } catch (error) {
      if (error instanceof Error)
        toast.error(`Failed to get reply: ${error.message}`);
      else toast.error("Something went wrong");
      dispatch(removeMessage());
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
      if (!config) throw new Error("Reconnect to db");

      const connection_string = config.connection_string;
      const metadata = connection_string ? null : getMetadata();

      const response = await fetch(`${backendURL}graph`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput, query, connection_string, metadata }),
      });

      if (!response.ok)
        throw new Error(`Invalid Server Response ${response.status}`);

      const result = await response.json();

      if (result.success) {
        const data = result.data;
        const message: string = data.message || "Nothing much to say.";

        const graph: VisualiseBubbleProps = {
          graph: data.graph.toLowerCase(),
          chartData: data.chartData,
        };

        dispatch(removeMessage());
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
        toast.error(`Failed to get reply ${error.message}`);
      else toast.error("Something went wrong");
      dispatch(removeMessage());
    } finally {
      setLoading(false);
    }
  };

  const userInput = useSelector(
    (state: RootState) => state.userInputUpdate.userInput,
  );

  const [includeQuery, setIncludeQuery] = useState(true);
  const [vis, setVis] = useState(false);
  const queryEditorValue = useSelector(
    (state: RootState) => state.queryInput.value,
  );

  const handleButtonClick = () => {
    if (userInput.trim() && !loading) {
      const query = includeQuery ? queryEditorValue : null;
      vis ? getGraph(userInput, query) : getReply(userInput, query);
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
