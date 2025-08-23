import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, MessageCircle, Users, Send } from "lucide-react";

const Forum = ({ currentUser = "User123" }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  const handleAddPost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      
      author: currentUser || "Anonymous",  // metamask er wallet the user ante hbe ekhane

      content: newPost,
      votes: 0,
      date: new Date().toLocaleString(),
    };
    setPosts([post, ...posts]);
    setNewPost("");
  };

  const handleUpvote = (id) => {
    setPosts((prevPosts) =>
      prevPosts
        .map((p) => {
          if (p.id === id) {
            if (p.author === currentUser) {
              console.log("Cannot vote on your own post!");
              return p;
            }
            return { ...p, votes: p.votes + 1 };
          }
          return p;
        })
        .sort((a, b) => b.votes - a.votes)
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-6xl mx-auto p-6">
        
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
          <p className="text-gray-300 text-lg mb-6">Share knowledge, ask questions, and connect with fellow learners</p>
          
         
          <div className="inline-flex items-center gap-2 bg-gradient-to-b from-gray-800 to-gray-900 border border-emerald-500/20 rounded-2xl px-6 py-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">Logged in as</span>
            <span className="font-semibold text-emerald-400">{currentUser}</span>
          </div>
        </motion.div>

        
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-emerald-500/20 hover:border-emerald-400/40 rounded-2xl p-6 shadow-xl transition-all">
              <h3 className="text-xl font-semibold text-white mb-4">Share Your Knowledge</h3>
              <div className="relative">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What skill can you teach or what do you need help with? Be specific..."
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none h-24 transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAddPost())}
                />
                <button
                  onClick={handleAddPost}
                  disabled={!newPost.trim()}
                  className="absolute bottom-3 right-3 bg-emerald-400 hover:bg-emerald-500 disabled:bg-gray-600 text-black disabled:text-gray-400 p-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        
        <div className="grid lg:grid-cols-3 gap-8">
        
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {posts.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl">
                <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">No posts yet. Be the first to share!</p>
              </div>
            ) : (
              posts.map((post, index) => {
                const isOwnPost = post.author === currentUser;
                
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-gradient-to-b from-gray-800 to-gray-900 border rounded-2xl p-6 cursor-pointer transition-all shadow-xl ${
                      isOwnPost 
                        ? 'border-emerald-500/40 hover:border-emerald-400/60' 
                        : 'border-gray-700 hover:border-gray-600'
                    } ${selectedPost?.id === post.id ? 'ring-2 ring-emerald-500/50' : ''}`}
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {post.author[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{post.author}</p>
                            <p className="text-xs text-gray-400">{post.date}</p>
                          </div>
                          {isOwnPost && (
                            <div className="bg-emerald-400 text-black text-xs px-3 py-1 rounded-full font-medium">
                              Your Post
                            </div>
                          )}
                        </div>
                        <p className="text-gray-300 leading-relaxed">{post.content}</p>
                      </div>


                      {/* //ekhane vote er bpr ta ache */}


                      <div className="flex flex-col items-center ml-6">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpvote(post.id);
                          }}
                          disabled={isOwnPost}
                          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                            isOwnPost
                              ? "text-gray-600 cursor-not-allowed"
                              : "text-gray-400 hover:text-emerald-400 hover:bg-gray-700/50"
                          }`}
                          whileHover={!isOwnPost ? { scale: 1.1 } : {}}
                          whileTap={!isOwnPost ? { scale: 0.95 } : {}}
                          title={isOwnPost ? "You cannot vote on your own post" : "Upvote this post"}
                        >
                          <ArrowUp className="w-6 h-6" />
                          <span className="font-bold text-lg">{post.votes}</span>
                        </motion.button>
                        {isOwnPost && (
                          <p className="text-xs text-gray-600 mt-1">Can't vote</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>

         
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="sticky top-6">
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
                {selectedPost ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {selectedPost.author[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Post Details</h3>
                        <p className="text-gray-400 text-sm">Selected post information</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-900 rounded-xl border border-gray-700">
                        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Author</span>
                        <p className="text-white mt-1 font-medium">{selectedPost.author}</p>
                      </div>
                      
                      <div className="p-4 bg-gray-900 rounded-xl border border-gray-700">
                        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Content</span>
                        <p className="text-gray-300 mt-2 leading-relaxed">{selectedPost.content}</p>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex-1 p-4 bg-gray-900 rounded-xl border border-gray-700 text-center">
                          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">Votes</span>
                          <p className="text-2xl font-bold text-white mt-1">{selectedPost.votes}</p>
                        </div>
                        
                        <div className="flex-1 p-4 bg-gray-900 rounded-xl border border-gray-700 text-center">
                          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">Rank</span>
                          <p className="text-2xl font-bold text-white mt-1">#{posts.findIndex(p => p.id === selectedPost.id) + 1}</p>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-900 rounded-xl border border-gray-700">
                        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Posted</span>
                        <p className="text-gray-400 mt-1 text-sm">{selectedPost.date}</p>
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