import Axios from 'axios';

const apiUrl = 'https://video-conference-zoom-clone.herokuapp.com/';
function axiosInstance() {
    return Axios.create({
        baseURL: apiUrl,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
        }
    });
}

export { apiUrl, axiosInstance };