import { createContext, useContext, useReducer } from 'react';

const initialState = {
  conversation: [],
  loading: false,
  error: null,
  response: '',
  partialResponse: ''
};

const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_PARTIAL_RESPONSE: 'SET_PARTIAL_RESPONSE',
  CLEAR_CONVERSATION: 'CLEAR_CONVERSATION'
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case actionTypes.ADD_MESSAGE:
      return { 
        ...state, 
        conversation: [...state.conversation, action.payload],
        response: action.payload.role === 'assistant' ? action.payload.content : state.response,
        loading: false
      };
    case actionTypes.SET_PARTIAL_RESPONSE:
      return { ...state, partialResponse: action.payload };
    case actionTypes.CLEAR_CONVERSATION:
      return { 
        ...state, 
        conversation: [],
        response: '',
        partialResponse: '',
        error: null
      };
    default:
      return state;
  }
};

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat debe ser usado dentro de un ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const sendMessage = async (message) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    dispatch({ type: actionTypes.SET_ERROR, payload: null });

    try {
      const userMessage = { role: 'user', content: message };
      dispatch({ type: actionTypes.ADD_MESSAGE, payload: userMessage });

      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          messages: [...state.conversation, userMessage],
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
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkValue = decoder.decode(value);
        const chunks = chunkValue.split('\n').filter(chunk => chunk.trim() !== '');
        
        for (const chunk of chunks) {
          try {
            const parsedChunk = JSON.parse(chunk);
            if (parsedChunk.message && parsedChunk.message.content) {
              fullResponse += parsedChunk.message.content;
              dispatch({ type: actionTypes.SET_PARTIAL_RESPONSE, payload: fullResponse });
            }
          } catch (e) {
            console.error('Error parsing JSON:', e, chunk);
          }
        }
      }

      const assistantMessage = { role: 'assistant', content: fullResponse };
      dispatch({ type: actionTypes.ADD_MESSAGE, payload: assistantMessage });

    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      console.error('Error al enviar mensaje:', err);
    }
  };

  const clearConversation = () => {
    dispatch({ type: actionTypes.CLEAR_CONVERSATION });
  };

  const value = {
    ...state,
    sendMessage,
    clearConversation
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};