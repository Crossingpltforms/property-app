import { Matrics, Fonts, Color } from "../../../common/styles";

const layout1 = {
  justifyContent: "center",
  alignItems: "center"
};

const buttonStyle1 = bgcolor => ({
  width: Matrics.screenWidth / 3,
  height: Matrics.ScaleValue(40),
  borderRadius: 6,
  backgroundColor: bgcolor,
  ...layout1
});

export default {
  root: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFF"
  },
  view1: {
    borderColor: "#707070",
    borderWidth: 1,
    borderRadius: 6,
    borderStyle: "dashed",
    height: 182,
    width: Matrics.screenwidth * 0.9,
    marginTop: Matrics.screenHeight * 0.04,
    ...layout1
  },
  view2: {
    //height: 314,
    width: Matrics.screenWidth - 30,
    borderColor: "#707070",
    borderRadius: Matrics.ScaleValue(5),
    borderWidth: 1,
    marginTop: Matrics.screenHeight * 0.04,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: Color.black,
    shadowOpacity: 0.2,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    backgroundColor: "#FFFFFF"
  },
  view3: {
    width: "100%",
    height: 150,
    borderRadius: 6,
    zIndex: 1,
    backgroundColor: Color.white,
    marginBottom: 5,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-start",
    paddingLeft: Matrics.ScaleValue(10)
  },
  view4: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  view5: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginRight: 20
  },
  ml1: {
    marginLeft: 10
  },
  buttonGroup1: {
    width: Matrics.screenWidth - 55,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    //marginLeft: -12,
    marginTop: 10
  },
  button1: {
    width: Matrics.screenWidth / 2.5,
    height: Matrics.ScaleValue(45),
    ...layout1,
    borderRadius: 6,
    backgroundColor: "#FFE100"
  },
  button2: buttonStyle1("#FFE100"),
  button3: {
    ...buttonStyle1("#FFFFFF"),
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 6
  },
  text1: {
    color: Color.black,
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSansBold
  },
  text2: {
    color: Color.white,
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSansBold,
    marginLeft: Matrics.ScaleValue(15),
    marginBottom: Matrics.ScaleValue(10)
  },
  text3: {
    color: "#717171",
    fontSize: Matrics.ScaleValue(12),
    fontFamily: Fonts.type.OpenSans
  },
  textView1: {
    marginBottom: 18,
    paddingBottom: 2,
    width: Matrics.screenwidth * 0.9,
    backgroundColor: "rgba(0, 0, 0, 0.3)"
  },
  // imagebg1: {
  //   width: "100%",
  //   height: 180,
  //   marginTop: -4.8,
  //   zIndex: -1,
  //   flexDirection: "column",
  //   justifyContent: "flex-end",
  //   alignItems: "flex-start"
  // },
  imagebg1: {
    width: Matrics.screenWidth,
    height: Matrics.ScaleValue(165),
    marginHorizontal: Matrics.ScaleValue(-10),
    marginTop: Matrics.ScaleValue(-10)
  },
  image: {
    borderRadius: 10,
    width: Matrics.screenWidth * 0.95
  },
  imageBGView: {
    overflow: "hidden",
    width: Matrics.screenWidth - 32,
    borderTopLeftRadius: Matrics.ScaleValue(3),
    borderTopRightRadius: Matrics.ScaleValue(3)
    //borderWidth: 1
  },
  Menu:{
     height:35,
     width:27,
  },
  Menuopt: {
    position:'absolute',
     right:0,
      top:0,
       backgroundColor: 'transparent',
  }
};
