"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateSchema } from "@/store/store";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { ConfigTypes } from "../playground/page";

const backendURL = process.env.NEXT_PUBLIC_QUERY_BACKEND || ""; // Handle undefined case

const Page = () => {
  const router = useRouter();
  const [config, setConfig] = useState<ConfigTypes>({
    provider: "pg",
    connection_string: null,
  });
  const [connecting, setConnecting] = useState(false);
  const [sqliteFile, setSqliteFile] = useState<File | null>(null);

  //storing the scheam
  const dispatch = useDispatch();

  const handleProviderChange = (value: string) => {
    setConfig((prev) => ({ ...prev, provider: value }));
  };

  const handleConnectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig((prev) => ({
      ...prev,
      connection_string: e.target.value.trim(),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".sqlite")) {
      toast.error("Invalid file type. Please upload a .sqlite file.");
      return;
    }

    setSqliteFile(file);
  };

  const handleConnect = async () => {
    if (config.provider !== "local" && config.connection_string === "") return;

    if (config.provider === "local") {
      sessionStorage.setItem(
        "config",
        JSON.stringify({ ...config, connection_string: null }),
      );
      router.push("/playground");
      return;
    }

    try {
      setConnecting(true);

      if (!backendURL) throw new Error("Backend URL is not set");

      const response = await fetch(`${backendURL}validate_connection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connection_string: config.connection_string }),
      });

      if (!response.ok)
        throw new Error(`Invalid server response: ${response.status}`);
      const result = await response.json();

      if (result.success) {
        sessionStorage.setItem("config", JSON.stringify(config));
        dispatch(updateSchema(result.data));
        router.push("/playground");
      } else {
        toast.error(`Connection failed: ${result.erro}`);
        setConnecting(false);
      }
    } catch (error) {
      if (error instanceof Error)
        toast.error(`Failed to connect: ${error.message}`);
      else toast.error("Something went wrong");
      setConnecting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <div className="text-right">SELECT YOUR DATABASE</div>
      <Tabs defaultValue="connection" className="h-[400px] w-[400px]">
        <TabsList>
          <TabsTrigger value="connection">Connect</TabsTrigger>
          <TabsTrigger value="local">Local</TabsTrigger>
        </TabsList>
        <TabsContent value="connection">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Select a provider</CardTitle>
              <CardDescription>
                We're bringing more integrations soon!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-full w-full flex-col items-center justify-between">
              <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <ToggleGroup
                  type="single"
                  className="h-[100px] w-[300px] gap-2"
                  value={config.provider}
                  onValueChange={handleProviderChange} // ✅ Now updates state
                >
                  <ToggleGroupItem value="pg" className="h-full w-full">
                    <Image
                      src="/images/pg.svg"
                      alt="pg"
                      width={40}
                      height={40}
                    />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="b" className="h-full w-full">
                    B
                  </ToggleGroupItem>
                  <ToggleGroupItem value="c" className="h-full w-full">
                    C
                  </ToggleGroupItem>
                </ToggleGroup>
                <div className="flex w-full flex-col gap-2">
                  <Label htmlFor="connectionString">Connection URL</Label>
                  <Input
                    id="connectionString"
                    onChange={handleConnectionChange}
                    value={config.connection_string || ""}
                    disabled={connecting}
                  />
                </div>
              </div>
              <div className="flex w-full justify-end">
                <Button onClick={handleConnect} disabled={connecting}>
                  {connecting ? "Working my magic" : "Connect"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="local">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Local Database</CardTitle>
              <CardDescription>
                Upload a .sqlite file or start with an in-browser DB
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-full flex-col justify-between">
              <div className="flex flex-col gap-2">
                <Label htmlFor="sqlite">.sqlite file</Label>
                <Input
                  id="sqlite"
                  type="file"
                  accept=".sqlite"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex w-full justify-end">
                <Button disabled={connecting || !sqliteFile}>
                  {connecting ? "Uploading..." : "Use Local"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
