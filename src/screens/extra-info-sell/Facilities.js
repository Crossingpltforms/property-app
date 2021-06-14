import React, { Fragment } from 'react'
import { View, Text } from 'react-native'
import CustomCheckBox from './CustomCheckBox'
import ExtrainfoStyle from './styles'

export default (props) => (
  <Fragment>
    <Text style={ExtrainfoStyle.furnishingLabel}>Facilities</Text>

    <View style={ExtrainfoStyle.furnishingView}>
      <View style={ExtrainfoStyle.furnishingViewList}>
        <View
          style={{
            ...ExtrainfoStyle.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.facilities}
              keyValue='bbq'
              formState={'facilities'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellBBQCheckBox'
            />
          </View>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>
            Barbeque area
          </Text>
        </View>
        <View
          style={{
            ...ExtrainfoStyle.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.facilities}
              keyValue='covered_parking'
              formState={'facilities'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellCoverParkCheckBox'
            />
          </View>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>
            Covered parking
          </Text>
        </View>
      </View>
      <View style={ExtrainfoStyle.furnishingViewList}>
        <View
          style={{
            ...ExtrainfoStyle.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.facilities}
              keyValue='gym'
              formState={'facilities'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellGymnasiumCheckbox'
            />
          </View>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Gymnasium</Text>
        </View>
        <View
          style={{
            ...ExtrainfoStyle.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.facilities}
              keyValue='basketball'
              formState={'facilities'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellBasketBallCheckbox'
            />
          </View>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Basketball</Text>
        </View>
      </View>
      <View style={ExtrainfoStyle.furnishingViewList}>
        <View
          style={{
            ...ExtrainfoStyle.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.facilities}
              keyValue='restaurant'
              formState={'facilities'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellRestuarantCheckbox'
            />
          </View>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Restaurant</Text>
        </View>
        <View
          style={{
            ...ExtrainfoStyle.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.facilities}
              keyValue='dobby'
              formState={'facilities'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellDobbyCheckBox'
            />
          </View>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Dobby</Text>
        </View>
      </View>
      <View style={ExtrainfoStyle.furnishingViewList}>
        <View
          style={{
            ...ExtrainfoStyle.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.facilities}
              keyValue='nursery'
              formState={'facilities'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellNurseryCheckbox'
            />
          </View>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Nursery</Text>
        </View>
        <View
          style={{
            ...ExtrainfoStyle.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.facilities}
              keyValue='playground'
              formState={'facilities'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellPlayGroundCheckbox'
            />
          </View>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Playground</Text>
        </View>
      </View>
      <View style={ExtrainfoStyle.furnishingViewList}>
        <View
          style={{
            ...ExtrainfoStyle.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.facilities}
              keyValue='tennis'
              formState={'facilities'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellTennisCourtCheckBox'
            />
          </View>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>
            Tennis court
          </Text>
        </View>
        <View
          style={{
            ...ExtrainfoStyle.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.facilities}
              keyValue='security24hr'
              formState={'facilities'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellSecurityCheckBox'
            />
          </View>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>
            24hr security
          </Text>
        </View>
      </View>
      <View style={ExtrainfoStyle.furnishingViewList}>
        <View
          style={{
            ...ExtrainfoStyle.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.facilities}
              keyValue='mart'
              formState={'facilities'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellMartCheckBox'
            />
          </View>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Mart</Text>
        </View>
        <View
          style={{
            ...ExtrainfoStyle.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.facilities}
              keyValue='squash'
              formState={'facilities'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellSquashCheckBox'
            />
          </View>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>
            Squash court
          </Text>
        </View>
      </View>
      <View style={ExtrainfoStyle.furnishingViewList}>
        <View
          style={{
            ...ExtrainfoStyle.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.facilities}
              keyValue='badminton'
              formState={'facilities'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellBadMintonCheckBox'
            />
          </View>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Badminton</Text>
        </View>
        <View
          style={{
            ...ExtrainfoStyle.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.facilities}
              keyValue='elevator'
              formState={'facilities'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellElevatorCheckbox'
            />
          </View>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Elevator</Text>
        </View>
      </View>
      <View style={ExtrainfoStyle.furnishingViewList}>
        <View
          style={{
            ...ExtrainfoStyle.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.facilities}
              keyValue='swimming'
              formState={'facilities'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellSwimmCheckBox'
            />
          </View>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>
            Swimming Pool
          </Text>
        </View>
        <View
          style={{
            ...ExtrainfoStyle.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.facilities}
              keyValue='sauna'
              formState={'facilities'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellSaunaCheckBox'
            />
          </View>
          <Text style={ExtrainfoStyle.furnishingViewTabLabel}>Sauna</Text>
        </View>
      </View>
    </View>
  </Fragment>
)
