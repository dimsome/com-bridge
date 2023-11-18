import {ReactNode} from "react";
import clsxm from "@/src/lib/clsxm";

type CardProps = {
    children: ReactNode;
    className?: string;
}

export const Card = ({children, className}: CardProps) => (
    <div className={clsxm('bg-purple-500 rounded-card shadow-2xl p-4 text-white', className)}>
            {children}
    </div>

);
