import React, {Component} from 'react';
import Block from "./Block";
import NiceLink from "./NiceLink";
import './Donate.css';

class Donate extends Component {
    render() {
        const donateQIWIWidget = `
                <iframe
                    src="https://qiwi.me/action/widget/pikagraphs"
                    width="360"
                    height="255"
                    frameBorder="0"
                    ref="widget"
                    scrolling="no"
                    style="overflow:hidden;"
                >
                    <a className="niceLink" href="https://qiwi.me/action/widget/pikagraphs" target="_blank">
                        https://qiwi.me/action/widget/pikagraphs
                    </a>
                </iframe>
        `;

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
                    <NiceLink href={"https://www.patreon.com/join/2313433"}>Ежемесячный платёж всего в $1 на
                        patreon </NiceLink>
                </Block>

                <h2>Любая сумма единоразово на Qiwi</h2>
                <Block className={"block"}>
                    <div dangerouslySetInnerHTML={{__html: donateQIWIWidget}}/>
                </Block>
            </div>
        );
    }
}

export default Donate;
