// useInterval.js
import { useEffect, useRef } from "react";

const useInterval = (callback:any, delay:any) => {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        function tick() {
          savedCallback.current();
        }
        if (delay !== null) {
          let id = setInterval(tick, delay);
          return () => clearInterval(id);
        }
    }, [delay]);
}

export default useInterval;