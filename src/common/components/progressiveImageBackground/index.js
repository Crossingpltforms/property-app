/**
 * Functional common component to show image with placeholder while loading original image
 * @param {style, source, resizeMode} props
 */
import React from 'react'
import { ImageBackground } from 'react-native'

const PlaceHolderImage = require('../../../../Images/property_image_loading.gif')

const ProgressiveImageBackground = (props) => {
  const [showDefault, changeShowDefault] = React.useState(true)
  const [error, setError] = React.useState(false)
  const {
    source = {},
    style = {},
    resizeMode = 'cover',
    testID = '',
    imageStyle = {},
  } = props
  const image = showDefault
    ? PlaceHolderImage
    : error
    ? PlaceHolderImage
    : source
  return (
    <ImageBackground
      style={style}
      testID={testID}
      source={image}
      imageStyle={imageStyle}
      onLoadEnd={() => changeShowDefault(false)}
      onError={() => setError(true)}
      resizeMode={resizeMode}
    >
      {props.children}
    </ImageBackground>
  )
}

export default ProgressiveImageBackground
