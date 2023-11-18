import {Card} from "@/components/Card";
import {ToggleButton} from "@/components/button/ToggleButton";
import {Separator} from "@/components/misc/Separator";
import Image from "next/image";
import React from "react";
import {CreateOrderForm} from "@/components/home/CreateOrderForm";
import {OrderList} from "@/components/home/OrderList";

export const HomeForm = () => {
    return (
        <div className="flex w-full gap-4 wrap flex-col lg:flex-row">
            <div className="basis-1 grow shrink max-w-sm min-w-[300px] mx-auto">
                <CreateOrderForm/>
            </div>
            <div className="basis-1 grow-[2] mx-auto w-full flex flex-col gap-4">
                <OrderList/>

            </div>
        </div>
    );
}


