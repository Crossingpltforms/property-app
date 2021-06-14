import React from 'react'
import { View, Text, Image } from 'react-native'
import MessageStyles from './styles'
import { formatTime } from '../../../common/helper/time'
import ProgressiveImage from '../../../common/components/progressiveImage/index'

const AppointMent = (props) => {
  const { appointMentData, bannerText } = props

  return (
    <View style={MessageStyles.appointMentContainer}>
      <View style={MessageStyles.propertyContainer}>
        <View style={MessageStyles.propertyImageContainer}>
          {appointMentData &&
            appointMentData.propertyDto &&
            appointMentData.propertyDto.images &&
            appointMentData.propertyDto.images.map((allImg) => {
              if (allImg.coverPhoto) {
                return (
                  <ProgressiveImage
                    testID='allImg'
                    key={allImg.url}
                    style={MessageStyles.propertyImg}
                    source={{ uri: allImg.url }}
                  />
                )
              }
            })}
        </View>
        {bannerText && !/^viewing appointment$/i.test(bannerText) ? (
          <View style={MessageStyles.propertyTextContainer}>
            <Text style={MessageStyles.viewingText}>{bannerText}</Text>
          </View>
        ) : (
          <View style={MessageStyles.propertyTextContainer}>
            <Text style={MessageStyles.viewingText}>Key collection</Text>
            <Text style={MessageStyles.viewingTime}>
              {formatTime('lll', appointMentData && appointMentData.dateTime)}
            </Text>
          </View>
        )}
      </View>
      {/* <View style={MessageStyles.rescheduleBtnContainer}>
        <TouchableOpacity style={MessageStyles.rescheduleBtn}>
          <Text style={MessageStyles.rescheduleBtnText}>Rescheule Appt</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  )
}

export default AppointMent
