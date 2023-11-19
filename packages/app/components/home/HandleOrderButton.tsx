import {getAddressesByChainId} from "@/src/hooks/useContractAddresses";
import {useMatchingOrderValue} from "@/src/hooks/useMatchingOrderValue";
import {useMakeSwap} from "@/src/hooks/useMakeSwap";
import Button from "@/components/button/Button";
import {useTakeSwap} from "@/src/hooks/useTakeSwap";
import React, {useEffect, useRef} from "react";
import {Id, toast} from "react-toastify";
import {Address, Chain, useNetwork} from "wagmi";
// @ts-ignore
import useSound from "use-sound";
import {emitOrderDone} from "@/components/events/events";
import {useTxExplorer} from "@/src/hooks/useBlockExplorer";
import {ExternalLink} from "@/components/links/ExternalLink";
import {formatUnits} from "ethers";
import {InfoItem} from "@/components/content/InfoItem";

type HandleOrderButtonProps = {
    destinationChain: Chain,
    token: Address,
    amount: bigint,
}
type OrderButtonProps = HandleOrderButtonProps & {
    destinationToken: Address,
}
export const HandleOrderButton = ({destinationChain, token, amount}: HandleOrderButtonProps) => {
    const destinationAddresses = getAddressesByChainId(destinationChain!.id)
    //TODO IT ONLY SUPPORTS MEOW ATM
    const {data, isLoading} = useMatchingOrderValue({
        destinationChainId: destinationChain!.id,
        selectedToken: destinationAddresses.Meow,
        sourceToken: token!
    })

    const config = {
        destinationChain,
        token,
        amount,
        destinationToken: destinationAddresses.Meow
    }


    return <>
        {(isLoading || data < amount!) && <CreateOrderButton {...config}/>}
        {!(isLoading || data < amount!) && <TakeOrderButton disable={isLoading || data < amount!} {...config}/>}
    </>


}

const CreateOrderButton = ({destinationChain, token, amount, destinationToken}: OrderButtonProps) => {
    const {write, isLoading, isError, isSuccess, hash, gas} = useMakeSwap({
        destinationChainId: destinationChain!.id,
        destinationToken: destinationToken,
        token: token!,
        amount: amount!
    })
    const link = useTxExplorer(hash)
    const {chain} = useNetwork()
    const toastId = useRef<Id | null>(null);
    useEffect(() => {
        if (hash && toastId.current == null) {
            toastId.current = toast(<div>
                <div>Order is being queued</div>
                <ExternalLink href={link}>View transaction</ExternalLink>
            </div>, {autoClose: false, isLoading: true})
        }
    }, [hash, link, toastId]);

    const [play] = useSound('/placeOrder.mp3')
    useEffect(() => {
        if (isSuccess) {
            play()
            emitOrderDone()
            toast.update(toastId.current!, {
                render: () => <div>
                    <div>Order has been queued</div>
                    <ExternalLink href={link}>View transaction</ExternalLink>
                </div>,
                type: 'success',
                autoClose: 2000,
                isLoading: false
            })
        }
    }, [isSuccess, link, play]);

    return <>
        <InfoItem className='my-4' title={'Add your order to the Queue'}>
            You can create a Queue Order to submit your intent to bridge to the destination chain. This will be then
            executed as soon as the other side is supplied.
        </InfoItem>

        <div className='flex justify-between mt-4 text-sm'>
            <span className='text-primary-50'>Gas Fees</span>
            <span>{gas && formatUnits(gas, chain?.nativeCurrency?.decimals ?? 18) || '-'} {chain?.nativeCurrency?.symbol}</span>
        </div>
        <Button variant="CTA" isLoading={isLoading} className="w-full mt-2" onClick={() => write && write()}>
            Queue Order
        </Button>
    </>


}
const TakeOrderButton = ({destinationChain, token, amount, disable, destinationToken}: OrderButtonProps & { disable: boolean }) => {
    const {write, isLoading, isError, isSuccess, hash, gas} = useTakeSwap({
        destinationChainId: destinationChain!.id,
        destinationToken: destinationToken,
        token: token!,
        amount: amount!
    })
    const {chain} = useNetwork()


    const link = useTxExplorer(hash)

    const toastId = useRef<Id | null>(null);
    useEffect(() => {
        if (hash && toastId.current == null) {
            toastId.current = toast(<div>
                <div>Order is being executed</div>
                <ExternalLink href={link}>View transaction</ExternalLink>
            </div>, {autoClose: false, isLoading: true})
        }
    }, [hash, link, toastId]);

    const [play] = useSound('/placeOrder.mp3')
    useEffect(() => {
        if (isSuccess) {
            play()
            emitOrderDone()
            toast.update(toastId.current!, {
                render: () => <div>
                    <div>Order has been executed</div>
                    <ExternalLink href={link}>View transaction</ExternalLink>
                </div>,
                type: 'success',
                autoClose: 2000,
                isLoading: false

            })
        }
    }, [isSuccess, link, play]);


    return <>
        <InfoItem className='my-4  bg-[#26A18BFF] text-purple-500 font-bold' title={'Matching Order Found'}>
            <div className="text-purple-500 font-normal">
                Your intent to bridge can be matched by a corresponding Make Order. You can execute this order directly!
            </div>
        </InfoItem>

        <div className='flex justify-between mt-4  text-sm'>
            <span className='text-primary-50'>Gas Fees</span>
            <span>{gas && formatUnits(gas, chain?.nativeCurrency?.decimals ?? 18) || '-'} {chain?.nativeCurrency?.symbol}</span>
        </div>
        <Button variant="CTA" disabled={disable} isLoading={isLoading} className="w-full mt-2"
                onClick={() => write && write()}>
            Execute Order
        </Button>
    </>
}
