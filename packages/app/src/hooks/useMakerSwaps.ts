import {Address, useAccount, useContractRead} from "wagmi";
import {crossChainSwapperABI} from "@/abi/CrossChainSwapperABI";
import useContractAddresses from "@/src/hooks/useContractAddresses";
import {useMemo} from "react";

export type MakerSwapData = {
    maker: Address,
    amount: bigint,
    destinationChainId: bigint,
    destinationToken: Address,
    sourceToken: Address,
    rate: bigint
}
export const useMakerSwaps = () => {
    const { address } = useAccount()
    const addresses = useContractAddresses()
    const {data, isLoading, refetch} = useContractRead({
        abi: crossChainSwapperABI,
        address: addresses.Swapper,
        functionName: 'allMakerSwaps',
    })

    const filteredData = useMemo(() => ((data??[]) as MakerSwapData[]).filter(value => value.maker == address), [address, data]);
    return {
        data: filteredData,
        isLoading,
         refetch
    }
}
