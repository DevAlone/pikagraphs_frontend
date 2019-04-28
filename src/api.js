import axios from 'axios';
import {Component} from "react";

const apiURL = '/api/v1';

class API extends Component {
    doRequest(method, data, cancelToken) {
        return axios.post(apiURL + "/" + method, data, {
            cancelToken: cancelToken,
        }).catch(
            error => {
                console.log(error.response)
                // this.props.alert.show(error.response.error_message);
                alert(error.response.data.error_message);
            }
        );
    }
}


const api = new API();
const DoRequest = api.doRequest.bind(api);
export default DoRequest;
