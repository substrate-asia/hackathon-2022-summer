import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { commonStyle } from '../common/ChatBox';
import Layout from '../Layout';
import { Divider } from '@rneui/base';

export default function Register() {
  const [seed, setSeed] = useState('');
  const [nickname, setNickname] = useState('');
  const [msgStack, setMsgStack] = useState([]);

  const showSeedMsg = (
    <View style={commonStyle.userChatContainer}>
      <View style={commonStyle.userChatBox}>
        <Text style={commonStyle.userChatBoxText}>{seed}</Text>
      </View>
    </View>
  );

  const showNickname = (
    <View style={commonStyle.userChatContainer}>
      <View style={commonStyle.userChatBox}>
        <Text style={commonStyle.userChatBoxText}>{nickname}</Text>
      </View>
    </View>
  );

  const setNicknameMsg = (
    <View style={commonStyle.serviceChatContainer}>
      <View style={commonStyle.serviceChatBox}>
        <Text style={commonStyle.serviceChatBoxTitle}>계정 닉네임을 설정해주세요</Text>
        <Text style={commonStyle.serviceChatBoxDesc}>닉네임은 언제든 수정 가능합니다.</Text>
        <Divider color="rgba(65, 69, 151, 0.8)" />
        <View style={commonStyle.inputContainer}>
          <TextInput
            style={commonStyle.textInput}
            placeholderTextColor="#A8A8A8"
            placeholder="ex) David"
            onChangeText={(text) => setNickname(text)}
          />
          <Pressable
            onPress={() => {
              if (msgStack.length < 3) setMsgStack((msgStack) => [...msgStack, showNickname]);
            }}
          >
            <Text style={commonStyle.confirm}>확인</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <Layout>
      <View style={commonStyle.serviceChatContainer}>
        <View style={commonStyle.serviceChatBox}>
          <Text style={commonStyle.serviceChatBoxTitle}>시드문구로 계정을 복구해주세요</Text>
          <Text style={commonStyle.serviceChatBoxDesc}>서비스 시작을 위해 처음 한 번만 복구하시면 됩니다.</Text>
          <Divider color="rgba(65, 69, 151, 0.8)" />
          <View style={commonStyle.inputContainer}>
            <TextInput
              style={commonStyle.textInput}
              placeholderTextColor="#A8A8A8"
              placeholder="시드문구"
              onChangeText={(text) => setSeed(text)}
            />
            <Pressable
              onPress={() => {
                if (msgStack.length < 1) setMsgStack((msgStack) => [...msgStack, showSeedMsg, setNicknameMsg]);
              }}
            >
              <Text style={commonStyle.confirm}>확인</Text>
            </Pressable>
          </View>
        </View>
      </View>
      {msgStack.map((el) => el)}
    </Layout>
  );
}
