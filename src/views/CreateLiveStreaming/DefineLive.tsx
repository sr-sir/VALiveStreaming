import React, { useState } from 'react';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { DatePicker, defaultDatePickerStrings } from '@fluentui/react/lib/DatePicker';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { v4 as uuidv4 } from 'uuid';
import { setLiveStreamingInfo } from '../../redux/Slice/LiveStreamingSlice';

const columnProps: Partial<IStackTokens> = {
    childrenGap: 15,
};


const DefineLive: React.FC = () => {
    const datePickerStyles: IStackItemStyles = {
        root: {
            width: '200px',
        },
    };
    const navigate = useNavigate();
    const handleNextButtonClick = () => {
        createLiveStreaming();
        // 处理创建操作的逻辑
        navigate(`/livestreaming/definelivestreaming`);
    };
    const handleBackClick = () => {
        navigate(-1);
    };
    const handleCancleButtonClick = () => {
        // 处理创建操作的逻辑
        navigate(`/livestreaming`);
    };
    const liveStreamingInfo = useSelector((state: RootState) => state.liveStreaming.liveStreamingInfo);
    const [livestreamingName, setlivestreamingName] = useState(liveStreamingInfo.LiveStreamingName ?? '');
    const [description, setDescription] = useState(liveStreamingInfo.Description ?? '');
    const [startTime, setStartTime] = useState<Date | null>(liveStreamingInfo.StartTime != null ? new Date(liveStreamingInfo.StartTime) : null);
    const [endTime, setEndTime] = useState<Date | null>(liveStreamingInfo.EndTime != null ? new Date(liveStreamingInfo.EndTime) : null);
    const dispatch = useDispatch<AppDispatch>();
    const handleLivestreamingNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setlivestreamingName(newValue || '');
    };
    const handleDescriptionChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setDescription(newValue || '');
    };
    const handleStartTimeChange = (date: Date | null | undefined) => {
        setStartTime(date || null);
    };
    const handleEndTimeChange = (date: Date | null | undefined) => {
        setEndTime(date || null);
    };
    const createLiveStreaming = () => {
        const now = new Date();
        const newLiveStreamingInfo = {
            ...liveStreamingInfo, // 复制 liveStreamingInfo 的属性
            Id: uuidv4(), // 为新对象添加新的属性
            LiveStreamingName: livestreamingName,
            Description: description,
            StartTime: (startTime ?? new Date()).toISOString(),
            EndTime: (endTime ?? new Date()).toISOString(),
            Created: now.toISOString(),
            Updated: now.toISOString(),
        };
        dispatch(setLiveStreamingInfo(newLiveStreamingInfo))
    }

    return (
        <div>
            <div style={{ width: '50%', height: '90vh', overflowY: 'auto' }}>
                <Stack {...columnProps}>
                    <TextField onChange={handleLivestreamingNameChange} value={livestreamingName} label="Livestreaming Name" />
                    <TextField onChange={handleDescriptionChange} value={description} label="Description" />
                    <Stack horizontal horizontalAlign="space-between" styles={{ root: { width: '100%' } }}>
                        <Stack.Item styles={datePickerStyles}>
                            <DatePicker onSelectDate={handleStartTimeChange} placeholder="Select a date..." value={startTime ?? undefined} ariaLabel="Select a date" label="Start Time" strings={defaultDatePickerStrings} />
                        </Stack.Item>
                        <Stack.Item styles={datePickerStyles}>
                            <DatePicker onSelectDate={handleEndTimeChange} placeholder="Select a date..." value={endTime ?? undefined} ariaLabel="Select a date" label="End Time" strings={defaultDatePickerStrings} />
                        </Stack.Item>
                    </Stack>
                </Stack>
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

export default DefineLive;
