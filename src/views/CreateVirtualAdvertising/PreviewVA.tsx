import React, { useState } from 'react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack, IStackTokens, IStackStyles } from '@fluentui/react/lib/Stack';
import { useNavigate } from 'react-router-dom';
import { IconButton, Image, Dropdown, IDropdownStyles, IImageStyles } from '@fluentui/react';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import VirtualAdsApi from '../../api/VirtualAds';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { CreateVirtualAdsRequest } from '../../models/VirtualAds/CreateVirtualAdsRequest';

// Initialize Fluent UI icons
initializeIcons();

const carouselContainerStyles: IStackStyles = {
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'relative',
    },
};

const imageStyles: IImageStyles = {
    root: {
        width: '500px', // 图片宽度
        height: '300px', // 图片高度
        objectFit: 'cover',
    },
    image: undefined
};

const images = [
    'https://via.placeholder.com/500x300?text=Image+1',
    'https://via.placeholder.com/500x300?text=Image+2',
    'https://via.placeholder.com/500x300?text=Image+3',
];


const columnProps: Partial<IStackTokens> = {
    childrenGap: 15,
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

const PreviewVA: React.FC = () => {
    const navigate = useNavigate();
    const handleFinishButtonClick = () => {
        // 处理创建操作的逻辑
        createVirtualAds();
        navigate(`/virtualadvertising`);
    };
    const DropdownErrorExampleOptions = [
        { key: 'A', text: 'Option a' },
        { key: 'B', text: 'Option b' },
        { key: 'C', text: 'Option c' },
        { key: 'D', text: 'Option d' },
        { key: 'E', text: 'Option e' },
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePreviousClick = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNextClick = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };


    const virtualAdsInfo = useSelector((state: RootState) => state.virtualAds.virtualAdsInfo);
    const displayTimes = useSelector((state: RootState) => state.virtualAds.displayTimes);
    const createVirtualAds = async () => {
        let createVirtualAdsRequest: CreateVirtualAdsRequest = {
            virtualAdsInfo: virtualAdsInfo,
            displayTimes: displayTimes
        }
        await VirtualAdsApi.createVirtualAds(createVirtualAdsRequest);
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
            <div style={{ width: '90%', height: '60vh', overflowY: 'auto' }}>
                <Stack horizontal styles={carouselContainerStyles}>
                    <IconButton
                        iconProps={{ iconName: 'ChevronLeft' }}
                        onClick={handlePreviousClick}
                        disabled={currentIndex === 0}
                    />
                    <Image src={images[currentIndex]} styles={imageStyles} />
                    <IconButton
                        iconProps={{ iconName: 'ChevronRight' }}
                        onClick={handleNextClick}
                        disabled={currentIndex === images.length - 1}
                    />
                </Stack>
            </div>
            <div style={{ width: '50%', marginTop: '20px', marginLeft: "20px", display: 'flex' }}>
                <PrimaryButton onClick={handleFinishButtonClick} text="Finish" />
            </div>
        </div >

    );
};

export default PreviewVA;
