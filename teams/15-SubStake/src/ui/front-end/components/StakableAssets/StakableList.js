import { View, StyleSheet } from 'react-native';
import westend from '../../assets/westend.png';
import moonbase from '../../assets/moonbase.png';
import StakableItem from './StakableItem';
import { useEffect, useState } from 'react';
import StakableModal from './Modals';
import { useUserBalance } from '../../query';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { formatBalanceToString } from '../utils';
import { useQueryClient } from 'react-query';
import { useAsyncStorage } from '../Context/AsyncStorage';

const westendDetailContent = [
  {
    header: 'Nominator: Stake directly to ~16 validators as an individual.',
    main: 'Only the Top 22,500 nominators are eligible for the staking reward.',
  },
  {
    header: 'Nomination Pool: The pool owner acts as an fund-manager.',
    main: 'Usually users with less than a Minimum Stake choose the option.',
  },
  {
    header: 'Validator: Provide network maintenance and validation service.',
    main: 'If ones are in either Active or Waiting list, user may choose this option.',
  },
];

const westendButtonContent = [
  { desc: 'Nominator', path: 'WestendNominator' },
  { desc: 'Nomination Pool', path: 'WestendNominationPool' },
  // { desc: 'Validator', path: 'WestendValidator' },
];

const westendTitleContent = {
  header: 'Welcome to Westend',
  main: 'Westend is the testnet relaychain of Polkadot',
};

// const moonbaseDetailContent = [
//   {
//     header: 'Delegator: Stake to curated collator nodes as a voter.',
//     main: 'TOP 300 delegators on a collator are eligible for the staking reward.',
//   },
//   {
//     header: 'Collator: Mainly collect parachain TXs and report to relaychain.',
//     main: 'If ones are in either Active or Waiting list, users may choose this option.',
//   },
// ];

// const moonbaseButtonContent = [
//   { desc: 'Delagator', path: 'MoonbaseDelegator' },
//   { desc: 'Collator', path: 'MoonbaseCollator' },
// ];

// const moonbaseTitleContent = {
//   header: 'Welcome to Moonbase Alpha.',
//   main: 'Moonbase is the testnet parachain of Moonbeam Network.',
// };

export default function StakableList({ navigation, route }) {
  const [westendModalVisible, setWestendModalVislble] = useState(false);
  const [moonbaseModalVisible, setMoonbaseModalVislble] = useState(false);
  const { data, isSuccess } = useUserBalance();
  const { currentIndex } = useAsyncStorage();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries(['userBalance', currentIndex]);
  }, [route]);

  const lists = [
    {
      img: westend,
      network: 'Westend',
      balance: data?.westendBalance?.transferrableBalance
        ? formatBalanceToString(data?.westendBalance?.transferrableBalance)
        : 0,
      symbol: 'WND',
      setModalVisible: setWestendModalVislble,
    },
    // {
    //   img: moonbase,
    //   network: 'Moonbase Alpha',
    //   balance: isSuccess ? data.moonbeamBalance : 0,
    //   symbol: 'DEV',
    //   setModalVisible: setMoonbaseModalVislble,
    // },
  ];

  return (
    <View style={styles.container}>
      <StakableModal
        isVisible={westendModalVisible}
        setModalVisible={setWestendModalVislble}
        navigation={navigation}
        titleContent={westendTitleContent}
        detailContent={westendDetailContent}
        buttonContent={westendButtonContent}
        icon={westend}
      />
      {/* <StakableModal
        isVisible={moonbaseModalVisible}
        setModalVisible={setMoonbaseModalVislble}
        navigation={navigation}
        titleContent={moonbaseTitleContent}
        detailContent={moonbaseDetailContent}
        buttonContent={moonbaseButtonContent}
        icon={moonbase}
      /> */}
      {lists.map((el, i) => (
        <StakableItem key={i} index={i + 1} {...el} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(36, 50, 100, 0.3)',
    shadowColor: '3px 5px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 20,
  },
});
