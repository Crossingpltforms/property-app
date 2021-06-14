import React, { Component } from 'react'
import Container from '../../components/Container'
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  View
} from 'react-native'
import { CalendarList } from 'react-native-calendars'
import { Icon } from 'react-native-elements'
import ChatRequestStyle from '../../styles/ChatRequestStyle'
const dayjs = require('dayjs')

const { height } = Dimensions.get('window')
export default class MoveIndate extends Component {
  constructor (props) {
    super(props)
    var minDate = new Date()
    if (
      this.props.navigation.state &&
      this.props.navigation.state.params &&
      this.props.navigation.state.params.availabilityDate
    ) {
      var g1 = new Date()
      var g2 = new Date(this.props.navigation.state.params.availabilityDate)
      if (g1.getTime() < g2.getTime()) {
        //current date is lesser than availability
        minDate = new Date(this.props.navigation.state.params.availabilityDate)
      } else if (g1.getTime() > g2.getTime()) {
        //current date is greater than availability
        minDate = new Date()
      } else {
        //both are equal
        minDate = new Date()
      }
    }

    minDate.setDate(minDate.getDate())

    this.state = {
      dateSelected: {},
      myDate: '',
      minDate: minDate
    }
  }

  _navigationBack = () => this.props.navigation.goBack()

  goBack () {
    const { navigation } = this.props
    navigation.goBack()
    navigation.setParams({
      params: { myDate: this.state.myDate },
      key: 'MoveInDate'
    })
    navigation.state.params.onSelect({ myDate: this.state.myDate })
  }

  _viewHeader () {
    return (
      <View style={style.headerStyle}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 3, alignItems: 'center', flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => this._navigationBack()}
              accessible={true}
              accessibilityLabel='moveInBackBtn'
            >
              <Icon name='arrow-back' size={30} />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 17,
                color: '#000',
                paddingLeft: 10
              }}
            >
              Move-in date
            </Text>
          </View>
        </View>
      </View>
    )
  }

  render () {
    return (
      <Container>
        {this._viewHeader()}

        <View style={{ height: '100%' }}>
          <View style={ChatRequestStyle.root}>
            <View style={ChatRequestStyle.body}>
              <Text style={[style.title]}>Choose a date to move-in</Text>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <CalendarList
              onVisibleMonthsChange={months => {}}
              pastScrollRange={5}
              futureScrollRange={5}
              scrollEnabled={true}
              showScrollIndicator={true}
              minDate={this.state.minDate}
              markingType={'custom'}
              markedDates={this.state.dateSelected}
              onDayPress={day => {
                this.setState(
                  {
                    dateSelected: {
                      [day.dateString]: {
                        customStyles: {
                          container: {
                            backgroundColor: '#FFE100',
                            borderColor: 'black',
                            borderWidth: 1
                          },
                          text: {
                            color: 'black',
                            fontWeight: 'bold',
                            fontFamily: 'OpenSans-SemiBold'
                          }
                        },
                        selected: true,
                        selectedColor: '#FFE100'
                      }
                    }
                  },
                  () => {
                    let formattedDate = day.dateString.split('-')
                    this.setState({
                      myDate: [
                        formattedDate[2],
                        formattedDate[1],
                        formattedDate[0]
                      ].join('/')
                    })
                  }
                )
              }}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: 'black',
                selectedDayBackgroundColor: '#00adf5',
                selectedDayTextColor: '#ffffff',
                dayTextColor: 'black',
                textDisabledColor: '#d9e1e8',
                dotColor: '#00adf5',
                selectedDotColor: '#ffffff',
                arrowColor: 'orange',
                monthTextColor: 'black',
                indicatorColor: 'blue',
                textDayFontFamily: 'OpenSans-Light',
                textMonthFontFamily: 'OpenSans-Light',
                textDayHeaderFontFamily: 'OpenSans-Light',
                textDayFontWeight: '700',
                textMonthFontWeight: '700',
                textDayHeaderFontWeight: '400',
                textDayFontSize: 20,
                textMonthFontSize: 20,
                textDayHeaderFontSize: 15
              }}
            />
          </View>

          <View
            style={{
              backgroundColor: 'white',
              shadowColor: 'black',
              shadowOpacity: 0.2,
              elevation: 6,
              shadowOffset: { width: 0, height: 2 },
              height: 175,
              marginBottom: 10,
              paddingTop: 15,
              flexDirection: 'row',
              paddingHorizontal: 10,
              alignItems: 'flex-start'
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                flex: 1,
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 15,
                color: '#000',
                lineHeight: 40
              }}
            >
              Date selected
            </Text>

            <View
              style={[
                ChatRequestStyle.bottomButton,
                { marginTop: 0, marginBottom: 0 }
              ]}
            >
              <View style={ChatRequestStyle.styleViewShadow}>
                <TouchableOpacity
                  onPress={() => this.goBack()}
                  accessible={true}
                  accessibilityLabel='moveInConfirmBtn'
                >
                  {/* <TouchableOpacity onPress={() => this.registerNumber()}> */}
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 15,
                      textAlign: 'center',
                      color: '#000'
                    }}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Container>
    )
  }
}

const style = StyleSheet.create({
  title: {
    color: 'black',
    marginTop: (height * 3) / 100,
    marginBottom: (height * 3) / 100,
    alignSelf: 'center',
    fontWeight: 'bold',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 25
  },
  headerStyle: {
    backgroundColor: '#FFE100',
    height: 50,
    width: '100%',
    padding: 10,
    justifyContent: 'center',
    shadowColor: 'black',
    marginBottom: 5,
    shadowOpacity: 0.2,
    elevation: 6,
    shadowOffset: { width: 0, height: 2 }
  }
})
