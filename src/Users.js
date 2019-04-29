import React, {Component} from 'react';
import List from "@material-ui/core/List";
import BeautifulListItem from "./NiceListItem";
import ListItemText from "@material-ui/core/ListItemText";
import withStyles from "@material-ui/core/styles/withStyles";
import Row from "./Row";
import SearchParams from "./SearchParams";
import InfiniteScroll from "react-infinite-scroll-component";
import NiceLink from "./NiceLink";
import timestampToString from "./date_utils";
import axios from 'axios';
import DoRequest from "./api";

const styles = theme => ({
    avatar: {
        height: "40px",
    },
});

class Users extends Component {
    constructor(props) {
        super(props);

        this.fetchMore = this.fetchMore.bind(this);


        this.state = {
            users: [],
            hasMoreItems: true,
            searchParamsState: {
                orderByField: "rating",
            },
        };
        this.offset = 0;
        this.limit = 64;
        // this.fetchMore();
        this.requestCancelToken = null;
    }

    createFilters() {
        console.log(this.state.searchParamsState);
        const filtersString = this.state.searchParamsState.filterFields.filter(filter => {
            return filter[2].length > 0;
        }).map(filter => {
            return filter.join(" ");
        }).join(" && ");
        console.log("filters string is '" + filtersString + "'");
        console.log(filtersString);
        return filtersString
    }

    fetchMore(page) {
        let filter = "";
        if (this.state.searchParamsState.searchText.length > 0) {
            filter += 'ilike(username, "%' + this.state.searchParamsState.searchText + '%")';
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

        DoRequest('list_model', {
            name: 'pikabu_user',
            limit: this.limit,
            offset: this.offset,
            order_by_fields: this.state.searchParamsState != null ?
                (this.state.searchParamsState.reversedOrder ?
                    '-' : '') + this.state.searchParamsState.orderByField
                : null,
            filter: filter,
        }, this.requestCancelToken.token).then(response => {
            this.offset += this.limit;
            response = response.data;
            if (response.results != null) {
                this.setState(prevState => {
                    return {
                        users: prevState.users.concat(response.results),
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
                users: [],
                hasMoreItems: true,
                searchParamsState: state,
            };
        }, this.fetchMore);
    }

    render() {
        const {classes} = this.props;
        const searchParams = <SearchParams
            orderByFields={{
                "rating": ["Рейтингу", "Рейтинг"],
                "number_of_subscribers": ["Количеству подписчиков", "Подписчиков"],
                "number_of_comments": ["Количеству комментариев", "Комментариев"],
                "number_of_stories": ["Количеству постов", "Постов"],
                "number_of_hot_stories": ["Количеству горячих постов", "Горячих постов"],
                "number_of_pluses": ["Количеству плюсов", "Плюсов"],
                "number_of_minuses": ["Количеству минусов", "Минусов"],
                "pikabu_id": ["ID на Пикабу", "ID на Пикабу"],
                "username": ["Никнейму", null],
                "signup_timestamp": ["Дате регистрации", "Дата регистрации"],
                "approved_text": ["Подтверждён", ""],
                "ban_end_timestamp": ["Дате окончания бана", "Дата окончания бана"],
                "is_rating_hidden": ["Рейтинг скрыт", ""],
                "is_banned": ["Забанен", ""],
                "is_permanently_banned": ["Полностью забанен", ""],
                "added_timestamp": ["Дате добавления в pikagraphs", "Дата добавления в pikagraphs"],
                "last_update_timestamp": ["Последнему времени обновления", "Последнее время обновления"],
                "next_update_timestamp": ["Следующему времени обновления", "Следующее время обновления"],
            }}
            filterByFields={{
                "pikabu_id": ["ID на Пикабу", [">=", "<=", "==", "!="], "number"],

                "gender": ["Полу(0, 1 или 2)", ["==", "!="], "text"],

                "rating": ["Рейтингу", [">=", "<=", "==", "!="], "number"],
                "number_of_comments": ["Количеству комментариев", [">=", "<=", "==", "!="], "number"],
                "number_of_subscribers": ["Количеству подписчиков", [">=", "<=", "==", "!="], "number"],
                "number_of_stories": ["Количеству постов", [">=", "<=", "==", "!="], "number"],
                "number_of_hot_stories": ["Количеству горячих постов", [">=", "<=", "==", "!="], "number"],
                "number_of_pluses": ["Количеству плюсов", [">=", "<=", "==", "!="], "number"],
                "number_of_minuses": ["Количеству минусов", [">=", "<=", "==", "!="], "number"],

                "signup_timestamp": ["Дате регистрации(timestamp)", [">=", "<=", "==", "!="], "number"],
                "ban_end_timestamp": ["Дате окончания бана(timestamp)", [">=", "<=", "==", "!="], "number"],
                "added_timestamp": ["Дате добавления в pikastat", [">=", "<=", "==", "!="], "number"],
                "last_update_timestamp": ["Дате последнего обновления(timestamp)", [">=", "<=", "==", "!="], "number"],
                "next_update_timestamp": ["Дате следующего обновления(timestamp)", [">=", "<=", "==", "!="], "number"],

                "is_rating_hidden": ["Рейтинг скрыт", ["=="], "boolean"],
                "is_banned": ["Забанен", ["=="], "boolean"],
                "is_permanently_banned": ["Постоянно забанен", ["=="], "boolean"],
                "is_deleted": ["Удалён", ["=="], "boolean"],
                // "approved_text": ["", [], ""],
                // "award_ids": ["", [], ""],
                // "community_ids": ["", [], ""],
                // "ban_history_item_ids": ["", [], ""],
            }}
            onStateChanged={this.searchParamsStateChanged.bind(this)}
        />;

        return (
            <div>
                {searchParams}
                <InfiniteScroll
                    dataLength={this.state.users.length}
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
                        {this.state.users.map((value, index) => {
                            return (
                                <Row
                                    key={index}
                                >
                                    <div className="userLink">
                                        <BeautifulListItem
                                            href={"/user/pikabu_id==" + value.pikabu_id}
                                        >
                                            <img className={classes.avatar} src={
                                                value.avatar_url.length > 0 ?
                                                    value.avatar_url :
                                                    "https://cs.pikabu.ru/images/def_avatar/def_avatar_96.png"
                                            } alt={"avatar"}/>
                                            <ListItemText primary={value.username}/>
                                            {this.state.searchParamsState.orderByFieldText[1] != null ?
                                                <Row>
                                                    <ListItemText>{this.state.searchParamsState.orderByFieldText[1]}: </ListItemText>
                                                    <ListItemText>{
                                                        this.state.searchParamsState.orderByField === "signup_timestamp" ||
                                                        this.state.searchParamsState.orderByField === "ban_end_timestamp" ||
                                                        this.state.searchParamsState.orderByField === "added_timestamp" ||
                                                        this.state.searchParamsState.orderByField === "last_update_timestamp" ||
                                                        this.state.searchParamsState.orderByField === "next_update_timestamp" ?
                                                            timestampToString(value[this.state.searchParamsState.orderByField]) :
                                                            value[this.state.searchParamsState.orderByField]
                                                    }</ListItemText>
                                                </Row>
                                                : null
                                            }
                                        </BeautifulListItem>
                                    </div>
                                    <NiceLink
                                        href={"https://pikabu.ru/@" + value.username}
                                        target="_blank"
                                        title={"Показать на Пикабу"}>
                                        <img
                                            className="showOnPikabuImg"
                                            src={"https://s.pikabu.ru/favicon.ico"}
                                            alt={"Показать на Пикабу"}/>
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

export default withStyles(styles)(Users);
