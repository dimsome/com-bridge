import {Address, Chain, useContractWrite, usePrepareContractWrite, useToken, useWaitForTransaction} from "wagmi";
import {crossChainSwapperABI} from "@/abi/CrossChainSwapperABI";
import {parseUnits} from "ethers";
import useContractAddresses from "@/src/hooks/useContractAddresses";
import {useEffect, useMemo, useState} from "react";
import {getPublicClient, PrepareWriteContractResult} from "@wagmi/core";

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
    const estimatedGas = useEstimateGas(config.request)

    const {data, write} = useContractWrite(config);
    const {isLoading, isSuccess, isError} = useWaitForTransaction({hash: data?.hash, enabled: !!data?.hash});
    return {
        isLoading, isSuccess, isError, write, hash: data?.hash, gas: estimatedGas
    }
}


export const useEstimateGas = (requestConfig: any) => {
    const [estimatedGas, setEstimatedGas] = useState<bigint>()
    const pc= useMemo(() => getPublicClient(), [])

    useEffect(()=> {
        if (!requestConfig || !requestConfig.abi) return;
        pc.estimateContractGas(requestConfig).then((gas) => {
            pc.getGasPrice().then((price) => {
                setEstimatedGas(gas*price);
            });
        })
    },[pc, requestConfig])

    return estimatedGas;
}
