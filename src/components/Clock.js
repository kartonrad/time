import s from "../style/Clock.module.sass";
import {useRefresh} from "../helpers/refresh";
import { differenceInMinutes, format } from "date-fns";

export function Clock(props) {
    var now = new Date(Date.now());
    var sek = (now.getSeconds()/60*360-90);
    var min = (now.getMinutes()/60*360-90);
    var hr = (now.getHours()/12*360-90);

    var dSek =now.getSeconds().toString().padStart(2, "0");
    var dMin = now.getMinutes().toString().padStart(2, "0");
    var dhr =now.getHours().toString().padStart(2, "0");

    useRefresh();

    return (
    <div className={s.clockCard}>
        <div className={s.clockBody}>
            <div className={s.hr}  style={{transform: `rotate(${hr||0}deg)`}}><div/></div>
            <div className={s.min} style={{transform: `rotate(${min||0}deg)`}}><div/></div>
            <div className={s.sek} style={{transform: `rotate(${sek||0}deg)`}}><div/></div>
        </div>
        <div className={s.digital}>
            <span className={s.time}>{dhr}:{dMin}<span>:{dSek}</span><br/></span>
            {format(now, "EEEEEE. do 'of' MMMM")}
        </div>
    </div>)
}