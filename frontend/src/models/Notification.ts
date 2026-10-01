export interface Notification {
    id: number;
    title: string;
    message: string;
    timestamp: string | null; // ISO instant
}
