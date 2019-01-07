import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import "./User.css";
import Button from "@material-ui/core/Button";
import Graph from "./Graph";
import DoRequest from "./api";
import ListItem from "@material-ui/core/es/ListItem/ListItem";
import List from "@material-ui/core/List";
import timestampToString from "./date_utils";

class ModelImageFieldHistory extends Component {
    constructor(props) {
        super(props);
        this.modelName = this.props.modelName;
        this.itemId = this.props.itemId;
        this.state = {};
    }

    loadData = (offset, limit, dataAccumulator, callback) => {
        const filter = this.itemId != null ?
            "item_id == " + this.itemId + "u"
            : "";

        DoRequest("list_model", {
            "name": this.modelName,
            "order_by_fields": "timestamp",
            "filter": filter,
            "offset": offset,
            "limit": limit,
        }).then(response => {
            let data = [];
            for (let i in response.data.results) {
                var item = response.data.results[i];
                data.push({
                    timestamp: item.timestamp,
                    value: item.value,
                });
            }
            if (data.length === 0) {
                callback(dataAccumulator);
            } else {
                dataAccumulator = dataAccumulator.concat(data);
                this.loadData(offset + limit, limit, dataAccumulator, callback);
            }
        });
    };

    componentDidMount() {
        let data = [];
        this.loadData(0, 512, data, (resultData) => {
            this.setState({
                data: resultData,
            });
        });
    }

    render() {
        // TODO: make table
        return (
            <div>
                <List>
                    {
                        typeof (this.state.data) === "undefined" ?
                            <span>Загрузка</span>
                            : this.state.data.length === 0 ?
                            <span>Ничего нет :(</span>
                            : this.state.data.map((item, index) => {
                                return <ListItem>
                                    <span>{timestampToString(item.timestamp)}: </span>
                                    <img src={item.value}/>
                                </ListItem>;
                            })
                    }
                </List>
            </div>
        );
    }
}

// TODO: refactor
class ModelTextFieldHistory extends Component {
    constructor(props) {
        super(props);
        this.modelName = this.props.modelName;
        this.itemId = this.props.itemId;
        this.state = {};
    }

    loadData = (offset, limit, dataAccumulator, callback) => {
        const filter = this.itemId != null ?
            "item_id == " + this.itemId + "u"
            : "";

        DoRequest("list_model", {
            "name": this.modelName,
            "order_by_fields": "timestamp",
            "filter": filter,
            "offset": offset,
            "limit": limit,
        }).then(response => {
            let data = [];
            for (let i in response.data.results) {
                var item = response.data.results[i];
                data.push({
                    timestamp: item.timestamp,
                    value: item.value,
                });
            }
            if (data.length === 0) {
                callback(dataAccumulator);
            } else {
                dataAccumulator = dataAccumulator.concat(data);
                this.loadData(offset + limit, limit, dataAccumulator, callback);
            }
        });
    };

    componentDidMount() {
        let data = [];
        this.loadData(0, 512, data, (resultData) => {
            this.setState({
                data: resultData,
            });
        });
    }

    render() {
        // TODO: make table
        return (
            <div>
                <List>
                    {
                        typeof (this.state.data) === "undefined" ?
                            <span>Загрузка</span>
                            : this.state.data.length === 0 ?
                            <span>Ничего нет :(</span>
                            : this.state.data.map((item, index) => {
                                return <ListItem>
                                    <span>{timestampToString(item.timestamp)}: </span>
                                    {item.value}
                                </ListItem>;
                            })
                    }
                </List>
            </div>
        );
    }
}

const styles = theme => ({});

class ModelFieldHistory extends Component {
    constructor(props) {
        super(props);
        this.modelName = this.props.modelName;
        this.fieldName = this.props.fieldName;
        this.itemId = this.props.itemId;
        this.fieldType = this.props.fieldType;

        this.state = {
            isLoaded: false,
        };
    }

    load = () => {
        this.setState({
            isLoaded: true,
        })
    };

    render() {
        return (
            this.state.isLoaded ?
                this.fieldType === "number" ?
                    <Graph
                        modelName={this.modelName + "_" + this.fieldName + "_versions"}
                        itemId={this.itemId}
                    />
                    : this.fieldType === "image" ?
                    <ModelImageFieldHistory
                        modelName={this.modelName + "_" + this.fieldName + "_versions"}
                        itemId={this.itemId}
                    />
                    :
                    <ModelTextFieldHistory
                        modelName={this.modelName + "_" + this.fieldName + "_versions"}
                        itemId={this.itemId}
                    />
                :
                <Button onClick={this.load}>Показать</Button>
        );
    }

}

export default withStyles(styles)(ModelFieldHistory);
