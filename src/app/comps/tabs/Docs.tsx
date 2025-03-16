"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateDocs, RootState } from "@/store/store";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BlockEditor() {
  // Creates a new editor instance.
  const blocks = useSelector((state: RootState) => state.docsUpdate.value);
  const dispatch = useDispatch();
  const editor = useCreateBlockNote({
    initialContent: blocks.length > 0 ? blocks : undefined,
  });

  const [loading, setLoading] = useState(false);
  const handleGenerate = () => {
    setLoading(true);
    //make the api call pass the entire schema in there and then
    //call dispatch on received block data
  };

  // Renders the editor instance using a React component.
  return (
    <Card className="h-full w-full gap-2 p-0">
      <CardContent className="h-full w-full p-2">
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
}
