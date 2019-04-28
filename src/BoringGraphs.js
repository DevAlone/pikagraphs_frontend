import React, {Component} from 'react';
import Graph from "./Graph";
import ExpandableItem from "./ExpandableItem";

class BoringGraphTitle extends Component {
    render() {
        return (
            <h2 style={{
                margin: 0,
                padding: "10px 5px",
                fontSize: "18px",
            }}>{this.props.children}</h2>
        );
    }
}

class BoringGraphs extends Component {
    render() {
        return (
            <div>
                <ExpandableItem title={
                    <BoringGraphTitle style={{background: "red"}}>
                        Количество пользователей в очереди(если мало, то всё ок)
                    </BoringGraphTitle>
                }>
                    <Graph
                        modelName={"number_of_users_to_process_entries"}
                    />
                </ExpandableItem>

                <ExpandableItem title={
                    <BoringGraphTitle>Количество постов в очереди</BoringGraphTitle>
                }>
                    <Graph
                        modelName={"number_of_stories_to_process_entries"}
                    />
                </ExpandableItem>

                <ExpandableItem title={
                    <BoringGraphTitle>Количество комментариев в очереди</BoringGraphTitle>
                }>
                    <Graph
                        modelName={"number_of_comments_to_process_entries"}
                    />
                </ExpandableItem>

                <ExpandableItem title={
                    <BoringGraphTitle>Распределение пользователей по периоду обновления</BoringGraphTitle>
                }>
                    <Graph
                        modelName="pikabu_user_updating_period_distribution_3600"
                        defaultTimestampFilter={"lastYear"}
                        xIsTimestamp={false}
                    />
                </ExpandableItem>

                <ExpandableItem title={
                    <BoringGraphTitle>Распределение пользователей по времени последнего обновления</BoringGraphTitle>
                }>
                    <Graph
                        modelName="pikabu_user_last_update_timestamp_distribution_86400"
                        defaultTimestampFilter={"lastYear"}
                    />
                </ExpandableItem>

                <ExpandableItem title={
                    <BoringGraphTitle>Распределение пользователей по времени следующего обновления</BoringGraphTitle>
                }>
                    <Graph
                        modelName="pikabu_user_next_update_timestamp_distribution_86400"
                        defaultTimestampFilter={"lastYear"}
                    />
                </ExpandableItem>
            </div>
        );
    }
}

export default BoringGraphs;
