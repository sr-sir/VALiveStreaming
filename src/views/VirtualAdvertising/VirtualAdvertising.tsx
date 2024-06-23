// src/components/LivestreamingList.tsx
import React, { useEffect, useState } from "react";
import { DetailsList, IColumn } from "@fluentui/react/lib/DetailsList";
import { PrimaryButton } from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import VirtualAdsApi from "../../api/VirtualAds";
import { VirtualAdsInfo } from "../../models/VirtualAds/VirtualAdsInfo";
import {
  checkCurrentTimeStatus,
  transformApiResponseToLiveStreamingInfo,
  transformApiResponseToVirtualAds,
} from "../../utils/commentFun";
import LiveStreamingApi from "../../api/LiveStreaming";
import { LiveStreamingInfo } from "../../models/LiveStreaming/LiveStreamingInfo";
import { format } from "date-fns";

interface IVirtualAds {
  name: string;
  platform: string;
  status: string;
  duration: string;
}

const livestreamingData: IVirtualAds[] = [
  { name: "Stream 1", platform: "YouTube", status: "Live", duration: "2h 15m" },
  {
    name: "Stream 2",
    platform: "Twitch",
    status: "Offline",
    duration: "3h 45m",
  },
  {
    name: "Stream 3",
    platform: "Facebook",
    status: "Live",
    duration: "1h 30m",
  },
];

const columns: IColumn[] = [
  {
    key: "column1",
    name: "Livestreaming Name",
    fieldName: "name",
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
  },
  {
    key: "column2",
    name: "Platform",
    fieldName: "platform",
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
  },
  {
    key: "column3",
    name: "Status",
    fieldName: "status",
    minWidth: 70,
    maxWidth: 100,
    isResizable: true,
  },
  {
    key: "column4",
    name: "Duration",
    fieldName: "duration",
    minWidth: 70,
    maxWidth: 100,
    isResizable: true,
  },
];
const VirtualAdvertising: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateButtonClick = () => {
    // 处理创建操作的逻辑
    navigate(`/virtualadvertising/creatva`);
  };

  const [livestreamingData, SetLivestreamingData] = useState<IVirtualAds[]>([]);
  const getVirtualAds = async () => {
    var virtualads = await VirtualAdsApi.getVirtualAds();
    console.log(virtualads);

    try {
      const apiResponseData = await VirtualAdsApi.getVirtualAds();
      const virtualAdsInfos: VirtualAdsInfo[] =
        transformApiResponseToVirtualAds(apiResponseData);
      let virtualAdsIds: string[] = [];
      virtualAdsInfos.forEach((element) => {
        virtualAdsIds.push(element.LiveStreamingId ?? "");
      });

      const apiResponseDataLiveStreaming =
        await LiveStreamingApi.getLiveStreamings();
      const liveStreamings: LiveStreamingInfo[] =
        transformApiResponseToLiveStreamingInfo(
          apiResponseDataLiveStreaming
        ).filter((liveStreaming) => virtualAdsIds.includes(liveStreaming.Id));

      let livestreamingres: IVirtualAds[] = [];
      liveStreamings.forEach((item) => {
        livestreamingres.push({
          name: item.LiveStreamingName,
          platform: item.Platform,
          status: checkCurrentTimeStatus(
            item.StartTime ?? "",
            item.EndTime ?? ""
          ),
          duration: format(item.StartTime ?? "", "yyyy/MM/dd"),
        });
      });
      SetLivestreamingData(livestreamingres);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVirtualAds();
  }, []);

  return (
    <div>
      <div style={{ width: "80%", height: "90vh", overflowY: "auto" }}>
        <DetailsList
          items={livestreamingData}
          columns={columns}
          setKey="set"
          layoutMode={1}
          selectionPreservedOnEmptyClick={true}
          ariaLabelForSelectionColumn="Toggle selection"
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          checkButtonAriaLabel="select row"
        />
      </div>
      <div style={{ marginTop: "20px", marginLeft: "20px", display: "flex" }}>
        <PrimaryButton onClick={handleCreateButtonClick}>
          Create Livestreaming Campaign
        </PrimaryButton>
      </div>
    </div>
  );
};

export default VirtualAdvertising;
