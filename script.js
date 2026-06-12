// 1. LOGIC CHUYỂN ĐỔI PANEL ĐỘNG (SCALE & BLUR EFFECT)
function switchPanel(panelName) {
    const activePanel = document.getElementById(`panel-${panelName}`);
    
    if (activePanel.classList.contains('collapsed')) {
        // Tìm và thu nhỏ panel hiện tại đang mở
        document.querySelectorAll('.accordion-panel').forEach(panel => {
            panel.classList.remove('active');
            panel.classList.add('collapsed');
        });
        
        // Mở bung panel được click vào
        activePanel.classList.remove('collapsed');
        activePanel.classList.add('active');
    }
}

// 2. LOGIC TÍNH TOÀN CỤC TOẠ ĐỘ CON TRỎ CHUỘT CHO TỪNG CARD BENTO
document.addEventListener("mousemove", (event) => {
    const cards = document.querySelectorAll(".bento-card");
    cards.forEach((card) => {
        const bound = card.getBoundingClientRect();
        // Tính vị trí chuột dựa trên ranh giới của hộp đơn lẻ
        const mouseX = event.clientX - bound.left;
        const mouseY = event.clientY - bound.top;
        
        card.style.setProperty("--m-x", `${mouseX}px`);
        card.style.setProperty("--m-y", `${mouseY}px`);
    });
});

// 3. LOGIC HỆ THỐNG TRÌNH PHÁT NHẠC SPOTIFY PREMIUM AUDIO
const audioNode = document.getElementById("core-audio");
const playTriggerBtn = document.getElementById("play-trigger");
const playIcon = document.getElementById("play-icon");
const listTriggerBtn = document.getElementById("list-trigger");
const playlistWindow = document.getElementById("playlist-window");
const tracksContainer = document.getElementById("playlist-tracks");
const songTitleNode = document.getElementById("song-title");
const diskImage = document.getElementById("disk-image");
const timelineSeek = document.getElementById("timeline-seek");
const timelineFill = document.getElementById("timeline-fill");
const currentTimeNode = document.getElementById("current-time");
const totalDurationNode = document.getElementById("total-duration");

const mediaPlaylist = [
    "Early Morning, Mailbox", 
    "Become a Cloud", 
    "The Flower is Noisy Too", 
    "Evilness", 
    "Playsick"
];
let activeTrackIndex = 1;

// Render danh sách tracklist
mediaPlaylist.forEach((trackName, idx) => {
    const trackNum = idx + 1;
    const li = document.createElement("li");
    li.className = "track-node";
    li.innerHTML = `<span>${trackNum.toString().padStart(2, '0')}.</span> ${trackName}`;
    li.addEventListener("click", () => executeTrack(trackNum));
    tracksContainer.appendChild(li);
});

function timeConverter(seconds) {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function executeTrack(index) {
    activeTrackIndex = index;
    audioNode.src = `Music/${index}.mp3`;
    songTitleNode.textContent = mediaPlaylist[index - 1];
    
    document.querySelectorAll(".track-node").forEach((node, i) => {
        node.classList.toggle("active", i === index - 1);
    });

    audioNode.play().then(() => {
        playIcon.className = "fas fa-pause";
        diskImage.classList.add("vinyl-spin");
    }).catch(() => console.warn(`Đang chờ tệp tin âm thanh: Music/${index}.mp3`));
}

// Gắn bài hát mặc định ban đầu
audioNode.src = `Music/${activeTrackIndex}.mp3`;

playTriggerBtn.addEventListener("click", () => {
    if (audioNode.paused) {
        audioNode.play().then(() => {
            playIcon.className = "fas fa-pause";
            diskImage.classList.add("vinyl-spin");
        }).catch(err => console.log(err));
    } else {
        audioNode.pause();
        playIcon.className = "fas fa-play";
        diskImage.classList.remove("vinyl-spin");
    }
});

audioNode.addEventListener("loadedmetadata", () => {
    totalDurationNode.textContent = timeConverter(audioNode.duration);
});

audioNode.addEventListener("timeupdate", () => {
    if (audioNode.duration) {
        const ratio = (audioNode.currentTime / audioNode.duration) * 100;
        timelineFill.style.width = `${ratio}%`;
        currentTimeNode.textContent = timeConverter(audioNode.currentTime);
    }
});

timelineSeek.addEventListener("click", (e) => {
    const clickX = e.offsetX;
    const width = timelineSeek.clientWidth;
    audioNode.currentTime = (clickX / width) * audioNode.duration;
});

listTriggerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    playlistWindow.classList.toggle("open");
});

document.addEventListener("click", () => {
    playlistWindow.classList.remove("open");
});