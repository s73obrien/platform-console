/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  BuilderContext,
  createBuilder,
  targetFromTargetString,
} from '@angular-devkit/architect';
import { runWebpack } from '@angular-devkit/build-webpack';
import { JsonObject } from '@angular-devkit/core';
import * as path from 'path';
import * as webpack from 'webpack';
import {
  getAotConfig,
  getCommonConfig,
  getStatsConfig,
  getStylesConfig,
} from '../angular-cli-files/models/webpack-configs';
import { Schema as BrowserBuilderOptions } from '../browser/schema';
import { Version } from '../utils/version';
import { generateBrowserWebpackConfigFromContext } from '../utils/webpack-browser-config';
import { Schema as ExtractI18nBuilderOptions } from './schema';

function getI18nOutfile(format: string | undefined) {
  switch (format) {
    case 'xmb':
      return 'messages.xmb';
    case 'xlf':
    case 'xlif':
    case 'xliff':
    case 'xlf2':
    case 'xliff2':
      return 'messages.xlf';
    default:
      throw new Error(`Unsupported format "${format}"`);
  }
}

class InMemoryOutputPlugin {
  apply(compiler: webpack.Compiler): void {
    // tslint:disable-next-line:no-any
    compiler.outputFileSystem = new (webpack as any).MemoryOutputFileSystem();
  }
}

async function execute(options: ExtractI18nBuilderOptions, context: BuilderContext) {
  // Check Angular version.
  Version.assertCompatibleAngularVersion(context.workspaceRoot);

  const browserTarget = targetFromTargetString(options.browserTarget);
  const browserOptions = await context.validateOptions<JsonObject & BrowserBuilderOptions>(
    await context.getTargetOptions(browserTarget),
    await context.getBuilderNameForTarget(browserTarget),
  );

  // We need to determine the outFile name so that AngularCompiler can retrieve it.
  let outFile = options.outFile || getI18nOutfile(options.i18nFormat);
  if (options.outputPath) {
    // AngularCompilerPlugin doesn't support genDir so we have to adjust outFile instead.
    outFile = path.join(options.outputPath, outFile);
  }

  const { config } = await generateBrowserWebpackConfigFromContext(
    {
      ...browserOptions,
      optimization: {
        scripts: false,
        styles: false,
      },
      i18nLocale: options.i18nLocale,
      i18nFormat: options.i18nFormat,
      i18nFile: outFile,
      aot: true,
      progress: options.progress,
      assets: [],
      scripts: [],
      styles: [],
      deleteOutputPath: false,
    },
    context,
    wco => [
      { plugins: [new InMemoryOutputPlugin()] },
      getCommonConfig(wco),
      getAotConfig(wco, true),
      getStylesConfig(wco),
      getStatsConfig(wco),
    ],
  );

  return runWebpack(config[0], context).toPromise();
}

export default createBuilder<JsonObject & ExtractI18nBuilderOptions>(execute);
