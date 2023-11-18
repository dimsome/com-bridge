import {ReactNode} from "react";
import clsxm from "@/src/lib/clsxm";

export function ToggleButton(props: { selected: boolean, onClick: () => void, children: ReactNode }) {
    return <button className={clsxm(
        'text-primary-500 text-base rounded-lg px-2 sm:px-4  bg-primary-100 font-semibold',
        'hover:bg-primary-300 active:bg-primary-500 active:text-white',
         props.selected && "bg-neutral-50 text-primary-500 hover:bg-primary-50")}
                   onClick={props.onClick}> {props.children}</button>;
}
