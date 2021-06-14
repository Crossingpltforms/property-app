import React, { Component, Fragment } from 'react'
import Container from '../../components/Container'
import ChatRequestStyle from '../../styles/ChatRequestStyle'
import {
  ScrollView,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Text,
  View
} from 'react-native'
import { Icon } from 'react-native-elements'
import _ from 'lodash'

import AllCountries from './allcountries.json'

const { width, height } = Dimensions.get('window')
export default class Nationality extends Component {
  constructor (props) {
    super(props)
    this.state = {
      myCountry: 'Malaysia',
      countries: AllCountries.data,
      searchPattern: '',
      is_loading: false,
      myCountry: props.navigation.state.params.myCountry // TODO which field to use?
    }
  }

  handleBackButton = () => {
    this._navigationBack()
    return true
  }

  UNSAFE_componentWillMount () {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)
  }

  componentDidMount () {
    this.setState({ ...this.state, is_loading: true })
    setTimeout(
      () =>
        this.setState({
          ...this.state,
          is_loading: false
          // countries: AllCountries.data
        }),
      1000
    )

    this.state.countries.map(res => {
      if (this.state.myCountry === res.name) {
        res.isSelected = true
      } else {
        res.isSelected = false
      }
    })
  }

  goBack () {
    const { navigation } = this.props
    navigation.goBack()
    navigation.state.params.onSelect({ myCountry: this.state.myCountry })
  }

  _navigationBack = () => this.props.navigation.goBack()

  _viewHeader () {
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
          shadowOffset: { width: 0, height: 2 }
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 3, alignItems: 'center', flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => this._navigationBack()}
              accessible={true}
              accessibilityLabel='nationalityBackBtn'
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
              Nationality
            </Text>
          </View>
        </View>
      </View>
    )
  }

  _renderCountriesType () {
    const { countries, is_loading } = this.state
    return (
      <Fragment>
        {is_loading ? (
          <ActivityIndicator
            color='grey'
            size='large'
            style={{
              marginTop: 10
            }}
          />
        ) : (
          countries.map(({ id, name, isSelected }) => {
            return (
              <TouchableOpacity
                key={id}
                style={{ width: width * 0.9 }}
                onPress={() => {
                  for (let index = 0; index < countries.length; index++) {
                    if (countries[index].id === id) {
                      countries[index].isSelected = true

                      this.setState({ myCountry: countries[index].name })
                    } else {
                      countries[index].isSelected = false
                    }
                  }
                  this.setState({ countries })
                }}
                accessible={true}
                accessibilityLabel='nationalityListBtn'
              >
                <View style={{ flexDirection: 'column' }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 15
                    }}
                  >
                    <Text style={style.styleFont}> {name} </Text>
                    <Icon
                      name='check'
                      color={isSelected ? '#39D196' : '#FFFFFF'}
                      size={22}
                    />
                  </View>
                  <View
                    style={{
                      marginTop: 10,
                      backgroundColor: '#F5F5F5',
                      width: '100%',
                      height: 1
                    }}
                  />
                </View>
              </TouchableOpacity>
            )
          })
        )}
      </Fragment>
    )
  }

  render () {
    return (
      <Container>
        {this._viewHeader()}

        <ScrollView
          contentContainerStyle={[ChatRequestStyle.root, { paddingBottom: 50 }]}
        >
          <View
            style={[
              ChatRequestStyle.body,
              { justifyContent: 'center', alignItems: 'center' }
            ]}
          >
            <Text style={style.title}>Which country are you from?</Text>
            <Text style={[style.title, { fontSize: 15 }]}>Search</Text>

            <View style={style.topInputView}>
              <TextInput
                testID='country'
                placeholder='Type in your country'
                style={style.countryInput}
                onChangeText={e => {
                  if (e) {
                    this.setState({
                      ...this.state,
                      searchPattern: e,
                      countries: e
                        ? AllCountries.data.filter(i =>
                            i.name.toLowerCase().startsWith(e.toLowerCase())
                          )
                        : AllCountries.data
                    })
                  } else {
                    this.setState({
                      ...this.state,
                      searchPattern: e,
                      is_loading: true
                    })
                    setTimeout(
                      () =>
                        this.setState({
                          ...this.state,

                          is_loading: false,
                          countries: AllCountries.data
                        }),
                      1000
                    )
                  }
                }}
                value={this.state.searchPattern}
                accessible={true}
                accessibilityLabel='chatNationalityCountryInput'
              />
            </View>

            {this._renderCountriesType()}
          </View>
        </ScrollView>

        <View style={style.bottomButton}>
          <View style={style.styleViewShadow}>
            <TouchableOpacity
              onPress={() => this.goBack()}
              accessible={true}
              accessibilityLabel='nationalityDoneBtn'
            >
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 15,
                  textAlign: 'center',
                  color: '#000'
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
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
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'OpenSans-SemiBold',
    marginRight: (width * 30) / 100
  },
  topInputView: {
    backgroundColor: '#e5e5e5',
    height: 40,
    width: width * 0.9,
    borderRadius: 6,
    marginTop: (height * 3) / 100
  },
  countryInput: {
    flex: 1,
    width: width * 0.9,
    fontSize: 15,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: (width * 2) / 100
  },
  countryLabel: {
    fontSize: 15,
    marginLeft: (width * 2) / 100
  },
  checkIcon: {
    marginRight: (width * 2) / 100
  },
  endBottomLine: {
    height: height * 0.001
  },
  styleFont: {
    flex: 1,
    fontSize: 14,
    textAlign: 'left',
    fontFamily: 'OpenSans-Light',
    color: '#000'
  },
  bottomButton: {
    flex: 1,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    marginTop: 20
  },
  styleViewShadow: {
    justifyContent: 'center',
    backgroundColor: '#FFE100',
    height: 42,
    width: '70%',
    borderRadius: 5,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 }
  }
})
