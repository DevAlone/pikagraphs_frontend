import React, {Component} from 'react';
import BeautifulListItem from "../NiceListItem";
import ListItemText from "@material-ui/core/ListItemText";
import withStyles from "@material-ui/core/styles/withStyles";
import Row from "../Row";
import timestampToString from "../date_utils";
import Feed from "./Feed";
import Grid from "@material-ui/core/Grid";
import NiceLink from "../NiceLink";

const styles = theme => ({
    avatar: {
        height: "40px",
    },
    selectable: {
        userSelect: "text",
    }
});

class Users extends Component {
    constructor(props) {
        super(props);
        this.orderByFields = {
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
            "added_timestamp": ["Дате добавления в pikagraphs", "Дата добавления в pikagraphs"],
            "last_update_timestamp": ["Последнему времени обновления", "Последнее время обновления"],
            "next_update_timestamp": ["Следующему времени обновления", "Следующее время обновления"],
        }
        this.filterByFields = {
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
        };
    }

    render() {
        return <Feed
            modelName="pikabu_user"
            searchFieldName={"username"}
            orderByFields={this.orderByFields}
            filterByFields={this.filterByFields}
            itemRenderer={this.renderItem}
        />;
    }

    renderItem = (user, parent) => {
        const {classes} = this.props;
        return (
            <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
            >
                <div className="userLink">
                    <BeautifulListItem
                        href={"/user/pikabu_id==" + user.pikabu_id}
                    >
                        <img className={classes.avatar} src={
                            user.avatar_url.length > 0 ?
                                user.avatar_url :
                                "https://cs.pikabu.ru/images/def_avatar/def_avatar_96.png"
                        } alt={"avatar"}/>
                        <ListItemText className={classes.selectable} primary={user.username}/>
                        {parent.state.searchParamsState.orderByFieldText[1] != null ?
                            <Row>
                                <ListItemText
                                    className={classes.selectable}
                                    title={parent.state.searchParamsState.orderByFieldText[1]}
                                >{
                                    parent.state.searchParamsState.orderByField === "signup_timestamp" ||
                                    parent.state.searchParamsState.orderByField === "ban_end_timestamp" ||
                                    parent.state.searchParamsState.orderByField === "added_timestamp" ||
                                    parent.state.searchParamsState.orderByField === "last_update_timestamp" ||
                                    parent.state.searchParamsState.orderByField === "next_update_timestamp" ?
                                        timestampToString(user[parent.state.searchParamsState.orderByField]) :
                                        user[parent.state.searchParamsState.orderByField]
                                }</ListItemText>
                            </Row>
                            : null
                        }
                    </BeautifulListItem>
                </div>
                <NiceLink
                    href={"https://pikabu.ru/@" + user.username}
                    target="_blank"
                    title={"Показать на Пикабу"}>
                    <img
                        className="showOnPikabuImg"
                        src={"https://s.pikabu.ru/favicon.ico"}
                        alt={"Показать на Пикабу"}/>
                </NiceLink>
            </Grid>
        );
    };
}

export default withStyles(styles)(Users);
