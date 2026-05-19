import { useFriend } from '../../contexts/FriendContext';
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './SharePage.style';

import FrendPopup from './FrendPopup';
import FrendAddPopup from './Frend_Add_Popup';
import SelectPopup from './other_people/SelectPopup';
import GuestBookPopup from './GuestBookPopup';
import GuestBookCard from './GuestBookCard';
import CalendarPopup from './CalenderPopup22';

const LOGO = require('../../assets/images/Logo.png');
const SEARCH_ICON = require('../../assets/images/share/search.png');
const SHARE_ON = require('../../assets/images/share/share_on.png');
const SHARE_OFF = require('../../assets/images/share/share_off.png');
const WRITE_ICON = require('../../assets/images/share/write_on.png');
const CALENDAR_ICON = require('../../assets/images/share/calender.png');
const FRIEND_ON = require('../../assets/images/share/frend_on.png');
const FRIEND_OFF = require('../../assets/images/share/frend_off.png');

export default function SharePage() {
  const {
    friends, fetchFriends, fetchFriendRequests, removeFriend,
    myUserId, fetchGuestbook, postGuestbook, deleteGuestbook,
  } = useFriend();

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const [isSelectPopupVisible, setIsSelectPopupVisible] = useState(false);
  const [isGuestBookVisible, setIsGuestBookVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const [isFriendView, setIsFriendView] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');
  const [targetFriendId, setTargetFriendId] = useState<number | null>(null);

  const [myGuestMessages, setMyGuestMessages] = useState<any[]>([]);
  const [friendGuestMessages, setFriendGuestMessages] = useState<any[]>([]);

  // 내 방명록 로드
  useEffect(() => {
    if (myUserId) {
      fetchGuestbook(myUserId).then(setMyGuestMessages);
    }
  }, [myUserId]);

  useFocusEffect(
    useCallback(() => {
      fetchFriends();
      fetchFriendRequests();
      if (myUserId) {
        fetchGuestbook(myUserId).then(setMyGuestMessages);
      }
      setIsCalendarVisible(false);
      setIsPopupVisible(false);
      setIsAddPopupVisible(false);
      setIsSelectPopupVisible(false);
      setIsGuestBookVisible(false);
    }, [myUserId]),
  );

  const handleTestSwitch = useCallback((email: string) => {
    setTargetEmail(email);
    setIsAddPopupVisible(false);
    setTimeout(() => setIsSelectPopupVisible(true), 300);
  }, []);

  const handleAddFriend = useCallback((_email: string) => {
    fetchFriends();
  }, [fetchFriends]);

  const handleOpenWriteGuestBook = useCallback(async (nickname: string) => {
    setTargetEmail(nickname);
    setIsPopupVisible(false);
    setIsFriendView(true);

    const friend = friends.find(f => f.nickname === nickname);
    if (friend) {
      setTargetFriendId(friend.friendId);
      const entries = await fetchGuestbook(friend.friendId);
      setFriendGuestMessages(entries);
    }

    setTimeout(() => setIsGuestBookVisible(true), 200);
  }, [friends, fetchGuestbook]);

  const handleViewCalendar = useCallback(async (nickname: string) => {
    setTargetEmail(nickname);
    setIsPopupVisible(false);
    setIsGuestBookVisible(false);
    setIsAddPopupVisible(false);
    setIsSelectPopupVisible(false);
    setIsFriendView(true);

    const friend = friends.find(f => f.nickname === nickname);
    if (friend) {
      setTargetFriendId(friend.friendId);
      const entries = await fetchGuestbook(friend.friendId);
      setFriendGuestMessages(entries);
    }

    setTimeout(() => setIsCalendarVisible(true), 200);
  }, [friends, fetchGuestbook]);

  const handleGuestBookSubmit = useCallback(async (message: string) => {
    if (targetFriendId) {
      try {
        await postGuestbook(targetFriendId, message);
        const entries = await fetchGuestbook(targetFriendId);
        setFriendGuestMessages(entries);
      } catch (e) {
        console.error('방명록 작성 실패:', e);
      }
    }
    setIsGuestBookVisible(false);
  }, [targetFriendId, postGuestbook, fetchGuestbook]);

  const handleDeleteMyGuestbook = useCallback(async (id: string) => {
    try {
      await deleteGuestbook(id);
      if (myUserId) {
        const entries = await fetchGuestbook(myUserId);
        setMyGuestMessages(entries);
      }
    } catch (e) {
      console.error('방명록 삭제 실패:', e);
    }
  }, [deleteGuestbook, fetchGuestbook, myUserId]);

  const resetToMe = useCallback(() => {
    setIsFriendView(false);
    setTargetEmail('');
    setTargetFriendId(null);
    setFriendGuestMessages([]);
    if (myUserId) {
      fetchGuestbook(myUserId).then(setMyGuestMessages);
    }
  }, [myUserId, fetchGuestbook]);

  const currentData = isFriendView ? friendGuestMessages : myGuestMessages;

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Image source={LOGO} style={styles.headerLogo} />

        <View style={styles.headerRight}>
          <Text style={styles.userName}>000님</Text>
          <Text style={styles.divider}>ㅣ</Text>

          <TouchableOpacity style={styles.meBox} onPress={resetToMe}>
            <Text style={styles.meText}>{isFriendView ? '공유' : 'ME'}</Text>
            <Image
              source={isFriendView ? SHARE_ON : SHARE_OFF}
              style={styles.meIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 검색 */}
      <TouchableOpacity
        style={styles.searchBox}
        onPress={() => setIsAddPopupVisible(true)}
      >
        <Image source={SEARCH_ICON} style={styles.searchIcon} />
        <Text style={styles.searchPlaceholder}>새로운 친구를 선택하세요.</Text>
      </TouchableOpacity>

      {/* 방명록 헤더 */}
      <View style={styles.guestRow}>
        <Text style={[styles.guestText, isFriendView && { color: '#0068FF' }]}>
          방명록
        </Text>

        {isFriendView && (
          <>
            <TouchableOpacity
              style={styles.editIconWrapper}
              onPress={() => setIsGuestBookVisible(true)}
            >
              <Image source={WRITE_ICON} style={styles.editIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.calendarIconWrapper}
              onPress={() => handleViewCalendar(targetEmail)}
            >
              <Image source={CALENDAR_ICON} style={styles.calendarIcon} />
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.friendListIconWrapper}
          onPress={() => setIsPopupVisible(true)}
        >
          <Image
            source={isPopupVisible ? FRIEND_ON : FRIEND_OFF}
            style={styles.friendListIcon}
          />
        </TouchableOpacity>
      </View>

      {/* 리스트 */}
      <FlatList
        data={currentData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, marginTop: 20 }}
        renderItem={({ item }) => (
          <GuestBookCard
            data={item}
            showDelete={!isFriendView}
            onDelete={handleDeleteMyGuestbook}
          />
        )}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: 'center',
              color: '#D9D9D9',
              marginTop: 40,
            }}
          >
            {isFriendView
              ? '친구에게 첫 방명록을 남겨보세요.'
              : '아직 등록된 방명록이 없습니다.'}
          </Text>
        }
      />

      {/* 팝업 */}
      {isPopupVisible && (
        <FrendPopup
          visible={true}
          onClose={() => setIsPopupVisible(false)}
          friendList={(friends ?? []).map(f => f.nickname)}
          onDelete={(nickname) => {
            const friend = friends.find(f => f.nickname === nickname);
            if (friend) removeFriend(friend.friendId);
          }}
          onWriteGuestBook={handleOpenWriteGuestBook}
          onViewCalendar={handleViewCalendar}
          isFriendView={isFriendView}
          onResetToMe={resetToMe}
        />
      )}

      {isCalendarVisible && (
        <CalendarPopup
          visible={true}
          onClose={() => setIsCalendarVisible(false)}
          userName={targetEmail}
          isEditable={!isFriendView}
        />
      )}

      {isGuestBookVisible && (
        <GuestBookPopup
          visible={true}
          onClose={() => setIsGuestBookVisible(false)}
          userName={targetEmail}
          onSubmit={handleGuestBookSubmit}
        />
      )}

      {isAddPopupVisible && (
        <FrendAddPopup
          visible={true}
          onClose={() => setIsAddPopupVisible(false)}
          onConfirm={handleTestSwitch}
        />
      )}

      {isSelectPopupVisible && (
        <SelectPopup
          visible={true}
          onClose={() => setIsSelectPopupVisible(false)}
          senderEmail={targetEmail}
          onAccept={handleAddFriend}
        />
      )}
    </SafeAreaView>
  );
}
