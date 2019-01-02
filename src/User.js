import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Row from "./Row";
import "./User.css";
import DoRequest from "./api";

const styles = theme => ({});

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    updateUser() {
        DoRequest('get_model_by_id')
    }

    render() {
        const {classes} = this.props;
        if (typeof (this.state.user) === "undefined" || this.state.user === null) {
            return (
                <div className="Loading">Загрузка...</div>
            );
        }

        return (
            <div>
                <Row>
                    <img src={this.state.user.avatar_url}/>
                </Row>
            </div>
        );
    }
}

export default withStyles(styles)(User);
