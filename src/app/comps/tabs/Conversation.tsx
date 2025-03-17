"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateChat, RootState } from "@/store/store";

import TextInput, { TextInputProps } from "../TextInput";
import { Card, CardContent } from "@/components/ui/card";
import Chatbubble, { ChatbubbleTypes } from "../Chatbubble";

export interface MessageTypes {
  content: string;
  time: number;
}

const Conversation = () => {
  const [loading, setLoading] = useState(false);
  const chats = useSelector((state: RootState) => state.chatUpdate.value);
  const dispatch = useDispatch();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleGenerate = async (prompt: string) => {
    const submissionTime = Date.now();
    try {
      setLoading(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const result = await response.json();

      if (result.reply) {
        dispatch(
          updateChat([
            { content: prompt, time: submissionTime },
            { content: result.reply, time: Date.now() },
          ]),
        );
      }
    } catch (error) {
      if (error instanceof Error)
        console.error("Failed to get reply", error.message);
      else console.error("Unknown error while generating reply");
    } finally {
      setLoading(false);
    }
  };

  const props: TextInputProps = {
    generate: handleGenerate,
    loading: loading,
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <Card className="h-full w-full pb-4">
      <CardContent className="flex h-full w-full flex-col justify-between overflow-hidden">
        <div className="flex flex-3 flex-col gap-2 overflow-y-auto">
          {chats.map((c, index) => {
            const props: ChatbubbleTypes = {
              content: c.content,
              sender: index % 2 == 0,
            };
            return <Chatbubble key={index} {...props} />;
          })}

          {/* invis element for scrolling to latest msg*/}
          <div ref={messagesEndRef} />
        </div>

        <div className="relative flex-1">
          <TextInput {...props} />
        </div>
      </CardContent>
    </Card>
  );
};

export default Conversation;
