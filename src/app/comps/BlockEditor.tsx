"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

import { useDispatch, useSelector } from "react-redux";
import { updateDocs, RootState } from "@/store/store";

export default function BlockEditor() {
  // Creates a new editor instance.

  const blocks = useSelector((state: RootState) => state.docsUpdate.value);
  const dispatch = useDispatch();
  const editor = useCreateBlockNote({
    initialContent: blocks.length > 0 ? blocks : undefined,
  });

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      theme={"light"}
      onChange={() => {
        dispatch(updateDocs(editor.document));
      }}
    />
  );
}
