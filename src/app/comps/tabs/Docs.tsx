"use client";

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

import { getMetadata } from "@/utils/schema";

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
    try {
      dispatch(loadDocs(true));

      if (!config) throw new Error("Reconnect to database");

      const connection_string = config.connection_string;
      //if the db is local then get schema
      const schema = connection_string ? null : getMetadata().schema;

      const response = await fetch(`${backendURL}docs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ connection_string, schema }),
      });

      if (!response.ok)
        throw new Error(`Invalid server response ${response.status}`);

      const result = await response.json();

      if (result.success) {
        const blocks = result.data;
        editor.insertBlocks(blocks, editor.document[0], "before");

        const newBlocks = editor.document;
        dispatch(updateDocs(newBlocks));
      } else toast.error(`Failed to generate docs: ${result.message}`);
      //dk about the lines above
    } catch (error) {
      if (error instanceof Error)
        toast.error(`Failed to generate docs: ${error.message}`);
      else toast.error("Something went wrong");
    } finally {
      toast.success("Documentation has been generated 🔖");
      dispatch(loadDocs(false));
    }
  };

  // Renders the editor instance using a React component.
  return (
    <Card className="h-full w-full overflow-hidden p-0">
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
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <div>image here</div>
            <Button onClick={handleGenerate} disabled={loading}>
              {!loading ? "Generate" : "Working on it ⏰!"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Docs;
