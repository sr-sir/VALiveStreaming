// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import liveStreamingReducer from './Slice/LiveStreamingSlice';
import virtualAdsReducer from './Slice/CreateVirtualAdsSlice';

const store = configureStore({
  reducer: {
    liveStreaming: liveStreamingReducer,
    virtualAds: virtualAdsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
