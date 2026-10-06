// Matches the backend's PriceQuoteDTO (GET /api/booking/quote)
export interface PriceQuote {
    originalPrice: number;
    finalPrice: number;
    discountApplied: boolean;
    discountDescription?: string | null;
}
