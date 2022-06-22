import { useRef, useState, useEffect } from 'react';
import { Image, ScrollView, Text, View, TextInput, Pressable, StyleSheet } from 'react-native';
import { commonStyle, ConfirmButton } from '../../components/common/ChatBox';
import Layout from '../../components/Layout';
import TopBar from '../../components/TopBar/TopBar';
import img_1 from '../../assets/nominator_1.png';
import img_2 from '../../assets/nominator_2.png';
import img_3 from '../../assets/nominator_3.png';
import { Divider } from '@rneui/base';
import Slider from 'react-native-slide-to-unlock';
import success from '../../assets/success.png';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import arrowRight from '../../assets/arrowRight.png';
import NominatorDetailModal from '../../components/Westend/Nominator/DetailModal';
import validator_icon from '../../assets/validator_ex.png';
import NominatorSwitchModal from '../../components/Westend/Nominator/SwitchModal';
import { useUserBalance } from '../../query';
import { formatBalanceToString } from '../../components/utils';
import { useAsyncStorage } from '../../components/Context/AsyncStorage';
import LoadingModal from '../../components/LoadingModal';

const cardContent = [
  {
    main: 'After showing your intent to bond your asset, your nomination takes 24 hours(1era) to come in to effect, and it takes 7 eras to completely unstake your fund.',
    sub: 'Note: Nominators should be only be able to see a SINGLE (our of the validators selected by you) active nomination per era.',
    img: img_1,
  },
  {
    main: 'Only the state of TOP 22,500 nominators out of nominator intentions (up to 50,000) is considered as the electing set to determine the active validators.',
    sub: 'Note: ONLY the state of TOP 256 nominatrors of each Active Validator is eligible for the staking reward.',
    img: img_2,
  },
  {
    main: 'Nominator’s account(or a “voter” will be automatically semi-sorted into a bag of 16 voter-list, based on the amount the voter nominates.',
    sub: 'SubStake App will automatically support you to adjust “moveUp” and “re-bag” extrinsics on behalf of you.',
    img: img_3,
  },
];

