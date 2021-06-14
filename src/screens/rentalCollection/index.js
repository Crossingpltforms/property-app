import React, { Component } from 'react'
import {
  TouchableOpacity,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  BackHandler,
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import { Icon } from 'react-native-elements'
import Http from '../../api/http'
import APICaller from '../../util/apiCaller'
import ErrorDialog from '../../components/ErrorDialog'
import { formatTime, secondsToDate } from '../../common/helper/time'
import style from './style'
const dayjs = require('dayjs')

class RentalCollection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      userData: '',
      token: '',
      userId: '',
      rentalList: [],
      isDataFound: true,
      showErrorDialog: false,
    }
  }

  handleBackButton = () => {
    this._navigationBack()
    return true
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)
  }

  _navigationBack = () => this.props.navigation.goBack()

  _viewHeader() {
    return (
      <View
        style={{
          backgroundColor: '#FFE100',
          height: 50,
          width: '100%',
          padding: 10,
          justifyContent: 'center',
          shadowColor: 'black',
          marginBottom: 5,
          shadowOpacity: 0.2,
          elevation: 6,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 3, alignItems: 'center', flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => this._navigationBack()}
              accessible={true}
              accessibilityLabel='rentalCollectionBackBtn'
            >
              <Icon name='arrow-back' size={30} />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 17,
                color: '#000',
                paddingLeft: 10,
              }}
            >
              Rental Collection
            </Text>
          </View>
        </View>
      </View>
    )
  }

  componentDidMount() {
    this.getRentalInfo()
  }

  showLoader = () => {
    this.setState({ isLoading: true })
  }

  hideLoader = () => {
    this.setState({ isLoading: false })
  }

  displayError() {
    this.setState({ showErrorDialog: true })
  }

  getRentalInfo = () => {
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      this.showLoader()
      APICaller(Http.getRentalInfo, 'POST', user_credentials.token, '').then(
        (json) => {
          if (json.status === 200) {
            this.setState({ rentalList: json.data.orders })

            this.setState({ rentalList: json.data.orders }, function() {
              if (this.state.rentalList.length <= 0) {
                this.setState({ isDataFound: false })
              } else {
                this.setState({ isDataFound: true })
              }
            })

            this.hideLoader()
          } else {
            this.hideLoader()
            this.displayError()
          }
        }
      )
    }
  }

  renderData = (key, index) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('RentalCollectionDetail', {
              rentalInfo: key,
            })
          }}
          accessible={true}
          accessibilityLabel='rentalCollectionDetailBtn'
        >
          <View style={style.listStyle}>
            <Text style={style.TextStyleHeaderTag}>{key.propertyName}</Text>
            <Text style={[style.textStyle, { marginTop: 5 }]}>
              {key.isLandlord === true
                ? key.tenantName
                : `From ${secondsToDate(
                    'MMMM D, YYYY',
                    key.startDate
                  )} To ${secondsToDate('MMMM D, YYYY', key.endDate)}`}
            </Text>
            <View style={style.dividerStyle} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View
        style={{ height: 0.5, width: '100%', backgroundColor: '#ffffff' }}
      />
    )
  }

  render() {
    return (
      <View
        style={{ flexDirection: 'column', flex: 1, backgroundColor: '#FFFFFF' }}
      >
        {this._viewHeader()}
        {this.state.isDataFound ? (
          <View style={style.container}>
            <FlatList
              style={{ paddingBottom: 20, marginTop: 5 }}
              data={this.state.rentalList}
              ItemSeparatorComponent={this.FlatListItemSeparator}
              renderItem={({ item, index }) => this.renderData(item, index)}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        ) : (
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'black', fontSize: 15 }}>
              No Record Found
            </Text>
          </View>
        )}
        <View style={{ position: 'absolute', top: '50%', right: 0, left: 0 }}>
          <ActivityIndicator
            animating={this.state.isLoading}
            size='large'
            color='grey'
          />
        </View>

        <ErrorDialog
          modalVisible={this.state.showErrorDialog}
          headerText='Oops!'
          bodyText={`Something went wrong. Please contact hello@speedrent.com for assistance.`}
          toggleModal={(value) => {
            this.setState({ showErrorDialog: false })
          }}
        />
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
)(RentalCollection)
