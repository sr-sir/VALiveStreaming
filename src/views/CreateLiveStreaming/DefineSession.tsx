import React, { useEffect, useState } from 'react';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { DetailsList, IColumn, IComboBoxStyles, TimePicker } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { SessionInfo } from '../../models/LiveStreaming/SessionInfo';
import { v4 as uuidv4 } from 'uuid';
import { setSessionInfos } from '../../redux/Slice/LiveStreamingSlice';
import { format } from 'date-fns';

const columnProps: Partial<IStackTokens> = {
    childrenGap: 15,
};


const DefineSession: React.FC = () => {
    const datePickerStyles: IStackItemStyles = {
        root: {
            width: '200px',
        },
    };
    const navigate = useNavigate();
    const handleNextButtonClick = () => {
        createSession();
        navigate(`/livestreaming/definetimeinterval`);
    };
    const handleBackClick = () => {
        navigate(-1);
    };
    const handleCancleButtonClick = () => {
        // 处理创建操作的逻辑
        navigate(`/livestreaming`);
    };
    const timePickerStyles: Partial<IComboBoxStyles> = {
        optionsContainerWrapper: {
            height: '200px',
        },
        root: {
            width: '200px',
        },
    };
    const dateAnchor = new Date('February 27, 2023 08:00:00');

    const liveStreamingInfo = useSelector((state: RootState) => state.liveStreaming.liveStreamingInfo);
    const sessionInfos = useSelector((state: RootState) => state.liveStreaming.sessionInfos);
    const dispatch = useDispatch<AppDispatch>();


    const columns: IColumn[] = [
        { key: 'column1', name: 'Session Name', fieldName: 'SessionName', minWidth: 100, maxWidth: 200, isResizable: true },
        {
            key: 'column2',
            name: 'Data',
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            onRender: (item: SessionInfo) => {
                return <span>{`${format(new Date(liveStreamingInfo.StartTime ?? ''), 'yyyy/MM/dd')}`}</span>;
            }
        },
        {
            key: 'column3',
            name: 'Session Duration',
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            onRender: (item: SessionInfo) => {
                return <span>{`${format(item.SessionStartTime ?? '', 'HH:mm')}-${format(item.SessionEndTime ?? '', 'HH:mm')}`}</span>;
            }
        },
        {
            key: 'column4',
            name: 'VA Exposure',
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            onRender: (item: SessionInfo) => {
                return <span>{`${format(item.VAExposureStartTime ?? '', 'HH:mm')}-${format(item.VAExposureEndTime ?? '', 'HH:mm')}`}</span>;
            }
        },
    ];
    const [defineSessionData, SetDefineSessionData] = useState<SessionInfo[]>(sessionInfos);
    const [sessionStartTime, SetSessionStartTime] = useState<Date>(new Date(liveStreamingInfo.StartTime ?? ''));
    const [sessionEndTime, SetSessionEndTime] = useState<Date>(new Date(liveStreamingInfo.StartTime ?? ''));
    const [vAExposureStartTime, SetVAExposureStartTime] = useState<Date>(new Date(liveStreamingInfo.StartTime ?? ''));
    const [vAExposureEndTime, SetVAExposureEndTime] = useState<Date>(new Date(liveStreamingInfo.StartTime ?? ''));
    const [sessionName, setSessionName] = useState('');
    const onSessionStartTimeChange = React.useCallback((_: any, newTime: Date) => {
        SetSessionStartTime(newTime);
    }, []);
    const onSessionEndTimeChange = React.useCallback((_: any, newTime: Date) => {
        SetSessionEndTime(newTime);
    }, []);
    const onVAExposureStartTimeChange = React.useCallback((_: any, newTime: Date) => {
        SetVAExposureStartTime(newTime);
    }, []);
    const onVAExposureEndTimeChange = React.useCallback((_: any, newTime: Date) => {
        SetVAExposureEndTime(newTime);
    }, []);


    const combineDateTime = (date: Date | null, time: Date | null): string => {
        if (date && time) {
            const formattedDate: string = format(date, 'yyyy/MM/dd');
            const formattedTime: string = format(time, 'HH:mm');
            return new Date(`${formattedDate} ${formattedTime}`).toISOString();
        }
        return '';
    };

    const AddSessionTimeClick = () => {
        SetDefineSessionData([...defineSessionData, {
            Id: uuidv4(),
            LiveStreamingId: liveStreamingInfo.Id,
            SessionName: sessionName,
            SessionStartTime: combineDateTime(liveStreamingInfo.StartTime ?? ''.length > 0 ? new Date(liveStreamingInfo.StartTime ?? '') : new Date(), sessionStartTime),
            SessionEndTime: combineDateTime(liveStreamingInfo.StartTime ?? ''.length > 0 ? new Date(liveStreamingInfo.StartTime ?? '') : new Date(), sessionEndTime),
            VAExposureStartTime: combineDateTime(liveStreamingInfo.StartTime ?? ''.length > 0 ? new Date(liveStreamingInfo.StartTime ?? '') : new Date(), vAExposureStartTime),
            VAExposureEndTime: combineDateTime(liveStreamingInfo.StartTime ?? ''.length > 0 ? new Date(liveStreamingInfo.StartTime ?? '') : new Date(), vAExposureEndTime),
            Created: new Date().toISOString(),
            Updated: new Date().toISOString(),
        }]);
    }

    const handleSessionNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setSessionName(newValue || '');
    };

    useEffect(() => {
    }, []);

    const createSession = async () => {
        dispatch(setSessionInfos(defineSessionData))
    }
    return (
        <div>
            <div style={{ width: '50%', height: '30vh', overflowY: 'auto' }}>
                <Stack {...columnProps}>
                    <TextField onChange={handleSessionNameChange} label="Session Name" />
                    <label htmlFor="" style={{ fontSize: '14px', marginTop: '10px' }}>Session Duration</label>
                    <Stack horizontal styles={{ root: { width: '100%' } }}>
                        <Stack.Item styles={datePickerStyles}>
                            <TimePicker
                                styles={timePickerStyles}
                                allowFreeform
                                increments={15}
                                autoComplete="on"
                                dateAnchor={dateAnchor}
                                value={sessionStartTime}
                                onChange={onSessionStartTimeChange}
                            />
                        </Stack.Item>
                        <label htmlFor="">{"->"}</label>
                        <Stack.Item styles={datePickerStyles}>
                            <TimePicker
                                styles={timePickerStyles}
                                allowFreeform
                                increments={15}
                                autoComplete="on"
                                label=""
                                dateAnchor={dateAnchor}
                                value={sessionEndTime}
                                onChange={onSessionEndTimeChange}
                            />
                        </Stack.Item>
                    </Stack>

                    <label htmlFor="" style={{ fontSize: '14px', marginTop: '10px' }}>VA Exposure</label>
                    <Stack horizontal styles={{ root: { width: '100%' } }}>
                        <Stack.Item styles={datePickerStyles}>
                            <TimePicker
                                styles={timePickerStyles}
                                allowFreeform
                                increments={15}
                                autoComplete="on"
                                dateAnchor={dateAnchor}
                                value={vAExposureStartTime}
                                onChange={onVAExposureStartTimeChange}
                            />
                        </Stack.Item>
                        <label htmlFor="">{"->"}</label>
                        <Stack.Item styles={datePickerStyles}>
                            <TimePicker
                                styles={timePickerStyles}
                                allowFreeform
                                increments={15}
                                autoComplete="on"
                                label=""
                                dateAnchor={dateAnchor}
                                value={vAExposureEndTime}
                                onChange={onVAExposureEndTimeChange}
                            />
                        </Stack.Item>
                    </Stack>
                </Stack>
                <PrimaryButton onClick={AddSessionTimeClick} style={{ marginTop: '20px' }}>Session Time</PrimaryButton>
            </div>
            <div style={{ width: '50%', height: '60vh', overflowY: 'auto' }}>
                <DetailsList
                    items={defineSessionData}
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
                <Stack horizontal styles={{ root: { width: '100%' } }} horizontalAlign="space-between">
                    <Stack horizontal tokens={{ childrenGap: 10 }}>
                        <PrimaryButton onClick={handleNextButtonClick} text="Next" />
                        <PrimaryButton text="Back" onClick={handleBackClick} />
                    </Stack>
                    <DefaultButton text="Cancel" onClick={handleCancleButtonClick} />
                </Stack>
            </div>
        </div >

    );
};

export default DefineSession;
