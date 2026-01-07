console.log("Spotify Final Version Working ✅");

let audio = new Audio();
audio.volume = 0.7;

let currentAlbum = [];
let currentIndex = 0;
let currentAlbumName = ""; // 💾 last played album remember

/* ================= ALBUM DATA ================= */

const albums = {
  Jubin: {
    songs: [
      {
        title: "Barsaat Ki Dhun",
        src: "/songs/Jubin/Barsaat-Ki-Dhun.mp3",
        img: "songs/Jubin/Barsaat-Ki-Dhun.jpg"
      },
      {
        title: "Bewafa Tera Masoom Chehra",
        src: "/songs/Jubin/Bewafa Tera Masoom Chehra.mp3",
        img: "songs/Jubin/Bewafa-Tera-Masoom-Chehra-Jubin-Nautiyal-500-500.jpg"
      },
      {
        title: "Dhadkan Amavas",
        src: "/songs/Jubin/Dhadkan Amavas.mp3",
        img: "songs/Jubin/Dhadkan-Amavas-500-500.jpg"
      }
    ]
  },

  YoYo: {
    songs: [
      {
        title: "Blue Eyes",
        src: "/songs/YoYo/Blue Eyes.mp3",
        img: "songs/YoYo/Blue-Eyes-Yo-Yo-Honey-Singh-500-500.jpg"
      },
      {
        title: "Brown Rang",
        src: "/songs/YoYo/Brown Rang.mp3",
        img: "songs/YoYo/Brown-Rang-International-Villager-500-500.jpg"
      },
      {
        title: "Desi Kalakaar",
        src: "/songs/YoYo/Desi Kalakaar.mp3",
        img: "songs/YoYo/Desi-Kalakaar-Yo-Yo-Honey-Singh-500-500.jpg"
      }
    ]
  },

  Akhil:{
    songs:[
        {
          title: "Gani",
          src: "/songs/Akhil/Gani.mp3",
          img: "songs/Akhil/Gani-1.jpg"
        },
        {
          title: "Khaab",
          src: "/songs/Akhil/Khaab.mp3",
          img: "songs/Akhil/Khaab-Akhil-500-500.jpg"
        },
        {
          title: "Khaab",
          src: "/songs/Akhil/Tainu Milke.mp3",
          img: "songs/Akhil/Tainu-Milke-Akhil-500-500.jpg"
           
        }

    ]
  }
};

/* ================= UI ELEMENTS ================= */

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("previous");
const nextBtn = document.getElementById("next");
const songInfo = document.querySelector(".songinfo");
const songTime = document.querySelector(".songtime");
const songList = document.querySelector(".songList ul");

const playbarImage = document.getElementById("playbarImage");

const seekbar = document.querySelector(".seekbar");
const circle = document.querySelector(".circle");

const volumeSlider = document.querySelector(".range input");
const volumeIcon = document.querySelector(".volume img");

const searchInput = document.getElementById("searchSong");

/* ================= LOAD ALBUM ================= */

function loadAlbum(albumName) {
  currentAlbumName = albumName;
  currentAlbum = albums[albumName].songs;
  currentIndex = 0;

  songList.innerHTML = "";

  currentAlbum.forEach((song, index) => {
    const li = document.createElement("li");
    li.innerText = song.title;
    li.style.cursor = "pointer";
    li.onclick = () => playSong(index);
    songList.appendChild(li);
  });

  playSong(0);
  enableSearch();
}

/* ================= PLAY SONG ================= */
function playSong(index) {
  currentIndex = index;
  audio.src = currentAlbum[currentIndex].src;
  audio.play();

  songInfo.innerText = currentAlbum[currentIndex].title;
  playBtn.src = "img/pause.svg";

  playbarImage.src = currentAlbum[currentIndex].img;

  // 🎨 Blur background
  document.getElementById("bgBlur").style.backgroundImage =
    `url(${currentAlbum[currentIndex].img})`;

  document.querySelectorAll(".songList li").forEach((li, i) => {
    li.classList.toggle("active", i === index);
  });

  localStorage.setItem("lastAlbum", currentAlbumName);
  localStorage.setItem("lastIndex", index);
}



/* ================= CONTROLS ================= */

playBtn.onclick = () => {
  if (audio.paused) {
    audio.play();
    playBtn.src = "img/pause.svg";
  } else {
    audio.pause();
    playBtn.src = "img/play.svg";
  }
};

nextBtn.onclick = () => {
  currentIndex = (currentIndex + 1) % currentAlbum.length;
  playSong(currentIndex);
};

prevBtn.onclick = () => {
  currentIndex =
    (currentIndex - 1 + currentAlbum.length) % currentAlbum.length;
  playSong(currentIndex);
};

/* ================= AUTO NEXT ================= */

audio.addEventListener("ended", () => {
  nextBtn.click();
});

/* ================= TIME + SEEKBAR ================= */

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  songTime.innerText =
    `${format(audio.currentTime)} / ${format(audio.duration)}`;

  circle.style.left =
    (audio.currentTime / audio.duration) * 100 + "%";
});

seekbar.addEventListener("click", (e) => {
  const width = seekbar.getBoundingClientRect().width;
  audio.currentTime = (e.offsetX / width) * audio.duration;
});

/* ================= VOLUME ================= */

volumeSlider.value = 70;

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value / 100;
});

volumeIcon.addEventListener("click", () => {
  if (audio.volume > 0) {
    audio.volume = 0;
    volumeSlider.value = 0;
  } else {
    audio.volume = 0.7;
    volumeSlider.value = 70;
  }
});

/* ================= SEARCH ================= */

function enableSearch() {
  searchInput.oninput = () => {
    const value = searchInput.value.toLowerCase();
    document.querySelectorAll(".songList ul li").forEach(li => {
      li.style.display = li.innerText.toLowerCase().includes(value)
        ? "flex"
        : "none";
    });
  };
}

/* ================= CARD CLICK ================= */

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    loadAlbum(card.dataset.album);
  });
});

/* ================= RESTORE LAST PLAYED ================= */

window.addEventListener("load", () => {
  const lastAlbum = localStorage.getItem("lastAlbum");
  const lastIndex = localStorage.getItem("lastIndex");

  if (lastAlbum && albums[lastAlbum]) {
    loadAlbum(lastAlbum);

    if (lastIndex !== null) {
      audio.pause();
      playSong(Number(lastIndex));
      audio.pause();
      playBtn.src = "img/play.svg";
    }
  }
});

/* ================= HELPER ================= */

function format(sec) {
  if (isNaN(sec)) return "00:00";
  let m = Math.floor(sec / 60);
  let s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
