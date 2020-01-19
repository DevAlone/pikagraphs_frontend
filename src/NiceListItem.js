import React, {Component} from 'react';
import ListItem from "@material-ui/core/ListItem";
import {withStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import "./NiceListItem.css";

const styles = theme => ({});

function ListItemLink(props) {
    return <ListItem button {...props} />;
}

class NiceListItem extends Component {

    render() {
        return (
            <Link to={this.props.href} className={"NiceListItem"} draggable={false} title={this.props.title}>
                <ListItemLink>
                    {this.props.children}
                </ListItemLink>
            </Link>
        );
    }
}

export default withStyles(styles)(NiceListItem);
