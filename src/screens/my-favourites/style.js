import { Dimensions } from 'react-native'
import { Matrics, Fonts, Color } from '../../common/styles'
const { width, height } = Dimensions.get('window')

export default {
  root: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  favBtnContainer: {
    position: 'relative',
    backgroundColor: 'red'
  },
  expiredWraper: {
    position: 'absolute',
    top: 10,
    right: -1,
    width: '40%',
    height: 30,
    backgroundColor: '#fff',
    // opacity: 0.7,
    zIndex: 1,
    borderRadius: 5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: 'black',
    shadowOpacity: 0.12,
    elevation: 6,
    shadowOffset: { width: 5, height: 5 },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  expiredText: {
    color: '#DE0F2E',
    // fontStyle: 'italic',
    fontSize: 20,
    fontWeight: 'bold'
  },
  styleItem: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.12,
    elevation: 6,
    marginBottom: 10,
    shadowOffset: { width: 5, height: 5 }
  },
  styleInfo: {
    flexDirection: 'column',
    borderRadius: 5,
    borderColor: 'black',
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  imagebg1: {
    width: Matrics.screenWidth,
    height: Matrics.ScaleValue(165),
    marginHorizontal: Matrics.ScaleValue(-10),
    marginTop: Matrics.ScaleValue(-10)
  },
  imageBGView: {
    overflow: 'hidden',
    width: Matrics.screenWidth - 10,
    borderTopLeftRadius: Matrics.ScaleValue(3),
    borderTopRightRadius: Matrics.ScaleValue(3)
    //borderWidth: 1
  },
  text1: {
    color: Color.black,
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSansBold
  },
  iconStyle: {
    width: 15,
    height: 18,
    marginRight: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    tintColor: '#000'
  },
  category_View: {
    paddingVertical: 5,
    width,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  txtKmStyle: {
    textAlign: 'center',
    fontSize: 14,
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 3,
    paddingRight: 3,
    color: '#000',
    width: 80,
    backgroundColor: '#FFE100',
    fontFamily: 'OpenSans-Bold'
  }
}
