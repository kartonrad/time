import s from "../style/Diary.module.sass";
import {apiUrl } from "../helpers/constants";
import { useEffect, useState } from "react";

export function DiaryForm() {
    const [pixels, setPixels] = useState([]);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    console.log(pixels);

    useEffect(async () => {
        try {
            var res = await fetch(apiUrl+"/pixels");
            if(res.ok) {
                setPixels(await res.json());
            } else {
                alert("hurensohn");
            }
            
        } catch(err) {
            alert("err");
        }       

        try {
            var res = await fetch(apiUrl+"/diary/today");
            if(res.ok) {
                var json = await res.json()
                if(json && json.undefined!=true) {
                    setTitle(json.title);
                    setText(json.text);
                }
            } else {
                alert("hurensohn");
            }

        } catch(err) {
            alert(err);
        }
    }, []);

    var pixelList = pixels.map((pixel, i) => {
        return <div className={s.pixel} key={i} style={{backgroundColor:pixel.color, color: pixel.color}}><span>{pixel.desc}</span></div>
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
        <form>
            <input type="text"
                placeholder="Title"
                name="title"
                value={title}
                onChange={(e)=>{setTitle(e.target.value)}}></input>
            <textarea
                placeholder="Describe your day..."
                name="text"
                value={text}
                onChange={(e)=>{setText(e.target.value)}}></textarea>
            <input type="submit"></input>
        </form>
    </div>);
}