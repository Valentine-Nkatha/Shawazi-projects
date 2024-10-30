import { useEffect, useState } from "react";

interface Message {
  id: string;
  content: string;
  sender: string; 
  receiverFirstName: string; 
  role: string;
  timestamp: number;
  conversationKey: string; 
}

const useChatMessages = (currentUserRole: string, currentUserFirstName: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`/api/getMessages?role=${currentUserRole}&user=${currentUserFirstName}`);
      const data: Message[] = await response.json();
      setMessages(data);
    };

    fetchMessages();
  }, [currentUserRole, currentUserFirstName]);

  const sendMessage = async (content: string, receiverFirstName: string) => {
    const newMessage: Message = {
      id: new Date().getTime().toString(), 
      content,
      sender: currentUserFirstName,
      receiverFirstName,
      role: currentUserRole,
      timestamp: Date.now(),
      conversationKey: `${currentUserFirstName}-${receiverFirstName}`,
    };

    await fetch("/api/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    });

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return { messages, sendMessage };
};

export default useChatMessages;









// "use client";
// import { useState, useEffect } from 'react';
// import Pusher from 'pusher-js';
// import { v4 as uuidv4 } from 'uuid';

// interface Message {
//   id: string;
//   content: string;
//   sender: string;
//   receiverId: string;
//   role: string;
//   timestamp: number;
// }

// interface ChatMessagesHook {
//   messages: Message[];
//   sendMessage: (content: string, receiverId: string) => Promise<void>;
// }

// const useChatMessages = (currentUserId: string, currentUserRole: string): ChatMessagesHook => {
//   const [messages, setMessages] = useState<Message[]>([]);

//   useEffect(() => {
//     const savedMessages = localStorage.getItem('messages');
//     if (savedMessages) {
//       setMessages(JSON.parse(savedMessages));
//     }

//     const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
//       cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
//       forceTLS: true, 
//     });

//     const channel = pusher.subscribe('chat-channel');

//     channel.bind('new-message', (data: Message) => {
//       if (!data.sender) {
//         console.error(`Received message with invalid sender:`, data);
//       } else {
//         setMessages((prevMessages) => {
//           if (!prevMessages.some(msg => msg.id === data.id)) {
//             const updatedMessages = [...prevMessages, data];
//             localStorage.setItem('messages', JSON.stringify(updatedMessages));
//             return updatedMessages;
//           }
//           return prevMessages;
//         });
//       }
//     });

//     return () => {
//       channel.unbind_all();
//       channel.unsubscribe();
//       pusher.disconnect();
//     };
//   }, []);

//   const sendMessage = async (content: string, receiverId: string): Promise<void> => {
//     console.log('Sending message:', { currentUserId, currentUserRole });

//     const newMessage: Message = {
//       id: uuidv4(),
//       content,
//       sender: currentUserId,
//       receiverId,
//       role: currentUserRole,
//       timestamp: Date.now(),
//     };

//     try {
//       const response = await fetch('/api/messages', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newMessage),
//       });

//       if (!response.ok) {
//         const errorDetails = await response.text();
//         throw new Error(`Error sending message: ${response.statusText}. Details: ${errorDetails}`);
//       }

//       setMessages((prevMessages) => {
//         const updatedMessages = [...prevMessages, newMessage];
//         localStorage.setItem('messages', JSON.stringify(updatedMessages));
//         return updatedMessages;
//       });

//     } catch (error) {
//       console.error('Error sending message:', error);
//       throw error;
//     }
//   };

//   return { messages, sendMessage };
// };

// export default useChatMessages;


