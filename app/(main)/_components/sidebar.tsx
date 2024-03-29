"use client";

import { Results } from "@/app/(main)/_components/results";
import { Article, columns } from "@/app/(main)/_components/columns";
import { ElementRef, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { ArrowLeftFromLine, ChevronsRight, MenuIcon } from "lucide-react";
import { Search } from "@/app/(main)/_components/search";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "./navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox";


interface SidebarProps {
  onSearch: (query: string) => void,
  articles: Array<{ name: string, id: string, attr: Object, group: number }>;
}

export const Sidebar = ({ onSearch, articles }: SidebarProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navbarRef = useRef<ElementRef<"div">>(null);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const isResizingRef = useRef(false);

  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);


  const data = articles.map((article) => {
    return {
      id: article.id,
      title: article.name,
      details: (article.attr as { publication: Array<string> })["publication"],
      author: (article.attr as { author: string })["author"],
      excerpt: (article.attr as { excerpt: string })["excerpt"],
      citations: (article.attr as { citationCount: number })["citationCount"]
    };
  });

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [isMobile]);

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0"); // Change to left
      setTimeout(() => setIsResetting(false), 300);
    }
  }

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "25%";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 25%)"
      );
      navbarRef.current.style.setProperty(
        "left",
        isMobile ? "100%" : "25%"
      );
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = window.innerWidth - event.clientX;

    if (newWidth < 280) newWidth = 280;
    if (newWidth > 1000) newWidth = 1000;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
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
          "group/sidebar drop-shadow-lg h-full bg-secondary overflow-y-auto absolute flex w-1/4 flex-col z-[99999] absolute inset-y-0 right-0",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition", // Change to right
            isMobile && "opacity-100"
          )}
        >
          <ChevronsRight className="h-6 w-6" />
        </div>

        <div className="p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <div className="">
                <Checkbox className="align" />
              </div>
              <CardTitle>Card Title</CardTitle>
            </div>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
        

        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 left-0 top-0" // Change to right
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] right-60 w-[calc(100%-280px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "right-0 w-full"
        )}
      />
      <nav className="absolute z-[99999999] right-0 top-1/2 bg-transparent px-2 transition-transform duration-200 hover:transform hover:-translate-x-2">
        {isCollapsed && <ArrowLeftFromLine onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />}
      </nav>
    </>
  );
};

