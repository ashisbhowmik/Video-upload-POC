import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  isLoading: true,
  signupResponse: {},
  VideoResponse:{}
};

const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    //register

    tokenRequest(state, action) {
      state.status = action.type;
    },
    tokenSuccess(state, action) {
      state.token = action.payload;
      state.status = action.type;
      state.isLoading = false;
    },
    tokenFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    signupRequest(state, action) {
      state.status = action.type;
    },
    signupSuccess(state, action) {
      state.signupResponse = action.payload;
      state.status = action.type;
    },
    signupFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    VideoRequest(state, action) {
      state.status = action.type;
    },
    VideoSuccess(state, action) {
      state.VideoResponse = action.payload;
      state.status = action.type;
    },
    VideoFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
  },
});

export const {
  signupRequest,
  signupSuccess,
  signupFailure,
  tokenRequest,
  tokenSuccess,
  tokenFailure,
  VideoRequest,
  VideoSuccess,
  VideoFailure
} = AuthSlice.actions;
export default AuthSlice.reducer;
