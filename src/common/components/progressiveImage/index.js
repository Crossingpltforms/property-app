/**
 * Functional common component to show image with placeholder while loading original image
 * @param {style, source, resizeMode} props
 */
import React from 'react'
import { Image } from 'react-native'

const PlaceHolderImage = require('../../../../Images/property_image_loading_png.png')

const ProgressiveImage = props => {
  const [showDefault, changeShowDefault] = React.useState(true)
  const [error, setError] = React.useState(false)
  const { source = {}, style = {}, resizeMode = 'cover', testID = '' } = props
  const image = showDefault
    ? PlaceHolderImage
    : error
    ? PlaceHolderImage
    : source

  return (
    <Image
      style={style}
      testID={testID}
      source={image}
      onLoadEnd={() => changeShowDefault(false)}
      onError={() => setError(true)}
      resizeMode={resizeMode}
    />
  )
}

export default ProgressiveImage
