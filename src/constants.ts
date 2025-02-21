// CR DATA
interface CrData {
    xp: number;
    prof_bonus: number;
}

// Define the primary dictionary with `cr` as the key
type CrDictionary = {
    [cr: string]: CrData;
};

// Example usage:
export const cr_dictionary: CrDictionary = {
    "0": { xp: 10, prof_bonus: 2 },
    "1/8": { xp: 25, prof_bonus: 2 },
    "1/4": { xp: 50, prof_bonus: 2 },
    "1/2": { xp: 100, prof_bonus: 2 },
    "1": { xp: 200, prof_bonus: 2 },
    "2": { xp: 450, prof_bonus: 2 },
    "3": { xp: 700, prof_bonus: 2 },
    "4": { xp: 1100, prof_bonus: 2 },
    "5": { xp: 1800, prof_bonus: 3 },
    "6": { xp: 2300, prof_bonus: 3 },
    "7": { xp: 2900, prof_bonus: 3 },
    "8": { xp: 3900, prof_bonus: 3 },
    "9": { xp: 5000, prof_bonus: 4 },
    "10": { xp: 5900, prof_bonus: 4 },
    "11": { xp: 7200, prof_bonus: 4 },
    "12": { xp: 8400, prof_bonus: 4 },
    "13": { xp: 10000, prof_bonus: 5 },
    "14": { xp: 11500, prof_bonus: 5 },
    "15": { xp: 13000, prof_bonus: 5 },
    "16": { xp: 15000, prof_bonus: 5 },
    "17": { xp: 18000, prof_bonus: 6 },
    "18": { xp: 20000, prof_bonus: 6 },
    "19": { xp: 22000, prof_bonus: 6 },
    "20": { xp: 25000, prof_bonus: 6 },
    "21": { xp: 33000, prof_bonus: 7 },
    "22": { xp: 41000, prof_bonus: 7 },
    "23": { xp: 50000, prof_bonus: 7 },
    "24": { xp: 62000, prof_bonus: 7 },
    "25": { xp: 75000, prof_bonus: 8 },
    "26": { xp: 90000, prof_bonus: 8 },
    "27": { xp: 105000, prof_bonus: 8 },
    "28": { xp: 120000, prof_bonus: 8 },
    "29": { xp: 135000, prof_bonus: 9 },
    "30": { xp: 155000, prof_bonus: 9 },
};