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
    const raw = storage.getItem(key);

    const [value, setValue] = useState(
        raw != null ? JSON.parse(raw) : defaultValue,
    );

    const updater = useCallback(
        (updatedValue) => {
            storage[updatedValue == null ? "removeItem" : "setItem"](
                key,
                JSON.stringify(updatedValue),
            );
            setValue(updatedValue);
            evtTarget.dispatchEvent(
                new CustomEvent("storage_change", {detail: {key}}),
            );
        },
        [key],
    );

    useEffect(() => {
        const listener = ({detail}) => {
            if (detail.key === key) {
                const lraw = storage.getItem(key);

                if (lraw !== raw) {
                    setValue(lraw != null ? JSON.parse(lraw) : defaultValue);
                }
            }
        };

        evtTarget.addEventListener("storage_change", listener);
        return () => evtTarget.removeEventListener("storage_change", listener);
    });

    return [value, updater];
};

export const useLocalStorage = IS_BROWSER
    ? useStorage(localStorage)
    : useSSRStorage();
export const useSessionStorage = IS_BROWSER
    ? useStorage(sessionStorage)
    : useSSRStorage();
