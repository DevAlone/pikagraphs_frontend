import React, {Component} from 'react';
import BeautifulListItem from "./NiceListItem";
import ListItemText from "@material-ui/core/ListItemText";
import NiceLink from "./NiceLink";
import timestampToString from "./date_utils";
import Feed from "./Feed";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
    container: {
        width: "100%",
    },
    avatar: {
        height: "18px",
        paddingRight: 5,
    },
    title: {
        userSelect: "text",
        flexGrow: 1,
    },
    header: {
        width: "100%",
    },
    username: {
        paddingLeft: 5,
        paddingRight: 5,
    },
    nowrapContainer: {
        "& *": {
            marginRight: 0,
            marginLeft: 5,
            paddingRight: 0,
            paddingLeft: 0,
        },
    },
});

class Stories extends Component {
    constructor(props) {
        super(props);
        this.orderByFields = {
            "rating": ["Рейтингу", "Рейтинг"],
            "title": ["Заголовку", null],
            // TODO: "story_url": ["", null],?
            "number_of_comments": ["Количеству комментариев", "Комментариев"],
            "number_of_pluses": ["Количеству плюсов", "Плюсов"],
            "number_of_minuses": ["Количеству минусов", "Минусов"],
            "pikabu_id": ["ID на Пикабу", "ID на Пикабу"],
            "author_id": ["ID автора", "ID автора"],
            // TODO: "author_username": ["Никнейм автора", "Никнейм автора"],?
            // TODO: "community_link": ["", ""],?
            "community_id": ["ID сообщества", "ID сообщества"],
            "created_at_timestamp": ["Дате создания", "Дата создания"],
            "added_timestamp": ["Дате добавления в pikagraphs", "Дата добавления в pikagraphs"],
            "last_update_timestamp": ["Последнему времени обновления", "Последнее время обновления"],
            "next_update_timestamp": ["Следующему времени обновления", "Следующее время обновления"],
        };
        this.filterByFields = {
            "pikabu_id": ["ID на Пикабу", [">=", "<=", "==", "!="], "number"],
            "author_id": ["ID на Пикабу", [">=", "<=", "==", "!="], "number"],
            "community_id": ["ID на Пикабу", [">=", "<=", "==", "!="], "number"],

            "rating": ["Рейтингу", [">=", "<=", "==", "!="], "number"],
            "number_of_pluses": ["Количеству плюсов", [">=", "<=", "==", "!="], "number"],
            "number_of_minuses": ["Количеству минусов", [">=", "<=", "==", "!="], "number"],
            // TODO: "content_blocks"?
            "created_at_timestamp": ["Дате создания(timestamp)", [">=", "<=", "==", "!="], "number"],
            // TODO: "story_url"?
            // TODO: "tags"?
            "number_of_comments": ["Количеству комментариев", [">=", "<=", "==", "!="], "number"],
            "is_rating_hidden": ["Рейтинг скрыт", ["=="], "boolean"],
            "has_mine_tag": ["Есть тег \"моё\"", ["=="], "boolean"],
            "has_adult_tag": ["Есть тег \"NSFW\"", ["=="], "boolean"],
            "is_longpost": ["Длиннопост", ["=="], "boolean"],
            // TODO: add like operator
            "author_username": ["Никнейм автора(полностью)", ["==", "!="], "text"],
            "community_link": ["Сокращённое название сообщества(полностью)", ["==", "!="], "text"],
            // TODO: "community_name": ["Название сообщества(полностью)", ["==", "!="], "text"],
            "comments_are_hot": ["С горячими комментариями", ["=="], "boolean"],
            "added_timestamp": ["Дате добавления в pikastat", [">=", "<=", "==", "!="], "number"],
            "last_update_timestamp": ["Дате последнего обновления(timestamp)", [">=", "<=", "==", "!="], "number"],
            "next_update_timestamp": ["Дате следующего обновления(timestamp)", [">=", "<=", "==", "!="], "number"],
            "is_deleted": ["Удалён", ["=="], "boolean"],
            "is_permanently_deleted": ["Полностью удалён", ["=="], "boolean"],
        };
    }

    render() {
        return <Feed
            modelName={"pikabu_story"}
            searchFieldName={"title"}
            orderByFields={this.orderByFields}
            filterByFields={this.filterByFields}
            itemRenderer={(item, parent) => this.renderItem(item, parent)}
        />;
    }

    renderItem(item, parent) {
        const {classes} = this.props;

        return (
            <div className={classes.container}>
                <Grid
                    container
                    wrap={"nowrap"}
                    spacing={2}
                    className={classes.header}
                    alignItems="center"
                >
                    <Grid item xs className={classes.headerLink}>
                        <BeautifulListItem href={"/story/pikabu_id==" + item.pikabu_id}>
                            <ListItemText className={classes.title} primary={item.title}/>

                            <Grid
                                item
                            >
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="center"
                                    wrap={"nowrap"}
                                    className={classes.nowrapContainer}
                                >
                                    <Typography className={classes.username}>@{item.author_username}</Typography>

                                    <img className={classes.avatar} src={
                                        item.author_avatar_url.length > 0 ?
                                            item.author_avatar_url :
                                            "https://cs.pikabu.ru/images/def_avatar/def_avatar_96.png"
                                    } alt={"avatar"}/>

                                    {parent.state.searchParamsState.orderByFieldText[1] != null ?
                                        [
                                            <ListItemText className={classes.selectable}>
                                                {parent.state.searchParamsState.orderByFieldText[1]}:
                                            </ListItemText>,
                                            <ListItemText className={classes.selectable}>{
                                                parent.state.searchParamsState.orderByField === "signup_timestamp" ||
                                                parent.state.searchParamsState.orderByField === "ban_end_timestamp" ||
                                                parent.state.searchParamsState.orderByField === "added_timestamp" ||
                                                parent.state.searchParamsState.orderByField === "last_update_timestamp" ||
                                                parent.state.searchParamsState.orderByField === "next_update_timestamp" ?
                                                    timestampToString(item[parent.state.searchParamsState.orderByField]) :
                                                    item[parent.state.searchParamsState.orderByField]
                                            }</ListItemText>
                                        ]
                                        : null
                                    }
                                </Grid>
                            </Grid>
                        </BeautifulListItem>
                    </Grid>
                    <Grid item>
                        <NiceLink
                            href={"https://pikabu.ru/story/_" + item.pikabu_id}
                            target="_blank"
                            title={"Показать на Пикабу"}>
                            <img
                                className="showOnPikabuImg"
                                src={"https://s.pikabu.ru/favicon.ico"}
                                alt={"Показать на Пикабу"}/>
                        </NiceLink>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(Stories);
