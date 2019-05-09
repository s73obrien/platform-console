/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BuilderContext } from '../../../architect/src';
import {
  experimental,
  getSystemPath,
  logging,
  normalize,
  resolve,
  schema,
  virtualFs,
} from '@angular-devkit/core';
import { NodeJsSyncHost } from '@angular-devkit/core/node';
import * as fs from 'fs';
import * as path from 'path';
import * as webpack from 'webpack';
import { WebpackConfigOptions } from '../angular-cli-files/models/build-options';
import { getEsVersionForFileName } from '../angular-cli-files/models/webpack-configs';
import { readTsconfig } from '../angular-cli-files/utilities/read-tsconfig';
import { Schema as BrowserBuilderSchema } from '../browser/schema';
import { NormalizedBrowserBuilderSchema, defaultProgress, normalizeBrowserSchema } from '../utils';
import { isDifferentialLoadingNeeded } from './differential-loading';

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const webpackMerge = require('webpack-merge');

type BrowserWebpackConfigOptions = WebpackConfigOptions<NormalizedBrowserBuilderSchema>;

export async function generateWebpackConfig(
  context: BuilderContext,
  workspaceRoot: string,
  projectRoot: string,
  sourceRoot: string | undefined,
  options: NormalizedBrowserBuilderSchema,
  webpackPartialGenerator: (wco: BrowserWebpackConfigOptions) => webpack.Configuration[],
  logger: logging.LoggerApi,
): Promise<webpack.Configuration[]> {
  // Ensure Build Optimizer is only used with AOT.
  if (options.buildOptimizer && !options.aot) {
    throw new Error(`The 'buildOptimizer' option cannot be used without 'aot'.`);
  }

  const tsConfigPath = path.resolve(workspaceRoot, options.tsConfig);
  const tsConfig = readTsconfig(tsConfigPath);

  // tslint:disable-next-line:no-implicit-dependencies
  const ts = await import('typescript');

  // At the moment, only the browser builder supports differential loading
  // However this config generation is used by multiple builders such as dev-server
  const scriptTarget = tsConfig.options.target;
  const differentialLoading = context.builder.builderName === 'browser'
    && isDifferentialLoadingNeeded(projectRoot, scriptTarget) && !options.watch;

  const scriptTargets = [scriptTarget];

  if (differentialLoading) {
    scriptTargets.unshift(ts.ScriptTarget.ES5);
  }

  // For differential loading, we can have several targets
  return scriptTargets.map(scriptTarget => {
    let buildOptions: NormalizedBrowserBuilderSchema = { ...options };
    if (differentialLoading) {
      // For differential loading, the builder needs to created the index.html by itself
      // without using a webpack plugin.
      buildOptions = {
        ...options,
        es5BrowserSupport: undefined,
        index: '',
        esVersionInFileName: true,
        scriptTargetOverride: scriptTarget,
      };
    }

    const supportES2015
      = scriptTarget !== ts.ScriptTarget.ES3 && scriptTarget !== ts.ScriptTarget.ES5;

    const wco: BrowserWebpackConfigOptions = {
      root: workspaceRoot,
      logger: logger.createChild('webpackConfigOptions'),
      projectRoot,
      sourceRoot,
      buildOptions,
      tsConfig,
      tsConfigPath,
      supportES2015,
    };

    wco.buildOptions.progress = defaultProgress(wco.buildOptions.progress);

    const partials = webpackPartialGenerator(wco);
    const webpackConfig = webpackMerge(partials) as webpack.Configuration;

    if (supportES2015) {
      if (!webpackConfig.resolve) {
        webpackConfig.resolve = {};
      }
      if (!webpackConfig.resolve.alias) {
        webpackConfig.resolve.alias = {};
      }
      webpackConfig.resolve.alias['zone.js/dist/zone'] = 'zone.js/dist/zone-evergreen';
    }

    if (options.profile || process.env['NG_BUILD_PROFILING']) {
      const esVersionInFileName = getEsVersionForFileName(
        wco.buildOptions.scriptTargetOverride,
        wco.buildOptions.esVersionInFileName,
      );

      const smp = new SpeedMeasurePlugin({
        outputFormat: 'json',
        outputTarget: path.resolve(
          workspaceRoot,
          `speed-measure-plugin${esVersionInFileName}.json`,
        ),
      });

      return smp.wrap(webpackConfig);
    }

    return webpackConfig;
  });
}


export async function generateBrowserWebpackConfigFromWorkspace(
  options: BrowserBuilderSchema,
  context: BuilderContext,
  projectName: string,
  workspace: experimental.workspace.Workspace,
  host: virtualFs.Host<fs.Stats>,
  webpackPartialGenerator: (wco: BrowserWebpackConfigOptions) => webpack.Configuration[],
  logger: logging.LoggerApi,
): Promise<webpack.Configuration[]> {
  // TODO: Use a better interface for workspace access.
  const projectRoot = resolve(workspace.root, normalize(workspace.getProject(projectName).root));
  const projectSourceRoot = workspace.getProject(projectName).sourceRoot;
  const sourceRoot = projectSourceRoot
    ? resolve(workspace.root, normalize(projectSourceRoot))
    : undefined;

  const normalizedOptions = normalizeBrowserSchema(
    host,
    workspace.root,
    projectRoot,
    sourceRoot,
    options,
  );

  return generateWebpackConfig(
    context,
    getSystemPath(workspace.root),
    getSystemPath(projectRoot),
    sourceRoot && getSystemPath(sourceRoot),
    normalizedOptions,
    webpackPartialGenerator,
    logger,
  );
}


export async function generateBrowserWebpackConfigFromContext(
  options: BrowserBuilderSchema,
  context: BuilderContext,
  webpackPartialGenerator: (wco: BrowserWebpackConfigOptions) => webpack.Configuration[],
  host: virtualFs.Host<fs.Stats> = new NodeJsSyncHost(),
): Promise<{ workspace: experimental.workspace.Workspace, config: webpack.Configuration[] }> {
  const registry = new schema.CoreSchemaRegistry();
  registry.addPostTransform(schema.transforms.addUndefinedDefaults);

  const workspace = await experimental.workspace.Workspace.fromPath(
    host,
    normalize(context.workspaceRoot),
    registry,
  );

  const projectName = context.target ? context.target.project : workspace.getDefaultProjectName();

  if (!projectName) {
    throw new Error('Must either have a target from the context or a default project.');
  }

  const config = await generateBrowserWebpackConfigFromWorkspace(
    options,
    context,
    projectName,
    workspace,
    host,
    webpackPartialGenerator,
    context.logger,
  );

  return { workspace, config };
}
