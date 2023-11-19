import React, {useMemo} from "react";
import {Card} from "@/components/Card";
import {ToggleButton} from "@/components/button/ToggleButton";
import {Separator} from "@/components/misc/Separator";
import Image from "next/image";
import {ChainImage} from "@/components/chainSelector/ChainImage";
import ChainArrow from "~/chain_arrow.svg";
import {MakerSwapData, useMakerSwaps} from "@/src/hooks/useMakerSwaps";
import {useNetwork, useToken} from "wagmi";
import {formatUnits} from "ethers";
import {useOrderDoneListener} from "@/components/events/events";

type OrderListProps = {
    className?: string;
}
export const OrderList = ({className}: OrderListProps) => {
    const {data, isLoading, refetch} = useMakerSwaps();
    useOrderDoneListener(() => {
        refetch()
    })
    return <Card className="mb-20">
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
        <div className='min-h-[300px]'>
            {isLoading &&  <div className="animate-pulse"> <Image
                src={"/ChillCat.png"}
                height={168}
                width={168}
                className='mx-auto my-20'
                alt={"Meditating cat"}
            /> </div>}
            {!isLoading && !!data?.length && <List data={data!}/>}
            {!isLoading && !data?.length && <NoOrders/>}


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
const List = ({data} : {data: MakerSwapData[]}) => {
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
        {
            data.map((value, index) => <OrderItem key={index} item={value}/>)
        }


        </tbody>

    </table>
}
type OrderProps = {
    item: MakerSwapData
}
const OrderItem = ({item}: OrderProps) => {
    const {chain} = useNetwork()
    const {data: sourceTokenData} = useToken({address: item.sourceToken})
    const {data: destTokenData} = useToken({address: item.destinationToken})
    const sourceChain = chain?.id ?? 0;
    const destChain = +item.destinationChainId?.toString();
    const amount = useMemo(()=> formatUnits(item.amount,sourceTokenData?.decimals ?? 18), [item.amount, sourceTokenData?.decimals])
   return <tr className='text-sm'>
        <td>
            <div className='flex gap-1 items-center'>
                <Image
                    src={"/ChillCat.png"}
                    height={24}
                    width={24}
                    alt={"Meditating cat"}
                />
                {amount} {sourceTokenData?.symbol ?? '???'}
            </div>
        </td>
        <td>
            <div className='flex items-center gap-1'><ChainImage chainId={sourceChain}/> <ChainArrow
                className='h-4'/> <ChainImage chainId={destChain}/></div>
        </td>
        <td>
            <div className='text-xs'>
                0%
                <div className='h-2 w-full bg-success-10 rounded-full'>
                    <div className='bg-success-100 h-full  rounded-full' style={{width: '2%'}}>
                    </div>
                </div>
            </div>
        </td>
        <td className='w-32'><OrderStatus status={0}/></td>
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
