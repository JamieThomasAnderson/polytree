"use client";

import { ElementRef, useRef, useState } from "react";
import { ImageIcon, Smile, X } from "lucide-react";
import { useMutation } from "convex/react";
import TextareaAutosize from "react-textarea-autosize";

import { useCoverImage } from "@/hooks/use-cover-image";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

import { IconPicker } from "./icon-picker";

interface ToolbarProps {
  initialData: Doc<"graphs">;
}

export const GraphToolbar = ({
  initialData
}: ToolbarProps) => {


  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const newUpdate = useMutation(api.graphs.update);

  const enableInput = () => {

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };



  const onInput = (value: string) => {
    setValue(value);
    newUpdate({
      id: initialData._id,
      title: value || "Untitled"
    });
  };

  const disableInput = () => setIsEditing(false);

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };



  return (
    <div className="pl-[54px] group relative">
    {isEditing ? (
      <TextareaAutosize
        ref={inputRef}
        onBlur={disableInput}
        onKeyDown={onKeyDown}
        value={value}
        onChange={(e) => onInput(e.target.value)}
        className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
      />
    ) : (
      <div
        onClick={enableInput}
        className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
      >
        {initialData.title}
      </div>
    )}
  </div>
  )
}