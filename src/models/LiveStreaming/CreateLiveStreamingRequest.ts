import { DisplayTime } from "./DisplayTime";
import { LiveStreamingInfo } from "./LiveStreamingInfo";
import { SessionInfo } from "./SessionInfo";

export interface CreateLiveStreamingRequest {
    liveStreamingInfo: LiveStreamingInfo;
    sessionInfos: SessionInfo[];
    displayTimes: DisplayTime[];
}