import { Text, View } from 'react-native';
import Layout from '../../Layout';
import TopBar from '../../TopBar/TopBar';

export default function MoonbaseDelegator({ navigation }) {
  return (
    <Layout>
      <TopBar title="Delegator" path="StakableAssets" navigation={navigation} />
      <View>
        <Text>MoonbaseDelegator</Text>
      </View>
    </Layout>
  );
}
