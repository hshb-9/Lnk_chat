import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import axios from "axios";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [selectedMessages, setSelectedMessages] = useState([]);

  const toggleMessageSelection = (id) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]
    );
  };

  const clearSelectedMessages = () => {
    setSelectedMessages([]);
  };

  const handleBulkDelete = async () => {
    try {
      await axios.delete("/api/messages", {
        data: { messageIds: selectedMessages },
      });
      clearSelectedMessages();
      getMessages(selectedUser._id); // Refresh after deletion
    } catch (error) {
      console.error("Bulk delete error:", error);
    }
  };

  const handleSingleDelete = async (id) => {
    try {
      await axios.delete(`/api/messages/${id}`);
      getMessages(selectedUser._id); // Refresh
    } catch (error) {
      console.error("Delete error: ", error);
    }
  };

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  useEffect(() => {
    if (messageEndRef.current && messages.length) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      {selectedMessages.length > 0 && (
        <div className="bg-red-100 text-red-700 p-2 flex justify-between items-center">
          <span>{selectedMessages.length} selected</span>
          <button
            onClick={handleBulkDelete}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete Selected
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`chat ${
              msg.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    msg.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedMessages.includes(msg._id)}
                onChange={() => toggleMessageSelection(msg._id)}
              />
              <time className="text-xs opacity-50">
                {formatMessageTime(msg.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {msg.image && (
                <img
                  src={msg.image}
                  alt="attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {msg.text && <p>{msg.text}</p>}
              <button
                onClick={() => handleSingleDelete(msg._id)}
                className="text-red-500 text-sm mt-1 text-right"
                title="Delete Message"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
