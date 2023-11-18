import Help from "~/help.svg";
import {ContentCard} from "@/components/content/ContentCard";
import clsxm from "@/src/lib/clsxm";

type HelpItemProps = {
    title: string;
    children: React.ReactNode;
    className?: string;
}
export const InfoItem = ({ title, children, className }: HelpItemProps ) => {
    return <ContentCard className={clsxm('text-sm',className)}>
        <span className='text-card-title flex items-center text-sm'>
            <Help className='h-4 w-4 inline mr-2'/> {title}
            </span>
        <div className='rounded-lg text-primary-50 text-sm'>
            {children}
        </div>
    </ContentCard>
}
