import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    try {
      const posts = await ctx.db
        .query("marketPosts")
        .withIndex("by_createdAt")
        .order("desc")
        .take(100);

      const result = await Promise.all(
        posts.map(async (post) => {
          const user = await ctx.db.get(post.userId);
          return {
            ...post,
            author: {
              name: user?.name || "Unknown User",
              handle: user?.email ? `@${user.email.split("@")[0]}` : "@user",
              avatar: user?.name ? user.name.charAt(0).toUpperCase() : "U",
              badge: (user as any)?.plan === "pro" || ((user as any)?.outreachCount ?? 0) > 0,
            },
          };
        })
      );
      return result;
    } catch (e) {
      console.warn("Convex Query Error ( likely syncing index ):", e);
      return [];
    }
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
    content: v.string(),
    sentiment: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("marketPosts", {
      userId: args.userId,
      content: args.content,
      sentiment: args.sentiment,
      upvotes: 0,
      downvotes: 0,
      replies: 0,
      createdAt: Date.now(),
    });
  },
});

export const action = mutation({
  args: {
    postId: v.id("marketPosts"),
    type: v.string(), // "upvote" | "downvote"
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    
    if (args.type === "upvote") {
      await ctx.db.patch(args.postId, { upvotes: post.upvotes + 1 });
    } else if (args.type === "downvote") {
      await ctx.db.patch(args.postId, { downvotes: post.downvotes + 1 });
    }
  },
});
