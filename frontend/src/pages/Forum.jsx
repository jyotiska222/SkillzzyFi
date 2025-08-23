import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowUp, MessageCircle, Users, Send } from "lucide-react";
import { useWallet } from "../contexts/walletContext";

const toNum = (v) => {
  if (typeof v === "bigint") return Number(v);
  if (v && typeof v.toNumber === "function") return v.toNumber();
  return Number(v); // fallback (covers plain numbers / strings)
};

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [needTitle, setNeedTitle] = useState("");
  const [needDescription, setNeedDescription] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const { contract, account } = useWallet();

  const parsePosts = useCallback((raw) => {
    // Contract returns DContent: { id, title, description, upvotes }
    return raw.map((p) => ({
      id: toNum(p.id),
      title: p.title,
      description: p.description,
      upvotes: toNum(p.upvotes),
    }));
  }, []);

  const loadPosts = useCallback(async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const raw = await contract.getDContents();
      const sorted = [...raw].sort((a, b) => Number(b.upvotes) - Number(a.upvotes));
      const parsed = parsePosts(sorted);
      setPosts(parsed);
      // Keep selection valid
      if (parsed.length === 0) setSelectedPost(null);
      else if (selectedPost) {
        const updated = parsed.find((x) => x.id === selectedPost.id);
        setSelectedPost(updated || parsed[0]);
      }
    } catch (err) {
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  }, [contract, parsePosts, selectedPost]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleAddPost = async () => {
    if (!needTitle.trim() || !needDescription.trim() || !contract) return;
    try {
      const tx = await contract.uploadDContent(needTitle, needDescription);
      await tx.wait();
      setNeedTitle("");
      setNeedDescription("");
      await loadPosts();
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleUpvote = async (id) => {
    if (!contract) return;
    try {
      const tx = await contract.upvote(id);
      await tx.wait();
      await loadPosts();
    } catch (err) {
      console.error("Upvote error:", err);
      // The contract guards multiple votes; surface friendly info if needed
      // e.g., toast("Already upvoted this post")
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12 py-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageCircle className="w-10 h-10 text-emerald-400" />
            <h1 className="text-4xl font-bold text-white">
              Community <span className="text-emerald-400">Forum</span>
            </h1>
          </div>
          <p className="text-gray-300 text-lg mb-6">Share what you need or offer</p>

          <div className="inline-flex items-center gap-2 bg-gradient-to-b from-gray-800 to-gray-900 border border-emerald-500/20 rounded-2xl px-6 py-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">Logged in as</span>
            <span className="font-semibold text-emerald-400">
              {account || "Anonymous"}
            </span>
          </div>
        </motion.div>

        {/* Input Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-4">
                Post Your Need
              </h3>

              <input
                type="text"
                value={needTitle}
                onChange={(e) => setNeedTitle(e.target.value)}
                placeholder="Enter the main need (e.g. 'Looking for React Mentor')"
                className="w-full mb-4 bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />

              <div className="relative">
                <textarea
                  value={needDescription}
                  onChange={(e) => setNeedDescription(e.target.value)}
                  placeholder="Describe your need in detail..."
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none h-28 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddPost();
                    }
                  }}
                />
                <button
                  onClick={handleAddPost}
                  disabled={!needTitle.trim() || !needDescription.trim()}
                  className="absolute bottom-3 right-3 bg-emerald-400 hover:bg-emerald-500 disabled:bg-gray-600 text-black disabled:text-gray-400 p-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {loading ? (
              <div className="text-center py-16 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl">
                <p className="text-gray-300 text-lg">Loading posts…</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl">
                <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">
                  No posts yet. Be the first to share!
                </p>
              </div>
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 hover:border-gray-600 rounded-2xl p-6 cursor-pointer transition-all shadow-xl"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-emerald-400 mb-1">
                        {post.title}
                      </p>
                      <p className="text-gray-300 leading-relaxed">
                        {post.description}
                      </p>
                    </div>

                    {/* Upvotes */}
                    <div className="flex flex-col items-center ml-6">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpvote(post.id);
                        }}
                        className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-gray-400 hover:text-emerald-400 hover:bg-gray-700/50 transition-all duration-200"
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowUp className="w-6 h-6" />
                        <span className="font-bold text-lg">{post.upvotes}</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Post Details */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="sticky top-6">
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl min-h-[220px]">
                {selectedPost ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <h3 className="text-xl font-bold text-white mb-4">Post Details</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-900 rounded-xl border border-gray-700">
                        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                          Need
                        </span>
                        <p className="text-white mt-1 font-medium">{selectedPost.title}</p>
                      </div>

                      <div className="p-4 bg-gray-900 rounded-xl border border-gray-700">
                        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                          Description
                        </span>
                        <p className="text-gray-300 mt-2 leading-relaxed">
                          {selectedPost.description}
                        </p>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-1 p-4 bg-gray-900 rounded-xl border border-gray-700 text-center">
                          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                            Upvotes
                          </span>
                          <p className="text-2xl font-bold text-white mt-1">{selectedPost.upvotes}</p>
                        </div>
                        <div className="flex-1 p-4 bg-gray-900 rounded-xl border border-gray-700 text-center">
                          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                            ID
                          </span>
                          <p className="text-2xl font-bold text-white mt-1">#{selectedPost.id}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-300 mb-2">Select a post to see details</p>
                    <p className="text-gray-500 text-sm">Click on any post in the list</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
