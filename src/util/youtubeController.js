import React from 'react'
import { Dimensions, View, Text, Platform, AppState } from 'react-native'
const { width } = Dimensions.get('window')
import YouTube from 'react-native-youtube'
import YoutubePlayer from 'react-native-yt-player'

class YouTubeComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ready1: false,
      stateValue1: '',
      ready2: false,
      stateValue2: '',
      appState: AppState.currentState
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (Platform.OS == 'ios') {
      if (this.props !== nextProps) {
        if (this.props.position !== nextProps.position) {
          if (nextProps.arrImages && nextProps.arrImages.length > 0) {
            if (
              nextProps.arrImages[nextProps.position] &&
              nextProps.arrImages[nextProps.position - 1].url.indexOf(
                nextProps.videoId
              ) !== -1
            ) {
              // if (this.player1) this.player1.playVideo();
            } else {
              if (this.player1) this.player1.pauseVideo()
            }
          } else {
            if (this.player1) this.player1.pauseVideo()
          }
        }
        return true
      }
    }
    // if (this.state !== nextState) {
    // 	return true;
    // }
    return false
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!')
    }
    this.setState({ appState: nextAppState })
  }

  renderAndroidYoutubePlayer() {
    return (
      this.state.appState === 'active' && (
        <YouTube
          ref={(ref) => (this.player2 = ref)}
          apiKey='AIzaSyAl5d8dLtyBb0f068umOnyRVFgZBuGBRZw'
          videoId={this.props.videoId}
          origin='https://www.youtube.com'
          showinfo={false}
          controls={1}
          showFullscreenButton={false}
          fullscreen={false} // control whether the video should play in fullscreen or inline
          loop={true} // control whether the video should loop when ended
          style={{ width, height: 250 }}
          onError={(e) => console.log('youtube error->', e)}
          onReady={(e) => this.setState({ ready1: true })}
          onChangeState={(e) => this.setState({ stateValue1: e })}
        />
      )
    )
  }
  renderIOSYoutubePlayer() {
    // console.log('inside')
    return (
      <YoutubePlayer
        ref={(ref) => (this.player1 = ref)}
        style={{ width: 50 }}
        loop={false}
        videoId={this.props.videoId}
        autoPlay={false}
        showFullScreenButton={false}
        onStart={() => console.log('onStart')}
      />
    )
  }

  render() {
    return this.props.videoId !== null ? (
      Platform.OS == 'ios' ? (
        this.renderIOSYoutubePlayer()
      ) : (
        this.renderAndroidYoutubePlayer()
      )
    ) : (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text> The video doesn&apos;t load properly </Text>
      </View>
    )
  }
}

export default YouTubeComponent
