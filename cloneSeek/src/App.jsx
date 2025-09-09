import React from 'react'
import  Chat  from './components/Chat'
import { ChatProvider } from './context/ChatContext'

function App() {
  return (
    <ChatProvider>
      <Chat/>
    </ChatProvider>
  )
}

export default App