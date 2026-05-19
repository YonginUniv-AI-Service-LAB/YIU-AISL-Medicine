import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

export interface Friend {
  relationId: number;
  friendId: number;
  nickname: string;
  profileImageUrl: string;
}

export interface FriendRequest {
  relationId: number;
  fromUserId: number;
  fromNickname: string;
}

export interface Guestbook {
  id: string;
  date: string;
  senderEmail: string;
  message: string;
}

interface FriendContextType {
  friends: Friend[];
  fetchFriends: () => Promise<void>;
  sendFriendRequest: (email: string) => Promise<void>;
  acceptRequest: (friendId: number, status: 'ACCEPTED' | 'REJECTED') => Promise<void>;
  removeFriend: (friendId: number) => Promise<void>;
  friendRequests: FriendRequest[];
  fetchFriendRequests: () => Promise<void>;
  myUserId: number | null;
  fetchGuestbook: (userId: number) => Promise<Guestbook[]>;
  postGuestbook: (userId: number, message: string) => Promise<void>;
  deleteGuestbook: (guestbookId: string) => Promise<void>;
}

const FriendContext = createContext<FriendContextType | null>(null);

export const FriendProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [myUserId, setMyUserId] = useState<number | null>(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/users/me`, { withCredentials: true })
      .then(res => {
        const id = res.data?.data?.id ?? res.data?.id;
        if (id) setMyUserId(id);
      })
      .catch(() => {});
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/friends`, { withCredentials: true });
      setFriends(res.data.data);
    } catch (error) {
      console.error('친구 목록 조회 실패:', error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/friends/requests/received`, { withCredentials: true });
      setFriendRequests(res.data.data);
    } catch (error) {
      console.error('친구 요청 목록 조회 실패:', error);
    }
  };

  const sendFriendRequest = async (email: string) => {
    try {
      await axios.post(`${API_BASE_URL}/friends`, { email }, { withCredentials: true });
      alert('친구 신청을 보냈습니다!');
    } catch (error) {
      alert('신청 실패: 인증 상태 또는 이메일 확인 필요');
    }
  };

  const acceptRequest = async (friendId: number, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await axios.patch(`${API_BASE_URL}/friends/${friendId}`, { status }, { withCredentials: true });
      fetchFriends();
      fetchFriendRequests();
    } catch (error: any) {
      console.error('처리 실패:', error);
    }
  };

  const removeFriend = async (friendId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/friends/${friendId}`, { withCredentials: true });
      fetchFriends();
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  const fetchGuestbook = async (userId: number): Promise<Guestbook[]> => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/${userId}/guestbook`, { withCredentials: true });
      const raw: any[] = res.data?.data ?? res.data ?? [];
      return (Array.isArray(raw) ? raw : []).map((entry: any) => ({
        id: String(entry.guestbookId),
        date: entry.createdAt
          ? new Date(entry.createdAt).toLocaleString('ko-KR', {
              year: '2-digit', month: '2-digit', day: '2-digit',
              hour: '2-digit', minute: '2-digit',
            })
          : '',
        senderEmail: entry.writerNickname ?? entry.senderNickname ?? '알수없음',
        message: entry.content ?? entry.message ?? '',
      }));
    } catch (error) {
      console.error('방명록 조회 실패:', error);
      return [];
    }
  };

  const postGuestbook = async (userId: number, message: string): Promise<void> => {
    await axios.post(
      `${API_BASE_URL}/users/${userId}/guestbook`,
      { message },
      { withCredentials: true },
    );
  };

  const deleteGuestbook = async (guestbookId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/guestbook/${guestbookId}`, { withCredentials: true });
  };

  return (
    <FriendContext.Provider value={{
      friends, fetchFriends, sendFriendRequest, acceptRequest, removeFriend,
      friendRequests, fetchFriendRequests,
      myUserId, fetchGuestbook, postGuestbook, deleteGuestbook,
    }}>
      {children}
    </FriendContext.Provider>
  );
};

export const useFriend = () => {
  const context = useContext(FriendContext);
  if (!context) throw new Error('FriendProvider 안에서 사용해야 합니다');
  return context;
};
