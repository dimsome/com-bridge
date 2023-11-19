import Image from "next/image";
import React, {useMemo} from "react";
import clsxm from "@/src/lib/clsxm";
import {useNetwork} from "wagmi";

type ChainImageProps = {
    chainId: number
    className?: string
    size?: number
}
export const ChainImage = ({chainId, className, size = 24}: ChainImageProps) => {
    const {chains} = useNetwork();

    const chain = useMemo(() => chains.find(value => value.id == chainId), [chains, chainId])
    const src = useMemo(() => {
        switch (chainId) {
            case 80001:
                return '/rsz_polygon.webp';
            case 43113:
                return '/rsz_avalanche.webp';
            case 421611:
                return '/arbitrum.png';
            case 42161:
                return '/arbitrum.png';
            case 100:
                return '/gnosis.png';
            default:
                return undefined
        }
    }, [chainId])
    if (!src) {
        return <div className='h-6 w-6 bg-primary-300 rounded-full flex items-center justify-center font-bold text-white'>
            {chain?.name?.[0] ?? '?'}
        </div>
    }

    return <Image className={clsxm('shrink-0 grow-0 rounded-full', className)} src={src} alt={'chain'} height={size ?? 24}
                  width={size ?? 24}/>
}
