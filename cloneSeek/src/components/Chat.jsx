import { useState } from "react";
import { z } from "zod";
import { Paperclip, Smile, SendHorizontal, Plus, Trash2 } from "lucide-react";
import { useOllamaHook } from "../api/useOllamaHook"; 

const messageSchema = z
  .string()
  .min(3, "El mensaje debe tener al menos 3 caracteres")
  .max(200, "El mensaje no puede tener más de 200 caracteres");

export default function Chat() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { 
    loading, 
    error: ollamaError, 
    sendMessage, 
    clearConversation, 
    conversation,
    partialResponse 
  } = useOllamaHook();

  const handleSubmit = () => {
    try {
      messageSchema.parse(message);
      setError("");
    
      sendMessage(message);
      
      setMessage("");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || "Error de validación");
      } else {
        setError("Error inesperado");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleNewChat = () => {
    clearConversation();
    setMessage("");
    setError("");
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-80 bg-gray-800 flex flex-col items-center py-8">
        <button 
          onClick={handleNewChat}
          className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors mb-4"
        >
          <Plus size={24} />
        </button>
        <span className="text-xs text-gray-400 mb-4">Nuevo chat</span>

        <div className="w-full px-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-400">Conversaciones</h3>
            <button 
              onClick={clearConversation}
              className="p-1 text-gray-500 hover:text-red-400 transition-colors"
              title="Limpiar conversación"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          {conversation.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="bg-gray-800 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <SendHorizontal size={32} />
                </div>
                <p>Envía un mensaje para comenzar la conversación</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg max-w-3xl ${
                    msg.role === "user"
                      ? "bg-indigo-600 ml-auto"
                      : "bg-gray-700"
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
              ))}
              {loading && (
                <div className="p-4 rounded-lg bg-gray-700 max-w-3xl">
                  <p>{partialResponse || "Pensando..."}</p>
                </div>
              )}
            </div>
          )}

          {ollamaError && (
            <div className="mt-4 p-3 bg-red-900 rounded-lg text-red-200">
              <p>Error: {ollamaError}</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-800">
          <div className="flex items-center">
            <div className="flex space-x-2 mr-2">
              <button className="p-2 text-gray-400 hover:text-indigo-400 rounded-full hover:bg-gray-700 transition-colors">
                <Paperclip size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-indigo-400 rounded-full hover:bg-gray-700 transition-colors">
                <Smile size={20} />
              </button>
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={handleKeyDown}
                className="w-full p-3 rounded-full bg-gray-700 text-white placeholder-gray-400 border-0 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Escribe tu mensaje..."
                disabled={loading}
              />
              {error && (
                <div className="absolute bottom-0 left-0 transform translate-y-full mt-1 text-xs text-red-400">
                  {error}
                </div>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="ml-2 p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <SendHorizontal size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}