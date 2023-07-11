/* leny/react-use-storage
 *
 * /src/index.js - React Hook to handle local and session storage
 *
 * coded by leny@flatLand!
 * started at 03/03/2019
 */

import {useState, useEffect, useCallback} from "react";

const IS_BROWSER =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    typeof document !== "undefined";

let evtTarget;

try {
    evtTarget = new EventTarget();
} catch {
    evtTarget = (IS_BROWSER ? document : {})?.createElement?.("phony");
}

// SSR Storage simply returns defaultValue
const useSSRStorage = () => (_, defaultValue) => [defaultValue, () => {}];

const useStorage = (storage) => (key, defaultValue) => {
    const [value, setValue] = useState(null);

    const updater = useCallback(
        (updatedValue) => {
            storage[updatedValue == null ? "removeItem" : "setItem"](
                key,
                JSON.stringify(updatedValue),
            );
            evtTarget.dispatchEvent(
                new CustomEvent("storage_change", {
                    detail: {key, value: updatedValue},
                }),
            );
        },
        [key],
    );

    useEffect(() => {
        const raw = storage.getItem(key);

        setValue(raw != null ? JSON.parse(raw) : null);
    }, [key]);

    useEffect(() => {
        const listener = ({detail}) => {
            if (detail.key === key && detail.value !== value) {
                setValue(detail.value);
            }
        };

        evtTarget.addEventListener("storage_change", listener);
        return () => evtTarget.removeEventListener("storage_change", listener);
    }, [key, value]);

    return [value != null ? value : defaultValue, updater];
};

export const useLocalStorage = IS_BROWSER
    ? useStorage(localStorage)
    : useSSRStorage();
export const useSessionStorage = IS_BROWSER
    ? useStorage(sessionStorage)
    : useSSRStorage();
