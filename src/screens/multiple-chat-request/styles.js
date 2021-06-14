import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
import { Matrics } from "../../common/styles";
export default {
  root: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFF"
  },

  imgStyle: {
    marginTop: 10,
    height: 200,
    width: width
  },
  headerText: {
    width: '90%',
    alignContent: 'center',
    color: 'black',
    fontFamily: "OpenSans-SemiBold",
    fontSize: Matrics.ScaleValue(15),
    marginHorizontal: Matrics.ScaleValue(25),
    marginTop: Matrics.ScaleValue(10),
    textAlign: 'center'
  },
  modalImageView: {
    width: Matrics.ScaleValue(100),
    height: Matrics.ScaleValue(100),
  },

  noCommisionWrapperStyle: {
    marginTop: 20,
    width: width - 50,
    height: 100,
    backgroundColor: '#d4e3fc',
    borderWidth: 3,
    borderColor: '#006ce8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCommisionBoldTextStyle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '900',
    color: '#006ce8'
  },
  noCommisionNormalTextStyle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Light',
    fontWeight: '600',
    color: '#006ce8'
  },

  imgBannerStyle: {
    marginTop: 20,
    width: width,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingBottom: 30,
    paddingLeft: width / 2 - 150,
    height: 200,
  },

  imgTextHead: {
    color: "black",
    fontSize: 10,
    fontWeight: "600"
  },
  imgTextBody: {
    color: "black",
    fontSize: 15,
    fontWeight: "600"
  },

  imgTextTiny: {
    color: "black",
    fontSize: 10,
    fontWeight: "normal"
  },
  labelTop: {
    width: width * 0.9,
    height: 44,
    backgroundColor: "#E4E4E4",
    marginTop: (height * 2) / 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7
  },

  labTopText: {
    fontSize: 15,
    fontWeight: "200",

    color: "#090909"
  },
  furnishingLabel: {
    marginLeft: width * 0.075,
    color: "black",
    marginTop: height * 0.025,
    alignSelf: "flex-start",
    fontWeight: "bold"
  },

  furnishingView: {
    width: width,
    flexDirection: "column",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: (height * 1.5) / 100
  },
  furnishingViewList: {
    width: width * 0.9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: (height * 1.2) / 100
  },
  PropertyInfoViewTab: {
    width: width * 0.85,
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center"
  },
  furnishingViewTab: {
    width: (width * 36) / 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  furnishingViewTabLabel: {
    fontSize: 15,
    color: "black"
  },
  PropertyInfoViewTabLabel: {
    fontSize: 15,
    fontFamily: "OpenSans-Light",
    marginLeft: 10,
    color: "black"
  },
  descriptInput: {
    width: width * 0.9,
    height: 187,
    borderColor: "#B1B1B1",
    borderWidth: 1,
    borderRadius: 2,
    marginTop: (height * 1.8) / 100
  },
  form: {
    width: width * 0.9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: (height * 1.8) / 100
  },
  formLabel: {
    color: "black",
    fontWeight: "bold"
  },
  formInput: {
    width: 122,
    height: 25.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center"
  },
  formBack: {
    height: 38,
    borderColor: "black",
    borderRadius: 7,
    borderWidth: 1,
    width: 56.81,
    justifyContent: "center",
    alignItems: "center"
  },
  nextButton: {
    height: 38.16,
    borderColor: "#FFDF00",
    borderRadius: 2,
    borderWidth: 1,
    backgroundColor: "#FFDF00",
    alignItems: "center",
    width: width * 0.65,
    justifyContent: "center",
    shadowColor: "black",
    shadowOpacity: 0.12,
    elevation: 6,
    shadowOffset: { width: 5, height: 5 }
  },
  nextButtonText: {
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
    color: "#000"
  },
  checkboxSelected: {
    borderRadius: 50,
    backgroundColor: "#00D598",
    borderColor: "#00D598"
  },
  checkboxUnSelected: {
    borderRadius: 50,
    backgroundColor: "#E4E4E4",
    borderColor: "#E4E4E4"
  },
  bottomButton: {
    marginTop: 5,
    width: width,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  styleViewShadow: {
    justifyContent: "center",
    backgroundColor: "#FFE100",
    height: 42,
    width: "80%",
    borderRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 }
  },
  styleReportView: {
    justifyContent: "center",
    height: 42,
    width: "80%",
  },
  styleTextFound: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  },
  styleItem: {
    marginTop: 20,
    flexDirection: "column",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.12,
    elevation: 6,
    shadowOffset: { width: 5, height: 5 }
  },
  txtKmStyle: {
    textAlign: "center",
    fontSize: 14,
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 3, // TODO which padding?
    paddingRight: 3,
    color: "#000",
    width: 80,
    backgroundColor: "#FFE100",
    fontFamily: "OpenSans-Bold"
  },
  styleInfo: {
    flexDirection: "column",
    borderRadius: 5,
    borderColor: "black",
    height: 100,
    width: "100%",
    position: "absolute",
    bottom: 0
  },
  titleStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  styleReport: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: 10,
    backgroundColor: '#FFE100',
    alignItems: 'center',
    justifyContent: 'center',
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
};
