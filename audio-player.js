// Possible improvements:
// - Change timeline and volume slider into input sliders, reskinned
// - Change into Vue or React component
// - Be able to grab a custom title instead of "Music Song"
// - Hover over sliders to see preview of timestamp/volume change
// https://codepen.io/EmNudge/pen/rRbLJQ

const audioContainers = document.querySelectorAll(".audio-container");
let currentlyPlayingIndex = -1; // Track which audio is currently playing
const audioObjects = []; // Store Audio objects

for (const [index, audioContainer] of Array.from(audioContainers).entries()) {
  const audio = new Audio(
    audioContainer.querySelector(".audio-player").getAttribute("data-audio")
  );
  audioObjects[index] = audio; // Store the Audio object

  audio.addEventListener(
    "loadeddata",
    () => {
      audioContainer.querySelector(".time .length").textContent = getTimeCodeFromNum(
        audio.duration
      );
      audio.volume = 1;
    },
    false
  );

  // Reset progress bar and play button when audio ends
  audio.addEventListener("ended", () => {
    const progressBar = audioContainer.querySelector(".progress");
    progressBar.style.width = "0%";
    audioContainer.querySelector(".time .current").textContent = "0:00";
    const playBtn = audioContainer.querySelector(".toggle-play");
    playBtn.querySelector(".play-controls").classList.remove("stop");
    playBtn.querySelector(".play-controls").classList.add("play");
    currentlyPlayingIndex = -1;
  }, false);

  //click on timeline to skip around
  const timeline = audioContainer.querySelector(".timeline");
  timeline.addEventListener("click", e => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
    audio.currentTime = timeToSeek;
    if (audio.paused) {
      playAudio();
    }
  }, false);

  //check audio percentage and update time accordingly
  setInterval(() => {
    const progressBar = audioContainer.querySelector(".progress");
    progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
    audioContainer.querySelector(".time .current").textContent = getTimeCodeFromNum(
      audio.currentTime
    );
  }, 500);

  //toggle between playing and pausing on button click
  const playBtn = audioContainer.querySelector(".toggle-play");
  playBtn.addEventListener(
    "click",
    playAudio,
    false
  );

  function playAudio() {
    if (audio.paused) {
      // Stop currently playing audio if it exists
      if (currentlyPlayingIndex !== -1 && currentlyPlayingIndex !== index) {
        const currentAudio = audioObjects[currentlyPlayingIndex];
        const currentPlayBtn = Array.from(audioContainers)[currentlyPlayingIndex].querySelector(".toggle-play");
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentPlayBtn.querySelector(".play-controls").classList.remove("stop");
        currentPlayBtn.querySelector(".play-controls").classList.add("play");
      }
      playBtn.querySelector(".play-controls").classList.remove("play");
      playBtn.querySelector(".play-controls").classList.add("stop");
      audio.play();
      currentlyPlayingIndex = index;
    } else {
      playBtn.querySelector(".play-controls").classList.remove("stop");
      playBtn.querySelector(".play-controls").classList.add("play");
      audio.pause();
      audio.currentTime = 0;
      currentlyPlayingIndex = -1;
    }
  }

  //turn 128 seconds into 2:08
  function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
      seconds % 60
    ).padStart(2, 0)}`;
  }
}
