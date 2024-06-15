import { takeLatest, select, put, call } from 'redux-saga/effects';
import {
  signupSuccess,
  signupFailure,
  tokenSuccess,
  VideoSuccess,
  VideoFailure,
} from '../Reducers/AuthReducer';
import { getApi, postApi} from '../../Utils/Helpers/ApiRequest';
import showErrorAlert from '../../Utils/Helpers/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
export function* gettokenSaga() {
  try {
    const response = yield call(AsyncStorage.getItem, constants.TOKEN);
    console.log(response);

    if (response != null) {
      yield put(tokenSuccess(response));
    } else {
      yield put(tokenSuccess(null));
    }
  } catch (error) {
    yield put(tokenFailure(error));
  }
}
export function* signupSaga(action) {
  // console.log('hi-----------',action);
  // let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkX2F0IjoxNzE2OTczMjM0LCJ2YWxpZF9mb3IiOjE4MDAsInVzZXJfaWQiOiI0MzE3MCIsImFjY2VzcyI6ImZ1bGwifQ.nU5jjA_L6TuVN7fGvLQJYOyypUuucYSCEUXHUOTHDqo",
  };
  try {
    let response = yield call(postApi, 'initUp',action.payload, header);
    // `${API_URL}?_page=${page}&_limit=10`
    // console.log('sign up response: ', response);
    // console.log('sign up response: ', response?.data?.response);

    if (response?.status == 200) {
      yield put(signupSuccess(response?.data?.response));
      // showErrorAlert("Video 1st api will called ");
    } else {
      yield put(signupFailure(response?.data));
      showErrorAlert("Data not found");
    }
  } catch (error) {
    // console.log('signup error:', error);
    yield put(signupFailure(error));
    showErrorAlert("Data not found");
  }
}

export function* Videosaga(action) {
  // console.log('hi-----------',action);
  // let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkX2F0IjoxNzE2OTczMjM0LCJ2YWxpZF9mb3IiOjE4MDAsInVzZXJfaWQiOiI0MzE3MCIsImFjY2VzcyI6ImZ1bGwifQ.nU5jjA_L6TuVN7fGvLQJYOyypUuucYSCEUXHUOTHDqo",
  };
  // const partObjectsArray = [];
  try {
    let response = yield call(postApi, 'getUpUrl',action.payload, header);
    // `${API_URL}?_page=${page}&_limit=10`
    console.log('amazon response: ========= ', response);
    // console.log('sign up response: ', response?.data?.response);

    // if (response?.status == 200) {
    //   yield put(VideoSuccess(response?.data?.response));
    //   showErrorAlert("Video get api will called ");
    // } else {
    //   yield put(VideoFailure(response?.data));
    //   showErrorAlert("Data not found");
    // }
  } catch (error) {
    // console.log('signup error:', error);
    yield put(VideoFailure(error));
    showErrorAlert("Data not found");
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest('Auth/signupRequest', signupSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/tokenRequest', gettokenSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/VideoRequest', Videosaga);
  })(),
];

export default watchFunction;
