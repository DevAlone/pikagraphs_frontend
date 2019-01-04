import React, {Component} from 'react';
import Chip from "@material-ui/core/Chip";
import './SearchParams.css';
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import FilterFieldButton from "./FilterFieldButton";
import FilterField from "./FilterField";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {TextField} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

class SearchParams extends Component {
    constructor(props) {
        super(props);

        this.state = {
            orderByField: Object.keys(this.props.orderByFields)[0],
            orderByFieldText: this.props.orderByFields[Object.keys(this.props.orderByFields)[0]],
            reversedOrder: true,
            filterFields: [],
        };
        this.props.onStateChanged(this.state);
    }

    handleSortFieldPress(fieldName) {
        this.setState(prevState => {
            // TODO: refactor!
            this.state.reversedOrder = prevState.orderByField === fieldName
                ? !prevState.reversedOrder : prevState.reversedOrder;
            this.state.orderByField = fieldName;
            this.state.orderByFieldText = this.props.orderByFields[fieldName];

            this.props.onStateChanged(this.state);

            return this.state;
        });
    }

    createFilter = (fieldName, operator, value) => {
        alert("coming soon...");
        /*this.setState(prevState => {
            var fields = prevState.filterFields;
            fields.push([fieldName, operator, value]);
            return {
                filterFields: fields,
            }
        });*/
    };

    handleChangeFilter = (index, fieldName, operator, value) => {
        this.setState(prevState => {
            var fields = prevState.filterFields;
            fields[index] = [fieldName, operator, value];
            console.log(fields);
            return {
                filterFields: fields,
            };
        });
    };

    render() {
        return (
            <div className={"root"}>
                <Paper className={"block"}>
                    <TextField
                        className={"searchField"}
                        onChange={() => {
                        }}
                        placeholder={"Введи сюда что-нибудь"}
                    />
                </Paper>

                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon/>}
                    >
                        Сортировать по:
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className={"orderingButtons"}>
                            {Object.keys(this.props.orderByFields).map(key => {
                                const value = this.props.orderByFields[key];

                                return (
                                    <Chip
                                        key={key}
                                        className="Chip"
                                        avatar={
                                            this.state.orderByField === key ?
                                                <Avatar>
                                                    {this.state.reversedOrder ?
                                                        <Icon>
                                                            arrow_downward
                                                        </Icon> :
                                                        <Icon>
                                                            arrow_upward
                                                        </Icon>
                                                    }
                                                </Avatar> :
                                                null
                                        }
                                        label={value[0]}
                                        color={this.state.orderByField === key ? "primary" : "default"}
                                        onClick={this.handleSortFieldPress.bind(this, key)}
                                    />
                                );
                            })}
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon/>}
                    >
                        Фильтровать по:
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className={"orderingButtons"}>
                            {Object.keys(this.props.filterByFields).map(key => {
                                const value = this.props.filterByFields[key];
                                return (
                                    <FilterFieldButton
                                        key={key}
                                        fieldName={key}
                                        fieldHumanReadableName={value[0]}
                                        fieldConfig={value[1]}
                                        onClick={this.createFilter}
                                    />
                                );
                            })}
                            {this.state.filterFields.map((value, index) => {
                                return (
                                    <FilterField
                                        key={index}
                                        fieldName={value[0]}
                                        fieldHumanReadableName={this.props.filterByFields[value[0]][0]}
                                        fieldConfig={this.props.filterByFields[value[0]][1]}
                                        onChange={(fieldName, operator, value) => {
                                            this.handleChangeFilter(index, fieldName, operator, value);
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    }
}

export default SearchParams;
