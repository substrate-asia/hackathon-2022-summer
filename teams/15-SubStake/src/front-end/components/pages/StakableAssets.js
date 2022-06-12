import { View, Text, StyleSheet } from 'react-native';
import { Nunito600 } from '../constant';
import Layout from '../Layout';
import TopBar from '../TopBar/TopBar';
import StakableList from '../StakableAssets/StakableList';

export default function StakableAssets({ navigation }) {
  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.header}>
          <TopBar path="Home" navigation={navigation} />
          <Text style={styles.headerText}>Stakable Assets</Text>
          <Text style={styles.content}>보유중인 스테이킹 가능한 자산에 해당하는 네트워크 리스트입니다.</Text>
        </View>
        <StakableList navigation={navigation} />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexShrink: 1,
    marginBottom: 40,
  },
  headerText: {
    color: 'white',
    fontFamily: Nunito600,
    fontSize: 20,
    marginBottom: 5,
  },
  content: {
    color: '#A8A8A8',
    fontSize: 11,
  },
});
