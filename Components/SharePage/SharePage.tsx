import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './SharePage.style';
import FrendPopup from './FrendPopup';
import FrendAddPopup from './Frend_Add_Popup';
import SelectPopup from './other_people/SelectPopup';
import GuestBookPopup from './GuestBookPopup';
import GuestBookCard from './GuestBookCard';
import CalendarPopup from './CalenderPopup22';

export default function SharePage({ navigation }: any) {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const [isSelectPopupVisible, setIsSelectPopupVisible] = useState(false);
  const [isGuestBookVisible, setIsGuestBookVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const [isFriendView, setIsFriendView] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');
  const [friendList, setFriendList] = useState<string[]>([]);

  const [myGuestMessages, setMyGuestMessages] = useState<any[]>([
    {
      id: '1',
      date: '24.02.19 10:00',
      senderEmail: 'tester@abc.com',
      message: '반갑습니다! 좋은 하루 되세요.',
    },
  ]);
  const [friendGuestMessages, setFriendGuestMessages] = useState<any[]>([]);

  const handleTestSwitch = (email: string) => {
    setTargetEmail(email);
    setIsAddPopupVisible(false);
    setTimeout(() => {
      setIsSelectPopupVisible(true);
    }, 600);
  };

  const handleAddFriend = (email: string) => {
    if (!friendList.includes(email)) {
      setFriendList((prev) => [...prev, email]);
    }
  };

  // 🔹 [기존] 친구 목록에서 연필 아이콘 클릭 시
  const handleOpenWriteGuestBook = (email: string) => {
    setTargetEmail(email);
    setIsPopupVisible(false);
    setIsFriendView(true); // 친구 모드로 전환

    setTimeout(() => {
      setIsGuestBookVisible(true);
    }, 500);
  };

  // 🔹 [수정] 친구 목록에서 캘린더 아이콘 클릭 시
  const handleViewCalendar = (email: string) => {
    setTargetEmail(email); // 1. 대상 이메일 저장
    setIsPopupVisible(false); // 2. 친구 목록 팝업 닫기
    setIsFriendView(true); // 3. 메인 페이지를 '친구 모드(공유)'로 전환 (추가됨!)

    setTimeout(() => {
      setIsCalendarVisible(true); // 4. 캘린더 팝업 띄우기
    }, 300);
  };

  const handleGuestBookSubmit = (message: string) => {
    const now = new Date();
    const dateString = `${String(now.getFullYear()).slice(-2)}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMessage = {
      id: Date.now().toString(),
      date: dateString,
      senderEmail: '나(Me)',
      message: message,
    };

    if (isFriendView) {
      setFriendGuestMessages((prev) => [newMessage, ...prev]);
    }
    setIsGuestBookVisible(false);
  };

  const resetToMe = () => {
    setIsFriendView(false);
    setTargetEmail('');
    setFriendGuestMessages([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/Logo.png')}
            style={styles.headerLogo}
          />
          <View style={styles.headerRight}>
            <Text style={styles.userName}>000님</Text>
            <Text style={styles.divider}>ㅣ</Text>
            <TouchableOpacity style={styles.meBox} onPress={resetToMe}>
              <Text style={styles.meText}>{isFriendView ? '공유' : 'ME'}</Text>
              <Image
                source={
                  isFriendView
                    ? require('../../assets/images/share/share_on.png')
                    : require('../../assets/images/share/share_off.png')
                }
                style={styles.meIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 검색창 */}
        <TouchableOpacity
          style={styles.searchBox}
          onPress={() => setIsAddPopupVisible(true)}
        >
          <Image
            source={require('../../assets/images/share/search.png')}
            style={styles.searchIcon}
          />
          <Text style={styles.searchPlaceholder}>
            새로운 친구를 선택하세요.
          </Text>
        </TouchableOpacity>

        {/* 방명록 섹션 */}
        <View style={styles.guestRow}>
          <Text
            style={[styles.guestText, isFriendView && { color: '#0068FF' }]}
          >
            방명록
          </Text>

          {isFriendView && (
            <>
              <TouchableOpacity
                style={styles.editIconWrapper}
                onPress={() => setIsGuestBookVisible(true)}
              >
                <Image
                  source={require('../../assets/images/share/write_on.png')}
                  style={styles.editIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.calendarIconWrapper}
                onPress={() => handleViewCalendar(targetEmail)}
              >
                <Image
                  source={require('../../assets/images/share/calender.png')}
                  style={styles.calendarIcon}
                />
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            style={styles.friendListIconWrapper}
            onPress={() => setIsPopupVisible(true)}
          >
            <Image
              source={
                isPopupVisible
                  ? require('../../assets/images/share/frend_on.png')
                  : require('../../assets/images/share/frend_off.png')
              }
              style={styles.friendListIcon}
            />
          </TouchableOpacity>
        </View>

        {/* 카드 렌더링 영역 */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          {isFriendView ? (
            friendGuestMessages.length > 0 ? (
              friendGuestMessages.map((item) => (
                <GuestBookCard key={item.id} data={item} />
              ))
            ) : (
              <Text
                style={{ textAlign: 'center', color: '#D9D9D9', marginTop: 40 }}
              >
                친구에게 첫 방명록을 남겨보세요.
              </Text>
            )
          ) : myGuestMessages.length > 0 ? (
            myGuestMessages.map((item) => (
              <GuestBookCard
                key={item.id}
                data={item}
                showDelete={true}
                onDelete={(id) =>
                  setMyGuestMessages(myGuestMessages.filter((m) => m.id !== id))
                }
              />
            ))
          ) : (
            <Text
              style={{ textAlign: 'center', color: '#D9D9D9', marginTop: 40 }}
            >
              아직 등록된 방명록이 없습니다.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* 팝업 모달들 */}
      <FrendPopup
        visible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
        friendList={friendList}
        onDelete={(email) =>
          setFriendList(friendList.filter((e) => e !== email))
        }
        onWriteGuestBook={handleOpenWriteGuestBook}
        onViewCalendar={handleViewCalendar}
        isFriendView={isFriendView}
        onResetToMe={resetToMe}
      />

      <CalendarPopup
        visible={isCalendarVisible}
        onClose={() => setIsCalendarVisible(false)}
        userName={targetEmail}
        isEditable={!isFriendView}
      />

      <GuestBookPopup
        visible={isGuestBookVisible}
        onClose={() => setIsGuestBookVisible(false)}
        userName={targetEmail}
        onSubmit={handleGuestBookSubmit}
      />

      <FrendAddPopup
        visible={isAddPopupVisible}
        onClose={() => setIsAddPopupVisible(false)}
        onConfirm={handleTestSwitch}
      />

      <SelectPopup
        visible={isSelectPopupVisible}
        onClose={() => setIsSelectPopupVisible(false)}
        senderEmail={targetEmail}
        onAccept={handleAddFriend}
      />
    </SafeAreaView>
  );
}
