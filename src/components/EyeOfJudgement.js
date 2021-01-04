import EyeSVG from "../res/svg/eyeOfJudgementEllipseSVG"
import React from "react"
import { useRef, useLayoutEffect, createContext, useState, useContext, useCallback, useEffect } from "react";
import style from "../style/eye.module.sass";
import generateId from "../helpers/uniqueId";
const eyeContext = createContext();

export function EyePlaceholder(props) {
    const placeholder = useRef();
    const [id, setId] = useState(() => {return props.id || generateId()});
    
    const [animDone, setAnimDone] = useState(false);

    const context = useContext(eyeContext);
    const activeRef = useRef("nvm");

    var active, pos, animating, setActive, setPos, setSize, setColor, setAnimating, init = null;
    if(context) {
        [active, pos, animating, {setActive, setPos, setSize, setColor, setAnimating, init}] = context;  
        activeRef.current = active;
    }
    
    useEffect(() => {
        if(!context) return;
        var currentPos = calcPos();
        if(active === id && (pos[0] !== currentPos[0] || pos[1] !== currentPos[1] || !init)) {
            if(animDone) {
                return setPos(calcPos(), false);
            }
            becomeActive();
            setAnimDone(true);
        }
        if(active !== id && animDone) {
            setAnimDone(false);
        }
    })

    if(!context) return <div></div>;
    

    function becomeActive(evt) {
        if (props.onClick && evt) return props.onClick(evt);
        setPos(calcPos());
        setSize(props.size);
        setColor([props.baseColor, props.innerColor]);
        setActive(id);
        if (evt) evt.stopPropagation();
    }   

    function resetActive(act, ide) {
        if(activeRef.current === id) {
            setActive("default");
            setAnimating(true);
        }
    }

    function calcPos() {
        var bodyRect = document.body.getBoundingClientRect(),
        elemRect = placeholder.current.getBoundingClientRect(),
        offsetY   = elemRect.top - bodyRect.top,
        offsetX = elemRect.left - bodyRect.left;
        return [offsetX, offsetY];
    }

    var controllerObj; 
    if (props.controller) controllerObj = React.cloneElement(props.controller, {becomeActive, resetActive, active: active, id: id});

    return (
    <div onClick={becomeActive} ref={placeholder}>
        <EyeOfJudgement 
            size={props.size}
            show={active === id && !animating} 
            id={id}
            baseColor={props.baseColor}
            innerColor={props.innerColor}
        />
        {controllerObj}
    </div>);
}

export function EyeOfJudgement(props) {
    var width = ((140/71)*props.size || 291)+"px";
    var height = props.size+"px";
    var grow = props.grow;
    var show = props.show;
    if(typeof(grow) !== "boolean") grow = true;
    if(typeof(show) !== "boolean") show = true;
    
    var eee = {...props};
    delete eee.style;
    delete eee.baseColor;
    delete eee.innerColor;
    delete eee.show;
    delete eee.grow;

    var newStyle = {"--base-color": props.baseColor || "#ff00fe", "--inner-color": props.innerColor || "#00f3ff", ...props.style};

    var Svg = 
    <EyeSVG 
        height={height} 
        width={width} 
        style={newStyle}
        {...eee}
    />;

    return grow ?(
        <div
            className={style.eyeWrapper}
            style={{ height, width }}
        >
            <div className={style.eye} style={{display: show ? "block" : "none"}}>
                {Svg}
            </div>
        </div>
    ) : Svg;
}

export function EyeProvider(props) {
    const [active, setActive] = useState("default");
    const [animating, setAnimating] = useState(false);
    const [pos, setPos] = useState([undefined, undefined]);
    const [size, setSize] = useState(400);
    const [[baseColor, innerColor], setColor] = useState(["", ""]);
    const activeRef = useRef();
    const [init, setInit] = useState(false);

    function setterPos(e, animate=true) {  
        if(init && animate) {
            setAnimating(true);
        }
        
        /*clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            setAnimating(false);
        }, 300);*/
        setPos(e);
    }
    function animEnd() {
        setAnimating(false);
    }

    if(!init && typeof pos[0] !== "undefined" && !animating ) {
        setInit(true);
    }

    return <eyeContext.Provider value={[active, pos, animating, {setActive, setPos: setterPos, setSize, setColor, setAnimating, init}]}>
        {props.children}
        <EyeOfJudgement 
            style={{top:pos[1], left:pos[0], visibility: animating ? "visible" : "hidden"}} 
            className={init && animating ? style.flyingEye : style.flyingEyeNoAnim} 
            size={size} 
            grow={false}
            onTransitionEnd={animEnd}
            id="flying"
            baseColor={baseColor}
            innerColor={innerColor}
        />
    </eyeContext.Provider>
}

export function EyeOnMount(props) {
    

    return <EyePlaceholder controller={<OnMount/>} {...props}>

    </EyePlaceholder>
}

function OnMount(props) {
    useEffect(() => {
        props.becomeActive();
        return () => {props.resetActive();};
    }, []);
    return <div></div>;
}