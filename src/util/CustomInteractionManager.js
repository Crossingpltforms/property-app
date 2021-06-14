import { InteractionManager } from 'react-native'

export default {
  ...InteractionManager,
  runAfterInteractions: (func) => {
    let called = false
    const timeout = setTimeout(() => {
      called = true
      func()
    }, 500)
    InteractionManager.runAfterInteractions(() => {
      if (called) return
      clearTimeout(timeout)
      func()
    })
  }
}
