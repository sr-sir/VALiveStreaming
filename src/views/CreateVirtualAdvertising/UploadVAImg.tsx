import React, { useEffect, useState } from 'react';
import { PrimaryButton, DefaultButton, IconButton } from '@fluentui/react/lib/Button';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Dropdown, IDropdownStyles, IImageStyles, ImageFit, Label, mergeStyleSets } from '@fluentui/react';
import { Image } from '@fluentui/react';
import plusIcon from '../../static/plus.png';
import deleteIcon from '../../static/deleteImg.png';

import { initializeIcons } from '@fluentui/react/lib/Icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { dataURItoFile, transformApiResponseToDisplayTime } from '../../utils/commentFun';
import { DisplayTime } from '../../models/LiveStreaming/DisplayTime';
import LiveStreamingApi from '../../api/LiveStreaming';
import { DetailsList, Selection, IColumn } from '@fluentui/react/lib/DetailsList';
import { v4 as uuidv4 } from 'uuid';
import FileUploadApi from '../../api/FileUpload';
import { format } from 'date-fns';
import VirtualAdsApi from '../../api/VirtualAds';
import { CreateVirtualAdsRequest } from '../../models/VirtualAds/CreateVirtualAdsRequest';
import { resetVirtualAdsState, setDisplayTimes } from '../../redux/Slice/CreateVirtualAdsSlice';

// Initialize Fluent UI icons
initializeIcons();

const stackTokens: IStackTokens = { childrenGap: 10 };

const classNames = mergeStyleSets({
    imageWrapper: {
        position: 'relative',
        display: 'inline-block',
        ':hover .deleteIcon': {
            display: 'block',
        },
    },
    deleteIcon: {
        display: 'flex',
        position: 'absolute',
        top: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.8)',
    },
    checkbox: {
        // 自定义 Checkbox 的容器样式
        selectors: {
            // 选择器用于定位 Checkbox 的标签部分
            '.ms-Checkbox-label': {
                color: 'red', // 设置字体颜色
            },
        },
    },
});

const imageStyles: IImageStyles = {
    root: {
        margin: 5,
    },
    image: {
        width: '10vw',
        margin: 5,
    },
};

const uploadButtonStyles: IImageStyles = {
    root: {
        width: '100px',
    },
    image: undefined
};




const columnProps: Partial<IStackTokens> = {
    childrenGap: 15,
};


interface ISessionInterval {
    time: string;
}

const sessionInterval: ISessionInterval[] = [
    { time: '2024/5/23 10:00:00 - 2024/5/23 10:09:59' },
    { time: '2024/5/23 10:00:00 - 2024/5/23 10:09:59' },
    { time: '2024/5/23 10:00:00 - 2024/5/23 10:09:59' },
];

const columns: IColumn[] = [
    {
        key: 'column1',
        name: 'Exposure Start/End Time',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item: DisplayTime) => {
            return <span>{`${format(new Date(item.StartTime ?? ''), 'yyyy/MM/dd HH:mm')}-${format(new Date(item.EndTime ?? ''), 'yyyy/MM/dd HH:mm')}`}</span>;
        }
    },
];

