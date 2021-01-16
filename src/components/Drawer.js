import { useState } from "react";
import s from "../style/Drawer.module.sass";
import arrow from "../res/svg/dropdownarrow.svg";
 
export function Drawer(props) {
    const [open, setOpen] = useState(false);
    const hasChildren = Array.isArray(props.children) && props.children.length>0 
    
    var rotDeg = open?"rotate(0deg)":"rotate(-90deg)";
    console.log(rotDeg);

    return (
        <div className={s.drawer}>
            <div className={s.content}>
                {hasChildren&&
                <><img 
                    src={arrow} 
                    style={{transform: rotDeg}} 
                />
                <div onClick={()=>setOpen((prev) => !prev)}></div></>
                }
                <span>{props.content}</span>
            </div>
            <div className={s.inside} style={{display: !open&&"none"}}>
                {props.children}
            </div>
        </div>
    )
}