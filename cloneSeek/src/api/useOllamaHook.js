import { useState, useCallback } from 'react';

export const useOllamaHook = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [partialResponse, setPartialResponse] = useState('');

  const sendMessage = useCallback(async (message) => {
    setLoading(true);
    setError(null);
    setPartialResponse('');
    
    try {
      const updatedConversation = [
        ...conversation,
        { role: 'user', content: message }
      ];
      
      setConversation(updatedConversation);

      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-r1:8b',
          messages: updatedConversation,
          stream: true,
          options: {
            num_predict: 500,
            temperature: 1,
            top_p: 0.9,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullResponse = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        
        const chunks = chunkValue.split('\n').filter(chunk => chunk.trim() !== '');
        for (const chunk of chunks) {
          const parsedChunk = JSON.parse(chunk);
          if (parsedChunk.message && parsedChunk.message.content) {
            fullResponse += parsedChunk.message.content;
            setPartialResponse(fullResponse);
          }
        }
      }

      const newConversation = [
        ...updatedConversation,
        { role: 'assistant', content: fullResponse }
      ];
      
      setConversation(newConversation);
      setResponse(fullResponse);
      
    } catch (err) {
      setError(err.message);
      console.error('Error al enviar mensaje:', err);
    } finally {
      setLoading(false);
    }
  }, [conversation]);

  const clearConversation = useCallback(() => {
    setConversation([]);
    setResponse('');
    setPartialResponse('');
    setError(null);
  }, []);

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