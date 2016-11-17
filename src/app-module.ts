
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SoundsApp } from './components/sounds-app/sounds-app';

@NgModule({
    bootstrap: [SoundsApp],
    declarations: [
        SoundsApp,
    ],
    imports: [
        BrowserModule,
    ],
})
export class AppModule {}
