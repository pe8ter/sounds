
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

    public onPlayPauseClick(): void {
        if (this._playing) {
            this._playing = false;
            this._sound.stop();
            this.playPauseTitle = PLAY;
        } else {
            this._playing = true;
            this._sound.play();
            this.playPauseTitle = PAUSE;
        }
    }

    constructor(private _sound: SoundService) {}

    private _playing = false;
}
