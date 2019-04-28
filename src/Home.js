import React, {Component} from 'react';
import Block from "./Block";
import NiceLink from "./NiceLink";
import Graph from "./Graph";

class Home extends Component {
    constructor(params) {
        super(params);

        this.state = {
            'numberOfUsers': 'loading...',  // TODO: complete
        }
    }

    render() {
        return (
            <div>
                <h1>Pikastat - статистика Пикабу</h1>
                <Block>
                    Pikastat(первое название Pikagraphs) - проект по сбору статистики сайта<span> </span>
                    <NiceLink href="https://pikabu.ru">Пикабу</NiceLink>,
                    запущенный 19 августа 2017 года.
                    За время существования был несколько раз переписан на различных технологиях для достижения большей
                    производительности.
                    Сейчас в базе {this.state.numberOfUsers} пользователей, которые обновляются с различной
                    периодичностью.
                </Block>

                <h2>Распределение пользователей по дате регистрации</h2>
                <Block>
                    <Graph
                        modelName="pikabu_user_signup_timestamp_distribution_86400"
                        defaultTimestampFilter={"lastYear"}
                    />
                </Block>
            </div>
        );
    }
}

export default Home;
