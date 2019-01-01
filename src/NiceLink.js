import React, {Component} from 'react';
import './NiceLink.css';

class NiceListItem extends Component {
    render() {
        return (
            <a className="NiceLink" rel="nofollow noopener noreferrer" {...this.props}>
                {this.props.children}
            </a>
        );
    }
}

export default NiceListItem;
