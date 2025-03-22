"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import TextInput from "../TextInput";
import { Card, CardContent } from "@/components/ui/card";
import Chatbubble, { ChatbubbleTypes } from "../Chatbubble";
import { VisualiseBubbleProps } from "../VisualiseBubble";

export interface ContentTypes {
  message: string;
  graph: VisualiseBubbleProps | null;
}
export interface MessageTypes {
  content: ContentTypes;
  time: number;
  thinking: boolean;
}

const Conversation = () => {
  const chats = useSelector((state: RootState) => state.chatUpdate.value);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <Card className="h-full w-full pb-4">
      <CardContent className="flex h-full w-full flex-col justify-between overflow-hidden">
        {chats.length > 0 ? (
          <div className="flex flex-3 flex-col gap-4 overflow-y-auto">
            {chats.map((c, index) => {
              const props: ChatbubbleTypes = {
                content: c.content,
                thinking: c.thinking,
                sender: index % 2 == 0,
              };
              return <Chatbubble key={index} {...props} />;
            })}

            {/* invis element for scrolling to latest msg*/}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex flex-3 flex-col items-center justify-center">
            <div>image here</div>
            <div>Start Chatting !</div>
          </div>
        )}

        <div className="relative flex-1">
          <TextInput />
        </div>
      </CardContent>
    </Card>
  );
};

export default Conversation;
