import Layout from '../../components/Layout';
import TopBar from '../../components/TopBar/TopBar';
import { useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image } from 'react-native';
import { commonStyle, ConfirmButton } from '../../components/common/ChatBox';
import { Divider } from '@rneui/base';
import success from '../../assets/success.png';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import LoadingModal from '../../components/LoadingModal';
import Slider from 'react-native-slide-to-unlock';
import arrowRight from '../../assets/arrowRightBold.png';

export default function MoonbaseDelegator({ navigation }) {
  const [status, setStatus] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  const [action, setAction] = useState('');
  const [clicked, setClicked] = useState(false);
  const [pending, setPending] = useState(false);
  const [bondAmount, setBondAmount] = useState(0);
  const [aprChatStack, setAprChatStack] = useState([]);
  const [isLower, setIsLower] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const scrollViewRef = useRef();

  const aprChatFactory = (apr) => {
    return (
      <View style={commonStyle.serviceChatContainer}>
        <View style={commonStyle.serviceChatBox}>
          <Text style={commonStyle.serviceChatBoxTitle}>Your Staking APR is around {apr}%.</Text>
          <Text style={commonStyle.serviceChatBoxDesc}>
            Based on 30-Day average performance of the most profitable collators.
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Layout>
      <TopBar title="Delegator" path="StakableAssets" navigation={navigation} />
      {pending && <LoadingModal text={loadingText} />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        <View style={commonStyle.serviceChatContainer}>
          <View style={commonStyle.serviceChatBox}>
            <Text style={commonStyle.serviceChatBoxTitle}>Enter the staking amount intended</Text>
            <Text style={commonStyle.serviceChatBoxDesc}>Transferrable Amount: 253.2124 WND</Text>
            {status === 0 && (
              <>
                <Divider style={commonStyle.divider} />
                <View style={commonStyle.inputContainer}>
                  <TextInput
                    autoCapitalize="none"
                    keyboardType="decimal-pad"
                    style={commonStyle.textInput}
                    placeholderTextColor="#A8A8A8"
                    placeholder="Please enter only the digits"
                    onChangeText={(amount) => setBondAmount(amount)}
                    editable={status === 0}
                    autoCorrect={false}
                  />
                  <ConfirmButton
                    onPress={async () => {
                      setLoadingText('Calculating your approximate APR...');
                      setPending(true);
                      await new Promise((r) => setTimeout(r, 1000));
                      setStatus(1);
                      setPending(false);
                      setLoadingText('');
                    }}
                    disabled={clicked || status !== 0}
                  />
                </View>
              </>
            )}
          </View>
        </View>
        {status > 0 && (
          <View style={commonStyle.userChatContainer}>
            <View style={commonStyle.userChatBox}>
              <Text style={commonStyle.userChatBoxText}>{bondAmount}</Text>
            </View>
          </View>
        )}
        {aprChatStack.map((el) => el)}
        {status > 0 && (
          <View style={commonStyle.serviceChatContainer}>
            <View style={commonStyle.serviceChatBox}>
              <Text style={commonStyle.serviceChatBoxTitle}>Your Staking APR is around 16%.</Text>
              <Text style={commonStyle.serviceChatBoxDesc}>
                Based on 30-Day average performance of the most profitable collators.
              </Text>
              <Divider style={commonStyle.divider} />
              <Slider
                onEndReached={() => {
                  setStatus(2);
                  setIsDisabled(true);
                }}
                containerStyle={isDisabled ? commonStyle.disabledSliderContainer : commonStyle.sliderContainer}
                sliderElement={
                  <View style={commonStyle.sliderBox}>
                    <Image source={arrowRight} />
                  </View>
                }
                disableSliding={isDisabled}
              >
                <Text style={commonStyle.sliderInnerText}>
                  {isDisabled ? 'confirmed' : "Swipe to confirm the 'extrinsic'"}
                </Text>
              </Slider>
              {status === 1 && (
                <Pressable
                  disabled={status !== 1}
                  onPress={() => {
                    setIsLower(!isLower);
                    setAprChatStack([...aprChatStack, aprChatFactory(16)]);
                  }}
                >
                  <Text style={{ color: '#6C84FF', fontSize: 10, marginTop: 10 }}>
                    I want a {isLower ? 'higher' : 'lower'} APR(stable reward)
                  </Text>
                </Pressable>
              )}
            </View>
            {status > 1 && (
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
            )}
          </View>
        )}
      </ScrollView>
    </Layout>
  );
}
