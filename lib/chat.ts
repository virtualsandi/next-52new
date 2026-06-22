import { getAuthToken } from "@/lib/auth";

export interface ChatUser {
  _id: string;
  name: string;
  email: string;
  role?: string;
  image?: string | null;
}

export interface ChatMessage {
  _id: string;
  message: string;
  createdAt: string;
  sender: ChatUser | string;
  receiver: ChatUser | string;
}

function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getUserId(user: ChatUser | string | null | undefined) {
  if (!user) return null;
  return typeof user === "string" ? user : user._id;
}

export function getUserAvatar(user: ChatUser) {
  if (user.image) {
    return `${process.env.NEXT_PUBLIC_ASSETS_URL}${user.image}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=0f766e&color=fff`;
}

export async function fetchSupportAgents(): Promise<ChatUser[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to load support team");
  }

  const result = await res.json();
  const users: ChatUser[] = result.data || [];

  return users.filter(
    (user) => user.role === "admin" || user.role === "seller"
  );
}

export async function fetchCustomers(): Promise<ChatUser[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/customers`,
    { headers: authHeaders() }
  );

  if (!res.ok) {
    throw new Error("Failed to load customers");
  }

  const result = await res.json();
  return result.data || [];
}

export async function fetchChatMessages(
  otherUserId: string
): Promise<ChatMessage[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/chat/${otherUserId}`,
    { headers: authHeaders() }
  );

  if (res.status === 404) {
    return [];
  }

  if (!res.ok) {
    throw new Error("Failed to load messages");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function sendChatMessage(
  receiverId: string,
  message: string
): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ receiver: receiverId, message }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to send message");
  }
}

export function formatChatTime(date: string) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
