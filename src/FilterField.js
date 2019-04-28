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
        this.type = this.props.fieldType;
        this.state = {
            selectedFunction: this.props.fieldConfig[0],
            value: "",
        };
        this.updateTimeout = 0;
    }

    handleDelete = () => {
        // TODO: delete this shit
        // this.setState({})
    };

    handleRadioChange = value => {
        this.setState({
            selectedFunction: value,
        }, this.onChange);
    };

    handleTextChange = e => {
        // TODO: call it later
        const value = e.target.value.trim();
        if (value.length === 0) {
            return;
        }
        this.setState({
            value: value,
        }, this.onChange);
    };

    onChange = () => {
        if (this.state.value.length === 0 || this.state.selectedFunction.length === 0) {
            return;
        }
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
        this.updateTimeout = setTimeout(() => {
            // this.props.onChange(this.props.fieldName, this.state.selectedFunction, this.state.value);
            this.props.onChange(
                [
                    this.props.fieldName, this.state.selectedFunction, this.state.value
                ].join(" ")
            );
        }, 500);
    };

    render() {
        return (
            <Paper>
                <Row>
                    {this.humanReadableName}
                    {
                        this.props.fieldConfig.map((value, index) => {
                            return <FormControlLabel
                                key={index}
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
                    <TextField type={this.type} onChange={this.handleTextChange}/>
                    <Button onClick={this.handleDelete}><Icon>close</Icon></Button>
                </Row>
            </Paper>
        );
    }
}


export default withStyles(styles)(FilterField);
