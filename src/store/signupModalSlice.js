import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSignupModalOn: false,
  isSigninModalOn: false,
};

const signupModalSlice = createSlice({
  name: 'signupModal',
  initialState,
  reducers: {
    setSignupModalOn: state => {
      state.isSignupModalOn = true;
    },
    setSignupModalOff: state => {
      state.isSignupModalOn = false;
    },
    setSigninModalOn: state => {
      state.isSigninModalOn = true;
    },
    setSigninModalOff: state => {
      state.isSigninModalOn = false;
    },
  },
});

export const { setSignupModalOn, setSignupModalOff, setSigninModalOn, setSigninModalOff } =
  signupModalSlice.actions;
export const getSignupModalStatus = state => state.signupModal.isSignupModalOn;
export const getSigninModalStatus = state => state.signupModal.isSigninModalOn;
export default signupModalSlice.reducer;
