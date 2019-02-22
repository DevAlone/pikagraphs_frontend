import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
    },
});

function Block(props) {
    const {classes} = props;

    return (
        <Paper className={classes.root} elevation={1}>
            {props.children}
        </Paper>
    );
}

Block.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Block);
