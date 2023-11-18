"use client";
import {Wrapper} from "@/components/Wrapper";
import React, {useMemo} from "react";
import Landing from "@/components/landing/Landing";
import {useAccount} from "wagmi";
import {HomeForm} from "@/components/home/HomeForm";
import {useHydrated} from "@/src/hooks/useHydrated";

const Home = () => {
    const {isConnecting, address} = useAccount();
    const isHydrated = useHydrated();
    const showLanding = useMemo(() => !address || isConnecting || !isHydrated, [address, isConnecting, isHydrated]);
    return (
        <main>
            <Wrapper>
                {showLanding ? <Landing/> : <HomeForm/>}
            </Wrapper>
        </main>
    );
};

export default Home;
