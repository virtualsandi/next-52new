"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MessageSquare, Send } from "lucide-react";
import styles from "../chat.module.css";
import { getCurrentUserId } from "@/lib/auth";
import {
  type ChatMessage,
  type ChatUser,
  fetchChatMessages,
  formatChatTime,
  getUserAvatar,
  getUserId,
  sendChatMessage,
} from "@/lib/chat";
import { connectSocket, disconnectSocket } from "@/lib/socket";

interface ChatBoxProps {
  selectedUser: ChatUser | null;
}

export default function ChatBox({ selectedUser }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = getCurrentUserId();

  const loadMessages = useCallback(async () => {
    if (!selectedUser?._id) {
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchChatMessages(selectedUser._id);
      setMessages(data);
    } catch {
      toast.error("Failed to load conversation");
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!selectedUser?._id) return;

    const socket = connectSocket();

    const refresh = () => {
      loadMessages();
    };

    socket.on("myMessage", refresh);
    socket.on("receivedMessage", refresh);

    return () => {
      socket.off("myMessage", refresh);
      socket.off("receivedMessage", refresh);
    };
  }, [selectedUser, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className={styles.emptyChat}>
        <div className={styles.emptyChatInner}>
          <MessageSquare size={48} strokeWidth={1.5} />
          <h3>Select a conversation</h3>
          <p>Choose a customer from the list to view and reply to their messages.</p>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    if (!message.trim() || !currentUserId) return;

    try {
      setSending(true);
      await sendChatMessage(selectedUser._id, message.trim());

      const socket = connectSocket();
      socket.emit("newMessage", {
        sender: currentUserId,
        receiver: selectedUser._id,
      });

      setMessage("");
      await loadMessages();
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.chatBox}>
      <div className={styles.chatHeader}>
        <img
          src={getUserAvatar(selectedUser)}
          alt={selectedUser.name}
          className={styles.headerAvatar}
        />
        <div className={styles.chatHeaderInfo}>
          <h3>{selectedUser.name}</h3>
          <p>
            {selectedUser.email} ·{" "}
            <span className={styles.onlineBadge}>Customer</span>
          </p>
        </div>
      </div>

      <div className={styles.messagesContainer}>
        {loading ? (
          <p className={styles.centerMessage}>Loading messages...</p>
        ) : messages.length === 0 ? (
          <div className={styles.welcomeMessage}>
            <MessageSquare size={32} strokeWidth={1.5} />
            <h4>No messages yet</h4>
            <p>Say hello to start the conversation with {selectedUser.name}.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = getUserId(msg.sender) === currentUserId;
            return (
              <div
                key={msg._id}
                className={
                  isMine ? styles.adminMessage : styles.customerMessage
                }
              >
                <div className={styles.messageBubble}>
                  <p>{msg.message}</p>
                  <span>{formatChatTime(msg.createdAt)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder={`Reply to ${selectedUser.name}...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={sending}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !message.trim()}
        >
          <Send size={18} />
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
