"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Search as SearchLogo } from "lucide-react";

import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";

interface SearchProps {
  onSearch: (query: string) => void,
};

export const Search = ({
  onSearch
}: SearchProps) => {

  
  const [search, setSearch] = useState("");
  const [nothing, setIsNothing] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  

  const handleSearch = (query: string) => {
    if (query == "") {
      setIsNothing(true);
      setTimeout(() => setIsNothing(false), 1000);
    } else {
      setIsNothing(false);
    }

    onSearch(query);
  }

  return (
    <div className="flex w-full items-center space-x-2 pb-2">
      <Input
        type="search"
        className={cn(
          "h-full border-2 transition-colors duration-500",
          nothing && "border-red-500"
        )} 
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)} 
      />
      <Button
        className="h-9 w-12 hover:bg-neutral-300 hover:bg-neutral-600 dark:bg-light light:bg-slate-500"
        type="submit"
        onClick={() => handleSearch(search)}
      >
        <SearchLogo />
      </Button>
    </div>
  )
}