import Layout from '../components/Layout';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@rneui/base';

export default function Welcome({ navigation }) {
  return (
    <Layout>
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>Welcome</Text>
        <Button
          title="시작하기"
          titleStyle={{ paddingVertical: 10, borderRadius: 10 }}
          containerStyle={{ alignSelf: 'stretch' }}
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
