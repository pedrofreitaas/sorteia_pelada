import {MainScreen} from './screens/MainScreen.js';
import { NotDefinedScreen } from './screens/ErrorScreen.js'

export default function App() {
  try {
    return (<MainScreen></MainScreen>);
  }

  catch(error) {
    return (<NotDefinedScreen></NotDefinedScreen>);
  }
}