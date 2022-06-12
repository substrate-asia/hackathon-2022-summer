import { StyleSheet } from 'react-native';

export const commonStyle = StyleSheet.create({
  serviceChatContainer: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  userChatContainer: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  serviceChatBox: {
    backgroundColor: 'rgba(52, 55, 129, 0.63)',
    borderRadius: 10,
    maxWidth: '60%',
    padding: 20,
  },
  serviceChatBoxTitle: {
    color: 'white',
    fontSize: 11,
    marginBottom: 8,
  },
  serviceChatBoxDesc: {
    color: '#A8A8A8',
    fontSize: 10,
    marginBottom: 12,
  },
  userChatBox: {
    backgroundColor: 'rgba(217, 218, 234, 0.76)',
    borderRadius: 10,
    maxWidth: '60%',
    padding: 13,
  },
  userChatBoxText: {
    color: 'black',
    fontSize: 12,
    lineHeight: 20,
  },
  textInput: {
    flex: 1,
    color: '#A8A8A8',
  },
  confirm: {
    color: '#6C84FF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 20,
  },
});
