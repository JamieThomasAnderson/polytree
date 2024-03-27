import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchProps {
  onSearch: (query: string) => void,
};

export const Search = ({
  onSearch
}: SearchProps) => {

  const [search, setSearch] = useState("");

  return (
    <div className="flex w-full max-w-sm items-center space-x-2 ">
      <Input
        
        className="h-full z-[9999999] dark:focus:border-teal" 
        type="search" 
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)} 
      />
      <Button
        className="h-full z-[999999] rounded-sm hover:bg-neutral-300 hover:bg-neutral-600 mr-1 dark:bg-light"
        type="submit"
        onClick={() => onSearch(search)}
      >
        Search
      </Button>
    </div>
  )
}
