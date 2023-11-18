import {useCallback, useEffect, useMemo, useState} from "react";
import {Address, useNetwork} from "wagmi";
import useContractAddresses from "@/src/hooks/useContractAddresses";
import {isAddress} from "viem";

export const tokenListUrl = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org';

export type TokenData = {
    name?: string,
    symbol?: string,
    address: Address,
    logoURI?: string
}

export function useFullTokenList() {
    const [tokenList, setTokenList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    useEffect(() => {
        setIsLoading(true)
        fetch(tokenListUrl)
            .then(response => response.json()).then(data => {
            console.log(data);
            setTokenList(data.tokens)
        }).catch((e) => {
            console.error(e);
            setIsError(true)
        }).finally(() => {
            setIsLoading(false)
        })
    }, [])
    return {tokenList, isLoading, isError};
}

export function useTokenList({chainId}: { chainId: number }) {
    const {tokenList: fullTokenList, isLoading, isError} = useFullTokenList();
    const tokenList: TokenData[] = useMemo(() => fullTokenList.filter((token: any) => token.chainId == chainId), [fullTokenList, chainId])
    return {tokenList, isLoading, isError};
}

export function useFilteredTokenList() {
    const {chain} = useNetwork()
    const {tokenList} = useTokenList({chainId: chain?.id ?? 1});
    const [query, setQuery] = useState('')
    const addresses = useContractAddresses();


    const data: TokenData[] = useMemo(() => [
        ...(tokenList.map((token: any) => ({
            name: token.name,
            symbol: token.symbol,
            address: token.address,
            logoURI: token.logoURI
        }))),
        {name: 'Meow', symbol: 'Meow', address: addresses?.Meow},
    ].filter(value => !!value.address), [tokenList, addresses?.Meow])

    const [filteredTokens, setFilteredTokens] = useState(data)
    const normalizeToken = useCallback((s?: string) => s?.toLowerCase()?.replace(/\s+/g, '') ?? '', []);
    const includesQuery = useCallback((prop: string, query: string) => normalizeToken(prop).includes(normalizeToken(query)), [normalizeToken]);
    const bySymbolNameOrAddress = useCallback((item: TokenData, query: string) => Object.values(item).some(value => includesQuery(value, query)), [includesQuery]);
    useEffect(() => {
        setFilteredTokens(query === '' ? data : data.filter(value => bySymbolNameOrAddress(value, query)));
    }, [query, data, bySymbolNameOrAddress]);
    useEffect(() => {
        if (isAddress(query) && filteredTokens.length === 0) {
            setFilteredTokens([{address: query}])
        }
    }, [query, filteredTokens]);

    return {filteredTokens, setQuery, query}
}
