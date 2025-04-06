Welcome to this interactive Glimmer/Ember tutorial.
Through these pages, you'll learn how to be effective and proficient in the reactivity, syntax, and component patterns that Ember and Glimmer provide.

This is an unofficial set of tutorials and is maintained by the community.
The [official guides][ember-guides] provide an excellent [tutorial][ember-tutorial] for building a real app, starting from scratch.

The format of this tutorial is _heavily_ inspired by the [Svelte tutorial][svelte-tutorial].

[ember-guides]: https://guides.emberjs.com/release/
[ember-tutorial]: https://guides.emberjs.com/release/tutorial/part-1/
[svelte-tutorial]: https://svelte.dev/tutorial/basics

<div style="padding: 0.5rem 2rem; font-style: italic;">

[Get started →](/1-introduction/2-adding-data)  
And skip the rest of this introduction 🎉

 </div>

## What are these words?

[glimmer-home]: https://glimmerjs.com/
[ember-home]: https://emberjs.com/
[wiki-repl]: https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop

### Glimmer

Glimmer is a family of utilities for making "fast and light components for the web".
It consists of the novel reactivity system and primitives, a component library, and a renderer for those primitives.
[Website][glimmer-home] here.

### Ember

Ember is "A framework for ambitious web developers", and builds on top of Glimmer, providing additional app/SDK abstractions for reducing the menial differences between apps. It consists of a well integrated test framework, router, state-management, tutorials, thorough documentation, and incremental improvements to help not leave the ecosystem behind as JavaScript evolves.
[Website][ember-home] here.

### Limber

Limber is a [REPL][wiki-repl] that aims at providing an easy way to share code examples, samples, and reproductions for both the GlimmerJS (`.gjs`) file format as well as interactive documentation authoring via mixing in GlimmerJS on top of markdown.

## How to use this tutorial

This tutorial focuses on GlimmerJS, the syntax, and concepts needed to maximize productivity.
It'll be necessary to have a basic understanding of HTML and JavaScript.

The tutorial includes mini exercises that are designed to demonstrate various features and patterns.
The later chapters in the tutorial build upon the knowledge acquired in the earlier chapters,
so it is recommended to progress sequentially from the beginning to the end.
The dropdown menu above can be used for navigation if needed.

Each tutorial chapter includes a 'Show me' button that can be used if you encounter difficulties.
However, manually typing in the editor for each example is a more effective way to learn and enhance your skills -- but also there is no shame in asking for help!

On smaller screens, there is a button in the bottom right of the screen so that slides the tutorial text out of the way so that the editor can be interacted with.

<p class="call-to-play">
  Callouts like these will be present in tutorials to guide focus, and be clear about what you're expected to do in a particular exercise.
</p>

This entire app is generated from [the docs folder][the-docs] and content can be edited, previewed, and created all within the GitHub UI. No need to download or install anything to contribute.

[the-docs]: https://github.com/NullVoxPopuli/limber/tree/main/apps/tutorial/public/docs

## What are components?

Components are a meta-building block which packages the native primitives, allowing for easier re-distribution of a specific configuration of those primitives.
The primitives in Glimmer/Ember are:

- Values (aka cells aka signals)
- Resources
- Functions
- Modifiers
- Elements


A component may include 1 or more of these primitives and is "invoked" with angle-brackets, e.g.: `<MyComponent />`

## What if I'm not using `<template>` syntax in my projects yet?

If you're an existing ember/glimmer user and are not yet using `<template>`, there is a transformation you can do to adapt the examples in this tutorial to the pre-`<template>` times by using the following guidelines:

