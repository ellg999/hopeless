const songs = [
  [ "'Cause You Have To", "LANY", 251, "'Cause You Have To.mp3"],
  [ "Merry Christmas, Please Don't Call", "Bleachers", 203, "Merry Christmas, Please Don t Call.mp3"],
  [ "Past Life", "Ariana Grande", 216, "Past Life.mp3"],
];

const $ = (id) => document.querySelector(id);

const title = $("#title");
const artist = $("#artist");
const link = $("#link");
const bar = $("#progress");
const now = $("#now");
const left = $("#left");
const status = $("#status");
const vinyl = $("#vinyl");
const list = $("#list");
const playBtn = $("#play"); 

const audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;

const formatTime = (seconds) => {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${minutes}:${secs}`;
};

function updateUI() {
  const [name, singer, duration, audioFile] = songs[currentSongIndex];

  if (title) title.textContent = name;
  if (artist) artist.textContent = singer;

  list.innerHTML = songs.map((songData, index) => {
    const isActive = index === currentSongIndex ? "active" : "";
    return `
      <a class="song-item ${isActive}" data-song="${index}" href="javascript:void(0);">
        <span>0${index + 1}</span>
        <span>${songData[0]}</span>  
        <span>${songData[1]}</span>
        <span>▶</span>
      </a>
    `;
  }).join('');

  if (status) status.textContent = isPlaying ? "Memutar" : "Jeda";
  if (playBtn) playBtn.innerHTML = isPlaying ? "‖ <span>Jeda</span>" : "▶ <span>Putar</span>";
  if (vinyl) vinyl.classList.toggle("is-spinning", isPlaying);
}

function changeSong(index) {
  currentSongIndex = index;
  const audioFile = songs[currentSongIndex][3];

  audio.src = audioFile;
  isPlaying = true;
  audio.play().catch(err => console.log("Gagal memutar audio:", err));

  updateUI();
}

function togglePlay() {
  if (!audio.src) {
    audio.src = songs[currentSongIndex][3];
  }

  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play().then(() => {
      isPlaying = true;
    }).catch(err => console.log("Gagal memutar audio:", err));
  }

  updateUI();
}

audio.addEventListener("timeupdate", () => {
  const currentTime = audio.currentTime;
  const duration = songs[currentSongIndex][2];
  const percent = (currentTime / duration) * 100;

  if (bar) {
    bar.max = duration;
    bar.value = currentTime;
    bar.style.setProperty("--progress", `${percent}%`);
  }

  if (now) now.textContent = formatTime(currentTime);
  if (left) left.textContent = `-${formatTime(duration - currentTime)}`;
});

audio.addEventListener("ended", () => {
  changeSong((currentSongIndex + 1) % songs.length);
});

if (playBtn) playBtn.onclick = togglePlay;
$("#next").onclick = () => changeSong((currentSongIndex + 1) % songs.length);
$("#prev").onclick = () => changeSong((currentSongIndex + songs.length - 1) % songs.length);

if (bar) {
  bar.oninput = () => {
    audio.currentTime = Number(bar.value);
  };
}

list.onclick = (event) => {
  const item = event.target.closest("[data-song]");
  if (item) {
    changeSong(Number(item.dataset.song));
  }
};

updateUI();
