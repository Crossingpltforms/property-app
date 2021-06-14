import React, { Component } from 'react'

import {
  Alert,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import imgDown from '../../Images/More/drop-down-arrow.png'
import PropTypes from 'prop-types'
import Http from '../api/http'
import APICaller from '../util/apiCaller'
import { formatTime, secondsToDate } from '../common/helper/time'

class Expandable_ListView extends Component {
  static propTypes = {
    isLandlord: PropTypes.bool,
  }

  constructor() {
    super()

    this.state = {
      layout_Height: 0,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.item.expanded) {
      this.setState(() => {
        return {
          layout_Height: null,
        }
      })
    } else {
      this.setState(() => {
        return {
          layout_Height: 0,
        }
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.layout_Height !== nextState.layout_Height) {
      return true
    }
    return false
  }

  show_Selected_Category = (item) => {
    if (item !== '') {
      let amount = item.total.substring(4, item.total.length)
      this.getPaymentUrl(item.user_displayId, amount.replace(/,/g, ''))
      // Linking.openURL(item).catch(err => console.error('An error occurred', err));
    }
  }

  getPaymentUrl(id, amount) {
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      const body = {
        amount: amount,
        currency: 'MYR',
        paymentMethod: 'fpx',
      }

      APICaller(
        Http.getPayUrl(id),
        'POST',
        user_credentials.token,
        JSON.stringify(body)
      ).then((response) => {
        if (
          response.status === 403 ||
          response.status === 422 ||
          response.status === 401
        ) {
          Alert.alert(response.data.message)
        } else if (response.status === 200) {
          Linking.openURL(response.data).catch((err) => {
            // TODO send to crashlytics
          })
        }
      })
    }
  }

  getAmount(amount) {
    return amount.replace(',', '')
  }

  render() {
    return (
      <View style={styles.Panel_Holder}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.props.onClickFunction}
          style={styles.category_View}
          accessible={true}
          accessibilityLabel='imageDownBtn'
        >
          <Text style={styles.category_Text}>
            {this.props.item.category_Name}{' '}
          </Text>

          <Image
            testID='imgDown'
            source={imgDown}
            style={[
              styles.iconStyle,
              {
                transform: this.props.item.expanded
                  ? [{ rotate: '180deg' }]
                  : [{ rotate: '0deg' }],
              },
            ]}
          />
        </TouchableOpacity>

        <View style={{ height: this.state.layout_Height, overflow: 'hidden' }}>
          {this.props.item.sub_Category.map((item, key) =>
            this.props.item.category_Name === 'Invoices' ? (
              parseInt(
                this.getAmount(item.total.substring(4, item.total.length)),
                10
              ) > 1 ? (
                  <TouchableOpacity
                    key={key}
                    accessible={true}
                    accessibilityLabel='paidUnPaidBtn'
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.textStyle, { flex: 1 }]}>
                        {secondsToDate('MMM DD YYYY', item.dueDate)}
                      </Text>
                      {this.props.isLandlord === true ? (
                        <Text
                          style={[
                            styles.textStyle,
                            {
                              flex: 1,
                              textAlign: 'right',
                              fontFamily: 'OpenSans-SemiBold',
                              color: item.status === 'unpaid' ? 'red' : 'green',
                            },
                          ]}
                        >
                          {item.status === 'unpaid'
                            ? 'UNPAID'.toUpperCase()
                            : 'PAID'.toUpperCase()}
                        </Text>
                      ) : (
                          <TouchableOpacity
                            key={key}
                            style={styles.sub_Category_Text}
                            accessible={true}
                            accessibilityLabel='paidUnpaidBtn2'
                            onPress={
                              item.status === 'unpaid'
                                ? this.show_Selected_Category.bind(this, item)
                                : ''
                            }
                          >
                            <View
                              style={
                                item.status === 'unpaid'
                                  ? [
                                    styles.textStyleHousingType,
                                    { backgroundColor: '#4885ED' },
                                  ]
                                  : [
                                    styles.textStyleHousingType,
                                    { borderColor: 'white' },
                                  ]
                              }
                            >
                              <Text
                                style={{
                                  textAlign: 'center',
                                  color:
                                    item.status === 'unpaid' ? 'white' : 'green',
                                }}
                              >
                                {item.status === 'unpaid'
                                  ? 'Pay now'
                                  : 'PAID'.toUpperCase()}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.dividerStyle} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    key={key}
                    accessible={true}
                    accessibilityLabel='paidUnpaidBtn3'
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.textStyle, { flex: 1 }]}>
                        {secondsToDate('MMM DD YYYY', item.dueDate)}
                      </Text>
                      {this.props.isLandlord === true ? (
                        <Text
                          style={[
                            styles.textStyle,
                            {
                              flex: 1,
                              textAlign: 'right',
                              fontFamily: 'OpenSans-SemiBold',
                              color: item.status === 'unpaid' ? 'red' : 'green',
                            },
                          ]}
                        >
                          {item.status === 'unpaid'
                            ? 'UNPAID'.toUpperCase()
                            : 'PAID'.toUpperCase()}
                        </Text>
                      ) : (
                          <TouchableOpacity
                            key={key}
                            style={styles.sub_Category_Text}
                            accessible={true}
                            accessibilityLabel='paidUnpaidBtn4'
                            onPress={
                              item.status === 'unpaid'
                                ? this.show_Selected_Category.bind(this, item)
                                : ''
                            }
                          >
                            <View
                              style={
                                item.status === 'unpaid'
                                  ? [
                                    styles.textStyleHousingType,
                                    { backgroundColor: '#4885ED' },
                                  ]
                                  : [
                                    styles.textStyleHousingType,
                                    { borderColor: 'white' },
                                  ]
                              }
                            >
                              <Text
                                style={{
                                  textAlign: 'center',
                                  color:
                                    item.status === 'unpaid' ? 'white' : 'green',
                                }}
                              >
                                {item.status === 'unpaid'
                                  ? 'Pay now'
                                  : 'PAID'.toUpperCase()}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.dividerStyle} />
                  </TouchableOpacity>
                )
            ) : (
                <TouchableOpacity
                  key={key}
                  accessible={true}
                  accessibilityLabel='userNameMsgBtn'
                >
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={[styles.textStyle, { flex: 1 }]}>
                      {formatTime(
                        'YYYY-MM-DD hh:MM a',
                        new Date(item.dateCreated * 1000)
                      )}
                    </Text>
                    <Text style={[styles.textStyle, { flex: 1, paddingTop: 0 }]}>
                      {item.message} - {item.username}
                    </Text>
                  </View>
                  <View style={styles.dividerStyle} />
                </TouchableOpacity>
              )
          )}
        </View>
      </View>
    )
  }
}

function mapStateToProps({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return { isUserLogin, userLoginData }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Expandable_ListView)

const styles = StyleSheet.create({
  iconStyle: {
    width: 15,
    height: 18,
    marginRight: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    tintColor: '#000',
  },
  category_Text: {
    fontSize: 14,
    textAlign: 'left',
    fontFamily: 'OpenSans-SemiBold',
    color: '#000',
    padding: 10,
  },
  category_View: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#CBCBCB',
  },
  textStyle: {
    fontSize: 13,
    textAlign: 'left',
    fontFamily: 'OpenSans-Light',
    color: '#000',
    padding: 10,
  },
  dividerStyle: {
    backgroundColor: '#CBCBCB',
    width: '100%',
    height: 1,
  },
  textStyleHousingType: {
    marginTop: 5,
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 14,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'grey',
  },
})
