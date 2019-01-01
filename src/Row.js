import React, {Component} from 'react';
import "./Row.css";

class Row extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div className="Row">
                {this.props.children}
            </div>
        );
    }
}

export default Row;
