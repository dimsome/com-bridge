import {useNetwork} from "wagmi";
import {useMemo} from "react";

export function useBlockExplorer() {
    const { chain} = useNetwork()
    return useMemo(() => {
        if (chain?.id == null) {
            return ''
        } else if (chain?.id === 1442) {
            return 'https://testnet-zkevm.polygonscan.com'
        } else if (chain?.id === 5001) {
            return 'https://explorer.testnet.mantle.xyz'
        } else if (chain?.id === 534351) {
            return 'https://sepolia.scrollscan.dev'
        } else if (chain?.id === 43113) {
            return 'https://testnet.snowtrace.io'
        } else if (chain?.id === 111555111) {
            return 'https://sepolia.etherscan.io'
        } else if (chain?.id === 80001) {
            return 'https://mumbai.polygonscan.com'
        } else if (chain?.id === 421611) {
            return 'https://testnet.arbiscan.io'
        }
    }, [chain?.id])
}

export function useTxExplorer(hash?: `0x${string}`) {
    const be = useBlockExplorer()
    return useMemo(() => {
        return `${be}/tx/${hash}`
    }, [be, hash])
}

export function useAddressExplorer(address?: `0x${string}`) {
    const be = useBlockExplorer()
    return useMemo(() => {
        return `${be}/address/${address}`
    }, [be, address])
}
