"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import BuyerSidebar from "../components/Buyersidebar";
const ChatRoomPage = () => {
  return (
    <div className="flex flex-col items-center justify-start text-center mt-14 p-4 md:ml-[5%] lg:ml-[3%]">
      <BuyerSidebar />
      <div>
        <div className="items-center mb-[5%]">
          <h1 className="text-[28px] font-bold text-primary text-center md:text-[32px] lg:text-[36px]">
            ChatRoom
          </h1>
        </div>
        <p className="text-primary text-[18px] mb-6 md:text-[20px] lg:text-[22px]">
          Hello, you have no new messages
        </p>
        <div className="p-4 mb-6">
          <div className="flex items-center justify-center">
            <div className="mb-6">
              <Image
                src="/images/chat.png"
                alt="Secure Land Transactions"
                width={600}
                height={600}
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
        <Link href="/buyer/chatroom" className="w-full">
          <button className="bg-foreground text-white w-full py-2 rounded-lg hover:bg-white hover:text-foreground hover:border border-foreground transition duration-300 text-[18px] md:text-[20px] lg:text-[22px]">
            Start Chat
          </button>
        </Link>
      </div>
    </div>
  );
};
export default ChatRoomPage;
