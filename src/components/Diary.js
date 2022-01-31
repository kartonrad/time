import s from "../style/Diary.module.sass";
import {apiUrl } from "../helpers/constants";
import { useEffect, useRef, useState } from "react";
import {Modal} from "./Modal";

export function DiaryForm() {
    const pixels = usePixels();
    const [initial, setInitial]  = useState({});
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [selPixel, setSelPixel] = useState(-1);

    const [loading, setLoading] = useState(false);

    console.log(pixels);

    useEffect(async () => {
        try {
            var res = await fetch(apiUrl+"/diary/today");
            if(res.ok) {
                var json = await res.json()
                if(json && json.undefined!=="true") {
                    setInitial(json);
                    //setTitle(json.title);
                    //setText(json.text);
                    setSelPixel(json.pixel);
                }
            } else {
                alert("hurensohn");
            }

        } catch(err) {
            console.log(err);
        }
    }, []);

    async function submit(evt) {
        evt.preventDefault();
        setLoading(true);

        try {
            var body = {title, text, pixel: selPixel};

            var res = await fetch(apiUrl+"/diary", {
                method: "POST", 
                body: JSON.stringify(body), 
                headers: {'Content-Type': 'application/json'}
            });
            if(res.ok){
                //has been saved
                setInitial(await res.json());
                setTitle("");
                setText("");
            }
            setLoading(false);
        } catch { setLoading(false); }
        

        return false;
    }

    var pixelList = pixels.map((pixel, i) => {
        var ac= selPixel===i||selPixel===-1;
        return <button
            className={s.pixel} 
            key={i} 
            style={{backgroundColor: ac?pixel.color:"inherit", color: pixel.color}}
            data-active={ac}
            onClick={()=>{if(!loading) if(selPixel!==i) setSelPixel(i); else setSelPixel(-1);}}
        >
            <span>{pixel.desc}</span>
        </button>
    });
    //fallback
    if(pixelList.length<1) {
        pixelList = [
            <div className={s.pixel}>~</div>, <div className={s.pixel}>~</div>, 
            <div className={s.pixel}>~</div>, <div className={s.pixel}>~</div>, <div className={s.pixel}>~</div>
        ]
    }

    return (<div className={s.diaryForm}>
        <div className={s.pixelrow}>{pixelList}</div>
        <form
            onSubmit={submit}>
            <input type="text"
                placeholder={initial.title || "Title"}
                name="title"
                value={title}
                onChange={(e)=>{setTitle(e.target.value)}}
                disabled={loading}></input>
            <textarea
                placeholder={initial.text || "Describe your day..."}
                name="text"
                value={text}
                onChange={(e)=>{setText(e.target.value)}}
                disabled={loading}
            ></textarea>
            <div className={s.submitButton}><button disabled={loading}>Submit</button></div>
        </form>
    </div>);
}

const year = 2021;

