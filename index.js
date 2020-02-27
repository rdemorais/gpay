/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import './ReactotronConfig';
import App from './GPayApp';

import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
