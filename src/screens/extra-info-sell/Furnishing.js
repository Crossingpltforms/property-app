import React, { Fragment } from 'react'
import { View, Text } from 'react-native'
import CustomCheckBox from './CustomCheckBox'
import style from './styles'

export default (props) => (
  <Fragment>
    <Text style={style.furnishingLabel}>Furnishing</Text>

    <View style={style.furnishingView}>
      <View style={style.furnishingViewList}>
        <View
          style={{
            ...style.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.furnishing}
              keyValue={'curtain'}
              formState={'furnishing'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellCurtainCheckBox'
            />
          </View>
          <Text style={style.furnishingViewTabLabel}>Curtain</Text>
        </View>
        <View
          style={{
            ...style.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.furnishing}
              keyValue={'mattress'}
              formState={'furnishing'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellMattressCheckBox'
            />
          </View>
          <Text style={style.furnishingViewTabLabel}>Mattress</Text>
        </View>
      </View>
      <View style={style.furnishingViewList}>
        <View
          style={{
            ...style.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.furnishing}
              keyValue={'ac'}
              formState={'furnishing'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellAcCheckBox'
            />
          </View>
          <Text style={style.furnishingViewTabLabel}>A/C</Text>
        </View>
        <View
          style={{
            ...style.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.furnishing}
              keyValue={'hood'}
              formState={'furnishing'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellHoodCheckBox'
            />
          </View>
          <Text style={style.furnishingViewTabLabel}>Hood & hub</Text>
        </View>
      </View>
      <View style={style.furnishingViewList}>
        <View
          style={{
            ...style.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.furnishing}
              keyValue={'water_heater'}
              formState={'furnishing'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellWaterHeaterCheckBox'
            />
          </View>
          <Text style={style.furnishingViewTabLabel}>Water heater</Text>
        </View>
        <View
          style={{
            ...style.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.furnishing}
              keyValue={'dining_table'}
              formState={'furnishing'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellDiningTableCheckBox'
            />
          </View>
          <Text style={style.furnishingViewTabLabel}>Dining table</Text>
        </View>
      </View>
      <View style={style.furnishingViewList}>
        <View
          style={{
            ...style.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.furnishing}
              keyValue={'wardrobe'}
              formState={'furnishing'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellWardrobeCheckBox'
            />
          </View>
          <Text style={style.furnishingViewTabLabel}>Wardrobe</Text>
        </View>
        <View
          style={{
            ...style.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.furnishing}
              keyValue={'kitchen_cabinet'}
              formState={'furnishing'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellKitchenCabinetCheckBox'
            />
          </View>
          <Text style={style.furnishingViewTabLabel}>Kitchen cabinet</Text>
        </View>
      </View>
      <View style={style.furnishingViewList}>
        <View
          style={{
            ...style.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.furnishing}
              keyValue={'fridge'}
              formState={'furnishing'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellFridgeCheckBox'
            />
          </View>
          <Text style={style.furnishingViewTabLabel}>Refrigerator</Text>
        </View>
        <View
          style={{
            ...style.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.furnishing}
              keyValue={'washing_machine'}
              formState={'furnishing'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellWashMachineCheckBox'
            />
          </View>
          <Text style={style.furnishingViewTabLabel}>Washing Machine</Text>
        </View>
      </View>
      <View style={style.furnishingViewList}>
        <View
          style={{
            ...style.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.furnishing}
              keyValue={'sofa'}
              formState={'furnishing'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellSofaCheckBox'
            />
          </View>
          <Text style={style.furnishingViewTabLabel}>Sofa</Text>
        </View>
        <View
          style={{
            ...style.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.furnishing}
              keyValue={'oven'}
              formState={'furnishing'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellOvenCheckBox'
            />
          </View>
          <Text style={style.furnishingViewTabLabel}>Oven</Text>
        </View>
      </View>
      <View style={style.furnishingViewList}>
        <View
          style={{
            ...style.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.furnishing}
              keyValue={'microwave'}
              formState={'furnishing'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellMicrowaveCheckBox'
            />
          </View>
          <Text style={style.furnishingViewTabLabel}>Microwave</Text>
        </View>
        <View
          style={{
            ...style.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.furnishing}
              keyValue={'tv'}
              formState={'furnishing'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellTVCheckBox'
            />
          </View>
          <Text style={style.furnishingViewTabLabel}>TV</Text>
        </View>
      </View>
      <View style={style.furnishingViewList}>
        <View
          style={{
            ...style.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.furnishing}
              keyValue={'bed_frame'}
              formState={'furnishing'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellBedFrameCheckBox'
            />
          </View>
          <Text style={style.furnishingViewTabLabel}>Bed frame</Text>
        </View>
        <View
          style={{
            ...style.furnishingViewTab,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: 40 }}>
            <CustomCheckBox
              state={props.state.furnishing}
              keyValue={'internet'}
              formState={'furnishing'}
              _toggleCheckBox={props._toggleCheckBox}
              accessibilityLabel='extraInfoSellInternetCheckBox'
            />
          </View>
          <Text style={style.furnishingViewTabLabel}>Internet</Text>
        </View>
      </View>
    </View>
  </Fragment>
)
