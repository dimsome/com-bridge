import {Address, Chain, useContractWrite, usePrepareContractWrite, useToken, useWaitForTransaction} from "wagmi";
import {crossChainSwapperABI} from "@/abi/CrossChainSwapperABI";
import {parseUnits} from "ethers";
import useContractAddresses from "@/src/hooks/useContractAddresses";
import {useEffect} from "react";

type UseMakeSwapProps = {
    destinationChainId: number,
    token: Address,
    destinationToken: Address,
    amount: bigint,
}
export const useMakeSwap = ({destinationChainId, token, destinationToken, amount}: UseMakeSwapProps) => {
    const addresses = useContractAddresses();
    const {data: tokenData} = useToken({address: token})
    //TODO move fee outside of this hook:
    const fee = parseUnits('1', tokenData?.decimals ?? 18);
    const {config} = usePrepareContractWrite({
        abi: crossChainSwapperABI,
        functionName: 'makeSwap',
        address: addresses.Swapper,
        args: [token, destinationToken, destinationChainId, fee, amount]
    });
    const {data, write} = useContractWrite(config);
    const {isLoading, isSuccess, isError} = useWaitForTransaction({hash: data?.hash, enabled: !!data?.hash});
    return {
        isLoading, isSuccess, isError, write, hash: data?.hash
    }
}
