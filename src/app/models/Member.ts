import { Rank } from './Rank';

/**
 * Define member in the roster
 */
export interface Member {
    // entry id
    id?: string;

    // character name in game
    character: string;

    // legacy name
    legacy?: string;

    // rank in guild (id)
    rankId: string;

    // resolved name of the rank
    rank: Rank;

    // username on the website
    website?: string;

    // discord user ID
    discordId?: string;

    // guild join date
    joined: Date;

    // left guild date
    left?: Date;

    // comments
    notes?: string;
}
