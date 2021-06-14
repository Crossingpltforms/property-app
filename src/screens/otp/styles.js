import { Matrics, Fonts, Color } from '../../common/styles'

export default styles = {
  resendOtpView: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 30
  },
  header: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  headerview: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingLeft: 20
  },
  styleOTPBox: {
    height: '100%',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 28,
    textAlign: 'center'
  },
  bottomButton: {
    marginTop: 70,
    marginRight: Matrics.ScaleValue(20),
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  styleViewShadow: {
    justifyContent: 'center',
    backgroundColor: '#EBEEF5',
    height: Matrics.ScaleValue(35),
    width: '30%',
    borderRadius: 5
  },
  resendText: {
    fontSize: Matrics.ScaleValue(13),
    fontFamily: Fonts.type.OpenSansBold,
    color: '#4885ED',
    textAlign: 'center',
    fontStyle: 'normal'
  },
  viewArrow: { justifyContent: 'center', paddingLeft: 10 },
  iconDropRight: { color: '#4885ED', fontSize: 20 },
  verifyOtpText: {
    fontSize: Matrics.ScaleValue(20),
    fontFamily: Fonts.type.OpenSansBold,
    textAlign: 'center',
    color: Color.black
  },
  mainViewOTP: { flexDirection: 'row', justifyContent: 'center' },
  displayTimerView: { flexDirection: 'row', justifyContent: 'center' },
  textTitle: {
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSans,
    textAlign: 'center',
    fontStyle: 'italic',
    color: Color.black
  },
  numberText: {
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSans,
    paddingTop: Matrics.ScaleValue(5),
    textAlign: 'center',
    fontStyle: 'italic',
    color: Color.black
  },
  viewChangeNo: { flexDirection: 'row', justifyContent: 'center' },
  viewTouch: { justifyContent: 'center', paddingTop: 5 },
  changePhoneNoText: {
    fontSize: Matrics.ScaleValue(13),
    fontFamily: Fonts.type.OpenSansBold,
    color: '#4885ED',
    textAlign: 'center'
  },
  viewArrowIcon: {
    justifyContent: 'center',
    paddingTop: 5,
    paddingLeft: Matrics.ScaleValue(10)
  },
  iconMd: { color: '#4885ED', fontSize: Matrics.ScaleValue(20) },
  viewKeyboard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Matrics.ScaleValue(20),
    paddingTop: Matrics.ScaleValue(40)
  },
  insideKeyboard: {
    justifyContent: 'center',
    paddingTop: Matrics.ScaleValue(10),
    width: '80%'
  },
  viewTextInput: {
    backgroundColor: '#E5E5E5',
    height: Matrics.ScaleValue(60),
    width: '100%',
    justifyContent: 'space-around',
    borderRadius: Matrics.ScaleValue(5)
  },
  viewMainTextInput: {
    justifyContent: 'center',
    paddingTop: Matrics.ScaleValue(10),
    width: '15%'
  },
  insideTextInputView: {
    backgroundColor: '#E5E5E5',
    height: 65,
    width: '100%',
    justifyContent: 'space-around',
    borderRadius: 5
  },
  viewTouchBTM: {
    justifyContent: 'center',
    backgroundColor: '#FFE100',
    height: Matrics.ScaleValue(42),
    width: '75%',
    borderRadius: 5,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 }
  },
  textNext: {
    fontFamily: Fonts.type.OpenSansBold,
    fontSize: Matrics.ScaleValue(15),
    textAlign: 'center',
    color: Color.black
  },

  textInputContainer: {
    width: '70%',
    height: Matrics.ScaleValue(40),
    marginTop: 2
  },
  roundedTextInput: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E7EAF2',
    color: '#000'
  },
  bytapText: {
    fontSize: Matrics.ScaleValue(11),
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    color: '#000'
  },

  borderStyleHighLighted: {
    borderColor: '#03DAC6'
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6'
  }
}
module.exports = styles
