import { CreateVirtualAdsRequest } from '../models/VirtualAds/CreateVirtualAdsRequest';
import { VirtualAdsUrl } from './Endpoints';
import ServerHttp from './ServerHttp';


const createVirtualAds = async (createVirtualAdsRequest: CreateVirtualAdsRequest) => {
    try {
        const url = `${VirtualAdsUrl}/CreateVirtualAds`;
        return await ServerHttp.post(url, JSON.stringify(createVirtualAdsRequest));
    } catch (error) {
        return '';
    }
};

const getVirtualAds = async () => {
    try {
        const url = `${VirtualAdsUrl}/GetVirtualAds`;
        return await ServerHttp.get(url);
    } catch (error) {
        return '';
    }
};


const VirtualAdsApi = {
    createVirtualAds,
    getVirtualAds,
  };
  
  export default VirtualAdsApi;