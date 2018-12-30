import React, {Component} from 'react';
import DoRequest from './api';
import Button from "@material-ui/core/Button";

class Users extends Component {
    constructor(props) {
        super(props);

        this.fetchMore = this.fetchMore.bind(this);
        this.state = {
            users: [],
        };
        this.offset = 0;
        this.limit = 2;
    }

    fetchMore() {
        DoRequest('get_model', {
            name: 'pikabu_user',
            limit: this.limit,
            offset: this.offset,
        }).then(response => {
            this.offset += this.limit;
            response = response.data;
            if (response.results != null) {
                this.setState(prevState => {
                    return {users: prevState.users.concat(response.results)};
                });
            }
        });
    }

    render() {
        return (
            <div>
                <Button onClick={this.fetchMore}>
                    fetch more
                </Button>
                {this.state.users.map((value, index) => {
                    return <h1 key={value.username}>{value.username}</h1>;
                })}
            </div>
        );
    }
}

export default Users;
