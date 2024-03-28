"use client";

const data: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
]


import { Results } from "@/app/(main)/_components/results";
import { Payment, columns } from "@/app/(main)/_components/columns";
import { ElementRef, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { ChevronsLeft, ChevronsRight, MenuIcon } from "lucide-react";
import { Search } from "@/app/(main)/_components/search";


export const Sidebar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const navbarRef = useRef<ElementRef<"div">>(null);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const isResizingRef = useRef(false);

  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [isMobile]);



  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "3%";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("right", "3%");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "35%";

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "sidebar fixed top-0 right-0 h-full bg-secondary flex w-1/4 flex-col z-[9999999] transition-all",
          isResetting && "ease-in-out duration-300",
          isCollapsed && "duration-300 hover:bg-neutral-300 dark:hover:bg-neutral-700"
        )}
        onClick={isCollapsed ? resetWidth : undefined}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 left-2 opacity-100 group-hover/sidebar:opacity-100 transition z-[9999999]",
            isMobile && "opacity-100",
            isCollapsed && "opacity-0"
          )}
        >
          <ChevronsRight className="h-6 w-6" />
        </div>
        <div className="container mx-auto py-2">
          {!isCollapsed && (
            <>
              <div className="w-full items-center">
                <Search onSearch={() => {}} />
                <Results columns={columns} data={data} />
              </div>
            </>
          )}
        </div>
        <div
          ref={navbarRef}
          className={cn(
            "absolute top-0 z-[9999999] right-60 w-[calc(100%-240px)]",
            isResetting && "ease-in-out duration-300",
            isMobile && "right-0 w-full"
          )}
        ></div>
      </aside>
    </>
  );
};