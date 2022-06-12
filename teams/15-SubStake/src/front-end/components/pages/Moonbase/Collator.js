import { Text, View } from 'react-native';
import Layout from '../../Layout';
import TopBar from '../../TopBar/TopBar';

export default function MoonbaseCollator({ navigation }) {
  return (
    <Layout>
      <TopBar title="Collator" path="StakableAssets" navigation={navigation} />
      <View>
        <Text>MoonbaseCollator</Text>
      </View>
    </Layout>
  );
}
