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
import {TextField, withStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import * as queryString from "query-string";
import {withRouter} from "react-router-dom";
import {
    filtersFromString,
    filtersStringFromURLCompatible,
    filtersStringToURLCompatible,
    filtersToString
} from "./helpers";
import Row from "./Row";

const styles = () => ({
    filterField: {
        paddingLeft: 25,
    },
    sortByLabel: {
        marginRight: 10,
    },
});

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

        const getParams = queryString.parse(window.location.search, {parseNumbers: true, parseBooleans: true});

        const searchText = "search_text" in getParams ? getParams["search_text"] : '';
        if ("sort_by" in getParams && this.props.orderByFields.hasOwnProperty(getParams["sort_by"])) {
            orderByField = getParams["sort_by"];
        }
        if ("reverse_sort" in getParams) {
            reversedOrder = getParams["reverse_sort"];
        }

        const filterFields = "filter" in getParams ?
            filtersFromString(filtersStringFromURLCompatible(getParams["filter"])) :
            [];

        this.state = {
            orderByField: orderByField,
            orderByFieldText: this.props.orderByFields[orderByField],
            reversedOrder: reversedOrder,
            filterFields: filterFields,
            searchText: searchText,
        };
        this.props.onStateChanged(this.state);
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
            this.updateURL();
        });
    }

    createFilter = (fieldName, operator, value) => {
        this.setState(prevState => {
            let fields = prevState.filterFields;
            fields.push([fieldName, operator, value]);
            return {
                filterFields: fields,
            }
        }, () => {
            this.props.onStateChanged(this.state);
            this.updateURL();
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
            this.updateURL();
        });
    };

    handleDeleteFilter = (index) => {
        this.setState(prevState => {
            return {
                filterFields: prevState.filterFields.filter((_, i) => i !== index),
            };
        }, () => {
            this.props.onStateChanged(this.state);
            this.updateURL();
        })
    };

    handleSearchFieldChanged = (event) => {
        const searchText = event.target.value;
        this.setState({
            searchText: searchText,
        });

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(() => {
            this.setState({
                searchText: searchText,
            }, () => {
                this.props.onStateChanged(this.state);
                this.updateURL();
            });
        }, 500);
    };

    updateURL = () => {
        const getParams = new URLSearchParams();

        if (this.state.searchText.length > 0) {
            getParams.set("search_text", this.state.searchText);
        }
        if (this.state.orderByField.length > 0) {
            getParams.set("sort_by", this.state.orderByField);
            if (this.state.reversedOrder) {
                getParams.set("reverse_order", true);
            }
        }
        const filtersString = filtersStringToURLCompatible(filtersToString(this.state.filterFields));
        if (filtersString.length > 0) {
            getParams.set("filter", filtersString);
        }

        this.props.history.push({
            search: getParams.toString(),
        });
    };

    render() {
        const {classes} = this.props;

        return (
            <div className={"root"}>
                <Paper className={"block"}>
                    <TextField
                        className={"searchField"}
                        onChange={event => this.handleSearchFieldChanged(event)}
                        placeholder={"Введи сюда что-нибудь"}
                        value={this.state.searchText}
                    />
                </Paper>

                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon/>}
                    >
                        <Row>
                            <span className={classes.sortByLabel}>Сортировать по</span>
                            {Object.keys(this.props.orderByFields).map(key => {
                                const value = this.props.orderByFields[key];

                                if (this.state.orderByField !== key || key.length === 0) {
                                    return null;
                                }
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
                                        onClick={(e) => {
                                            this.handleSortFieldPress(key);
                                            e.stopPropagation();
                                        }}
                                    />
                                );
                            })}
                        </Row>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className={"orderingButtons"}>
                            {Object.keys(this.props.orderByFields).map(key => {
                                const value = this.props.orderByFields[key];

                                if (this.state.orderByField === key) {
                                    return null;
                                }
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
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                {this.state.filterFields.map((value, index) => {
                    const fieldName = value[0];
                    const fieldHumanReadableName = this.props.filterByFields[fieldName][0];

                    return (
                        <div className={classes.filterField}>
                            <FilterField
                                key={value[0]}
                                selectedFunction={value[1]}
                                value={value[2]}
                                fieldName={fieldName}
                                fieldHumanReadableName={fieldHumanReadableName}
                                fieldConfig={this.props.filterByFields[fieldName][1]}
                                fieldType={this.props.filterByFields[fieldName][2]}
                                onChange={(fieldName, functionName, argument) => {
                                    this.handleChangeFilter(index, fieldName, functionName, argument);
                                }}
                                onDeleteRequested={() => {
                                    this.handleDeleteFilter(index);
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(SearchParams));
