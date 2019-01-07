import React, {Component} from 'react';
import Block from "./Block";
import NiceLink from "./NiceLink";
import Graph from "./Graph";

class Home extends Component {
    constructor(params) {
        super(params);

        this.state = {
            'numberOfUsers': 'loading...',
        }
    }

    render() {
        return (
            <div>
                <h1>Pikagraphs - статистика Пикабу</h1>
                <Block>
                    Pikagrahps - проект по сбору статистики сайта<span> </span>
                    <NiceLink href="https://pikabu.ru">Пикабу</NiceLink>,
                    запущенный 19 августа 2017 года.
                    За время существования был несколько раз переписан на различных технологиях для достижения большей
                    производительности.
                    Сейчас в базе {this.state.numberOfUsers} пользователей, которые обновляются с различной
                    периодичностью.
                </Block>

                <h2>Распределение пользователей по дате регистрации</h2>
                <Block>
                    // TODO: доделать
                </Block>

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

export default Home;
