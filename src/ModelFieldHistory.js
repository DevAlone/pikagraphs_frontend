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

class ChartComponent extends Component {
    constructor(props) {
        super(props);
        this.modelName = this.props.modelName;
        this.fieldName = this.props.fieldName;
        this.itemId = this.props.itemId;
        this.state = {};
        this.id = "amchart_" + this.modelName + "_" + this.fieldName;
    }

    componentDidMount() {

        const modelName = this.modelName + "_" + this.fieldName + "_versions";

        DoRequest("list_model", {
            "name": modelName,
            "order_by_fields": "timestamp",
            "filter": "item_id == " + this.itemId + "u",
        }).then(response => {
            let data = [];
            for (let i in response.data.results) {
                var item = response.data.results[i];
                data.push({
                    x: new Date(item.timestamp * 1000),
                    y: item.value,
                });
            }
            this.setState({
                data: data,
            });

            if (data.length === 0) {
                return;
            }

            let chart = am4core.create(this.id, am4charts.XYChart);

            chart.paddingRight = 20;

            chart.data = data;

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
        });
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        return (
            typeof (this.state.data) === "undefined" ?
                <h4>Загрузка...</h4>
                : this.state.data.length > 0 ?
                <div id={this.id} style={{width: "100%", height: "500px"}}/>
                : <h4>Ничего нет :(</h4>
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
