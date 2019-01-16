let song;
let dom_player_slider;
let dom_player_current;
let dom_player_duration;
let dom_volume_slider;
let currentSong;
export class AudioPlayer {
    constructor(dom) {
        this.Songs = [
            "Bad_Habit_Terrasound.mp3",
            "Dark_Blue_Echoes.mp3",
        ];
        song = new Audio();
        song.addEventListener('loadedmetadata', () => {
            this.showDuration();
        });
        this.dom_root = dom;
        this.dom = document.createElement('div');
        this.dom.classList.add('AudioPlayer_Container');
        this.dom_root.appendChild(this.dom);
        this.dom_logoDiv = document.createElement('div');
        this.dom_logoDiv.classList.add('AudioPlayer_LogoDiv');
        this.dom.appendChild(this.dom_logoDiv);
        this.dom_logoImage = document.createElement("img");
        this.dom_logoImage.classList.add("AudioPlayer_LogoImage");
        this.dom_logoImage.src = "./Images/audio_player_logo.png";
        this.dom_logoDiv.appendChild(this.dom_logoImage);
        this.dom_player = document.createElement('div');
        this.dom_player.classList.add('AudioPlayer_Player');
        this.dom.appendChild(this.dom_player);
        this.dom_player_songTitle = document.createElement('div');
        this.dom_player_songTitle.classList.add('AudioPlayer_SongTitle');
        this.dom_player.appendChild(this.dom_player_songTitle);
        this.dom_player_songTitle.textContent = "My song title will go in here";
        dom_player_slider = document.createElement('input');
        dom_player_slider.classList.add('AudioPlayer_Slider');
        this.dom_player.appendChild(dom_player_slider);
        dom_player_slider.setAttribute("type", "range");
        dom_player_slider.setAttribute("min", "0");
        dom_player_slider.setAttribute("step", "1");
        dom_player_slider.value = "0";
        dom_player_slider.addEventListener("change", () => {
            this.seekSong();
        });
        this.dom_player_currentanddurationContainer = document.createElement('div');
        this.dom_player_currentanddurationContainer.classList.add('AudioPlayer_DurationAndCurrentContainer');
        this.dom_player.appendChild(this.dom_player_currentanddurationContainer);
        dom_player_current = document.createElement('div');
        dom_player_current.classList.add('AudioPlayer_Current');
        this.dom_player_currentanddurationContainer.appendChild(dom_player_current);
        dom_player_current.textContent = "00:00";
        dom_player_duration = document.createElement('div');
        dom_player_duration.classList.add('AudioPlayer_Duration');
        this.dom_player_currentanddurationContainer.appendChild(dom_player_duration);
        dom_player_duration.textContent = "00:00";
        this.dom_player_controllers = document.createElement('div');
        this.dom_player_controllers.classList.add('AudioPlayer_ControllersContainer');
        this.dom_player.appendChild(this.dom_player_controllers);
        this.dom_previous = document.createElement("img");
        this.dom_previous.classList.add("AudioPlayer_Previous");
        this.dom_previous.src = "./Images/previous.png";
        this.dom_player_controllers.appendChild(this.dom_previous);
        this.dom_previous.style.width = "30px";
        this.dom_previous.addEventListener('click', () => {
            this.previous();
        });
        this.dom_backward = document.createElement("img");
        this.dom_backward.classList.add("AudioPlayer_Backward");
        this.dom_backward.src = "./Images/backward.png";
        this.dom_player_controllers.appendChild(this.dom_backward);
        this.dom_backward.style.width = "30px";
        this.dom_backward.addEventListener('click', () => {
            this.backward();
        });
        this.dom_play = document.createElement("img");
        this.dom_play.classList.add("AudioPlayer_Play");
        this.dom_play.src = "./Images/play.png";
        this.dom_player_controllers.appendChild(this.dom_play);
        this.dom_play.style.width = "60px";
        this.dom_play.addEventListener('click', () => {
            this.playorpauseSong();
        });
        // this.dom_play.addEventListener('mouseover', () => {
        //     this.dom_play.style.width = "65px";
        // });
        // this.dom_play.addEventListener('mouseleave', () => {
        //     this.dom_play.style.width = "60px";
        // });
        this.dom_forward = document.createElement("img");
        this.dom_forward.classList.add("AudioPlayer_Forward");
        this.dom_forward.src = "./Images/forward.png";
        this.dom_player_controllers.appendChild(this.dom_forward);
        this.dom_forward.style.width = "30px";
        this.dom_forward.addEventListener('click', () => {
            this.forward();
        });
        this.dom_next = document.createElement("img");
        this.dom_next.classList.add("AudioPlayer_Next");
        this.dom_next.src = "./Images/next.png";
        this.dom_player_controllers.appendChild(this.dom_next);
        this.dom_next.style.width = "30px";
        this.dom_next.addEventListener('click', () => {
            this.next();
        });
        this.dom_volume_down = document.createElement("img");
        this.dom_volume_down.classList.add("AudioPlayer_Volume_Down");
        this.dom_volume_down.src = "./Images/volume_down.png";
        this.dom_player_controllers.appendChild(this.dom_volume_down);
        this.dom_volume_down.style.width = "17px";
        this.dom_volume_down.addEventListener('click', () => {
        });
        dom_volume_slider = document.createElement("input");
        dom_volume_slider.classList.add("AudioPlayer_VolumeSlider");
        dom_volume_slider.setAttribute("type", "range");
        dom_volume_slider.setAttribute("min", "0");
        dom_volume_slider.setAttribute("max", "1");
        dom_volume_slider.setAttribute("step", "0.05");
        this.dom_player_controllers.appendChild(dom_volume_slider);
        dom_volume_slider.addEventListener('change', () => {
            this.adjustVolume();
        });
        this.dom_volume_up = document.createElement("img");
        this.dom_volume_up.classList.add("AudioPlayer_Volume_Up");
        this.dom_volume_up.src = "./Images/volume_up.png";
        this.dom_player_controllers.appendChild(this.dom_volume_up);
        this.dom_volume_up.style.width = "20px";
        this.dom_volume_up.addEventListener('click', () => {
        });
        this.dom_nextSong = document.createElement('div');
        this.dom_nextSong.classList.add('AudioPlayer_NextSong');
        this.dom_player_controllers.appendChild(this.dom_nextSong);
        this.dom_nextSong.textContent = "Next Song: Next song will go in here...";
        this.loadSong(0);
    }
    loadSong(playSongNumber) {
        currentSong = playSongNumber;
        song.src = "./Songs/" + this.Songs[currentSong];
        this.dom_player_songTitle.textContent = currentSong + 1 + ". " + this.Songs[currentSong];
        this.dom_nextSong.textContent = "Next Song: " + this.Songs[(currentSong + 1) % this.Songs.length];
        song.volume = dom_volume_slider.valueAsNumber;
        setInterval(this.updateSongSlider, 100);
    }
    updateSongSlider() {
        let c = Math.round(song.currentTime);
        dom_player_slider.value = c.toString();
        dom_player_current.textContent = AudioPlayer.convertTime(c);
    }
    static convertTime(secs) {
        let min = Math.floor(secs / 60).toString();
        let sec = (secs % 60).toString();
        min = (+min < 10) ? "0" + min : min;
        sec = (+sec < 10) ? "0" + sec : sec;
        return (min + ":" + sec);
    }
    showDuration() {
        let d = Math.floor(song.duration);
        //console.log(d);
        dom_player_slider.setAttribute("max", d.toString());
        dom_player_duration.textContent = AudioPlayer.convertTime(d);
    }
    playorpauseSong() {
        if (song.paused) {
            song.play();
            this.dom_play.src = "./Images/pause.png";
        }
        else {
            song.pause();
            this.dom_play.src = "./Images/play.png";
        }
    }
    next() {
        currentSong = (currentSong + 1) % this.Songs.length;
        this.loadSong(currentSong);
        song.play();
    }
    previous() {
        currentSong--;
        if (currentSong < 0) {
            currentSong = this.Songs.length - 1;
        }
        this.loadSong(currentSong);
        song.play();
    }
    forward() {
        song.currentTime = song.currentTime + 10;
    }
    backward() {
        song.currentTime = song.currentTime - 10;
    }
    seekSong() {
        song.currentTime = dom_player_slider.value;
        dom_player_current.textContent = AudioPlayer.convertTime(song.currentTime);
    }
    adjustVolume() {
        song.volume = dom_volume_slider.value;
        if (song.volume === 0) {
            this.dom_volume_down.src = "./Images/volume_silent.png";
        }
        else
            this.dom_volume_down.src = "./Images/volume_down.png";
    }
    close() {
        this.dom_root.remove();
    }
}
//# sourceMappingURL=AudioPlayer.js.map