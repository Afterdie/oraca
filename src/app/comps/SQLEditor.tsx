"use client";

import { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { RootState, updateQuery } from "@/store/store";
import Editor from "@monaco-editor/react";
import { format } from "sql-formatter";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getMetadata } from "@/utils/metadata";

//shadcn imports
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { executeQuery } from "@/utils/sqlEngine";
import { updateResult } from "@/store/store";

const SQLEditor = () => {
  const backendURL = process.env.NEXT_PUBLIC_QUERY_BACKEND;
  const dispatch = useDispatch();

  const [config, setConfig] = useState<{
    connection_string: string | null;
    provider: string | null;
  }>({
    connection_string: null,
    provider: null,
  });
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  useEffect(() => {
    const storedConfig = sessionStorage.getItem("config");
    if (storedConfig) setConfig(JSON.parse(storedConfig));
  }, []);

  //clearing the timeout on page unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [debounceTimeout]);

  const [loading, setLoading] = useState(false);

  const query = useSelector((state: RootState) => state.queryInput.value);

  const handleChange = (newQuery: string) => {
    if (debounceTimeout) clearTimeout(debounceTimeout);

    dispatch(updateQuery(newQuery));
    const timeout = setTimeout(async () => {
      //get the statements where person wants autofill
      //this needs some sort of logic to prevent the same on query from getting pushed again and again to the api
      const match = newQuery.match(/---(.*?)---/);
      let updatedQuery = newQuery;
      if (match && !loading) {
        setLoading(true);
        const prompt = match[1];
        const value = await reqAutocomplete(prompt); // Get cleaned value
        updatedQuery = newQuery.replace(match[0], value);
        toast.success("Query generated🧙‍♂️");
      }
      //reducer used here so that the message box has context of the editor
      dispatch(updateQuery(format(updatedQuery)));
    }, 2000);

    setDebounceTimeout(timeout);
  };

  const reqAutocomplete = async (prompt: string) => {
    const description = prompt;
    try {
      if (!config) throw new Error("");

      const connection_string = config.connection_string;
      const schema = connection_string ? null : getMetadata().schema;

      const response = await fetch(`${backendURL}nlp2sql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, connection_string, schema }),
      });
      if (!response.ok)
        throw new Error(`Invalid Server Response: ${response.status}`);
      const result = await response.json();

      return result.success ? result.data || "" : "";
    } catch (error) {
      if (error instanceof Error)
        toast.error(`Autocomplete error: ${error.message}`);
      else toast.error("Something went wrong");
      return "";
    } finally {
      setLoading(false);
    }
  };

  //if i add connectors then only this needs to be modified
  const handleExecuteQuery = async (): Promise<void> => {
    if (!query.trim()) return;
    //prevent default
    const result = await executeQuery(query, config.connection_string);

    if (result.success && result.data && result.duration) {
      dispatch(updateResult({ value: result.data, duration: result.duration }));
    } else {
      toast.error(result.error || "Failed to execute Query");
    }
  };

  return (
    <div className="flex h-full flex-col justify-between gap-2 p-2">
      <div className="flex items-center justify-between">
        {/* add  some type of label showing what db currentonl on*/}
        <div className="flex gap-4">
          <h1 className="font-semibold">Query Editor</h1>
          <Link href={"/"}>
            <Badge variant={"secondary"}>
              <div className="relative">
                <div className="absolute h-2 w-2 animate-ping rounded-full bg-green-400"></div>
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
              </div>

              <p>{config.provider}</p>
            </Badge>
          </Link>
        </div>
        <Button onClick={handleExecuteQuery} disabled={loading}>
          Run
        </Button>
      </div>
      <div>
        <Editor
          height="85vh"
          defaultLanguage="sql"
          value={query}
          onChange={(newQuery) => handleChange(newQuery ?? "")}
          options={{
            wordWrap: "on",
            minimap: { enabled: false },
            lineNumbersMinChars: 2,
            glyphMargin: false,
            folding: false,
          }}
        />
      </div>
    </div>
  );
};

export default SQLEditor;
