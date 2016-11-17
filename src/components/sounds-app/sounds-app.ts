
import { Component } from '@angular/core';

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
            this.playPauseTitle = PLAY;
        } else {
            this._playing = true;
            this.playPauseTitle = PAUSE;
        }
    }

    private _playing = false;
}
