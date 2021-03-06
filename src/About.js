import React, {Component} from 'react';
import Block from "./Block";
import NiceLink from "./NiceLink";

class About extends Component {
    render() {
        return [
            <h2>Что это?</h2>,
            <Block>
                Pikastat - проект, собирающий статистику сайта <span> </span>
                <NiceLink href="https://pikabu.ru">pikabu.ru</NiceLink>,
                запущенный 19 августа 2017 года. Раньше назывался Pikagraphs.
                <br/>
                За время существования был несколько раз переписан на различных технологиях для достижения большей
                производительности.
            </Block>,

            <h2> Как это работает? Могу я посмотреть код? </h2>,
            <Block>
                <p>
                    Да.
                </p>
                <p>
                    Frontend(то, что ты видишь сейчас):<span> </span>
                    <NiceLink href={"https://github.com/DevAlone/pikagraphs_frontend"}>
                        https://github.com/DevAlone/pikagraphs_frontend
                    </NiceLink>
                </p>
                <p>
                    Backend(серверная часть):<span> </span>
                    <NiceLink href={"https://github.com/DevAlone/parse_pikabu"}>
                        https://github.com/DevAlone/parse_pikabu
                    </NiceLink>
                </p>
                <p>
                    Старая версия проекта:<span> </span>
                    <NiceLink href={"https://github.com/DevAlone/pikagraphs"}>
                        https://github.com/DevAlone/pikagraphs
                    </NiceLink>
                </p>
            </Block>,
            <h2>Я нашёл баг или просто хочу поговорить с автором. Куда я могу написать? </h2>,
            <Block>
                <a href={"mailto:admin@d3d.info"}>admin@d3d.info</a>
            </Block>
        ];
    }
}

export default About;
