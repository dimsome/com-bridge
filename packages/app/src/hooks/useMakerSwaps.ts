import {Address, useAccount, useContractRead} from "wagmi";
import {crossChainSwapperABI} from "@/abi/CrossChainSwapperABI";
import useContractAddresses from "@/src/hooks/useContractAddresses";
import {useEffect} from "react";

export type MakerSwapData = {
    amount: bigint,
    destinationChainId: bigint,
    destinationToken: Address,
    sourceToken: Address,
    rate: bigint
}
export const useMakerSwaps = () => {
    const { address } = useAccount()
    const addresses = useContractAddresses()
    const {data, isLoading} = useContractRead({
        abi: crossChainSwapperABI,
        address: addresses.Swapper,
        functionName: 'userMakerSwaps',
        args: [address],
        enabled: !!address
    })

    useEffect(() => {
        console.log(data)
    }, [data]);
    return {
        data: data as MakerSwapData[],
        isLoading
    }
}
