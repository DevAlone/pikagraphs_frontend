import React, {Component} from 'react';
import Chip from "@material-ui/core/Chip";
import './SearchParams.css';
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import FilterFieldButton from "./FilterFieldButton";
import FilterField from "./FilterField";

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
        this.setState(prevState => {
            var fields = prevState.filterFields;
            fields.push([fieldName, operator, value]);
            return {
                filterFields: fields,
            }
        });
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
            <div>
                Поиск:
                <div>
                    Сортировать по: {Object.keys(this.props.orderByFields).map(key => {
                    const value = this.props.orderByFields[key];

                    return (
                        <Chip
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
                <div>
                    Фильтры:
                    {Object.keys(this.props.filterByFields).map(key => {
                        const value = this.props.filterByFields[key];
                        return (
                            <FilterFieldButton
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
            </div>
        );
    }
}

export default SearchParams;
