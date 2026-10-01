import {TicketStatus} from "@/enums/TicketStatus.ts";
import {UserMessage} from "@/models/UserMessage.ts";

export interface Ticket {
    id: number;
    title: string;
    status: TicketStatus;
    messages: UserMessage[];
}