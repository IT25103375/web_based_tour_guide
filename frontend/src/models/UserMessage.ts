export interface UserMessage {
    id: number;
    content: string;
    sender: string;
    timestamp: string; // ISO instant
}