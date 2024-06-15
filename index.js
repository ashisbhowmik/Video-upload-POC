/**
 * @format
 */



import React from 'react';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import Store from './src/Redux/Store';

LogBox.ignoreAllLogs();
LogBox.ignoreLogs([
    "Require cycle: node_modules/victory",
]);

const LearningApp = () => {
    return (
        <Provider store={Store}>
            <App/>
        </Provider>
    );
}

AppRegistry.registerComponent(appName, () => LearningApp);
