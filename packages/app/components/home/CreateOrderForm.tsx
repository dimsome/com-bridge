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
import React, {useEffect, useState} from "react";
import {useNetwork, useSwitchNetwork} from "wagmi";

export const CreateOrderForm = () => {

    return <Card>
        <div className="flex justify-between">
            <span>Bridge token</span>
            <div className="flex gap-4">
                <ToggleButton selected={true} onClick={() => {
                }}>
                    Make
                </ToggleButton>
                <ToggleButton selected={false} onClick={() => {
                }}>
                    Take
                </ToggleButton>
            </div>
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
                onTokenSelected={(token) => {
                }}
                onValueChanged={(value) => {
                }}
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
                    onChainSelected={(chain) => {
                    }}
                    selectedChainId={undefined}
                />
            </div>
            <div className="border-b border-neutral-600"></div>
            <TokenInput estimatedAmount={true}/>
        </div>
        <Separator />

        <InfoItem className='my-4' title={'Creating a Make Order'} >
            You can create a Make Order to submit your intent to bridge to the destination chain. This will be then executed as soon as the other side is supplied
        </InfoItem>

        <div className='flex justify-between my-2'>
            <span className='text-primary-50'>Gas Fees</span>
            <span>0.0003765888 ETH</span>
        </div>


        <Button variant="CTA" className="w-full mt-4" onClick={() => toast.info('test', {autoClose: 3000})}>
            Create Order
        </Button>
    </Card>
}


const FromChainSelector = () => {
    const {chain} = useNetwork();
    const [selectedChain, setSelectedChain] = useState(chain)
    const {switchNetwork} = useSwitchNetwork({ chainId: selectedChain?.id})
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
