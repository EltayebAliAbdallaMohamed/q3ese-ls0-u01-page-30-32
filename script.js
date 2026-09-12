let dataList = [];
let currentIndex = 0;
let isLoaded = false;

/* ---------------------------
   Load any JSON file
---------------------------- */
function loadJSON(fileName) {
  fetch(fileName)
    .then(response => response.json())
    .then(data => {
      dataList = data;
      currentIndex = 0;
      loadItem(0);
      isLoaded = true;
    })
    .catch(error => {
      console.error("Error loading JSON:", error);
      document.getElementById("displayText").textContent =
        "Error loading " + fileName;
    });
}

/* ---------------------------
   Load default JSON on startup
---------------------------- */
loadJSON("data.json");

/* ---------------------------
   Dropdown change event
---------------------------- */
document.getElementById("jsonSelector").onchange = function () {
  const selectedFile = this.value;
  loadJSON(selectedFile);
};

/* ---------------------------
   Load item
---------------------------- */
function loadItem(index) {
  const item = dataList[index];

  const img = document.getElementById("itemImage");
  const text = document.getElementById("displayText");
  const arabicText = document.getElementById("arabicText");
  const audioPlayer = document.getElementById("audioPlayer");
  const playBtn = document.getElementById("playBtn");
  const arabicPlayBtn = document.getElementById("arabicPlayBtn");
  const counter = document.getElementById("itemCounter");

  // Update counter
  counter.textContent = `Item ${index + 1} of ${dataList.length}`;

  // English text
  text.textContent = item.text || "No text available";

  // Arabic text
  arabicText.textContent = item.arabic || "";

  // Image
  if (item.image && item.image.trim() !== "") {
    img.src = item.image;
    img.style.display = "block";
  } else {
    img.removeAttribute("src");
    img.style.display = "none";
  }

  // Audio
  if (item.audio && item.audio.trim() !== "") {
    audioPlayer.src = item.audio;
    audioPlayer.style.display = "block";
  } else {
    audioPlayer.removeAttribute("src");
    audioPlayer.style.display = "none";
  }

  // Store TTS scripts
  window.audioScript = item.audioScript || "";
  window.arabicScript = item.arabicScript || "";

  // Always show play buttons
  playBtn.style.display = "inline-block";
  arabicPlayBtn.style.display = "inline-block";

  // Auto play
  const autoPlay = document.getElementById("autoPlayCheck").checked;
  if (autoPlay) {
    playAudio();
  }
}

/* ---------------------------
   Play English audio or TTS
---------------------------- */
function playAudio() {
  const audioPlayer = document.getElementById("audioPlayer");

  if (audioPlayer.src) {
    audioPlayer.play().catch(err => {
      console.error("Audio playback error:", err);
      speakEnglishTTS();
    });
  } else {
    speakEnglishTTS();
  }
}

function speakEnglishTTS() {
  const text = (window.audioScript || "").trim();

  const utter = new SpeechSynthesisUtterance(
    text === "" ? "No audio script available." : text
  );

  utter.lang = "en-US";
  utter.rate = 1;
  utter.pitch = 1;

  speechSynthesis.speak(utter);
}

/* ---------------------------
   Arabic TTS
---------------------------- */
document.getElementById("arabicPlayBtn").onclick = function () {
  const text = (window.arabicScript || "").trim();

  const utter = new SpeechSynthesisUtterance(
    text === "" ? "لا يوجد نص عربي." : text
  );

  utter.lang = "ar-SA";
  utter.rate = 1;
  utter.pitch = 1;

  speechSynthesis.speak(utter);
};

/* ---------------------------
   NEXT / PREVIOUS
---------------------------- */
document.getElementById("nextBtn").onclick = function () {
  currentIndex = (currentIndex + 1) % dataList.length;
  loadItem(currentIndex);
};

document.getElementById("prevBtn").onclick = function () {
  currentIndex = (currentIndex - 1 + dataList.length) % dataList.length;
  loadItem(currentIndex);
};
