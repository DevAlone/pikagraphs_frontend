import React, {Component} from 'react';
import './NiceLink.css';
import Url from 'url-parse';

class NiceListItem extends Component {
    constructor(props) {
        super(props)

        const url = new Url(this.props.href);
        this.sameHost = url.host === new Url(window.location.href).host;
    }

    render() {
        return (
            <a
                className="NiceLink"
                rel="nofollow noopener noreferrer"
                target={this.sameHost ? null : "_blank"}
                {...this.props}>
                {this.props.children}
            </a>
        );
    }
}

export default NiceListItem;
