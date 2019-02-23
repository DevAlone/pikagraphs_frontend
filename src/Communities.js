import React, {Component} from 'react';
import DoRequest from './api';
import List from "@material-ui/core/List";
import BeautifulListItem from "./NiceListItem";
import ListItemText from "@material-ui/core/ListItemText";
import withStyles from "@material-ui/core/styles/withStyles";
import Row from "./Row";
import SearchParams from "./SearchParams";
import InfiniteScroll from "react-infinite-scroll-component";
import "./Communities.css";
import NiceLink from "./NiceLink";
import timestampToString from "./date_utils";

const styles = theme => ({
    avatar: {
        height: "40px",
    },
});

class Communities extends Component {
    constructor(props) {
        super(props);

        this.fetchMore = this.fetchMore.bind(this);


        this.state = {
            items: [],
            hasMoreItems: true,
            searchParamsState: {
                orderByField: "-number_of_subscribers",
            },
        };
        this.offset = 0;
        this.limit = 64;
        // this.fetchMore();
    }

    fetchMore = () => {
        /*const filter = this.state.searchParamsState.searchText.length > 0 ?
            'ilike(name, "%' + this.state.searchParamsState.searchText + '%") || ' +
            'ilike(link_name, "%' + this.state.searchParamsState.searchText + '%")' :
            '';*/
        const filter = this.state.searchParamsState.searchText.length > 0 ?
            'ilike(name, "%' + this.state.searchParamsState.searchText + '%")' :
            '';
        DoRequest('list_model', {
            name: 'pikabu_community',
            limit: this.limit,
            offset: this.offset,
            order_by_fields: this.state.searchParamsState != null ?
                (this.state.searchParamsState.reversedOrder ?
                    '-' : '') + this.state.searchParamsState.orderByField
                : null,
            filter: filter,
        }).then(response => {
            this.offset += this.limit;
            response = response.data;
            if (response.results != null && response.results.length > 0) {
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
    };

    searchParamsStateChanged(state) {
        this.setState(prevState => {
            this.offset = 0;
            return {
                items: [],
                hasMoreItems: true,
                searchParamsState: state,
            };
        });
        setTimeout(this.fetchMore, 50);
    }

    render() {
        const {classes} = this.props;
        const searchParams = <SearchParams
            orderByFields={{
                "number_of_subscribers": ["Количеству подписчиков", "Подписчиков"],
                "number_of_stories": ["Количеству постов", "Постов"],
                "pikabu_id": ["ID на Пикабу", "ID на Пикабу"],
                "name": ["Название", null],
                "added_timestamp": ["Дате добавления в pikagraphs", "Дата добавления в pikagraphs"],
                "last_update_timestamp": ["Последнему времени обновления", "Последнее время обновления"],
            }}
            filterByFields={{
                "pikabu_id": ["ID на Пикабу", [">", "<", ">=", "<=", "==", "!="]],
            }}
            onStateChanged={this.searchParamsStateChanged.bind(this)}
        />;

        return (
            <div>
                {searchParams}
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
                        {this.state.items.map((value, index) => {
                            return (
                                <Row
                                    key={value.link_name}
                                >
                                    <div className={"communityLink"}>
                                        <BeautifulListItem
                                            href={"/community/" + value.link_name}
                                        >
                                            <img className={classes.avatar} src={value.avatar_url} alt={"avatar"}/>
                                            <ListItemText primary={value.name}/>
                                            {this.state.searchParamsState.orderByFieldText[1] != null ?
                                                <Row>
                                                    <ListItemText>{this.state.searchParamsState.orderByFieldText[1]}: </ListItemText>
                                                    <ListItemText>{
                                                        this.state.searchParamsState.orderByField === "added_timestamp" ||
                                                        this.state.searchParamsState.orderByField === "last_update_timestamp" ?
                                                            timestampToString(value[this.state.searchParamsState.orderByField]) :
                                                            value[this.state.searchParamsState.orderByField]
                                                    }</ListItemText>
                                                </Row>
                                                : null
                                            }
                                        </BeautifulListItem>
                                    </div>
                                    <NiceLink
                                        href={value.url}
                                        title={"Показать на Пикабу"}>
                                        <img
                                            src={"https://s.pikabu.ru/favicon.ico"}
                                            alt={"Открыть на Пикабу"}
                                            className={"showOnPikabuImg"}
                                        />
                                    </NiceLink>
                                </Row>
                            );
                        })}
                    </List>
                </InfiniteScroll>
            </div>
        );
    }
}

export default withStyles(styles)(Communities);
