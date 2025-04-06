

-----------------------------------------------------------

username: michalbryxi
github_username: MichalBryxi
twitter_username: MichalBryxi
---
title: Embroider & Vite & net::ERR_ABORTED 504 (Outdated Optimize Dep)
published: true
description: A bit cryptic error message and possible solution
tags: EmberJS, Vite, Embroider
cover_image: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lhyteqz0lfw6x8wbgx76.jpeg
# Use a ratio of 100:42 for best results.
# published_at: 2025-03-30 15:22 +0000
---

While working on [EmberJS](https://emberjs.com) projects, I've been using pre-alpha version of [@embroider/app-blueprint](https://github.com/embroider-build/app-blueprint) quite a lot lately and I hit a baffling error:

1) App builds and everything works
2) Sometimes, when the dev server is restarted (`ctrl+c` & `pnpm start`), the network tab of the app fails many requests with:
```
GET
http://localhost:4200/node_modules/.vite/deps/ember-source_@ember_application_index__js.js?v=4536db21
net::ERR_ABORTED 504 (Outdated Optimize Dep)
```
3) Nothing helps: Wiping `node_modules`; Setting the server to run with `vite --force`; Getting earlier versions of the app;
4) Sometimes everything builds fine and I can develop without any issue.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/l0e6rggbhzjhzjsx882n.png)



