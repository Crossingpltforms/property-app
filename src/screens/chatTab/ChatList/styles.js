import {StyleSheet, Dimensions} from 'react-native';

const width = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  usersProfile: {
    height: 80,
    backgroundColor: '#D3D3D3',
    flexDirection: 'row',
    padding: 5,
  },
  userAvatar: {
    justifyContent: 'center',
    flex: 1,
  },
  infoContainer: {
    justifyContent: 'center',
    flex: 4.6,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  userEmail: {},
  listBoxContainer: {
    width: width,
    flexDirection: 'row',
    marginBottom: 0,
    minHeight: 100,
    maxHeight: 200,
    paddingRight: 10,
    paddingLeft: 10,
  },
  profileImageContainer: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
  },
  messageContainer: {
    flex: 4,
    padding: 5,
    justifyContent: 'center',
  },
  groupName: {
    fontSize: 16,
    color: 'black',
  },
  text: {
    fontSize: 14,
    color: 'gray',
  },
  timeContainer: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 11,
    color: 'gray',
  },
});

export default styles;
