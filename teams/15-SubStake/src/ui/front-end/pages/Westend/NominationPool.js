import { useRef, useState, useEffect } from 'react';
import { Image, ScrollView, Text, View, TextInput, Pressable, Modal } from 'react-native';
import { commonStyle, ConfirmButton } from '../../components/common/ChatBox';
import TopBar from '../../components/TopBar/TopBar';
import img_1 from '../../assets/nomination_pool_1.png';
import img_2 from '../../assets/nomination_pool_2.png';
import img_3 from '../../assets/nomination_pool_3.png';
import { Divider } from '@rneui/base';
import Layout from '../../components/Layout';
import success from '../../assets/success.png';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { NominationPoolModal } from '../../components/Westend/NominationPool/Modal';
import { useAsyncStorage } from '../../components/Context/AsyncStorage';
import { useUserBalance } from '../../query';
import { formatBalanceToString } from '../../components/utils';
import LoadingModal from '../../components/LoadingModal';

const cardContent = [
  {
    main: 'A member delegates funds to a pool by transferring some amount to the pool’s bonded account with the “join” extrinsic.',
    sub: 'Note: A member is afforded the ability to bond additional funds, or re-stake rewards as long as they are already actively bonded. Remeber, a member may only belong to one pool at a time.',
    img: img_1,
  },
  {
    main: 'The member can claim their portion of any rewards that have accumulated since the previous time they claimed (or in the case that they have never claimed, any rewards that have accumulated since the era after they joined). Rewards are split pro rata among the actively bonded members.',
    sub: '',
    img: img_2,
  },
  {
    main: "At any point in time after joining the pool, a member can start the process of exiting by unbonding. unbond will unbond part or all of the member's funds.",
    sub: 'The unbonding duration has passed (e.g. 28 days on Polkadot), a member may withdraw their funds with withdraw unbonded',
    img: img_3,
  },
];

