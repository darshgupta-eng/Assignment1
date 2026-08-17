document.addEventListener('DOMContentLoaded', async () => {
  addExperienceStyles();
  const music = initMusic();
  initWelcome(music);
  addPagePhotography();
  const menu = document.querySelector('.menu-button'); const nav = document.querySelector('.main-nav');
  if (menu) menu.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); menu.setAttribute('aria-expanded', open); });
  if (!document.querySelector('#home-metrics, #season-metrics')) return;
  const data = await loadDashboardData();
  renderHome(data); renderTitles(data);
});

function addExperienceStyles() {
  if (!document.querySelector('link[href="assets/css/experience.css"]')) document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="assets/css/experience.css">');
}

function initMusic() {
  const audio = document.createElement('audio'); audio.src = 'assets/media/sound.mp3'; audio.loop = true; audio.preload = 'auto';
  const button = document.createElement('button'); button.className = 'music-toggle'; button.type = 'button'; button.setAttribute('aria-label', 'Turn music on'); button.innerHTML = '<span>♫</span> Sound off';
  const setState = playing => { button.classList.toggle('is-playing', playing); button.setAttribute('aria-label', playing ? 'Turn music off' : 'Turn music on'); button.innerHTML = playing ? '<span>♫</span> Sound on' : '<span>♫</span> Sound off'; sessionStorage.setItem('mv1-music', playing ? 'on' : 'off'); };
  const play = async () => { try { await audio.play(); setState(true); } catch (_) { setState(false); } };
  button.addEventListener('click', () => audio.paused ? play() : (audio.pause(), setState(false)));
  document.body.append(audio, button);
  if (sessionStorage.getItem('mv1-entered') === 'true' && sessionStorage.getItem('mv1-music') !== 'off') play();
  return { play };
}

function initWelcome(music) {
  if (!document.querySelector('#home-metrics') || sessionStorage.getItem('mv1-entered') === 'true') return;
  const overlay = document.createElement('section'); overlay.className = 'start-overlay'; overlay.innerHTML = '<div class="start-content"><p class="eyebrow">Race start protocol</p><h1>WELCOME TO THE<br><em>WORLD OF MAD MAX.</em></h1><div class="start-lights" aria-label="Five start lights"><i></i><i></i><i></i><i></i><i></i></div><p class="start-instruction">Please wear headphones<br><b>Please click 6 times</b></p><button class="start-button" type="button">Click to start <span>0 / 6</span></button></div>';
  document.body.prepend(overlay); let clicks = 0; const button = overlay.querySelector('button'); const lights = [...overlay.querySelectorAll('.start-lights i')];
  button.addEventListener('click', () => { clicks++; button.querySelector('span').textContent = `${clicks} / 6`; if (clicks <= 5) lights[clicks - 1].classList.add('lit'); if (clicks === 6) { lights.forEach(light => light.classList.remove('lit')); sessionStorage.setItem('mv1-entered', 'true'); overlay.classList.add('start-exit'); music.play(); setTimeout(() => overlay.remove(), 700); } });
}

function addPagePhotography() {
  if (document.querySelector('#home-metrics')) { const hero = document.querySelector('.home-hero'); hero.insertAdjacentHTML('afterend', '<section class="photo-slideshow" aria-label="Max Verstappen photo slideshow"><img class="active" src="assets/media/1.jpg" alt="Max Verstappen racing"><img src="assets/media/2.jpg" alt="Max Verstappen at the circuit"><img src="assets/media/3.jpg" alt="Max Verstappen celebrating"><img src="assets/media/4.jpg" alt="Max Verstappen in action"><div><span>01</span><b>ON THE LIMIT</b></div></section>'); const slides = [...document.querySelectorAll('.photo-slideshow img')]; let current = 0; setInterval(() => { slides[current].classList.remove('active'); current = (current + 1) % slides.length; slides[current].classList.add('active'); document.querySelector('.photo-slideshow span').textContent = `0${current + 1}`; }, 3800); }
  const career = document.querySelector('.timeline'); if (career) career.insertAdjacentHTML('beforebegin', '<figure class="career-photo"><img src="assets/media/youngmax.jpg" alt="Young Max Verstappen"><figcaption>EARLY DAYS / A RACER IN THE MAKING</figcaption></figure>');
  const title = document.querySelector('.title-dashboard'); if (title) title.querySelector('.season-head').insertAdjacentHTML('beforebegin', '<figure class="title-photo"><img src="assets/media/max2021.jpg" alt="Max Verstappen in 2021" id="season-photo"><figcaption id="season-photo-caption">2021 / WORLD CHAMPION</figcaption></figure>');
}

const formatNumber = value => Number(value).toLocaleString('en-US', { maximumFractionDigits: 1 });
const percentage = (part, total) => total ? `${((part / total) * 100).toFixed(1)}%` : '—';
function renderHome(data) {
  const grid = document.querySelector('#home-metrics'); if (!grid) return;
  const home = data.home;
  const primary = [['World Championships', 'WDC Titles'], ['Total Wins', 'Race Wins'], ['Total Race Starts', 'Race Starts'], ['Total Points Won', 'Career Points']];
  grid.innerHTML = primary.map(([key, label], index) => `<article class="metric-card"><span class="metric-index">0${index + 1}</span><strong>${formatNumber(home[key])}</strong><span>${label}</span></article>`).join('');
  document.querySelector('#wins-starts').textContent = percentage(home['Total Wins'], home['Total Race Starts']);
  document.querySelector('#poles-starts').textContent = percentage(home.Poles, home['Total Race Starts']);
  document.querySelector('#dnfs').textContent = formatNumber(home.DNFs);
  const status = document.querySelector('#data-status'); status.textContent = data.live ? '● Live sheet data' : '● Preview data — sheet unavailable'; status.classList.toggle('offline', !data.live);
}
function renderTitles(data) {
  const metrics = document.querySelector('#season-metrics'); if (!metrics) return;
  const buttons = [...document.querySelectorAll('[data-year]')];
  const showYear = year => { const season = data.championships[year]; if (!season) return;
    buttons.forEach(button => { const selected = button.dataset.year === year; button.classList.toggle('active', selected); button.setAttribute('aria-selected', selected); });
    document.querySelector('#season-title').textContent = year; document.querySelector('#season-summary').textContent = `${formatNumber(season.Points)} points. ${season.Wins} wins from ${season.Races} races.`;
    const photo = document.querySelector('#season-photo'); if (photo) { photo.src = `assets/media/max${year}.jpg`; photo.alt = `Max Verstappen in ${year}`; document.querySelector('#season-photo-caption').textContent = `${year} / WORLD CHAMPION`; }
    metrics.innerHTML = [['Total points', formatNumber(season.Points)], ['Races won', `${season.Wins} / ${season.Races}`], ['Poles', `${season.Poles} / ${season.Races}`], ['Pole / win rate', `${percentage(season.Poles, season.Races)} / ${percentage(season.Wins, season.Races)}`]].map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join('');
    const wins = data.wins.filter(win => String(win.Year) === year); document.querySelector('#wins-heading').textContent = `${year} winning wave`; document.querySelector('#win-count').textContent = `${wins.length} wins listed`;
    document.querySelector('#wins-wave').innerHTML = wins.length ? wins.map((win, index) => `<article style="height:${62 + (index % 4) * 28}px"><i></i><span>${win.Date}</span><strong>${win.Race}</strong></article>`).join('') : '<p class="empty-state">Add this season’s wins to the <b>Wins</b> sheet to display its race wave.</p>';
  };
  buttons.forEach(button => button.addEventListener('click', () => showYear(button.dataset.year))); showYear('2021');
}
