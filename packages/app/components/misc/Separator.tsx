import React from "react";
import clsxm from "@/src/lib/clsxm";

type SeparatorProps = {
    className?: string;
    top?: boolean;
    bottom?: boolean;
}
export const Separator = ({top = true, bottom = true, className}: SeparatorProps) => {
    return <div className={clsxm('border-b border-neutral-600 w-full',
        top && 'mt-2',
        bottom && 'mb-2',
        className)}></div>

}
