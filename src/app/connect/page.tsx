"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateSchema } from "@/store/store";

import {
  Card,
  CardContent,
  CardDescription,
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

import { initializeDatabase } from "@/utils/sqlEngine";
import { setMetadata } from "@/utils/metadata";

const backendURL = process.env.NEXT_PUBLIC_QUERY_BACKEND || ""; // Handle undefined case

const Page = () => {
  const router = useRouter();
  const [config, setConfig] = useState<ConfigTypes>({
    provider: "pg",
    connection_string: null,
  });
  const [connecting, setConnecting] = useState(false);
  const [sqliteFile, setSqliteFile] = useState<File | null>(null);

  const [dbLoaded, setDBLoaded] = useState(false);
  const [loadingDB, setLoadingDB] = useState(false);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".sqlite")) {
      toast.error("Invalid file type. Please upload a .sqlite file.");
      return;
    }

    setSqliteFile(file);
  };

  //when button is clicked this function has two options
  // - local db (new or create from)
  // - online db (using the connection string)
  const handleConnect = async () => {
    console.log(config);
    if (config.provider !== "local" && config.connection_string === "") return;

    if (config.provider === "local") {
      try {
        setLoadingDB(true);
        const { schema } = await initializeDatabase(sqliteFile);
        if (!schema) throw new Error("Failed to init database");

        //this is needed for the global schema that flow page uses
        dispatch(updateSchema(schema));
        //this is for the local api calls provides schema for docs. nlp2sql
        setMetadata(schema);

        setDBLoaded(true);
        toast.success("Database loaded successfully");
        sessionStorage.setItem(
          "config",
          JSON.stringify({ ...config, connection_string: null }),
        );
        router.push("/playground");
      } catch (error) {
        if (error instanceof Error)
          toast.error(`Failed to load database: ${error.message}`);
        else toast.error("Something went wrong");
      } finally {
        setLoadingDB(false);
      }
      return;
    }

    //using connection string connecting to a db
    try {
      setConnecting(true);

      const response = await fetch(`${backendURL}validate_connection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connection_string: config.connection_string }),
      });

      if (!response.ok)
        throw new Error(`Invalid server response: ${response.status}`);
      const result = await response.json();

      if (result.success) {
        toast.success("Connected to DB successfully");
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
      <Tabs
        defaultValue="connection"
        className="h-[400px] w-[400px]"
        onValueChange={handleProviderChange}
      >
        <TabsList>
          <TabsTrigger value="connection">Connect</TabsTrigger>
          <TabsTrigger value="local">Local</TabsTrigger>
        </TabsList>
        <TabsContent value="connection">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Select a provider</CardTitle>
              <CardDescription>
                We&apos;re bringing more integrations soon!
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
                      alt="pg_logo"
                      width={50}
                      height={50}
                    />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="sqlite" className="h-full w-full">
                    <Image
                      src="/images/sqlite.svg"
                      alt="sqlite_logo"
                      width={70}
                      height={70}
                    />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="mysql" className="h-full w-full">
                    <Image
                      src="/images/mysql.svg"
                      alt="mysql_logo"
                      width={80}
                      height={80}
                    />
                  </ToggleGroupItem>
                </ToggleGroup>
                <div className="flex-co flex w-full gap-2">
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
                  disabled={loadingDB}
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex w-full justify-end">
                <Button
                  disabled={loadingDB || dbLoaded}
                  onClick={handleConnect}
                >
                  {loadingDB || dbLoaded
                    ? "Loading DB..."
                    : sqliteFile
                      ? "Use"
                      : "Create"}
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
