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

        let orderByField = Object.keys(this.props.orderByFields)[0];
        let reversedOrder = true;

        if (typeof this.props.orderByField !== "undefined") {
            orderByField = this.props.orderByField;
            if (orderByField[0] === '-') {
                orderByField = orderByField.substring(1);
                reversedOrder = true;
            } else {
                reversedOrder = false;
            }
        }

        console.log("-----");
        console.log(this.props.orderByField);
        console.log(orderByField);
        console.log("-----");

        this.state = {
            orderByField: orderByField,
            orderByFieldText: this.props.orderByFields[orderByField],
            reversedOrder: reversedOrder,
            filterFields: [],
            searchText: '',
        };
        this.props.onStateChanged(this.state);
        this.searchText = '';
        this.searchTimeout = 0;
    }

    handleSortFieldPress(fieldName) {
        this.setState(prevState => {
            prevState.reversedOrder =
                prevState.orderByField === fieldName ?
                    !prevState.reversedOrder :
                    prevState.reversedOrder;
            prevState.orderByField = fieldName;
            prevState.orderByFieldText = this.props.orderByFields[fieldName];

            return prevState;
        }, () => {
            this.props.onStateChanged(this.state);
        });
    }

    createFilter = (fieldName, operator, value) => {
        this.setState(prevState => {
            var fields = prevState.filterFields;
            fields.push([fieldName, operator, value]);
            return {
                filterFields: fields,
            }
        });
    };

    handleChangeFilter = (index, fieldName, functionName, value) => {
        this.setState(prevState => {
            var fields = prevState.filterFields;
            fields[index] = [fieldName, functionName, value];

            return {
                filterFields: fields,
            };
        }, () => {
            this.props.onStateChanged(this.state);
        });
    };

    handleDeleteFilter = (index) => {
        this.setState(prevState => {
            return {
                filterFields: prevState.filterFields.filter((_, i) => i !== index),
            };
        }, () => {
            this.props.onStateChanged(this.state);
        })
    };

    handleSearchFieldChanged = (event) => {
        this.searchText = event.target.value;
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(() => {
            this.setState(prevState => {
                prevState.searchText = this.searchText;
                this.props.onStateChanged(prevState);
                return prevState;
            });
        }, 500);
    };

    render() {
        return (
            <div className={"root"}>
                <Paper className={"block"}>
                    <TextField
                        className={"searchField"}
                        onChange={event => this.handleSearchFieldChanged(event)}
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
                        <div className={"filteringButtons"}>
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
                                console.log("filterFields value");
                                console.log(value)
                                return (
                                    <FilterField
                                        key={value[0]}
                                        fieldName={value[0]}
                                        fieldHumanReadableName={this.props.filterByFields[value[0]][0]}
                                        fieldConfig={this.props.filterByFields[value[0]][1]}
                                        fieldType={this.props.filterByFields[value[0]][2]}
                                        onChange={(fieldName, functionName, argument) => {
                                            this.handleChangeFilter(index, fieldName, functionName, argument);
                                        }}
                                        onDeleteRequested={() => {
                                            this.handleDeleteFilter(index);
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
