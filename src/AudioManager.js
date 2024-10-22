let audioContext;
let music;
let musicPlaying = false;
let isResuming = false;

const AudioManager = {
    k: null,

    init(k) {
        this.k = k;
    },

    resumeAudio() {
        if (!musicPlaying && isResuming) {
            musicPlaying = true;
            music = this.k.play("walkman", {
                volume: 0.2,
                loop: true,
                paused: false
            });
        }
        if (musicPlaying || isResuming) return;

        if (!audioContext) {
            audioContext = new AudioContext();
        }
        isResuming = true;

        audioContext.resume().then(() => {
            musicPlaying = true;
            console.log("AudioContext resumed.");
            music = this.k.play("walkman", {
                volume: 0.2,
                loop: true,
                paused: false
            });
        }).catch(error => {
            isResuming = false;
            console.error("Failed to resume audio:", error);
        });
    },

    pauseMusic() {
        if (music && !music.paused) {
            music.paused = true;
        }
    },
    
   playMusic() {
        if (musicPlaying) {
            if (music && music.paused) {
                music.paused = false;
            }
        } else {
            setTimeout(() => {
                this.resumeAudio();
            }, 300);
        }
    }
};

export default AudioManager;