# MV1 — Max Verstappen Statistics Dashboard

A responsive four-page fan dashboard built with plain HTML, CSS and JavaScript. It does not need a build step or framework.

## Open in VS Code

1. Open this project folder in VS Code.
2. Install the **Live Server** extension, then right-click `index.html` and choose **Open with Live Server**. Alternatively, in a terminal run `npm run serve` and open the address it displays.
3. Navigate between Dashboard, Early Career, Best Races and World Titles.

## Connect and update Google Sheets

The spreadsheet is already configured in `assets/js/data.js`. The website requests these exact sheet tabs:

| Sheet tab | Required columns / layout |
| --- | --- |
| `Home` | `Metric`, `Value` |
| `Championships` | first row: `Year`, `2021`, `2022`, `2023`, `2024`; first column: `Points`, `Wins`, `Poles`, `Races` |
| `Wins` | `Year`, `Race`, `Date` |

In Google Sheets, select **Share** and set General access to **Anyone with the link → Viewer**. If data does not load, use **File → Share → Publish to web** as CSV, then refresh the website. The dashboard automatically retrieves the latest values whenever a page is opened; no site code needs editing for routine data updates.

`data.js` contains fallback preview data so the design remains usable if the sheet is private or unavailable. The browser console will show an explanatory warning in that case.

## Photos, music and welcome sequence

The provided media is stored in `assets/media/`, allowing it to travel with the site when hosted:

- `1.jpg` through `4.jpg` form the automatically rotating home-page slideshow.
- `youngmax.jpg` appears on the Early Career page.
- `max2021.jpg` through `max2024.jpg` change with the World Titles season selector.
- `sound.mp3` plays after the visitor completes the six-click welcome sequence. A gold control in the lower-right corner turns it on or off.

The welcome sequence is deliberately used to start audio after a visitor interaction, which lets modern browsers permit playback. A visitor who moves between pages in the same browsing session retains their entry and sound preference.

## Hosting

This is a static site. Deploy the complete folder with GitHub Pages, Netlify, Vercel, or any web host that serves HTML files. No server-side setup is required.

## Project layout

```text
index.html                 Home dashboard
early-career.html          Early career timeline
best-races.html            Featured race stories
world-titles.html          Interactive championship dashboard
assets/css/styles.css      Shared responsive design
assets/js/data.js          Google Sheets connection and fallback data
assets/js/main.js          Page interactions and rendering
```
