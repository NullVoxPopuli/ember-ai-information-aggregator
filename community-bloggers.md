

------------------------
# community-bloggers
------------------------
---
title: How Does Ember's Dependency Injection System Work?
image: /images/sweetgun-UrY8jgHHapw-unsplash.jpg
imageMeta:
  attribution: "甜心之枪 Sweetgun"
  attributionLink: https://unsplash.com/photos/UrY8jgHHapw
featured: false
authors:
  - nullvoxpopuli
date: Sat Aug 08 2020 13:04:01 GMT-0400 (Eastern Daylight Time)
tags:
  - ember
  - javascript
  - architecture
  - frontend
---

## Why?

One of the most common things I hear from people who are new to Ember,
new to programming in general, or coming from another frontend ecosystem
(especially React and Vue), is that they think Ember's dependency injection
system is too complicated and magical --
too hard to reason about or know where the injected services come from.
I, too, was in that boat -- until I really dove into how it works -- it was
then that I began to understand why dependency injection even exists, and
how it's actually _simpler_ than _not_ having it at all.

## What is Dependency Injection?

According to [Wikipedia](https://en.wikipedia.org/wiki/Dependency_injection)

> *dependency injection* is a technique in which an object receives other
> objects that it depends on.

_That's it_.

So... this is dependency injection?

```js
let foo = new Foo()

let bar = new Bar(foo);
```

yes!.

The big deal with dependency injection usually comes from _managing_ how an object
receives those other objects.


## Why use Dependency Injection?

For me personally, there are two reasons:
1. Application State (data and functions) can be easily shared between components
2. Testing is much easier and can be done in isolation

For #1, there are many ways to share state between components, but I like that
dependency injection provides a centralized pattern and location for that state
as well as an ergonomic and light way to interact with that state.

For #2, this is a little harder to boil down to a sentence or two, and ultimately
comes down overall architecture of your app, how big your app is, and what sorts of
things provide value when tested. For example, let's say you have some behavior
for interacting with an external API, maybe it's the [Star Wars JSON api](https://swapi.dev/),
or maybe it's interacting with a game that you're building a bot for -- you _could_
build all that functionality into your component(s) -- because why prematurely abstract?
But you could also build that functionality into a _Service_, or "just another
class that your component will end up using", like this:

```js
class MyComponent {
  constructor() {
    this.api = new StarWarsApi();
  }
}

let myComponent = new MyComponent();
```

This is a great first step! as the `StarWarsApi` can be tested by itself without
needing to be tied to your component. _However_, your component has the opposite
problem, it is _dependent_ on the `StarWarsApi`, and there is no way to test
the behaviors of `MyComponent` without using the real implementation of `StarWarsApi`.
The solution to this is dependency injection, where the coupling between the
specific implementation of `StarWarsApi` is reduced to just the interface
(the list of methods that we care about), and during testing, we can swap out
the `StarWarsApi` with a fake one that has all the same methods.

```js
class MyComponent {
  constructor(api) {
    this.api = api;
  }
}

let fakeApi = { /* fake stuff here */ }
let myComponent = new MyComponent(fakeApi);
```

There is _a lot_ of information on this topic, and I think [this StackOverflow Answer](https://stackoverflow.com/a/14301496)
summarizes it well:

> So, to cut a long story short: Dependency injection is one of two ways of how
> to remove dependencies in your code. It is very useful for configuration
> changes after compile-time, and it is a great thing for unit testing
> (as it makes it very easy to inject stubs and / or mocks).

Which reminds me of the whole point of software engineering and architecture in
general: _to make testing easier._

If we do not learn from the mistakes of those before us and allow ourselves to make
testing hard for both our coworkers as well as our future selves, we are doing
our coworkers (and ourselves!) a disservice.

This could easily go on a tangent about the important and philosophy of testing
and testing-driven architecture, but that's a topic for another time.


## How does Dependency Injection work in Ember?

I think the best way to describe this is to first demonstrate how we would create
our own dependency injection system from scratch.

This is a bottom-up approach, meaning that we start with the bare minimum, and the
gradually add more behavior as we move forward. First, we'll need to define some
terms and set goals, so we're on the same page:

Nomenclature:
- Service: a named bucket of state and/or behavior (usually a class instance);
- Injection: the act of defining a reference to a Service
- Container: the object that holds references to each Service

Goals:
1. A Service can be referenced from anywhere, regardless of where it is accessed
2. A Service is a [singleton](https://en.wikipedia.org/wiki/Singleton_pattern)
3. Services can reference each other (circular dependencies are valid)
4. Access to the global namespace is not allowed



This could be considered an ancestor to dependency injection, where there exists
a shared `container` object in the module scope, still allowing for us to
achieve the first three goals.


```ts
// app.js
let container = {};

function bootApp() {
  initializeServices();

  container.bot.begin();
}

class Bot {
  begin() {
    let nextMove = container.ai.getMove();

    container.ui.sendKeyPress(nextMove);
  }
}

function initalizeServices() {
  container.ai = new AI();
  container.bot = new Bot();
  container.ui = new UI();
}


bootApp();
```
To see this code in action, view [this CodeSandBox](https://codesandbox.io/s/dependency-injection-1-19yqj)

In a multi-file environment we don't have access to the same module scope between files,

```ts
// app.js
import Bot from './bot';
import AI from './ai';
import UI from './ui';

let container = {};

function bootApp() {
  initializeServices();

  container.bot.begin();
}

function initializeServices() {
  container.ai = new AI(container);
  container.bot = new Bot(container);
  container.ui = new UI(container);
}

// bot.js
export default class Bot {
  constructor(container) {
    this.container = container;
  }

  begin() {
    let nextMove = this.container.ai.getMove();

    this.container.ui.sendKeyPress(nextMove);
  }
}

```
To see this code in action, view [this CodeSandBox](https://codesandbox.io/s/dependency-injection-2-b0qws)

However, as a framework or library developer, forcing users / application developers
to remember to assign the container each time isn't very ergonomic.

```ts
// app.js
// same as before

// service.js
export default class Service {
  constructor(container) {
    this.container = container;
  }
}

// bot.js
import Service from './service';

export default class Bot extends Service {
  begin() {
    let nextMove = this.container.ai.getMove();

    this.container.ui.sendKeyPress(nextMove);
  }
}
```

This is a little better, we have abstracted away a bit of boilerplate, but there is still
a "magic property", `container` -- this is generally where object oriented programming
can get a negative reputation for -- a lack of _proper_ or _incomplete_ abstraction.

> _A bad abstraction is worse than no abstraction_

So, let's clean that up a bit using a [decorator](https://babeljs.io/docs/en/babel-plugin-proposal-decorators)

```ts
// app.js
// same as before

// service.js
let CONTAINER = Symbol('container');

export default class Service {
  constructor(container) {
    // the container is now set on a symbol-property so that app-devs don't
    // directly access the container. We want app-devs to use the abstraction,
    // which we're aiming to be more ergonamic
    this[CONTAINER] = container;
  }
}

// this is a decorator, and would be used like `@injectService propertyName`
// where target is the class, name would be "propertyName", and descriptor is the
// property descriptor describing the existing "propertyName" on the class that is
// being decorated
//
// For more information on decorators, checkout the above linked decorator plugin
// for babel.
export function injectService(target, name, descriptor) {
  return {
    configurable: false,
    enumerable: true,
    get: function() {
      if (!this[CONTAINER]) {
        throw new Error(`${target.name} does not have a container. Did it extend from Service?`);
      }

      return this[CONTAINER][name];
    }
  }
}

// bot.js
import Service { injectService } from './service';

export default class Bot extends Service {
  @injectService ai;
  @injectService ui;

  begin() {
    let nextMove = this.ai.getMove();

    this.ui.sendKeyPress(nextMove);
  }
}
```
To see this code in action, view [this CodeSandBox](https://codesandbox.io/s/dependency-injection-3-mum0p?file=/bot.js)

With this approach we can reference each service by name -- but we have a new problem now:
_as a framework developer, how do we ensure that service properties match up to the service classes?_

In the current implementation, we've been arbitrarily assigning values on the `container` object,
`ui`, `ai`, and `bot`. Since this has been in user-space, we've always known what those properties
are on the container.

This is where convention steps in.


As framework / library authors, we can say that services are required to be in the
`services/` folder of your project.

```ts
let container = {};

function bootApp() {
  initializeServices();

  container.bot.begin();
}

function initializeServices() {
  for (let [name, AppSpecificService] of detectedServices) {
   container[name]  = new AppSpecificService(container);
  }
}
```

However, if you're familiar with module-based javascript, you'll noticed that `detectedServices`
needs to _somehow_ be aware of the services in the `services/` folder and know their names.

This is where a CLI, at build-time, can help out our framework at run-time.

In Ember, this step is handled be the [ember-resolver](https://github.com/ember-cli/ember-resolver)
which then defers to [requirejs](https://github.com/ember-cli/ember-resolver/blob/master/addon/resolvers/classic/index.js#L16),
which [defines modules](https://requirejs.org/docs/api.html#define) in the [AMD](https://requirejs.org/docs/whyamd.html#namedmodules)
format -- which, for now, we don't need to worry about.

For demonstration purposes, we'll "say" that our bundler and CLI are configured
together to produce a map of relative file paths to modules:
```ts
let containerRegistry = {
  'services/bot': await import('./services/bot'),
  'services/ai': await import('./services/ai'),
  'services/ui': await import('./services/ui'),
}
```

so then our `app.js` may look like this:
```ts
let knownServices = Object.entries(containerRegistry);
let container = {};

function bootApp() {
  initializeServices();

  container.bot.begin();
}

function initializeServices() {
  for (let [fullName, ServiceModule] of knownServices) {
    let name = fullName.replace('services/', '');
    let DefaultExport = ServiceModule.default;

    container[name]  = new DefaultExport(container);
  }
}
```

So now in our documentation, we can write that whatever the file name of the service is
will be the name of the property pointing to an instance of that service within
the `container`.


Now, what if we wanted our services to be lazily instantiated, so that we don't negatively
impact the _time to interactive_ benchmark if we don't have to?

So far our `container` has been a plain old object. We can utilize a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

```ts
let knownServices = Object.entries(containerRegistry);
let registry = {};

let container = new Proxy(registry, {
  get: function(target, propertyName) {
    if (target[propertyName]) {
      return target[propertyName];
    }

    let FoundService = lookupService(propertyName);

    target[propertyName] = new FoundService(container);

    return target[propertyName];
  }
});

function lookupService(serviceName) {
  let fullPath = `services/${serviceName}`;
  let doesServiceExist = Object.keys(containerRegistry).includes(fullPath);

  if (!doesServiceExist) {
    throw new Error(`The Service, ${serviceName}, was not found.`);
  }

  // We establish a convention that the service is defined on the default export
  return containerRegistry[fullPath].default;
}

function bootApp() {
  // initialization now happens on-demand
  container.bot.begin();
}
```

To see the final implementation, view [this CodeSandBox](https://codesandbox.io/s/dependency-injection-4-5fjzg)

## What does Ember do behind the scenes?

Ember abstracts nearly all of the above from you and provides conventions for
building out the map of service names to service instances, accessing those
services, and creating _any_ container aware-object.

The most important thing to know about the container, is that it'll
provide the contained, known internally-to-ember as the "owner", as
the first argument to each of your classes.

So, if you want to have your own "kind" of object, maybe it's a bunch of custom
objects that interact with something external, such as an API, or a Canvas, or WebGL,
or .. really anything!, it's possible to _register_ your objects with Ember's
container.

Ember does this internally for Services, Routes, Controllers, Components, Helpers,
and Modifiers, but to do what ember is doing, have this somewhere in your app

```js
// maybe in a Route's beforeModel hook
let owner = getOwner(this);
owner.register(
  /*
    full name in the format:
    namespace:name
  */
  'webgl:renderer',
  /* class */
  Renderer
);
```

Now, how would you access that from your component? It's not a service, so the
service decorator wouldn't work. First, let's look at what the service decorator _does_ look like

```js
// abridged version of the @service decorator
//
//
// NOTE: ember convention is:
//   import { inject as service } from '@ember/service';
export function inject(target, name, descriptor) {
  return {
    configurable: false,
    enumerable: true,
    get: function() {
      let owner = getOwner(this);

      return owner.lookup(`service:${name}`);
    }
  }
}
```

So that way, when you have `@service api`, the _namespace_ gets prepending for
you, and the `service:api` _full name_ is looked up in the container.

Knowing the above, we can make our own decorator so that we may access the our
"foo" singleton


```js
export function webgl(target, name, descriptor) {
  return {
    configurable: false,
    enumerable: true,
    get: function() {
      let owner = getOwner(this);

      return owner.lookup(`webgl:${name}`);
    }
  }
}
```

So then _anywhere_ in our app, we could have a component with the following:

```js
class MyComponent extends Component {
  @webgl renderer;
}
```



## "That's all, folks!"

Once I realized the implementation of ember's dependency injection, it felt
simple. It's pretty much a _global store_ where instances of classes are
stored on that _global store_ and referenced from other places within your app.
If something here _doesn't_ feel simple, let me know!, and hopefully I can tweak
this blog post until it does feel simple.

I like the pattern a lot, because it avoids the need to explicitly pass references
to every object you want to use throughout your entire app. Instead, Ember abstracts
away the passing of the container object to all objects created through that container
(mostly components and services, but custom classes can be used as well).

## Disclaimers

Dependency injection can be a big topic and have a lot of features implemented.
This demonstration has narrow scope and is not intended to be a "fully featured"
dependency injection implementation.

## About

Professionally, I had my start to frontend development in React, and at the time
there was really only Redux and MobX for state management -- but I only had the
privilege of working with Redux and eventually React's Context Provider/Consumer
pattern. There _is_ a little bit of overlap between React's Contexts and Ember's
Services, but they differ in fundamental ways -- which could be a topic for
another time.

Now that I'm getting paid to work with Ember almost every day I've only
gotten more excited about the programming patterns introduced by the framework and
am eager to share them with the world.


-----------------------

_This was inspired from some conversations on Twitter as well as trying not
to use a web framework for building an
[Artificatial Intelligence to play a game](https://github.com/NullVoxPopuli/doctor-who-thirteen-game-ai/blob/bc09c823abe89894cf7607aaa1820c348b900c10/ai.js#L5)_



## References

- [TC39 Decorator Proposal](https://github.com/tc39/proposal-decorators)
- [Ember Documentation on Dependency Injection](https://guides.emberjs.com/release/applications/dependency-injection/)


---

---
title: "<template> quickstart"
image: /images/rene-bohmer-YeUVDKZWSZ4-unsplash.jpg
imageMeta:
  attribution: "Rene Böhmer"
  attributionLink: https://unsplash.com/photos/YeUVDKZWSZ4
featured: true
authors:
  - nullvoxpopuli
date: Sun Jun 04 2023 08:39:26 GMT-0400 (Eastern Daylight Time)
tags:
  - ember
---

This is a quick reference guide for getting started with gjs/gts aka `<template>`.

The RFC that concluded the research in to this new file format is
[RFC#779 First-Class Component Templates](https://github.com/emberjs/rfcs/pull/779)

## For all projects

1. For syntax highlighting:
    - in neovim and VSCode, see [here](https://github.com/ember-template-imports/ember-template-imports/#editor-integrations)
    - on the web,
        - `highlight.js` via [highlightjs-glimmer](https://github.com/NullVoxPopuli/highlightjs-glimmer/)
        - [`shiki` ](https://github.com/shikijs/shiki/tree/main) has gjs support built in

2. For type checking `gts`, you'll use [`glint`](https://github.com/typed-ember/glint) instead of `tsc`.
  Ember Glint documentation is here [on the Glint docs site](https://typed-ember.gitbook.io/glint/environments/ember).
  <br>
  Ensure that your tsconfig.json has 

    ```json 
    {
      "compilerOptions": { /* ... */ },
      "glint": {
        "environment": [
          "ember-loose",
          "ember-template-imports"
        ]
      }
    }
    ```
    <br>
    Note that in Glint projects, you'll want to disable `tsserver`, so you don't have double-reported errors.
3. For linting, there are two paths:
    - Quickest:<br>
      use `configs.ember()` from [`@nullvoxpopuli/eslint-configs`](https://github.com/NullVoxPopuli/eslint-configs) 
    - Modifying you're existing lint command:<br>
      ```bash 
      eslint . --ext js,ts,gjs,gts
      ```
      if you otherwise don't specify extensions, having a sufficiently  new enough [lint config from the app blueprint](https://github.com/ember-cli/ember-new-output/blob/v5.1.0/.eslintrc.js#L19) should "just work"
    - make sure you have at least `eslint-plugin-ember@12.0.2`
    - use the ember eslint parser in your eslint config, (mentioned in the [eslint-plugin-ember README](https://github.com/ember-cli/eslint-plugin-ember?tab=readme-ov-file#gtsgjs))

       ```js
       module.exports = {
          // ...
          overrides: [
            // ...
            {
              files: ['**/*.gts'],
              plugins: ['ember'],
              parser: 'ember-eslint-parser',
            },
            {
              files: ['**/*.gjs'],
              plugins: ['ember'],
              parser: 'ember-eslint-parser',
            },
          ],
       };
       ```

    To get linting working in VSCode, you'll need to modify your settings (and be sure to include the defaults as well for both of these settings):
    ```json 
    "eslint.probe": [
     // ...
     "glimmer-js", 
     "glimmer-ts"
    ],
    "eslint.validate": [
      // ...
      "glimmer-js",
      "glimmer-ts"
    ],
    // ...
    "prettier.documentSelectors": ["**/*.gjs", "**/*.gts"],
    ```

    For neovim,
    ```lua 
    local lsp = require('lspconfig')
      
    -- ✂️ 

    local eslint = lsp['eslint']
      
    eslint.setup({
      filetypes = { 
        "javascript", "typescript", 
        "typescript.glimmer", "javascript.glimmer", 
        "json", 
        "markdown" 
      },
      on_attach = function(client, bufnr)
        vim.api.nvim_create_autocmd("BufWritePre", {
          buffer = bufnr,
          command = "EslintFixAll",
        })
      end,
    })
    ```
    neovim has support for `typescript.glimmer` and `javascript.glimmer` built in. [`vim-polyglot`](https://github.com/sheerun/vim-polyglot) breaks neovim's built-in syntax resolving, so uninstall that if you have it (neovim ships with treesitter which has very extensive language support).

4. For prettier/formatting, you'll need [`prettier-plugin-ember-template-tag`](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/)
  And for the best experience / workflow, run eslint and prettier separately (without the popular eslint-plugin-prettier)

## In an App

1. Install [`ember-template-imports`](https://github.com/ember-template-imports/ember-template-imports/).
2. If you use TypeScript,
    1. update your [babel config](https://github.com/emberjs/ember-cli-babel?tab=readme-ov-file#options) to have:
    
      ```js
        "plugins": [
          [
            "@babel/plugin-transform-typescript",
            { "allExtensions": true, "onlyRemoveTypeImports": true, "allowDeclareFields": true }
          ],
          // ...
      ```
  
    3. update your tsconfig.json to have (in `compilerOptions`)
    
      ```js
      "verbatimModuleSyntax": true,
      ```


## In a v1 Addon

1. Install [`ember-template-imports`](https://github.com/ember-template-imports/ember-template-imports/).

    ```bash
    npm add ember-template-imports
    ```
    it is important that this library be in `dependencies`, not `devDependencies`
    
3. If you use TypeScript,
    1. update your [babel config](https://github.com/emberjs/ember-cli-babel?tab=readme-ov-file#options) to have:
  
      ```js
        "plugins": [
          [
            "@babel/plugin-transform-typescript",
            { "allExtensions": true, "onlyRemoveTypeImports": true, "allowDeclareFields": true }
          ],
          // ...
      ```
  
    2. update your tsconfig.json to have (in `compilerOptions`)
  
      ```js
      "verbatimModuleSyntax": true,
      "allowImportingTsExtensions": true,
      ```



## In a v2 Addon

1. `@embroider/addon-dev` provides a `addon.gjs()` plugin.

## Usage and Patterns

See the interactive glimmer tutorial: [https://tutorial.glimdown.com](https://tutorial.glimdown.com)

## Notes

`ember-template-imports` easily provides a prototype of the features described by `RFC#779`, but `embber-template-imports` is not the final form of the `<template>` feature -- it as an easy way to set up the support today, but future techniques for enabling `<template>` will be easier. When reviewing the README for `ember-template-imports`, ignore everything about `hbs`, it will not be supported.   

## Example Projects using gjs/gts

Each of these projects is setup with linting, typechecking, etc

Hopefully they can be a reference for when issues are encountered upon setup

- [The Limber Project (REPL and Tutorial)](https://github.com/NullVoxPopuli/limber)
- [ember-resources](https://github.com/NullVoxPopuli/ember-resources/)
- [ember-primitives](https://github.com/universal-ember/ember-primitives/)
- [ember-headless-form](https://github.com/CrowdStrike/ember-headless-form/)
- [ember-headless-table](https://github.com/CrowdStrike/ember-headless-table/)

  ## See also
  
  - [Glint and &lt;template&gt;](https://mfeckie.dev/glint-and-ember-template-imports/)


---

---
title: Template Only vs Class Components
image: /images/daniels-joffe-PhQ4CpXLEX4-unsplash.jpg
imageMeta:
  attribution: Daniels Joffe 
  attributionLink: https://unsplash.com/photos/man-in-white-thobe-holding-microphone-PhQ4CpXLEX4
featured: true
authors:
  - nullvoxpopuli
date: Wed Dec 20 2023 14:00:38 GMT-0500 (Eastern Standard Time)
tags:
  - ember
---

Folks often hear that template-only components are faster than class-based components. But is it true?

Here is the setup,
- the [js-framework-benchmark](https://github.com/krausest/js-framework-benchmark/tree/master/frameworks/keyed/ember) app.

    - this benchmark focuses on testing the rendering of large tables, measuring CPU, Memory, etc while also measuring time to first render as well as time to update across certain common behaviors of these large tables.
      Normally, Large tables aren't something you want in a real app -- almost always you want pagination, and/or virtualized content.
      However, this is a decent stress test for "large amount of data rendered at once".

- two copies of the code with the "row" content extracted to its own component.

    - the template-only version of the component looks like this

      ```js
       const Row =
         <template>
           <tr class={{if @isSelected 'danger'}}>
             <td class='col-md-1'>{{@item.id}}</td>
             <td class='col-md-4'><a {{on 'click' @select}}>{{@item.label}}</a></td>
             <td class='col-md-1'><a {{on 'click' @remove}}><span
                   class='glyphicon glyphicon-remove'
                   aria-hidden='true'
                 ></span></a></td>
             <td class='col-md-6'></td>
           </tr>
         </template>;
      ```
    - the class-version of the component looks like this:

      ```js
       class Row extends Component {
         <template>
           <tr class={{if @isSelected 'danger'}}>
             <td class='col-md-1'>{{@item.id}}</td>
             <td class='col-md-4'><a {{on 'click' @select}}>{{@item.label}}</a></td>
             <td class='col-md-1'><a {{on 'click' @remove}}><span
                   class='glyphicon glyphicon-remove'
                   aria-hidden='true'
                 ></span></a></td>
             <td class='col-md-6'></td>
           </tr>
         </template>
       }
      ```

The delta between the two components is this:
```diff
-  const Row =
+  class Row extends Component {
    <template>
      <tr class={{if @isSelected 'danger'}}>
        <td class='col-md-1'>{{@item.id}}</td>
        <td class='col-md-4'><a {{on 'click' @select}}>{{@item.label}}</a></td>
        <td class='col-md-1'><a {{on 'click' @remove}}><span
              class='glyphicon glyphicon-remove'
              aria-hidden='true'
            ></span></a></td>
        <td class='col-md-6'></td>
      </tr>
-    </template>;
+    </template>
+  }
```

## Why?

When using TypeScript a question came up about the ergonomics of typing either of these components.

Here is what typing the template-only component looks like:

```ts
import { TOC } from '@ember/component/template-only';

interface Signature {
  Args: {
    item: { id: string; label: string };
    select: () => void;
    remove: () => void;
  }
}

const Row: TOC<Signature> = <template> ... </template>;
```

And here is what typing the class component looks like
```ts
interface Signature {
  Args: {
    item: { id: string; label: string };
    select: () => void;
    remove: () => void;
  }
}

// The Component was already imported from `@glimmer/component`
class Row extends Component<Signature> { ... };
```

This post isn't about the ergonomics of each of these, or which I prefer, but this is why I wanted to get actual hard data about the claims we've been hearing for years about template-only vs class-based.

_But!_ _having_ to make make a `const` for the default-export case, _is_ extra work, as you _must_ make a `const`. However, in a fully gjs/gts-using app, there does not need to be any default exports at as, as there would be no loose mode (classic, hbs files).
Using [gjs / gts in routes](https://github.com/discourse/ember-route-template), your regular component files with one export could look like:
```ts
// app/components/my-component.gts
export const MyComponent: TOC<Signature> = <template>...</template>;
```
and then imported:
```ts
import Route from 'ember-route-template';
import { MyComponent } from 'my-app/components/my-component';

export default Route(
  <template>
      <MyComponent>
          {{outlet}}
      </MyComponent>
  </template>
);
```


But anyway, getting back to answering the question I've yet to mention, 

> if someone prefers empty class components (which are linted against) for usage in TypeScript, is there anything they're missing out on by not using template-only components?

The tl;dr: is _yes_. But actual results will vary based on your actual app and use cases.

## _template-only components are 7-26% faster_

(for this particular benchmark and depending on which thing you're measuring).

As always, please test in your own apps. 
[Tracerbench](https://www.tracerbench.com/) is a statistically sound tool that uses [the built in performance.mark()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark) apis.

This does **not** mean that this is always going to be the case. There has been increased activity in work happening in the VM to speed things up. For example, one such option that is being investigated is avoiding destruction callbacks on class components if the class didn't implement a destruction method (as well as removing the parent node before runnig destruction on child nodes (this would improve rendering brand new content or navigating to a new page)). Also at the time of writing, there already exists a good number of perf-related PRs, if anyone is interested: [on the glimmer-vm repo](https://github.com/glimmerjs/glimmer-vm/pulls?q=is%3Apr+perf+)

For the js-framework-benchmark, here are the actual results.

![Image of the results (table below)](/images/template-only-vs-class-js-framework-benchmark/results.png)


And the table of the results here:

<style>
  /* override blog styles */
  .results__table td {
    background-image: none !important;
  }
  .results__table h3 {
    font-size: 1rem;
  }
  .results__table th {
    line-height: 1.25rem;
    text-transform: initial !important;
    max-width: 200px;
    font-weight: normal !important;
  }
  .results__table .benchname {
  }
  .results__table button {
    padding: 0;
    border: none;
    color: blue;
    display: block;
    background-color: unset;
  }
  .results__table .rowCount {
    word-wrap: break-word;
    white-space: break-spaces;
    line-height: 1.15rem;
    max-width: 200px;
    font-weight: normal;
    text-transform: initial;
  }
</style>
<table class="results__table" inert>
	<thead>
		<tr>
			<td class="description">
				<h3>Duration in milliseconds ± 95% confidence interval (Slowdown = Duration / Fastest)</h3>
			</td>
		</tr>
	</thead>
	<thead>
		<tr>
			<th class="benchname"><button class="button button__text ">Name</button><br>Duration for...</th>
			<th><a target="_blank" rel="noreferrer" href="https://emberjs.com/">template-only</a></th>
			<th><a target="_blank" rel="noreferrer" href="https://emberjs.com/">with classes</a></th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th class="benchname">
				<button class="button button__text ">create rows</button>
				<div class="rowCount">creating 1,000 rows (5 warmup runs).</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">87.1</span><span class="deviation">3.3</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(117, 196, 125); color: rgb(0, 0, 0);"><span class="mean">97.2</span><span class="deviation">2.3</span><br><span class="factor">(1.12)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">replace all rows</button>
				<div class="rowCount">updating all 1,000 rows (5 warmup runs).</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">107.9</span><span class="deviation">1.5</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(124, 198, 125); color: rgb(0, 0, 0);"><span class="mean">125.0</span><span class="deviation">2.0</span><br><span class="factor">(1.16)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">partial update</button>
				<div class="rowCount">updating every 10th row for 1,000 rows (3 warmup runs). 4 x CPU slowdown.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">27.2</span><span class="deviation">0.8</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(110, 194, 125); color: rgb(0, 0, 0);"><span class="mean">29.0</span><span class="deviation">1.3</span><br><span class="factor">(1.07)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">select row</button>
				<div class="rowCount">highlighting a selected row. (5 warmup runs). 4 x CPU slowdown.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">26.4</span><span class="deviation">0.5</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(131, 200, 126); color: rgb(0, 0, 0);"><span class="mean">31.8</span><span class="deviation">1.1</span><br><span class="factor">(1.21)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">swap rows</button>
				<div class="rowCount">swap 2 rows for table with 1,000 rows. (5 warmup runs). 4 x CPU slowdown.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">34.9</span><span class="deviation">1.5</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(112, 195, 125); color: rgb(0, 0, 0);"><span class="mean">37.8</span><span class="deviation">2.4</span><br><span class="factor">(1.08)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">remove row</button>
				<div class="rowCount">removing one row. (5 warmup runs). 2 x CPU slowdown.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">33.5</span><span class="deviation">1.3</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(116, 196, 125); color: rgb(0, 0, 0);"><span class="mean">37.2</span><span class="deviation">2.0</span><br><span class="factor">(1.11)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">create many rows</button>
				<div class="rowCount">creating 10,000 rows. (5 warmup runs with 1k rows).</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">808.8</span><span class="deviation">6.6</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(105, 193, 124); color: rgb(0, 0, 0);"><span class="mean">840.7</span><span class="deviation">8.5</span><br><span class="factor">(1.04)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">append rows to large table</button>
				<div class="rowCount">appending 1,000 to a table of 1,000 rows.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">107.2</span><span class="deviation">1.7</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(106, 193, 124); color: rgb(0, 0, 0);"><span class="mean">112.1</span><span class="deviation">1.9</span><br><span class="factor">(1.05)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">clear rows</button>
				<div class="rowCount">clearing a table with 1,000 rows. 4 x CPU slowdown. (5 warmup runs).</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">38.5</span><span class="deviation">1.3</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(139, 203, 126); color: rgb(0, 0, 0);"><span class="mean">48.3</span><span class="deviation">2.0</span><br><span class="factor">(1.26)</span></td>
		</tr>
		<tr>
			<th><button class="button button__text sort-key">weighted  geometric mean</button>of all factors in the table</th>
			<th style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);">1.00</th>
			<th style="background-color: rgb(116, 196, 125); color: rgb(0, 0, 0);">1.11</th>
		</tr>
	</tbody>
	<tbody>
		<tr>
			<th class="benchname">
				<button class="button button__text ">consistently interactive</button>
				<div class="rowCount">a pessimistic TTI - when the CPU and network are both definitely very idle. (no more CPU tasks over 50ms)</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">4,285.8</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">4,279.7</span><br><span class="factor">(1.00)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">total kilobyte weight</button>
				<div class="rowCount">network transfer cost (post-compression) of all the resources loaded into the page.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">573.1</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">573.1</span><br><span class="factor">(1.00)</span></td>
		</tr>
		<tr>
			<th><button class="button button__text "> geometric mean</button>of all factors in the table</th>
			<th style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);">1.00</th>
			<th style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);">1.00</th>
		</tr>
	</tbody>
	<thead>
		<tr>
			<td class="description">
				<h3>Memory allocation in MBs ± 95% confidence interval</h3>
			</td>
		</tr>
	</thead>
	<thead>
		<tr>
			<th class="benchname"><button class="button button__text ">Name</button></th>
			<th>template-only</th>
			<th>with classes</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th class="benchname">
				<button class="button button__text ">ready memory</button>
				<div class="rowCount">Memory usage after page load.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">6.8</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">6.8</span><br><span class="factor">(1.00)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">run memory</button>
				<div class="rowCount">Memory usage after adding 1,000 rows.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">13.8</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(110, 194, 125); color: rgb(0, 0, 0);"><span class="mean">14.7</span><br><span class="factor">(1.07)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">update every 10th row for 1k rows (5 cycles)</button>
				<div class="rowCount">Memory usage after clicking update every 10th row 5 times</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">13.8</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(110, 194, 125); color: rgb(0, 0, 0);"><span class="mean">14.8</span><br><span class="factor">(1.07)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">creating/clearing 1k rows (5 cycles)</button>
				<div class="rowCount">Memory usage after creating and clearing 1000 rows 5 times</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">8.1</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(107, 193, 124); color: rgb(0, 0, 0);"><span class="mean">8.6</span><br><span class="factor">(1.05)</span></td>
		</tr>
		<tr>
			<th class="benchname">
				<button class="button button__text ">run memory 10k</button>
				<div class="rowCount">Memory usage after adding 10,000 rows.</div>
			</th>
			<td style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);"><span class="mean">70.8</span><br><span class="factor">(1.00)</span></td>
			<td style="background-color: rgb(118, 196, 125); color: rgb(0, 0, 0);"><span class="mean">79.5</span><br><span class="factor">(1.12)</span></td>
		</tr>
		<tr>
			<th><button class="button button__text "> geometric mean</button>of all factors in the table</th>
			<th style="background-color: rgb(99, 191, 124); color: rgb(0, 0, 0);">1.00</th>
			<th style="background-color: rgb(109, 194, 125); color: rgb(0, 0, 0);">1.06</th>
		</tr>
	</tbody>
</table>


My system at the time of running the benchmark(s):
```bash
❯ google-chrome --version
Google Chrome 120.0.6099.109 

❯ uname -srp
Linux 6.2.0-39-generic x86_64


❯ lsb_release -csd
Ubuntu 23.04
lunar
```
info from `screenfetch`:
```
CPU: AMD Ryzen 9 7900X 12-Core @ 24x 4.7GHz
GPU: NVIDIA GeForce RTX 4080
RAM: <in use> / 63438MiB
```


---

---
title: Effects in Ember
image: /images/photo-1531574595918-cb77c99fe5e2.avif
imageMeta:
  attribution: Ethan Hoover 
  attributionLink: https://unsplash.com/photos/person-holding-fire-works-KkI9YpmO-mc 
featured: true
authors:
  - nullvoxpopuli
date: Fri Jun 7 2024 00:00:00 GMT-0500 (Eastern Standard Time)
tags:
  - ember
  - javascript
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


---

---
title: Where Do I Import X From
image: /images/photo-1517327236079-512484a512d7.avif
imageMeta:
  attribution: Tom Morel
  attributionLink: https://unsplash.com/photos/pathway-in-forest-8Q3Umbnr8DU
featured: true
authors:
  - nullvoxpopuli
date: Thu Jul 18 2024 11:14:31 GMT-0400 (Eastern Daylight Time)
tags:
  - ember 
  - javascript
---

# Where do I import the thing?


Ember has historically allowed access to everything in a global scope, like web-components. This proved confusing for developers, and Ember has moved to a more explicit, import-what-you-need approach, called "template-tag" -- more information on that [here, in the official guides](https://guides.emberjs.com/release/components/template-tag-format/).

A common thing I hear from folks is that they don't know where to import a component/modifier/helper from a particular addon, or maybe assume that because something isn't documented, they can't import the component/modifier/helper.

Good news:
_if it works in loose mode (the globals way)_, **the import is public API**.


Here is how you find them:

1. _open `node_modules/${libraryName}`_
    - if it doesn't exist, install `libraryName` / add to _your_ `package.json` 
2.  open the `package.json` of `libraryName`
    - does it have `exports`?
        - This _could_ look like this for types-providing projects:

            ```js 
            "exports": {
              ".": {
                "types": "./declarations/index.d.ts",
                "default": "./dist/index.js"
              },
              "./*": {
                "types": "./declarations/*.d.ts",
                "default": "./dist/*.js"
              },
              "./addon-main.js": "./addon-main.cjs"
            },
            ```
        - or it could look like this for non-types-providing projects 

            ```js 
            "exports": {
              ".": "./dist/index.js",
              "./*": "./dist/*.js",
              "./addon-main.js": "./addon-main.cjs"
            },
            ```

        Exports say if you import x from `library-name/${sub path specifier}`, the `exports` map will match to a file on disk. So you can look through the dist directory if `./*` is specified and see what all you can import. See [the docs](https://nodejs.org/api/packages.html#subpath-exports) for details.  
        For example, if you see a file in dist/components/foo.js (and given the above exports), you can import it at `library-name/components/foo`.  

        ----------------

        There is an intermediary step which _may_ or may not ever be relevant, due to how strongly folks follow conventions in with the library blueprints, but if there is an `ember-addon.app-js` key in the package.json -- this is the mapping of what is dumped in to the globals resolver, and is what is exposed to you pre-gjs/gts/template-tag. This config will looks something like this:  
        ```js
        "ember-addon": {
          "version": 2,
          "type": "addon",
          "main": "addon-main.cjs",
          "app-js": {
            "./components/foo.js": "./dist/some-other-folder/foo.js"
          }
        },
        ```
        In this scenario, instead of importing from `libraryName/components/foo`, you'd import from `libraryName/some-other-folder/foo`.  

        Once you find the file in `dist`, you're done.

  3. If the package.json you're looking at does not have an `exports` config, _and_ the library is an ember-addon (has `ember-addon` listed in `keywords`), this likely the older "v1 addon" format, which was convention-based, and didn't follow broader standards (as they didn't exist yet). _By convention_, you'll need to check the `app` folder for your components/modifiers/helpers, and see what those files define or re-export. You can then import what those files use.

    For example, if you find `app/components/foo.js` contains 
    
    ```js
    export { default } from 'libraryName/some-other-folder/foo'
    ``` 
    
    you can import from that same location. e.g.:
    
    ```js
    import theDefaultExport from 'libraryName/some-other-folder/foo';
    ```


This information is also available on the [ember-template-imports](https://github.com/ember-template-imports/ember-template-imports?tab=readme-ov-file#reference-import-external-helpers-modifiers-components) README.

## Don't know which library to start with?

you can find anything by searching in `node_modules`.

I like using [the_silver_searcher](https://github.com/ggreer/the_silver_searcher), but any search tool will work.

```bash 
❯ ag --unrestricted "<ResponsiveImage" --file-search-regex '.js$'
```

I use `--unrestricted` to search ignored files (`node_modules`), and `--file-search-regex` with `.js$`, because I want to exclude source-map files, `.js.map$` (I haven't learned how to read those).

So if I want to search for "ResponsiveImage" (a component that's used on this site), I don't get results in node_modules, but in my `dist` folder (my app's output) -- this means I need to try one of the other forms of which components can be referenced.

These are the possibilities for the direct name reference:
- `<PascalCase`, hoping that the component's JSDoc exists

    ```bash 
    ❯ ag --unrestricted "<ResponsiveImage" --file-search-regex '.js$'
    ```
- `class PascalCase` to find the file in JS 

    ```bash 
    ❯ ag --unrestricted "class ResponsiveImage" --file-search-regex '.js$'
    ```

But we can also search via file path:
- `kebab-case`
  
    ```bash 
    ❯ ag --unrestricted --filename-pattern 'responsive-image'
    ```

    using `--filename-pattern` allows us to search for file paths, and not the contents of the file. We might not know what is in a particular file.

  - or, if too many results, you can search with the extensions:
    - `kebab-case.js`
    - `kebab-case.ts`
    - `kebab-case.gjs`
    - `kebab-case.gts`
    - `kebab-case.hbs`
    - `kebab-case/index.js`
    - `kebab-case/index.ts`
    - `kebab-case/index.gjs`
    - `kebab-case/index.gts`
    - `kebab-case/index.hbs`

    All can be searched for all at once with this (which can still be far fewer results than with no extension):

    ```bash 
    ❯ ag --unrestricted --filename-pattern 'responsive-image(\/index)?\.(js|ts|hbs|gjs|gts)'
    ```


Feel like a lot of work to find which library something comes from? I think so, too.

This is why gjs/gts/template-tag is so nice, because you _just know_ exactly where something is coming from.

To try out gjs / `<template>` in your browser, check out this [interactive tutorial](https://tutorial.glimdown.com).


---

---
title: Design Systems in Ember
image: /images/clark-van-der-beken-P6jpTN3c8uY-unsplash.jpg
imageMeta:
  attribution: "Clark Van Der Beken"
  attributionLink: https://unsplash.com/photos/brown-concrete-building-P6jpTN3c8uY
featured: true
authors:
  - nullvoxpopuli
date: Thu Jan 16 2025 12:18:50 GMT-0500 (Eastern Standard Time)
tags:
  - ember
  - javascript
  - design
---

Design systems help you prototype apps faster, and focus on shipping, rather than re-inventing the wheel.

CSS frameworks a great way to start a project, but long-lived projects need interactivity to truly feel like an application. 

This post is a curation of libraries to help you get started with bootstrapping your app, or creating your own design system, so you don't need to go looking for things!
(and I'll try to keep it up to date as new libraries are published).

 
> NOTE: Some of what is in here is my opinion, and not necessarily representative of the opinions of others / groups I'm a member of. 


As of 2025, these are a good few maintained design systems, and here I've broken them up into some categories: 
The "Polaris" category can be used as a learning tool to see how folks should be writing ember _today_. 
There is "Pre-Polaris", which means that the design system is nearly Polaris, but missing one or two modern patterns to be considered Polaris.
Lastly, there is the "Needs Work" category, which is to concisely say that the design systems has a number of migrations to do before I would recommend someone look at the code for learning how to write modern Ember.

<style>
  /* blog theme uses the wrong default */
  p img {
    max-width: 100% !important;
  }
</style>

## Polaris 

- [Elastic EUI](https://github.com/prysmex/ember-eui/tree/master) » [Docs](https://ember-eui.vercel.app/) | [npm](https://www.npmjs.com/package/@ember-eui/core)

    ![screenshot of EUI](/images/design-systems/ember-eui.png)

    ```bash
    npm add @ember-eui/core 
    ```

    This design system from [Prysmex](https://www.prysmex.com/) is a fully modern, thorough, up to date design system.
    There are enough components to build whole products without creating any additional components.

- [Hokulea](https://github.com/hokulea/hokulea) » [Docs](https://hokulea.netlify.app/) | [npm](https://www.npmjs.com/package/@hokulea/ember) 

    ![screenshot of Hokulea](/images/design-systems/hokulea.png)

    ```bash
    npm add @hokulea/ember
    ```

    Hokulea is a fully modern _whimsical_ design system from [gossi](https://github.com/gossi) that demonstrates Storybook integration and workflows for documenting each component. This design system supports themeing, is research driven, and has enough components to build a real product without needing to write more components!

- [Frontile](https://github.com/josemarluedke/frontile) » [Docs](https://frontile.dev/) | [npm](https://www.npmjs.com/package/@frontile/buttons) 

    ![screenshot of Frontile](/images/design-systems/frontile.png)

    ```bash
    npm add @frontile/buttons @frontile/overlays # ... 
    ```

    This design system from [josemarluedke](https://github.com/josemarluedke) is a fully modern, thorough, up to date design system.
    There are enough components to build whole products without creating any additional components.

- [NRG UI](https://github.com/knoxville-utilities-board/nrg-ui) » [Docs](https://knoxville-utilities-board.github.io/nrg-ui/) | [npm](https://www.npmjs.com/package/@nrg-ui/core)

    ![screenshot of Frontile](/images/design-systems/nrg-ui.png)

    ```bash
    npm add @nrg-ui/core 
    ```

    This design system from the [Knoxville Utilities Board](https://www.kub.org/) is built on top of bootstrap5, utilizes Polaris patterns, and builds on top of a design system in plain CSS.
    There are enough components to build whole products without creating any additional components.

- [Carbon](https://github.com/IBM/carbon-components-ember) » [Docs](https://ibm.github.io/carbon-components-ember/) | [npm](https://www.npmjs.com/package/carbon-components-ember) 

    ![screenshot of Carbon](/images/design-systems/carbon.png)

    ```bash
    npm add carbon-components-ember
    ```

    This design system from [IBM](https://www.ibm.com/) is one of the more modern codebases, though, in poking around their documentation, I found a few CSS bugs. 
    They use TypeScript, gjs/gts, and the V2 Addon (native library) format.

## Pre-Polaris 

- [Helios](https://github.com/hashicorp/design-system) » [Docs](https://helios.hashicorp.design/) | [npm](https://www.npmjs.com/package/@hashicorp/design-system-components)

    ![screenshot of Helios](/images/design-systems/helios.png)
    
    ```bash
    npm add @hashicorp/design-system-components
    ```

    Helios is a design system by [Hashicorp](https://www.hashicorp.com/), so it is well funded and maintained, as well as made with influence from accessibility experts.
    However, my main critique is that it does not use the `gjs` or `gts` file format, making this design system "Pre-Polaris".

## Needs Work 

These are also "V1 Addons" -- which are node programs that your app runs during your app's build, and the node programs happen to emit browser JavaScript.
This is different from normal browser libraries (sometimes call "V2 Addons"), which are compiled when the library is published.

- [UI Kit](https://github.com/adfinis/ember-uikit) » [Docs](https://docs.adfinis.com/ember-uikit/) | [npm](https://www.npmjs.com/package/ember-uikit)

    ![screenshot of UI Kit](/images/design-systems/uikit.png)

    ```bash
    npm add ember-uikit
    ```

    This design system looks polished, but it provides no Types, is not a V2 Addon, and doesn't use any gjs or gts components -- however, this does not mean it's not a solid choice for bootstrapping a new project! If you're writing javascript, and don't want to read this design-system's code, this is a _fine_ option.


- [Bootstrap](https://www.ember-bootstrap.com/) » [Docs](https://www.ember-bootstrap.com/) | [npm](https://www.npmjs.com/package/ember-bootstrap)

    ![screenshot of Bootstrap](/images/design-systems/ember-bootstrap.png)

    ```bash
    npm add ember-bootstrap
    ```

    This library provides a good few interactive components where the [Bootstrap](https://getbootstrap.com/) CSS Framework would not be sufficient for building applications.
    This library is not a V2 Addon, does not use Types, and doesn't use any gjs or gts components.


- [Material Design](https://github.com/adopted-ember-addons/ember-paper) » [Docs](https://ember-paper.netlify.app/) | [npm](https://www.npmjs.com/package/ember-paper)

    ![screenshot of ember-paper](/images/design-systems/ember-paper.png)

    ```bash
    npm add ember-paper
    ```

    Material design is starting to look a little dated these days, but maintenance of this design system is still on-going. It provides no types, is not a V2 Addon, and doesn't use any gjs or gts components.



## Want to build your own?

Ember authors great ergonomics for creating design systems!

And to help build design systems _even_ faster, there a number of libraries that abstract away a lot of the menial things that you'd have to implement anyway on top of the platform (while deferring to the platform as often as possible ( as we all know: the best code is the code that isn't needed in the first place )) 

UI Primitives:
  - [ember-sortable](https://emberobserver.com/addons/ember-sortable) - primitives for sorting, drag & drop
  - [ember-primitives](https://ember-primitives.pages.dev/) - Styleless, Accessibility-focused primitives that help you build faster UIs. Not just components, but light/dark mode management, popover management, etc.
  - [ember-headless-table](https://github.com/CrowdStrike/ember-headless-table) - a plugin-based styleless way of building complex table UIs with sorting, column-reordering, etc
  - [ember-headless-form](https://github.com/CrowdStrike/ember-headless-form) - an Accessibility-focused way of taking the boilerplate out of highly-managed form experiences, including local errors, server errors, etc -- giving you the primitives, to expose powerful design-system forms with a great pit of success .
  - [ember-focus-trap](https://emberobserver.com/addons/ember-focus-trap) - element modifier for trapping focus within the element.

Utility Primitives:
  - [reactiveweb](https://reactive.nullvoxpopuli.com/) - low-level reactive utilities and reactive wrappers of common web APIs.
  - [ember-keyboard](https://emberobserver.com/addons/ember-keyboard) - easy key-combos.
  - [ember-concurrency](https://emberobserver.com/addons/ember-concurrency) - easy concurrent behaviors, prevent users from submitting forms multiple times.
  - [ember-statechart-component](https://github.com/NullVoxPopuli/ember-statechart-component) - Use XState statecharts as components, allowing easy drop-in diagram-based logic implementation.

Testing and Documentation:

  - [@ember/test-waiters](https://emberobserver.com/addons/@ember/test-waiters) - tie async-behaviors to the settled state system, so users have an easy time with tests (no wait-for, etc).
  - [ember-a11y-testing](https://emberobserver.com/addons/ember-a11y-testing) - Add AXE accessibility testing to your automated tests.
  - [@universal-ember/test-support](https://github.com/universal-ember/test-support) - Additional common test utilities to use on top of those provided from [`@ember/test-helpers`](https://github.com/emberjs/ember-test-helpers) or [`testing-library`](https://testing-library.com/docs/dom-testing-library/intro)
  - [Kolay](https://github.com/universal-ember/kolay) - a runtime-rendered documentation framework allowing easy documentation of design systems, component libraries, all in a familiar markdown format. 
      - This is pre-alpha right now, so unless you want to help fix bugs, you may be more interested in:
        - [Docfy](https://docfy.dev/) 
        - [field-guide](https://github.com/empress/field-guide) 

Build Tools:

  - [@responsive-image/ember](https://emberobserver.com/addons/@responsive-image/ember) automatically create responsive optimized images and fast page loads -- part of [responsive-image](https://github.com/simonihmig/responsive-image) 


Other:

  - [Shepherd](https://github.com/RobbieTheWagner/ember-shepherd) - guided walkthroughts for introducing users to things




---

---
title: Avoiding Lifecycle in Components
image: /images/jeremy-perkins-UgNjyPkphtU-unsplash.jpg
imageMeta:
  attribution: "Jeremy Perkins"
  attributionLink: https://unsplash.comje/photos/UgNjyPkphtU
featured: true
authors:
  - nullvoxpopuli
date: Fri Jul 30 2021 08:22:45 GMT-0400 (Eastern Daylight Time)
tags:
  - new
  - ember
  - architecture
---

# Avoiding Lifecycle in Components

This is mostly going to be about `did-insert`, `did-update`, etc, aka, the
[`@ember/render-modifiers`](https://github.com/emberjs/ember-render-modifiers).


_If you know of a pattern that you use the render-modifiers for and it feels awkward and is
not covered here, let me know_

I'm writing about this, because I don't think there has been any guidance published
on what to do. A long time ago
([10 months ago](https://github.com/emberjs/ember-render-modifiers/commit/c836f83901a9068e6e3897f54cf4b7b9aa69ede5#diff-b335630551682c19a781afebcf4d07bf978fb1f8ac04c6bf87428ed5106870f5)),
a warning was added to the top of the `@ember/render-modifiers` README explaining:

> The modifiers provided in this package are ideal for quickly migrating away from classic Ember components to Glimmer components, because they largely allow you to use the same lifecycle hook methods you've already written while attaching them to these modifiers. For example, a didInsertElement hook could be called by {{did-insert this.didInsertElement}} to ease your migration process.


> However, we strongly encourage you to take this opportunity to rethink your functionality rather than use these modifiers as a crutch. In many cases, classic lifecycle hooks like didInsertElement can be rewritten as custom modifiers that internalize functionality manipulating or generating state from a DOM element. Other times, you may find that a modifier is not the right fit for that logic at all, in which case it's worth revisiting the design to find a better pattern.


> Either way, we recommend using these modifiers with caution. They are very useful for quickly bridging the gap between classic components and Glimmer components, but they are still generally an anti-pattern. We recommend considering a custom modifier in most use-cases where you might want to reach for this package.


So yeah, there is kind of a lot to unpack there. _Especially_ since we haven't really had an
alternative to the data-side / non-dom-related-side of things for a long while. Throughout this post, there will be
bulleted lists showing the benefits of each alternative -- because I usually skim long posts with code,
and I'm sure others do as well -- bulleted lists stad out ;)

## Using a custom modifier

A custom modifier is good solution for when your behavior is tied to a particular DOM node
or DOM tree. It encapsulates the lifecycle of rendering in to one co-located space so that
it's easy to understand what code is responsible for what.

❌ Bad - setup and teardown are not grouped together
```hbs
<div
  {{did-insert this.setupResize}}
  {{did-update this.updateResize}}
  {{will-destroy this.teardownResize}}></div>
```
In addition, this pattern also encourages components that have multiple responsibilities.
The component that contains this setup/update/down for resize may also have other responsibilities,
like maybe it's also managing a form, or a table, or something.

✔️  Good - behavior is grouped
```hbs
<div {{resizable}}></div>
```
This pattern collects all the related behavior in to a semantically standalone thing, a _custom modifier_.
There are built in modifiers, and you may be familiar with them, as they're the only two modifiers
in ember right now (3.27 latest at the time of writing): `{{on}}` and `{{action}}`.

How would the JavaScript side of this look? In the first example, the code in a component may look something
like this:
```js
// app/components/my-component.js
export default class MyComponent extends Component {
  // ... component stuff ...

  @action setupResize() { /* ... */ }

  @action updateResize() {/* ... */}

  @action teardownResize() { /* ... */ }

  // ... component stuff ...
}
```

which looks fine in isolation, and if this were _all_ a component did, it would not be cause for too much alarm.
But as components grow, and folks add features to existing components, those 3 functions get crowded. Extracting
them to a custom modifier is a great way to focus on a component's core responsibilities.
That extracted JavaScript may look like this:

```js
// app/modifiers/resizable.js
import Modifier from 'ember-modifier';

export default class Resizable extends Modifier {
  didInstall() { /* original setup code */ }
  didUpdateArguments() { /* original update code */ }
  willDestroy() { /* original teardown code */ }
}
```

Benefits of the custom modifier
 - all element tied to a behavior is encapsulated in a single class
 - easier to keep track of cleanup
 - can be render-tested outside of the component where it is used
 - shareable among other elements
 - reads better when parsing the template with your eyes

## Using a local modifier

Sometimes you are not sure if your modifier needs to be globally accessible or you want to keep it to yourself
while you work out the kinks before shareing it with your team. Since Ember 3.25, you can assign modifiers,
helpers, and components to class properties on components to reference locally in your component.

For example, say you decided that the above `resizable` modifier wasn't ready to be shared with folks,
you could rearrange your files like so:
```diff
-app/components/my-component.hbs
-app/components/my-component.js
+app/components/my-component/index.hbs
+app/components/my-component/index.js
-app/modifiers/resizable.js
+app/components/my-component/resizable.js
```
Also note: we moved `my-component.{js,hbs}` to `my-component/index.{js,hbs}`, not because we had to, but because
it (to me) feels nicer to have a folder contain our "private-to-the-component" stuff.

In the `my-component/index.js`, you'll need to import and assign the modifier
```js
// app/components/my-component/index.js

import Resizable from './resizable';

export default class MyComponent extends Component {
  resizable = Resizable;

  // ... component stuff ...
}
```
```hbs
<div {{this.resizable}}></div>
```
It'll work the exact same is the previously globally available version.

Benefits of a local modifier
 - most of the benefits of a custom modifier
 - additionally, modifiers that are "specific to a thing", can be kept private~ish (as private as JS allows anyway)
 - allows for easier prototyping without interfering with the global pool of modifiers

## More information on modifiers

Modifier abstractions aren't yet adopted into the framework, but you can learn more here

- [ember-modifier](https://github.com/ember-modifier/ember-modifier)
  Lots of information in here about the philosophy and thought process about when to use a modifier.
- [RFC #757: Default Modifier Manager](https://github.com/emberjs/rfcs/pull/757)
  For using plain vanilla JavaScript functions as modifiers when used in the modifier position in template syntax.
- [RFC #416: Render Element Modifiers](https://github.com/emberjs/rfcs/pull/415)
  Original RFC detailing a transition path from old ember component lifecycle hooks

## Fetching data

❌ Bad - Modifier has nothing to do with the element.
```hbs
<div {{did-insert this.fetchData}} {{did-update this.fetchData @someArg}}></div>
```
This also requires that your component have a template -- provider components, for example, do not need a template.
Additionally, this means that data is eagerly fetched, so even if your component doesn't need the data right away,
that data-fetching slows down your time-to-settled.

✔️  Good - Data is reactively and lazyily fetched as it is needed via a Resource.
```js
import { trackedFunction } from 'ember-resources/util/function';
export default class MyComponent extends Component {
  data = trackedFunction(this, async () => {
    let response = await fetch(`url/${this.args.someArg}`);
    let json = await response.json();

    return json;
  });
}
```
```hbs
{{!-- when ready for use --}}
{{this.data.value}} will be the fetch's json
```
With this approach, no modifier is used and no element is needed. `data` will call your function when the `.value`
property is accessed, and it will "eventually" resolve to the returned `json` in the inner function.

There are a number of utilities in `ember-resources` for dealing with "Reactive async~ish" data a little nicer.
See the [README](https://github.com/nullVoxPopuli/ember-resources) over there for more details.

Benefits of using a Resource:
 - lazy, only runs when accessed
 - reactive, changes to tracked data will re-invoke the resource
 - everything is encapsulated, no need to worry about template <-> javascript communication
 - easily unit testable
 - can be used in vanilla JavaScript classes


✔️  Good - Data is lazily fetched after a user action 

This is probably the best case scenario for data loading, even though it is _non-reactive_.

```js
export default class MyComponent extends Component {
  @action
  async loadData() {
    let response = await fetch(`url/${this.args.someArg}`);
    let json = await response.json();

    return json;
  }

  @tracked data;

  @action 
  async handleClick() {
    this.data = await loadData();
    /* ... do something with data */
  }
}
```
```hbs
{{!-- when ready for use --}}
{{this.data}} will be the fetch's json
```

This is the most optimized that you can make a network request, and aligns with ember-data's new request manager usage recommendations.  Most notably, however, if `this.args.someArg` changes, the data will _not_ update, because data fetching was triggered by the user, not the autotracking system.

## Handling destruction

For this example, assume we have a  class constructor that we've bound some events to the window.
Maybe `beforeunload` (to protect against accidental refreshes while editing a form).

❌ Bad - Modifier has nothing to do with the element.
```hbs
<div {{will-destroy this.removeWindowListeners}}></div>
```
This sometimes has caused folks to add an invisible element _just so that they can use the modifier hook_.
We should not add more DOM than we absolutely need, and behavior setup in JS should be torn down in JS.

✔️  Good -- no modifiers needed
```hbs
{{!-- No element --}}
```

```js
import { registerDestructor } from '@ember/destroyable';

class MyComponent extends Component {
  constructor(owner, args) {
    super(owner, args);

    this.setupWindowListener();
    this.setupScrollListener();
  }

  @action setupWindowListener() {
    /* setup */
    window.addEventListener('beforeunload', this.handleUnload)

    registerDestructor(this, () => {
      /* teardown */
      window.removeEventListener('beforeunload', this.handleUnload)
    });
  }

  @action setupScrollListener() {
    /* setup */

    registerDestructor(this, () => { /* teardown */ });
  }
}
```

For `@glimmer/component`, there is also the [willDestroy](https://api.emberjs.com/ember/release/modules/@glimmer%2Fcomponent#willdestroy) hook,
but I'd argue that co-locating setup and teardown is better long-term, because in each setup-teardown pair,
you know exactly what conditions are needed to safely teardown. Keeping that grouped together can make maintenance
easier if or when you need several teardown steps for various things (maybe you setup a few listeners, a Mutation
Observer, other stuff).

Benefits of `@ember/destroyable`
 - co-locates setup+teardown
 - can be used anywhere, not just in ember constructs
 - eliminates the need for "willDestroy" hooks provided by a framework
 - can easily share combined sets of setup+teardown functions

Docs on [`@ember/destroyable`](https://api.emberjs.com/ember/release/modules/@ember%2Fdestroyable)

Related, if you find the registerDestructor setup/teardown dance a bit tiring, there is a utility library,
[ember-lifecycle-utils](https://github.com/NullVoxPopuli/ember-lifecycle-utils) which provides a utility to
allow you to eventually create concise apis like:
```js
class Hello {
  constructor() {
    useWindowEvent(this, 'click', this.handleClick);
    useWindowEvent(this, 'mouseenter', this.handleClick);
  }
}
```

## More info on Resources

- [Introducing @use](https://www.pzuraq.com/introducing-use/) by [pzuraq](https://www.pzuraq.com/)
- [ember-could-get-used-to-this](https://github.com/pzuraq/ember-could-get-used-to-this)
- [ember-resources](https://github.com/NullVoxPopuli/ember-resources)
  - note that ember-resources is inspired by pzuraq's work, and solves some of the common challenges
    that the ember-could-get-used-to-this' implementation faces:
    - Typescript support without wrapper no-op methods
      - No need for decorator (typescript can't augment types with decorators)
    - Custom Resources no longer need a magic 'value' property
    - Built in support for (async) functions and concurrency tasks

    Much thanks to pzuraq, because without ember-could-get-used-to-this, ember-resources would not have existed.

- [RFC 567: `@use` and Resources](https://github.com/emberjs/rfcs/pull/567)
  - Discussion that lead to a bunch of smaller RFCs and the implementation of ember-could-get-used-to-this


## Why even change how I write code at all?

You don't have to, that's up to you. One of the primary reasons `@ember/render-modifiers` was made as an
addon was so that it _didn't_ have to be part of the framework, and that individual projects and teams
could decide if it was the right fit for them. It's a very small package, so if it's only used in a few places,
bundle size isn't that much of a concern for the average app.



---



---



------------------------
# community-bloggers
------------------------
# 👋 Hello World!

I've decided it was long since past due to have a place I could
periodically post my thoughts in long-form.

I encourage you to expect very little, and check back even less.

If I happen to write something that isn't horrible, or especially
if it is horrible you can put me on blast on threads [(@runspired)](https://www.threads.net/@runspired/).


---

# Not Your Parent's EmberData

> How RequestManager flips the script on everything

---

EmberData's legacy [turns 18 this year](https://github.com/sproutcore/sproutcore/commit/f6248b1650a688a401cc6eea135fbe983e20cd12).

What is remarkable (besides a Javascript project surviving for this long) is how long the 
project lasted without any significant revisiting of its architecture before RequestManager
was added in 2023 for the 4.12 release.

Ok, that's not totally the truth. We paved the way to RequestManager years before, and began
the internal evolution that would allow for it with the
[RFC for identifiers](https://rfcs.emberjs.com/id/0403-ember-data-identifiers/) in 2018. 
But until RequestManager, much of the power that identifiers unlocked remained largely out 
of sight.

In this post, I want to walk through one of the key changes that comes with RequestManager
that highlights the advantages of the changing architecture, as well as tease a bit of what
is still to come: **All requests should use EmberData.**

But first, a short overview of the shift to RequestManager.

## What Changed

In the past, the request layer in EmberData was an abstraction hidden from the application
developer. Whether and when the store would decide to build and issue a request via an 
adapter vs resolve from cache was a bit of magic.

The good was that this allowed for a uniform, stable API for requesting data to work with.
The bad was that how to update the cache or invalidate it was a bit mysterious.. and at times
downright frustrating.

Regardless of whether you were experiencing the fun or the frustrating aspects of working
with the store, these interactions were *resource* centric: "find me this record", "query for
records matching X", "give me all records of this type", "save this record".

Consider the (simplified) signatures of the historical approach:

```ts
interface Store {
    findRecord(type: string, id: string): Promise<RecordInstance>;
    findAll(type: string): Promise<RecordInstance[]>;
    queryRecord(type: string, query: object): Promise<RecordInstance>;
    query(type: string, query: object): Promise<RecordInstance[]>;
}
```

Compared to the (again, simplified) signature of the new approach:

```ts
interface Result {
    request: FetchInit;
    response: Response;
    content: Document;
}

interface Store {
    request(options: FetchInit): Promise<Result>
}
```

These interfaces present a rough sketch of the shape of the change, take note these are not
the exact types 😅!

As its name implies: the RequestManager is instead *request* centric. Instead of answering
questions about specific records or types of records like we used to ask the store in the past, we ask it about the status of a specific request.

Ok, so how does this new API change how we build our applications?

## All Requests Should Use EmberData

> Me: If your application makes even one fetch request, your app should use EmberData.
> 
> Person 2: Wait, really?!
>
> Me: Yes. Really.
>
> Person 2: Explain...

I will sum up. Convert this:

```ts
class MyService {
  async queryData(query) {
    const response = await fetch(`/api/v1/company`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(query)
    });
    return await response.json();
  }
}

```

Into this:

```ts
class MyService {
    @service requestManager;

    async queryData(query) {
      const response = await this.requestManager.request({
        url: `/api/v1/company`,
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(query)
      });
      return response.content;
    }
}
```

Note, the above is the 1:1 conversion to keep things "exactly" as they were in your app, and as
it stands it already provides huge albeit hidden value. Below we will unpack that value and
then begin to iteratively migrate to unlock even more value.

Because of its history, there is a temptation to think of EmberData as a *resource centric*
library, along the lines of an ORM (or worse, a full fledged database).

But as we discussed in the last section, EmberData is now a *request centric* library. The
extent to which this is true goes far beyond just porting the requests that EmberData used to make magically via adapters into the new paradigm.

If you are doubting right now how EmberData being *request centric* means you should use it
for all your requests then first, I applaud you for your skepticism. It is invaluable to 
critically analyze the claims a library (or its author) makes.

Second, I feel you. 18 years of doing things one way is a *lot* of history, built context
and emotions to suddenly toss away. But before you head over to my [threads](https://www.threads.net/@runspired/) account 
to drag me for how bad a take this is, hear me out. Then please do so at your earliest 
convenience.

You probably fall into one of two camps:

  1. You use EmberData but you have requests for which you do not use it. If this is you then probably you are more willing to hear me out.
  2. You don't use EmberData – perhaps because you ripped it out of your app in a burning fit of passion, and you have no idea outside of either sick revenge or disaster porn why you are reading this post ... I don't know either but I hope you keep reading ... 

Those of you in the first camp, this will probably be an easier sell: you can drop usage of ember-ajax, jquery.ajax, ember-fetch and probably a dozen homegrown internal things you have and instead use a nice uniform interface for managing all manner of requests. I know that doesn't sway your skepticism that this is possible, but hopefully its at least a small carrot.

***But WHYyyyyyy?***

### Lets start with what you gained in this simple migration

I mentioned huge albeit hidden value.

The most basic answer is that RequestManager provides a simple, stable unified interface for 
how we request or mutate data. Developers that love EmberData historically have largely loved
it for this aspect. Yes, you still have to construct fetch requests, but we'll get to that 
part below in a moment.

A stable unified interface gives you three things.

First, an easier ability to refactor (by lots of different mechanisms).

Similarly – second, an easy integration point to make things happen universally when needed: whether a shared abstraction to reduce cognitive overhead or for implementing a sweeping API change that you can make feel like a tiny bump instead of a major rewrite.

Third, unified expectations of behavior.

In this code example we see all three of these things in play.

First, by unifying on the platform, it was quick to convert our standard fetch request into the request manager paradigm.

Second, we gained all the functionality of whatever handlers we registered for use. Most commonly, this will be the [Fetch Handler](https://github.com/emberjs/data/blob/5a48f52a08587e59cb529575577880daf678ae00/packages/request/src/fetch.ts).

This means that immediately our code example started handling a number of scenarios that it didn't before, despite no seeming change. Lets unpack what we get that we didn't have before. In no particular order:

- The fetch code is SSR ready
- We account for libraries like mirage that will try to dynamically swap out `fetch` for its own version
- A test waiter is automatically installed to help prevent leaky or flakey tests
- AbortController is automatically wired-in
- Streaming Responses are automatically prepared for
- Vague network level errors are converted into meaningful error objects
- The `date` header is autoset on the response if not already present to ensure the ability to check request age
- Responses that represent errors are converted into meaningful error objects
  - statusText is normalized for http1.1/2/3
  - the error message is set to a meaningful string that will be helpful to observability tooling (like Sentry) and avoids common pitfalls of errors being too similar
- the handling of parsing the response to JSON is done for you

Before this change, had our fetch request failed, the most likely
outcome in many applications would have been no error surfaced to
the application or to observability tooling like Sentry (because `fetch` always resolves), or a very confusing and poorly differentiated error
along the lines of `cannot parse token < at json line:0`.

And third, we gained expectations of behavior.

Everything that the Fetch handler does is something every developer 
otherwise must do each time individually. But often in the interests of time, terseness, overconfidence in network stability, or due to lack of awareness these things will not be done.

The value of an abstraction like EmberData is that it is able to reduce cognitive and implementation burden on product engineers for these sorts
of considerations, in many cases eliminating that burden entirely.

Whether or not you use EmberData to manage your requests doesn't change the fact that *they need managed*. Even just a single, relatively simple request has this need.

But the value doesn't end here. Lets take our migration further.

### Taking our Migration Even Further

Above we had refactored our service into what is copied again below:

```ts
class MyService {
    @service requestManager;

    async queryData(query) {
      const response = await this.requestManager.request({
        url: `/api/v1/company`,
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(query)
      });
      return response.content;
    }
}
```

It might have been invoked something like this:

```ts
class Route {
    @service myService;

    async model({ search, offset }) {
        const query = {
            search,
            sort: 'name:asc',
            limit: 50,
            offset: Number(offset)
        };
        const data = await this.myService.queryData(query);

        return {
            search,
            offset,
            data
        };
    }
}
```

This service is doing three things for us:

1. choosing the url
2. generating the fetch options
3. ensuring a json response

Lets start by refactoring it to make use of the RequestManager's encouraged
pattern of builders and handlers.

> Builders setup requests, they are functions that may understand the app state and context in which a request is being generated
>
> Handlers help to fulfill requests, by processing requests or responses in ways that are broadly applicable

In our current service, everything within the call to `request` is something that is immediately a candidate for a builder or a handler.

Lets write just a builder for today. Generally we name builders to follow the natural
meaning of what the request being constructed is intended to do.

```ts
export function queryData(query, resourcePath) {
    return {
        url: `/api/v1/${resourcePath}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    }
}
```

That makes our service now look like this:

```ts
import { queryData } from './builders';

class MyService {
    @service requestManager;

    async queryData(query) {
      const response = await this.requestManager.request(
        queryData(query, 'company')
      );
      return response.content;
    }
}

```

At which point we realize this custom fetch-wrapping service is no longer useful.

Lets delete it and use RequestManager directly.

```diff
+import { queryData } from './builders';
+
class Route {
-    @service myService;
+    @service requestManager;

    async model({ search, offset }) {
-        const query = {
+        const query = queryData({
            search,
            sort: 'name:asc',
            limit: 50,
            offset: Number(offset)
-        };
+        }, 'company');
-        const data = await this.myService.queryData(query);
+        const result = await this.requestManager.request(query);

        return {
            search,
            offset,
-            data
+            data: result.content
        };
    }
 }
```

Which results in:

```ts
import { dataQuery } from './builders';

class Route {
    @service requestManager;

    async model({ search, offset }) {
        const query = dataQuery({
            search,
            sort: 'name:asc',
            limit: 50,
            offset: Number(offset)
        }, 'company');
        const result = await this.requestManager.request(query);

        return {
            search,
            offset,
            data: result.content
        };
    }
}
```

While very slightly more verbose, this is immediately better than the custom service we had
before in a bunch of ways.

Now the developer knows this is a managed request instead of that context being hidden
behind the extra service, so it level sets expectations of what they can expect to need
to do.

The developer also now gets direct access to the response of the request, which gives them access
to the wired-in AbortController, additional request and response information, and the ability
to stream the response if they choose. Our wrapper while useful was previously discarding the capabilities from being accessible to the developer. "Use the platform" has a friend: "Use the framework". These things feel invisible, but they are there ready for when they are needed, no workarounds necessary.

### Incrementally Migrating With Builders

Finally, we've now introduced a very nifty refactoring nicety. When we had our custom service, had we wanted to migrate the requests to use a new API we had three choices available.

1. We could have migrated all requests simultaneously
2. We could have introduced an overload to the method to take in whether or not to use the updated API
3. We could have added an additional method name. E.g. `queryDataV2`.

The trouble with (1) is it carries inherent risk for anything but small apps. The trouble with (2) is that you quickly grow the cognitive and implementation complexity of your method.
The trouble with (3) is that if you don't choose a good name, you introduce even more cognitive complexity, and even if you do choose a good name the odds are that the original method name is both easier to remember, faster to autocomplete, and intuitively preferred.

We've all been there with (3). Naming things is hard, and teaching folks to migrate their habits is too.

The neat thing about RequestManager is that its a simple chain-of-command executor. It doesn't care much about what your requests are, just that it can execute them. It is *interface* driven instead of imperative. Thus we remove the complexity attached to the method name and signature, replacing it instead with an interface that rarely if ever will change.

Which means our refactor still may take three forms, but the change looks different.

1. We could update the existing builder to migrate all requests simultaneously
2. We could change the builder signature to have an options argument to which we pass the version
3. We could implement a whole new builder.

Which answer is best for you will vary. In my app at work I have three API migrations planned for the year that utilize builders in their migration strategy.

The first will migrate all requests simultaneously. It is simply updating the underlying format in a way that won't be product affecting.

The second will migrate requests incrementally to a new format, it is updating the underlying transfer format in a way that affects product code, but not changing the overall semantics of the API. For this I have considered passing in an option to the builder, but I am more likely to take the new-builder approach as it makes tracking the status of the incremental migration with static analysis much easier. Either approach is very valid.

The third will migrate requests to a new API version that changes semantics significantly. This is a high risk migration, and so I will use a completely new builder.

With this in mind, lets iterate on the builder we have in our example above and show how this pattern provides value. First, by refactoring in a way that doesn't result in a product code change, then in one which does.

As a reminder, this was where we left off with our builder before:

```ts
export function queryData(query, resourcePath) {
    return {
        url: `/api/v1/${resourcePath}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    }
}
```

The first thing we probably want to do is have our builder respect a configurable default host
and namespace. This prepares us for our site and API not being on the same domain (a decision you do not want to have to piecemeal figure out how to account for later).

EmberData provides users a global config mechanism for host and namespace. Typically you will want to do this either in your store file or app file.

```ts
import { setBuildURLConfig } from '@ember-data/request-utils';

setBuildURLConfig({
  host: 'https://api.example.com', // no trailing slash, though '/' is valid
  namespace: 'api/v1', // no leading slash and again no trailing slash
});
```

What this does is set the default host and namespace for use by the request-utils package,
which provides a number of utility methods for constructing builders.

Next, lets update our builder to make use of this:

```ts
import { buildBaseURL } from '@ember-data/request-utils';

export function queryData(query, resourcePath) {
    return {
        url: buildBaseURL({ resourcePath }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    }
}
```

> Note: the signature of what is passed to buildBaseURL is simpler above than in the current
> EmberData 5.3 release, and reflects updates that relaxed the signature which will be in 5.4

Awesome! Now we are ready for deployment to CDNs! Or maybe your application is single-tenant
and has a per-customer api domain that needs to be configured globally, easy-peasy. This can all be handled without the product code needing to be changed or consider it.

Now lets say we want this request builder to build requests that are *also* able to be cached when using EmberData's CacheHandler?

For that, we need a cacheKey, and for good measure an op-code (some op-codes are special –this one is not– but I will explain more about op-codes in another post) as well as an identifier.

```ts
import { buildBaseURL, buildQueryParams } from '@ember-data/request-utils';

export function queryData(query, resourcePath) {
    const url = buildBaseURL({ resourcePath });
    const queryData = structuredClone(query);
    const key = `${url}?${buildQueryParams(queryData)}`;

    return {
        url,
        op: 'query',
        identifier: { type: resourcePath },
        cacheOptions: { key },
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    }
}
```

> Note: whether resourcePath and identifier.type match is API specific, in many APIs they do, in equally many they do not. A simple mapping function is useful if they do not.

Ok so what all did we do here?

First, we add `op: 'query'`, which is a hint to the CacheHandler about how to treat this request. Then we added `identifier: { type: resourcePath },` which will hint to it the
primary resource type this request pertains to, which is useful for many cache invalidation strategies. There are additional properties that may be added if desired for that reason, I won't go into them all here.

Finally, we activated caching and told it the key to use. This was important because by default the CacheHandler will only cache GET requests with a url by their url, but we want
to use POST as QUERY here. If we blindly used the URL we would have a bug in our application.

So we serialize the query to be part of the cache-key, and we do this using the `buildQueryParams` utility. This utility performs a bit of wizardy to produce a stable key.

In case you didn't know `JSON.stringify({ a: '1', b: '2' })` is not the same as `JSON.stringify({ b: '2', a: '1' })`. Key insertion order is respected during JSON serialization. However, this is rarely useful for creating a cache-key because objects are often dynamically generated. What we care about is whether they have a (deep) equivalent value, which this function helps us to achieve in more cases. Yet another thing where an annoying and complicated problem vanishes with a good framework and good infra.

What if you don't want to trust serializing the query like this to get a cache-key? Use any string key you would like, just make sure that its uniqueness validly describes the query.

The reasons for why this is so important will go into my next post which will dive into caching.

#### Migrations That Affect Product

Lets say we wanted to change our API from using ActiveModel to using JSON:API as its format. The response in both cases is JSON but the shape is very different. How would
we handle this with builders? For this exercise, lets assume the API version stays the
same and the new format is controlled by JSON:API's expected header.

> Note: We are glossing over that JSON:API doesn't have a post-as-query capability in
> the spec, most real-world implementations still implement it. Here we care only about
> updating headers to get the new API response format, no other changes in API semantics.

For this I would write a new builder. I would start by copying the original, and then
adjust the headers as desired. I would also account for the format in the cache-key
because it is something that affects the response but is not captured by the URL itself.

```diff
import { buildBaseURL, buildQueryParams } from '@ember-data/request-utils';

export function queryData(query, resourcePath) {
    const url = buildBaseURL({ resourcePath });
    const queryData = structuredClone(query);
-    const key = `${url}?${buildQueryParams(queryData)}`;
+    const key = `[JSON:API]${url}?${buildQueryParams(queryData)}`;

    return {
        url,
        op: 'query',
        identifier: { type: resourcePath },
        cacheOptions: { key },
        method: 'POST',
        headers: {
+            'Accepts': 'application/vnd.api+json',
-            'Content-Type': 'application/json'
+            'Content-Type': 'application/vnd.api+json'
        },
        body: JSON.stringify(query)
    }
 }
```

Now lets migrate our product code usage:

```diff
-import { dataQuery } from './builders';
+import { dataQuery } from './builders-v2';

class Route {
    @service requestManager;

    async model({ search, offset }) {
        const query = dataQuery({
            search,
            sort: 'name:asc',
            limit: 50,
            offset: Number(offset)
        }, 'company');
        const result = await this.requestManager.request(query);

        return {
            search,
            offset,
            data: result.content
        };
    }
 }
```

Obviously we will then need to make additional changes to our code to account for the changed json shape, but our request code is stable, our migration state is easy to statically analyze, and our brain doesn't hate any weirdly named methods.

Of note: if you were using EmberData's Store here and not just the RequestManager, you
would not need to migrate code using `result.content` as that would already be
record instances!

The only difference in code to have seamlessly absorbed such a major migration would be this!

```diff
import { dataQuery } from './builders-v2';

class Route {
-    @service requestManager;
+    @service store;

    async model({ search, offset }) {
        const query = dataQuery({
            search,
            sort: 'name:asc',
            limit: 50,
            offset: Number(offset)
        }, 'company');
-        const result = await this.requestManager.request(query);
+        const result = await this.store.request(query);

        return {
            search,
            offset,
            data: result.content
        };
    }
 }
```


### Where To From Here?

Builders and RequestManager are but the first stepping stone in what promises to be a big evolution in how you manage querying and mutating data in your application.

We see the future as one that is schema and spec driven. Specs describe API endpoints and explain how they operate on the resources your schemas describe. This information then feeds
into tooling to automatically produce your API mocks for tests, eliminates Models, provides
strong end-to-end typing guarantees, and allows lint and runtime verification of query validity.

The hints of this are already throughought the EmberData codebase. Alpha versions of ideas like the request mocking library (which can do things no other mocking library does due to RequestManager) are under construction and even being used by the library's own test suite to dogfood their development.

All this to say, we think builders will end up a typechecked, typed response thing that for
most apps looks a bit like this for the example we've been using.

```ts
import { dataQuery } from './builders';
import { aql } from '@warp-drive/aql';

class Route {
    @service requestManager;

    async model({ search, offset }) {
        const result = await this.requestManager.request(aql`
          QUERY company {
            data {}
            filter {
              @arg search = ${search}
            }
            sort [
                name = "asc"
            ]
            page {
                @arg offset = ${Number(offset)}
                limit = 50
            }
          }
        `);

        return {
            search,
            offset,
            data: result.content
        };
    }
}
```

With benefits that stretch for miles beyond the simplicity of the interface.


---

---
title: Not Your Parent's EmberData (part 2)
published: true
draft: true
---

> **warning**
> This blog post is currently a **DRAFT**

# Not Your Parent's EmberData (part 2)

> This is Part 2 of a series exploring architectural decisions within EmberData. If you
> haven't read [Part 1](./2024-01-31-modern-ember-data.md), you should read that first.

So every request should be handled by EmberData. Now what?

The RequestManager shifted interaction with EmberData from being *resource centric* to
being *request centric*. However, this does not mean that EmberData stopped caring about
resources. Far from it.

The way to think about this shift is "yes, and".

Does EmberData still care about resources? Yes, and it now cares about requests.

Does EmberData still allow you to model those resources? Yes, and it provides greater
flexibility now in how to do so.

Our goal with this architectural change was to unlock power, flexibility and composability.
That goal is not achievable if the result is somehow not powerful enough, not flexible
enough, or not composable enough to support the historical feature set.

In this post, we're going to dive into several key differences in behavior and reliability

## Data Integrity

I mentioned in Part 1 that the redesign of EmberData really began in earnest with changes
to the cache. In particular, the introduction of Identifiers ([RFC#403](https://rfcs.emberjs.com/id/0403-ember-data-identifiers/)).

Identifiers are objects containing a property with a value that is a globally unique
string used to address a resource, document or request. (Note: request identity and document
identity are 1:1).

```ts
interface Identifier {
    lid: string; // the value of lid is globally unique
}
```

For a given `lid` and store instance, the object wrapper around the `lid` is given a
guarantee of stability. What this allows is for identities to serve as keys in any form
of storage: `Map` or `Set` (which allow objects or string keys) as well as `WeakMap`,
`WeakSet` and `WeakRef` which only allow object keys. This stability is managed by
the IdentifierCache.

Unlike most things in the cache, and even though they *look* like JSON:API resource
identifiers, identifiers are the only cache data that doesn't come directly from your
API. Instead, raw data in the form of resources or requests is presented to the
IdentifierCache to identify. If the data's identity is not already known, the cache
utilizes user supplied hooks to generate the appropriate identity.

It is this design decision that allows EmberData to work with any data format.
The hooks have defaults that work well enough in the general case that few folks have
ever needed to implement them, but if you were implementing your own cache and your
cache data format weren't JSON:API, it is likely you would want to configure these.

For instance, if your resources used `urn` as their primary key instead of JSON:API's
compound key (`id` and `type`) you might implement the hook like so:

```ts
import { setIdentifierGenerationMethod } from '@ember-data/store';

setIdentifierGenerationMethod((data, bucket) => {
    switch (bucket) {
        case 'record':
            return data.urn;
        case 'document':
            // handle requests
    }
});
```



In order to safely and accurately maintain a cache, you need to be able to consistently 
and accurately determine identity (cache-keys) for the content the goes into that cache.
In the case of a library like EmberData, that need extends beyond a simple mapping
between a key and its associated resource data.

Relationships are one example of this need. Relationships are links between two potential
cache-keys. Either or both sides of the relationship may not have loaded resource data 
yet, and so we need to trust that we have a cache-key that correctly points to where that 
data would be placed in the future.

We also have to be able to store any relationship information we receive from other 
resources for a resource that has not been loaded yet key'd to the same cache-key.

EmberData being very good at this cache-key management for graphs of resources has
been fundamental to its value proposition. This capability is what allows EmberData to 
seamlessly merge together the data from multiple requests, and allows it to quickly
ensure that wherever the same resource is referenced the same object reference is handed
out to you.

It is even at the heart of how structural polymorphism works in EmberData. In a basic 
sense, polymorphism is when one resource might acts as though it has multiple identities,
but has only one true cache-key. 

I'll dive more into how the Graph and Polymorphism each works with identity in future posts.

In this post, I want to explain one thing we got *wrong* with resource identity in the
many years before RequestManager, and how RequestManager not only fixes that mistake but
in doing so improves the reliability of the cache.

## Until RequestManager, the Resource CacheKey was the Request CacheKey.

A key insight in the development of both Identifiers *and* the RequestManager was that
to be *powerful*, *flexible* and *composable* our core architecture needed to be 
*lossless* about how it handled data it received.

It is always ok for a developer to decide that certain information is not relevant to
what they need from request. For instance, response headers, or extra top-level meta 
properties on JSON in the response body. But it is *never* ok for your data library to 
assume that for you.

But in a *resource centric* world this is exactly what happens. The body is extracted
from the response, and the rest of it is discarded. Then the resources are extracted
from the body, and anything that is not a resource is discarded.

Even assuming that there is no loss to individual resource data (hint, there often is 
in this design), this *loses* tons of valuable information the request contains: headers, 
meta, order, and which associations were included are all among the pieces of information
discarded.

Fundamentally, being lossy was what was wrong with this core EmberData API the most:

```ts
class Store {
    findRecord(type: string, id: string, params: object): Promise<RecordInstance>;
}
```

`findRecord` is a lossy API because we have no idea whether we resolved from cache or 
network, and no access any returned information that wasn't on the resource.

Moreover, as a design principle, ***lossless* applies equally to the intent of a request
as it does to specific handling of the information received from your API.**

### Lossless Intent

`findRecord` as an API is also an example of lossy intent. Consider the below example:

```ts
const user = await store.findRecord('user', '1', {
  include: ['friends', 'company', 'pets']
});
```

While not immediately evident, this example highlights the mistake made in handling
identity by the older *resource centric* design and is one of many reasons why lossy
APIs are being phased out of EmberData.

To the reader, the intent of this request might seem to be clear: "fetch the user
resource with ID 1 and make sure to also fetch that user's friends, company and pets".

Except that isn't what happens in a *resource centric* library. Instead, the steps
go like this:

1. determine the cache-key for the resource of type `user` and id `'1'`
2. check if we have loaded the resource for that cache-key.
3. if so, resolve the resource from the cache. If not, fetch the resource.
4. return the record for this resource

*Did you catch the mistake?*

In the *resource centric* world the resource cache-key is the same as the request
cache-key. Information like `include` isn't part of the cache-key determination.

Could we make it part of the cache-key determination? Not naturally. The contract
between the store and adapters is pretty simple. For `findRecord` there are three
methods that are a part of this contract:

```ts
interface Adapter {
    shouldReloadRecord?(store: Store, snapshot: Snapshot): boolean;
    shouldBackgroundReloadRecord?(store: Store, snapshot: Snapshot): boolean;
    
    findRecord(store: Store, schema: Schema, id: string, snapshot: Snapshot): Promise<JSON>;
}
```

It has always been possible albeit extremely unergonomic for an application to implement
`shouldReloadRecord` and `shouldBackgroundReloadRecord` in a way that would have taken into
account additional information like includes. But it solves *only* findRecord and not 
relationship or query requests, and it only solves them for a very narrow view of what
and how someone might want to issue a request.

More importantly, it means that there is nothing EmberData could do to more generally handle
requests efficiently. Without a cache-key, there is no request de-duping, no request updating,
no request caching. The list goes on and on, and we will dive into some of the upcoming features
of EmberData latter in this post that are unlocked by fixing this mistake.

So even while for many requests the cache-key for the resource and the cache-key for the request
to get that resource might be 1:1, the inumerable scenarios where this is not the case meant
that combining these things leads to an untrusted cache.

To recap: with the above call to `findRecord`, if we were to resolve from cache there is no
guarantee that the requested includes are also available. Loss of intent immediately results in 
a loss of trust.

The solution for many apps has been `reload`.

```ts
const user = await store.findRecord(
    'user', '1',
    { include: ['friends'] },
    { reload: true }
);
```

`reload: true` is a poison pill in apps. Once you need it, you start needing it everywhere.
There's still value in a cache even when you trust the cache so little that every request is
sent to network like this results in, which is perhaps its own intersting blog post sometime
to delve into, but suffice it to say this greatly diminishes the value of using the library.

These shortcomings are why the `query` and `queryRecord` methods on store **always** hit 
network. Without a cache-key for the request and a request cache using it there's no ability
to do anything but. Users have often added their own cache in front of these methods to try
to account for it with application specific cache-keys, but it rightfully feels like something
the store should just do for you. **And now it does!**

So Now What?

## Request Cache-Keys

In Part 1 we worked on this builder:

```ts
import { buildBaseURL, buildQueryParams } from '@ember-data/request-utils';

export function queryData(query, resourcePath) {
    const url = buildBaseURL({ resourcePath });
    const queryData = structuredClone(query);
    const key = `${url}?${buildQueryParams(queryData)}`;

    return {
        url,
        op: 'query',
        identifier: { type: resourcePath },
        cacheOptions: { key },
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    }
}
```

At the time I mentioned that `op` and `identifier` were two pieces of meta that we could
use to help manage cache lifetimes, and that we would use the `key` set on `cacheOptions`
as the key for the request.

When using store's CacheHandler, if no `cacheOptions.key` is present AND the request is a GET
request and has a URL, the URL will be used as the cache-key. Using the url as the cache-key
in this way is powerful, because not only is it *usually* 1:1 with a request, it also *usually*
captures all the state necessary to consider whether two requests are the same. By embracing
the URL, urls used for relationships and pagination become first class mechanisms of identity
capable of driving powerful features EmberData was missing before.

There are of course always exceptions though and this is why request identity is designed to
be flexible. In addition to `cacheOptions.key` and the abstraction that builders provide
for auto-generating cache-keys, EmberData provides a configuration hook for advanced use cases
I won't get into here that enables configuration of how EmberData looks to determine identity
in a request by default.

A final note before we dive into how this key gets used: EmberData considers the identity of
the request to be the same as the identity of the document (the response body) that request
results in. This is useful to be aware of because some API designs allow such documents to
be embedded within the response of a different request.

For example, in JSON:API, if a resource relationship specifies a "self" link, that self link
is a url that would have produced exactly the same response body as the resource relationship
object. This means a cache could use that information to update existing requests or use new
requests to update existing relationships even without necessarily knowing the exact resource
that relationship is attached to, or ever loading it.

Alright, so thats what request cache-keys are, so what all does this key do?

### How Request Cache-Keys are Used



### Creating Effective Request Cache-Keys

### Where To From Here?


---

# Web Reflections

I recently came back upon this 2017 blog post from Tom Dale considering whether [compilers are the new frameworks](https://tomdale.net/2017/09/compilers-are-the-new-frameworks/). If you haven't read it, its short, I recommend doing so and before popping back over here to continue.

A few of his points:
- We’ve reached the point of diminishing returns on improving runtime JS performance
- We'll transpile, compile and minify *even more* as time goes on
- JS (in 2017) is about to have the building blocks for new app paradigms: WebAssembly, SharedArrayBuffer, Atomics, etc
- To predict the future of the web, look at what high-performance native systems do
- This will lead to better performance and bundle size

What is fun about a post like this, now seven years old, is we can see the results of those predictions and insights.

In my opinion, Tom was about 90% right on how things were going to evolve, but way off on the conclusion of it leading to a better more performant web.

The investment in compilers and tooling pipelines has largely not led to a reduction in bytes sent to the browser, but an increase. Performance hasn't improved from the move to compilation, and its maybe decreased.

In fact, the bigger your toolchain for compilation the more likely it has become that you ship more JS than you should. Why did this happen? And was this outcome forseeable? I think it was, and I think three things were at play that Tom didn't seem to consider:

### 1. Human Factors

We tend to get what we want, and what we want is generally to ship features and product. More powerful toolchains allowing app sizes to scale with the size of the product and team just meant we could ship more features and product.

This is basically the same observation that even while CPUs have gotten more powerful our programs seem to be slowing down. These tools and compilers can result in better performance, but only if we *don't look at the new space in the budget and immediately overspend it.*

### 2. The Platform

Looking back now, its evident the platform had not stopped evolving, and the performance and bundle size impact of many newer platform APIs is not only massive, but significantly larger than a compiler could ever achieve.

Animations are really great example of this. The APIs for WebAnimations, ViewTransitions and generators together replaced the need for the animation libraries that previously were among our largest dependencies.

There's an important lesson here: *No compiler can beat shipping zero-bytes.*

> No compiler can beat shipping zero-bytes

The examples of this sort of platform win are everywhere: CSS layers, variables, advanced selectors, improved media query capabilities. Each of these replaced JS-runtime or CSS-compiler based solutions that had high runtime or bundlesize costs.

These wins happened even at the language level: browsers finally implemented generator functions, fields, and private fields natively. Currently they've started implementation of decorators and accessors. These have played a massive role in reducing the amount of bytes we need to ship in addition to generally being faster implementations.

And at the JS SDK Level: 10 different implementations of UUID in your bundle? Use crypto.randomUUID. A lot of logic to diff arrays and sets? There are APIs for unions, intersections, and more now.

I work on an SPA that is over 12 years old. More often than not when I'm refactoring something it looks like deleting a lot of code and replacing it with a simpler, smaller platform API.

So to sum up, I think betting on compilers has done much less than betting on the platform. And personally I believe there are still a lot of gains to be had in that area!

Maybe Tom was right though, and maybe we've done exactly as he thought we should: *we looked at what made high-performance native code great, and realized it was the platform.*

### 3. Complexity

There's a key point missing in Tom's post. A point I think was able to be seen then, and even addressed then but was nonetheless missed. A point that I think the web community as a whole missed for the better part of a decade: *If you want faster apps, reduce their complexity.*

> If you want faster apps, reduce their complexity.

Tom's ideas mostly related to how to optimize complexity that already exists: but in the same way that no compiler can ever beat shipping 0 bytes, no compiler can optimize a for-loop to be faster than no-loop (unless of course for the case where the loop has no outputs and can just be safely deleted).

This incidentally has been where my own chips have been pushed. Complex frontend JavaScript apps are just a symptom of an underlying disease: JS is not the problem.

I think a lot of our performance issues trace back to poor architectural decisions around how we model, retrieve, transform and mutate state. I don't just mean within apps either: there's been a huge failure of imagination when it comes to designing API Frameworks and formats.

It's amazing how we'll spend hours fighting over which framework renders a component millionths of a second faster, and then dump in a MB of JSON we've given almost no thought to the shape of without a care in the world, probably in a waterfall pattern.

The rise of RSCs, HTMX, Qwik, LiveWire and (to a lesser extent) Astro are in my mind at least in part a reaction to realizing that the performance issue wasn't actually a JS issue but a data issue.

So too are the many local-first DB offerings like Replicache: they just went the other way on the same problem and decided "if we're sending it all there anyway, why not just keep it there".

But in my opinion these choices are too often trying to sidestep the problem without really solving it. This does not make these bad solutions or bad tools in any way, some of them I even think are amazing and will shape the architecture of apps for the next decade in a positive way. But this does mean there's more out there for us to work to solve still.

### Compilers Are OK

Don't mistake this for a screed against compilers. I think compilers are doing amazing things and will continue to play a critical role in the evolution of the web. Its a mistake though to think we can compile away all our problems or to treat them as the panacea for performance.

So here’s my advice for anyone who wants to make a dent in the future of web development: invest in the platform, and be thoughtful in your data design.


---

---
title: Polaris | What I'm Working On
published: true
---

# Polaris: What I'm Working On

You'd think being on a core team (emberjs) I'd know what other core team members are exploring, but the reality is often I know just as much as the next person about where other team members have wandered off to poke and prod. So it was refreshing to read [Yehuda's blog post](https://yehudakatz.com/2024/10/28/polaris-what-im-working-on/) covering his recent meanderings, and I figured I'd add my own musings to the mix.

## Shipping ember-data 4.13

Polaris isn't a version, its a concept. A set of APIs, paradigms, and patterns that flow together cohesively. If it were just a point-in-time version what I'm going to say next would be *really strange*.

I've been working hard on shipping the Polaris story for [ember-data v4](https://github.com/emberjs/data/pull/9598). Yes, V4 - the prior major cycle that ended 20 months ago.

As we've worked to evolve EmberData into WarpDrive in the 5.x cycle we've been keeping a steady flow of improvements into 4.12 to attempt to maintain enough alignment that apps can make the jump seamlessly.

But two of the biggest improvements in the 5.x cycle (namely types and vite support) couldn't be easily backported: and because they couldn't be backported it was getting exponentially harder to backport fixes and improvements to the cache, schema service, and request-manager needed to enable applications using 4.12 to be compatible with SchemaRecord and the full feature suite offered by `@warp-drive/ember`.

We want apps stuck in 4.x to be able to use as many Polaris idioms as possible, being able to do so makes the upgrade path and adoption process simpler, and it gives extended breathing room to larger apps that need more time to upgrade.

And so, we have reactivated the v4 release line and will soon release 4.13. 4.13 will

- have its own native types
- be compatible with vite
- contain all bug fixes and improvements from the 5.x series
- maintain all deprecated features from the 4.x series (duh)
- allow activation of deprecations from the 5.x series (these are off by default, so no new deprecations are getting added, but you can choose to opt-in early)

## Shipping ember-data 5.4

The 5.4 release has been long overdue, but we didn't want to run away from 4.x users looking for an easier migration path until we had more of a cohesive vision implemented of what the final destination for them was going to look like.

Now we do: we're putting the finishing touches on the first release of SchemaRecord and expect to ship by EOY.

What may have gone unnoticed though is that while we haven't shipped a new minor of `ember-data` in a long time, we have continued to ship new patches of `5.3`. In fact, every improvement and fix in `5.4` is already in `5.3`! This is because `5.4` is symbolic more than anything, when we ship and start regular minor cadence again it will signify that the new paradigm is ready for you to try out.

This means that 5.3 supports vite 💜

## Planning the replacement for unloadAll and unloadRecord

`unloadRecord` and `unloadAll` are two APIs that barely made sense in the resource-centric past of EmberData and make no-sense in the request-centric future of WarpDrive. They've been crutches for apps that really needed to care about memory management.

But there's been no design push to replace them because its not been totally clear what a good general-purpose replacement for them would be that doesn't immediately fall victim to the same issues they have around accidentally creating broken state in the app.

With that in mind, I've been exploring an alternative idea around how to implement a robust but performant Garbage Collection (GC) feature for WarpDrive on-and-off for the past several years.

Two of the sticking points were:
- in the legacy setup, relationships MUST be retainers which often makes GC near impossible
- it seems to require a reference-counting approach, which is known to be algorithmically slow and error prone
- freeing instances and data from the cache isn't a great decision if you're going to want that data again really quickly thereafter.

To that end, I finally realized that fully-embracing the request-centric world allows us to treat requests as roots and thus implement a tracing-gc approach. Moreover, in this paradigm we no longer need to strictly consider relationships as retainers (there's a couple of edge cases around mutation where you do).

If you are curious I wrote up a length explanation of how this will work [here](https://github.com/emberjs/data/pull/9612/commits/3352349217368bdc9635175586bc06923273f7f1), which I plan to turn into an RFC soon after we ship 5.4

The third point is solved by integration of the GC with the CachePolicy (we'd respect the soft-expiry as a retention policy more than likely, or add an explicit hook to make it fully configurable), as well as by the PersistedCache experiment.

## Thinking about Schemas

When I first started talking about SchemaRecord (then called SchemaModel) I envisioned pairing it with an optional Schema DSL to make authoring schemas and types a quick unified experience.

In the interest of time, that DSL has been indefinitely delayed. I've come to think of it as a "nice to have" but not an essential, because the experience of authoring JSON schemas and standalone types has so far felt pretty easy and enjoyable.

I'm not sure yet if that feeling I have will extend to everyone coming from the Model world though, and if others want to help take on the work I still think it has a lot of utility.

## Thinking about CRDTs

So far: I feel they are more hype than useful. My mental model of them is probably not good enough yet. From where I stand though, value-added to the diffs you still need seems low while the implementation and mental model costs feel high. This might change with more familiarity.

## Thinking about PersistedCache

I really want to get mutations into the DataWorker and PersistedCache permitives soon, to do so we need named stores. (There's also some cache API changes we will want, but those can be experimented with separately).

It would be a fairly small RFC and implementation, I'm tempted to ship one in the next few weeks.

If you haven't seen DataWorker and PersistedCache, I'd recommend watching my talk from [EmberFest 2024](https://www.youtube.com/watch?v=BCv8OgcG5vM)

## The Scheduler

I remain convinced that the [Render Aware Scheduler Interface](https://github.com/emberjs/rfcs/pull/957) is one of the largest lifts to DX ember can deliver for Polaris. And I don't think it would be hard, but none of us have had the time to focus on it. Imagine: no more backburner, no more run loops, no more error traces and call stacks deep in framework code trying to find where your own code with the mistake is.

## Routing

The state of routing in Ember has become a huge bottleneck to shipping new features in WarpDrive. I have so many things waiting in the wings dependent on it: so I've been doing a lot of ruminating on how to push exploration there forward: I'm extremely tempted to ship a whole new router, and I don't think that's a good thing.

A few of the things I'm looking to explore:

- An EdgeServer that eliminates fetch waterfalls and allows any app to utilize the big-pipe approach
- route request pre-fetch via the DataWorker
- Turning Ember apps into MPAs
- using context to provide route requests to component trees

```ts
{% raw %}
import { Route } from '@warp-drive/ember';

export function fetch(params) {
  // return value can either be a request Future, promise or an object.
  // if it is an object, each key of the object should point at
  // either a request Future, promise or a value.
  // the function should not be marked `async`
  // the return will become the `@route` arg provided to the template.
}

const MyRoute = <template>
  access the result of the fetch function (unresolved)
  {{@route}}

  component trees invoked here or within
  the yield would be able to access the
  route object via `consume('@route')`
  standard yield also works

  {{yield}}
</template>;
{% endraw %}
```

- using context to provide request results to a component tree

```hbs
{% raw %}
const MyRoute = <template>
  <Request @request={{@route.someRequest}} @key="awesomeSauce">
    <AwesomeSauceConsumer />
  </Request>
</template>;
{% endraw %}
```

## Testing

WarpDrive should offer an integrating testing experience. I've been exploring ideas for that with [Holodeck](https://github.com/emberjs/data/tree/main/packages/holodeck#readme) and [Diagnostic](https://github.com/emberjs/data/tree/main/packages/diagnostic#readme). The next step is to add a simple router (likely I'll just use something layer on honojs, which is what I've used for a POC of this) and re-use WarpDrive as the ORM Layer.

There's a few approaches to the setup with differing tradeoffs, all of them still better than the state of things with Mirage or MSW. A big unanswered question is around how to handle API specs. I was hoping to generate from OpenAPI Specs if an API has them, but these seem to lose way too much information vital to robust mocking.


---

---
title: Adventures in WarpDrive | Cascade on Delete
published: true
---

# Adventures in WarpDrive | Cascade on Delete

Recently at [AuditBoard](https://www.auditboard.com/) we had a case come up where we needed to perform some additional cleanup whenever certain records were deleted.

For instance: imagine you have both a `user` and one or more `search-result` resources, where `search-result` contains a link to the full user and a few fields related to a search query or used as a table row. When `user:1` is deleted, you want to ensure that any `search-result:X` related to `user:1` is also deleted, because their existence no longer makes sense.

This could be achieved by writing a function `deleteUser` that you use anywhere a user is deleted that handles deleting both the user and iterating available search-results and deleting any that pointed at the user, or by manually handling this logic in each location in the code that requires it.

This approach doesn't scale well. Performance falls off the more kinds of search-results you might need to handle, and the more data you have in cache. In large systems, this can also become brittle: a developer may forget to handle the extra deletions or minor variations in the code that does so might create divergent expectations over time.

Faced with this problem recently I recognized it as a variant of "cascade on delete", a feature some users of EmberData/WarpDrive have wanted for ages. I also recognized this was doable now over some of the newer public APIs, and could be made performant by using some of the (still private but iterating towards public) Graph APIs.

## Step 1: Extending our Store with the new behavior

I figured `ResourcePolicy` was a good name for the primitive I wanted (to mirror `CachePolicy`)
and set out to write one. I started with scaffolding the shape of the policy and integrating it
with our store.

For this, I wanted to support both an upfront static config and the ability to dynamically
add to the config overtime (we deliver configuration from our API alongside schema information
for the types of records we typically care about this feature for).

*./resource-policy.ts*
```ts
import type { Store } from './store';

type ResourcePolicyConfig = {
  onDeleteAssociated: Record<string, Set<string>>;
};

/**
 * The ResourcePolicy manages rules for cleanup whenever a record is deleted,
 * allowing for more advanced behaviors like cascading or associated deletes.
 */
export class ResourcePolicy {
  store: Store;
  policy: ResourcePolicyConfig;

  constructor(store: Store, policy: ResourcePolicyConfig) {
    this.store = store;
    this.policy = policy;
  }

    /**
   * Adds a rule to attempt deletion of records of the `associatedType` when
   * a record of the `type` is deleted. This will only work for 1:none relationships
   * where the associated record has a one-way relationship to the primary type.
   *
   * Thus this is a very limited feature and should be used with caution, it is
   * primarily intended for use as a cascade delete on implicit relationships of
   * dynamically generated records.
   */
  addAssociatedDelete(type: string, associatedType: string) {
    this.policy.onDeleteAssociated[type] = this.policy.onDeleteAssociated[type] ?? new Set();
    this.policy.onDeleteAssociated[type].add(associatedType);
  }
}
```

*./store.ts*
```ts
import Store, { recordIdentifierFor } from '@ember-data/store';
import { ResourcePolicy } from './resource-policy.ts';

export class AppStore extends Store {
  /**
   * The ResourcePolicy manages rules for cleanup whenever a record is deleted,
   * 
   * You should not need to interact with this policy directly.
   */
  resourcePolicy = new ResourcePolicy(this, {
    // Note: this can be dynamically populared via handler based on request response meta
    onDeleteAssociated: {},
  });

  // .. other store config
}
```

## Subscribing to Cache Updates

One of the newer features in EmberData/WarpDrive is the [NotificationManager](https://api.emberjs.com/ember-data/release/classes/NotificationManager). By "newer" this feature has existed since the mid-3.x series, but its capabilities have expanded with time and it is not a feature that has generally been surfaced for general use (we should probably change that, consider this post your introduction).

The NotificationManager is actually how WarpDrive manages intelligent reactivity. Each UI Object that the store creates for the application (records, record arrays, documents etc.) uses this API to subscribe to the cache for updates. When an update occurs, the UI Object dirties any reactive signals for state that has changed.

This is also how the EmberInspector currently integrates with the store to watch for changes to the cache for its own use.

In addition to being able to subscribe to the changes to a specific document or resource, the NotificationManager allows subscribing to changes to `'added' | 'removed' | 'updated' | 'state'` for any resource or document. We're going to make use of that for this feature:

First, I updated the constructor to give us somewhere to store information about data that has
been recently removed and method call to kickoff our subscription handling.

```diff
+import type { StableRecordIdentifier } from '@warp-drive/core-types';
+import type { CacheOperation } from '@ember-data/store';
 import type { Store } from './store';

 type ResourcePolicyConfig = {
   onDeleteAssociated: Record<string, Set<string>>;
 };

 /**
  * The ResourcePolicy manages rules for cleanup whenever a record is deleted,
  * allowing for more advanced behaviors like cascading or associated deletes.
  */
 export class ResourcePolicy {
   store: Store;
   policy: ResourcePolicyConfig;
+  recentlyRemoved: WeakSet<StableRecordIdentifier>;

   constructor(store: Store, policy: ResourcePolicyConfig) {
     this.store = store;
     this.policy = policy;
+    this.recentlyRemoved = new WeakSet();

+    this._setup();
   }

   // ... more below
 }
```

Then I setup our subscriptions:

```ts
export class ResourcePolicy {

   // .. more between
  
  _setup() {
  const { notifications } = this.store;

    // any time a resource change occurs
  notifications.subscribe('resource', (identifier: StableRecordIdentifier, type: CacheOperation) => {
    // don't do any special handling for newly created, unsaved records
    if (!identifier.id) {
      return;
    }

    switch (type) {
    // if the change is a deletion, consider if we need to delete associated records
    case 'removed':
      void this._onDeleteAssociated(identifier);
      break;
    }
    });
    }

  // .. more below
}
```

## Performing the Cascade/Associated Delete

Ok so this part is going to get a little messy. Here's the full implementation of `_onDeleteAssociated` to get oriented with. It's annotated but afterwards I'll also walk through a few of the salient points:

```ts
import { assert } from '@ember/debug';

import type { GraphEdge, ImplicitEdge, ResourceEdge } from '@ember-data/graph/-private';
import { peekGraph } from '@ember-data/graph/-private';

// ... more between

export class ResourcePolicy {

  // ... more between

  _onDeleteAssociated(identifier: StableRecordIdentifier) {
    // This guards against multiple notifications for removal of the same
    // record, which occurs in (at least) 4.12 due to multiple parts of the
    // cache independently reporting the removal during cleanup.
    //
    if (this.recentlyRemoved.has(identifier)) return;
    
    this.recentlyRemoved.add(identifier);

    assert('identifier must have an id', identifier.id);
    const { store } = this;
    const { type } = identifier;
    const associated = this.policy.onDeleteAssociated?.[type];


    // if we have no rule for this type, no cleanup to attempt
    //
    if (!associated) return;


    // for our app, the 1:1 case is simple because our API endpoints
    // re-use the ID ala `query-result-user` and `user` share the same ID.
    // if we were to start using this logic for more than that case, we would
    // remove this optimization
    //
    if (associated.size === 1) {
      const associatedType = Array.from(associated)[0]!;
      const record = store.peekRecord(associatedType, identifier.id);
      if (record) {
        store.unloadRecord(record);
      }
      return;
    }

    // we need to find the implicitly related record
    // and then determine if all of its relationships are now empty
    // and only remove it if so: we use the graph to determine this.
    //
    const graph = peekGraph(store)!;
    const edgeStorage = graph?.identifiers.get(identifier);

    // If there are no edges, there are no relationships
    //
    if (!edgeStorage) return;

    
    // for our app's specific scenario, we only wanted to unload the record
    // if all associated relationships were now empty
    //
    const toUnload = [];
    for (const associatedType of associated) {

      // implicit keys match the pattern `implicit-${associatedType}:${inverseName}${randomNumber}`
      // gaining access to implicit keys via an explicit API is a feature we need to add when we
      // mark the Graph as a fully public API
      //
      const keys = Object.keys(edgeStorage).filter(
        (key) => key.startsWith(`implicit-${associatedType}:`)
      );
      const key = keys[0];
      assert('expected to find a key', key);
      assert(`expected to only find one key, found ${keys.length}`, keys.length === 1);

      const edge = edgeStorage[key];
      assert('expected to find an implicit edge', edge && isImplicitEdge(edge));
      const associatedIdentifers = edge.remoteMembers;

      // yup, that's a label. I hate me too but they are useful in this scenario.
      gc: for (const associatedIdentifier of associatedIdentifers) {
        // for each associated identifier, if all of it's own
        // relationships are empty (not including the one we're
        // deleting as it may not have been cleaned up yet),
        // then we can remove it.
        //
        const associatedStorage = graph.identifiers.get(associatedIdentifier);
        assert(
          `expected to find associated storage for ${associatedIdentifier.lid}`,
          associatedStorage
        );

        for (const assocKey of Object.keys(associatedStorage)) {
          const assocEdge: GraphEdge | undefined = associatedStorage[assocKey];
          assert('expected to find a belongsTo edge', assocEdge && isBelongsToEdge(assocEdge));

          if (assocEdge.remoteState !== null) {
            // if this edge is the edge that kicked off the deletion,
            // we treat it as removed even though the state is still
            // present in the graph.
            //
            if (assocEdge.remoteState === identifier)
              continue;


            // if we have remoteState that is not the originating
            // identifier, then this record cannot be removed, so
            // we break out both the inner and the outer loop.
            //
            break gc;
          }
        }

        // if we made here, then all of the associated record's
        // relationships are empty and we can remove the record.
        // 
        const record = store.peekRecord(associatedIdentifier);
        assert('expected to find a record', record);
        if (record) {
          toUnload.push(record);
        }
      }
    }

    if (toUnload.length) {
      for (const record of toUnload) {
        store.unloadRecord(record);
      }
    }
  }
}

function isBelongsToEdge(edge: GraphEdge): edge is ResourceEdge {
	return edge.definition.kind === 'belongsTo';
}

function isImplicitEdge(edge: GraphEdge): edge is ImplicitEdge {
	return edge.definition.isImplicit;
}
```

Ok, so in this implementation a few things were specific to AuditBoard's use cases:

- the associated records for which we cascade the delete only ever utilize belongsTo relationships, never hasMany relationships.
- the associated records sometimes (but not always) contain more than one belongsTo relationship, in the single case there's a simple fully public API to quickly perform the removal
- these belongsTo relationships are all implemented as one-directional (`inverse: null`)

All this means for you is that if you want to implement a similar concept in your app, its best to first understand the requirements your app has around cascading deletes. There are ways to handle hasMany relationships, cascade-on-delete for regular relationships, cascade-on-delete for completely unrelated records etc: you just need to know the rules and shape of the problem as it pertains to your app.

That is what is great about the NotificationManager, its a simple API but it lets us quickly write code that can do complex things within our specific app-domain logic.

The two questions you probably have come from the code handling what happens when one of our associated records relates to more than one type: what is the graph, and what are implicit edges.

## The Graph

The Graph is a library used by the JSON:API Cache which we built so that cache implementations (for any format) could delegate one of the hardest problems (managing relationships) to a primitive built and optimized for it.

We've kept the API for it private to this point because we expect to change the implementation of it quite a bit while adding support for paginated relationships, and there are some open questions around whether it should also become how documents are stored (the answer is probably "yes").

The Graph is just that, a graph: it stores the relationships (directional Edges) between resource CacheKeys (identifiers).

## Implicit Edges

When the Graph encounters a one-direction relationship e.g. something like a belongsTo or a hasMany with `inverse: null`, it creates an implicit inverse relationship for convenience and performance.

For instance, lets say a user has a car, the car gets into an accident and is totaled, and now the user does not have a car.

We might model this as a hasMany (`user.cars`) pointing at a belongsTo (`car.owner`), or we might model this with `inverse: null` (e.g. just `user.cars`, and no inverse on the car).

In the case there is no inverse, when the car is totaled and thus deleted, we need to know what relationships that car was in to remove its entry. That's where the implicit edge comes in, it tells us exactly what relationships currently point at the car, and so following them backwards we can quickly remove the car from all associated relationships.

This feature is one of the many small niceties of working with relationships in EmberData/WarpDrive, and it happens to sound exactly like the information we need for cascade-on-delete!

To be clear, we could implement this with public API by iterating all records of the associated type and checking the current values of their relationships, but that is a far more expensive operation as it requires iterating far more values, and potentially creating ui objects for them and their relationships.

So in our case with `user` and `search-result`, we reach in to the list of implicit edges in the graph for the user that got deleted, get the list, and for each implicit relationship if it matches our associated type (`search-result`) we perform the deletion check. Elegant really, though I wish we were closer to making this information publically and conveniently accessible. I don't like reaching into private APIs either 🙈

This exploration though lets me feel out what information should be public and what (future) public APIs are missing from the Graph in its current state.

---

This has been an Adventure in WarpDrive. Stay tuned for our next episode!


---

---
title: Adventures in WarpDrive | Advanced Builders
published: true
draft: true
---

# Adventures in WarpDrive | Advanced Builders

One of the bigger risks with the introduction of new patterns for requests in WarpDrive has been the inclusion of request builders for common active-record, rest and json:api endpoint setups.

Why is their inclusion a risk?

Because one of the goals of the request paradigm is to shift users away from the many limitations adapters and serializers had.

Over the years we saw adapters and serializer lead to *a lot* of bad code, badly performing code, or complex workaround to solve for what ought to have been relatively simple cases.

The inclusion of "sensible default" builders that won't work for everyone carries this same risk. Users might invoke the builder just to significantly change the output in their own builder, or decide that WarpDrive doesn't support their API because the builders don't align with theirs perfectly.

One of the biggest risks they carry is in making developers think that these "sensible defaults" are representative of all – or even most – of what can be done with builders. And well ... not only is that just not true, being able to do more is why we shifted to a request-centric approach in the first place!

And I don't just mean "a little more", I mean "a lot more".

## Typing Builders

Before we get started, there's a type utility we're going to use in this post that is not yet part of WarpDrive (it will be, probably by the time you read this) which is worth showing and explaining here:

```ts
import { withBrand, type TypedRequestInfo } from './request';
import type { TypeFromInstance } from './record';
import type { SingleResourceDataDocument } from './spec/document';

function exampleFindRecord<T>(
  type: TypeFromInstance<T>,
  id: string
): TypedRequestInfo<T, SingleResourceDataDocument<T>> {
  return withBrand({
    url: `/api/${type}/${id}`,
    method: 'GET',
    cacheOptions: { backgroundReload: true },
    op: 'findRecord',
  });
}
```

When used with the store the following will happen:

```ts
type User = {
  id: string;
  name: string;
  [Type]: 'user';
};

// ...

const userRequest = exampleFindRecord<User>('user', '1');
const { content } = await store.request(userRequest);

// ...

content.data; // type User!
```

You may have seen the ability for builders to assign type signatures before, but previously this often required either a `ts-expect-error` or a cast to add the brand. The magic here is the relationship between `withBrand` and `TypedRequestInfo`.

`TypedRequestInfo` provides our request's return type, while `withBrand` sets up the response object in a way that lets typescript infer that the brand applies instead of requiring the cast or ignoring a type error.

Useful, ok let's take a dive into eight things builders make easy that adapters made hard.

## 1. Write as many of them as you want!

Builders are useful even when you're only making a request once. Why? They provide a nice abstraction around ensuring the
type signature is setup correctly, make it easier to write tests or share the request later if it turns out you need to, and often clean up the readability of your code.

Some common questions though are "what should be builders" or its cousin "how many builders should I have". A negative effect of the "sensible defaults" mapping so closely to the methods the store and adapter used to have (`findRecord`, `createRecord`, `deleteRecord`, `query` etc.) is that it leads people to believe builders should be highly generic, or use just these few recognizable names.

On the contrary, use as many builders as seems reasonable. This can be anywhere from a builder per-request or per-endpoint to a small number of carefully curated builders that work against most endpoints targeting a highly conventional API.

For instance, I started playing around with creating [a BlueSky client using WarpDrive](https://github.com/warp-drive-data/embersky.app/pull/4) and I'm currently opting to create a builder for every single RPC action that API exposes.

I really don't need to create so many builders, the RPC endpoints largely follow the same pattern, but by mapping 1:1 I'm able to take an API I don't know much about yet and have types, docs, and autocomplete for every action I might take at my fingertips. In other words, in this case builders make an API with a lot of convention but also a lot of nuance much easier to quickly integrate with!

## 2. Ad Hoc Requests

How many of you have either ejected from EmberData entirely or called `adapterFor('<some-type>').buildURL(...)` or `adapterFor('<some-type>').aCustomMethod()`? Or pushed a ton of configuration into a request's `adapterOptions` in order to change how the request was going to be made?

And then had to figure out how to get the response normalized and inserted into the store? Leaving a trail of `serializerFor` and `pushPayload` calls that seem a bit dicey but your tech-lead says this is the pattern you've been using so you follow along?

With builders, it becomes easy to construct ad-hoc requests or less common requests that you'll re-use only a few times and have everything look and function just the same as any other request. The response is automatically inserted into the cache if that is what you want, all your normal handlers for processing the data are utilized (if you want, its also easy to set them up to be skipped), all the same typescript support, all the same request utilities like `<Request />` and `getRequestState` and advanced error handling...

## 3. RPC Calls

I touched on this in point-1 above but I really want to call this out specifically. With builders, RPC-like patterns are easy to implement. For instance, let's say you want to "add a like" in a highly scalable system where the likes count is eventually consistent. You don't want to model this as a `post hasMany like` because loading millions of likes just to display a count and the state of the heart button would overhwlem the system. Instead you might model this (similar to bluesky) as a [post with a viewer object](https://docs.bsky.app/docs/api/app-bsky-feed-get-feed), where the viewer object contains data about you, the user (have you liked it? etc.).

When you like or unlike the post, you want to:

- toggle the state of `post.viewer.liked`
- increment/deprecate the `post.likeCount` field
- make an RPC request that either creates or deletes a user like.

```ts
function createViewerLike<T extends Post>(post: T): TypedRequestOptions<T, void> {
  return withBrand({
    url: `/api/app.post.createViewerLike`
    method: 'POST',
    op: 'app.post.createViewerLike',
    body: JSON.stringify({
      postId: post.id,
    }),
  })
}
```

Great, say the response here is a 202 or 204 and not a 201? What should we do about updating those two fields?

This is where WarpDrive leaves a lot of decisions to you. You could:

- have your builder optimistically update the cache state
- have your builder mutate the cache state
- have your builder tell the cache this is an update to the post record
- use have a handler which pessimistically updates the cache state
- use a handler that runs a callback passed in via options to update the cache state

Each of these has tradeoffs. The first, you risk being in an odd state if you fail.

## 4. Operations

## 5. Transactional Saves

## 6. Sharing Queries

## 7. Lazy Paginated Selects

## 8. DSLs like GraphQL / SQL


---

---
title: EdgePipes | The Alternative to SSR and RSCs
published: true
---

# EdgePipes | The Alternative to SSR and RSCs

If you've talked with me at any point over the past few years (in person, at conferences, or listened in anywhere someone unwisely chose to give me a platform) you've probably heard me mention "SSD" or "Server Side Data".

The basic idea is that instead of SSR (Server Side Rendering) we would hoist **just the fetch hooks and router** out of an SPA or MPA, and embed them in a SharedWorker in the browser or deploy them as an Edge Function.

Three design requirements are pre-requisites for this idea:

- the router and fetch hooks should be fully isolatable from any rendering requirements
- the fetch hooks should be non-blocking by design (waterfalls / linear requests are acceptable via chaining fetch hooks if required, but ideally some annotation may be used to differentiate those that block due to need vs due to ux considerations)
- the fetch process needs to be managed on the client

Unlike SSR and RSCs where the goal is to output the page and data in a state ready for the consumer to read, our goal with this architecture is purely to tackle optimizations around waterfalls, latency, and network reliability. The output artifact is not a page, but a streamable payload containing a fully replayable response for each request made by the fetch hooks.

This design is premised on a few key ideas:

1. The existence of "The Backbone Effect": Network connections are more stable, throughput is higher and latency is lower between the server running an edge function and the data-center hosting your backend than between the device and your backend.

2. That booting an edge-function with a simple optimized router and running the fetch hooks is significantly faster than the time it would take to await asset load on the client, boot the full application, begin routing and run all fetch-hooks in parallel there.

3. That we are able to manage network requests intelligently-enough in the client so that we can make use of the response from this edge-function.

4. That delivering N request responses through one pipe or via server-push is in aggregate faster and more reliable than sending N separate requests.

5. That the application has intelligent enough state and routing management to take advantage of this edge-function to optimistically prefetch data for pages the users might go to next, and can delegate this responsibility off-thread.

As I've thought more on this idea I've started rebranding it as "EdgePipes" instead of SSD to better communicate what it does and where it differentiates.

## What's different?

Unlike SSR, EdgePipes should be fairly resource-consumption friendly. Like SSR, EdgePipes can be used to progressively enhance the performance or experience of an application.

Unlike SSR, EdgePipes optimize page-loads even after the initial page.

Unlike SSR and RSCs, EdgePipes don't create a double-request or rehydration problem, which should lead to applications being *actually* interactive faster, not just appearing to be.

Unlike RSCs EdgePipes don't change your security model, make you think about where your servers are in relation to your database, or ask you to write your API in JS.

Unlike RSCs, EdgePipes actually make sense on the edge, because they don't need to be located close to your microservices and databases.

I also suspect that EdgePipes would be easy to hyper-optimize. Their restricted nature likely means they can be compiled into executables with the likes of bun and static hermes. They could potentially rewrite responses into more streamable and compressible forms for final delivery (if the plugin for doing so is paired with a plugin in the client that understands how to re-expand).

Since routes are often nested, the client could easily send a hint for which fetch-hooks it already has (and thus can be skipped).

Using it for prefetch doesn't even have to deliver the response all-the-way to the client: it could just prefetch to a cache on the edge so that the cost to the user's device is only paid if they navigate to the associated page, solving elegantly a common problem seen with sites that attempt to use prefetch aggressively for every link and button.

## But Why?

I started thinking about this architecture while working at LinkedIn, where quite often we ran our SSR (fastboot) in a "data only" mode somewhat similar to this and for similar reasons. But (for lots of reasons) that implementation always left way more to be desired than it solved problems.

I've never liked SSR. Okay that might be a bit of a lie there was a short period when SSR first burst onto the scene and EmberJS added one of the first out-of-the-box SSR solutions with fastboot that I thought it was awesome. But the rose colored lenses faded to grey quickly: the real world evidence mostly showed that SSR for anything except pre-rendering html for static sites was both cost-prohibitive and net-negative to user experiences and performance. While I'd never considered it a silver bullet, I did at least think at the time it would *improve* user experiences and maybe lead to some interesting pre-render-in-a-worker-like concepts.

Deadends. Useful deadends mind you, but deadends. Useful because I really like the tooling and ideas in many new frameworks like Astro, the built-in SSR mode of vite, and the exploration of minimalism that lit and qwik and htmx are driving (and I don't think we fully get there without the failure of SSR as a performance fix).

But there were ideas in SSR I did like: the idea that we could multiplex all the requests associated to a given page visit. The idea that we could flatten waterfalls. The idea that we could leverage how the internet backbone prioritizes data. The idea that we could shift some compute closer to the user to boost their experience. The idea that we could do this progressively overtop of existing applications as little more than an opt-in enhancement without requiring teams to adopt a whole new paradigm or language.

And what I like most about the EdgePipe approach: it even should work for fairly lightweight minimal apps that do a lot of their work on the server.. because it is fundamentally around optimizing the fetch pipeline wherever one exists.

Anyhew, so those are EdgePipes and if you've been full of WTFs wondering what I meant talking about SSD these past few years now you know 💜


---

---
title: Creating NPX compatible cli tools with Bun 
published: true
---

# Creating NPX compatible cli tools with Bun

> This blog post is an exercise in exploration. Read to the end for why I wouldn't necessarily suggest doing this.

Users want to run scripts using tools already available in their project, usually this means installing a package and running its executable via `npx`, `npm run`, `pnpm dlx`, `bunx` or similar.

Script authors (like myself) want to create scripts using the best tools at their disposal. These past few years I've been using [Bun](https://bun.sh/) for creating most of my scripts because as an all-in-one toolchain+sdk it makes it ridiculously easy to build complex scripts with minimal time spent on project configuration, and many of its APIs like `file`, `glob` and `spawn` are ideal for building the kinds of tools I tend to work on.

I also like to author scripts that are fast and lightweight, which Bun's focus on performance and builtins helps make happen. I can often author complex scripts with zero or close-to-zero dependencies.

One challenge I've encountered has been how to create tools that work for users that don't use Bun or perhaps have an older version.

While our script can use a shebang (`#!/usr/bin/env bun`) to request running our script with `bun`, this will only work if the user has already adopted bun into their tooling stack, and has a recent enough version of bun on their machine to support the APIs we use.

Eventually, bun intends to enable building a project with `node` as a target in a way which includes any bun-specific APIs in the output. Whenever this lands it will immediately be incredibly useful, as most commonly the people trying to run scripts authored with bun APIs without bun are running node.

...but what if it didn't matter at all what tools and versions were locally available to the dev?

Below I'll outline a series of concepts that together allow us to do this.

## Compiling our Script

Often we don't think to bundle the node scripts we write. Or if we do its to support things like typescript, or esm/cjs interop. With bun, typescript and esm/cjs interop "just work". Thankfully, these ideas are now entering node as well so this particular advantage bun holds will fade away.

Sometimes, especially with larger node apps, we bundle just to reduce start-up time.
This is something bun makes easy, and it will even make optimizations like minification and inlining happen for you while it does.

For small CLI scripts, especially those meant for remote use by tools like `npx`, I think bundling is ideal as it lets us reduce the boot cost of our tool and potentially ship an even smaller package.

But bun optionally takes bundling two huge steps further:

- [`--bytecode`](https://bun.sh/docs/bundler/executables#bytecode-compilation) improves startup time of a bundle by pre-parsing the JS and storing that in the JS instead.
- [`--compile`](https://bun.sh/docs/bundler/executables) produces a single-file executable binary containing all necessary code and the bun runtime.

By default, bun compiles for the machine you are on, but we can adjust the target to compile for [any architecture that bun supports](https://bun.sh/docs/bundler/executables#supported-targets).

Assuming the entrypoint for our script is `./src/index.ts`, then we can build a simple script to generate compiled versions for each supported platform.

```ts
const KnownArchitectures = ['arm64', 'x64'];
const KnownOperatingSystems = ['linux', 'windows', 'darwin'];
const InvalidCombinations = ['windows-arm64'];

outer: for (const arch of KnownArchitectures) {
  for (const platform of KnownOperatingSystems) {
    if (InvalidCombinations.includes(`${platform}-${arch}`)) continue;

    // compile the given architecture
    const target = `bun-${platform}-${arch}-modern`;
    const args = [
      'bun',
      'build',
      './src/index.ts',
      `--outfile=dist/${target}-npx-bun-demo`,
      '--compile',
      '--minify',
      '--bytecode',
      '--env=disable',
      '--sourcemap=none',
      `--target=${target}`,
    ];

    const proc = Bun.spawn(args, {
      env: process.env,
      cwd: process.cwd(),
      stderr: 'inherit',
      stdout: 'inherit',
      stdin: 'inherit',
    });
    const result = await proc.exited;
    if (result !== 0) {
      break outer;
    }
  }
}
```

## setting up our package

### 1. move all dependencies to devDependencies

Since the code we need from our dependencies is all bundled into the executable, we don't want any tools to install them when trying to run our script.

So anything listed in `dependencies` should be moved to `devDependencies` in the `package.json`.

If you were using bun to build your API, this feature simplifies your deployment immensely! Zero-install / extremely lightweight image deploys!

### 2. Ensure we compile whenever we package up our project

In our `package.json` file, we setup the `prepack` script to ensure we build the compiled versions.

```json
  "scripts": {
    "build": "bun run build.ts",
    "prepack": "bun run build"
  },
```

### 3. setup a `bin` script for the package

Since we want our script to be usable from tools like `npx`, we need to add a `bin` entry to our `package.json` file.

NPM doesn't provide a utility for switching which asset to use for a bin script based on the consumer's architecture (though you could use node-gyp to achieve this). Below, I'll detail how to setup a script that juggles this for you, we'll name that file `arch-switch.mjs`.

```json
  "bin": {
    "npx-bun-demo": "./arch-switch.mjs"
  },
```

### 4. setup what files to publish with our package

Our script above outputs the compiled versions into `dist`, and requires the bin script `arch-switch.mjs`, nothing else is needed to use the tool, so these will be the only entries in our `package.json` file.

```json
  "files": [
    "dist",
    "arch-switch.mjs"
  ],
```

## Creating the bin script

Our `arch-switch` script will select which pre-compiled binary to execute to perform the `npx-bun-demo` command by detecting the platform and architecture of the machine in use.

For this, we want to make sure to use only features that are available to both node and bun, which generally means "use only node-available APIs" as bun largely has implemented support for anything node offers (being able to use any npm package and node built-in with bun is another of its superpowers).

```ts
import { spawn } from 'child_process';
import { arch as osArch, platform as osPlatform } from 'os';

const KnownArchitectures = ['arm64', 'x64'];
const KnownOperatingSystems = ['linux', 'windows', 'darwin'];
const InvalidCombinations = ['windows-arm64'];

const arch = osArch();
const _platform = osPlatform();
const platform = _platform === 'win32' ? 'windows' : _platform;

function ExitError(str) {
  console.log(`\n\n`);
  console.log(
    '\x1b[1m\x1b[4m\x1b[31m\x1b[40m',
    `\t\t${str}\t\t`
  );
  console.log(`\n\n`);
  process.exit(1);
}

if (!KnownArchitectures.includes(arch)) {
  ExitError(`Unsupported architecture '${arch}'`);
}

if (!KnownOperatingSystems.includes(platform)) {
  ExitError(`Unsupported platform '${platform}'`);
}

const executableName = `${platform}-${arch}`;
if (InvalidCombinations.includes(executableName)) {
  ExitError(`Unsupported architecture '${arch}' for current platform '${platform}'`);
}

spawn(
  `./dist/bun-${executableName}-modern-npx-bun-demo${platform === 'windows' ? '.exe' : ''}`,
  process.argv.slice(2),
  {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  }
);
```

### Conditionally Running Bun via shebang

Our bin script above is missing just one piece: the shebang.

Usually, a bin script will specify `#!/usr/bin/env node` at the top of the file to ensure tools execute it with the node runtime.

We can alternatively specify `#!/usr/bin/env bun` instead to make use of the much faster start-up time and runtime offered by `bun`, but remember, we aren't sure our user has bun (or node for that matter) and we want to work either way.

Enter a conditional shebang, a bit of sorcery I leave to google (or lets be honest probably ChatGPT) to explain:

```sh
#!/bin/sh -
':'; /*-
test1=$(bun --version 2>&1) && exec bun "$0" "$@"
test2=$(node --version 2>&1) && exec node "$0" "$@"
exec printf '%s\n' "$test1" "$test2" 1>&2
*/
```

We can add a console log to the top of our file after this to help see in practice that this works:

```ts
#!/bin/sh -
':'; /*-
test1=$(bun --version 2>&1) && exec bun "$0" "$@"
test2=$(node --version 2>&1) && exec node "$0" "$@"
exec printf '%s\n' "$test1" "$test2" 1>&2
*/

console.log(
  `\n\nRunning '${['npx-bun-demo (arch-switch) |>', ...process.argv.slice(2)].join(' ')}' with: ${process.isBun ? 'bun' : 'node'}`
);
```

The general gist is that this uses various comment syntaxes and strings in a manner that a shell-script interprets it as a command and the JS runtime ignores it. If we find a bun command in our current path, we use it, else we try to use node.

And there you have it!

The source-code for this demo is [available on github](https://github.com/runspired/npx-bun-demo).

The example app details can be tried via `npx npx-bun-demo@1.0.0` or a similar tool of your choosing.

### What I don't like

The downside to the approach detailed here is the package size that results from producing the matrix of compiled binaries.

If all we cared about was a single platform and architecture, our package would be `56.8 MB`. This is viewable via `npm view npx-bun-demo@1.0.1`

This is larger than I'd like, but considering that is the runtime, dependencies and source-code I find it acceptable (most small scripts are much larger than this once dependency sizes are taken into account, before even considering the size of node itself).

With the full matrix of current targets, our package is `422.4 MB`. This is viewable via `npm view npx-bun-demo@1.0.0` Oof 🙈

There are times where this is probably acceptable (at least, in the short-haul until bun gives us the ability to consume its APIs outside of a bun environment and/or npm gives us the ability to pre-build separate tarballs for distinct architectures). 

If you want, you could risk dangerously relying on the postinstall hook (seriously folks, run your package installation with scripts disabled please) to detect and download the desired executable. The easy path for that would be to check the compiled versions into github and have the switch script fetch the file if not already present.

I really don't recommend this except *maybe* for scripts that are only ever used via a mechanism like `npx`.

This approach is demoable via `npx npx-bun-demo@1.0.7` for everything but windows (since github won't allow files > 100MB).


---

---
title: Exploring transformed and derived values in @warp-drive/schema-record
published: true
---

# Exploring transformed and derived values in @warp-drive/schema-record

With [@warp-drive/schema-record](https://github.com/emberjs/data/tree/main/packages/schema-record#readme) approaching its first stable release, now felt like as good a time as any to start writing about some of the key differences from [@ember-data/model](https://github.com/emberjs/data/blob/main/packages/model/README.md) in its approach to reactive-data.

The first thing most will notice is that the authoring format has changed from javascript classes to json schemas (and optionally types).

**Model (before)**

```ts
import { cached } from '@glimmer/tracking';
import Model, { attr, belongsTo, hasMany, type HasMany, } from '@ember-data/model';

export default class User extends Model {
  @attr('string') declare firstName: string;
  @attr('string') declare lastName: string;

  @hasMany('user', { async: false, inverse: 'friends' })
  declare friends: HasMany<User>;

  @belongsTo('user', { async: false, inverse: null })
  declare favoritePerson: User;

  @cached
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

**Schema (after)**

```ts
const UserSchema = {
  type: 'user',
  identity: { name: 'id', kind: '@id' },
  fields: [
    { name: 'firstName', kind: 'field', type: 'string' },
    { name: 'lastName', kind: 'field', type: 'string' },
    { 
      name: 'friends', kind: 'collection', type: 'user',
      options: { async: false, inverse: 'friends' }
    },
    { 
      name: 'favoritePerson', kind: 'resource', type: 'user',
      options: { async: false, inverse: null }
    },
    { 
      name: 'fullName', kind: 'derived', type: 'concat',
      options: { fields: ['firstName', 'lastName'], separator: ' ' }
    }
  ]
};

type User = {
  firstName: string;
  lastName: string;
  friends: User[];
  favoritePerson: User;
  fullName: string;
};
```

There are a lot of key behavioral differences between SchemaRecord and Model: from a shift to immutability, built-in change buffering, deeply reactive object and array fields, to (still under construction) a whole new relationship paradigm. Today, I want to focus on one key area of change: transformed and derived values.

In the world of Models, engineers could use the class to add additional behaviors and derived (computed or calculated) values in addition to the schema fields defined via decorator. When using SchemaRecord, the only fields allowed are those defined via schema. In other words, **SchemaRecord places a fairly massive new constraint on just how much you can do.**

I was motivated to write about this constraint after a discussion in [emberjs discord](https://discord.com/channels/480462759797063690/1337069566940942388/1337143861964968017) wanted to know more about how to approach solving for it. In this post, I want to explore this new constraint: why we added it — how it helps developers fall into the pit-of-success — and whether there are any alternatives when using SchemaRecord (*spoiler alert yes*).

## The World According to Schema

> On the sixth day of the second month of the 19th year of our library data, in the evening we lifted our eyes and low under the night-shift of the monitor we looked upon the git respository and from it issued forth a decree that henceforth our records must respect the boundaries of the data they represent.
>
>  *— i WarpDrive iv.11 2025 Edition*

In the world of Schema, every behavior of a record is defined by its schema and derived from the data in the cache.

**every**. **behavior**.

If the property or method is not included in your schema for the resource, it doesn't exist. Every SchemaRecord begins as a completely clean slate.

You may (or more likely probably do not yet) know that SchemaRecord has a special "legacy" mode that allows it to emulate the default Model behaviors. Everything from props on the instance like `isDestroyed` and `isDestroying` to default fields like `id`, the state-machine (`currentState`) and its friends like `isDeleted`, `isError`, `isLoaded`, and `isNew`, to methods such as `reload`, `rollbackAttributes`, `save`, and `unloadRecord`. We even emulate `constructor.modelName`.

Every single one of these, yes *every single one* is implemented by adding a schema-field to the definition for the resource, the result of the `withDefaults` call below.

```ts
import { withDefaults } from '@ember-data/model/migration-support';

const User = withDefaults({
  type: 'user',
  fields: [
    { name: 'firstName', kind: 'field' }
  ]
})
```

Outside of a small special group referred to as `locals`, all of these fields are created by a `derivation`, which implies that derivations can do all sorts of things beyond simple calcs, even so far as adding methods!

So you see, while you can't just quickly slap a getter or a method on a class like you could with Model, the world is your oyster! *(please, please pretend I didn't just say that.. lest you steer your app into a miserable place)*

As the saying goes: **just because you could, doesn't mean you should!**

## Why is Everything Schema?

To understand why you shouldn't just write a whole bunch of new field capabilities and derivations to keep on doing whatever, lets take a moment to understand why SchemaRecord isn't implemented as a class you can extend in the first-place.

Javascript applications, especially those that target browsers, need to balance a lot of factors to maintain great performance characteristics, a few of the big buckets:

- asset download time
- asset parse time
- JS eval time
- runtime memory overhead

The Model approach to reactive-data performed poorly in all four of these categories.

As apps grow, the number of Models required and the size of their definitions also grows, leading to larger and larger assets and thus larger download and parse times.

Since those Models contain the schema, they are often needed synchronously at unpredictable times, leading to them generally being eval'd early during an app-boot cycle.

Since Models are subclasses (of at least Model and thus also EmberObject and its chain) and often use Mixins and lots of defineProperty calls (from the decorators), parsing them, evaluating and instantiating them is particularly expensive from both a compute and memory perspective.

In short, using Models for reactive-data is expensive and doesn't scale well with the demands of your application.

### So is SchemaRecord just about performance?

No, actually. There are ways for us to optimize record instances in ways that outperform the current SchemaRecord implementation (and we may introduce those as special modes in the future, they have different tradeoffs, we are currently balanced in favor of program correctness and helping developers catch accidental mistakes).

SchemaRecord is equally about *flexibility*. By having our record instances consume JSON schema to derive their behaviors, we gain not only the ability to deliver smaller, easier to parse JSON payloads that scale better **but also** the ability to deliver the definitions only when we need them and from whatever source is most optimal.

For instance, embedding these JSON schemas in your JS bundle, having them be separate JSON files you load alongside your JS bundle – or just-in-time (JIT), or having them be part of response payloads from requests you make to your API are all equally valid ways of delivering schema. And these modalities can be mixed as needed for apps to tune themselves. *flexibility*.

*flexibility* is also about what schemas mean from the perspective of partial-data and typescript. In the Model world, the Models were typically used as the type. This leads to friction where in some contexts fields are optional or invalid (such as during a create), while in others they are readonly.

In the SchemaRecord world, types are the types. They vanish from your runtime, and can be tailored to the context of specific edit, create or partial-data scenarios. For more about this I recommend reading the [TypeScript Guide](https://github.com/emberjs/data/blob/main/guides/typescript/2-why-brands.md).

### So is SchemaRecord just about performance and flexibility?

No, actually. It is equally about program correctness (I hinted at this above). Over the years, we have had the opportunity to watch developers intentionally and unintentionally misuse models in ways that lead to frustrating application bugs.

One of the most basic mistakes is treating a record as a convenient storage location for local component state. For instance, we'll often see records in a list get mutated to add booleans like "isSelected" "isFocused" and "isExpanded". At first this works and feels easy: then later this creates confusing bugs when the record is used by a different component trying to add and stash its own state.

With SchemaRecord, if a property isn't in the schema, accessing (or worse attempting to set it) will immediately throw an error. This ensures you aren't leaking unintended side-effects elsewhere in your code.

The full set of ways SchemaRecord is helping to steer you towards program correctness and protect against wierd and spooky bugs is fairly vast, and probably left for a blog post of its own. As a teaser, the way it goes about immutability and mutation is also designed to guide you to write more correct programs. Suffice it to say though: its important to realize that this is one of its primary goals. And it is likely to be one of the goals that developers (you) struggle with the most.

As programmers we've been programmed to hack at things until they work. With Models, we often could just hack until it seemed to work. SchemaRecord demands that you step back and think through how the thing *should* work and where various behaviors and state *should* belong.

### The Pit of Success

A basic principle of SchemaRecord is that a little friction and the right constraints go a long way towards steering apps into patterns that are performant, scalable, and correct by default.

Removing the ability to easily and quickly extend a Model with new behaviors is a key part of that principle.

If you find yourself asking "why do I have to write so many custom derivations" or "why am I writing so many custom transformations" or "why does this feel so hard to do" there's a decent chance the answer is "its meant to be".

Equally though, just because something is hard does not mean "you should never". Our goal as a library is to steer you towards what is usually best. Your goal, as a developer, is to know when to steer against the current.

And so with that prolongued introduction, lets explore two categories of steering against the current: transformed and derived values.

## Exploring FieldSchemas

The original question which prompted this discussion was asking whether accessing services on records was still possible, and if so how to have a field on a SchemaRecord that changed based on a user selected language set in the `intl` service.

In the Model world, this was solved with the following setup:

```ts
import Model, { attr } from '@ember-data/model';
import { service } from '@ember/service';

export default class House extends Model {
  @service intl;

  @attr declare houseDescription: {
    en: 'Great House',
    es: 'Buena Casa'
  },
  
  get description() {
    const lang = this.intl.lang;
    return this.houseDescription[lang];
  }
}
```

Today, lets focus on three specific kinds of FieldSchemas exploring how each might be used to solve this use case:

- [transformed fields](https://github.com/emberjs/data/blob/33193bf9097a122c1e51a543ea4ebf6a1a2a74d4/packages/core-types/src/schema/fields.ts#L3-L36)
- [derived fields](https://github.com/emberjs/data/blob/33193bf9097a122c1e51a543ea4ebf6a1a2a74d4/packages/core-types/src/schema/fields.ts#L407-L457)
- [aliased fields](https://github.com/emberjs/data/blob/33193bf9097a122c1e51a543ea4ebf6a1a2a74d4/packages/core-types/src/schema/fields.ts#L38-L87)


### Transformed Fields

You may have heard of transforms when using Models. If so, you understand the rough idea of transformed fields, but transformed fields are very different from the legacy transforms that could be defined via Model attributes.

Defining a transform on a Model looked like this:

```ts
class User extends Model {

  @attr('string') name;
  //      ^ 'string' is the transform
}
```

This exact field definition can be defined in JSON as:

```json
{
  "name": "name",
  "kind": "attribute",
  "type": "string",
  "options": null
}
```

It may surprise you to know that this basically did nothing in the Model world ... unless you happened to be extending from one of the serializers provided by the package `@ember-data/serializer`, in which case *as long as you did not override the wrong normalization or serialization hook* would use Ember's resolver to lookup the transform to help normalize or serialize the payload.

Key takeaways about legacy transforms:

- operated on data to/from the Cache and your API
- weren't guaranteed to operate at all
- are definitely not type info (despite how many have tried to treat them)

A common pitfall that developers hit with legacy transforms is that they don't run when you mutate a record.

For instance, say you use the `'date'` transform to convert string dates to `Date` instances. Your API sends down a string, the serializer transforms the field, and the value in the cache is now a `Date` instance.

Now, say you are creating a new record with `store.createRecord('user', { birthday })`. What do you pass for `birthday`, a string or a Date instance? The answer is a `Date`, though often folks will set a string instead.

This gets really pernicious with the boolean and number transforms, because while the values coming from the API are converted into the proper form, if you update the value by binding it to a text-input... the value in the cache will now be a string.

Enough about the faults of legacy transforms though (and there are many). SchemaRecord guides us towards correctness, and one of the ways it does so is by introducing a complete rework of transforms. We'll call the new transforms `Transformations`.

Transformations:

- operate on data to/from the cache and your app code (they run when the value is accessed or set on the record)
- are guaranteed to operate
- could well be type info (but still aren't, use types for types)

To see how this works, lets create and register a Date transformation (note, heavily recommend something immutable like luxon for Date values instead of raw Date)

```ts
import type { Transformation } from '@warp-drive/schema-record/schema';
import { Type } from '@warp-drive/core-types/symbols';

const DateTransform: Transformation<string, Date> = {
  serialize(value: Date): string {
    return value.toUTCString();
  },
  hydrate(value: string): Date {
    return new Date(value);
  },
  [Type]: 'date',
};

store.schema.registerTransformation(DateTransform);
```

We register the transformation so that there is no ember-resolver magic. Like schemas, Transformations can be registered Just-In-Time, which means that if desired you can fetch and load transformations asynchrously alongside schemas. As long as the Transformation is registered by the time you access the field on the record instance, you're good to go.

In addition to some of the common scenarios like Date and Enum, we expect due to their guarantee to run that some folks will choose to use them to write validation layers for fields used in forms.

This is explicitly allowed, though not necessarily sensible as often form validation errors are best handled with other patterns. Validation purposes aside, throwing errors from transforms (especially in dev mode) for malformed data can be an effective way to enforce good habits and prevent sneaky bugs from occurring like integers getting coerced into strings.

Lets address the original question about mapped translations using a transformed field.

### Implementing Mapped Translations Using a Transformed Field

First, lets create a schema and a type to match the data we will have:

```ts
import { withDefaults } from '@warp-drive/schema-record/schema';

const House = withDefaults({
  type: 'house',
  fields: [
    {
      name: 'houseDescription',
      kind: 'field',
      // ^ using 'field' instead of 'attribute' ensures we use
      // the new transformations behavior and not the legacy one.
      type: 'mapped-translation',
      // ^ This declares what transformation to use
    }
  ]
});

type TranslationMap = {
  en?: string;
  es?: string;
};

type HouseRecord = {
  id: string;
  $type: 'house';
  houseDescription: string; // NOT TranslationMap!
};

store.schema.registerResource(House);
```

Now, for the `mapped-translation` implementation.

```ts
import { getOwner } from '@ember/owner';
import { Type } from '@warp-drive/core-types/symbols';

const MappedTranslationTransform = {
  serialize(value: string, options: null, record: SchemaRecord): TranslationMap {
    const lang = getOwner(record).lookup('service:intl').lang ?? 'en';
    return { [lang]: value };
  },
  hydrate(value: TranslationMap, options: null, record: SchemaRecord): string {
    const lang = getOwner(record).lookup('service:intl').lang ?? 'en';
    return value[lang] ?? '';
  },
  [Type]: 'mapped-translation',
};

store.schema.registerTransformation(MappedTranslationTransform);
```

With the above, when we access the `houseDescription` property we get the
correct description for our current language. Whenever the current language changes,
or whenever the cache updates with a new value for houseDescription the value on
our record will recompute.

Whenever we set the property, we update the cache with the new value. However,
in this approach the mutation is dangerous:

```ts
return { [lang]: value };
```

This will mean that the mutated state in the cache will lose any other languages that
had values. In some cases, this may be desired, but if we wanted to patch just the one
language we'd need a bit more info.

The downside of the transformation approach is that we don't give the schema for the field
being operated on to the serialize or hydrate methods. This was by design to avoid folks
getting too creative inside of transformations, though in a scenario like this it might be useful.

Lets say the options arg gave you access to the field-schema instead of just fieldSchema.options. Then we could do a merge in the cache during serialization to avoid removing other languages. We could also do this by duplicating a small amount of field information in the schema definition.

```ts
import { recordIdentifierFor } from '@ember-data/store';
import { getOwner } from '@ember/owner';
import { Type } from '@warp-drive/core-types/symbols';

const MappedTranslationTransform = {
  serialize(value: string, field: FieldSchema, record: SchemaRecord): TranslationMap {
    const owner = getOwner(record);
    const cache = owner.lookup('service:store').cache;
    const identifier = recordIdentifierFor(record);
    const lang = owner.lookup('service:intl').lang ?? 'en';
    const currentValue = cache.getAttr(identifier, field.name);

    return Object.assign({}, currentValue, { [lang]: value });
  },
  hydrate(value: TranslationMap, field: FieldSchema, record: SchemaRecord): string {
    const lang = getOwner(record).lookup('service:intl').lang ?? 'en';
    return value[lang] ?? '';
  },
  [Type]: 'mapped-translation',
};

store.schema.registerTransformation(MappedTranslationTransform);
```

Perhaps with time and feedback this is a restriction we will lift. The primary reason this restriction was put in place is to try to prevent transformations that compute off of additional fields, as this can lead to difficult to reason about differences between what the record presents and what is in the cache.

A bit of friction to steer folks the right way by default ... but with a work around via padding additional info into options if the correct course is to steer against the stream.

Ok, so now for the `alias` approach.

### Aliased Fields

An AliasField can be used to alias one key to another key present in the cache version of the resource.

Unlike DerivedField (which we will see next), an AliasField may write to its source when a record is in an editable mode.

AliasFields may utilize a transformation, specified by type, to pre/post process the field.

An AliasField may also specify a `kind` via options. `kind` may be any other valid field kind
other than:
 - `@hash`
 - `@id`
 - `@local`
 - `derived`

This allows an AliasField to rename any field in the cache.

Alias fields are generally intended to be used to support migrating between different schemas, though there are times where they are useful as a form of advanced derivation when used with a transform.

For instance, an AliasField could be used to expose both a string and a Date version of the
same field, with both being capable of being written to.

### Implementing Mapped Translations Using an Aliased Field

In the alias approach, you retain exposing two fields like the original Model had, and you still write the transformation described above. The primary advantage is retaining access to the original field.

Here are our new House schema and types.

```ts
import { withDefaults } from '@warp-drive/schema-record/schema';

const MappedTranslationObject = {
  type: 'mapped-translation-object',
  identity: null,
  // ^ resource schemas with no identity field are used to describe reusable
  // data structures contained within our primary resource types
  fields: [
    { name: 'en', kind: 'field' },
    { name: 'es', kind: 'field' }
  ]
};

const House = withDefaults({
  type: 'house',
  fields: [
    {
      name: 'houseDescription',
      kind: 'schema-object',
      type: 'mapped-translation-object',
      // ^ this means the resource-schema for this object is 'mapped-translation-object'
    },
    {
      name: 'description',
      kind: 'alias',
      type: null,
      options: {
        kind: 'field',
        name: 'houseDescription',
        // ^ means this field will source its data from the field right above
        type: 'mapped-translation',
        // ^ means this field will use the transform we defined before
      }
    }
  ]
});

type TranslationMap = {
  en?: string;
  es?: string;
};

type HouseRecord = {
  id: string;
  $type: 'house';
  houseDescription: TranslationMap;
  description: string;
};

store.schema.registerResources([House, MappedTranslationsObject]);
```

This works exactly the same as the transformation approach except now we use `record.description` to get the description in the currently active language and can still access and update `houseDescription` directly.

One advantage of this is that because `houseDescription` is a `schema-object`, mutating it instead of `description` is both deeply-reactive and granular (the cache knows how to perform and store deep changes to schema-objects).

Finally, the derivation approach:

### Derived Fields

A DerivedField is a field whose value is derived
from other fields in the schema.

The value is read-only, and is not stored in the cache,
nor is it sent to the server.

Usage of derived fields should be minimized to scenarios where the derivation is known to be safe. 

For instance, derivations that required fields that are not always loaded or that require access to related resources that may not be loaded should be avoided.

### Implementing Mapped Translations Using a Derived Field

```ts
const MappedTranslationObject = {
  type: 'mapped-translation-object',
  identity: null,
  fields: [
    { name: 'en', kind: 'field' },
    { name: 'es', kind: 'field' }
  ]
};

const House = withDefaults({
  type: 'house',
  fields: [
    {
      name: 'houseDescription',
      kind: 'schema-object',
      type: 'mapped-translation-object',
    },
    {
      name: 'description',
      kind: 'derived',
      type: 'mapped-translation'
      // ^ the name of our derivation
      // this is not our transformation from before,
      // we will define this below
      options: { field: 'houseDescription' }
  ]
});
```

You'll notice that the above looks a lot like the alias approach. The main difference is that alias fields can be mutated, derived fields can never be set. 

And here's what that derivation would look like:

```ts
import { getOwner } from '@ember/owner';
import { Type } from '@warp-drive/core-types/symbols';

function mappedTranslation(
  record: SchemaRecord & { [key: string]: unknown },
  options: Record<string, unknown> | null,
  _prop: string
): string {
  if (!options?.field) throw new Error(`options.field is required`);

  const opts = options as { field: string };
  const lang = getOwner(record).lookup('service:intl').lang ?? 'en';

  return record[options.field][lang] ?? '';
}
mappedTranslation[Type] = 'mapped-translation';

store.schema.registerDerivation(mappedTranslation);
```

## Parting Thoughts

You can write a Derivation that gives you access to services, but it is generally something I would avoid except for key-data-concerns. 

key-data-concerns might be things like:

- the intl service for use by derivations or transforms
- a clock service for use by time based derivations or transforms

But I would not do something like give the record access to a Store or Request service. Side-effects and Async in particular are things to avoid in Derivations.

If you keep to a few well-thought-out Transformations and Derivations you can go far and fast, but if you try to put tons of unique computations onto your records, you will find it intentionally frustrating.

The point is to steer you into putting these calculations into more correct locations in your code.

That said, translations like in the above example are a great use-case for using them because they have high utility and reusability across both fields and resource types and perform relatively simple calcs.

A side-effect of this pattern that is valuable for some apps is that Transformations and Derivations follow a contract and pattern simple and descriptive enough that it lets them cross the client/server boundary. If your API provides your schemas and your data, it follows that it could use them to make the same derivations when needed (say for creating a PDF report or CSV export).

A curious footnote to this discussion, Transformations and Derivations may not remain the only way to customize SchemaRecord: there is a [proposal](https://github.com/emberjs/data/issues/9534#issue-2534328361) being floated to allow apps to also define what kinds of fields are valid.

Currently, each field "kind" (`schema-object`,`field`,`derived`,`collection` etc.) is implemented as a function following a nearly identical signature. It feels like a natural progression of the schema-verse to allow registering `Kind` functions just like you can register Derivations and Transformations, continuing our theme of small composable primitives.

Constrained. But Powerful.


---

---
title: Exploring Advanced Request Handlers in WarpDrive
published: true
---

# Exploring Advanced Request Handlers in WarpDrive

[WarpDrive](https://warp-drive.io) provides applications with a managed fetch pipeline
following the chain-of-responsibility principle. When a request is issued it triggers the
registered pipline.

Pipelines can be simple, for instance below is the setup for a pipeline that just calls
fetch with minimal processing.

```ts
const manager = new RequestManager()
  .use([Fetch]);
```

> **TIP**
>
> For a good introduction to managed fetch in WarpDrive, read [this post](https://runspired.com/2024/01/31/modern-ember-data.html) about modern request paradigms in EmberData (WarpDrive is the modern evolution of EmberData).

Most often, handlers should be simple. Providing minimal decoration for universal responsibilities
like setting up authentication tokens or adding tracing for observability tooling.

```ts
const API_ROOT = `https://${location.hostname}/api/`;

function isOwnAPI(url: string): boolean {
  return url.startsWith(API_ROOT) || url.startsWith('/');
}

function decorateOwnRequest(session, request) {
  const headers = new Headers(request.headers);
  headers.set('X-Amzn-Trace-Id', `Root=${crypto.randomUUID()}`);

  const token = session?.token;
  if (token) {
    headers.set('token', token);
  }

  return Object.assign({}, request, { headers });
}


export class AuthHandler {
  constructor(sessionService) {
    this.session = sessionService;
  }

  async request({ request }, next) {
    if (!request.url || !isOwnAPI(request.url)) {
      return next(request);
    }

    return next(decorateOwnRequest(request));
  }
}
```

In even this simple example, we can start to see the rumblings of why handlers can be advanced:

- Requests passed to handlers are immutable, and so `decorateOwnRequest` generates a new request
from the original to apply the additional headers.
- requests have the ability to see the result of calling `next` (this is why we return the result of the call).
- next can be called with a different request than the handler received

There's a fourth feature of handlers thats less obvious: a handler can call `next` as many times
as it wants, but it can only return a single response.

These four features – immutability, access to the response, ability to pass along a different request,
and the ability to call `next` any number of times – work together to allow applications to build highly
advanced handlers to  fulfill requests however they best see fit.

Below, lets dive into two such advanced handlers that I recently worked on: a `pagination engine` and
a `recommendation engine`.

## Implementing a Pagination Engine

When using [{JSON:API}](https://jsonapi.org/format/#fetching-pagination), pagination is implemented using
links at the top level of the response which describe where to get other pages of data related to the
current response.

```json
{
  "links": {
    "self": "https://example.com/api/users",
    "prev": null,
    "next": "https://example.com/api/users?page[offset]=25&page[limit]=25",
    "first": "https://example.com/api/users?page[offset]=0&page[limit]=25",
    "last": "https://example.com/api/users?page[offset]=75&page[limit]=25"
  },
  "data": [
    // ... list of users ... //
  ]
}
```

WarpDrive adopted this convention as part of its Cache API. When a cache receives a request, it returns a
"response document" that describes what it found in the content for that request. While the cache does not
need to be in [{JSON:API}](https://jsonapi.org/format/#fetching-pagination) format, this response document
needs to be in a universal format and so WarpDrive adopted the top-level structure from [{JSON:API}](https://jsonapi.org/format/#fetching-pagination)
to use due to its expressiveness.

When the WarpDrive Store creates a reactive wrapper for this response document, it exposes utility methods
for working with the request. For instance, to fetch the next page, we can call `next`

```ts
const { content: currentPage } = await store.request({ url: '/api/users' });
const { content: nextPage } = await currentPage.next();
```

This feature allows applications to construct advanced pagination logic in a highly conventional
manner by abstracting the mechanics of pagination as an unimportant detail of the underlying request,
but it seemingly breaks down if an API does not provide pagination links 🙈

Handlers to the rescue!

Our PaginationEngine is going to process our requests for two separate scenarios:

- GET based pagination using queryParams
- POST based pagination using params in the body (for QUERY via POST semantics)

For this example, lets assume our `GET` endpoints (e.g. `GET /api/users`) accept
the params `limit` and `offset` and in the response meta we receive back this
limit, offset and total:

```ts
{ meta: { total: number; limit: number; offset: number; } }
```

Lets assume our `POST` endpoints (e.g. `POST /api/users`) accepts the same `limit` and `offset`
top level, e.g.

```ts
await fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify({ limit: 25, offset: 0 })
}).toJSON();
```

In both cases, we assume that other parameters unrelated to pagination may be present. Let's dive
into a implementing the simpler `GET` case first.

```ts
const API_ROOT = `https://${location.hostname}/api/`;

function isOwnAPI(url: string): boolean {
  return url.startsWith(API_ROOT) || url.startsWith('/');
}

function maybeAddPaginationLinks(request, doc) {
  if (doc.content.meta?.total) {
    const links = doc.content.links = doc.content.links ?? {};
    const { limit, offset, total } = doc.content.meta;
    const originalUrl = new Url(request.url);
    
    // add current
    originalUrl.queryParams.set('limit', limit);
    originalUrl.queryParams.set('offset', offset);
    links.self = String(originalUrl);

    // add first
    if (offset === 0) {
      links.first = links.self;
    } else {
      originalUrl.queryParams.set('offset', 0);
      links.first = String(originalUrl);
    }

    // add prev
    if (offset > 0) {
      originalUrl.queryParams.set('offset', offset - limit);
      links.prev = String(originalUrl);
    } else {
      links.prev = null;
    }
    
    // add next
    if (offset + limit < total) {
      originalUrl.queryParams.set('offset', offset + limit);
      links.next = String(originalUrl);
    } else {
      links.next = null;
    }

    // add last
    const lastOffset = (Math.ceil(51 / 25) - 1) * limit;
    originalUrl.queryParams.set('offset', lastOffset);
    links.last = String(originalUrl);
  }

  return doc;
}

export const BasicPaginationHandler = {
  request({ request }, next) {
    if (!request.url || !isOwnAPI(request.url)) {
      return next(request);
    }

    return next(request)
      .then(doc => maybeAddPaginationLinks(request, doc));
  }
}
```

And that's it! Now our response has the full range of links it can use for pagination
features derived from our params based contract. In many cases, an API may not provide
access to meta like this, but we can use limit and offset information from the original
URL, and provide `null` for the `last` link, allowing cursor based navigation via next/prev
as well as a return to start, which for most features is more than enough.

But what happens when our endpoint requires the use of `POST` ? Let's explore!

For this challenge, we are going to take advantage of the fact that the *first* request
issued by the APP is issued directly (e.g. not via `await currentPage.next()` or similar
but via `store.request({ url: '/users', method: 'POST', body })`).

This gives us a key distinction to make when handling a request

- requests that are the *first* in a series
- requests that are a *continuation* of a series

In this approach we'll want some state for book-keeping so we are going to implement a class
for our handler and store a Map that holds on to a bit of info from first requests that
we will need for a continuation request.

The general strategy is that we generate a link (really just a unique string) that the app can
use to make a `GET` request conceptually that works with `await page.next()`, but switch the
request out for a `POST` request when we encounter the generated link in our handler.

We also need a way to know that a request wants to opt into this pagination behavior,
there's a number of heuristics we could use but for this example we're going to be
explicit and pass an option into the initial request that tells us to make use of this
feature.

```ts
store.request({
  url: '/api/users',
  method: 'POST',
  body: JSON.stringify({ limit: 25, offset: 0 }),
  options: { usePaginationEngine: true }
})
```

```ts
class QUERYPaginationEngine {
  urlMap = new Map();

  request({ request }, next) {
    if (!request.url || !isOwnAPI(request.url)) {
      return next(request);
    }
  
    if (request.options?.usePaginationEngine) {
      return handleInitialRequest(request, next, this.urlMap);
    }

    if (this.urlMap.has(request.url)) {
      return handleContinuationRequest(request, next, this.urlMap);
    }

    return next(request);
  }
}
```

Above, if the request targets our own API and has requested to use the
pagination engine, we handle the request as an "initial" request.

If the url is a url in our url map, we handle it as a "continuation request",
else we pass along this request since we aren't being asked to handle it.

For this blog post I am only going to implement `next` link behavior, though
as with the first `GET` example above we can follow this pattern for every
pagination link we may want.

```ts

function handleInitialRequest(request, next, urlMap) {
  if (request.method !== 'POST') {
    throw new Error(
      `The PaginationEngine handler expects usePaginationEngine to only be used with POST requests`
    );
  }

  return handleRequest(request, next, urlMap);
}

async function handleRequest(request, next, urlMap) {
  const identifier = request.store.identifierCache.getOrCreateDocumentIdentifier(request);
  if (!identifier) {
    throw new Error(
      'The PaginationEngine handler expects the request to utilize a cache-key, but none was provided',
    );
  }

  const response = await next(request);
  const nextLink = `{@psuedo-link:next}//${identifier.lid}`;

  const links = response.content.links = response.content.links ?? {};
  links.next = nextLink;
  urlMap.set(nextLink, request);

  return response;
}
```

Above, we create a fake url for our "next" link by generating a string that roughly says "I represent the next link for the quest with the following cache-key". Then we key the original request in our map to that
link and move on. (Sidenote: if you want this handler to work with the PersistedCache experiment we will
also need to setup a way to restore this map from cache, this is left for discussion at another time.)

When the app calls `await page.next()`, it will effectively generate the request:

```ts
store.request({
  method: 'GET',
  url: `{@psuedo-link:next}//${identifier.lid}`
})
```

When we see this link in the handler, we invoke `handleContinuationRequest`.

```ts
async function handleContinuationRequest(request, next, urlMap) {
  const requestInfo = urlMap.get(request.url);
  const upgradedRequest = buildPostRequest(request, requestInfo);

  return handleRequest(upgradedRequest, next, urlMap);
}

function buildPostRequest(request: StoreRequest, parentRequest: PaginatedRequestInfo): StoreRequest {
  const { url } = parentRequest;

  const overrides: Record<string, unknown> = {
    url,
    method: 'POST',
  };

  if (parentRequest.headers) {
    const headers = new Headers(parentRequest.headers);
    request.headers?.forEach((value, key) => headers.set(key, value));
    overrides.headers = headers;
  }

  // update the offset
  const body = JSON.parse(parentRequest.body);
  body.offset += body.limit;
  overrides.body = JSON.stringify(body);

  return Object.assign({}, request, overrides);
}
```

And there we have it, our POST based API convention now plays along seamlessly with the
simpler mental model of calling `await page.next()` on any collection.

## Implementing a Recommendation Engine

On the surface, it seems like WarpDrive's managed fetch pipeline treats requests as 1:1
with a call to an API endpoint or a query on some other source (like a local database).

But the reality is more nuanced: WarpDrive thinks about requests as 1:1 with a response. 

Catch that? The nuance is very subtle. Possibly imperceptible.

It helps to explore this via a real world example.

Lets say you want to request options for a select, and in that list of options you also
want to include a few "recommended" options near the top that based on some criteria are
more likely to be what the user is searching for.

The naive way of implementing this is as two requests, one for options (perhaps filtered
and sorted) and another for recommendations. Then in the app we splice the two arrays
together and pass them into our select component.

Its not bad, but it is often a lot of work to transform the shapes of the two responses into
the same shape, and doing so defeats much of the power of using reactive cache-driven resources.

Taking a step back though we see that while we have two requests, conceptually we really have
just one "request" for options with recommendations and one "response" or result being the
merger of these.

Lets implement a handler that understands this requirement, and does so in a way that any
request can make a "recommendations" request alongside the "options" request.

For this example, we'll assume we have two endpoints:

- `POST /api/recommendations` which returns recommendations for resources of type `<entity>` in [{JSON:API}](https://jsonapi.org/format/#fetching-pagination) format.
- `GET /api/<entity>` which returns a page of results of resource type `<entity>` in [{JSON:API}](https://jsonapi.org/format/#fetching-pagination) format

When we receive a request that wants to also fetch recommendations, we'll issue two
requests and "mux" (combine) the response.

Unlike above where we used `options` to pass the `usePaginationEngine` flag to the handler
to activate it, here we are going to use a header (`X-Include-Recommendations`) and check
for the value `'fetch'`. We're implementing it this way so that later we can refactor our
API itself to accept this header as a way to know call our recommendations service to
generate recommendations for the request and include them in the response.

In this way, handlers can function to ponyfill how we want our API to behave even
before we've had the time or ability to do so.

  
```ts
function shouldMakeRecommendationsRequest(request) {
  return request.headers?.get('X-Include-Recommendations') === 'fetch';
}

function invokeAndProcessMuxSuccess(request, next) {
  // ... implemented below later ... //
}

const RecommendationsHandler = {
  request({ request }, next) {
    if (!request.url || !isOwnAPI(request.url)) {
      return next(request);
    }

    if (shouldMakeRecommendationsRequest(request)) {
      return invokeAndProcessMuxSuccess(request, next);
    }

    return next(request);
  }
}
```

In order to split our request into two requests we need a bit of extra data for
the body of the request to send to our recommendations service. For this we will
use `request.data.recommendations` to provide the additional options.

```ts
function invokeAndProcessMuxSuccess(request,next) {
  const recommendationsRequest = buildRecommendationsRequest(request);
  const dataPromise = next(request);
  const recPromise = next(recommendationsRequest);

  return Promise.allSettled([recPromise, dataPromise]).then(
    ([recs, data]) => {
      // if data request errors, we error
      if (data.status === 'rejected') {
        throw data.reason;
      }

      // if ML request errors, we return data
      if (recs.status === 'rejected') {
        return data.value;
      }

      // if both succeed, we combine them into one response
      return combineWithResult(data.value.content, recs.value.content);
    },
  );
}

function buildRecommendationsRequest(request) {
  const body = JSON.stringify(
    Object.assign({ limit: 5 }, request.data.recommendations)
  );
  
  const url = buildBaseURL({ resourcePath: 'recommendations/match' });
  const cacheKey = `${url}::${body}`;

  return {
    url,
    method: 'POST',
    options: {
      key: cacheKey,
    },
    headers: new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.api+json',
    }),
    body,
  };
}

function combineWithResult(primaryData, recs) {
  const meta = Object.assign({}, primaryData.meta, { ml: recs.meta });
  const included = primaryData.included.concat(recs.included);
  const data = recs.data.concat(primaryData.data);
  const links = primaryData.links ?? {};

  return {
    meta,
    links,
    data,
    included
  };
}
```

And finally, what does using this look like in practice?

```ts
const options = await store.request({
  method: 'GET',
  url: '/api/users',
  headers: new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.api+json',
    'X-Include-Recommendations': 'fetch'
  }),
  data: {
    recommendations: {
      // various inputs for generating the recommendations
      type: 'user',
      limit: 3,
      context: 'control-tester'
    }
  }
});
```

Now, lets sugar this!

Builders are great for sugar because on top of enabling easy reuse of common requests
they can compose with each other to decorate requests.

For the request above, we might use the `query('user')` as our base.

```ts
import { query } from '@ember-data/json-api/request';
```

Then write a simple builder that decorates our query requests:

```ts
function withRecommendations(queryInit, payload) {
  queryInit.headers.set('X-Include-Recommendations', 'fetch');
  queryInit.data = queryInit.data || {};
  queryInit.data.recommendations = payload;

  return queryInit;
}
```

And then to use it:

```ts
const options = await store.request(withRecommendations(query('user'), {
  type: 'user',
  limit: 3,
  context: 'control-tester'
}));
```

Enjoy!


---

---
title: Thinking In Derivation
published: true
draft: true
---

this is a post about handling asyncronous flows in a derived manner instead
of an imperative manner.

pull-based rendering = derived
push-pased action responses = imperative

while we're specifically talking about the patterns WarpDrive encourages apps
to use with Ember, this topic transcends both WarpDrive and Ember and applies
to all frameworks, especially those utilizing reactive signals.

one of the reasons that WarpDrive only needs computed and signal from the TC39 spec
and does not require either effects or relay is that while we support imperative
code, we enable all work to be done in a reactive derived manner.

Further, we actively want to steer apps away from async computeds and feel
such a primitive would be an unmitigated disaster https://github.com/tc39/proposal-signals/issues/30 
representing the totality of the worst-parts of javascript and EmberData historically.

This was the underlying message of the introduction of the methods and components
for Reactive Control Flow.

some of the thoughts I want to summarize are available here: https://discord.com/channels/480462759797063690/1335930918229246003/1335930918229246003 

I would like for this post to primarily target the ember audience and answer questions
like

- how do I do this without EmberConcurrency
- how do I do this without resources
- how do I do this without async/await

`<Request />` is like if the best parts of react suspense, tanstack/query, relay and EmberData
all got together and gave birth to the most beautiful child ever conceived.




---



---

