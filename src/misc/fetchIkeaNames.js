import papaparse from "https://cdn.skypack.dev/papaparse@5.3.1";

// @see https://github.com/hejny/czech.events/blob/v0.2.0/src/utils/fetchEvents.ts

export async function fetchIkeaNames() {
    const response = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vTyuRkonDrG3TI9cFk3Cq29JKiz9NsYJfwmJjxeRy13m294lN05rnWBWu87nufjp26rdkswZlGwLMR1/pub?gid=0&single=true&output=csv`, { cache: 'reload' });
    const dataString = await response.text();
    const { data } = papaparse.parse(dataString, {
        header: true,
    });

    for (const row of data) {
        if (!row.IkeaName) row.IkeaName = null;
        if (row.IkeaName.trim() === "not") row.IkeaName = null;
        if (!row.IkeaUrl) row.IkeaUrl = null;
    }

    return data
}