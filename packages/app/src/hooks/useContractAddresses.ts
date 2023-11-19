import addresses from "../../config/addresses.json";
import {Address, useNetwork} from "wagmi";
import {useMemo} from "react";

type Contracts = keyof typeof addresses["11155111"];
export default function useContractAddresses() {
    const { chain } = useNetwork();
    return useMemo(() => {
        return getAddressesByChainId(chain?.id ?? 0);
    }, [chain]);
}

export function getAddressesByChainId(chainId: number) {
    const id = chainId + '';
    if (addresses.hasOwnProperty(id)) {
        // @ts-ignore
        return addresses[id] as Record<Contracts, Address>;
    }
    return {} as Record<Contracts, Address>;
}

