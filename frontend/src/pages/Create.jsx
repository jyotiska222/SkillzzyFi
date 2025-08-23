// Create.jsx (also known as the upload section in the navbar)
import React, { useState, useRef } from 'react';
import { useWallet } from '../contexts/walletContext';

const Create = () => {
  const{contract} = useWallet()
  const [uploadStatus, setUploadStatus] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    privacy: 'public',
    video: null,
    thumbnail: null
  });
  
  const [preview, setPreview] = useState({
    video: null,
    thumbnail: null
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});

  // Add these new state variables after your existing ones
  const [showScoring, setShowScoring] = useState(false);
  const [scoringInProgress, setScoringInProgress] = useState(false);
  const [scoringResult, setScoringResult] = useState(null);
  const [duration, setDuration] = useState('');
  const [videoDurationSeconds, setVideoDurationSeconds] = useState(0); // Store duration in seconds
  const [scoringError, setScoringError] = useState('');

  
  const videoRef = useRef(null);
  const thumbnailRef = useRef(null);
  
  const [review, setReview] = useState(null);

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'music', label: 'Music' },
    { value: 'technology', label: 'Technology' }
  ];

  // Function to format seconds to MM:SS format
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Function to get video duration
  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const durationInSeconds = video.duration;
        const durationInMinutes = Math.round(durationInSeconds / 60);
        
        setVideoDurationSeconds(durationInSeconds);
        setDuration(durationInMinutes.toString()); // Set duration in minutes for the form
        
        resolve({
          seconds: durationInSeconds,
          minutes: durationInMinutes,
          formatted: formatDuration(durationInSeconds)
        });
      };
      
      video.src = URL.createObjectURL(file);
    });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (!file) return;
    
    // Validate file types
    if (name === 'video' && !file.type.includes('video/')) {
      setErrors(prev => ({
        ...prev,
        video: 'Please upload a valid video file'
      }));
      return;
    }
    
    if (name === 'thumbnail' && !file.type.includes('image/')) {
      setErrors(prev => ({
        ...prev,
        thumbnail: 'Please upload a valid image file'
      }));
      return;
    }
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: file
    }));

    // If it's a video file, get its duration
    if (name === 'video') {
      try {
        const videoDuration = await getVideoDuration(file);
        console.log('Video duration detected:', videoDuration);
      } catch (error) {
        console.error('Error getting video duration:', error);
      }
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(prev => ({
        ...prev,
        [name]: reader.result
      }));
    };
    reader.readAsDataURL(file);
    
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.video) {
      newErrors.video = 'Video file is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsUploading(true);
    setProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'general',
      privacy: 'public',
      video: null,
      thumbnail: null
    });
    setPreview({
      video: null,
      thumbnail: null
    });
    setErrors({});
    setDuration('');
    setVideoDurationSeconds(0);
    setShowScoring(false);
    setScoringResult(null);
    setScoringError('');
    if (videoRef.current) videoRef.current.value = '';
    if (thumbnailRef.current) thumbnailRef.current.value = '';
  };

  const uploadToIPFS = async (e) => {
    try {
      console.log("uploading ipfs started")
      e.preventDefault(); // stop page refresh

      const data = new FormData();
      data.append("video", formData.video);
      data.append("thumbnail", formData.thumbnail);
      
      const response = await fetch("http://localhost:3001/upload-to-ipfs", {
        method: "POST",
        body: data,
      });

      const res = await response.json();
      const vid = res.video;
      const tid = res.thumbnail
      
      console.log("Upload response:", res);

      try {
        setUploadStatus("Storing on blockchain...");
        console.log("contract:",contract)
        
        // Use the formatted duration for blockchain storage
        const formattedDuration = formatDuration(videoDurationSeconds);
        const scoreToUse = review ? review.score : 50; // Default score if no review
        
        const tx = await contract.uploadContent(
          formData.title, 
          vid, 
          tid, 
          formattedDuration, // Pass formatted duration (e.g., "5:30")
          formData.category, 
          scoreToUse
        );
        await tx.wait();
        
        setUploadStatus(`Successfully uploaded and stored on blockchain!`);
      } catch (blockchainError) {
        console.error("Blockchain error:", blockchainError);
      }
      
    } catch (err) {
      console.error(err);
      setUploadStatus("Error uploading file.");
    }
  };

  const scoreVideo = async () => {
    if (!formData.video || !formData.title.trim()) {
      setScoringError('Please provide a title and upload a video first');
      return;
    }

    setScoringInProgress(true);
    setScoringError('');
    setScoringResult(null);

    try {
      const scoringFormData = new FormData();
      scoringFormData.append('video', formData.video);
      scoringFormData.append('title', formData.title);
      scoringFormData.append('description', formData.description || '');
      scoringFormData.append('duration_minutes', duration || '');

      const response = await fetch('http://localhost:5000/score', {
        method: 'POST',
        body: scoringFormData,
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error('Failed to score video');
      }

      const result = await response.json();
      setScoringResult(result);
      setUploadStatus(`Video scored: ${result.score} points!`);
      
      setTimeout(() => {
        setReview(result);
      }, 5000);
      
      console.log("result:", result);
    } catch (error) {
      console.error('Scoring error:', error);
      setScoringError(`Scoring failed: ${error.message}`);
    } finally {
      setScoringInProgress(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-700 to-slate-900 min-h-screen pt-[20px] pb-[20px]">
    <div className=" max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg shadow-lg border border-blue-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Upload Your Video</h1>
      
      <form onSubmit={(e) => uploadToIPFS(e)} className="space-y-6">
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-blue-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
              errors.title ? 'border-red-500' : 'border-blue-200 hover:border-blue-300'
            }`}
            placeholder="Enter video title"
          />
          {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-blue-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-blue-300"
            placeholder="Tell viewers about your video..."
          />
        </div>

        {/* Duration Display - Show auto-detected duration */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-blue-700 mb-2">
            Video Duration
          </label>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-gray-100 rounded-lg border-2 border-gray-200">
              <span className="text-sm font-medium">
                {videoDurationSeconds > 0 
                  ? `Auto-detected: ${formatDuration(videoDurationSeconds)} (${Math.round(videoDurationSeconds / 60)} minutes)`
                  : 'Upload video to auto-detect duration'
                }
              </span>
            </div>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-32 px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-blue-300"
              placeholder="Override"
              min="1"
              title="Override auto-detected duration (in minutes)"
            />
          </div>
          <p className="mt-1 text-xs text-blue-600">
            Duration is auto-detected when you upload a video. You can override if needed.
          </p>
        </div>
        
        {/* Video Upload */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <label htmlFor="video" className="block text-sm font-medium text-blue-700 mb-2">
            Video File <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex-1 cursor-pointer">
              <div className={`px-4 py-6 border-2 border-dashed rounded-lg text-center transition-all ${
                errors.video ? 'border-red-500 bg-red-50' : 'border-blue-300 hover:border-blue-400 bg-white'
              }`}>
                <input
                  type="file"
                  id="video"
                  name="video"
                  ref={videoRef}
                  onChange={handleFileChange}
                  accept="video/*"
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-10 h-10 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    {formData.video ? formData.video.name : 'Click to upload video (MP4, MOV, etc.)'}
                  </p>
                </div>
              </div>
            </label>
          </div>
          {errors.video && <p className="mt-2 text-sm text-red-600">{errors.video}</p>}
          
          {/* Video Preview */}
          {preview.video && (
            <div className="mt-4">
              <p className="text-sm font-medium text-blue-700 mb-2">Video Preview:</p>
              <video 
                controls 
                className="w-full max-h-64 rounded-lg border-2 border-blue-200 shadow-sm"
                src={preview.video}
              />
            </div>
          )}
        </div>
        
        {/* Thumbnail Upload */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <label htmlFor="thumbnail" className="block text-sm font-medium text-blue-700 mb-2">
            Thumbnail Image
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex-1 cursor-pointer">
              <div className={`px-4 py-6 border-2 border-dashed rounded-lg text-center transition-all ${
                errors.thumbnail ? 'border-red-500 bg-red-50' : 'border-blue-300 hover:border-blue-400 bg-white'
              }`}>
                <input
                  type="file"
                  id="thumbnail"
                  name="thumbnail"
                  ref={thumbnailRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-10 h-10 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    {formData.thumbnail ? formData.thumbnail.name : 'Click to upload thumbnail (JPG, PNG, etc.)'}
                  </p>
                </div>
              </div>
            </label>
          </div>
          {errors.thumbnail && <p className="mt-2 text-sm text-red-600">{errors.thumbnail}</p>}
          
          {/* Thumbnail Preview */}
          {preview.thumbnail && (
            <div className="mt-4">
              <p className="text-sm font-medium text-blue-700 mb-2">Thumbnail Preview:</p>
              <img 
                src={preview.thumbnail} 
                alt="Thumbnail preview" 
                className="w-40 h-40 object-cover rounded-lg border-2 border-blue-200 shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Video Scoring Section */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-700">
              🎯 Get Default Points Preview
            </h3>
            <button
              type="button"
              onClick={() => setShowScoring(!showScoring)}
              className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              {showScoring ? 'Hide' : 'Show'} Scoring
            </button>
          </div>
          
          {showScoring && (
            <div className="space-y-4">
              <p className="text-sm text-purple-600">
                Get an AI-powered preview of your video's default points based on content quality, 
                duration, and metadata completeness.
              </p>
              
              <button
                type="button"
                onClick={scoreVideo}
                disabled={scoringInProgress || !formData.video || !formData.title.trim()}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {scoringInProgress ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Video...
                  </span>
                ) : (
                  '🎯 Score My Video'
                )}
              </button>
              
              {/* Scoring Progress */}
              {scoringInProgress && (
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-700 mb-2">Analyzing your video...</p>
                  <div className="w-full bg-purple-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-700 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-xs text-purple-600 mt-2">This may take 30-60 seconds for AI analysis</p>
                </div>
              )}
              
              {/* Scoring Results */}
              {scoringResult && (
                <div className="p-4 bg-white rounded-lg border border-green-200 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                      {scoringResult.score}
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">Default Points Preview</h4>
                      <p className="text-sm text-green-600">Score: {scoringResult.score} out of 100</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${(scoringResult.score / 50) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-1">AI Analysis:</h5>
                    <p className="text-sm text-green-700">{scoringResult.explanation}</p>
                  </div>
                  {scoringResult.duration && (
                    <p className="text-xs text-gray-600 mt-2">Duration analyzed: {scoringResult.duration} minutes</p>
                  )}
                </div>
              )}
              
              {/* Scoring Error */}
              {scoringError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">⚠️ {scoringError}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-blue-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-blue-300"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Progress Bar */}
        {isUploading && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-700 mb-2">Upload Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-700 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-blue-600 mt-2">Uploading... {progress}%</p>
          </div>
        )}
        
        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2 border-2 border-blue-300 text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
            disabled={isUploading}
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload Video'
            )}
          </button>
          <p>{uploadStatus}</p>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Create;