import createSagaMiddleware from 'redux-saga'
import { configureStore } from "@reduxjs/toolkit";
import logger from 'redux-logger';
import AuthReducer from './Reducers/AuthReducer'
import RootSaga from './Saga/RootSaga';
let sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware, logger]
export default configureStore({
    reducer: {
        AuthReducer: AuthReducer,
    },
    middleware
})
sagaMiddleware.run(RootSaga);