/*
 * DATA CONNECTION — edit only this file to change the spreadsheet.
 * The sheet must be shared as "Anyone with the link can view" (or published to web).
 * Sheet tabs expected: Home, Championships, Wins.
 */
const SHEET_ID = '16ZK90RYFNxG3WiIqyt13ggCc4shW0Kd_TY2wM46944E';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq`;

const fallbackData = {
  home: { 'World Championships': '4', 'Total Wins': '71', 'Total Race Starts': '230', 'Total Points Won': '999', Poles: '50', DNFs: '5' },
  championships: { '2021': { Points: 395.5, Wins: 10, Poles: 10, Races: 22 }, '2022': { Points: 454, Wins: 15, Poles: 7, Races: 22 }, '2023': { Points: 575, Wins: 19, Poles: 12, Races: 22 }, '2024': { Points: 437, Wins: 9, Poles: 8, Races: 24 } },
  wins: [{ Year: '2021', Race: 'Emilia-Romagna', Date: '18 Apr 2021' }, { Year: '2021', Race: 'Monaco', Date: '23 May 2021' }, { Year: '2021', Race: 'France', Date: '20 Jun 2021' }, { Year: '2021', Race: 'Styria', Date: '27 Jun 2021' }, { Year: '2021', Race: 'Austria', Date: '4 Jul 2021' }, { Year: '2021', Race: 'Belgium', Date: '29 Aug 2021' }, { Year: '2021', Race: 'Netherlands', Date: '5 Sep 2021' }, { Year: '2021', Race: 'United States', Date: '24 Oct 2021' }, { Year: '2021', Race: 'Mexico City', Date: '7 Nov 2021' }, { Year: '2021', Race: 'Abu Dhabi', Date: '12 Dec 2021' }]
};

function csvToRows(csv) {
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < csv.length; i++) { const char = csv[i], next = csv[i + 1]; if (char === '"' && quoted && next === '"') { cell += char; i++; } else if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { row.push(cell.trim()); cell = ''; } else if ((char === '\n' || char === '\r') && !quoted) { if (char === '\r' && next === '\n') i++; row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); row = []; cell = ''; } else cell += char; }
  if (cell || row.length) { row.push(cell.trim()); rows.push(row); } return rows;
}
async function getSheetRows(name) { const response = await fetch(`${SHEET_URL}?tqx=out:csv&sheet=${encodeURIComponent(name)}`); if (!response.ok) throw new Error(`Could not load ${name}`); return csvToRows(await response.text()); }
function records(rows) { const [headers, ...body] = rows; return body.map(row => Object.fromEntries(headers.map((header, i) => [header, row[i] || '']))); }
async function loadDashboardData() {
  try { const [homeRows, championshipRows, winRows] = await Promise.all(['Home', 'Championships', 'Wins'].map(getSheetRows)); const championshipRecord = records(championshipRows); const championships = {};
    championshipRows[0].slice(1).forEach((year, index) => { championships[year] = {}; championshipRecord.forEach(item => { championships[year][item.Year] = Number(item[year]); }); });
    return { home: Object.fromEntries(records(homeRows).map(item => [item.Metric, item.Value])), championships, wins: records(winRows), live: true };
  } catch (error) { console.warn('Using built-in data. Check that Google Sheets is publicly viewable.', error); return { ...fallbackData, live: false }; }
}
