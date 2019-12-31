import React, {Component} from 'react';
import Block from "./Block";
import NiceLink from "./NiceLink";
import './Donate.css';

class Donate extends Component {
    render() {
        return (
            <div>
                <Block>
                    Pikagraphs - проект, собирающий статистику сайта<span> </span>
                    <NiceLink href="https://pikabu.ru">Пикабу</NiceLink><span> </span>
                    и чтобы собирать статистику нужен сервер,
                    а на сервер нужны деньги.
                    Буду благодарен любой помощи :)
                </Block>

                <h2>Как вы можете помочь проекту: </h2>
                <Block>
                    <NiceLink href={"https://www.patreon.com/join/2313433"}>
                        Ежемесячный платёж всего в $1 на Patreon
                    </NiceLink>
                </Block>
            </div>
        );
    }
}

export default Donate;
