import React, {Component} from 'react';
import Block from "./Block";

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
                    Pikagrahps - проект по сбору статистики с сайта
                    <app-nice-link href="https://pikabu.ru">Пикабу</app-nice-link>,
                    запущенный 19 августа 2017 года.
                    За время существования был несколько раз переписан на различных технологиях для достижения большей
                    производительности.
                    Сейчас в базе {this.state.numberOfUsers} пользователей, которые обновляются с различной
                    периодичностью.
                </Block>

                <h2>Распределение пользователей по дате регистрации</h2>
                <app-graph graphType="distribution" graphId="user/signup_timestamp">

                </app-graph>

                <h2>Количество пользователей в очереди(если мало, то всё ок)</h2>
                <app-graph graphType="statistics" graphId="users_in_queue_count">

                </app-graph>

                <h2>Распределение пользователей по рейтингу</h2>
                <h2>Распределение пользователей по comments_count</h2>
                <h2>Распределение пользователей по posts_count</h2>
                <h2>Распределение пользователей по hot_posts_count</h2>
                <h2>Распределение пользователей по pluses_count</h2>
                <h2>Распределение пользователей по minuses_count</h2>
                <h2>Распределение пользователей по subscribers_count</h2>
                <h2>Распределение пользователей по updating_period</h2>
                <h2>Распределение пользователей по last_update_timestamp</h2>
            </div>
        );
    }
}

export default Home;
