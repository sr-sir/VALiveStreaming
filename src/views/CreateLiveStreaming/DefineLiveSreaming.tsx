import React, { useRef, useState } from 'react';
import { PrimaryButton, DefaultButton, IconButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { Dialog, DialogType } from '@fluentui/react';
import { Image, ImageFit } from '@fluentui/react/lib/Image';
import deteleIcon from '../../static/delete.png'
import zoomIcon from '../../static/seach.png'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { setLiveStreamingInfo } from '../../redux/Slice/LiveStreamingSlice';
import FileUploadApi from '../../api/FileUpload';
import { v4 as uuidv4 } from 'uuid';
import { dataURItoFile } from '../../utils/commentFun';

const columnProps: Partial<IStackTokens> = {
    childrenGap: 15,
};


const DefineLiveStreaming: React.FC = () => {
    const [image1, setImage1] = useState<string | null>(null);
    const [image2, setImage2] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogImage, setDialogImage] = useState<string | null>(null);

    const fileUploadRef1 = useRef<HTMLInputElement | null>(null);
    const fileUploadRef2 = useRef<HTMLInputElement | null>(null);

    const datePickerStyles: IStackItemStyles = {
        root: {
            width: '20vw',
        },
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && e.target.result) {
                    setImage(e.target.result as string);
                }
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const handleZoomImage = (image: string) => {
        setDialogImage(image);
        setIsDialogOpen(true);
    };

    const handleDeleteImage = (setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
        setImage(null);
    };

    const navigate = useNavigate();
    const handleNextButtonClick = () => {
        updateLiveStreaming();
        // 处理创建操作的逻辑
        navigate(`/livestreaming/definesession`);
    };
    const handleBackClick = () => {
        navigate(-1);
    };
    const handleCancleButtonClick = () => {
        // 处理创建操作的逻辑
        navigate(`/livestreaming`);
    };


    const liveStreamingInfo = useSelector((state: RootState) => state.liveStreaming.liveStreamingInfo);
    const dispatch = useDispatch<AppDispatch>();
    const [flowName, setFlowName] = useState(liveStreamingInfo.LiveStreamingFlowName ?? '');
    const [platm, setPlatm] = useState(liveStreamingInfo.Platform ?? '');
    const [url1, setUrl1] = useState(liveStreamingInfo.Url1 ?? '');
    const [url2, setUrl2] = useState(liveStreamingInfo.Url2 ?? '');


    const handleFlowNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setFlowName(newValue || '');
    };
    const handlePlatmChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setPlatm(newValue || '');
    };
    const handleUrl1Change = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setUrl1(newValue || '');
    };
    const handleUrl2Change = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setUrl2(newValue || '');
    };
    const updateLiveStreaming = async () => {
        let sceneImage = '';
        let markerImage = '';
        let adsImage = '';
        if (image1) { const image = await UploadImage(image1); sceneImage = image }
        if (image2) { const image = await UploadImage(image2); adsImage = image }

        const newLiveStreamingInfo = {
            ...liveStreamingInfo, // 复制 liveStreamingInfo 的属性
            LiveStreamingFlowName: flowName,
            Platform: platm,
            Url1: url1,
            Url2: url2,
            SceneImage: sceneImage,
            MarkerImage: markerImage,
            AdsImage: adsImage,
        };
        dispatch(setLiveStreamingInfo(newLiveStreamingInfo))
    }
    const UploadImage = async (image: string) => {
        // 将所有图片文件组成的数组
        const imageFiles = [];
        imageFiles.push(dataURItoFile(image, uuidv4().toString() + '.jpg')); // 将base64转为文件对象


        // 上传所有图片文件
        try {
            const response = await FileUploadApi.uploadImages(imageFiles);
            return response.imageUrls[0] ?? '';
        } catch (error) {
            console.error('上传图片失败', error);
        }
    };


    return (
        <div>
            <div style={{ width: '50%', height: '30vh', overflowY: 'auto' }}>
                <Stack {...columnProps}>
                    <TextField onChange={handleFlowNameChange} value={flowName} label="Livestreaming Flow Name" />
                    <TextField onChange={handlePlatmChange} value={platm} label="Platform" />
                    <Stack horizontal horizontalAlign="space-between" styles={{ root: { width: '100%' } }}>
                        <Stack.Item styles={datePickerStyles}>
                            <TextField onChange={handleUrl1Change} placeholder="Enter Text" value={url1} ariaLabel="Enter Text" label="Url 1" />
                        </Stack.Item>
                        <Stack.Item styles={datePickerStyles}>
                            <TextField onChange={handleUrl2Change} placeholder="Enter Text" value={url2} ariaLabel="Enter Text" label="Url 2" />
                        </Stack.Item>
                    </Stack>
                </Stack>
            </div>
            <div style={{ width: '100%', height: '60vh', overflowY: 'auto' }}>
                <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="space-between" styles={{ root: { width: '100%' } }}>
                    <div style={{ width: '50%', height: '60vh', overflowY: 'auto' }}>
                        <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="space-between" styles={{ root: { width: '100%' } }}>
                            <div>
                                <DefaultButton style={{ width: '20vw' }} iconProps={{ iconName: 'Add' }} text="Upload Image 1" onClick={() => fileUploadRef1.current?.click()} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, setImage1)}
                                    style={{ display: 'none' }}
                                    ref={fileUploadRef1}
                                />
                                {image1 && (
                                    <div style={{ position: 'relative', marginTop: '10px' }}>
                                        <Image src={image1} imageFit={ImageFit.cover} width={'20vw'} />
                                        <div style={{ position: 'absolute', right: 0, marginTop: 10, display: 'flex' }}>
                                            <IconButton iconProps={{ imageProps: { src: zoomIcon, width: '15px', height: '15px' } }} title="Zoom" ariaLabel="Zoom" onClick={() => handleZoomImage(image1)} />
                                            <IconButton iconProps={{ imageProps: { src: deteleIcon, width: '15px', height: '15px' } }} title="Delete" ariaLabel="Delete" onClick={() => handleDeleteImage(setImage1)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <DefaultButton style={{ width: '20vw' }} iconProps={{ iconName: 'Add' }} text="Upload Image 2" onClick={() => fileUploadRef2.current?.click()} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, setImage2)}
                                    style={{ display: 'none' }}
                                    ref={fileUploadRef2}
                                />
                                {image2 && (
                                    <div style={{ position: 'relative', marginTop: '10px' }}>
                                        <Image src={image2} imageFit={ImageFit.cover} width={'20vw'} />
                                        <div style={{ position: 'absolute', right: 0, display: 'flex' }}>
                                            <IconButton iconProps={{ imageProps: { src: zoomIcon, width: '15px', height: '15px' } }} title="Zoom" ariaLabel="Zoom" onClick={() => handleZoomImage(image2)} />
                                            <IconButton iconProps={{ imageProps: { src: deteleIcon, width: '15px', height: '15px' } }} title="Delete" ariaLabel="Delete" onClick={() => handleDeleteImage(setImage2)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Stack>
                    </div>
                    <div style={{ width: '40%', height: '60vh', overflowY: 'auto' }}>
                        {image1 && <Image src={image1} imageFit={ImageFit.contain} width="95%" />}
                    </div>
                </Stack>
            </div>
            <div style={{ width: '50%', marginTop: '20px', marginLeft: "20px", display: 'flex' }}>
                <Stack horizontal styles={{ root: { width: '100%' } }} horizontalAlign="space-between">
                    <Stack horizontal tokens={{ childrenGap: 10 }}>
                        <PrimaryButton text="Next" onClick={handleNextButtonClick} />
                        <PrimaryButton text="Back" onClick={handleBackClick} />
                    </Stack>
                    <DefaultButton text="Cancel" onClick={handleCancleButtonClick} />
                </Stack>
            </div>
            <Dialog
                hidden={!isDialogOpen}
                onDismiss={() => setIsDialogOpen(false)}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Image Preview',
                }}
                maxWidth={'60vw'}
            >
                {dialogImage && <Image src={dialogImage} imageFit={ImageFit.contain} width="100%" height="100%" />}
            </Dialog>
        </div >

    );
};

export default DefineLiveStreaming;
