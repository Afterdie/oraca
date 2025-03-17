"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export interface TextInputProps {
  generate: (prompt: string) => void;
  loading: boolean;
}
export default function TextInput({ generate, loading }: TextInputProps) {
  const [prompt, setPrompt] = useState("");
  const [includeQuery, setIncludeQuery] = useState(false);

  const handleButtonClick = () => {
    if (prompt.trim() && !loading) {
      generate(prompt);
      setPrompt("");
    }
  };

  return (
    <div className="absolute bottom-0 flex w-full items-end justify-center">
      <div className="z-50 flex max-h-[190px] w-[70%] max-w-[400px] flex-col gap-2 rounded-3xl border bg-white p-2 transition-all duration-300 ease-in-out hover:-translate-y-2">
        <Textarea
          className="w-full resize-none border-none pl-2 focus-visible:ring-0"
          placeholder="Talk to your database"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
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
}
