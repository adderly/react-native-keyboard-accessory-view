import * as React from 'react'
import {
  Dimensions,
  Keyboard,
  KeyboardEvent,
  LayoutAnimation,
} from 'react-native'

export const useKeyboardDimensions = () => {
  const [keyboardEndPositionY, setKeyboardEndPositionY] = React.useState(
    Dimensions.get('screen').height
  )
  const [keyboardHeight, setKeyboardHeight] = React.useState(0)

  React.useEffect(() => {
    Keyboard.addListener('keyboardWillChangeFrame', updateDimensions)

    return () => {
      Keyboard.removeAllListeners('keyboardWillChangeFrame')
    }
  })

  const updateDimensions = (event: KeyboardEvent) => {
    const { height } = Dimensions.get('screen')
    const { duration, easing, endCoordinates } = event

    const newKeyboardHeight = height - endCoordinates.screenY

    if (newKeyboardHeight === keyboardHeight) {
      return
    }

    if (duration && easing) {
      LayoutAnimation.configureNext({
        // We have to pass the duration equal to minimal accepted duration defined here: RCTLayoutAnimation.m
        duration: duration > 10 ? duration : 10,
        update: {
          duration: duration > 10 ? duration : 10,
          type: LayoutAnimation.Types[easing],
        },
      })
    }

    setKeyboardEndPositionY(endCoordinates.screenY)
    setKeyboardHeight(newKeyboardHeight)
  }

  return { keyboardEndPositionY, keyboardHeight }
}
