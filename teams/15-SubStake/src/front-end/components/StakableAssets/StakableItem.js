import { View, StyleSheet, Text, Image, Pressable } from 'react-native';
import arrow from '../../assets/arrowRight.png';

export default function StakableItem({ index, img, network, stakeAmount, symbol, setModalVisible }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={{ justifyContent: 'center', marginRight: 15 }}>
          <Text style={{ color: 'white' }}>{index}</Text>
        </View>
        <Image source={img} style={{ marginRight: 15, width: 36, height: 36 }} />
        <View style={{ marginRight: 15 }}>
          <Text style={styles.network}>{network}</Text>
          <Text style={styles.stakeAmount}>
            You have {stakeAmount} {symbol}
          </Text>
        </View>
      </View>
      <Pressable style={{ padding: 10 }} onPress={() => setModalVisible(true)}>
        <Image source={arrow} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  network: {
    color: 'white',
    fontSize: 14,
  },
  stakeAmount: {
    color: '#A8A8A8',
    fontSize: 9,
  },
});
