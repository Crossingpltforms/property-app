import React, { useRef } from 'react'
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native'
import Animated, {
  Value,
  add,
  and,
  call,
  clockRunning,
  cond,
  divide,
  eq,
  floor,
  multiply,
  neq,
  not,
  onChange,
  set,
  sub,
  useCode
} from 'react-native-reanimated'
import {
  clamp,
  snapPoint,
  timing,
  translate as translateVector,
  useClock,
  usePanGestureHandler,
  usePinchGestureHandler,
  useValue,
  vec
} from 'react-native-redash'
import {
  PanGestureHandler,
  PinchGestureHandler,
  State
} from 'react-native-gesture-handler'
import { CANVAS, usePinch } from './AnimationUtil'

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black'
  },
  pictures: {
    flexDirection: 'row',
    height
  },
  picture: {
    width,
    height,
    overflow: 'hidden'
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: '100%',
    resizeMode: 'cover'
  }
})

const Swipper = (props) => {
  const index = useValue(0)

  const pinchRef = useRef(null)
  const panRef = useRef(null)

  const pan = usePanGestureHandler()
  const pinch = usePinchGestureHandler()

  const scale = useValue(1)
  const translate = vec.createValue(0, 0)

  const clock = useClock()
  const offsetX = useValue(0)
  const translationX = useValue(0)
  const translateX = useValue(0)

  const minVec = vec.min(vec.multiply(-0.5, CANVAS, sub(scale, 1)), 0)
  const maxVec = vec.max(vec.minus(minVec), 0)
  usePinch({ pan, pinch, translate, scale, minVec, maxVec, translationX })

  const snapTo = clamp(
    snapPoint(
      translateX,
      pan.velocity.x,
      props.imageData.map((_, i) => -width * i)
    ),
    multiply(add(index, 1), -width),
    multiply(sub(index, 1), -width)
  )
  useCode(
    () => [
      onChange(
        translationX,
        cond(eq(pan.state, State.ACTIVE), [
          set(translateX, add(offsetX, translationX))
        ])
      ),
      cond(and(eq(pan.state, State.END), neq(translationX, 0)), [
        set(translateX, timing({ clock, from: translateX, to: snapTo })),
        set(offsetX, translateX),
        cond(not(clockRunning(clock)), [
          vec.set(translate, 0),
          set(scale, 1),
          set(index, floor(divide(translateX, -width)))
        ])
      ])
    ],
    [index]
  )

  return (
    <PinchGestureHandler
      ref={pinchRef}
      simultaneousHandlers={panRef}
      {...pinch.gestureHandler}
      minPointers={2}
      maxPointers={2}
    >
      <TouchableWithoutFeedback
        onPress={() => {}}
        accessible={true}
        accessibilityLabel='lightBoxImagePanGestureBtn'
      >
        <Animated.View style={StyleSheet.absoluteFill}>
          <PanGestureHandler
            ref={panRef}
            minDist={10}
            avgTouches
            simultaneousHandlers={pinchRef}
            {...pan.gestureHandler}
            minPointers={1}
            maxPointers={1}
          >
            <Animated.View style={styles.container}>
              <Animated.View
                style={[
                  styles.pictures,
                  {
                    width: width * props.imageData.length,
                    transform: [{ translateX }]
                  }
                ]}
              >
                {props.imageData.map((source, i) => {
                  const isActive = eq(index, i)
                  return (
                    <View key={i} style={styles.picture}>
                      <TouchableWithoutFeedback
                        accessible={true}
                        accessibilityLabel='lightBoxImagePanGestureBtn2'
                      >
                        <Animated.Image
                          style={[
                            styles.image,
                            {
                              transform: [
                                {
                                  translateX: cond(isActive, translate.x, 0)
                                },
                                {
                                  translateY: cond(isActive, translate.y, 0)
                                },
                                { scale: cond(isActive, scale, 1) }
                              ]
                            }
                          ]}
                          source={{ uri: source.url }}
                        />
                      </TouchableWithoutFeedback>
                      <View
                        style={{
                          position: 'absolute',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          height: 30,
                          width: 50,
                          borderRadius: 15,
                          marginLeft: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: -50,
                          position: 'absolute',
                          bottom: '16%',
                          left: 10,
                          zIndex: 1
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#FFF',
                            fontFamily: 'OpenSans-SemiBold'
                          }}
                        >
                          {i + 1}/{props.imageData.length}
                        </Text>
                      </View>
                    </View>
                  )
                })}
              </Animated.View>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </TouchableWithoutFeedback>
    </PinchGestureHandler>
  )
}

export default Swipper
