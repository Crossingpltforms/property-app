import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'

const DetailsReportModal = (props) => {
  const {
    reportModal,
    ExtrainfoStyle,
    reportListingText,
    report_error_msg,
    onReportProperty,
    onReportPropertySubit,
    onChageReport,
  } = props

  return (
    <Modal isVisible={reportModal}>
      <View style={ExtrainfoStyle.viewModal1}>
        <TextInput
          testID='reason'
          value={reportListingText}
          onChangeText={onChageReport}
          multiline={true}
          style={ExtrainfoStyle.reportInputText}
          placeholder='Enter your reason'
          accessible={true}
          accessibilityLabel='detailReportModalReasonInput'
        />
        <View>
          {report_error_msg && (
            <Text style={{ alignSelf: 'center', fontSize: 14, color: 'red' }}>
              {report_error_msg}
            </Text>
          )}
        </View>
        <View style={ExtrainfoStyle.viewModal2}>
          <TouchableOpacity
            onPress={onReportProperty}
            accessible={true}
            accessibilityLabel='reportModalCloseBtn'
          >
            <Text style={{ fontWeight: 'bold' }}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ExtrainfoStyle.buttonSubmit}
            onPress={onReportPropertySubit}
            accessible={true}
            accessibilityLabel='reportModalSubmitBtn'
          >
            <Text style={{ fontWeight: 'bold' }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default DetailsReportModal
