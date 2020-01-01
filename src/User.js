import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Row from "./Row";
import "./dataTable.css";
import "./User.css";
import DoRequest from "./api";
import NiceLink from "./NiceLink";
import timestampToString from "./date_utils";
import ItemDataTable from "./ItemDataTable";
import Block from "./Block";

const styles = () => ({});

class User extends Component {
    constructor(props) {
        super(props);
        this.id = this.props.match.params.id;
        this.state = {};
        this.updateUser();
    }

    updateUser() {
        var filterRequest = '';
        if (this.id.match(/^pikabu_id==[0-9]+$/g)) {
            filterRequest = this.id;
        } else {
            filterRequest = 'ilike(username, "' + this.id + '")';
        }

        DoRequest('list_model', {
            name: 'pikabu_user',
            limit: 1,
            filter: filterRequest,
        }).then(response => {
            if (response.data.results.length === 0) {
                this.setState({
                    user: null,
                });
                return;
            }
            this.setState({
                user: response.data.results[0],
            });
        })
    }

    render() {
        // const {classes} = this.props;
        if (typeof (this.state.user) === "undefined") {
            return (
                <div className="Loading">Загрузка...</div>
            );
        }
        if (this.state.user === null) {
            return (
                <div>Ничего не найдено</div>
            );
        }

        let gender;
        switch (parseInt(this.state.user.gender)) {
            case 0:
                gender = "не указан";
                break;
            case 1:
                gender = "мужской";
                break;
            case 2:
                gender = "женский";
                break;
            default:
                gender = this.state.user.gender;
                break;
        }

        const tableRows = [
            // TODO: add icons
            ["Рейтинг", this.state.user.rating, "rating"],
            ["Количество подписчиков", this.state.user.number_of_subscribers, "number_of_subscribers"],
            ["Количество комментариев", this.state.user.number_of_comments, "number_of_comments"],
            ["Количество постов", this.state.user.number_of_stories, "number_of_stories"],
            ["Количество горячих постов", this.state.user.number_of_hot_stories, "number_of_hot_stories"],
            ["Количество плюсов", this.state.user.number_of_pluses, "number_of_pluses"],
            ["Количество минусов", this.state.user.number_of_minuses, "number_of_minuses"],
            ["Никнейм", this.state.user.username, "username", "text"],
            ["Пол", gender, "gender", "text"],
            ["Дата регистрации", timestampToString(this.state.user.signup_timestamp), "signup_timestamp", "text"],
            ["Аватар", <img alt="аватар" src={this.state.user.avatar_url}/>, "avatar_url", "image"],
            ["Подтверждён", this.state.user.approved_text.length > 0 ? this.state.user.approved_text : "нет", "approved_text", "text"],
            ["Дата окончания бана", timestampToString(this.state.user.ban_end_timestamp), "ban_end_timestamp", "text"],
            ["Рейтинг скрыт", this.state.user.is_rating_hidden, "is_rating_hidden", "text"],
            ["Забанен", this.state.user.is_banned, "is_banned", "text"],
            ["Постоянно забанен", this.state.user.is_permanently_banned, "is_permanently_banned", "text"],
            ["Награды", this.state.user.award_ids, "award_ids", "text"],
            ["Сообщества", this.state.user.community_ids, "community_ids", "text"],
            ["Баны", this.state.user.ban_history_item_ids, "ban_history_item_ids", "text"],
        ];

        return (
            <div>
                <Row>
                    <img className={"avatar"} src={this.state.user.avatar_url} alt={"Аватар"}/>
                    <NiceLink className={"usernameLink"} href={"https://pikabu.ru/@" + this.state.user.username}>
                        {this.state.user.username}
                    </NiceLink>
                    <span/>
                </Row>
                <ItemDataTable rows={tableRows} itemData={this.state.user} modelName={"pikabu_user"}/>
                <Block>
                    <div className={"dataTableRow"}>
                        <span className={"dataTableCell dataTableCellLeft"}>ID на Пикабу </span>
                        <span
                            className={"dataTableCell dataTableCellRight"}>{this.state.user.pikabu_id}</span>
                    </div>
                    <div className={"dataTableRow"}>
                        <span className={"dataTableCell dataTableCellLeft"}>Добавлен в pikagraphs </span>
                        <span
                            className={"dataTableCell dataTableCellRight"}>
                                {timestampToString(this.state.user.added_timestamp)}
                            </span>
                    </div>
                    <div className={"dataTableRow"}>
                            <span
                                className={"dataTableCell dataTableCellLeft"}>Дата последнего обновления </span>
                        <span
                            className={"dataTableCell dataTableCellRight"}>{timestampToString(this.state.user.last_update_timestamp)}</span>
                    </div>
                    <div className={"dataTableRow"}>
                            <span
                                className={"dataTableCell dataTableCellLeft"}>Дата следующего обновления </span>
                        <span
                            className={"dataTableCell dataTableCellRight"}>{timestampToString(this.state.user.next_update_timestamp)}</span>
                    </div>
                </Block>
            </div>
        );
    }
}

export default withStyles(styles)(User);
