import React, {Component} from 'react';
import ListItem from "@material-ui/core/ListItem";
import {withStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";

const styles = theme => ({
    root: {
        textDecoration: "none",
    },
});

function ListItemLink(props) {
    return <ListItem button {...props} />;
}

class NiceListItem extends Component {

    render() {
        const {classes} = this.props;

        return (
            <Link to={this.props.href} className={classes.root}>
                <ListItemLink>
                    {this.props.children}
                </ListItemLink>
            </Link>
        );
    }
}

export default withStyles(styles)(NiceListItem);
