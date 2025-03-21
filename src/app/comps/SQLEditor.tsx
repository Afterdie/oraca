"use client";

import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { RootState, updateQuery } from "@/store/store";
import Editor from "@monaco-editor/react";
import { format } from "sql-formatter";

import { getMetadata } from "@/utils/schema";

//shadcn imports
import { Button } from "@/components/ui/button";

//types
export interface SQLEditorProps {
  exec: (value: string) => void;
}

const SQLEditor = ({ exec }: SQLEditorProps) => {
  const value = useSelector((state: RootState) => state.queryInput.value);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const handleChange = (newValue: string) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    dispatch(updateQuery(newValue));
    const timeout = setTimeout(async () => {
      //get the statements where person wants autofill
      //this needs some sort of logic to prevent the same on query from getting pushed again and again to the api
      const match = newValue.match(/---(.*?)---/);
      let updatedValue = newValue;
      if (match && !loading) {
        const prompt = match[1];
        setLoading(true);
        const value = await reqAutocomplete(prompt); // Get cleaned value
        updatedValue = newValue.replace(match[0], value);
      }
      //reducer used here so that the message box has context of the editor
      dispatch(updateQuery(format(updatedValue)));
    }, 2000);

    setDebounceTimeout(timeout);
  };

  const reqAutocomplete = async (prompt: string) => {
    try {
      const description = prompt;
      //maybe editor does not need stats
      const dbSchema = getMetadata().schema;
      const response = await fetch("/api/gensql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, dbSchema }),
      });

      const result = await response.json();

      if (result.query) {
        const cleanedQuery = result.query
          .replace(/^```sql\s+|```$/g, "")
          .trim();
        return cleanedQuery;
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      if (error instanceof Error)
        console.error("Failed to autocomplete", error.message);
      else console.error("Unknown error while autocompleting");
    } finally {
      setLoading(false);
    }
  };

  const handleQueryExec = () => {
    console.log("something fired");
    exec(value);
  };

  return (
    <div className="flex h-full flex-col justify-between p-2">
      <div className="flex items-center justify-between">
        {/* add  some type of label showing what db currentonl on*/}
        <h1>Query Editor</h1>
        <Button onClick={handleQueryExec} disabled={loading}>
          Run
        </Button>
      </div>
      <div>
        <Editor
          height="85vh"
          defaultLanguage="sql"
          value={value}
          onChange={(newValue) => handleChange(newValue ?? "")}
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
