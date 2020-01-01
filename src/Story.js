import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import "./dataTable.css";
import DoRequest from "./api";
import NiceLink from "./NiceLink";
import timestampToString from "./date_utils";
import ItemDataTable from "./ItemDataTable";
import Block from "./Block";
import {Grid} from "@material-ui/core";

const styles = () => ({
    header: {
        paddingBottom: 15,
    },
    headerLink: {
        textAlign: "center",
    },
    authorAvatar: {
        height: 25,
    },
    author: {
        "& *": {
            marginRight: 0,
            marginLeft: 5,
            paddingRight: 0,
            paddingLeft: 0,
        },
    },
});

class Story extends Component {
    constructor(props) {
        super(props);
        this.id = this.props.match.params.id;
        this.state = {};
        this.updateData();
    }

    updateData() {
        let filterRequest = '';
        if (this.id.match(/^pikabu_id==[0-9]+$/g)) {
            filterRequest = this.id;
        } else {
            alert("wrong id");
        }

        DoRequest('list_model', {
            name: 'pikabu_story',
            limit: 1,
            filter: filterRequest,
        }).then(response => {
            if (response.data.results.length === 0) {
                this.setState({
                    data: null,
                });
                return;
            }
            this.setState({
                data: response.data.results[0],
            });
        })
    }

    // render() {
    //     return (<div>
    //         data is
    //         <pre>
    //         {JSON.stringify(this.state.data, null, 2)}
    //         </pre>
    //     </div>);
    // }

    render() {
        const {classes} = this.props;

        if (typeof (this.state.data) === "undefined") {
            return (
                <div className="Loading">Загрузка...</div>
            );
        }
        if (this.state.data === null) {
            return (
                <div>Ничего не найдено</div>
            );
        }

        const tableRows = [
            ["Заголовок", this.state.data.title, "title", "text"],
            ["Рейтинг", this.state.data.rating, "rating"],
            ["Количество плюсов", this.state.data.number_of_pluses, "number_of_pluses"],
            ["Количество минусов", this.state.data.number_of_minuses, "number_of_minuses"],
            ["Количество комментариев", this.state.data.number_of_comments, "number_of_comments"],

            ["Дата создания", timestampToString(this.state.data.created_at_timestamp), "created_at_timestamp", "text"],

            ["content_blocks", JSON.stringify(this.state.data.content_blocks), "content_blocks", "text"],

            ["tags", this.state.data.tags, "tags", "text"],
            ["Есть тег \"моё\"", this.state.data.has_mine_tag, "has_mine_tag", "text"],
            ["Есть тег \"NSFW\"", this.state.data.has_adult_tag, "has_adult_tag", "text"],

            ["story_url", this.state.data.story_url, "story_url", "text"],
            ["Удалён", this.state.data.is_deleted, "is_deleted", "text"],
            ["Рейтинг скрыт", this.state.data.is_rating_hidden, "is_rating_hidden", "text"],
            ["Длиннопост", this.state.data.is_longpost, "is_longpost", "text"],
            ["ID автора", this.state.data.author_id, "author_id", "text"],
            ["Никнейм автора", this.state.data.author_username, "author_username", "text"],
            ["author_profile_url", this.state.data.author_profile_url, "author_profile_url", "text"],
            ["author_avatar_url", this.state.data.author_avatar_url, "author_avatar_url", "text"],
            ["community_link", this.state.data.community_link, "community_link", "text"],
            ["community_name", this.state.data.community_name, "community_name", "text"],
            ["community_id", this.state.data.community_id, "community_id", "text"],
            ["comments_are_hot", this.state.data.comments_are_hot, "comments_are_hot", "text"],
            ["is_permanently_deleted", this.state.data.is_permanently_deleted, "is_permanently_deleted", "text"],
        ];

        return (
            <div>
                <Grid
                    container
                    wrap={"nowrap"}
                    spacing={2}
                    className={classes.header}
                    alignItems="center"
                >
                    <Grid
                        container
                        justify="center"
                        alignItems="center"
                        xs
                    >
                        <NiceLink
                            href={"https://pikabu.ru/story/_" + this.state.data.pikabu_id}
                            className={classes.headerLink}
                        >
                            {this.state.data.title}
                        </NiceLink>
                    </Grid>
                    <Grid
                        item
                    >
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                            wrap={"nowrap"}
                            className={classes.author}
                        >
                            <NiceLink href={"https://pikabu.ru/@" + this.state.data.author_username}>
                                @{this.state.data.author_username}
                            </NiceLink>
                            <img
                                className={classes.authorAvatar}
                                src={this.state.data.author_avatar_url}
                                alt={"Аватар"}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <pre>
                    {"// TODO: add story content here"}
                </pre>
                <ItemDataTable rows={tableRows} itemData={this.state.data} modelName={"pikabu_story"}/>
                <Block>
                    <div className={"dataTableRow"}>
                        <span className={"dataTableCell"}>ID на Пикабу</span>
                        <span className={"dataTableCell"}>{this.state.data.pikabu_id}</span>
                    </div>
                    <div className={"dataTableRow"}>
                        <span className={"dataTableCell"}>Добавлен в pikagraphs</span>
                        <span className={"dataTableCell"}>
                            {timestampToString(this.state.data.added_timestamp)}
                        </span>
                    </div>
                    <div className={"dataTableRow"}>
                        <span className={"dataTableCell"}>Дата последнего обновления</span>
                        <span className={"dataTableCell"}>
                            {timestampToString(this.state.data.last_update_timestamp)}
                        </span>
                    </div>
                    <div className={"dataTableRow"}>
                        <span className={"dataTableCell"}>Дата следующего обновления</span>
                        <span className={"dataTableCell"}>
                            {timestampToString(this.state.data.next_update_timestamp)}
                        </span>
                    </div>
                    <div className={"dataTableRow"}>
                        <span className={"dataTableCell"}>task_taken_at_timestamp</span>
                        <span className={"dataTableCell"}>
                            {timestampToString(this.state.data.task_taken_at_timestamp)}
                        </span>
                    </div>
                </Block>
                <pre>
                    {"// TODO: add story content here"}
                </pre>
            </div>
        );
    }
}

export default withStyles(styles)(Story);
