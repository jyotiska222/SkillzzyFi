import React, { useState } from "react";
import { X } from "lucide-react";
import { IoIosNotifications } from "react-icons/io";

const Noti = ({ showNotifications, toggleNotifications, notifications, setNotifications }) => {
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
                      <button className="bg-green-500 hover:bg-green-600 px-2 py-1 text-white cursor-pointer rounded-2xl">
                        Accept
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 px-2 py-1 text-white cursor-pointer rounded-2xl">
                        Reject
                      </button>
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
