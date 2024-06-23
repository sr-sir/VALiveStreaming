import { DisplayTime } from "../LiveStreaming/DisplayTime";
import { VirtualAdsInfo } from "./VirtualAdsInfo";

export interface CreateVirtualAdsRequest {
    virtualAdsInfo: VirtualAdsInfo;
    displayTimes: DisplayTime[];
}