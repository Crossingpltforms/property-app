import {Dimensions} from 'react-native';
import {Matrics} from '../common/styles';

const {width} = Dimensions.get('window');

export default {
  header: {
    height: Matrics.ScaleValue(60),
    width: width,
    backgroundColor: '#FFDF00',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: (width * 5) / 100,
    shadowOpacity: 0.2,
    elevation: 6,
    shadowOffset: {width: 0, height: 2},
    top: -5,
  },
  headerLeftArrow: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'normal',
  },
  headerTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 17,
    color: '#000',
    paddingLeft: 10,
  },
  myRefreesViewContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: Matrics.ScaleValue(10),
  },
  myRefreesButtonContainer: {
    width: Matrics.ScaleValue(100),
    height: Matrics.ScaleValue(35),
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myRefreeButtonTextStyle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: Matrics.ScaleValue(12),
  },
};
