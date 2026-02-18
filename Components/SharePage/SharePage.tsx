import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './SharePage.style';
import FrendPopup from './FrendPopup';
import FrendAddPopup from './Frend_Add_Popup';
import SelectPopup from './other_people/SelectPopup'; 

export default function SharePage({ navigation }: any) {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const [isSelectPopupVisible, setIsSelectPopupVisible] = useState(false);

  // 🔹 추가: 입력한 이메일 임시 저장 (신청 중인 대상)
  const [targetEmail, setTargetEmail] = useState('');

  // 🔹 핵심: 실제 친구 목록 데이터 (수락 완료된 친구들)
  const [friendList, setFriendList] = useState<string[]>([]);

  // 1️⃣ 내 시점: 신청 완료 후 '확인' 누르면 상대방 시점 팝업으로 전환
  const handleTestSwitch = (email: string) => {
    setTargetEmail(email);
    setIsAddPopupVisible(false);
    
    setTimeout(() => {
      setIsSelectPopupVisible(true);
    }, 400);
  };

  // 2️⃣ 상대방 시점: '수락' 버튼을 누르면 실제 목록에 추가하는 함수
  const handleAddFriend = (email: string) => {
    if (!friendList.includes(email)) {
      setFriendList((prev) => [...prev, email]);
    }
  };

  // 🔥 3️⃣ 삭제 로직: FrendPopup에서 삭제를 누르면 해당 이메일을 제외한 새 목록 생성
  const handleDeleteFriend = (emailToDelete: string) => {
    setFriendList((prev) => prev.filter((email) => email !== emailToDelete));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 부분 */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/Logo.png')} style={styles.headerLogo} />
        <View style={styles.headerRight}>
          <Text style={styles.userName}>오성준님</Text>
          <Text style={styles.divider}>ㅣ</Text>
          <TouchableOpacity style={styles.meBox} activeOpacity={0.8}>
            <Text style={styles.meText}>ME</Text>
            <Image source={require('../../assets/images/share/share_off.png')} style={styles.meIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 검색창: 누르면 추가 팝업 열림 */}
      <TouchableOpacity 
        style={styles.searchBox} 
        activeOpacity={0.8} 
        onPress={() => setIsAddPopupVisible(true)}
      >
        <Image source={require('../../assets/images/share/search.png')} style={styles.searchIcon} />
        <Text style={styles.searchPlaceholder}>새로운 친구를 선택하세요.</Text>
      </TouchableOpacity>

      {/* 방명록: 누르면 친구 목록 팝업 열림 */}
      <View style={styles.guestRow}>
        <Text style={styles.guestText}>방명록</Text>
        <TouchableOpacity onPress={() => setIsPopupVisible(true)}>
          <Image 
            source={isPopupVisible ? require('../../assets/images/share/frend_on.png') : require('../../assets/images/share/frend_off.png')} 
            style={styles.guestIcon} 
          />
        </TouchableOpacity>
      </View>

      {/* 🔥 [팝업 1] 기존 친구 목록 (삭제 함수 전달) */}
      <FrendPopup
        visible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
        friendList={friendList} 
        onDelete={handleDeleteFriend} // 🔹 이 함수를 통해 자식에서 삭제 신호를 받음
      />

      {/* 🔥 [팝업 2] 내 시점 추가 */}
      <FrendAddPopup
        visible={isAddPopupVisible}
        onClose={() => setIsAddPopupVisible(false)}
        onConfirm={(email) => handleTestSwitch(email)}
      />

      {/* 🔥 [팝업 3] 상대방 시점 수락 테스트 */}
      <SelectPopup
        visible={isSelectPopupVisible}
        onClose={() => setIsSelectPopupVisible(false)}
        senderEmail={targetEmail} 
        onAccept={handleAddFriend} 
      />
    </SafeAreaView>
  );
}

//내 시점: FrendAddPopup에서 친구 이메일을 입력하고 **'전송하기'**를 누릅니다.

// 전환: "‘@’님께 친구 신청했습니다."라는 완료 메시지와 '확인' 버튼이 뜹니다.

// 테스트 로직: 이 '확인' 버튼을 누르는 순간, 실제로는 상대방(양병권)의 시점인 SelectPopup이 바로 뜨도록 연결하여 테스트 환경을 구성하는 것입니다.

// 향후 계획: 나중에는 실제 API를 연동하여 상대방 이메일로 알림이 가는 방식으로 고도화할 예정이고요.