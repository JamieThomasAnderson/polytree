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

export const getSidebar = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userID = identity.subject;

    const graphs = await ctx.db
      .query("graphs")
      .withIndex("by_user_title", (q) =>
        q
          .eq("userId", userID)
      )
      .order("desc")
      .collect();

    return graphs;
  },
});

export const remove = mutation({
  args: { id: v.id("graphs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingGraph = await ctx.db.get(args.id);

    if (!existingGraph) {
      throw new Error("Not found");
    }

    if (existingGraph.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const graph = await ctx.db.delete(args.id);

    return graph;
  }
});

export const append = mutation({
  args: {
    id: v.id("graphs"),
    nodes: v.array(v.any()),
    links: v.array(v.any())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated.");
    }

    const userID = identity.subject;
    const { id, nodes, links } = args;
    const existingGraph = await ctx.db.get(id);

    if (!existingGraph) {
      throw new Error("Not found");
    }

    if (existingGraph.userId !== userID) {
      throw new Error("Unauthorized");
    }

    // Append new nodes and links to the bottom of the existing ones
    let updatedNodes = [...(existingGraph.nodes || []), ...nodes];
    let updatedLinks = [...(existingGraph.links || []), ...links];

    const uniqueNodeIds = new Set(updatedNodes.map(node => node.id));

    updatedNodes = updatedNodes.filter(node => {
      if (uniqueNodeIds.has(node.id)) {
        uniqueNodeIds.delete(node.id);
        return true;
      }
      return false;
    });

    const graph = await ctx.db.patch(id, {
      nodes: updatedNodes,
      links: updatedLinks,
    });

    return graph;
  }
})