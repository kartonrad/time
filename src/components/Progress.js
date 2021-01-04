import s from "../style/progress.module.sass";

export function ProgressBar() {
    return (
        <div className={s.container}>
            <div className={s.bar} style={{width: `${props.p||30}%`}}>

            </div>
        </div>
    );
}

export function TimeProgressCards() {
    var now = Date.now();
    var nextMonth = new Date(now);


    return (
        <div className={s.TimeProgressCards}>
            <table>
                <tr><td>Life</td>    <td><ProgressBar/></td> </tr>
                <tr><td>Decade</td>  <td></td> </tr>
                <tr><td>Year</td>    <td></td> </tr>
                <tr><td>Month</td>   <td></td> </tr>
                <tr><td>Week</td>    <td></td> </tr>
            </table>    
        </div>
    );
}