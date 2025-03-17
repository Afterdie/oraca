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

  const generate = async (prompt: string) => {
    dispatch(updateChat({ content: prompt, time: Date.now() }));

    //try catch stuff here
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4000);
    //build context window and make api call
  };

  const props: TextInputProps = {
    generate: generate,
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

          {/* invis element for scrolling to */}
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
