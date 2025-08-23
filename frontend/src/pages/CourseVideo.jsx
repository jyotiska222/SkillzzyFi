import React, { useState } from "react";
import { motion } from "framer-motion";

function CourseVideo() {
  const [currentVideo, setCurrentVideo] = useState(0);

  const videos = [
    { title: "Introduction to React", src: "https://www.w3schools.com/html/mov_bbb.mp4", status: "Completed", color: "text-green-500" },
    { title: "JSX and Components", src: "https://www.w3schools.com/html/movie.mp4", status: "In Progress", color: "text-blue-500" },
    { title: "State and Props", src: "", status: "Locked", color: "text-gray-500" },
    { title: "Hooks and Effects", src: "", status: "Locked", color: "text-gray-500" },
    { title: "Advanced Topics", src: "", status: "Locked", color: "text-gray-500" },
  ];

  return (
    <div className="bg-[#101828] min-h-screen text-white font-sans flex flex-col">

      {/* Main Content */}
      <main className="flex flex-col md:flex-row flex-1 p-6 gap-6">
        {/* Video Player Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:w-3/4 bg-[#1A2238] p-6 rounded-2xl shadow-lg"
        >
          <h1 className="text-3xl font-semibold mb-2">
            Mastering React for Skill Barter
          </h1>
          <p className="text-gray-400 mb-6">
            Instructor: Expert Developer | Duration: 10 hours | Barter Value: 5 Skills
          </p>

          {/* Video Player */}
          <div className="mb-6 rounded-lg overflow-hidden">
            {videos[currentVideo].src ? (
              <video
                key={currentVideo}
                src={videos[currentVideo].src}
                controls
                autoPlay
                className="w-full aspect-video bg-black"
              />
            ) : (
              <div className="w-full aspect-video bg-black flex items-center justify-center">
                <span className="text-gray-500">Locked Video</span>
              </div>
            )}
          </div>

          {/* Course Description */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">About This Course</h2>
            <p className="text-gray-300 leading-relaxed">
              Learn React fundamentals and build real-world applications. Barter your
              skills to access premium content or teach others.
            </p>
          </div>
        </motion.section>

        {/* Sidebar: Course Outline */}
        <motion.aside
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:w-1/4 bg-[#1A2238] p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4">Course Outline</h2>
          <div className="space-y-4">
            {videos.map((item, idx) => (
              <div
                key={idx}
                onClick={() => item.src && setCurrentVideo(idx)}
                className="flex items-center space-x-3 bg-[#2A3448] p-3 rounded-lg hover:bg-[#344060] cursor-pointer transition"
              >
                {/* Thumbnail */}
                <div className="w-16 h-10 bg-gray-700 flex items-center justify-center rounded-md overflow-hidden">
                  {item.src ? (
                    <video src={item.src} className="w-full h-full object-cover" muted />
                  ) : (
                    <span className="text-xs text-gray-400">Thumb</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{idx + 1}. {item.title}</p>
                  <p className={`text-xs ${item.color}`}>{item.status}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Progress</h3>
            <div className="bg-gray-700 h-3 rounded-full relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "33%" }}
                transition={{ duration: 1 }}
                className="bg-blue-600 h-3 rounded-full"
              ></motion.div>
              <span className="absolute inset-0 flex justify-center items-center text-xs font-bold">
                33%
              </span>
            </div>
          </div>

          {/* Barter Options */}
          {/* <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Barter Skills</h3>
            <button className="w-full bg-green-600 py-2 rounded-lg hover:bg-green-700 transition mb-2">
              Offer Skill to Unlock
            </button>
            <button className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 transition">
              Request Mentorship
            </button>
          </div> */}
        </motion.aside>
      </main>

      {/* Footer
      <footer className="bg-[#1A2238] p-4 text-center text-gray-400 text-sm">
        &copy; 2025 Skill Barter Platform. All rights reserved.
      </footer> */}
    </div>
  );
}

export default CourseVideo;