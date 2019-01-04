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
import Block from "./Block";

const styles = theme => ({});

class Community extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.id = this.props.match.params.id;
        this.updateData();
    }

    updateData = () => {
        DoRequest('get_model', {
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
            ["Название", this.state.data.name],
            ["Ссылка", this.state.data.link_name],
            ["Адрес", this.state.data.url],
            ["Аватар", this.state.data.avatar_url],
            ["Фоновое изображение", this.state.data.background_image_url],
            ["Теги", this.state.data.tags],
            ["Количество постов", this.state.data.number_of_stories],
            ["Количество подписчиков", this.state.data.number_of_subscribers],
            ["Описание", this.state.data.description],
            ["Правила", this.state.data.rules],
            ["Ограничения", this.state.data.restrictions],
            ["ID админа", this.state.data.admin_id],
            ["ID модераторов", this.state.data.moderator_ids],
            ["Добавлен в pikagraphs", this.state.data.added_timestamp],
            ["Дата последнего обновления", this.state.data.last_update_timestamp],
        ];

        return (
            <div>
                <Row>
                    <img className={"avatar"} src={this.state.data.avatar_url} alt={"Аватар"}/>
                    <NiceLink className={"communityLink"}
                              href={"https://pikabu.ru/community/" + this.state.data.link_name}>
                        {this.state.data.link_name}
                    </NiceLink>
                    <span/>
                </Row>
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
                                    <Typography>
                                        graphs are here
                                    </Typography>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        );
                    })}
                    <Block>
                        <div className={"userDataTableRow"}>
                            <span className={"userDataTableCell userDataTableCellLeft"}>ID на Пикабу</span>
                            <span
                                className={"userDataTableCell userDataTableCellRight"}>{this.state.data.pikabu_id}</span>
                        </div>
                    </Block>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Community);
