"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import ChatList from "./components/ChatList";
import ChatBox from "./components/ChatBox";
import styles from "./chat.module.css";
import type { ChatUser } from "@/lib/chat";

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  return (
    <div className={styles.container}>
      <aside className={styles.chatSidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarHeaderIcon}>
            <MessageSquare size={20} />
          </div>
          <div>
            <h2>Customer Chats</h2>
            <span>Support inbox</span>
          </div>
        </div>

        <ChatList
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </aside>

      <main className={styles.chatArea}>
        <ChatBox selectedUser={selectedUser} />
      </main>
    </div>
  );
}
