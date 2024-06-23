import React, { useState } from 'react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { ComboBox, DetailsList, IColumn, IComboBox, IComboBoxOption } from '@fluentui/react';
import { Image } from '@fluentui/react/lib/Image';
import textImg from '../../static/test.png'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { DisplayTime } from '../../models/LiveStreaming/DisplayTime';
import { v4 as uuidv4 } from 'uuid';
import LiveStreamingApi from '../../api/LiveStreaming';
import { CreateLiveStreamingRequest } from '../../models/LiveStreaming/CreateLiveStreamingRequest';
import { format } from 'date-fns';
import { resetLiveStream } from '../../redux/Slice/LiveStreamingSlice';


const columns: IColumn[] = [
    {
        key: 'column1',
        name: 'Time',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item: DisplayTime) => {
            return <span>{`${format(item.StartTime ?? '', 'yyyy/MM/dd HH:mm')}-${format(item.EndTime ?? '', 'yyyy/MM/dd HH:mm')}`}</span>;
        }
    },
];

const DefineTimeInterval: React.FC = () => {

    const navigate = useNavigate();
    const handleFinishButtonClick = () => {
        createLiveStreaming();
        navigate(`/livestreaming`);
    };

    const liveStreamingInfo = useSelector((state: RootState) => state.liveStreaming.liveStreamingInfo);
    const sessionInfos = useSelector((state: RootState) => state.liveStreaming.sessionInfos);
    const displayTimes = useSelector((state: RootState) => state.liveStreaming.displayTimes);
    const dispatch = useDispatch<AppDispatch>();
    const DropdownErrorExampleOptions = [
        { key: 'A', text: '10' },
        { key: 'B', text: '20' },
        { key: 'C', text: '30' },
    ];

    const [inputText, setInputText] = useState<string | undefined>(undefined);
    const [displayTimesNew, setdisplayTimesNew] = useState<DisplayTime[]>(displayTimes);

    // 处理输入文本变化事件
    const handleInputChange = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string): void => {
        // 如果输入不是数字，则阻止输入
        if (!/^\d*$/.test(value || '')) {
            return;
        }
        setInputText(value || '');
        let displayTimesNew: DisplayTime[] = [];
        sessionInfos.forEach(item => {
            const nowData = new Date();
            let startTime = new Date(item.VAExposureStartTime ?? '');
            const endTime = new Date(item.VAExposureEndTime ?? '');

            // 增加 10 分钟
            let tenMinutesLater = new Date(startTime.getTime() + Number(value) * 60 * 1000);
            while (tenMinutesLater <= endTime) {
                // 创建一个新的 DisplayTime 对象并添加到 displayTimesNew 数组
                const newDisplayTime: DisplayTime = {
                    Id: uuidv4(),
                    SessionId: item.Id,
                    AdImageUrl: '',
                    StartTime: startTime.toISOString(),
                    EndTime: tenMinutesLater.toISOString(),
                    Created: nowData.toISOString(),
                    Updated: nowData.toISOString(),
                };
                displayTimesNew.push(newDisplayTime);
                startTime = tenMinutesLater;
                // 增加 10 分钟
                tenMinutesLater = new Date(startTime.getTime() + Number(value) * 60 * 1000);
            }
        });
        setdisplayTimesNew(displayTimesNew);
    };

    const createLiveStreaming = async () => {
        let liveStreamingrequest: CreateLiveStreamingRequest = {
            liveStreamingInfo: liveStreamingInfo,
            sessionInfos: sessionInfos,
            displayTimes: displayTimesNew
        }
        dispatch(resetLiveStream());
        await LiveStreamingApi.createLiveStreaming(liveStreamingrequest);
    }
    return (
        <div>
            <div style={{ width: '50%', height: '40vh', marginLeft: "20px", display: 'flex' }}>
                <Stack horizontal styles={{ root: { width: '100%' } }} horizontalAlign="space-between">
                    <Image src={textImg} width="50vh" />
                    <Stack horizontal>
                        <ComboBox
                            label="+ Fixed-Time"
                            options={DropdownErrorExampleOptions}
                            // 允许用户输入自定义的文本
                            allowFreeform
                            // 当前输入文本
                            text={inputText}
                            // 占位符文本
                            placeholder="Type or select an option"
                            // 处理输入文本变化事件
                            onChange={handleInputChange}
                        />
                        <label style={{ marginTop: '35px', marginLeft: '10px' }} htmlFor="">{`(min)`}</label>
                    </Stack>
                </Stack>
            </div>
            <div style={{ width: '50%', height: '50vh', overflowY: 'auto' }}>
                <DetailsList
                    items={displayTimesNew}
                    columns={columns}
                    setKey="set"
                    layoutMode={1}
                    selectionPreservedOnEmptyClick={true}
                    ariaLabelForSelectionColumn="Toggle selection"
                    ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                    checkButtonAriaLabel="select row"
                />
            </div>
            <div style={{ width: '50%', marginTop: '20px', marginLeft: "20px", display: 'flex' }}>
                <PrimaryButton onClick={handleFinishButtonClick} text="Finish" />
            </div>
        </div >

    );
};
export default DefineTimeInterval;
