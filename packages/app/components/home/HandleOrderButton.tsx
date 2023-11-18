import {getAddressesByChainId} from "@/src/hooks/useContractAddresses";
import {useMatchingOrderValue} from "@/src/hooks/useMatchingOrderValue";
import {useMakeSwap} from "@/src/hooks/useMakeSwap";
import Button from "@/components/button/Button";
import {useTakeSwap} from "@/src/hooks/useTakeSwap";
import React, {useEffect} from "react";
import {toast} from "react-toastify";
import {Address, Chain, useAccount, useNetwork} from "wagmi";
import useSound from "use-sound";
import {emitOrderDone} from "@/components/events/events";
import {useBlockExplorer, useTxExplorer} from "@/src/hooks/useBlockExplorer";
import {ExternalLink} from "@/components/links/ExternalLink";
import {ethers, formatUnits} from "ethers";
import {getPublicClient} from "@wagmi/core";
import {formatEther} from "viem";

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
        sourceToken: token!})

    const config = {
        destinationChain,
        token,
        amount,
        destinationToken : destinationAddresses.Meow
    }


    return <>
        <CreateOrderButton {...config}/>
        <TakeOrderButton disable={isLoading || data < amount!} {...config}/>
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


    const [play] = useSound('/placeOrder.mp3')
    useEffect(() => {
        if (isSuccess) {
            play()
            emitOrderDone()
            toast.success(<div>
                <div>Order has been created</div>
                <ExternalLink href={link}>View transaction</ExternalLink>
            </div>, {autoClose: 5000})
        }
    }, [isSuccess, link, play]);

    return <>
        <div className='flex justify-between mt-4 text-sm'>
            <span className='text-primary-50'>Gas Fees</span>
            <span>{gas && formatUnits(gas, chain?.nativeCurrency?.decimals ?? 18) || '-'} {chain?.nativeCurrency?.symbol}</span>
        </div>
        <Button variant="CTA" isLoading={isLoading} className="w-full mt-2" onClick={() => write && write()}>
            Create Order
        </Button>
    </>


}
const TakeOrderButton = ({destinationChain, token, amount, disable, destinationToken}: OrderButtonProps & {disable: boolean}) => {
    const {write, isLoading, isError, isSuccess, hash, gas} = useTakeSwap({
        destinationChainId: destinationChain!.id,
        destinationToken: destinationToken,
        token: token!,
        amount: amount!
    })
    const {chain} = useNetwork()


    const link = useTxExplorer(hash)

    const [play] = useSound('/placeOrder.mp3')
    useEffect(() => {
        if (isSuccess) {
            play()
            emitOrderDone()
            toast.success(<div>
                <div>Order has been executed</div>
                <ExternalLink href={link}>View transaction</ExternalLink>
            </div>, {autoClose: 5000})
        }
    }, [isSuccess, link, play]);



    return <>
        <div className='flex justify-between mt-4  text-sm'>
            <span className='text-primary-50'>Gas Fees</span>
            <span>{gas && formatUnits(gas, chain?.nativeCurrency?.decimals ?? 18) || '-'} {chain?.nativeCurrency?.symbol}</span>
        </div>
        <Button variant="CTA" disabled={disable} isLoading={isLoading} className="w-full mt-2" onClick={() => write && write()}>
        Take Order
    </Button>
    </>
}
