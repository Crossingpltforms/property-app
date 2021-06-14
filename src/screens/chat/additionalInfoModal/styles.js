import { Dimensions } from 'react-native';
import { Matrics } from "../../../common/styles";

const { height } = Dimensions.get('window');

export default {
  mainContainer: {
    width: '90%',
    height: height,
    alignItems: 'center',
    alignContent: 'center'
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: height,
  },
  closeHeader: {
    height: Matrics.ScaleValue(50),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerText: {
    width: '90%',
    alignContent: 'center',
    color: 'black',
    fontFamily: "OpenSans-SemiBold",
    fontSize: Matrics.ScaleValue(17),
    marginHorizontal: Matrics.ScaleValue(25),
    textAlign: 'center'
  },
  modalImageView: {
    width: Matrics.ScaleValue(160),
    height: Matrics.ScaleValue(160),
  },
  selectDateTextStyle: {
    fontFamily: "OpenSans-Light",
    fontSize: Matrics.ScaleValue(12),
  },
  selectedTextStyle: {
    fontFamily: "OpenSans-Regular",
    fontSize: Matrics.ScaleValue(16),
    color: 'black'
  },
  selectedButtonStyle: {
    height: Matrics.ScaleValue(40),
    backgroundColor: 'black',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Matrics.ScaleValue(15),
  },
  selectedButtonTextStyle: {
    fontFamily: "OpenSans-Regular",
    fontSize: Matrics.ScaleValue(15),
    color: 'white',
    fontWeight: '500'
  },
  unSelectedTextStyle: {
    fontFamily: "OpenSans-Regular",
    fontSize: Matrics.ScaleValue(15),
    color: 'gray',
    paddingLeft: Matrics.ScaleValue(10),
    flex: 1
  },
  dropDownContainerStyle: {
    flexDirection: 'row',
    marginBottom: Matrics.ScaleValue(10),
    alignItems: 'center',
    justifyContent: 'center'
  },
  dropDownViewStyle: {
    flexDirection: 'row',
    height: Matrics.ScaleValue(40),
    width: '73%',
    marginLeft: Matrics.ScaleValue(15),
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: Matrics.ScaleValue(10)
  },
  dropDownTextStyle: {
    flex: 1
  },
  LoaderContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1
  },
  LoaderWrapper: {
    width: "25%",
    height: "18%",
    backgroundColor: "#FFE100",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: Matrics.ScaleValue(10)
  },
  LoaderText: {
    color: "black",
    textAlign: "center"
  },
  bytapText: {
    fontSize: 15,
    textAlign: 'left',
    fontFamily: "OpenSans-SemiBold",
    color: '#000'
  },
  bottomButton: {
    marginTop: 35,
    marginLeft: '10%',
    width: '90%'
  },
  styleViewShadow: {
    justifyContent: "center",
    backgroundColor: "#FFE100",
    height: Matrics.ScaleValue(35),
    width: "90%",
    borderRadius: 5,
  },
};