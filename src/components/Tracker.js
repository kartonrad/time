import { useContext, useEffect, useRef, useState } from "react";
import { apiUrl } from "../helpers/constants";
import { useServerState } from "../helpers/requestedState";
import s from "../style/Tracker.module.sass";
import formS from "../style/form.module.sass";
import {filterObject} from "../helpers/utils"
import { Drawer } from "./Drawer";
import { useRefresh } from "../helpers/refresh";
import {Modal} from "./Modal";
import { SketchPicker } from 'react-color';
import { MenuData } from "./ContextMenu";

export function TrackingDashboard(props) {
    const [idx, setIdx] = useState(0);
    var apiList = ["day", "7days", "30days", "year", "all-time"];


    return <div className={s.activities}>
        <div className={s.nav}>
            <span
                onClick={()=>setIdx(prev=>mod(prev-1, apiList.length))}
            >&lt;</span>
            <span>{apiList[idx]}</span>
            <span
                onClick={()=>setIdx(prev=>mod(prev+1, apiList.length))}
            >&gt;</span>
        </div>
        <TrackingData endpoint={apiList[idx]}></TrackingData>
    </div>;
}

function mod(n, m) {
    return ((n % m) + m) % m;
  }

export function TrackingData(props) {
    const [data, setData] = useServerState(`/timestats/${props.endpoint}`);
    const [acts, setActs] = useServerState(`/timestats/activity`)
    const [circleArray, setCircles] = useState([]);
    
    
    const ctxMenu = useContext(MenuData);

    useEffect(() => {
        if(data&&acts) {
            var totalHours = data.totalHours - (data.hours.nothing||0);
            var prevRot = 0;
            var circleArr = [];

            for (const action in data.hours) {
                if (action === "nothing") continue;

                var perc = data.hours[action] / totalHours;
                console.log(prevRot)

                const showContext = contextMenuFunction( ctxMenu, data.hours[action], acts[action])

                circleArr.push(
                    <CircleSlice
                        rotation={prevRot}
                        portion={perc}
                        color={acts[action].color}
                        onClick={showContext}
                        actualRadius = {80}
                    ></CircleSlice>
                );

                prevRot += perc*360;
            }
            setCircles(circleArr);
        }
    }, [data,acts])

    return (
        <div 
            className={s.trackingData}
            onMouseLeave={() => ctxMenu.removeMenu()}
        >
            {circleArray}
        </div>
    );
}

export function CircleSlice(props) {
    var radius = props.actualRadius/2 || 30;
    var circumference = 2 * radius * Math.PI;
    var rot = props.rotation || 0;
    var perc = props.portion || 0.1;
    var col = props.color || "orange";

    return (
        <div className={s.circleSlice}><svg 
            width="120"
            height="120"
            style={{transform: `rotate(${rot}deg)`}}
        >
            <circle
                stroke={col}
                strokeWidth={radius}
                fill="transparent"
                r={radius}
                strokeDasharray={[circumference, circumference]}
                strokeDashoffset={circumference - (circumference*perc)}
                cx="60"
                cy="60"
                onClick={props.onClick}
                onMouseEnter={props.onClick}
                onMouseMove={props.onClick}
            />
        </svg></div>
    );
}

function contextMenuFunction(ctxMenu, length, activity){
return (evt) => {
    console.log("eeeeeeeee")
    var clearLength = length;
    var hours = Math.floor( clearLength );
    var mins = Math.floor( (clearLength - hours)*60 );
    ctxMenu.openMenu(evt.pageX, evt.pageY, 
        <p style={{width: "100%", margin: 0}}>
            {hours}
            <span style={{color: "#73b7ff"}}> h </span> {mins}
            <span style={{color: "#e2e831"}}> m </span> 
            <span style={{color: "#a3a3a3"}}>spent</span> <span style={{borderBottom:"5px solid "+activity.color}}>{activity.verb}</span></p>)
}}

