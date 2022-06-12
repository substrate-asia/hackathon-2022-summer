import { Text, View } from 'react-native';
import Layout from '../../Layout';
import TopBar from '../../TopBar/TopBar';

export default function WestendNominator({ navigation }) {
  return (
    <Layout>
      <TopBar title="Nominator" path="StakableAssets" navigation={navigation} />
      <View>
        <Text>WestendNominator</Text>
      </View>
    </Layout>
  );
}
