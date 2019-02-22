import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import "./User.css";
import Graph from "./Graph";
import DoRequest from "./api";
import timestampToString from "./date_utils";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

class AbstractModelFieldHistory extends Component {
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
        return (
            <div>
                {
                    typeof (this.state.data) === "undefined" ?
                        <span>Загрузка</span> :
                        this.state.data.length === 0 ?
                            "Похоже это поле не менялось"
                            : this.state.data.length === 0 ?
                            <span>Ничего нет :(</span>
                            : <Table style={{width: "100%"}}>
                                <TableBody>
                                    {
                                        this.state.data.map((item, index) => {
                                            return <TableRow key={index}>
                                                <TableCell>{timestampToString(item.timestamp)}</TableCell>
                                                <TableCell>{this.renderItem(item)}</TableCell>
                                            </TableRow>;
                                        })
                                    }
                                </TableBody>
                            </Table>
                }
            </div>
        );
    }

    renderItem(item) {
        return item.value.toString();
    }
}


class ModelImageFieldHistory extends AbstractModelFieldHistory {
    renderItem(item) {
        return <img alt="" src={item.value}/>;
    }
}

class ModelTextFieldHistory extends AbstractModelFieldHistory {
}

const styles = theme => ({});

class ModelFieldHistory extends Component {
    constructor(props) {
        super(props);
        this.modelName = this.props.modelName;
        this.fieldName = this.props.fieldName;
        this.itemId = this.props.itemId;
        this.fieldType = this.props.fieldType;
    }

    render() {
        return (
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
        );
    }
}

export default withStyles(styles)(ModelFieldHistory);
