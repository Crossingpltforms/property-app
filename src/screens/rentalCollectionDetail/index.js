import React, { Component } from 'react'
import {
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native'

import { Icon } from 'react-native-elements'

import Expandable_ListView from '../../components/Expandable_ListView'
import { formatTime, secondsToDate } from '../../common/helper/time'
import style from './style'

export default class RentalCollectionDetail extends Component {
  constructor(props) {
    super(props)

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    this.state = {
      isLoading: false,
      userData: '',
      token: '',
      userId: '',
      rentalInfo: props.navigation.state.params.rentalInfo,
      isLandlord: false,
      AccordionData: [
        {
          id: 0,
          expanded: true,
          category_Name: 'Invoices',
          sub_Category: [],
        },

        {
          id: 1,
          expanded: false,
          category_Name: 'Logs',
          sub_Category: [],
        },
      ],
    }
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
              accessibilityLabel='rentalCollectionDetailBackBtn'
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
    const { AccordionData } = this.state

    for (let index = 0; index < AccordionData.length; index++) {
      const elementOld = AccordionData[index]

      if (elementOld.category_Name === 'Invoices') {
        AccordionData[
          elementOld.id
        ].sub_Category = this.state.rentalInfo.invoices
      } else {
        AccordionData[elementOld.id].sub_Category = this.state.rentalInfo.logs
      }
    }

    this.setState({ isLandlord: this.state.rentalInfo.isLandlord })

    this.setState({ AccordionData }, function() {})
  }

  showLoader = () => {
    this.setState({ isLoading: true })
  }

  hideLoader = () => {
    this.setState({ isLoading: false })
  }

  renderData = (key, index) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {}}
          accessible={true}
          accessibilityLabel='rentalCollectionDetailTenantNameBtn'
        >
          <View style={style.listStyle}>
            <Text style={style.TextStyleHeaderTag}>{key.propertyName}</Text>
            <Text style={[style.textStyle, { marginTop: 5 }]}>
              {key.tenantName}
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

  update_Layout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    const array = [...this.state.AccordionData]

    array[index]['expanded'] = !array[index]['expanded']

    this.setState(() => {
      return {
        AccordionData: array,
      }
    })
  }

  render() {
    return (
      <View
        style={{ flexDirection: 'column', flex: 1, backgroundColor: '#FFFFFF' }}
      >
        {this._viewHeader()}
        <View style={style.container}>
          <Text style={style.TextStyleHeaderTag}>
            {this.state.rentalInfo.propertyName}
          </Text>

          {this.state.rentalInfo.isLandlord === true ? (
            <Text style={[style.textStyle, { marginTop: 5 }]}>
              {this.state.rentalInfo.tenantName}
            </Text>
          ) : (
            <View />
          )}

          <Text style={[style.textStyle, { marginTop: 5, fontSize: 11 }]}>
            From{' '}
            {secondsToDate('MMMM D, YYYY', this.state.rentalInfo.startDate)}
            To {secondsToDate('MMMM D, YYYY', this.state.rentalInfo.endDate)}
          </Text>

          <ScrollView
            contentContainerStyle={{
              marginTop: 10,
              paddingVertical: 5,
              paddingBottom: 20,
            }}
          >
            {this.state.AccordionData.map((item, key) => (
              <Expandable_ListView
                isLandlord={this.state.isLandlord}
                key={item.category_Name}
                onClickFunction={this.update_Layout.bind(this, key)}
                item={item}
              />
            ))}
          </ScrollView>
        </View>
        <View style={{ position: 'absolute', top: '50%', right: 0, left: 0 }}>
          <ActivityIndicator
            animating={this.state.isLoading}
            size='large'
            color='grey'
          />
        </View>
      </View>
    )
  }
}
