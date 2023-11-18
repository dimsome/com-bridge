import React from "react";
import {Card} from "@/components/Card";
import {ToggleButton} from "@/components/button/ToggleButton";
import {Separator} from "@/components/misc/Separator";
import Image from "next/image";
import {ChainImage} from "@/components/chainSelector/ChainImage";
import ChainArrow from "~/chain_arrow.svg";
import {useMakerSwaps} from "@/src/hooks/useMakerSwaps";

type OrderListProps = {
    className?: string;
}
export const OrderList = ({className}: OrderListProps) => {
    const {data, isLoading} = useMakerSwaps();
    return <Card>
        <div className="flex justify-between">
            <span>Your orders</span>
            <div className="flex gap-4">
                <ToggleButton selected={true} onClick={() => {
                }}>
                    Open orders
                </ToggleButton>
                <ToggleButton selected={false} onClick={() => {
                }}>
                    History
                </ToggleButton>
            </div>
        </div>
        <Separator/>
        <div className='min-h-[300px] '>
            <List/>
            <NoOrders/>
        </div>

    </Card>

}


const NoOrders = () => {
    return <div className="min-h-[300px] h-full flex justify-center items-center gap-4">
        <Image
            src={"/ChillCat.png"}
            height={168}
            width={168}
            alt={"Meditating cat"}
        />
        <div className="flex flex-col justify-center gap-2">
            <span className="text-white text-sm">No Open Orders</span>
            <span className="text-primary-50 text-xs">
                You have no open orders, <br/>
                create one and you will see it here.
              </span>
        </div>
    </div>
}
const List = () => {
    return <table className="w-full table-auto">
        <thead>
        <tr className='text-left border-b text-xs font-thin'>
            <th>Token</th>
            <th>Chain Path</th>
            <th>Filled</th>
            <th>Status</th>
        </tr>
        </thead>
        <tbody>
        <OrderItem status={0}/>
        <OrderItem status={1}/>
        <OrderItem status={2}/>
        <OrderItem status={0}/>
        </tbody>

    </table>
}
type OrderProps = {
    status: number
}
const OrderItem = ({status}: OrderProps) => {
   return <tr className='text-sm'>
        <td>
            <div className='flex gap-1 items-center'>
                <Image
                    src={"/ChillCat.png"}
                    height={24}
                    width={24}
                    alt={"Meditating cat"}
                />
                3244 DAI
            </div>
        </td>
        <td>
            <div className='flex items-center gap-1'><ChainImage chainId={42161}/> <ChainArrow
                className='h-4'/> <ChainImage chainId={100}/></div>
        </td>
        <td>
            <div className='text-xs'>
                50%
                <div className='h-2 w-full bg-success-10 rounded-full'>
                    <div className='bg-success-100 h-full  rounded-full' style={{width: '50%'}}>
                    </div>
                </div>
            </div>
        </td>
        <td><OrderStatus status={status}/></td>
    </tr>
}

const OrderStatus = ({status}: { status: number }) => {
    if (status == 1) {
        return <div className='rounded text-center font-semibold w-28 bg-critical-10 text-critical-100'>
            Partially filled
        </div>
    }
    if (status == 2) {
        return <div className='rounded text-center font-semibold w-28  bg-success-100 text-success-10'>
            Filled
        </div>
    }
    return <div className='rounded text-center font-semibold w-28 bg-primary-300 text-primary-50'>
        Open
    </div>


}
