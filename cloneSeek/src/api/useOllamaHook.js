import { useChat } from '../context/ChatContext';

export const useOllamaHook = () => {
  const {
    response,
    partialResponse,
    loading,
    error,
    conversation,
    sendMessage,
    clearConversation
  } = useChat();

  return {
    response,
    partialResponse,
    loading,
    error,
    conversation,
    sendMessage,
    clearConversation
  };
};