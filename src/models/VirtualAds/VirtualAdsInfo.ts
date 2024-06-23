export interface VirtualAdsInfo {
    Id: string;
    CampaignName: string;
    Description: string;
    LiveStreamingId: string | null | undefined;
    SessionIds: string[],
    DisplayTimeIds: string[],
    ImageUrl: string[];
    DisplayTimeId: string[];
    Created: string | null;
    Updated: string | null;
}