import axios from 'axios';

const apiURL = '/api/v1';

class API {
    doRequest(method, data, cancelToken) {
        return axios.post(apiURL + "/" + method, data, {
            cancelToken: cancelToken,
        }).catch(
            error => {
                console.log("ERROR: ", error)

                if (typeof error.response !== "undefined") {
                    if (typeof error.response.data.error_message !== "undefined") {
                        alert(error.response.data.error_message);
                    } else {
                        alert(error.response.data);
                    }
                } else {
                    console.log("error.response is undefined");
                }
            }
        );
    }
}


const api = new API();
const DoRequest = api.doRequest.bind(api);
export default DoRequest;