const UploadVAImg: React.FC = () => {
    const navigate = useNavigate();
    const handleNextButtonClick = () => {
        combination();
        // 处理创建操作的逻辑
        navigate(`/virtualadvertising/previewva`);
    };
    const handleBackClick = () => {
        navigate(-1);
    };
    const handleCancelButtonClick = () => {
        // 处理创建操作的逻辑
        navigate(`/virtualadvertising`);
    };
    const dropdownStyles: Partial<IDropdownStyles> = {
        root: { width: '100%', height: '50px', marginTop: '20px' },
        title: {
            color: 'black', // Placeholder text color
            fontSize: '16px',
            borderColor: '#999', // Border color
        },
        dropdownItem: {
            color: '#000', // Dropdown item text color
        },
        dropdownItemSelected: {
            backgroundColor: '#eaeaea', // Background color when item is selected
        },
        dropdownItemSelectedAndDisabled: {
            backgroundColor: '#f4f4f4',
        },
    };


    const DropdownErrorExampleOptions = [
        { key: 'A', text: 'Option a' },
        { key: 'B', text: 'Option b' },
        { key: 'C', text: 'Option c' },
        { key: 'D', text: 'Option d' },
        { key: 'E', text: 'Option e' },
    ];

    const [images, setImages] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const uploadedImages: string[] = [];
            const fileReaders: FileReader[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = (e) => {
                    const result = e.target?.result as string;
                    if (result) {
                        uploadedImages.push(result);
                    }

                    // 如果这是最后一个文件，更新状态
                    if (uploadedImages.length === files.length) {
                        setImages([...images, ...uploadedImages]);
                    }
                };

                reader.readAsDataURL(file);
                fileReaders.push(reader); // 保存 FileReader 实例以防止垃圾回收
            }
        }
    };

    const handleDeleteImage = (image: string) => {
        setImages(images.filter((img) => img !== image));
    };

    const virtualAdsInfo = useSelector((state: RootState) => state.virtualAds.virtualAdsInfo);
    const dispatch = useDispatch<AppDispatch>();
    const [displayTime, setDisplayTime] = useState<DisplayTime[]>([]);

    const [selectSession, setSelectSession] = useState<DisplayTime[]>([]);
    const _selection = new Selection({
        onSelectionChanged: () => {
            setSelectSession(_selection.getSelection() as DisplayTime[])
        },
    });

    const getDisplayTimes = async () => {
        try {
            const apiResponseData = await LiveStreamingApi.getDisplayTimes(virtualAdsInfo.SessionIds);
            const displayTimes: DisplayTime[] = transformApiResponseToDisplayTime(apiResponseData);
            setDisplayTime(displayTimes);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getDisplayTimes();
    }, []);

    const UploadImages = async () => {
        // 将所有图片文件组成的数组
        const imageFiles: File[] = [];
        images.forEach(item => {
            imageFiles.push(dataURItoFile(item, uuidv4().toString() + '.jpg')); // 将base64转为文件对象
        });
        // 上传所有图片文件
        try {
            const response = await FileUploadApi.uploadImages(imageFiles);
            return response.imageUrls;
        } catch (error) {
            console.error('上传图片失败', error);
        }
    };
    const combination = async () => {
        const imageurls = await UploadImages() as string[];
        let displaytime = selectSession;
        if (imageurls.length >= displaytime.length) {
            for (let i = 0; i < displaytime.length; i++) {
                displaytime[i].AdImageUrl = imageurls[i]
            };
        } else {
            for (let i = 0; i < displaytime.length; i++) {
                displaytime[i].AdImageUrl = imageurls[i % imageurls.length]
            };
        }
        dispatch(setDisplayTimes(displaytime));
    }

    return (
        <div>
            <div style={{ width: '50%', height: '10vh', overflowY: 'auto' }}>
                <Stack {...columnProps}>
                    <Dropdown
                        placeholder="Session Schedule"
                        options={DropdownErrorExampleOptions}
                        styles={dropdownStyles}
                    />
                </Stack>
            </div>
            <div style={{ width: '100%', height: '30vh', overflowX: 'hidden' }}>
                <Stack horizontal horizontalAlign="space-between" styles={{ root: { width: '100%' } }}>
                    <div style={{ width: '60%', height: '30vh', overflowX: 'hidden' }}>
                        <Stack horizontal wrap tokens={stackTokens} styles={{ root: { marginBottom: 20 } }}>
                            {images.map((image, index) => (
                                <div key={index} className={classNames.imageWrapper}>
                                    <Image src={image} styles={imageStyles} />
                                    <IconButton
                                        iconProps={{ imageProps: { src: deleteIcon, width: '15px', height: '15px' } }}
                                        className={classNames.deleteIcon}
                                        onClick={() => handleDeleteImage(image)}
                                    />
                                </div>
                            ))}
                            <input
                                type="file"
                                id="upload"
                                multiple
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <Image
                                src={plusIcon}
                                styles={uploadButtonStyles}
                                imageFit={ImageFit.contain}
                                onClick={() => document.getElementById('upload')?.click()}
                            />
                        </Stack>
                    </div>
                    <div style={{ marginRight: '10px' }}>
                        <Stack >
                            <Checkbox className={classNames.checkbox} label='Whether to link the image to all sessions' boxSide="end" />
                            <Label>Sessions / Images : 3/5 Completed</Label>
                        </Stack>
                    </div>
                </Stack>
            </div>
            <div style={{ width: '50%', height: '50vh', overflowY: 'auto' }}>
                <DetailsList
                    items={displayTime}
                    columns={columns}
                    setKey="set"
                    layoutMode={1}
                    selectionPreservedOnEmptyClick={true}
                    ariaLabelForSelectionColumn="Toggle selection"
                    ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                    checkButtonAriaLabel="select row"
                    selection={_selection}
                />
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

export default UploadVAImg;
