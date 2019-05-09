import {
  StaticProvider,
  PlatformRef,
  createPlatformFactory,
  platformCore,
  PLATFORM_ID,
  PLATFORM_INITIALIZER,
  ApplicationInitStatus,
  ErrorHandler,
  RendererFactory2,
  APP_INITIALIZER,
  NgZone,
  NgModule,
  ApplicationModule,
  Optional,
  SkipSelf,
  Inject,
  ɵAPP_ROOT as APP_ROOT,
  CompilerFactory,
  Compiler,
  CompilerOptions,
  COMPILER_OPTIONS,
  Sanitizer,
  SecurityContext,
  Injectable,
} from '@angular/core';

import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import { PlatformLocation, DOCUMENT, CommonModule } from '@angular/common';

import { ConsoleRendererFactory, setUpRenderFlushing } from './console-renderer';

export const PLATFORM_CONSOLE_ID = 'console';

export const INTERNAL_CONSOLE_PLATFORM_PROVIDERS: StaticProvider[] = [
  { provide: PLATFORM_ID, useValue: PLATFORM_CONSOLE_ID },
  {provide: COMPILER_OPTIONS, useValue: {
    useJit: false
  }, multi: true},
  {provide: CompilerFactory, useClass: JitCompilerFactory, deps: [COMPILER_OPTIONS]},  // { provide: PLATFORM_INITIALIZER, multi: true, useValue: },
  { provide: DOCUMENT, useFactory: getDocument, deps: [] }
]

export const platformConsole: (extraProviders?: StaticProvider[]) => PlatformRef =
  createPlatformFactory(platformCore, 'console', INTERNAL_CONSOLE_PLATFORM_PROVIDERS);

export function getDocument(): any {
  return document;
}

export function getErrorHandler(): ErrorHandler {
  return new ErrorHandler();
}

@Injectable()
export class ConsoleSanitizer implements Sanitizer {
  sanitize(context: SecurityContext, value: string | {} | null): string | null {
    if (typeof value === 'string') {
      return value;
    } else {
      let v: string;
      try {
        v = JSON.stringify(value);
      } catch (error) {
        return null;
      }
      return v;
    }
  }
}

export const CONSOLE_MODULE_PROVIDERS: StaticProvider[] = [
  { provide: Sanitizer, useClass: ConsoleSanitizer, deps: [] },
  { provide: APP_ROOT, useValue: true },
  { provide: ErrorHandler, useFactory: getErrorHandler, deps: [] },
  { provide: RendererFactory2, useClass: ConsoleRendererFactory, deps: [] },
  {
    provide: APP_INITIALIZER,
    multi: true,
    useFactory: setUpRenderFlushing,
    deps: [NgZone, RendererFactory2]
  }
];

@NgModule({
  providers: CONSOLE_MODULE_PROVIDERS,
  exports: [
    ApplicationModule
  ]
  // imports: [ServerModule],
  // exports: [ServerModule]
})
export class ConsoleModule {
  constructor(@Optional() @SkipSelf() @Inject(ConsoleModule) parentModule: ConsoleModule | null) {
    if (parentModule) {
      throw new Error(
        `ConsoleModule has already been loaded.`
      );
    }
  }
}