import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaLightbulb, FaHandsHelping } from "react-icons/fa";
import Hero from "./Hero";
import { Link } from "react-router-dom";
import FeaturedVideos from "./FeaturedVideos";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-20 px-10 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center text-white mb-14"
        >
          Why Join <span className="text-emerald-400">SkillBarter?</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="card bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl p-8 text-center rounded-2xl border border-emerald-500/20 hover:border-emerald-400/40 transition-all"
          >
            <FaUsers className="text-5xl text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Community</h3>
            <p className="text-gray-300">
              Connect with people worldwide and grow your network.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="card bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl p-8 text-center rounded-2xl border border-yellow-500/20 hover:border-yellow-400/40 transition-all"
          >
            <FaLightbulb className="text-5xl text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Learn & Teach</h3>
            <p className="text-gray-300">
              Share your expertise while gaining knowledge from others.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="card bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl p-8 text-center rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all"
          >
            <FaHandsHelping className="text-5xl text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Skill Exchange</h3>
            <p className="text-gray-300">
              Trade skills instead of money. Everyone has something to offer.
            </p>
          </motion.div>
        </div>
      </section>

      {/* explore video */}
      <FeaturedVideos />

      {/* Call to Action */}
      <section className="pt-16 pb-20 bg-gradient-to-r from-slate-900 to-blue-950 text-center text-white relative z-10">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-6"
        >
          Ready to start your Skill Journey?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-10 text-lg opacity-90"
        >
          Join thousands of learners and skill sharers today.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="btn bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full px-8 py-3 shadow-lg"
        >
          <Link to="/create">Upload Now</Link>
        </motion.button>
      </section>

      {/* Footer */}
      <footer className="footer bg-gray-900 border-t border-gray-700 p-6 text-center text-gray-400 relative z-10">
        <p>© {new Date().getFullYear()} SkillBarter. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;






