import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useWallet } from '../contexts/walletContext';

function CourseVideo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { contract } = useWallet();
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    const fetchVideoData = async () => {
      console.log("Fetching video data for ID:", id);
      console.log("Contract available:", !!contract);

      if (!id) {
        console.log("No video ID provided");
        navigate('/explore');
        return;
      }

      if (!contract) {
        console.log("Waiting for contract to be available...");
        return; // Don't navigate away, just wait for contract
      }

      try {
        setIsLoading(true);
        console.log("Getting all contents...");
        
        // Get all contents and find the one with matching ID
        const allContents = await contract.getAllContents();
        console.log("All contents:", allContents);
        
        const content = allContents.find(c => c.id.toString() === id.toString());
        console.log("Found content:", content);

        if (!content || !content.ipfsHash) {
          console.log("Invalid video content received");
          setVideoData(null);
          setIsLoading(false);
          return;
        }

        // Get access status
        const hasAccess = await contract.hasAccess(parseInt(id));
        console.log("Has access:", hasAccess);

        if (hasAccess || content.creator.toLowerCase() === window.ethereum.selectedAddress.toLowerCase()) {
          setVideoData(content);
          console.log("Video data set successfully:", content);
        } else {
          console.log("No access to video");
          setVideoData(null);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
        setVideoData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoData();
  }, [id, contract, navigate]);

  const videos = videoData ? [
    { 
      title: videoData.title, 
      src: `https://aqua-raw-mollusk-988.mypinata.cloud/ipfs/${videoData.ipfsHash}`, 
      status: "Playing", 
      color: "text-green-500",
      thumb: `https://aqua-raw-mollusk-988.mypinata.cloud/ipfs/${videoData.thumbHash}`
    }
  ] : [];

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
            {videoData?.title || "Video not found"}
          </h1>
          <p className="text-gray-400 mb-6">
            Creator: {videoData?.channel || "Unknown"} | Category: {videoData?.category || "N/A"} | Price: {videoData?.currentPrice || 0} points
          </p>

          {/* Video Player */}
          <div className="mb-6 rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="w-full aspect-video bg-black flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                  <span className="text-gray-400">Loading video...</span>
                </div>
              </div>
            ) : videoData?.ipfsHash ? (
              <div className="relative">
                <video
                  key={videoData.ipfsHash}
                  src={`https://aqua-raw-mollusk-988.mypinata.cloud/ipfs/${videoData.ipfsHash}`}
                  controls
                  autoPlay
                  className="w-full aspect-video bg-black"
                  onError={(e) => {
                    console.error("Video playback error:", e);
                    // Try to show more specific error messages
                    const videoElement = e.target;
                    let errorMessage = "Error playing video. ";
                    
                    if (videoElement.error) {
                      switch (videoElement.error.code) {
                        case 1:
                          errorMessage += "The video loading was aborted.";
                          break;
                        case 2:
                          errorMessage += "Network error occurred while loading the video.";
                          break;
                        case 3:
                          errorMessage += "Error decoding video.";
                          break;
                        case 4:
                          errorMessage += "Video not found or is unsupported.";
                          break;
                        default:
                          errorMessage += "Please try again.";
                      }
                    }
                    
                    alert(errorMessage);
                  }}
                  onLoadStart={() => console.log("Video loading started")}
                  onLoadedData={() => console.log("Video data loaded")}
                  onPlay={() => console.log("Video started playing")}
                />
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4">
                  <h3 className="text-white text-lg font-semibold">{videoData.title}</h3>
                  <p className="text-white/80 text-sm">ID: {id}</p>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-video bg-black flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                  <div className="text-4xl mb-4 text-yellow-500">🔒</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Access Required</h3>
                  <p className="text-gray-400 mb-4">
                    {videoData ? 
                      `This video requires purchase (${videoData.currentPrice} points) or exchange to view.` :
                      "This video is not available or requires permissions to view."
                    }
                  </p>
                  <div className="space-y-2">
                    <button 
                      onClick={() => navigate('/explore')}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-full transition-colors"
                    >
                      Return to Explore Page
                    </button>
                    {videoData && (
                      <button 
                        onClick={() => navigate(`/explore?action=purchase&id=${id}`)}
                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg w-full transition-colors"
                      >
                        Purchase Access
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Video Description */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">About This Video</h2>
            <p className="text-gray-300 leading-relaxed">
              {videoData?.description || 'No description available'}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Category:</span>
                <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                  {videoData?.category || 'Uncategorized'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Points:</span>
                <span className="bg-yellow-600 px-3 py-1 rounded-full text-sm">
                  {videoData?.currentPrice || 0}
                </span>
              </div>
            </div>
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