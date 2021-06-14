import React, { Fragment } from 'react'
import { View, Text } from 'react-native'
import CustomCheckBox from './CustomCheckBox'
import ExtrainfoStyle from '../../styles/Extrainfo.style'

export default (props) => (
  <Fragment>
    <Text style={ExtrainfoStyle.furnishingLabel}>Facilities</Text>

    <View style={ExtrainfoStyle.furnishingView}>
      <View style={ExtrainfoStyle.furnishingViewList}>
        <View style={ExtrainfoStyle.furnishingViewTab}>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>
            Barbeque area
          </Text>
          <CustomCheckBox
            state={props.state.facilities}
            keyValue='bbq'
            formState={'facilities'}
            _toggleCheckBox={props._toggleCheckBox}
            accessibilityLabel='extraInfoScreenBBQCheckBox'
          />
        </View>
        <View style={ExtrainfoStyle.furnishingViewTab}>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>
            Covered parking
          </Text>
          <CustomCheckBox
            state={props.state.facilities}
            keyValue='covered_parking'
            formState={'facilities'}
            _toggleCheckBox={props._toggleCheckBox}
            accessibilityLabel='extraInfoScreenParkingCheckBox'
          />
        </View>
      </View>
      <View style={ExtrainfoStyle.furnishingViewList}>
        <View style={ExtrainfoStyle.furnishingViewTab}>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Gymnasium</Text>
          <CustomCheckBox
            state={props.state.facilities}
            keyValue='gym'
            formState={'facilities'}
            _toggleCheckBox={props._toggleCheckBox}
            accessibilityLabel='extraInfoScreenGymCheckBox'
          />
        </View>
        <View style={ExtrainfoStyle.furnishingViewTab}>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Basketball</Text>
          <CustomCheckBox
            state={props.state.facilities}
            keyValue='basketball'
            formState={'facilities'}
            _toggleCheckBox={props._toggleCheckBox}
            accessibilityLabel='extraInfoScreenBasketBallCheckBox'
          />
        </View>
      </View>
      <View style={ExtrainfoStyle.furnishingViewList}>
        <View style={ExtrainfoStyle.furnishingViewTab}>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Restaurant</Text>
          <CustomCheckBox
            state={props.state.facilities}
            keyValue='restaurant'
            formState={'facilities'}
            _toggleCheckBox={props._toggleCheckBox}
            accessibilityLabel='extraInfoScreenRestaurantCheckBox'
          />
        </View>
        <View style={ExtrainfoStyle.furnishingViewTab}>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Dobby</Text>
          <CustomCheckBox
            state={props.state.facilities}
            keyValue='dobby'
            formState={'facilities'}
            _toggleCheckBox={props._toggleCheckBox}
            accessibilityLabel='extraInfoScreenDobbyCheckBox'
          />
        </View>
      </View>
      <View style={ExtrainfoStyle.furnishingViewList}>
        <View style={ExtrainfoStyle.furnishingViewTab}>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Nursery</Text>
          <CustomCheckBox
            state={props.state.facilities}
            keyValue='nursery'
            formState={'facilities'}
            _toggleCheckBox={props._toggleCheckBox}
            accessibilityLabel='extraInfoScreenNurseryCheckBox'
          />
        </View>
        <View style={ExtrainfoStyle.furnishingViewTab}>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Playground</Text>
          <CustomCheckBox
            state={props.state.facilities}
            keyValue='playground'
            formState={'facilities'}
            _toggleCheckBox={props._toggleCheckBox}
            accessibilityLabel='extraInfoScreenPlayGroundCheckBox'
          />
        </View>
      </View>
      <View style={ExtrainfoStyle.furnishingViewList}>
        <View style={ExtrainfoStyle.furnishingViewTab}>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>
            Tennis court
          </Text>
          <CustomCheckBox
            state={props.state.facilities}
            keyValue='tennis'
            formState={'facilities'}
            _toggleCheckBox={props._toggleCheckBox}
            accessibilityLabel='extraInfoScreenTennisCheckBox'
          />
        </View>
        <View style={ExtrainfoStyle.furnishingViewTab}>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>
            24hr security
          </Text>
          <CustomCheckBox
            state={props.state.facilities}
            keyValue='security24hr'
            formState={'facilities'}
            _toggleCheckBox={props._toggleCheckBox}
            accessibilityLabel='extraInfoScreenSecurityCheckBox'
          />
        </View>
      </View>
      <View style={ExtrainfoStyle.furnishingViewList}>
        <View style={ExtrainfoStyle.furnishingViewTab}>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Mart</Text>
          <CustomCheckBox
            state={props.state.facilities}
            keyValue='mart'
            formState={'facilities'}
            _toggleCheckBox={props._toggleCheckBox}
            accessibilityLabel='extraInfoScreenMartCheckBox'
          />
        </View>
        <View style={ExtrainfoStyle.furnishingViewTab}>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>
            Squash court
          </Text>
          <CustomCheckBox
            state={props.state.facilities}
            keyValue='squash'
            formState={'facilities'}
            _toggleCheckBox={props._toggleCheckBox}
            accessibilityLabel='extraInfoScreenSquashCheckBox'
          />
        </View>
      </View>
      <View style={ExtrainfoStyle.furnishingViewList}>
        <View style={ExtrainfoStyle.furnishingViewTab}>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Badminton</Text>
          <CustomCheckBox
            state={props.state.facilities}
            keyValue='badminton'
            formState={'facilities'}
            _toggleCheckBox={props._toggleCheckBox}
            accessibilityLabel='extraInfoScreenBadMintonCheckBox'
          />
        </View>
        <View style={ExtrainfoStyle.furnishingViewTab}>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Elevator</Text>
          <CustomCheckBox
            state={props.state.facilities}
            keyValue='elevator'
            formState={'facilities'}
            _toggleCheckBox={props._toggleCheckBox}
            accessibilityLabel='extraInfoScreenElevatorCheckBox'
          />
        </View>
      </View>
      <View style={ExtrainfoStyle.furnishingViewList}>
        <View style={ExtrainfoStyle.furnishingViewTab}>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>
            Swimming Pool
          </Text>
          <CustomCheckBox
            state={props.state.facilities}
            keyValue='swimming'
            formState={'facilities'}
            _toggleCheckBox={props._toggleCheckBox}
            accessibilityLabel='extraInfoScreenSwimmingCheckBox'
          />
        </View>
        <View style={ExtrainfoStyle.furnishingViewTab}>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Sauna</Text>
          <CustomCheckBox
            state={props.state.facilities}
            keyValue='sauna'
            formState={'facilities'}
            _toggleCheckBox={props._toggleCheckBox}
            accessibilityLabel='extraInfoScreenSaunaCheckBox'
          />
        </View>
      </View>
    </View>
  </Fragment>
)
