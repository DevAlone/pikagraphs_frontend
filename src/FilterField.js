import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import FormControlLabel from "@material-ui/core/es/FormControlLabel/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import {TextField} from "@material-ui/core";
import Row from "./Row";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";

const styles = theme => ({
    row: {
        borderTop: "1px solid #eee",
        borderBottom: "1px solid #eee",
        margin: "10px 0",
    }
});

class FilterField extends Component {
    constructor(props) {
        super(props);
        this.humanReadableName = this.props.fieldHumanReadableName;
        this.type = this.props.fieldType;
        this.state = {
            selectedFunction: typeof this.props.selectedFunction !== "undefined" ?
                this.props.selectedFunction :
                this.props.fieldConfig[0],
            value: typeof this.props.value !== "undefined" && this.props.value.length > 0 ?
                this.props.value :
                this.type === "boolean" ?
                    "false" :
                    this.type === "number" ?
                        "0" :
                        "",
        };
        this.updateTimeout = 0;
        this.onChange();
    }

    handleDelete = () => {
        this.props.onDeleteRequested();
    };

    handleRadioChange = value => {
        this.setState({
            selectedFunction: value,
        }, this.onChange);
    };

    handleTextChange = e => {
        const value = e.target.value.trim();
        this.setState({
            value: value,
        }, this.onChange);
    };

    handleCheckboxChange = e => {
        this.setState({
            value: e.target.checked.toString(),
        }, this.onChange);
    };

    onChange = () => {
        if (this.state.selectedFunction.length === 0) {
            return;
        }
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }

        let filterValue = this.state.value;
        if (this.type === "text") {
            filterValue = '"' + filterValue + '"';
        }

        this.updateTimeout = setTimeout(() => {
            this.props.onChange(
                this.props.fieldName,
                this.state.selectedFunction,
                filterValue
            );
        }, 500);
    };

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.row}>
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
                    {
                        this.type === "boolean" ?
                            <Checkbox
                                onChange={this.handleCheckboxChange}
                                value={this.state.value}
                            /> :
                            <TextField
                                type={this.type}
                                onChange={this.handleTextChange}
                                value={this.state.value}
                            />
                    }
                    <Button onClick={this.handleDelete}><Icon>close</Icon></Button>
                </Row>
            </div>
        );
    }
}


export default withStyles(styles)(FilterField);
