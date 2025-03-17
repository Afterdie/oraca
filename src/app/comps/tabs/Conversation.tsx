"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface messageTypes {
  content: string;
  time: Date;
}

const Conversation = () => {
  const [messages, setMessages] = useState<messageTypes[] | null>(null);
  const [context, setContext] = useState<messageTypes[]>([])
  return (
    <Card className="h-full w-full gap-2 overflow-x-auto p-2">
      <CardContent className="w-full"></CardContent>
    </Card>
  );
};

export default Conversation;
