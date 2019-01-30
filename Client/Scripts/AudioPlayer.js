let dom_player_slider;
let dom_player_current;
let dom_player_duration;
let dom_volume_slider;
let curSong = new Audio();
/**
 * @class AudioPlayer
 * erstellt den AudioPlayer, mit welchem Musik abgespielt werden kann
 */
export class AudioPlayer {
    /**
     * @constructor
     * Erzeugt und appended alle DOM elemente, die zum AudioPlayer gehören
     * @param {HTMLElement} dom - An dieser Stelle im DOM soll der Audioplayer appended werden
     * @param Songs - Dieser Array enthält alle Songs der aufgerufenen Playlist, welche den Audioplayer erzeugt hat
     * @param songclicked - dieser Parameter gibt an auf welchen Song in der Playlist geklickt wurde.
     */
    constructor(dom, Songs) {
        this.API_URL = 'http://localhost:3000';
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
        this.dom_player_songTitle.textContent = "Song Title goes in here... if you click on a Playlist";
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
        curSong.addEventListener("ended", () => {
            this.clicked = (this.clicked + 1) % this.songs.length;
            this.loadSong(this.clicked);
            this.playorpauseSong();
        });
    }
    /**
     * @function loadsong()
     * weist der Source des Audioobjekts die Route des Servers zu, auf welcher der Song gestreamt wird.
     * @param clicked - Der Index des Songs der aus this.songs gespielt werden soll
     */
    loadSong(clicked) {
        // console.log("song = ", curSong);
        // console.log("song.id: ", this.songs[this.clicked].ID);
        // console.log("song element: ", this.songs[this.clicked]);
        // console.log("Title: ", this.songs[this.clicked].TITLE);
        this.clicked = clicked;
        try {
            curSong.src = this.API_URL + '/song/' + this.songs[this.clicked].ID;
        }
        catch (err) {
            alert("Failed to load song");
            console.log(err);
        }
        this.dom_player_songTitle.textContent = this.songs[this.clicked].TITLE;
        this.dom_player_songTitle.style.fontWeight = "bold";
        this.dom_nextSong.textContent = "Next song: " + this.songs[(this.clicked + 1) % this.songs.length].TITLE;
        this.dom_nextSong.style.fontWeight = "bold";
        curSong.addEventListener('loadedmetadata', () => {
            this.showDuration();
        });
        setInterval(this.updateSongSlider, 100);
    }
    // Ich hätte die Songs gerne über fetch geholt jedoch konnte ich in der kurzen Zeit leider nicht richtig verstehen
    // wie das fetchen mit einem ReadableStream funktioniert, welcher vom Server geliefert wird.
    //
    // private async fetchSong(clicked) {
    //     try {
    //         let response = await fetch(this.API_URL + "/song/" + this.songs[clicked].ID, {
    //             cache: 'no-cache',
    //             headers: {
    //                 // 'content-type': 'application/octet-stream',
    //                 'content-type': 'audio/mpeg',
    //                 // 'content-disposition': 'inline',
    //                 'crossDomain': 'true',
    //                 'Authorization': localStorage.getItem("token")
    //             },
    //             method: 'GET',
    //             mode: 'cors',
    //         });
    //
    //         const data = await response;
    //
    //         return data;
    //     } catch (err) {
    //         console.log("Error fetching Mates!: ", err);
    //     }
    // }
    /**
     * @function updateSongSlider()
     * zeigt den Abspielprozess an, also die currentTime des Audioobjekts wird gerundet und
     * auf dem Slider angezeigt.
     */
    updateSongSlider() {
        let c = Math.round(curSong.currentTime);
        dom_player_slider.value = c.toString();
        dom_player_current.textContent = AudioPlayer.convertTime(c);
    }
    /**
     * @function convertTime()
     * da die duration, currentTime etc nur in Sekunden abgerufen werden kann, wird mit dieser Methode eine
     * Stunden, Minuten und Sekunden Ausgabe erzeugt.
     * @param time - Eingabe der Sekunden zum konvertieren
     * @return - im Format "1:01" or "4:03:59" or "123:03:59" wird das result zurückgeliefert
     */
    static convertTime(time) {
        const hrs = ~~(time / 3600);
        const mins = ~~((time % 3600) / 60);
        const secs = ~~time % 60;
        let ret = "";
        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }
        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }
    /**
     * @function showDuration
     * rundet zu erst die Duration des Audioobjekts und konvertiert sie danach mit Hilfe der convertTime Funktion
     */
    showDuration() {
        //console.log("das ist die angegebene song duration: ", curSong.duration);
        let d = Math.floor(curSong.duration);
        console.log(d);
        dom_player_slider.setAttribute("max", d.toString());
        dom_player_duration.textContent = AudioPlayer.convertTime(d);
    }
    /**
     * @function playorpauseSong()
     * spielt ein pausiertes Audioobjekt ab beziehungsweise pausiert ein momentan gespieltes Audioobjekt
     */
    playorpauseSong() {
        if (curSong.paused) {
            curSong.play();
            this.dom_play.src = "./Images/pause.png";
        }
        else {
            curSong.pause();
            this.dom_play.src = "./Images/play.png";
        }
    }
    /**
     * @function next()
     * spielt den nächsten Titel in der Reihenfolge der Playlist ab
     */
    next() {
        this.clicked = (this.clicked + 1) % this.songs.length;
        this.loadSong(this.clicked);
        this.playorpauseSong();
    }
    /**
     * @function previous()
     * spielt den vorherigen Titel in der Reihenfolge der Playlist ab
     */
    previous() {
        this.clicked--;
        if (this.clicked < 0) {
            this.clicked = this.songs.length - 1;
        }
        this.loadSong(this.clicked);
        this.playorpauseSong();
    }
    /**
     * @function forward()
     * springt im Song zehn Sekunden nach vorne
     */
    forward() {
        curSong.currentTime = curSong.currentTime + 10;
    }
    /**
     * @function forward()
     * springt im Song zehn Sekunden zurück
     */
    backward() {
        curSong.currentTime = curSong.currentTime - 10;
    }
    /**
     * @function seekSong()
     * ermöglicht es mit dem Slider durch den Song zu springen zu einer beliebigen Stelle
     */
    seekSong() {
        curSong.currentTime = dom_player_slider.valueAsNumber;
        dom_player_current.textContent = AudioPlayer.convertTime(curSong.currentTime);
    }
    /**
     *@function adjustVolume()
     * ermöglicht es die Lautstärke des abgespielten Audioobjekts anzupassen.
     * Ist die Lautstärke lautlos so ändert sich das entsprechende Symbol zur Lautstärkeanzeige
     */
    adjustVolume() {
        curSong.volume = dom_volume_slider.valueAsNumber;
        if (curSong.volume === 0) {
            this.dom_volume_down.src = "./Images/volume_silent.png";
        }
        else
            this.dom_volume_down.src = "./Images/volume_down.png";
    }
    /**
     * @function close()
     * Entfernt den Content bzw die einzelnen Dom Elemente werden removed
     *
     */
    close() {
        console.log(this.dom_root);
        while (this.dom_root.childNodes.length > 4) {
            this.dom_root.removeChild(this.dom_root.lastChild);
        }
    }
}
//# sourceMappingURL=AudioPlayer.js.map