import {getAddressesByChainId} from "@/src/hooks/useContractAddresses";
import {useMatchingOrderValue} from "@/src/hooks/useMatchingOrderValue";
import {useMakeSwap} from "@/src/hooks/useMakeSwap";
import Button from "@/components/button/Button";
import {useTakeSwap} from "@/src/hooks/useTakeSwap";
import React, {useEffect} from "react";
import {toast} from "react-toastify";
import {Address, Chain} from "wagmi";

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
    const {write, isLoading, isError, isSuccess} = useMakeSwap({
        destinationChainId: destinationChain!.id,
        destinationToken: destinationToken,
        token: token!,
        amount: amount!
    })
    useEffect(() => {
        if (isSuccess) {
            toast.success('Order has been created', {autoClose: 3000})
        }
    }, [isSuccess]);

    return <Button variant="CTA" isLoading={isLoading} className="w-full mt-4" onClick={() => write && write()}>
        Create Order
    </Button>
}
const TakeOrderButton = ({destinationChain, token, amount, disable, destinationToken}: OrderButtonProps & {disable: boolean}) => {
    const {write, isLoading, isError, isSuccess} = useTakeSwap({
        destinationChainId: destinationChain!.id,
        destinationToken: destinationToken,
        token: token!,
        amount: amount!
    })
    useEffect(() => {
        if (isSuccess) {
            toast.success('Order has been Executed', {autoClose: 3000})
        }
    }, [isSuccess]);


    return <Button variant="CTA" disabled={disable} isLoading={isLoading} className="w-full mt-4" onClick={() => write && write()}>
        Take Order
    </Button>
}
