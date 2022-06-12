import { Text, View } from 'react-native';
import Layout from '../../Layout';
import TopBar from '../../TopBar/TopBar';

export default function WestendNominationPool({ navigation }) {
  return (
    <Layout>
      <TopBar title="Nomination Pool" path="StakableAssets" navigation={navigation} />
      <View>
        <Text>WestendNominationPool</Text>
      </View>
    </Layout>
  );
}