I discussed [this very issue on EmberJS Discord](https://discord.com/channels/480462759797063690/568935504288940056/1355811390450958356) and was pointed to pay attention at the console build errors, which actually *did* have some weird messages in it. I just never paid attention, because initially everything built fine:

```
pnpm start

> nuudel-to-ics@0.0.0 start /Users/michal/pudr.com/nuudel-to-ics
> vite --force

- Building

Environment: development

- Building

- building... 



Build successful (276ms)

9:45:36 AM [vite] (client) Forced re-optimization of dependencies

Slowest Nodes (totalTime >= 5%) | Total (avg)
-+-
Babel: ember-tracked-storage-polyfill (1) | 115ms
Funnel (109) | 33ms (0 ms)
BroccoliMergeTrees (202) | 31ms (0 ms)
Babel: ember-intl (2) | 21ms (10 ms)
@embroider/compat/addons (1) | 15ms



  VITE v6.2.3  ready in 2638 ms

  ➜  Local:   http://localhost:4200/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
✘ [ERROR] Cannot read file: /Users/michal/pudr.com/nuudel-to-ics/node_modules/.pnpm/object-inspect@1.13.4/node_modules/object-inspect/util.inspect

    node_modules/.pnpm/object-inspect@1.13.4/node_modules/object-inspect/index.js:54:26:
      54 │ var utilInspect = require('./util.inspect');
         ╵                           ~~~~~~~~~~~~~~~~

9:45:44 AM [vite] (client) error while updating dependencies:
Error: Build failed with 1 error:
node_modules/.pnpm/object-inspect@1.13.4/node_modules/object-inspect/index.js:54:26: ERROR: Cannot read file: /Users/michal/pudr.com/nuudel-to-ics/node_modules/.pnpm/object-inspect@1.13.4/node_modules/object-inspect/util.inspect
    at failureErrorWithLog (/Users/michal/pudr.com/nuudel-to-ics/node_modules/.pnpm/esbuild@0.25.1/node_modules/esbuild/lib/main.js:1477:15)
    at /Users/michal/pudr.com/nuudel-to-ics/node_modules/.pnpm/esbuild@0.25.1/node_modules/esbuild/lib/main.js:946:25
    at /Users/michal/pudr.com/nuudel-to-ics/node_modules/.pnpm/esbuild@0.25.1/node_modules/esbuild/lib/main.js:1355:9
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
```

So now the issue is actually about `✘ [ERROR] Cannot read file: /Users/michal/pudr.com/nuudel-to-ics/node_modules/.pnpm/object-inspect@1.13.4/node_modules/object-inspect/util.inspect` resp. the package `object-inspect` itself. And the advice I got is to [exclude it from optimisations](https://vite.dev/config/dep-optimization-options)

So that's what I did by adding few lines to `vite.config.mjs`:

```js
// vite.config.mjs

export default defineConfig({
  optimizeDeps: {
    exclude: ['object-inspect'],
  },
});
```

And since then the app builds and I seem to never get this error.

-----------------------------------------------------------

username: michalbryxi
github_username: MichalBryxi
twitter_username: MichalBryxi
---
title: How to disable ember/no-empty-glimmer-component-classes
published: true
description: This pesky little error appears a lot in modern gjs/gts components.
tags: EmberJS, linting, eslint,
cover_image: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5j7x34etx8cz47op80q8.jpg
# Use a ratio of 100:42 for best results.
# published_at: 2025-03-29 12:37 +0000
---

Well technically in any `*.js/*.ts` file, but my 🧠 just got stuck on "this has to be part of ember-template-lint config", because I've seen a component that is basically _just HTML_.

At the end of the day, the linter rule is about _JavaScript_ classes.

So if anyone bumps into this, the answer is NOT to put the config in `.template-lintrc.js`, but to `eslint.config.mjs` (or equivalent), in following way:

```js
// eslint.config.mjs

export default ts.config(
  {
    files: ['**/*.{ts,gts}'],
    languageOptions: {
      parser: ember.parser,
      parserOptions: parserOptions.esm.ts,
    },
    extends: [...ts.configs.recommendedTypeChecked, ember.configs.gts],
    rules: {
      'ember/no-empty-glimmer-component-classes': 'off',
    },
  },
);
```

-----------------------------------------------------------

username: bendemboski
github_username: bendemboski
twitter_username: null
I recently upgraded all the packages in our very large monorepo to the Ember 6.1 app blueprint. The [pretty modest file-by-file diff](https://github.com/ember-cli/ember-new-output/compare/v6.0.0...v6.1.0) that appears to just upgrade some dependencies and switch to the new `eslint` flat config file format belies some very exciting and impactful changes to the code validations that `eslint` performs.

My pull request that upgrades to Ember 6.1 and updates all of our code to comply with the new default linting configuration included 13 commits containing changes to 12,100 lines of code across 1,155 files! This was virtually all driven by the change from `@typescript-eslint`'s [recommended](https://github.com/ember-cli/ember-cli/blob/90d269b086dc3a1cc3c8b1e8d4451aa66f326c8a/blueprints/app/files/.eslintrc.js#L32) configuration to its [recommendedTypechecked](https://github.com/ember-cli/ember-cli/blob/f4dcab6fcb3126190133f7b1e2870eb7dd1b0603/blueprints/app/files/_ts_eslint.config.mjs#L92) configuration.

I learned a lot in the process of updating all of our code to comply with the new linting configuration, and I wrote a fairly long and detailed PR description to share what I learned with my team, so I figured I'd share it with the broader community in case it's helpful for others. And here it is!

---

Ember 6.1 includes some big linting updates, described below. So this PR updates us to Ember 6.1, including some miscellaneous/minor blueprint updates, but the bulk of it is making our codebase conform to the new linting rules.

## New linting setup

One very notable change in the linting setup is that for `ts` and `gts` files, we've started using [linting with type information](https://typescript-eslint.io/getting-started/typed-linting/), which allows us to use linting rules that are much more powerful and helpful. The major implications of this are described below.

## [@typescript-eslint/no-unused-vars](https://typescript-eslint.io/rules/no-unused-vars/)

This rule was updated to also flag unused variables in `catch` statements, so where we used to do

```ts
try {
  doSomething();
} catch (e) {
  // ignore
}
```

we can now omit the variable declaration entirely and use a syntax I didn't even realize was allowed:

```ts
try {
  doSomething();
} catch {
  // ignore
}
```

## [@typescript-eslint/unbound-method](https://typescript-eslint.io/rules/unbound-method/)

This rule helps us make sure we don't call methods with `this` bound incorrectly, e.g.

```ts
class Thingy {
  private readonly obj = { key: 'value' };

  setObjValue(val: string) {
    this.obj.key = val;
  }
}

let thingy = new Thingy();
let setObjValue = thingy.setObjValue;
// whoops, `this` will be `null`, so `this.obj.key`
// with throw an error
setObjValue('hello');
```

When I was fixing up our code to comply with this rule, I encountered some "false positives" that I addressed in a few different ways, and are informative for writing code in the future to comply with this rule.

The false positives mainly have to do with the fuzzy distinction between a class method and a property that happens to be a function. Consider:

```ts
class Thingy {
  classMethod() {}
  readonly propertyThatIsAFunction = () => {};
}
const thingy = new Thingy();

// unsafe because if `classMethod` references `this`, calling
// `classMethod()` won't have `this` bound correctly
const classMethod = thingy.classMethod;

// safe because arrow functions have `this` "pre-bound"
const propertyThatIsAFunction = thingy.propertyThatIsAFunction;
```

This doesn't just apply to classes, but also to objects, i.e. the above would be exactly the same with an object in place of the class & class instantiation:

```ts
const thingy = {
  classMethod() {},
  propertyThatIsAFunction: someFunction,
};
```

So, when this this rule flags something you are doing as an error, you can create an arrow function:

```ts
const classMethod = () => thingy.classMethod();
```

or bind it when saving it off:

```ts
const classMethod = thingy.classMethod.bind(thingy);
```

or if you have access to the original class and it seems to make sense, convert the method itself in the class definition to an inline arrow function:

```ts
class Thingy {
  readonly classMethod = () => {};
}

// or

const thingy = {
  classMethod: () => {};
}
```

## `any`-related linting

One of the risks of using values typed as `any` is that they can "leak" out into a much bigger footprint of code than it seems like. For example,

```ts
// Suppose `create-object` is typed so that `createObject()` returns
// `{ value: string }`
import createObject from 'create-object';

let object = createObject();
// fine
object.value;
// type error
object.subObject.value;
```

Now, if `create-object` lacked type information,

```ts
// @ts-expect-error no types
// createObject is typed as `any`
import createObject from 'create-object';

// `object` is typed as `any`
let object = createObject();
// fine
object.value;
// also fine at compile-time, but will throw an error at runtime
object.subObject.value;
```

Basically, as soon as you have a value typed as `any`, any values you derive from it (via property accesses, function calls, etc etc) will be `any` and the compiler won't be able to do any meaningful type checking on those values.

We've had `@typescript-eslint/no-explicit-any` enabled for quite some time, but this just prevents us from explicitly typing a value as `any`. There are a bunch of cases where a value can be _implicitly_ typed as `any`, and this rule is meant to "contain the damage."

There a many many cases where this rule flags errors, and many ways of addressing those errors, but here are some common ones I ran into:

#### inherently untyped values

When calling `JSON.parse()` or `await fetchResponse.json()` or the like, there is no static type information -- we, the programmer, have to tell the compiler what kind of value we expect to get from deserializing the JSON string into an object. So here, we just have to cast it, e.g. `let myResult = JSON.parse(str) as MyResult;`. Sometimes the type isn't defined as a named type and it doesn't seem worthwhile to create a named type, so you can just do `let { value } = JSON.parse(str) as { value: string };`.

#### catch blocks

In JavaScript, you can throw anything, not just `Error` objects. `throw 'whoops'` or even `throw undefined` are perfectly valid (although bad practice, and we have a linting rule to prevent us from doing it in our code). So in catch blocks, even though we generally treat the thrown value as an `Error`, we don't actually know what it is.

Up until recently in our TypeScript configuration (where we had [useUnknownInCatchVariables](https://www.typescriptlang.org/tsconfig/#useUnknownInCatchVariables) disabled), variables in catch blocks were typed as `any` (mainly to ease the transition of code from un-typed JavaScript where we play fast and loose with our types to TypeScript). So this new rule flags pretty much any (hah!) usage of the caught variable as an error, and requires an explicit cast. NB, once this was done it wasn't much additional work to enable `useUnknownInCatchVariables`, which I did, so now these variables in `catch` blocks are typed as `unknown` and the compiler (as opposed to the linter) won't let us do anything with them without casting/type-narrowing.

To be as risk-averse as possible, we should ideally always use `instanceof` checks or type guards or whatever to ensure that the thrown thing is of a type that is compatible with what we expect, e.g.

```ts
try {
  doThing();
} catch (e) {
  if (e instanceof Error) {
    reportErrorMessage(e.message);
  } else if (typeof e === 'string') {
    reportErrorMessage(e);
  } else {
    reportErrorMessage('unknown error');
  }
}
```

But this is a big pain, and given that we lint against throwing non-Error objects for our code, it should generally be an edge case, so in cases like the above I pretty much always did something like

```ts
try {
  doThing();
} catch (e) {
  reportErrorMessage((e as Error).message);
}
```

and I think that's fine for us to do in general unless we're in an area of the code where we're particularly worried about what might be thrown (e.g. from external code) or want to be extra defensive.

#### error-typed and poorly-typed values

By "error-typed values" I mean ones where we use `@ts-expect-error` to tell the compiler to not worry about the fact that we're doing something it doesn't understand, and then it types any values that come out of that statement as `any`. By poorly-typed values I mean places where we intentionally use "any" such as the `context` in the `ModalManager` (typically because we haven't yet taken the effort to figure out how to type it correctly).

In both of these cases, if you can't fix the underlying problem, just cast. For example,

```ts
// @ts-expect-error no types
import createObject from 'create-object';

let obj = createObject() as {
  key: string;
  stats: { count: number }
};
let count = obj.stats.count;
```

or even (although the former is probably preferable in most cases)

```ts
// @ts-expect-error no types
import createObject from 'create-object';

// leave it typed as `any`
let obj = createObject();
// we don't care about `key` here, so don't bother to include it
let count = (obj as { stats: { count: number } }).stats.count;
```

## promise/async-related linting

We now have linting rules that verify a bunch of things related the async/await and promises, and force us to be more thoughtful and intentional about our async/promise handling, which produces safer code. The two most significant rules are:

#### [@typescript-eslint/require-await](https://typescript-eslint.io/rules/require-await/)

This rule requires that `async` functions either have an `await` statement in them, or explicitly return a promise. When this rule flags an error, you probably want to just remove the `async` keyword from the function, making it synchronous. However, in some cases you might be passing the function to an API that requires a promise-returning function, so just removing the `async` keyword produces a type error. In this case you can leave the `async` and wrap any return values in `Promise.resolve()` e.g. `return Promise.resolve('result')` or just `return Promise.resolve()` if the function returns `void`.

#### [@typescript-eslint/no-floating-promises](https://typescript-eslint.io/rules/no-floating-promises/)

This rule prevents us from "ignoring" promises. For example, if you call an `async` function, you have to do one of the following:

```ts
// await the returned promise
await asyncThing();
// store the promise in a variable
const promise = asyncThing();
// pass the promise to a function
handlePromise(asyncThing());
// apply a `.catch()` handler to it
asyncThing().catch((e) => /* ... */);
// explicitly ignore it with the `void` operator
void asyncThing()
```

This is meant to ensure that we don't accidentally discard promises that we should be handling, both to prevent async/race condition/timing errors, and to make sure that if the promise rejects, it isn't an unhandled rejection (which can cause us to miss errors or, in Node, to cause the process to exit).

This rule forces us to think more carefully about our use of asynchronous functions, and whether they are actually asynchronous at the API level, or whether they just have asynchronous behavior as an internal implementation detail. Consider:

```ts
async function getFromServer(url: string) {
  let response = await fetch(url);
  return response.json();
}

async function setAndTrack(obj: Thing) {
  obj.value = 'hello';
  // get some stats from the object (async operation) and send them to a metrics service
  let stats = await obj.getStats();
  await sendTracksToMetricsService(stats);
}
```

In the first case, the caller would `await` the function call, and the async-ness is actually a part of the function's API -- getting from the server is inherently asynchronous and the caller needs to wait for the result. In the second case, the caller would not `await` the function call because metrics tracking is a side-effect and the fact that it's asynchronous is an implementation detail. So the second function's API is synchronous, we are just making the function `async` so we get the convenient `await` syntax, rather than having to use promise chaining:

```ts
function setBroadcast(obj: Thing) {
  obj.value = 'hello';
  // get some stats from the object (async operation) and send them to a metrics service
  obj.getStats().then((stats) =>
    sendTracksToMetricsService(stats)
  ).catch((e) => /* handle error */);
}
```

So, if we had the original `async` implementation of `setBroadcast`, it would be correct to call it without `await`ing it because the caller doesn't want to wait for the metrics tracking to complete before proceeding. But this would trigger a linting error. In this case, it's telling us that the function's API should really be synchronous, and we should rewrite the function to not be `async` (rather than having all the call sites add a `void` or `catch()`).

In this case, we can have our cake and eat it too using an async [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE):

```ts
function setBroadcast(obj: Thing) {
  obj.value = 'hello';

  (async () => {
    // get some stats from the object (async operation) and send them to a metrics service
    let stats = await obj.getStats();
    await sendTracksToMetricsService(stats);
  })().catch((e) => /* handle error */);
}
```

In cases where we truly do want to invoke an async function but not wait for it to complete before proceeding, it's probably best to

```ts
doAsyncThing().catch(captureException);
```

or in very rare cases where we're pretty darn confident it's not going to throw an error

```ts
void doReallySafeAsyncThing();
```

-----------------------------------------------------------

username: arnaudweyts
github_username: ArnaudWeyts
twitter_username: ArnaudWeyts
---
title: Supporting classic Ember asset fingerprinting in Embroider
published: true
description: This blog post is about how Lighthouse switched fingerprinting of assets from classic to embroider.
tags: ember, embroider, fingerprinting, webpack
# cover_image: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kwp5o6xvcdj89wm75lfd.jpg
# Use a ratio of 100:42 for best results.
# published_at: 2025-01-21 10:10 +0000
---

## TL;DR

Handling asset fingerprinting in Embroider still needs some polish. But there are ways to try out and use the RFC's that are eventually going to be productionized.

## What is fingerprinting?

### Assets

Let's start with the basics: assets. In the context of a web app this could mean a stylesheet, a javascript file, an image, a json file, etc. The browser caches these assets on the visitor's machine by default, which is great for performance! However when you're trying to make sure your users get the latest experience of your web app, you'll need a way to bust the cache and force a network request to updated assets.

### Busting the cache

There are several ways to implement cache busting in your app. We'll be digging into the most common one: adding a unique identifier to your files. This technique usually involves appending a "contenthash" to all of your files. This unique identifier is calculated based on the file contents. If your file content changes, the hash will update.

![Assets with unique identifiers shown in the Chrome devtools](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/egrvkbcgfzw0r6ww9uj6.png)

_Assets with unique identifiers shown in the Chrome devtools_

## Implementation in classic Ember apps

In classic Ember apps, asset fingerprinting is done using a "push-based" approach. This essentially means that all assets (build output and public folder) are inspected and a unique identifier is added for each asset. The references to these assets are subsequently updated to reflect the new name. Classic Ember apps make use of [broccoli-asset-rev](https://github.com/ember-cli/broccoli-asset-rev).

```html
<img src="/images/bar.png" />
<script src="assets/appname.js">
```

```css
background: url('/images/foo.png');
```

Gets translated into:

```html
<img src="/images/bar-895d6c098476507e26bb40ecc8c1333d.png" />
<script src="assets/appname-342b0f87ea609e6d349c7925d86bd597.js">
```

```css
background: url('/images/foo-735d6c098496507e26bb40ecc8c1394d.png');
```

This approach has worked in the past, but comes with a lot of caveats. There's no direct link between an asset and its reference because the package uses a series of regular expressions to identify an asset url. This can result in unexpected issues like the asset not getting fingerprinted when trying to refer to it using a dynamically built string. Embroider and ember-auto-import can help alleviate this problem, so let's have a look.

## Implementation in Embroider apps

In Embroider, fingerprinting is delegated to the build tool (Webpack, Vite) and no longer embedded by the framework. This opens up possibilities for different approaches. The Ember community has worked on defining a recommended approach in the [Asset importing spec RFC](https://rfcs.emberjs.com/id/0763-asset-importing-spec/). This RFC recommends switching to a "pull-based" approach. By having direct references to assets in the code instead of plain strings, the build tool can determine the link up more easily. If an asset is not present, it can result in a build error.

While the RFC isn't truly implemented yet, we can achieve a similar "pull-based" approach ourselves by configuring the Webpack config in Embroider.

```js
class extends Component {
  myImage = import.meta.resolve('./hello.png');
}
```

```hbs
<img src={{this.myImage}} />
```

_RFC proposal on how an image could be referenced._

### Configuration

Webpack actually supports importing assets out of the box. Granted you configure the correct "loader". For images you can make use of the [asset/resource](https://webpack.js.org/guides/asset-management/#loading-images) loader. Let's take a look at how this would be configured in Embroider:

```js
// ember-cli-build.js
const { Webpack } = require('@embroider/webpack');
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {});
  const packagerOptions = {
    webpackConfig: {
      module: {
        rules: [
          {
            test: /\.(png|jpe?g|gif|svg)$/i,
            type: 'asset/resource',
          },
        ],
      },
    },
  };

  return require('@embroider/compat').compatBuild(app, Webpack, {
    packagerOptions,
  });
};
```

In this code snippet, we've configured imports to `.png`, `jp(e)g`, `.gif` and `.svg` files to be handled by Webpack's `asset/resource` loader. This means we can now do this in our app:

```js
import FooImage from './foo.png';

class extends Component {
  fooImage = FooImage;
}
```

```hbs
{{!
 the string will now resolve to the file's location
 as determined by webpack!
}}
<img src={{this.fooImage}} />
```

Tada! Simple right? The `asset/resource` loader has several configuration options which can be used to customize the exact path and filename, you can refer to the docs for more info. Similar loaders exist for other assets like stylesheets or json files.

### Assets referenced from css

#### Plain CSS

Allright, works great for assets referenced from javascript or templates, but what about assets referenced from stylesheets? If you're using plain CSS, this should just work out of the box with Embroider. Embroider's Webpack package already pre-configures the correct loaders to handle style compilation.

#### Sass

If you're using a package like `ember-cli-sass` to handle stylesheets, you'll need to move away from this package and switch to [sass-loader](https://webpack.js.org/loaders/sass-loader/) in combination with [css-loader](https://webpack.js.org/loaders/css-loader/) instead.

> Since the `app/styles` directory is reserved by Embroider for plain CSS files, you'll have to rename the directory to something else. We chose `scss` for now.

Once all of this is done, you can import your `app.scss` file in `app.(js|ts)` and you're all set!

```js
// app.js
import 'app-name/scss/app.scss';
```

### Co-location vs Separation of concerns

The [Asset importing spec RFC](https://rfcs.emberjs.com/id/0763-asset-importing-spec/) promotes co-location of assets, which is a change we have not covered so far. In essence, it means that you should put your asset as close as possible to its reference(s) as you can. Where as previously all of the assets were stored in one root `public` folder, you would now store an image referenced in a component right next to the component itself.

#### Having a mix of both

If co-location and explicit import statements to assets might not be the ideal solution for you, there's an in-between solution available. It involves making use of a spec that's already implemented in [Vite](https://vite.dev/guide/features#glob-import) and for which there's also an Ember RFC available: [Wildcard Module Import API](https://rfcs.emberjs.com/id/0939-import-glob/). This RFC would introduce `import.meta.glob` as an alternative to import multiple files at once using a wildcard pattern:

```js
const assets = import.meta.glob('../static/**/*.*', {
  eager: true,
});
```

##### babel-plugin-transform-vite-meta-glob

Since this RFC is not implemented yet, we'll need to set it up ourselves. This is where the [babel-plugin-transform-vite-meta-glob](https://github.com/OpenSourceRaidGuild/babel-vite/tree/main/packages/babel-plugin-transform-vite-meta-glob) babel plugin comes in. It will translate the `import.meta.glob` statement to explicit import statements under the hood:

```js
// app-name/utils/asset-map.js
const assets = import.meta.glob('../static/**/*.*', {
  eager: true,
});

export default assets;
```

Becomes:

```js
// app-name/utils/asset-map.js
import foo from "../static/images/foo.png";

const assets = {
  "../static/images/foo.png": foo,
};

export default assets;
```

So essentially, the babel plugin will do the explicit work for us so that in turn, Webpack can process these imports.

##### import-asset helper

After the asset-map is automatically generated, you can write a simple  `import-asset` helper function on top of this to easily grab references to assets from either javascript or handlebars:

```js
// app/helpers/import-asset
import assetMap from 'app-name/utils/asset-map';

export default function importAsset(assetPath) {
  return assetMap[`../static/${assetPath}`];
}

```

```hbs
<img src={{import-asset 'images/foo.png'}} />
```

```js
import importAsset from 'app-name/helpers/import-asset';

class extends Component {
  fooImage = importAsset('images/foo.png');
}
```

> It should be noted that the babel-plugin mentioned is marked as "not safe to use in production". And some of the specification seems to be implemented incorrectly, for which I've opened a fix [PR](https://github.com/OpenSourceRaidGuild/babel-vite/pull/58).

## Conclusion

The final approach mentioned in this article minimizes the changes needed to adopt the new asset specification of Embroider, while keeping fingerprinting and a single asset folder around. However I must stress that co-location is the recommended way forward and as new features like [single file components](https://guides.emberjs.com/release/components/template-tag-format/) are hitting the Ember mainstream, supporting assets would look very similar to how it's done in other frameworks/libraries.

In general, it seems like Embroider still needs some polish in the area of fingerprinting and asset management. As Embroider is still [actively being developed](https://github.com/embroider-build/embroider), anyone can contribute to getting the mentioned RFC's implemented. So I recommend everyone to read through them and try it out for themselves so we can gather feedback.


-----------------------------------------------------------

username: michalbryxi
github_username: MichalBryxi
twitter_username: MichalBryxi
---
title: Add custom layer to embe-leaflet
published: true
description: What if you need want to register custom component with ember-leaflet? 
tags: EmberJS, JavaScript, LeafletJS
cover_image: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wxnpdje7ciioa0cxeafs.jpeg
---

## The problem

[ember-leaflet](https://miguelcobain.github.io/ember-leaflet/) is a very popular addon from [EmberJS](https://emberjs.com/) ecosystem that allows a lot of flexibility.

But what if I want to extend it's functionality so that it can do even more? And what if I want it as a new yielded component directly from the `<LeafletMap>`s `layers`? 

## The solution

At first we will need our new component. For simplicity this component will just extend an existing layer component from the addon. Let's use the `marker` component and make it so that it just ignores location argument and sets a fake, hardcoded value:

```gts
// app/components/fake-marker-layer.gts

import MarkerLayer from 'ember-leaflet/components/marker-layer';

export default class FakeMarkerLayer extends MarkerLayer {
  get location() {
    return this.L.latLng(46.68, 7.85);
  }
}
```

After this we will need to register the component with `ember-leaflet` service:

```ts
// app/instance-initializers/leaflet.ts

import FakeMarkerLayer from '../components/fake-marker-layer';
import type Owner from '@ember/owner';

export function initialize(owner: Owner) {
  const emberLeafletService = owner.lookup('service:ember-leaflet');

  if (emberLeafletService) {
    emberLeafletService.registerComponent('fake-marker-layer', {
      as: 'fake-marker',
      component: FakeMarkerLayer,
    });
  }
}

export default {
  initialize,
};
```

And now we can use it:

```gts
import LeafletMap from 'ember-leaflet/components/leaflet-map';

<template>
  <LeafletMap
    @lat={{46.6}}
    @lng={{7.8}}
    @zoom={{15}}
    as |layers|
  >
    <layers.fake-marker @lat={{999.99}} @lng={{0}} />
  </LeafletMap>
</template>
```

## Notes

You can read on this technique also [on the official ember-leaflet documentation page](https://miguelcobain.github.io/ember-leaflet/docs/addons).

-----------------------------------------------------------

username: snowmanzzz
github_username: null
twitter_username: null


-----------------------------------------------------------

username: michalbryxi
github_username: MichalBryxi
twitter_username: MichalBryxi
---
title: ERR_PNPM_BAD_PM_VERSION This project is configured to use vX of pnpm. Your current pnpm is vY
published: true
description: If you've ever seen a ERR_PNPM_BAD_PM_VERSION when running the ember command, you might be running into a global vs local issue.
tags: EmberJS, JavaScript, PNPM, corepack
cover_image: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/iwf1z11rnsayyx2u6cfp.jpg
---

## The problem

If you started using [corepack](https://nodejs.org/api/corepack.html) to manage versions of your _package manager_ you might have bumped into a very curious case of two _very similar_ commands returning _different results_:

```sh
# Calling `pnpm` directly, this works perfectly fine:
> pnpm install
Lockfile is up to date, resolution step is skipped
Already up to date
Done in 1.5s

# Calling `pnpm` through `ember-cli`, this one fails:
> ember install ember-leaflet
🚧  Installing packages... This might take a couple of minutes.
Command failed with exit code 1: pnpm add --save-dev ember-leaflet
 ERR_PNPM_BAD_PM_VERSION  
This project is configured to use v9.7.0 of pnpm.
Your current pnpm is v9.1.2
```

You might have tried (like me) to "fix the project" by running:

```sh
> corepack prepare pnpm@9.7.0 --activate
> corepack use pnpm@9.7.0
> corepack install --global pnpm@9.7.0
```

But the result would be still the same.

## The analysis

What is the issue here? Why do we have enforced `v9.7.0` everywhere, but `ember` command uses `v9.1.2` somehow?

If you run version check from within your project you will, indeed, get the correct version:

```sh
> cd ~/my-project
> pnpm --version
9.7.0
```

But if you run the same command from somewhere else (your home) directory, you will get the "wrong" version:

```sh
> cd ~
> pnpm --version
9.1.2
```

Which is a clue. Now let's take a look at where did the `ember` in your `ember install ember-leaflet` command came from:

```sh
> cd ~/my-project
> which ember
/Users/michal/Library/pnpm/ember
```

Aha! So it's my **global** `ember-cli` installation and not the project one (which lives in `~/my-project/node_modules/ember-cli/bin/ember`).

## Solution

### Local

If you want to use **in project** installed version of `ember-cli`, you can do so by executing the `ember` command via `pnpm exec`:

```sh
> pnpm exec ember install ember-leaflet
```

### Global

Or you can pin the **global version** of `pnpm` to the version matching your project:

```sh
> corepack install --global pnpm@9.7.0
> pnpm --version
9.7.0
> cd ~/my-project
> ember install ember-leaflet
🚧  Installing packages... This might take a couple of minutes.
pnpm: Installed leaflet@^1.9.3
Installed addon package.
```

#### pnpm managed by corepack

If you want to solve the **global** version mismatch, you **might** bump into an issue where `pnpm` was [installed](https://pnpm.io/installation) from different sources than `corepack` and changing the version within `corepack` would not influence what version is executed as the _other_ installation would take precedence.

I don't have a straightforward solution for this as it **heavily depends** on your situation and what setup you want to run, but if you (like me) want to just keep using `corepack` for managing your `pnpm` versions you might try following:

1. `brew uninstall pnpm`
2. `npm uninstall pnpm -g`
3. Follow the [uninstalling pnpm](https://pnpm.io/uninstall) docs
4. Remove any references of `PNPM_HOME` from your shell config (`~/.zshrc`)
5. Reload your shell config (`~/.zshrc`)
6. `corepack install --global pnpm@9.7.0`
7. Check what version is now _globally_ available by running in your home directory: `pnpm --version`

#### Home directory shenanigans

It _might_ happen that when you're in your home directory `pnpm --version` command still shows _some other_ version than your global one. Why is that? Well `corepack` uses [packageManager](https://pnpm.io/npmrc#manage-package-manager-versions) field in your `package.json` to determine if it should use _local_ version instead of the _global_ one. And it might be that your home directory contains `package.json` file and thus it looks like a project folder. Simply remove this file, you very likely created it by accident and don't want `package.json` in `~` directory.

---

Illustration made by ChatGPT v4o using prompt: "Confused hamster looking at spaghetti of source code, trying to make sense of it --ar 16:9"

-----------------------------------------------------------

username: ijlee2
github_username: ijlee2
twitter_username: null
Both [Embroider](https://github.com/embroider-build/embroider) and `pnpm` ask that packages declare their dependencies correctly: List a dependency (if and only) if it is used.

This is difficult to do when working on a large monorepo (consider an Ember app with many Ember addons and Node packages) that uses `yarn@v1`. Developers can forget to update the `package.json`'s, because the Ember app can build and run even when a dependency is missing, as long as it gets pulled in from another package.

So neither build nor run can tell us if some package didn't declare its dependencies right. How else can we fix the `package.json`'s so that we can introduce Embroider and `pnpm`?


## 1. Static code analysis

Given a file, we can see which dependencies should be present, because we know how JavaScript and Ember work.

For example, were a JavaScript (or TypeScript) file to show,

```ts
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest as upstreamSetupRenderingTest } from 'ember-qunit';

export function setupRenderingTest(hooks, options) {
  upstreamSetupRenderingTest(hooks, options);

  // Additional setup for rendering tests can be done here.
  setupIntl(hooks, 'de-de');
}
```

we would tell from the import statements that the package depends on `ember-intl` and `ember-qunit`.

And, if a template file were to show,

```hbs
{{page-title "My App"}}

<WelcomePage />

{{outlet}}
```

our knowledge of Ember and its addon ecosystem would direct us to `ember-page-title`, `ember-welcome-page`, and `ember-source`, respectively.

Even when things are implicit (e.g. ambiguity in double curly braces, module resolution, service injection), we can guess the origin of an entity (entities are components, helpers, modifiers, services, etc.) with high accuracy, thanks to Ember's strong conventions.


## 2. Codemod

Still, we shouldn't check every file in every package manually. That's time-consuming and error-prone.

Instead, we write a codemod (really, a linter) using [`@codemod-utils`](https://github.com/ijlee2/codemod-utils). For every package, the codemod parses what's relevant and creates a list of dependencies that should be present ("actual"). It then compares the list to that from `package.json` ("expected").

To analyze implicit code, there needs to be a list of known entities (a one-time creation), which maps every package that we want to consider to its entities. We can use a `Map` to record that information.

```ts
const KNOWN_ENTITIES = new Map([
  [
    'ember-intl',
    {
      helpers: [
        'format-date',
        'format-list',
        'format-message',
        'format-number',
        'format-relative',
        'format-time',
        't',
      ],
      services: ['intl'],
    },
  ],
  [
    'ember-page-title',
    {
      helpers: ['page-title'],
      services: ['page-title'],
    },
  ],
  [
    'ember-welcome-page',
    {
      components: ['welcome-page'],
    },
  ],
]);
```

Even explicit code like import statements aren't trivial to analyze. Take the following example:

```ts
import Route from '@ember/routing/route';
import fetch from 'fetch';
```

When we don't provide the right context (i.e. this code is for Ember), the codemod would consider `@ember/routing` and `fetch` as dependencies, instead of `ember-source` and (likely) `ember-fetch`. The codemod should present its analysis in such a way that we can easily check for false positives and false negatives.

```
// Results for my-package-37

{
  missingDependencies: [
    'ember-asset-loader',
    'ember-truth-helpers'
  ],
  unusedDependencies: [
    '@babel/core',
    'ember-auto-import',
    'ember-cli-babel'
  ],
  unknowns: [
    'Service - host-router (addon/routes/registration.ts)',
  ]
}
```


## 3. Results

The codemod that I had built (in a couple of days) analyzed a production repo with 123 packages in 25 seconds. There were a total of 11,108 files, but the codemod knew to analyze only 5,506 of them (less than half). That's an average of 0.005 seconds/file and 0.20 seconds/package!

To learn more about writing codemods, check out the main tutorial from [`@codemod-utils`](https://github.com/ijlee2/codemod-utils).


-----------------------------------------------------------

username: elgordino
github_username: elgordino
twitter_username: null
---
title: Migrate from ember-cli-deploy-sentry to sentry-cli
published: true
description: ember-cli-deploy-sentry is no longer maintained. This is a quick guide for how to replace it with sentry-cli
tags: emberjs,sentry
# cover_image: https://direct_url_to_image.jpg
# Use a ratio of 100:42 for best results.
# published_at: 2024-07-16 08:48 +0000
---

[ember-cli-deploy-sentry](https://github.com/dschmidt/ember-cli-deploy-sentry) is a plugin for Ember that pushes sourcemaps and releases to Sentry when Ember is deployed.

However it is no longer maintained, and since Sentry released sentry-cli, no longer required.

Get started by [installing sentry-cli](https://docs.sentry.io/cli/installation/)

By default `ember deploy` does not retain the assets after the deploy. To retain them and subsequently submit to Sentry you need to specify a path to store them. Do this by adding   `ENV.build.outputPath = 'build-output-path';` to your `deploy.js`. Obviously change `build-output-path` with an appropriate location.

The run the following commands where `$SENTRY_ORG_SLUG`, `$SENTRY_PROJECT_SLUG` are what they sound like, and `$SENTRY_RELEASE` is what you want to call the release in Sentry.

```sh
$ ember deploy ....
$ cd build-output-path
$ sentry-cli releases --org $SENTRY_ORG_SLUG --project $SENTRY_PROJECT_SLUG new $SENTRY_RELEASE
$ sentry-cli sourcemaps  --org $SENTRY_ORG_SLUG --project $SENTRY_PROJECT_SLUG --release $SENTRY_RELEASE  upload .
$ sentry-cli releases set-commits $SENTRY_RELEASE --local  --ignore-missing
$ sentry-cli releases --org $SENTRY_ORG_SLUG --project $SENTRY_PROJECT_SLUG finalize $SENTRY_RELEASE
```

If you have integrated your repo with Sentry then you will need to [update the `set-commits` line](https://docs.sentry.io/cli/releases/#commit-integration). 

Also note that if `build-output-path` is outside the git repo for the project you should `cd` back into to the repo before running the `set-commits` command.

-----------------------------------------------------------

username: ignace
github_username: IgnaceMaes
twitter_username: Ignace_Maes
The integrated web UI test runner in Ember is a convenient way to run your tests. If you've been using the default QUnit theme, it might not surprise you that it was designed over ten years ago.

As of the latest release of [`ember-qunit`](https://github.com/emberjs/ember-qunit/releases/tag/v8.1.0), support for theming has been added. The [`qunit-theme-ember`](https://www.npmjs.com/package/qunit-theme-ember), a modern theme based on the Ember styleguide, has been included as a built-in option. Here's how to enable it in your app:

First, create an Ember app if you haven't already.

```sh
npx ember-cli new example-app --embroider --pnpm
```

If you already have an app, make sure `ember-qunit` version `8.1.0` or above is used as dependency.

```sh
pnpm install -D ember-qunit@^8.1.0
```

Next, install [`@embroider/macros`](https://www.npmjs.com/package/@embroider/macros) to be able to pass configuration options to `ember-qunit`.

```sh
pnpm install -D @embroider/macros
```

Now configuration options can be set in the `ember-cli-build.js` file. Add the following to the file:

```diff
module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // Add options here
+    '@embroider/macros': {
+      setConfig: {
+        'ember-qunit': {
+          theme: 'ember',
+        },
+      },
+    },
  });

  // ...
};
```

And that's it 🎉

Simply restart your dev server and go to `http://localhost:4200/tests` to see it in action.

-----------------------------------------------------------

username: nullvoxpopuli
github_username: NullVoxPopuli
twitter_username: nullvoxpopuli
---
title: Effects in Ember
published: true
description: 
tags: 
- ember
- effect
- javascript
# cover_image: https://images.unsplash.com/photo-1531574595918-cb77c99fe5e2?q=80&w=1959&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
# Use a ratio of 100:42 for best results.
published_at: 2024-06-07 15:17 +0000
---

Originally from [How to make an effect in Ember?](https://discuss.emberjs.com/t/how-to-make-an-effect-in-ember/20520?u=nullvoxpopuli)

@trusktr asks:

> What’s the equivalent of Solid.js `createEffect()` (or React `useEffect()`, Meteor `Tracker.autorun()`, MobX `autorun()`, Vue `watchEffect()`, Svelte `$effect()`, Angular `effect()`) in Ember.js?


This is certainly shocking to folks new to ember, but ember deliberately doesn't have an any effect by default.

Now, as a _framework_ author, the concept does  _sort of_ exist (at a high level) -- but I'll circle back around to this in a smidge.

In your Solid demo, if you want to log function calls, you'd do:

```js
const a = () => 1;
const b = () => 2;
const c = () => 3;

<template>
  {{log (a) (b) (c)}}
</template>
```
Some notes on function invocation syntax, if needed
- [Glimmer Tutorial: Transforming Data](https://tutorial.glimdown.com/1-introduction/3-transforming-data)
- https://cheatsheet.glimmer.nullvoxpopuli.com/docs/templates#template__notation

We use templates as the sole entrypoint to reactivity, whereas solid's reactivity is more general purpose.  With templates, and being DOM focused ([for now](https://github.com/emberjs/ember.js/issues/20648)), we can ask ourselves:

> "If the user can't see the data rendered, does the data need to exist?"

Now, you're demo (with logging) is definitely effect-y. And if you _had no other way_ (like the situation was somehow impossible to model in a derived data way), you can do this:
```js
function myLog() {
  console.log(a(), b(), c());
}

<template>
  {{ (myLog) }}
</template>
```
This would auto-track, so as the consumed tracked data accessed from each of `a`, `b`, and `c` changed, `myLog` would get to re-run. 
However, this has a caveat: data may not be _set_ within `myLog`, else an infinite render loop would occur.

This is covered here
- [Glimmer Tutorial: _synchronizing state_](https://tutorial.glimdown.com/2-reactivity/10-synchronizing-external-state) (to the console in this  case)


There is a way around the above caveat, not being able to set during render, by making `myLog` invoke an async-IIFE, and waiting a tiny bit (i.e.: setting slightly after render):
```js
// now we're passing in the args directly so that they
// are tracked (all args are auto-tracked in all
// function / helper / component / modifier execution
// coming from the template)
function myLog(...args) {
  async function run() {
    await 0;
    // causes a change in a's data
    // and because we awaited, we don't infinite loop 
    setA(); 
    // prints a pre-setA, because a was passed in
    console.log(...args);
  }
 // return nothing, render nothing 
 // (we have no result to show the user)
}

<template>
  {{myLog (a) (b) (c)}}
</template>
```

This is nuanced, and is why I made this tiny abstraction a whole thing over here https://reactive.nullvoxpopuli.com/functions/sync.sync.html
it's 95% documentation, 5% code :sweat_smile: 

------

So coming back to:

> "We deliberately don't have effects"

Because of a couple current facts about our ecosystem:
- we want derived data to be preferred, because it is the most efficient way to have your render state settle
- calling a function from a template can only happen after the template is rendered, so doing so causes a _second render_ (I believe this is true in React as well) 
- there _is_ a need to synchronize external state, and that has been part of the exploration of _Resources_, and `Sync`
  - [Starbeam Docs on `Sync`](https://newdocs-rho.vercel.app/docs/universal/fundamentals/sync.html)
  - [Starbeam Docs on `Resource`s](https://www.starbeamjs.com/guides/fundamentals/resources.html)
    - Current ember implementation does not have `sync` capabilities: [ember-resources](https://github.com/NullVoxPopuli/ember-resources/tree/main/docs) (due to limitations of the private APIs implementing reactivity (ember-resources is public-API only))
    - [Tutorial Chapters on Resources](https://tutorial.glimdown.com/2-reactivity/5-resources) 
- we think that effects are _overused_ and a huge footgun (for app devs), so by documenting a story more around synchronizing external state, we can continue to guide devs in to a pit of success.

Note: Starbeam is where we're extracting our reactivity primitives, and are planning to swap to Starbeam entirely at some point once we work out some composition ergonomics for serial Resources (the coloring problem).


Hope this helps! 
If anything is unclear or if you have more questions, let me know!

-----------------------------------------------------------

username: nullvoxpopuli
github_username: NullVoxPopuli
twitter_username: nullvoxpopuli
---
title: "unsupported ambiguity between helper and component"
published: true
description: an error you may encounter while modernizing your ember apps
tags: ember, javascript, modern
# cover_image: https://direct_url_to_image.jpg
# Use a ratio of 100:42 for best results.
# published_at: 2023-10-30 23:14 +0000
---

This error occurs when you're progressing towards a modern ember app and have the following situation in your embroider options:
```js
staticHelpers: true,
staticComponents: false,
```
and you reference a helper, such as `{{t}}` from [`ember-intl`](https://github.com/ember-intl/ember-intl).

Here is the full text: 
```
<path to source of issue>: 
  unsupported ambiguity between helper and component: 
    this use of "{{t}}" could be helper "{{ (t) }}" or
    component "<T />", and your settings for 
    staticHelpers and staticComponents do not agree. 
  Either switch to one of the unambiguous forms, 
    or make staticHelpers and staticComponents agree, 
    or use a "disambiguate" packageRule to work around 
    the problem if its in third-party code you cannot 
    easily fix. 
  in <path to source of issue>
```

To resolve, in your `ember-cli-build.js`, you want:

```js
 const { Webpack } = require('@embroider/webpack');

  return require('@embroider/compat').compatBuild(app, Webpack, {
    // ...
    staticHelpers: true,
    staticComponents: true,
    // ...
  });
```

When both of these options are true, there is no more ambiguity with curly syntax (`{{ }}`) -- if it exists, it will be either a helper or a component, we don't need to guess at runtime anymore.

-----------------------------------------------------------

username: antoniobajivic
github_username: antoniobajivic
twitter_username: null
## Integrations are a big part of any software, but **they’re crucial to the functionality of a tool like Productive**.

That’s why we decided to dedicate a post series to discussing the importance of integrations in Productive. From enhancing functionality by connecting different tools to streamlining processes and improving user experience, integrations make life easier. We’ll showcase one of our most-used integrations, the one between Productive and Xero, which allows users to seamlessly transfer invoices and synchronize payments between the two tools.

Your agency uses Productive for managing client projects and project financials. At month’s end, you face the daunting task of issuing and sending invoices upon invoices, then replicating the process in Xero. Afterward, you also have to individually mark each payment as received.

And this is where the power of integrations kicks in. With one simple integration, invoices are synced between Xero and Productive, and any payment received in Xero is automatically recorded in Productive.

The integration between Productive and Xero looks interesting, right?

But before actually using the integration, we need to set it up first, and that’s the main focus of this blog post! We’re exploring the implementation of the OAuth 2.0 protocol.

Let’s dive right in!

## First, How Do You Connect Xero and Productive?

OAuth 2.0 (Open Authorization 2.0) is an authentication protocol that is considered an industry standard.

Utilizing the OAuth protocol, Productive is granted access to the Xero account without accessing the user’s credentials.

Key features of the OAuth 2.0 protocol:

- Granular access control

- Authentication without sharing credentials

- Token-based authentication (`access_token` & `refresh_token`)


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nhkutma7lj2lyru2n16c.png)


In the following steps, the authentication process is explained:


#### 1. The user authorizes Productive, granting access to their own data on the Xero platform:


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q42oxtfts4tp5j7w5kw6.png)



#### 2. After successful authentication, the user is redirected back to the `redirect_uri` defined in the previous step with two values added as query params:

- `code` → short-lived token that needs to be exchanged for `access_token`
- `state` → serves as protection against Cross-Site Request Forgery (CSRF) attacks: if the received state attribute value does not match the value submitted in the previous step, the authentication process is terminated

Ensuring the redirection of users back to the Productive app is a crucial aspect of the OAuth flow due to the sensitivity of the information contained in the `redirect_uri`.
To ensure the user’s redirection to the correct location, we have securely stored the redirect URI within the Xero app.

#### 3. Exchanging the verification code (`code`) for an access token (`access_token`):


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dbjelombnyjra20ocjda.png)




#### 4. Retrieving the generated tokens:


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vjufqwzf4x8pjxhkfa0k.png)



`access_token` is used to call the Xero API, while the `refresh_token` is used to refresh the access token once it has expired.


#### 5. Retrieving and selecting the tenant whose resources are being accessed:

Each user can have multiple Xero organizations (referred to as tenants).
Xero requires that the `xero_tenant_id` field is sent as a header param in every HTTP request.

The following code snippet shows the retrieval of all available tenants, from which the user later selects a tenant for current integration in the Marketplace settings:


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3snvl141anhrmadhx8mt.png)



## Now, Let's Create an Integration

In Productive, as well as in many other applications, there is a list of applications called the marketplace. In the _marketplace_, customers choose the integration they want to use. When the integration is selected, the connection process begins by clicking the “Connect app” button. The connection flow will be demonstrated using the example of Xero.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8sje1ufpgubfzkulijnt.png)



### 1. Creating and Connecting An Integration

When establishing an integration, it’s generated in the system. However, to ensure its successful creation, it must align with the authentication requirements on the backend. All integrations require a redirect URI. This URI is used to redirect to Productive after connecting the integration to adjust the settings of each integration. After generating the URI, the integration creation process begins.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ezhvtdl7ewsgcord0yq4.png)


If the organization has branches or subsidiaries, you’ll first need to select the subsidiary (branch) for which you want to use Xero.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b6cd1sve8f7wtwn2yljm.png)


When creating an integration on the backend, authentication verification is performed, and if all requirements are met, the integration process begins.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z255nydvuzmtvpuvpixp.png)


During the integration connection, the customer is directed to the interface of the system they want to integrate with, where they also need to provide information to verify if the user is existing and valid. Once completed, the process returns to the marketplace via the redirect URI, initiating the setup of the integration.



### 2. Redirect

After the customer is redirected to Productive, the data obtained from the external tool is set on the integration model. For example, Xero requires that there is always a code and org representing the code and organization to which the integration connects and exports data in Xero.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2oxyusun19z9kg1vh3ih.png)


Once the integration model has been updated, a call to the backend occurs again to update the integration with new data.

After updating the model, if there are no errors, we set the parameters of the model to transition to the integration setup route, i.e., editing the integration settings.



## Conclusion

With successful authentication and integration connection, we’re finishing the first part of the integration posts series. As described in this blog post, understanding OAuth 2.0 becomes not just a necessity but a powerful tool to enhance user experience, safeguard sensitive information, and foster a more trustworthy digital ecosystem. After successful authentication, due to settings related to the external system redirect, in this case, Xero, it brings us back to Productive to continue with further integration setup. 

Before we end this blog post, I want to emphasize that the backend part was written by my colleague @bartic. 

In our next post, we’ll break down data mapping and show you why it’s a must-know for smooth integrations. Don’t miss out!


-----------------------------------------------------------

username: michalbryxi
github_username: MichalBryxi
twitter_username: MichalBryxi
[Ember](https://emberjs.com/) pioneered the standardised usage of [global cli tool](https://cli.emberjs.com/). This is a perfect way to give new users a good onboarding experience as well as existing users power tools for daily usage.

Config for ember-cli lives in `~/.ember-cli` and is merged with `my-project/.ember-cli` file, if applicable.

The [format of `.ember-cli` file](https://cli.emberjs.com/release/appendix/configuration/) is as follows:

> Command line options are passed in a dasherized form on the command line but they must be in camel cased in .ember-cli.

So you can run `ember help` in your terminal and then use the formula above to convert the cli options to config file options.

## Example

This is the global `~/.ember-cli` I'm using in my setup:

```json
{
  "welcome": false,
  "packageManager": "pnpm",
  "embroider": true,
  "typescript": true
}
```

---

Title image generated by Midjourney via prompt: `Command line ninja; The ninja is actually a hamster; --ar 16:9`

-----------------------------------------------------------

username: eugenioenko
github_username: eugenioenko
twitter_username: null
## Introduction:

Ember.js, a robust JavaScript framework for building ambitious web applications, has gained popularity for its convention over configuration approach and developer-friendly features. To enhance data fetching and management in Ember applications, integrating GraphQL is a powerful choice. In this article, we'll explore how to unleash the capabilities of GraphQL in your Ember app using [Glimmer Apollo](https://glimmer-apollo.com/).


## 1. Starting new Ember Project

We can create a new Ember project by using `ember-cli`. If you don't have it already installed, its as simple as 

```bash
yarn global add ember-cli
or 
npm install -g ember-cli
```

Once you have `ember-cli` installed, to create a new Ember project:

```bash
ember new my-project-name
cd my-project-name
```

## 2. Adding Typescript Support (optional)

This step is not strictly necessary but without it, you won't get the benefit of type checking on your queries.
Installing ember-cli-typescript allows to write ember component using typescript instead of javascript.

```bash
yarn add --dev ember-cli-typescript
```


## 3. Installing Glimmer Apollo and Dependencies

We will be using [Glimmer Apollo](https://glimmer-apollo.com/) to integrate the Apollo Client. To install the necessary dependencies:

```bash
yarn add -dev glimmer-apollo @apollo/client graphql
```
Thats it, all the Glimmer Apollo dependencies are installed

## 4. Configuring Apollo Client

To be able to use Apollo Client, we need to configure it and create an instance of the client first. 
Create a script file in your project, in this example we are gonna be using `/app/config/apollo.ts`

```typescript
// Import the setClient function from the "glimmer-apollo" package.
import { setClient } from "glimmer-apollo";

// Import necessary Apollo Client modules.
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client/core";

// Define a function that sets up and configures the Apollo Client.
export default function setupApolloClient(context: object): void {
  // Create an HTTP link that points to the GraphQL server.
  const httpLink = createHttpLink({
    uri: "https://graphqlzero.almansi.me/api",
  });

  // Create an in-memory cache for Apollo Client to store data.
  const cache = new InMemoryCache();

  // Create an instance of Apollo Client with the configured link and cache.
  const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
  });

  // Set the Apollo Client instance on the provided context object.
  setClient(context, apolloClient);
}
```

The previous code imports the necessary modules from the "apollo/client/core" package, including the ApolloClient class, InMemoryCache, and createHttpLink function. The setupApolloClient function is then defined, which creates an HTTP link pointing to a GraphQL server (in this case, "https://graphqlzero.almansi.me/api" which is a mock graphql api), an in-memory cache for storing Apollo Client data, and finally, an instance of the Apollo Client with the configured link and cache. The created Apollo Client instance is then set on the provided context object using the setClient function from the "glimmer-apollo" package. 

Remember to update the `createHttpLink` `uri` parameter to the url of your Graphql api

Finally, to  instantiate the previous initialization code, we can use Embers [Instance Initializer](https://guides.emberjs.com/release/applications/initializers/).

Application instance initializers are run as an application instance is loaded. They provide a way to configure the initial state of your application, as well as to set up dependency injections that are local to the application instance.

To create an Instance Initializer for our Apollo Client configuration you can execute:

```bash
ember generate instance-initializer apollo
```

Or simple create a file `/app/instance-initializer/apollo.ts`

```typescript
import setupApolloClient from "../config/apollo";

export default {
  initialize: setupApolloClient,
};
```

We set the `setupApolloClient` function exported from previous step so that it is run once the application instance is loaded.

And thats it, Glimmer Apollo is ready to be used!

## 4. Adding 1st Graphql Query

Lets create our first Graphql query and used in a component. We can do so by creating the following files. 

```
app
└── components
    └── first-query
        ├── index.hbs
        ├── index.ts
        └── resources.ts
```

### 4.1 Defining Glimmer Apolllo Query in resources.ts

The api we are using for this tutorial has quit a few queries defined, you can explore the schema here: [https://graphqlzero.almansi.me/api](https://graphqlzero.almansi.me/api)

For this tutorial we are gonna be fetching the a user name by his id. We can achieve that with the following query 

```typescript
export function useUserByIdQuery<T extends UseQuery<any, any>>(
  ctx: Object,
  args?: T["args"]
): T["return"] {
  return useQuery(ctx, () => [
    gql`
      query UserById($id: ID!) {
        user(id: $id) {
          id
          name
        }
      }
    `,
    args ? args() : {},
  ]);
}
```
There are three important parts to this code. 

The query section `query UserById($id: ID!) {` where we define the query we want to execute. 

The `UseQuery<any, any>` defines the type of the arguments the query receives and the type of data the query returns. For now  its `<any, any>` but we will fix it in the step 5.


### 4.2 Using the Glimmer Apollo Query in our component class 

```bash
import Component from "@glimmer/component";
import { useUserByIdQuery } from "./resources";

export default class FirstQuery extends Component {
  query = useUserByIdQuery(this, () => ({
    variables: {
      id: 1,
    },
  }));
}
```
The `useUserByIdQuery` takes in two arguments. 
First is the context for the execution of the query. Usually this will be the instance of the component in which the query is used. Its required so that Glimmer Apollo can cleanup properly the resources after the component is destroyed.

Second argument is a list of arguments to pass to the Apollo Client to modify how the query is executed. More [info here](https://www.apollographql.com/docs/react/data/queries/) 

We need to pass the Id of the user we want to fetch. We can do that by passing it as the `variables` property of the arguments

### 4.3 Fetching the data in the template

```hbs
{{#if this.query.loading}}
  loading...
{{else if this.query.error}}
  {{this.query.error}}
{{else if this.query.data}}
  {{this.query.data.user.name}}
{{/if}}
```

When we access the `loading` or `data` properties of the query, Glimmer Apollo will execute the query and fetch the data making it available in the `data` property. And if there was an `error` it will set the `error` property of the query.

Finally, to view this in action, use the `<FirstQuery />` component.

One thing to note is that the variables passed to the query are reactive. If the variable is a tracked variable, when its  value changes the query will execute again. 


```typescript
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { useUserByIdQuery } from "./resources";

export default class FirstQuery extends Component {
  @tracked userId = 1;

  query = useUserByIdQuery(this, () => ({
    variables: {
      id: this.userId,
    },
  }));
}
```

If we change the value of `this.userId = 2` the query will execute again and fetch the data for user with Id 2.


## 5. Adding Graphql Code Generator (optional)

GraphQL Code Generator is a plugin-based tool that helps you get the best out of your GraphQL stack.

From back-end to front-end, GraphQL Code Generator automates the generation of:

Typed Queries, Mutations and, Subscriptions for React, Vue, Angular, Next.js, Svelte, Ember whether you are using Apollo Client, URQL or, React Query.
Typed GraphQL resolvers, for any Node.js (GraphQL Yoga, GraphQL Modules, TypeGraphQL or Apollo) or Java GraphQL server.

To add `graphql-codegen` to our project:

```bash
yarn add --dev @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/named-operations-object
```

After the dependency is installed we need to initiate the code generator. This can be done by executing:


Add the following config in the root of the project `codegen.yml`

```yml
overwrite: true
hooks:
  afterAllFileWrite:
    - prettier --write
schema: [
  'https://graphqlzero.almansi.me/api',
]
documents: 'app/**/*.{graphql,ts}'
generates:
  types/graphqlzero-api/index.d.ts::
    plugins:
      - typescript
      - typescript-operations
  app/utils/gql-operations.ts:
    plugins:
      - named-operations-object
    config:
      identifierName: namedOperations
  tests/mocks/schema.graphql:
    plugins:
      - schema-ast
```

The key properties of this config are

- `schema`: the url of the graphql-api schema
- `documents`: the list of files that should be scanned for graphql queries
- `plugins`: sets the plugins used for the code generation

Now you can generate the typescript types for your queries. And also a list of the queries and mutations by name which comes in handy for mock testing. To do that, execute `graphql-codegen` by passing the config file:

```bash
graphql-codegen --config codegen.yml
```

You can also make it more accessible by adding this line in the scripts of `pacakge.json` 


```json
 "codegen": "graphql-codegen --config codegen.yml"
```

After the graphql types are generated, we can now update our query to include the proper types. Lets revisit how the `resources.ts` file looks like for our `FirstQuery` component:


```typescript
import { gql, useQuery } from "glimmer-apollo";
import type { UseQuery } from "glimmer-apollo";
import type { UserByIdQuery, UserByIdQueryVariables } from "graphqlzero-api";

export function useUserByIdQuery<T extends UseQuery<UserByIdQuery, UserByIdQueryVariables>>(
  ctx: Object,
  args?: T["args"]
): T["return"] {
  return useQuery(ctx, () => [
    gql`
      query UserById($id: ID!) {
        user(id: $id) {
          id
          name
        }
      }
    `,
    args ? args() : {},
  ]);
}
```

The main difference is now we can use the proper type for our UseQuery `UseQuery<UserByIdQuery, UserByIdQueryVariables>`


## Conclusion

By integrating Glimmer Apollo into your Ember application, you can seamlessly incorporate GraphQL for efficient data fetching and management. This powerful combination enhances your development experience, providing flexibility and performance in handling complex data requirements.

Copy of this project is available in [this repository](https://github.com/eugenioenko/ember-glimmer-apollo-starter)


{% embed https://replit.com/@eugenioenko/ember-glimmer-apollo-starter %}




-----------------------------------------------------------

username: nullvoxpopuli
github_username: NullVoxPopuli
twitter_username: nullvoxpopuli
---
title: Setting up Tailwind, the easy way
published: true
description: 
tags: ember, javascript, tailwind
cover_image: https://images.unsplash.com/photo-1519060825752-c4832f2d400a?auto=format&fit=crop&q=80&w=2340&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
# Use a ratio of 100:42 for best results.
# published_at: 2023-10-24 20:19 +0000
---

In the root of your ember app, follow these steps

0. add `tailwindcss` to your `devDependencies` 
0. make a `config/tailwind` folder
1. copy [these files](https://github.com/NullVoxPopuli/ember-apply/tree/main/packages/ember/tailwind/files) to a your `config/tailwind` folder.
2. add `<link integrity="" rel="stylesheet" href="{{rootURL}}assets/tailwind.css">` in your app/index.html
3. add `<link rel="stylesheet" href="{{rootURL}}assets/tailwind.css">` in your tests/index.html
4. add two package.json scripts:
    ```js
  "tailwind:build":
      "npx tailwindcss -c ./config/tailwind/tailwind.config.js -i ./config/tailwind/tailwind-input.css -o ./public/assets/tailwind.css",
  "tailwind:watch": 
      "npx tailwindcss -c ./config/tailwind/tailwind.config.js -i ./config/tailwind/tailwind-input.css -o ./public/assets/tailwind.css --watch"
    ```
5. change your build script
    ```
  "build": "npm run tailwind:build && ember build --environment=production"
    ```
5. add `public/assets/tailwind.css` to your .gitignore file.

🥳 You did it! you're done now!

When you run your app (or build it), you'll run `tailwind:build` or `tailwind:watch' along with your app

---------

or, if you have node 18+, you can automate all this with `npx ember-apply tailwind`


Note that this is an automation of what the [Tailwind CLI](https://tailwindcss.com/docs/installation) documentation guides you through (and what the above 6 steps have you do as well)

-----------------------------------------------------------

username: nullvoxpopuli
github_username: NullVoxPopuli
twitter_username: nullvoxpopuli
---
title: What to use instead of `@ember/string`
published: true
description: `@ember/string` is discouraged from use, but what do you use if you need string transformation?
tags: ember, javascript, strings
cover_image: https://images.unsplash.com/photo-1622593587600-919f704f4ba0?auto=format&fit=crop&q=80&w=2500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
# Use a ratio of 100:42 for best results.
published_at: 2023-10-20 15:13 +0000
---

[`@ember/string`](https://github.com/emberjs/ember-string) is trying to be phased out -- I've found that [`change-case`](https://www.npmjs.com/package/change-case) is a better alternative to `@ember/string`, because it supports more transformations, is true native ESM, and can be anywhere, even outside of ember, or in plain html files!

Here is how you migrate:

## `camelize`

If you use `camelize` in `@ember/string`, use this instead:

```js
import { camelCase } from 'change-case';
```

## `capitalize`

If you use `capitalize` in `@ember/string`, use this instead:

```js
import { capitalCase } from 'change-case';
```

## `classify`

If you use `classify` in `@ember/string`, use this instead:

```js
import { pascalCase } from 'change-case';
```

## `dasherize`

If you use `dasherize` in `@ember/string`, use this instead:

```js
import { kebabCase } from 'change-case';
```

## `decamelize`

If you use `decamelize` in `@ember/string`, use this instead:

```js
import { snakeCase } from 'change-case';
```

## `underscore`

If you use `underscore` in `@ember/string`, use this instead:

```js
import { snakeCase } from 'change-case';
```

 ## `w`

If you use `w` in `@ember/string`, use this instead:

```js
let result = `long string with words`.split(/\s+/);
//  ^ ['long', 'string', 'with', 'words']
```




-----------------------------------------------------------

username: rajasegar
github_username: rajasegar
twitter_username: null

In this post we are going to see how we can set up the language server for Ember in Emacs.

A language server is a program that provides language-specific features for code editors or integrated development environments (IDEs). It acts as a server, interacting with the editor to offer services such as code completion, error checking, and other language-specific features. In summary, language servers enhance the development experience by providing consistent language support, intelligent features, and improved productivity across various code editors and IDEs.




## Ember.js

Ember.js stands out as a robust and proven JavaScript framework designed to facilitate the development of contemporary web applications. Equipped with comprehensive tools, it empowers developers to create feature-rich user interfaces that seamlessly function across various devices. Widely recognized as a framework tailored for ambitious web developers, Ember.js offers a productive environment for building sophisticated web applications.

## Emacs

GNU Emacs stands as a freely available text editor crafted by Richard Stallman, the founder of the GNU Project. Originating from the Emacs editor designed for Unix operating systems, GNU Emacs has played a pivotal role in the GNU project and serves as a flagship initiative within the free software movement. Its defining characteristic is encapsulated in the tagline "the extensible self-documenting text editor."


## Ember Language Server

The Ember Language Server (ELS) implements the Language Server Protocol for Ember.js projects. ELS enables editors to provide features like auto complete, goto definition and diagnostics. To get these features, you have to install the plugin for your editor.

For this post we are going to use a particular version of ELS created by [Alex Kanunnikov](https://github.com/lifeart). You can find the code here in [ember-language-server](https://github.com/lifeart/ember-language-server)

You need to clone this in your local machine and build it. Then we use the build artifacts to start the language server automatically from Emacs using the LSP tooling.

```
git clone https://github.com/lifeart/ember-language-server
```
There is also another version of language server provided by the official Ember community which you can found [ember-tooling/ember-language-server](https://github.com/ember-tooling/ember-language-server)

## emacs-lsp-mode

The [lsp-mode](https://emacs-lsp.github.io/lsp-mode/) package provides the Language Server Protocol support for Emacs. It is community driven, fully featured, performant, flexible and easy to configure. It supports all features in Language Server Protocol v3.14. You can choose between full-blown IDE with flashy UI or minimal distraction free. It just works out of the box and automatically upgrades if additional packages are present.

Before configuring the lsp-mode for Ember we need to define a new major mode called `hbs-mode` for editing Handlebars templates. Here's how we do it:

```lisp
(define-derived-mode hbs-mode web-mode "Handlebars mode" "Major mode for handlebars")
(add-to-list 'auto-mode-alist '("\\.hbs\\'" . hbs-mode))
```

In the above code we are defining a new major mode named `hbs-mode` by deriving it from the existing mode `web-mode`. The string "Handlebars mode" is the mode's user-friendly name, and "Major mode for handlebars" is its documentation string. In Emacs, major modes are used to provide specialized editing features for specific types of files. In this case, `hbs-mode` is specifically tailored for editing Handlebars templates.

Next we add an entry to the `auto-mode-alist` variable, which is a list of filename patterns and corresponding major modes. When you open a file, Emacs checks this list to determine which major mode to use based on the file's extension. The added entry specifies that any file with the extension ".hbs" should be opened in `hbs-mode`. The regular expression "\\\\ .hbs\\\\'" is used to match file names ending with ".hbs".


The dot (`.`) in the regular expression is a wildcard that matches any character, and the double backslash (`\\`) is used to escape the dot and match it literally. The single-quote (`'`) in the regular expression matches the end of the string.

In short, this code sets up a new major mode called `hbs-mode` for editing Handlebars templates in Emacs. It also ensures that any file with the extension ".hbs" will automatically use this major mode when opened in Emacs.

You need to add the following code to your Emacs configuration file to get the language server working.
```lisp
    (with-eval-after-load 'lsp-mode
     (add-to-list 'lsp-language-id-configuration
       '(hbs-mode . "hbs"))
     (lsp-register-client
      ;; Git clone language server from https://github.com/lifeart/ember-language-server/tree/component-context-info-origin
      ;; And build it
       (make-lsp-client :new-connection (lsp-stdio-connection (list "node" (expand-file-name "~/www/ember-language-server/lib/start-server.js") "--stdio"))
                        :activation-fn (lsp-activate-on "hbs")
                        :server-id 'ember-language-server)))
```
Let me explain what the above code does.

The macro `(with-eval-after-load 'lsp-mode )` ensures that the enclosed code is executed after the `lsp-mode` package has been loaded. It is used to set up configurations or additional actions related to the `lsp-mode` package.

The line `(add-to-list 'lsp-language-id-configuration &#x2026;)` adds an entry to the `lsp-language-id-configuration` variable, which is used to configure language identifiers for the Language Server Protocol (LSP). In this case, it associates the language identifier `'hbs-mode'` with the string `"hbs"`.

The function call `(lsp-register-client &#x2026;)` registers a new LSP client for handling the Ember Language Server. The `:new-connection` property specifies how to establish a connection to the language server. Here, it uses `lsp-stdio-connection` with a list of arguments. It's starting the server using Node.js and pointing to the `start-server.js` file of the Ember Language Server. The `:activation-fn` property specifies when to activate the language server. It uses `lsp-activate-on` with the argument `"hbs"`, meaning the server should be activated when working with files of type `"hbs"`. The `:server-id` property  associates a unique identifier with this server configuration. In this case, it's set to `'ember-language-server'`.

In summary, this code is configuring Emacs to use the Ember Language Server for Handlebars files (`hbs-mode`). The language server is started as a new process using Node.js, and it will be activated whenever a Handlebars file is being edited. The server configuration is registered with the identifier `'ember-language-server'`.

So this is the final and full code for configuring lsp-mode for Ember handlebars in Emacs
```lisp
    
    (define-derived-mode hbs-mode web-mode "Handlebars mode" "Major mode for handlebars")
    (add-to-list 'auto-mode-alist '("\\.hbs\\'" . hbs-mode))
    
    (with-eval-after-load 'lsp-mode
    (add-to-list 'lsp-language-id-configuration
        '(hbs-mode . "hbs"))
    (lsp-register-client
    ;; Git clone language server from https://github.com/lifeart/ember-language-server/tree/component-context-info-origin
    ;; And build it
        (make-lsp-client :new-connection (lsp-stdio-connection (list "node" (expand-file-name "~/www/ember-language-server/lib/start-server.js") "--stdio"))
                        :activation-fn (lsp-activate-on "hbs")
                        :server-id 'ember-language-server)))

```


## eglot

Next we try to achieve the same with another LSP tool in Emacs called [eglot](https://joaotavora.github.io/eglot/)

Eglot is the Emacs client for the Language Server Protocol (LSP). The name “Eglot” is an acronym that stands for “Emacs Polyglot”. Eglot provides infrastructure and a set of commands for enriching the source code editing capabilities of Emacs via LSP. Eglot itself is completely language-agnostic, but it can support any programming language for which there is a language server and an Emacs major mode.
```
    (add-hook 'hbs-mode-hook 'eglot-ensure)
    (with-eval-after-load 'eglot
      (add-to-list 'eglot-server-programs
                   '(hbs-mode . ("node" "/Users/rajasegarchandran/www/ember-language-server/lib/start-server.js" "--stdio"))))
```
Let's break down the code:

First we add a function (`eglot-ensure`) to the `hbs-mode-hook`. In Emacs, a "hook" is a way to run custom code when a certain mode is activated.In this case, it ensures that the eglot server is started when `hbs-mode` is activated.


Now we delay the execution of the code inside it until after the `eglot` package has been loaded. This is useful because it ensures that the configuration is applied after the `eglot` package is available. Next we add an entry to the `eglot-server-programs` list, which specifies the command to start the language server for a particular mode. Then we associate the `hbs-mode` with the command to start the Ember Language Server for Handlebars. The server is started using the "node" executable, and it runs the specified JavaScript file (`start-server.js`) with the "--stdio" option.


The command `node` and its arguments that will be executed when the language server for Handlebars is started.
It launches the Node.js interpreter with the specified JavaScript file and tells it to use the standard I/O for communication.

We basically ensure that the eglot server is started automatically when `hbs-mode` is activated, and it specifies the command to start the language server for Handlebars.

Now you know how to configure and register the Ember Language Server for handling Handlebars (hbs) files within the Emacs text editor.



-----------------------------------------------------------

username: michalbryxi
github_username: MichalBryxi
twitter_username: MichalBryxi
Today when bootstrapping new `EmberJS` project I encountered weird headscratcher:

```sh
> npx ember-cli@5.2.1 new sandbox --skip-npm --skip-git
...
Ember CLI v4.2.0
...
🎉  Successfully created project sandbox.
```

Wut? Why does it say `Ember CLI v4.2.0` when I explicitly asked for `5.2.1`? Let's see what project was created:

```sh
> cat sandbox/package.json | grep ember-source
    
    "ember-source": "~4.2.0",
```

Hmm? So really `v4.2.0`, but why?

[Few confused debugging attempts later]

The problem turned out to be in the folder where I was working. For some reason I had `node_modules` folder there. And that folder happened to have `ember-cli@4.2.0`. There was no good reason for that folder to exist so I just deleted it and things started working as expected.

## Conclusion

If you request `ember-cli` of one version and get output of other version, then check that your current working directory does *not* contain `node_modules` folder with the incorrect version inside.

---

Image generated via Midjourney prompt: Two spiderman pointing at each other; Hand drawn; Sketch; Simple --ar 16:9

-----------------------------------------------------------

username: prasannavijayan
github_username: prasannavijayan
twitter_username: prasannavijayan
Serialization lies at the heart of data communication in web applications. It's the process of converting complex data structures, such as objects and arrays, into a format that can be easily transmitted and reconstructed on the receiving end. In the context of Ember.js, a popular JavaScript framework for building ambitious web applications, serialization plays a crucial role in managing data flow between the frontend and backend. In this blog, we'll delve into the world of Ember serialization, exploring its importance, techniques, and best practices.

## Why Serialization Matters in Ember

Modern web applications often require communication with servers to exchange data, whether it's fetching information for display or updating records in a database. Serialization is the bridge that allows developers to transmit data in a standardized format, making it possible to send and receive information seamlessly. Ember, with its convention-over-configuration approach, simplifies this process by providing built-in serialization and deserialization mechanisms.

## The Ember Serializer

At the core of Ember's serialization process is the serializer. A serializer is responsible for converting data between the application's internal representation and the format suitable for communication, typically JSON. Ember offers a range of serializers out of the box, such as `JSONSerializer`, `JSONAPISerializer`, and `RESTSerializer`.

- **JSONSerializer:** This is a basic serializer that serializes records into JSON format. It's suitable for simple applications that don't require complex relationships between models.

- **JSONAPISerializer:** If your application follows the JSON API specification, this serializer is the go-to choice. It handles complex relationships and follows the JSON API conventions for data structure.

- **RESTSerializer:** This serializer is used when your API doesn't strictly adhere to the JSON API specification. It offers more customization options compared to the JSONAPISerializer.

## Serialization in Action

Let's walk through a basic example of serialization using Ember's `JSONSerializer`.

Assume you have a `post` model with the following attributes: `id`, `title`, `body`, and `createdAt`. To serialize a `post` record, you would do the following:

```javascript
import JSONSerializer from '@ember-data/serializer/json';

export default class PostSerializer extends JSONSerializer {
  // Customize the serialized format
  serialize(snapshot, options) {
    const json = super.serialize(...arguments);

    // You can modify the serialized JSON here
    json.published = true;

    return json;
  }
}
```

In this example, the `serialize` method is overridden to modify the serialized JSON before it's sent to the server. This customization can be immensely useful when you need to add extra metadata or transform data before transmission.

## Best Practices

1. **Choose the Right Serializer:** Select a serializer that matches your API's data format and requirements. If your API follows the JSON API standard, using `JSONAPISerializer` is a wise choice.

2. **Avoid Over-serialization:** Sending unnecessary data over the network can lead to performance bottlenecks. Serialize only the data needed for a particular operation.

3. **Customization when Necessary:** If your serialization needs go beyond the basics, don't hesitate to create custom serializers. This allows you to fine-tune the serialized data to fit your application's needs.

4. **Versioning and Compatibility:** Keep an eye on API versioning and compatibility issues. Changes in serialization format can break frontend-backend communication.

5. **Testing:** Write tests for your serializers to ensure that they handle various scenarios correctly. Ember provides testing utilities to make this process easier.

## Conclusion

Ember serialization is a fundamental aspect of modern web application development. It empowers developers to seamlessly communicate with servers, retrieve data, and update records. By leveraging Ember's built-in serializers and adhering to best practices, developers can ensure efficient, reliable, and secure data transmission in their applications. Understanding the nuances of serialization is key to mastering Ember and building robust, high-performance web applications.

-----------------------------------------------------------

username: ijlee2
github_username: ijlee2
twitter_username: null
Today, I'm going to show you how to create a platform so that you and your team can write code that is more maintainable and extensible.

Since last year, at CLARK, we've been reducing our tech debt. Our main application is a monorepo with 190 packages, accrued over 7 or 8 years. We've been on Ember 3.28 for almost 2 years now. Trying to get to 4 hasn't been easy.

These issues may sound familiar to you and I think it's a good thing to know that we don't have to face them alone. The [Ember Community Survey in 2022](https://emberjs.com/survey/2022/#s03-at-work) estimated that 3 out of 4 work projects may be stuck on v3 or below. A follow-up survey in December indicated the lack of resource and outdated addons as main reasons.

The question is, why are we finding ourselves in projects that are hard to maintain and extend? What can we do differently? I want to highlight possible solutions and give practical tips based on what my colleagues and I achieved over the last year.

Keep in mind that the problems that I will describe are not specific to work or Ember v3, but more programming in general. The reason is, I want you to be able to apply these solutions in other contexts, e.g. in open-source projects like [adopted-ember-addons](https://github.com/adopted-ember-addons) or when it's time to update Ember from 4 to 5.

So, fangen wir mal an. Let's get started.



## 1. In increments

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/03.png" alt="">

When you have to update a project that hasn't been maintained, you're going to feel, at first, overwhelmed, hopeless. How in the world do we get out of this mess? The key to doing so—and this is the most important lesson from my talk: Do it _in increments_.

![A yarn is shown to be gradually untangled](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0uegr9s5qicqb3x61civ.gif)

Imagine a yarn that is wildly tangled up. The yarn is supposed to be just 1 simple thread, but it is a chaos and you can't tell where it starts and where it ends. Now, if you try to untangle the yarn by applying force in every direction, all at once, you're going to fail and make a bigger mess. But, if you give small little tugs, one at a time, sooner or later you'll find yourself that 1 simple thread.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/08.png" alt="4 contours, 3 consecutive arrows, and a target to illustrate how iterative methods work.">

This incremental approach is also what mathematicians favor. Global algorithms like finding the inverse of a function work well in theory but are very limited in practice. [Iterative methods](https://en.wikipedia.org/wiki/Iterative_method), on the other hand—taking a step in one direction, a step in another, and so on, until we converge to the right solution—are powerful because we can apply them to many different situations. They are also efficient and will end up saving us time.

So what does an incremental approach mean for us developers? It means two things.

First, when it's time to update a project, we have to avoid creating a plan that spans weeks or months. We also have to avoid planning down to the smallest detail. Now, I'm not saying, have no plan and just wing it. What I'm pointing out is that your code is alive. It will never stay still because someone on your team will add a feature, or some package that you depend on will have a release. The assumptions for how to update your project will change quickly, and you will have to adapt quickly as well.

Second, an incremental approach means allowing mistakes. The right solution won't be obvious from the start, especially because the project hasn't been maintained. A pull request to update the project may introduce bugs, but that's okay, we can fix them in the next one. This may sound obvious but, if we take _no_ steps because we fear of breaking the app, then we will get nowhere. Only by taking small steps and iterating on the solution can we make impossible possible.



### 1a. Code metrics

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/09.png" alt="">

_You rated me a six. I was like, "Damn."_

The rest of my talk is devoted to showing which small steps you can take. But, before I do that, I'll share my thoughts on code metrics: _Should_ we measure the improvements that we make?

In math, a [metric](https://en.wikipedia.org/wiki/Metric_space) is a number that describes a phenomenon without bias. For example, you are 10 centimeters taller than I, or the train was late by 5 minutes. One day, programmers, inspired by math, came up with numbers to describe [code quality](https://en.wikipedia.org/wiki/Software_metric). How many lines of code are there? How many components and routes do we have? And so on.

The problem is, your code is alive and the assumptions for your project change from one day to another. You have to somehow ignore the changes that weren't in your control by normalizing the metric. Maybe divide the metric by the number of lines of code, or divide by the square root or the logarithm. Whatever you can think of.

You're starting to see that we're fidgeting numbers and adding personal bias, when a metric is supposed to be objective. I claim that it's impossible to measure the _change_ of a code metric—in other words, how much the code improved over time. We can only measure what is now, at this moment.

Long story short, don't worry about code metrics. Just do the right thing and improve that code that you've wanted to.



## 2. The right code

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/10.png" alt="">

The next question is, well, what is the right thing? What does it look like? The answer is going to depend on which aspects of code we care about. To help narrow the answer, we will focus on two: maintainability and extensibility.

A code that we can maintain and extend exhibits 3 characteristics: It has a minimum API, it separates concerns, and it has few dependencies. In math, we say that these are [necessary conditions](https://en.wikipedia.org/wiki/Necessity_and_sufficiency). This means, if your code doesn't meet one of these conditions, it cannot be maintained or extended. Think of these as a checklist, where each item tells you which small steps you can take.

To make things more concrete, I will use [reusable components](https://guides.emberjs.com/release/components/introducing-components), something that we are familiar with and use on a daily basis.


### 2a. The right code has minimum API

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/12.png" alt="">

An [API](https://en.wikipedia.org/wiki/API) (application programming interface) defines a boundary between two code and rules for communicating with each other. When the interface is good, the code is easy to use, maintain, and extend. When the interface is bad, the code becomes a hazard and can stop your project at some point.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/13.png" alt="Two rectangles that represent the consumer and the reusable component. The rectangles are connected by a double-pointed arrow, which represents the API.">

A common mistake that I see in reusable components is supporting too many cases. That is, the component ended up with a large API by allowing many [arguments](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes). This happens when we try to predict the future and overdesign things, or when we try to quickly fix something with an `if`-statement (if there is this new argument, I'm gonna do something else).

What we tend to ignore is how every case increases [complexity](https://en.wikipedia.org/wiki/Programming_complexity). Not linearly but, I claim, quadratically or worse because of the [combinatorial](https://en.wikipedia.org/wiki/Combinatorics) effect—how arguments interact with one another. We can assume that the higher the complexity, the more likely that the component is untested and unmaintained.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/14.png" alt="A humorous, fictitious photo of eierlegende Wollmilchsau, a hybrid animal with body parts from a chicken, sheep, cow, and pig.">

Back in Germany, we have this amazing animal that's going to sustain the future, called [eierlegende Wollmilchsau](https://de.wikipedia.org/wiki/Eierlegende_Wollmilchsau). It can give us eggs, wool, milk, meat, _and_ companionship. It can do everything that we want, because it does not exist. It's an idiom like "Jack of all trades, master of none."

So the lesson is, design simple things. Got it. But what if I already have a component with a large API? How do I simplify it?

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/15.png" alt="">

The key to answering this question is researching your current use cases. Find out which features were almost always used and which maybe once or twice. The code for the rarely used features? See if you can delete them.

By doing so, you reduce complexity and the chance that your component will cause an issue. Also, by removing code, you can cause a chain reaction of additional refactors. Remember, the way to untangle a yarn is to give small little tugs.

Now, what if a feature was used once, but you have to support it? I'd create another component, maybe through composition. The idea is, to treat this feature as an exception and not the norm. When designing reusable components, I want you to [target the 80%](https://en.wikipedia.org/wiki/Pareto_principle) and not give in to the other 20%.


### 2b. The right code separates concerns

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/16.png" alt="">

Recall that an API draws a boundary between two code. In the best case, each side trusts the other to perform only certain tasks and no others. When this happens, the tests for each side are simpler.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/17.png" alt="Two rectangles that represent the consumer and the reusable component. The rectangles are connected by a double-pointed arrow, which represents the API.">

The question is, when we design a reusable component, how should we separate responsibilities? Which tasks belong to the reusable component and which to the consumer, whether that's a component or route?

[In my experience](https://github.com/ijlee2/ember-workshop), we can maintain and extend the reusable component when it handles these 3 aspects:

- [Accessibility](https://emberjs-1.gitbook.io/ember-component-patterns) (so the consumer doesn't have to be an expert in it)
- Styling (making sure that things inside the container look right)
- [Test selectors](https://github.com/mainmatter/ember-test-selectors) (what should be tested and how are the selectors named?)

Meanwhile, the consumer must provide these three:

- Data and translations (what should the component render?)
- Margin and padding for the container (so the component can play nice with others)
- [Callback functions](https://guides.emberjs.com/release/in-depth-topics/patterns-for-actions) (when a user takes an action, what should the component do?)

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/19.png" alt="">

How I separated styling—namely, the container doesn't set its margin and padding, but the consumer does with an extra `<div>`—may come as a surprise. I learned this from Sean Massa and Trek Glowacki a few years ago, and find that it really helps us reuse and refactor components. The rationale is, reusable components should only care about what happens inside. We encounter this idea also in [container queries](https://github.com/ijlee2/ember-container-query).

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/20.png" alt="">

Another thing to note here is data and translations. Before [Ember 3.25](https://blog.emberjs.com/ember-3-25-released), we would have had to use a bunch of arguments to pass these down. Now, thanks to [named blocks](https://guides.emberjs.com/release/components/block-content), the reusable component can focus on the layout, while the consumer on the content. Named blocks are one of my favorite features of Ember.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/21.png" alt="">

A feature of Ember that I want you to use with caution is [...attributes](https://guides.emberjs.com/release/components/component-arguments-and-html-attributes), as they can easily destroy separation of concerns. I'll give you 2 examples.

One time, I tried to replace flex with grid to simplify a reusable component, only to find out, many of the consumers had passed the `class` attribute and had overwritten the flex properties. Thanks to splattributes, implementation got leaked and the consumers are now forcing me to keep using flex.

Another problem that I observed at CLARK is too many test selectors, because many consumers had passed their own. When the same DOM element is referred to in 7 different ways, refactoring the reusable component becomes tedious. Suddenly, I have to update multiple test files in different packages.

In general, I think `...attributes` is a sign that the component wasn't designed right. Maybe it should ask the consumer to, instead, use arguments to define styles, named blocks to customize content, and test helpers to write tests. I want you to use the right tools to solve the right problems.


### 2c. The right code depends on few

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/22.png" alt="">

Just like arguments, every package that we install increases the chance that something goes wrong. But unlike arguments, we don't really have control over packages. If the package author doesn't do releases or they make breaking changes, our code can become stuck in time.

Now, I'm not saying, write every code yourself and have zero dependencies. Instead, ask yourself: Is their code more _stable_ than mine? To me, stable doesn't mean, there's a 1.0 release. It means, the package is well-written, -documented, -tested, and -supported. You can install the package only if the answer is yes.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/23.png" alt="">

Of course, at times, you will need to install a package that is not stable. If so, try to [wrap the code](https://en.wikipedia.org/wiki/Wrapper_function) that you need, then write tests to document the wrapper's input and output. This way, if the package turns out to be no go, you will have to replace the code in only 1 place: the wrapper.

I'll tell you about a mistake that we had made at CLARK and how it's now affecting us with upgrading Ember. (It's a funny story and you're going to laugh, because you're not affected.)

We use [ember-file-upload](https://github.com/adopted-ember-addons/ember-file-upload) and I noticed, we are on `5.0.0-beta` when the latest is 8-something and I can't update Ember to 4 without updating `ember-file-upload` first.

Well, it turns out, we came up with like 10 different ways to render `<FileUpload>` and, since the beta, the addon changed its API and styling drastically. So now, we have to fix deprecations, visual regressions, and failing tests for every one of these cases. If only we had come up with a wrapper component, tja.



## 3. Solid foundation

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/24.png" alt="">

To help people design code right, we need a strong foundation—things like simple lint and test strategies, up-to-date dependencies, and short build and rebuild times. Replacing the foundation is a comparatively large task, but it's also something that we will have to do only once in a while.

The question is, for an _existing_ project, how do we replace the foundation without stopping everything else? The solution, again, is in increments.


### 3a. Overhauling lint

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/25.png" alt="">

A year ago, at CLARK, every package had different linter configurations, so we couldn't update packages like `eslint` and `typescript`. Furthermore, how we asked our developers to lint files was different from how we asked our CI.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/26.png" alt="">

Fast forward to now, our project is set up like this: There are only 3 scripts for developers to remember because every package has them: `lint`, `lint:fix`, and `test`. CI runs the exact same scripts so we can easily reproduce issues locally.

Second, we use the flag `--cache` and the package [concurrently](https://github.com/open-cli-tools/concurrently) so that we can lint files faster and more exhaustively.

Lastly, we have limited resource so we rely on the default as much as possible. Things like [blueprints from ember-cli](https://github.com/ember-cli/ember-cli/tree/master/blueprints) and official plugins like `@tsconfig/ember`. We adopt 3rd-party plugins only if they are stable in the sense that I mentioned earlier.

- [@tsconfig/ember](https://github.com/tsconfig/bases/blob/main/bases/ember.json)
- [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)
- [eslint-plugin-simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort)
- [eslint-plugin-typescript-sort-keys](https://github.com/infctr/eslint-plugin-typescript-sort-keys)
- [stylelint-order](https://github.com/hudochenkov/stylelint-order)

And here is how we changed linting across 190 packages. It turns out, packages are not equal. Leaf-node packages (packages that don't depend on others) were actually seldom worked on, so we updated them all at once. Packages for a business domain belong together so they were updated together.

![We can change linting in groups of packages](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/apurx91zlnbsbka4851v.gif)

In a single day, we updated `eslint` to `v8` and reset all configurations by bypassing CI. We asked `lint:js` to return code 0, an unconditional success. Afterwards—again, in groups of packages—we reverted the scripts, ran auto-fix, and ignored errors that couldn't be fixed.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/31.png" alt="">

With this divide-and-conquer strategy, it took me (one person) about 10 pull requests and no more than 5 days to introduce a change.


### 3b. Spotting blockers

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/32.png" alt="">

Next, we look out for deprecations and outdated packages that can block us from updating more critical dependencies like `ember-source`.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/33.png" alt="">

To find deprecations, we can use [ember-cli-deprecation-workflow](https://github.com/mixonic/ember-cli-deprecation-workflow) and create a to-do list. The addon does require that we have enough tests to avoid false negatives. Later, I'll show you how you can write simple tests when there aren't any. Another approach is to run the app and check [Ember Inspector](https://github.com/emberjs/ember-inspector)'s Deprecations tab.

Here are 3 deprecations that will likely affect many projects. You can visit [deprecations.emberjs.com](https://deprecations.emberjs.com) to learn more.

- `implicit-injections` (v4)
- `this-property-fallback` (v4)
- `routing.transition-methods` (v5)

I also gathered a list of important packages and the minimum version that you want to reach. It's important to update `ember-auto-import` and `ember-modifier` now, because more addons will move on to support [Embroider](https://github.com/embroider-build/embroider).

- [ember-auto-import@2](https://github.com/embroider-build/ember-auto-import)
- [ember-modifier@3.2.7](https://github.com/ember-modifier/ember-modifier)
- [ember-template-lint@5](https://github.com/ember-template-lint/ember-template-lint)
- [eslint@8](https://github.com/eslint/eslint)
- [typescript@4.8.2](https://github.com/microsoft/TypeScript)


### 3c. Short (re)build

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/36.png" alt="">

To help people iterate on a solution many times, we need builds and rebuilds to be fast. A forewarning: High performance optimization isn't my expertise so I cannot give you definitive answers. Nonetheless, I'll share what we did at CLARK, which seemed to help lower the times. Maybe they can help you too.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/37.png" alt="">

We ended up with 190 packages because of premature abstractions. By combining packages and removing dead code, we are now down to 150. In the process, we removed a few cyclic dependencies by creating a leaf-node package.

Now, if there is a component used by many packages, see if you can simplify it. You can, for example, make it [template-only](https://api.emberjs.com/ember/release/functions/@ember%2Fcomponent%2Ftemplate-only/templateOnly) and replace older syntax with newer ones.

An ongoing project for us is to declare dependencies correctly so that we can adopt Embroider. Because we use `yarn` to manage the monorepo, many packages that had been created by copy-paste listed wrong dependencies. You can find unused dependencies by searching code for how they would have been used.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/38.png" alt="">

Finally, if you have [ember-cli@3.15](https://github.com/ember-cli/ember-cli/releases/tag/v3.15.0) or higher, there's a hidden feature that can make rebuilds faster. In `ember-cli-build.js`, simply set `BROCCOLI_ENABLED_MEMOIZE` to `true`. This happens by default in Embroider projects.



## 4. Solving together

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/39.png" alt="">

My colleagues and I are in this lucky situation, where I can maintain code full-time, but that's still a bus factor of 1. It's important that I share knowledge and get more people involved. This year, we began to tackle tech debt together. Each quarter, we discuss ideas and decide what to work on.

To show that every one of you has the power to make change, first, I will cover 5 techniques for refactoring. These are accessible and can be used on a daily basis. Next are codemods, something that's more advanced and takes time to do. Finally, we will think about how our interpersonal skills affect how we collaborate.


### 4a. Refactors

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/40.png" alt="">

There is this book on refactoring that I hate. It gives us 70 techniques and the examples are academic, so I could never tell which are actually important.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/41.png" alt="">

I claim, we just need 5 to survive: Write tests, [rename things, make early exits, extract functions](https://crunchingnumbers.live/2020/08/08/3-refactoring-techniques), and remove dead code.


#### Write tests

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/42.png" alt="">

If your project doesn't have tests, you can use [Ember CLI](https://cli.emberjs.com/release/advanced-use/cli-commands-reference) to write the simplest test, a tautology (`true` is equal to `true`). For example, you render a component and write `assert.ok(true)`, or you look up a service and assert that it is truthy.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/43.png" alt="">

Even these placeholder tests provide two valuable information: the minimum data needed to initialize your object, and a guarantee that the object won't cause issues when you use it.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/44.png" alt="">

You can learn more about [_how_ to write tests](https://crunchingnumbers.live/2019/10/11/write-tests-like-a-mathematician-part-3) from [my talk at EmberFest 2019](https://www.youtube.com/watch?v=uTjSHpJWQAY). The lessons from back then still apply today.


#### Rename things

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/45.png" alt="">

When you don't understand what a variable, condition, or function does, there's a chance that other people won't either. Once you understand the code better, give names that are descriptive.


#### Make early exits

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/46.png" alt="">

Nested conditions (in general, indentations to the right) are a recipe for disaster. They encourage us to keep nesting to handle new exceptions.

You can fix this by making early exits. If there is code that happens when a condition is true, instead, you exit immediately when false, using `return`, `break`, or `continue`. Early exits help us simplify logic and move code to the left.


#### Extract functions

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/47.png" alt="">

At times, you will find a function that has many lines of code, but is actually performing a few key steps in sequence. If so, create a function for each key step and give a name that describes the step.

This process of breaking a large function into smaller ones is called extraction. Once you extract functions, you have the option to move them to app/utils (“utilities”) and write unit tests.


#### Remove dead code

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/48.png" alt="">

Finally, if you see code that isn't used, delete it. By removing code, you can simplify assumptions, remove dependencies, and allow further refactors.

To find dead code, you can use `git grep` or your code editor's Find tool. For searches to be accurate, though, your code has to be written well (a Catch-22) and, ideally, be statically analyzable. It's hard to match names that are dynamically generated.


### 4b. Codemods

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/49.png" alt="">

When you want to update many files to follow a new format, you might ask, should I write a codemod, a program to update the files for me? It depends.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/50.png" alt="">

When you write a codemod, you pay the costs upfront. You have to first create and configure a package, write code, then write tests to test that code. This can take days or weeks. But once you have a codemod that is backed by tests, the returns are manifold. The codemod can update your project in a second and can be reused to help other projects migrate.

Here's the crux: When your project has many variations in code because it hasn't been maintained, updating it by hand will be faster. A codemod will run into edge cases that may or may not occur in other projects, and every edge case that you handle is extra code that you have to maintain.

Nonetheless, the ability to help others just might be the deciding factor for you. As a rule of thumb, consider writing a codemod if you can cover the usual 80%.

To get started, I would've recommended two years ago Robert Jackson's [codemod-cli](https://github.com/rwjblue/codemod-cli), but this package is unmaintained, doesn't support TypeScript, and makes a divide-and-conquer strategy—taking small steps—hard to achieve.

So I created [@codemod-utils](https://github.com/ijlee2/codemod-utils), a set of tools and conventions for writing codemods. I use it to power all of mine:

- blueprint-for-v2-addon (CLARK internal)
- [ember-codemod-args-to-signature](https://github.com/ijlee2/ember-codemod-args-to-signature/)
- [ember-codemod-pod-to-octane](https://github.com/ijlee2/ember-codemod-pod-to-octane)
- [ember-codemod-remove-ember-css-modules](https://github.com/ijlee2/embroider-css-modules/blob/main/packages/ember-codemod-remove-ember-css-modules)
- [ember-codemod-v1-to-v2](https://github.com/ijlee2/ember-codemod-v1-to-v2)
- [type-css-modules](https://github.com/ijlee2/embroider-css-modules/tree/main/packages/type-css-modules)

And just last week, I published a [CLI](https://github.com/ijlee2/codemod-utils/tree/main/packages/cli). You can use it to create a modern project that comes with lint, test, CI, and documentation out of the box.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/52.png" alt="">

My hope is, we can lower the barrier enough that, if a person can write a function in Node.js, then they can start writing a codemod. I'd love to see more people writing one, given that [Polaris](https://emberjs.com/editions) is coming up, and [Glint](https://typed-ember.gitbook.io/glint) and [`<template>`-tag](https://github.com/ember-template-imports/ember-template-imports) can use a higher adoption. Who knows? Maybe, some day, I will give a talk on codemods.


### 4c. Different perspectives

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/53.png" alt="">

While solving problems together, I want you to think about your interpersonal skills and how they affect how you collaborate.

Each of us, with a unique background, has a different way of thinking and verbalizing how we perceive the world. These differences surface when we discuss ideas and review each other's code. The more we are competent in our interpersonal skills, the better we can appreciate the differences and appreciate one another for who they are.

We say interpersonal _skills_ because they are something that we can learn by practice. I myself learned through Toastmasters, where I met many good people. Nowadays, with more information online, I recommend that you branch out and see what interests you.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/54.png" alt="">

Back in Germany (and this time, it's real), you can stream shows called [Sag's mir](https://www.zdf.de/kultur/sags-mir), [Unter Anderen](https://www.zdf.de/kultur/unter-anderen), and [13 Fragen](https://www.zdf.de/kultur/13-fragen), where 2-6 people with opposing ideas carry a conversation that is personal and civilized. The goal isn't to win the argument, but to listen to each other and come up with a compromise. I really like these shows because they can teach us what makes a discussion go well.



## 5. Future is now

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/55.png" alt="">

Last but not least, I want to show you that you can move towards the future even when your project is behind. For example, you can install polyfills to start modernizing syntax, and update `ember-cli` to the latest, independently of `ember-source`:

- [ember-angle-bracket-invocation-polyfill](https://github.com/ember-polyfills/ember-angle-bracket-invocation-polyfill)
- [ember-cached-decorator-polyfill](https://www.npmjs.com/package/ember-cached-decorator-polyfill)
- [ember-functions-as-helper-polyfill](https://github.com/ember-polyfills/ember-functions-as-helper-polyfill)
- [ember-in-element-polyfill](https://github.com/ember-polyfills/ember-in-element-polyfill)
- [ember-named-blocks-polyfill](https://github.com/ember-polyfills/ember-named-blocks-polyfill)
- [ember-on-modifier](https://github.com/ember-polyfills/ember-on-modifier)
- [ember-unique-id-helper-polyfill](https://github.com/ctjhoa/ember-unique-id-helper-polyfill)

If you maintain a v1 addon, you can enable two [ember-try](https://github.com/ember-cli/ember-try) scenarios (`embroider-safe` and `embroider-optimized`) so that you can discover issues early and create a plan to adopt the v2 format. You can also support [Glint](https://github.com/ijlee2/ember-container-query/releases/tag/3.1.0) and [`<template>`-tag](https://github.com/ijlee2/ember-container-query/releases/tag/3.2.0) users, even before you [migrate to v2](https://github.com/ijlee2/ember-codemod-v1-to-v2).

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/57.png" alt="">

This April, at CLARK, we started using a private package registry. It helped us extract linter configurations from the monorepo, so that we can reuse them in other projects and standardize how we write code. The registry also helped us set up another monorepo (with `pnpm`), where we extracted addons, converted them to v2, introduced [embroider-css-modules](https://github.com/ijlee2/embroider-css-modules/tree/main/packages/embroider-css-modules), supported Glint and `<template>`-tag, and wrote test apps to make sure that we are ready for the future.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/58.png" alt="">

By thinking a bit outside of the box, you just might be able to solve many problems at once.



## 6. Closing

In conclusion, when your project is currently hard to maintain and extend, you may feel overwhelmed and hopeless, but please—don't give up. By taking small steps and iterating on a solution, you can introduce change that will help you and others. And you don't have to do it alone. Ask your team and the community that we have for help.

In 1 year, when we are back at [EmberConf](https://www.emberconf.com/), I'd love to hear how your project is doing. Maybe you'll strike a conversation with me, in the hallway or on [Discord](https://discord.gg/emberjs), or present a talk like I did today. Until then, mach's gut. Take care.

<img src="https://crunchingnumbersdotlive.files.wordpress.com/2023/07/59.png" alt="">


-----------------------------------------------------------

username: namaste_raj
github_username: rajforum
twitter_username: kishorr789
**A dev journey of Ember upgrade from v3.20 to 4.8**

Every aspiring dev journey starts from documentation, a bunch of documentations.

Upgrade guide: 
- https://cli.emberjs.com/release/basic-use/upgrading
- https://guides.emberjs.com/release/upgrading

Deprecation guide:
- https://deprecations.emberjs.com 

Release guide:
- https://blog.emberjs.com/tag/releases

RFCs guide: Checkout to know more about behind the curtain of a deprecation
- https://rfcs.emberjs.com/#accepted

---

Upgrading a project is very ambitious task, and like every ambitious task let's break into small tasks.

**Upgrade Plan**
- Sequential upgrade [LTS wise](https://emberjs.com/releases/lts/).
- Handle deprecation of only upgraded LTS.

---

**How to upgrade?**

<u>Step 1:</u> Upgrade `ember-cli` [as eg. 3.24.0 to 3.28.0]

  ```
  $ npm install -g ember-cli-update

  $ npm uninstall -g ember-cli
  $ npm install -g ember-cli@3.28.0
  $ ember --version
  ```
<u>Step 2:</u> Navigate to project path in terminal

```
$ cd <project-path>
$ ember-cli-update --to 3.28.0
``` 
This will update the project to the mentioned Ember CLI version.  It will only modify the files if there are changes between your project's version and the latest version, and it will only change the section necessary, not the entire file.

You will probably encounter merge conflicts, in which the default behavior is to let you resolve conflicts on your own.

<u>Step 3:</u> Run your project to checkout any breakage [Project dependant]

> Project third party packages can be upgraded while or even after upgrade of ember-cli, depends on project and type of breakage.

Detailed Ref: https://cli.emberjs.com/release/basic-use/upgrading

---

**How to handle deprecation?**
<u>Step 1:</u> Install `ember-cli-deprecation-workflow` in project
```
$ npm install ember-cli-deprecation-workflow --dev
```
<u>Step 2:</u> create config/deprecation-workflow.js
<u>Step 3:</u> Add deprecation message entries as per [documentation](https://github.com/mixonic/ember-cli-deprecation-workflow)

**Dev note:** Handling and maintenance of deprecation in large project becomes tedious, this is how I handled one deprecation/version-wise at a time.
Github link: https://github.com/rajforum/ember-upgrade-note/blob/main/deprecation-wokflow.js

Change handler to `log` to list deprecations and `throw` once fixed.

---

**TLDR tip:** 
- There are codemods which reduce repetitive bulky changes.
    - https://github.com/orgs/ember-codemods/repositories
    - https://github.com/dyfactor/dyfactor-plugin-disambiguate-locals
- If you're jumping from 3.x to 4.x as 4.0.0 is not an LTS candidate even-though I would suggest to have 4.0.0 as internal-upgrade which handle all v3x deprecations.

---

A mention to other Refs which has helpful at very first upgrade.
- https://youtube.com/watch?v=8RW49QK_wI8
- https://www.youtube.com/watch?v=ToVdJjHiKco
- https://github.com/ember-cli/ember-new-output




















-----------------------------------------------------------

username: rajasegar
github_username: rajasegar
twitter_username: null
In this post, we are going to take a look at how to invoke Solid.js components from an Ember.js application. Before diving into the topic let's have a quick intro about both these frameworks (or library) and look at why we want to integrate Solid.js into an Ember codebase first.

## Ember
[Ember](https://emberjs.com/) is a  framework for ambitious web developers. It is a productive, battle-tested JavaScript framework for building modern web applications. It includes everything you need to build rich UIs that work on any device. It has been around for more than 10 years and is still preferred and used by a lot of companies.

## SolidJS
[SolidJS](https://www.solidjs.com/) is a powerful, pragmatic and productive JavaScript library for building user interfaces with simple and performant reactivity. It stands on the shoulders of giants, particularly React and Knockout. If you've developed with React Functional Components and Hooks before, Solid will feel very natural because it follows the same philosophy as React, with unidirectional data flow, read/write segregation, and immutable interfaces.



## Why?
There could be many reasons to integrate SolidJS into an Ember.js application from performance, maintainability, technology heterogeneity, organizational reasons, developer availability to business priorities. My fellow Emberanos won't fully agree with me on these various reasons. It's okay. Yet I wanted to share my knowledge on some recent experiments I have done to help a larger community of people and to those who are looking to migrate from Ember to SolidJS.

It is important to remember that Ember is not a bad framework. And Ember is still my first love ❤️ when it comes to JavaScript Frameworks and I am very grateful to the framework and the community since it has been a tremendous help in shaping my front-end career and building a lot of [tools](https://github.com/rajasegar?tab=repositories&q=ember&type=&language=&sort=). You really can't compare Ember with SolidJS in absolute terms. Because it's apples and oranges.

## Setting up the Monorepo
We are going to setup a [monorepo](https://monorepo.tools/) for this post. That gives us a clear advantage of keeping the SolidJS components and the Ember app separately, still within a single repository. We are going to use [pnpm workspaces](https://pnpm.io/workspaces) for the task at hand.

```
|-app
|--|-<Ember app>
|-some-solid-lib
|--HelloWorld.jsx
|--package.json
|-README.md
|-pnpm-lock.yaml
|-pnpm-workspace.yaml
```

This is how I setup the monorepo structure using the command line.

```
mkdir ember-solid-example
cd ember-solid-example
touch README.md pnpm-workspace.yaml
mkdir app some-solid-lib
cd app
degit ember-cli/ember-new-output#v4.10.0
cd ..
cd some-solid-lib
touch HelloWorld.jsx package.json
```

Here I am using [degit](https://github.com/Rich-Harris/degit) to bootstrap our Ember app since the `ember-cli` doesn't allow you to create a new Ember app in the name of `app`.


Our `pnpm-workspace.yaml` file should look like something like this, indicating that the workspace contains two packages one Ember app and other SolidJS component library.

```yaml
packages:
  - app
  - some-solid-lib
```

## Compiling SolidJS components with Ember
Now we will see how to configure Ember build pipeline with `ember-auto-import` to tweak the Webpack builder underneath to compile SolidJS components. Before that we need to add the appropriate dependencies for compiling SolidJS components like `solid-js` and `solid-hot-loader`.

So from your Ember app root folder, run the following command to add the dependencies.

```
pnpm add -D solid-js solid-hot-loader babel-loader @babel/preset-env
```

This is how the modified `ember-cli-build.js` file inside the Ember app will look like. We are configuring the webpack loader to handle all the `.jsx` files from the SolidJS package `some-solid-lib` inside the monorepo.


```js

'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const path = require('path');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    autoImport: {
      webpack: {
        module: {
          rules: [
            {
              test: /\.jsx$/,
              use: {
                loader: 'babel-loader',
                options: {
                  babelrc: false,
                  configFile: false,
                  presets: ['@babel/preset-env', 'solid'],
                },
              },
            },
          ],
        },
      },
    },
  });

  return app.toTree();
};

```


## Rendering components via Modifiers

Modifiers are a basic primitive for interacting with the DOM in Ember. For example, Ember ships with a built-in modifier, `{{on}}`:

```hbs
<button {{on "click" @onClick}}>
  {{@text}}
</button>
```

All modifiers get applied to elements directly this way (if you see a similar value that isn't in an element, it is probably a helper instead), and they are passed the element when applying their effects.

Conceptually, modifiers take tracked, derived state, and turn it into some sort of side effect related in some way to the DOM element they are applied to.

To create our modifiers, we are going to use the `ember-modifier` addon inside our Ember app. Let's first install our addon.

```
ember install ember-modifier
```

Let's create a class-based modifier to render our SolidJS components.

```
ember g modifier solid --class
```

This is the code for the newly created modifier. Basically the modifier is trying to create a new Root element for the SolidJS component and then it creates a new instance of the SolidJS component and render it inside the element provided by the modifier. The `registerDestructor` function available in `@ember/destroyable` will help you to tear down the functionality added in the modifier, when the modifier is removed.

```js

import Modifier from 'ember-modifier';
import { render } from 'solid-js/web';
import { registerDestructor } from '@ember/destroyable';

export default class SolidModifier extends Modifier {
  modify(element, [App], props) {
    element.replaceChildren();
    const dispose = render(() => App(props), element);
    registerDestructor(this, dispose);
  }
}

```

## SolidJS Component
Our SolidJS component is a simple component showing a message that can be toggled using the actions of an Ember component.
This is the code for our SolidJS component.

```js
function HelloWorld({message, onClick}) {
  return (
	<div>
	  <button onClick={onClick}>Toggle</button>
	  <div>you said: {message}</div>
	</div>
	);
}

export default HelloWorld;

```


## Creating a Ember wrapper component
Let's create our wrapper component for which we need a Glimmer component with class

```
ember g component example -gc
```

### Ember component.js
The code for the Ember wrapper component is simple. First we are importing our SolidJS component from the shared library in our monorepo and assign it to a component property called `theSolidComponent` which we will be using the main argument to our modifier. Then we have a tracked property message and an action toggle which are both props to the SolidJS component. 

```js
import HelloWorld  from 'some-solid-lib/HelloWorld.jsx';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  theSolidComponent = HelloWorld;

  @tracked message = 'hello';

  @action toggle() { 
    if (this.message === 'hello') {
      this.message = 'goodbye';
    } else {
      this.message = 'hello';
    }
  }
}
```

### Ember Component template
And this is how we use the `solid` modifier on a DOM element to render our SolidJS component and pass our data from Ember via the props.

```hbs
<div {{solid this.theSolidComponent message=this.message onClick=this.toggle}} />
```

And this is how the Ember app looks like. Basically we are toggling a message with a button. Both the message data and the message handler functions are passed from Ember to SolidJS component via the modifier props.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6lvegb5c9z2ciexuumgk.gif)

## Pros & Cons
Having used SolidJS components inside an Ember app, let's discuss about the pros and cons of using the above mentioned approach to integrate SolidJS into Ember.js applications.

### Pros
- Incrementally migrate an Ember codebase to SolidJS
- Having a monorepo of both Ember and SolidJS components
- Easy to consume the components, passing data via props and sharing the state with Modifier syntax
- Clean and simple approach

### Cons
- Need Ember wrapper components for each SolidJS Component
- Hot module reloading won't work if you change code in SolidJS components since it is a separate dependency via npm
- Passing children to SolidJS components is not possible, the SolidJS components need to have their own children

## Sample repo
The code for this post is hosted in Github [here](https://github.com/rajasegar/ember-solid-example). 

Please take a look at the Github repo and let me know your feedback, queries in the comments section. If you feel there are more pros and cons to be added here, please do let us know also.

-----------------------------------------------------------

username: ignace
github_username: IgnaceMaes
twitter_username: Ignace_Maes
In late 2019, the [Ember.js Octane edition](https://blog.emberjs.com/octane-is-here/) was released which included a new way of writing components: Glimmer components. Components now extend the component class from the Glimmer package instead of Ember. Besides this minor difference in importing there’s a large difference in functionality. This article will go over the differences, reasons why you would want to upgrade, and an upgrade strategy to tackle this in large codebases.

## Classic vs. Glimmer

Glimmer components can be seen as a slimmed down version of classic components. Most lifecycle hooks were removed. Arguments are scoped and built upon auto tracking reactivity from Glimmer. There’s no more HTML wrapping element. They use native class syntax. And a lot of classic leftovers were cleaned up.

The following example implements a component which copies the text passed as argument to the clipboard when clicking a button. When using classic Ember components, it could be implemented as follows:

```js
// copy-to-clipboard.js
import Component from '@ember/component';
import { set } from '@ember/object';

export default Component.extend({
  isCopied: false,
  actions: {
    async copyToClipboard() {
      await navigator.clipboard.writeText(this.text);
      set(this, 'isCopied', true);
    }
  }
});
```
```hbs
<!-- copy-to-clipboard.hbs -->
<button {{action 'copyToClipboard'}}>
  {{if isCopied 'Copied!' 'Click to copy text'}}
</button>
```

The same component using Glimmer would look like this:

```js
// copy-to-clipboard.js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CopyToClipboard extends Component {
  @tracked isCopied = false;

  @action
  async copyToClipboard() {
    await navigator.clipboard.writeText(this.args.text);
    this.isCopied = true;
  }
}
```
```hbs
<!-- copy-to-clipboard.hbs -->
<button {{on 'click' this.copyToClipboard}}>
  {{if this.isCopied 'Copied!' 'Click to copy text'}}
</button>
```

The Glimmer component can make use of decorators as it uses native class syntax. There is a clear separation between arguments passed to the component (here `text`) and the local state (`isCopied`). Regular assignment expressions can be used to update state that should trigger template rerenders thanks to Glimmer auto tracking. And there's [a lot more improvements](https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/) which aren't illustrated in this small example.

## Why migrate to Glimmer components?

Every code migration requires engineering time which can not be used to build new products to sell to customers. So for a business to invest into refactors and migrations there has to be another benefit. Classic components in Ember are still supported in the latest major version, so why upgrade? The following benefits for us made it worth the trade-off.

### One way of doing things

Glimmer components for new code became the standard practice since the release of Ember Octane. This caused our codebases to contain two component types. This adds extra mental overhead when working in codebases which contain both. You have to be aware of which type of component you’re working with and make changes accordingly. For people new to Ember this can be extra confusing.

### Closer to native JavaScript experience

Glimmer components contain very little Ember specific code practices compared to classic components. This makes it easier for people to get started in Ember coming from a different background. Every JavaScript developer should be able to get started in our codebase and get up to speed relatively quickly.

### Rendering performance

The previous points are nice from a developers perspective. There’s, however, also a benefit for customers. Glimmer components render [substantially faster](https://stefankrause.net/js-frameworks-benchmark8/table.html) than classic components.

### TypeScript support

TypeScript has proven it’s here to stay in the wider JavaScript ecosystem. It has risen in interest and kept its place as the [most popular JavaScript flavour](https://2022.stateofjs.com/).

In 2022 Ember acknowledged [official TypeScript support](https://rfcs.emberjs.com/id/0724-road-to-typescript/) with a dedicated core team. Glimmer components unlock the full potential of TypeScript support in Ember. Template type checking with [Glint](https://github.com/typed-ember/glint) is also under active development. Exciting!

### Future-proof a codebase

Ember.js development doesn’t stagnate. Progress is already being made for new improvements to the current component model. The RFC for [first-class component templates](https://github.com/emberjs/rfcs/pull/779) has been accepted and merged in 2022 and will provide new benefits to Ember users. By first adopting Glimmer components, we’re prepared for what’s coming next.

## Migration strategy

While you could jump straight in and start migrating every component one by one, we decided to go for a different strategy. For smaller codebases migrating components one by one can be a feasible approach, but this can be cumbersome for large codebases (think 100K+ lines of code). This effort is way too large for a single person and has too many side effects. This is why we broke up our migration effort into nine milestones.

### 1. Native JavaScript class syntax for components

Historically Ember used object syntax to define components. As class syntax matured in JavaScript in general, it also became the standard for Glimmer components. Classic components in Ember provide support for both object and class syntax. This makes switching to class syntax a great first step towards Glimmer components.

Ember provides a [codemod](https://github.com/ember-codemods/ember-native-class-codemod) to convert object syntax to class syntax. This has saved us a tremendous amount of time. By doing this our development experience also greatly improved.

### 2. No implicit this

Arguments in Glimmer components are bundled in the `args` object. This avoids clashes with custom defined properties in the component’s own scope and creates a clear distinction between properties defined locally and passed arguments.

Glimmer component templates reflect this by using the `@` prefix when using arguments and the `this.` prefixes when accessing properties of the backing class. This way of working is also supported in classic components, even though arguments are in the same scope as local properties. This means the migration is non blocking, and luckily there’s a [codemod](https://github.com/ember-codemods/ember-no-implicit-this-codemod) available for this as well. The codemod however can’t make a distinction between arguments and local properties, and is something that will be cleaned up in a later phase.

### 3. Getting the simple components out of the way

By reviewing all components and checking which used none or limited of the classic component features, we were able to identify a set of components which were easily migrated to Glimmer. Examples are components which did not have any JavaScript logic, as Glimmer introduced the concept of template-only components which work without an explicit backing class. This was low hanging fruit and by getting them out of the way directly we avoided unnecessary overhead of the other phases.

### 4. Remove outer HTML semantics

Classic components have a [wrapping HTML element](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/#toc_outer-html) which doesn’t exist in Glimmer components. A first step to prepare for this removal was to get rid of all properties that have an impact on this wrapping element. In most cases this usage was the `classNames` attribute which added CSS classes to the wrapping element.

Converting was done by adding these properties directly in the template of the component.

### 5. Making components tagless

Wrapping elements of classic components can be removed by setting the `tagName` to an empty string, hence the name “tagless” components. The `@tagName` decorator from the [ember-decorators](https://ember-decorators.github.io/ember-decorators/docs/decorators#component-decorators) package can be used to do this. This makes it easy to spot and clean up in a later phase.

Making the component tagless in this phase still introduces breaking changes which we fixed together with adding the decorator.

A common pitfall we noticed was that attributes on an Ember component had no place to be set and were dropped. In Glimmer you explicitly need to tell where the passed attributes have to be placed. This can be done by using the `...attributes` syntax. Often this caused styling bugs as classes or id’s weren’t set. Our visual tests came in useful to detect these issues. If you’re interested in how we set up visual testing, check out [our talk at EmberFest 2022](https://www.youtube.com/watch?v=m90m9lVEFlY).

A second issue was that lifecycle hooks that depended on this wrapping element no longer got invoked. Those lifecycle events contain the Element reference, e.g. `didInsertElement`. To migrate these we made use of the [render-modifiers](https://github.com/emberjs/ember-render-modifiers) package. Ever since Glimmer and Octane, there are new ways to encapsulate this logic like using the constructor and destructor, writing custom modifiers, or using resources. For the sake of limiting the scope we opted to keep this a separate effort.

### 6. Removing Mixins

Mixins were a way to share common code across different components. In Glimmer they’re no longer supported. We reviewed our mixins and listed a way of restructuring them as in most cases mixins could be replaced with a more specific way of sharing code.

Common cases were template formatting logic which could be made into a helper, shared constants which could be moved to a separate file, and utility functions which could be separated as they didn’t require the Ember context. For usages that didn’t fit nicely in any of the standard ways of sharing code, we opted for creating custom class decorators as described in [“Do You Need EmberObject?”](https://www.pzuraq.com/blog/do-you-need-ember-object) by Chris Garrett.

### 7. Removing deprecated lifecycle events

In phase 5 a subset of [deprecated lifecycle hooks](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/#toc_lifecycle-hooks--modifiers) were already removed. There are still others left which are not bound to the wrapping element, like `didRender`, `willUpdate` and others. Removing these lifecycle events can be done using a similar strategy as used in phase 5. Generally they can also be replaced with native getters.

### 8. Removing observers

Usage of observers has been discouraged in Ember for a long time. They were often overused when a better alternative was available, could cause performance issues, and were hard to debug. With Glimmer components, the `@observes` decorator is also no longer supported.

Refactoring of observers can be non-trivial as it requires you to think of your state updates differently. Rather than reacting to changes, Glimmer introduced autotracking which allows marking of inputs which should trigger UI updates. Some usages can be replaced by working with getters and autotracking. In other cases the `did-update` modifier of the `render-modifiers` package can be used as a replacement. Writing custom modifiers is also an option here.

### 9. And finally … extending from Glimmer!

Now that all classic specific features have been removed, it is time to extend the Glimmer component base class instead of the Ember classic one.

By making this change, arguments will move to the `args` object instead of the component’s local scope. Usages in the backing class have to be adjusted to use this step in between. One edge case to take into account is that by the change of this scope, they no longer override default values in the component. This can be resolved by writing a native getter which returns the argument from the `args` object and falls back to a default in case the argument is not passed.

Likewise, argument usages in the template also have to be updated to indicate the difference in scope. The `@` prefix has to be set for arguments as the codemod didn’t handle this like mentioned in phase 2.

Finally, the `tagName` decorator added in phase 5 can be removed as Glimmer components are always tagless.

## Conclusion

This article provided a strategy to migrate large Ember codebases from classic to Glimmer components. Following this component migration ensures codebases don’t get stuck in the past. Even better, they unlock modern features Ember provides and new ones being worked on at the very moment!

-----------------------------------------------------------

username: rajasegar
github_username: rajasegar
twitter_username: null
In this post, we are going to take a look at how to invoke Svelte components from an Ember.js application. Before diving into the topic let's have a quick intro about both these frameworks (or library) and look at why we want to integrate Svelte into an Ember codebase first.

## Ember
[Ember](https://emberjs.com/) is a  framework for ambitious web developers. It is a productive, battle-tested JavaScript framework for building modern web applications. It includes everything you need to build rich UIs that work on any device. It has been around for more than 10 years and is still preferred and used by a lot of companies.

## Svelte
[Svelte](https://svelte.dev/) is a radical new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step that happens when you build your app.

## Why?
There could be many reasons to integrate Svelte into an Ember.js application from performance, maintainability, technology heterogeneity, organizational reasons, developer availability to business priorities. My fellow Emberanos won't fully agree with me on these various reasons. It's okay. Yet I wanted to share my knowledge on some recent experiments I have done to help a larger community of people and to those who are looking to migrate from Ember to Svelte.

It is important to remember that Ember is not a bad framework. And Ember is still my first love ❤️ when it comes to JavaScript Frameworks and I am very grateful to the framework and the community since it has been a tremendous help in shaping my front-end career and building a lot of [tools](https://github.com/rajasegar?tab=repositories&q=ember&type=&language=&sort=). You really can't compare Ember with Svelte in absolute terms. Because it's apples and oranges.

## Setting up the Monorepo
We are going to setup a [monorepo](https://monorepo.tools/) for this post. That gives us a clear advantage of keeping the Svelte components and the Ember app separately, still within a single repository. We are going to use [pnpm workspaces](https://pnpm.io/workspaces) for the task at hand.

```
|-app
|--|-<Ember app>
|-some-svelte-lib
|--HelloWorld.svelte
|--package.json
|-README.md
|-pnpm-lock.yaml
|-pnpm-workspace.yaml
```

This is how I setup the monorepo structure using the command line.

```
mkdir ember-svelte-example
cd ember-svelte-example
touch README.md pnpm-workspace.yaml
mkdir app some-svelte-lib
cd app
degit ember-cli/ember-new-output#v4.10.0
cd ..
cd some-svelte-lib
touch HelloWorld.svelte package.json
```

Here I am using [degit](https://github.com/Rich-Harris/degit) to bootstrap our Ember app since the `ember-cli` doesn't allow you to create a new Ember app in the name of `app`.


Our `pnpm-workspace.yaml` file should look like something like this, indicating that the workspace contains two packages one Ember app and other Svelte component library.

```yaml
packages:
  - app
  - some-svelte-lib
```

## Compiling Svelte components with Ember
Now we will see how to configure Ember build pipeline with `ember-auto-import` to tweak the Webpack builder underneath to compile Svelte components. Before that we need to add the appropriate dependencies for compiling Svelte components like `svelte` and `svelte-loader`.

So from your Ember app root folder, run the following command to add the dependencies.

```
pnpm add -D svelte svelte-loader
```

This is how the modified `ember-cli-build.js` file inside the Ember app will look like. We are configuring the webpack loader to handle all the `.svelte` files from the Svelte package `some-svelte-lib` inside the monorepo.


```js

'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // Add options here
    autoImport: {
      webpack: {
        resolve: {
          // see below for an explanation
          alias: {
            svelte: path.resolve('node_modules', 'svelte'),
          },
          extensions: ['.mjs', '.js', '.svelte'],
          mainFields: ['svelte', 'browser', 'module', 'main'],
        },
        module: {
          rules: [
            {
              test: /\.(html|svelte)$/,
              use: 'svelte-loader',
            },
            {
              // required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
              test: /node_modules\/svelte\/.*\.mjs$/,
              resolve: {
                fullySpecified: false,
              },
            },
          ],
        },
      },
    },
  });

  return app.toTree();
};

```


## Rendering components via Modifiers

Modifiers are a basic primitive for interacting with the DOM in Ember. For example, Ember ships with a built-in modifier, `{{on}}`:

```hbs
<button {{on "click" @onClick}}>
  {{@text}}
</button>
```

All modifiers get applied to elements directly this way (if you see a similar value that isn't in an element, it is probably a helper instead), and they are passed the element when applying their effects.

Conceptually, modifiers take tracked, derived state, and turn it into some sort of side effect related in some way to the DOM element they are applied to.

To create our modifiers, we are going to use the `ember-modifier` addon inside our Ember app. Let's first install our addon.

```
ember install ember-modifier
```

Let's create a class-based modifier to render our Svelte components.

```
ember g modifier svelte --class
```

This is the code for the newly created modifier. Basically the modifier is trying to create a new Root element for the Svelte component and then it creates a new instance of the Svelte component and render it inside the element provided by the modifier. The `registerDestructor` function available in `@ember/destroyable` will help you to tear down the functionality added in the modifier, when the modifier is removed.

```js
import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

export default class SvelteModifier extends Modifier {
  modify(element, [svelteComponent], props) {
    // this is required , because Svelte appends to the DOM
    element.replaceChildren();
    this.component = new svelteComponent({
      target: element,
      props,
    });

    registerDestructor(this, () => this.component.$destroy());
  }
}

```

## Svelte Component
Our Svelte component is a simple component showing a message that can be toggled using the actions of an Ember component.
This is the code for our Svelte component.

```html
<script>
 export let onClick;
 export let message;
</script>

<div>
    <button on:click={onClick}>Toggle </button>
    <div>you said: {message}</div>
</div>

<style>
 button {
   background: red;
   color: white;
 }
</style>
```


## Creating a Ember wrapper component
Let's create our wrapper component for which we need a Glimmer component with class

```
ember g component example -gc
```

### Ember component.js
The code for the Ember wrapper component is simple. First we are importing our Svelte component from the shared library in our monorepo and assign it to a component property called `theSvelteComponent` which we will be using the main argument to our modifier. Then we have a tracked property message and an action toggle which are both props to the Svelte component. 

```js
import HelloWorld  from 'some-svelte-lib/HelloWorld.svelte';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  theSvelteComponent = HelloWorld;

  @tracked message = 'hello';

  @action toggle() { 
    if (this.message === 'hello') {
      this.message = 'goodbye';
    } else {
      this.message = 'hello';
    }
  }
}
```

### Ember Component template
And this is how we use the `svelte` modifier on a DOM element to render our Svelte component and pass our data from Ember via the props.

```hbs
<div {{svelte this.theSvelteComponent message=this.message onClick=this.toggle}} />
```

And this is how the Ember app looks like. Basically we are toggling a message with a button. Both the message data and the message handler functions are passed from Ember to Svelte component via the modifier props.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6lvegb5c9z2ciexuumgk.gif)

## Pros & Cons
Having used Svelte components inside an Ember app, let's discuss about the pros and cons of using the above mentioned approach to integrate Svelte into Ember.js applications.

### Pros
- Incrementally migrate an Ember codebase to Svelte
- Having a monorepo of both Ember and Svelte components
- Easy to consume the components, passing data via props and sharing the state with Modifier syntax
- Clean and simple approach

### Cons
- Need Ember wrapper components for each Svelte Component
- Hot module reloading won't work if you change code in Svelte components since it is a separate dependency via npm
- Passing children to Svelte components and slots is not possible, the Svelte components need to have their own children

## Sample repo
The code for this post is hosted in Github [here](https://github.com/rajasegar/ember-svelte-example). 

Please take a look at the Github repo and let me know your feedback, queries in the comments section. If you feel there are more pros and cons to be added here, please do let us know also.

-----------------------------------------------------------

username: ayka_code
github_username: aymenkani
twitter_username: aymenkkani
As a web developer, staying up-to-date with the latest technologies and frameworks is essential to success in the field. But with so many options out there, it can be overwhelming trying to decide which ones to focus on.

![react 2023](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/99eaysug19ijsbdl4raa.jpg)
In 2023, one framework that is worth considering is React. Developed and maintained by Facebook, React is a popular JavaScript library for building user interfaces. It allows developers to create reusable components, making it easier to build complex and scalable applications. Additionally, its virtual DOM (Document Object Model) allows for efficient updates and improved performance.

![angular 2023](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hh7p2ybd0i4qkxfor63n.jpg)
Another framework to keep an eye on in 2023 is Angular. Angular is a TypeScript-based open-source front-end web application framework led by the Angular Team at Google. It allows developers to build applications that can run on multiple platforms, such as web, mobile web, native mobile, and native desktop. Its component-based architecture and strong focus on coding best practices make it a great choice for large, enterprise-level applications.

![ember && Svelte ](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1f0orduaimy2m8p8o1jr.jpg)
While these two frameworks are worth considering, there are many other options out there as well. For example, Ember.js is a popular framework for building ambitious web applications. It has a strong focus on developer productivity and convention over configuration, making it a good choice for teams that value collaboration and rapid development. 
Here is a small example of using Ember.js to create a simple application that displays a welcome message:

```javascript
// Import the Ember.js library
import Ember from 'ember';

// Create a new Ember application
const App = Ember.Application.create();

// Define a route for the application
App.Router.map(function() {
  this.route('welcome');
});

// Create a controller for the route
App.WelcomeController = Ember.Controller.extend({
  // Define a message property
  message: "Welcome to Ember.js!",
});

// Create a template for the route
App.WelcomeRoute = Ember.Route.extend({
  template: Ember.HTMLBars.compile(`
    <p>{{message}}</p>
  `)
});

```

When the application is loaded, it will display the welcome message on the screen.

Similarly, Svelte is a relatively new framework that offers a unique approach to building user interfaces. Instead of using virtual DOM, Svelte compiles components at build time, resulting in small, efficient code that can run in the browser. Here is an example of using Svelte.js to create a button with a hover animation:

```javascript
<!-- Import the Svelte library -->
<script src="https://unpkg.com/svelte@3"></script>

<!-- Create a new Svelte component -->
<script>
  let isHovered = false;
</script>

<!-- Use the component in a template -->
<button
  on:mouseenter={() => isHovered = true}
  on:mouseleave={() => isHovered = false}
  class:hovered={isHovered}
>
  Hover me!
</button>

<!-- Define the styles for the button -->
<style>
  button {
    /* Default button styles */
  }
  
  button.hovered {
    /* Styles for the hovered state */
  }
</style>

```
When the user hovers over the button, the `isHovered` property will be set to `true`, which will apply the `hovered` class to the button. This class can be used to define styles for the hovered state of the button, such as an animation or a change in color.


![vuejs](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ubrp4tzvdv8cg5b7xt9p.jpg)
Finally, don't forget about Vue.js. Vue.js is a progressive, incrementally-adoptable JavaScript framework for building user interfaces. It has a similar component-based architecture to React and Angular, but is known for its simplicity and flexibility. Vue.js is a great choice for developers who want a lightweight framework that is easy to learn and use.

In conclusion, 2023 is shaping up to be an exciting year for web development. React, Angular, Ember, Svelte, and Vue.js are all worth considering as frameworks to learn and use in your projects. Keep an eye on these and other technologies to stay ahead of the curve and continue growing as a web developer.

-----------------------------------------------------------

username: rachgrey
github_username: null
twitter_username: null
When developers are looking for a technology for their web application the prime requirement of their quest is a high speed and less effort in the development. In this blog, we will be talking about two widely used technologies Vue.js and ember are progressive technologies that ensure high-end results for web applications for a long period of time.

Though both frameworks have extensiveness in their core nature, both have different features and traits which make them apart. Therefore, if you are confused and do not know which one to choose, it surely will be a difficult task for you to pick one. 

In order to resolve your dilemma, I have done background research for you. Dig a little deeper and gathered the pros and cons of both techniques which cover the dynamic aspects of both technologies. Especially working for [Vue Developers](https://www.bacancytechnology.com/hire-vuejs-developer) 

So, what are we waiting for? Let's get started then!

## Pros of Vue.js Framework

- Small and fast ecosystem
- Neat Documentation
- Simple code structure
- Flexible integration with the existing apps.
- Well laid-out structure
- Lighter and faster framework
- Feasible future update
- A conventional, faster approach to the development process

## Cons of Vue.js Framework

- Limited community
- Too much flexibility leads to code irregularities and errors
- Resource limitation through a small number of plugins and tools availability 

## Pros of Ember js framework

- Modernistic and elegant UI
- DDAU and MVC Architecture
- Improved built time with the faster development process
- Router Feasibility
- Constant resource of contributors in the community

## Cons of ember js Framework
- Slow pace rendering
- Difficulty in the integration process
- Conventional code configuration provides less room for pre-generated URLs 
- API limitations
- Viable for large projects but not advisable for small projects

So, these were the basic pros and cons list which gives you a helicopter view to measure the grounds. However, if you want to dig a little deeper a thorough comparison can be done on the basis of the performance. As performance is not a prominent factor that should be considered every time. But it should be considered while building large and complex projects.

## Performance-based comparison of Ember vs Vue
If we talk about ember it is largely used for building large-scale projects which require different sets of tools and plugins. However, its complexity becomes a bit of a problem while handling advanced functionalities. 

The server-side rendering and two-way binding are the two prominent features of ember functionality that glimmers by enabling fast pace rendering speeds.

On other hand, Vue.js stands out in terms of performance in a dynamic way. With each extension, the vue component becomes uncertain by causing the web app to be loaded.

Apart from that the virtual tool of Vuejs works solid when it comes to optimizing the performance of an app and is the default tool. And in order to improve the load time Vue.js framework has lazy loading that can turn out to be a prominent feature.

To conclude, both ember and vue have their own strength and limitations. You need to first identify what are your primary requirements that are needed to be focused on. 

If we look at it this way, Vue.js turns out to be a complete package compared to ember.js no matter what size or type of application you want to build.

Learning Vue is quite simple, However, the availability of the Vue.js developers that can provide in-depth knowledge to your project is quite difficult. In order to find experienced developers that can bring their expertise and unique skill set to the table, connect with leading [Vue.js Development Company](https://www.bacancytechnology.com/vuejs-development)

This way you can have access to the largest talent pool with the optimum utilization of your resources with the fastest web development process.


-----------------------------------------------------------

username: michalbryxi
github_username: MichalBryxi
twitter_username: MichalBryxi
Since the arrival of [Ember Octane](https://emberjs.com/editions/octane/) we could start using [native JavaScript classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).

And since the EmberJS community is awesome, it has created a [ember-native-class-codemod](https://github.com/ember-codemods/ember-native-class-codemod) to help out with the migration.

Sadly from the readme of the codemod:

> Unsupported Types
> While the codemods transforms many types of ember objects, it does not support transformation of
> ember-data classes such as DS.Model, DS.Adapter etc

So my entire data layer has been left out. And thanks to superb backwards compatibility it was ok. But now the time has come to do something about it.

The solution I used is _the cheapest_ I could come up with, but it's by no means bullet proof nor without the need of manual intervention. But it does _a lot_ of the work.

It uses [vscode](https://code.visualstudio.com/) global search&replace functionality:

## Native class

### Search

```
export default Model.extend\(\{((\n.*)*)\}\);
```

### Replace with

```
export default class TooLazyToNameModel extends Model {$1};
```

## @attr, @belongsTo, @hasMany

### Search

```
(\w*): (attr|belongsTo|hasMany)\((.*)\),
```

### Replace with

```
@$2($3) $1;
```

## Conclusion

Hope these might help someone out. I know that for example multiline attribute definitions won't be covered. So please share in comments improved versions and I'm happy to update.

-----

Photo by <a href="https://unsplash.com/@francogio?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Franco Antonio Giovanella</a> on <a href="https://unsplash.com/s/photos/regular-expression?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  

-----------------------------------------------------------

username: sivasu66
github_username: sivasu66
twitter_username: SivasuRamar
**Syntax**

```html
{{link-to routeName  dynamicSegment1 dynamicSegment2 (query-params key1=value1 key2=value2)}}

(or)

{{link-to params=linkParameters}}
```

**Description**

Consider a photo application with below routes
```js
this.route('photos', function() {
  this.route('resolution', {
    path: '/:value'
  });
});
```

Compute links in component
```js
linkParametersVariation1: computed({
  get() {
    let resolution = get(this, 'resolution);
    return { 'routeName': 'photos/resolution', dynamicSegment: resolution, page: 1, perPage: 30 }
  }
}),

linkParametersVariation2: computed({
  get() {
    let resolution = get(this, 'resolution);
    return ['photos/resolution', resolution, { isQueryParams: true, values: { page: 1, perPage: 30 } }]
  }
})
```

Using links in template
```html
{{#link-to linkParametersVariation1.routName linkParametersVariation1.dynamicSegment (query-params page=linkParametersVariation1.page perPage=linkParametersVariation1.perPage)}}
  <div>variation1</div>
{{/link-to}}

{{#link-to params=linkParametersVariation2}}
  <div>variation2</div>
{{/link-to}}
```


-----------------------------------------------------------

username: asasmith
github_username: asasmith
twitter_username: average_dev_asa
---
title: Using Tailwind CSS v3 with Ember JS
published: true
description: Using Tailwind CSS v3 with Ember JS
tags: javascript, emberjs, tailwindcss
canonical_url: https://asasmith.com/tailwindcss-v3-emberjs-setup
---

Tailwind CSS v3 has been released and there is a bunch of cool new features available (I'm mostly interested in the "just in time" engine being standard now). The standard setup for an ember project has changed a little and there doesn't seem to be a lot of good resources available for this setup.

Create a new ember project.

```zsh
npx ember-cli new tailwindcss-demo --no-welcome
cd tailwindcss-demo
```

Install tailwind and related packages.

```zsh
npm install tailwindcss autoprefixer --save-dev
# no need for purgecss anymore
```

Install postcss add on.

```zsh
ember install ember-cli-postcss
```

Create tailwind config.

```zsh
# I create a tailwind dir in styles and add the config file there
# this is a personal organizational choice, the config file could live anywhere
mkdir app/styles/tailwind

# create tailwind config file
# last arg is path to config file
# if no arg is provided it will be created at the root of your project
# this path will be needed when updating ember-cli-build.js
npx tailwind init app/styles/tailwind/config.js
```

There isn't a `purge` key in the config file anymore. Update the `content` key with paths to all template files. The config docs are [here](https://tailwindcss.com/docs/content-configuration)

```javascript
// app/styles/tailwind/config.js

module.exports = {
  content: ['./app/**/*.hbs'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `app/styles/app.css`

```css
/* app/styles/app.css */

@tailwind base;
@tailwind components;
@tailwind utilities;
```

Update `ember-build-cli.js`

```javascript
// ember-build-cli.js

'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const autoprefixer = require('autoprefixer');
const tailwind = require('tailwindcss');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    postcssOptions: {
      compile: {
        // track changes in template, css, scss, and tailwind config files
        cacheInclude: [/.*\.(css|scss|hbs)$/, /.tailwind\/config\.js$/],
        plugins: [
          {
            module: autoprefixer,
            options: {},
          },
          {
            module: tailwind,
            options: {
              config: './app/styles/tailwind/config.js',
            },
          },
        ],
      },
    },
  });

  return app.toTree();
};
```
That's it. You should be up and running with Ember and Tailwind now!

[Repo](https://github.com/asasmith/tailwindcss-v3-ember) for this demo.

-----------------------------------------------------------

username: real_ate
github_username: mansona
twitter_username: real_ate
---
title: It's all Gravy
published: true
description: 
tags: emberjs, opensource
cover_image: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b9k4ehf07f2lxfg95t2v.jpg
canonical_url: https://chris.manson.ie/it's-all-gravy/
---



Anyone that knows me will already know that I do a lot of Open Source development. I’ve been positively Open Source obsessed for over 15 years now and enjoy working on Open Source so much that I often describe it as a hobby and regularly work on it in my evenings and weekends.

One of the things that I like to do is to encourage people to contribute to Open Source, leading projects within the Ember community as part of my role on the Ember Core Learning Team and regularly end up "assigning" people work as part of those projects. Sometimes I have a mentoring-style relationship with people where we would meet every week to discuss the work that they have been doing and see if there is anything I can do to unblock them. Invariably I will always have someone say in one of these calls that they are “really sorry but I haven’t been able to do any work on the task this week”. I have always told them the same thing, and for the longest time, I have also told them that I really need to write down my thoughts in a blog post so that I can just send people the link when it comes up. This is that blog post!

## You have already gone above and beyond

The conversation that I have with people when they haven't been able to get their "assigned task" done in the context of Open Source usually goes a little something like this:

> You are doing this work as part of your free time. You have already done something for this project which is already going above and beyond, anything you do past this point is all gravy.

Even if the person had never written a line of code/documentation/configuration etc. and have just had a conversation about an issue, they have already done more than expected because they were never **expected** to do anything. We always need to keep in mind that most open source contributions are given from people that are opting to give up their spare time (usually for free) and the level of expectation can never come anywhere close to the sort of relationship that an employer might have with an employee or contractor.

When planning in an Open Source context I never have any expectation that anyone will complete any task they say that they do, even if they say they are working on it right now and **guarantee** that it will be done by 5pm tonight. Even when I’m talking to colleges of mine who also happen to work in a company that provides 20% time to work on open source, I never feel bad if they don’t do something they said they would. Open source is an amorphous anarchy of projects that are usually driven by people’s interests and passions so any of the regular project management expectations don’t apply here.

If you say you are going to do something don’t feel bad if you don’t get it done, it is never a problem.

--- 

This post was originally posted on my personal blog https://chris.manson.ie/it's-all-gravy/

-----------------------------------------------------------

username: charlesfries
github_username: charlesfries
twitter_username: charlesfries
Do you have an Ember.js app that's written in TypeScript, but aren't sure how to get `eslint` to play well with TypeScript files? Read this tutorial to learn how.

First, let's make a new Ember app and immediately install TypeScript.

```
ember new my-app
cd my-app
ember install ember-cli-typescript
```

Now we have a brand new Ember app that is ready for TypeScript code. But you'll soon realize after generating some TypeScript files that writing obviously erroneous TypeScript code in these files doesn't yield any of the normal eslint messaging we get from `.js` files.

To fix this, we need to install a TypeScript parser and plugin, and let `eslint` know that we want to use this custom configuration. Here's how we do that:

```
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

This command will install two TypeScript `eslint` packages to your app. Now the only thing left to do is update your `eslint` configuration file so it can make use of these packages. In a standard Ember app, this file is located at `/.eslintrc.js`. 

We're only changing three lines here--we just need to tell `eslint` that we have a custom parser and an additional plugin we want to utilize:

```diff
// .eslintrc.js

module.exports = {
  root: true,
- parser: 'babel-eslint',
+ parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
      ],
    },
  },
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {},
  overrides: [
    ...
+   {
+     // typescript files
+     files: ['**/*.ts'],
+     plugins: ['@typescript-eslint'],
+     extends: ['plugin:@typescript-eslint/recommended'],
+     rules: {
+       '@typescript-eslint/explicit-module-boundary-types': 'error',
+     },
+   },
  ],
};
```

The first change swaps the standard `babel-eslint` parser for a custom one that can handle .ts files. The other two changes tell `eslint` that, in addition to the normal `eslint`, `prettier`, and `ember` rules, we want to also lint using the rules provided by `@typescript-eslint/recommended`.

Note: you can also now uninstall `babel-eslint` whose job is now handled by `@typescript-eslint/parser`.

```
npm uninstall babel-eslint
```

Bonus: if you'd like more strenuous type checking, you can make the following changes to make `eslint` aware of the type system:

```diff
// .eslintrc.js

module.exports = {
  ...
  overrides: [
    ...
    {
      // typescript files
      files: ['**/*.ts'],
+     parserOptions: {
+       project: true,
+       tsconfigRootDir: __dirname,
+     },
      plugins: ['@typescript-eslint'],
-     extends: ['plugin:@typescript-eslint/recommended'],
+     extends: [
+       'plugin:@typescript-eslint/recommended',
+       'plugin:@typescript-eslint/recommended-requiring-type-checking',
+     ],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'error',
      },
    },
  ],
};
```

And that's it! You should be able to execute `npm run lint` or `npm run lint:fix` and have you entire project linted.

-----------------------------------------------------------

username: jenweber
github_username: jenweber
twitter_username: null
---
title: Remodeling an Ember App - Codemods and jQuery
published: true
description: How to strategically use codemods while upgrading an Ember app
tags: ember, emberjs
canonical_url: https://www.jenweber.dev/remodeling-an-ember-app---codemods
---

When you need to upgrade and ember app, codemods can help you update your app's syntax faster than you could make changes by hand. Today, we'll talk about codemods and cover what to do about jQuery usage in your apps.

This is Part 4 of a series of blog posts. We're on a journey together to remodel an older Ember app, [ember-api-docs](https://github.com/ember-learn/ember-api-docs), incrementally bringing it up to date with the latest and best Ember and Ember Data patterns.

For this series, I'm pair programming with Chris Thoburn, aka [@runspired](https://github.com/runspired), who is known for
his work on Ember Data. He has over 500 commits and some great
debugging skills that you and I can learn from.

## What you will learn in this segment

- How to find codemods
- How to run the codemods
- How to decide what to change, and what to leave alone
- Where jQuery fits into the story

## The road so far

So far, we have upgraded our dependencies and tests are all passing. This sets a strong foundation for running codemods and then making sure that tests keep passing.

## Octanify

Ember Octane is Ember's first "edition." You can think of an edition as a collection of features and syntax that together form a cohesive mental model. There are multiple ways to accomplish a feature in Ember, and Octaneified apps use the latest styles.

There is a CLI command that configures an app to use Octane:

```
npx @ember/octanify from   which set some dependencies and flipped flags in optional-features.json
```

You can find more instructions about this command in the [Ember upgrade guide](https://guides.emberjs.com/release/upgrading/current-edition/). In short, it sets some dependencies in `package.json` and feature flags in `optional-features.json`. Optional features are one way that new features are rolled out in Ember apps without making breaking changes. When you are ready, you can opt into them, but if you are not ready, you aren't blocked from upgrading. Regular upgrading is critical for companies and teams that value getting security, bugfixes, and feature updates over long periods of time.

Octanify sets the following feature flags in `optional-features.json`:

```
{
  "default-async-observers": true,
  "jquery-integration": false,
  "template-only-glimmer-components": true,
  "application-template-wrapper": false,
}
```

You can learn all about these individual features in the [Optional Features Guide](https://guides.emberjs.com/release/configuring-ember/optional-features/).

## Handling jQuery

For our app, all the optional features set by Octanify were fine. Setting `jquery-integration: false` meant that instead of using `this.$()` in our apps, we had to install `@ember/jquery` and import jQuery individually - no problem. However, the `jquery-integration` flag made us wonder, could we remove `jQuery` from our app altogether? We were only using it in one place in our app, and doing so would cut some kb from our app.

However, we didn't just need to check our app. We also had to check if any addons used jQuery. I used to search my `node_modules` for usages, but that would return a lot of false positives compared to a strategy that Chris Thoburn showed me.

Chris first ran the build for the app:

```sh
npx ember build
```

By default, the command puts built files in the `dist/` directory. Then, Chris was able to search for `this.$` and `Ember.$` and confirm that our app's addons did not need jQuery. This is better than searching `node_modules`, since we are only checking for the use of jQuery in addon features we are _actually using_.

Another common use of jQuery in apps is via Ember Data. By default, Ember Data uses jQuery for its HTTP requests. However, if an app has `ember-fetch` installed, it will use `fetch` instead. It's important to install `ember-fetch` in order to provide broad browser support for your fetch requests.

Finally, we took another look at our direct use of jQuery in this app, in our Table of Contents component:

```js
import { action } from '@ember/object';
import Component from '@ember/component';
import jQuery from 'jquery';

export default class TableOfContents extends Component {
  @action
  toggle(type) {
    jQuery(this.element)
      .find('ol.toc-level-1.' + type)
      .slideToggle(200);
  }
}
```

jQuery is providing a nice open/close animation for one of our menus. Whenever I see jQuery in use, I always check [youmightnotneedjquery](http://youmightnotneedjquery.com/) to see if there's an easy alternative. In this case, there was not, so in the interest of moving forward, we leave jQuery in our app for now, and open an issue asking for help making a new CSS/plain JavaScript animation.

It's not a huge deal to leave jQuery in your app unless you have a strategic, benchmarked focus on app performance. jQuery is an incredibly successful project - so successful that its best features are now provided by native browser JavaScript. Ember's API documentation app is used by developers around the world with varying internet quality levels, and so we do need to save some kb where we can, however this one task should not block our progress towards improving other areas of the app.

## Ember CLI Update Codemods

Now on to some more codemods. [Ember CLI Update](https://github.com/ember-cli/ember-cli-update) can update your dependencies, and also provides a subset of the most common codemods that make deeper changes.

After running dependency updates, you can run the codemods like this:

```sh
# Start your app
npx ember serve
# Run the codemods
npx ember-cli-update --run-codemods
```

Some codemods start with the letters `fpe`. This stands for "function prototype extension."

## Additional codemods

There are many more codemods than those provided by Ember CLI update. One good place to look for them is [ember-codemods](https://github.com/ember-codemods) on GitHub.

Some codemods require that you have your app running. That's why we start the app with `ember serve`. Such codemods look at the built files in order to infer the correct changes to make. This is possible through a strategy called telemetry, via [`ember-codemods-telemetry-helpers`](https://github.com/ember-codemods/ember-codemods-telemetry-helpers).

### A problem with one codemod

When we ran `ember-modules-codemod`, we encountered an error. The codemod helpfully told us which line it failed on:

```js
titleToken(model) {
  return model?.fn?.name;
}
```

This line of code uses optional chaining, with `?.` syntax. Optional chaining is a feature of JavaScript that was added _after_ these codemods were initially written.

We can see for ourselves one of the challenges of codemods - when they are written, they are a snapshot in time. It takes work to keep them functioning as JavaScript and Ember apps change. If you are working on a large app, it may be less work to fix a codemod bug than to make all the changes by hand. Additionally, codemods are written to work for individuals' apps, and so it takes community effort for codemods to work across many edge cases that authors could not forsee.

Another example of maintainability issues with codemods is the ES5 getter codemod - you have to run it before you run native classes codemods, because it doesn't know how to parse native classes. They didn't exist when the getter codemod was written. These aren't unsolvable problems, but they mean that developers whose apps are super out of date may have a harder time upgrading. There are many benefits to having a regular ugrade and maintenance schedule for your work, and this is one example.

## Configuring VSCode to play nice with decorators

Some of the codemods we ran introduced decorators. VSCode was our code editor of choice, and its default linters didn't like the use of decorators.

We removed `jsconfig.json` from our app's `.gitignore`, and then configured VSCode to stop yelling about decorators in `jsconfig.json`:

```
{
    "compilerOptions": {
      "experimentalDecorators": true
    },
}
```

## Dealing with codemod mistakes

Not all codemods are flawless. There's a lot of variation in an app! You should think of them has helpful suggestions, rather than a complete solution to your upgrade process. The best way to catch codemod mistakes is to carefully review the diff, run your tests, and make a commit after each codemod. Here's an example issue we had with a codemod that rewrote `link-to`:

```handlebars
// before codemod

{{#link-to
  data-test-uses-link
  (concat parentName section.routeSuffix)
    model.project.id
    model.projectVersion.compactVersion
    model.name
    item.name
    (query-params anchor=item.name)}}
  {{item.name}}
{{/link-to}}

// after codemod
<LinkTo @route={{concat this.parentName section.routeSuffix }} @models={{array this.model.project.id this.model.projectVersion.compactVersion}} @query={{hash anchor=item.name}}>
```

The codemod cut out some of our route segments, leading to incorrect links in one part of the app:

```text
// correct
/ember-data/3.26/classes/Ember.Inflector/methods/singular?anchor=singular

// incorrect
/ember-data/3.26/classes/ember-data/methods/3.26?anchor=singular
```

How did this happen? We took a look at the source code for the codemod, and saw that it has special handling for dynamic routes, query params, and data-test. When we used all three of these things together in one link-to, it was the perfect storm.

## Codemod strategies and takeaways

Our upgrade would have been easier if we ran a single codemod at a time, and make it its own commit, and ran it in CI, and shipped it. If you have the ability to roll your app back quickly in production, you don't need to work as carefully.

That said, you really need to go through the diff if you try to do a big bang upgrade.

If your test suite coverage is bad, and you can't improve it, you can run codemods on specific chunks of code and QA them - do one set of related components at a time, then look at the diff and click test. Many (or maybe all) codemods accept file paths in the CLI commands.

## Conclusion

That's it for codemods! Next up, we will take a look at the code that couldn't be modded, and do some refactors to simplify the app now that we have Octane's awesome features available, such as `tracked`. Thanks for reading!

-----------------------------------------------------------

username: davideferre
github_username: davideferre
twitter_username: null
Less than 2 years ago I started a new project with the company I work for that requires to an [Ember Octane](https://emberjs.com/editions/octane/ "Ember.js Octane edition") app to control several connected IoT devices around the world. We choosed the [MQTT](https://en.wikipedia.org/wiki/MQTT "MQTT on Wikipedia") publish/subscribe network protocol to interact with our on-field devices for its lightweight message structure and its limited network bandwith requirements.

After googling for a javascript MQTT library I’ve found the [MQTT.js](https://github.com/mqttjs/MQTT.js "MQTT.js") client. At the moment of my search the [asynchronous version](https://github.com/mqttjs/async-mqtt "Async MQTT.js") was not yet released, so I had to wrap the event based client into an Ember service and transform it into a Promise based client.

This is a mandatory requirement because I need broker connection before subscribing to a topic or I need topic subscription before publishing on it. Sometimes you had retain messages on a topic for receiving last published value after the subscription. Other times you need publishing an empty value on a topic to request the status of a given device. So you need working subscribtion on a topic before sending a message. That said javascript [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise "Javascript Promise") are the only way to accomplish this tasks.

When I wrote this service I didn't find an Ember addon ready to do this things. Therefore I decided to dive into the [docs](https://cli.emberjs.com/release/writing-addons/intro-tutorial/ "Writing your first Ember.js addon") and learn how to build an addon. The [ember-mqttjs](https://github.com/domoticalabs/ember-mqttjs "ember-mqttjs GitHub page") addon is my first Ember addon!

## The code

This service extends the [Evented](https://api.emberjs.com/ember/release/classes/Evented "Evented Ember object") Ember object for raising events on new messages as well as connect, disconnect events and many others you can find on its [readme](https://github.com/domoticalabs/ember-mqttjs/blob/master/README.md "Readme for ember-mqttjs"). In addition of raising this events it returns a Promise for connect, subscribe, unsubscribe and publish methods.

This is an example of another service that uses the ember-mqttjs service:

```javascript
import Service, { inject as service } from '@ember/service';
import { bind } from '@ember/runloop';

export default class YourService extends Service {
  @service mqtt;
  constructor() {
    super(...arguments);
    //...
    let _fOnMessage = bind(this, this._onMessage);
    this.mqtt.on('mqtt-message', _fOnMessage); 
  }

  _onMessage(sTopic, sMessage) {
    //code to manage messages received on a certain topic
  }

  async subscribeAndPublish(sTopic, sMessage) {
    try {
      await this.mqtt.connect(HOST, USERNAME, PASSWORD)
    } catch (oError) {
      //code on connection error
    }
    try {
      await this.mqtt.subscribe(sTopic);
    } catch (oError) {
      //code for subscription error
    }
    try {
      await this.mqtt.publish(sTopic, sMessage);
    } catch (oError) {
      //code for message publish error
    }
    return Promise.resolve();
  }
//...
}
```

I've just refactored the addon code to use async/await features and I moved the [CI](https://en.wikipedia.org/wiki/Continuous_integration "Continuos integration on Wikipedia") from travis to github action (thanks to this Jeldrik Haschke's [repo](https://github.com/jelhan/create-github-actions-setup-for-ember-addon)).  
Many improvements can be done in the future starting from writing more tests to cover other cases.  
If you have any suggestions or proposal to improve the code as well as the tests you are welcome!

[Contact me](https://blog.davideferrero.com/contacts/ "Contact me") or start contributing on [GitHub project repo](https://github.com/domoticalabs/ember-mqttjs "GitHub project repository")!

-----------------------------------------------------------

username: jayjayjpg
github_username: jayjayjpg
twitter_username: jayjayjpg
Developing and maintaining a growing **front-end** code base is complex on its own. And only sufficient **test coverage** will allow you to continue to build features with confidence and without the fear of critical regressions.

Therefore, automatic testing is an important part of your and your team's joint efforts to build web applications, including your Ember apps.

Still, writing tests can be time-consuming.

Despite **powerful testing tools** available in the JavaScript and [Ember ecosystem](https://emberobserver.com/categories/testing) today, and even considering that the [framework already provides you a great foundation for testing](https://guides.emberjs.com/release/testing/), you might still need to spend some time defining your own project-specific test setup.

You may have written custom stubs and mocks for those services, network requests and third-party libraries that can't be easily simulated during your testing scenarios otherwise. And as your application grows, often the number of custom testing helpers you need to include in many, if not all, of your test files increases as well.

This in turn introduces a new entry barrier for developers who are new to the code base and who want to write their first test: Due to a lack of familiarity with all the project-specific configurations, they might either spend a lot of time trying to figure out what kind of setup to copy-paste from existing test files of your test suite into their own.

Or due to a lack of time, they might just avoid writing that test altogether.

Still, **writing tests** is important and should require you as little on-ramp time as possible - even as your application grows.

What if you could **automate** the project-specific **setup of your tests**, so you can focus on the actual work of writing the testing scenarios for your features instead of worrying about how to setup the test to begin with?

Fortunately, Ember CLI has you covered with tools to do exactly that.

But first, let's take a look into how **test scaffolding in in Ember apps** works in general, and secondly, how we can modify the process for our testing needs.

## Easy Test Scaffolding with Generate Commands

Out of the box, the [Ember CLI](https://cli.emberjs.com/) already provides you with [several `generate` commands](https://cli.emberjs.com/release/basic-use/cli-commands/#generatemorefiles) to get started with writing your tests.

This is how you would start off writing an application test for `my-feature`:

```bash
# create a pre-configured application test file for 'my-feature'
ember generate acceptance-test my-feature
```

Running this command in your shell will provide you with the following setup:

```javascript
// tests/acceptance/my-feature-test.js

import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | my feature', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /my-feature', async function(assert) {
    await visit('/my-feature');

    assert.equal(currentURL(), '/my-feature');
  });
});
```

Check out the [official Ember CLI Guides](https://cli.emberjs.com/release/advanced-use/blueprints/) for more information on how to **generate and use blueprints**.

In the next step, you would usually start to modify the test file with your own **custom testing setup**, e.g. by invoking test utils you have written yourself or by importing methods from other testing libraries you frequently use.

Luckily, you don't need to do all of this work by hand.

Instead, you can automate this modification process and instruct the cli's `generate` command to create a custom test file, instead of the default one.

This is where **Ember CLI blueprints** come in.

## Blueprints Define Your Testing Scaffold Layout

Anytime you run `ember generate acceptance-test xyz`, the cli will create your test file based on your command-line input and the [framework blueprint that is associated with the `acceptance-test` parameter](https://github.com/emberjs/ember.js/blob/master/blueprints/acceptance-test/qunit-rfc-232-files/tests/acceptance/__name__-test.js):

```javascript
// blueprints/acceptance-test/qunit-rfc-232-files/tests/acceptance/__name__-test.js

import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('<%= friendlyTestName %>', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /<%= dasherizedModuleName %>', async function(assert) {
    await visit('/<%= dasherizedModuleName %>');

    assert.equal(currentURL(), '/<%= dasherizedModuleName %>');
  });
});
```

The configuration of the process itself, e.g. which naming convention to use to name your test modules, is done in the blueprint's [`index.js`](https://github.com/emberjs/ember.js/blob/master/blueprints/acceptance-test/index.js):

```javascript
// blueprints/acceptance-test/index.js

'use strict';

const fs = require('fs');
const path = require('path');
const pathUtil = require('ember-cli-path-utils');
const stringUtils = require('ember-cli-string-utils');

const useTestFrameworkDetector = require('../test-framework-detector');

module.exports = useTestFrameworkDetector({
  description: 'Generates an acceptance test for a feature.',

  locals: function (options) {
    let testFolderRoot = stringUtils.dasherize(options.project.name());

    if (options.project.isEmberCLIAddon()) {
      testFolderRoot = pathUtil.getRelativeParentPath(options.entity.name, -1, false);
    }

    let destroyAppExists = fs.existsSync(
      path.join(this.project.root, '/tests/helpers/destroy-app.js')
    );

    let friendlyTestName = [
      'Acceptance',
      stringUtils.dasherize(options.entity.name).replace(/[-]/g, ' '),
    ].join(' | ');

    return {
      testFolderRoot: testFolderRoot,
      friendlyTestName,
      destroyAppExists,
    };
  },
});
```

And even better: You can also customize the default scaffolding by **overriding** existing blueprints.

By generating your own `acceptance-test`  blueprint in your project, you can now extend this functionality with your own, custom acceptance test setup in a single `generate` command.

## Writing Your Own Testing Blueprint for Your Ember App

To get started, you can use `ember generate` while in your Ember application's directory again:


```bash
ember generate blueprint acceptance-test
```

This should leave you with a new blueprint configuration file at `blueprints/acceptance-test-index.js`:

```javascript
'use strict';

module.exports = {
  description: ''

  // locals(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  // afterInstall(options) {
  //   // Perform extra work here.
  // }
};
```

To create your own modified version of **acceptance test blueprints**, you can lend most of the [framework's default setup](https://github.com/emberjs/ember.js/tree/master/blueprints/acceptance-test) for your specific test setup.

For a recent app, which uses QUnit and the [latest Ember QUnit API](https://github.com/emberjs/rfcs/blob/master/text/0232-simplify-qunit-testing-api.md), your `index.js` could look like this:

```javascript
// blueprints/acceptance-test/index.js
'use strict';

const fs = require('fs');
const path = require('path');
const stringUtils = require('ember-cli-string-utils');

module.exports = {
  description: 'Generates an acceptance test for a feature.',

  locals: function (options) {
    let destroyAppExists = fs.existsSync(
      path.join(this.project.root, '/tests/helpers/destroy-app.js')
    );

    let friendlyTestName = [
      'Acceptance',
      stringUtils.dasherize(options.entity.name).replace(/[-]/g, ' '),
    ].join(' | ');

    return {
      testFolderRoot: 'tests/acceptance/',
      friendlyTestName,
      destroyAppExists,
    };
  },
};
```

Next, copy over the directory structure [from the list of framework blueprints](https://github.com/emberjs/ember.js/tree/master/blueprints/acceptance-test) for your particular test setup into the a new `blueprints/acceptance-test/files` directory in your project, including the default template `__name__-test.js`.

We assume you're working with a recent Ember app using the latest Ember QUnit API in this example:

```
# copy from framework blueprints file layout...
-- qunit-rfc-232-files
    |-- tests
        |-- acceptance
            |-- __name__-test.js

# ...to your project's file layout
-- files
    |-- tests
        |-- acceptance
            |-- __name__-test.js
```

```javascript
// blueprints/acceptance-test/files/tests/acceptance/__name__-test.js
import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('<%= friendlyTestName %>', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /<%= dasherizedModuleName %>', async function(assert) {
    await visit('/<%= dasherizedModuleName %>');

    assert.equal(currentURL(), '/<%= dasherizedModuleName %>');
  });
});
```

Now you can modify the template at `blueprints/acceptance-test/files/tests/acceptance/__name__-test.js` to your needs.

In this example, we want to ensure that in each new acceptance test file generated in the future, an additional helper util from our project is imported, that [ember-sinon-qunit](https://github.com/elwayman02/ember-sinon-qunit) is setup correctly and - most importantly - that our module description sparkles ✨:


```javascript
// blueprints/acceptance-test/files/tests/acceptance/__name__-test.js
import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { sinon } from 'sinon';

import { setupStripe } from 'my-ember-app/tests/helpers/stripe-mock';

module('<%= friendlyTestName %> ✨✨✨', function(hooks) {
  setupApplicationTest(hooks);
  setupStripe(hooks);
  
  hooks.beforeEach(function() {
    this.testStub = sinon.stub();
  });

  test('visiting /<%= dasherizedModuleName %>', async function(assert) {
    await visit('/<%= dasherizedModuleName %>');

    assert.equal(currentURL(), '/<%= dasherizedModuleName %>');
  });
});
```

Finally, if we run the `generate` command for creating an acceptance test again, the cli will use our custom testing blueprint configuration and **modify our test file** accordingly. Check it out:


```bash
ember generate acceptance-test my-feature
```

```javascript
// tests/acceptance/my-feature-test.js
import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { sinon } from 'sinon';

import { setupStripe } from 'my-ember-app/tests/helpers/stripe-mock';

module('Acceptance | my feature ✨✨✨', function(hooks) {
  setupApplicationTest(hooks);
  setupStripe(hooks);

  hooks.beforeEach(function() {
    this.testStub = sinon.stub();
  });

  test('visiting /my-feature', async function(assert) {
    await visit('/my-feature');

    assert.equal(currentURL(), '/my-feature');
  });
});
```

Now you're all set to start testing with one single command!

## Improve Your Developer Experience with Ember and Custom Blueprints

You can **save yourself and your team time** by automating the setup of your test files leveraging blueprints in Ember.

**Blueprints** allow you to override the templates for existing testing `generate` commands, such as `ember generate acceptance-test` or `ember generate component-test`.

Beyond the scope of testing and which `generate` commands the framework already offers, you can [add your own `generate` commands](https://cli.emberjs.com/release/advanced-use/blueprints/), too. If you always wanted to make it easier to write documentation for your project, why not create a `ember generate docs`  blueprint today?

---

Jessy is a Senior Frontend Engineer at [Meroxa](https://meroxa.io/), a public speaker and an organizer of the [EmberJS Berlin](https://twitter.com/emberliners) meetup. Also, if you're into design, devops or data engineering, [come join us!](https://jobs.lever.co/meroxa)



-----------------------------------------------------------

username: michalbryxi
github_username: MichalBryxi
twitter_username: MichalBryxi
Ever uploaded your cool new project to Netlify and everything just seemed to work, but you seemingly randomly get a "Page Not Found" error? The reason might be very simple as well as the solution.

## The problem

1. Open the URL of your deployed [empress-blog](https://empress-blog.netlify.app/) instance on your [Netlify](https://app.netlify.com/) account
2. Navigate to any subpage that _changes the URL_
3. Execute hard, full page reload (cmd + shift + R)
4. See Netlify 404 page:

![Netlify 404](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qojv12ru48417slhi2ni.png)

## Manual solution (not preferred)

Create [_redirects](https://docs.netlify.com/routing/redirects/) file in `/public` folder with following content:

```
# /public/_redirects

/*    /index.html   200
```

Deploy your site again. And the problem should be gone.

### Why this works
 
[Single Page Applications](https://en.wikipedia.org/wiki/Single-page_application) (SPAs) usually consist of three files: `index.html`, `everything.js` and `everything.css`. Although it seems like the user can click on various _links_, navigate around and as a side effect change URL, those are all just a mirage. Well, sort of. The clicking happens for sure and the URL in the address bar also change. Just not in the ["traditional" sense](https://github.com/alex/what-happens-when).

After a click, the browser is not sending a request to the server. Instead, some JavaScript magic happens and it manipulates the content of the page and the URL bar to make it seem like the page has changed.

But unfortunately when you do a hard reload the browser sends a request to the server for whatever page is currently in the URL. But the server does not have those. Only one file: `index.html`. So how does the `_redirects` file save the day? Let's break down the syntax:

- `/*` matcher: every possible URL that the user requested (the star is a wildcard)
- `/index.html` if the matcher matched, then serve this page instead
- `200` an "OK" [HTTP response code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) from the server

So a request to every page will be redirected to our only file (`index.html`) and that one will then display respective content, because of JavaScript SPA magic.

## Automatic solution (preferred)

As mentioned in the comments: This should just work out of the box if you install `empress-blog` using `ember` command instead of `npm/yarn`:

```sh
ember install empress-blog # do this
# npm install empress-blog # do NOT do this
```

### Why this works

The command `ember install [something]` can do [some additional work](https://guides.emberjs.com/release/addons-and-dependencies/#toc_addons) and in this case installs [prember](https://github.com/ef4/prember) and [ember-cli-fastboot](https://github.com/ember-fastboot/ember-cli-fastboot) which are the main pieces that will make the sub-pages work on full page reload.

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h7tziil9dcqx9lj8h269.png)

## Note

- The issue described here is **not** specific to empress-blog nor to Netlify. It's just the combination where I see it most often. So I used it as an example to talk about something specific.
- **Any** SPA deployed via any hosting provider will have this problem.

-----

Photo by <a href="https://unsplash.com/@nate_dumlao?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Nathan Dumlao</a> on <a href="https://unsplash.com/s/photos/404?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  

-----------------------------------------------------------

username: mattbeiswenger
github_username: mattbeiswenger
twitter_username: mattbeiswenger
Ember CLI allows you to build your Ember application for different environments by passing a `--environment` option to the `ember build` command. For example, if we wanted to build for a production environment we would run the command `ember build --environment production`.

We can then configure our environment variables in `config/environment.js`. If we wanted to configure an API endpoint for different environments, we could do the following:

```javascript
import ENV from 'my-app/config/environment'

if (ENV.environment === 'development') {
  ENV.APP.API_HOST = 'http://localhost:8000'
}

if (ENV.environment === 'production') {
  ENV.APP.API_HOST = 'https://www.myserver.com/api'
}
```

This works great for applications that only deploy to one server. But what if we wanted to deploy to a staging server? You might think that you can do this:

```javascript
import ENV from 'my-app/config/environment'

// DO NOT DO THIS
if (ENV.environment === 'staging') {
  ENV.APP.API_HOST = 'https://staging.myserver.com/api'
}
```

This will deceivingly work, but it's bad practice. This is because Ember actually ships with only three build environments:

1. `test`
2. `development`
3. `production`

When one of these environments aren't passed as the `--environment` option, Ember CLI defaults to the development environment but will still run the logic for the passed environment in `config/environments.js`. So, in the example above, the API endpoint will correctly be set to `https://staging.myserver.com/api`, but the application will be built as a development environment. This means that we lose important benefits of building as a production environment such as [minifying](https://cli.emberjs.com/release/advanced-use/asset-compilation/#minifying) and [fingerprinting](https://cli.emberjs.com/release/advanced-use/asset-compilation/#fingerprintingandcdnurls) files.

The problem is that the example code above **conflates the Ember build environment with the deployment environment**. This is fine if you have one production environment but becomes a problem when you want to deploy to multiple environments. So what are we supposed to do? The solution is to use the popular community addon `ember-cli-deploy`.

`ember-cli-deploy` allows us to separate the build environment from the deployment environment by exposing an `ember deploy` command. You can install the addon by running `ember install ember-cli-deploy`. After installation, a `config/deploy.js` file will automatically be created with the following content:

```javascript
/* eslint-env node */
'use strict'

module.exports = function (deployTarget) {
  let ENV = {
    build: {},
    // include other plugin configuration that applies to all deploy targets here
  }

  if (deployTarget === 'development') {
    ENV.build.environment = 'development'
    // configure other plugins for development deploy target here
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production'
    // configure other plugins for staging deploy target here
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production'
    // configure other plugins for production deploy target here
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV
}
```

As you can see, we now have access to a `deployTarget` variable separate from the build environment. We provide this variable by passing it to the `ember deploy` command. So, for example, if we wanted to deploy to our staging environment we would run `ember deploy staging`.

And that's it! I know that the difference between build and deploy environments was not entirely obvious to me when I first started deploying Ember applications so hopefully this helped to eliminate some confusion. And, now that you have `ember-cli-deploy` installed, I would highly suggest
looking at the other capabilities of the addon. It has a [rich plugin ecosystem](http://ember-cli-deploy.com/plugins/) that can help you with tasks like gzipping, uploading to S3, sending deploy notifications, and more.

-----------------------------------------------------------

username: jayjayjpg
github_username: jayjayjpg
twitter_username: jayjayjpg
# The difference between `ember serve` and `npm run start`

When you have built a single-page-application using [Ember CLI](https://github.com/ember-cli/ember-cli), you have two options for starting your app locally. You can either use the CLI's `ember serve` command directly or you can use the handy `npm` alias that is created for you after generating a new Ember app: `npm run start`

But what's the difference between those two?

## What `npm run start` is used for

First, `npm run start` allows you to create your own default boot up command for your application by e.g. passing additional parameters to `ember serve` and hide this modified booting instruction away in one, single, shorthand command via a definition in your `package.json`. This makes you type less and can make your life easier when developing your app locally.

If you want to learn more about how to modify the `ember serve` command, check out the official [Ember CLI Docs](https://cli.emberjs.com/release/advanced-use/cli-commands-reference/#emberserve).

In a fresh Ember app though, the functionality of both `ember serve` and `npm run start` will be almost identical. Emphasis on _almost_.

## Sometimes `ember serve` and `npm run start` don't behave the same way

Recently, while working on one of my side projects, I tried to boot up an Ember application using TailwindCSS by running the `ember serve` command. The build process was kicked off, but ultimately failed with the following error message:

```
Object.entries(...).flatMap is not a function
```

The stack trace pointed to issues with the `PostCSS` compiler I had been using to integrate TailwindCSS with my app's styles:

```
Object.entries(...).flatMap is not a function
    at PostcssCompiler.Plugin (/home/jayjayjpg/Documents/projects/my/project/node_modules/broccoli-plugin/index.js:7:31)
    at new CachingWriter (/home/jayjayjpg/Documents/projects/my/project/node_modules/broccoli-caching-writer/index.js:18:10)
    at new PostcssCompiler (/home/jayjayjpg/Documents/projects/my/project/node_modules/broccoli-postcss-single/index.js:20:5)
    at Object.keys.map (/home/jayjayjpg/Documents/projects/my/project/node_modules/ember-cli-postcss/index.js:36:12)
// ...
```

After some debugging and double-checking my setup that I have followed from Chris Masters' [working example for TailwindCSS in an Ember app](https://github.com/chrism/emberjs-tailwind-purgecss#emberjs-tailwind-10-and-purgecss-working-example) in my `ember-cli-build.js` was correct:

```
// ember-cli-build.js
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const isProduction = EmberApp.env() === 'production';

const purgeCSS = {
  module: require('@fullhuman/postcss-purgecss'),
  options: {
    content: [
      // add extra paths here for components/controllers which include tailwind classes
      './app/index.html',
      './app/templates/**/*.hbs',
      './app/components/**/*.hbs'
    ],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
  }
}

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    postcssOptions: {
      compile: {
        plugins: [
          {
            module: require('postcss-import'),
            options: {
              path: ['node_modules']
            }
          },
          require('tailwindcss')('./app/tailwind.config.js'),
          ...isProduction ? [purgeCSS] : []
        ]
      }
    }
  });
  return app.toTree();
};
```

...I started to do a quick google search, to see if any other folks using TailwindCSS ran into a similar issue.

And indeed, I found a couple of issues [here](https://github.com/tailwindlabs/tailwindcss/issues/3503) and [there](https://stackoverflow.com/questions/64907613/typeerror-object-entries-flatmap-is-not-a-function) that pointed to the fact, that the `.flatMap` method used at build time of my application was a more recent feature of Node and only available from Node v11+.

I confirmed that I was still on an older version of Node, that this would explain the lacking support of the `.flatMap` function:

```
node -v
10.16.3
```

...and was enthusiastic about quickly resolving the build problem with an upgrade of Node. Since I was using [nvm](https://github.com/nvm-sh/nvm) my upgrade turned out as follows:

```
nvm install 14
nvm use 14
rm -rf node_modules/ && npm install
```

As soon as the installation finished, I tried my luck again by running `ember serve`, and to my surprise - the build failed again with the very same `.flatMap is not a function` error!

Still in disbelief, I tried running `npm run start` instead and lo and behold - my app built successfully?

How could my application build fail when the build command was run directly, but still succeed when its alias was executed?

## How Node, NVM and Ember CLI work together

Once I checked on the versions of my Ember CLI and my Node installs, it became more clear, why `npm run start` and `ember serve` would behave differently:


```
node -v
v14.17.1

ember -v
ember-cli: 3.26.1
node: 10.16.3
os: linux x64
```

How come that Ember CLI was linked to an older version of Node different from my local Node version?

In my case, I've been using `nvm` to switch between different versions of Node on my machine.

When using [nvm](https://github.com/nvm-sh/nvm), it's important to be mindful on how this will affect the usage of globally installed packages. Nvm ensures that any global installs of binaries end up in a dedicated, versioned directory of `nvm` in the user's `HOME` directory. On Linux, you can verify this by checking the Ember CLI's binary location as follows:

```
whereis ember
ember: /home/jayjayjpg/.nvm/versions/node/v10.16.3/bin/ember 
```

A while ago I had installed Ember CLI globally via `npm install -g ember-cli` while on Node 10.16.3. This instructed `nvm` to store the binary in the related 10.16.3 Node directory and make it available via this Node version. Now whenever I would run `ember serve` on my command line, this outdated binary would be used, running on Node 10.16.3, regardless if I had instructed `nvm` to switch to Node v.14.17.1 or not:

```
# Switching to Node 10.16.3
nvm use 10

node -v
v10.16.3

ember -v
node: 10.16.3

# Switching to Node 14.17.1
nvm use 14

node -v
v14.17.1

ember -v
node: 10.16.3
``` 

Whenever I would run `npm run start` though, my project's [local Ember CLI version would be used](https://github.com/ember-learn/guides-source/issues/1133#issuecomment-539917741) leading to a successful app build.

The behavior of `ember serve` and `npm run start` doesn't have to differ this way though, as `nvm` provides you with a [command to migrate all of your already existing, global npm installations](https://github.com/nvm-sh/nvm#migrating-global-packages-while-installing) over to a newer version of Node and make them available when switching to said version:

```
nvm install 14 --reinstall-packages-from=10
```

After the migration I could now see my global Ember CLI binary associated with the newer Node version and residing in the path that I'd expect:

```
whereis ember
ember: /home/jayjayjpg/.nvm/versions/node/v14.17.1/bin/ember

ember -v
ember-cli: 3.26.1
node: 14.17.1
```

And finally, upon running `ember serve`, the app would build successfully using Node v.14.17.1 just as it would using `npm run start`!

## So what's the difference between `ember serve` and `npm run start`?

In a fresh Ember app and in nearly all cases, `npm run start` and `ember serve` function the exact same way. But if you have a different version of Ember CLI installed globally versus locally or if you're using version managers for Node, the outcome of these two commands may differ from each other.

This post has been inspired by [this great response](https://stackoverflow.com/a/63342128) on Stackoverflow to the question ["Is there a difference between `ember serve` and `npm start`?"](https://stackoverflow.com/questions/63340251/is-there-a-difference-between-ember-serve-and-npm-start)

-----------------------------------------------------------

username: davideferre
github_username: davideferre
twitter_username: null

Today I welcome a new template for my [blog](https://blog.davideferrero.com "Davide Ferrero's blog") by returning to write a post after a very long time!

This [WordPress](https://wordpress.org/ "WordPress") theme is built on top of the latest [Bootstrap](https://getbootstrap.com/ "Bootstrap") release, Bootstrap 5 and with this post I would like to explain you how to use this hugely popular front-end framework in an [Ember](https://emberjs.com/ "Ember.js") app.

With this major new release the developers have focused most of their efforts towards removing [jQuery](https://jquery.com/ "jQuery") as a dependency of the framework to make it lighter and usable by a wider audience now interested in saving as much kb as possible.

For those who knows and uses the previous Bootstrap version (v4) I suggest to dive into the [migration guide](https://getbootstrap.com/docs/5.0/migration/ "Bootstrap 5 migration guide"), to understand what breaking changes were made in this new update.

As an experiment (I will tell you later about what I am working on in my spare time) I've tried to use Bootstrap 5 in a new Ember Octane app and thank to the release of the bootstrap npm package this turned out to be tremendously simple.

Let's see the steps:

First you have to install the bootstrap npm package:  

```shell
npm install --save-dev bootstrap
```

Then you have to modify your _ember-cli-build.js_ file:

```javascript
'use strict';
    
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
    
module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
    sassOptions: {
      includePaths: ['node_modules/bootstrap/scss'],
    },
  });
  app.import('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js');
  return app.toTree();
};
```

The last few steps are required to be able to import bootstrap SCSS files.  
First you have to install _[ember-cli-sass](https://github.com/adopted-ember-addons/ember-cli-sass "https://github.com/adopted-ember-addons/ember-cli-sass")_ addon:

```shell
ember install ember-cli-sass
```

Then you have to rename your app style app.css to app.scss and insert the line to import the bootstrap files:

```css
@import 'bootstrap';
```

You are now ready to use Bootstrap 5 in your Ember app!

-----------------------------------------------------------

username: marceloandrade
github_username: marceloandrader
twitter_username: MarceloAndrade
Cuando se trata de crear aplicaciones de página única o SPA en inglés,
como desarrolladores tenemos muchas opciones de dónde escoger 
hay frameworks y librerías muy conocidas como angular en el área de framework
y vue | react en el área de librería.

Hoy quiero hablarles de un framework no muy usado o conocido
pero que merece ser mencionado: [Ember.js](https://emberjs.com/). He trabajado
con este framework por al menos 6 años, y la forma en la que llegué a este
fue un poco graciosa, en ese tiempo estaba dando los tests para entrar
a la comunidad de freelancers [Toptal](https://www.toptal.com/NWaLA1/worlds-top-talent) uno 
de los pasos era realizar un pequeño proyecto y para esto escogí Ember.js y PHP en el backend
lo escogí como para aprender, había trabajado en el pasado con knockout.js, angular js, 
backbone y por supuesto jQuery; pero quería algo que realmente ayudara en la productividad,
luego de ser aceptado en Toptal, la primera entrevista con un cliente era
para llenar un puesto para trabajar con Ember, en principio dude en aplicar
porque solo lo había aprendido para hacer este test, pero el reclutador me
animó y la entrevista fue muy bien y desde entonces estoy trabajando con este cliente
con 4 aplicaciones internas grandes hechas en Ember.

Una de los principios de Ember.js es que la evolución no debe ser drástica,
como en el caso de angular que hubo un re-write del framework y los que crearon
una app con angular js no pudieron pasar directamente a angular v2, la idea
de Ember era siempre hacer las transiciones de versiones lo más seguras
y fáciles posibles, para esto proveen con muchas herramientas, como `deprecations`
para que desde una versión anterior comiencen a notarse los cambios que se activarán
en las versiones posteriores y que alertan a los desarrolladores para cambiar el código de la aplicación
para una futura actualización sin novedades, también existen `codemods`
para que los cambios se hagan automáticamente, e incluso hay `feature flags` que
permiten probar características que saldrán públicas en futuras versiones
en versiones anteriores.

El framework ya lleva 10 años con una comunidad pequeña pero
con gente de mucha calidad y muy abierta e inclusiva. En cuestión de paquetes disponibles
para la comunidad hay una gran variedad, puedes chequear [Ember Observer](https://emberobserver.com/)
donde se registran todos los addons que tienen compatibilidad con Ember.

Como ejemplos de aplicaciones públicas desarrolladass con Ember están LinkedIn, Heroku, Intercom, Square.

En cuestiones un poco más técnicas, el framework tiene muchas opiniones en su diseño
tal vez para muchos esto no es bueno, para mi es fantástico, no tienes que tomar decisiones
de qué usar cada 5 minutos, porque como comunidad ya se hizo esta decisión a travez
de procesos denominados RFC en github para realizar cambios. La estructura de las aplicaciones
es estándar, si has trabajado en una app ember, puedes trabajar en otra muy rápidamente
porque sabes dónde está y cómo funciona todo.

La URL en aplicaciones ember es tratada como una parte fundamental, ya que de la misma se puede derivar
el ruteo, estático y dinámico, y adicional parametros de consulta. Es el punto de entrada
hacia las rutas de la aplicación que a su vez manejan el modelo de datos que es transferido hacia
los templates que usan componentes para mostrar y manejar la interfaz al usuario.

Se puede hacer Test Driven Development muy fácilmente con tests unitarios para cada componente o utilidad
y tests e2e para ejecutar caminos complejos de interacciones de usuario.

Si a alguien le interesa más detalles de cómo funciona el framework, suscríbanse y dejenme saber.


-----------------------------------------------------------

username: jenweber
github_username: jenweber
twitter_username: null
---
title: Remodeling an Ember App - Testing
published: true
description: Sharing Ember testing upgrade strategies in Part 3 in a series.
tags: emberjs
canonical_url: https://www.jenweber.dev/remodeling-an-ember-app---testing
---

Today's topic is debugging an Ember app's test suite after upgrading some dependencies. This is a real-world app and the issues we face will be different from your apps, but you can learn the overall strategy and debugging approaches,

This is Part 3 of a series of blog posts. We're on a journey together to remodel an older Ember app, [ember-api-docs](https://github.com/ember-learn/ember-api-docs), incrementally bringing it up to date with the latest and best Ember and Ember Data patterns.

For this series, I'm pair programming with Chris Thoburn, aka [@runspired](https://github.com/runspired), who is known for his work on Ember Data. He has over 500 commits and some great debugging skills that you and I can learn from.

## What you will learn in this segment

- How to run tests on-demand instead of on every change
- How to run the tests for different git branches, side by side
- What to expect in your test suite after upgrading the linters
- How to deal strategically and efficiently with hundreds of linting errors

## Our progress so far

In the previous article, we had updated a bunch of dependencies and solved issues that prevented the app from building (build time errors) or prevented it from working correctly in the browser (runtime errors). We got to the end successfully, but there were some test failures.

Why were there failures? Well, we made a _lot_ of changes! No matter what framework I'm using, any time I make a bunch of changes before running my test suite, I expect some tests to fail. Another path we could have chosen was to make changes one at a time, while running the test suite at every step. However, sometimes, seasoned Ember.js developers can take a big leap forward and then reconcile the errors. Sometimes, this latter approach saves you time, but if you get stuck, it's a good idea to take a step back and do one change at a time.

## New tools for your toolkit - test running modes

Sometimes, the default behavior of `ember test --server` gets in the way. By default, the app rebuilds and test run every time you make a change. That wipes out the test failure information that you may need to reference while you make changes in multiple files.

Chris Thoburn showed me one way to improve on this experience and fix my test failures more quickly! He often runs a build continuously, and then in a separate process, run the tests. Although the app rebuilds every time you make a change, the test only re-run when you tell them to. So, the test failure output is always there when we need it.

```sh
# In one tab of your terminal, start the build and watch for changes
ember build --watch --output-path="./dist"

# In a new tab or window of your terminal, run the tests
ember test --serve --path="./dist" --no-launch
```

In these examples, we pointed the tests to the `dist` folder for the built app. We can apply this same strategy in order to run tests from different git branches side by side. For example, you could check out one branch of your app, run a single build, check out another branch, run a build, and then run the tests for both. Then you can inspect the results and compare them! You can even add debuggers to both branches and stop the test suites in the same place to inspect the state. Here's how!

```sh
git checkout main
yarn install
ember build --output-path="./dist-main"
git checkout upgrade-branch
ember build --output-path="./dist-my-upgrade-branch"
# Run the tests for main
ember test --serve --path="./dist-main" --no-launch
# Run the tests for the upgrade branch
ember test --serve --path="./dist-my-upgrade-branch" --no-launch
```

## Resolving linting errors

One change we made was that we increased the version number of `eslint-plugin-ember` and `ember-template-lint`. When we did that, we brought in new linting rules for our `.hbs` templates and JavaScript files. We got automatic guidance on how we could improve our app's syntax, coding style, and most importantly, its accessibility. However, it means our linting tests were all failing with over 100 errors! How do we deal with that?

For every linting error or warning, we must choose between the following options:

- Update the codebase itself to resolve the warning
- Turn the rule off in `.eslintric` or `.template-lintrc.js`
- Add a code comment that tells the linter to ignore that file or line of code

Most of the time, when you are doing a dependencies upgrade, you should only fix very very tiny things and for everything else, ignore the rule and do the fixes themselves in later PRs. Why? We don't want to inadverdantly change the app's behavior! When upgrading dependencies, ideally the app looks the same when we're done.

### Tools to help you deal with linting errors

There are some helpful tools in the Ember ecosystem for tracking and resolving linting issues over time, and they are especially important for large apps or teams.

First, `ember-template-lint` helps you automatically convert template linting errors into future to-do tasks. You can learn more about this feature in the [Official Ember Blog](https://blog.emberjs.com/how-to-todo-in-ember-template-lint/).

Second, Chris Manson created [`lint-to-the-future`](https://github.com/mansona/lint-to-the-future), which turns all your errors into code comments that ignore the rule. When you fix a warning, remove the code comment. You can also visualize and measure your progress with some graphs!

### Our approach

Although 100+ linting errors sounds like a lot, most of them were the same error over and over again. We could see them by running `yarn lint`.

We wanted to avoid making too many unnecessary changes in this app until after our upgrade step was over, so we turned a whole bunch of rules off in our `.eslintrc`. It makes sense that we had to turn off these rules, since many of them were telling us about how to turn our app into an Octane-style app. They will be useful after we finish the dependencies upgrade! We can learn more about each rule by searching for the rule name in the [`ember-cli-eslint`](https://github.com/ember-cli/ember-cli-eslint) source code.

```js
// excerpt from .eslintrc
  rules: {
    'ember/no-jquery': 'off',
    'ember/no-jquery': 'off',
    'no-console': 'off',
    'ember/no-new-mixins': 'off',
    'ember/no-mixins': 'off',
    'ember/native-classes': 'off',
    'ember/require-tagless-components': 'off',
    'ember/no-test-this-render': 'off',
    'ember/no-classic-classes': 'off',
    'ember/no-get': 'off',
    'ember/no-actions-hash': 'off',
    'ember/no-classic-components': 'off',
    'ember/no-private-routing-service': 'off',
  },
```

We only needed to ignore two rules in our `.template-lintrc.js`, we only needed to add two rule ignores. We can learn all about why these rules exist by searching for the rule name in [`eslint-plugin-ember` source code](https://github.com/ember-cli/eslint-plugin-ember). The file name matches the rule that shows up in the warnings. You can find it quickly on GitHub by pressing the letter `T` from the repository's main page and typing in the name of the rule.

```js
// excerpt from .template-lintrc.js
rules: {
  'no-link-to-positional-params': false,
  'require-input-label': false,
  // and some more rules that were already there
}
```

[`require-input-label`](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/require-input-label.md) is an example of a linting rule that helps you discover accessibility issues in your app! It warns you if you have an input element that lacks an associated label element. In our case, this warning was a false hit - we found a bug! We [reported the bug](https://github.com/ember-template-lint/ember-template-lint/issues/1835#issuecomment-857223622) and linked to the public example of it.

[`no-link-to-positional-params`](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-link-to-positional-params.md) was telling us not to do links in this style: `{{link-to "About Us" "about"}}`, Instead, we should do `<LinkTo @route="about">About Us</LinkTo>`. We can definitely handle this later.

Once our linting tests were passing, we moved on to the next step!

## Understanding application test failures

When you do an upgrade like this, there are some common sources of failures. It's helpful to ponder thus line of questioning below for a little when you run into a test that is tricky to fix:

- Did I make a mistake during the upgrade?
- Did the upgrade uncover a bug that was hidden previously?
- Were there any breaking changes in my dependencies?
- Was my app relying on a bug in Ember that was fixed?
- Did my app rely on private API methods?

After pondering this list, now I can move to the next level:

- What evidence do I have that my hypothesis is correct?
- Do I need to update a test, update something in my app, or both?
- If I reread the test failure again, do I get any new insights?

### Our test failures

Here's an example test failure we worked through:

```text
Error: Element not found when calling `fillIn('#ember-basic-dropdown-content-ember
1246 .ember-power-select-search-input[type=search]')`.
  at http://localhost:7357/assets/test-support.js:35450:15
  at async selectSearch (http://localhost:7357/assets/test-support.js:39374:9)
  at async Object.<anonymous> (http://localhost:7357/assets/tests.js:66:7)
```

In this case, the question that jumps out at us is "Were there any breaking changes in my dependencies?" We upgraded from `ember-power-select` version `2.3.5` to `4.1.6`. Following the rules of semantic versioning, we can see that there have been two releases with breaking changes. Time to check the release notes of the library, in [CHANGELOG.md](https://github.com/cibernox/ember-power-select/blob/master/CHANGELOG.md). If you don't see a changelog for the library you are using, look at the Releases section on GitHub instead.

By reading the changelog, we could see that there was a new required attribute to add to the component. Adding `@searchEnabled={{true}}` to our power select dropdowns was all that was needed.

Another test failure we saw was this:

```text
not ok 66 Chrome 91.0 - [196 ms] - Acceptance | document title: is of format className - version - Ember API Docs
  ---
    actual: >
        Ember Api Docs
    expected: >
        Container - 1.0 - Ember API Documentation
```

This was an example of a mistake we made while upgrading. The test that was failing was checking the page title of a certain URL in the app. A page's title is important for SEO, accessibility, and overall user experience. It's part of the text that shows up in a search result. It is the text that shows up at the top of your browser tab. And for people who use assistive tech, it helps them know what page they are on when they flip through tabs. You can learn more about page titles in [the Ember Guides](https://guides.emberjs.com/release/accessibility/page-template-considerations/#toc_page-title).

What happened was that when the upgrade diff was applied, it added something like `{{page-title "EmberApiDocs"}}` to the `application.hbs` template. Community member [prakashchoudhary07](https://github.com/prakashchoudhary07) discovered that the page title was being set in another, more sophisticated way in this app. Therefore, we could delete the page title helper, and the test passed.

Lastly, there was an error due to reliance on private API. One test was using private APIs on the router inside the test only. When I had tried to upgrade the test to use the router service instead, the method was no longer available. So, I undid the change I made during linting fixes and instead added an ignore to the `eslint.rc`. We can deal with that issue in another PR!

## Up next

Now, all our tests are all passing! Next in this series, we will run some Octane codemods and refactor some components that are tough to work with. Thanks for reading!


-----------------------------------------------------------

username: jenweber
github_username: jenweber
twitter_username: null
---
title: Remodeling an Ember App - Package Updates
published: true
description: Part 2 in a series of posts that teach refactoring and upgrade strategies
tags: emberjs
canonical_url: https://www.jenweber.dev/remodeling-an-ember-app---package-updates
---


Today's topic is upgrading dependencies on an older Ember app. This is a real-world app and the issues we face will be different from your apps, but you can learn the overall strategy and debugging approaches,

This is Part 2 of a series of blog posts. We're on a journey together to remodel an older Ember app, incrementally bringing it up to date with the latest and best Ember and Ember Data patterns.


## About the series

We will walk through updating a complex, real-world app, [ember-api-docs](https://github.com/ember-learn/ember-api-docs), which is the front end of [api.emberjs.com](https://api.emberjs.com). Along the way, you will learn how to approach this process for your own apps - updating dependencies, debugging build errors, migrating to Octane syntax, writing better Ember Data serializers & adapters... there's a lot to do!

For this series, I'm pair programming with Chris Thoburn, aka [@runspired](https://github.com/runspired), who is known for his work on Ember Data. He has over 500 commits and some great debugging skills that you and I can learn from.

## Deciding how to approach upgrading dependencies

There are two main approaches Ember developers take, either:

1. Upgrade addons
2. Upgrade core Ember and Ember Data dependencies

Or, they approach this in the reverse order:

1. Upgrade core Ember and Ember Data dependencies
2. Upgrade addons

The path you choose depends on your app - how many addons does it have? How outdated are they?

In our case, we decided on the latter. We didn't want to introduce too many changes at once if we didn't have to, and we were pretty confident in our ability to sort through addon-specific errors.

## Running the Ember and Ember Data upgrade

This app was on 3.16. The latest Ember and Ember Data version is 3.26.

We can do the upgrade with the help of `ember-cli-update`, which will apply the blueprint used for fresh apps.

```
npx ember-cli-update
```

You can read a whole bunch about upgrading in the [Ember Guides](https://guides.emberjs.com/release/upgrading/) and [Ember CLI Guides](https://cli.emberjs.com/release/basic-use/upgrading/), so we won't go into too much detail here.

We reviewed each file that was modified first, to confirm that we wanted those changes.

Then, we walked through all merge conflicts and resolved them.

Next, we installed our new dependencies with `yarn install`.

Finally, we started the Ember server with `npx ember serve` and hit our first bug.

_(Why `npx ember serve`? `npx` ensures that the Ember CLI version used by your app is the one specified in package.json, and not your globally installed version. It usually doesn't matter, but when it does, it's often when working on upgrade tasks like this!)_

## Debugging a build failure

Here's the build failure we saw in the console after we started up our server:

```
Build Error (broccoli-persistent-filter:Babel > [Babel: @ember/ordered-set]) in @ember/ordered-set/index.js

Duplicate plugin/preset detected. If you'd like to use two separate instances of a plugin, they need separate names, e.g.

  plugins: [
    ['some-plugin', {}],
    ['some-plugin', {}, 'some unique name'],
  ]

Duplicates detected are:
[
  {
    "alias": "/Users/jweber/projects/ember-api-docs/node_modules/ember-compatibility-helpers/comparision-plugin.js",
    "options": {
      "emberVersion": "3.26.1",
      "root": "/Users/jweber/projects/ember-api-docs",
      "name": "@ember/ordered-set"
    },
    "dirname": "/Users/jweber/projects/ember-api-docs",
    "ownPass": false,
    "file": {
      "request": "/Users/jweber/projects/ember-api-docs/node_modules/ember-compatibility-helpers/comparision-plugin.js",
      "resolved": "/Users/jweber/projects/ember-api-docs/node_modules/ember-compatibility-helpers/comparision-plugin.js"
    }
  },
  {
    "alias": "/Users/jweber/projects/ember-api-docs/node_modules/ember-compatibility-helpers/comparision-plugin.js",
    "options": {
      "emberVersion": "3.26.1",
      "root": "/Users/jweber/projects/ember-api-docs",
      "name": "@ember/ordered-set"
    },
    "dirname": "/Users/jweber/projects/ember-api-docs",
    "ownPass": false,
    "file": {
      "request": "/Users/jweber/projects/ember-api-docs/node_modules/ember-compatibility-helpers/comparision-plugin.js",
      "resolved": "/Users/jweber/projects/ember-api-docs/node_modules/ember-compatibility-helpers/comparision-plugin.js"
    }
  }
]
```

Not very nice.

We did `yarn why @ember/ordered-set` to confirm that only one version of that dependency was in use:

```
yarn why @ember/ordered-set

yarn why v1.22.10
[1/4] 🤔  Why do we have the module "@ember/ordered-set"...?
[2/4] 🚚  Initialising dependency graph...
[3/4] 🔍  Finding dependency...
[4/4] 🚡  Calculating file sizes...
=> Found "@ember/ordered-set@4.0.0"
info Reasons this module exists
   - "ember-data" depends on it
   - Hoisted from "ember-data#@ember#ordered-set"
   - Hoisted from "ember-data#@ember-data#record-data#@ember#ordered-set"
info Disk size without dependencies: "44KB"
info Disk size with unique dependencies: "1.98MB"
info Disk size with transitive dependencies: "47.57MB"
info Number of shared dependencies: 151
✨  Done in 1.83s.
```

Chris hypothesized that this was due to floating dependencies. Yarn and NPM let developers specify a range of acceptable dependency versions. Sometimes there are mismatches. It's often a good initial step to try deleting node modules and the lock file, as a small experiment, and then try again:

```sh
rm -rf node_modules
rm yarn.lock
yarn install
npx ember s
```

That resolved the error about duplicate plugins!

## On to the next error - dependencies of dependencies

Next, we saw some errors about `ember-popper`.

We looked to see what was using `ember-popper` using `yarn why`. One of our dependencies, `ember-styleguide` used it. We looked at a more recent version of `ember-styleguide`, in the `package.json`. The latest ember-styleguide didn't even use popper, so upgrading ember-styleguide got us over this hurdle.

We also saw an error about `ember-basic-dropdown`. `yarn why` told us it was used by `ember-power-select`. Upgrading `ember-power-select` and following instructions in the CHANGELOG fixed that issue.

Now, when we did `yarn install` and `npx ember s`, the app built successfully.

## Debugging runtime errors

Now when we visted `localhost:4200`, we saw something strange. The app would render for a moment (thanks to Fastboot), but then when the app's JavaScript loaded in fully, it crashed.

Apps that use Fastboot show their errors in the terminal running the server, _not_ the browser console. So, to get a closer look at what was going on, we temporarily turned off fastboot by visiting `http://localhost:4200?fastboot=false`.

There were two errors in the browser console:

One:

```
Error occurred:

- While rendering:
  -top-level
    application
      es-header
        es-navbar
          bs-navbar
            bs-navbar/content
              bs-collapse
                bs-navbar/nav
                  search-input
                    ember-tether
                      search-input/dropdown
```

Two:

```
Uncaught (in promise) ReferenceError: process is not defined
    <anonymous> Ember
    js vendor.js:173080
    __webpack_require__ vendor.js:172838
    <anonymous> Ember
    js vendor.js:173069
    __webpack_require__ vendor.js:172838
    <anonymous> Ember
    js vendor.js:173126
    __webpack_require__ vendor.js:172838

...and a whole lot more
```

We wanted to see where the problem was coming from, as step one. We commented out the `es-header` component and saw the app render. Then we commented out pieces of the app until we got to identifying `search-input` as the culprit.

The search feature of this app comes from a third-party library. Is something in there using `process`?

I enabled "Break on exceptions" in my browser's debugging tools. This showed us that indeed, `process.env` was being used in a third party script. But why did this work before? What else had changed?

## Debugging webpack

The webpack errors are a clue about what changed. When we updated a bunch of things in `package.json` using `ember-cli-update`, one of them was `ember-auto-import`. This package uses webpack to bring npm dependencies into an Ember app with zero config, and we changed its versions.

One thing that changed was that certain polyfills were no longer included. This was outlined [in the project README](https://github.com/ef4/ember-auto-import#i-upgraded-my-ember-auto-import-version-and-now-things-dont-import-what-changed)
along with steps to fix it.

We added the following to our `ember-cli-build.js`:

```
autoImport: {
  webpack: { 
    node: { 
      process: 'mock'
    }
  }
},
```

Now, the app rendered successfully! We removed `?fastboot=false` from our localhost URL, and saw that it was working fine in that mode too.

## Up next

So, the app rendered, but the tests are failing.
Coming soon, we'll tackle those test failures.

-----------------------------------------------------------

username: michalbryxi
github_username: MichalBryxi
twitter_username: MichalBryxi
If you want to add a link to a particular tag in [empress-blog](https://github.com/empress/empress-blog) to your main menu, you just have to specify `route` as `tag` and `id` as your particular tag. Let's say my tag is going to be called [munro](https://en.wikipedia.org/wiki/Munro):

```sh
❯ ember g tag munro
```

And I want a link to a page that lists all the articles that contain this tag in my main menu. All I have to do is add to config following lines:

```js
// config/environment.js

module.exports = function (environment) {
  let ENV = {
    blog: {
      navigation: [
        {
          label: 'Munros',
          route: 'tag',
          id: 'munro',
        },
      ]
    }
  }
}
```

## Screenshot

![Munro tag page link preview on empress-blog](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3sh7qkqheye700d931ll.png)

-----------------------------------------------------------

username: jenweber
github_username: jenweber
twitter_username: null
---
title: Remodeling an Ember App - Introduction
published: true
description: A series of posts that teach refactoring and upgrade strategies
tags: emberjs
canonical_url: https://jenweber.netlify.com/remodeling-an-ember-app---introduction
---

In a series of blog posts, we'll go on a journey together to remodel an older Ember app, incrementally bringing it up to date with the latest and best Ember and Ember Data patterns.

We will walk through updating a complex, real-world app,
[ember-api-docs](https://github.com/ember-learn/ember-api-docs), which is the front end of [api.emberjs.com](https://api.emberjs.com). Along the way, you will learn how to approach this process for your own apps - updating dependencies, debugging build errors, migrating to Octane syntax, writing better Ember Data serializers & adapters... there's a lot to do!

For this series, I'm pair programming with Chris Thoburn, aka [@runspired](https://github.com/runspired), who is known for his work on Ember Data. He has over 500 commits and some great debugging skills that you and I can learn from.

## Preparation

The focus of this first article will be about deciding where to begin, what kind of mindset to have, and an overview of the debugging tools in our toolbox. There are a lot of things we _could_ work on improving in this app, and there are multiple paths we could take that lead to success.

### Areas of focus

Making a list of them and prioritizing is very important step for any app refactor or upgrade. Some broad tasks to consider include:

- Updating to the latest package versions
- Resolving deprecations
- Running codemods
- Refactoring confusing stuff
- Documentation
- Testing and QA

### Making a detailed list

Thinkig about these areas of focus helps me get started with making a detailed list.

Chris Thoburn and I did a brainstorm about `ember-api-docs` and came up with the following list:

- Upgrade Ember and Ember data versions
- Run some codemods for Octane
- rewrite computed properties to cached getters, simplifying where possible (reduce intermediary computed properties)
- Figure out how to use less of Ember Data
- Figure out what needs to be in API response meta
- audit models and remove async relationships that didn't need to be async and ensure that inverses were properly wired
- make sure the API returned the format the store expects, and remove the serializer entirely
- Remove the adapter and replace it with one that just does a simple fetch request
- drop both the adapter and the serializer package and the ember-data package, instead installing store and model and record-data directly

### Prioritizing

Next up is prioritizing. This can be hard to do when you don't know an app well, and that's ok. This list's ordering should shift over time as you learn new things! But you do need to decide what to try first.

For this app, the clear first step is to upgrade the Ember and Ember Data versions.

We start here so that we have all the latest and greatest features. This can also be a challenging step because shifting dependency versions sometimes reveal bugs, but finding them later in the middle of a refactor is no fun.

### Getting in the right mindset

Overhauling an app (or even a complex component) takes a different mindset than I use in my usual daily coding. Most days, I have expectations about how the code works, because I wrote it or studied a section of it closely. But in an overhaul, big upgrade, or refactor, there are a lot of unknowns! If I intentionally adopt a different mindset at the beginning of a big uprade, I'm a happier developer. What's that mindset look like?

When I make a change that does not fix a problem, I try to be curious about why.

When I see a different error, I treat it as a step forward.

I keep a list of my successes as I go, including learning new things or getting one step deeper into the process.

When I get stuck, I conduct small experiments, and record the results.

I accept and expect that some of my experiments will be dead ends.

When I don't know where an error is coming from, I focus on trying to find the source before trying to fix the error.

I am skeptical of the things I changed, by default. This especially includes what's in the node_modules folder and shifting dependency versions.

### General debugging strategies

Over the course of this series, we will use lots of different debugging techniques. You will see examples of all of these over the coming weeks. However, it's useful to look at them as a group, and think of this as tools in your toolbox.

- Selectively commenting things out from your app to hone in on where a problem is coming from. Chris calls this "bisecting," and I call it "Cat in the Hat" debugging. Identifying the areas that are _not_ a problem is progress!
- Cleaning out `node_modules` - deleting the app's `node_modules` folder and the lock file, either `package-lock.json` or `yarn.lock`, and reistalling dependencies
- Restarting the local server - important to do if you change dependency versions or build configuration
- Logging template values to the console. In your `.hbs` files, you can add `{{log this.myVariable}}` and see the output in the console
- If your app is using it, turning `fastboot` off while you debug. Add `?fastboot=false` to the end of your locally served URL, i.e. `http://localhost:4200/?fastboot=false`. 
- Using "Break on exceptions" or "Break on uncaught exceptions" in your browser's debugging tools, to help with finding out where errors are coming from, with some more informative context
- Using `debugger` in your `js` files to set breakpoints that you can see in your browser's debugging tools
- Using `yarn why package-name` or `npm ls package-name` to confirm which versions of dependencies are actually in use, and which other dependencies use them.

## Up next

Next, in Part 2, we will start doing the app version upgrade!


-----------------------------------------------------------

username: kexposito
github_username: kexposito
twitter_username: kevinexposito17
## Introduction

The aim of this article is not only to show how to connect a backend application using Phoenix and a frontend application using Ember, but also to know all the different issues that may be encountered when trying to connect any frontend or backend application.

## Versions used in this guide:
```
Elixir: 1.11.3
Erlang/OTP: 21
Phoenix: 1.5.7

Node: 12.13.0
Ember CLI: 3.24.0
```

# Creating Phoenix backend
Let's start by creating our project in Phoenix by running the following command:
```
$ mix phx.new pizza_corner_api
(...)
$ cd pizza_corner_api
$ mix ecto.create
$ iex -S mix phx.server
```
Then, let's create a migration in our application:
```
$ mix phx.gen.schema Api.Pizza pizzas name:string description:text image:string
```

This will generate the following files:
{% gist https://gist.github.com/kexposito/caae0ed3a641e3f5f359a9275fd860b4 %}

{% gist
https://gist.github.com/kexposito/cb2cb141ad93d35b95a5044e9bee1c71
%}

Now, we are going to apply the migration by running:
```
$ mix ecto.migrate
```
Nice! we have the Pizza table created, let's add some seeds:
{% gist https://gist.github.com/kexposito/7efaa81f92d42ed27070437bc1f612da %}
After this, run:
```
$ mix run priv/repo/seeds.exs
```

## Returning JSON API Responses with JaSerializer
Now we are almost ready to create the PizzaController and router, but before doing that, let's think about what we are doing. We are building the frontend in Ember and the backend in Phoenix. These technologies must communicate with each other. To do this we are going to use JSON API. This means that Phoenix and Ember apps must send and receive JSONAPI responses.

To do this in Phoenix we are going to use JaSerializer ([https://github.com/vt-elixir/ja_serializer](https://github.com/vt-elixir/ja_serializer)).

### Installing JaSerializer
```elixir
# mix.exs
defp deps do
	...
	{:ja_serializer, "~> 0.16.0"},
	{:poison, "~> 3.1"}
	...
end
```
```console
$ mix deps.get
```
```elixir
# config.exs
config :phoenix, :format_encoders,
  "json-api": Poison

config :mime, :types, %{
  "application/vnd.api+json" => ["json-api"]
}
```
And then:
```
$ mix deps.clean mime --build
$ mix deps.get
```

```elixir
# router.ex
pipeline :api do
  plug :accepts, ["json-api"]
  plug JaSerializer.ContentTypeNegotiation
  plug JaSerializer.Deserializer
end
```
Finally, we are going to create the Pizza View and Controller:
{% gist https://gist.github.com/kexposito/1a9cc234bde1cf11649b96a13d0f7f48 %}
{% gist https://gist.github.com/kexposito/b0aa56864a7560fee6d8ca654fc4eb6c %}

Don't forget to add the endpoint to the router!
```elixir
# router.ex
scope "/api", PizzaCornerApiWeb do
  pipe_through :api

  get "/pizzas", PizzaController, :index
end
```

# Creating the Ember frontend
```
$ ember new pizza_corner --no-welcome
```
## Adding the Pizza Model
{% gist https://gist.github.com/kexposito/e3246aae86e48d6fff73ef2d78a2ec12 %}
{% gist https://gist.github.com/kexposito/477552945fc0f72a9b6195d0386c7321 %}
{% gist https://gist.github.com/kexposito/d3f14818d1e1222071d7b811d080f4bb %}
{% gist https://gist.github.com/kexposito/d17dddb215f56a63e01a43d480bf2679 %}
Now, lets run the following code to see if everything is working fine:
```
$ ember s
```
and check it http://localhost:4200

# What is happening?
If we open the console, we will see something like this:
![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/etl11dsomjjh6s6s0dg3.png)
What does this mean? By default Ember will request the same URL it is running on, so we must specify that we want to hit our Phoenix backend. To do this, we have to override the adapter as follows:
{% gist https://gist.github.com/kexposito/0f3eb9118b4f6bdecd451710306e79e7 %}

***host*** is the url that we want to hit, and ***namespace*** is the path after the host. This is because, in the Phoenix router we specified that `pizzas` are inside `api` scope. By doing this and thanks to Ember JSONAPIAdapter, `store.findAll('pizza')` will hit `http://localhost:4000/api/pizzas` . To see more about this you can see: [https://api.emberjs.com/ember-data/release/classes/JSONAPIAdapter](https://api.emberjs.com/ember-data/release/classes/JSONAPIAdapter)

Update your `app/serializers/application.js`:
{% gist 
https://gist.github.com/kexposito/0cbf573daa8509beeb62967a6983c883
%}

Now, let's try again, hopefully we will see some magic.
And no magic happens, So.. lets see the inspector again 😡
![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/inum8u7rtjqa35gyd8sf.png)

## We are having a CORS issue here. Why does this happens?
This happens because of security. CORS doesn't allow communication between our Ember web app (http://localhost:4200) and our Phoenix api (http://localhost:4000) because they are not from the same path and this is not safe.

## What can we do to fix this?
In order to fix this, we should tell our Phoenix API to accept incoming requests from Ember. To do this, we will use CORS Plug https://github.com/mschae/cors_plug,  this plugin will allow us to configure that.

### Installing CORS Plug
```elixir
# mix.exs
defp deps do
	...
	{:cors_plug, "~> 2.0"},
	...
end
```
And then run:
``` 
$ mix deps.get
```

Also add:
```elixir
#lib/pizza_corner_api_web/endpoint.ex
defmodule PizzaCornerApiWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :pizza_corner_api
	...
	...
	plug CORSPlug, origin: ["http://localhost:4200"] # <- Add this
	plug PizzaCornerApiWeb.Router
end
```
And after this, restart the server:
```
$ mix phx.server
```
Now visit http://localhost:4200 one more time. You will see the pizzas from our backend being rendered! 🎉🎉🍕

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ahviklgmarfs71fvwz78.png)
Phoenix Documentation:

- [https://hexdocs.pm/phoenix/up_and_running.html](https://hexdocs.pm/phoenix/up_and_running.html)
- [https://hexdocs.pm/phoenix/Mix.Tasks.Phx.Gen.Schema.html](https://hexdocs.pm/phoenix/Mix.Tasks.Phx.Gen.Schema.html)
- [https://hexdocs.pm/phoenix/routing.html](https://hexdocs.pm/phoenix/routing.html)

Ember Documentation:

- [https://cli.emberjs.com/release/basic-use/cli-commands/](https://cli.emberjs.com/release/basic-use/cli-commands/)
- [https://guides.emberjs.com/release/getting-started/quick-start/](https://guides.emberjs.com/release/getting-started/quick-start/)
- [https://guides.emberjs.com/release/routing/specifying-a-routes-model/](https://guides.emberjs.com/release/routing/specifying-a-routes-model/)
- [https://guides.emberjs.com/release/models/#toc_models](https://guides.emberjs.com/release/models/#toc_models)
- [https://guides.emberjs.com/release/models/customizing-adapters/](https://guides.emberjs.com/release/models/customizing-adapters/)
- [https://api.emberjs.com/ember-data/release/classes/JSONAPIAdapter](https://api.emberjs.com/ember-data/release/classes/JSONAPIAdapter)

Things we used here:

- JaSerializer ([https://github.com/vt-elixir/ja_serializer](https://github.com/vt-elixir/ja_serializer))
- Poison ([https://github.com/devinus/poison](https://github.com/devinus/poison))
- Cors Plug ([https://github.com/mschae/cors_plug](https://github.com/mschae/cors_plug))

-----------------------------------------------------------

username: michalbryxi
github_username: MichalBryxi
twitter_username: MichalBryxi
**Mixpanel** tracks user interactions with web and mobile applications and provides tools for targeted communication with them. **empress-blog** is designed to be a static site version of the Ghost blogging platform.

This quick article assumes that you have:

1. An [empress-blog instance](https://github.com/empress/empress-blog#quick-start)
2. A [mixpanel account](https://mixpanel.com/register/)
3. [Project Token from Access Keys](https://help.mixpanel.com/hc/en-us/articles/115004502806-Where-can-I-find-my-project-token-) for your _mixpanel_ project

## Setup

If you have all from the above, you can continue with connecting the dots. Minimal needed steps for each section should be below, but please consult respective READMEs.

### ember-metrics

The de-facto standard in [EmberJS](https://emberjs.com/) world for various analytics solutions integration is [ember-metrics](https://github.com/adopted-ember-addons/ember-metrics).

```sh
ember install ember-metrics
```

```js
// config/environment.js

module.exports = function (environment) {
  let ENV = {
    metricsAdapters: [
      {
        name: 'Mixpanel',
        environments: ['production'],
        config: {
          token: 'my-mixpanel-project-token',
        },
      },
    ],
  }
}
```

My _empress-blog_ instances did not have application route, so I had to create one:

```sh
ember g route application
```

```js
// app/routes/application.js

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service metrics;
  @service router;

  constructor() {
    super(...arguments);

    let router = this.router;
    router.on('routeDidChange', () => {
      const page = router.currentURL;
      const title = router.currentRouteName || 'unknown';

      this.metrics.trackPage({ page, title });
    });
  }
}
```

### ember-cli-content-security-policy

In order to allow loading of mixpanel trackers on your page you will need to set up [CSP](https://en.wikipedia.org/wiki/Content_Security_Policy) somehow. Standard way to do this is via [ember-cli-content-security-policy](https://github.com/rwjblue/ember-cli-content-security-policy) addon.

```sh
ember install ember-cli-content-security-policy
```

**Note:** Following snippet is compatible **only** with `ember-cli-content-security-policy >= 2.x`, which is at the time of writing this **not** the default. Check the addon docs for settings option for your version.

```js
// config/content-security-policy.js

module.exports = function () {
  return {
    delivery: ['meta'],
    policy: {
      'default-src': ["'none'"],
      'script-src': [
        "'self'",
        'http://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js',
        'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js',
      ],
      'font-src': ["'self'"],
      'connect-src': ["'self'", 'https://api-js.mixpanel.com'],
      'img-src': ["'self'"],
      'style-src': ["'self'"],
      'media-src': null,
    },
    reportOnly: false,
  };
};
```

## Verification

Deploy the _empress-blog_ on your _production_ environment, click on few places and verify in _mixpanel_ that the events are flowing in:

![Screenshot 2021-05-31 at 10.15.37](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qdd9m0u5f268tofs0k4o.png)

-----
 
Photo by <a href="https://unsplash.com/@crissyjarvis?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Crissy Jarvis</a> on <a href="https://unsplash.com/s/photos/abacus?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  

-----------------------------------------------------------

username: mitchartemis
github_username: acoustep
twitter_username: null
I recently played around with Tauri, a toolkit for development desktop apps with web technologies. Here's how I got it working with an Ember.js application.

## What is Ember?
Ember.js is a frontend framework similar to React and Vue JS. I used it to build my app [Snipline](https://snipline.io), and it's also used for websites like Intercom and LinkedIn. It has a 'convention over configuration' approach similar to Ruby on Rails.

## What is Tauri?
Tauri is a library for making desktop applications with web technologies. Similar to Electron with a few key differences: 

1) It's built in Rust rather than Javascript. 

2) It uses your operating system's native web browser rather than bundling Chrome which resulting in quite tiny applications—at least compared to Electron!

## Installation and development

Here are the commands I ran for a simple Ember app to test routing with Ember and Tauri. For reference, I'm using Node. 14.17.0.

### Setting up Ember
```bash
npm install -g ember-cli
```

```bash
ember new tauri-test --lang en
```

```bash
ember g route index
ember g route from-ember
```

```
ember serve
```

I edited the two generated templates, `app/templates/index.hbs` and `app/templates/from-ember.hbs`.

```js
{{page-title "Index"}}
<h1>Hello, Tauri 😄</h1>
<LinkTo @route="from-ember">Click here</LinkTo>
```

```js
{{page-title "FromEmber"}}
<h1>From Ember 🧡</h1>
<LinkTo @route="index">Back</LinkTo>
```

That's enough to get started and test that routing works within the app. Now let's get to the good stuff.

### Setting up Tauri
First, [follow the set up guide for your OS in the Tauri documentation](https://tauri.studio/en/docs/getting-started/intro).

After this, it's a matter of adding it to your ember project - [See the integration documentation](https://tauri.studio/en/docs/usage/development/integration).

This is what I did to get it working.

```bash
npm install @tauri-apps/cli
```

```
// Add the `tauri` command to your `package.json`
{
  // This content is just a sample
  "scripts": {
	"tauri": "tauri"
  }
}
```

Run through the initialisation process.

```bash
npm run tauri init
```

When prompted, make sure that you set the development server to `http://localhost:4200` and the location of the files (relative to `src-tauri`) to `../dist`.

Then it's just a matter of running the development subcommand (Make sure your Ember server is still up, too).

```
npm run tauri dev
```

And that's it! It works even with hot reloading!

## Packaging

With development out of the way, here's how to package the app for distribution. I won't be looking at auto-updates in this guide, but [Tauri does have support for this](https://tauri.studio/en/docs/usage/guides/updater).

```bash
ember build --environment=production
npm run tauri build
```

On MacOS installer `.dmg` file came out at 5.4MB and the `.app` file  12.4MB.

![Tauri running the Ember.js app in MacOS](https://cdn.hashnode.com/res/hashnode/image/upload/v1621767450348/hYnW6LQ04.gif)

For Windows, the generated MSI installer came to 4.9MB and the executable 8.9MB.

![Tauri running the Ember.js app in Windows](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kubj34m4i8jagvfz38id.png)

## Communicating between Rust and Ember
Taking this one step further, I thought I'd test a simple ping/pong example of communicating between Ember and Rust. For more information [check the Tauri docs](https://tauri.studio/en/docs/usage/guides/command).

The following code allows for Ember to pass a string to Rust, Rust checks the value and toggles between the text 'Ping' and 'Pong'. In Ember, I've added a button that displays the response text and updates it on click.

```rust
// src-tauri/src/main.rs
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

// Add a new function that takes a string and returns a string
#[tauri::command]
fn my_custom_command(current_text: String) -> String {
	// Depending on what we receive from Ember we toggle the response
	if current_text == "Ping" {
		"Pong!".into()
	} else {
		"Ping".into()
	}
}

fn main() {
  // Add the custom command so that the frontend can invoke it
  tauri::Builder::default()
	.invoke_handler(tauri::generate_handler![my_custom_command])
	.run(tauri::generate_context!())
	.expect("error while running tauri application");
}
```

```js
// app/controllers/index.js
import Controller from '@ember/controller'
import { action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { invoke } from '@tauri-apps/api/tauri'

export default class IndexController extends Controller {
	// Set the default button text
	@tracked buttonText = 'Ping'
	// Create an action that will be attached to a button in the template
	@action
	checkRust() {
		// Invoke the Rust command and update the button text to the response
		invoke('my_custom_command', { currentText: this.buttonText }).then(resp => {
			console.log(resp)
			this.buttonText = resp
		})
	}
}
```

Here's the updated `app/templates/index.hbs` template file.

```js
{{page-title "Index"}}
<h1>Hello, Tauri 😄</h1>
<LinkTo @route="from-ember">Click here</LinkTo>
<button {{ on 'click' this.checkRust }}>{{this.buttonText}}</button>
```

![Tauri and Ember.js communicating with each other](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/suc4ziujfzlb3nzmrh3f.gif)

Pretty cool! I'm excited to see where Tauri goes, and to see its plugin ecosystem grow. Should I try building a full project in it or write some more tutorials using both technologies? Let me know in the comments!

-----------------------------------------------------------

username: bendemboski
github_username: bendemboski
twitter_username: null
I spent the last 3.5 weeks or so switching our primary app over to using [embroider](https://github.com/embroider-build/embroider), and getting it working with all the optimized settings plus code splitting across routes. Hopefully reading about my experience will help others through the same process, and help accelerate polishing and adoption of embroider within the Ember ecosystem.

* [Background](#background)
  * [Our application](#our-application)
  * [Goals](#goals)
  * [Pre-embroider solutions](#preembroider-solutions)
* [Our experience moving to embroider](#our-experience-moving-to-embroider)
  * [Overall impressions](#overall-impressions)
  * [Process](#process)
  * [What was hard](#what-was-hard)
* [Other tips, tricks, and gotchas](#other-tips-tricks-and-gotchas)
  * [Addon build failures](#addon-build-failures)
  * [Out-of-memory errors in CI](#outofmemory-errors-in-ci)
  * [Addon-supplied webpack configuration](#addonsupplied-webpack-configuration)
  * [Rebuild on addon changes](#rebuild-on-addon-changes)
* [Conclusions](#conclusions)

# Background

## Our application

I work at [Rowan Patents](https://rowanpatents.com/), and our main Ember app is a desktop ([ember-electron](https://ember-electron.js.org/)) application for patent attorneys to use to draft patent applications -- somewhat analogous to an IDE like VSCode. Most patents consist of a bunch of pages of prose, and some pages of drawings, so most patent attorneys use Microsoft Word and Visio for their patent drafting.

Rowan Patents brings together the prose and drawings, along with a number of other efficiency tools, into a single multi-window desktop application. When an attorney opens a patent application file, they will have their primary prose window, and then also might simultaneously open a drawings window and a tools window (and there are several other special-purpose windows like a splash screen and a landing page). This means that there's a pretty strong association between routes and windows -- the prose window will never visit any of the drawings routes, and vice versa -- and also that we typically have several copies of the application loaded into memory at a time (one per window).

We also integrate quite a few third-party libraries for our core editor technology, for our core diagramming technology, and various other data analysis and transformations such as natural language processing. We've found that many of these bundle a lot of extra code that we don't actually execute or need.

Statistics on our app (line counts done using [cloc](https://github.com/AlDanial/cloc)):
* 11 addons
* ~55,000 lines of Ember js/ts code
* ~9,500 lines of hbs
* ~3,500 lines of scss

## Goals

Our two primary goals in moving to embroider were to be able to take advantage of tree-shaking and code splitting across routes, to keep our code-size-related memory footprint under control without incurring high up-front engineering costs or ongoing maintenance costs.

## Pre-embroider solutions

Before moving to embroider, we were able to do quite a bit of "manual tree-shaking" of third-party non-Ember libraries. Using module aliasing, `null-loader`, and `string-replace-loader` in the webpack config that we supplied to `ember-auto-import`, we were able to strip out a lot of unneeded code, but at the cost of significant up-front effort and maintenance cost as we upgrade those third-party libraries.

We did not have a solution for splitting our code across routes. 
We considered [Ember Engines](https://ember-engines.com/), but opted to wait for embroider to mature...which it has!

# Our experience moving to embroider

Note: all of this was using embroider v0.40.0.

## Overall impressions

Based on my overall experience, I would qualify embroider as late-stage alpha or early-stage beta quality software. The core functionality is there and is solid, but I still ran across several fairly severe bugs, and the documentation is limited. I spent a good deal of time debugging through embroider's code to determine why certain aspects of my build weren't working, and I don't think I would have successfully executed the whole transition to embroider if I had been unwilling to roll up my sleeves and dive in like that. I don't think the same is necessarily true of smaller apps with fewer dependencies though.

However, after getting our application building, and fixing some runtime errors, it's been feeling stable, and I'm not feeling nervous about inconsistencies in production build output, frequent but intermittent oddities in the development environment, or any of those other things that would otherwise be keeping me up at night.

## Process

My process for getting our app/addons building on embroider with optimized settings was:

1. Get all addons building on embroider
2. Get the app building on embroider
3. Manually test & stabilize the app
4. Merge back to `main`
5. Get all addons building with optimized flags
6. Get the app building with optimized flags
7. Enable route code splitting
8. Manually test & stabilize the app
9. Merge back to `main`
10. Celebrate, spend a chill weekend backpacking on the Washington Coast, and then write this article

## What was hard

I've tried to break down all the work I put into making the app build on embroider into categories, and I'll describe them generally without diving too deep. Hopefully they make some sense and it's useful -- I promise nothing!

### ES6 module compliance

One thing we had to update in a number of places was code that imported a module as if it had a default export when really it only had named exports. For example, given a module named `lib` with two named exports, `foo` and `bar` (and no default export), we would sometimes do this:

```js
import lib from 'lib';

lib.foo();
lib.bar();
```

This would work with Ember's module loader, but is not ES6-compliant, and will not work with embroider/webpack. We had to either update to:

```js
import * as lib from 'lib';

lib.foo();
lib.bar();
```

or ideally (because it's better for tree-shaking):

```js
import { foo, bar } from 'lib';

foo();
bar();
```

Another related issue had to do with export stubbing. We had a relatively common pattern in our tests of using [sinon](https://sinonjs.org/) to stub or spy on module exports. Using the above `lib` example, we might have a test that would do:

```js
let fooStub = sinon.stub(window.require('lib'), 'foo');
fooStub.returns({ result: 'value' });

await click('.button-that-calls-lib-foo');
assert.equal(fooStub.callCount, 1);
```

The `window.require()` would use [Ember's module loader](https://github.com/ember-cli/loader.js/) to load the `foo` module, and then stub out one of its exports. This will not work with webpack-generated modules for a couple of reasons, so we had to find other patterns, usually involving either doing the stubbing at a different point in the call stack, or instrumenting the logic in the code itself to provide a stubbing mechanism that wasn't re-writing the ES6 module objects themselves.

### package.json dependencies

Unfortunately I don't have a lot of information to share on this one because I never fully bottomed out my understanding, just treated symptoms. But I'll describe what I do know.

We had a number of build failures related to transitive dependencies. For example, we use `ember-power-select`, which depends on `ember-basic-dropdown`, and also use `ember-basic-dropdown` directly. We did not have `ember-basic-dropdown` declared in our `package.json`, so when `@embroider/compat` assembled our app into the v2 package format, it would not make `ember-basic-dropdown` accessible to our app (basically it would put it in `node_modules/ember-power-select/node_modules/ember-basic-dropdown` instead of `node_modules/ember-basic-dropdown`).

I believe in some cases we ran into errors where the dependency was only listed as a `peerDependency` and needed to be a `dependency` or `devDependency`, although perhaps that was non-addon libraries, I don't recall and unfortunately didn't leave enough of a paper trail to verify.

But overall, given how embroider compiles apps/addons into a more statically analyzable and broadly standards compliant package format, we had to do a fair amount of hardening how we declare our dependencies in our various `package.json`s.

### Statically analyzable components

This already has a [great writeup](https://github.com/embroider-build/embroider/blob/master/REPLACING-COMPONENT-HELPER.md) in the embroider documentation. We weren't doing anything truly dynamic, only using dynamic-looking components as a way of currying components' arguments multiple times, so it was not very difficult for us to refactor to avoid doing that, although in retrospect I think we might have been able to more easily do it using the not-yet-documented (outside code comments, as far as I can tell) [packageRules](https://github.com/embroider-build/embroider/blob/12f06616713645b4f0696b27c5d673562f68dcb8/packages/compat/src/dependency-rules.ts#L6).

### CSS/SASS

I spent a good deal of effort getting our SCSS (via `ember-cli-sass`) and CSS working under embroider. Unfortunately I don't have great detail to offer here, because due to Reasons™ (and probably not great ones), I ended up switching from `node-sass` to `dart-sass` as part of the move to embroider, so I'm not actually certain how much fiddling was needed for embroider, and how much for `dart-sass`. But I am certain that it was a mix of the two, so be warned that there may be some non-trivial effort involved in getting your styles working when moving to embroider.

### Third-party addons

Hooboy, this was definitely a biiiiig hunk of the work. Our app has been under development for 6ish years, so it has a whole history of legacy code relying on older addons that aren't really Octane-y, plus several modern addons that haven't yet been brought up to embroider compatibility, let alone embroider optimized compatibility.

Getting all the third-party addons working took a lot of effort, but fortunately webpack provides a lot of configuration and tools to hack on things and make them work. Here is a list of addons that were problematic (that should shrink over time) and what we did about them -- I hope these solutions will help people with identical problems and/or serve as examples to help address issues with addons we do not use.

I should also note that there are undoubtedly better ways of doing some of this -- I often took a brute force webpack approach because that's what I knew, but I believe embroider's [packageRules](https://github.com/embroider-build/embroider/blob/12f06616713645b4f0696b27c5d673562f68dcb8/packages/compat/src/dependency-rules.ts#L6) might provide nicer solutions to some of these issues.

Before trying any workarounds, I would always update the problematic addon(s) to their latest version, so all of these descriptions and workarounds apply to latest published versions as of 5/14/2021.

#### [ember-file-upload](https://adopted-ember-addons.github.io/ember-file-upload/)
`ember-file-upload` imports code from `ember-cli-mirage` that might not actually be included in the build -- see the discussion in [this](https://github.com/adopted-ember-addons/ember-file-upload/issues/425) issue for more details. Since we don't use `ember-file-upload`'s mirage utilities, we worked around this by stubbing out the import:

```js
const emberFileUploadMiragePath = path.join(
  path.dirname(require.resolve('ember-file-upload')),
  'mirage'
);

// <snip>

webpackConfig: {
  resolve: {
    alias: {
      [emberFileUploadMiragePath]: false,
    },
  },
}
```

#### [ember-power-select](https://github.com/cibernox/ember-power-select)

Despite having some code in `@embroider/compat` to support this addon, I found that it would not work with the embroider optimized flags all turned on, I think because even if embroider knows what `@someComponent` is, the `or` in `{{component (or @someComponent "default-component")}}` messes up its static analysis. So, I got my friend (that we'll see a _lot_ more of), [string-replace-loader](https://github.com/Va1/string-replace-loader) to help out and came up with [this](https://gist.github.com/bendemboski/907b8a53040213a911301ad48172b99b) wonderful bit of webpack config that definitely doesn't make me secretly feel dirty and/or naughty.

#### [ember-concurrency](http://ember-concurrency.com/)

With embroider optimized flags (`staticAddonTrees` in particular), production builds of `ember-concurrency` fail with a [bizarre error](https://github.com/embroider-build/embroider/issues/811). The current theory is that it's a webpack bug, but fortunately the [workaround](https://github.com/embroider-build/embroider/issues/811#issuecomment-840180944) is pretty straightforward.

#### [ember-cli-page-object](http://ember-cli-page-object.js.org/)

`ember-cli-page-object` has a [compatibility module](https://github.com/san650/ember-cli-page-object/blob/16007bbaedbe9fc2f9c10e45ab05150c67d32bbf/addon-test-support/-private/compatibility.js) that is meant to support older setups with old versions of `@ember/test-helpers`, or even from before that library existed. It exposes an API that is meant to more or less emulate `@ember/test-helpers`, and internally does some tricks with testing for modules at runtime that does not work with embroider optimized.

Since we know our code always has `@ember/test-helpers` present, we can use [string-replace-loader](https://github.com/Va1/string-replace-loader) to make that compatibility module [statically import and re-export](https://gist.github.com/bendemboski/05d00b3f95e7ce8b720b22d161fa5d28) `@ember/test-helpers`.

#### [ember-metrics](https://github.com/adopted-ember-addons/ember-metrics)

`ember-metrics` relies on some features of Ember's container and module loader that do not work under embroider optimized to dynamically look up its metrics adapters based on names specified in `config/environment.js`. Since I know the static list of adapters that our application uses, I wrote an initializer to statically import those adapters and then register them in the container using the names under which `ember-metrics` expects to find them:

```js
import intercomAdapter from 'ember-metrics/metrics-adapters/intercom';
import mixpanelAdapter from 'ember-metrics/metrics-adapters/mixpanel';

export function initialize(application) {
  application.register('metrics-adapter:intercom', intercomAdapter);
  application.register('metrics-adapter:mixpanel', mixpanelAdapter);
}

export default {
  initialize,
};
```

#### [ember-changeset-validations](https://github.com/poteto/ember-changeset-validations)

The whole `ember-changeset`/`ember-changeset-validations`/`ember-validators` bundle did not have dependencies set up and declared in a way that would work with embroider optimized, so some module aliasing and an appearance by my new best friend, [string-replace-loader](https://github.com/Va1/string-replace-loader) provided a [workaround](https://gist.github.com/bendemboski/9a498a6eda26e102597d98e5b7718c9c).

#### [ember-validated-form](https://adfinis-sygroup.github.io/ember-validated-form/)

`ember-validated-form` does a _lot_ of dynamic component invocations that embroider cannot statically analyze. I believe the fact that it uses curly component syntax and doesn't use `this.foo` vs `@foo` makes it even harder on embroider. The [workaround](https://gist.github.com/bendemboski/962fd6afd1e425c8e47460e370ae4153) involved soooooo much [string-replace-loader](https://github.com/Va1/string-replace-loader), but it works!

### Route-splitting miscellanea

At the end of this all, enabling route-splitting was a very pleasant anti-climax. It _almost_ just worked, and I was SO EXCITED to see only the code I expected/wanted loaded in each window of our application. The couple of minor issues I had to address when enabling route splitting were:

* We had one route whose dynamic parameter was `:id` and even though it didn't need to implement the `serialize()` hook (which is [warned about](https://github.com/embroider-build/embroider/blob/75344d894160e5f6b1951c5de89195a393394a46/packages/router/README.md#compatibility) in the documentation), when using the embroider router, passing a model instance to [RouterService.urlFor()](https://api.emberjs.com/ember/3.26/classes/RouterService/methods/get?anchor=urlFor) did not work. Evidently the code wanted the dynamic parameter to end with `_id` before it would look for an `id` property on the model instance, so I changed the dynamic parameter to `:sheet_id` and everything was hunky dory
* We had one test that was doing `this.owner.lookup('controller:invention')` before calling `visit()`, and that was not returning the controller instance. I believe this was because that controller/route were lazy-loaded, so the code wasn't loaded and the factory wasn't registered with the container before `visit()`. I fixed this by shuffling the test code around to not do the `lookup()` until after the `visit()` call, but this one has me kinda nervous that I have a lot of other `lookup()`s like this that are only succeeding because they run after tests that have already caused the code for the lazy-loaded routes to load...but I haven't confirmed/investigated this any further yet.

# Other tips, tricks, and gotchas

Here I've collected some gotchas that I ran into and overcame, and some tips and tricks for smoothing out the whole setup and developer experience of working in this bravely-embroidered new world.

## Addon build failures

There is currently a [bug](https://github.com/embroider-build/embroider/issues/799) in embroider that causes addon builds to non-deterministically produce incorrect output so that tests and the dummy app will not load or run. Until it is fixed, the workaround is to disable concurrency (set `JOBS=1`) in your environment anytime you're building addons (this does not have any effect on apps).

Because this not only produces a broken build but also poisons the embroider cache, I've applied a draconian workaround to all of our addons:

```js
// ember-cli-build.js
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const { Webpack } = require('@embroider/webpack');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
  });

  // https://github.com/embroider-build/embroider/issues/799
  process.env.JOBS = '1';

  return require('@embroider/compat').compatBuild(app, Webpack);
};
```

## Out-of-memory errors in CI

Until [this fix](https://github.com/embroider-build/embroider/pull/795) is released (which should happen in the next release after v0.40.0), embroider doesn't quite fully respect `JOBS=1`. With `JOBS=1` it will run the entire build in a single process, but it still warms a worker pool whose size is number-of-cpus-minus-one which, in CI, can be a very big number. Spawning all of these processes and having them load up their code (even though they don't do anything) consumed enough memory that in some of our CI scenarios, there was not enough left over for our build/tests/etc.

I don't know of a good workaround. My super ugly one was to compile `@embroider/webpack`'s latest master, check in a copy of `ember-webpack.js` to my source tree, and then manually copy it into `node_modules` to overwrite the existing v0.40.0 file at the beginning of the CI run. DON'T LOOK AT ME!!!!!

## Addon-supplied webpack configuration

When using `ember-auto-import` pre-embroider, addons could supply a [configuration](https://github.com/ef4/ember-auto-import#customizing-build-behavior) to use when building their assets, including a webpack configuration. This could be very handy when addons included third-party libraries that they themselves added to the application bundle using `ember-auto-import`. As far as I can discern, embroider doesn't have a similar mechanism.

I think the whole idea of modularizing and then merging webpack configs is a little fraught because webpack wasn't really designed for modular configurations -- it all gets merged into a single configuration, so it's not hard to concoct scenarios where the different "modules" of configuration conflict and mess each other up.

That being said, in controlled environments like ours where the addons are private to our applications, and we have specific knowledge of how/where they will be used, such a mechanism can be very handy. So we ended up standardizing on addons putting their webpack configuration in `/webpack.config.js` so they could be imported and merged from consuming apps/addons.

For example, suppose we have an app, creatively called `app` that depends on `addon-a` and `addon-b`. [This gist](https://gist.github.com/bendemboski/d258676f6807e4c81fd7841ca346b840) shows how we might put together and consume reusable webpack configs for this scenario.

## Rebuild on addon changes

Pre-embroider, if an addon's `index.js` implemented `isDevelopingAddon()` to return `true`, then when running `ember serve` or `ember test -s`, the build watcher would watch that addon and auto-rebuild/live-reload when any changes were made to that addon. embroider uses a different mechanism, which is the environment variable `EMBROIDER_REBUILD_ADDONS` that can contain a comma-separated list of the names of addons to watch.

I like this mechanism much better because I don't have to modify code to change which addons are and aren't build-watched. But in the specific case of our monorepo with our app and addons, I _always_ want to build-watch the in-monorepo addons. This is because our addons are not published, and are really only separate from the app for code organization and dev/test efficiency reasons. I could set `EMBROIDER_REBUILD_ADDONS` to those addons in my login configs or something, but I wanted a zero-config solution that would work for my whole team. So I settled on doing this little trick in all our in-monorepo addons' `index.js` files:

```js
module.exports = {
  name: require('./package').name,
};

// embroider doesn't respect isDevelopingAddon(), and we don't publish this
// addon, so always add ourselves to the list of auto-rebuild addons
process.env.EMBROIDER_REBUILD_ADDONS = Array.from(
  new Set([
    ...(process.env.EMBROIDER_REBUILD_ADDONS || '').split(','),
    require('./package').name,
  ])
).join(',');
```

This way anytime an app or addon runs a build that depends on this addon, it will add itself to the list of rebuild addons.

PLEASE DO NOT DO THIS IN PUBLISHED ADDONS!!!

# Conclusions

At the end of this all, we had what we wanted (tree-shaking and code splitting across routes), and I was very excited. It was a good deal of work (3.5 weeks or so as my main focus), although a lot of that was taken up by investigations of embroider bugs, followed by bug reports, sometimes contributing fixes, and sometimes finding the workarounds described above. So hopefully that will pave the way for a faster/smoother experience for others.

embroider is moving fast, and I'm sure much of this article will be obsolete before long, but I hope it does provide some value in the meantime. I'd also love to hear from others -- your experiences with embroider, ideas to improve on the suggestions and methods I've provided, core team members telling me how I've missed the boat and misrepresented anything/suggested anything silly, etc. I hang out in the #dev-embroider channel on Ember Discord, and will happily discuss/answer questions/etc. here or there.

-----------------------------------------------------------

username: hoanganhlam
github_username: hoanganhlam
twitter_username: null

### markup
```
    <img {{bindAttr src="avatarURL"}}>
    <button {{action follow}}>
```

Value binding:

```
    {{view Ember.TextField class="input block" valuebinding="emailAddresses"}}
```

Actions:

```
    <button {{action invite emailAddresses}}>Invite></button>
    <a href="#" {{action set "isEditingContacts" true target="view"}} 
```

### View

```
    App.InfoView = Ember.View.extend({
      templateName: 'input',  /* optional */

      fooName: "Hello"  /* {{ view.fooName }} */

      click: function(e) {
        "I was clicked";
      }

    });
```

### A route

```
    App.IndexRoute = Ember.Route.extend({
      setupController: function(controller) {
        controller.set('title', 'my app');
        // <h1>{{title}}</h1>
      },

      setupController: function(controller, model) {
        controller.set("model", model);
        this.controllerFor('topPost').set('model', model);
      },

      model: function(params) {
        return this.store.find('posts');
        return this.store.find('post', params.post_id);
      },
      
      serialize: function(model) {
        // this will make the URL `/posts/foo-post`
        return { post_slug: model.get('slug') };
      }
    });
```

### Routes

```
    App.Router.map(function() {
      this.resource('trips', function() {
          this.route('item', { path: '/:trip_id' });
      });

      this.route('upcoming');
      this.route('about', { path: '/about' });
      this.route('schedules');
      this.route('history');
      this.route('post');
    });
```

### Reference

* [Ember.Js Cheat Sheet](https://cheatsheetmaker.com/emberjs) - [Cheat Sheet Maker](https://cheatsheetmaker.com)

-----------------------------------------------------------

username: sivasundar
github_username: siva-sundar
twitter_username: null
This article is a demonstration on how to mount light weighted apps made with Preact, Svelte, etc. along with a dedicated router into Ember.

Right now, this can be achieved with certain router packages​ like https://single-spa.js.org. However, let's try a different approach.
<br>
For demo, let's choose **Ember and Preact** and define two routes in Ember
![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uye1s6tw35ysznxfficz.png)<br>

And again define three routes in Preact
![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8kjoaxfecmp3ud7eeuv3.png)<br> 

At this point, these are two stand-alone apps, which would render in different html pages. Let **Ember** be our **base app**,  and to mount Preact App into Ember, we need **a route(page) which certainly acts as an exit point for Ember and entry point for the Preact App**.
​
There are two set of changes here.

​1. Define **exit route** in Ember(Say `/ember-exit-route`)​
​2. Use `/ember-exit-route` as **base url** for the Preact App.
​
Now, we add two more routes in the Ember App, which handles the url `/ember-exit-route` and all child paths beyond that say(`/ember-exit-route/home`, `/ember-exit-route/profile`,...)

![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ro194krrg0xmtth9u812.png)

`/*path` denotes a wildcard, which catches all the paths coming after `/ember-exit-route`.

 ​​​
And we define the ​exit url as base path in the Preact App.

![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/iq5xxqt9o8nar63erdd9.png)<br>

​​​Now, the last part, once we visit `/ember-exit-route`, we need to load the assets of the Preact App and render it inside an element.

![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/snlvgnl5bm5bf0w01xzu.png)
 
That's it. 

**Demo link**: https://ember-preact-demo.netlify.app/

Let me know your thoughts on this.

-----------------------------------------------------------

username: chrismllr
github_username: chrismllr
twitter_username: null
---
title: Ember Apollo Client + @use 
published: true
description: A real-world application for @pzuraq's new `@use` API in Ember, using it to wrap some common ember-apollo-client methods
tags: graphql, ember, typescript
---

I've recently spun up my first Ember app using GraphQL, and as I would do when approaching any new functionality in my Ember app, I reached for the community supported addon [`ember-apollo-client`](https://github.com/ember-graphql/ember-apollo-client).

`ember-apollo-client` provides a really nice wrapper around everything I'd want to do with the `@apollo/client`, without making too many assumptions/ abstractions. It nicely wraps the `query`, `watchQuery`, and `subscribe` methods, and provides a `queryManager` for calling those methods, which quite nicely cleans them up for you as well.

Ember traditionally has many ways to set up/ clean up data-fetching methods, and you usually fall into two camps; I find myself choosing a different path almost every time I write an ember app.

## 1. Use the `model` hook

`ember-apollo-client` first suggests using your model hook, illustrated here:

```js
// app/routes/teams.js
import Route from '@ember/routing/route';
import query from '../gql/queries/teams';

export class TeamsRoute extends Route {
  @queryManager apollo;

  model() {
    return this.apollo.watchQuery({ query }, 'teams');
  }
}
```

**Pros:** This method is well supported by the framework, and allows for utilizing `error` and `loading` substates to render something while the model is reloading.

**Drawbacks:** `query parameters`. Say we have a `sort` parameter. We would then set up an additional `observable` property within our model hook, and likely use the `setupController` hook to set that on our controller for re-fetching data when `sort` changes. This is fine, but includes extra code which could become duplicative throughout your app; leading to potential bugs if a developer misses something.

## 2. Utilize `ember-concurrency`
Based on a suggestion I found while digging through their issues and documentation, I gave `ember-concurrency` a shot:

```js
// app/routes/teams.ts
import Route from '@ember/routing/route';

export class TeamsRoute extends Route {
  setupController(controller, model) {
    controller.fetchTeams.perform();
  }

  resetController(controller) {
    controller.fetchTeams.cancelAll();
    unsubscribe(controller.fetchTeams.lastSuccessful.result);
  }
}

// app/controllers/teams.js
import Controller from '@ember/controller';
import query from '../gql/queries/teams';

export class TeamsController extends Controller {
  @queryManager apollo;
  @tracked sort = 'created:desc';

  @task *fetchTeams() {
    const result = yield this.apollo.watchQuery({ 
      query, 
      variables: { sort: this.sort } 
    });

    return {
      result,
      observable: getObservable(result)
    };
  }

  @action updateSort(key, dir) {
    this.sort = `${key}:${dir}`;
    this.fetchTeams.lastSuccessful.observable.refetch();
  }
}
```

**Pros:** This feels a little more ergonomic. Within the `ember-concurrency` task `fetchTeams`, we can set up an observable which will be exposed via `task.lastSuccessful`. That way, whenever our sort property changes, we can access the underlying observable and `refetch`.

`ember-concurrency` also gives us some great metadata and contextual state for whether our task's `perform` is running, or if it has errored, which allows us to control our loading/ error state.

**Drawbacks**: In order to perform, and subsequently clean this task up properly, we're going to need to utilize the route's `setupController` and `resetController` methods, which can be cumbersome, and cleanup especially is easily missed or forgotten.

This also requires the developer writing this code to remember to `unsubscribe` to the watchQuery. As the controller is a singleton, it is not being torn down when leaving the route, so the queryManager unsubscribe will not be triggered. _Note: if this is untrue, please let me know in the comments!_

Either way, we will still need to cancel the task. This is a lot to remember!

## Enter `@use`

Chris Garrett (@pzuraq) and the Ember core team have been working towards the `@use` API for some time now. Current progress can be read about [here](https://www.pzuraq.com/introducing-use/).

While `@use` is not yet a part of the Ember public API, the article explains the low-level primitives which, as of Ember version 3.25+, are available to make `@use` possible. In order to test out the proposed `@use` API, you can try it out via the [`ember-could-get-used-to-this`](https://github.com/pzuraq/ember-could-get-used-to-this) package.

> ⚠️ Warning -- the API for `@use` and `Resource` could change, so keep tabs on the current usage!

## How does this help us?

Remember all of those setup/ teardown methods required on our route? Now, using a helper which extends the `Resource` exported from `ember-could-get-used-to-this`, we can handle all of that.

Lets go `ts` to really show some benefits we get here.

```ts
// app/routes/teams.ts
import Route from '@ember/routing/route';

export class TeamsRoute extends Route {}

// app/controllers/teams.ts
import Controller from '@ember/controller';
import { use } from 'ember-could-get-used-to-this';
import GET_TEAMS from '../gql/queries/teams';
import { GetTeams } from '../gql/queries/types/GetTeams';
import { WatchQuery } from '../helpers/watch-query';
import valueFor from '../utils/value-for';

export class TeamsController extends Controller {
  @tracked sort = 'created:desc';

  @use teamsQuery = valueFor(new WatchQuery<GetTeams>(() => [{
    GET_TEAMS,
    variables: { sort: this.sort }
  }]));

  @action updateSort(key, dir) {
    this.sort = `${key}:${dir}`;
  }
}
```
And voila! No more setup/ teardown, our `WatchQuery` helper handles all of this for us.

> Note: `valueFor` is a utility function which helps reflect the type of the "value" property exposed on the Resource. More on that below. This utility should soon be exported directly from `ember-could-get-used-to-this`.

So whats going on under the hood?

```ts
// app/helpers/watch-query.ts
import { tracked } from '@glimmer/tracking';
import { Resource } from 'ember-could-get-used-to-this';
import { queryManager, getObservable, unsubscribe } from 'ember-apollo-client';
import { TaskGenerator, keepLatestTask } from 'ember-concurrency';
import ApolloService from 'ember-apollo-client/services/apollo';
import { ObservableQuery, WatchQueryOptions } from '@apollo/client/core';
import { taskFor } from 'ember-concurrency-ts';

type QueryOpts = Omit<WatchQueryOptions, 'query'>;

interface WatchQueryArgs {
  positional: [DocumentNode, QueryOpts];
}

export class WatchQuery<T> extends Resource<WatchQueryArgs> {
  @queryManager declare apollo: ApolloService;

  @tracked result: T | undefined;
  @tracked observable: ObservableQuery | undefined;

  get isRunning() {
    return taskFor(this.run).isRunning;
  }

  get value() {
    return {
      result: this.result,
      observable: this.observable,
      isRunning: this.isRunning,
    };
  }

  @keepLatestTask *run(): TaskGenerator<void> {
    const result = yield this.apollo.watchQuery<T>(this.args.positional[0]);

    this.result = result;
    this.observable = getObservable(result);
  }

  setup() {
    taskFor(this.run).perform();
  }

  update() {
    this.observable?.refetch(
      this.args.positional[0].variables
    );
  }

  teardown() {
    if (this.result) {
      unsubscribe(this.result);
    }

    taskFor(this.run).cancelAll({ resetState: true });
  }
}
```

Lot going on, lets break it down:

We've brought in some libraries to help with using `typescript`, including `ember-concurrency-ts`.

The `Resource` class gives us a way to perform our task upon initialization:
```ts
setup() {
  taskFor(this.run).perform(); 
}
```

And a way to clean up after ourselves when we're done:
```ts
teardown() {
  if (this.result) {
    unsubscribe(this.result);
  }

  taskFor(this.run).cancelAll({ resetState: true });
}
```

And remember how we declaratively called `refetch` after updating sort? Well, now we can utilize ember's tracking system, since we passed `sort` in the constructor function, it should reliably trigger the `update` hook if updated:
```ts
update() {
  this.observable?.refetch(
    this.args.positional[1].variables
  );
}
```

## Where do we go from here

From here, you can use the same paradigm to build out Resources for handling `apollo.subscribe` and `apollo.query`, with few code changes.

As our app is very new, we plan on tracking how this works for us over time, but not having to worry about setting up/ cleaning up queries for our application should greatly improve the developer experience right off the bat.

An important thing to note, this article focuses on wrapping the `ember-apollo-client` methods, but can Easily be extrapolated to support any data-fetching API you want to use, including Ember Data.

Thanks for reading! Please let me know what ya think in the comments 👋


-----------------------------------------------------------

username: juanazam
github_username: juanazam
twitter_username: null
## Introduction

A while ago I came across the following tweet

{% twitter 1361347296605200393 %}

After reading it, I had a few flashbacks to discussions in the community about routable components taking the place of controllers. That transition never happened, and controllers are still around.

Given controllers are long-lived entities in the framework, they are a source of a lot of bugs while writing ember apps. The classic bug is to forget to reset certain state in a controller, so when the user re visits the route, the state of the controller is not automatically reset.

After reading this response:

{%twitter 1361490151029940231 %}

I decided to take a stab at migrating a controller on a real app and write about the process, so I could actually see how it would look in real life and also share knowledge with the community.

## Real world example

At Mimiquate, we have developed an open source app called [Timo](https://timo.mimiquate.xyz), that aims to find acceptable time slots to have meetings for remote teams with team members all round the world. If you are interested, you can check the [article](https://www.linkedin.com/pulse/timo-simplifying-scheduling-virtual-meetings-juan-azambuja) I wrote on it's release. I decided to migrate Timo's largest controller, and write about the process while doing it.

Here is a link to [the commit where the change is implemented](https://github.com/mimiquate/timo/commit/08b881424a358e0ef9412fd8d29fa5adebb71f3e) if you want to go straight to the point.

Here are a few details to go over, the template of the route is a lot simpler now, which was expected.

{% gist https://gist.github.com/juanazam/52bbf19c51fe1b73e08a86d8af48393f file=team.hbs %}

All of its content was moved to the new top-level component.

Regarding the component file, most of the changes are straight forward: basically stop relying on the model property, and used the passed arguments instead. I also had to make sure I imported the store and router services, given those are not automatically available within components. This resulted in a few small changes, for example, updating transitions to other routes.

## Small hiccup

I would have thought this was the end of it, but it wasn't. When doing this migration you would assume the state of the component would always be refreshed, given that we we have switched from a controller to a component, but that wasn't the case.

On Timo, most of the action happens on the team route, and the user usually moves from one team to the other. This means the component is not destroyed, and only its arguments are updated. As a result, the state of the component never resets when navigating from team to team.

With controllers, the solution would be simple, we would just reset the state of the controller on the `resetController` hook of our route and that would be it.

If we were using Ember Classic components, we could use the `didUpdateAttrs` hook to reset these variables, since the parameters only update when the route is refreshed, but we don't have that possibility in Octane.

### Enter ember-modifiers

The simplest solution I could find to this problem was to use ember-modifiers.

{% github https://github.com/ember-modifier/ember-modifier %}

The addon comes with helpers we are familiar with, in this case, I used the `did-update` helper, as shown below.

{% gist https://gist.github.com/juanazam/52bbf19c51fe1b73e08a86d8af48393f file=template.hbs %}

I added a container div with the `did-update` modifier, which is called every time the current team is updated. When that happens, the `resetCurrentTime` function is executed, and the state is reset.

```
<div {{did-update this.resetCurrentTime this @team.id this}}>
```

## Conclusion

Migrating to top-level components is not hard at all, but there are a few issues that can be found after testing your app in different circumstances.

There are times when we will have to deal with Controllers like it or not. One of these situations, is when dealing with query params. Right now, the only way of dealing with them is via `queryParams` interface on controllers, which has its fair share of quirkiness.

Regarding issues related to glimmer components, most solutions can be found [here](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/).

As always, Ember's documentation goes above and beyond.

In summary, not using controllers is definitely possible, but it’s not a solution that the framework fully supports, and that always has a cost. Although some controllers can be fully moved to components, others can’t, which means there is no uniform way of transforming all the code base this way without compromises.

Special thanks to

{% user nullvoxpopuli %}

For helping me discuss some of the issues I faced while implementing these changes.