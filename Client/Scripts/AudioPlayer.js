// let song;
let dom_player_slider;
let dom_player_current;
let dom_player_duration;
let dom_volume_slider;
let currentSong;
let curSong = new Audio();
export class AudioPlayer {
    constructor(dom, Songs) {
        // public Songs = [
        this.API_URL = 'http://localhost:' + localStorage.getItem("port");
        this.songs = Songs;
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
        // }
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
        //this.loadSong(0);
    }
    // } else
    loadSong(clicked) {
        console.log("hallllo");
        console.log("song = ", curSong);
        console.log("JSADLFJSA: ", this.songs[clicked].ID);
        curSong.src = this.API_URL + '/song/' + this.songs[clicked].ID;
        // song.src();
        console.log("ID = ", this.songs[clicked].ID);
        // song(this.API_URL + '/song/' + this.songs[clicked].ID);
        curSong.addEventListener('loadedmetadata', () => {
            this.showDuration();
        });
        curSong.play();
        this.dom_play.src = "./Images/pause.png";
        setInterval(this.updateSongSlider, 100);
        // this.fetchSong(clicked)
        //     .then( data => {
        //         console.log(data);
        //         //song.src = data.PATH;
        //     })
        //     .catch( err => {
        //         console.log(err);
        //     })
    }
    async fetchSong(clicked) {
        try {
            let response = await fetch(this.API_URL + "/song/" + this.songs[clicked].ID, {
                cache: 'no-cache',
                headers: {
                    // 'content-type': 'application/octet-stream',
                    'content-type': 'audio/mpeg',
                    // 'content-disposition': 'inline',
                    'crossDomain': 'true',
                    'Authorization': localStorage.getItem("token")
                },
                method: 'GET',
                mode: 'cors',
            });
            console.log("HDSAFJLDSA RESPONSE = ", response);
            const data = await response;
            console.log("HDSAFJLDSA RESPONSE = ", data);
            return data;
        }
        catch (err) {
            console.log("Error fetching Mates!: ", err);
        }
    }
    updateSongSlider() {
        //console.log("hallo hier curSong!: ", this.curSong);
        let c = Math.round(curSong.currentTime);
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
        let d = Math.floor(curSong.duration);
        //console.log(d);
        dom_player_slider.setAttribute("max", d.toString());
        dom_player_duration.textContent = AudioPlayer.convertTime(d);
    }
    playorpauseSong() {
        if (curSong.paused) {
            console.log("hier wurde play aufgereufen ");
            curSong.play();
            this.dom_play.src = "./Images/pause.png";
        }
        else {
            curSong.pause();
            this.dom_play.src = "./Images/play.png";
        }
    }
    next() {
        currentSong = (currentSong + 1) % this.songs.length;
        this.loadSong(currentSong);
        curSong.play();
    }
    previous() {
        currentSong--;
        if (currentSong < 0) {
            currentSong = this.songs.length - 1;
        }
        this.loadSong(currentSong);
        curSong.play();
    }
    forward() {
        curSong.currentTime = curSong.currentTime + 10;
    }
    backward() {
        curSong.currentTime = curSong.currentTime - 10;
    }
    seekSong() {
        curSong.currentTime = dom_player_slider.valueAsNumber;
        dom_player_current.textContent = AudioPlayer.convertTime(curSong.currentTime);
    }
    adjustVolume() {
        curSong.volume = dom_volume_slider.valueAsNumber;
        if (curSong.volume === 0) {
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