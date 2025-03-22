"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface dbConnection {
  provider: string;
  connection_string: string;
}

const backendURL = process.env.NEXT_PUBLIC_QUERY_BACKEND;

const Page = () => {
  const router = useRouter();
  const [config, setConfig] = useState<dbConnection>({
    provider: "pg",
    connection_string: "",
  });
  const [connecting, setConnecting] = useState(false);

  const handleProviderChange = (value: string) => {
    setConfig({ ...config, provider: value });
  };

  const handleConnectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, connection_string: e.target.value.trim() });
  };

  const handleConnect = async () => {
    if (config.provider != "local" && config.connection_string === "") return;

    //add an option for user to upload their own .sqlite file
    if (config.provider === "local") {
      sessionStorage.setItem(
        "config",
        JSON.stringify({ ...config, connection_string: null }),
      );
      router.push("/playground");
    }

    try {
      setConnecting(true);

      const response = await fetch(`${backendURL}validate_connection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ connection_string: config.connection_string }),
      });

      const result = await response.json();

      if (result.success) {
        //launch toast here
        sessionStorage.setItem("config", JSON.stringify(config));
        router.push("/playground");
      } else {
        console.log("not workign cuh");
      }
    } catch (error) {
      if (error instanceof Error)
        console.error("Failed to connect", error.message);
      else console.error("Unknown error while connecting");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="flex gap-4">
      <div>
        <RadioGroup
          value={config.provider}
          onValueChange={handleProviderChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pg" id="pg" />
            <Label htmlFor="pg">Postgres</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mysql" id="mysql" />
            <Label htmlFor="mysql">MySQL</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="local" id="local" />
            <Label htmlFor="local">local</Label>
          </div>
        </RadioGroup>
      </div>
      {/* need to make some sort of form that dynamically asks on info based on selected radio gropu */}
      {config.provider === "local" ? (
        <></>
      ) : (
        <div className="grid">
          <Label htmlFor="connectionString">Connection URL</Label>
          <Input
            id="connectionString"
            onChange={handleConnectionChange}
            value={config.connection_string}
          />
        </div>
      )}
      <div>
        <Button onClick={handleConnect} disabled={connecting}>
          Connect
        </Button>
      </div>
    </div>
  );
};

export default Page;
