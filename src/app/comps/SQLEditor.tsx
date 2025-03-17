"use client";

import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { RootState, updateQuery } from "@/store/store";
import Editor from "@monaco-editor/react";
import { format } from "sql-formatter";

import { getSchema } from "@/utils/schema";

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

  //no error block here
  const reqAutocomplete = async (prompt: string) => {
    const description = prompt;
    const dbSchema = getSchema();
    const response = await fetch("/api/sqlgen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description, dbSchema }),
    });

    const result = await response.json();
    setLoading(false);

    if (result.query) {
      const cleanedQuery = result.query.replace(/^```sql\s+|```$/g, "").trim();
      return cleanedQuery;
    } else {
      console.error("Error:", result.error);
    }
  };

  const handleQueryExec = () => {
    console.log("something fired");
    exec(value);
  };

  return (
    <div className="flex h-full flex-col justify-between p-2">
      <div className="flex items-center justify-between">
        <h1>Query</h1>
        <Button onClick={handleQueryExec}>Run</Button>
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