export function Diary(props) {
    const pixels = usePixels();
    const [pixelGrid, setPixelGrid] = useState({});
    const modalRef = useRef({});
    const [sel, setSel] = useState([1, 1]);
    const [reqYear, setYear] = useState(new Date(Date.now()).getFullYear());
    const [size, setSize] = useState(8);

    //fetching pixels and pixelgrid
    useEffect(async () => {
        try {
            var year = reqYear;
            var res = await fetch(apiUrl+`/diary/${year}`);
            if(res.ok) {
                var json = await res.json()
                if(json && json.undefined!=="true") {
                    setPixelGrid(json);
                }
            } else {
                alert("hurensohn");
            }

        } catch(err) {
            console.log(err);
        }
    }, [reqYear]);

    var rows = [];

    
    //construct table
    for (let d = 1; d<32; d++) {
        var columns = [];
        for (let m = 1; m<13; m++) {
            var color = "transparent";

            if(!isNaN(new Date(`${year}-${m}-${d}`))) {
                var entr = selEntry(pixelGrid, m, d);
                var pixel = pixels[entr.pixel]||{};
                color = pixel.color||"black";
            }

            var displaySelected = m===sel[0]&&d===sel[1]&&modalRef.current.open;

            columns.push(<td key={m} onClick={() => {
                modalRef.current.toggleModal();
                setSel([m, d]);
            }}style={{backgroundColor: color}}>{displaySelected&&"X"}</td>)
        }
        rows.push(<tr key={d}><th key={0} scope="row">{d}</th>{columns}</tr>)
    }

    var entr = selEntry(pixelGrid, ...sel);
    var selectedPixel = pixels[entr.pixel]||{};

    function shiftSel(by) {
        //if(Math.abs(by)>1||!Number.isInteger(by)) throw("SHIFTSEL() ASSUMES THAT PARAMETER 'by' IS 1, 0 or -1 !!!!!");
        //nvm
        setSel((sel) => {
            var newDay= sel[1]+by;
            var newDate = new Date(year, sel[0]-1, newDay);

            return [newDate.getMonth()+1, newDate.getDate()];
        });
    }
    /**
     *  @param {KeyboardEvent} evt 
     */
    function keyDown(evt) {
        console.log(evt.key);
        switch(evt.key) {
            case "a":
            case "ArrowLeft":
                shiftSel(-1)
            break;
            case "d":
            case "ArrowRight":
                shiftSel(1)
            break;
        }
    }

    var date = new Date(Date.now())
    var month=date.getMonth()+1;
    var selInFuture = (month < sel[0] || (month===sel[0] && date.getDate() < sel[1]));
    var selInPresent = !selInFuture && (month == sel[0] && date.getDate() == sel[1]);

    return (
        <div className={s.diaryGrid} onKeyDown={keyDown} tabindex="0" >
            <h1>Year in Pixels <span>- {reqYear}</span></h1>
            <div class={s.diaryControls}>
                <span onClick={() => setYear((y)=>y-1)}>&lt;</span> 
                
                <span>
                    <span onClick={()=>setSize(0)} data-bingus={size===0}>small -</span>
                    <span onClick={()=>setSize(8)} data-bingus={size===8}> middle -</span>
                    <span onClick={()=>setSize(16)} data-bingus={size===16}> big</span>
                </span>

                <span onClick={() => setYear((y)=>y+1)}>&gt;</span> 
            </div>
            <table style={{fontSize: size}}>
                <tr key={0}>{["", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((v,i)=><th scope="col" key={i}>{v}</th>)}</tr>
                {rows}
            </table>
            <Modal ref={modalRef}>
                <div className={s.modal}>
                    <div>
                        <span style={{color: selectedPixel.color||(!selInPresent?"white":"black")}} >{selectedPixel.desc||"#"}</span> 
                        <span style={{color: selectedPixel.color||(!selInPresent?"white":"black")}} >{sel[1]}.{sel[0]}.{year}</span> 
                    </div>
                    <h1>
                        {entr.title||(selInFuture?"Uncertain":selInPresent?"TODAY":"Lost to Time")}
                    </h1>
                    <p>{entr.text||(selInFuture?"What will happen?":selInPresent?"What's happening?\nRemember your diary!":"Memories fade away\ninto the dark.")}</p>
                    {/*  NAV */}
                    <div className={s.modalNav}>
                        <span onClick={()=>shiftSel(-1)}>&lt;</span> 
                        <b>EDIT</b>
                        <span onClick={()=>shiftSel(1)}>&gt;</span>
                    </div>
                </div>
                
                <div 
                    className={s.title}
                    style={{backgroundColor: selectedPixel.color||(selInFuture?"#110644":selInPresent?"white":"rgb(74, 5, 5)")}} 
                ></div>
            </Modal>
        </div>
    )
}



function selEntry(grid, m, d) {
    var monthsEntries= grid[m];
    if( monthsEntries) {
        var entry = monthsEntries[d];
        if (entry) {
            return entry;
        }
    }
    return {};
}

function usePixels() {
    const [pixels, setPixels] = useState([]);

    useEffect(async () => {
        try {
            var res = await fetch(apiUrl+"/pixels");
            if(res.ok) {
                setPixels(await res.json());
            } else {
                alert("hurensohn");
            }
        } catch(err) {
            console.log("err");
        }       
    },[]);

    return pixels;
}