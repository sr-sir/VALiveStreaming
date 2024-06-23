import { FileUploadUrl } from './Endpoints';
import ServerHttp from './ServerHttp';


const uploadImages = async (files: File[]) => {
    try {
        const url = `${FileUploadUrl}/UploadImages`;
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });
        return await ServerHttp.post(url, formData);
    } catch (error) {
        return '';
    }
};


const uploadJson = async (file: File) => {
    try {
        const url = `${FileUploadUrl}/UploadJson`;
        const formData = new FormData();
        formData.append('file', file);
         return await ServerHttp.post(url, formData);
    } catch (error) {
        return '';
    }
};


const FileUploadApi = {
    uploadImages,
    uploadJson,
};

export default FileUploadApi;