import { Dimensions, StyleSheet } from 'react-native'
import { Matrics, Fonts, Color } from '../../common/styles'
const { width, height } = Dimensions.get('window')

export default {
  root: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  body: {
    width: (width * 90) / 100,
    marginBottom: height * 0.1,
  },
  profileImg: {
    marginTop: (height * 2) / 100,
    height: 116,
    width: 116,
    borderRadius: 58,
    backgroundColor: '#cccccc',
  },
  TextStyleHeaderTag: {
    fontSize: Matrics.ScaleValue(20),
    fontFamily: 'OpenSans-Regular',
    color: '#000',
  },
  bytapText: {
    fontSize: 15,
    textAlign: 'left',
    fontFamily: 'OpenSans-Regular',
    color: '#000',
  },
  title: {
    color: 'black',
    marginTop: height * 0.02,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 15,
  },
  inputStyle: {
    marginTop: (height * 2) / 100,
    borderRadius: 6,
    backgroundColor: '#e5e5e5',
    width: '100%',
    height: 40,
    fontSize: 15,
    fontWeight: 'normal',
    color: 'black',
    paddingLeft: width * 0.02,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE100',
    height: 42,
    width: '100%',
    borderRadius: 5,
    shadowColor: 'black',
    shadowOpacity: 0.12,
    elevation: 6,
    shadowOffset: { width: 5, height: 5 },
    marginTop: height * 0.1,
    marginBottom: height * 0.03,
  },
  alert: {
    fontSize: 10,
    color: '#FF0000',
    fontWeight: 'normal',
    marginTop: 1,
    alignSelf: 'flex-start',
  },
  textStyle: {
    margin: 24,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pickerStyle: {
    height: 150,
    width: '80%',
    color: '#344953',
    justifyContent: 'center',
  },
  dropdownStyle: {
    marginTop: (height * 2) / 100,
    borderRadius: 6,
    borderColor: 'black',
    borderWidth: 1,
    width: '100%',
    height: 40,
    fontWeight: 'normal',
    color: 'black',
    paddingLeft: width * 0.02,
    paddingRight: width * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemStyle: {
    width: '100%',
    height: 40,
    fontWeight: 'normal',
    color: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text1: {
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSansBold,
    color: Color.black,
  },
  picker: {
    borderColor: '#3F3F3F',
    borderWidth: 0.8,
    borderRadius: 5,
    width: width * 0.4,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: height * 0.015,
    paddingLeft: 5,
    paddingRight: 5,
  },
  dropdownText: {
    fontSize: 15,
    color: 'black',
    marginLeft: 10,
  },
  userTypeStyle: {
    marginTop: (height * 2) / 100,
    width: '100%',
    height: 40,
    // paddingLeft: width * 0.02
  },
  textStyleHousingType: {
    padding: width * 0.02,
    fontSize: 14,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'grey',
  },
  zeroDepContainer: {
    borderRadius: 20,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: Color.bgColor,
    shadowColor: Color.greyishBrown30,
    shadowOpacity: 0.52,
    elevation: 6,
    shadowOffset: { width: 3, height: 3 },
    justifyContent: 'center',
  },
  zeroDepMainCont: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: Matrics.ScaleValue(35),
  },
  zeroEligiText: {
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSansMedium,
    color: Color.black,
    marginLeft: 10,
  },
  checkNowText: {
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSansMedium,
    color: Color.blue,
    marginLeft: 15,
    textDecorationLine: 'underline',
  },
}