export function ActivityTimeline(props) {
    const [data, setData] = useServerState(`/timestats/timeline${props.endpoint||"/"}`);
    const [acts, setActs] = useServerState(`/timestats/activity`);
    const [bObjs, setBlocks] = useState([]);

    var blockObjects = [];
    const ctxMenu = useContext(MenuData);

    useEffect(() => {
        if(data && acts) {
            var as = data.actions;
            var startTime = data.processedFrom;
            var endTime = data.processedUntil;
            

            // skip nothing at beginning and end
            if( as.length > 0) {
                if( as[as.length-1].act === "nothing" ) { endTime = as[as.length-1].t; }
                if( as[0].act === "nothing" && as[1] ) { startTime = as[1].t; }
            }
            var displayDuration = endTime-startTime;

            // HOUR STICKS
            var hours = Math.ceil(displayDuration/3600000);
            var startHour = new Date(startTime).getHours();
            var startHourTs = new Date(startTime).setHours(startHour, 0, 0, 0);
            console.log("sh", startHourTs);

            for (let h = 0; h<=hours; h++) {
                var thish = startHourTs+(h*3600000);
                var blockStart = (thish-startTime)/displayDuration*100;

                blockObjects.push(
                    <div className={s.hourStick} style={{left: blockStart+"%"}}>
                        <span>{(startHour+h)%24}</span>
                    </div>
                )
            }

            // ACTIVITY BLOCKS
            for (let i = 0; i<as.length; i++) {
                if(as[i].act !== "nothing") {
                    var blockStart = ( as[i].t-startTime )/displayDuration*100;
                    var blockEnd = ( (!!as[i+1]?as[i+1].t:endTime)-startTime )/displayDuration*100;
                    var len = blockEnd-blockStart;

                    const showContext = contextMenuFunction(ctxMenu, len*displayDuration/100/3600000, acts[as[i].act])

                    blockObjects.push(
                        <div 
                            className={s.blockObject} 
                            style={{backgroundColor: acts[as[i].act].color, width: len+"%", left: blockStart+"%"}}
                            onClick={showContext}
                            onMouseEnter={showContext}
                            onMouseMove={showContext}
                        ></div>
                    )
                }
            }
            setBlocks(blockObjects);
        }
    }, [data, acts])

    return (
        <div className={s.actTimeline} onMouseLeave={() => ctxMenu.removeMenu()}>
            {bObjs}
        </div>
    )
}

export function EditActivity(props) {
    const [color, setColor] = useState({hex: props.act.color}); 
    const [name, setName] = useState(props.act.name);
    const [verb, setVerb] = useState(props.act.verb);
    const [id, setId] = useState(props.act.id);
    const [parent, setParent] = useState(props.act.parent);


    function change(color) {
        setColor(color)
    }

    async function submit(evt) {
        evt.preventDefault();
        var p=parent;
        if(parent==="undefined") p=null;
        if(id !== props.act.id && props.actKeys.includes(id)) return console.log("eeeeee");

        
        try {
            var res = await fetch(apiUrl+`/timestats/activity/${props.act.new ? id : props.act.id }`, {
                body: JSON.stringify({
                    color: color.hex, 
                    name, 
                    verb, 
                    parent: p
                }),
                method: "POST",
                headers: {'Content-Type': 'application/json'}
            });

            if(res.ok) {
                var json = await res.json();
                props.afterEdited(json);
            }
        } catch (error) {
            alert("no");
        }
    }

    return (<>
        <form className={formS.form} onSubmit={submit} style={{width: "250px"}}>
            <div className={s.current} style={{borderColor: color?color.hex:"black"  }}>
                <div className={s.formsubstyling}>
                    <span>Editing:<br/></span>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                    /><br/>
                    <span>
                    <input 
                        type="text" 
                        value={verb}
                        onChange={(e)=>setVerb(e.target.value)}
                    /><br/></span>
                </div>
            </div>
            {props.act.new && <input 
                type="text" 
                value={id}
                onChange={(e)=>setId(e.target.value)}
            />}
            <select onChange={evt => setParent(evt.target.value)} value={parent}>
                <option value="undefined">&lt;unparented&gt;</option>
                {props.actKeys.map(key => 
                    <option value={key}>{key}</option>    
                )}
            </select>

            <div className={formS.submitButton}><button>Edit</button></div>
        </form>
            <SketchPicker color={color} onChange={change} style={{sliders: {backgroundColor: "white"} }}/>
        </>
    );
}

