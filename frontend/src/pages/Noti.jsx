import React, { useState } from "react";
import { X } from "lucide-react";
import { IoIosNotifications } from "react-icons/io";
import { useWallet } from "../contexts/walletContext";

const Noti = ({ showNotifications, toggleNotifications, notifications, setNotifications }) => {
  const { contract, account } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to extract content IDs from exchange notification message
  const extractExchangeIds = (message) => {
    // Message format: "0x...wants to exchange: [Title1] with [Title2]"
    try {
      // Extract the sender address (first 42 characters)
      const senderAddress = message.substring(0, 42);
      
      // Find the content titles
      const wantsIndex = message.indexOf("wants to exchange: ");
      if (wantsIndex === -1) return null;
      
      const withIndex = message.indexOf(" with ");
      if (withIndex === -1) return null;
      
      const title1 = message.substring(wantsIndex + 19, withIndex);
      const title2 = message.substring(withIndex + 6);
      
      return { senderAddress, title1, title2 };
    } catch (error) {
      console.error("Error parsing exchange message:", error);
      return null;
    }
  };

  // Function to find content ID by title
  const findContentIdByTitle = async (title) => {
    try {
      const allContents = await contract.getAllContents();
      for (let i = 0; i < allContents.length; i++) {
        if (allContents[i].title === title) {
          return i;
        }
      }
      return null;
    } catch (error) {
      console.error("Error finding content by title:", error);
      return null;
    }
  };

  // Confirm exchange function
  const confirmExchange = async (notification) => {
    if (!contract || !account) return;
    
    setIsProcessing(true);
    try {
      // Extract information from the notification
      const exchangeData = extractExchangeIds(notification.message);
      if (!exchangeData) {
        alert("Could not parse exchange request");
        return;
      }
      
      // Find the content IDs
      const c1Id = await findContentIdByTitle(exchangeData.title1);
      const c2Id = await findContentIdByTitle(exchangeData.title2);
      
      if (c1Id === null || c2Id === null) {
        alert("Could not find the content for exchange");
        return;
      }
      
      // Convert address string to proper address format
      const senderAddress = exchangeData.senderAddress;
      console.log(c1Id,":",c2Id)
      
      // Call the confirm exchange function in the contract
      const tx = await contract.confirmExcng(c2Id, c1Id, senderAddress);
      await tx.wait();
      
      alert("Exchange confirmed successfully!");
      
      // Remove the notification
      clearNotification(notification.id);
    } catch (error) {
      console.error("Error confirming exchange:", error);
      alert("Failed to confirm exchange: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => setNotifications([]);

  // 🔹 Utility to shorten ID
  const shortenId = (id) => {
    if (!id) return "";
    return id.length > 10 ? `${id.slice(0, 4)}...${id.slice(-4)}` : id;
  };

  // 🔹 Utility to shorten message in the middle
  const shortenText = (text, maxLength = 40) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    const half = Math.floor(maxLength / 2);
    return `${text.slice(0, half)}...${text.slice(-half)}`;
  };

  return (
    <>
      {/* Notifications Panel */}
      <div
        className={`fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-100 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          showNotifications ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-gradient-to-r from-blue-800 to-purple-800 text-white flex justify-between items-center h-16">
          <h2 className="text-xl font-bold ">Notifications</h2>
          <button onClick={toggleNotifications} className="text-white hover:text-yellow-300">
            <X size={24} />
          </button>
        </div>
        <div className="h-[calc(100%-8rem)] overflow-y-auto p-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-3 mb-3 bg-gray-200 rounded-lg border border-gray-200 hover:bg-gray-300 transition-colors relative"
              >
                <button
                  onClick={() => clearNotification(notification.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
                {/* 🔹 Show shortened ID */}
                <p className="text-xs text-gray-500 mb-1">ID: {shortenId(notification.id)}</p>
                {/* 🔹 Show shortened message */}
                <p className="text-gray-800 pr-6">{shortenText(notification.message, 50)}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{notification.time}</span>
                  {notification.topic === "Exchange" ? (
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => confirmExchange(notification)} 
                        className="bg-green-500 hover:bg-green-600 px-2 py-1 text-white cursor-pointer rounded-2xl"
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Accept"}
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 px-2 py-1 text-white cursor-pointer rounded-2xl">Reject</button>
                    </div>
                  ) : (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      +{notification.price} pts
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <IoIosNotifications className="text-4xl mx-auto mb-2 text-gray-300" />
              <p>No notifications yet</p>
              <p className="text-sm mt-1">You'll see notifications here when people purchase your courses</p>
            </div>
          )}
        </div>
        {notifications.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white h-16">
            <button
              onClick={clearAllNotifications}
              className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              Clear All Notifications
            </button>
          </div>
        )}
      </div>
      {showNotifications && (
        <div className="fixed inset-0 z-30 bg-opacity-50 backdrop-blur-sm" onClick={toggleNotifications} />
      )}
    </>
  );
};

export default Noti;
