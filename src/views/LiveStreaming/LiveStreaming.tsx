// src/components/LivestreamingList.tsx
import React, { useEffect, useState } from 'react';
import { DetailsList, IColumn } from '@fluentui/react/lib/DetailsList';
import { PrimaryButton } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import LiveStreamingApi from '../../api/LiveStreaming';
import { LiveStreamingInfo } from '../../models/LiveStreaming/LiveStreamingInfo';
import { format } from 'date-fns';
import { checkCurrentTimeStatus, transformApiResponseToLiveStreamingInfo } from '../../utils/commentFun';

interface ILivestreaming {
  name: string;
  platform: string;
  status: string;
  duration: string;
}

const columns: IColumn[] = [
  { key: 'column1', name: 'Livestreaming Name', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
  { key: 'column2', name: 'Platform', fieldName: 'platform', minWidth: 100, maxWidth: 200, isResizable: true },
  { key: 'column3', name: 'Status', fieldName: 'status', minWidth: 70, maxWidth: 100, isResizable: true },
  { key: 'column4', name: 'Duration', fieldName: 'duration', minWidth: 70, maxWidth: 100, isResizable: true },
];
const LivestreamingList: React.FC = () => {


  const [livestreamingData, SetLivestreamingData] = useState<ILivestreaming[]>([]);

  useEffect(() => {
    getLiveStreamings();
  }, []);

  const getLiveStreamings = async () => {
    try {
      const apiResponseData = await LiveStreamingApi.getLiveStreamings();
      const liveStreamings: LiveStreamingInfo[] = transformApiResponseToLiveStreamingInfo(apiResponseData);

      let livestreamingres: ILivestreaming[] = [];
      liveStreamings.forEach(item => {
        livestreamingres.push({
          name: item.LiveStreamingName,
          platform: item.Platform,
          status: checkCurrentTimeStatus(item.StartTime ?? '', item.EndTime ?? ''),
          duration: format(item.StartTime ?? '', 'yyyy/MM/dd'),
        })
      });
      SetLivestreamingData(livestreamingres);
    } catch (error) {
      console.log(error);
    }
  }


  const navigate = useNavigate();

  const handleCreateButtonClick = () => {
    // 处理创建操作的逻辑
    navigate(`/livestreaming/definelive`);
  };

  return (
    <div>
      <div style={{ width: '80%', height: '90vh', overflowY: 'auto' }}>
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
      <div style={{ marginTop: '20px', marginLeft: "20px", display: 'flex' }}>
        <PrimaryButton onClick={handleCreateButtonClick}>Create</PrimaryButton>
      </div>
    </div>
  );
};

export default LivestreamingList;
