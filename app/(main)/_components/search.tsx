import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Search as SearchLogo } from "lucide-react";

import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

interface SearchProps {
  onSearch: (query: string) => void,
};

export const Search = ({
  onSearch
}: SearchProps) => {

  const [search, setSearch] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");


  return (
    <div className="flex w-full items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-lg pb-2">
      <Input
        className="h-full" 
        type="search" 
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)} 
      />
      <Button
        className="h-9 w-12 rounded-sm hover:bg-neutral-300 hover:bg-neutral-600 dark:bg-light light:bg-slate-500"
        type="submit"
        onClick={() => onSearch(search)}
      >
        <SearchLogo />
      </Button>
    </div>
  )
}
