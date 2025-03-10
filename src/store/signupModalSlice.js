import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSignupModalOn: false,
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
  },
});

export const { setSignupModalOn, setSignupModalOff } = signupModalSlice.actions;
export const getSignupModalStatus = state => state.signupModal.isSignupModalOn;
export default signupModalSlice.reducer;
