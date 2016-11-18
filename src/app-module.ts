
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SoundsApp } from './components/sounds-app/sounds-app';

import { SoundService } from './providers/sound-service/sound-service';

@NgModule({
    bootstrap: [SoundsApp],
    declarations: [
        SoundsApp,
    ],
    imports: [
        BrowserModule,
    ],
    providers: [
        SoundService,
    ],
})
export class AppModule {}
