import { StyleSheet, Dimensions } from 'react-native'
import { Matrics, Color, Fonts } from '../../../common/styles'

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
  safeView: {
    flex: 1
  },
  giftedChatOverlay: {
    // ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    height: '100%'
  },
  appointMentContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
    maxHeight: Matrics.ScaleValue(80),
    backgroundColor: '#F5F8FA',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    paddingVertical: Matrics.ScaleValue(10)
  },
  propertyContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  propertyImageContainer: {
    height: 60,
    width: 80
  },
  propertyImg: {
    height: '100%',
    width: '100%',
    borderRadius: 10
  },
  propertyTextContainer: {
    flex: 1,
    marginLeft: 10
  },
  viewingText: {
    color: '#90278e',
    fontWeight: 'bold',
    fontSize: 15
  },
  viewingTime: {
    color: '#000',
    fontSize: 15
  },
  rescheduleBtnContainer: {
    marginLeft: 20
  },
  rescheduleBtn: {
    borderColor: '#90278e',
    borderWidth: 2,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 4
  },
  rescheduleBtnText: {
    color: '#90278e'
  },
  htmlContainer: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  b: {
    fontWeight: 'bold'
  },
  u: {
    textDecorationLine: 'underline'
  },
  i: {
    fontStyle: 'italic'
  },
  'color:red': {
    color: 'red'
  },
  'color:blue': {
    color: '#4885ed'
  },
  'color:green': {
    color: '#3cb371'
  },
  'color:grey': {
    color: '#555d50'
  },
  'color:yellow': {
    color: '#eee600'
  },
  'color:orange': {
    color: '#ffa812'
  },
  'color:brown': {
    color: '#8b4513'
  },
  'color:purple': {
    color: '#bf94e4'
  },
  'b a': {
    fontWeight: 'bold'
  },
  textToStyle: {
    fontSize: Matrics.ScaleValue(11),
    textAlign: 'left',
    fontFamily: 'OpenSans-Regular',
    color: '#000'
  },
  headerContainerStyle: {
    backgroundColor: '#FFE100',
    width: '100%',
    padding: 10,
    justifyContent: 'center',
    shadowColor: 'black',
    // marginBottom: 5,
    shadowOpacity: 0.2,
    elevation: 6,
    shadowOffset: { width: 0, height: 2 },
    flexDirection: 'row',
    alignItems: 'center',
    height: Matrics.ScaleValue(60)
  },
  headerViewInnerContainerStyle: {
    flex: 1,
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButtonViewStyle: {
    alignItems: 'center',
    paddingRight: 10
  },
  headerTitleButtonStyle: {
    flex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitleViewStyle: {
    flex: 4,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    minHeight: 40
  },
  headerTitleTextStyle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 17,
    color: '#000',
    // paddingLeft: 10,
    textTransform: 'capitalize',
    lineHeight: 20
  },
  typingNameTextStyle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    color: '#333',
    paddingLeft: 10,
    fontStyle: 'italic'
  },
  headerSubTitleTextStyle: {
    fontFamily: 'OpenSans-SemiBold',
    fontWeight: 'bold',
    fontSize: 10,
    color: '#333',
    paddingRight: 3,
    lineHeight: 15
  },
  headerInfoImageViewStyle: {
    alignItems: 'center',
    paddingLeft: 10
  },
  headerInfoImageStyle: { height: 25, width: 25, marginLeft: 15 },
  aliciaAvatarImageStyle: {
    height: 36,
    width: 36,
    borderRadius: 36 / 2
  },
  imageLeftStyle: {
    marginRight: -7,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2
  },
  imageRightStyle: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2
  },
  avatarPrivateTextStyle: {
    color: '#000',
    fontSize: Matrics.ScaleValue(10),
    fontWeight: '400',
    textAlign: 'right'
  },
  bubbleTextStyle: {
    fontSize: 15,
    fontFamily: 'OpenSans-Regular'
  },
  bubbleWrapperStyle: { borderWidth: 1, borderColor: '#ddd' },
  avatarTextStyle: {
    color: '#999',
    marginLeft: 5,
    fontWeight: 'bold'
  },
  sendButtonViewStyle: { marginRight: 10, marginBottom: 10 },
  sendButtonImageStyle: { width: 25, height: 25 },
  privateChatViewStyle: {
    flex: 1,
    flexDirection: 'row',
    height: Matrics.ScaleValue(40),
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  PrivateChatButtonStyle: {
    flexDirection: 'row',
    width: Matrics.ScaleValue(100),
    height: Matrics.ScaleValue(30),
    borderWidth: 1,
    borderColor: Color.lightGray,
    borderRadius: Matrics.ScaleValue(3),
    marginLeft: Matrics.ScaleValue(5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Matrics.ScaleValue(5)
  },
  privateChatDropdownScrollViewStyle: {
    width: Matrics.ScaleValue(100),
    height: Matrics.ScaleValue(60),
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 1,
    borderWidth: 1,
    borderColor: Color.textGray,
    bottom: Matrics.ScaleValue(78),
    marginLeft: Matrics.ScaleValue(58),
    borderTopLeftRadius: Matrics.ScaleValue(3),
    borderTopRightRadius: Matrics.ScaleValue(3)
  },
  privateChatDropdownTextStyle: {
    paddingLeft: Matrics.ScaleValue(5),
    paddingVertical: Matrics.ScaleValue(5)
  },
  systemMessageContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 5,
    marginBottom: 10
  },
  systemMessageInnerContainerStyle: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20
  },
  systemMessageTextStyle: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#333',
    textAlign: 'center',
    fontWeight: '300'
  },
  mainViewContainer: {
    flex: 1,
    // height: HEIGHT - 50,
    backgroundColor: '#fff'
    // position: 'relative'
  },
  loaderViewContainer: {
    height: HEIGHT,
    width: WIDTH,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imagePickStyle: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginLeft: 5
  },
  noMessageTextStyle: {
    position: 'absolute',
    color: '#333',
    bottom: '50%',
    left: '35%'
  },
  indicatorViewStyle: {
    position: 'absolute',
    height: HEIGHT,
    width: WIDTH,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  replyIconViewContainerStyle: {
    width: Matrics.ScaleValue(20),
    height: Matrics.ScaleValue(20)
  },
  replyButtonContainerStyle: {
    width: Matrics.ScaleValue(20),
    height: Matrics.ScaleValue(20),
    alignItems: 'center',
    justifyContent: 'center'
  },
  replyContainerViewStyle: {
    height: Matrics.ScaleValue(40),
    paddingVertical: Matrics.ScaleValue(5),
    paddingHorizontal: Matrics.ScaleValue(20),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  replyInnerViewStyle: { flex: 1, flexDirection: 'column' },
  replyCloseViewStyle: {
    width: Matrics.ScaleValue(20),
    height: Matrics.ScaleValue(20),
    justifyContent: 'center',
    alignItems: 'center'
  },
  replyViewSeperatorLineStyle: {
    height: 0.5,
    width: '100%',
    backgroundColor: Color.darkGray
  },
  replyMessageContainerStyle: {
    // flex: 1,
    maxHeight: Matrics.ScaleValue(80),
    backgroundColor: '#f5f5f5',
    borderColor: Color.lightGray,
    borderWidth: 0.5,
    borderRadius: 15,
    padding: Matrics.ScaleValue(10),
    justifyContent: 'center',
    alignItems: 'center'
  },
  replyMessageTextStyle: {
    fontSize: Matrics.ScaleValue(12),
    textAlign: 'left',
    fontFamily: 'OpenSans-Regular',
    color: '#000'
  },
  replyNameTextStyle: {
    color: Color.textGray,
    fontSize: 12,
    fontWeight: '500'
  },
  replyNameOuterViewContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2
  },
  typeDropDownViews: {
    width: '100%',
    height: Matrics.ScaleValue(39.5),
    borderBottomColor: Color.lightGray,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Matrics.ScaleValue(5)
  },
  typeDropDownRoot: {
    width: Matrics.ScaleValue(150),
    height: Matrics.ScaleValue(160),
    backgroundColor: 'white',
    position: 'absolute',
    top: Matrics.ScaleValue(62),
    zIndex: 5,
    right: Matrics.ScaleValue(16),
    borderColor: 'grey',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  optionMenuText: {
    color: Color.black,
    fontSize: Matrics.ScaleValue(12),
    fontFamily: Fonts.type.OpenSans
  },
  highlightedOptionBtn: {
    // backgroundColor: Color.primary,
    borderBottomLeftRadius: Matrics.ScaleValue(6),
    borderBottomRightRadius: Matrics.ScaleValue(6)
  },
  RBSheetContainer: {
    flex: 1
  },
  RBSheetHeaderView: {
    width: '100%',
    padding: Matrics.ScaleValue(15),
    marginBottom: Matrics.ScaleValue(10),
    borderBottomColor: Color.lightGray,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  RBSheetHeaderText: {
    color: Color.black,
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSansBold,
    lineHeight: Matrics.ScaleValue(25)
  },
  RBSheetRowView: {
    marginHorizontal: Matrics.ScaleValue(15)
  },
  RBSheetRowText: {
    color: Color.black,
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSans,
    lineHeight: Matrics.ScaleValue(20)
  },
  RBSheetRowBtn: {
    paddingVertical: Matrics.ScaleValue(7)
  },
  unreadMsgBtn: {
    flexDirection: 'row',
    width: 200,
    height: 44,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Matrics.ScaleValue(5)
  },
  unreadCountText: {
    color: '#fff',
    paddingHorizontal: 5
  },
  unreadDes: {
    color: '#fff'
  },
  unreadContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  modalBtn: {
    paddingVertical: 10
  },
  modalBtnText: {
    fontSize: 16,
    color: '#444444'
  },
  modalCancelText: {
    fontSize: 16,
    color: '#4885ed',
    alignSelf: 'flex-end'
  },
  modalView: {
    backgroundColor: 'white',
    maxHeight: 300,
    width: '90%',
    height: '70%',
    alignSelf: 'center',
    padding: 20
  },
  modalTitleText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 30,
    marginBottom: 20
  }
})

export default styles
