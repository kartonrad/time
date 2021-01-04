import s from "../style/card.module.sass"

export default function Card(props) {
    return <div className={s.card} style={props.style}>{props.children}</div>
}