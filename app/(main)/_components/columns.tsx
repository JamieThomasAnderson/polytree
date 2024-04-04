"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Article = {
  id: string;
  title: string;
  author: string;
  details: Array<string>;
  excerpt: string;
  citations: number;
};

export const columns: ColumnDef<Article>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "excerpt",
    header: "Excerpt",
  },
  {
    accessorKey: "citations",
    header: "Citations",
  },
];
