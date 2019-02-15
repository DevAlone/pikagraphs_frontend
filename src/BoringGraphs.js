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
                    // TODO: доделать
                </Block>

                <h2>Распределение пользователей по времени последнего обновления</h2>
                <Block>
                    // TODO: доделать
                </Block>

                <h2>Распределение пользователей по времени следующего обновления</h2>
                <Block>
                    // TODO: доделать
                </Block>
            </div>
        );
    }
}

export default BoringGraphs;
