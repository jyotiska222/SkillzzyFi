import React, { useEffect, useState } from "react";
import { BsPlayFill } from "react-icons/bs";
import { FiClock } from "react-icons/fi";
import { useWallet } from "../contexts/walletContext";
import { useNavigate } from "react-router-dom";

const FeaturedVideos = () => {
  const [videos, setVideos] = useState([]);
  const { contract } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      if (contract) {
        try {
          const allVideos = await contract.getAllContents();
          setVideos(allVideos.slice(0, 4)); // ✅ take only first 4
        } catch (err) {
          console.error("Error fetching videos:", err);
        }
      }
    };
    fetchVideos();
  }, [contract]);

  const formatDuration = (duration) => {
    if (!duration) return "0:00";
    if (typeof duration === "string" && duration.includes(":")) return duration;
    const minutes = parseInt(duration);
    if (!isNaN(minutes)) return `${minutes}:00`;
    return duration.toString();
  };

  return (
    <section className="py-8 px-10 bg-gray-950 text-white pb-20">
      <h2 className="text-4xl font-bold mb-8 text-center">Featured Videos</h2>
      <div className="flex justify-end mb-[20px]">
        <button onClick={() => navigate("/explore")} className="px-4 py-2 bg-[#06D6A0] text-black font-semibold rounded-3xl shadow-[0_0_20px_rgba(6,214,160,0.6)] hover:bg-[#06b38a] transition cursor-pointer">
            Explore More →
        </button>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
        {videos.map((video, idx) => (
          <div
            key={idx}
            onClick={() => navigate("/explore")} 
            className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative">
              <img
                src={`https://aqua-raw-mollusk-988.mypinata.cloud/ipfs/${video.thumbHash}`}
                alt={video.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs font-medium">
                {formatDuration(video.duration)}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <div className="bg-black bg-opacity-60 rounded-full p-3">
                  <BsPlayFill className="text-white text-xl" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-medium line-clamp-2">{video.title}</h3>
              <div className="flex items-center text-gray-400 text-xs mt-1">
                <FiClock className="mr-1" />
                <span>{formatDuration(video.duration)}</span>
                <span className="ml-2">{video.currentPrice || 10} points</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedVideos;


