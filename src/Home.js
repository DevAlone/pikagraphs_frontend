import React, {Component} from 'react';
import Block from "./Block";
import NiceLink from "./NiceLink";
import Graph from "./Graph";

class Home extends Component {
    constructor(params) {
        super(params);

        this.state = {
            'numberOfUsers': 'loading...',  // TODO: complete
            'numberOfStories': 'loading...',
            'numberOfComments': 'loading...',
            'numberOfCommunities': 'loading...',
        }
    }

    render() {
        return (
            <div>
                <h1>Pikastat - статистика Пикабу</h1>
                <Block>
                    Pikastat - проект по сбору статистики сайта<span> </span>
                    <NiceLink href="https://pikabu.ru">Пикабу</NiceLink>,
                    запущенный 19 августа 2017 года.
                    <br/>
                    Сейчас в базе<span> </span>
                    {this.state.numberOfUsers} пользователей,<span> </span>
                    {this.state.numberOfStories} постов,<span> </span>
                    {this.state.numberOfComments} комментариев и<span> </span>
                    {this.state.numberOfCommunities} сообществ,<span> </span>
                    которые обновляются с различной
                    периодичностью.
                    <br/>
                    <br/>
                    Страница проекта в телеграме -><span> </span>
                    <NiceLink href={"https://t.me/pikastat"}>https://t.me/pikastat</NiceLink>
                </Block>

                <h2>Распределение пользователей по дате регистрации</h2>
                <Block>
                    <Graph
                        modelName="pikabu_user_signup_timestamp_distribution_86400"
                        defaultTimestampFilter={"lastYear"}
                    />
                </Block>

                <h2>Распределение постов по дате создания</h2>
                <Block>
                    <Graph
                        modelName="pikabu_story_created_at_timestamp_distribution_86400"
                        defaultTimestampFilter={"lastYear"}
                    />
                </Block>

                <h2>Распределение комментариев по дате создания</h2>
                <Block>
                    <Graph
                        modelName="pikabu_comment_created_at_timestamp_distribution_86400"
                        defaultTimestampFilter={"lastYear"}
                    />
                </Block>

                {/*    TODO: Ban items? */}
            </div>
        );
    }
}

export default Home;
