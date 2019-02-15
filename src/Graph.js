import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import "./User.css";
import 'amcharts3';
import 'amcharts3/amcharts/serial';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import AmCharts from '@amcharts/amcharts3-react';
import DoRequest from "./api";
import Button from "@material-ui/core/Button";

const styles = theme => ({
    toggleButtonGroup: {
        background: "none",
        border: "none",
        boxShadow: "none",
    }
});

class Graph extends Component {
    constructor(props) {
        super(props);
        this.modelName = this.props.modelName;
        this.itemId = this.props.itemId;
        this.state = {};
        this.isLogarithmic = false;
        this.graphType = "line";  // "column";  // for bar charts
        this.xIsTimestamp = true;
        this.filterTimestampFrom = Math.round(new Date() / 1000) - 3600 * 24;
        this.timestampFilterCurrentButton = "last day";
    }

    toggleTimestampFilterButton = (event) => {
        this.timestampFilterCurrentButton = event.target.value;
        switch (event.target.value) {
            case "last day":
                this.setTimestampFromFilter(24 * 3600);
                break;
            case "last week":
                this.setTimestampFromFilter(7 * 24 * 3600);
                break;
            case "last month":
                this.setTimestampFromFilter(30 * 24 * 3600);
                break;
            case "last 3 months":
                this.setTimestampFromFilter(3 * 30 * 24 * 3600);
                break;
            case "last year":
                this.setTimestampFromFilter(12 * 30 * 24 * 3600);
                break;
            case "all time":
                this.setTimestampFromFilter(0);
                break;
            default:
                console.error("unknown type \"" + event.target.value + "\"");
        }
    };

    setTimestampFromFilter = (from) => {
        console.log(from);
        if (from === 0) {
            this.filterTimestampFrom = 0;
        } else {
            this.filterTimestampFrom = Math.round(new Date() / 1000) - from;
        }
        this.componentDidMount();
    };

    loadData = (offset, limit, dataAccumulator, callback) => {
        let filter = this.itemId != null ?
            "item_id == " + this.itemId + "u"
            : "";

        if (this.filterTimestampFrom > 0) {
            if (filter.length > 0) {
                filter += " && ";
            }
            filter += "timestamp > " + (this.filterTimestampFrom - 1);
        }

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
                    timestamp: new Date(item.timestamp * 1000),
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
        var data = [];
        this.loadData(0, 512, data, (resultData) => {
            if (resultData.length === 0) {
                this.setState({
                    data: resultData,
                });
                return;
            }

            this.setState({
                data: resultData,
            });
        });
    }

    componentWillUnmount() {
        // clearInterval(this.state.timer);
    }

    render() {
        const config = {
            "type": "serial",
            "theme": "light",
            "marginRight": 20,
            "marginLeft": 20,
            "autoMarginOffset": 20,
            "mouseWheelZoomEnabled": false,
            "valueAxes": [{
                "logarithmic": this.isLogarithmic,
                "id": "v1",
                "axisAlpha": 0.2,
                "position": "left",
                "ignoreAxisWidth": true
            }],
            "balloon": {
                "borderThickness": 1,
                "shadowAlpha": 0
            },
            "graphs": [{
                "id": "g1",
                "lineColor": "#77c0e2",
                "fillAlphas": 0.2,
                "balloon": {
                    "drop": true,
                    "adjustBorderColor": false,
                    "color": "#ffffff"
                },
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "bulletSize": 5,
                "hideBulletsCount": 50,
                "lineThickness": 2,
                "title": "", // TODO: add title
                "type": this.graphType,
                "useLineColorForBulletBorder": true,
                "valueField": "value",
                "balloonText": "<span style='font-size:18px;'>[[value]]</span>"
            }],
            "chartScrollbar": {
                "graph": "g1",
                /*"oppositeAxis": false,
                "offset": 30,*/
                "scrollbarHeight": 80,
                /*
                "backgroundAlpha": 0,
                "selectedBackgroundAlpha": 0.1,
                "selectedBackgroundColor": "#888888",
                "graphFillAlpha": 0,
                "graphLineAlpha": 0.5,
                "selectedGraphFillAlpha": 0,
                "selectedGraphLineAlpha": 1,
                */
                "autoGridCount": true,
                // "color": "#AAAAAA"
            },
            "chartCursor": {
                /*
                "pan": true,
                 "valueLineEnabled": true,
                 "valueLineBalloonEnabled": true,
                 "cursorAlpha": 1,
                 "cursorColor": "#258cbb",
                 */
                "limitToGraph": "g1",
                /*
                "valueLineAlpha": 0.2,
                "valueZoomable": true
                 */
            },
            /*
            "valueScrollbar": {
                "oppositeAxis": false,
                "offset": 50,
                "scrollbarHeight": 10
            },
            */
            "categoryField": "timestamp",
            "categoryAxis": {
                "minPeriod": "mm",
                "parseDates": this.xIsTimestamp,
                "axisColor": "#DADADA",
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "dataProvider": this.state.data,
            "export": {"enabled": true}
        };

        const {classes} = this.props;

        return (
            <div style={{width: "100%"}}>
                {
                    <ToggleButtonGroup className={classes.toggleButtonGroup} exclusive
                                       value={this.timestampFilterCurrentButton}>
                        <ToggleButton component={Button}
                                      value="all time"
                                      onClick={this.toggleTimestampFilterButton}>
                            Всё время</ToggleButton>
                        <ToggleButton component={Button}
                                      value="last year"
                                      onClick={this.toggleTimestampFilterButton}>
                            Год</ToggleButton>
                        <ToggleButton component={Button}
                                      value="last 3 months"
                                      onClick={this.toggleTimestampFilterButton}>
                            3 Месяца</ToggleButton>
                        <ToggleButton component={Button}
                                      value="last month"
                                      onClick={this.toggleTimestampFilterButton}>
                            Месяц</ToggleButton>
                        <ToggleButton component={Button}
                                      value="last week"
                                      onClick={this.toggleTimestampFilterButton}>
                            Неделя</ToggleButton>
                        <ToggleButton component={Button}
                                      value="last day"
                                      onClick={this.toggleTimestampFilterButton}>
                            День</ToggleButton>
                    </ToggleButtonGroup>
                }
                {
                    typeof (this.state.data) === "undefined" ?
                        <h4>Загрузка...</h4>
                        : this.state.data.length === 0 ?
                        <h4>Ничего нет :(</h4>
                        : null
                }
                {
                    <AmCharts.React style={{
                        width: "100%",
                        height: typeof (this.state.data) !== "undefined" && this.state.data.length > 0 ? "500px" : "0px",
                        overflow: "hidden",
                    }} options={config}/>
                }
            </div>
        );
    }
}

export default withStyles(styles)(Graph);
