import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

axios.defaults.withCredentials = true;



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

interface FriendContextType {
  friends: Friend[];
  fetchFriends: () => Promise<void>;
  sendFriendRequest: (email: string) => Promise<void>;
  acceptRequest: (friendId: number, status: 'ACCEPTED' | 'REJECTED') => Promise<void>;
  removeFriend: (friendId: number) => Promise<void>;
  friendRequests: FriendRequest[];
  fetchFriendRequests: () => Promise<void>;
}

const FriendContext = createContext<FriendContextType | null>(null);

export const FriendProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]); 

const fetchFriends = async () => {
  try {
    console.log('fetchFriends 호출됨');
    const res = await axios.get(`${API_BASE_URL}/friends`);
    console.log('친구 데이터:', res.data);
    setFriends(res.data.data);
  } catch (error) {
    console.error("친구 목록 조회 실패:", error);
  }
};

const fetchFriendRequests = async () => {
  try {
    console.log('fetchFriendRequests 호출됨');
    const res = await axios.get(`${API_BASE_URL}/friends/requests/received`);
    console.log('요청 데이터:', res.data);
    setFriendRequests(res.data.data);
  } catch (error) {
    console.error("친구 요청 목록 조회 실패:", error);
  }
};

  const sendFriendRequest = async (email: string) => {
    try {
      await axios.post(`${API_BASE_URL}/friends`, { email });
      alert("친구 신청을 보냈습니다!");
    } catch (error) {
      alert("신청 실패: 인증 상태 또는 이메일 확인 필요");
    }
  };

const acceptRequest = async (friendId: number, status: 'ACCEPTED' | 'REJECTED') => {
  try {
    console.log('처리 friendId:', friendId, 'status:', status);
    await axios.patch(`${API_BASE_URL}/friends/${friendId}`, { status });
    fetchFriends();
    fetchFriendRequests();
  } catch (error: any) {
    console.error("처리 실패:", error);
  }
};

  const removeFriend = async (friendId: number) => {
    try {
      console.log('삭제 friendId:', friendId);
      await axios.delete(`${API_BASE_URL}/friends/${friendId}`);
      fetchFriends();
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  return (
    <FriendContext.Provider value={{ friends, fetchFriends, sendFriendRequest, acceptRequest, removeFriend, friendRequests, fetchFriendRequests }}>

      {children}
    </FriendContext.Provider>
  );
};

export const useFriend = () => {
  const context = useContext(FriendContext);
  if (!context) throw new Error('FriendProvider 안에서 사용해야 합니다');
  return context;
};