- For any lone `<template>`, this is a template-only component.
- For any `<template>` within a `class`, this would be equivalent to a js + hbs component (two-file, colocated, or class component).
- For any files with multiple `<template>`s in them, they will need to be multiple components.
- Any reference to a local variable without `this` will need to be defined or aliased within a class component (this is supported since `ember-source@3.25` and looks like this:

  ```js
  // app/components/my-demo.js
  // ...
  import Something from 'somewhere';

  let definedInModuleSpace = () => {};

  export default class MyDemo extends Component {
    definedInternally = () => {};

    // the aliases, read as: [localClassProperty] = value;
    definedInModuleSpace = definedInModuleSpace;
    Something = Something;
  }
  ```

  ```hbs
  {{! app/components/my-demo.hbs }}

  {{#let (this.definedInternally) as |result|}}
    <this.Something @foo={{this.definedInModuleSpace}} />
  {{/let}}
  ```

  For more information on "using anything as values", see [these docs](https://guides.emberjs.com/release/in-depth-topics/rendering-values/)


## Why does the tutorial use `cell`?, I'm not using that in my projects.

Not to worry!, `@tracked` is not going away. `cell`s are a fundamental primitive of reactivity as no reactive state can exist without them.  

Whether the reactive system be [Signals][Signals], [Runes][Runes], or [`@tracked`][tracked], all systems rely on **the access or setting of properties on an object**. 

`cell`s came about as a means to take the behavior of `@tracked` and use it _anywhere_. In fact, `@tracked` could even be thought of as abstracting away a `cell` where the **access or setting of properties** occurs on the `this` object. 

Once the tutorial gets to class-components, those will be the primary form of examples going forward, as Ember has solved class ergonomics in JavaScript, and the experience using classes is quite good.
However, because there are a number of more foundational concepts to cover, this tutorial does not _start_ with classes, so that the focus of each chapter can be the foundational concepts, rather than also learning class syntax.

**Make Note**, it is typically bad practice to store state at the _module-level_ in production applications. (but doing things proper can be a distraction from teaching concepts).  
**For Library Authors** (and folks authoring library code in apps), the API of a `cell` should not be exposed to your users (as both input and output) as it is an implementation detail.

[Signals]: https://www.solidjs.com/tutorial/introduction_signals
[Runes]: https://svelte.dev/blog/runes 
[tracked]: https://guides.emberjs.com/release/components/component-state-and-actions/#toc_tracked-properties

## How do I get started with a bleeding-edge Ember app today?

- For Webpack:
  ```bash
  git clone --branch webpack git@github.com:NullVoxPopuli/polaris-starter.git 
  cd polaris-starter
  pnpm install
  pnpm start
  ```
  Or try it out on [Stackblitz](https://stackblitz.com/github/nullVoxPopuli/polaris-starter/tree/webpack?file=README.md) (however, Stackblitz may be [broken with Webpack](https://github.com/stackblitz/core/issues/2926) atm)

- For Vite (alpha / unstable)
  ```bash
  git clone git@github.com:NullVoxPopuli/polaris-starter.git 
  cd polaris-starter
  pnpm install
  pnpm start
  ```
  Or try it out on [Stackblitz](https://stackblitz.com/github/nullVoxPopuli/polaris-starter/tree/main?file=README.md)



---

A component that renders some static markup isn't very interesting.
Let's add some data.

First, define a local variable:

```gjs
let name = "World";

<template>
  <h1>Hello World</h1>
</template>
```

Then, we can refer to `name` in the markup:

```hbs
<h1>Hello {{name}}</h1>
```

Inside the curly braces, we can put any _reference_ we want.


---

A function can transform any data from a template.

Let's try defining a function

```gjs
let name = "world";
let shout = (text) => text.toUpperCase();

<template>
  <h1>Hello {{name}}</h1>
</template>
```

Then, we can call that function

```hbs
<h1>Hello {{(shout name)}}</h1>
```

We use wrapping `( )` to signify that that we are invoking a function with arguments.
The `( )` are needed to disambiguate between rendering values, `{{foo}}`, and invoking functions: `{{ (foo) }}`.
However, when there are arguments passed, there is no longer an ambiguity, and the `( )` are no longer needed.

So you could write the above call to the function, `shout`, like this:
```hbs
<h1>Hello {{shout name}}</h1>
```


---

Functions can be chained together, just like in other languages

Define another function

```gjs
let name = "world";
let shout = (text) => text.toUpperCase();
let reverse = (text) => text.split('').reverse().join('');

<template>
  <h1>Hello {{ (shout name) }}</h1>
</template>
```

Then, we can chain the function:

```hbs
<h1>Hello {{(reverse (shout name))}}</h1>
```

Unlike JavaScript, Ember and Glimmer templates use [Polish Notation][polish] or
_Prefix Notation_ which means that functions _precede_ their arguments.
This simple language allows templates to be transformed into lightweight JSON
objects to save bytes during network transfer and time during the browser's
parse and evaluation phases. For more information, see this [announcement video][secrets]

[polish]: https://en.wikipedia.org/wiki/Polish_notation
[secrets]: https://www.youtube.com/watch?v=nXCSloXZ-wc


---

Similarly as data can be renderd within curly braces, curly braces can be used to control the values of element attributes.

Let's create an image with dynamic `src` and `alt` attributes.

```hbs
<img src={{gifURL}} />
```

In a real dev environment, you'll be required to specify an `alt` description.
Without the `alt` description, users with slow or unstable internet connections,
may not be able to download the image -- users who rely on screen readers won't be able to view the image either.  
Defining the `alt` description solves these problems.
More information about this requirement is described on [the linter docs][gh-etl-alt].

```hbs
<img src={{gifURL}} alt={{description}} />
```

[gh-etl-alt]: https://github.com/ember-template-lint/ember-template-lint/blob/b4433e9439f3c555b3c4beb56c34bfed18a423b5/docs/rule/require-valid-alt-text.md


---

For example, retrieving data from [`localStorage`][mdn-LocalStorage] may be done like this:

```hbs
{{localStorage.getItem 'the-key'}}
```

And likewise, if we have data we need to format with [`JSON.stringify`][mdn-json-stringify], that would look like:

```hbs
<pre><code>{{JSON.stringify data null '\t'}}</code></pre>
```

The same [polish][polish] notation we used early applies to all globally available functions -- so the above `stringify` call would look like this, if in JS: `JSON.stringify(data, null, "\t")`

Note that due to how polish notation reads, it's _highly encouraged_ to extract one-off utility functions instead of wrapping more functions in the template.

For example:

```gjs
function formatFromStorage(key) {
  let stored = localStorage.getItem(key);
  let parsed = stored ? JSON.parse(stored) : {};

  return JSON.stringify(parsed, null, '\t');
}

<template>
  <pre><code>{{formatFromStorage "the-key"}}</code></pre>
</template>
```

Since templates are the _source of truth_ for what is visible to users, it's useful to make them as readable as possible. An extra advantage here is that the extracted functions can more easily be unit tested.

[mdn-Window]: https://developer.mozilla.org/en-US/docs/Web/API/Window
[mdn-LocalStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[mdn-json-stringify]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[polish]: https://en.wikipedia.org/wiki/Polish_notation


---

`RemoteData` is a utility `Resource` from [ember-resources][gh-resources]
that provides an easy way to interact with [`fetch`][mdn-fetch]
with a pre-wired [`AbortController`][mdn-AbortController].

`RemoteData` has two supported uses,

- from a template

  ```hbs
  {{#let (RemoteData '...url...') as |request|}}
    isLoading:
    {{request.isLoading}}
    data:
    {{request.value}}
  {{/let}}
  ```

- or within a stateful component class

  ```gjs
  class Demo extends Component {
    @use request = RemoteData(() => `... url ... `);

    <template>
      isLoading: {{this.request.isLoading}}
      data: {{this.request.value}}
    </template>
  }
  ```

In this example, the fetching of data from the [StarWars API][swapi]
should occur automatically based on changes to the url passed to `RemoteData`.
You can change the `id` of the Person in the text field to fetch from the StarWars API.

Docs for `RemoteData` can [be found here][docs-remote-data].
Information about how Resources fit in to the next edition of Ember can be [found here][polaris-reactivity]

[gh-resources]: https://github.com/nullvoxpopuli/ember-resources
[mdn-fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
[mdn-AbortController]: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
[docs-remote-data]: https://ember-resources.pages.dev/modules/util_remote_data
[polaris-reactivity]: https://wycats.github.io/polaris-sketchwork/reactivity.html
[swapi]: https://swapi.tech/


---

The `keepLatest` utility resource allows you to hang on to a stable reference to data while new data loads.

This can be useful for improving user experience across sites with data that takes some time to fetch or just paginated data in general.

_Typically, users don't want to see the UI flashing a bunch of different states_.
The more stable we can keep the UI, and defer to subtle / polite indicators of progress, the better. We are kinder to the visual stimulous we put our users through.

`keepLatest` _only_ works in a class for now, but it looks like this:

```js
class Demo extends Component {
  @use request = RemoteData(() => urlFor(this.id));
  @use latest = keepLatest({
    value: () => this.request.value,
    when: () => this.request.isLoading,
  });

  // ...
}
```

And this is read as "Keep the latest `value` from changing `when` `this.request.isLoading`.
During an initial request `latest` will be null, and for all subsequent requests, it'll be whatever the the value of `request`'s most recent successful value was.

In this exercise, wire up the `keepLatest` utility so that when the `id` changes, triggering `RemoteData` to make a new request, the async loading state is subtle.


---

State can be shared between components without explicitly passing the state to each componeent.
This can is one way in which _[prop-drilling][prop-drilling]_ can be avoided.

In Ember/Glimmer, we lean on the native capabilities of browsers to manage state, and this often takes the form of a `class` for helpfully encapsulating related behaviors.

```js
class Count {
  @tracked value;

  decrement = () => this.value--;
  increment = () => this.value++;
}

let count = new Count();
```

Note that the only framework-specific instrumentation that we need is the `@tracked` decorator.

We can the use this `count` immediately in our components:

```hbs
<button {{on 'click' count.increment}}>
  Increment (+)
</button>
```

In the provided example, implement `increment`, `decrement`, and `reset`.

In a real app, these components could all live in separate files and import the `count`.

[prop-drilling]: https://kentcdodds.com/blog/prop-drilling


---

[`localStorage`][mdn-localStorage] is a way to store string-based data outside your application so that it may be accessed later. This data will persist between refreshes, so it could be useful for restoring user data when they navigate away from your app and come back later.

To use `localStorage`, and maintain reactivity, you'll need to manage a local reactive value, as well as utilize the `localStorage` APIs.

```js
class Demo extends Component {
  @tracked _count = 0;

  get count() {
    let fromStorage = parseInt(localStorage.getItem('count')) ?? 0;
    return this._count || fromStorage;
  }
  set count(value) {
    localStorage.setItem('count', value ?? 0);
    this._count = value;
  }
}
```

This technique uses the native [get][mdn-get] and [set][mdn-set] behaviors of JavaScript, allowing you to (in a way), intercept how `_count` gets read and set. This is similar to how `@tracked` works under the hood with the reactive value primitives.

This tutorial does not (yet) store your in-progress work, so go-ahead and click the "show me" button below, click the button in the output pane a few times, and refresh the page.

[mdn-localStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[mdn-get]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
[mdn-set]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set


---

A reactive value is an object representing a value with some utility methods for updating that value.

```gjs
import { cell } from 'ember-resources';

const greeting = cell();

<template>
  {{greeting.current}}
</template>
```

In this particular example, we use the [`cell`][gh-cell] primitive from [ember-resources][gh-resources].  
`cell` provides a single property, `current`, that represents the current value.

For this exercise, **change the value after 3 seconds have passed after render**.

`cell` has several update methods that could be used for this task:

- `set` - immediately sets the value of `current`
- `update` - invokes a passed function that receives the previous value and then sets `current` to the return value of that function
- `toggle` - toggles the value between true and false
- and directly setting current via `greeting.current = newValue`

Hint: you may want [setTimeout][mdn-setTimeout].

[gh-cell]: https://github.com/NullVoxPopuli/ember-resources/blob/98ee38186a39097465ca97a90a68b9af158e75b2/ember-resources/src/util/cell.ts#L78
[gh-resources]: https://github.com/NullVoxPopuli/ember-resources
[mdn-setTimeout]: https://developer.mozilla.org/en-US/docs/Web/API/setTimeout


---

Synchronizing state outside of the framework can be common, depending on your application-specific needs.

You've already learned how functions are automatically invoked when they access `@tracked` data (whether directly in a `cell`, or abstracted with the `@tracked` decorator).

So this knowledge can be used to create an auto-tracking side-effect, and we can re-implement the built-in [`{{log}}`][docs-log] helper.

```gjs
const title = cell("hello");

function logInput(...args) {
    console.log(title.current, ...args);
}

<template>
  {{ (logInput "passed" "args") }}
</template>
```

Most importantly, there are some things we should keep in mind when calling functions:
- We don't want to `return` a value, else that value will render - this includes marking the function as `async`, which inherently returns a `Promise`
- `@tracked` data may not be mutated / set in these functions because setting `@tracked` data causes other parts of the UI to re-render, and because functions auto-track, they would detect the change to that tracked-data, and then re-run, setting the data again, causing an infinite rendering loop.
- Functions may often serve a similar purpose to getters as used in class-components: for deriving data.

[docs-log]: https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/log?anchor=log



---

As one might imagine, having to access and manipulating a property can get cumbersome.

If using classes, you could see a pattern develop to try to achieve "native-like" read and write access to properties:

```js
import { cell } from 'ember-resources';

class Demo {
  _value = cell();

  get theProperty() {
    return this._value.current;
  }

  set theProperty(nextValue) {
    return (this._value.current = nextValue);
  }
}
```

This would allow setting / getting of `theProperty`, which is reactive, without the need to know about the underlying reactive implementation. _Except, you'd still have to maintain all of the above code_.

```gjs
const demo = new Demo();

setTimeout(() => {
  demo.theProperty = 2;
}, 500);

<template>
  {{demo.theProperty}}
</template>
```

All of this is abstracted away with a _property decorator_, called `@tracked`, and the above example can be simplified like so:

```js
import { tracked } from '@glimmer/tracking';

class Demo {
  @tracked theProperty;
}
```

This decorator automatically wraps up the getter and setter so that the _reference_ to `theProperty` is reactive, and can be set / updated like normal javascript properties.

**For this exercise, re-write the previous example using `@tracked`**

You'll notice that _for now_ you still have to manage a special object. We'll circle back to that later when we talk about _components_.


---

Deriving values are automatically reactive and allow for CPU-efficient transformation of other values.

For example, "X" is defined as "some transformation" on "Y", is a derived value.

In Glimmer and Ember, it is convention to use a [getter][mdn-get].
Using our previous example:

```js
import { tracked } from '@glimmer/tracking';

class Demo {
  @tracked greeting = 'Hello there!';

  get loudGreeting() {
    return this.greeting.toUpperCase();
  }
}
```

The getter, `loudGreeting` will always be up to date.

Something to watch out for is property assignments in classes,

```js
class Demo {
  @tracked greeting = 'Hello there!';

  loudGreeting = this.greeting.toUpperCase();
}
```

This is explicitly _non-reactive_, because property assignments in classes only happen once.
For more information on class fields, [MDN has good content on the subject][mdn-class-fields].

[mdn-get]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
[mdn-class-fields]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields


---

Plain functions are inherently reactive.
Building off the previous example, call a function that transforms the greeting.

```hbs
 Greeting: {{(shout greeting.current)}}
```

Any time `greeting.current` changes, `shout` will be re-evaluated for you.


---

A resource represents a value which may be derived from state and has cleanup.

For example, a resource can show the current time every second:

```gjs
import { resource, cell } from 'ember-resources';

const Clock = resource(({ on }) => {
  let time = cell(new Date());
  let interval = setInterval(() => time.current = new Date(), 1000);

  on.cleanup(() => clearInterval(interval));

  return time;
});
```

Try rendering the `Clock` like you would any ordinary value:

```gjs
<template>
  It is: <time>{{Clock}}</time>
</template>
```

This `Clock` uses [`setInterval`][mdn-setInterval], which requires that the interval is cancelled when `{{Clock}}` is no longer rendered:

```js
on.cleanup(() => clearInterval(interval));
```

This `on.cleanup` function will be called when `{{Clock}}` is removed from the DOM.

[mdn-setInterval]: https://developer.mozilla.org/en-US/docs/Web/API/setInterval


---

Combining the concepts of reactive functions and resources allow us to build configurable reactive values with cleanup!

Taking the `Clock` example, we can use a resource builder to allow us to configure how we want the time displayed.

```gjs
import { resource, cell, resourceFactory } from 'ember-resources';

function Clock(locale = 'en-US') {
  let formatter = new Intl.DateTimeFormat(locale, {
    // ...
  });

  return resource(({ on }) => {
    let time = cell(new Date());
    let interval = setInterval(() => time.current = new Date(), 1000);

    on.cleanup(() => clearInterval(interval));

    return () => formatter.format(time.current);
  });
}

resourceFactory(Clock);

<template>
  It is: <time>{{Clock}}</time><br />
</template>
```

Try invoking `{{Clock}}` with different arguments:

```hbs

It is:
<time>{{Clock 'ko-KO'}}</time><br />
It is:
<time>{{Clock 'ja-JP-u-ca-japanese'}}</time><br />
```

Learn more about [resourceFactory here](https://github.com/NullVoxPopuli/ember-resources/blob/main/docs/docs/what-is-resourceFactory.md).


[mdn-DateTimeFormat]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat


---

Where resources' real power comes in is the composibility of other resources.

In previous chapters, we've built a clock, which updates every second.
But now let's say we also want to make a Stopwatch, but we only want to manage `setInterval` once, we may want to make a Resource with configurable interval milliseconds, like this:

```js
function Time(ms) {
  return resource(({ on }) => {
    let time = cell(Date.now());
    let interval = setInterval(() => time.current = Date.now(), ms);
  
    on.cleanup(() => clearInterval(interval));
  
    return time;
  })
}
resourceFactory(Time); // declare intent to use in a template
```
Learn more about [resourceFactory here](https://github.com/NullVoxPopuli/ember-resources/blob/main/docs/docs/what-is-resourceFactory.md).

This uses the [`Date.now()`][mdn-date] method which gives us millisecond precision and represents the time in milliseconds since January 1, 1970 00:00:00 UTC (the [epoch][ecma-epoch]).


The `on` object is not the only property we have at our disposal.  We are provided a `use` function that allows us to _use_ other resources.

```js 
function FormattedClock(locale = 'en-US') {
  let formatter = new Intl.DateTimeFormat(locale, { /* ... */ });

  return resource(({ on, use }) => {
    const time = use(Time(1_000));

    return () => formatter.format(time.current);
  });
}
resourceFactory(FormattedClock);
```

This allows us to use the same resource to both make a `Clock` as well as a `Stopwatch`
```js
const Clock = resource(({ on, use }) => {
  let time = use(Time(1_000));
  return time;
});

const Stopwatch = resource(({ on, use }) => {
  let time = use(Time(0));
  return time;
});
```

You could even combine these into a single resource -- `use` can be used as many times as you wish.

```js
const Watch = resource(({ on, use }) => {
  let clock = use(Time(1_000));
  let stopwatch = use(Time(0));

  return {
    get currentTime() {
      return clock.current;
    },
    get currentMs() {
      return stopwatch.current;
    }
  };
});
```


[mdn-date]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
[ecma-epoch]: https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range



---

A modifier, or _element modifier_, is a utility for performing some action on an _element_.

Like resources, modifiers also have cleanup -- and modifiers could be thought of as resource builders that take an element as one of their arguments.

For example, we could apply an animation to an element:

```gjs
import { modifier } from 'ember-modifier';

const intensify = modifier((element) => {
  let animation = element.animate([
    { transform: "translateX(2px)" },
    { transform: "translateY(2px)" },
    { transform: "translateX(-2px)" },
  ], {
    duration: 100,
    iterations: Infinity,
  });

  return () => animation.cancel();
});
```

Try applying the modifier:

```hbs
<div {{intensify}}>
  content
</div>
```

It's important to cleanup a modifier so that state, whether in-app, or in native built-in browser state, doesn't leak.
In this example, the animation in cancelled when the element is no longer rendered.

Full docs for modifiers can be found on the [`ember-modifier`][gh-e-modifier] GitHub.

[gh-e-modifier]: https://github.com/ember-modifier/ember-modifier


---

Components are the collection of the primitives that build higher level UI.

Defining a component is done with `<template>` tags.

In every `gjs` or `gts` file,

```gjs
<template>
  content here
</template>
```

is a syntactical sugar for `export default`, which is also allowed to be written, but is slightly more verbose:

```gjs
export default <template>
  content here
</template>;
```

Multiple components can be defined in one file and assigned to a variable:

```gjs
const NameInput = <template>
  ...
</template>;
```

Components are invoked with `<` and `>` and arguments are passed via `@`-prefixed names.

```hbs
<Greeting @name='Yoda' />
```

_Invoke the ready-made component(s) and pass an argument._


---

Components can have their own encapsulated state by using a [class][mdn-class].
This allows defining and access to reactive state as well as the broader application's global state system (usually dependency injected "services"), if available.

We can refactor the previous example's module-level state to be contained within a class:

```gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class Demo extends Component {
  @tracked myName;

  handleInput = (event) => this.myName = event.target.value;

  <template>
    <NameInput @onInput={{this.handleInput}} />

    <Greeting @name={{this.myName}} />
  </template>
}
```

[mdn-class]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes


---

Since web components are inherently supported by ember, 
we follow the docs exactly with combining previous ideas from this tutorial.

In this chapter, we'll focus on the [Ionic Framework's Toggle][ionic-toggle] component.

Properties in web components are set the same way as on native elements.
```hbs
checked="{{ same value }}"
```
and even though web components can bind to custom events, we can still use the `on` modifier
to easily bind to the toggle component's `ionChange` event.
```hbs
{{on 'ionChange' someHandler}}
```

and putting it altogether, you may end up with something like this:

```hbs
<ion-toggle checked="{{this.isOn}}" {{on "ionChange" this.toggle}}>
  toggle the state!
</ion-toggle>
```

-----------

Note that in this chapter, we're including the ionic toggle from CDN:
```hbs
<script src="https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic.js"></script>
```

in a real app, you may want to import this directly, which may have varying details, based on the web-component library you're using. 
In this case, using `@ionic/core`, [they recommend][ionic-readme]:
```js
import { defineCustomElement } from "@ionic/core/components/ion-toggle.js";
import { initialize } from "@ionic/core/components";

// Initializes the Ionic config and `mode` behavior
initialize();

// or
//  Defines the `ion-toggle` web component
defineCustomElement();
```


[ionic-toggle]: https://ionicframework.com/docs/api/toggle
[ionic-readme]: https://github.com/ionic-team/ionic-framework/tree/main/core#custom-elements-build



---

As seen previously, `on` was used to listen for `click` events on a button.

The `on` modifier can be thought of as an alias for [`addEventListener`][mdn-addEventListener], so anything it can do, `on` can do.

For example, try observing the x / y coordinates of the mouse on this div:

```hbs
<div {{on 'mousemove' handleMouseMove}}>
  The mouse position is
  {{m.x}}
  x
  {{m.y}}
</div>
```

When moving the cursor over the div, the rendered coordinates should update.

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/4.11/classes/Ember.Templates.helpers/methods/on?anchor=on
[mdn-addEventListener]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener


---

DOM event handlers can have [modifiers][mdn-addEventListener] that alter their behavior.
For example, a handler with a `once` modifier will only run a single time:

```hbs
<button {{on 'click' handleClick once=true}}>
  Click me
</button>
```

The full list of modifiers is covered on both [MDN][mdn-addEventListener] and the [Ember API Docs][docs].

- `capture` -- a true value indicates that events of this type will be dispatched to the registered listener before being dispatched to any `EventTarget` beneath it in the DOM tree.
- `once` -- indicates that the listener should be invoked at most once after being added. If true, the listener would be automatically removed when invoked.
- `passive` -- if true, indicates that the function specified by listener will never call `preventDefault()`. If a passive listener does call `preventDefault()`, the user agent will do nothing other than generate a console warning. See [Improving scrolling performance with passive listeners][scroll-perf] to learn more.

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/4.11/classes/Ember.Templates.helpers/methods/on?anchor=on
[mdn-addEventListener]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#parameters
[scroll-perf]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners


---

Event forwarding happens when a component exposes its _element-api_ via `...attributes`

```hbs
<button ...attributes>
  Click me
</button>
```

Then the consumer of this component can add any event listener they wish:

```hbs
<SomeComponent {{on 'click' handleClick}} />
```


---

Components don't do anything special with event handling -- it all uses the built-in features of the browser.

We can use [`dispatchEvent`][mdn-dispatchEvent] with the `on` modifier to both dispatch and handle a custom event.

```js
let customEvent = new Event('my-custom-event');

someElement.dispatchEvent(customEvent);
```

The event listener for `my-custom-event` has to exist somewhere as well.
We can forward the _Element_ api upward with `...attributes`

```hbs
<button ...attributes {{on 'click' handleInnerClick}}>
  Click me
</button>
```

When creating custom Events, you can control if the event bubbles or is cancelable, [see on MDN][mdn-Event].

[mdn-dispatchEvent]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
[mdn-Event]: https://developer.mozilla.org/en-US/docs/Web/API/Event/Event


---

Events can be conditional by combining `if` syntax in _modifier space_.

An important thing to keep in mind when writing conditional modifiers is the wrapping parenthesis:

```hbs
<button {{ (if condition (modifier on 'click' handleClick)) }}>
  Click me!
</button>
```
rather than 
```hbs
<button {{if condition (modifier on 'click' handleClick)}}>
  runtime error! 'if' is not a modifier
</button>
```


This exercise has set up two buttons: one to increment a value when clicked, and one to enable incrementing of that value.

<p class="call-to-play">
Adjust the code so that the toggle clicking button toggles the ability to increment the "Clicked" count.
</p>


---

HTML lacks the ability to express logic, like conditionals, loops, etc.

To render markup conditionally, it involves wrapping it in an if block:

```hbs
{{#if loggedIn}}
  <button {{on 'click' toggle}}>
    Log out
  </button>

{{/if}}

{{#if (notLoggedIn)}}
  <button>
    Log in
  </button>
{{/if}}
```

Try updating the example so that the buttons are conditionally shown based on the `loggedIn` boolean.

---

Note that the syntax for "control flow" is a _pair_ of `{{ ... }}` with the opening `{{ }}` starting with a `#` and the closing `{{ }}` starting with a `/`. This is called "block syntax".

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/if?anchor=if


---

`unless` blocks behave the same as `if` blocks, except the condition is inverted.

For example:

```hbs
{{#unless condition}}
  shows when condition is false
{{else}}
  shows when condition is true
{{/unless}}
```

Try changing the `if` statement to an `unless` statement.

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/unless?anchor=unless


---

Since the two conditions — `if user.loggedIn` and `if (notLoggedIn)` — are mutually exclusive, we can simplify this component slightly by using an else block:

```hbs
{{#if user.loggedIn}}
  <button {{on 'click' toggle}}>
    Log out
  </button>
{{else}}
  <button {{on 'click' toggle}}>
    Log in
  </button>
{{/if}}
```

Note that `{{else}}` is an inconsistency in the syntax. Normally `{{identifier}}` would render a value to the DOM, but in this case, `{{else}}` is a special key word that is only valid within `if` and `unless` blocks.

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/if?anchor=if


---

Multiple conditions can be chained together without indentation or nesting.

```hbs
{{#if (moreThan10 x)}}
  <p>{{x}} is greater than 10</p>
{{else if (lessThan5)}}
  <p>{{x}} is less than 5</p>
{{else}}
  <p>{{x}} is between 5 and 10</p>
{{/if}}
```

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/if?anchor=if


---

Inline if can be useful for inline conditions:

- conditional argument values
- conditional css classes

```hbs
<Demo @background={{if darkMode "#222" "#eee"}} />

or

<div style="background: {{@background}}" class="{{if (isDarkMode @background) 'text-white' 'text-dark'}}">
```

Inline if is not a block-helper, so it does not need the `#` and `/` syntax.

It can be read similarly: `{{if (condition) (value when true) (value when false)}}`

Sometimes it can be hard to read the positional arguments of the inline if, so some folks will format like this:

```hbs
<div
  style="background: {{@background}}"
  class="{{if (isOnDark @background)
              'text-white'
              'text-dark'
         }}"
>
```

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/if?anchor=if


---

Looping over lists of data can be done with an `each` block:

```hbs
<ul>
  {{#each planets as |planet|}}
    <li>
      <a href='https://swapi.tech/api/planets/{{planet.id}}/' target='_blank'>
        {{planet.name}}
      </a>
    </li>
  {{/each}}
</ul>
```

You can get the current index as a second argument as well:

```hbs
<ul>
  {{#each planets as |planet i|}}
    <li>
      <a href='https://swapi.tech/api/planets/{{planet.id}}/' target='_blank'>
        {{i}}
        {{planet.name}}
      </a>
    </li>
  {{/each}}
</ul>
```

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each?anchor=each


---

Like, `each` is for iterating over lists of objects, `each-in` is for iterating over entries within an object.

```hbs
<table>
  {{#each-in planet as |property value|}}
    <tr>
      <th scope='row'>{{property}}</th>
      <td>{{value}}</td>
    </tr>
  {{/each-in}}
</table>
```

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each-in?anchor=each-in


---

By default, when you modify an entry in a list looped over by an `each` block, object-identity equality will be used to optimize the loop. Much like how reactive-values are only reactive via the _reference_ to their value, the content of an `each` loop, per-item, is cached on the reference to the item in the list.

This behavior can be modified, like if a list of data does not contain stable object references.

We can choose a property to watch for changes:

```hbs
<ul>
  {{#each planets key='id' as |planet|}}
    <li>{{planet.name}}</li>
  {{/each}}
</ul>
```

We can observe how the list updates the DOM by seeing how function invocations occur within the `each` loop.


---

`let` blocks allow defining an alias to other data.

```hbs
{{#let 'hello there' as |greeting|}}
  {{greeting}}
{{/let}}
```

This is particularly useful when transformed data needs to be used in multiple places

```hbs
{{#let (upper 'hello there') as |greeting|}}
  {{greeting}}
{{/let}}
```

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/let?anchor=let


---

Portalling can be achieved via the `in-element` block-helper.
This is useful for escaping z-index issues for pop-overs or in general rendering content in different places in the DOM.

```hbs
<div id='my-portal-target'></div>

{{#in-element (findTarget '#my-portal-target')}}
  content here
{{/in-element}}
```

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/in-element?anchor=in-element


---

You can always make an array in JavaScript-space

```js
let myArray = [];
```

But if you want the individual elements of an array to be individually reactive, you can make an array via the `(array)` helper in template-space

```hbs
{{#let (array one two) as |data|}}
  {{data}}
{{/let}}
```

When creating arrays this way, value `two` can change and not affect the reactivity of value `one`.

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/array?anchor=array


---

`hash` is similar in purpose to an `array`, except that it creates objects instead of arrays.

```hbs
{{#let (hash one=1 two=2) as |data|}}
  {{data}}
{{/let}}
```

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/hash?anchor=hash


---

Glimmer, by default, protects you against [Cross-Site-Scripting][xss] attacks, where an attack may try to get malicious code rendered on a page to scrape or send information from other user sessions.

The `htmlSafe` utility is used when you have an input that you either _know_ to be safe or are reasonably certain that rendering any malicious input will have no negative consequence (for example, maybe the untrusted input is already safely handled by running it through a sanitizer (such as [PurifyDOM](https://github.com/cure53/DOMPurify -- making the input trusted and safe)). `htmlSafe` does not make the string safe; in fact, it tells Ember's renderer to ignore the typical step of making the string safe. Use it only when you do not want the input to be HTML escaped.

```hbs
{{htmlSafe untrusted}}
```

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/release/functions/@ember%2Ftemplate/htmlSafe
[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting


---

Template-only components have many names, but are all the same thing. 
- presentation(al) components
- display components
- dumb components (vs "smart" which would have state)

Specifically, a template-only component has no state of its own, like a class-component would.
This comes with [some advantages](https://nullvoxpopuli.com/2023-12-20-template-only-vs-class-components) (less complexity, less to do, etc).

To define a template-only component, you only need to use the `<template>` tags anywhere,
For example:
```gjs
const TemplateOnly = <template>
    display / presentational 
    content here
</template>;
```

These can be used the same as components with state.

```gjs
<template>
    <TemplateOnly />
</template>
```

In order to use a template-only component is this tutorial, we have to invoke it within another template-only component!


---

Classes are used for managing internal state within a component. 
This state could be a `@tracked` value, or deriving other values from `@tracked` values.

For example:
```gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class Demo extends Component {
  <template>
    {{this.value}}
  </template>

  @tracked value = 0;
}
```

<p class="call-to-play">
  In the editor, try adding a button that increments the <code>value</code> when clicked.
</p>

It may end up looking something like this:
```gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

export default class Demo extends Component {
  <template>
    {{this.value}}<br>
    {{this.doubled}}<br>
    <button {{on 'click' this.increment}}>increment</button>
  </template>

  // root state
  @tracked value = 0;

  // derived state
  get doubled() {
    return this.value * 2;
  }

  // action
  increment = () => this.value++;
}
```


Note that all of the state is "private", in that no JavaScript from outside the component can access it.


---

Components, like native HTML elements, may receive block content.

So far, you've seen component invocation like 
```hbs
<MyComponent />
```

This is a "blockless" or "void" invocation, meaning that no nested text or HTML is passed.

We can pass a block of content, by having a closing tag:
```hbs
<MyComponent></MyComponent>
```

This invocation still passes the a block (named `:default`), but it's empty.

To make the `:default` block more useful, we'll want to add some text or HTML
between the opening `<MyComponent>` tag and the closing `</MyComponent>` tag.

For example:
```hbs
<MyComponent>
  block<span>content</span> here.<br>

  This is also called the "default black".
</MyComponent>
```

All valid HTML is valid within a component or component block.

In order for `<MyComponent>` to be capable of receiving a block, we must place a `{{yield}}` within the component definition: 
```gjs
const MyComponent = <template>
  {{yield}}
</template>;
```

This `{{yield}}` is a shorthand for the longer, named version, `{{yield to="default"}}`, which we'll explore in the next chapter.

<p class="call-to-play">
  Try to create your own <code>:default</code> block-receiving component in the playground area.
</p>


---

Components, _unlike_ native HTML elements, but similar to WebComponents, can have multiple zones or regions for differently named block contents.

In the previous chapter, we learned that the default space between an opening and closing tag is the `:default` block.

Here, we may pass multiple blocks via `<:namedBlock>` notation,
```hbs
<MyComponent>
  <:header>some heading</:header>

  <:body>
    main content
  </:body>

  <:footer>footer content</:footer>
</MyComponent>
```

`<:namedBlock>` notation can be identified by the preceeding `:` character in both the opening and closing tag.

Inside `MyComponent`, we need to allow each of these blocks to be used via `{{yield to="blockName"}}`

```gjs
const MyComponent = <template>
  <header>{{yield to="header"}}</header>

  <main>
    {{yield to="body"}}
  </main>

  <footer>{{yield to="footer"}}</footer>
</template>;
```

<p class="call-to-play">Practice using named blocks within the playground area</p>.

Take note, there _are_ some constraints when it comes to invoking components with named blocks to help with conceptual consistency:
- _the order of named blocks regions does not matter._
  ```hbs
  <MyComponent>
    <:header>some heading</:header>
    <:body>body content here</:body>
  </MyComponent>
  ```
  is the same as 
  ```hbs
  <MyComponent>
    <:body>body content here</:body>
    <:header>some heading</:header>
  </MyComponent>
  ```
  This is because the placement of a block is determined by `<MyComponent>`, not the caller. This makes named blocks a good tool for design systems.
- _free-form content may not exist outside of named-blocked invocation._
  For example, this is invalid:
  ```hbs
  <MyComponent>
    content here 
    <:body>body content here</:body>
  </MyComponent>
  ```
  This is because, syntactically, content directly within the `<MyComponent>` and `</MyComponent>` belongs to the `:default` block, which is the same as defining
  ```hbs
  <MyComponent>
    <:default>
      content here
    </:default>
    <:body>body content here</:body>
  </MyComponent>
  ```
- _named blocks may not contain named blocks from the same parent component._
  for example, this is invaild
  ```gjs
  const Demo = <template>
    <MyComponent>
      <:body>
        body content here
        <:header>some heading</:header>
      </:body>
    </MyComponent>
  </template>
  ```
  This is invalid because the block content is **owned by the invoker*, so `<:header>` doesn't actually exist in the above component because there is no `{{yield to="header"}}` in `<Demo>`. You'll receive a build-time error similar to:
  ```
  Unexpected named block inside <:body> named block: 
    named blocks cannot contain nested named blocks: 
  ```
  _even_ if you try to defined `{{yield to="header"}}`
  ```gjs
  const Demo = <template>
    {{yield to="header"}}
    <MyComponent>
      <:body>
        body content here
        <:header>some heading</:header>
      </:body>
    </MyComponent>
  </template>
  ```
- _a component cannot pass content its own block._
  For example, trying to pass content to the `:header` named block:
  ```gjs
  const Demo = <template>
    {{yield to="header"}}
    <:header>some heading</:header>
  </template>
  ```


---

Conditional Blocks are `:named` blocks that only render when a condition is met. In many cases, that could be the condition that a block is used at all.

For example, observe the difference in these component invocations:
```hbs
<Modal>
  <:content>
     content here
  </:content>
</Modal>
```
and
```hbs
<Modal>
  <:content>
    quetsion here
  </:content>
  <:footer>
    buttons here
  </:footer>
</Modal>
```

The `:footer` block is optionally present, and we may expect that when it is omitted, that the component we're using, `Modal` in this case, doesn't include any of the padding or styling associated with the footer of the `Modal`.

To implement this, there is a built-in feature of the templating language, the [`(has-block)`][docs-has-block] helper.

Usage would look like this:
```hbs
{{#if (has-block 'footer')}}
  <footer class="styles, etc">
    {{yield to="footer"}}
  </footer>
{{/if}}
```

The styling provided by the `footer` element, and accompanying CSS classes would be omitted when the caller omits the `:footer` named block.

In this exercise, 
<p class="call-to-play">update the <code>Conditional</code> component to conditionally render the <code>:blue</code> block only when it is declared by the caller.</p>.



[docs-has-block]: https://api.emberjs.com/ember/5.6/classes/Ember.Templates.helpers/methods/has-block?anchor=has-block


---

This tutorial chapter needs to be written!

It could be written by you!, if you want &lt;3


---

This tutorial chapter needs to be written!

It could be written by you!, if you want &lt;3


---

This tutorial chapter needs to be written!

It could be written by you!, if you want &lt;3


---

Sometimes, it may be desired to render different components based on a variety of criteria. Sometimes this criteria is based on user input, sometimes it is based on arguments to the component.

In any case, the way we select which component to render is the same as we select any value to render.

First, we need to start with existing components to dynamically choose.
These could be imported:
```js
import { Three } from './number-components';
import { Bee } from './flying-components';
import { Tree } from './plant-components';
```

But for the purposes of this exercise, let's define them all inline:
```gjs
const Three = <template>3 | Three</template>;
const Bee   = <template>🐝 | Bee</template>;
const Tree  = <template>🌲 | Tree</template>;
```

So in order to dynamically select between these components, we need some logic -- let's start with a small form to help select which component to render.

```hbs
<fieldset>
  <legend>Choose a component</legend>
  <label>Three <input name="component" type="radio" value="three"></label>
  <label>Bee   <input name="component" type="radio" value="bee"></label>
  <label>Tree  <input name="component" type="radio" value="tree"></label>
</fieldset>
```

This boilerplate, provided for you, will allow us to choose an option (based on the `value` attribute's value) from the Form and give us an opportunity to interpret that FormData into a component to render. 

As you can see from the implemented form-handling functions, the value of the `component` field is stored on `this.selected`. We can use `this.selected`, which will be a string, to map to one of our defined components.

```js
get Selected() {
  return MAP[this.selected] ?? Fallback;
}
```

Note that this property could be named anything, and the casing is not important. We render the `Selected` getter like so:

```hbs 
<this.Selected />
```
Like regular component invocation we can pass arguments, add modifiers, pass block-content, etc.

Next let's define `Fallback` as we won't initially have a value, but we do want to render _something_: 
```gjs
const Fallback = <template>Choose an option</template>;
```

And lastly, to hook up the data for the `Selected` getter, we need to define the value to component map, `MAP`:
```js 
const MAP = {
  three: Three,
  bee: Bee,
  tree: Tree,
};
```

<details><summary>Alternate Solution</summary>

In the above, we use a getter to define the component, but it's possible to do this outside of the class as well.

We'd need to define a function in module space to take the place of the getter that we'll then need to invoke, like this:

```hbs
{{#let (componentFor this.selected) as |Selected|}}
  <Selected />
{{/let}}
```

This `componentFor` function will do the exact same mapping. 

```js
const componentFor = (key) => MAP[key] ?? Fallback;
```

</details>

<details><summary>Without a fallback</summary>

In order to not use a `Fallback` component for either the getter solution or the `#let`-using solution, you'd have to use an `#if` block, like this:

```gjs
class Demo extends Component {  
  /** ... **/
  get Selected() {
    return MAP[this.selected];
  }

  <template>
    {{! ... }}

    {{#if this.Selected}}
      <this.Selected />
    {{/if}}
  </template>
}
```

or

```gjs
<template>
  {{! ... }}

  {{#if this.selected}}
    {{#let (componentFor this.selected) as |Selected|}}
      <Selected />
    {{/let}}
  {{/if}}
</template>
```

</details>


---

Argument components are components passed down as arguments.

Here is an example of a `Greeter` component being passed down `Me` component as `@person` argument:

```gjs
const Me = <template>
  NullVoxPopuli
</template>;

const Greeter = <template>
  Hello <@person />!
</template>;

<template>
  <Greeter @person={{Me}} />
</template>
```
 
This pattern can be also used in cases where a _component A_ `yields` _component B_ and this one then needs to be used in _component C_:

```gjs
import { hash } from '@ember/helper';

const Button = <template>
  <button type="button">Close</button>
</template>;

const Sidebar = <template>
  <side>
    {{yield (hash closeButton=Button)}}
  </side>
</template>;

const Menu = <template>
  <nav>
    <ul>
      <li>Home</li>
      <li>About</li>
    </ul>
  </nav>

  <@closeMenu />
</template>;

<template>
  <Sidebar as |side|>
    <Menu @closeMenu={{side.closeButton}} />
  </Sidebar>
</template>;
```

[Documentation on rendering values][docs]

[docs]: https://guides.emberjs.com/release/in-depth-topics/rendering-values/


---

This tutorial chapter needs to be written!

It could be written by you!, if you want &lt;3


---

`fn` is used for [partial application][wiki] of arguments to functions.

This is used for pre-wiring arguments to functions so that they may be passed elsewhere without that consumer needing to pass any arguments themselves.

```hbs
{{#let (fn stringify data) as |preWired|}}
```

Given that `stringify` is a function, `fn` partially applies `data` as the new first argument.
So invoking `preWired()` would be equivalent to `stringify(data)`.
Likewise, invoking `preWired('more data')` would be equivalent to `stringify(data, 'more-data')`.

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/4.11/classes/Ember.Templates.helpers/methods/fn?anchor=fn
[wiki]: https://en.wikipedia.org/wiki/Partial_application


---

`helper` is used for [partial application][wiki] of arguments to helpers.

_Most_ helpers in Glimmer/Ember _are_ functions, so `fn` would be sufficient,
but helpers can be things other than functions ([class-based][docs-class-helper] helpers, resources, etc), thanks to [Helper Managers][rfc-625].

```hbs
{{#let (helper stringify data) as |preWired|}}
```

Try partially applying arguments to the given helper.

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/helper?anchor=helper
[wiki]: https://en.wikipedia.org/wiki/Partial_application
[rfc-625]: https://rfcs.emberjs.com/id/0625-helper-managers/
[docs-class-helper]: https://api.emberjs.com/ember/release/classes/Helper


---

`modifier` is used for [partial application][wiki] of arguments to modifiers.

This can be useful for pre-wiring arguments to complex modifiers, or modifiers with private implementation details that a consumer may not need to care about.

```hbs
{{#let (modifier on 'click' handler) as |preWired|}}
```

Try partially applying arguments to the given modifier as use that pre-wired modifier on the button.

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/modifier/classes/Ember.Templates.helpers/methods/modifier?anchor=modifier
[wiki]: https://en.wikipedia.org/wiki/Partial_application


---

`component` is used for [partial application][wiki] of arguments to conponents.

This can be useful for pre-wiring arguments to complex components, or components with private implementation details that a consumer may not need to care about.

```hbs
{{#let (component Greeting response="General Kenobi!") as |preWired|}}
```

Try partially applying arguments to the given component.

[Documentation][docs]

[docs]: https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/component?anchor=component
[wiki]: https://en.wikipedia.org/wiki/Partial_application


---

Currying attributes is useful when you want to pre-configure styles, classes, data, aria, or any other attributes. However, there is no built in API for wiring up attributes with the `(component)` helper, like there is for arguments.

To get around that limitation, we'll need to create an intermediate component that wires up the attributes and forwards all relevant arguments.

For example, given we have a `<Greeting>` component,
```gjs
const Greeting = <template>
  <div ...attributes>{{@greeting}}</div>
</template>;
```

And we want add a default `color` style to the text.
Normally, when we curry a component, we use `(component)` like this:

```gjs
const Demo = <template>
  {{yield (component Greeting greeting="hello there")}}
</template>;
```

But to add attributes, we need to create that aforementioned intermediate component, like the following
```gjs
const CurriedComponent = <template>
  <Greeting class="greeting" @greeting={{@greeting}} />
  <style>
    .greeting {
      color: red;
    }
  </style>
</template>;
```
and then update `<Demo>` to use this new `<CurriedComponent>`
```gjs
const Demo = <template>
  {{yield (component CurriedComponent greeting="hello there")}}
</template>;
```



---

Currying modifiers is similar to currying attributes. There is no built in API for wiring up modifiers with the `(component)` helper, like there is for arguments.

To get around that limitation, we'll need to create an intermediate component that wires up the modifiers and forwards all relevant arguments.

For example, given we have a `<Button>` component,
```gjs
const Button = <template>
  <button ...attributes aria-disabled={{@isDisabled}}>{{yield}}</button>
</template>;
```

This could represent a button in a design system, but in a company product, you may want to intercept click events and provide analytics.
Normally, when we curry a component, we use `(component)` like this:

```gjs
const Demo = <template>
  {{yield (component Button isDisabled=@isDisabled)}}
</template>;
```

But to add a modifier to listen for click events, we need to create that aforementioned intermediate component, like the following
```gjs
function reportClick(event) {
  /* interact with some analytics service, amplitude, google, etc */
  console.log('tracking, not implemented or relevant here');
}

const CurriedButton = <template>
  <Button 
    ...attributes 
    {{on 'click' reportClick}}
    @isDisabled={{@isDisabled}}
  >
    {{yield}}
  </Button>
</template>;
```
and then update `<Demo>` to use this new `<CurriedButton>`
```gjs
const Demo = <template>
  {{yield (component CurriedButton isDisabled=@isDisabled}}
</template>;
```



---

Vanilla JavaScript has everything we need to handle form data, de-sync it from our source data and collect all user input upon submission.

In the form below, we create a Vanilla™ [HTML form][2], and only add "Ember" code for handling the form submission and field inputs once on the `<form>` tag. By default, form submissions will cause a page reload, so in a single-page-app, we need to prevent that default behavior.

Using the native API, [FormData][1], we can gather the user inputs when the user presses the submit button.

```hbs
<form {{on 'input' handleInput}} {{on 'submit' handleSubmit}}>
  <label>
    First Name
    <input name='firstName' />
  </label>

  <!-- any amount of form fields may be present here, it's *just HTML* -->

  <button type='submit'>Submit</button>
</form>
```

In this chapter, add the necessary `on` event listeners so that the form automatically behaves reactively.

Like with the [URL][4], [localStorage][5], and other web-platform-primitives, the storage machanism is _string-based_. For non-string data, the form will need to be converted to a string during render and converted back on submission.

[1]: https://developer.mozilla.org/en-US/docs/Web/API/FormData
[2]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
[3]: https://guides.emberjs.com/release/components/component-state-and-actions/#toc_html-modifiers-and-actions
[4]: https://developer.mozilla.org/en-US/docs/Web/API/URL
[5]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage


---

As good as writing plain HTML is, it cannot as easily know what we want initial values in our form to be.

For that, we still need to utilize the [`value`][3] attribute.

```hbs
<input name='firstName' value={{initialData.firstName}} />
```

[3]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#value


---

Like with the [URL][1], [localStorage][2], and other web-platform-primitives,
the storage machanism for `<form>`s is _string-based_.

For non-string data, the form will need to be converted to a string during render and converted back on submission.

If we want to use a number field, and ensure the data we receive back from the form is a number,
we must adjust the `handleInput` function from before.

```js
function parse(data) {
  let result = { ...data };

  if ('numberField' in data) {
    result.numberField = parseInt(data.numberField, 10);
  }

  return result;
}

const handleInput = (event) {
  let formData = new FormData(event.currentTarget);
  let data = Object.fromEntries(formData.entries());

  let parsed = parse(data);

  // ...
}
```

Adjust the example so that the number `input` field parses to a number when edited or the form is submitted.

[1]: https://developer.mozilla.org/en-US/docs/Web/API/URL
[2]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[3]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#value


---

An _uncontrolled_ input is what we've used so far, where the inputs themselves manage their own internal state. We do not control that state, and so they are _uncontrolled_.

A _controlled_ input is controlled by the invoking component. 

There are two parts to controlling a component: managing the value, and responding to an event on the input (which usually sets that managed value).


Managing the value is the same as we've seen before with setting an input's initial value:
```hbs
<input value={{@value}} />
```

The second part, responding to an event on the input, usually unwraps the event and passes the current value to the calling component:
```gjs
class Demo extends Component {
  handleInput = (event) => {
    this.args.onChange(event.target.value);
  }

  <template>
    <input value={{@value}} {{on 'input' this.handleInput}} />
  </template>
}
```

Because, with a text input, we expect a string to be passed to an `onChange` handler, we have nothing more to do. 

<p class="call-to-play">
  Change the input within the <code>ControlledInput</code> component 
  to <strong>be controlled</strong>.
</p>



---

Just like the controlled input, the _controlled checkbox_ is roughly the same approach, but with a different property and event binding combination. 

Instead of setting value, we'll set `checked`.
```hbs
<input type="checkbox" checked={{@value}} />
```

And for the event binding, we'll use the `change` event.
```gjs
class Demo extends Component {
  handleChange = (event) => {
    let value = Boolean(event.target.checked);
    this.args.onChange(value);
  }

  <template>
    <input 
      type="checkbox" 
      value={{@value}} 
      {{on 'change' this.handleChange}} />
  </template>
}
```

Checkboxes have a default `value` of `on` (as a string), which may not be a desired value to pass to your `onChange` handler. In this example, we can convert the `checked` property to a boolean.

<p class="call-to-play">
  Change the checkbox within the <code>ControlledInput</code> component 
  to <strong>be controlled</strong>.
</p>


### References

- [Checkbox Inputs at MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox)

API Docs:
- [let](https://api.emberjs.com/ember/5.8/classes/Ember.Templates.helpers/methods/let?anchor=let)
- [on](https://api.emberjs.com/ember/5.8/classes/Ember.Templates.helpers/methods/on?anchor=on)
- [Component](https://api.emberjs.com/ember/5.8/modules/@glimmer%2Fcomponent)
- [tracked](https://api.emberjs.com/ember/5.8/functions/@glimmer%2Ftracking/tracked)


---

You need to fetch data from the API corresponding to the selected option in the first dropdown. This requires creating a function that builds the correct API URL based on the selected value.

In this example, the fetching of data from the [Options][swapi]
should occur automatically based on changes in option selected`.

   ```javascript
   function urlForDataSource(selectedData) {
       return `https://swapi.dev/api/${selectedData}/`;
   }
   ```

Use the `RemoteData` utility to manage the asynchronous data fetching. This will allow you to handle loading states and response values effectively. 

  ```hbs
    {{#let (RemoteData (urlForDataSource selectedAPI.current)) as |request|}}
    {{/let}}
  ```

After fetching the data, you need to update the second dropdown with the results. Use the `names` function to extract the names from the fetched data and pass them as options to the second dropdown.

   ```javascript
   function names(options) {
       return options.map(option => option.name);
   }
   ```

   ```hbs
   {{#let (RemoteData (urlForDataSource selectedAPI.current)) as |request|}}
      {{#if request.value}}
        <Select 
          @options={{names request.value.results}} 
          @onChange={{(fn setSelected selectedAPI.current)}} 
        >
          <:option as |item|>
            {{item.name}}
          </:option>
        </Select>
    {{/if}}
   {{/let}}
   ```
Use conditional rendering to display a loading message while the API call is in progress. This enhances user experience by providing feedback on the data fetching process.

   ```hbs
    {{#if request.isLoading}}
      Loading...
    {{/if}}
   ```

Docs for `RemoteData` can [be found here][docs-remote-data].

[docs-remote-data]: https://reactive.nullvoxpopuli.com/functions/remote_data.RemoteData-1.html
[swapi]: https://swapi.dev/


---

Just like the controlled input, the _controlled radio button_ is roughly the same approach (conceptually), but we because we now have a list of options where only one can be active at a time, the way in which we set the "selected option" as well as how we handle the events will be very different.

Instead of setting value on a single input, we'll set `checked` to be the result of a function call on _each option_:
```gjs
class Demo extends Component {
  isChecked = (value) => this.args.value === value

  <template>
    <input
      type="radio" name="bestRace" value="zerg"
      {{! the string passed must match the value attribute }}
      checked={{this.isChecked "zerg"}}
    />
    <input
      type="radio" name="bestRace" value="protoss"
      checked={{this.isChecked "protoss"}}
    />
  </template>
}
```

And for the event binding, we'll use the `change` event on each of the radio inputs as well.
```gjs
class Demo extends Component {
  handleChange = (event) => {
    let radio = event.target;

    this.args.onChange(radio.value);
  }

  <template>
    <input
      type="radio" name="bestRace" value="zerg"
      {{on 'change' this.handleChange}}
    />
    <input
      type="radio" name="bestRace" value="protoss"
      {{on 'change' this.handleChange}}
    />
  </template>
}
```

<p class="call-to-play">
  Change the radio buttons within the <code>ControlledInput</code> component 
  to <strong>be controlled</strong>.
</p>




---

Just like the controlled input, the _controlled select_ is roughly the same approach (conceptually), but we because we now have a list of options where only one can be active at a time, the way in which we set the "selected option" as well as how we handle the events will be very different.

Instead of setting value on a single input, we'll set `selected` to be the result of a function call on _each option_:
```gjs
class Demo extends Component {
  isSelected = (value) => this.args.value === value

  <template>
    <select>
      <option value="red" selected={{this.isSelected "red"}}>Red</option>
      <option value="orange" selected={{this.isSelected "orange"}}>Orange</option>
      {{! ... }}
    </select>
  </template>
}
```

And for the event binding, we'll use the `change` event on the single select element.
```gjs
class Demo extends Component {
  handleChange = (event) => {
    let select = event.target;

    this.args.onChange(select.value);
  }

  <template>
    <select {{on 'change' this.handleChange}}>
      {{! ... }}
    </select>
  </template>
}
```

<p class="call-to-play">
  Change the select within the <code>ControlledInput</code> component 
  to <strong>be controlled</strong>.
</p>




---

Making a select multiple field _controlled_ is nearly the same as making a non-multiple select field controlled -- the main difference is that we now need to deal with array data (manually).

Our value now represents an array of known options, rather than a single value, so our `isSelected` function must be updated:
```gjs
class Demo extends Component {
  // Note the `?.` because the initial value isn't set.
  isSelected = (value) => this.args.value?.includes(value);

  <template>
    <select multiple>
      <option value="red" selected={{this.isSelected "red"}}>Red</option>
      <option value="orange" selected={{this.isSelected "orange"}}>Orange</option>
      {{! ... }}
    </select>
  </template>
}
```

And for the event binding, we'll use the `change` event on the single select element. However, this time we need to do some processing to figure out what the selected array is.
```gjs
class Demo extends Component {
  handleChange = (event) => {
    let select = event.target;
    let selected = [...select.options]
      .filter(option => option.selected)
      .map(option => option.value);

    this.args.onChange(selected);
  }

  <template>
    <select {{on 'change' this.handleChange}}>
      {{! ... }}
    </select>
  </template>
}
```

<p class="call-to-play">
  Change the select within the <code>ControlledInput</code> component 
  to <strong>be controlled</strong>.
</p>




---

Making the textarea element _controlled_ is similar to a text input. The only difference is where the value is set.

We can set the value by placing it in the content of the textarea element.
```gjs
class Demo extends Component {
  <template>
    <textarea>{{@value}}</textarea>
  </template>
}
```

And for the event binding, we can use the `input` event to have live updates as we type:
```gjs
class Demo extends Component {
  handleChange = (event) => {
    let textarea = event.target;

    this.args.onChange(textarea.value);
  }

  <template>
    <textarea {{on 'input' this.handleChange}}></textarea>
  </template>
}
```

<p class="call-to-play">
  Change the textarea within the <code>ControlledInput</code> component 
  to <strong>be controlled</strong>.
</p>




---

Because contenteditable has browser-implemented internal state, it's not *exactly* able to be controlled. But we can set the initial value, and listen to updates as they happen.


For setting the initial value we need to _disconnect_ from auto-tracking.
This can be done, inline, with an async immediately invoked function execution (IIFE), 
```js
(async () => {
  await Promise.resolve();
  // code that access tracked state here
  // ...
})()
```
This defers execution of "the real code" to the "next" [microtask](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth).
We also need to get a reference to the element, so we'll need to create a modifier for where our async IIFE can live:
```js
import { modifier } from 'ember-modifier';

const setContent = modifier((element, [initialize]) => {
  (async () => {
    // Disconnect from auto-tracking
    // so we can only set the inner HTML once
    await Promise.resolve();
    initialize(element);
  })();
});
```
But then we need to use the modifier in our contenteditable:
```gjs
class Demo extends Component {
  setValue = (element) => element.innerHTML = this.args.value;

  <template>
    <div 
      contenteditable="true"
      {{setContent this.setValue}}
    ></div>
  </template>
}
```

And for the event binding, we can use the `input` event to have live updates as we type:
```gjs
class Demo extends Component {
  handleChange = (event) => {
    let textarea = event.target;

    this.args.onChange(textarea.innerHTML);
  }

  <template>
    <div 
      contenteditable="true"
      {{setContent this.setValue}}
      {{on 'input' this.handleChange}}
    ></div>
  </template>
}
```

Unlike the other controlled inputs we've covered so far, we dan't expect to do anything with the updated `@value` once it's passed back in to our `contenteditable` component. `contenteditable` has its own state, and if we were to retain an fully _controlled_ `@value`, we would then need to manage the cursor position within the contenteditable element, and that is a lot of code. 

<p class="call-to-play">
  Change the contenteditable within the <code>ControlledInput</code> component 
  to <strong>have an initial value set and an input event listener</strong>.
</p>




---

You've finished the Glimmer tutorial, and are ready to start building apps.
You can refer back to individual tutorials at any time as each has a unique URL,
or continue your learning via [the guides][guides], [the official tutorial][tutorial],
the [api reference][reference], and [the blog][blog].

[guides]: https://guides.emberjs.com/release/
[tutorial]: https://guides.emberjs.com/release/tutorial/part-1/
[reference]: https://api.emberjs.com/ember/release
[blog]: https://blog.emberjs.com/
[quickstart]: https://guides.emberjs.com/release/getting-started/quick-start/
[discord]: https://discord.gg/emberjs

To get set up in your local development environment, checkout the [quickstart guide][quickstart].

Most importantly, since you're now a member of the Glimmer and Ember community, you should [join our friendly Discord chat server][discord]. That's where you'll find other embereños, and it's where we plan the future of the framework, and discuss different patterns for solving different tasks, etc.


---



---

