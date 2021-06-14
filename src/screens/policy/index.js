import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import styles from './styles'
import { Matrics } from '../../common/styles'

export default class Policy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: false,
      email: null,
    }
  }

  componentDidMount() {
    // const params = this.props.navigation.state.params;
    // if (params) {
    //   this.setState({
    //     firstName: params.firstName,
    //     email: params.email
    //   });
    // }
  }

  _navigationBack = () => this.props.navigation.goBack()

  _viewHeader() {
    return (
      <View
        style={{
          height: 50,
          width: '100%',
          paddingVertical: 10,
          justifyContent: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => this._navigationBack()}
            style={{ alignItems: 'center', flexDirection: 'row' }}
            accessible={true}
            accessibilityLabel='policyLeftBtn'
          >
            <Icon name='keyboard-arrow-left' size={35} />
            <Text
              style={[styles.bytapText, { fontSize: Matrics.ScaleValue(14) }]}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.header}>
        {/* <View style={styles.headerView}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Number", {
              screenName: "Terms"
            })}
            style={styles.backTouch}
          >
            <Image source={Images.back} />
          </TouchableOpacity>
        </View> */}

        {this._viewHeader()}

        <View style={{ width: '100%', marginHorizontal: 20 }}>
          <View
            style={{
              width: '100%',
              alignItems: 'flex-start',
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              accessible={true}
              accessibilityLabel='policyTOSbtn'
            >
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 25,
                  color: '#000',
                  textAlign: 'left',
                }}
              >
                Terms of Service
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <ScrollView>
            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                The terms and conditions of this Agreement govern your use of
                the services provided by{' '}
                <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>
                  {' '}
                  Speedrent Technology Sdn. Bhd.{' '}
                </Text>{' '}
                (Company No:{' '}
                <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>
                  1176587-M
                </Text>
                ) of A-G-23, Eve Suite, Jalan PJU 1a/41, Ara Damansara, 47301
                Petaling Jaya, Selangor Darul Ehsan, Malaysia (
                <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>“We”</Text> or{' '}
                <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>“Our”</Text>{' '}
                or <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>“Us”</Text>{' '}
                or{' '}
                <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>
                  “Speedrent”
                </Text>{' '}
                or{' '}
                <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>
                  "SPEEDHOME"
                </Text>
                ), a Malaysian entity, either itself or through its subsidiaries
                or licensees, via various electronic platforms such as the
                SPEEDHOME mobile application or any other platforms designated
                by Us (
                <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>
                  “Application”
                </Text>
                ).
                {'\n'}
                {'\n'}
                By using the Application, you are indicating that you have read
                and understand the terms and conditions herein. If you do not
                agree with the terms, please do not use this Application. For
                avoidance of doubt, this Agreement applies to all users of the
                Application listing a property or finding a property inclusive
                of home owners, landlords, property agents and/or tenants.
                {'\n'}
                {'\n'}
                {'\n'}
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  1. Registration
                </Text>
                {'\n'}
                {'\n'}
                In registering an account:
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You shall provide us with accurate, complete, and updated
                  registration information. Failure to do so shall constitute a
                  breach of the terms and condition of this Agreement, which may
                  result in immediate termination of this Agreement.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You may post an image for the use of your online profile. By
                  submitting such images, you represent and warrant that you are
                  authorised to use the images and grant us the non-exclusive
                  and royalty-free right to use the image.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  To fully access or use the Application, you are required to
                  register for an account by providing, among others, your name,
                  email address and password.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You shall not:
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  Select or use as an account a name of another person with the
                  intent to impersonate that person;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  Use as an account a name subject to any rights of a person
                  other than you without appropriate authorisation; or
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  Use as an account a name that is otherwise offensive, vulgar
                  or obscene.
                </Text>
              </View>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  2. Content
                </Text>
                {'\n'}
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You understand that all information, images, pictures, data,
                  text, music, sound, photographs, graphics, video, messages, or
                  other materials (
                  <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>
                    “Content“
                  </Text>
                  ), whether publicly posted or privately transmitted, is the
                  exclusive work and property of the person from whom such
                  Content originated.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  We do not claim any permanent ownership of your Content. You
                  retain copyright and any other rights you already hold in
                  Content which you submit, post, upload or display on or
                  through the Application. When you submit, post, upload or
                  display Content, you grant us a perpetual, irrevocable,
                  worldwide, royalty-free, and non-exclusive license (and
                  sub-licensable) to use, exploit and archive the Content in
                  accordance with or as reasonably contemplated by this
                  Agreement.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  When you post, submit, or upload Content on the Application
                  you represent and warrant that:
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  You own all copyright in the Content, or if you are not the
                  owner, that you have permission to use the Content, and that
                  you have the right to display and reproduce the Content via
                  the Application. You license us to use and sub-license the
                  Content in accordance with this Agreement;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  You must be authorized to market the property and/or publish
                  the property listing on our Portal;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  You and your Content do not and will not infringe the
                  intellectual property rights or other rights of any person or
                  entity, including copyright, moral rights, trademark, patent
                  or right of privacy;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  You or your Content, and your use, storage, reproduction and
                  display on the Application/Platform will comply with all
                  applicable law, rules and regulations;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  5.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  Your Content does not breach any of this Agreement; and
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  6.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  Your Content is not misleading or deceptive.
                </Text>
              </View>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  3. Listings and Advertisement Rules
                </Text>
                {'\n'}
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You agree to the No Deposit scheme when posting your property
                  on SPEEDHOME.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You must ensure that your property listing and advertisements
                  comply with all applicable laws, statutes, regulations,
                  industry code of conduct or guidelines issued by any relevant
                  trade organisation. Such property listings and advertisements
                  must not violate any laws, regulations, judicial or
                  governmental order, industry code of conduct or guidelines
                  issued by any relevant trade organisation, any treaties or
                  violate or infringe upon any intellectual property rights,
                  rights of publicity or privacy, or any other rights of ours or
                  of any other person.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You must be authorised to transact the property and/or publish
                  the property listing on our Portal. If you are listing a
                  property, the property listing cannot:-
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  contain information that is deemed false, illegal, inaccurate,
                  misleading, misrepresenting, and/or untrue in regards to of
                  any such information;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  be posted without the owner’s consent, which may include, but
                  not limited to individuals and/or private homeowners and
                  property developers;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  be listed as available but is in fact no longer available for
                  sale or rent;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  have information about neighbours or other information that
                  would potentially be viewed as an invasion of privacy; and
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  5.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  contain materials which belongs to third parties including
                  pictures belonging to another.
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You may not misuse the personal data obtained or generated
                  from your property listings or advertisements.
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  5.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You shall only upload only relevant photographs of the said
                  property showcasing the interior, exterior or the surroundings
                  of the said property. Your photograph will be automatically
                  modified by us by inserting your contact details.
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  6.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  Irrelevant photographs are strictly prohibited, including but
                  not limited to company logo, customised photo, pictures of a
                  gavel, for sale signboards, unique selling point propositions,
                  placing borders and images from magazines. We also do not
                  allow any watermarks on the photographs (including third
                  parties’ logo, name, phone number, email, USP, etc).
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  7.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  We reserve the right to remove any listing, photograph or
                  Content posted by you without notice to you.
                </Text>
              </View>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  4. Guidelines
                </Text>
                {'\n'}
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  The use of this Application is subject to our guidelines. You
                  shall not use, allow, or enable others to use the Application,
                  or knowingly condone use of the Application by others, in any
                  manner that is, attempts to, or is likely to:
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  use any proxy internet protocol addresses (IPs) in order to
                  attempt to hide the use of multiple accounts, disrupt any of
                  our services or to avoid being detected;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  be libellous, defamatory, indecent, vulgar or obscene,
                  pornographic, sexually explicit or sexually suggestive,
                  racially, culturally, or ethnically offensive, harmful,
                  harassing, intimidating, threatening, hateful, objectionable,
                  discriminatory, or abusive, or which may or may appear to
                  impersonate anyone else;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  affect us adversely or reflect negatively on us, the
                  Application, our goodwill, name or reputation or cause duress,
                  distress or discomfort to us or anyone else, or discourage any
                  person from using all or any portion, features or functions of
                  the Application, or from advertising, linking or becoming a
                  supplier to us in connection with the Application;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  send or result in the transmission of junk e-mail, chain
                  letters, duplicative or unsolicited messages, or so-called
                  “spamming” and “phishing”;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  5.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  transmit, distribute or upload programs or material that
                  contain malicious code, such as viruses, timebombs,
                  cancelbots, worms, trojan horses, spyware, or other
                  potentially harmful programs or other material or information;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  6.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  violate any laws, regulations, judicial or governmental order,
                  any treaties or violate or infringe upon any intellectual
                  property rights, rights of publicity or privacy, or any other
                  rights of ours or of any other person;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  7.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  gain unauthorised access to the Application, other users’
                  accounts, names, passwords, personally identifiable
                  information or other computers, websites or pages, connected
                  or linked to the Application or to use the Application in any
                  manner which violates or is inconsistent with the terms and
                  conditions of this Agreement;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  8.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  modify, disrupt, impair, alter or interfere with the use,
                  features, functions, operation or maintenance of the
                  Application or the rights or use and enjoyment of the
                  Application by any other person;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  9.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  collect, obtain, compile, gather, transmit, reproduce, delete,
                  revise, view or display any material or information, whether
                  personally identifiable or not, posted by or concerning any
                  other person, in connection with their or your use of the
                  Application, unless you have obtained the express, prior
                  permission of such other person to do so;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  10.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  “stalk” or otherwise harass another;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  11.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  interfere with other user’s posts;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  12.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  circumvent or manipulate our fee structure, the billing
                  process, or fees owed to us;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  13.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  post or provide false, inaccurate, misleading, incomplete,
                  defamatory or libellous content;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  14.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  take any action that may undermine any ratings system that we
                  may use;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  15.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  transfer your account and user identification to another party
                  without our consent;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  16.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  copy, modify, or distribute (i) content from any websites or
                  (ii) any of our copyright or trade marks;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  17.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  harvest or otherwise collect information about users,
                  including email addresses, without their consent;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  18.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  forge headers, icons or otherwise manipulate identifiers in
                  order to disguise the origin of any Content transmitted
                  through the Application;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  19.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  upload, post, email, transmit or otherwise make available any
                  Content that you do not have a right to make available under
                  any law or under contractual or fiduciary relationships (such
                  as inside information, proprietary and confidential
                  information learned or disclosed as part of employment
                  relationships or under nondisclosure agreements).
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  While we prohibit such conduct and content on our Application,
                  you understand and agree that we cannot be responsible for the
                  Content posted on our Application and you nonetheless may be
                  exposed to such materials and that you use the Application at
                  your own discretion.
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  We do not manually screen content or control before it is
                  displayed on the Application so occasionally users may
                  inadvertently or deliberately submit and display content that
                  breaches this Agreement. This means that you, and not us, are
                  entirely responsible for all content that you upload, post,
                  email, transmit or otherwise make available via the
                  Application.
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You may be exposed to content that is offensive, indecent or
                  objectionable. Under no circumstances, we will be liable in
                  any way for any content, including, but not limited to, any
                  errors or omissions in any Content, or any loss or damage of
                  any kind incurred as a result of the use of any content
                  posted, emailed, transmitted or otherwise made available via
                  the Application.
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  5.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  We reserve the right, in our sole discretion, to reject, edit
                  or refuse to post any Content and to remove any Content from
                  the Application, whether or not the Content is expressly
                  prohibited by this Agreement, or to restrict, suspend, or
                  terminate your access to all or any part of the services at
                  any time, for any or no reason, with or without prior notice,
                  and without liability.
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  6.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You agree to adhere to our guidelines and if you fail to do
                  so, we reserve our right to suspend or terminate your account.
                  We also reserve our rights to introduce, change or amend our
                  guidelines from time to time.
                </Text>
              </View>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  5. Successful Transactions
                </Text>
                {'\n'}
                {'\n'}
                In the event of a successful listing of a property herein and
                parties wish to enter into a tenancy or lease agreement, such
                parties may utilise a sample tenancy or lease agreement provided
                in the Application. You agree that such agreement is a
                non-binding sample and you place no reliance on such sample. You
                are free to amend such sample and you may seek independent legal
                advice before entering into such agreement. You agree that
                SPEEDHOME is not liable for any damages or liability caused,
                whether directly or indirectly, from any error, deficiency or
                omission in such sample or any services provided by the
                Application or SPEEDHOME to facilitate formalisation of the
                parties’ agreement.
              </Text>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  6. Privacy
                </Text>
                {'\n'}
                {'\n'}
                When you use the Application, we will collect, store and use
                certain information as described in our{' '}
                <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>
                  Privacy Policy
                </Text>
                . If you do not agree to such provisions, please do not use the
                Application.
              </Text>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  7. Confidential Information
                </Text>
                {'\n'}
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  We will not disclose or use your personal data or Confidential
                  Information in accordance to the Personal Data Protection Act
                  2012 and likewise, you will not disclose or use our
                  Confidential Information.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  “Confidential Information” means any information disclosed or
                  made available to you by us, directly or indirectly, whether
                  in writing, orally or visually. It includes but is not limited
                  to all information contained within our reporting systems and
                  other performance metrics and any other technical or
                  programming information we disclose or make available to you.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  However, Confidential Information does not include information
                  other than information that:
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  is or becomes publicly known and generally available other
                  than through your action or inaction; or
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  was already in your possession (as documented by written
                  records) without confidentiality restrictions before you
                  received it from us.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You acknowledge, consent and agree that we may access,
                  preserve and disclose your account information and Content if
                  required to do so by law or in a good faith belief that such
                  access preservation or disclosure is reasonably necessary to:
                  (i) comply with legal process; (ii) enforce this Agreement;
                  (iii) respond to claims that any Content violates the rights
                  of third parties; (iv) respond to your requests for customer
                  service; or (v) protect our rights, property or personal
                  safety, our users and the public.
                </Text>
              </View>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  8. Messaging Services
                </Text>
                {'\n'}
                {'\n'}
                The Application allows users to send messages to each other.
                However, the use of the private messaging service is not
                “Private” in the sense that it is a message seen only by the
                sender and receiver. While the message is private from the rest
                of the users, we can view and monitor them.
              </Text>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  9. Liability
                </Text>
                {'\n'}
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You expressly agree that we, our directors, officers,
                  shareholders, employees, representatives, consultants, agents,
                  suppliers, and/or distributors will not be liable for any loss
                  of profits, data or costs of procurement of substitute goods
                  or services, or for any other indirect, special, incidental,
                  punitive, consequential damages arising out of or in
                  connection with this Agreement or other intangible losses,
                  however caused, and under whatever cause of action or theory
                  of liability brought, even if we have been advised of the
                  possibility of such damages, resulting from
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  your access to or use of or inability to access or use the
                  Application;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  any conduct or content of any third party on this Application,
                  including without limitation, any defamatory, offensive or
                  illegal conduct of other users or third parties;
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  any Content obtained from this Application; and
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  unauthorised access, use or alteration of your transmissions
                  or Content, whether based on warranty, contract, tort
                  (including negligence) or any other legal theory, whether or
                  not we have been informed of the possibility of such damage,
                  and even if a remedy set forth herein is found to have failed
                  of its essential purpose.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  5.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  If you are dissatisfied with any aspect of this Application,
                  or with any of these terms of use, your sole and exclusive
                  remedy is to discontinue your access and/or use of this
                  Application. This limitation of liability shall apply to the
                  maximum extent permitted by law.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  6.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You acknowledge that we may not be able to confirm the
                  identity of other registered users or prevent them acting
                  under false pretences or in a manner that infringes the rights
                  of any person.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  7.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You must ensure that your access to this Application and the
                  service is not illegal or prohibited by laws that apply to
                  you.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  8.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You must take your own precautions to ensure that the process
                  that you employ for accessing this Application and our service
                  does not expose you to the risk of viruses, malicious computer
                  code or other forms of interference which may damage your own
                  computer system. We do not accept responsibility for any
                  interference or damage to any computer system that arises in
                  connection with your use of this Application or any linked
                  website.
                </Text>
              </View>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  10. Dispute
                </Text>
                {'\n'}
                {'\n'}
                If you have a dispute with one or more users, you release us
                (and our officers, directors, agents, subsidiaries, joint
                ventures and employees) from claims, demands and damages (actual
                and consequential) of every kind and nature, known and unknown,
                arising out of or in any way connected with such disputes.
                Nevertheless, you may inform us of such dispute for our records
                but we are not responsible resolve or arbitrate or mediate such
                dispute.
              </Text>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  11. Our Intellectual Property Rights
                </Text>
                {'\n'}
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You acknowledge that we own all right, title and interest,
                  including without limitation all Intellectual Property Rights
                  (as defined below), in and to the Application, and that you
                  will not acquire any rights, titles, or interests in or to the
                  Application except as expressly set forth in this Agreement.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You will not modify, adapt, translate, prepare derivative
                  works from, decompile, reverse engineer, disassemble or
                  otherwise attempt to derive source code from any of our
                  services, software, or documentation, or create or attempt to
                  create a substitute or similar service or product through use
                  of or access to the Application or proprietary information
                  related thereto.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You will not remove, obscure, or alter our copyright notice or
                  other proprietary rights notices affixed to or contained in
                  the Application.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  “Intellectual Property Rights” means any and all rights
                  existing from time to time under patent law, copyright law,
                  moral rights law, trade secret law, trade mark law, unfair
                  competition law, publicity rights law, privacy rights law, and
                  any and all other proprietary rights, as well as, any and all
                  applications, renewals, extensions, restorations and
                  reinstatements thereof, now or hereafter in force and effect
                  worldwide.
                </Text>
              </View>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  12. Marketing and Notifications
                </Text>
                {'\n'}
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  This Application may display advertisements and promotions. We
                  will also send you information containing advertisements and
                  promotions of our affiliates and partners. As consideration
                  for access to and use of the Application, you agree that we
                  may place advertising on the Application at our sole
                  discretion. You agree that we may change the manner, mode and
                  extent of advertising on the Application without further
                  notice.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  We will contact you periodically for promotions or information
                  update through email, phone, text messages or social media.
                  You may unsubscribe by contacting us at hello@speedhome.com
                </Text>
              </View>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  13. Indemnity
                </Text>
                {'\n'}
                {'\n'}
                You agree to indemnify, defend and hold us, our agents,
                affiliates, shareholders, subsidiaries, directors, officers,
                employees, and applicable third parties (e.g. syndication
                partners, licensors, licensees, consultants and contractors)
                (collectively “Indemnified Person(s)”) harmless from and against
                any and all third party claims, liability, loss, and expense
                (including damage awards, settlement amounts, and reasonable
                legal fees), brought against any Indemnified Person(s), arising
                out of, related to or which may arise from your use of the
                Application and/or your breach of any term of this Agreement.
              </Text>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  14. Suspension and Termination
                </Text>
                {'\n'}
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  We may suspend or terminate your access to all or any part of
                  the Application at any time, with or without cause, effective
                  immediately. You may terminate your use of the Application at
                  any time, provided that all provisions of this Agreement,
                  which shall survive termination, including, without
                  limitation, ownership provisions, warranty disclaimers,
                  indemnity and limitations of liability.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  We will suspend or terminate your access to the site if you
                  are determined to be, in our sole discretion, a repeat
                  infringer of this Agreement.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  We also reserve the right to suspend or cancel your account
                  that has been inactive for extended periods of time.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  We may, but shall not be obligated to, give you one warning if
                  you have violated this Agreement prior to suspension or
                  termination of your account.
                </Text>
              </View>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  15. After Termination
                </Text>
                {'\n'}
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  In the event that this Agreement terminates for whatsoever
                  reasons, the following shall be applicable:-
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  your access to the Application shall immediately terminate;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  you shall continue to comply with all of the obligations on
                  your part under this Agreement which are not affected by
                  termination;
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  we reserve the right to permanently dispose and delete any
                  data held in the Application without further reference to you;
                  and
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  any claim which either party may have against the other in
                  respect of any breach or non-performance or repudiation of any
                  of the provisions of this Agreement which shall have occurred
                  prior to such termination shall not be affected or prejudiced.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  The terms of Clauses 7 and 13 shall survive termination of
                  this Agreement. If the parties have executed a separate
                  agreement that contains confidentiality terms prior to or
                  contemporaneously with this Agreement, those separate
                  confidentiality terms shall remain in full force to the extent
                  they do not conflict.
                </Text>
              </View>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  16. Modification
                </Text>
                {'\n'}
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  We reserve the right to change our terms and conditions herein
                  from time to time. We may change any or all aspects of
                  services provided by the Application at any time and without
                  notice. Nothing in this Agreement will constrain how we
                  operate our business. You shall be responsible for reviewing
                  and becoming familiar with any such modifications.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  If the alterations constitute a material change to our terms
                  and conditions, we will notify you by posting a notification
                  on this Application. Use of the services by you following such
                  notification constitutes your acceptance of the terms and
                  conditions as modified.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  What constitutes a “material change” will be determined at our
                  sole discretion, in good faith and using common sense and
                  reasonable judgment.
                </Text>
              </View>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  17. General Terms
                </Text>
                {'\n'}
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  This Agreement will be governed by the laws of Malaysia and
                  parties agree that any dispute or claim between you and us
                  will be adjudicated in the courts in Malaysia. Any claim
                  against us arising from the Agreement shall be adjudicated on
                  an individual basis, and shall not be consolidated in any
                  proceeding with any claim or controversy of any other party.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  This Application may contain links to third-party web sites
                  (“Third-Party Sites”) and third-party content (“Third-Party
                  Content”) as a service to those interested in this
                  information. You use links to Third-Party Sites, and any
                  Third-Party Content therein, at your own risk. We do not
                  monitor or have any control over, and make no claim or
                  representation regarding, Third-Party Content or Third-Party
                  Sites. We provide these links only as a convenience, and a
                  link to a Third-Party Site or Third-Party Content does not
                  imply our endorsement, adoption or sponsorship of, or
                  affiliation with, such Third-Party Site or Third-Party
                  Content.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  No agency, partnership, joint venture, employee-employer or
                  franchiser-franchisee relationship is intended or created by
                  this Agreement.
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  If any of these terms and conditions of this Agreement is
                  unenforceable (including any provision in which we exclude our
                  liability to you), the enforceability of any other part of
                  this Agreement will not be affected.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  5.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  You are solely responsible for accessing the information
                  contained on the Application and any reliance you may place on
                  such information is done solely at your own risk. We are not
                  responsible or liable for any loss or damage of any sort
                  incurred as the result of any such dealings or as the result
                  of such information appearing on this Application.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  6.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  In our sole discretion, we may assign this Agreement upon
                  notice to you. Headings are for reference purposes only and do
                  not limit the scope or extent of such section. Our failure to
                  act with respect to a breach by you or others does not waive
                  our right to act with respect to subsequent or similar
                  breaches. We do not guarantee we will take action against all
                  breaches of this Agreement.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  7.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  We do not represent or warrant that:-
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  access to the Application or any part of it, will be
                  uninterrupted, reliable or fault-free; or
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  the Application or any of its contents will be accurate,
                  complete or reliable.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  8.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 5 },
                  ]}
                >
                  We do not guarantee or warrant that the data stored in our
                  server or generated by the Application will be backed up. You
                  shall be responsible for keeping an independent backup of all
                  data stored or generated. You are also responsible for
                  maintaining accurate data. However, in the event that your
                  records do not correspond with our records, the latter shall
                  prevail.
                </Text>
              </View>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  COLLECTION OF INFORMATION
                </Text>
                {'\n'}
                {'\n'}
                This Privacy Policy governs the use of the services (
                <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>
                  “Services“
                </Text>
                ) provided by{' '}
                <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>
                  Speedrent Technology Sdn. Bhd.
                </Text>{' '}
                (Company No:{' '}
                <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>
                  1176587-M
                </Text>
                ) of A-G-23, Eve Suite, Jalan PJU 1a/41, Ara Damansara, 47301
                Petaling Jaya, Selangor, Malaysia (collectively referred as{' '}
                <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>“We”</Text> or{' '}
                <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>“Our”</Text>{' '}
                or <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>“Us”</Text>{' '}
                or{' '}
                <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>
                  “SPEEDHOME”
                </Text>{' '}
                or{' '}
                <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>
                  "Speedrent"
                </Text>
                ). Such Services include, but not limited to, services provided
                by our mobile application (
                <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>
                  “Application”
                </Text>
                ), and online portal such as www.speedrent.com and
                https://speedhome.com (
                <Text style={{ fontFamily: 'OpenSans-SemiBold' }}>
                  “Portal”
                </Text>
                ).
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (1) We collect personal information when you:-
                </Text>
              </Text>

              <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  use the Services,
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  provide comments or submit a problem to us,
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  request information from us and provide your name or return
                  contact information,
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  join any contests or surveys organised by us, or
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  5.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  register an account with us either through manual registration
                  or by connecting your social media accounts like Facebook.
                </Text>
              </View>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (2) We may process personal information such as:-
                </Text>
              </Text>

              <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  name, identity card or passport number, address, mobile
                  number, e-mail address, occupation and nationality;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  information required for the purpose of entering into a
                  tenancy agreement or any property related agreement between
                  you and other users or third parties;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  conversation between you and other users,
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  user behaviour such as information about what you search or
                  read on the Application,
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  5.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  information generated from your participation in our survey or
                  interaction with us in various other ways, such as demographic
                  information, your comments, feedback, question or suggestions
                  and information about a subject that may interest you, and
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  6.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  information such as your device ID and your location when you
                  use the Application.
                </Text>
              </View>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (3) Your personal details are obligatory and if you fail to
                  provide such information, we may not be able to provide you
                  with the Services. We may also process other personal
                  information such as:-
                </Text>
              </Text>

              <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  your activities through the Application and various analytics,
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  transactional history in order to document a transaction you
                  may have had with us or other users; and
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  information collected through the use of Cookies (as defined
                  below).
                </Text>
              </View>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (4) Some of the information collected by us may not be
                  explicitly submitted by you as we also automatically receive
                  and record information on our server logs from your browser,
                  including your IP address, cookie information, the web pages
                  you request, your browser type and language, access times, and
                  the referring web site address.
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (5) If you give us information about another person, you
                  confirm that the other person has appointed you to act on
                  his/her behalf and has agreed that you can:
                </Text>
              </Text>

              <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  give consent on his/her behalf to the processing of his or her
                  personal information;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  receive in his or her behalf any data protection notices; and
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  warrant that you have obtained his/her consent for us to store
                  his or her personal information or have the right to allow us
                  to process his or her personal information.
                </Text>
              </View>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  COOKIES
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (1) “Cookies” are data files that may be downloaded to your
                  computer when you use the Application and permit the
                  Application to identify your computer whenever you use the
                  Application. We use cookies to recognize repeat use by users
                  of the Application and to collect information about our users’
                  interactions with the Application. These cookies contain
                  identification information that enables us to streamline your
                  experiences using the Application.
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (2) We may also use small pieces of code called “web beacons”
                  or “clear gifs” to collect anonymous and aggregate advertising
                  metrics, such as counting page views, promotion views, or
                  advertising responses. A web beacon is an electronic image
                  called a single-pixel or clear GIF. Web beacons can recognize
                  certain types of information, such as a user’s cookie number,
                  time and date of a page view, and description of the page
                  where the web beacon is placed. These web beacons may be used
                  to deliver cookies that conform to our cookie policy.
                </Text>
              </Text>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  USE OF PERSONAL INFORMATION
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (1) In general, other than providing you with the Services and
                  other services incidental or related to the Services, we may
                  use the information provided to us for the following
                  purposes:-
                </Text>
              </Text>

              <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  process and manage the use of the Services,
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  respond to your inquires,;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  create personalized promotions by combining your personal
                  information with non-personal information about you ;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  provide, maintain, protect and improve the Services, to
                  develop new services, and to protect ourselves and our users;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  5.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  enforce any Terms of Use between us;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  6.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  research purposes including historical and statistical
                  purposes;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  7.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  general operation and maintenance of the Application including
                  audit and its related portal(s);
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  8.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  provide you with regular communications (other than direct
                  marketing materials) from us relating to the Services; and
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  9.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  investigation of complaints, suspected suspicious transactions
                  and research for service improvement.
                </Text>
              </View>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  DISCLOSURE OF PERSONAL INFORMATION
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (1) Some of your personal information will be made public.
                  This includes your profile picture, name, location and contact
                  details. We may also share your personal information with:-
                </Text>
              </Text>

              <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  other users when the both of you enters into a transaction;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  our subsidiaries and licensees and our parent and other
                  affiliated companies for the purpose of developing or
                  marketing new products, services or portals that are developed
                  by our related companies and informing you of such new
                  products, services or portals;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  service providers under contract who help with our business
                  operations (such as merchants, partners, fraud investigations,
                  bill collection, monitoring of user behavior, the processing
                  of payments for any products or services, debt collection
                  agencies, legal advisors, accountants and auditors);
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  third parties (including those overseas) who provide data
                  processing services; and
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  5.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  any person, who is under a duty of confidentiality to which
                  has undertaken to keep such data confidential, which we have
                  engaged to fulfill our obligations to you.
                </Text>
              </View>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (2) We may disclose your personal information if required to
                  do so by law or if we have good faith belief that such
                  disclosure is necessary to protect and/or defend our rights
                  and interests. We may, as permitted by applicable law,
                  disclose your personal information to third parties in
                  connection with an investigation of fraud, infringement,
                  piracy, tax avoidance and evasion or other unlawful activity
                  and you expressly authorize us to make such disclosures.
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (3) If we are merged or acquired by another entity, personal
                  information may be transferred to such entity as a part of the
                  merger or acquisition.
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (4) We may extract and share your personal data from and to
                  credit reporting agencies for the purpose of eligibility in
                  renting a property and rental transaction history. We may also
                  share your personal data to debt collecting agencies in the
                  event of a default in any payment.
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (5) You are also aware and agree to give consent to credit
                  reporting agencies to process your credit information
                  including CCRIS and cheque details from BNM.
                </Text>
              </Text>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  GENERAL
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  If this privacy policy changes in any way, it will be updated
                  on this page. Regularly reviewing this page ensures you are
                  updated on the information which is collected, how it is used
                  and under what circumstances, if any, it is shared with other
                  parties. If you wish to make a request access or request
                  correction of the personal information or have any inquiries
                  or complaints in respect of the personal information, please
                  contact us at:
                </Text>
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  Email:
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                      color: 'blue',
                    },
                  ]}
                >
                  hello@speedhome.com
                </Text>
              </View>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  PENGUMPULAN MAKLUMAT
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (1) Kami akan mengumpul maklumat peribadi apabila anda:-
                </Text>
              </Text>

              <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  menggunakan Perkhidmatan-perkhidmatan tersebut;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  memberikan komen-komen atau mengemukakan masalah kepada kami;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  meminta maklumat dari kami dan memberi nama anda atau maklumat
                  perhubungan; atau
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  menyertai apa-apa peraduan-peraduan atau kaji selidik yang
                  kami anjurkan; atau
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  5.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  mendaftar dengan kami sama ada secara manual atau
                  menghubungkan akaun sosial media anda seperti Facebook.
                </Text>
              </View>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (2) Kami mungkin memproses maklumat peribadi seperti:-
                </Text>
              </Text>

              <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  nama, nombor kad pengenalan atau pasport, alamat, nombor
                  telefon, alamat emel , pekerjaan dan wargenegara;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  maklumat yang dikehendaki untuk tujuan membuat suatu
                  perjanjian penyewaan atau apa-apa perjanjian berkaitan dengan
                  harta antara anda dan pengguna-pengguna atau pihak ketiga yang
                  lain;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  perbualan antara anda dan pengguna-pengguna lain,
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  tingkah laku pengguna seperti maklumat tentang apa yang anda
                  cari atau membaca pada Aplikasi tersebut,
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  5.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  maklumat yang diperoleh dari penyertaan anda dalam kaji
                  selidik kami atau dengan pelbagai cara berinteraksi dengan
                  kami, seperti maklumat demografi, komen-komen, maklum balas,
                  pertanyaan atau cadangan-cadangan dan maklumat tentang subjek
                  yang mungkin anda minati, dan
                </Text>
              </View>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (3) Maklumat peribadi anda adalah wajib dan jika anda gagal
                  untuk memberikan maklumat tersebut, kami mungkin tidak boleh
                  membekalkan anda dengan Perkhidmatan. Kami mungkin memproses
                  maklumat peribadi yang lain seperti: –
                </Text>
              </Text>

              <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  aktiviti-aktiviti anda di Aplikasi,
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  sejarah transaksi untuk mendokumentasikan transaksi anda yang
                  mungkin anda telah buat dengan kami atau pengguna-pengguna
                  lain; dan
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  maklumat yang dikumpul melalui penggunaan Cookies (seperti
                  yang ditakrifkan di bawah).
                </Text>
              </View>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (4) Sebahagian maklumat yang dikumpul oleh kami mungkin tidak
                  diserahkan kepada kami secara tersurat oleh anda kerana kami
                  juga menerima dan merekodkan maklumat secara automatik pada
                  log pelayan daripada pelayar anda, termasuk alamat IP anda,
                  cookie, laman web yang diminta oleh anda, jenis pelayar anda
                  dan bahasa, masa akses, dan alamat laman web yang merujuk.
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (5) Jika anda memberikan kami maklumat mengenai orang lain,
                  anda mengesahkan bahawa orang tersebut telah melantik anda
                  untuk bertindak bagi pihak mereka dan telah bersetuju bahawa
                  anda boleh:
                </Text>
              </Text>

              <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  memberi keizinan bagi pihak mereka untuk pemprosesan maklumat
                  peribadi tersebut;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  menerima bagi pihak mereka apa-apa notis perlindungan data;
                  dan
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  menjamin bahawa anda telah mendapat persetujuan mereka untuk
                  membenarkan kami untuk menyimpan maklumat peribadi tersebut
                  atau mempunyai hak untuk membenarkan kami untuk memproses
                  maklumat peribadi tersebut.
                </Text>
              </View>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  COOKIES DAN WEB BEACON
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (1) “Cookie” adalah fail data yang mungkin dimuat turun ke
                  komputer anda apabila anda menggunakan Aplikasi dan
                  membenarkan Aplikasi tersebut mengenal pasti komputer anda
                  apabila anda menggunakan Aplikasi tersebut. Kami menggunakan
                  cookies untuk mengiktiraf penggunaan ulangan oleh pengguna dan
                  untuk mengumpul maklumat tentang interaksi pengguna kami
                  dengan Aplikasi. Cookies ini mengandungi maklumat pengenalan
                  diri yang membolehkan kami menyelaraskan pengalaman anda
                  semasa menggunakan Aplikasi ini.
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (2) Kami juga mungkin menggunakan kod yang dipanggil “web
                  beacon” atau “clear gifs” untuk mengumpul agregat metrik
                  pengiklanan yang tidak bernama (anonymous), seperti mengira
                  layaran halaman, layaran promosi atau respons pengiklanan. Web
                  beacon adalah imej elektronik yang dipanggil piksel-tunggal
                  atau clear gifs. Web beacon boleh mengenal pasti jenis
                  maklumat-maklumat yang tertentu, seperti nombor cookie
                  pengguna, masa dan tarikh halaman dilayari serta perihalan
                  halaman di mana web beacon itu terletak. Web beacon ini
                  mungkin digunakan untuk menyampaikan cookies yang mematuhi
                  dasar cookie kami.
                </Text>
              </Text>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  PENGGUNAAN MAKLUMAT PERIBADI
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (1) Secara umum, selain daripada membekalkan anda dengan
                  Perkhidmatan dan perkhidmatan-perkhidmatan lain yang
                  bersampingan atau berkaitan degan Perkhidmatan tersebut, kami
                  mungkin menggunakan maklumat yang diberikan kepada kami untuk
                  tujuan-tujuan yang berikut: –
                </Text>
              </Text>

              <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  memproses dan mengurus penggunaa Perkhidmatan;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  membalas pertanyaan-pertanyaan anda;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  mencipta promosi tersendiri dengan menggabungkan maklumat
                  peribadi anda dengan maklumat bukan peribadi anda;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  memberi, mengekalkan, melindungi dan menaiktaraf Perkhidmatam,
                  untuk membangunkan perkhidmatan-perkhidmatan baru, dan untuk
                  melindungi diri sendiri dan pengguna-pengguna kami;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  5.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  menguatkuasakan mana-mana Terma-terma Penggunaan antara kami;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  6.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  tujuan penyelidikan termasuk tujuan-tujuan sejarah dan
                  statistik;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  7.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  urusan dan penyelenggaraan umum Aplikasi termasuk audit dan
                  portal(-portal) yang berkaitan;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  8.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  memberi anda komunikasi biasa (selain daripada bahan-bahan
                  pemasaran langsung) dari kami berkaitan dengan Perkhidmatan;
                  dan
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  9.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  menyiasat aduan-aduan, urus niaga yang mencurigakan dan
                  penyelidikan untuk penambahbaikan perkhidmatan.
                </Text>
              </View>
            </View>

            <View style={{ marginRight: 20, marginLeft: 20 }}>
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  PENDEDAHAN MAKLUMAT PERIBADI
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (1) Sebahagian daripada maklumat peribadi anda akan didedahkan
                  kepada umum. Ini termasuk gambar profil anda, nama, lokasi dan
                  maklumat perhubungan. Kami mungkin akan mengkongsi maklumat
                  tentang anda dengan:-
                </Text>
              </Text>

              <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  1.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  pengguna lain apabila kedua-dua daripada kamu masuk ke dalam
                  urus niaga;
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  2.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  anak-anak syarikat atau pemegang-pemegang lesen kami dan
                  syarikat induk kami serta gabungan lain yang bertujuan untuk
                  membangun atau memasar produk–produk baru,
                  perkhidmatan-perkhidmatan, atau portal-portal yang telah
                  dibangun oleh syarikat-syarikat yang berkaitan dengan kami dan
                  maklumkam anda tentang produk-produk baru, perkhidmatan atau
                  portal-portal
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  3.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  pembekal-pembekal perkhidmatan di bawah kontrak yang membantu
                  operasi perniagaan kami (seperti agensi-agensi kutipan hutang,
                  penasihat-penasihat undang-undang, akauntan dan juruaudit,
                  memantau tingkah laku pengguna di atas portal dan proses
                  pembayaran untuk mana mana produk-produk atau
                  perkhidmatan-perkhidmatan);
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  4.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  pihak ketiga (termasuk yang diluar negara) yang menyediakan
                  perkhidmatan pemprosesan data; dan
                </Text>
              </View>

              <View
                style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15), marginLeft: 20 },
                  ]}
                >
                  5.
                </Text>
                <Text
                  style={[
                    styles.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(15),
                      marginRight: 20,
                      marginLeft: 5,
                    },
                  ]}
                >
                  mana-mana orang yang berada di bawah kewajipan kerahsiaan yang
                  telah diamanahkan untuk menyimpan data secara sulit, yang kami
                  telah lantik untuk memenuhi tanggungjawab kami kepada anda.
                </Text>
              </View>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (2) Kami mungkin mendedahkan maklumat peribadi anda jika perlu
                  untuk berbuat demikian oleh undang-undang atau jika kami
                  mempunyai kepercayaan yang baik bahawa pendedahan sedemikian
                  adalah perlu untuk melindungi dan/atau mempertahankan hak-hak
                  dan kepentingan kami. Kami mungkin sebagaimana yang dibenarkan
                  oleh undang-undang yang berkenaan, mendedahkan maklumat
                  peribadi anda kepada pihak ketiga berkaitan dengan sesuatu
                  penyiasatan penipuan, pelanggaran, cetak rompak, mengelakkan
                  cukai dan pengelakan atau aktiviti yang menyalahi
                  undang-undang lain dan anda secara nyata memberi kuasa kepada
                  kami untuk membuat apa-apa pendedahan.
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (3) Jika kami bergabung atau diperolehi oleh entiti yang lain,
                  maklumat peribadi anda mungkin dipindahkan kepada entiti itu
                  sebagai sebahagian daripada penggabungan atau pengambilalihan.
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  (4) Kami mungkin memperolehi dan mengongsi data peribadi anda
                  dari dan kepada agensi-agensi pelaporan kredit untuk mereka
                  menyimpan sejarah transaksi dan kredit profil untuk menyewa
                  rumah. Kami juga mungkin mengongsi data peribadi anda kepada
                  agensi-agensi kutipan hutang sekiranya berlaku keingkaran
                  dalam apa-apa bayaran.
                </Text>
              </Text>
            </View>

            <View
              style={{
                marginRight: 20,
                marginLeft: 20,
                paddingBottom: Matrics.ScaleValue(100),
              }}
            >
              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 30 },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#00B1C8',
                    fontSize: 16,
                  }}
                >
                  AM
                </Text>
              </Text>

              <Text
                style={[
                  styles.bytapText,
                  { fontSize: Matrics.ScaleValue(15), marginTop: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.bytapText,
                    { fontSize: Matrics.ScaleValue(15) },
                  ]}
                >
                  Jika terdapat perubahan dasar privasi ini dalam apa jua cara,
                  kami akan dikemaskini halaman ini. Dengan sering melayari
                  halaman ini, anda akan dimaklumkan dengan maklumat tentang
                  maklumat yang kami dikumpul, cara ia digunakan dan dalam
                  keadaan tertentu, jika ada, ia dikongsi bersama pihak yang
                  lain. Jika anda ingin membuat permintaan akses atau pembetulan
                  maklumat peribadi atau mempunyai apa-apa soalan atau aduan
                  berkenaan dengan maklumat peribadi, sila hubungi kami di:
                </Text>
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}
