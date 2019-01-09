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
import './Community.css';
import Paper from "@material-ui/core/Paper";
import ModelFieldHistory from "./ModelFieldHistory";
import timestampToString from "./date_utils";

const styles = theme => ({});

class Community extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.id = this.props.match.params.id;
        this.updateData();
    }

    updateData = () => {
        DoRequest('list_model', {
            name: 'pikabu_community',
            limit: 1,
            filter: 'ilike(link_name, "' + this.id + '")',
        }).then(response => {
            this.setState({
                data: response.data.results[0],
            });
        });
    };

    render() {
        const {classes} = this.props;
        if (typeof (this.state.data) === "undefined" || this.state.data === null) {
            return (
                <div className="Loading">Загрузка...</div>
            );
        }

        const tableRows = [
            ["Название", this.state.data.name, "name", "text"],
            ["Количество постов", this.state.data.number_of_stories, "number_of_stories"],
            ["Количество подписчиков", this.state.data.number_of_subscribers, "number_of_subscribers"],
            ["Ссылка", this.state.data.link_name, "link_name", "text"],
            ["Адрес", this.state.data.url, "url", "text"],
            ["Аватар", this.state.data.avatar_url, "avatar_url", "image"],
            ["Фоновое изображение", this.state.data.background_image_url, "background_image_url", "image"],
            ["Теги", this.state.data.tags, "tags", "list"],
            ["Описание", this.state.data.description, "description", "text"],
            ["Правила", this.state.data.rules, "rules", "text"],
            ["Ограничения", this.state.data.restrictions, "restrictions", "text"],
            ["ID админа", this.state.data.admin_id, "admin_id", "text"],
            ["ID модераторов", this.state.data.moderator_ids, "moderator_ids", "list"],
        ];

        return (
            <div>
                <Paper className={"header"}>
                    <img className={"backgroundImage"} src={this.state.data.background_image_url}
                         alt={"Фоновое изображение"}/>
                    <Row>
                        <img className={"avatar"} src={this.state.data.avatar_url} alt={"Аватар"}/>
                        <NiceLink className={"communityLink"}
                                  href={"https://pikabu.ru/community/" + this.state.data.link_name}>
                            {this.state.data.link_name}
                        </NiceLink>
                        <span/>
                    </Row>
                </Paper>

                <div className={"communityDataTable"}>
                    {tableRows.map(row => {
                        return (
                            <ExpansionPanel key={row[0]}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon/>}
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
                                        modelName={"pikabu_community"}
                                        fieldName={row[2]}
                                        itemId={this.state.data.pikabu_id}
                                        fieldType={
                                            typeof (row[3]) === "undefined" ? "number" : row[3]
                                        }
                                    />
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        );
                    })}
                    <Block>
                        <div className={"userDataTableRow"}>
                            <span className={"userDataTableCell userDataTableCellLeft"}>
                                ID на Пикабу
                            </span>
                            <span className={"userDataTableCell userDataTableCellRight"}>
                                {this.state.data.pikabu_id}
                            </span>
                        </div>
                        <div className={"userDataTableRow"}>
                            <span className={"userDataTableCell userDataTableCellLeft"}>
                                Добавлен в pikagraphs
                            </span>
                            <span className={"userDataTableCell userDataTableCellRight"}>
                                {timestampToString(this.state.data.added_timestamp)}
                            </span>
                        </div>
                        <div className={"userDataTableRow"}>
                            <span className={"userDataTableCell userDataTableCellLeft"}>
                                Дата последнего обновления
                            </span>
                            <span className={"userDataTableCell userDataTableCellRight"}>
                                {timestampToString(this.state.data.last_update_timestamp)}
                            </span>
                        </div>
                    </Block>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Community);
