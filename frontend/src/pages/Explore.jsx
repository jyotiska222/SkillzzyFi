// Explore.js
import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiClock, FiTrendingUp, FiHeart, FiShare2, FiMoreVertical, FiX, FiLoader } from 'react-icons/fi';
import { BsPlayFill, BsDot } from 'react-icons/bs';
import { useWallet } from '../contexts/walletContext';
import { CgArrowsExchange } from "react-icons/cg";
import { Loader } from 'lucide-react';
import { Coins } from 'lucide-react';

const Explore = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [topics, setTopics] = useState(['']);
  const [showResults, setShowResults] = useState(false);
  const [matchResults, setMatchResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { contract } = useWallet();
  const [videos, setVideos] = useState([]);
  const [accessMap,setAccessMap] = useState({})


  useEffect(() => {
  const getVideos = async () => {
    if (contract) {
      try {
        const newVideos = await contract.getAllContents();
        setVideos(newVideos);

        const accessData = {};
        for (let i = 0; i < newVideos.length; i++) {
          try {
            const hasAccess = await contract.hasAccess(i);
            accessData[i] = hasAccess;
          } catch (error) {
            console.error(`Error checking access for content ${i}:`, error);
            accessData[i] = false;
          }
        }

        setAccessMap(accessData);
        console.log("calculated accessData:", accessData);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    }
  };

  getVideos();
}, [contract]);

useEffect(() => {
  console.log("accessMap updated:", accessMap);
}, [accessMap]);


  const categories = [
    { id: 'all', name: 'All', icon: <FiTrendingUp /> },
    { id: 'technology', name: 'Technology', icon: <FiTrendingUp /> },
    { id: 'design', name: 'Design', icon: <FiTrendingUp /> },
    { id: 'gaming', name: 'Gaming', icon: <FiTrendingUp /> },
    { id: 'music', name: 'Music', icon: <FiTrendingUp /> },
    { id: 'travel', name: 'Travel', icon: <FiTrendingUp /> },
    { id: 'health', name: 'Health', icon: <FiTrendingUp /> },
    { id: 'photography', name: 'Photography', icon: <FiTrendingUp /> }
  ];

  const filteredVideos = videos.filter(video => {
    const matchesCategory = activeFilter === 'all' || video.category === activeFilter;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         video.channel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const handleOpenVideo = () => {
    if (selectedVideo) {
      window.open(`https://aqua-raw-mollusk-988.mypinata.cloud/ipfs/${selectedVideo.ipfsHash}`, "_blank");
      setShowModal(false);
    }
  };

  const handleBuyNow = async(id) => {
    // console.log("Buy now clicked for:", selectedVideo);
    // alert("Purchase functionality would be implemented here");
    try {
      const tx = await contract.purchaseContent(id)
      tx.wait();
      console.alert("Purchased successfully , you may have to refresh your page")
    } catch (error) {
      
    }
    setShowModal(false);
  };

  const handlePlayVideo = (video) => {
    window.open(`https://aqua-raw-mollusk-988.mypinata.cloud/ipfs/${video.ipfsHash}`, "_blank");
  };

  const resetAnalysis = () => {
    setShowResults(false);
    setMatchResults([]);
    setIsProcessing(false);
  };

  // Function to format duration - handles both "MM:SS" format and plain text
  const formatVideoDuration = (duration) => {
    if (!duration) return "0:00";
    
    // If duration is already in MM:SS format, return as is
    if (typeof duration === 'string' && duration.includes(':')) {
      return duration;
    }
    
    // If it's a number or string number, treat as minutes
    const minutes = parseInt(duration);
    if (!isNaN(minutes)) {
      return `${minutes}:00`;
    }
    
    // Fallback for any other format
    return duration.toString();
  };

  // AI CONNECTION
  const handleAddTopic = () => {
    if (topics.length < 5) {
      setTopics([...topics, '']);
    }
  };

  const handleTopicChange = (index, value) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const handleRemoveTopic = (index) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };

  const handleContentMatch = async (video) => {
    const validTopics = topics.filter(topic => topic.trim());
    
    if (validTopics.length === 0) {
      alert("Please enter at least one topic to match");
      return;
    }

    setIsProcessing(true);
    setShowResults(true);
    
    // Show initial loading state
    setMatchResults({
      totalTopics: validTopics.length,
      topicsFound: 0,
      topicsMissing: validTopics.length,
      coverage: 0,
      details: validTopics.map(topic => ({
        topic,
        status: "pending",
        confidence: 0,
        explanation: "Analyzing..."
      }))
    });

    try {
      const response = await fetch('http://localhost:5001/process_ipfs_video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ipfsHash: video.ipfsHash,
          topics: validTopics
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setMatchResults({
          totalTopics: data.statistics.totalTopics,
          topicsFound: data.statistics.topicsFound,
          topicsMissing: data.statistics.topicsMissing,
          coverage: data.statistics.coverage,
          details: data.details
        });
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Error processing video:', error);
      alert(`Failed to analyze video content: ${error.message}`);
      setShowResults(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className=" min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="pr-96">
        <div className="w-full">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Explore Content
            </h1>
            <p className="text-gray-400 mt-2">Discover amazing videos from creators worldwide</p>
          </header>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search videos, channels..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <FiFilter />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeFilter === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map(video => (
              <div 
                key={video.id} 
                className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                onClick={() => handleVideoClick(video)}
              >
                {/* Thumbnail */}
                <div className="relative">
                  <img 
                    src={`https://aqua-raw-mollusk-988.mypinata.cloud/ipfs/${video.thumbHash}`} 
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  {/* Duration Badge - Now shows actual video duration */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-sm font-medium">
                    {formatVideoDuration(video.duration)}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black bg-opacity-60 rounded-full p-4 hover:bg-opacity-80 transition">
                      <BsPlayFill className="text-white text-2xl" />
                    </div>
                  </div>
                </div>
                 
                {/* Video Info */}
                <div className="p-4">
                  <div className="flex gap-3">
                    <img 
                      src={"https://th.bing.com/th/id/OIP.uuvmdU0rKNYK6ybEnVNjHgHaGW?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"} 
                      alt={"CodeMaster"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium line-clamp-2">{video.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">{"CodeMaster"}</p>
                      <div className="flex items-center text-gray-400 text-xs mt-1">
                        <FiClock className="mr-1" />
                        <span>{formatVideoDuration(video.duration)}</span>
                        <BsDot className="mx-1" />
                        <span>{video.currentPrice || 10} points</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContentMatch(video);
                      }}
                      className="absolute top-2 right-2 z-10 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full transition-colors"
                    >
                      Match Content
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Video Selection Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-md">
              <div className="relative bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                {/* Close Button */}
                <button 
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
                
                {/* Modal Content */}
                <div className="text-center">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Video Options</h2>
                    <p className="text-gray-400">Choose how you want to access this content</p>
                  </div>
                  
                  <div className="mb-6">
                    <img 
                      src={`https://aqua-raw-mollusk-988.mypinata.cloud/ipfs/${selectedVideo?.thumbHash}`} 
                      alt={selectedVideo?.title}
                      className="w-full h-50 object-cover rounded-xl mb-4"
                    />
                    <h3 className="font-medium text-lg mb-1">{selectedVideo?.title}</h3>
                    <p className="text-gray-400 text-sm">By {selectedVideo?.channel || "Unknown Creator"}</p>
                    <div className="flex items-center justify-center text-gray-400 text-sm mt-2">
                      <FiClock className="mr-1" />
                      <span>{formatVideoDuration(selectedVideo?.duration)}</span>
                      <BsDot className="mx-1" />
                      <span>{selectedVideo?.currentPrice || 10} points</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={handleOpenVideo}
                      className="flex items-center justify-center gap-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-[20px] transition-colors font-medium text-sm"
                    >
                      <i className="ri-play-fill text-lg"></i>
                      <Coins className="h-4 w-4 text-Red-600" />
                      {selectedVideo?.currentPrice || 10}
                    </button>
                    {accessMap[selectedVideo.id]?<button 
                      onClick={handleOpenVideo}
                      className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-[20px] transition-colors font-medium text-sm"
                    >
                      <i className="ri-play-fill text-lg"></i>
                      Open Video
                    </button>:
                    <>
                    <button 
                      onClick={(e)=>handleBuyNow(selectedVideo.id)}
                      className="flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-[20px] transition-colors font-medium text-sm"
                    >
                      <i className="ri-heart-line text-lg"></i>
                      Buy Now
                    </button>
                    
                    <div className="relative group">
                      <button 
                        onClick={handleBuyNow}
                        className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-[20px] transition-colors font-medium text-sm"
                      >
                        <i className="ri-exchange-line text-lg"></i>
                        Exchange
                      </button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-white text-black text-xs rounded-md py-2 px-3 shadow-lg z-10">
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-3 h-3 rotate-45 bg-white"></div>
                        Exchange your skill with anyone
                      </div>
                    </div></>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredVideos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-gray-800 p-6 rounded-full mb-4">
                <FiSearch className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No videos found</h3>
              <p className="text-gray-400 max-w-md">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>

        {/* TOPIC INPUT SECTION WITH RESULT SHOWCASING */}
        {/* Topic Input Section */}
        <div className="fixed top-6 right-6 bottom-6 w-80 bg-gray-800 p-6 rounded-xl transition-all duration-300 overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4 sticky top-0 bg-gray-800 py-2">
            {!showResults ? 'Match Content' : 'Analysis Results'}
          </h3>
          {!showResults ? (
            <div className="space-y-4">
              {topics.map((topic, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => handleTopicChange(index, e.target.value)}
                    placeholder="Enter topic"
                    className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {index > 0 && (
                    <button
                      onClick={() => handleRemoveTopic(index)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              ))}
              {topics.length < 5 && (
                <button
                  onClick={handleAddTopic}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  + Add Topic
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">Total</div>
                    <div className="text-lg font-bold">{matchResults.totalTopics || 0}</div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm text-gray-400">Found</div>
                    <div className="text-lg font-bold text-green-500">{matchResults.topicsFound || 0}</div>
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">Missing</div>
                    <div className="text-lg font-bold text-red-500">{matchResults.topicsMissing || 0}</div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm text-gray-400">Coverage</div>
                    <div className="text-lg font-bold text-yellow-500">{matchResults.coverage || 0}%</div>
                  </div>
                </div>
              </div>

              {/* Warning Banner */}
              {matchResults.topicsMissing > 0 && (
                <div className="bg-yellow-500 bg-opacity-20 border border-yellow-600 text-yellow-500 px-3 py-2 rounded-lg text-sm">
                  ⚠️ Missing Content
                </div>
              )}

              {/* Sub-topics Section */}
              {isProcessing ? (
                <div className="text-center py-8">
                  <FiLoader className="animate-spin text-4xl mx-auto mb-4 text-blue-500" />
                  <p className="text-sm text-gray-400">Analyzing video content...</p>
                  <p className="text-xs text-gray-500 mt-1">This may take a few moments</p>
                </div>
              ) : (
                <>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-sm">📝 Detailed Analysis</h4>
                    <div className="space-y-3 text-sm max-h-60 overflow-y-auto">
                      {matchResults.details?.map((detail, index) => (
                        <div key={index} className="border-l-2 border-gray-600 pl-3">
                          <div className={`flex items-center gap-2 mb-1 ${
                            detail.status === 'found' ? 'text-green-400' : 
                            detail.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            <span>
                              {detail.status === 'found' ? '✓' : 
                               detail.status === 'pending' ? '○' : '✗'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="truncate font-medium">{detail.topic}</div>
                              {detail.status !== 'pending' && (
                                <div className="text-xs text-gray-400">
                                  {detail.confidence}% confidence
                                </div>
                              )}
                            </div>
                          </div>
                          {detail.explanation && detail.status !== 'pending' && (
                            <div className="text-xs text-gray-400 mt-1 pl-6">
                              {detail.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={resetAnalysis}
                      className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
                    >
                      Back to Topics
                    </button>
                    {selectedVideo && (
                      <button
                        onClick={() => handlePlayVideo(selectedVideo)}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm flex items-center justify-center gap-1"
                      >
                        <BsPlayFill className="text-lg" />
                        Watch Video
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;