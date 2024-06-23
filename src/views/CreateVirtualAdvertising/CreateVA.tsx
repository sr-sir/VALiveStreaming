import React, { useEffect, useState } from 'react';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from '@fluentui/react';
import LiveStreamingApi from '../../api/LiveStreaming';
import { LiveStreamingInfo } from '../../models/LiveStreaming/LiveStreamingInfo';
import { transformApiResponseToLiveStreamingInfo } from '../../utils/commentFun';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { v4 as uuidv4 } from 'uuid';
import { setVirtualAdsInfo } from '../../redux/Slice/CreateVirtualAdsSlice';

const columnProps: Partial<IStackTokens> = {
    childrenGap: 15,
};
interface IDropdownLiveStreamingOptions {
    key: string;
    text: string;
}

const CreateVA: React.FC = () => {
    const navigate = useNavigate();
    const handleNextButtonClick = () => {
        // 处理创建操作的逻辑
        createVirtualAds();
        navigate(`/virtualadvertising/selectsession`);
    };

    const handleBackClick = () => {
        navigate(-1);
    };
    const handleCancelButtonClick = () => {
        // 处理创建操作的逻辑
        navigate(`/virtualadvertising`);
    };

    useEffect(() => {
        getLiveStreamings();
    }, []);

    const virtualAdsInfo = useSelector((state: RootState) => state.virtualAds.virtualAdsInfo);
    const dispatch = useDispatch<AppDispatch>();
    const [livestreamingData, SetLivestreamingData] = useState<IDropdownLiveStreamingOptions[]>([]);
    const [campaignName, setCampaignName] = useState(virtualAdsInfo.CampaignName ?? '');
    const [description, setDescription] = useState(virtualAdsInfo.Description ?? '');
    const [selectedOption, setSelectedOption] = useState<IDropdownLiveStreamingOptions | undefined>();


    const getLiveStreamings = async () => {
        try {
            const apiResponseData = await LiveStreamingApi.getLiveStreamings();
            const liveStreamings: LiveStreamingInfo[] = transformApiResponseToLiveStreamingInfo(apiResponseData);

            let livestreamingres: IDropdownLiveStreamingOptions[] = [];
            liveStreamings.forEach(item => {
                livestreamingres.push({
                    key: item.Id,
                    text: item.LiveStreamingName,
                })
            });
            SetLivestreamingData(livestreamingres);
        } catch (error) {
            console.log(error);
        }
    }

    const handleCampaignNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setCampaignName(newValue || '');
    };
    const handleDescriptionChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setDescription(newValue || '');
    };
    const onChange = (event: React.FormEvent<HTMLDivElement>, option?: any) => {
        setSelectedOption(option as IDropdownLiveStreamingOptions);
    };
    const createVirtualAds = () => {
        const now = new Date();
        const newVirtualAdsInfo = {
            ...virtualAdsInfo,
            Id: uuidv4(), // 为新对象添加新的属性
            campaignName: campaignName,
            description: description,
            LiveStreamingId: selectedOption?.key,
            Created: now.toISOString(),
            Updated: now.toISOString(),
        };
        dispatch(setVirtualAdsInfo(newVirtualAdsInfo))
    }

    return (
        <div>
            <div style={{ width: '50%', height: '90vh', overflowY: 'auto' }}>
                <Stack {...columnProps}>
                    <TextField onChange={handleCampaignNameChange} value={campaignName} label="Campaign Name" />
                    <TextField onChange={handleDescriptionChange} value={description} label="Description" />
                    <Dropdown
                        placeholder="Select an option"
                        label="Livestreaming"
                        options={livestreamingData}
                        onChange={onChange}
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

export default CreateVA;
