"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Headphones, Send } from "lucide-react";
import { getCurrentUserId } from "@/lib/auth";
import {
  type ChatMessage,
  type ChatUser,
  fetchChatMessages,
  fetchSupportAgents,
  formatChatTime,
  getUserAvatar,
  getUserId,
  sendChatMessage,
} from "@/lib/chat";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import styles from "./chat.module.css";

export default function CustomerChatPage() {
  const [supportAgent, setSupportAgent] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = getCurrentUserId();

  const loadMessages = useCallback(async (agentId: string) => {
    try {
      const data = await fetchChatMessages(agentId);
      setMessages(data);
    } catch {
      toast.error("Could not load your conversation");
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const agents = await fetchSupportAgents();
        const agent =
          agents.find((user) => user.role === "admin") || agents[0] || null;

        if (!agent) {
          toast.error("Support team is unavailable right now");
          return;
        }

        setSupportAgent(agent);
        await loadMessages(agent._id);
      } catch {
        toast.error("Could not connect to support");
      } finally {
        setLoading(false);
      }
    };

    init();
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, [loadMessages]);

  useEffect(() => {
    if (!supportAgent?._id) return;

    const socket = connectSocket();

    const refresh = () => {
      loadMessages(supportAgent._id);
    };

    socket.on("myMessage", refresh);
    socket.on("receivedMessage", refresh);

    return () => {
      socket.off("myMessage", refresh);
      socket.off("receivedMessage", refresh);
    };
  }, [supportAgent, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !supportAgent || !currentUserId) return;

    try {
      setSending(true);
      await sendChatMessage(supportAgent._id, message.trim());

      const socket = connectSocket();
      socket.emit("newMessage", {
        sender: currentUserId,
        receiver: supportAgent._id,
      });

      setMessage("");
      await loadMessages(supportAgent._id);
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.loadingText}>Connecting to support...</p>
      </div>
    );
  }

  if (!supportAgent) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <Headphones size={40} />
          <h2>Support unavailable</h2>
          <p>Please try again later or email us for help.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.chatCard}>
        <header className={styles.chatHeader}>
          <img
            src={getUserAvatar(supportAgent)}
            alt={supportAgent.name}
            className={styles.headerAvatar}
          />
          <div>
            <h1>Support Chat</h1>
            <p>
              Chatting with {supportAgent.name} ·{" "}
              <span className={styles.onlineBadge}>Online</span>
            </p>
          </div>
        </header>

        <div className={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div className={styles.welcomeMessage}>
              <Headphones size={32} />
              <h3>How can we help?</h3>
              <p>
                Ask about orders, products, shipping, or anything else. Our
                team typically replies within a few minutes.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = getUserId(msg.sender) === currentUserId;
              return (
                <div
                  key={msg._id}
                  className={
                    isMine ? styles.outgoingMessage : styles.incomingMessage
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

        <footer className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Type your message..."
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
            Send
          </button>
        </footer>
      </div>
    </div>
  );
}
