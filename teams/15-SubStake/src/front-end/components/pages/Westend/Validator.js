import { Text, View } from 'react-native';
import Layout from '../../Layout';
import TopBar from '../../TopBar/TopBar';

export default function WestendValidator({ navigation }) {
  return (
    <Layout>
      <TopBar title="Validator" path="StakableAssets" navigation={navigation} />
      <View>
        <Text>WestendValidator</Text>
      </View>
    </Layout>
  );
}
