import React, { useEffect, useRef, useState } from "react";

const AiChatPanel = ({ onClose }) => {
  const [width, setWidth] = useState(400);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Optional: message history
  const isResizing = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;

      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 300 && newWidth <= 700) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isResizing.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;
  
    const userMessage = { role: "user", text: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
  
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...[...messages, userMessage].map((msg) => ({
              role: msg.role,
              content: msg.text,
            })),
          ],
          temperature: 0.7,
        }),
      });
  
      const data = await res.json();
      console.log("🔁 OpenRouter response:", data);
  
      if (!res.ok) {
        console.error("❌ API Error:", data);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Failed to fetch AI response." },
        ]);
        return;
      }
  
      const botReply = data.choices?.[0]?.message?.content;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: botReply || "No response." },
      ]);
    } catch (err) {
      console.error("❌ Network Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Oops! Something went wrong." },
      ]);
    }
  };
  
  

  return (
    <div className="fixed inset-0 flex justify-end z-50">
      <div
        className="h-full bg-base-200 border-l border-base-300 shadow-lg overflow-hidden flex flex-col relative"
        style={{ width }}
      >
        {/* Resize Handle */}
        <div
          onMouseDown={() => (isResizing.current = true)}
          className="absolute left-0 top-0 h-full w-2 cursor-ew-resize bg-base-300 hover:bg-primary transition-all"
        />

        {/* Header */}
        <div className="p-4 border-b border-base-300 flex justify-between items-center">
          <h2 className="text-lg font-semibold">AI Assistant</h2>
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            ✕
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-sm text-zinc-500">Ask me anything.</p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className = {`p-3 rounded-lg max-w-xs ${
                  msg.role === "user"
                    ? "bg-primary text-white ml-auto"
                    : "bg-base-300 text-sm"
                }`}
              >
                {msg.text}
              </div>
            ))
          )}
        </div>

        {/* Input Box */}
        <div className="p-3 border-t border-base-300 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="input input-bordered flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={!message.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiChatPanel;