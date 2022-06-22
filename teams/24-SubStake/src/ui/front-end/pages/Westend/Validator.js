import { useRef, useState } from 'react';
import Layout from '../../components/Layout';
import TopBar from '../../components/TopBar/TopBar';
import { View, Text, TextInput, Pressable, ScrollView, Image } from 'react-native';
import { commonStyle, ConfirmButton } from '../../components/common/ChatBox';
import { Divider } from '@rneui/base';
import success from '../../assets/success.png';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { useUserBalance } from '../../query';
import { formatBalanceToString } from '../../components/utils';

const option = ['Bond More', 'Bond Less', 'Cancel Bond Request'];

export default function WestendValidator({ navigation }) {
  const [status, setStatus] = useState(0);
  const [action, setAction] = useState('');
  const [bondAmount, setBondAmount] = useState(0);
  const scrollViewRef = useRef();
  const [clicked, setClicked] = useState(false);
  const { data, isSuccess } = useUserBalance();
  // console.log(formatBalanceToString(data.westendBalance.feeFrozen));

  return (
    <Layout>
      <TopBar title="Validator" path="StakableAssets" navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        <View style={commonStyle.serviceChatContainer}>
          <View style={commonStyle.serviceChatBox}>
            <Text style={commonStyle.serviceChatBoxTitle}>Validator 액션을 선택해주세요</Text>
            <Text style={commonStyle.serviceChatBoxDesc}>모든 액션은 4시간 소요 예상됩니다.</Text>
            {status === 0 && (
              <>
                <Divider style={commonStyle.divider} color="rgba(65, 69, 151, 0.8)" />
                <View style={commonStyle.buttonWrapper}>
                  {option.map((el) => (
                    <Pressable
                      style={commonStyle.buttonContainer}
                      onPress={() => {
                        setStatus(1);
                        setAction(el);
                      }}
                      disabled={status !== 0}
                    >
                      <Text style={commonStyle.buttonText}>{el}</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
        {status > 0 && action === 'Bond More' && (
          <>
            <View style={commonStyle.userChatContainer}>
              <View style={commonStyle.userChatBox}>
                <Text style={commonStyle.userChatBoxText}>{action}</Text>
              </View>
            </View>
            <View style={commonStyle.serviceChatContainer}>
              <View style={commonStyle.serviceChatBox}>
                <Text style={commonStyle.serviceChatBoxTitle}>Enter the staking amount intended</Text>
                <Text style={commonStyle.serviceChatBoxDesc}>
                  Transferrable Amount:
                  {data?.westendBalance?.transferrableBalance
                    ? formatBalanceToString(data?.westendBalance?.transferrableBalance)
                    : 0}{' '}
                  WND
                </Text>
                {status === 1 && (
                  <>
                    <Divider style={commonStyle.divider} color="rgba(65, 69, 151, 0.8)" />
                    <View style={commonStyle.inputContainer}>
                      <TextInput
                        autoCapitalize="none"
                        keyboardType="decimal-pad"
                        style={commonStyle.textInput}
                        placeholderTextColor="#A8A8A8"
                        placeholder="Please enter only the digits"
                        onChangeText={(amount) => setBondAmount(amount)}
                        editable={status === 1}
                        autoCorrect={false}
                      />
                      <ConfirmButton onPress={() => setStatus(2)} disabled={clicked || status !== 1} />
                    </View>
                  </>
                )}
              </View>
            </View>
          </>
        )}
        {status > 0 && action === 'Bond Less' && (
          <>
            <View style={commonStyle.userChatContainer}>
              <View style={commonStyle.userChatBox}>
                <Text style={commonStyle.userChatBoxText}>{action}</Text>
              </View>
            </View>
            <View style={commonStyle.serviceChatContainer}>
              <View style={commonStyle.serviceChatBox}>
                <Text style={commonStyle.serviceChatBoxTitle}>차감하실 스테이킹 수량을 입력해주세요</Text>
                <Text style={commonStyle.serviceChatBoxDesc}>현재 스테이킹 수량: 25253.2124 WND</Text>
                <Divider style={commonStyle.divider} color="rgba(65, 69, 151, 0.8)" />
                <View style={commonStyle.inputContainer}>
                  <TextInput
                    autoCapitalize="none"
                    keyboardType="decimal-pad"
                    style={commonStyle.textInput}
                    placeholderTextColor="#A8A8A8"
                    placeholder="Please enter only the digits"
                    onChangeText={(amount) => setBondAmount(amount)}
                    editable={status === 1}
                    autoCorrect={false}
                  />
                  <ConfirmButton onPress={() => setStatus(2)} disabled={clicked || status !== 1} />
                </View>
              </View>
            </View>
          </>
        )}
        {status > 0 && action === 'Cancel Bond Request' && (
          <>
            <View style={commonStyle.userChatContainer}>
              <View style={commonStyle.userChatBox}>
                <Text style={commonStyle.userChatBoxText}>{action}</Text>
              </View>
            </View>
            <View style={commonStyle.serviceChatContainer}>
              <View style={commonStyle.succesContainer}>
                <Image source={success} />
                <View>
                  <Text style={commonStyle.successHeader}>Success</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={commonStyle.successMain}>Your Extrinsic tx-id:</Text>
                    <Pressable
                      onPress={() =>
                        openBrowserAsync('https://moonbase.subscan.io/extrinsic/2298472-4', {
                          presentationStyle: WebBrowserPresentationStyle.POPOVER,
                        })
                      }
                    >
                      <Text style={commonStyle.successLink}> #2275958-3</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
        {status > 1 && action !== 'Cancel Bond Request' && (
          <>
            <View style={commonStyle.userChatContainer}>
              <View style={commonStyle.userChatBox}>
                <Text style={commonStyle.userChatBoxText}>{bondAmount}</Text>
              </View>
            </View>
            <View style={commonStyle.serviceChatContainer}>
              <View style={commonStyle.succesContainer}>
                <Image source={success} />
                <View>
                  <Text style={commonStyle.successHeader}>Success</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={commonStyle.successMain}>Your Extrinsic tx-id:</Text>
                    <Pressable
                      onPress={() =>
                        openBrowserAsync('https://moonbase.subscan.io/extrinsic/2298472-4', {
                          presentationStyle: WebBrowserPresentationStyle.POPOVER,
                        })
                      }
                    >
                      <Text style={commonStyle.successLink}> #2275958-3</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </Layout>
  );
}
