import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default {
  root: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  titleOne: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    marginTop: height * 0.02
  },
  titleTwo: {
    fontSize: 10,
    fontWeight: "normal",
    color: "black",
    marginTop: height * 0.04
  },
  textInputDesign: {
    marginTop: height * 0.015,
    width: width * 0.9,
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15,
    borderRadius: 6,
    color: "black"
  },
  map: {
    height: 200,
    width: width * 0.9,
    borderColor: "black",
    borderWidth: 1,
    marginTop: 20
  },
  button2: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE100",
    height: 40,
    width: width * 0.9,
    borderRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.12,
    elevation: 6,
    shadowOffset: { width: 5, height: 5 },
    marginTop: height * 0.04,
    marginBottom: height * 0.03
  },
  uplaodPhotoLoaderContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1
  },
  uplaodPhotoLoaderWrapper: {
    width: "40%",
    height: "15%",
    backgroundColor: "#FFE100",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: 10
  },
  uplaodPhotoLoaderText: {
    color: "black",
    textAlign: "center"
  }
};
