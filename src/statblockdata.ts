
export interface StatBlockData {
    name: string;
    creature_type: string;
    alignment: string;
    ac: number;
    speed: string;
    scores: number[];
    saves: string[];
    skills: { [key: string]: number }[];
    gear: { [key: string]: number }[];
    senses: string;
    languages: string;
    cr: string;
    actions: { name: string; desc: string }[];
    bonus_actions?: { name: string; desc: string }[];
    hp: string;
    vulnerabilities: string;
    resistances: string;
    immunities: string;
    condition_immunities: string;
    traits: { name: string; desc: string }[];
    reactions: { name: string; desc: string }[];
    legendary_actions: { name: string; desc: string }[];
}