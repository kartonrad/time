import s from "../style/progress.module.sass";
import {endOfDecade, endOfHour, endOfWeek,endOfDay, endOfMinute, endOfMonth, endOfYear, startOfMonth, startOfYear, startOfDay, startOfDecade, startOfWeek, startOfHour, startOfMinute} from "date-fns";

import {useRefresh} from "../helpers/refresh";

export function ProgressBar(props) {
    return (
        <div className={s.container}>
            <div className={s.bar} style={{width: `${props.p||30}%`}}>

            </div>
        </div>
    );
}

export function TimeProgressCards(props) {
    useRefresh();
    var now = Date.now();

    var nextDec = endOfDecade(now);
    var thisDec = startOfDecade(now);
    var decProgress = 100-(nextDec-now) / (nextDec-thisDec) * 100

    var nextYear = endOfYear(now);
    var thisYear = startOfYear(now);
    var yearProgress = 100-(nextYear-now) / (nextYear-thisYear) * 100

    var nextMonth = endOfMonth(now);
    var thisMonth = startOfMonth(now)
    var monthProgress = 100-(nextMonth-now) / (nextMonth-thisMonth) * 100

    var nextWeek = endOfWeek(now);
    var thisWeek = startOfWeek(now);
    var weekProgress = 100-(nextWeek-now) / (nextWeek-thisWeek) * 100

    var nextDay = endOfDay(now);
    var thisDay = startOfDay(now);
    var dayProgress = 100-(nextDay-now) / (nextDay-thisDay) * 100

    var nextHour = endOfHour(now);
    var thisHour = startOfHour(now);
    var hourProgress = 100-(nextHour-now) / (nextHour-thisHour) * 100

    var nextMin = endOfMinute(now);
    var thisMin = startOfMinute(now);
    var minProgress = 100-(nextMin-now) / (nextMin-thisMin) * 100

    return (
        <div className={s.TimeProgressCards}>
            <table>
                <tr><td>Life</td>    <td><ProgressBar/></td>                    <td>{Math.floor(yearProgress)}%</td></tr>
                <tr><td>Decade</td>  <td><ProgressBar p={decProgress}/></td>    <td>{Math.floor(decProgress)}%</td></tr>
                <tr><td>Year</td>    <td><ProgressBar p={yearProgress} /></td>  <td>{Math.floor(yearProgress)}%</td></tr>
                <tr><td>Month</td>   <td><ProgressBar p={monthProgress}/></td>  <td>{Math.floor(monthProgress)}%</td></tr>
                <tr><td>Week</td>    <td><ProgressBar p={weekProgress}/></td>   <td>{Math.floor(weekProgress)}%</td></tr>
                <tr><td>Day</td>     <td><ProgressBar p={dayProgress}/></td>    <td>{Math.floor(dayProgress)}%</td></tr>
                <tr><td>Hour</td>    <td><ProgressBar p={hourProgress}/></td>   <td>{Math.floor(hourProgress)}%</td></tr>
                <tr><td>Minute</td>  <td><ProgressBar p={minProgress}/></td>    <td>{Math.floor(minProgress)}%</td></tr>
            </table>    
        </div>
    );
}