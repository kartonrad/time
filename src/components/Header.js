import style from "../style/Header.module.sass";
import {
    Link
} from "react-router-dom";
import { EyePlaceholder } from "./EyeOfJudgement";

export default function Header(props) {
    function noop() {}

    return (
    <nav className={style.header}>
        <div className={style.headerStart}>
            <a href="https://kartonrad.de"><EyePlaceholder size={40} id="default" onClick={noop}></EyePlaceholder></a>
            <div className={style.title}>
                {props.title}
            </div>
        </div>
        <ul className={style.headerTray}>
            {props.children}
        </ul>
    </nav>);
}