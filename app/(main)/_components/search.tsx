"use client";

import ClipLoader from "react-spinners/ClipLoader";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

interface SearchProps {
  handleSearch: () => void;
  setSearch: (value: string) => void;
  isLoading: boolean;
};

export const Search = ({
  handleSearch,
  setSearch,
  isLoading
}: SearchProps) => {


  const isMobile = useMediaQuery("(max-width: 768px)");

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <form className="mx-auto">
      <label 
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>

        <input
          onChange={(event) => setSearch(event.target.value)}
          type="search" 
          id="default-search" 
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-neutral-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0" 
          placeholder="Search" 
          required 
        />
        
        {isLoading ? (
          <button
          onClick={(event) => {event?.preventDefault(); handleSearch()}} 
          className="text-white content-center absolute end-2.5 bottom-2.5 bg-neutral-700 hover:bg-neutral-600 focus:ring-0 font-medium rounded-lg text-sm px-4 py-2 dark:bg-neutral-900 dark:hover:bg-slate-950 "
          >
          <ClipLoader
            color="#ffffff"
            loading={isLoading}
            size={10}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          </button>
        ) : (
          <button
            onClick={(event) => {event?.preventDefault(); handleSearch()}} 
            className="text-white absolute end-2.5 bottom-2.5 bg-neutral-700 hover:bg-neutral-600 focus:ring-0 font-medium rounded-lg text-sm px-4 py-2 dark:bg-neutral-900 dark:hover:bg-slate-950 "
          >
            Search
          </button>
        )}
      </div>
    </form>
  )
}