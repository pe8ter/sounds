
import { Component } from '@angular/core';

import { SoundService } from '../../providers/sound-service/sound-service';

const PLAY = 'Play';
const PAUSE = 'Pause';

@Component({
    moduleId: module.id,
    selector: 'sounds-app',
    styleUrls: ['sounds-app.css'],
    templateUrl: 'sounds-app.html',
})
export class SoundsApp {

    public playPauseTitle = PLAY;

    public onToneTypeSelect(type: string) {
        this._toneType = type;
    }

    public onPlayPauseClick(): void {
        if (this._playing) {
            this._playing = false;
            this._sound.stop();
            this.playPauseTitle = PLAY;
        } else {
            this._playing = true;
            this._sound.play(this._toneType);
            this.playPauseTitle = PAUSE;
        }
    }

    constructor(private _sound: SoundService) {}

    private _playing = false;

    private _toneType = 'sine';
}
