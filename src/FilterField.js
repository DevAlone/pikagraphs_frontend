import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import FormControlLabel from "@material-ui/core/es/FormControlLabel/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import {TextField} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Row from "./Row";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";

const styles = theme => ({});

class FilterField extends Component {
    constructor(props) {
        super(props);
        this.humanReadableName = this.props.fieldHumanReadableName;
        this.state = {
            selectedFunction: this.props.fieldConfig[0],
        }
    }

    handleDelete = () => {
        this.setState({
            isOpened: false,
        })
    };

    handleRadioChange = value => {
        this.setState(_ => {
            this.onChange(value);
            return {selectedFunction: value};
        });
    };

    onChange = (selectedFunction) => {
        this.props.onChange(this.props.fieldName, selectedFunction, "");
    };

    render() {
        // const {classes} = this.props;

        return (
            <Paper>
                <Row>
                    {this.humanReadableName}
                    {
                        this.props.fieldConfig.map((value, index) => {
                            return <FormControlLabel
                                value={value}
                                control={
                                    <Radio
                                        color={"primary"}
                                        checked={this.state.selectedFunction === value}
                                        onChange={() => {
                                            this.handleRadioChange(value)
                                        }}
                                    />
                                }
                                label={value}
                                labelPlacement={"end"}
                            />
                        })
                    }
                    <TextField/>
                    <Button onClick={this.handleDelete}><Icon>close</Icon></Button>
                </Row>
            </Paper>
        );
    }
}


export default withStyles(styles)(FilterField);
