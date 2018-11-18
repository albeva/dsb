/**
 * Ranks
 */
export interface Rank {
    id: string;
    name: string;
    color: string;
    promoteAfter?: number;
    demoteAfter?: number;
    index?: number;
}
