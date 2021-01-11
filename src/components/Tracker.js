import { useEffect, useRef, useState } from "react";
import { apiUrl } from "../helpers/constants";
import { useServerState } from "../helpers/requestedState";
import s from "../style/Tracker.module.sass";
import {filterObject} from "../helpers/utils"
import { Drawer } from "./Drawer";
import { useRefresh } from "../helpers/refresh";
import {Modal} from "./Modal";
import { SketchPicker } from 'react-color';

export function TrackingData(props) {
    const [data, setData] = useServerState(`/timestats/30days/`);
    const [acts, setActs] = useServerState(`/timestats/activity`)

    var circleArray = []
    
    

    if(data&&acts) {
        var totalHours = data.totalHours - (data.hours.nothing||0);
        var prevRot = 0;

        for (const action in data.hours) {
            if (action === "nothing") continue;

            var perc = data.hours[action] / totalHours;
            

            console.log(prevRot)

            circleArray.push(
                <CircleSlice
                    rotation={prevRot}
                    portion={perc}
                    color={acts[action].color}
                ></CircleSlice>
            );

            prevRot += perc*360;
        }
    }

    return (
        <div className={s.trackingData}>
            {circleArray}
        </div>
    );
}

export function EditActivity(props) {
    const [color, setColor] = useState(props.act.color); 

    function change(color) {
        setColor(color)
    }

    return (
        <>
            <SketchPicker color={color} onChange={change}/>
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
        setEditingAct(activity);
        modalRef.current.toggleModal();
    }

    var currentHours=0;
    var curAct = {};
    var color = "black"
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
                    {curAct.verb || "vibing"}<br/>
                    <span>{currentHours.toFixed(1)}h<br/></span>
                </div>
            </div>
            <span>Activities:</span>
            {drawers}

            <Modal ref={modalRef}>
                <EditActivity act={editingAct}/>
            </Modal>
        </div>
    );
}

function constructActivityDrawers(acts, clicker, editer, parent) {
    var drawers=[];
    var rootActs = filterObject(acts, act=> act.parent===parent);
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
            />
        </svg></div>
    );
}

