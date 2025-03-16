"use client";

import { useState } from "react";

export default function InteractiveForm() {
  const [tweet, setTweet] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const description = "testing this stuff";
    setLoading(true);

    const response = await fetch("/api/sqlgen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    });

    const result = await response.json();
    setLoading(false);

    if (result.query) {
      setTweet(result.query);
      console.log(result.query);
    } else {
      console.error("Error:", result.error);
    }
  };

  return (
    <div>
      <button onClick={handleSubmit}>bruh</button>
    </div>
  );
}
