import { StyleSheet } from 'react-native'
import { Matrics } from '../../common/styles'
const styles = StyleSheet.create({

    crossButtonContainer: {
        width: '100%',
        marginTop: 60,
        alignItems: 'flex-end'
    },
    accountText: {
        fontWeight: '600',
        fontSize: 25,
        color: '#000',
        textAlign: 'left'
    },
    supportText: {
        marginTop: 16,
        fontSize: Matrics.ScaleValue(14),
        color: '#000',
        textAlign: 'left'
    },
    helloText: {
        fontSize: Matrics.ScaleValue(14),
        textAlign: 'left',
        color: 'blue'
    }

})
export default styles