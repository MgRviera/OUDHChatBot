"use client";
import { useState } from "react";
import Image from "next/image";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 ¡Hola! Soy el asistente OUDH, ¿listo para empezar?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "🤖 Gracias por tu mensaje, pronto responderé con más datos.",
        },
      ]);
    }, 800);
    setInput("");
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-br from-[#2A3F73] via-[#F7972B] to-[#898D8E]">
      {/* Header */}
      <div className="flex flex-col items-center justify-center py-8">
        <Image
          src="/logo-oudh.jpg"
          alt="Logo OUDH"
          width={180}
          height={180}
          className="rounded-full shadow-lg border-4 border-white"
        />
        <h1 className="text-white text-3xl font-bold mt-4 text-center drop-shadow-lg">
          Tu asistente en Derechos Humanos ✨
        </h1>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-white bg-opacity-90 rounded-t-3xl shadow-inner">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`px-5 py-3 rounded-2xl max-w-[75%] ${
              msg.role === "user"
                ? "ml-auto bg-[#F7972B] text-white"
                : "bg-[#EDEDED] text-[#2A3F73] border border-[#898D8E]"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white flex gap-2 items-center border-t border-[#898D8E]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Escribe tu mensaje..."
          className="flex-1 p-3 rounded-full border border-[#898D8E] text-[#2A3F73] placeholder-[#898D8E] focus:outline-none focus:ring-2 focus:ring-[#F7972B]"
        />
        <button
          onClick={sendMessage}
          className="bg-[#F7972B] text-white px-5 py-3 rounded-full hover:bg-orange-600 transition transform hover:scale-105"
        >
          🚀
        </button>
      </div>
    </div>
  );
}
