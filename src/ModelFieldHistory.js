import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import "./User.css";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Button from "@material-ui/core/Button";
import DoRequest from "./api";

am4core.useTheme(am4themes_animated);

const styles = theme => ({});

// TODO: fix chart, see l4rever rating
class ChartComponent extends Component {
    constructor(props) {
        super(props);
        this.modelName = this.props.modelName;
        this.fieldName = this.props.fieldName;
        this.itemId = this.props.itemId;
        this.state = {};
        this.id = "amchart_" + this.modelName + "_" + this.fieldName;
    }

    loadData = (offset, limit, dataAccumulator, callback) => {
        const modelName = this.modelName + "_" + this.fieldName + "_versions";

        DoRequest("list_model", {
            "name": modelName,
            "order_by_fields": "timestamp",
            "filter": "item_id == " + this.itemId + "u",
            "offset": offset,
            "limit": limit,
        }).then(response => {
            let data = [];
            for (let i in response.data.results) {
                var item = response.data.results[i];
                data.push({
                    x: new Date(item.timestamp * 1000),
                    y: item.value,
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

            let chart = am4core.create(this.id, am4charts.XYChart);

            chart.paddingRight = 20;

            chart.data = resultData;

            let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.grid.template.location = 0;

            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.tooltip.disabled = true;
            valueAxis.renderer.minWidth = 35;

            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.dateX = "x";
            series.dataFields.valueY = "y";

            series.tooltipText = "{valueY.value}";
            chart.cursor = new am4charts.XYCursor();

            let scrollbarX = new am4charts.XYChartScrollbar();
            scrollbarX.series.push(series);
            chart.scrollbarX = scrollbarX;

            this.chart = chart;

            this.setState({
                data: resultData,
            });
        });
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        return (
            <div style={{width: "100%"}}>
                {
                    typeof (this.state.data) === "undefined" ?
                        <h4>Загрузка...</h4>
                        : this.state.data.length === 0 ?
                        <h4>Ничего нет :(</h4>
                        : null
                }
                {
                    <div id={this.id} style={{
                        width: "100%",
                        height: typeof (this.state.data) !== "undefined" && this.state.data.length > 0 ? "500px" : "0px",
                        overflow: "hidden",
                    }}/>
                }
            </div>
        );
    }

}

class ModelFieldHistory extends Component {
    constructor(props) {
        super(props);
        this.modelName = this.props.modelName;
        this.fieldName = this.props.fieldName;
        this.itemId = this.props.itemId;

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
                <ChartComponent
                    modelName={this.modelName}
                    fieldName={this.fieldName}
                    itemId={this.itemId}
                />
                :
                <Button onClick={this.load}>Показать</Button>
        );
    }

}

export default withStyles(styles)(ModelFieldHistory);
