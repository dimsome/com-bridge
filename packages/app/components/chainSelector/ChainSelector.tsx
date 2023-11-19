import clsxm from "@/src/lib/clsxm";
import {Chain, useNetwork} from "wagmi";
import {Fragment, useMemo} from "react";
import {FaChevronDown} from "react-icons/fa";
import {Menu, Transition} from "@headlessui/react";
import {ChainImage} from "@/components/chainSelector/ChainImage";

export type ChainSelectorProps = {
    className?: string;
    allowOwn?: boolean;
    selectedChainId?: number;
    onChainSelected: (chain: Chain) => void;
}
export const ChainSelector = ({className, selectedChainId, onChainSelected, allowOwn = false}: ChainSelectorProps) => {
    const {chains, chain} = useNetwork()
    const selectedChain = useMemo(() => chains?.find(value => value.id === selectedChainId), [chains, selectedChainId]);
    const selectableChains = useMemo(() => allowOwn ? chains : chains?.filter(value => value.id !== chain?.id), [allowOwn, chains, chain?.id]);

    return (
        <>
            <Menu as='div' className='relative inline-block text-left '>
                <div>
                    <Menu.Button
                        aria-label='Open token selector'
                        className={clsxm('border px-2 rounded-lg border-transparent hover:border-primary-500 hover:bg-primary-300', className)}>
                        {selectedChain ?
                            <div> {selectedChain.name}<FaChevronDown className='inline ml-1 text-sm'/></div>
                            :
                            <div>Select chain<FaChevronDown className='inline ml-1 text-sm'/>
                            </div>
                        }
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'
                >
                    <Menu.Items
                        className='absolute z-20 left-0 mt-2 w-56 origin-top-left overflow-hidden rounded-md bg-primary-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-white'>
                        <div className='flex flex-col  items-stretch gap-1'>
                            {selectableChains.map((value, index) => (
                                <Menu.Item key={index}>
                                    {({active}) => (
                                        <button key={value.id} onClick={() => onChainSelected(value)}
                                                className={clsxm('py-2 px-4 flex items-center gap-2 text-black font-semibold',
                                                    ' hover:bg-primary-500 hover:text-white')}>
                                            <ChainImage chainId={value.id}/>
                                            {value.name}</button>

                                    )}
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </>
    );
}
