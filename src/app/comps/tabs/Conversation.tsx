"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";
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
    <div className="relative h-full w-full">
      <Card
        className={`relative z-50 h-full w-full pb-4 transition-all duration-300 ${chats.length > 0 ? "" : "bg-transparent"}`}
      >
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
            <div className="flex flex-3 flex-col items-center justify-center gap-4">
              <Image
                src="/images/icons/conversation.gif"
                alt="Chatting icon"
                height={150}
                width={150}
              />
              <p className="text-secondary text-3xl font-semibold">
                Oraca says hello 👋
              </p>
            </div>
          )}

          <div className="relative flex-1">
            <TextInput />
          </div>
        </CardContent>
      </Card>
      <div
        className="absolute inset-0 z-0 h-full w-full"
        style={{
          WebkitMaskImage:
            "radial-gradient(circle, rgba(0,0,0,1) 5%, rgba(0,0,0,0) 100%)",
          maskImage:
            "radial-gradient(circle, rgba(0,0,0,1) 5%, rgba(0,0,0,0) 100%)",
        }}
      >
        <div className="h-full w-full bg-transparent bg-[radial-gradient(circle,rgba(255,255,255,0.6)_0.7px,transparent_0.7px)] bg-[size:15px_15px]"></div>
      </div>
    </div>
  );
};

export default Conversation;
