import { ConsoleModule } from '../../platform_console';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChildComponent } from './child.component';

@NgModule({
  declarations: [
    AppComponent,
    ChildComponent
  ],
  imports: [
    ConsoleModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
