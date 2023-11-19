import {Address, useContractRead, useContractWrite, useNetwork} from "wagmi";
import {crossChainSwapperABI} from "@/abi/CrossChainSwapperABI";
import {useEffect} from "react";
import {ethers, parseUnits} from "ethers";
import useContractAddresses, {getAddressesByChainId} from "@/src/hooks/useContractAddresses";

type MatchingOrdersProps = {
    destinationChainId: number,
    selectedToken: Address,
    sourceToken: Address,
    rate?: bigint
}

// fetches the value of the matching order on the destination chain (hopefully)
export const useMatchingOrderValue = ({destinationChainId, selectedToken, sourceToken, rate}: MatchingOrdersProps) => {
    const {chain} = useNetwork()
    const addresses = useContractAddresses()
    const sourceChainId = chain?.id ?? 0
    const destinationContractAddress = getAddressesByChainId(destinationChainId)?.Swapper
    const _rate = rate ?? parseUnits('1', 18);
    const {data: key, isLoading: isKeyLoading} = useContractRead({
        address: addresses.Swapper,
        abi: crossChainSwapperABI,
        functionName: 'calcPoolKey',
        args: [selectedToken, sourceToken, sourceChainId, _rate]
    })

    const {data, isLoading: isLpLoading} = useContractRead({
        chainId: destinationChainId,
        abi: crossChainSwapperABI,
        address: destinationContractAddress,
        functionName: 'liquidityPools',
        args: [key],
        enabled: !!key
    })

    return {
        isLoading: isLpLoading || isKeyLoading,
        data: (data as any[])?.[0] as bigint
    }

}
