import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'black',
        width: width * 0.92,
        marginVertical: 10,
    },

    styleEdittext: {
        width: width * 0.80,
        height: 40,
        fontSize: 13,
        marginRight: 30,
        marginLeft: 10,
        color: 'black',
    },

    textStyle: {
        marginVertical: 10,
        fontSize: 16,
        color: '#ffffff',
    },
    TextStyleHeaderTag: {
        fontSize: 13,
        fontFamily: "OpenSans-Bold",
        color: "#000"
      },
});