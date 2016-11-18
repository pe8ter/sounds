
import { Injectable } from '@angular/core';

// declare function webkitAudioContext();

@Injectable()
export class SoundService {

    public play(): void {
        this._oscillator = this._ctx.createOscillator();
        this._oscillator.connect(this._ctx.destination);
        this._oscillator.start();
    }

    public stop(): void {
        this._oscillator.stop();
    }

    constructor() {

        let audioContextConstructor: any;

        /* tslint:disable:no-string-literal */
        if (window['AudioContext']) {
            audioContextConstructor = window['AudioContext'];
        } else {
            audioContextConstructor = window['webkitAudioContext'];
        }
        /* tslint:enable:no-string-literal */

        this._ctx = new audioContextConstructor();
    }

    private _ctx: AudioContext;

    private _oscillator: OscillatorNode;
}