export default function WestendNominationPool({ navigation }) {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState(0);
  const [action, setAction] = useState('');
  const [clicked, setClicked] = useState(false);
  const [bondAmount, setBondAmount] = useState(0);
  const [selectedValidator, setSelectedValidator] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scrollViewRef = useRef();
  const [poolId, setPoolId] = useState();
  const [txMessage, setTxMessage] = useState();
  const [txStatus, setTxStatus] = useState();

  const { data, isSuccess } = useUserBalance();
  const { accounts, currentIndex } = useAsyncStorage();

  const handleSubmit = async () => {
    setPending(true);
    try {
      const response = await fetch('https://rest-api.substake.app/api/request/dev/stake', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          env: 'substrate',
          provider: 'westend',
          method: 'stake',
          userAddress: accounts[currentIndex].sr25519,
          amount: bondAmount,
          isNominate: 'False',
          isPool: 'True',
          poolId: poolId ? poolId : selectedValidator.selectedIndex,
        }),
      });

      const result = await response.json();
      console.log(result);
      if (result.Status === 'Success') setTxMessage(result.Message);
      setTxStatus(result.Status);
    } catch {
      setTxStatus('Failed');
    }
    setStatus(2);
    setPending(false);
  };

  return (
    <Layout>
      <TopBar title="Nomination Pool" path="StakableAssets" navigation={navigation} />
      {pending && <LoadingModal />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        <NominationPoolModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          selectedValidator={selectedValidator}
          setSelectedValidator={setSelectedValidator}
        />
        <ScrollView horizontal={true}>
          <View style={commonStyle.cardContainer}>
            {cardContent.map((el, i) => (
              <View style={commonStyle.cardBox} key={i}>
                <Image source={el.img} style={commonStyle.cardImg} />
                <View style={commonStyle.cardTextWrapper}>
                  <Text style={commonStyle.cardMainText}>{el.main}</Text>
                  <Text style={commonStyle.cardSubText}>{el.sub}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={commonStyle.serviceChatContainer}>
          <View style={commonStyle.serviceChatBox}>
            <Text style={commonStyle.serviceChatBoxTitle}>Do you want to join SubStake Pool?</Text>
            <Text style={commonStyle.serviceChatBoxDesc}>If no, you can manually select a pool.</Text>
            {status === 0 && (
              <>
                <Divider style={commonStyle.divider} color="rgba(65, 69, 151, 0.8)" />
                <View style={commonStyle.buttonWrapper}>
                  <Pressable
                    style={commonStyle.buttonContainer}
                    onPress={() => {
                      setStatus(1);
                      setAction(() => 'substake');
                      setPoolId(74);
                    }}
                    disabled={status !== 0}
                  >
                    <Text style={commonStyle.buttonText}>Yes, please</Text>
                  </Pressable>
                  <Pressable
                    style={commonStyle.buttonContainer}
                    onPress={() => {
                      setStatus(1);
                      setAction(() => 'manual');
                    }}
                    disabled={status !== 0}
                  >
                    <Text style={commonStyle.buttonText}>No, I want to select manually</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
        {action === 'substake' && status > 0 && (
          <>
            <View style={commonStyle.userChatContainer}>
              <View style={commonStyle.userChatBox}>
                <Text style={commonStyle.userChatBoxText}>Yes, please</Text>
              </View>
            </View>
            <View style={commonStyle.serviceChatContainer}>
              <View style={commonStyle.serviceChatBox}>
                <Text style={commonStyle.serviceChatBoxTitle}>Enter the staking amount intended</Text>
                <Text style={commonStyle.serviceChatBoxDesc}>
                  Transferrable Amount: {formatBalanceToString(data.westendBalance.transferrableBalance)} WND
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

                      <ConfirmButton onPress={handleSubmit} disabled={clicked || status !== 1} />
                    </View>
                  </>
                )}
              </View>
            </View>
          </>
        )}
        {action === 'manual' && status > 0 && (
          <>
            <View style={commonStyle.userChatContainer}>
              <View style={commonStyle.userChatBox}>
                <Text style={commonStyle.userChatBoxText}>No, I want to select manually</Text>
              </View>
            </View>
            <View style={commonStyle.serviceChatContainer}>
              <View style={commonStyle.serviceChatBox}>
                <Text style={commonStyle.serviceChatBoxTitle}>Which pool are you looking for?</Text>
                {!selectedValidator && (
                  <>
                    <Divider style={commonStyle.divider} color="rgba(65, 69, 151, 0.8)" />
                    <View style={commonStyle.buttonWrapper}>
                      <Pressable
                        style={commonStyle.buttonContainer}
                        onPress={() => setModalVisible(true)}
                        disabled={status !== 1}
                      >
                        <Text style={commonStyle.buttonText}>Select a Nomination Pool</Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </View>
            </View>
            {selectedValidator !== null && (
              <>
                <View style={commonStyle.userChatContainer}>
                  <View style={commonStyle.userChatBox}>
                    <Text style={commonStyle.userChatBoxText}>{selectedValidator.selectedName}</Text>
                  </View>
                </View>
                <View style={commonStyle.serviceChatContainer}>
                  <View style={commonStyle.serviceChatBox}>
                    <Text style={commonStyle.serviceChatBoxTitle}>Enter the staking amount intended</Text>
                    <Text style={commonStyle.serviceChatBoxDesc}>
                      Transferrable Amount: {formatBalanceToString(data.westendBalance.transferrableBalance)} WND
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
                          <ConfirmButton onPress={handleSubmit} disabled={clicked || status !== 1} />
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </>
            )}
          </>
        )}
        {status > 1 && (
          <>
            <View style={commonStyle.userChatContainer}>
              <View style={commonStyle.userChatBox}>
                <Text style={commonStyle.userChatBoxText}>{bondAmount} WND</Text>
              </View>
            </View>
            {txStatus === 'Success' ? (
              <View style={commonStyle.serviceChatContainer}>
                <View style={commonStyle.succesContainer}>
                  <Image source={success} />
                  <View>
                    <Text style={commonStyle.successHeader}>Success</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={commonStyle.successMain}>See your extrinsic in </Text>
                      <Pressable
                        onPress={() =>
                          openBrowserAsync(`https://westend.subscan.io/extrinsic/${txMessage}`, {
                            presentationStyle: WebBrowserPresentationStyle.POPOVER,
                          })
                        }
                      >
                        <Text style={commonStyle.successLink}>subscan</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View style={commonStyle.serviceChatContainer}>
                <View style={commonStyle.serviceChatBox}>
                  <Text style={commonStyle.successMain}>Transaction Failed</Text>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </Layout>
  );
}
