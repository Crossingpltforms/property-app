import {StyleSheet} from 'react-native';
import {Matrics} from '../common/styles';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: Matrics.ScaleValue(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    // width: width * Matrics.ScaleValue(0.92),
    marginVertical: Matrics.ScaleValue(10),
    borderRadius: Matrics.ScaleValue(5),
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 6,
    shadowOffset: {width: 0, height: 3},
    marginLeft: Matrics.ScaleValue(15),
    marginRight: Matrics.ScaleValue(15),
  },

  styleEdittext: {
    height: Matrics.ScaleValue(40),
    fontSize: Matrics.ScaleValue(12),
    marginRight: Matrics.ScaleValue(20),
    marginLeft: Matrics.ScaleValue(10),
    color: 'black',
  },

  textStyle: {
    marginVertical: Matrics.ScaleValue(10),
    fontSize: Matrics.ScaleValue(16),
    color: '#ffffff',
  },
  TextStyleHeaderTag: {
    fontSize: Matrics.ScaleValue(12),
    fontFamily: 'OpenSans-Bold',
    color: '#000',
  },
});
