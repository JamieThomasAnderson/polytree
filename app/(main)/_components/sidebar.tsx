"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { ChevronLeft, ChevronsRight, FileText, MenuIcon } from "lucide-react";
import { Search } from "@/app/(main)/_components/search";
import { ArticleList } from "./article-list";

interface SidebarProps {
  onSearch: (query: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onPropogate: (id: string, articleID: number) => Promise<void>;
  articles: Array<{ name: string; id: string; attr: Object; group: number }>;
  node: any;
}

export const Sidebar = ({
  onSearch,
  onDelete,
  onPropogate,
  articles,
  node,
}: SidebarProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navbarRef = useRef<ElementRef<"div">>(null);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const isResizingRef = useRef(false);

  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  // Might have to move to the page component
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [isMobile]);

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    await onDelete(id);
    setIsLoading(false);
  };

  const handlePropogate = async (url: string, articleID: number) => {
    setIsLoading(true);
    const params = new URLSearchParams(url.split("?")[1] || "");
    const id = params.get("cites") || "";
    if (url.length !== 0) {
      await onPropogate(id.toString(), articleID);
    }
    setIsLoading(false);
  };

  const handleSearch = async () => {
    setSearch("");
    setIsLoading(true);
    await onSearch(search);
    setIsLoading(false);
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0"); // Change to left
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "25%";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 25%)",
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "25%");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = window.innerWidth - event.clientX;

    if (newWidth < 350) newWidth = 350;
    if (newWidth > 1000) newWidth = 1000;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`,
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar drop-shadow-lg h-full bg-secondary overflow-y-scroll absolute flex w-1/4 flex-col z-[99999] absolute inset-y-0 right-0",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0",
        )}
      >
        <div className="pl-8 pr-8 pt-4 pb-2">
          <Search
            handleSearch={handleSearch}
            isLoading={isLoading}
            setSearch={setSearch}
            search={search}
          />
        </div>
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-16 w-5 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute left-2 top-1/2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100",
          )}
        >
          <ChevronsRight className="h-16 w-5" />
        </div>

        <div
          onMouseDown={handleMouseDown}
          className="opacity-0 h-full group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute w-1 bg-primary/10 left-0 top-0"
        />

        <div className={cn("opacity-100", isLoading && "opacity-10")}>
          <ArticleList
            handlePropogate={handlePropogate}
            handleDelete={handleDelete}
            query={search}
            articles={articles}
            node={node}
          />
        </div>
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] right-60 w-[calc(100%-280px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "right-0 w-full",
        )}
      />
      <nav className="absolute z-[99999999] right-0 top-1/2 bg-transparent px-2 transition-transform duration-200 hover:transform hover:-translate-x-2">
        {isCollapsed && (
          <ChevronLeft
            onClick={resetWidth}
            role="button"
            className="h-6 w-6 text-muted-foreground"
          />
        )}
      </nav>
    </>
  );
};
