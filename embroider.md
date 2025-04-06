

------------------------
# embroider
------------------------
# ember-vite-codemod

Migrate your Ember app to build with Vite.

## Usage

This codemod will add, move and modify files in your Ember app to make it build with Vite. Make sure your git repository is clean before running this command so you can easily compare the changes.

In your Ember app folder, execute:

```
npx ember-vite-codemod@latest [options]
```

### options

| Option              | Default | Description                                                                                                                                                                                                                                |
| :------------------ | :-----: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --skip-git          |  false  | By default, the process exits if the git repository is not clean. Use this option to execute the command anyway at your own risk.                                                                                                          |
| --skip-v2-addon     |  false  | By default, the process exits if it detects v1 addons you could update or remove before switching to Vite. Use this option to execute the rest of the codemod anyway and discover if Embroider can deal with your v1 addons without issue. |
| --embroider-webpack |  false  | Use this option to indicate your app builds with @embroider/webpack. Essentially, the codemod will have different expectations about the content of ember-cli-build.                                                                       |
| --ts                |  false  | Use this option to indicate your app uses typescript. It will impact what files the codemod creates and the packages it installs.                                                                                                          |
| --error-trace       |  false  | In case of error, use this option to print the full error trace when it's available.                                                                                                                                                       |

## Steps

The codemod executes a sequence of several ordered tasks. At the end of the process, reinstall your dependencies; if your app follows the standards the codemod expects, it should now builds correctly using Vite. If something went wrong, the sections below detail what the codemod expectations are and what it tries to output so you can figure out how to complete the migration manually.

### Checking for unsupported dependencies

This is a verification task, it doesn't change your code.

The codemod will first check there are no known dependency that is incompatible with the way Vite works. e.g. `ember-fetch` will not work with Vite and needs to be removed.

### Checking addons are v2

This is a verification task, it doesn't change your code.

The codemod will look at all your Ember dependencies and will advise you for updates.

When you use Embroider in an app that depends on v1 addons, Embroider will try to auto-fix the v1 addons in a way that makes them compatible with Vite. This approach works for a number of known addons, but we cannot guarantee it will work for any v1 addon you use. The best way to avoid issues is that your classic app already relies only on v2 addons, and the codemod will guide you in that direction:

- If one of your addons is v1 but the latest version on npm is v2 or has become a basic package, it's recommended to update.
- If one of your addons is v1, no v2 format is available, and we don't know for sure if Embroider can rewrite it, the codemod will display a warning so you pay attention to this addon's behavior when building with Vite.
- If one of your v1 addons comes from Ember app blueprint and is no longer used in Embroider+Vite world, the codemod won't notify you about it (because it will be removed in a later step).

### Creating new required files

From this step, the codemod is done with verifications and starts modifying your code.

