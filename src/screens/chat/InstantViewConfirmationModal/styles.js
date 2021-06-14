import { Dimensions } from 'react-native';
import { Matrics } from "../../../common/styles";

const { width, height } = Dimensions.get('window');

export default {
    mainContainer: {
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        backgroundColor: 'white',
        marginHorizontal: Matrics.ScaleValue(20),
        borderRadius: 20,
        alignItems: 'center',
        width: '90%',
    },
    closeHeader: {
        height: Matrics.ScaleValue(50),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 20
    },
    headerText: {
        width: '90%',
        alignContent: 'center',
        color: 'black',
        fontFamily: "OpenSans-SemiBold",
        fontSize: Matrics.ScaleValue(18),
        marginHorizontal: Matrics.ScaleValue(25),
        textAlign: 'center'
    },
    modalImageView: {
        width: Matrics.ScaleValue(160),
        height: Matrics.ScaleValue(160),
    },
    selectDateTextStyle: {
        textAlign: 'center',
        fontFamily: "OpenSans-Regular",
        fontSize: Matrics.ScaleValue(16),
    },
    checkBoxDateContainer: {
        width: '90%',
        marginBottom: Matrics.ScaleValue(10),
        marginTop: Matrics.ScaleValue(10),
        alignItems: 'flex-start',
        marginHorizontal: Matrics.ScaleValue(25),
        paddingHorizontal: Matrics.ScaleValue(15),
    },
    selectedTextStyle: {
        paddingLeft: Matrics.ScaleValue(10),
        fontFamily: "OpenSans-Regular",
        fontSize: Matrics.ScaleValue(16),
        color: 'black'
    },
    unSelectedTextStyle: {
        paddingLeft: Matrics.ScaleValue(10),
        fontFamily: "OpenSans-Regular",
        fontSize: Matrics.ScaleValue(16),
        color: 'gray'
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
    unSelectedButtonStyle: {
        height: Matrics.ScaleValue(40),
        backgroundColor: 'transparent',
        borderRadius: 15,
        borderColor: 'black',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    unSelectedButtonTextStyle: {
        fontFamily: "OpenSans-Regular",
        fontSize: Matrics.ScaleValue(15),
        color: 'black'
    },
};