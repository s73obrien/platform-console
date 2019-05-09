/**
 * Webpack browser schema for Build Facade.
 * Browser target options
 */
export interface ConsoleBuilderOptions {
    /**
     * List of static application assets.
     */
    assets?: ConsoleBuilderOptions.Definitions.AssetPattern[];
    /**
     * The full path for the main entry point to the app, relative to the current workspace.
     */
    main: string;
    /**
     * The full path for the polyfills file, relative to the current workspace.
     */
    polyfills?: string;
    /**
     * The full path for the TypeScript configuration file, relative to the current workspace.
     */
    tsConfig: string;
    /**
     * Global scripts to be included in the build.
     */
    scripts?: ConsoleBuilderOptions.Definitions.ExtraEntryPoint[];
    /**
     * Global styles to be included in the build.
     */
    styles?: ConsoleBuilderOptions.Definitions.ExtraEntryPoint[];
    /**
     * Options to pass to style preprocessors.
     */
    stylePreprocessorOptions?: {
        /**
         * Paths to include. Paths will be resolved to project root.
         */
        includePaths?: string[];
    };
    /**
     * Enables optimization of the build output.
     */
    optimization?: {
        /**
         * Enables optimization of the scripts output.
         */
        scripts?: boolean;
        /**
         * Enables optimization of the styles output.
         */
        styles?: boolean;
    } | boolean;
    /**
     * Replace files with other files in the build.
     */
    fileReplacements?: ConsoleBuilderOptions.Definitions.FileReplacement[];
    /**
     * The full path for the new output directory, relative to the current workspace.
     * 
     * By default, writes output to a folder named dist/ in the current project.
     */
    outputPath: string;
    /**
     * The path where style resources will be placed, relative to outputPath.
     */
    resourcesOutputPath?: string;
    /**
     * Build using Ahead of Time compilation.
     */
    aot?: boolean;
    /**
     * Output sourcemaps.
     */
    sourceMap?: {
        /**
         * Output sourcemaps for all scripts.
         */
        scripts?: boolean;
        /**
         * Output sourcemaps for all styles.
         */
        styles?: boolean;
        /**
         * Output sourcemaps used for error reporting tools.
         */
        hidden?: boolean;
        /**
         * Resolve vendor packages sourcemaps.
         */
        vendor?: boolean;
    } | boolean;
    /**
     * Resolve vendor packages sourcemaps.
     */
    vendorSourceMap?: boolean;
    /**
     * Output in-file eval sourcemaps.
     */
    evalSourceMap?: boolean;
    /**
     * Use a separate bundle containing only vendor libraries.
     */
    vendorChunk?: boolean;
    /**
     * Use a separate bundle containing code used across multiple bundles.
     */
    commonChunk?: boolean;
    /**
     * Base url for the application being built.
     */
    baseHref?: string;
    /**
     * URL where files will be deployed.
     */
    deployUrl?: string;
    /**
     * Adds more details to output logging.
     */
    verbose?: boolean;
    /**
     * Log progress to the console while building.
     */
    progress?: boolean;
    /**
     * Localization file to use for i18n.
     */
    i18nFile?: string;
    /**
     * Format of the localization file specified with --i18n-file.
     */
    i18nFormat?: string;
    /**
     * Locale to use for i18n.
     */
    i18nLocale?: string;
    /**
     * How to handle missing translations for i18n.
     */
    i18nMissingTranslation?: string;
    /**
     * Extract css from global styles into css files instead of js ones.
     */
    extractCss?: boolean;
    /**
     * Run build when files change.
     */
    watch?: boolean;
    /**
     * Define the output filename cache-busting hashing mode.
     */
    outputHashing?: "none" | "all" | "media" | "bundles";
    /**
     * Enable and define the file watching poll time period in milliseconds.
     */
    poll?: number;
    /**
     * Delete the output path before building.
     */
    deleteOutputPath?: boolean;
    /**
     * Do not use the real path when resolving modules.
     */
    preserveSymlinks?: boolean;
    /**
     * Extract all licenses in a separate file.
     */
    extractLicenses?: boolean;
    /**
     * Show circular dependency warnings on builds.
     */
    showCircularDependencies?: boolean;
    /**
     * Enables '@angular-devkit/build-optimizer' optimizations when using the 'aot' option.
     */
    buildOptimizer?: boolean;
    /**
     * Use file name for lazy loaded chunks.
     */
    namedChunks?: boolean;
    /**
     * Enables the use of subresource integrity validation.
     */
    subresourceIntegrity?: boolean;
    /**
     * Generates a service worker config for production builds.
     */
    serviceWorker?: boolean;
    /**
     * Path to ngsw-config.json.
     */
    ngswConfigPath?: string;
    /**
     * Flag to prevent building an app shell.
     */
    skipAppShell?: boolean;
    /**
     * The name of the index HTML file.
     */
    index: string;
    /**
     * Generates a 'stats.json' file which can be analyzed using tools such as 'webpack-bundle-analyzer'.
     */
    statsJson?: boolean;
    /**
     * Run the TypeScript type checker in a forked process.
     */
    forkTypeChecker?: boolean;
    /**
     * List of additional NgModule files that will be lazy loaded. Lazy router modules will be discovered automatically.
     */
    lazyModules?: string[];
    /**
     * Budget thresholds to ensure parts of your application stay within boundaries which you set.
     */
    budgets?: ConsoleBuilderOptions.Definitions.Budget[];
    /**
     * Output profile events for Chrome profiler.
     */
    profile?: boolean;
    /**
     * Enables conditionally loaded ES2015 polyfills.
     */
    es5BrowserSupport?: boolean;
    /**
     * Change root relative URLs in stylesheets to include base HREF and deploy URL. Use only for compatibility and transition. The behavior of this option is non-standard and will be removed in the next major release.
     */
    rebaseRootRelativeCssUrls?: boolean;
    /**
     * TypeScript configuration for Web Worker modules.
     */
    webWorkerTsConfig?: string;
}
export namespace ConsoleBuilderOptions {
    export namespace Definitions {
        export type AssetPattern = {
            /**
             * The pattern to match.
             */
            glob: string;
            /**
             * The input directory path in which to apply 'glob'. Defaults to the project root.
             */
            input: string;
            /**
             * An array of globs to ignore.
             */
            ignore?: string[];
            /**
             * Absolute path within the output.
             */
            output: string;
        } | string;
        export interface Budget {
            /**
             * The type of budget.
             */
            type: "all" | "allScript" | "any" | "anyScript" | "bundle" | "initial";
            /**
             * The name of the bundle.
             */
            name?: string;
            /**
             * The baseline size for comparison.
             */
            baseline?: string;
            /**
             * The maximum threshold for warning relative to the baseline.
             */
            maximumWarning?: string;
            /**
             * The maximum threshold for error relative to the baseline.
             */
            maximumError?: string;
            /**
             * The minimum threshold for warning relative to the baseline.
             */
            minimumWarning?: string;
            /**
             * The minimum threshold for error relative to the baseline.
             */
            minimumError?: string;
            /**
             * The threshold for warning relative to the baseline (min & max).
             */
            warning?: string;
            /**
             * The threshold for error relative to the baseline (min & max).
             */
            error?: string;
        }
        export type ExtraEntryPoint = {
            /**
             * The file to include.
             */
            input: string;
            /**
             * The bundle name for this extra entry point.
             */
            bundleName?: string;
            /**
             * If the bundle will be lazy loaded.
             */
            lazy?: boolean;
        } | string;
        export type FileReplacement = {
            src: string;
            replaceWith: string;
        } | {
            replace: string;
            with: string;
        };
    }
}
