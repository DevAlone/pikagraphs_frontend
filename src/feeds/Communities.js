import React, {Component} from 'react';
import BeautifulListItem from "../NiceListItem";
import ListItemText from "@material-ui/core/ListItemText";
import withStyles from "@material-ui/core/styles/withStyles";
import Row from "../Row";
import NiceLink from "../NiceLink";
import timestampToString from "../date_utils";
import Feed from "./Feed";

const styles = () => ({
    avatar: {
        height: "40px",
    },
    communityLink: {
        flex: 1,
    },
    showOnPikabuImg: {
        paddingLeft: 15,
    },
});

class Communities extends Component {
    constructor(props) {
        super(props);
        this.orderByField = "-number_of_subscribers";
        this.orderByFields = {
            "number_of_subscribers": ["Количеству подписчиков", "Подписчиков"],
            "number_of_stories": ["Количеству постов", "Постов"],
            "pikabu_id": ["ID на Пикабу", "ID на Пикабу"],
            "name": ["Название", null],
            "added_timestamp": ["Дате добавления в pikagraphs", "Дата добавления в pikagraphs"],
            "last_update_timestamp": ["Последнему времени обновления", "Последнее время обновления"],
        };
        this.filterByFields = {
            "pikabu_id": ["ID на Пикабу", [">", "<", ">=", "<=", "==", "!="]],
        };
    }

    render() {
        return <Feed
            modelName={"pikabu_community"}
            searchFieldName={"name"}
            orderByFields={this.orderByFields}
            orderByField={this.orderByField}
            filterByFields={this.filterByFields}
            itemRenderer={(item, parent) => this.renderItem(item, parent)}
        />;
    }

    renderItem(item, parent) {
        const {classes} = this.props;

        return [
            (<div className={classes.communityLink}>
                <BeautifulListItem
                    href={"/community/" + item.link_name}
                >
                    <img className={classes.avatar} src={item.avatar_url} alt={"avatar"}/>
                    <ListItemText primary={item.name}/>
                    {parent.state.searchParamsState.orderByFieldText[1] != null ?
                        <Row>
                            <ListItemText
                                title={parent.state.searchParamsState.orderByFieldText[1]}
                            >{
                                parent.state.searchParamsState.orderByField === "added_timestamp" ||
                                parent.state.searchParamsState.orderByField === "last_update_timestamp" ?
                                    timestampToString(item[parent.state.searchParamsState.orderByField]) :
                                    item[parent.state.searchParamsState.orderByField]
                            }</ListItemText>

                        </Row>
                        : null
                    }
                </BeautifulListItem>
            </div>),
            (<NiceLink
                href={item.url}
                title={"Показать на Пикабу"}>
                <img
                    src={"https://s.pikabu.ru/favicon.ico"}
                    alt={"Открыть на Пикабу"}
                    className={classes.showOnPikabuImg}
                />
            </NiceLink>),
        ];
    }
}

export default withStyles(styles)(Communities);
