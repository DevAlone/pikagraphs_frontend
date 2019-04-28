import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

const styles = theme => ({
    expansionPanel: {
        margin: "10px 0",
    },
    expansionPanelSummary: {
        padding: "0 20px",
    },
});

class ExpandableItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpened: false,
        }
    }

    render() {
        const {classes} = this.props;

        return (
            <ExpansionPanel
                className={classes.expansionPanel}
                onChange={isOpened => {
                    this.setState({isOpened: true});
                }}
            >
                <ExpansionPanelSummary
                    className={classes.expansionPanelSummary}
                    expandIcon={<ExpandMoreIcon/>}
                    title={this.props.title}
                >
                    {this.props.title}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {
                        this.state.isOpened ?
                            this.props.children :
                            null
                    }
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

export default withStyles(styles)(ExpandableItem);
