const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const bar = document.getElementById('bar');
const barFill = document.getElementById('barFill');
const barKnob = document.getElementById('barKnob');
const curTime = document.getElementById('curTime');
const durTime = document.getElementById('durTime');

function fmt(s) {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return m + ':' + sec;
}

function setPlayingUI(playing) {
  playIcon.style.display = playing ? 'none' : 'block';
  pauseIcon.style.display = playing ? 'block' : 'none';
}

playBtn.addEventListener('click', () => {
  if (audio.paused) { audio.play(); } else { audio.pause(); }
});
audio.addEventListener('play', () => setPlayingUI(true));
audio.addEventListener('pause', () => setPlayingUI(false));

audio.addEventListener('loadedmetadata', () => {
  durTime.textContent = fmt(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  curTime.textContent = fmt(audio.currentTime);
  if (audio.duration) {
    const pct = (audio.currentTime / audio.duration) * 100;
    barFill.style.width = pct + '%';
    barKnob.style.left = pct + '%';
  }
});

function seekFromEvent(clientX) {
  const rect = bar.getBoundingClientRect();
  let pct = (clientX - rect.left) / rect.width;
  pct = Math.min(1, Math.max(0, pct));
  if (audio.duration) audio.currentTime = pct * audio.duration;
}

bar.addEventListener('click', (e) => seekFromEvent(e.clientX));

let dragging = false;
bar.addEventListener('mousedown', () => dragging = true);
window.addEventListener('mousemove', (e) => { if (dragging) seekFromEvent(e.clientX); });
window.addEventListener('mouseup', () => dragging = false);

audio.addEventListener('error', () => {
  console.error('Audio gagal dimuat, cek path src di tag <audio> — harus sesuai lokasi file mp3.');
});