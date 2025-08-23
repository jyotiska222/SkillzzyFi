import React, { useState } from 'react';
import { Play, BookOpen, Award, Clock, Star, X, Edit3, Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Calendar, Eye } from 'lucide-react';
import { useWallet } from "../contexts/walletContext";

const Profile = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const { account, balance } = useWallet();

  // Mock data for demonstration
  const [userData, setUserData] = useState({
    name: "Alex Rodriguez",
    username: "@alexcrypto",
    email: "alex@example.com",
    bio: "Passionate Web3 developer and blockchain enthusiast",
    avatar: "/api/placeholder/120/120",
    badge: "gold",
    totalCourses: 12,
    completedCourses: 8,
    totalWatchTime: "47h 23m",
    joinDate: "Jan 2024"
  });

  // Mock watch history data
  const watchHistory = [
    { id: 1, title: "DeFi Fundamentals", thumbnail: "/api/placeholder/200/120", duration: "2h 15m", progress: 75, instructor: "John Doe" },
    { id: 2, title: "NFT Creation Masterclass", thumbnail: "/api/placeholder/200/120", duration: "3h 45m", progress: 100, instructor: "Sarah Kim" },
    { id: 3, title: "Smart Contract Security", thumbnail: "/api/placeholder/200/120", duration: "1h 30m", progress: 45, instructor: "Mike Chen" },
    { id: 4, title: "Web3 Frontend Development", thumbnail: "/api/placeholder/200/120", duration: "4h 20m", progress: 90, instructor: "Lisa Wang" },
    { id: 5, title: "Blockchain Architecture", thumbnail: "/api/placeholder/200/120", duration: "2h 55m", progress: 60, instructor: "David Lee" }
  ];

  // Mock purchased courses data
  const purchasedCourses = [
    { id: 1, title: "Complete Web3 Developer Bootcamp", thumbnail: "/api/placeholder/250/140", price: "0.5 AVAX", progress: 65, rating: 4.8, lessons: 45 },
    { id: 2, title: "DeFi Protocol Development", thumbnail: "/api/placeholder/250/140", price: "0.8 AVAX", progress: 30, rating: 4.9, lessons: 32 },
    { id: 3, title: "NFT Marketplace Creation", thumbnail: "/api/placeholder/250/140", price: "0.3 AVAX", progress: 100, rating: 4.7, lessons: 28 },
    { id: 4, title: "Solidity Advanced Patterns", thumbnail: "/api/placeholder/250/140", price: "0.6 AVAX", progress: 80, rating: 4.8, lessons: 38 },
    { id: 5, title: "Web3 UI/UX Design", thumbnail: "/api/placeholder/250/140", price: "0.4 AVAX", progress: 15, rating: 4.6, lessons: 25 },
    { id: 6, title: "Crypto Trading Algorithms", thumbnail: "/api/placeholder/250/140", price: "0.7 AVAX", progress: 90, rating: 4.9, lessons: 42 }
  ];

  // Mock recent transaction data
  const recentTransactions = [
    { id: 1, type: "purchase", course: "DeFi Protocol Development", amount: "0.8 AVAX", date: "2024-08-20", status: "completed" },
    { id: 2, type: "purchase", course: "Smart Contract Security", amount: "0.6 AVAX", date: "2024-08-18", status: "completed" },
    { id: 3, type: "refund", course: "Basic Crypto Trading", amount: "0.2 AVAX", date: "2024-08-15", status: "completed" }
  ];

  // Mock full transaction history
  const fullTransactionHistory = [
    { id: 1, type: "purchase", course: "DeFi Protocol Development", amount: "0.8 AVAX", date: "2024-08-20", time: "14:32", status: "completed", txHash: "0x1a2b3c...4d5e6f" },
    { id: 2, type: "purchase", course: "Smart Contract Security", amount: "0.6 AVAX", date: "2024-08-18", time: "09:15", status: "completed", txHash: "0x7g8h9i...0j1k2l" },
    { id: 3, type: "refund", course: "Basic Crypto Trading", amount: "0.2 AVAX", date: "2024-08-15", time: "16:45", status: "completed", txHash: "0x3m4n5o...6p7q8r" },
    { id: 4, type: "purchase", course: "Web3 Frontend Development", amount: "0.4 AVAX", date: "2024-08-12", time: "11:20", status: "completed", txHash: "0x9s0t1u...2v3w4x" },
    { id: 5, type: "purchase", course: "NFT Creation Masterclass", amount: "0.3 AVAX", date: "2024-08-10", time: "13:55", status: "completed", txHash: "0x5y6z7a...8b9c0d" },
    { id: 6, type: "purchase", course: "Blockchain Architecture", amount: "0.5 AVAX", date: "2024-08-08", time: "10:30", status: "completed", txHash: "0x1e2f3g...4h5i6j" },
    { id: 7, type: "purchase", course: "Complete Web3 Developer Bootcamp", amount: "0.5 AVAX", date: "2024-08-05", time: "15:10", status: "completed", txHash: "0x7k8l9m...0n1o2p" }
  ];

  // Function to render badge based on achievement level
  const renderBadge = (badgeType) => {
    const badgeColors = {
      gold: "text-amber-400 bg-amber-400/20 border-amber-400/50",
      silver: "text-gray-300 bg-gray-300/20 border-gray-300/50", 
      bronze: "text-orange-400 bg-orange-400/20 border-orange-400/50"
    };

    return (
      <div className={`absolute -top-2 -right-2 p-2 rounded-full border-2 ${badgeColors[badgeType]} backdrop-blur-sm`}>
        <Award size={20} />
      </div>
    );
  };

  // Function to render progress bar
  const renderProgressBar = (progress) => (
    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
      <div 
        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  // Edit Profile Popup Component
  const EditProfilePopup = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Edit3 className="mr-2 text-emerald-400" size={20} />
            Edit Profile
          </h2>
          <button 
            onClick={() => setShowEditProfile(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <img 
                src={userData.avatar} 
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400"
              />
              <label 
                htmlFor="profilePicture"
                className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm cursor-pointer"
              >
                Change Photo
                <input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        // Here you would typically upload the file to your server
                        // For now, we'll just update the preview
                        setUserData(prev => ({
                          ...prev,
                          avatar: reader.result
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input 
              type="text" 
              defaultValue={userData.name}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input 
              type="text" 
              defaultValue={userData.username}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input 
              type="email" 
              defaultValue={userData.email}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
            <textarea 
              defaultValue={userData.bio}
              rows="3"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-semibold py-2 px-4 rounded-lg hover:from-emerald-600 hover:to-teal-500 transition-all duration-300"
            >
              Save Changes
            </button>
            <button 
              type="button"
              onClick={() => setShowEditProfile(false)}
              className="flex-1 border border-gray-600 text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Transaction History Popup Component
  const TransactionHistoryPopup = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Wallet className="mr-2 text-purple-400" size={20} />
            Transaction History
          </h2>
          <button 
            onClick={() => setShowTransactionHistory(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <div className="space-y-3">
            {fullTransactionHistory.map((transaction) => (
              <div key={transaction.id} className="bg-gray-700/50 border border-gray-600/50 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${transaction.type === 'purchase' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                      {transaction.type === 'purchase' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{transaction.course}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{transaction.date} at {transaction.time}</span>
                        <span className="text-blue-400">TX: {transaction.txHash}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${transaction.type === 'purchase' ? 'text-emerald-400' : 'text-orange-400'}`}>
                      {transaction.type === 'purchase' ? '-' : '+'}{transaction.amount}
                    </div>
                    <div className="text-xs text-green-400 capitalize">{transaction.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#101828] text-white p-6">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Main Profile Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8 relative">
          {/* Background Accent */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-800/10 via-purple-800/10 to-transparent pointer-events-none"></div>
          
          {/* Left Side - Watch History Section */}
          <div className="lg:col-span-3 grid grid-cols-1 gap-8">
            {/* Watch History Card */}
            <div className="bg-[#1c2434] rounded-xl border border-blue-500/20 shadow-xl shadow-blue-900/20 p-6">
              {/* Watch History Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Clock className="text-emerald-400" size={24} />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    Watch History
                  </h2>
                </div>
                <span className="text-blue-300 text-sm">{watchHistory.length} items</span>
              </div>

              {/* Horizontally Scrollable Watch History */}
              <div className="relative">
                <div className="overflow-x-auto custom-scrollbar">
                  <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
                    {watchHistory.map((item) => (
                      <div key={item.id} className="flex-shrink-0 w-72 bg-[#151c2c] rounded-lg border border-blue-500/20 hover:border-emerald-500/50 transition-all duration-300 backdrop-blur-sm group shadow-lg shadow-blue-900/10">
                        
                        {/* Thumbnail with Play Button */}
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img 
                            src={item.thumbnail} 
                            alt={item.title}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <Play className="text-white/80 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-300" size={28} />
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {item.duration}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-semibold text-sm text-white mb-1 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-blue-300 text-xs mb-2">by {item.instructor}</p>
                          {renderProgressBar(item.progress)}
                          <p className="text-xs text-emerald-400 mt-1">{item.progress}% complete</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* My Courses Section */}
            <div className="bg-[#1c2434] rounded-xl border border-blue-500/20 shadow-xl shadow-blue-900/20 p-6">
              {/* My Courses Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <BookOpen className="text-purple-400" size={24} />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
                    My Courses
                  </h2>
                </div>
                <span className="text-blue-300 text-sm">{purchasedCourses.length} courses</span>
              </div>

              {/* Vertically Scrollable Courses Grid */}
              <div className="max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {purchasedCourses.map((course) => (
                    <div key={course.id} className="bg-[#1c2434] rounded-lg border border-blue-500/20 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm group overflow-hidden shadow-lg shadow-blue-900/10">
                      
                      {/* Course Thumbnail */}
                      <div className="relative">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 flex items-center space-x-2">
                          <span className="bg-emerald-500/90 text-white text-xs px-2 py-1 rounded font-semibold">
                            {course.price}
                          </span>
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                          {course.title}
                        </h3>
                        
                        {/* Rating and Lessons */}
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                          <div className="flex items-center space-x-1">
                            <Star className="text-amber-400 fill-current" size={12} />
                            <span className="text-amber-400">{course.rating}</span>
                          </div>
                          <span>{course.lessons} lessons</span>
                        </div>

                        {/* Progress */}
                        {renderProgressBar(course.progress)}
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-purple-400">{course.progress}% complete</span>
                          <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                            Continue →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Profile Picture and Stats */}
          <div className="lg:col-span-1">
            <div className="bg-[#1c2434] rounded-xl border border-blue-500/20 p-4 backdrop-blur-sm sticky top-6 shadow-xl shadow-blue-900/20">
              
              {/* Profile Picture with Badge */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-3 border-gradient-to-r from-emerald-400 to-teal-300 p-0.5 mx-auto">
                    <img 
                      src={userData.avatar} 
                      alt={userData.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  {renderBadge(userData.badge)}
                </div>
                
                {/* User Info */}
                <div className="text-center mt-3">
                  <h1 className="text-lg font-bold text-white mb-1">{userData.name}</h1>
                  <div className="flex flex-col items-center space-y-1.5 mb-2">
                    <div className="flex items-center space-x-1.5">
                      <Wallet className="text-emerald-400" size={14} />
                      <p className="text-emerald-400 text-xs font-mono">{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'No Wallet Connected'}</p>
                    </div>
                    <div className="bg-yellow-400/10 px-2.5 py-0.5 rounded-full">
                      <p className="text-yellow-400 text-xs font-semibold">{balance.toLocaleString()} pts</p>
                    </div>
                  </div>
                  <p className="text-blue-300 text-xs">Member since {userData.joinDate}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#151c2c] rounded-lg p-3 text-center border border-blue-500/20 shadow-lg shadow-blue-900/10 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">{userData.totalCourses}</div>
                  <div className="text-xs text-blue-300">Total Courses</div>
                </div>
                <div className="bg-[#151c2c] rounded-lg p-3 text-center border border-blue-500/20 shadow-lg shadow-blue-900/10 hover:border-purple-500/30 transition-all duration-300">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{userData.completedCourses}</div>
                  <div className="text-xs text-blue-300">Completed</div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="bg-[#151c2c] rounded-lg p-4 border border-blue-500/20 shadow-lg shadow-blue-900/10 mb-6 hover:border-cyan-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-300 text-sm">Watch Time</span>
                  <span className="text-cyan-400 font-semibold">{userData.totalWatchTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-300 text-sm">Achievement</span>
                  <div className="flex items-center space-x-1">
                    <Award className="text-amber-400" size={16} />
                    <span className="text-amber-400 font-semibold capitalize">{userData.badge}</span>
                  </div>
                </div>
              </div>

              {/* Recent Transactions Section */}
              <div className="bg-[#151c2c] rounded-lg p-4 border border-blue-500/20 shadow-lg shadow-blue-900/10 mb-6 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Wallet className="text-purple-400" size={16} />
                    <span className="text-gray-300 text-sm font-medium">Recent Transactions</span>
                  </div>
                  <button 
                    onClick={() => setShowTransactionHistory(true)}
                    className="text-purple-400 hover:text-purple-300 text-xs transition-colors flex items-center space-x-1"
                  >
                    <Eye size={12} />
                    <span>View All</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-b-0">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded-full ${transaction.type === 'purchase' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          {transaction.type === 'purchase' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                        </div>
                        <div>
                          <div className="text-xs text-white font-medium truncate max-w-24">{transaction.course}</div>
                          <div className="text-xs text-gray-400">{transaction.date}</div>
                        </div>
                      </div>
                      <div className={`text-xs font-medium ${transaction.type === 'purchase' ? 'text-emerald-400' : 'text-orange-400'}`}>
                        {transaction.type === 'purchase' ? '-' : '+'}{transaction.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => setShowEditProfile(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-900/20"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #10b981, #14b8a6);
          border-radius: 4px;
          border: 1px solid rgba(55, 65, 81, 0.5);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #059669, #0d9488);
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #10b981 rgba(55, 65, 81, 0.3);
        }
      `}</style>

      {/* Popups */}
      {showEditProfile && <EditProfilePopup />}
      {showTransactionHistory && <TransactionHistoryPopup />}
    </div>
  );
};

export default Profile;