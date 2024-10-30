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







