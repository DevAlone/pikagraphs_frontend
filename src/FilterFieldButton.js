import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Chip from "@material-ui/core/Chip";

const styles = theme => ({});

class FilterFieldButton extends Component {
    constructor(props) {
        super(props);
        this.humanReadableName = this.props.fieldHumanReadableName;
    }

    handleClick = () => {
        this.props.onClick(this.props.fieldName, this.props.fieldConfig[0], "");
    };

    render() {
        return (
            <Chip
                label={
                    <span>
                        {this.humanReadableName}
                    </span>
                }
                onClick={this.handleClick}
            />
        );
    }
}


export default withStyles(styles)(FilterFieldButton);