export default function WestendNominator({ navigation }) {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState(0);
  const [bondAmount, setBondAmount] = useState(0);
  const [isFilterConfirmed, setIsFilterConfirmed] = useState(false);
  const [isStakingConfirmed, setIsStakingConfirmed] = useState(false);
  const [validatorFilter, setValidatorFilter] = useState([]);
  const [validatorList, setValidatorList] = useState([]);
  const [interestType, setInterestType] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [switchModalVisible, setSwitchModalVisible] = useState(false);
  const [selectedValidator, setSelectedValidator] = useState('');
  const [newValidator, setNewValidator] = useState('');
  const [txMessage, setTxMessage] = useState();
  const [txStatus, setTxStatus] = useState();

  const { data, isSuccess } = useUserBalance();
  const { accounts, currentIndex } = useAsyncStorage();

  const scrollViewRef = useRef();

  const handleBondAmountSubmit = async () => {
    setPending(true);
    try {
      const response = await fetch('https://rest-api.substake.app/api/request/dev/curate', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          which: 'validators',
          bond_amount: bondAmount,
          is_curate: 'True',
        }),
      });
      console.log(response);
      const result = await response.json();
      console.log(result);
      setValidatorList(result);
      setStatus(1);
    } catch {}

    setPending(false);
  };
  useEffect(() => {
    setValidatorFilter([
      { filter: 'One validator per operator', isChecked: false },
      { filter: 'Commission rate under 10%', isChecked: false },
      { filter: 'Number of nominators under 256', isChecked: false },
      { filter: 'Rewards payout with regular basis', isChecked: false },
      { filter: 'Currently elected at least in 3 days', isChecked: false },
      { filter: 'With an onchain-identity', isChecked: false },
      { filter: 'No slashing historical record', isChecked: false },
      { filter: 'Average block rate above 4', isChecked: false },
    ]);
  }, []);

  const handleOnEndReached = async () => {
    setPending(true);
    setIsStakingConfirmed(true);

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
          payee: 'Staked',
          isNominate: 'True',
          isBoth: 'True',
          validators: validatorList.map((el) => el.public_key),
        }),
      });
      console.log(response);
      const result = await response.json();
      console.log(result);
      if (result.Status === 'Success') setTxMessage(result.Message);
      setTxStatus(result.Status);
    } catch {
      setTxStatus('Failed');
    }
    setStatus(4);
    setPending(false);
  };

  return (
    <Layout>
      {pending && <LoadingModal />}
      {detailModalVisible && (
        <NominatorDetailModal
          isVisible={detailModalVisible}
          setModalVisible={setDetailModalVisible}
          setSwitchModalVisible={setSwitchModalVisible}
          validator={selectedValidator}
          icon={validator_icon}
        />
      )}
      {switchModalVisible && (
        <NominatorSwitchModal
          modalVisible={switchModalVisible}
          setModalVisible={setSwitchModalVisible}
          newValidator={newValidator}
          setNewValidator={setNewValidator}
          selectedValidator={selectedValidator}
          validatorList={validatorList}
          setValidatorList={setValidatorList}
        />
      )}
      <TopBar title="Nominator" path="StakableAssets" navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
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
            <Text style={commonStyle.serviceChatBoxTitle}>Enter the staking amount intended</Text>
            <Text style={commonStyle.serviceChatBoxDesc}>
              Transferrable Amount: {formatBalanceToString(data?.westendBalance?.transferrableBalance)} WND
            </Text>
            {status === 0 && (
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
                    editable={status === 0}
                    autoCorrect={false}
                  />
                  <ConfirmButton onPress={handleBondAmountSubmit} status={0} currentStatus={status} />
                </View>
              </>
            )}
          </View>
        </View>
        {status > 0 && (
          <>
            <View style={commonStyle.userChatContainer}>
              <View style={commonStyle.userChatBox}>
                <Text style={commonStyle.userChatBoxText}>{bondAmount} WND</Text>
              </View>
            </View>
            <View style={commonStyle.serviceChatContainer}>
              <View style={commonStyle.serviceChatBox}>
                <Text style={commonStyle.serviceChatBoxTitle}>Filtering by the validator status</Text>
                <Text style={commonStyle.serviceChatBoxDesc}>
                  You may select up to 6 conditions, since there is a risk of few validators being saturated due to the
                  strict standardization.
                </Text>
                <Divider style={commonStyle.divider} color="rgba(65, 69, 151, 0.8)" />
                <View style={commonStyle.buttonWrapper}>
                  {validatorFilter.map((el, i) => (
                    <Pressable
                      key={i}
                      style={el.isChecked ? commonStyle.checkedButtonContainer : commonStyle.buttonContainer}
                      disabled={status !== 1}
                      onPress={() =>
                        setValidatorFilter(
                          validatorFilter.map((filter, j) =>
                            i === j ? { ...filter, isChecked: !filter.isChecked } : filter
                          )
                        )
                      }
                    >
                      <Text style={el.isChecked ? commonStyle.checkedButtonText : commonStyle.buttonText}>
                        {el.filter}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <Divider style={commonStyle.divider} />
                <Slider
                  onEndReached={() => {
                    setStatus(2);
                    setIsFilterConfirmed(true);
                  }}
                  containerStyle={isFilterConfirmed ? commonStyle.disabledSliderContainer : commonStyle.sliderContainer}
                  sliderElement={
                    <View style={commonStyle.sliderBox}>
                      <Image source={arrowRight} />
                    </View>
                  }
                  disableSliding={isFilterConfirmed}
                >
                  <Text style={commonStyle.sliderInnerText}>
                    {isFilterConfirmed ? 'Confirmed' : 'Swipe to confirm the your filters'}
                  </Text>
                </Slider>
              </View>
            </View>
          </>
        )}
        {status > 1 && (
          <>
            <View style={commonStyle.userChatContainer}>
              <View style={commonStyle.userChatBox}>
                <Text style={commonStyle.userChatBoxText}>Confirmed</Text>
              </View>
            </View>
            <View style={commonStyle.serviceChatContainer}>
              <View style={commonStyle.serviceChatBox}>
                <Text style={commonStyle.serviceChatBoxTitle}>Select a staking method</Text>
                <Text style={commonStyle.serviceChatBoxDesc}>
                  Auto-restake: Same as auto-compound. Direct-transfer: calculated as APR%.
                </Text>
                {status === 2 && (
                  <>
                    <Divider style={commonStyle.divider} color="rgba(65, 69, 151, 0.8)" />
                    <View style={commonStyle.buttonWrapper}>
                      <Pressable
                        style={commonStyle.buttonContainer}
                        onPress={() => {
                          setStatus(3);
                          setInterestType('Auto-restake');
                        }}
                        disabled={status !== 2}
                      >
                        <Text style={commonStyle.buttonText}>Auto-restake</Text>
                      </Pressable>
                      <Pressable
                        style={commonStyle.buttonContainer}
                        onPress={() => {
                          setStatus(3);
                          setInterestType('Direct-transfer');
                        }}
                        disabled={status !== 2}
                      >
                        <Text style={commonStyle.buttonText}>Direct-transfer</Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </View>
            </View>
          </>
        )}
        {status > 2 && (
          <>
            <View style={commonStyle.userChatContainer}>
              <View style={commonStyle.userChatBox}>
                <Text style={commonStyle.userChatBoxText}>{interestType}</Text>
              </View>
            </View>
            <View style={commonStyle.serviceChatContainer}>
              <View style={commonStyle.serviceChatBox}>
                <Text style={commonStyle.serviceChatBoxTitle}>Do you want to stake directly as curated?</Text>
                <Text style={commonStyle.serviceChatBoxDesc}>
                  Estimated staking APY is 86%, which is higher than average APY of all validators.
                </Text>
                <Divider style={commonStyle.divider} color="rgba(65, 69, 151, 0.8)" />
                <View style={commonStyle.buttonWrapper}>
                  {validatorList.map((el, i) => (
                    <Pressable
                      key={i}
                      style={styles.curatedButton}
                      onPress={() => {
                        setSelectedValidator(el);
                        setDetailModalVisible(true);
                      }}
                      disabled={status !== 3}
                    >
                      <Text style={commonStyle.buttonText}>{el.display_name}</Text>
                      <Image source={arrowRight} />
                    </Pressable>
                  ))}
                </View>
                <Slider
                  onEndReached={handleOnEndReached}
                  containerStyle={
                    isStakingConfirmed ? commonStyle.disabledSliderContainer : commonStyle.sliderContainer
                  }
                  sliderElement={
                    <View style={commonStyle.sliderBox}>
                      <Image source={arrowRight} />
                    </View>
                  }
                  disableSliding={isStakingConfirmed}
                >
                  <Text style={commonStyle.sliderInnerText}>
                    {isStakingConfirmed ? 'Confirmed' : 'Swipe to confirm the your filters'}
                  </Text>
                </Slider>
              </View>
            </View>
          </>
        )}
        {status > 3 && (
          <>
            <View style={commonStyle.userChatContainer}>
              <View style={commonStyle.userChatBox}>
                <Text style={commonStyle.userChatBoxText}>Confirmed</Text>
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

const styles = StyleSheet.create({
  curatedButton: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(108, 132, 255, 0.2)',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
});
