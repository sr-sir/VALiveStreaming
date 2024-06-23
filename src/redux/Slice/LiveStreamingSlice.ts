// src/store/liveStreamingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreateLiveStreamingRequest } from '../../models/LiveStreaming/CreateLiveStreamingRequest';
import { LiveStreamingInfo } from '../../models/LiveStreaming/LiveStreamingInfo';
import { SessionInfo } from '../../models/LiveStreaming/SessionInfo';
import { DisplayTime } from '../../models/LiveStreaming/DisplayTime';

const initialState: CreateLiveStreamingRequest = {
  liveStreamingInfo: {
    Id: '',
    LiveStreamingName: '',
    Description: '',
    StartTime: null,
    EndTime: null,
    LiveStreamingFlowName: '',
    Platform: '',
    Url1: '',
    Url2: '',
    SceneImage: '',
    MarkerImage: '',
    AdsImage: '',
    CompositeImage: '',
    Created: null,
    Updated: null,
  },
  sessionInfos: [],
  displayTimes: [],
};

const liveStreamingSlice = createSlice({
  name: 'liveStreaming',
  initialState,
  reducers: {
    setLiveStreamingInfo(state, action: PayloadAction<LiveStreamingInfo>) {

      state.liveStreamingInfo = {
        ...action.payload,
        StartTime: action.payload.StartTime ? action.payload.StartTime.toString() : '',
        EndTime: action.payload.EndTime ? action.payload.EndTime.toString() : '',
        Created: action.payload.Created ? action.payload.Created.toString() : '',
        Updated: action.payload.Updated ? action.payload.Updated.toString() : '',
      };
    },
    setSessionInfos(state, action: PayloadAction<SessionInfo[]>) {
      state.sessionInfos = action.payload;
    },
    setDisplayTimes(state, action: PayloadAction<DisplayTime[]>) {
      state.displayTimes = action.payload;
    },
    resetLiveStream() {
      return initialState;
    },
  },
});

export const { setLiveStreamingInfo, setSessionInfos, setDisplayTimes, resetLiveStream } = liveStreamingSlice.actions;
export default liveStreamingSlice.reducer;
