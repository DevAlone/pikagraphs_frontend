import React, {Component} from 'react';
import Block from "./Block";
import Graph from "./Graph";

class BoringGraphs extends Component {
    render() {
        return (
            <div>
                <h2>Количество пользователей в очереди(если мало, то всё ок)</h2>
                <Graph
                    modelName={"number_of_users_to_process_entries"}
                />

                <h2>Распределение пользователей по периоду обновления</h2>
                <Block>
                    <Graph
                        modelName="pikabu_user_updating_period_distribution_3600"
                        defaultTimestampFilter={"lastYear"}
                        xIsTimestamp={false}
                    />
                </Block>

                <h2>Распределение пользователей по времени последнего обновления</h2>
                <Block>
                    <Graph
                        modelName="pikabu_user_last_update_timestamp_distribution_86400"
                        defaultTimestampFilter={"lastYear"}
                    />
                </Block>

                <h2>Распределение пользователей по времени следующего обновления</h2>
                <Block>
                    <Graph
                        modelName="pikabu_user_next_update_timestamp_distribution_86400"
                        defaultTimestampFilter={"lastYear"}
                    />
                </Block>
            </div>
        );
    }
}

export default BoringGraphs;
