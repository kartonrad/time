import { useEffect, useState } from "react";
import { apiUrl } from "./constants";

export function useServerState(path, init) {
    const [data, setData] = useState(init);

    //fetching tracking data
    useEffect(async () => {
        try {
            var res = await fetch(apiUrl+path);
            if(res.ok) {
                var json = await res.json()
                if(json) {
                    setData(json);
                }
            } else {
                alert("hurensohn");
            }
        } catch(err) {
            console.error(err);
        }
    }, [path]);

    return [data, setData]
}