export function TrackingActivities(props) {
    const [acts, setActs] = useServerState(`/timestats/activity`);
    const [cur, setCur] = useServerState(`/timestats/current`);
    const [editingAct, setEditingAct] = useState();
    const modalRef = useRef();

    useRefresh(60000)

    async function clickAct(activity) {
        try {
            var res = await fetch(apiUrl+`/timestats/protocol/${activity}`, {method: "POST"});
            if(res.ok) {
                var json = await res.json();
                setCur(json);
            }
        } catch (error) {
            alert("no");
        }
    }

    function editAct(activity) {
        var lol;
        if (activity === undefined) {
            lol = {name: "New Activity", color: "#000000", verb: "acting", id: "new", new: true};
        } else {
            lol = acts[activity]; 
            lol.id  = activity;
        }
       
        setEditingAct(lol);
        modalRef.current.toggleModal();
    }

    var currentHours=0;
    var curAct = {};
    var color = "black";
    console.log(acts);
    if(cur && acts) {
        curAct = acts[cur.act];
        var diff =  Date.now()-cur.t;
        currentHours = diff/3600000;
        color = curAct.color;
    }

    var drawers;
    if(acts) {
        drawers = constructActivityDrawers(acts, clickAct, editAct);
    }
    console.log(drawers);    

    return (
        <div className={s.activities}>
            <div className={s.current} style={{borderColor: color }}>
                <div>
                    <span>Currently<br/></span>
                    {curAct.verb || "disconnected"}<br/>
                    <span><SinceText date={cur?cur.t:Date.now()}></SinceText><br/></span>
                </div>
            </div>
            <span>Activities:</span>

            <Drawer content={<>
                    <span onClick={()=>editAct()}>+ New Activity</span>
            </>}></Drawer>
            {drawers}

            <Modal ref={modalRef}>
                <EditActivity act={editingAct} actKeys={Object.keys(acts||{})} 
                afterEdited={(json) => {
                    setActs(prev1 => {
                        var prev = {...prev1}
                        prev[json.id] = json;
                        return prev;
                    })
                }}/>
            </Modal>
        </div>
    );
}

function SinceText(props) {
    useRefresh();

    var date = Date.now() - props.date;
    
    var h = date/3600000; // Math.floor(date/360000)
    var m = (h-Math.floor(h))*60;
    var s = Math.floor((m-Math.floor(m))*60);
    //console.log(h, m, s);

    const f = (bb) => {
        return Math.floor(bb).toLocaleString(undefined, {minimumIntegerDigits: 2, maximumFractionDigits: 0})
    }

    return <>{Math.floor(h)}:{f(m)}:{f(s)}</>
}

function constructActivityDrawers(acts, clicker, editer, parent) {
    var drawers=[];
    var rootActs = filterObject(acts, act=> (act.parent===parent) ||(parent===undefined && act.parent===null));
    for(let key in rootActs) {
        var childDrawers = constructActivityDrawers(acts, clicker, editer, key);

        drawers.push(
            <Drawer content={<>
                    <span onClick={()=>clicker(key)}>{rootActs[key].name}</span>
                    <div onClick={()=>editer(key)} className={s.colorIndicator} style={{backgroundColor: rootActs[key].color}}></div>
            </>}>
                {childDrawers}    
            </Drawer>
        );
    }

    return drawers;
}


