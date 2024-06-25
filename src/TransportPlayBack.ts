import * as Tone from "tone";

//Todo limit possible playbackrate to what tonejs can handle (*0.5 to *2 ?)

/**
 * A handmade singleton over Tonejs transport's, to allow for time manipulation of it with a playback parameter. NOT MADE TO SCHEDULE THINGS (would require tinkering with the bpm parameter. OR better, changing the way Tone unit is handled by dividing it by 2 to be consistent with how time is used.)
 */
class TransportPlayback {
    playback_rate = 1;
    // offset_from_start = 0;
    readonly transport = Tone.getTransport();

    constructor(playback_rate?: number) {
        if (playback_rate !== undefined) {
            this.playback_rate = playback_rate;
        }
    }

    //Methods to implement : start, stop, seconds
    start(time?: Tone.Unit.Time, offset?: number): void {
        this.transport.start(time, offset === undefined ? undefined : offset / this.playback_rate);
    }

    pause(time?: Tone.Unit.Time): void {
        this.transport.pause(time);
    }

    get seconds(): number {
        return this.transport.seconds * this.playback_rate;
    }

    set seconds(time: number) {
        this.transport.seconds = time / this.playback_rate;
    }
}

export { TransportPlayback };
