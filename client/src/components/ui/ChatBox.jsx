import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Send, X } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const socketUrl = apiUrl.replace("/api", "");

// Connect to Backend Socket
const socket = io.connect(socketUrl);
// const socket = io.connect("http://localhost:5000");

export const ChatBox = ({ appointmentId, user, onClose }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  // 1. Join the Room (Room ID = Appointment ID)
  useEffect(() => {
    if (appointmentId) {
      socket.emit("join_room", appointmentId);
    }
  }, [appointmentId]);

  // 2. Listen for Incoming Messages
  useEffect(() => {
    const handler = (data) => {
      setMessageList((list) => [...list, data]);
    };
    socket.on("receive_message", handler);
    
    // Cleanup listener to prevent duplicates
    return () => socket.off("receive_message", handler);
  }, []);

  // 3. Send Message Function
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: appointmentId,
        author: user.name, // Your Name
        message: currentMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]); // Add to my own list
      setCurrentMessage("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white border-4 border-black shadow-neo z-50 flex flex-col h-125 animate-in slide-in-from-bottom-10">
      
      {/* Header */}
      <div className="bg-neo-main p-3 border-b-4 border-black flex justify-between items-center">
        <h3 className="font-bold font-display text-lg">LIVE CHAT</h3>
        <button onClick={onClose} className="hover:bg-white border-2 border-transparent hover:border-black rounded p-1 transition-all">
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
        {messageList.map((msg, index) => {
          const isMe = msg.author === user.name;
          return (
            <div key={index} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              <div className={`max-w-[80%] p-2 border-2 border-black shadow-sm text-sm font-bold ${isMe ? "bg-white" : "bg-yellow-200"}`}>
                <p>{msg.message}</p>
              </div>
              <span className="text-[10px] text-gray-500 mt-1 font-bold">{msg.time} • {msg.author}</span>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t-4 border-black bg-white flex gap-2">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type a message..."
          className="flex-1 p-2 border-2 border-black focus:outline-none font-bold text-sm"
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => event.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-black text-white p-2 border-2 border-transparent hover:bg-gray-800 transition-colors">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};