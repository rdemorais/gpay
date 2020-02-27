import Reactotron from 'reactotron-react-native'

const tron = Reactotron.configure()
  .useReactNative()
  .connect()
  .configure({ host: 'localhost' })

tron.clear()

console.tron = tron

// host ip Local
// adb reverse tcp:9090 tcp:9090
