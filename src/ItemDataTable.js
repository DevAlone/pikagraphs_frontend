import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import "./dataTable.css";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/es/ExpansionPanelDetails/ExpansionPanelDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ModelFieldHistory from "./ModelFieldHistory";

const styles = theme => ({
    dataTableSummary: {
        userSelect: "text",
    },
});

class ItemDataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: this.props.rows,
            versionFieldsState: {},
            itemData: this.props.itemData,
            modelName: this.props.modelName,
        };
    }

    render() {
        const {classes} = this.props;

        return (
            <div className={"dataTable"}>
                {this.state.rows.map((row, index) => {
                    return (
                        <ExpansionPanel key={row[0]} onChange={isOpened => {
                            this.setState(prevState => {
                                if (isOpened) {
                                    prevState.versionFieldsState[row[0]] = true;
                                }
                                return prevState;
                            });
                        }}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon/>}
                                className={classes.dataTableSummary}
                                title={"Тыкни, чтоб показать историю"}
                            >
                                <div key={row[0]} className={"dataTableRow"}>
                                    <span className={"dataTableCell dataTableCellLeft"}>{row[0] + " "}</span>
                                    <span className={"dataTableCell dataTableCellRight"}>{
                                        Array.isArray(row[1]) ?
                                            row[1].length === 0 ?
                                                "ничего нет" : row[1].toString() :
                                            typeof row[1] === "object" ?
                                                row[1] : typeof row[1] === "boolean" ?
                                                row[1] ? "да" : "нет" :
                                                row[1].toString()
                                    }</span>
                                </div>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                {
                                    typeof this.state.versionFieldsState[row[0]] !== "undefined" && this.state.versionFieldsState[row[0]] ?
                                        <ModelFieldHistory
                                            modelName={this.state.modelName}
                                            fieldName={row[2]}
                                            itemId={this.state.itemData.pikabu_id}
                                            fieldType={
                                                typeof (row[3]) === "undefined" ? "number" : row[3]
                                            }
                                        /> :
                                        <span></span>
                                }
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    );
                })}
            </div>
        );
    }
}

export default withStyles(styles)(ItemDataTable);
