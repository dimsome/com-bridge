import {createEvent} from "react-event-hook";

export const { useOrderDoneListener, emitOrderDone } = createEvent("orderDone")();
