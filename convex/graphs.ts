import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const newGraph = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated.");
    }

    const userID = identity.subject;

    const graph = await ctx.db.insert("graphs", {
      title: args.title,
      userId: userID,
      nodes: [],
      links: []
    });
    return graph;
  }
});

export const getById = query({
  args: { graphId: v.id("graphs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated.");
    }

    const userID = identity.subject;

    const graph = await ctx.db.get(args.graphId);

    if (!graph) {
      throw new Error("Not found.");
    }

    if (graph.userId !== userID) {
      throw new Error("Unauthorized.");
    }

    return graph;
  }
});

export const update = mutation({
  args: {
    id: v.id("graphs"),
    title: v.optional(v.string()),
    nodes: v.optional(v.array(v.any())),
    links: v.optional(v.array(v.any()))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated.");
    }

    const userID = identity.subject;
    const { id, ...rest } = args;
    const existingGraph = await ctx.db.get(args.id);

    if (!existingGraph) {
      throw new Error("Not found");
    }

    if (existingGraph.userId !== userID) {
      throw new Error("Unauthorized");
    }

    const graph = await ctx.db.patch(args.id, {
      ...rest,
    });

    return graph;
  }
})

