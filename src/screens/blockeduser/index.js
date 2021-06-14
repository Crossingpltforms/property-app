import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native'
import { Matrics } from '../../common/styles'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import styles from './styles'
class BlockedUser extends Component {
    render() {
        return (
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                <View style={styles.crossButtonContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.popToTop()}>
                        <MaterialIcons
                            name="close"
                            size={Matrics.ScaleValue(25)}
                            color={'#000'}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'flex-start',
                            top: -100
                        }}
                    >
                        <Text
                            style={styles.accountText}
                        >
                            {"Your account\nhas been banned."}
                        </Text>
                        <View style={{ flexDirection: 'column' }}>
                            <Text
                                style={styles.supportText}
                            >
                                {"Please contact our support"}

                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    onPress={() => {

                                    }}
                                    style={{ flexDirection: 'column' }}
                                    accessible={true}
                                    accessibilityLabel='otpResentBtn'
                                >
                                    <Text
                                        style={styles.helloText}
                                    >hello@speedhome.com
                                  </Text>

                                </TouchableOpacity>
                                <Text
                                    style={{

                                        fontSize: Matrics.ScaleValue(14),
                                        color: '#000',
                                        textAlign: 'left'
                                    }}
                                >
                                    {" for"}
                                </Text>
                            </View>
                            <Text
                                style={{

                                    fontSize: Matrics.ScaleValue(14),
                                    color: '#000',
                                    textAlign: 'left'
                                }}
                            >
                                {"assistance."}
                            </Text>
                        </View>


                    </View>
                </View>
            </View >
        )
    }
}

function mapStateToProps({ loginData }) {

}
function mapDispatchToProps(dispatch) {

}

export default BlockedUser