import {useEffect, useMemo, useRef, useState} from "react";
import {BsSearch, BsX} from "react-icons/bs";
import {Address, useAccount, useBalance, useToken} from "wagmi";
import Modal from "@/components/dialog/Modal";
import Icon from "~/chain.svg";
import {formatUnits, parseUnits} from "ethers";
import clsxm from "@/src/lib/clsxm";
import {TokenData, useFilteredTokenList} from "@/src/hooks/useTokenList";
import {FaChevronDown} from "react-icons/fa";

export default function TokenInput({
                                       token,
                                       value,
                                       onTokenSelected,
                                       onValueChanged,
                                       autoOpenModal,
                                       estimatedAmount = false,
                                   }: {
    token?: Address;
    value?: bigint;
    onTokenSelected?: (address: Address) => void;
    onValueChanged?: (value: bigint) => void;
    autoOpenModal?: boolean;
    estimatedAmount?: boolean;
}) {
    const {address} = useAccount();
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        if (autoOpenModal && !token) {
            setIsOpen(true);
        }
    }, [autoOpenModal, token]);
    const {data: tokenData} = useToken({address: token, enabled: !!token});
    const {data: balance} = useBalance({
        address: address as Address,
        token: token as Address,
        enabled: !!token,
    });
    const isValidAmount = useMemo(() => {
        if (!onValueChanged) {
            return true;
        }
        return value && value > 0 && value <= (balance?.value ?? BigInt(0));
    }, [value, balance?.value, onValueChanged]);

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!!inputRef.current?.value && value === undefined) {
            inputRef.current!.value = '';
        }
    }, [value]);

    const displayValue = useMemo(
        () =>
            onValueChanged == undefined
                ? (estimatedAmount ? '~' : '') + formatUnits(value ?? 0n, tokenData?.decimals ?? 18)
                : undefined,
        [onValueChanged, estimatedAmount, value, tokenData?.decimals],
    );

    return (
        <div>
            <TokenSelectorDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                onAdd={(t) => {
                    setIsOpen(false);
                    onTokenSelected?.(t.address);
                    if (t.address != token) {
                        onValueChanged?.(0n);
                    }
                }}
            />
            <div className="relative w-full">
                <input
                    ref={inputRef}
                    placeholder="amount"
                    disabled={!token || !onValueChanged}
                    value={displayValue}
                    className={clsxm(
                        "w-full pr-12 text-sm py-2",
                        !isValidAmount && "text-red-500",
                    )}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (!isNaN(Number(value))) {
                            const val = parseUnits(
                                value == "" ? "0" : (value as `${number}`),
                                tokenData?.decimals ?? 18,
                            );
                            onValueChanged?.(val);
                        } else {
                            onValueChanged?.(BigInt(-1));
                        }
                    }}
                />
                <button
                    onClick={() => onValueChanged && setIsOpen(true)}
                    className="absolute pr-2 right-0 bottom-0 top-0 flex items-center justify-center text-sm"
                >
                    {token ? (
                        <>
                            <Icon className="mr-1 h-4 shrink-0"/> {tokenData?.name}
                        </>
                    ) : (
                        <div>Select token</div>
                    )}
                    {onTokenSelected && (
                        <FaChevronDown className="text-sm ml-1 shrink-0"/>
                    )}
                </button>
            </div>
        </div>
    );
}

export function TokenSelectorDialog({
                                        isOpen,
                                        setIsOpen,
                                        onAdd,
                                    }: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onAdd: (token: TokenData) => void;
}) {
    return (
        <Modal
            closeOnBarrierClick={true}
            render={(closeModal) => (
                <TokenSelectorFrom onAdd={onAdd} closeModal={closeModal}/>
            )}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        />
    );
}

export function TokenSelectorFrom({
                                      closeModal,
                                      onAdd,
                                  }: {
    closeModal: () => void;
    onAdd: (token: TokenData) => void;
}) {
    const {filteredTokens, setQuery} = useFilteredTokenList();

    return (
        <div className="flex flex-col bg-purple-500 rounded-3xl gap-2 text-white p-4">
            <div className="relative">
                <span className="text-card-title">Select token</span>
                <button className="hover:text-primary-500 p-2 absolute -top-2 -right-2" onClick={closeModal}>
                    <BsX/>
                </button>
            </div>
            <div className="border-gray-500 border-b-[1px]">{""}</div>
            <div className="relative">
                <input
                    placeholder="Search name or paste address  "
                    className="w-full pl-8 text-xs py-2 bg-primary-300"
                    onChange={(event) => setQuery(event.target.value)}
                />
                <BsSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"/>
            </div>
            <div className="border-gray-500 border-b-[1px]">{""}</div>
            <div className="flex flex-col gap-2 h-60 overflow-y-auto">
                {filteredTokens.map((item) => (
                    <TokenSearchItem
                        onClick={() => onAdd(item)}
                        key={item.address}
                        token={item}
                    />
                ))}
            </div>
        </div>
    );
}

function TokenSearchItem({
                             token,
                             onClick,
                         }: {
    token: TokenData;
    onClick: () => void;
}) {
    const {address} = useAccount();
    const {data: balance} = useBalance({
        address: address,
        token: token.address,
        cacheTime: 20000,
        enabled: !!address,
    });

    const {data, isLoading, isError} = useToken({
        address: token.address,
        cacheTime: 20000,
    });
    const name = useMemo(() => {
        return (
            token?.name ??
            data?.name ??
            (isError ? "Error: The provided address is not a token" : undefined) ??
            "Loading..."
        );
    }, [token.name, data?.name, isError]);
    return (
        <button
            onClick={onClick}
            disabled={isLoading || isError}
            className=" text-left flex items-center p-1 hover:border-gray-500 p rounded-lg border border-transparent"
        >
            {token.logoURI ? (
                <img src={token.logoURI} alt={name} className="h-6 mr-2"/>
            ) : (
                <div
                    className="h-6 mr-2 rounded-full w-6 bg-primary-300 flex justify-center items-center font-bold"> ? </div>
            )}

            <>
                <div className="flex flex-col grow">
          <span
              className={clsxm(
                  "text-card-title",
                  isError && "text-red-500 text-xs",
              )}
          >
            {name} {data?.symbol ? `: ${data?.symbol}` : ""}
          </span>
                    {!token.name && (
                        <span className="text-xs text-gray-400">{token.address}</span>
                    )}
                </div>
            </>

            {isLoading && <span className="text-xs text-gray-400">Loading...</span>}
            {!isLoading && !isError && (
                <span className="text-card-title">{balance?.formatted}</span>
            )}
        </button>
    );
}
