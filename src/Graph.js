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
        this.timestampFilterButtons = [
            {
                "type": "lastDay",
                "pretty": "день",
                "filterFrom": 24 * 3600,
            },
            {
                "type": "lastWeek",
                "pretty": "неделя",
                "filterFrom": 7 * 24 * 3600,
            },
            {
                "type": "lastMonth",
                "pretty": "месяц",
                "filterFrom": 30 * 24 * 3600,
            },
            {
                "type": "last3Months",
                "pretty": "3 месяца",
                "filterFrom": 3 * 30 * 24 * 3600,
            },
            {
                "type": "lastYear",
                "pretty": "год",
                "filterFrom": 12 * 30 * 24 * 3600,
            },
            {
                "type": "allTime",
                "pretty": "всё время",
                "filterFrom": 0,
            },
        ];
    }

    toggleTimestampFilterButton = (event) => {
        this.setState({
            data: null,
        });
        this.timestampFilterCurrentButton = event.target.value;
        const filterButton = this.timestampFilterButtons.find(value => {
            return value.type === event.target.value;
        });
        if (typeof filterButton === "undefined") {
            console.error("unknown type \"" + event.target.value + "\"");
            return;
        }

        this.setTimestampFromFilter(filterButton.filterFrom);
    };

    setTimestampFromFilter = (from) => {
        if (from === 0) {
            this.filterTimestampFrom = 0;
        } else {
            this.filterTimestampFrom = Math.round(new Date() / 1000) - from;
        }
        this.updateData();
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

    updateData = () => {
        let data = [];
        this.loadData(0, 512, data, (resultData) => {
            if (resultData.length === 0) {
                const filterButtonIndex = this.timestampFilterButtons.findIndex(value => {
                    return value.type === this.timestampFilterCurrentButton;
                });
                if (typeof filterButtonIndex !== "undefined" && filterButtonIndex >= 0 && filterButtonIndex < this.timestampFilterButtons.length - 1) {
                    this.timestampFilterButtons.splice(filterButtonIndex, 1);
                    this.toggleTimestampFilterButton({target: {value: this.timestampFilterButtons[filterButtonIndex].type}});
                    return;
                }
            }

            this.setState({
                data: resultData,
            });
        });
    };

    componentDidMount() {
        this.timestampFilterCurrentButton = this.props.defaultTimestampFilter || "lastMonth";
        this.toggleTimestampFilterButton({target: {value: this.timestampFilterCurrentButton}})
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
                    <ToggleButtonGroup
                        className={classes.toggleButtonGroup}
                        exclusive
                        value={this.timestampFilterCurrentButton}>
                        {
                            this.timestampFilterButtons.map(button => {
                                return (
                                    <ToggleButton
                                        key={button.type}
                                        component={Button}
                                        value={button.type}
                                        onClick={this.toggleTimestampFilterButton}
                                        disabled={typeof this.state.data === "undefined" || this.state.data === null}
                                    >
                                        {button.pretty}
                                    </ToggleButton>
                                );
                            })
                        }
                    </ToggleButtonGroup>
                }
                {
                    typeof (this.state.data) === "undefined" || this.state.data === null ?
                        <h4>Загрузка...</h4>
                        : this.state.data.length === 0 ?
                        <h4>Ничего нет :(</h4>
                        : null
                }
                {
                    <div style={{
                        width: "100%",
                        height: "500px",
                    }}>
                        <AmCharts.React style={{
                            width: "100%",
                            height: typeof (this.state.data) !== "undefined" && this.state.data !== null && this.state.data.length > 0 ? "500px" : "0",
                            overflow: "hidden",
                        }} options={config}/>
                    </div>
                }
            </div>
        );
    }
}

export default withStyles(styles)(Graph);
