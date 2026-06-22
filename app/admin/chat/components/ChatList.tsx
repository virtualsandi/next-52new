"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import styles from "../chat.module.css";
import {
  type ChatUser,
  fetchCustomers,
  getUserAvatar,
} from "@/lib/chat";

interface ChatListProps {
  selectedUser: ChatUser | null;
  setSelectedUser: (user: ChatUser) => void;
}

export default function ChatList({
  selectedUser,
  setSelectedUser,
}: ChatListProps) {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCustomers();
        setUsers(data);
      } catch {
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p className={styles.loadingText}>Loading customers...</p>;
  }

  return (
    <div className={styles.listPanel}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.userList}>
        {filteredUsers.length === 0 ? (
          <p className={styles.noUsersText}>No customers found.</p>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`${styles.userCard} ${
                selectedUser?._id === user._id ? styles.activeUser : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className={styles.avatarWrapper}>
                <img
                  src={getUserAvatar(user)}
                  alt={user.name}
                  className={styles.avatar}
                />
              </div>

              <div className={styles.userInfo}>
                <h4>{user.name}</h4>
                <p>{user.email}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
