import {useLayoutEffect, useState} from "react";

/**
 * custom hook that gets the dimension of the user's device
 *
 * @function useWindowSize
 * @return {array} array of the device size [width, height]
 */
export const useWindowSize = () => {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}
