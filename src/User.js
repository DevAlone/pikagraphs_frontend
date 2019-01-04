import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Row from "./Row";
import "./User.css";
import DoRequest from "./api";
import NiceLink from "./NiceLink";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/es/ExpansionPanelDetails/ExpansionPanelDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Block from "./Block";
import ModelFieldHistory from "./ModelFieldHistory";

const styles = theme => ({
    userDataTableSummary: {
        // padding: "0px",
        // height: "40px",
    },
});

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.id = this.props.match.params.id;
        this.updateUser();
    }

    updateUser() {
        var filterRequest = '';
        if (this.id.match(/^[0-9]+$/g)) {
            filterRequest = 'pikabu_id == ' + this.id + 'u';
        } else {
            filterRequest = 'ilike(username, "' + this.id + '")';
        }

        DoRequest('list_model', {
            name: 'pikabu_user',
            limit: 1,
            filter: filterRequest,
        }).then(response => {
            this.setState({
                user: response.data.results[0],
            });
        })
    }

    render() {
        const {classes} = this.props;
        if (typeof (this.state.user) === "undefined" || this.state.user === null) {
            return (
                <div className="Loading">Загрузка...</div>
            );
        }

        const tableRows = [
            ["Рейтинг", this.state.user.rating, "rating"],
            ["Количество подписчиков", this.state.user.number_of_subscribers, "number_of_subscribers"],
            ["Количество комментариев", this.state.user.number_of_comments, "number_of_comments"],
            ["Количество постов", this.state.user.number_of_stories, "number_of_stories"],
            ["Количество горячих постов", this.state.user.number_of_hot_stories, "number_of_hot_stories"],
            ["Количество плюсов", this.state.user.number_of_pluses, "number_of_pluses"],
            ["Количество минусов", this.state.user.number_of_minuses, "number_of_minuses"],
            ["Никнейм", this.state.user.username, "username"],
            ["Пол", this.state.user.gender, "gender"],
            ["Дата регистрации", this.state.user.signup_timestamp, "signup_timestamp"],
            ["Аватар", this.state.user.avatar_url, "avatar_url"],
            ["Подтверждён", this.state.user.approved_text, "approved_text"],
            ["Награды", this.state.user.award_ids, "award_ids"],
            ["Сообщества", this.state.user.community_ids, "community_ids"],
            ["Баны", this.state.user.ban_history_item_ids, "ban_history_item_ids"],
            ["Дата окончания бана", this.state.user.ban_end_timestamp, "ban_end_timestamp"],
            ["Рейтинг скрыт", this.state.user.is_rating_hidden, "is_rating_hidden"],
            ["Забанен", this.state.user.is_banned, "is_banned"],
            ["Постоянно забанен", this.state.user.is_permanently_banned, "is_permanently_banned"],
            ["Добавлен в pikagraphs", this.state.user.added_timestamp, "added_timestamp"],
            ["Дата последнего обновления", this.state.user.last_update_timestamp, "last_update_timestamp"],
            ["Дата следующего обновления", this.state.user.next_update_timestamp, "next_update_timestamp"],
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
                <div className={"userDataTable"}>
                    {tableRows.map((row, index) => {
                        return (
                            <ExpansionPanel key={row[0]}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    className={classes.userDataTableSummary}
                                    title={"Тыкни, чтоб показать историю"}
                                >
                                    <div key={row[0]} className={"userDataTableRow"}>
                                        <span className={"userDataTableCell userDataTableCellLeft"}>{row[0]}</span>
                                        <span className={"userDataTableCell userDataTableCellRight"}>{
                                            row[1]
                                        }</span>
                                    </div>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <ModelFieldHistory
                                        modelName={"pikabu_user"}
                                        fieldName={row[2]}
                                        itemId={this.state.user.pikabu_id}
                                    />
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        );
                    })}
                    <Block>
                        <div className={"userDataTableRow"}>
                            <span className={"userDataTableCell userDataTableCellLeft"}>ID на Пикабу</span>
                            <span
                                className={"userDataTableCell userDataTableCellRight"}>{this.state.user.pikabu_id}</span>
                        </div>
                    </Block>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(User);
