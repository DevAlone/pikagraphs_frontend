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
        };
        this.offset = 0;
        this.limit = 2;
    }

    fetchMore() {
        DoRequest('get_model', {
            name: 'pikabu_user',
            limit: this.limit,
            offset: this.offset,
        }).then(response => {
            this.offset += this.limit;
            response = response.data;
            if (response.results != null) {
                this.setState(prevState => {
                    return {users: prevState.users.concat(response.results)};
                });
            } else {
                this.setState({
                    hasMoreItems: false,
                });
            }
        });
    }

    render() {
        const {classes} = this.props;

        return (
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
                                    <ListItemText>
                                        rating
                                    </ListItemText>
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
        );
    }
}

export default withStyles(styles)(Users);
