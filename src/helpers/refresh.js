import { useEffect, useState } from "react";

export function useRefresh() {
    const [nowe, setNow] = useState(Date.now());
    useEffect(() => {
        var lol = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(lol);
    }, []);

    return nowe;
}