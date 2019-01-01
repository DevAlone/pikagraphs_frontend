import React, {Component} from 'react';
import ListItem from "@material-ui/core/ListItem";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    root: {},
});

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

class NiceListItem extends Component {

    render() {
        const {classes} = this.props;

        return (
            <ListItemLink href={this.props.href} className={classes.root}>
                {this.props.children}
            </ListItemLink>
        );
    }
}

export default withStyles(styles)(NiceListItem);
