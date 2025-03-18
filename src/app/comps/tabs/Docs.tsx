"use client";

import { useDispatch, useSelector } from "react-redux";
import { updateDocs, loadDocs, RootState } from "@/store/store";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateDocumentationFields } from "@/utils/docs";

const Docs = () => {
  // Creates a new editor instance.
  const docs = useSelector((state: RootState) => state.docsUpdate);
  const blocks = docs.value;
  const loading = docs.loading;
  const dispatch = useDispatch();
  const editor = useCreateBlockNote({
    initialContent: blocks.length > 0 ? blocks : undefined,
  });

  const handleGenerate = async () => {
    try {
      dispatch(loadDocs(true));

      const { schema, datatypes, blocks } = generateDocumentationFields();

      const response = await fetch("/api/gendoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ schema, datatypes, blocks }),
      });

      const result = await response.json();

      if (result.docs) {
        const cleanedBlocks = result.docs
          .replace(/^```json\s+|```[\s\n]*$/g, "")
          .trim();
        const blocks = JSON.parse(cleanedBlocks).blocks;
        editor.insertBlocks(blocks, editor.document[0], "before");

        const newBlocks = editor.document;
        dispatch(updateDocs(newBlocks));
      }
    } catch (error) {
      if (error instanceof Error)
        console.error("Failed to generate docs", error.message);
      else console.error("Unknown error while generating docs");
    } finally {
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
