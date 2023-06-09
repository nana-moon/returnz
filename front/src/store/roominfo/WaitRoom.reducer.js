/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  roomId: null,
  captainName: null,
  memberCount: null,
  waiterList: [{ memberId: null, username: null, nickname: null, profileIcon: null, avgProfit: null }],
  theme: 'UNKNOWN',
  custom: {
    turnPerTime: 'NO',
    startTime: null,
    totalTurn: null,
    memberIdList: [],
  },
};

export const waitRoom = createSlice({
  name: 'waitRoom',
  initialState,
  reducers: {
    setWaitRoomId(state, action) {
      state.roomId = action.payload;
    },
    setCaptainName(state, action) {
      state.captainName = action.payload;
    },
    setMemberCount(state, action) {
      state.memberCount = action.payload;
    },
    setWaiterList(state, action) {
      state.waiterList = action.payload;
    },
    addWaiter(state, action) {
      state.waiterList.push(action.payload);
    },
    removeWaiter(state, action) {
      state.waiterList = state.waiterList.filter((waiter) => {
        return waiter.username !== action.payload;
      });
    },
    setTheme(state, action) {
      console.log('theme update', action.payload);
      state.theme = action.payload;
    },
    setCustom(state, action) {
      console.log('custom update', action.payload);
      state.custom = action.payload;
    },
    resetWaitRoom(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setWaitRoomId,
  setCaptainName,
  setMemberCount,
  setWaiterList,
  addWaiter,
  removeWaiter,
  setTheme,
  setCustom,
  resetWaitRoom,
} = waitRoom.actions;
export default waitRoom;
