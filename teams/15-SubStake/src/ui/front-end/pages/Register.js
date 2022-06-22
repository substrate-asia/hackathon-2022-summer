import { useState, useRef } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { commonStyle, ConfirmButton } from '../components/common/ChatBox';
import { Divider } from '@rneui/base';
import { derivePrivateKey } from '../components/utils';
import { useAsyncStorage } from '../components/Context/AsyncStorage';
import Layout from '../components/Layout';
import LoadingModal from '../components/LoadingModal';

export default function Register({ navigation }) {
  const { addAccount } = useAsyncStorage();
  const [status, setStatus] = useState(0);
  const [mnemonic, setMnemonic] = useState('');
  const [nickname, setNickname] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [pending, setPending] = useState(false);
  const [clicked, setClicked] = useState(false);

  const scrollViewRef = useRef();

  const deriveAndPostPrivateKey = async () => {
    setClicked(true);
    try {
      const result = derivePrivateKey(mnemonic);

      await fetch('https://rest-api.substake.app//api/request/dev/set-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_key: result.bip39.address,
          private_key: result.bip39.privateKey,
          env: 'evm',
        }),
      });

      await fetch('https://rest-api.substake.app//api/request/dev/set-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_key: result.sr25519.address,
          private_key: mnemonic,
          env: 'substrate',
        }),
      });

      setPublicKey(result);
      setStatus(1);
    } catch {}
    setClicked(false);
  };

  const storeAccount = async () => {
    setClicked(true);
    setPending(true);
    try {
      await addAccount({ bip39: publicKey.bip39.address, sr25519: publicKey.sr25519.address, nickname });
      navigation.navigate('Home');
    } catch (e) {
      setPending(false);
      setClicked(false);
    }
  };

  return (
    <Layout>
      {pending && <LoadingModal />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        <View style={commonStyle.serviceChatContainer}>
          <View style={commonStyle.serviceChatBox}>
            <Text style={commonStyle.serviceChatBoxTitle}>Input your mnemonic seed phrase</Text>
            <Text style={commonStyle.serviceChatBoxDesc}>Only need to input once in order to launch the service.</Text>
            {status === 0 && (
              <>
                <Divider style={commonStyle.divider} color="rgba(65, 69, 151, 0.8)" />
                <View style={commonStyle.inputContainer}>
                  <TextInput
                    autoCapitalize="none"
                    style={commonStyle.textInput}
                    placeholderTextColor="#A8A8A8"
                    placeholder="Seed phase"
                    onChangeText={(text) => setMnemonic(text)}
                    editable={status === 0}
                    autoCorrect={false}
                  />
                  <ConfirmButton onPress={deriveAndPostPrivateKey} disabled={clicked || status !== 0} />
                </View>
              </>
            )}
          </View>
        </View>
        {status > 0 && (
          <>
            <View style={commonStyle.userChatContainer}>
              <View style={commonStyle.userChatBox}>
                <Text style={commonStyle.userChatBoxText}>{`sr25519: ${publicKey.sr25519.address}`}</Text>
                <Text style={commonStyle.userChatBoxText}>{`bip39: ${publicKey.bip39.address}`}</Text>
              </View>
            </View>
            <View style={commonStyle.serviceChatContainer}>
              <View style={commonStyle.serviceChatBox}>
                <Text style={commonStyle.serviceChatBoxTitle}>Set a nickname for your account</Text>
                <Text style={commonStyle.serviceChatBoxDesc}>You may change the name from settings.</Text>
                {status === 1 && (
                  <>
                    <Divider style={commonStyle.divider} color="rgba(65, 69, 151, 0.8)" />
                    <View style={commonStyle.inputContainer}>
                      <TextInput
                        autoCapitalize="none"
                        style={commonStyle.textInput}
                        placeholderTextColor="#A8A8A8"
                        placeholder="ex) David"
                        onChangeText={(text) => setNickname(text)}
                        editable={status === 1}
                        autoCorrect={false}
                      />
                      <ConfirmButton onPress={storeAccount} disabled={clicked || status !== 1} />
                    </View>
                  </>
                )}
              </View>
            </View>
          </>
        )}
        {status > 1 && (
          <View style={commonStyle.userChatContainer}>
            <View style={commonStyle.userChatBox}>
              <Text style={commonStyle.userChatBoxText}>{nickname}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </Layout>
  );
}
