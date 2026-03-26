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
        .take(500);

      const result = await Promise.all(
        posts.map(async (post) => {
          const user = await ctx.db.get(post.userId);
          
          // Anonymize email: convert "John Doe" into "John D."
          const nameParts = (user?.name || "Unknown").trim().split(/\s+/);
          const first = nameParts[0] || "Trader";
          const lastInit = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() + "." : "";
          const displayName = `${first} ${lastInit}`.trim();
          
          return {
            ...post,
            author: {
              name: displayName,
              handle: `@${first.toLowerCase()}`,
              avatar: first.charAt(0).toUpperCase(),
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
    replyTo: v.optional(v.id("marketPosts")),
  },
  handler: async (ctx, args) => {
    if (args.replyTo) {
      const parent = await ctx.db.get(args.replyTo);
      if (parent) {
        await ctx.db.patch(args.replyTo, { replies: parent.replies + 1 });
      }
    }
    
    return await ctx.db.insert("marketPosts", {
      userId: args.userId,
      content: args.content,
      sentiment: args.sentiment,
      upvotes: 0,
      downvotes: 0,
      replies: 0,
      createdAt: Date.now(),
      replyTo: args.replyTo,
      upvotedBy: [],
      downvotedBy: [],
    });
  },
});

export const action = mutation({
  args: {
    postId: v.id("marketPosts"),
    type: v.string(), // "upvote" | "downvote"
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    
    const upvotedBy = post.upvotedBy || [];
    const downvotedBy = post.downvotedBy || [];

    if (args.type === "upvote") {
      if (!upvotedBy.includes(args.userId)) {
        await ctx.db.patch(args.postId, { 
          upvotes: post.upvotes + 1, 
          upvotedBy: [...upvotedBy, args.userId] 
        });
      } else {
        // Toggle Off
        await ctx.db.patch(args.postId, { 
          upvotes: post.upvotes - 1, 
          upvotedBy: upvotedBy.filter(id => id !== args.userId) 
        });
      }
    } else if (args.type === "downvote") {
      if (!downvotedBy.includes(args.userId)) {
        await ctx.db.patch(args.postId, { 
          downvotes: post.downvotes + 1, 
          downvotedBy: [...downvotedBy, args.userId] 
        });
      } else {
        await ctx.db.patch(args.postId, { 
          downvotes: post.downvotes - 1, 
          downvotedBy: downvotedBy.filter(id => id !== args.userId) 
        });
      }
    }
  },
});

export const remove = mutation({
  args: {
    postId: v.id("marketPosts"),
    userId: v.string(), // Native pseudo-auth enforcement from client 
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    if (post.userId !== args.userId) throw new Error("Unauthorized to delete this post");
    
    // Decrement parent replies counter if it was part of a thread
    if (post.replyTo) {
      const parent = await ctx.db.get(post.replyTo);
      if (parent && parent.replies > 0) {
        await ctx.db.patch(post.replyTo, { replies: parent.replies - 1 });
      }
    }

    await ctx.db.delete(args.postId);
  },
});
