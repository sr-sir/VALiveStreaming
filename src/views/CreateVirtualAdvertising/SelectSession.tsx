import React, { useEffect, useState } from 'react';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { useNavigate } from 'react-router-dom';
import virtualadsimg from '../../static/virtualas.png'
import { Image, ImageFit } from '@fluentui/react/lib/Image';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import LiveStreamingApi from '../../api/LiveStreaming';
import { SessionInfo } from '../../models/LiveStreaming/SessionInfo';
import { calculateTimeDifference, transformApiResponseToSessionInfo } from '../../utils/commentFun';
import { format } from 'date-fns';
import { DetailsList, Selection, IColumn } from '@fluentui/react/lib/DetailsList';
import { setVirtualAdsInfo } from '../../redux/Slice/CreateVirtualAdsSlice';

const columnProps: Partial<IStackTokens> = {
    childrenGap: 15,
};


const SelectSession: React.FC = () => {
    const navigate = useNavigate();
    const handleNextButtonClick = () => {
        updatedSessionInfo();
        // 处理创建操作的逻辑
        navigate(`/virtualadvertising/uploadvaimg`);
    };
    const handleBackClick = () => {
        navigate(-1);
    };
    const handleCancelButtonClick = () => {
        // 处理创建操作的逻辑
        navigate(`/virtualadvertising`);
    };
    const columns: IColumn[] = [
        {
            key: 'column1',
            name: 'Session Period',
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            onRender: (item: SessionInfo) => {
                return <span>{`${format(new Date(item.SessionStartTime ?? ''), 'yyyy/MM/dd HH:mm')}-${format(new Date(item.SessionEndTime ?? ''), 'yyyy/MM/dd HH:mm')}`}</span>;
            }
        },
        {
            key: 'column2',
            name: 'Session Duration',
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            onRender: (item: SessionInfo) => {
                return <span>{calculateTimeDifference(item.SessionStartTime ?? '', item.SessionEndTime ?? '')}</span>;
            }
        },
        {
            key: 'column3',
            name: 'Exposure Start/End Time',
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            onRender: (item: SessionInfo) => {
                return <span>{`${format(new Date(item.VAExposureStartTime ?? ''), 'yyyy/MM/dd HH:mm')}-${format(new Date(item.VAExposureEndTime ?? ''), 'yyyy/MM/dd HH:mm')}`}</span>;
            }
        },
        {
            key: 'column4',
            name: 'Session Duration',
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            onRender: (item: SessionInfo) => {
                return <span>{calculateTimeDifference(item.VAExposureStartTime ?? '', item.VAExposureEndTime ?? '')}</span>;
            }
        },
    ];

    const virtualAdsInfo = useSelector((state: RootState) => state.virtualAds.virtualAdsInfo);
    const dispatch = useDispatch<AppDispatch>();
    const [session, setSession] = useState<SessionInfo[]>([]);
    const [selectSession, setSelectSession] = useState<SessionInfo[]>([]);


    const _selection = new Selection({
        onSelectionChanged: () => {
            setSelectSession(_selection.getSelection() as SessionInfo[])
        },
    });


    const getVirtualAds = async () => {
        try {
            const apiResponseData = await LiveStreamingApi.getSessionInfos(virtualAdsInfo.LiveStreamingId ?? '');
            const sessionInfos: SessionInfo[] = transformApiResponseToSessionInfo(apiResponseData);
            setSession(sessionInfos);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getVirtualAds();
    }, []);

    const updatedSessionInfo = () => {
        let selectSessionIds: string[] = [];
        selectSession.forEach(item => {
            selectSessionIds.push(item.Id);
        });
        const newVirtualAdsInfo = {
            ...virtualAdsInfo,
            SessionIds: selectSessionIds,
        };
        dispatch(setVirtualAdsInfo(newVirtualAdsInfo))
    }


    return (
        <div>
            <div style={{ width: '100%', height: '90vh', overflowY: 'auto' }}>
                <Stack {...columnProps}>
                    <h2>Session Schedule</h2>
                    <Stack horizontal styles={{ root: { width: '100%' } }} horizontalAlign="center">
                        <Image src={virtualadsimg} imageFit={ImageFit.contain} width="20%" />
                    </Stack>
                    <DetailsList
                        items={session}
                        columns={columns}
                        setKey="set"
                        layoutMode={1}
                        selectionPreservedOnEmptyClick={true}
                        ariaLabelForSelectionColumn="Toggle selection"
                        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                        checkButtonAriaLabel="select row"
                        selection={_selection}
                    />
                </Stack>
            </div>
            <div style={{ width: '50%', marginTop: '20px', marginLeft: "20px", display: 'flex' }}>
                <Stack horizontal styles={{ root: { width: '100%' } }} horizontalAlign="space-between">
                    <Stack horizontal tokens={{ childrenGap: 10 }}>
                        <PrimaryButton onClick={handleNextButtonClick} text="Next" />
                        <PrimaryButton text="Back" onClick={handleBackClick} />
                    </Stack>
                    <DefaultButton text="Cancel" onClick={handleCancelButtonClick} />
                </Stack>
            </div>
        </div >

    );
};

export default SelectSession;
