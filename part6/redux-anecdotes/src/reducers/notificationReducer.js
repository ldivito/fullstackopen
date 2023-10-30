import {createSlice} from "@reduxjs/toolkit";

const notificationReducer = createSlice({
  name: 'notifications',
  initialState: 'Default notification',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      return ''
    }
  }
})

export const {setNotification, clearNotification} = notificationReducer.actions
export default notificationReducer.reducer