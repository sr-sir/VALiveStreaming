import { CreateLiveStreamingRequest } from '../models/LiveStreaming/CreateLiveStreamingRequest';
import { LiveStreamingUrl } from './Endpoints';
import ServerHttp from './ServerHttp';


const createLiveStreaming = async (createLiveStreamingRequest: CreateLiveStreamingRequest) => {
    try {
        const url = `${LiveStreamingUrl}/CreateLiveStreaming`;
        return await ServerHttp.post(url, JSON.stringify(createLiveStreamingRequest));
    } catch (error) {
        return '';
    }
};

const getLiveStreamings = async () => {
    try {
        const url = `${LiveStreamingUrl}/GetLiveStreaming`;
        return await ServerHttp.get(url);
    } catch (error) {
        return '';
    }
};

const getSessionInfos = async (liveStreamingInfoId: string) => {
    try {
        const url = `${LiveStreamingUrl}/GetSessionInfos?liveStreamingInfoId=${liveStreamingInfoId}`;
        return await ServerHttp.get(url);
    } catch (error) {
        return '';
    }
};

const getDisplayTimes = async (liveStreamingInfoId: string[]) => {
    try {
        const url = `${LiveStreamingUrl}/GetDisplayTimes`;
        return await ServerHttp.post(url, JSON.stringify(liveStreamingInfoId));
    } catch (error) {
        return '';
    }
};

const LiveStreamingApi = {
    createLiveStreaming,
    getLiveStreamings,
    getSessionInfos,
    getDisplayTimes,
};

export default LiveStreamingApi;