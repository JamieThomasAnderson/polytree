"use client";

import {
  ChevronsLeft,
  DownloadCloudIcon,
  FilePlus,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Terminal,
  Trash
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";

import { UserItem } from "./user-item";
import { Item } from "./item";
import { DocumentList } from "./document-list";
import { GraphSublist } from "./document-graph-sublist";
import { TrashBox } from "./trash-box";
import { Navbar } from "./navbar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { set } from "lodash";
import { PopoverClose } from "@radix-ui/react-popover";

export const Navigation = () => {
  const router = useRouter();
  const settings = useSettings();
  const search = useSearch();
  const params = useParams();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const create = useMutation(api.documents.create);
  const createGraph = useMutation(api.graphs.newGraph);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const [name, setName] = useState("");
  const [graphName, setGraphName] = useState("");

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
  }, [pathname, isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

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

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty(
        "left",
        isMobile ? "100%" : "240px"
      );
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  }

  const handleCreate = () => {

    if (name.trim() === "") {
      return;
    }

    const promise = create({ title: name })
      .then((documentId) => router.push(`/workspace/document/${documentId}`))

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });

    setName("");
  };

  const handleCreateGraph = () => {

    if (graphName.trim() === "") {
      return;
    }

    const promise = createGraph({ title: graphName })
      .then((graphId) => router.push(`/workspace/graph/${graphId}`))

      toast.promise(promise, {
        loading: "Creating a new graph...",
        success: "New graph created!",
        error: "Failed to create a new note."
      });

      setGraphName("");
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem />
          <Item
            label="Command"
            icon={Terminal}
            isSearch
            onClick={search.onOpen}
          />
        </div>
        <div className="mt-4">
          <DocumentList />

          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Add Note" icon={Plus} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}
            >
              {/* <p className="pl-2 pt-2 text-muted-foreground flex items-center center pl-2"> 
                <FilePlus className="w-8 h-8 pr-2" /> Creating... {name}</p> */}
              <div className="flex items-center p-2 space-x-2">
                <Input
                  value={name}
                  onKeyDown={(event) => {if (event.key === "Enter") handleCreate()}}
                  className={cn("outline-none w-full border-0 border-b-2", name==="" && "border-2 border-red-200")}
                  onChange={(event) => setName(event.target.value)} 
                  placeholder="Untitled"
                />
                <div
                  onClick={handleCreate} 
                  className="text-muted-foreground bg-transparent hover:bg-neutral-200 rounded p-1">
                  <Plus />
                </div>
              </div>

            </PopoverContent>
          </Popover>

          <div className="pb-2"></div>
          <Separator className="dark:bg-slate-700" />
          <div className="pt-2"></div>

          <GraphSublist />

          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Add Graph" icon={Plus} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}
            >
              {/* <p className="pl-2 pt-2 text-muted-foreground">Creating... {name}</p> */}
              <div className="flex items-center p-2 space-x-2">
                <Input
                  value={graphName}
                  onKeyDown={(event) => {if (event.key === "Enter") handleCreateGraph()}}
                  className={cn("outline-none w-full border-0 border-b-2", graphName==="" && "border-2 border-red-200")}
                  onChange={(event) => setGraphName(event.target.value)} 
                  placeholder="Untitled"
                />
                <div
                  onClick={handleCreateGraph} 
                  className="text-muted-foreground bg-transparent hover:bg-neutral-200 rounded p-1">
                  <Plus />
                </div>
              </div>

            </PopoverContent>
          </Popover>


          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        {!!params.documentId ? (
          <Navbar
            isCollapsed={isCollapsed}
            onResetWidth={resetWidth}
          />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-10 w-10 text-muted-foreground" />}
          </nav>
        )}
      </div>
    </>
  )
}