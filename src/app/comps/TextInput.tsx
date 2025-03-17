"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, updateUserInput } from "@/store/store";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export interface TextInputProps {
  generate: (userInput: string, query: string | null) => void;
  loading: boolean;
}
const TextInput = ({ generate, loading }: TextInputProps) => {
  const userInput = useSelector(
    (state: RootState) => state.userInputUpdate.userInput,
  );
  const dispatch = useDispatch();

  const [includeQuery, setIncludeQuery] = useState(false);
  let query: string | null = null;

  const handleButtonClick = () => {
    if (userInput.trim() && !loading) {
      if (includeQuery) query = ""; //get from somewher
      generate(userInput, query);
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