First, it creates new files that are now required for Embroider+Vite. These files are copied direclty from the [embroider-build/app-blueprint](https://github.com/embroider-build/app-blueprint), so you can refer to this repository to see the expected content:

- [app/config/environment.js](https://github.com/embroider-build/app-blueprint/blob/main/files-override/shared/app/config/environment.js)
- [vite.config.mjs](https://github.com/embroider-build/app-blueprint/blob/main/files-override/shared/vite.config.mjs)
- [babel.config.cjs](https://github.com/embroider-build/app-blueprint/blob/main/files/js/babel.config.cjs)

### Moving `index.html` to the root

Vite expects the `index.html` to be at the root of the app. The codemod will move your existing `app/index.html` to the root rather than creating a new file, this way it keeps all the customizations you added.

### Running code replacements on... `index.html`

When running the Vite dev server, the files `vendor.js` and `vendor.css` are no longer physical files, it's Embroider that generates their content and returns it to Vite. To let Vite identify these _virtual_ files, the URL is changed as follow:

```diff
- <link integrity="" rel="stylesheet" href="{{rootURL}}assets/vendor.css">
- <link integrity="" rel="stylesheet" href="{{rootURL}}assets/my-classic-app.css">
+ <link integrity="" rel="stylesheet" href="/@embroider/virtual/vendor.css">
+ <link integrity="" rel="stylesheet" href="/@embroider/virtual/app.css">

- <script src="{{rootURL}}assets/vendor.js"></script>
+ <script src="/@embroider/virtual/vendor.js"></script>
```

Additionaly, we no longer import an asset `my-classic-app.js`. Instead, the script that boots the app is defined directly inline as a module. If you use any v1 addon implementing a content-for "app-boot" and you want to keep its behavior, this is where the implementation should go. The default content is the following:

```diff
- <script src="{{rootURL}}assets/my-classic-app.js"></script>
+ <script type="module">
+   import Application from './app/app';
+   import environment from './app/config/environment';
+
+   Application.create(environment.APP);
+ </script>
```

### Running code replacements on... `tests/index.html`

The changes in `tests/index.html` follow the same principle as for `index.html`. Additionally, we remove `{{content-for "test-body-footer"}}` because it checks tests are loaded at a time they are not.

```diff
- <link integrity="" rel="stylesheet" href="{{rootURL}}assets/vendor.css">
- <link integrity="" rel="stylesheet" href="{{rootURL}}assets/my-classic-app.css">
- <link integrity="" rel="stylesheet" href="{{rootURL}}assets/test-support.css">
+ <link integrity="" rel="stylesheet" href="/@embroider/virtual/vendor.css">
+ <link integrity="" rel="stylesheet" href="/@embroider/virtual/app.css">
+ <link integrity="" rel="stylesheet" href="/@embroider/virtual/test-support.css">

- <script src="{{rootURL}}assets/vendor.js"></script>
- <script src="{{rootURL}}assets/test-support.js"></script>
+ <script src="/@embroider/virtual/vendor.js"></script>
+ <script src="/@embroider/virtual/test-support.js"></script>

- <script src="{{rootURL}}assets/my-classic-app.js"></script>
- <script src="{{rootURL}}assets/tests.js"></script>
+ <script type="module">
+  import { start } from './test-helper';
+   import.meta.glob("./**/*.{js,ts,gjs,gts}", { eager: true });
+   start();
+ </script>

- {{content-for "test-body-footer"}}
```

### Running code replacements on... `app/config/environment.js`

Since the file `app/config/environment.js` is created out of the app blueprint, it has a placeholder `<%= name %>` for your app name. Replace it with the correct value. The name to use can be read in `ENV.modulePrefix` in your `config/environment.js`.

### Running code replacements on... `ember-cli-build.js`

#### From a classic Ember app

Instead of building the app directly with Broccoli, we use `@embroider/compat`, a module that essentially serves as a bridge between classic apps and modern Embroider apps. The Broccoli app instance is still there, but it's passed in argument to Embroider.

Considering an empty 6.2 Ember app, the codemod does the following:

```diff
 'use strict';

  const EmberApp = require('ember-cli/lib/broccoli/ember-app');
+ const { compatBuild } = require('@embroider/compat');

  module.exports = function (defaults) {
+   const { buildOnce } = await import('@embroider/vite');
    const app = new EmberApp(defaults, {
      // Add options here
    });

-   return app.toTree();
+   return compatBuild(app, buildOnce);
  };
```

⚠️ Adding extra Broccoli trees doesn't make sense in this context. If you used to return `app.toTree(extraTree);`, the corresponding feature will no longer work.

#### From @embroider/webpack

`@embroider/compat` will now rely on `@embroider/vite` instead of `@embroider/webpack` to build the app:

```diff
 'use strict';

  const EmberApp = require('ember-cli/lib/broccoli/ember-app');
- const { Webpack } = require('@embroider/webpack');
+ const { compatBuild } = require('@embroider/compat');

  module.exports = function (defaults) {
+   const { buildOnce } = await import('@embroider/vite');
    const app = new EmberApp(defaults, {
      // Add options here
    });

-   return require('@embroider/compat').compatBuild(app, Webpack, {
+   return compatBuild(app, buildOnce, {
      ...buildOptions,
-     skipBabel: [{
-       package: 'qunit'
-     }]
    });
  };
```

All your build options will be preserved as is (except `skipBabel` for `'qunit'` that is removed), but be aware:

⚠️ The codemod will remove your app dependency to Webpack. If you use options that relate specifically to Webpack behavior, `@embroider/vite` won't use them and the corresponding feature won't be supported. Also, note that when using some build options like `skipBabel`, Embroider triggers an informative build error to teach developers how to migrate to the modern system. In other words, just because you have a build error after running the codemod doesn't mean that something went wrong. It can be the expected follow-up step to fully complete your migration.

### Running code replacements on... `testem.js`

The change in this file introduces a new way to prevent its execution when tests run directly in the browser.

The codemod looks for the `module.exports` and wraps it in a conditional that checks the `module` existence.

```diff
  'use strict';

+ if (typeof module !== 'undefined') {
    module.exports = { ... }
+ }
```

### Running code replacements on... `tests/test-helper.js`

If you go back to the modifications done in `tests/index.html`, you can see the new script imports ` { start } from './test-helper`, registers the test files then calls `start`. The `start` function is the one the codemod creates in this step.

Instead of loading the tests then calling `start` from `ember-qunit` directly in the module scope of the file, we instead export a `start` function that can be called later.

Considering an empty 6.2 Ember app, the codemod does the following:

```diff
  import Application from 'my-empty-classic-app/app';
  import config from 'my-empty-classic-app/config/environment';
  import * as QUnit from 'qunit';
  import { setApplication } from '@ember/test-helpers';
  import { setup } from 'qunit-dom';
- import { loadTests } from 'ember-qunit/test-loader';
- import { start, setupEmberOnerrorValidation } from 'ember-qunit';
+ import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';

+ export function start() {
    setApplication(Application.create(config.APP));

    setup(QUnit.assert);
    setupEmberOnerrorValidation();
-   loadTests();
-   start();
+   qunitStart();
+ }
```

### Running replacements on... `package.json`

Last but not least, the codemod will modify three sorts of things in the `package.json`:

- It will replace the build and test commands to use Vite instead of the legacy Ember commands.
- It will add meta that identify your app as a v2 Ember app.
- It will remove and add a bunch of dependencies.

The codemod looks for the commands `build`, `start`, and `test:ember`, and rewrites them as:

```json
"build": "vite build",
"start": "vite",
"test:ember": "vite build --mode test && ember test --path dist"
```

It will create the following fields with the following content:

```json
"ember-addon": {
  "type": "app",
  "version": 2
},
"exports": {
  "./tests/*": "./tests/*",
  "./*": "./app/*"
}
```

The list of packages that are removed and added can be found in the codemod source:

- [Packages the codemod adds](https://github.com/mainmatter/ember-vite-codemod/blob/main/lib/tasks/update-package-json.js#L18).
- [Packages the codemod removes](https://github.com/mainmatter/ember-vite-codemod/blob/main/lib/tasks/update-package-json.js#L6).

### Linter

The codemod won't touch anything about your linter configuration, as the linter doesn't relate to how the app builds. Depending on the plugins you use, you may encounter issues to solve manually.

For instance, the codemod adds a dependency to `decorator-transforms` which is used in the new Babel config `babel.config.cjs`. If `'@babel/plugin-proposal-decorators'` was included in your `eslint.config.mjs`, then your linter will throw a parsing error "Cannot use the decorators and decorators-legacy plugin together".


---



---



------------------------
# embroider
------------------------
# Addon Author Guide

This document lays out the recommended best practices for addon authors who want their addons to work in apps built with Embroider. For a step by step guide on how to convert an addon from v1 to v2, see [Guide: Porting an Addon to V2](./porting-addons-to-v2.md)

## Give me the tl;dr: what should I do?

The best thing for all addons authors to do right now is to achieve the "Embroider Safe" support level. Follow the instructions in the [@embroider/test-setup README](https://github.com/embroider-build/embroider/tree/main/packages/test-setup) to add the `embroider-safe` scenario to your ember-try config.

There are other levels of support beyond "Embroider Safe", but as long as you get that far you unblock the ability of your users to use Embroider. And the good news is that many addons are already Embroider Safe without doing any work, and all they really need to do is verify by adding a new scenario to their test suite.

## Big Picture

Embroider defines a new format for Ember Addons, which we call **v2 format**. We call the traditional format **v1 format**.

Under the hood, `@embroider/core` _only_ understands **v2** addons and that allows it to be simpler than the traditional build pipeline while doing more powerful static analysis.

But because we care a lot about backward compatibility, we also have `@embroider/compat`: a layer that sits before `@embroider/core` that can compile _most_ **v1** addons to **v2**. It's "most" and not "all" because there are some things **v1** addons can do that are just too dynamic to bring forward into the more static format, or too locked-in to implementation details of the traditional build pipeline and its final output.

While we definitely want to move the whole addon ecosystem to **v2** format over time, there is no rush. As long as your addon can be understood by `@embroider/compat`, your addon won't block anyone from using Embroider.

We call addons that can be understood by `@embroider/compat` "Embroider Safe". "Embroider Safe" is the first of several different "support levels" an addon can achieve:

| Support level            | Format |
| ------------------------ | :----: |
| Embroider Safe           |   v1   |
| Optimized Embroider Safe |   v1   |
| Embroider Native         |   v2   |

## Support Level: Embroider Safe

Your addon may already be Embroider Safe! Many addons are. We've done a lot of work in the `@embroider/compat` package to be able to compile v1 addons on-the-fly into v2 addons.

The best way to see if your addon is Embroider safe is to add the `@embroider/test-setup` package and runs its `embroider-safe` ember-try scenario. See its [README](https://github.com/embroider-build/embroider/tree/main/packages/test-setup) for full details.

If your tests _don't_ work under Embroider when you try this, please file an issue on the Embroider repo. We can help you triage whether there's a missing feature in `@embroider/compat` that would allow your addon to work unchanged, or whether there is a better way to refactor your addon to avoid incompatible behavior.

If your addon does work under Embroider, congrats! It is Embroider Safe. Please keep running the tests in your CI so you will notice if a future change to either Embroider or your addon breaks compatibility. You can also move on to achieving the Optimized Embroider Safe support level.

## Support Level: Optimized Embroider Safe

Out of the box, Embroider runs with the maximum level of backward compatibility. Apps are encouraged to start there, and then once they have that working they can try to enable more optimizations (which really means _disabling_ some of the more heavy-handed backward compatibility systems in order to let the app be built more statically).

The Embroider README [explains what the options are and which order you should try to enable them](https://github.com/embroider-build/embroider/#options). This includes:

1. `staticAddonTrees` and `staticAddonTestSupportTrees` are relatively safe and easy. If these don't work, it's probably because you are consuming Javascript modules without importing them. If you can directly import them instead, you can probably enable these flags and keep your tests passing.
2. `staticHelpers` is also relatively safe. The way most code uses helpers in their templates tends to be statically analyzable.
3. `staticComponents` is harder, because addons tend to use the `{{component}}` helper frequently, and Embroider cannot always statically tell what this means. App authors are able to work around this problem by adding `packageRules`, but addons should actually solve the problem directly by making their code statically understandable. See "Replacing the {{component}} helper" below.

You can follow these steps in your addon's dummy app to see if your tests continue to pass even under the higher levels of optimization. If you can get all the way to `staticComponents: true`, your addon is achieves the Optimized Embroider Safe support level.

You don't need to try to test the `splitAtRoutes` option within your addon -- as long as you reach `staticComponents` your addon will work fine in apps that want to use `splitAtRoutes`.

Once you achieve Optimized Embroider Safe, you should enable the `embroider-optimized` ember-try scenario provided by `@embroider/test-setup` to ensure you don't regress. It's a good idea to also continue testing the `embroider-safe` scenario too, because some common bugs can actually get optimized away under `embroider-optimized` that will break under `embroider-safe`.

## Support Level: Embroider Native

An addon achieves the "Embroider Native" support level by publishing to NPM in the **v2 format**, as defined by [the RFC](https://github.com/emberjs/rfcs/pull/507).

For full details on porting an addon to v2, see [the v2 porting guide](./porting-addons-to-v2.md).

A set of common patterns and best practises for authoring v2 addons can be found in our [v2 addon FAQs](./v2-faq.md).

Another good way to learn about v2 addons is to look at some examples:

- [ember-welcome-page](https://github.com/ember-cli/ember-welcome-page)
- [ember-resources](https://github.com/NullVoxPopuli/ember-resources)
- [ember-stargate](https://github.com/simonihmig/ember-stargate)
- [glimmer-apollo](https://github.com/josemarluedke/glimmer-apollo)

These examples use a monorepo as a way to keep a clean separation between the addon and the application that holds their test suite. This is currently the recommended solution.

We support some tools to make v2 addon development more convenient:

- [@embroider/addon-shim](https://github.com/embroider-build/embroider/blob/main/packages/addon-shim/README.md) makes your v2 addon understandable to ember-cli. All v2 addons should use this.
- [@embroider/addon-dev](https://github.com/embroider-build/embroider/blob/main/packages/addon-dev/README.md) is an optional `devDependency` for your addon that provides build tooling. This gives you more flexibility over how you author your addon (like taking advantage of automatic template-colocation or using TypeScript) while still producing a spec-compliant package for publication to NPM.

For starting fresh with a new v2 addon, we recommend scaffolding your project with the [v2 addon blueprint](https://github.com/embroider-build/addon-blueprint).

## Replacing the {{component}} helper

This section grew into its [own separate document](./replacing-component-helper.md).


---

# Analyzing Bundles

Now that the default implementation of Embroider uses Vite you should follow the [official Vite documentation for performance](https://vite.dev/guide/performance). Embroider no longer needs to provide Ember-specific tooling around this sort of analysis.

You might also want to look into [vite-bundle-visualiser](https://www.npmjs.com/package/vite-bundle-visualizer) if you are upgrading from `webpack-bundle-analyzer`


---

# Empty package in Embroider output

As part of Embroider build process traditional (v1) addons are rewritten to the new v2 format before building your application. Embroider can only tell what contents those packages should have by letting the traditional broccoli-based build pipelines run and observing the files that come out but this can be a bit tricky because there are some cases where broccoli won't run for a particular addon. 

There are several reasons an addon won't ever get consumed by broccoli, causing embroider to emit an empty package. Some of those reasons include:

- if an app uses `addons.blacklist` or `addons.exclude`, the excluded addon can end up empty since nobody consumed it
- if an addon uses the shouldIncludeChildAddon() hook to exclude a child addon, the child addon can end up empty
- if you have multiple copies of certain addons (`@ember/test-helpers` and `@ember/test-waiters` are known examples) within your `node_modules` tree, one copy may end up unconsumed, ending up empty
- if you use pnpm, you may not think you have multiple copies of an addon but still end up with multiple copies because pnpm is more strictly correct about peer dependencies. A library that should see two different peers when consumed from two different places will appear as two distinct copies to consumers.

## pnpm specific solution

You can read more about how pnpm deals with peerDependencies differently in the pnpm docs: https://pnpm.io/how-peers-are-resolved

If you are experiencing this problem in a monorepo you can probably use the config `dependenciesMeta.*.injected` for any shared monorepo package. This will prevent there from being extra duplicate peerDependencies created for shared peerDependencies like `@ember/test-helpers`. You can read more about this config in the pnpm documentation https://pnpm.io/package_json#dependenciesmetainjected


---

# Peer Dependency Resolution Issues

Embroider may link you to this document if it finds certain bad peer dependency resolutions in your node_modules.

## What do you mean by "bad peer dependency?"

When `my-example-lib` declares `{ "peerDependencies" { "my-example-peer": "^1.0.0" } }`, it means:

 1. `my-example-lib` needs a version of `my-example-peer` that satisfies `^1.0.0`.
 2. And `my-example-lib` must see **the same copy** of `my-example-peer` that consumers of `my-example-lib` see.

A peer dependency can be bad if either of these conditions is violated. It can be missing entirely, it can be a wrong version, or it can be the right version but the wrong copy.

## How do bad peer deps happen?

### A dependency might not handle its own dependencies' peers clearly

Given the example names from above (`my-example-lib` has a peerDep on `my-example-peer`):

If some other package named `another-lib` puts `my-example-lib` into its dependencies, then `another-lib` is obligated to either:
 - put `my-example-peer` into its own peerDependencies, so that users of `another-lib` are aware of the need to provide this shared package to keep `my-example-lib` working.
 - or put `my-example-peer` into its own dependencies, producing an entirely self-contained use of `my-example-peer`. This is only appropriate if it's totally fine that users of `another-lib` might get duplicate copies of `my-example-peer` if they happen to use it elsewhere.

If `another-lib` does neither of those things, the package manager is free to arbitrarily install a duplicate copy of `my-example-peer` or not provide it at all. If all the version ranges happen to overlap, often things will work out by luck, only to fail mysteriously later when someone upgrades a dependency and they no longer overlap.

If your library uses a library that declares peer dependencies, those peer dependencies are fundamentally part of your library's own public API. Your users need to know and care about them. This is why it's clearest if you declare them as your own peers transitively.

### Package Manager Bugs

npm, yarn, and pnpm can all produce invalid peer dependencies sometimes. It is especially common in monorepo setups.

Node's architecture for dependency resolution originally assumed that it's better to always duplicate things rather than help users solve the difficult-but-important problem of getting a set of dependencies to agree on shared versions of shared infrastructure. That *kinda* worked for server-side-only applications. For frontend applications it's just not tenable. Nobody wants seven copies of Ember or React in their frontend application.

### Duplicate copies of the same dependency version in `node_modules/.pnpm`

pnpm tries harder than the other clients to actually give each library the correct peer dependencies. This can cause it to duplicate a package if the package needs to see different peers when consumed in different places within the dependency graph. 

This is genuinely correct behavior, but it can confuse people who aren't expecting it. Often a duplicated dependency is the symptom of a problem elsewhere -- one of the consumers of the duplicated package isn't doing the right thing with peer dependencies.

You may want to investigate pnpm's [options for adjusting peer dependency handling](https://pnpm.io/npmrc#peer-dependency-settings). Be aware that auto-install-peers sounds nice, but when some of your dependencies fail to handle their own dependencies' peers correctly, it can result in very surprising behaviors (like pnpm deciding to install a whole second copy of Ember, on a different major version than the one you're trying to use).

## How can I workaround these problems?

Sometimes it's as simple as deleting your lockfile and recreating it from scratch. This allows your package manager to do more optimization and that can often deduplicate things enough that the problem goes away.

Tools like [pnpm dedupe](https://pnpm.io/cli/dedupe) and [yarn-deduplicate](https://www.npmjs.com/package/yarn-deduplicate) can achieve a similar effect.

You can use [pnpm overrides](https://pnpm.io/package_json#pnpmoverrides), [yarn selective dependency resolutions](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/), or [npm overrides](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#overrides) to manually adjust versions until things settled onto one copy.

You can satisfy a missing peer dependency by adding it to your application, and potentially also adjusting settings like [pnpm's resolve-peers-from-workspace-root](https://pnpm.io/npmrc#resolve-peers-from-workspace-root).

In monorepo setups, you can use pnpm's [peerDependenciesMeta.*.injected](https://pnpm.io/package_json#dependenciesmetainjected) to make your workspaces see correct peer dependencies (at the cost of needing to maintain per-file hardlinks, see [discussion on pnpm issue](https://github.com/pnpm/pnpm/issues/6088#issuecomment-1634302377)).



---

# Guide: Porting an Addon to V2

This is a guide for addon authors who want to publish their addon in **v2 format**.

> The actual V2 Format RFC only cares what format you **publish** to NPM. It doesn't necessarily care about your **authoring** format or toolchain. But in this guide, we are picking good defaults, and we hope to polish this experience until it's ready to become a new RFC as the default new Ember Addon authoring blueprint.

## What Addons should and should not be converted to V2?

The best candidates to convert to V2 are addons that provide only run-time features, like components, helpers, modifiers, and services. That kind of addon should definitely port to V2.

In contrast, addons that are primarily an extension to the build system (like `ember-cli-sass` or `ember-cli-typescript`) are not good candidates to be V2 addons, at present. V1 addons will continue to work through `@embroider/compat` for Embroider apps.

If your addon is a mix of both build-time and run-time features, consider replacing the build-time features with `@embroider/macros`. This would let you drop all your custom build-time code and port to V2. Alternatively, if you really need build customizations, you can provide users with instructions and utilities (like a webpack rule or plugin) to add those customizations to their Embroider build. We do _not_ let V2 addons automatically manipulate the app's build pipeline. Thar be dragons.

## Monorepo Organization

Traditionally, an Ember addon is a single NPM package that combines both the actual addon code _and_ a "dummy" app for hosting tests and docs. This was [problematic for several reasons](https://github.com/ember-cli/rfcs/issues/119). V2 addons instead require clean separation between addon and app, so you're going to be working with more than one distinct NPM package: one for the addon, one for the test-app, and optionally one for the documentation site.

Our recommended way to manage these multiple packages is using a monorepo, via pnpm, Yarn, or npm workspaces. The example in this guide assumes a pnpm workspaces monorepo because it's a good solution to work with Embroider in general.

## Part 1: Separate Addon from Dummy App

In this part of the guide, our goal is to separate our existing V1 addon from its "dummy" app and rename the dummy app to "test-app". At the end of this part, you will still have a V1 addon but it will be independent of its test-app, making it much easier to convert to V2 format in a subsequent Part.

For a complete example of a PR that performed these steps on a real addon, see https://github.com/ember-cli/ember-page-title/pull/227.

The steps:

1. Delete `pnpm-lock.yaml`.

1. At the top-level of your repo, make new directories named `test-app` and `_addon`

1. Move these files and directories into `_addon`

   - addon
   - addon-test-support
   - app
   - blueprints
   - config/environment.js (moves to `_addon/config/environment.js`)
   - index.js

1. Now you can rename `_addon` to `addon` without a name collision.

   - yes, this means you will have an `addon/addon` directory. This looks silly, but it will go away when we finish porting the addon to v2.

1. These things stay at the top level:

   - .git
   - .github
   - changelog, code of conduct, contributing, license, and readme

   Move **everything else** into `test-app`

1. Move everything under `test-app/tests/dummy` to directly under `test-app` instead.

   - for example, `test-app/tests/dummy/app` becomes `test-app/app`
   - you will be merging config directories because both `test-app/config` and `test-app/tests/dummy/config` will exist at the start of this step. They shouldn't have any file collisions because you already moved the one colliding file (`environment.js`) to `addon/config/environment.js` in a previous step.

1. Make a new top-level package.json for our new monorepo:

   ```json
   {
     "private": true,
     "workspaces": ["addon", "test-app"]
   }
   ```

   With pnpm, the workspace packages must also be described in [`pnpm-workspace.yaml`](https://pnpm.io/pnpm-workspace_yaml):

   ```yaml
   packages:
     - 'addon'
     - 'test-app'
   ```


1. Make a new top-level .gitignore:

   ```
   # you definitely want this:
   node_modules

   # and you can put in anything else that tends to accumulate in your environment:
   .pnpm-debug.log
   .DS_Store
   ```

1. Copy `test-app/package.json` to `addon/package.json`
1. Edit `addon/package.json` to remove all `devDependencies`, `scripts`, and `ember-addon.configPath`.
1. Edit `test-app/package.json`. For each package in `dependencies`, either remove it (if it's only used by the addon and not the test-app) or move it to `devDependencies` (if it's actually used by the test-app).
   - For example, `"ember-cli-babel"` and `"ember-cli-htmlbars"` most likely need to move to `devDependencies` because test-app still needs JS and template transpilation.
1. In `test-app/package.json`, add your addon as a `devDependency` of the test-app by name and exact version. Our monorepo setup will see this and link our two packages together. For example, if `addon/package.json` has this:

   ```js
   "name": "ember-page-title",
   "version": "8.0.0",
   ```

   Then you would add this to `test-app/package.json`:

   ```js
   "devDependencies": {
     "ember-page-title": "8.0.0"
   }
   ```

1. In  `test-app/package.json`, change the top-level "name" to "test-app", remove the "ember-addon" section, and remove "ember-addon" from keywords.

1. In  `test-app/package.json`, add the field `"private": true` because this package is not meant to be published on npm.

1. At the top-level of the project, run `pnpm install`.
1. In `test-app/ember-cli-build.js` switch from the dummy app build pipeline to the normal app build pipeline:

   ```diff
   -const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
   +const EmberApp = require('ember-cli/lib/broccoli/ember-app');
   ...
   -let app = new EmberAddon(defaults, {
   +let app = new EmberApp(defaults, {
   ```

   You may also find other places in `ember-cli-build.js` that refer to files under `tests/dummy`. Update those paths to point directly to their new locations directly inside test-app instead.

1. Search for all uses of the word "dummy" in the test-app. If they're referring to the app name, replace them with "test-app". This includes `modulePrefix` in `test-app/config/environment.js` and `dummy.js` and `dummy.css` in `test-app/app/index.html` and in `test-app/tests/index.html`.
1. Try to boot your test-app and run the tests. Debug as needed to get things passing again.
   ```sh
   cd test-app
   ember s
   ember test
   ```

1. The lint scripts are expected to work the same way as before inside the test-app. However, there's one common issue you may encounter when running the linter if you use `eslint-plugin-n` or `eslint-plugin-node`: 
   ```sh
   error  "@embroider/test-setup" is not published  n/no-unpublished-require
   error  "ember-cli" is not published  n/no-unpublished-require
   ```
   The [lint rule](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-unpublished-require.md) tells that `"@embroider/test-setup"` and `"ember-cli"` are `devDependencies` being imported with `require()`. It's not a problem since the test-app is a private package. To solve the issue, make sure you use an up-to-date version of `eslint-plugin-n` (at least `15.4.0`). If you don't want to update the lint tools right now, you can also deactivate the rule.

1. At this point all tests and lint scripts work the same way as before inside the test-app. But we will also want linting, prettier, etc for the newly-separated addon workspace too.

   > You could create one unified config at the top of the monorepo if you want, but I think it's simpler over the long run to manage each workspace separately. It's nice that the test-app is a totally stock Ember app that can be updated by ember-cli-update -- including all the default linting setup.

   Copy .gitignore, .eslintrc.js, .eslintignore, .prettierrc.js, .prettierignore, and .template-lintrc.js from test-app to addon.

   Edit them down so they only cover the thing the addon workspace has. For example, there's no dummy app or tests inside the addon workspace anymore, so the eslintrc will get simpler.

   Copy eslint, relevant eslint plugins, prettier, ember-template-lint, and npm-run-all from `test-app/package.json` `devDependencies` to `addon/package.json` `devDependencies`.

   Copy the lint-related scripts from `test-app/package.json` to `addon/package.json`.

   Test that `pnpm lint` works inside the `addon` workspace.

1. Remove `test-app/config/ember-cli-update.json` because it still says you're using the **addon** blueprint and next time you run ember-cli-update in `test-app` it uses the **app** blueprint instead.

1. Edit `.github/workflows/ci.yml` to run tests in the right directory. For example:

   ```diff
    - name: Test
      run: pnpm test:ember --launch ${{ matrix.browser }}
   +  working-directory: test-app
   ```

   And make separate linting steps for both workspaces:

   ```diff
   -    - name: Lint
   -      run: pnpm lint
   +    - name: Lint Addon
   +      run: pnpm lint
   +      working-directory: addon
   +    - name: Lint Test App
   +      run: pnpm lint
   +      working-directory: test-app
   ```

1. If you're using volta, move the volta config to the top-level package.json and make both workspaces say:
   ```
   "volta": {
     "extends": "../package.json"
   }
   ```

At this point, you should still have a fully-working V1 Addon, and if you want you can test, review, and merge this work before moving on.

## Part 2 (Optional): Split docs from tests

Many addons have a deployable documentation app. Usually it is the same app as the test suite.

This causes a lot of pain because the test suite needs to support every Ember version your addon supports, and when your docs site is mixed in with your test suite, your docs site _also_ needs to support every Ember version, and that's unnecessarily difficult. Documentation apps deal with lots of typical production app concerns (deployment, styling, server-side rendering) that mean they benefit from using many additional addons, which makes broad version compatibility challenging.

The solution is to split the docs from the test suite. The docs app can pick a _single_ Ember version, and it can stay on older, deprecated patterns as long as you like _without_ impacting your ability to test your addon against the latest Ember canary. When you get test failures on Ember Canary, they will be real failures that impact your users, not irrelevant failures caused by forcing your docs app and all its dependencies to upgrade to Canary.

To split out the docs, you could start by just copying all of `test-app` into a new `docs` directory. Add your new `docs` workspace to the top-level package.json. Then edit both apps down to eliminate documentation and deployment features from `test-app` and eliminate test-suite concerns from `docs`. It's still appropriate for `docs` to have its own tests of course, to prove that the docs pages themselves render correctly.

When the docs app is ready, expand the CI settings to cover linting and testing of the docs app, just like we did when we expanded it to cover linting of both `addon` and `test-app` above.

For a complete example of a PR that splits docs from test-app, see https://github.com/ember-cli/ember-page-title/pull/228.

## Part 3: Prerequisites for V2 addon

In this part, we address potential blockers before we actually switch to V2. This lets you test your changes and make sure they're still working before we move on to V2 format.

1. Make sure your test-app (and docs app if you have one) has `ember-auto-import` >= 2. Once you convert your addon to v2 format, it can only be consumed by apps that have ember-auto-import >= 2. This also means you should plan to make a semver major release to communicate this new requirement to your users.

1. Make sure all the files in the `addon/app` contain _only_ reexport statements. If there's anything that's not a reexport statement, move that code into somewhere in the `addon/addon` directory and reexport it from `addon/app`. This was already best practice, but we're about to enforce it.

1. Make sure all the reexports in `addon/app` follow the default naming convention, such that `addon/app/components/whatever.js` contains only a reexport of `your-addon-name/components/whatever`. If the names don't align, move files around inside `addon/addon` until they do.

1. Make sure your addon has [co-located templates](https://rfcs.emberjs.com/id/0481-component-templates-co-location/). By default, the build tools expect to find the component's `.js` and `.hbs` in the same folder. If your addon used to have an `addon/templates/components` folder, move to co-location. Note that a [codemod](https://www.npmjs.com/package/ember-component-template-colocation-migrator) has been released when co-location has become the recommended structure.

1. Make sure your `addon/index.js` file isn't trying to do anything "interesting". Ideally it contains nothing other than your addon's name.
   - if it was using `app.import()` or `this.import()`, port those usages to `ember-auto-import` instead
   - if you're trying to modify your own source code based on the presence of other packages or based on development vs testing vs production, switch to `@embroider/macros` instead
   - if you have other cases you're not sure what to do with, ask in an issue on this repo, or https://discuss.emberjs.com, or the #dev-embroider channel in the Ember community discord.

## Part 4: Convert addon to v2

In this part we actually convert our addon from v1 to v2 format by reorganizing it and setting up a default toolchain for building and publishing it.

For an example of a complete PR that applies these steps to a real addon, see https://github.com/ember-cli/ember-page-title/pull/229

Now that we've separated the test-app and docs app concerns from the addon, we can focus on reorganizing the addon itself to V2 format.

1. Rename the `addon/addon` directory to `addon/src`.
2. If you have an `addon/addon-test-support` directory, move it to `addon/src/test-support`.
3. In `addon/package.json`, remove any of these that appear in `dependencies`:

   - ember-cli-htmlbars
   - ember-cli-babel
   - ember-auto-import
   - @embroider/macros

   All of these implement standard features of V2 addons that don't need to come as dependencies.

4. `pnpm add @embroider/addon-shim`. This is the only dependency a v2 addon needs (in order to interoperate with ember-cli.
5. We're going to set up a default build pipeline for things like template colocation and decorator support. Install these dev dependencies:

   `pnpm add --save-dev @embroider/addon-dev rollup @rollup/plugin-babel @babel/core @babel/plugin-transform-class-properties @babel/plugin-proposal-decorators`

6. Grab the [example babel config](https://github.com/embroider-build/embroider/blob/main/packages/addon-dev/sample-babel.config.json) and save it as `addon/babel.config.json`
   - If you addon requires template transforms in order to publish to a shareable format. Apply transforms using the `babel-plugin-ember-template-compilation`. View how to use this in the [example babel.config.js](https://github.com/embroider-build/embroider/blob/main/packages/addon-dev/sample-babel.config.js)
7. Grab the [example rollup config](https://github.com/embroider-build/embroider/blob/main/packages/addon-dev/sample-rollup.config.js) and save it as `addon/rollup.config.js`.
8. Identify your **app reexports**. This is the list of modules from your addon that get reexported by files in the `addon/app` directory.
9. Delete the `addon/app` directory. You aren't going to need it anymore.
10. Edit `addon/rollup.config.js`. Customize the `publicEntrypoints` so it includes

- every module that users should be allowed to import from your addon
- every module in the **app reexports** you identified in the previous step

11. Still editing `addon/rollup.config.js`, customize the `appReexports` to match all your **app reexports** as identified above.
12. Delete your `addon/index.js` file.
13. Create a new `addon/addon-main.js` file (this replaces `addon/index.js`) with this exact content:

```js
const { addonV1Shim } = require('@embroider/addon-shim');
module.exports = addonV1Shim(__dirname);
```

14. In your `addon/.eslintrc.js`, replace "index.js" with "addon-main.js" so that our new file will lint correctly as Node code.
15. In your `addon/package.json`, add these things:
    ```js
    "exports": {
      ".": "./dist/index.js",
      "./*": "./dist/*",
      "./test-support": "./dist/test-support/index.js",
      "./addon-main.js": "./addon-main.js"
    },
    "files": [
      "addon-main.js",
      "dist"
    ],
    "scripts": {
      "build": "rollup --config",
      "prepublishOnly": "rollup --config",
      "start": "rollup --config --watch"
    },
    "ember-addon": {
      "main": "addon-main.js",
      "type": "addon",
      "version": 2
    }
    ```
16. In the `addon` directory, run `pnpm start` to start building the addon.
17. In a separate shell, you should be able to go into the `test-app` directory and run `pnpm start` or `pnpm test` and see your tests passing.

When all tests are passing, you have a fully-working V2 addon and you're ready to release it. To publish, you will run `npm publish` in the `addon` directory.


---

# Replacing the Component Helper

Using the `{{component}}` helper in traditional loose handlebars template can prevent your app or addon from being
statically analyzed, which will prevent you from taking advantage of
`staticComponents` and `splitAtRoutes`.

The exact rules for `{{component}}` are:

- it's always OK to use `{{component}}` in Template Tag (GJS) format because that format follows the [strict handlebars](https://github.com/emberjs/rfcs/blob/7d2ff960370faa7e70f39c6a13e43536f40e3048/text/0496-handlebars-strict-mode.md) rules, which forbid the component helper from dynamically converting strings into component definitions.
- it's OK to pass a string literal component name like `{{component "my-title-bar"}}`
- any other syntax in the first argument to `{{component ...}}` is NOT OK

The following sections explain what to do in the common scenarios where you might have unsafe usage of the `{{component}}` helper.

## When you're invoking a component you've been given

Here's an example of a component that accepts an optional `@titleBar=` argument:

```js
import Component from '@glimmer/component';

export default class extends Component {
  get titleBar() {
    return this.args.titleBar || 'default-title-bar';
  }
}
```

```hbs
{{component this.titleBar}}
```

The solution is to combine the JS and HBS files into a single GJS file:

```gjs
import Component from '@glimmer/component';
import DefaultTitleBar from './default-title-bar';

export default class extends Component {
  <template>
    <this.titleBar />
  </template>
  
  get titleBar() {
    return this.args.titleBar || DefaultTitleBar;
  }
}
```

## When you're passing a component to someone else

Here's an example `<Menu/>` component that accepts a `@titleBar=`. When the author of `<Menu/>` follows the steps from the previous section, if we try to call it like this:

```hbs
<Menu @titleBar='fancy-title-bar' />
```

it will no longer work, because `<Menu />` no longer accepts a string.

We should import the FancyTitleBar component directly and pass it:

```gjs
import FancyTitleBar from './fancy-title-bar';
<template>
  <Menu @titleBar={{FancyTitleBar}} />
</template>
```

## When you need to curry arguments onto a component

A common pattern is yielding a component with some curried arguments:

```hbs
{{yield (component 'the-header' mode=this.mode)}}
```

In this particular example, we're using a **string literal** for the component name, which makes it OK, and you don't need to change it.

But what if you need to curry arguments onto a component somebody else has passed you?

```hbs
{{yield (component this.args.header mode=this.mode)}}
```

In this case, you should convert your component to Template Tag:

```gjs
<template>{{yield (component this.args.header mode=this.mode)}}</template>
```

That makes it safe because Template Tag is always safe, because it follows the strict handlebars rules.


## When you're matching a large set of possible components

Another common pattern is choosing dynamically from within a family of
components:

```js
import Component from '@glimmer/component';

export default class extends Component {
  get whichComponent() {
    return `my-app/components/feed-items/${this.args.model.type}`;
  }
}
```

```hbs
{{component this.whichComponent feedItem=@model}}
```

You can replace this with native `import()` or the `importSync()` macro, because
they support dynamic segments (for full details on what exactly is supported,
see <a
href="https://github.com/emberjs/rfcs/blob/73685c28378118bebb5e359b80e00b839a99f622/text/0507-embroider-v2-package-format.md#supported-subset-of-dynamic-import-syntax">"Supported
subset of dynamic import syntax" in the Embroider V2 Package RFC</a>.

In this case, we're refactoring existing synchronous code so we can use
`importSync`:

```gjs
import Component from '@glimmer/component';
import { importSync } from '@embroider/macros';

export default class extends Component {
  get whichComponent() {
    let module = importSync(`./feed-items/${this.args.model.type}`);
    return module.default;
  }

  <template>
    <this.whichComponent @feedItem={{@model}} />
  </template>
}
```

This code will cause every module under the `./feed-items/` directory to be eagerly included in your build.

To instead _lazily_ include them, refactor to use asynchronous `import()` instead of `importSync`. BUT CAUTION: using `import()` of your own app code is one of the few things that works _only_ under Embroider and not in classic builds, so don't do it until you have committed to Embroider.

## When using one-off components in tests

If you find yourself defining custom, one-off components to be used in your tests, you might have been using a syntax like this:

```js
import { setComponentTemplate } from '@ember/component';
import Component from '@glimmer/component';

test('my test', async function (assert) {
  class TestComponent extends Component {}

  setComponentTemplate(hbs`Test content: {{@message}}`, TestComponent);

  this.owner.register('component:test-component', TestComponent);

  await render(hbs`
    <MyComponent @display={{component 'test-component'}} />
  `);
});
```

This will fail, as `test-component`cannot be statically found. Instead, you can directly reference the component class using Template Tag:

```js
import { setComponentTemplate } from '@ember/component';
import Component from '@glimmer/component';

test('my test', async function (assert) {
  class TestComponent extends Component {
    <template>Test content: {{@message}}</template>
  }

  await render(<template>
    <MyComponent @display={{TestComponent}} />
  </template>);
});
```


---

# V2 Package Spec

# Motivation

One of the good things about Ember is that apps and addons have a powerful set of build-time capabilities that allow lots of shared code with zero-to-no manual integration steps for the typical user. We have been doing “zero config” since before it was a cool buzzword (it was just called “convention over configuration”). And we’ve been broadly successful at maintaining very wide backward- and forward-compatibility for a large body of highly-rated community-maintained addons.

But one of the challenging things about Ember is that our ecosystem’s build-time capabilities are more implementation-defined than spec-defined, and the implementation has accumulated capabilities organically while only rarely phasing out older patterns. I believe the lack of a clear, foundational, build-time public API specification is the fundamental underlying issue that efforts like the various packaging / packager RFCs have tried to work around.

The benefits to users for this RFC are:

- faster builds and faster NPM installs
- “zero-config import from NPM — both static and dynamic” as a first-class feature all apps and addons can rely on.
- immediate tree-shaking of app- and addon-provided modules that are consumed directly via ECMA imports (for example, any ember-animated transition you don’t use in your app won’t get included in the build), with a smooth improvement path for steadily increasing the level of static analysis as other efforts like templates imports land.
- a more approachable build system that enables more people to contribute and better integration with other JS toolchains.

# Key Ideas

## Fully Embrace ES Modules

Ember was one of the earliest adopters of ECMAScript modules, and Ember core team members were directly involved in helping move that features through TC39. Ember’s early experiences with modules influenced the spec itself. _Yet we have lagged in truly embracing modules._

For example, how do Ember apps express that they depend on a third-party library? The [app.import](https://ember-cli.com/user-guide/#javascript-assets) API. This should be ECMA standard `import`.

Another way to state the problem is that apps and addons all _push_ whatever code they want into the final built app. Whereas ES modules can _pull_ each other into the build as needed.

## Play nice with NPM Conventions

The ECMA module spec by itself doesn’t try to define a module resolution algorithm. But the overwhelmingly most popular convention is the [node_modules resolution algorithm](https://nodejs.org/api/all.html#modules_all_together).

Ember addons do respect node_module resolution for build-time code, but they do not respect it for runtime code. There’s no reason not to.

## Verbose, Static Javascript as a Compiler Target

Ember’s strong conventions mean that many kinds of dependencies can be inferred (including _statically_ inferred) without requiring the developer to laboriously manage them. This is a good thing and I believe the current fad in the wider Javascript ecosystem for making developers hand-write verbose static imports for everything confuses the benefits of having static analysis (which is good) with the benefits of hand-managing those static imports (which is unnecessary cognitive load when you have clear conventions and a compiler).

This design is about compiling today’s idiomatic Ember code into more “vanilla” patterns that leverage ES modules, node_modules resolution, and spec-compliant static and dynamic `import` to express the structure of an Ember application in a much more “vanilla Javascript” way.

This compile step lets us separate the authoring format (which isn’t changing in any significant way in this RFC) from the packaging format (which can be more verbose and static than we would want in an authoring format).

# Detailed Design

## Definitions

**package**: every addon and app is a package. Usually synonymous with “NPM package”, but we also include in-repo packages. The most important fact about a package is that it’s often the boundary around code that comes from a particular author, team, or organization, so coordination across packages is a more sensitive design problem than coordination within apps.

**app**: a package used at the root of a project.

**addon**: a package not used at the root of a project. Will be an **allowed dependency** of either an **app** or an **addon**.

**allowed dependency**: For **addons**, the **allowed dependencies** are the `dependencies` and `peerDependencies` in `package.json` plus any in-repo addons. For **apps**, the **allowed dependencies** are the `dependencies`, `peerDependencies`, and `devDependencies` in `package.json` plus any in-repo addons.

**Ember package metadata**: the `ember-addon` section inside `package.json`. This already exists in v1, we’re going to extend it.

**v2 package**: a package with `package.json` like:

    "keywords": [ "ember-addon" ],
    "ember-addon": {
      "version": 2
    }

**v1 package**: a package with `package.json` like:

    "keywords": [ "ember-addon" ]

and no `version` key (or version key less than 2) in **Ember package metadata**.

**non-Ember package**: a package without `keywords: ["ember-addon"]`

## Package Public API Overview

The structure we are about to describe _is a publication format_. Not necessarily an authoring format. By separating the two, we make it easier to evolve the authoring formats without breaking ecosystem-wide compatibility. The publication format is deliberately more explicit and less dynamic that what we would want for an authoring format.

First, here’s the list of things a v2 package can provide. More detail on each of these will follow:

- **Own Javascript**: javascript and templates under the package’s own namespace (the v1 equivalent is `/addon/**/*.js/`)
- **App Javascript**: javascript and templates that must be merged with the consuming app’s namespace (the v1 equivalent is `/app/**/*.js`). This likely stops being needed when use with a template imports feature, but v2 package format is not dependent on that.
- **CSS:** available for `@import` by other CSS files (both in the same package and across packages) and by ECMA `import` directives in Javascript modules (both in the same package and across packages).
- **Assets**: any files that should be available in the final built application directory (typical examples are images and fonts).
- **Middleware**: express middleware that will mount automatically during development, unchanged from v1.
- **Preprocessors**: for producing JS, CSS, or HBS.
- **Commands**: commands that can be invoked from the command line. Unchanged from v1.
- **Blueprints**: blueprints for generating new files from the command line. Unchanged from v1.
- **ContentFor**: the ability to insert snippets into key places, like the document header.
- **Active Dependencies**: the subset of a given package’s **allowed dependencies** that are Ember packages and that the given package considers active.

## Own Javascript

The public `main` (as defined in `package.json`) of a v2 package points to its **Own Javascript**. The code is formatted as ES modules using ES latest features. Templates are in place in hbs format, and any custom AST transforms have already been applied.

(Remember, we’re describing the _publication_ format, not the _authoring_ format. Authors can still do what they do today, using preprocessors provided by other addons. But that will all run before publishing.)

The benefit of this design is that it makes our packages understandable by a broader set of tooling. Editors and build tools can follow `import` statements across packages and end up in the right place.

In v1 packages, `main` usually points to a build-time configuration file. That file is moving and will be described in the **Addon Hooks** section below.

Modules in **Own Javascript** are allowed to use ECMA static `import` to resolve any **allowed dependency**, causing it to be included in the build whenever the importing module is included. This replaces `app.import`.

Notice that a package’s **allowed dependencies** do not include the package itself. This is consistent with how node module resolution works. This is different from how run-time AMD module resolution has historically worked in Ember Apps, so the build step that produces the v2 publication format will need to adjust import paths appropriately. For example, if `your-package/a.js` tries to import from `"your-package/b"`, that needs to get rewritten to “`./b`".

Modules in **Own Javascript** are also allowed to use the (currently stage 3) ECMA dynamic `import()`, and the specifiers have the same meanings as in static import. We impose one caveat: only string-literal specifiers are supported. So `import('./lang-en')` is OK but `import("./lang-"+language)` is not. We retain the option to relax this restriction in the future. The restriction allows us to do better analysis of possible inter-module dependencies (see **Build-time Conditionals** below for an example).

Modules in **Own Javascript** are allowed to import template files. This is common in today’s addons (they import their own layout to set it explicitly).

Modules in **Own Javascript** are allowed to use `hbs` tagged template strings as provided by `ember-cli-htmlbars-inline-precompile`, and we promise to compile the templates at app build time.

You’re allowed to `import` from both other v2 Ember packages and non-Ember packages. The only difference is that v2 Ember packages necessarily agree to provide ES modules with ES latest features, and so we will always apply the application’s browser-specific Babel transpilation to them. Non-Ember packages can be authored in lots of ways, and we will use best-effort to consume them, including conversion of ESM or CJS to whatever format we’re using in the browser (currently AMD), but we won’t apply the app’s Babel transpilation to them, because it’s usually just unnecessary expense — the most common way to ship NPM packages outside of well-known build systems like ember-cli is to transpile before publication.

_A recent lesson from ember-auto-import is that we’re going to want to allow people to opt-in to babel transpilation of specific foreign packages, as the wider ecosystem’s norms evolve and more projects ship modern JS untranspiled. Unfortunately there is no simple correct universal answer here. Double transpilation is not safe in general, since choices get made about how to map between modules, AMD, UMD, etc._

## App Javascript

To provide **App Javascript**, a package includes the `app-js` key in **Ember package metadata**. For example, to duplicate the behavior of v1 packages, you could say:

    "ember-addon": {
      "version": 2,
      "app-js": "./app"
    }

Like the **Own Javascript**, templates are in place in hbs format with any AST transforms already applied. Javascript is in ES modules, using only ES latest features. ECMA static and dynamic imports from any **allowed dependency** are supported.

By making this an explicit key in **Ember package metadata**, our publication format is more durable (you can rearrange the conventional directory structure in the future without breaking the format) and more performant (less filesystem traversal is required to decide which features the package is using).

## CSS

To provide **CSS**, a package can include any number of CSS files. These files can `@import` each other via relative paths, which will result in build-time inclusion (as already works in v1 packages).

If any of the **Own Javascript** or **App Javascript** modules depend on the presence of a CSS file in the same package, it should say so explicitly via an ECMA relative import, like:

    import '../css/some-component.css';

This is interpreted as a build-time directive that ensures that before the Javascript module is evaluated, the CSS file's contents will be present in the DOM.

> Q: Does this interfere with the ability to do CSS-in-JS style for people who like that?

> A: No, because that would be a preprocessing step before publication. It’s a choice of authoring format, just like TypeScript or SCSS.

It is also possible for other packages (including the consuming application) to depend on a CSS file in any of its **allowed dependencies**, from either Javascript or CSS. From Javascript it looks like:

    // This will resolve the `your-addon` package and find
    // './some-component.css' relative to the package root.
    // The .css file extension is mandatory
    import 'your-addon/some-component.css';

And from CSS it looks like:

    @import 'your-addon/some-component';

What about SCSS _et al_? You’re still free to use them as your authoring format, and they should be transpiled to CSS in your publication format. If you want to offer the original SCSS to consuming packages, you’re free to include it in the publication format too. Since we’re making all packages resolvable via normal node rules, it’s now dramatically easier to implement a preprocessor that supports inter-package dependencies. (The same logic applies to TypeScript.)

## Assets

To provide **Assets**, a package includes the `public-assets` key in **Ember package metadata**. It's a mapping from local paths to app-relative URLs that should be available in the final app.

    "name": "my-addon",
    "ember-addon": {
      "version": 2,
      "public-assets": {
        "./public/image.png": "/my-addon/image.png"
      }
    }

with:

    my-addon
    └── public
        └── image.png

will result in final build output:

    dist
    └── my-addon
        └── image.png

Notice that we’re _not_ choosing to include assets via explicit ECMA `import`. The reason is that fine-grained inclusion of asset files is not critical to runtime performance. Any assets that your app doesn’t actually need, it should never fetch.

## ContentFor

The following targets are supported the same as in v1 packages:

- head
- head-footer
- body
- body-footer
- test-head
- test-head-footer
- test-body
- test-body-footer
- config-module

The following targets are deprecated because they tie us permanently to the idea of fixed app/test/vendor Javascript bundles, and because they are not widely used according to the EmberObserver code search:

- app-boot
- app-prefix
- app-suffix
- test-support-prefix
- test-support-suffix
- vendor-prefix
- vendor-suffix

## What about Tests?

v1 packages can provide `treeForTestSupport`, `treeForAddonTestSupport`, and `app.import` with `type="test"`. All of these features are dropped.

To provide test-support code, make a separate module within your package and tell people to `import` it from their tests. As long as it is only imported from tests, it will not be present in non-test bundles.
​​

## Package Hooks

In today’s v1 addon packages, the `index.js` file is the main entrypoint that allows an addon to integrate itself with the overall ember-cli build pipeline. The same idea carries forward to v2, with some changes.

It is no longer the `main` entrypoint of the package (see **Own Javascript**). Instead, it’s located via the `build` key in **Ember package metadata**, which should point at a Javascript file. `build` is optional — if you don’t have anything to say, you don’t need the file.

It is now an ECMA module, not a CJS file. The default export is a class that implements your addon hooks (no base class is required).

One area that is under-documented and under-designed in the existing hooks is: which ones cascade into active grandchild addons? Do they cascade via `super` so you can (accidentally or on purpose) block the cascade? Section **Active Dependencies** makes these rules consistent and clear.

List of existing v1 public methods and properties on addons, and their disposition in v2:

- blueprintsPath: unchanged in v2
- buildError: Kept. This is an event hook that makes it possible to implement things like ember-cli-build-notifications.
- cacheKeyForTree: Dropped. This is a build-time feature, it doesn’t belong in the publication format.
- config: TODO.
- contentFor: Some of the possible destinations for content are removed. See **ContentFor** section.
- dependencies: Dropped. Can’t find any usages in the wild.
- description: Dropped. This is redundant with the description in package.json.
- import: Dropped. This is replaced with actual ECMA `import` for both Javascript and CSS.
- importTransforms: Dropped, because this goes with `this.import()` above. All examples in the wild that I could find are handled better by other alternatives.
  - the CJS and AMD transforms aren’t needed because better packagers can automate the transformation of both, as demonstrated by ember-auto-import
  - the fastboot transform is used to neuter whole dependencies in fastboot. This can be handled by ECMA dynamic `import()` instead.
  - most other occurrences in the EmberObserver code search are actually addons re-exporting the fastboot transform (because apparently `importTransforms` doesn’t cascade properly).
- included: Unchanged, but it should be needed much more rarely. Today it is mostly used to `this.import()` things, which is not a thing anymore.
- includedCommands: Unchanged.
- init: Dropped in favor of `constructor`, since we’re now talking about a native class.
- isDevelopingAddon: Dropped. This doesn’t belong in each addon’s code, it’s a runtime decision and control over it belongs in ember-cli proper. Under embroider developers can set a comma-separated list of addon package names in the EMBROIDER_REBUILD_ADDONS environment variable instead.
- isEnabled: Dropped. Rarely used. This decision doesn’t belong inside an addon, it belongs in the addon’s parent which will decide to activate it or not. Putting it here means every addon needs to invent its own API for how to tell it to activate or not.
- lintTree: Kept. This is a legit runtime thing to do.
- moduleName: Dropped. Using a moduleName that doesn’t match your NPM package name is a megatroll, and it won’t work with build tools that know how to follow the Node package resolution algorithm.
- name: Dropped. Setting a name that doesn’t match your NPM package name is a megatroll.
- outputReady: Kept.
- postBuild: Kept.
- postprocessTree: TODO. need to confirm existing pre/postprocessTree behaviors. I think most of the trees (js, styles, templates, all) only apply to your immediate parent, meaning they can run at publication time when they’re being applied to an addon.
- preBuild: Kept
- preprocessTree: TODO. Same boat as postprocessTree.
- serverMiddleware: Kept.
- setupPreprocessorRegistry: Kept. But remember, it will have an effect whenever the consuming package is built, which for apps will be the same as today, but for addons will be publication time.
- shouldIncludeChildAddon: Dropped in favor of `activeDependencies` because we’re changing the semantics. This method receives a complete instance representing each child addon, which unintentionally exposes way too much API. And the meaning of being an active dependency has been rationalized. See section **Active Dependencies**.
- testemMiddleware: Kept.
- treeFor, treeForAddon, treeForAddonTemplates, treeForAddonTestSupport, treeForApp, treeForPublic, treeForStyles, treeForTemplates, treeForTestSupport, treeForVendor: Dropped. Dynamically generating broccoli trees at app build time is no longer supported. Your trees are built at publication time. If you need to produce different output at build time based on dynamic configuration, see **Build-time Conditionals**.

New addon hooks:

- `activeDependencies`: defined in its own section below

Finally, your `build` module may export named constants that will be made available to your runtime Javascript. See **Build-time Conditionals** for details.

## Build-time Conditionals

The v2 format deliberately moves a lot of dynamic behavior to publication time. So how do we deal with remaining cases where different code needs to be included based on dynamic information?

You may export named `const` values from your `build` module (as defined in the **Addon Hooks** section). These constants will be available to your Javascript via `import { someConstant } from` `'@ember/build-time-config/your-package-name'`, and we guarantee that a dead-code elimination step can see any boolean constant branch predicates (this is how feature flags already work inside Ember itself). For example:

    import { needsLegacySupport } from '@ember/build-time-config/my-package';
    let MyComponent = Component.extend({
      //....
    });
    if (needsLegacySupport) {
      MyComponent.reopen({
        // add some extra code here. It will be stripped from builds that don't need it.
      });
    }
    export default MyComponent;

This is also a motivating example for our support of dynamic `imports()`: it allows you to conditionally depend on other JS modules or CSS:

    import { provideDefaultStyles } from '@ember/build-time-config/my-package';
    if (provideDefaultStyles) {
      import("../css/default-styles.css");
    }

Your `build` module is evaluated in Node, not the browser. We just promise that any JSON-serializable constants it exports will get packaged up into the special Ember-provided `@ember/build-time-config` package.

**Template Build-time conditionals**

TODO: this section is a rough first pass. Once clarified, it should also get reflected in the other places where we talk about the template publication format.

We also need build-time conditional capability in templates, because (for example) many of the AST transforms we will be asking addons to pre-apply are supposed to behave differently depending on the Ember version.

The input data is exactly the same as used for Javascript build-time conditionals (any JSON-serializable constants exported from your build module are available via the `@ember/build-config-config` package). We add a helper for accessing those values:

    {{#if (ember-build-time-config "my-package" "needsOldFeature")}}
       ...
    {{else}}
       ...
    {{/if}}

And we implement a transform in the template compiler that does branch elimination based off the values.

Note that only Boolean predicates are handled by the dead-code elimination. You can produce Booleans from arbitrary logic in your `build` module (including things like semver tests or feature probing).

## Active Dependencies

The `activeDependencies` hook receives the list of names of your **allowed dependencies** that are Ember packages as input and returns either the same list or a subset of the list:

    activeDependencies(childPackageNames) {
      if (someThingIsDisabled) {
        return childPackageNames.filter(name => name !== 'the-one-we-dont-need');
      } else {
        return childPackageNames;
      }
    }

If you don’t implement the `activeDependencies` hook, all your `dependencies` are considered active.

When and only when a package is active:

- all standard Ember module types (`your-package/components/*.js`, `your-package/services/*.js`, etc) from its **Own Javascript** _that cannot be statically ruled out as unnecessary_ are included in the build as if some application code has `import`ed them. (What counts as “cannot be statically ruled out” is free to change as apps adopt increasingly static practices. This doesn’t break any already published packages, it just makes builds that consume them more efficient.)
- if your **Ember package metadata** contains `"implicit-scripts"` or `"implicit-test-scripts"`, the listed scripts will be included in the consuming app or its tests, respectively. Each of these keys can contain a list of specifier strings that will be resolved relative to the package. This is a backward-compatibility feature for capturing the behavior of v1 packages. New features are encouraged to use direct `import` where possible.

Example:
"ember-addon": {
"version": 2,
"implicit-scripts": ["./vendor/my-package/some-shim", "lodash/sortBy"]
}
Scripts included this way are _not_ interpreted as ES modules. They are evaluated in script context (think `<script src="./vendor/my-package/some-shim.js">` not `<script type="module"` `src="./vendor-my-package/some-shim.js">`.

- all **App Javascript** is included in the build.
- **Preprocessors** apply to the consuming package. In the case of an addon with an active child addon that provides a preprocessor, this is only interesting at publication time, not built time, because that is when preprocessors run for addon code.
- **Middleware**, **Commands**, and **Blueprints** are available.
- **ContentFor** is injected.
- **Assets** are included in the build.
- its **Active Dependencies** become active recursively.

Whether or not a package is active:

- directly-imported **Own Javascript** and **CSS** are available to any other package as described in those sections. The rationale for allowing `import` of non-active packages is that (1) we follow node module resolution and node module resolution doesn’t care about our notion of “active”, and (2) `import` is an explicit request to use the module in question. It’s not surprising that it would work, it would be more surprising if it didn’t.

The `activeDependencies` hook is the _only_ way to disable child packages. Notice that the package hooks are now implemented as a class with no base class. There is no `super` to manipulate to interfere with your children’s hooks.

## Package Configurations and Multiple Instances

TODO: this section is a rough draft. It’s ideas need to get incorporated better into the rest of the doc, too.

v1 Addon packages make up their own conventions for how to receive configuration from their parent package(s). It’s messy. Many packages expect their config under a key that doesn’t actually match their own name (like `fingerprint` for `broccoli-asset-rev`), which makes things unnecessarily mysterious.

Furthermore, a package can be used by multiple other packages simultaneously. For some features (like preprocessors) this is fine, because multiple instances of a given package with distinct configurations can each operate independently. But for features like **Own Javascript**, there’s no desirable way for each instance to operate independently. A consensus must be reached. v1 packages just smoosh together the output from all instances, with a precedence that depends on ember-cli traversal order. This often wastes work, since multiple instances are doing the same thing.

In contrast, a v2 package that is consumed by multiple other packages is only instantiated once, and it can see all the configurations simultaneously. It’s required to come up with a single answer for (for example) any build-time configuration it wants to use to manipulate its own build via **Build-Time Conditionals**. The hooks that _do_ work fine independently such as preprocessor registration are called multiple times and receive each configuration as an argument. TODO: clarify each of the hooks in more detail.

## Addon build-time dependencies can become devDependencies

An addon that is published in v2 format has already applied all of the preprocessors and AST transforms that is needs to its own code. This means that many things that are today `dependencies` of addons can become `devDependencies` of addons. This results in a smaller overall `node_modules` tree for consuming apps, and faster NPM installs.

Examples of packages that are very frequently used as `dependencies` of addons that could stop being so include `ember-cli-htmlbars`, `ember-cli-babel`, and `ember-cli-sass`. Readers are invited to count how many copies of each of these appear in their apps today, and think about how nice it will be not to install all of those every time.

This is an example of embracing NPM conventions: best practice is to preprocess the unusual features out of your code before publishing.

## In-Repo Addons

In-repo addons are **addons**, so they have all the same semantics. The only gotcha is that we need them to be resolvable by the node modules resolution algorithm, such that their containing package can import directly from them.

Therefore, a v2 package that contains in-repo addons is responsible for linking or copying them into its own node_modules directory.

## Engines

Engines don’t require any special features in the v2 format.

Non-lazy engines are just addons that have more restrictive resolvers. This makes them already closer to how v2 formatted packages should behave (only accessing things that are in their own **allowed dependencies**).

Lazy engines require special build code today, but all of that is expressible as dynamic `import()`, so we can represent lazy engines in v2 format without introducing the “engine” concept to the v2 format itself. _Remember: the point of the v2 format is that most of the ember-specific knowledge — include what an “engine” is — has already been compiled out into more verbose, spec-defined features._

## Fastboot

Fastboot doesn’t require any special features in the v2 format.

Builds can do different things in fastboot vs browser by using **Build-Time Conditionals**.

Final-stage packagers already tend to have target support that allows them to optimize for browser vs node builds. In both cases they could consume the same v2-formatted packages as input.

All the work that goes into producing the full set of v2 packages is shared between browser and fastboot builds. The only differences are that we would change the build-time config for the ember-cli-fastboot package, and rerun the final stage packager with Node as the target.

## Apps as Packages

Apps are packages. For an app, the v2 publication format is not something you would probably ever publish to NPM. But it’s still important that it exists!

During the build process for an app, it will first build from its authoring format _to the standard v2 package format_. At that point, the whole project is just a collection of standard v2 packages with well-defined semantics, and we can confidently treat that stage in the build pipeline as supported public API.

The benefit of this approach is that we can separately evolve authoring formats and last-stage packaging tools, while keeping a stable interface between them. The stable interface is designed to leverage general-purpose ECMA-spec-compliant features wherever practical, which makes it a rich target.

v2-formatted apps do differ in a few ways from v2-formatted addon, as described in the following sections.

## Features That Apps May Not Use

Several features in the v2 addon format are designed to be consumed _by the app_. These features aren’t appropriate in an app, because that is the end of the line — a v2-formatted app should have no more Ember-specific build semantics.

These features include:

- the `implicit-*` keys in Ember package metadata.
- the `app-js` key in **Ember package metadata**
- the `build` key in **Ember package metadata**. (We should consider updating the _authoring_ format so that apps can use a build file with the standard package hooks, because that makes a lot of sense. But it’s not appropriate in the v2 build output, and this change can be a separate RFC, and it will be an easier RFC after landing this one.)
- automatic inclusion of resolvable types (components, services, etc) from the **Own Javascript** of all **Active Dependencies.**

All these features can appear in v2 _addons_, and the _app_ ensures each one is represented by standards-compliant Javascript within the app’s own code.

One feature that _is_ allowed in a v2 app is the `externals` key in **Ember package metadata**. This is designed to match up with a common feature on existing Javascript packagers that allows them to leave some module references unresolved until runtime.
​​

## App Package Additional Public API

These are features that are only supported in apps, not addons:

- `"assets"`: in **Ember package metadata**, a list of relative paths to files. The intent of `"assets"` is that it declares that each file in the list must result in a valid URL in the final app.

  The most important assets are HTML files. All `contentFor` has already been applied to them. (Remember, we’re talking about the publication format that can be handed to the final stage packager, not necessarily the authoring format.) It is the job of the final stage packager to examine each asset HTML file and decide how to package up all its included assets in a correct and optimal way, emitting a final result HTML file that is rewritten to include the packaged assets.

  Note that packagers must respect the HTML semantics of `<script type="module">` vs `<script>` vs `<script async>`. For example:

  - don’t go looking for `import` in `<script>`, it’s only correct in `<script type="module">`

  File types other than HTML are allowed to appear in `"assets"`. The intent is the same (it means these files must end up in the final build such that they’re addressable by HTTP). For example, a Javascript file in `"assets"` implies that you want that JS file to be addressable in the final app (and we will treat it as a script, not a module, because this is for foreign JS that isn’t going through the typical build system. If you actually want a separate JS file as output of your build, use `import()` instead). This is a catch-all that allows things like your `/public` folder full of arbitrary files to pass through the final stage packager.

  A conventional app will have an `"assets"` list that include `index.html`, `tests/index.html`, and all the files that were copied from `/public`.

- synchronous dynamic imports are allowed in the app’s Javascript. See next subsection.
- `"template-compiler"`: in **Ember package metadata**, the relative path to a module that is capable of compiling all the templates. The module’s exports :
  - `compile: (moduleName: string, templateContents: string) => string` that converts templates into JS modules.
  - `isParallelSafe: boolean`: true if this compiler can be used in other node processes
- `"babel-config"`: in Ember package metadata, the relative path to a module that exports a value with three properties:
  - `config`: the app’s preferred babel settings
  - `isParallelSafe: boolean`: true if the `babel` settings can be used in a new node process.
  - `version`: the version of babel the app's settings were written for.
- Unlike addons, an app’s **Own Javascript** is not limited to only ES latest features. It’s allowed to use any features that work with its exposed `"babel-config"`. This is an optimization — we _could_ logically require apps to follow the same rule as addons and compile down to ES latest before handing off to a final packager. But the final packager is going to run babel anyway, so we allow apps to do all their transpilation in that final single pass.

**Apps can use synchronous dynamic “imports”**

We need to make two small extensions beyond the ECMA spec, because Ember’s resolver is synchronous and dynamic. ECMA import gives us either asynchronous dynamic or synchronous static, but not synchronous dynamic (for a pretty good reason — browsers can’t really load a new dynamic asset synchronously).

Our extensions are:

- `importSync(specifier: string) => Module` a special form with the same syntax and semantics as `import()` except instead of returning a Promise it returns the module object synchronously or throws if it is not available.
- `mayImportSync StringLiteral` a special form that exists to inform a static analyzer that a given specifier might be accessed via `importSync`. Only valid at module scope. Any module that says `mayImportSync "something"` and every module that statically depends on it may safely assume that either `importSync("something")` will succeed or it will fail _at build time._ `mayImportSync` has no runtime semantics (it can compile to nothing by the time we are running in the browser).

In practice, final stage packagers already tend to offer `importSync` semantics (because they compile `import` to a synchronous function). `mayImportSync` is less supported, but given that we are keeping runtime AMD compatibility (see **Named AMD Interop** below), we can express it as `window.define("your-module", [], function(){ return importSync("your-module"); })`.

Q. What is the difference between `mayImportSync "thing"` and `import "thing"`, since both just cause `"thing"` to be statically added to our build?

A. `mayImportSync "thing"` doesn’t _execute_ the dependency. `import "thing"` guarantees that the dependency will be executed before any of the code in your module.

Only app packages can use this capability, not addons. It’s mostly of interest to people who want to integrate new final-stage packagers. Addons don’t need this capability because they delegate the responsibility to the consuming application.

You should think of `mayImportSync` and `importSync` as spec concepts, not literally code that will appear anywhere. In practice, someone integrating a packager can provide us hooks for how to express both of these concepts in terms that their packager understands.

In the future it is worth aligning Ember’s resolver with ECMA by eliminating the need for these extensions. It will require deprecating synchronous container `lookup`, etc, in favor of asynchronous resolution, so we can model is as `import()`.

## Complete input to final stage packagers

A final stage packager receives a directory containing a v2 app package. The app package’s dependencies are resolvable (via normal node rules) to v2 addon packages and non-Ember packages. All the Ember packages have a resolvable dependency on the special `@ember/build-time-config` package, which is built and ready to consume as normal ECMA modules.

## Package Flattening and Linking

One benefit of our current system _not_ respecting node_modules resolution everywhere is that it avoids the worst thing about node_modules: widespread module duplication. Browser applications very rarely want to ship multiple copies of the same dependency simultaneously. It adds bloat, and it can lead to very confusing bugs if duplicated modules have state.

This problem can be compounded when you use `npm link` to develop multiple packages simultaneously, since even if you were careful to flatten down your dependencies, you will suddenly have multiple distinct copies again.

This problem is general to NPM, and I think the solution should be equally general. So in one sense, it’s beyond the scope of this document and the v2 package spec doesn’t need to directly address it. But we should consider the usability impact. Some recommendations to assuage the impact:

- add a linting tool to the default app blueprint that will warn whenever a duplicated package would end up in the browser build. Many final-stage packagers already offer analysis features like this. For example, a webpack-based packager could integrate [duplicate-package-checker-webpack-plugin](https://github.com/darrenscerri/duplicate-package-checker-webpack-plugin) with the Ember build output or test suite.
- consider whether we can use Node’s [preserve symlink](https://nodejs.org/api/cli.html#cli_preserve_symlinks)s option to prevent `npm link` from introducing duplication.
- find or write a utility that does a more sophisticated `npm link` that also back-links all shared dependencies.

One hopeful NPM-ecosystem proposal is [Yarn Plugn’n’Play](https://github.com/yarnpkg/rfcs/pull/101). If that proposal or a similar one moves forward, everything in this spec still works, and only localized changes to our build code would be needed (no ecosystem-wide changes to all addons / packages would be needed).

## Compatibility / How we Ship This

My goal is to make it so we can automatically compile all v1 packages to v2 on demand. This allows us to immediately refactor the ember-cli build pipeline into a clean main path that only handles v2 packages, plus a nicely-encapsulated wrapper around v1 packages that does their precompilation.

We can also make v2 packages work with older ember-cli by taking advantage of the existing `main` key support in **Ember package metadata**. v2 packages will have their true `main` pointing at their **Own Javascript** as described so far, while pointing their `ember-addon.main` at a v2-to-v1 shim. This allows addon authors to begin to update immediately without dropping support for older ember-cli versions.

Addons can immediately begin relying on direct import from NPM by using ember-auto-import as a polyfill. In old ember-cli versions, the ember-auto-import will run. In new ember-cli versions, ember-auto-import can become a no-op. To make this fully align with the v2 build spec, ember-auto-import should gain CSS support to match.

**Named AMD Interop**

Our runtime AMD-based loader does not mesh well with ES module and node_modules resolution semantics. One big difference is that Named AMD `define` is allowed to create a module with whatever name you want, completely disconnected from which NPM package is actually doing the defining. Examples:

- `@ember/component` really gets transpiled into usage of the `Ember` global, which comes from `ember-source`.
- `moment` typically comes from `ember-cli-moment-shim`, which has its own `dependency` on `moment` and dynamically incorporates the right files into the build.
- `qunit` typically comes from `ember-qunit`.

This makes it basically impossible to statically discover all the modules at build time. It would be nice to completely jettison the whole named AMD loader, but in practice it is public API that is widely used. This design _does not_ propose any breaking changes to it.

To describe our interoperability strategy, we must first distinguish “run-time specifiers” and “build-time specifiers”. A run-time specifier (like `@ember/component`) is a name that is able to be `require`'d at runtime. A build-time specifier (like `ember-cli-shims/vendor/ember-cli-shims/app-shims`) is something you can actually `require.resolve` using Node resolution rules.

For many modules, the run-time and build-time specifiers happily coincide (or at least they do once we have run the v1 to v2 compiler step, which (for example) moves `ember-percy/addon/index.js` to `ember-percy/index.js` so that `import { percySnapshot } from` `"ember-percy"` follows normal node_modules resolution. This is the case for all `/app` and `/addon` Javascript that is authored in ES modules. It’s also already true for packages that adopt Module Unification (good job MU authors).

But for many other cases (including the examples like `@ember/component`), the build- and run-time specifiers are different.

The good news is, even though the `define` side is generally too dynamic to analyze, in practice Ember apps overwhelmingly use `import` on the consuming side, which we _can_ analyze. Any `import` specifier that appears in a v1 package can safely be assumed to already be available at runtime (or if it isn’t, the package was already broken and we aren’t making it any worse).

So our solution works like this:

1. Analyze the imports that appear in our package, partitioning them into ones that can be build-time resolved and ones that cannot. This is what ember-auto-import already does.
2. For imports that resolve to files within the same package, rewrite them as relative imports if they aren’t already (node_modules resolution does not allow packages to resolve themselves).
3. For imports that cannot be resolved, list them in the **Ember package metadata** as `externals`.
4. Our final-stage packager (like Webpack or Parcel) should be configured to find externals via our runtime AMD loader.
5. Our final-stage packager integration shall hook itself in as a fallback to `require` (for example, `require('foo')` would first find something that came from a runtime `define('foo', …)`, but then would also try `__webpack_require__('foo')`.

This allows statically-defined modules to depend on dynamically-defined modules (using externals), and it allows dynamically-defined modules to depend on statically-defined modules (because of the fallback hook).

The only failure mode for this design happens if a v1 package was doing a run-time resolution of a specifier that _happens to also be statically resolvable_. For example, if you’re using `ember-cli-moment-shim` to `import` `"moment"`, but you _also_ list `moment` in your package.json dependencies, when you switch to a v2 build you will start getting the direct `moment` and not the shim. In that case, you could get an unexpected version of moment. In practice, I think this is rare, and even when you get the surprising behavior you often wouldn’t get breaking behavior (because people generally don’t stomp on existing module names to provide something entirely different). Keep in mind it’s not sufficient that `moment` happens to be resolvable — we strictly check that you’ve actually listed it as a dependency. So even if `moment` gets hoisted out of `ember-cli-moment-shim`, you’re still safe. It’s only if you actually depend _directly_ on `moment` and `ember-cli-moment-shim` that you would get new behavior.

# How we Teach This

The impact on application authors is very small. As far as I can tell, there is almost nothing new to learn. The only visible API change should be that is becomes possible to `import` directly from any NPM package (as already demonstrated by ember-auto-import), and this is arguably one _less_ thing to learn about for new people, since they may very well already expect that to work.

We could consider deprecating `app.import`, but it can be compiled directly into a script tag that the final stage packagers understand, so it’s not worth deprecating immediately.

The impact on addon authors is more significant. This design is fully backward compatible, and the intention is that all existing addons continue to work (some with worse compatibility hacks than others in the v1-to-v2 compiler). But there will be a demand for addons published in v2 format, since it is expected to result in faster build times. My prediction is that people who are motivated to get their own app build times down will send a lot of PRs to the addons they’re using.

In many cases, converting addons to v2 makes them simpler. For example, today many addons use custom broccoli code to wrap third-party libraries in a fastboot guard that prevents the libraries from trying to load in Node (where they presumably don’t work). In v2, they can drop all that custom build-time code in favor of:

    if (!Fastboot) {
      await import('third-party-library');
    }

This design does _not_ advocate loudly deprecating any v1 addon features. Doing that all at once would be unnecessarily disruptive. I would rather rely on the carrot of faster builds than the stick of deprecation warnings. We can choose to deprecate v1 features in stages at a later time.

# Alternative Designs

This design effectively supersedes both the [Packager RFC](https://github.com/ember-cli/rfcs/blob/master/active/0051-packaging.md) and the [Prebuilt Addons RFC](https://github.com/ember-cli/rfcs/pull/118). So both of those are alternatives to this one.

Packager creates an escape hatch from the existing ember-cli build that is supposed to provide a foundation for many of the same features enabled by this design. The intention was correct, but in my opinion it tries to decompose the build along the wrong abstraction boundaries. It follows the existing pattern within ember-cli of decomposing the build by feature (all app javacript, all addon javascript, all templates, etc) rather than by package (everything from the app, everything from ember-data, everything from ember-power-select, etc), which puts it into direct conflict with the Prebuilt Addons RFC.

The API that packager provides is also incomplete compared with this design. For example, to take the packager output and build it using Webpack, Rollup, or Parcel still requires a significant amount of custom code. Whereas taking a collection of v2 formatted Ember packages and building them with any of those tools requires very little custom code. TODO: link to hopefully more than one working example.

The prebuilt addons RFC addresses build performance by doing the same kind of work-moving as this design. Addons can do much of their building up front, thus saving time when apps are building. But it only achieves a speedup when apps happen to be using the same build options that addons authors happened to publish. This design takes a different approach that preserves complete freedom for app authors to postprocess all addon Javascript, including dead-code-elimination based on the addon features their app is using. The prebuilt addons RFC also doesn’t attempt to specify the contents of the prebuilt trees — it just accepts the current implementation-defined contents. This is problematic because shared builds artifacts are long-lived, so it’s worth trying to align them with very general, spec-compliant semantics.

# Appendix: Standardized Language Extensions

This spec makes some promises about app-build-time behavior that all v2-formatted addons can rely on. This behavior goes beyond "just Javascript" semantics by making some optimizations mandatory. V2-formatted addons that depend on the following packages get optimization guarantees:

- `@ember/build-time-config`
- `ember-cli-htmlbars-inline-precompile`

The details of each should be described elsewhere in this spec.

# Appendix: List of Ember Package Metadata Fields

## app-js

```
Allowed in: addons
Status: intent to deprecate
```

A path to a directory that should be merged with the app's own namespace. This is a backward-compatibility feature, avoiding using it.

## auto-upgraded

```
Allowed in: apps and addons
Status: internal use only
```

Boolean. Marks a package as having been compiled on the fly from v1 to v2. It's probably not a good idea to ever publish a package to NPM with this set.

## babel.fileFilter

```
Allowed in: apps
Status: encouraged
```

Path to a Javascript file that exports a function for testing (absolute) file paths and returning true if that file should be transpiled by our babel config (as defined by `babel.filename`).

## babel.filename

```
Allowed in: apps
Status: encouraged
```

Path to a Javascript file that exports a babel config.

Note that this is for use in apps, which means in _compiled_ apps that are being handed off for final stage packaging. Mostly this is relevant only to authors of final stage packagers.

## babel.isParallelSafe

```
Allowed in: apps
Status: encouraged
```

Boolean that indicates whether it's safe to load our babel config in a new node process.

## babel.majorVersion

```
Allowed in: apps
Status: encouraged
```

Which babel major version is our babel config expecting to run inside.

## build

```
Allowed in: addons
Status: encouraged
```

Path to a package's build-time hooks file.

## assets

```
Allowed in: apps
Status: encouraged
```

List of paths to files (of any type) that must be present as valid URLs in the final output. HTML files are typical assets, but so is anything that we cannot otherwise rule out. For example: everything in `/public` in a traditional Ember app goes into `assets`, since we can't know if anybody expects them to be remain present on the web.

Note that this is for use in apps, which means in _compiled_ apps that are being handed off for final stage packaging. Mostly this is relevant only to authors of final stage packagers.

## externals

```
Allowed in: addons and apps
Status: intent to deprecate
```

List of module names that are used within the package but not statically build-time resolvable.

This is a backward-compatibility feature that allows us to more efficiently bridge the gap between build-time and run-time resolution.

## fastboot-js

```
Allowed in: addons
Status: intent to deprecate
```

A path to a directory that should be merged with the app's own namespace, but only when running in Fastboot. This is a backward-compatibility feature, avoiding using it. New addons can use the macro system to guard fastboot-only imports.

## implicit-modules

```
Allowed in: addons
Status: intent to deprecate
```

List of paths to Javascript modules that must be resolvable at runtime whenever this package is active.

This is a backward-compatibility feature that's used by the v1-to-v2 compiler.

## implicit-scripts

```
Allowed in: addons
Status: use sparingly
```

List of paths to Javascript files that should be included via `<script>` whenever this package is active. This is effectively a drop-in replacement for the old `app.import()` of JS files.

Instead of using this, prefer to directly import the code you need from the place that needs it. But this may still be needed if you're depending on a legacy library that doesn't work in module context.

## implicit-styles

```
Allowed in: addons
Status: use sparingly
```

List of paths to CSS files that should be included as `<link rel="stylesheet">` whenever this package is active.

Prefer instead to express your dependencies on CSS via ECMA import from the places where it's needed.

## implicit-test-modules

```
Allowed in: addons
Status: intent to deprecate
```

Same as `implicit-modules`, but only within `tests/index.html`.

## implicit-test-scripts

```
Allowed in: addons
Status: use sparingly
```

Same as `implicit-scripts`, but only within `tests/index.html`.

## implicit-test-styles

```
Allowed in: addons
Status: use sparingly
```

Same as `implicit-styles`, but only within `tests/index.html`

## main

```
Allowed in: addons
Status: encouraged
```

This field predates the v2 package spec. It's already used by ember-cli to provide an alternative location for the addon's build-time hooks (as opposed to using the top-level `main` from `package.json`). It's definition is unchanged by this spec: old EmberCLI can keep on using this and finding compatible hooks. v2-aware versions of EmberCLI will ignore this in favor of `build`. Addon authors are encouraged to use this field to allow V2 packages to work in older EmberCLI versions.

## public-assets

```
Allowed in: addons
Status: encouraged
```

This is a mapping from local filenames (relative to the addon's root) to
app-relative-URLs. When a given addon is active, any public-assets will be
available at the corresponding URLs.

## renamed-modules

```
Allowed in: addons
Status: intent to deprecate
```

An object that maps old module names to new module names. Any Ember package that consumes this package will rewrite its own imports to follow these renames.

For example, `ember-qunit` emits a module that is importable as `qunit`, which we capture and rename:

```
"renamed-modules": {
  "qunit/index.js": "ember-qunit/qunit/index.js"
}
```

And then in an app that imports `qunit`, our Babel plugin will rewrite:

```diff
-import QUnit from 'qunit';
+import QUnit from 'ember-qunit/qunit';
```

This is a backward compatibility feature and you should stop doing this. Exposing a module under some other package's name is Not Nice.

## renamed-packages

```
Allowed in: addons
Status: intent to deprecate
```

An object that maps old package names to new package names. Any Ember package that consumes this package will rewrite its own imports to follow these renames.

For example, `ember-lodash` renames itself to `lodash`. When we compile it into a v2 package, we generate:

```
"renamed-packages": {
  "lodash": "ember-lodash"
}
```

And then in an app that depends on `ember-lodash`, our Babel plugin will rewrite:

```diff
-import capitalize from 'lodash/capitalize';
+import capitalize from 'ember-lodash/capitalize';
```

This is a backward compatibility feature and you should stop doing this. Exposing a module under some other package's name is Not Nice.

## resolvable-extensions

```
Allowed in: apps
Status: required
```

A list of file extensions that are considered resolvable as modules. In priority order. Example:

```
"resolvable-extensions": [".ts", ".js", ".hbs"]
```

## root-url

```
Allowed in: apps
Status: encouraged
```

The public URL at which the root of the app will be served. Defaults to '/' when not provided.

## template-compiler.filename

```
Allowed in: apps
Status: encouraged
```

Path to a Javascript file that provides the preconfigured HBS template compiler. Stage3 packagers should grab the `compile` function off the default export and just use that.

Note that this is for use in apps, which means in _compiled_ apps that are being handed off for final stage packaging. Mostly this is relevant only to authors of final stage packagers.

## template-compiler.isParalleSafe

```
Allowed in: apps
Status: encouraged
```

Boolean. Indicates whether this template compiler is safe to use in a new node process.

## version

```
Allowed in: addons and apps
Status: encouraged
```

Identifies that a package is v2 spec compatible.


---


# Three Stage Build

> [!NOTE]
> This document used to be part of the readme and more closely represents the Embroider@3 architecture and is being kept here for prosperity. Since Embroider@4 we are now more of a plugin to the final packager, but conceptually you can (mostly) still consider this a three stage build.

This repo implements a new three-stage build system for Ember apps:

1. The first stage achieves backward compatibility by building each classic
   Ember Addon package into a new **v2 package format**. This makes each package
   much more static and analyzable. The eventual goal is to do less and less
   work in this stage, as addons publish to NPM natively in v2 format.

2. The second stage takes a collection of v2-formatted addons plus an
   application and "compiles out" all Ember-specific conventions, such that the
   output can be understood by any tool that can handle standards-compliant
   Javascript. This stage is setup with good inputs and outputs that make it
   much easier to benefit from incremental improvements to our dependency
   analysis. The immediate goal is not to implement every possible optimization,
   but rather to make a good place for those optimizations to happen.

3. The third stage ("final packaging") can be handled by existing tools like
   Webpack, Rollup, or Parcel with only a small amount of configuration. Not
   because we want to force every Ember developer to choose and configure one of
   these tools! But because a stable, standards-compliant API between stage 2
   and 3 improves our ability to innovate and experiment with taking the best
   parts of wider JS ecosystem tooling.


---

# @embroider/core 2.x -> 3.x

## Breaking changes and how to resolve them

1. `unsupported ambiguous syntax`: When using `staticComponents` or `staticHelpers`, we no longer tolerate forms that are ambiguous between components, helpers, and this-property-fallback. For example, if
     ```hbs
     {{thing}}
     ```

     appears by itself in a (non-strict) template, it could mean:
      - a component invocation: `<Thing />`
      - a helper invocation: `{{ (thing) }}`
      - property-this-fallback: `{{this.thing}}`
      
    The benefit of this change is that we can get rid of a lot of gnarly compatbility code that reduced build performance and introduced subtle caveats. 

    Ember itself no longer supports property-this-fallback as of 4.0. And the Ember default blueprint has shipped with a default lint rule for multiple years that tells you not to use `{{thing}}`, in favor of angle bracket invocation or explicit `{{this.thing}}`.

    If you're hitting this problem in your own code, change the ambiguous form to one of the three above unambiguous forms: a component with angle brackets, a helper with parentheses, or an explicit `this.` property.

    If you're hitting this problem in third-party code that you don't want to patch, you can use a packageRule to tell Embroider how to disambiguate the case:

    ```js
    // ember-cli-build.js
    compatBuild(app, Webpack, {
      packageRules: [
        {
          package: 'some-addon',
          semverRange: '<= 5.0',
          addonTemplates: {
            'templates/components/some-component.hbs': {
              disambiguate: {
                // or "helper" or "data"
                'thing': 'component', 
              },
            },
          }
        }
      ]
    })
    ```

2. `unsupported ambiguity between helper and component`: If you have forms that are ambiguous between being a helper and being a component, your settings for `staticComponents` and `staticHelpers` must now agree.

    For example, `{{some-thing value=1}}` could be a component or a helper. If you have code like this, Embroider options like `{ staticHelpers: true, staticComponents: false }` are no longer allowed. They need to both be true or both be false.

    You can fix this problem by either changing the forms to be unambiguous (in the same way as described in the previous section), or by changing one of the `staticCompnents` or `staticHelpers` flags to match the other one.


3. The `safeToIgnore` packageRule used to only suppress an error when a component was not found. Now it prevents us from even trying to resolve the component.

4. We no longer include a workaround for https://github.com/emberjs/ember.js/issues/19877, because Ember backported fixes to every major version that we support. Make sure you're on a supported Ember patch release. The oldest patch we support is ember-source 3.28.11.

    This particular bug is important to us because whenever `staticHelpers` is enabled, we convert all helper invocations to lexically scoped helper invocations. So if you have any class-based helpers and you have `staticHelpers` enabled you definitely need the Ember bugfix.








---

# Frequently asked questions on v2 addons

<!-- Run `npx markdown-toc -i docs/v2-faq.md` to update the TOC here >

<!-- toc -->

- [Authoring](#authoring)
  * [How can I use template tag components?](#how-can-i-use-template-tag-components)
  * [How do I import my addon's own modules?](#how-do-i-import-my-addons-own-modules)
  * [How can I lazy-load my addon's code?](#how-can-i-lazy-load-my-addons-code)
  * [How can I write code depending on the context of the app or its dependencies?](#how-can-i-write-code-depending-on-the-context-of-the-app-or-its-dependencies)
- [Asset handling](#asset-handling)
  * [How can I ship CSS with my addon?](#how-can-i-ship-css-with-my-addon)
  * [How can I ship other static assets with my addon?](#how-can-i-ship-other-static-assets-with-my-addon)
  * [How can I "push" static assets into the app?](#how-can-i-push-static-assets-into-the-app)
- [Build setup](#build-setup)
  * [Why do v2 addons need a build step?](#why-do-v2-addons-need-a-build-step)
  * [How can I integrate with the app's build?](#how-can-i-integrate-with-the-apps-build)
  * [How can I define the public exports of my addon?](#how-can-i-define-the-public-exports-of-my-addon)
  * [How can I provide route templates with my v2 addon?](#how-can-i-provide-route-templates-with-my-v2-addon)

<!-- tocstop -->

## Authoring 

### How can I use template tag components?

`.gjs`/`.gts` components using the new `<template>` tag syntax require a pre-compilation step. The [@embroider/addon-dev](https://github.com/embroider-build/embroider/blob/main/packages/addon-dev/README.md) package provides a rollup plugin for that purpose. In case you don't have that set up yet in your addon's rollup config (assuming you follow the default setup as used by the v2 addon blueprint), you need to add `addon.gjs()` to the list of plugins there. The latest [v2 addon blueprint](https://github.com/embroider-build/addon-blueprint) already comes with the required setup by default.

### How do I import my addon's own modules?

Make sure that you import from your own addon's modules by
* using relative paths. While v1 addons could self-reference their own package name, doing so in v2 addons is subject to resolving through `package.json#exports` as [node does](https://nodejs.org/api/packages.html#self-referencing-a-package-using-its-name), and as such it is recommended in general to use relative imports only.
* including the file extension in the import path so that rollup knows which set of plugins to run over the file.

```ts
import { Something } from './path/to/file.ts';
```

If you've done ESM in node, this should feel familiar, and we can be be consistent with JS imports as well:

```js
import { AnotherThing } from './path/to/file.js';
```

Generally, import:
- gjs with `./path/to/file.gjs`
- gts with `./path/to/file.gts`
- js with `./path/to/file.js`
- ts with `./path/to/file.ts`
- hbs with `./path/to/file.js` or `./path/to/file`

A couple caveats with older, co-located components,
 - for `.hbs` / template-only components, no extension is needed, but the js extension can be used.
 - for co-located components, where the template is in a separate `.hbs` file, you may not import that `.hbs` file directly, because it is merged in with the associated `.js` or `.ts` file.

For consumers of your library, they will not need to worry about the extensions, because:
- rollup compiles away the implementation details (non-js modules)
- package.json#exports declares what is importable under what path, and maps non-extension imports to files with extensions

### How can I lazy-load my addon's code?

Lazy-loading code makes that code not be part of the initial load of the consuming app, but only get loaded later in time when it is actually needed. The means to do that is to not statically import that code, but to use a dynamic `import()`. 

Unlike v1 addons, v2 addons can dynamically import not only external packages but also their own code, like simple modules or even components. You need to make sure though, that these modules are not eagerly loaded elsewhere through static imports. This especially applies to "app re-exports", which basically make the consuming app (statically) import your addon code on your behalf. So when using the common rollup setup with `addon.appReexports()`, make sure the components you want to be able to load lazilly are not covered by the glob patterns supplied to that rollup plugin!


### How can I write code depending on the context of the app or its dependencies?

v2 addons are static packages, that do not integrate with the app's build, thus cannot know anything about the app, its context or its dependencies ahead of time.

For the rare cases where you really need to know something about the app to be able to do the right thing, there is an escape hatch in the form of the `@embroider/macros` package, which is a set of macros that are able to transform your code at build-time of the app. Please refer to its [documentation](../packages/macros/README.md).

## Asset handling

### How can I ship CSS with my addon?

The push-based `/styles` folder that v1 addons used to have is not available for v2 addons. Instead, in a pull-based world, you would need to import the CSS. Importing CSS is explicitly supported in the [v2 Addon Format RFC](https://github.com/emberjs/rfcs/pull/507), and means that whenever a module is loaded, the CSS it imports is guaranteed to have been added to the DOM.

Given that your addon's code is only pulled into the app when you import it, your CSS will also only be used when the module importing that is used itself. Therefore, we would recommend to import only the CSS that you need (say for a specific component) in the place where you need it. A common pattern is to colocate the CSS used for a component next to it, and import it from the component's JavaScript module. In case of a template-only component, you can create a JavaScript module for it that exports [templateOnly()](https://api.emberjs.com/ember/5.2/functions/@ember%2Fcomponent%2Ftemplate-only/templateOnly) and import the CSS from there or convert to a `<template>` tag component.

### How can I ship other static assets with my addon?

Similarily to the way we can ship CSS, we can do the same for other static assets like images by importing them. 
Let's say an addon wants to ship an SVG file and refer to it in a component:

```js
import logo from '../assets/logo.svg';

<template>
  <img src={{logo}} alt='ACME' />
</template>
```

Contrary to the CSS example, this is now not a side-effect only import anymore, but we actually get a value back as the default export of that imported asset: its public URL in the final build output. That's why we can pass this as the value of the `src` attribute in the example above.

A few caveats though! 

First, the ability to import static assets other than CSS is not enabled by default it Ember apps yet. So any Ember app that follows this pattern itself, or consumes a v2 addon doing this, will need to get this set up correctly first. To do so, the user would have to add a module rule to their webpack config, that configures [assets modules](https://webpack.js.org/guides/asset-modules/) for the given file extension(s):

```js
module: {
  rules: [
    {
      test: /\.(svg)$/i,
      type: 'asset/resource', // could also be just 'asset', if you want to have small assets be inlined
    },
  ],
}
```

This would either go into the `autoImport.webpack` part of the [`ember-auto-import` config](https://github.com/embroider-build/ember-auto-import#customizing-build-behavior) for classic builds, or into the `packagerOptions.webpackConfig` part of the [Embroider compat options](https://github.com/embroider-build/embroider#options).

> Note that [RFC763](https://github.com/emberjs/rfcs/pull/763), once it lands, will make this manual setup obsolete, but might also change _slightly_ the way you specify the asset imports.

Furthermore, when using the default v2 addon blueprint and its Rollup config, make sure that the `keepAssets` plugin includes the file extensions that you want to import in your addon:


```js
// rollup.config.mjs
addon.keepAssets(['**/*.css', '**/*.svg']),
```

Lastly, make sure that the only way you refer to the assets is by using the value returned from the import statement, and _not_ assume what the final URL would be. The bundler is free to choose the final URL, as (depending on your config) it will likely apply some fingerprinting (replacing the legacy `broccoli-asset-rev`), or even choose to inline the asset data (when using `type: 'asset'` in the module rule definition).

### How can I "push" static assets into the app?

Another way to provide the consuming app with static assets from your addon is a push-based approach very similar to the `/public` folder of v1 addons. While the pull-based approach above is preferable in general, in cases where you for example do not need to refer to the asset directly, but want to have a predetermined URL, you can choose the push-based approach instead.

This is done by adding some meta data to the addon's `package.json`, specifying a mapping from the addon's file location to the final public URL, as specified in the [v2 addon spec](https://rfcs.emberjs.com/id/0507-embroider-v2-package-format#assets). Let's say an addon wants to provide a favicon file (which browsers will automatically request from the static `/favicon.ico` URL):

```json
{
 "ember-addon": {
    "version": 2,
    "type": "addon",
    "main": "addon-main.cjs",
    "public-assets": {
      "./src/assets/public/favicon.ico": "/favicon.ico"
    }
  }
}
```
 
If you have many files you want to expose this way, you can instead add the `addon.publicAssets()` plugin from `@embroider/addon-dev` to your Rollup config to automate the generation of this mapping data. This rollup plugin will automatically prefix your public assets with a folder name that matches your addon packages name, this is to prevent any name clashes between addons. You can read more about it in the docs for the addon-dev rollup plugin utilities https://github.com/embroider-build/embroider/tree/main/packages/addon-dev#rollup-utilities


## Build setup

### Why do v2 addons need a build step?

The [v2 addon blueprint](https://github.com/embroider-build/addon-blueprint) uses [Rollup](https://rollupjs.org/) for assembling and transpiling your code in to a native npm package that can be imported from anywhere.

While having a build step is not strictly required for v2 addons, there are a few reasons we would want it in general nevertheless:
- use of pre-shipped JS features (decorators, and other in-progress ECMA proposals)
- use of TypeScript
- co-located components are not modules-by-default

The important thing to remember here though is that this build step is very different from the build integration that v1 addons allow! While v1 addons integrate as build-plugins with the app's build and as such all add a bit of overhead to it, the build step of v2 addons happens ahead of time, before they are published to npm. So at the time they are consumed by the app, they are fully static and do _not_ plug into the app's build system.

### How can I integrate with the app's build?

If you really need to add behaviour to the app's build that your addon needs to rely on, the way to go is to provide a plugin to the bundler used by the app (through `ember-auto-import` in a classic build or Embroider), which for now will most likely be [Webpack](https://webpack.js.org/).

If all you need to do is to convert some file your app is supposed to import that is not JavaScript to actual JavaScript, then that's the perfect use case for [Webpack Loaders](https://webpack.js.org/concepts/loaders/), which have a much simplified API compared to a full-fledged plugin. 

The recommnedad setup would be to provide that plugin or loader as a separate package within your addon's monorepo like for example `@my-addon/webpack`. You can then instruct your users to add the required webpack config to their app's config similar as with the [static assets pattern](#how-can-i-ship-other-static-assets-with-my-addon):

```js
module: {
  rules: [
    {
      test: /\.ya?ml$/i, // make this match what files you want to get imported through your loader
      use: '@my-addon/webpack', 
    },
  ],
}
```

### How can I define the public exports of my addon?

You can explicitly define the public exports, i.e. the modules that consumers of your addon can import. It is useful to restrict these consciously, so users can only import what you define as the public API of your addon and not for example private modules or components that are only used internally or only as yielded contextual components.

To do so, you can specify more restrictive patterns as arguments to the `addon.publicEntrypoints()` plugin used in the default `rollup.config.mjs` of the [v2 addon blueprint](https://github.com/embroider-build/addon-blueprint). Entrypoints here are modules that you want users to import from directly. This allows rollup to optimize all other non-entrypoint modules, e.g. to omit them if they aren't used at all (by any entrypoint), or merge them to a single bundle file. 

For example, when your addon exposes a few components at the root level of `src/components`, while having additional nested components that are only used internally, and maybe some utility functions, you might want to prevent importing the nested components, and expose the utility functions only from your main `index.js` file as re-exports. In this case, your rollup config could look like this:

```js
// rollup.config.mjs
addon.publicEntrypoints('index.js', 'components/*.js'),
```

Additionally, there is a feature supported in node.js and modern bundlers to define an `exports` key in your `package.json` with a mapping of export paths to the actual files on disk, that lets you further tweak or constrain your public exports. This is explained in more detail here:
- https://nodejs.org/api/packages.html#package-entry-points
- https://webpack.js.org/guides/package-exports/

When using `package.json#exports` make sure that:
- the `addon.publicEntrypoints(...)` plugin in `rollup.config.mjs` includes _at least_ whatever is defined in `package.json#exports`
- the modules that `addon.appReexports(...)` exposes must have overlap with the `package.json#exports` so that the app-tree merging may import from the addon

### How can I provide route templates with my v2 addon?

During a v2 addon build step, standalone `.hbs` are considered template-only components by default.

If you want your v2 addon to provide a route template, the best way to proceed is to make it a `.gjs` file using [ember-route-template](https://github.com/discourse/ember-route-template). Similarly, if you want to migrate to v2 a classic addon that used to provide `.hbs` route templates, you should refactor the `.hbs` to `.gjs` files to complete the migration.

If for whatever reason the `.gjs` approach cannot be used, it's still possible to have your v2 addon providing the route templates as `.hbs`, but it requires extra configuration. During the build step, Rollup and Babel work together to transform all standalone `.hbs` into template-only components. Therefore, you need to tell both Rollup and Babel to _not_ compile a given list of `.hbs` files this way.

Let's assume your addon has a `templates/` folder that contains all your route templates. The files in `templates/` should be compiled as simple templates (not template-only components).

In the `rollup.config.mjs`, pass a list of glob patterns in the `excludeColocation` option of the function `addon.hbs`:

```js 
addon.hbs({ excludeColocation: ['templates/**/*'] }),
```

In the `babel.config.json`, pass the same list of glob patterns in the `exclude` option of the `template-colocation-plugin`:

```
"plugins": [
  ["@embroider/addon-dev/template-colocation-plugin", {
    exclude: ['templates/**/*']
  }],
],
```

---



---



------------------------
# embroider
------------------------
# @embroider/addon-blueprint

Blueprint for scaffolding ember v2 addons

For migrating a v1 addon to a v2 addon, you may follow _[Porting Addons to V2](https://github.com/embroider-build/embroider/blob/main/PORTING-ADDONS-TO-V2.md)_ and
this blog post [Migrating an Ember addon to the next-gen v2 format
](https://www.kaliber5.de/de/blog/v2-addon_en).

## WIP

This is still work in progress.

The blueprint contains a number of assumptions, e.g. using a monorepo using (`yarn` or `npm`) workspaces, with separate workspaces for the addon and the test-app. But there is plenty of room for bikeshedding here, so if you have suggestions about better ways to set this up, then please file an issue to discuss!

## Usage

```bash
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint --pnpm
```

### Options

For all these options, you'll see a warning printed from `ember-cli` about unsupported options.
`ember-cli` doesn't have a way to detect if flags are used by a blueprint.

#### `--pnpm`

Sets up the new addon with [`pnpm`](https://pnpm.io/) as a default package manager.

Example:

```bash
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint --pnpm
cd my-addon
```

#### `--npm`

Sets up the new addon with `npm` as a default.

Example:

```bash
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint --npm
cd my-addon
```

#### `--yarn`

Sets up the new addon with `yarn` as a default.

Example:

```bash
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint --yarn
cd my-addon
```

#### `--addon-location`

The location / folder name of the addon can be customized via `--addon-location`.

Examples:

```bash
ember addon my-addon -b @embroider/addon-blueprint --addon-location=packages/the-addon
# generates
#   my-addon/packages/the-addon
```

#### `--test-app-location`

The location / folder name of the addon can be customized via `--test-app-location`.

Examples:

```bash
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint --test-app-location=test-app
# generates
#   my-addon/test-app
```

By default, `{test app name}` will be used.

#### `--test-app-name`

The name of the test-app can be customized via `--test-app-name`.

Examples:

```bash
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint --test-app-name=test-app-for-my-addon
# generates
#   my-addon/test-app-for-my-addon
```

By default, `test-app` will be used.

#### `--addon-only`

Will only create the addon, similar to the v1 addon behavior of `ember addon my-addon`.
This is useful for incremental migrations of v1 addons to v2 addons where the process from the
[Porting Addons to V2](https://github.com/embroider-build/embroider/blob/main/PORTING-ADDONS-TO-V2.md)
guide.

```bash
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint --addon-only
# generates non-monorepo:
#   my-addon/
#     .git
#     package.json
```

For incremental migration in monorepos, you'll want to also supply the `--skip-git` flag.

#### `--typescript`

Sets up the new addon with [`typescript`](https://www.typescriptlang.org/) support.

Example:

```bash
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint --typescript
```

### Updating the addon

The blueprint supports `ember-cli-update` to update your addon with any changes that occurred in the blueprint since you created the addon. So to update your addons boilerplate, simply run `ember-cli-update` (or `npx ember-cli-update` if you haven't installed it globally).

For additional instructions, please consult its [documentation](https://github.com/ember-cli/ember-cli-update).

### In existing monorepos

To generate a new v2 addon inside an existing monorepo, `cd` to that repo's directory and run the command as usual. The blueprint will auto-detect an existing `package.json` and adapt to it. Specifically it will not create or override any files at the root folder, like the `package.json` itself.

Most likely though you would not want to use the default locations for the addon and the test app. Instead you should establish a convention how multiple addons and test-apps are located. With the aforementioned path options you can then make the blueprint emit the packages in the correct place.

Some more things to pay attention to:

- Pass the package manager option ( `--npm`, `--yarn`, `--pnpm`) that you already use!
- Make sure that the chosen addon and test-app locations are all covered by the configured workspace layout of your package manager!
- Each package should have a distinct name, so make provide unique names for your test apps instead of the default `test-app` by using the `--test-app-name` option.
- There is no `start` script at the root `package.json` anymore to start both the addon's build and the test app in watch mode. So you would have to run that `start` script with your package manager in both locations in parallel (separate terminal windows/tabs).
- Pass the `skip-git` option to not auto-commit the generated files. Most likely there will be things to adapt to you specific requirements before committing.
- The blueprint will omit all files usually generated at the root folder, including `.prettierrc.js`, and instead use whatever you have already defined in your existing monorepo. So you should run the `lint:fix` script for both the addon and the test-app, and eventually address any non-fixable linting issues or other configuration conventions related to your specific setup.

Some examples...

#### Group by name

We group by the name of the addon, the addon's package and its test app are co-located sub-folders:

```
project-monorepo
└── addons
    ├── my-addon
    │   ├── package
    │   └── test-app
    └── ...
```

[//]: # 'to edit this: https://tree.nathanfriend.io/?s=(%27options!(%27fancy!true~fullPath3~trailingSlash3~rootDot3)~4(%274%27project-monorepo02addons05my-addon0*5package0*5test-app05...%27)~version!%271%27)*%20%200%5Cn5-%203!false4source!5*2%0154320*'

To generate this run:

```bash
cd project-monorepo
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint \
  --skip-git \
  --skip-npm \
  --addon-location="addons/my-addon/package" \
  --test-app-name="test-app-for-my-addon" \
  --test-app-location="addons/my-addon/test-app"
```

#### Group by type

Addons and test-apps are separated:

```
project-monorepo
├── addons
│   ├── my-addon
│   └── ...
└── tests
    ├── my-addon
    └── ...
```

[//]: # 'to edit this: https://tree.nathanfriend.io/?s=(%27options!(%27fancy!true~fullPath2~trailingSlash2~rootDot2)~5(%275%27project-monorepo04738904test39%27)~version!%271%27)*0640862!false3s*my-74-%205source!6%20%207addon8%5Cn9*...%01987654320*'

To generate this run:

```bash
cd project-monorepo
npx ember-cli@latest addon my-addon -b @embroider/addon-blueprint \
  --skip-git \
  --skip-npm \
  --addon-location="addons/my-addon" \
  --test-app-name="test-app-for-my-addon" \
  --test-app-location="tests/my-addon"
```

## License

This project is licensed under the [MIT License](LICENSE.md).


---



---



------------------------
# embroider
------------------------
# @embroider/app-blueprint

**Very** experimental blueprint for scaffolding Ember v2 apps with Vite

> [!WARNING]
> This blueprint is a preview of the [v2 app blueprint](https://rfcs.emberjs.com/id/0977-v2-app-format) and uses alpha versions of the upcoming Embroider release. When the RFC has reached the "Released" stage, and the upcoming Embroider release has been marked stable, you should be ok to use this blueprint; until then, only use this blueprint if you know what you're doing.

This is likely to change on a daily basis so you have to keep up to date with the changes to expect it work. Use [ember-cli-update](https://github.com/ember-cli/ember-cli-update) to update to the latest version.

## Usage

### Generating a brand new app

This following command will create a new folder called `my-fancy-app` in your cwd 

```bash
npx ember-cli@latest new my-fancy-app -b @embroider/app-blueprint --pnpm
```

### Updating an existing Ember app

If you want to try to update an existing app you can run this command **inside** your app's directory:

```bash
pnpx ember-cli@latest init -b @embroider/app-blueprint --pnpm --name your-app-name
```

it will prompt you to override some files and you should say yes to every override. 

Note: replace `your-app-name` with your existing app name (from the `package.json` file) for a smaller diff.

### Updating the blueprint version

Use [ember-cli-update](https://github.com/ember-cli/ember-cli-update) to update to later versions of the blueprint:

```bash
pnpm dlx ember-cli-update
```


---



---

