import React, {Component} from 'react';
import DoRequest from './api';
import InfiniteScroll from 'react-infinite-scroller';
import List from "@material-ui/core/List";
import BeautifulListItem from "./NiceListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import withStyles from "@material-ui/core/styles/withStyles";
import Row from "./Row";
import NiceLink from "./NiceLink";
import SearchParams from "./SearchParams";

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
        this.limit = 2;
    }

    fetchMore(page) {
        if (this.isFetching) {
            setTimeout(this.fetchMore, 10);
            return;
        }

        this.isFetching = true;

        DoRequest('get_model', {
            name: 'pikabu_user',
            limit: this.limit,
            offset: this.offset,
            order_by_fields: this.state.searchParamsState != null ?
                (this.state.searchParamsState.reversedOrder ?
                    '-' : '') + this.state.searchParamsState.orderByField
                : null,
        }).then(response => {
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

            this.isFetching = false;
        }).catch(() => this.isFetching = false);
    }

    searchParamsStateChanged(state) {
        this.setState(prevState => {
            this.offset = 0;
            return {
                users: [],
                hasMoreItems: true,
                searchParamsState: state,
            };
        });
    }

    render() {
        const {classes} = this.props;
        const searchParams = <SearchParams
            orderByFields={{
                "pikabu_id": ["ID на Пикабу", "ID на Пикабу"],
                "username": ["Никнейму", null],
                "gender": ["Полу", "Пол"],
                "rating": ["Рейтингу", "Рейтинг"],
                "number_of_comments": ["Количеству комментариев", "Комментариев"],
                "number_of_subscribers": ["Количеству подписчиков", "Подписчиков"],
                "number_of_stories": ["Количеству постов", "Постов"],
                "number_of_hot_stories": ["Количеству горячих постов", "Горячих постов"],
                "number_of_pluses": ["Количеству плюсов", "Плюсов"],
                "number_of_minuses": ["Количеству минусов", "Минусов"],
                "signup_timestamp": ["Дате регистрации", "Дата регистрации"],
                "avatar_url": ["аватар урл", ""],
                "approved_text": ["Подтверждён", ""],
                "award_ids": ["awardsid", ""],
                "community_ids": ["community id", ""],
                "ban_history_item_ids": ["ban history items", ""],
                "ban_end_timestamp": ["Дате окончания бана", "Дата окончания бана"],
                "is_rating_hidden": ["Рейтинг скрыт", ""],
                "is_banned": ["Забанен", ""],
                "is_permanently_banned": ["Полностью забанен", ""],
                "added_timestamp": ["Дате добавления в pikagraphs", "Дата добавления в pikagraphs"],
                "last_update_timestamp": ["Последнему времени обновления", "Последнее время обновления"],
                "next_update_timestamp": ["Следующему времени обновления", "Следующее время обновления"],
            }}
            filterByFields={{
                "pikabu_id": ["ID на Пикабу", [">", "<", ">=", "<=", "==", "!="]],
                "username": ["Никнейм", ["=="]],
            }}
            onStateChanged={this.searchParamsStateChanged.bind(this)}
        />;

        return (
            <div>
                {searchParams}
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.fetchMore}
                    hasMore={this.state.hasMoreItems}
                    loader={<h1>Loading...</h1>}>
                    <List>
                        {this.state.users.map((value, index) => {
                            return (
                                <BeautifulListItem href={"/user/" + value.username}>
                                    <ListItemAvatar className={classes.avatar}>
                                        <img src={value.avatar_url} alt={"avatar"}/>
                                    </ListItemAvatar>
                                    <ListItemText primary={value.username}/>
                                    <Row>
                                        {this.state.searchParamsState.orderByFieldText[1] != null ?
                                            <Row>
                                                <ListItemText>{this.state.searchParamsState.orderByFieldText[1]}: </ListItemText>
                                                <ListItemText>{value[this.state.searchParamsState.orderByField]}</ListItemText>
                                            </Row>
                                            : <span></span>
                                        }
                                        <NiceLink href={"https://pikabu.ru/@" + value.username} target="_blank"
                                                  title={"Показать на Пикабу"}>
                                            <img src={"https://s.pikabu.ru/favicon.ico"}/>
                                        </NiceLink>
                                    </Row>
                                </BeautifulListItem>
                            );
                        })}
                    </List>
                </InfiniteScroll>
            </div>
        );
    }
}

export default withStyles(styles)(Users);
