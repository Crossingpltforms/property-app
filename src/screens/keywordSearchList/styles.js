import { StyleSheet, Dimensions } from "react-native";
import { Matrics } from "../../common/styles";
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  header: {
    paddingTop: 30,
    backgroundColor: "#FFE100"
  },
  headerview: {
    flexDirection: "row",
    justifyContent: "center"
  },
  HeaderStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 5,
    shadowColor: "grey",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    height: 60,
    width: "100%",
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10
  },
  TextStyleScrollerHeader: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "left",
    paddingLeft: 10,
    paddingTop: 10
  },
  TextStyleScrollerDetail: {
    fontSize: 10,
    color: "#fff",
    textAlign: "left",
    paddingLeft: 10,
    paddingTop: 5
  },
  TextStyleHeaderTag: {
    fontSize: 16,
    fontFamily: "OpenSans-SemiBold",
    paddingBottom: 15,
    paddingLeft: 15,
    marginTop: 5,
    color: "#000"
  },
  styleTextFound: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10
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
  txtStyle: {
    fontSize: 14,
    textAlign: "left",
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    color: "#FFF",
    fontFamily: "OpenSans-Bold"
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
    paddingLeft: 3, // TODO which padding
    paddingRight: 3,
    color: "#000",
    width: 80,
    backgroundColor: "#FFE100",
    fontFamily: "OpenSans-Bold"
  },
  styleHeaderOption: {
    fontSize: 12,
    marginLeft: 5,
    textAlign: "left",
    color: "#000"
  },
  TextStyleHeaderFilter: {
    fontSize: 14,
    fontFamily: "OpenSans-SemiBold",
    paddingBottom: 10,
    color: "#000"
  },
  etStylePriceFilter: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 14,
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "grey"
  },
  textStyleHousingType: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 14,
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "grey"
  },
  HeaderStyle: { // TODO conflict
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "grey",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    width: "100%"
  },
  modal: {
    width: width * 0.7
  },
  text: {
    color: "#3f2949",
    marginTop: 10
  },
  listStyle: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    height: 35,
    alignItems: "center"
  },
  textStyle: {
    fontSize: 13,
    textAlign: "left",
    fontFamily: "OpenSans-Light",
    color: "#000"
  },
  typeDropDownRoot: {
    width: 120,
    height: 80,
    backgroundColor: "white",
    position: "absolute",
    top: 60,
    zIndex: 5,
    left: 16,
    borderColor: "grey",
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  typeDropDownViews: {
    width: "100%",
    height: 39.5,
    borderBottomColor: "grey",
    borderBottomWidth: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around"
  },
  buttonContainer: {
    flexDirection: "row"
  },
  text: { // TODO conflict
    paddingHorizontal: 5
  },
  container: {
    flex: 1,
    zIndex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center"
  },
  dragHandler: {
    alignSelf: "stretch",
    height: 60,
    justifyContent: "center",
    backgroundColor: "#FFF"
  },
  formInputGroupRoot: {
    width: Matrics.screenWidth - 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.012
  },
  picker: {
    borderColor: "#3F3F3F",
    borderWidth: 0.8,
    borderRadius: 5,
    width: 80,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 5
  },
  bottomBarView: {
    flex: 1,
    position: "absolute",
    width: width,
    backgroundColor: "white",
    bottom: 0
  },
  separatorLineStyle: {
    backgroundColor: "grey",
    height: 0.5,
    width: width,
    justifyContent: "flex-start"
  },
  similarTaskText: {
    fontSize: 16,
    color: "#77A6F2",
    fontFamily: "OpenSans-SemiBold",
    textAlign: "center"
  },
  smallSimilarText: {
    fontSize: 12,
    color: "#000",
    fontFamily: "OpenSans-Regular",
    textAlign: "center"
  },
  similarPropertyView: {
    marginTop: 20
  },
  similarImage: {
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  similarTitleView: {
    alignItems: "flex-start",
    paddingHorizontal: 15
  },
  similarListingTitle: {
    fontSize: 18,
    color: "#000",
    fontFamily: "OpenSans-SemiBold"
  }
});
