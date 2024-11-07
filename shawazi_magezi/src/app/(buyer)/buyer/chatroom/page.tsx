"use client";
import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { useScrollToBottom } from "@/app/hooks/useScrollToBottom";
import { Send, ChevronDown, Menu, Search } from "lucide-react";
import { useGetUsers } from "@/app/hooks/useGetUsers";
import UserCard from "@/app/hooks/usersCard/UserCard";
import useChatMessages from "@/app/hooks/useChatMessages";
import { UserDatas } from "@/app/utils/types";
import { Toaster, toast } from "react-hot-toast";
import { CgProfile } from "react-icons/cg";
import InviteLawyerModal from "@/app/(lawyer)/lawyer/components/Invite-lawyer";
import BuyerSidebar from "../components/Buyersidebar";

type GetUserType = {
  first_name: string;
  role: "buyer" | "seller" | "lawyer";
};

interface Message {
  id: string;
  content: string;
  sender: string;
  receiverFirstName: string;
  role: string;
  timestamp: number;
  conversationKey: string;
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const ChatRoom: React.FC = () => {
  const { users, loading, error: usersError } = useGetUsers();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [availableUsers, setAvailableUsers] = useState<GetUserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<GetUserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<GetUserType | null>(null);
  const messagesEndRef = useScrollToBottom<HTMLDivElement>();
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserFirstName, setCurrentUserFirstName] = useState<
    string | null
  >(null);
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserListVisible, setIsUserListVisible] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const { messages, sendMessage } = useChatMessages(
    currentUserRole || "",
    currentUserFirstName || ""
  );

  useEffect(() => {
    const userRole = getCookie("role") as string;
    const firstName = getCookie("firstName") as string;
    setCurrentUserRole(userRole);
    setCurrentUserFirstName(firstName);
  }, []);

  useEffect(() => {
    if (!loading && users) {
      const filteredUsers: GetUserType[] = users.filter((user) => {
        if (currentUserRole === "lawyer") {
          return user.role === "buyer" || user.role === "seller";
        }
        if (currentUserRole === "buyer") {
          return user.role === "seller";
        }
        if (currentUserRole === "seller") {
          return user.role === "buyer";
        }
        return false;
      });
      setAvailableUsers(filteredUsers);
      setFilteredUsers(filteredUsers);
    }
  }, [loading, users, currentUserRole]);

  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    if (searchValue.trim() === "") {
      setFilteredUsers(availableUsers);
    } else {
      const filtered = availableUsers.filter((user) =>
        user.first_name.toLowerCase().includes(searchValue.toLowerCase().trim())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleSendMessage = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    if (inputMessage.trim() === "" || !selectedUser || sendingMessage) {
      setErrorMessage(
        "Cannot send message: Message is empty or no user selected."
      );
      return;
    }
    setSendingMessage(true);
    setErrorMessage(null);

    try {
      await sendMessage(inputMessage, selectedUser.first_name);
      setInputMessage("");
    } catch {
      setErrorMessage("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredMessages = selectedUser
    ? messages.filter(
        (message: Message) =>
          message.sender === currentUserFirstName ||
          message.receiverFirstName === selectedUser.first_name
      )
    : [];

  const startConversation = (user: GetUserType) => {
    setSelectedUser(user);
    setIsUserListVisible(false);
  };

  const handleInviteLawyerClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInviteLawyerSubmit = async (
    firstName: string,
    lastName: string,
    invitedBy: string,
    phoneNumber: string
  ) => {
    const invitationData = {
      first_name: firstName,
      last_name: lastName,
      invited_by: invitedBy,
      phone_number: phoneNumber,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/send_invitation/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invitationData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send invitation");
      }

      toast.success("Invitation sent successfully!");
      handleCloseModal();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const getUserListTitle = () => {
    switch (currentUserRole) {
      case "buyer":
        return "Available Sellers";
      case "seller":
        return "Available Buyers";
      case "lawyer":
        return "Available Users";
      default:
        return "Users";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  if (usersError) {
    const errorMessage =
      typeof usersError === "string" ? usersError : usersError.message;
    return (
      <div className="flex justify-center items-center h-full">
        Error: {errorMessage}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-jost">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-1/4 md:w-1/5 bg-white border-r border-gray-200 shadow-md hidden lg:block">
        <BuyerSidebar />
      </div>

      <div className="lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-4 text-gray-500 focus:outline-none focus:text-gray-700"
        >
          <Menu size={24} />
        </button>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-white">
            <div className="p-4">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="mb-4 text-gray-500 focus:outline-none focus:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-grow flex flex-col md:flex-row">
        <div
          className={`w-full md:w-1/4 lg:w-1/3 xl:w-1/4 bg-white p-4 border-r border-gray-200 shadow-md hidden lg:block`}
        >
          <div className="mb-4 flex justify-between items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search users by first name..."
              className="w-full border-2 p-2 rounded-lg border-hover"
            />
            <button className="bg-hover text-white hover:bg-green-600 p-2 rounded-md ml-2">
              <Search />
            </button>
          </div>
          <h2 className="font-semibold mt-4">{getUserListTitle()}</h2>
          <div
            className="flex-grow overflow-y-auto mt-2 bg-[#c5daa6]"
            style={{ maxHeight: "60vh" }}
          >
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserCard
                  key={user.first_name}
                  user={user as Partial<UserDatas>}
                  startConversation={() => startConversation(user)}
                />
              ))
            ) : (
              <p className="text-gray-600 p-4">
                No users found matching &quot;{searchTerm}&quot;
              </p>
            )}
          </div>
        </div>

        <div className="lg:hidden w-full p-4">
          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search users by first name..."
              className="w-full border-2 p-2 rounded-lg border-hover"
            />
            <button className="bg-hover text-white hover:bg-green-600 p-2 rounded-md absolute right-0 top-0">
              <Search />
            </button>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsUserListVisible(!isUserListVisible)}
              className="flex items-center justify-between w-full bg-white border border-gray-300 p-2 rounded-md"
            >
              <span>
                {selectedUser ? selectedUser.first_name : getUserListTitle()}
              </span>
              <ChevronDown
                className={`transform transition-transform ${
                  isUserListVisible ? "rotate-180" : ""
                }`}
              />
            </button>
            {isUserListVisible && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.first_name}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        startConversation(user);
                        setIsUserListVisible(false);
                      }}
                    >
                      <UserCard
                        user={user as Partial<UserDatas>}
                        startConversation={() => {}}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 p-4">
                    No users found matching &quot;{searchTerm}&quot;
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="chat-area flex flex-grow flex-col p-4 bg-white md:w-3/4 lg:w-3/4">
          <div className="flex-grow overflow-y-auto bg-white border p-4 rounded shadow-md chat-messages">
            <h2 className="font-semibold text-2xl mt-12 text-primary ml-0">
              Chat with {selectedUser ? selectedUser.first_name : "..."}
            </h2>
            {filteredMessages.map((message, index) => (
              <div
                key={index}
                className={`my-2 ${
                  message.sender === currentUserFirstName
                    ? "text-right"
                    : "text-left"
                }`}
              >
                <div className="flex items-center justify-end mr-4">
                  <div className="bg-[#D0F1A1] p-7 rounded-lg shadow-md flex items-center">
                    <CgProfile className="text-primary mr-2 text-2xl" />
                    <span className="font-semibold text-xl">
                      {message.sender}:
                    </span>
                    <span className="text-xl ml-2">{message.content}</span>
                  </div>
                  <div className="text-gray-500 text-xs ml-2">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-4">
            <form onSubmit={handleSendMessage} className="flex w-full">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="border-hover border-2 p-2 rounded-l w-[95%]"
              />
              <button
                type="submit"
                className="bg-hover text-white hover:bg-green-600 p-2 rounded-r w-1/8"
              >
                <Send />
              </button>
            </form>
            {errorMessage && (
              <div className="text-red-600 mt-2">{errorMessage}</div>
            )}
            <button
              className="w-full mt-2 bg-hover text-white hover:bg-green-600 p-2 rounded"
              onClick={handleInviteLawyerClick}
            >
              Invite Lawyer
            </button>
          </div>
        </div>
      </div>

      <InviteLawyerModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleInviteLawyerSubmit}
      />
    </div>
  );
};

export default ChatRoom;
