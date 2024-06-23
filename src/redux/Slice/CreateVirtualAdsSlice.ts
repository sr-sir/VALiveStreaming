// src/store/virtualAdsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreateVirtualAdsRequest } from '../../models/VirtualAds/CreateVirtualAdsRequest';
import { VirtualAdsInfo } from '../../models/VirtualAds/VirtualAdsInfo';
import { DisplayTime } from '../../models/LiveStreaming/DisplayTime';

const initialState: CreateVirtualAdsRequest = {
  virtualAdsInfo: {
    Id: '',
    CampaignName: '',
    Description: '',
    LiveStreamingId: '',
    ImageUrl: [],
    DisplayTimeId: [],
    Created: null,
    Updated: null,
    SessionIds: [],
    DisplayTimeIds: []
  },
  displayTimes: [],
};

const virtualAdsSlice = createSlice({
  name: 'virtualAds',
  initialState,
  reducers: {
    setVirtualAdsInfo(state, action: PayloadAction<VirtualAdsInfo>) {
      state.virtualAdsInfo = action.payload;
    },
    setDisplayTimes(state, action: PayloadAction<DisplayTime[]>) {
      state.displayTimes = action.payload;
    },
    resetVirtualAdsState() {
      return initialState;
    },
  },
});

export const { setVirtualAdsInfo, setDisplayTimes, resetVirtualAdsState } = virtualAdsSlice.actions;
export default virtualAdsSlice.reducer;
