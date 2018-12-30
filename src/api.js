import axios from 'axios';

const apiURL = '/api/v1'

function DoRequest(method, data) {
    return axios.post(apiURL + "/" + method, data).catch(
        error => console.log(error.response)
        // TODO: handle errors in some better way
    );
}

export default DoRequest;
