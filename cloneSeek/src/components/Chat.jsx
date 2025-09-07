import { Paperclip, Smile, SendHorizontal, Plus } from "lucide-react";

export default function App() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      
      <div className="w-80 bg-gray-800 flex flex-col items-center py-30">
        <button className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors mb-4">
          <Plus size={24} />
        </button>
        <span className="text-xs text-gray-400 mt-1">Nuevo chat</span>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="bg-gray-800 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <SendHorizontal size={32} />
              </div>
              <p>Envía un mensaje para comenzar la conversación</p>
            </div>
          </div>
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
            <input
              type="text"
              className="flex-1 p-3 rounded-full bg-gray-700 text-white placeholder-gray-400 border-0 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Escribe tu mensaje..."
            />
            <button className="ml-2 p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
              <SendHorizontal size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}