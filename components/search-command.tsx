"use client";

import { useEffect, useState } from "react";
import { Bot, Copy, File, Search, Workflow } from "lucide-react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { useSearch } from "@/hooks/use-search";
import { api } from "@/convex/_generated/api";
import { openai } from "@/lib/openai";
import { Spinner } from "./spinner";

export const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const documents = useQuery(api.documents.getSearch);
  const [isMounted, setIsMounted] = useState(false);

  const [command, setCommand] = useState("");
  const [pastQuery, setPastQuery] = useState("");
  const [isCommand, setIsCommand] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    }

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const onSelect = (id: string) => {
    router.push(`/workspace/document/${id}`);
    onClose();
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter") {
      if (isCommand) {
        if (command.startsWith("/ask")) {
          try {
            setLoading(true);
            setAnswer("");

            const response = await fetch(`/api/openai?q=${command}`);
            const answer = await response.json();

            setPastQuery(command);
            setAnswer(answer.response);
            setLoading(false);
          } catch (e) {
            return e;
          }
        }
      }
    }
  }

  const handleCommand = (e: string) => {
    setCommand(e);

    if (e.startsWith("/")) {
      setIsCommand(true);
    } else {
      setIsCommand(false);
    }
  }

  if (!isMounted) {
    return null;
  }
  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder={`Try /ask... or search`}
        onValueChange={(e) => handleCommand(e)}
        value={command}
        icon={isCommand && command.startsWith("/ask") ? <Bot className="mr-2 h-4 w-4" /> : null}
        onKeyDown={(e) => {handleKeyDown(e)}}
      >
      </CommandInput>
      <CommandList>
        {!isCommand && (
          <>
            <CommandEmpty>
              Nothing here...
            </CommandEmpty>
            <CommandGroup heading="Documents">
              {documents?.map((document) => (
                <CommandItem
                  key={document._id}
                  value={`${document._id}-${document.title}`}
                  title={document.title}
                  onSelect={() => onSelect(document._id)}
                >
                  {document.icon ? (
                    <p className="mr-2 text-[18px]">
                      {document.icon}
                    </p>
                  ) : (
                    <File className="mr-2 h-4 w-4" />
                  )}
                  <span>
                    {document.title}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
        {isCommand &&
          // Add command groups here
          <CommandGroup heading="Commands">
            <CommandItem
              value="/ask "
              title="Ask"
              onSelect={() => handleCommand("/ask")}
            >
              <p className="mr-2 text-[18px]">
                <Bot className="mr-2 h-4 w-4" />
              </p>
              <span>
                Ask ChatGPT...
              </span>
            </CommandItem>
          </CommandGroup>
        }

        {answer.length > 0 && 
          <CommandGroup heading="Answer">
            <CommandItem
              value={pastQuery}
              title={answer}
            >
              <p className="mr-2 text-[18px]">
                <Bot className="mr-2 h-4 w-4" />
              </p>
              <span>
                {answer}
              </span>
              <div 
                className="hover:bg-neutral-300 rounded-md"
                role="button"
                onClick={() => navigator.clipboard.writeText(answer)}
              >
                <Copy className="p-1 w-8 h-8" />
              </div>
            </CommandItem>
          </CommandGroup>
        }

        {loading &&
          <CommandGroup heading="Loading">
          <CommandItem
            value={command}
            title={answer}
          >
            <p className="mr-2 text-[18px]">
              <Bot className="mr-2 h-4 w-4" />
            </p>
            <Spinner />
          </CommandItem>
          </CommandGroup>
        }
      </CommandList>
    </CommandDialog>
  )
}