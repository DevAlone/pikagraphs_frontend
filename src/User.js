import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Row from "./Row";
import "./User.css";
import DoRequest from "./api";
import NiceLink from "./NiceLink";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/es/ExpansionPanelDetails/ExpansionPanelDetails";
import Typography from "@material-ui/core/es/Typography/Typography";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
        this.username = this.props.match.params.username;
        this.updateUser();
    }

    updateUser() {
        DoRequest('get_model', {
            name: 'pikabu_user',
            limit: 1,
            filter: 'ilike(username, "' + this.username + '")',
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
            ["Рейтинг", this.state.user.rating],
            ["Количество подписчиков", this.state.user.number_of_subscribers],
            ["Количество комментариев", this.state.user.number_of_comments],
            ["Количество постов", this.state.user.number_of_stories],
            ["Количество горячих постов", this.state.user.number_of_hot_stories],
            ["Количество плюсов", this.state.user.number_of_pluses],
            ["Количество минусов", this.state.user.number_of_minuses],
            ["ID на Пикабу", this.state.user.pikabu_id],
            ["Никнейм", this.state.user.username],
            ["Пол", this.state.user.gender],
            ["Дата регистрации", this.state.user.signup_timestamp],
            ["Аватар", this.state.user.avatar_url],
            ["Подтверждён", this.state.user.approved_text],
            ["Награды", this.state.user.award_ids],
            ["Сообщества", this.state.user.community_ids],
            ["Баны", this.state.user.ban_history_item_ids],
            ["Дата окончания бана", this.state.user.ban_end_timestamp],
            ["Рейтинг скрыт", this.state.user.is_rating_hidden],
            ["Забанен", this.state.user.is_banned],
            ["Постоянно забанен", this.state.user.is_permanently_banned],
            ["Добавлен в pikagraphs", this.state.user.added_timestamp],
            ["Дата последнего обновления", this.state.user.last_update_timestamp],
            ["Дата следующего обновления", this.state.user.next_update_timestamp],
        ];

        return (
            <div>
                <Row>
                    <img className={"avatar"} src={this.state.user.avatar_url} alt={"Аватар"}/>
                    <NiceLink className={"usernameLink"} href={"https://pikabu.ru/@" + this.state.user.username}>
                        {this.state.user.username}
                    </NiceLink>
                    <span></span>
                </Row>
                <div className={"userDataTable"}>
                    {tableRows.map(row => {
                        return (
                            <ExpansionPanel>
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
                                    <Typography>
                                        graphs are here
                                    </Typography>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(User);
