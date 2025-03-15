"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { format } from "sql-formatter";
import { useSelector, useDispatch } from "react-redux";
import { RootState, update } from "@/store/store";

//shadcn imports
import { Button } from "@/components/ui/button";

const SQLEditor = () => {
  const value = useSelector((state: RootState) => state.input.value);
  const dispatch = useDispatch();

  const [isTyping, setIsTyping] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const handleChange = (newValue: string) => {
    setIsTyping(true);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      dispatch(update(format(newValue)));
      setIsTyping(false);
    }, 1000);

    setDebounceTimeout(timeout);
  };

  return (
    <div className="flex h-full flex-col justify-between p-2">
      <div className="flex items-center justify-between">
        <h1>Query</h1>
        <Button>Run</Button>
      </div>
      <div>
        <Editor
          height="85vh"
          defaultLanguage="sql"
          value={value}
          onChange={(newValue) => handleChange(newValue ?? "")}
          options={{
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
