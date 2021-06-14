import { StyleSheet } from 'react-native';
import { Matrics, Fonts, Color } from "../../common/styles";

const layout1 = {
  justifyContent: "center",
  alignItems: "center"
};

const buttonStyle1 = bgcolor => ({
  width: 132,
  height: 40,
  borderRadius: 6,
  backgroundColor: bgcolor,
  ...layout1
});

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
        fontSize: 18,
        fontFamily: "OpenSans-SemiBold",
        paddingBottom: 15,
        marginTop: 5,
        paddingLeft: 15,
        color: "#000"
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
      styleInfo: {
        flexDirection: "column",
        borderRadius: 5,
        borderColor: "black",
        height: 100,
        width: "100%",
        position: "absolute",
        bottom: 0
      },
      listStyle: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        height: 40,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: "center"
      },
      textStyle: {
        fontSize: 13,
        textAlign: "left",
        fontFamily: "OpenSans-Light",
        color: "#000"
      },
      button2: buttonStyle1("#FFE100"),
      text1: {
        color: Color.black,
        fontSize: Matrics.ScaleValue(15),
        fontFamily: Fonts.type.OpenSansBold
      },
      button3: {
        ...buttonStyle1("#FFFFFF"),
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 6
      },   
      txtKmStyle: {
        textAlign: 'center',
        fontSize: 14,
        paddingLeft: 10,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 3, // TODO which padding
        paddingRight: 3,
        color: '#000',
        width: 80,
        backgroundColor: '#FFE100',
        fontFamily: 'OpenSans-Bold',
      },
      txtStyle: {
        fontSize: 14,
        textAlign: 'left',
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        color: '#FFF',
        fontFamily: 'OpenSans-Bold',
      },   
});