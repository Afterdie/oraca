"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateDocs, loadDocs, RootState } from "@/store/store";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { getMetadata } from "@/utils/metadata";

const Docs = () => {
  // Creates a new editor instance.
  const docs = useSelector((state: RootState) => state.docsUpdate);
  const blocks = docs.value;
  const loading = docs.loading;
  const dispatch = useDispatch();
  const editor = useCreateBlockNote({
    initialContent: blocks.length > 0 ? blocks : undefined,
  });

  const backendURL = process.env.NEXT_PUBLIC_QUERY_BACKEND;
  const [config, setConfig] = useState<{
    connection_string: string | null;
    provider: string | null;
  } | null>({
    connection_string: null,
    provider: null,
  });

  useEffect(() => {
    const storedConfig = sessionStorage.getItem("config");
    if (storedConfig) setConfig(JSON.parse(storedConfig));
  }, []);

  const handleGenerate = async () => {
    let attempts = 0;
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds

    while (attempts <= maxRetries) {
      try {
        if (!config) throw new Error("Reconnect to database");
        dispatch(loadDocs(true));

        const connection_string = config.connection_string;
        const local_schema = connection_string
          ? null
          : getMetadata().local_schema;

        const response = await fetch(`${backendURL}docs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ connection_string, local_schema }),
        });

        if (!response.ok)
          throw new Error(`Invalid server response ${response.status}`);

        const result = await response.json();

        if (result.success) {
          const blocks = result.data;
          editor.insertBlocks(blocks, editor.document[0], "before");

          dispatch(updateDocs(editor.document));
          toast.success("Documentation has been generated 🔖");
          return; // Exit on success
        } else {
          throw new Error("Failed to generate docs, retrying...");
        }
      } catch (error) {
        //hacky fix
        console.log("Error generating Docs:", error);
        attempts++;
        toast.info(`Retrying... (${attempts}/${maxRetries})`);

        if (attempts > maxRetries) {
          toast.error("Failed to generate docs after multiple attempts.");
          break;
        }

        await new Promise((res) => setTimeout(res, retryDelay)); // Wait before retrying
      } finally {
        dispatch(loadDocs(false));
      }
    }
  };

  // Renders the editor instance using a React component.
  return (
    <div className="relative h-full w-full">
      <Card
        className={`h-full w-full overflow-hidden p-0 transition-all duration-300 ease-in-out ${blocks.length > 0 ? "" : "bg-transparent"}`}
      >
        <CardContent className="h-full w-full overflow-y-auto p-6 px-0 pb-12">
          {blocks.length > 0 ? (
            <BlockNoteView
              editor={editor}
              theme={"light"}
              onChange={() => {
                dispatch(updateDocs(editor.document));
              }}
            />
          ) : (
            //displayed when the user hasnt generate the documentation yet
            //loading flag shows alternate animations
            <>
              <div className="relative z-50 flex h-full w-full flex-col items-center justify-center gap-6">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Image
                    src="/images/icons/docs.gif"
                    alt="Documentation icon"
                    height={150}
                    width={150}
                  />
                  <p className="text-secondary text-3xl font-semibold">
                    Understand your database better 📖
                  </p>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  variant={"secondary"}
                >
                  {!loading ? "Generate" : "Working on it ⏰!"}
                </Button>
              </div>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Docs;
