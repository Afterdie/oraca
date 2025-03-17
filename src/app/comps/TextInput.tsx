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

  const handleButtonClick = () => {
    if (prompt.trim() && !loading) {
      generate(prompt);
      setPrompt("");
    }
  };

  return (
    <div className="absolute bottom-0 left-0 flex h-full w-full items-end justify-center">
      <div className="z-50 flex h-[80%] w-[70%] max-w-[400px] justify-between rounded-3xl border bg-white p-2 transition-all duration-300 ease-in-out hover:-translate-y-2">
        <Textarea
          className="resize-none border-none pl-2 focus-visible:ring-0"
          placeholder="Talk to your database"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex h-full items-end">
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
