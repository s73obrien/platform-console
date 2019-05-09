import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode, CompilerFactory, COMPILER_OPTIONS } from '@angular/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { platformDynamicServer, platformServer } from '@angular/platform-server';

if (environment.production) {
  enableProdMode();
}

platformDynamicServer().bootstrapModule(AppModule)
  .catch(err => console.error(err));
