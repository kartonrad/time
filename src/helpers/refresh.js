import { useEffect, useState } from "react";

export function useRefresh(ms=1000) {
    const [nowe, setNow] = useState(Date.now());
    useEffect(() => {
        var lol = setInterval(() => {
            setNow(Date.now());
        }, ms);
        return () => clearInterval(lol);
    }, []);

    return nowe;
}