import { DisplayTime } from "../models/LiveStreaming/DisplayTime";
import { LiveStreamingInfo } from "../models/LiveStreaming/LiveStreamingInfo";
import { SessionInfo } from "../models/LiveStreaming/SessionInfo";
import { VirtualAdsInfo } from "../models/VirtualAds/VirtualAdsInfo";

export function checkCurrentTimeStatus(startTime: string, endTime: string) {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const currentDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(24, 0, 0, 0);

    if (currentDate >= startDate && currentDate <= endDate) {
        return ('Live');
    } else {
        return ('Offline');
    }
};


export function calculateTimeDifference(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const differenceInMilliseconds = endDate.getTime() - startDate.getTime();

    const hours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0)
        return `${hours}h ${minutes}m`;
    else
        return `${minutes}m`;
};

export function transformApiResponseToLiveStreamingInfo(apiData: any[]): LiveStreamingInfo[] {
    return apiData.map(item => ({
        Id: item.id,
        LiveStreamingName: item.liveStreamingName,
        Description: item.description,
        StartTime: item.startTime,
        EndTime: item.endTime,
        LiveStreamingFlowName: item.liveStreamingFlowName,
        Platform: item.platform,
        Url1: item.url1,
        Url2: item.url2,
        SceneImage: item.sceneImage,
        MarkerImage: item.markerImage,
        AdsImage: item.adsImage,
        CompositeImage: item.compositeImage,
        Created: item.created,
        Updated: item.updated,
    }));
}

export function transformApiResponseToSessionInfo(apiData: any[]): SessionInfo[] {
    return apiData.map(item => ({
        Id: item.id,
        LiveStreamingId: item.liveStreamingId,
        SessionName: item.sessionName,
        SessionStartTime: item.sessionStartTime,
        SessionEndTime: item.sessionEndTime,
        VAExposureStartTime: item.vaExposureStartTime,
        VAExposureEndTime: item.vaExposureEndTime,
        Created: item.created,
        Updated: item.updated,
    }));
}

export function transformApiResponseToDisplayTime(apiData: any[]): DisplayTime[] {
    return apiData.map(item => ({
        Id: item.id,
        SessionId: item.sessionId,
        AdImageUrl: item.adImageUrl,
        StartTime: item.startTime,
        EndTime: item.endTime,
        Created: item.created,
        Updated: item.updated,
    }));
}

export function transformApiResponseToVirtualAds(apiData: any[]): VirtualAdsInfo[] {
    return apiData.map(item => ({
        Id: item.id,
        CampaignName: item.campaignName,
        Description: item.description,
        LiveStreamingId: item.liveStreamingId,
        SessionIds: item.sessionIds,
        DisplayTimeIds: item.displayTimeIds,
        ImageUrl: item.imageUrl,
        DisplayTimeId: item.displayTimeId,
        Created: item.created,
        Updated: item.updated,
    }));
}

export function dataURItoFile(dataURI: string, fileName: string): File {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    // 创建File对象
    const file = new File([blob], fileName, { type: mimeString });

    return file;
}