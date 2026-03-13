import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';
import styles from './LoginPage.style';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'LoginPage'>;

function LoginPage({ navigation }: Props) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!id || !password) {
      Alert.alert('알림', '아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        'http://192.168.0.118:8080/auth/login',
        {
          email: id,
          password: password,
        },
      );

      console.log(response.data);

      Alert.alert('로그인 성공');
      navigation.replace('Main');
    } catch (error) {
      console.log(error);
      Alert.alert('로그인 실패', '아이디 또는 비밀번호를 확인하세요.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusBarSpace} />

      <View style={styles.logoBox}>
        <Image
          source={require('../../assets/images/Login_Logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <TextInput
        style={styles.inputEmail}
        placeholder="이메일 입력"
        placeholderTextColor="#979797"
        value={id}
        onChangeText={setId}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.inputPassword}
        placeholder="비밀번호 입력"
        placeholderTextColor="#979797"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <View style={styles.bottomMenuContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.bottomText}>회원가입</Text>
        </TouchableOpacity>

        <View style={styles.verticalSeparator} />

        <TouchableOpacity
          onPress={() => navigation.navigate('ResetpasswordPage')}
        >
          <Text style={styles.bottomText}>비밀번호 재설정</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default LoginPage;
