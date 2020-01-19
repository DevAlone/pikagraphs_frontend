import React, {Component} from 'react';
import List from "@material-ui/core/List";
import withStyles from "@material-ui/core/styles/withStyles";
import Row from "../Row";
import SearchParams from "../SearchParams";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from 'axios';
import DoRequest from "../api";
import {CopyToClipboard} from "react-copy-to-clipboard";
import Button from "@material-ui/core/Button";
import {filtersToString} from "../helpers";

const styles = theme => ({
    avatar: {
        height: "40px",
    },
    selectable: {
        userSelect: "text",
    }
});

// TODO: return back url params

class Feed extends Component {
    constructor(props) {
        super(props);

        this.fetchMore = this.fetchMore.bind(this);

        this.state = {
            items: [],
            hasMoreItems: true,
            searchParamsState: {
                orderByField: this.props.orderByField,
            },
        };
        this.offset = 0;
        this.limit = 64;
        // this.fetchMore();
        this.requestCancelToken = null;
    }

    getTextToCopy = () => {
        let res = "";
        for (const item of this.state.items) {
            if (res.length === 0) {
                for (const [propertyName,] of Object.entries(item)) {
                    res += propertyName + "\t";
                }
                res += "\n";
            }
            for (const [, propertyVal] of Object.entries(item)) {
                res += propertyVal + "\t";
            }
            res += "\n";
        }

        return res;
    };

    createFilters() {
        return filtersToString(this.state.searchParamsState.filterFields);
    }

    fetchMore(page) {
        let filter = "";
        if (this.props.searchFieldName.length > 0 && this.state.searchParamsState.searchText.length > 0) {
            filter += 'ilike(' + this.props.searchFieldName + ', "%' + this.state.searchParamsState.searchText + '%")';
        }
        const filtersString = this.createFilters();
        if (filtersString.length > 0) {
            if (filter.length > 0) {
                filter += " && ";
            }
            filter += filtersString;
        }

        if (this.requestCancelToken) {
            this.requestCancelToken.cancel();
        }
        this.requestCancelToken = axios.CancelToken.source();

        let order_by_fields = null;
        if (this.state.searchParamsState !== null && this.state.searchParamsState.orderByField.length > 0) {
            if (this.state.searchParamsState.reversedOrder) {
                order_by_fields = '-';
            } else {
                order_by_fields = '';
            }
            order_by_fields += this.state.searchParamsState.orderByField;
        }

        DoRequest('list_model', {
            name: this.props.modelName,
            limit: this.limit,
            offset: this.offset,
            order_by_fields: order_by_fields,
            filter: filter,
        }, this.requestCancelToken.token).then(response => {
            if (typeof response === "undefined") {
                console.log("response is undefined again, for some reason...");
                return;
            }
            this.offset += this.limit;
            response = response.data;
            if (response.results.length > 0) {
                this.setState(prevState => {
                    return {
                        items: prevState.items.concat(response.results),
                    };
                });
            } else {
                this.setState({
                    hasMoreItems: false,
                });
            }
        });
    }

    searchParamsStateChanged(state) {
        this.setState(() => {
            this.offset = 0;
            return {
                items: [],
                hasMoreItems: true,
                searchParamsState: state,
            };
        }, this.fetchMore);
    }

    render() {
        const searchParams = <SearchParams
            orderByField={this.props.orderByField}
            orderByFields={this.props.orderByFields}
            filterByFields={this.props.filterByFields}
            onStateChanged={this.searchParamsStateChanged.bind(this)}
        />;

        return (
            <div>
                {searchParams}

                <CopyToClipboard
                    text={this.getTextToCopy()}
                    onCopy={console.log("copied succesfully")}>
                    <Button>Скопировать в буфер обмена</Button>
                </CopyToClipboard>

                {this.props.customFeedControls}

                <InfiniteScroll
                    dataLength={this.state.items.length}
                    next={this.fetchMore}
                    hasMore={this.state.hasMoreItems}
                    loader={<h1>Загрузка...</h1>}
                    endMessage={
                        <p style={{textAlign: 'center'}}>
                            Это всё ¯\_(ツ)_/¯
                        </p>
                    }
                    scrollableTarget={"appContent"}
                >
                    <List>
                        {this.state.items.map((value) => {
                            return (<Row key={value.pikabu_id}>
                                {this.props.itemRenderer(value, this)}
                            </Row>);
                        })}
                    </List>
                </InfiniteScroll>
            </div>
        );
    }
}

export default withStyles(styles)(Feed);
