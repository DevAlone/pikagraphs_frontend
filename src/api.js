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
                    alert(error.response.data.error_message);
                } else {
                    alert("some error happened");
                }
            }
        );
    }
}


const api = new API();
const DoRequest = api.doRequest.bind(api);
export default DoRequest;
