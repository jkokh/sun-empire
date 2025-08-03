import fs from 'fs/promises';
import path from 'path';

export type LocationDataParsed = {
    country: string;
    zip: string;
    city: string;
    stateFull: string;
    stateAbbr: string;
    county: string;
    latitude: number;
    longitude: number;
};

const parseCity = (line: string): { city: string, stateFull: string; stateAbbr: string; county: string;} | null => {
    const arr = line.split('\t');
    const [city, stateFull, stateAbbr, county ] = arr;
    if (!isValidState(stateAbbr)) {
        return null;
    }
    return { city, stateFull, stateAbbr, county };
}

const parseData = (input: string[]): LocationDataParsed[] => {
    // Regex to extract the ZIP code, latitude, and longitude
    const lineRegex = /^US\s+(\d{5})(\s+.*?)(-?\d{1,3}(?:\.\d+)?)\s+(-?\d{1,3}(?:\.\d+)?)(?:\s+\d)?$/;
    const results: LocationDataParsed[] = [];

    for (const line of input) {
        const match = line.trim().match(lineRegex);
        if (!match) {
            console.log('Failed to match:', line);  // Optionally log failed lines
            continue;
        }
        // Ensure parseFloat is correctly applied to both latitude and longitude
        const [zip, text, latitude, longitude] = [match[1], match[2], parseFloat(match[3]), parseFloat(match[4])];

        const cityData = parseCity(text.trim());
        if (!cityData) {
            continue;
        }
        results.push({
            country: 'US',
            zip,
            city: cityData.city,
            stateFull: cityData.stateFull,
            stateAbbr: cityData.stateAbbr,
            county: cityData.county,
            latitude,
            longitude
        });
    }
    return results;
}

export const readDataFromFile = async (filePath: string): Promise<LocationDataParsed[]> => {
    const absolutePath = path.join(__dirname, filePath);
    try {
        const data = await fs.readFile(absolutePath, 'utf8');
        const lines = data.split('\n');
        return parseData(lines); // Ensure parseData returns LocationDataParsed[]
    } catch (err) {
        console.error('Error reading file:', err);
        return []; // Return an empty array or throw an error as needed
    }
}

export const isValidState = (stateCode: string) => {
    const stateMap = {
        AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
        CO: 'Colorado', CT: 'Connecticut', DC: 'District of Columbia', DE: 'Delaware',
        FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
        IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
        ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
        MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
        NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
        NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon',
        PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
        TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia',
        WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
    };
    const sc = (stateMap as any)[stateCode];
    return sc ? sc : false;
}