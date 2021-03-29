import Axios from 'axios';

const apiUrl = 'http://localhost:5000';
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