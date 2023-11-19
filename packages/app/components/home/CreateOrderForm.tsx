import {ToggleButton} from "@/components/button/ToggleButton";
import {Separator} from "@/components/misc/Separator";
import clsxm from "@/src/lib/clsxm";
import {ChainSelector} from "@/components/chainSelector/ChainSelector";
import TokenInput from "@/components/web3/TokenSelectorDialog";
import {FaExchangeAlt} from "react-icons/fa";
import {InfoItem} from "@/components/content/InfoItem";
import Button from "@/components/button/Button";
import {toast} from "react-toastify";
import {Card} from "@/components/Card";
import React, {useCallback, useEffect, useState} from "react";
import {
    Address,
    Chain,
    erc20ABI, useAccount,
    useContractRead,
    useContractWrite,
    useNetwork,
    usePrepareContractWrite,
    useSwitchNetwork, useWaitForTransaction
} from "wagmi";
import useContractAddresses from "@/src/hooks/useContractAddresses";
import {HandleOrderButton} from "@/components/home/HandleOrderButton";
import {useOrderDoneListener} from "@/components/events/events";

export const CreateOrderForm = () => {
    const {chain} = useNetwork();


    const [destinationChain, setDestinationChain] = useState<Chain>()
    const [selectedToken, setSelectedToken] = useState<Address>()
    const [amount, setAmount] = useState<bigint>()
    const resetData = useCallback(() => {
        setDestinationChain(undefined);
        setSelectedToken(undefined);
        setAmount(undefined);
    },[])

    useOrderDoneListener(() => {
      resetData();
    })
    useEffect(() => {
      resetData();
    }, [chain?.id, resetData]);


    return <Card>
        <div className="flex justify-between w-[80vw]">
            <span>Bridge token</span>
            {/*<div className="flex gap-4">*/}
            {/*    <ToggleButton selected={true} onClick={() => {*/}
            {/*    }}>*/}
            {/*        Make*/}
            {/*    </ToggleButton>*/}
            {/*    <ToggleButton selected={false} onClick={() => {*/}
            {/*    }}>*/}
            {/*        Take*/}
            {/*    </ToggleButton>*/}
            {/*</div>*/}
        </div>
        <Separator/>
        <div
            className={clsxm(
                "flex flex-col bg-purple-300 rounded-2xl p-2 gap-2",
            )}
        >
            <div className="text-sm text-gray-400">
                From:{" "}
                <FromChainSelector/>
            </div>
            <div className="border-b border-neutral-600"></div>
            <TokenInput
                value={amount}
                onTokenSelected={setSelectedToken}
                token={selectedToken}
                onValueChanged={setAmount}
            />
        </div>

        <div className="flex justify-center my-2">
            <div className="rounded-full bg-purple-300 w-6 h-6 flex items-center justify-center">
                <FaExchangeAlt className="rotate-90 scale-x-75 text-sm text-black"/>
            </div>
        </div>

        <div
            className={clsxm(
                "flex flex-col bg-purple-300 rounded-2xl p-2 gap-2",
            )}
        >
            <div className="text-sm text-gray-400">
                To:{" "}
                <ChainSelector
                    className="text-white"
                    allowOwn={false}
                    onChainSelected={(chain) => {
                        setDestinationChain(chain);
                    }}
                    selectedChainId={destinationChain?.id}
                />
            </div>
            <div className="border-b border-neutral-600"></div>
            <TokenInput value={amount} token={selectedToken}/>
        </div>
        <Separator/>



        <ActionButton
            destinationChain={destinationChain}
            token={selectedToken}
            take={false}
            amount={amount}/>

    </Card>
}

type ActionProps = {
    destinationChain?: Chain,
    token?: Address,
    amount?: bigint,
}
const ActionButton = ({destinationChain, token, amount}: ActionProps & { take: boolean }) => {
    const {address} = useAccount()
    const addresses = useContractAddresses();

    const {data: dataAllowance, refetch} = useContractRead({
        abi: erc20ABI,
        functionName: 'allowance',
        address: token,
        args: [address!, addresses.Swapper],
        staleTime: 5,
        enabled: !!token
    },)

    useEffect(() => {
        token && refetch()
    }, [token, refetch]);

    if (!amount || !token || !destinationChain?.id) {
        return <Button variant="CTA" className="w-full mt-4" disabled={true}>
            {
                !token ? 'Select token' : !amount ? 'Enter amount' : 'Select destination chain'
            }
        </Button>
    }
    if ((dataAllowance ?? 0n) < (amount ?? 0)) {
        return <ApproveButton token={token!} amount={amount!} onDone={() => refetch()}/>
    }


    return <HandleOrderButton
    token={token}
    amount={amount}
    destinationChain={destinationChain}/>
}


const ApproveButton = ({token, amount, onDone}: { token: Address, amount: bigint, onDone: ()=>void }) => {
    const addresses = useContractAddresses();
    const {config} = usePrepareContractWrite({
        abi: erc20ABI,
        functionName: 'approve',
        address: token,
        args: [addresses.Swapper, amount ?? 0n],
        enabled: !!token && !!amount,
    })
    const {data, write, isLoading: isWriteLoading} = useContractWrite(config!);

    const {isLoading, isSuccess} = useWaitForTransaction({hash: data?.hash, enabled: !!data?.hash});
    useEffect(() => {
        if (!isLoading && isSuccess) {
            onDone()
        }
    }, [isLoading, isSuccess, onDone]);
    return <Button
        isLoading={isLoading || isWriteLoading}
        variant="CTA" className="w-full mt-4" onClick={() => write && write()}>
        Approve token
    </Button>
}

const FromChainSelector = () => {
    const {chain} = useNetwork();
    const [selectedChain, setSelectedChain] = useState(chain)
    const {switchNetwork} = useSwitchNetwork({chainId: selectedChain?.id})
    useEffect(() => {
        if (chain?.id != selectedChain?.id && chain?.id && selectedChain?.id) {
            switchNetwork && switchNetwork(selectedChain?.id);
        }
    }, [chain?.id, selectedChain?.id])
    return <ChainSelector
        className="text-white"
        onChainSelected={(chain) => {
            setSelectedChain(chain)
        }}
        selectedChainId={chain?.id}
    />
}
