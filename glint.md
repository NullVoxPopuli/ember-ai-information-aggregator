# Table of contents

* [Overview](overview.md)
* [Getting Started](getting-started.md)

## Using Glint

* [Configuration](configuration/\_index.md)
* [Glint Types](glint-types.md)
* [`@glint` Directives](directives.md)
* [Glint with JavaScript](with-js.md)
* [Project References](configuration/project-references.md)

## Environments

* [Ember](using-glint/ember/README.md)
  * [Installation](ember/installation.md)
  * [Component Signatures](ember/component-signatures.md)
  * [Helper and Modifier Signatures](ember/helper-and-modifier-signatures.md)
  * [Template Registry](ember/template-registry.md)
  * [Routes and Controllers](ember/routes-and-controllers.md)
  * [Template-Only Components](ember/template-only-components.md)
  * [Rendering Tests](ember/rendering-tests.md)
  * [Using Addons](ember/using-addons.md)
  * [Authoring Addons](ember/authoring-addons.md)
  * [Template Imports](ember/template-imports.md)

## Troubleshooting
* [Migration Notes](migrating.md)
* [Common Error Messages](diagnosing-common-error-messages.md)
* [Known Limitations](known-limitations.md)


---

Glint does its best to provide good error messages, but there are a number of cases where we are left with whatever TypeScript provides. This page documents the most common confusing type errors you might see.

## Cannot assign an abstract constructor type

```
error TS2322: Type 'abstract new () => PartiallyAppliedComponent<...> is not assignable to type 'typeof <Your Component>'.
  Cannot assign an abstract constructor type to a non-abstract constructor type.
```

This usually means that you have written a signature for a “contextual component” (or “higher-order component”) which accepts a component as an argument or yields it in one of its blocks, like this.

```typescript
import Component from '@glimmer/component';
import type SomeOtherComponent from './some-other-component';

interface MySignature {
  Blocks: {
    default: [typeof SomeOtherComponent];
  };
}

export default class MyComponent extends Component<MySignature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    MyComponent: typeof MyComponent;
    'my-component': typeof MyComponent;
  }
}
```

```handlebars
{{yield (component 'my-component' someArg=true)}}
```

In that case, you can use the `ComponentLike` or `WithBoundArgs` types as discussed in [Glint Types](./glint-types.md):

```typescript
import Component from '@glimmer/component';
import type { WithBoundArgs } from '@glint/template';

interface MySignature {
  Blocks: {
    default: [WithBoundArgs<typeof SomeOtherComponent, 'someArg'>];
  };
}

export default class MyComponent extends Component<MySignature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    MyComponent: typeof MyComponent;
    'my-component': typeof MyComponent;
  }
}
```

## Invalid module name in augmentation

```
Invalid module name in augmentation: module '@glint/environment-ember-loose/registry' cannot be found.`
```

TypeScript will only allow you to add declarations for a module if it's already seen the original. In other words,
if you've never directly or transitively imported `@glint/environment-ember-loose/registry` anywhere in your project
that TypeScript can see then it won't allow you to add a registry entry.

To fix this, [add `import '@glint/environment-ember-loose'` somewhere in your project][env-import]. This will ensure that the
registry, as well as other important type information like template-aware declarations, are visible to vanilla
`tsc` and `tsserver`.

[env-import]: ./ember/installation.md

## Does not satisfy the constraint 'Invokable<AnyFunction>'

```
Type 'typeof SomeComponent' does not satisfy the constraint 'Invokable<AnyFunction>'.
  Types of construct signatures are incompatible.
    Type 'new (owner: unknown, args: { <your component args> }) => SomeComponent' is not assignable to type 'abstract new (...args: any) => InvokableInstance<AnyFunction>'.
      Property '[Invoke]' is missing in type 'SomeComponent' but required in type 'InvokableInstance<AnyFunction>'.ts(2344)
```

The key here is `Property '[Invoke]' is missing in type...`. This usually means that one of the following is true:

- You don’t have the latest version of Glint
- You don’t have the latest version of the `@glimmer/component` or `@types/ember__component` packages
- You are missing your environment import (e.g. `import '@glint/environment-ember-loose'`)

As a special case of the missing environment import: if you are using a shared base `tsconfig.json` but overriding it in a Yarn workspace or similar setup, if your `"include"` key does not include the file which adds the environment import, it will not work (`include`s are not merged even when using TypeScript's `extends` option, but rather completely override the values from the base config).

## The given value does not appear to be usable as a component, modifier or helper.

```
error TS2769: The given value does not appear to be usable as a component, modifier or helper.
  No overload matches this call.
    The last overload gave the following error.
      Argument of type 'Something' is not assignable to parameter of type '(...positional: unknown[]) => unknown'.
```

This error appears when you attempt to use a value in a template whose type Glint doesn't recognize. Normally, Glint relies on the active environment(s) to declare, using types from `@glint/template`, exactly _how_ something like the base `Component` class works when you use it in a template.

Accordingly, if Glint doesn't see that declaration, it may indicate one of a few things:
 - You have multiple copies of `@glint/template` in your dependency tree
 - You have an out-of-date copy of the library your template value is based on (like `ember-modifier` or `@glimmer/component`)
 - The value you're using in your template isn't something your Glint environment is aware of (e.g. it has a custom manager)

## Property does not exist on type 'Globals'

```
error TS7053: Element implicitly has an 'any' type because expression of type '"Something"' can't be used to index type 'Globals'.
  Property 'Something' does not exist on type 'Globals'.
```

The `Globals` type represents any values that are globally in scope in a template, like the `let` and `each` keywords. In a resolver-based environment like `@glint/environment-ember-loose`, this also includes all members of [the `Registry` interface](ember/template-registry.md) that are declared by your application and its dependencies.

If you see this error in a loose mode template, ensure that:
 - A registry entry exists for the name in question
 - You have imported the file where the entry is defined, if it comes from a library (i.e. `import 'ember-svg-jar/glint';`)
 - You only have one copy of the environment package in your dependency tree

If you have multiple copies of the environment package in your dependencies, this can result in multiple disjoint registries, as TypeScript will maintain a separate version of the `Registry` type for each copy, meaning the registry your dependencies are adding entries to might be different than the one your application is actually using.


---

# `@glint` Directives

Glint has several directives that can be used in template comments to control
Glint's behavior. Additional comment text can follow directives to document
their purpose. These directives correspond to the similarly-named directives
in TypeScript.

`@glint` directives may _only_ be applied in template comments, not in
TypeScript outside of templates.

## `@glint-expect-error`

The `@glint-expect-error` directive operates similarly to `@glint-ignore` in
that it will not report type errors it encounters, but it will also produce an
error when an error is _not_ encountered. This is useful for tests where we
expect an invocation not to type-check (e.g. due to bad arguments) and want to
be alerted if it does.

Example:

```hbs
<MyComponent @stringArg='foo' />

{{! @glint-expect-error: let me know if this starts allowing numbers }}
<MyComponent @stringArg={{123}} />
```

## `@glint-ignore`

The `@glint-ignore` directive tells Glint to ignore the line that follows it.
Glint will not report any errors encountered on the next line. In general,
you should prefer `@glint-expect-error` unless it is not appropriate.

Example:

```hbs
<MyComponent @expectedArg='foo' />

{{! @glint-ignore: this doesn't typecheck in TS 4.6 due to a bug, but we still test against that version in CI }}
<MyComponent @unexpectedArg='bar' />
```

## `@glint-nocheck`

The `@glint-nocheck` directive will cause glint to not report errors for the
entire template. The template is still processed by Glint such that
auto-complete, type look-up, jump to definition, etc. are still functional,
but any type errors will be ignored. This can be useful as a step in a
migration process.

Example:

```hbs
{{! @glint-nocheck: this whole template needs work }}

<MyComponent @stringArg={{123}} />

<AnotherComponent @badArg='foo' />

{{two-arg-helper 'bar'}}
```

**Note**: the [`auto-glint-nocheck`] script in the `@glint/scripts` package
can automate the process of adding `@glint-nocheck` directives at the top
of every template with type errors in your project. This allows you to adopt
Glint in a project immediately for all new templates while incrementally
migrating your existing ones to make them typesafe over time.

[`auto-glint-nocheck`]: https://github.com/typed-ember/glint/tree/main/packages/scripts#auto-glint-nocheck


---

## Setup

First, add `@glint/core`, `@glint/template` and an appropriate Glint environment to your project's `devDependencies`.

Then, add a `"glint"` key in your `tsconfig.json` that tells Glint what environment you're working in and, optionally, which files it should include in its typechecking.

See the [Configuration](configuration/_index.md) page for more details about options you can specify under the `"glint"` key. For setup instructions specific to your project type, check out the links below:

- [Ember.js Installation](ember/installation.md)

## Using Glint

The `@glint/core` package includes two executables: `glint` and `glint-language-server`.

### Glint CLI

The `glint` CLI can be used to typecheck your project in a similar manner to `tsc`, but with understanding of how values flow through templates.

![A `tsc`-style template type error in the terminal](https://user-images.githubusercontent.com/108688/111076577-1d61db00-84ed-11eb-876a-e5b504758d11.png)

You can use the `glint` executable in CI to ensure you maintain type safety in your templates.

For example, in GitHub Actions you might change this:

```yaml
- name: Typecheck
  run: npx tsc --noEmit
```

To this:

```yaml
- name: Typecheck
  run: npx glint
```

You can also use the `glint` command locally with the `--watch` flag to monitor your project as you work!

### Glint Editor Extensions

You can install an editor extension to display Glint's diagnostics inline in your templates and provide richer editor support&mdash;typechecking, type information on hover, automated refactoring, and more&mdash;powered by `glint-language-server`:

- Install the [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=typed-ember.glint-vscode).

![A type error being shown inline for a template file in VS Code](https://user-images.githubusercontent.com/108688/111076679-995c2300-84ed-11eb-934a-3a29f21be89a.png)

To get Ember/Glimmer and TypeScript working together, Glint creates a separate TS language service instance patched with Ember-specific support. To prevent invalid or duplicate diagnostics you need to disable VSCode's built-in TS language service in your project's workspace only by following these steps:

1. In your project workspace, bring up the extensions sidebar `Ctrl + Shift + X` (macOS: `Cmd + Shift + X`).
1. Type `@builtin typescript` in the extension search box
1. Click the little gear icon of "TypeScript and JavaScript Language Features", and select "Disable (Workspace)".
1. Reload the workspace. Glint will now take over TS language services.

![Disabling built-in TS language service per workspace](https://user-images.githubusercontent.com/108688/111069039-6dc84100-84cb-11eb-8339-18a589be2ac5.png)

---

## `ComponentLike`, `HelperLike` and `ModifierLike`

While we often work in terms of specific implementations of components, helpers and modifiers, when we're using e.g. `MyComponent` in a template, it doesn't matter whether `MyComponent` is a template-only component, or a subclass of `@glimmer/component` or is a completely different object with a [custom component manager](https://github.com/emberjs/rfcs/blob/master/text/0213-custom-components.md).

To account for this, the `@glint/template` package provides a set of more general types: the `ComponentLike`, `HelperLike` and `ModifierLike` types describe _any_ value that is usable as the respective type of entity in a template.

For example, in Ember all of the following values are `ComponentLike`:

 - a subclass of `@glimmer/component`
 - a subclass of `@ember/component`
 - the return value of `templateOnlyComponent()` from `@ember/component/template-only`
 - a `<template>` expression in [a `.gts` file](https://github.com/emberjs/rfcs/blob/master/text/0779-first-class-component-templates.md)
 - the result of a `{{component ...}}` expression in a template

These types each accept signatures in the same format that the base classes for [components](./ember/component-signatures.md) and [helpers/modifiers](./ember/helper-and-modifier-signatures.md) do.

## `WithBoundArgs` and `WithBoundPositionals`

When you yield a "contextual component" (or helper or modifier), you need some way to declare the type of that value in the signature of the yielding component. 

```handlebars
{{yield (hash banner=(component "some-banner" kind="warning"))}}
```

The return value from `{{component}}` component isn't the actual `SomeBanner` class—it won't have e.g. any of `SomeBanner`'s static members, and it also no longer requires a `@kind` arg, since a default value has been set as part of the `(component)` invocation.

We could use `ComponentLike` to describe the type of this value:

```typescript
import { ComponentLike } from '@glint/template';
import { SomeBannerSignature } from './some-banner';

interface MyComponentSignature {
  Blocks: {
    default: [{
      banner: ComponentLike<{
        Element: SomeBannerSignature['Element'];
        Blocks: SomeBannerSignature['Blocks'];
        Args: 
          Omit<SomeBannerSignature['Args'], 'kind'> 
            & { kind?: SomeBannerSignature['Args']['kind'] };
      }>;
    }];
  };
}
```

However, that's quite a lot of boilerplate to essentially express "it's like `SomeBanner` except `kind` is already set". Instead, you can use the `WithBoundArgs` type to express the same thing:

```typescript
import { WithBoundArgs } from '@glint/template';
import SomeBanner from './some-banner';

interface MyComponentSignature {
  Blocks: {
    default: [{
      banner: WithBoundArgs<typeof SomeBanner, 'kind'>;
    }];
  };
}
```

If you had pre-bound multiple named args, you could union them together with the `|` type operator, e.g. `'kind' | 'title'`.

Similarly, when working with a component/helper/modifier where you're pre-binding positional arguments, you can use `WithBoundPositionals` to indicate to downstream consumers that those arguments are already set:

```handlebars
{{yield (hash greetChris=(helper greetHelper "Chris"))}}
```

```typescript
interface MyComponentSignature {
  Blocks: {
    default: [{
      greetChris: WithBoundPositionals<typeof greetHelper, 1>
    }];
  };
}
```

Where `WithBoundArgs` accepts the names of the pre-bound arguments, `WithBoundPositionals` accepts the number of positional arguments that are pre-bound, since binding a positional argument with `{{component}}`/`{{modifier}}`/`{{helper}}` sets that argument in a way that downstream users can't override.

## Advanced Types Usage

From Glint's perspective, what _makes_ a value usable as a component is being typed as a constructor
for a value type that matches the instance type of `ComponentLike`. The same is true of helpers with
`HelperLike` and modifiers with `ModifierLike`.

While this may seem like a negligible detail, making use of this fact can allow authors with a good
handle on TypeScript's type system to pull off some very flexible "tricks" when working with Glint.

### Custom Glint Entities

Ember (and the underlying Glimmer VM) has a notion of _managers_ that allow authors to define custom
values that act as components, helpers or modifiers when used in a template. Glint can't know how
these custom entities will work, but by using `ComponentLike`/`HelperLike`/`ModifierLike`, you can
explain to the typechecker how they function in a template.

For example, if you had a custom DOM-less "fetcher component" base class, you could use TypeScript
[declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) to
tell Glint that its instance type extended `InstanceType<ComponentLike<S>>`, where `S` is an
appropriate component signature based on how your custom component works.

```typescript
// Define the custom component base class
class FetcherComponent<Params, Payload> {
  // ...
}

// Set its manager and, if necessary, template
setComponentManager(/*...*/, FetcherComponent);
setComponentTemplate(/*...*/, FetcherComponent);

// Use declaration merging to declare that the base class acts, from Glint's perspective,
// like a component with the given signature when used in a template.
interface FetcherComponent<Params, Payload> extends InstanceType<
  ComponentLike<{
    Args: { params: Params };
    Blocks: {
      loading: [];
      error: [message: string];
      ready: [payload: Payload];
    };
  }
>> {}
```

This is a fairly contrived example, and in most circumstances it would be simpler to use a standard
base class like `@glimmer/component`, but nevertheless the option exists.

**Note**: this declaration merging technique using `InstanceType<ComponentLike<...>>` is _exactly_
how Glint's own 1st-party environment packages like `@glint/environment-ember-loose` set up the
template-aware types for `@glimmer/component`, `@ember/component/helper`, etc.

### Type Parameters

When defining a class-based component, modifier or helper, you have a natural place to introduce
any type parameters you may need. For example:

```typescript
export interface MyEachSignature<T> {
  Args: { items: Array<T> };
  Blocks: {
    default: [item: T, index: number];
  };
}

export class MyEach<T> extends Component<MyEachSignature<T>> {
  // ...
}
```

However, if you aren't working with a concrete base type and can only say that your value is,
for instance, some kind of `ComponentLike`, then TypeScript no longer offers you a place to
introduce a type parameter into scope:

```typescript
// 💥 Syntax error
declare const MyEach<T>: ComponentLike<MyEachSignature<T>>;

// 💥 Cannot find name 'T'. ts(2304)
declare const MyEach: ComponentLike<MyEachSignature<T>>;
```

Since what matters is the _instance_ type, however, it is possible to define `MyEach` using just
`ComponentLike` and slightly more type machinery:

```typescript
declare const MyEach: abstract new <T>() => InstanceType<
  ComponentLike<MyEachSignature<T>>
>;
```

This shouldn't be a tool you frequently find the need to reach for, but it can be useful on
occasion when working with complex declarations.


---

### Ember-Specific

Glint is not currently integrated with `ember-cli-typescript`, so typechecking performed during an `ember-cli` build will not take templates into account.

In addition, the [template registry](ember/template-registry.md) must currently be maintained by hand. A few possibilities for mitigating that pain have been discussed, but ultimately the best solution will be when [strict mode] comes to Ember and we no longer need to reckon with runtime resolution of template entities.

[strict mode]: http://emberjs.github.io/rfcs/0496-handlebars-strict-mode.html

### Tooling

In VS Code, you will see diagnostics from both TypeScript and Glint in many files, as well as false 'unused symbol' positives for things only referenced in templates. See [the VS Code extension README](../packages/vscode) for details on dealing with this.


---

# Migrating

## Glint 0.9.x to 1.0

Most of the changes in Glint 1.0 should appear as bugfixes and improvements to the majority of 
users migrating from 0.9.x.

The main change to be aware of is that **`@glint/template` should now be explicitly added to your
project's `devDependencies`** when you upgrade Glint. Note also that support for `include` and
`exclude` globs has been removed.

More details about these and other breaking changes are laid out below.

### Minimum TypeScript Version

Glint 1.0 requires TypeScript 4.8 or greater, dropping support for 4.7.

### `@glint/template` Peer

For Glint to work properly, there must be exactly one common copy of `@glint/template` present
in your dependency hierarchy. This has been true throughout our 0.x releases, but as of 1.0
we're making that explicit by marking `@glint/template` as a `peerDependency` of our environment
packages rather than a hard `dependency`.

Accordingly, you will need to add `@glint/template` to your project's own dependencies list
alongside `@glint/core` and your environment package(s).

Note also that if you publish an addon that depends on types from `@glint/template`, that addon
should likewise declare a `peerDependency` on `@glint/template` and **not** a regular `dependency`.

### `{{component}}` Typing

In `@glint/environment-ember-loose`, if you used the `{{component}}` helper to expose a "contextual
component" to your consumers without binding any additional arguments, e.g.:

```handlebars
{{yield (hash Child=(component "some-child-component"))}}
```

In 0.9.x, Glint would allow you to type that yielded component as something like:

```typescript
export interface MyComponentSignature {
  Blocks: {
    default: [{ Child: typeof SomeChildComponent }];
  };
}
```

However, this was never quite correct: when you use the `{{component}}` helper, the value it returns
is not the actual component class itself. If `SomeChildComponent` had static members, for instance,
then according to `Child: typeof SomeChildComponent`, consumers should be able to access those
properties from the yielded `Child` value, but they wouldn't be there in the value returned from
`{{component}}`.

The only thing you are guaranteed to be able to do with the result of the `{{component}}` helper is
invoke it as a component in a template.

Accordingly, in Glint 1.0 the above combination will no longer typecheck. To fix the situation, you
can either update the signature to match the template:

```typescript
export interface MyComponentSignature {
  Blocks: {
    default: [{ Child: ComponentLike<SomeChildComponentSignature> }];
  };
}
```

Or update the template to match the signature:


{% tabs %}
{% tab title="Template" %}

```handlebars
{{yield (hash Child=this.SomeChildComponent)}}
```

{% endtab %}
{% tab title="Backing Class" %}

```typescript
import SomeChildComponent from './some-child-component';

export default class MyComponent /* ... */ {
  SomeChildComponent = SomeChildComponent;
}
```

{% endtab %}
{% endtabs %}

### `include`/`exclude` Configuration

Glint 1.0 drops support for the `transform` configuration key, which is where `include` and
`exclude` globs were previously specified. These options were a blunt instrument left over from an
earlier iteration of Glint.

If you're currently relying on these keys to have Glint skip typechecking for parts of your
codebase, consider using [`@glint-nocheck` directives][nocheck] instead. You can automate the
process of adding those directives to templates that have type errors using the
[`glint-auto-nocheck`] script.

Note that templates with a `@glint-nocheck` directive will benefit from best-effort editor support
for features such as hover information, go-to-definition, etc. even if they aren't typesafe,
which is a meaningful advantage over templates that were ignored via `include`/`exclude`.

[nocheck]: ../docs/directives.md#glint-nocheck
[`glint-auto-nocheck`]: https://github.com/typed-ember/glint/tree/main/packages/scripts#auto-glint-nocheck

### `allowPlainFunctionInvocation`

The `allowPlainFunctionInvocation` flag has been dropped from `@glint/environment-ember-loose`'s
configuration. If you are not using Ember 4.5+ with native support for functions as helpers,
consider adopting [the functions-as-helpers polyfill][functions-as-helpers].

[functions-as-helpers]: https://github.com/ember-polyfills/ember-functions-as-helper-polyfill

### Tagged Strings in `ember-template-imports`

Since `<template>` [has been been selected][fccts] as the path forward for template imports (a.k.a
strict mode) in Ember, the `hbs` string tag from `ember-template-imports` is no longer treated as
a template marker by `@glint/environment-ember-template-imports`. This also aligns with the intent
to [deprecate `hbs`][eti-no-more-hbs] in `ember-template-imports` itself.

Projects using `ember-template-imports` will need to migrate to `<template>` in order to upgrade to
Glint 1.0, as any remaining `hbs`-tagged templates will be treated as simple strings.

[fccts]: https://rfcs.emberjs.com/id/0779-first-class-component-templates/
[eti-no-more-hbs]: https://github.com/ember-template-imports/ember-template-imports/pull/18#issuecomment-1311185752

### Internal Type Updates

Between 0.9.x and 1.0, several updates landed to rework how Glint internally represents the types
of many template entities. For end users, this should result in simpler error messages, better
support for "plain-function" helpers, and more sensible assignability rules when working with types
like `ComponentLike<...>`.

This change also resulted in Glint (correctly!) flagging some new type errors that might previously
have been missed. One notable case of this is with Ember's `{{on}}` modifier, which in prior
versions would accept a callback that required a more specific `Event` subtype than was actually
appropriate based on the event being listened to.

Finally, note that this change is almost guaranteed to break most usage of private Glint types
from the template layer. If you've been using private APIs in 0.9.x, you'll likely need to update
that usage to be compatible with 1.0.

## Glint 0.8.x to 0.9.x

Glint 0.9 removes support for the `.glintrc.yml` file, moving configuration into your project's `tsconfig.json` or
`jsconfig.json` file under a `"glint"` key instead. It also restructures the format of the configuration slightly.

The changes are noted below, but also check out the [Configuration](configuration.md) guide for full details on
the options you can specify.

### Migrating `environment` and `checkStandaloneTemplates`

The `environment` and `checkStandaloneTemplates` options function exactly as before, and you can translate them directly
from YAML to JSON for use in your `tsconfig`/`jsconfig` file.

{% tabs %}
{% tab title=".glintrc.yml" %}

```yaml
environment:
  - ember-loose
  - ember-template-imports
```

{% endtab %}
{% tab title="tsconfig.json" %}

```javascript
{
  "compilerOptions": { /* ... */ },
  "glint": {
    "environment": ["ember-loose", "ember-template-imports"]
  }
}
```

{% endtab %}
{% endtabs %}

### Migrating `include` and `exclude`

The `include` and `exclude` options are now grouped together under a `transform` key in order to more clearly denote
their distinction from TypeScript's own `include`/`exclude`/`files` options.

{% tabs %}
{% tab title=".glintrc.yml" %}

```yaml
environment: ember-loose
include:
  - 'app/**'
  - 'tests/**'
```

{% endtab %}
{% tab title="tsconfig.json" %}

```javascript
{
  "compilerOptions": { /* ... */ },
  "glint": {
    "environment": "ember-loose",
    "transform": {
      "include": ["app/**", "tests/**"]
    }
  }
}
```

{% endtab %}
{% endtabs %}

{% hint style="info" %}
If you have an `include` array like the one above that effectively encompasses your whole project, you should instead
just drop that configuration and leave the `transform` key out of your configuration entirely.

Glint performs template analysis on all files covered by your `tsconfig` or `jsconfig` by default.
{% endhint %}

## Glint 0.7.x to 0.8.0

Glint 0.8.0 drops support for custom imports from `@glint/environment-ember-loose` for values from `@ember/component`,
`@glimmer/component` and `ember-modifier`. It also only supports usage of the standardized signature formats that have
been adopted in those upstream packages.

To migrate from previous Glint release to 0.8.0, you can first update to the most recent 0.7.x version of Glint and
follow the migration instructions for native signatures and imports below, either incrementally or all at once.

When you've finished your migration, you can update to Glint 0.8 and remove the
`import '@glint/environment-ember-loose/native-integration';` line from your project, leaving only
`import '@glint/environment-ember-loose';`.

## Native Signatures and Imports

This guide provides direction for migrating from custom Glint-specific import paths and signature formats to the
native imports and standardized signatures for `@ember/component`, `@glimmer/component` and `ember-modifier`.

### Background

Prior to version `0.7.4`, Glint required users to import the factories and base classes for components, helpers and
modifiers from custom environment-specific paths. This was because the "native" versions of those entities couldn't
capture enough information for Glint to typecheck them in a template with reasonable fidelity.

Consider `@glimmer/component` as an example.

```typescript
import Component from '@glimmer/component';

export interface MyComponentArgs {
  message: string;
}

export default class MyComponent extends Component<MyComponentArgs> {
  // ...
}
```

Knowing only about the `MyComponent`'s expected `@arg` values, Glint couldn't provide any validation or assistance
for what blocks the component accepts, what parameters it yields to those blocks, or what kind of modifiers would
be valid to apply to it.

### Signatures

Ember RFC [#748](https://github.com/emberjs/rfcs/pull/748) formalized a notion of "component signatures" based on
exploratory work Glint had done to find ways of expression the type information that `Args` alone couldn't capture.

The `@glimmer/component` package, as well as `ember-modifier` and `@types/ember__component` have been updated based on
the results of that RFC, and starting with version `0.7.4` of Glint, users may opt into using the regular import paths
and standardized signature formats those packages have adopted.

### Opting into Native Integration

In order to opt into Glint's augmentation of the native component, modifier and helper imports, add the following import
somewhere in your project (likely below wherever you have `import '@glint/environment-ember-loose'`):

```typescript
import '@glint/environment-ember-loose/native-integration';
```

In version `0.8.0`, integration will be enabled by default and this extra import will be unnecessary.

### New Signature Formats

As you move each component, modifier and helper in your project from the `environment-ember-loose` import path to the
native one, you'll also need to update its signature to the standardized format. You can make this migration
incrementally or all at once, depending on the size of your project.

#### Components

For components, there are two key changes (see [the relevant section](https://github.com/dfreeman/ember-rfcs/blob/glimmer-component-signature/text/0748-glimmer-component-signature.md#invokablecomponentsignature) in the RFC):

- `Yields` has become `Blocks`. This key has a more complex notional desugaring, but the shorthand is compatible with
  how `Yields` worked before.
- `Args` and `PositionalArgs` have been merged into `Args: { Named: ...; Positional: ... }`. If your component only has
  named args (which is true for all Glimmer components and most Ember components), the wrapping layer can be skipped
  and you can continue to use `Args: MyNamedArgs` as before.

{% tabs %}
{% tab title="Glimmer Component Before" %}

```typescript
import Component from '@glint/environment-ember-loose/glimmer-component';

export interface MyComponentSignature {
  Args: { message: string };
  Yields: { default: [] };
  Element: HTMLDivElement;
}

export default class MyComponent extends Component<MyComponentSignature> {
  // ...
}
```

{% endtab %}
{% tab title="Glimmer Component After" %}

```typescript
import Component from '@glimmer/component';

export interface MyComponentSignature {
  Args: { message: string };
  Blocks: { default: [] };
  Element: HTMLDivElement;
}

export default class MyComponent extends Component<MyComponentSignature> {
  // ...
}
```

{% endtab %}
{% endtabs %}

Template only components should now be imported directly from `@ember/component/template-only` instead of from
`@glint/environment-ember-loose/ember-component/template-only`.

Note that for `EmberComponent` subclasses, there is no native `ArgsFor` equivalent, and the `ArgsFor` helper type will
be removed in Glint `0.8.0` along with the rest of the `@glint/envrionment-ember-loose/ember-component` module.

You can instead define your named args in a dedicated type declaration, or write a simple `ArgsFor` helper for your own
project if you wish.

{% tabs %}
{% tab title="Ember Component Before" %}

```typescript
import Component, { ArgsFor } from '@glint/environment-ember-loose/ember-component';

export interface MyComponentSignature {
  Args: { count?: number };
  PositionalArgs: [message: string];
}

export default interface MyComponent extends ArgsFor<MyComponentSignature> {}
export default class MyComponent extends Component<MyComponentSignature> {
  // ...
}
```

{% endtab %}
{% tab title="Ember Component After" %}

```typescript
import Component from '@ember/component';

export interface MyComponentNamedArgs {
  count?: number;
}

export interface MyComponentSignature {
  Args: {
    Named: MyComponentNamedArgs;
    Positional: [message: string];
  };
}

export default interface MyComponent extends MyComponentNamedArgs {}
export default class MyComponent extends Component<MyComponentSignature> {
  // ...
}
```

{% endtab %}
{% endtabs %}

#### Helpers

For helpers, `NamedArgs` and `PositionalArgs` have been merged into `Args: { Named: ...; Positional: ... }`, similar to
the change for components. Unlike components, however, since neither type of argument is privileged over the other in
the way helpers are defined today, there is no shorthand.

{% tabs %}
{% tab title="Helper Before" %}

```typescript
import Helper from '@glint/environment-ember-loose/ember-component/helper';

export interface MyHelperSignature {
  PositionalArgs: [message: string];
  NamedArgs: { count?: number };
  Return: Array<string>;
}

export default class MyHelper extends Helper<MyHelperSignature> {
  // ...
}
```

{% endtab %}
{% tab title="Helper After" %}

```typescript
import Helper from '@ember/component/helper';

export interface MyHelperSignature {
  Args: {
    Positional: [message: string];
    Named: { count?: number };
  };
  Return: Array<string>;
}

export default class MyHelper extends Helper<MyHelperSignature> {
  // ...
}
```

{% endtab %}
{% endtabs %}

#### Modifiers

Modifier signatures have undergone the same revision as helper signatures. `NamedArgs` and `PositionalArgs` have been
merged into `Args: { Named: ...; Positional: ... }`, and similarly there is no shorthand for modifiers that have only
named or only positional args.

{% tabs %}
{% tab title="Modifier Before" %}

```typescript
import Modifier from '@glint/environment-ember-loose/ember-modifier';

export interface MyModifierSignature {
  PositionalArgs: [message: string];
  NamedArgs: { count?: number };
  Element: HTMLCanvasElement;
}

export default class MyModifier extends Modifier<MyModifierSignature> {
  // ...
}
```

{% endtab %}
{% tab title="Modifier After" %}

```typescript
import Modifier from 'ember-modifier';

export interface MyModifierSignature {
  Args: {
    Positional: [message: string];
    Named: { count?: number };
  };
  Element: HTMLCanvasElement;
}

export default class MyModifier extends Modifier<MyModifierSignature> {
  // ...
}
```

{% endtab %}
{% endtabs %}

#### Yielded Components

The `@glint/environment-ember-loose` package provided utility types `ComponentLike` and `ComponentWithBoundArgs` for
describing the type of abstract component-like values, such as the result of invoking the `{{component ...}}` helper.

Now that signatures have been standardized, `ComponentLike` is now available directly from `@glint/template`, which is
a types-only package that underlies all Glint environments. You can also find `HelperLike` and `ModifierLike` types
there, along with a `WithBoundArgs` type that will work with any of the above, as well as component, helper and modifier
definitions.

{% tabs %}
{% tab title="Contextual Components Before" %}

```typescript
import { ComponentLike, ComponentWithBoundArgs } from '@glint/environment-ember-loose';
import MySpecialInput from '...';

export interface MyComponentSignature {
  Yields: {
    default: [
      {
        // A component that just accepts a `@name` arg
        Label: ComponentLike<{ Args: { name: string } }>;
        // `MySpecialInput`, but with `id` and `form` already bound
        Input: ComponentWithBoundArgs<typeof MySpecialInput, 'id' | 'form'>;
      }
    ];
  };
}
```

{% endtab %}
{% tab title="Contextual Components After" %}

```typescript
import { ComponentLike, WithBoundArgs } from '@glint/template';
import MySpecialInput from '...';

export interface MyComponentSignature {
  Blocks: {
    default: [
      {
        // A component that just accepts a `@name` arg
        Label: ComponentLike<{ Args: { name: string } }>;
        // `MySpecialInput`, but with `id` and `form` already bound
        Input: WithBoundArgs<typeof MySpecialInput, 'id' | 'form'>;
      }
    ];
  };
}
```

{% endtab %}
{% endtabs %}


---

Glint is a set of tools to aid in developing code that uses the Glimmer VM for rendering, such as [Ember.js] v3.24+. Similar to [Vetur] for Vue projects or [Svelte Language Tools], Glint consists of a CLI and a language server to provide feedback and enforce correctness both locally during editing and project-wide in CI.

## Glint CLI

Glint's CLI provides a template-aware tool for performing end-to-end TypeScript typechecking on your project.

![Command line reporting of template type errors from `glint`](https://user-images.githubusercontent.com/108688/111076577-1d61db00-84ed-11eb-876a-e5b504758d11.png)

## Glint Language Server

The Glint language server implements the standardized [Language Server Protocol], allowing it to be easily incorporated into a variety of editors. The server enables Glimmer templates to participate in your editor's rich IDE features.

![Showing type information and documentation in templates on hover.](https://user-images.githubusercontent.com/108688/111069238-6eada280-84cc-11eb-9abb-c2d3af5e8976.png)

![Jumping to the definition of a component from where it's used in a template](https://user-images.githubusercontent.com/108688/111069304-b6ccc500-84cc-11eb-83b2-49681b248cbe.png)

![Locating all uses of a given component in a project](https://user-images.githubusercontent.com/108688/111070826-c6034100-84d3-11eb-9c12-e8e80e168940.png)

![Suggesting component arguments in typeahead with type information and documentation](https://user-images.githubusercontent.com/108688/111070948-3f9b2f00-84d4-11eb-9eaa-077cadf6f380.png)

[ember.js]: https://www.emberjs.com
[vetur]: https://github.com/vuejs/vetur
[svelte language tools]: https://github.com/sveltejs/language-tools
[language server protocol]: https://microsoft.github.io/language-server-protocol/


---

# Glint with JavaScript

If you have not yet migrated your project to TypeScript or you are in the process of migrating your project, the Glint CLI and language server will still function properly.

### Setup

All the Glint setup steps are identical.

{% hint style="info" %}
We do mean _identical_: unlike most existing JavaScript projects, you will need to include TypeScript in your dev dependencies.
{% endhint %}

Thus, installation for a JS setup looks like this:

{% tabs %}
{% tab title="pnpm" %}
```shell-session
pnpm add -D typescript @glint/core @glint/template @glint/environment-ember-loose
```
{% endtab %}

{% tab title="Yarn" %}
```shell-session
pnpm add -D typescript @glint/core @glint/template @glint/environment-ember-loose
```
{% endtab %}

{% tab title="npm" %}
```shell-session
npm install -D typescript @glint/core @glint/template @glint/environment-ember-loose
```
{% endtab %}
{% endtabs %}

{% code title="jsconfig.json" %}
```javascript
{
  "compilerOptions": { /* ... */ },
  "glint": {
    "environment": "ember-loose"
  }
}
```
{% endcode %}

{% hint style="info" %}
You can also use a `tsconfig.json` file with `compilerOptions.allowJs: true`.
{% endhint %}

### Providing JS "types"

To receive equivalent rich editor support for component JS files in your project, you will need to document your components with valid JSDoc. For example:

```gjs
// SimpleComponent.gjs

import Component from '@glimmer/component';

/**
 * Multiplies two numbers
 * @param {number} a - The first operand
 * @param {number} b - The second operand
 * @returns {number} The multiplied value.
 */
const multiply = (a, b) => a * b;

/**
 * @typedef SimpleComponentSignature
 * @property {object} Args
 * @property {number} Args.num
 */

/** @extends {Component<SimpleComponentSignature>} */
export default class SimpleComponent extends Component {
  foo = 5

  <template>
    <h1>{{@num}} * {{this.foo}} = {{multiply @num this.foo}}</h1>
  </template>
}
```

#### Signatures

It is possible write a full `Signature` type for a JS-only component. This will provide a useful hook not only for Glint, but also for documentation tools which can consume JSDoc. Here's an example of a fully-specified `Signature` for a JS component.

{% code title="app/components/fancy-input.js" %}
```javascript
import Component from '@glimmer/component';

/**
 * @typedef FancyInputArgs
 * @property {'input' | 'textarea'} type The type of input to render
 * @property {string} value The initial value to render into the input
 * @property {(newValue: string) => void} onChange An action to run when the
 *   input's value changes
 */

/**
 * @typedef {HTMLInputElement | HTMLTextAreaElement} FancyInputElement
 */

/**
 * @typedef FancyInputBlocks
 * @property {[]} label
 */

/**
 * @typedef FancyInputSignature
 * @property {FancyInputArgs} Args
 * @property {FancyInputElement} Element
 * @property {FancyInputBlocks} Blocks
 */

/**
 * A fancy `<input>` component, with styles pre-applied and some custom
 * handling.
 *
 * @extends {Component<FancyInputSignature>}
 */
export default class FancyInput extends Component {
  // implementation...
}
```
{% endcode %}

Let's walk through this in detail. First, the `Args` to the component specify that it receives:

* a `@type` argument specifying whether to render an `<input type='text'>` or a `<textarea>`
* a `@value` argument, which should be a string
* an `@onChange` action which receives the updated value and does something with it

```javascript
/**
 * @typedef FancyInputArgs
 * @property {'input' | 'textarea'} type The type of input to render
 * @property {string} value The initial value to render into the input
 * @property {(newValue: string) => void} onChange An action to run when the
 *   input's value changes
 */
```

The `@typedef` declaration for an `Element` must be a "union" type, declaring all the different types of element to which `...attributes` might be applied, with a pipe `|` as the "or" character for the different types. Here, we can imagine that the `...attributes` are applied to the input, and since it might be an `<input>` or a `<textarea>`, we write exactly that, using the names for the corresponding JS types:

```javascript
/**
 * @typedef {HTMLInputElement | HTMLTextAreaElement} FancyInputElement
 */
```

The component also provides a named block, `label`, which does not yield any value, allowing customization of the `<label>` for the `<input>`:

```javascript
/**
 * @typedef FancyInputBlocks
 * @property {[]} label
 */
```

Finally, the component signature itself assembles those and also specifies the `Element`:

<pre class="language-javascript"><code class="lang-javascript">/**
<strong> * @typedef FancyInputSignature
</strong> * @property {FancyInputArgs} Args
 * @property {FancyInputElement} Element
 * @property {FancyInputBlocks} Blocks
 */

/**
 * A fancy `&#x3C;input>` component, with styles pre-applied and some custom
 * handling.
 *
 * @extends {Component&#x3C;FancyInputSignature>}
 */
export default class FancyInput extends Component {
  // implementation...
}</code></pre>

Now this will provide useful completion, go-to-definition, and refactoring.

#### Caveats

Undocumented component JS files will behave exactly as regular undocumented JS behaves: no information will be provided for editor support apart from what can be derived from the context.

That caveat notwithstanding, Glint still offers quite a bit even without doc comments. Type info, basic refactorings, and go-to-definition will work for anything referring to `this`, and inference based on things that do have types (built-in items Glint knows about, third-party dependencies with Glint types, etc) will work as a baseline without any extra typing.

### Type checking for JS

To allow the Glint CLI and language server to report type errors in your JS files, you can leverage [@ts-check](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html#ts-check) on a file-by-file basis or [checkJs](https://www.typescriptlang.org/tsconfig#checkJs) in your jsconfig/tsconfig.json to enable typechecking for all JS files.


---

Glint is configured by adding a `"glint"` key to your project's `tsconfig.json` or `jsconfig.json` file.

{% code title="tsconfig.json" %}

```javascript
{
  "compilerOptions": { /* ... */ },
  "include": [ /* ... */ ],
  "glint": {
    "environment": "ember-loose"
  }
}
```

{% endcode %}

The general shape of the value of the `"glint"` key looks like this:

```typescript
interface GlintConfigInput {
  environment: string | Array<string> | Record<string, unknown>;
  checkStandaloneTemplates?: boolean;
}
```

Each key is summarized in further detail below.

## `environment`

The `environment` key specifies what Glint environment(s) your project is operating in. For instance, in loose-mode Ember.js project where you have `@glint/environment-ember-loose` installed, you could specify `"environment": "ember-loose"`. You may also specify an array if your project operates in multiple environments.

Some environments may accept user-specified configuration. To pass configuration into one or more environments, you can use an object literal mapping environment names to their config:

```javascript
"glint" {
  "environment": {
    "ember-template-imports": {
      "additionalGlobals": ["my-special-template-macro"]
    }
  }
}
```

## `checkStandaloneTemplates`

In environments like `ember-loose` that support templates in separate files from their backing class, Glint normally determines whether to typecheck a template based on whether its backing class is in a `.ts` or `.js` file. However, for a template-only component, there's no backing module to check.

This flag defaults to `true`, and setting it to `false` means Glint will never produce type errors for templates that don't have a corresponding `.js` or `.ts` file.


---

Glint works out of the box with TypeScript’s [Project References][pr] feature: Instead of running just `glint`, you run `glint --build`, and Glint will correctly do incremental builds for composite projects.

{% hint style="info" %}

This is not a guide to project references and composite projects. Instead, see [the TypeScript docs][pr].

{% endhint %}

As with project references in general, there are a few extra pieces of configuration to add, though.

[pr]: http://www.typescriptlang.org/docs/handbook/project-references.html#composite

## Shared project-wide configuration

First, as with project references in general, you should define your `glint` config in a shared compiler options `tsconfig.json` at the root. For example, you might have something like this as a `tsconfig.shared.json`:

```jsonc
{
  "compilerOptions": {
    // ...
  },
  "glint": {
    "environment": "ember-template-imports"
  }
}
```

Then each project within can use the `extends` key to reuse both TypeScript and Glint configuration. For example, if your project has sub-projects all located in `packages/<project>`, a sub-project might have a `tsconfig.json` file like this:

```jsonc
{
  "extends": "../../tsconfig.shared.json",
  "compilerOptions": {
    "composite": true
  }
}
```

## Per-project configuration

To work with Glint, each sub-project needs to include the Glint environment imports it uses. (See [Ember: Installation][ei] for details.) For example, a project using `ember-template-imports` should have this import visible somewhere:

```ts
import '@glint/environment-ember-template-imports';
```

[ei]: ../ember/installation.md

The easiest way to do this is to add it to a shared file all projects can reference using the `include` key in each sub-project's `tsconfig.json`.
If you do not already have something filling this role, you should introduce a `local-types` directory (named however you like) in the root of your project, with an `index.d.ts` in it.

{% hint style="info" %}

If you are using `ember-cli-typescript`, you can do this in the `types/index.d.ts` file created automatically for you by the addon. Just make sure you add that directory to the `include` field in all your sub-project `tsconfig.json` files.

{% endhint %}

The resulting project structure might look something like this, given sub-projects in `packages` which have their TypeScript source files in a `src` directory:

```
.
├── package.json
├── packages
│   ├── a
│   │   ├── local-types
│   │   │   └── index.d.ts
│   │   ├── package.json
│   │   ├── src
│   │   └── tsconfig.json
│   └── b
│       ├── package.json
│       ├── src
│       └── tsconfig.json
├── tsconfig.json
├── tsconfig.shared.json
└── local-types
    └── index.d.ts
```

With this structure, the sub-project configurations, like `packages/a/tsconfig.json`, can be very minimal. The only things they need to do are:

- extend the root options config
- include the `types` directory as well as their own files

```json
{
  "extends": "../../tsconfig.shared.json",
  "compilerOptions": {
    "composite": true
  },
  "include": ["../../local-types", "./src"]
}
```

## Customizing sub-project configuration

If needed, you can customize each sub-project by overriding its `glint` settings, just as you can with `compilerOptions`. For example, if you have one sub-project which is using the `ember-loose` environment instead of `ember-template-imports`, you would need to make two changes for that package:

- include the corresponding import in a file in the project (or in another shared location)
- update the `glint` config in that project's `tsconfig.json`

If this were in sub-project `a` from the example above, the resulting layout might look like this:

```
├── packages
│   ├── a
│   │   ├── local-types
│   │   │   └── index.d.ts
│   │   ├── package.json
│   │   ├── src
│   │   └── tsconfig.json
```

The updated `packages/a/tsconfig.json` file might look like this:

```json
{
  "extends": "../../tsconfig.shared.json",
  "compilerOptions": {
    "composite": true
  },
  "include": ["./local-types", "./src"],
  "glint": {
    "environment": "ember-loose"
  }
}
```

Note that here it uses `local-types` from `a`, _not_ from the root. You can also have both present:

```json
{
  "include": ["../../local-types/**/*.ts", "./local-types/**/*.ts", "./src/**/*.ts"]
}
```

The key is to make sure each project has all required imports available, and _not_ to have imports present which a given sub-project does not require.


---

Adding Glint support to TypeScript-based addons can provide a lot of value.

First, the addon itself will benefit from the additional typing coverage, as all templates in rendering tests or the dummy app will get type checked, thus increasing type safety and decreasing the likelihood of any type inconsistencies sneaking in over time (e.g. false positives in tests).

Second, it makes consuming the addon for Glint-enabled apps much easier, providing proper Glint-compatible types out of the box.

## Publishing addons with Glint types

The first step is adding the proper Glint signature types to all the addon's components, helpers and modifiers, just the same way as described in these guides.

If all apps were already using [first class component templates] (i.e. [strict mode] templates), this would be all we need to do. But as this is certainly not the case for the time being, we will need to find a way to expose the required [Template Registry] entries to the consuming app, in an easy but also flexible way.

As described in the [Using Addons] guide, the _easy_ way for users is to import an interface from the addon containing all the registry entries. This is for the most common case in which the app is consuming the addon provided components, helpers and modifiers as they are. The convention here is for the addon - when published on npm - to provide a `template-registry.d.ts` file, that the app will import as `import AwesomeAddonRegistry from 'awesome-addon/template-registry'` and then use to extend its own global registry.

For a (v1) addon using [`ember-cli-typescript`][ect] this would be a `/addon/template-registry.ts` file, which needs to contain registry entries for all the public components (helpers, modifiers) the addon exposes to the app (in the addon's `/app` tree):

{% code title="/addon/template-registry.ts" %}

```typescript
import type AwesomeButton from 'awesome-addon/components/awesome-button';
import type AwesomeModal from 'awesome-addon/components/awesome-modal';

export default interface AwesomeAddonRegistry {
  AwesomeButton: typeof AwesomeButton;
  AwesomeModal: typeof AwesomeModal;
  // ...
}
```

{% endcode %}

While this easy way, which only requires the app to import this single file, is sufficient for the majority of cases, it also has its limitations. Apps can replace or extend addon provided components (helpers, modifiers), by creating a component in the app itself with the same name. The addon provided types as proposed above may not match the app's replacements, so we also need to support a _flexible_ approach that accounts for this.

This is given by letting the app manage the registry entries on its own, thereby being able to pick what to import from the addon directly and what to replace with its own custom types.

Note: in apps, we generally define the registry entries right in the actual file itself so that it is nicely co-located with the signature and implementation. If an app imported such a module from an addon, though, TypeScript would see the registry declaration there and apply it, which is exactly what we want to prevent. For addons it is therefore recommended that all the registry entries are exposed as an importable type in `/addon/template-registry.ts` as described above, and _not_ to the file containing the actual class!

A real world example of this setup can be seen in [`ember-responsive-image`][eri]

## Adding Glint types to addons not written in TypeScript

Even if an addon author has choosen not to adopt TypeScript, the addon can still ship Glint types! The setup, however, will be slightly different. First, without [`ember-cli-typescript`][ect], types in `/addon/template-registry.ts` won't be emitted to `/template-registry.d.ts` on publish, so you'll need to do what you would have done in `/addon/template-registry.ts` in `/template-registry.d.ts` instead. Also, since the components, helpers, and modifiers are not written in TypeScript, we can't add type signatures to them directly. Instead we'll need to create declaration files for them. And these files will need to use the importable path directly from the root of the addon (not under `/addon/`). Here's an example:

{% code title="/components/awesome-button.d.ts" %}

```typescript
import Component from '@glimmer/component';

interface AwesomeButtonSignature {
  Element: HTMLButtonElement;
  Args: {
    label: string;
  };
}

export default class AwesomeButton extends Component<AwesomeButtonSignature> {}
```

{% endcode %}

{% code title="/helpers/awesome-sauce.d.ts" %}

```typescript
import Helper from '@ember/component/helper';

interface AwesomeSauceSignature {
  Args: {
    Positional: [string];
  };
  Return: string;
}

export default class AwesomeSauce extends Helper<AwesomeSauceSignature> {}
```

{% endcode %}

{% code title="/template-registry.d.ts" %}

```typescript
import type AwesomeButton from './components/awesome-button';
import type AwesomeSauce from './helpers/awesome-sauce';

export default interface AwesomeAddonRegistry {
  AwesomeButton: typeof AwesomeButton;
  'awesome-sauce': typeof AwesomeSauce;
  // ...
}
```

{% endcode %}

By defining the component, helper, and modifier types in separate importable files (rather than just directly in `template-registry.d.ts`), consumers using [first class component templates] can import them from the correct paths.

[strict mode]: http://emberjs.github.io/rfcs/0496-handlebars-strict-mode.html
[first class component templates]: http://emberjs.github.io/rfcs/0779-first-class-component-templates.html
[template registry]: template-registry.md
[using addons]: using-addons.md
[ect]: https://github.com/typed-ember/ember-cli-typescript
[eri]: https://github.com/kaliber5/ember-responsive-image


---

Since the implementation of [RFC 748], Glimmer and Ember components accept a `Signature` type parameter as part of their
definition. This parameter is expected to be an object type with (up to) three members: `Args`, `Element` and `Blocks`.

[rfc 748]: https://github.com/emberjs/rfcs/pull/748

`Args` represents the arguments your component accepts. Typically this will be an object type mapping the names of your
args to their expected type. If no `Args` key is specified, it will be a type error to pass any arguments to your
component.

The `Element` field declares what type of element(s), if any, the component applies its passed `...attributes` to. This
is often the component's root element. Tracking this type ensures any modifiers used on your component will be
compatible with the DOM element(s) they're ultimately attached to. If no `Element` is specified, it will be a type error
to set any HTML attributes or modifiers when invoking your component.

The `Blocks` field specifies the names of any blocks the component yields to, as well as the type of any parameter(s)
those blocks will receive. If your component does not support block invocation, omit the `Blocks` field altogether 
to generate type errors when invoked in block form.

Note that the `inverse` block is an alias for `else`. These should be defined in `Blocks` as `else`, though
`{{yield to="inverse"}}` will continue to work.

## Glimmer Components

{% code title="app/components/super-table.ts" %}

```typescript
import Component from '@glimmer/component';

export interface SuperTableSignature<T> {
  // We have a `<table>` as our root element
  Element: HTMLTableElement;
  // We accept an array of items, one per row
  Args: {
    items: Array<T>;
  };
  // We accept two named blocks: a parameter-less `header` block
  // and a `row` block which will be invoked with each item and
  // its index sequentially.
  Blocks: {
    header: [];
    row: [item: T, index: number];
  };
}

export default class SuperTable<T> extends Component<SuperTableSignature<T>> {}
```

{% endcode %}

{% code title="app/components/super-table.hbs" %}

```handlebars
<table ...attributes>
  {{#if (has-block 'header')}}
    <thead>
      <tr>{{yield to='header'}}</tr>
    </thead>
  {{/if}}

  <tbody>
    {{#each @items as |item index|}}
      <tr>{{yield item index to='row'}}</tr>
    {{/each}}
  </tbody>
</table>
```

{% endcode %}

{% code title="app/components/simple-hello.ts" %}

```typescript
import Component from '@glimmer/component';

export interface SimpleHelloSignature {
  // We have a `<div>` as our root element
  Element: HTMLDivElement;
  // We accept no arguments or block form, so don't specify them in the signature
}

export default class SimpleHello extends Component<SimpleHelloSignature> {}
```

{% endcode %}

{% code title="app/components/simple-hello.hbs" %}

```handlebars
<div>Hello World!</div>
```

{% endcode %}

## Ember Components

Since Ember components don't have `this.args`, it takes slightly more boilerplate to make them typesafe.

{% code title="app/components/greeting.ts" %}

```typescript
import Component from '@ember/component';
import { computed } from '@ember/object';

export interface GreetingSignature {
  Args: {
    message: string;
    target?: string;
  };
  Blocks: {
    default: [greeting: string];
  };
}

// We define this type alias so that we can extend it below:
type GreetingArgs = GreetingSignature['Args'];

// This line declares that our component's args will be 'splatted' on to the instance:
export default interface Greeting extends GreetingArgs {}
export default class Greeting extends Component<GreetingSignature> {
  @computed('target')
  private get greetingTarget() {
    // Therefore making `this.target` a legal `string | undefined` property access:
    return this.target ?? 'World';
  }
}
```

{% endcode %}

{% code title="app/components/greeting.hbs" %}

```handlebars
{{yield (concat @message ', ' this.greetingTarget '!')}}
```

{% endcode %}

Ember components also support positional arguments in their signature. Such usage is relatively rare, but components such as [`{{animated-if}}`](https://github.com/ember-animation/ember-animated) do take advantage of it.

{% code title="app/components/greeting.ts" %}

```typescript
// ...

export interface GreetingSignature {
  Args: {
    Named: {
      message: string;
      target?: string;
    };
    Positional: [extraSpecialPreamble: string];
  };
  Blocks: {
    default: [greeting: string];
  };
}

type GreetingArgs = GreetingSignature['Args']['Named'];

export default interface Greeting extends GreetingArgs {}
export default class Greeting extends Component<GreetingSignature> {
  static positionalParams = ['extraSpecialPreamble'];
  declare readonly extraSpecialPreamble: string;
  // ...
}
```

{% endcode %}

Positional args are specified as a `Positional` tuple nested within `Args`, the same way they are in helper and modifier signatures. You can also specify positional args with `ComponentLike` types in this way.

Note that both `Positional` args and the `Element` type are not fully integrated with the string-based APIs on the `@ember/component` base class. This means, for example, that there's no enforcement that `tagName = 'table'` and `Element: HTMLTableElement` are actually correlated to one another.


---

Like components, helpers and modifiers can also have their behavior in templates described by a `Signature` type.

## Helpers

A helper signature has two keys: `Args` and `Return`. The `Args` key is further broken down into `Named` and
`Positional` elements, representing respectively the expected types of the named and positional arguments your helper
expects to receive.

{% tabs %}
{% tab title="Class-Based" %}

```typescript
import Helper from '@ember/component/helper';

type Positional = Array<number>;
type Named = { andThenMultiplyBy?: number };

export interface AddSignature {
  Args: {
    Positional: Positional;
    Named: Named;
  };
  Return: number;
}

export default class AddHelper extends Helper<AddSignature> {
  public compute(values: Positional, named: Named): number {
    let total = values.reduce((sum, next) => sum + next, 0);
    if (typeof named.andThenMultiplyBy === 'number') {
      total *= named.andThenMultiplyBy;
    }
    return total;
  }
}
```

{% endtab %}
{% tab title="Function-Based" %}

```typescript
import { helper } from '@ember/component/helper';

export interface AddSignature {
  Args: {
    Positional: Array<number>;
    Named: { andThenMultiplyBy?: number };
  };
  Return: number;
}

const add = helper<AddSignature>((values, { andThenMultiplyBy }) => {
  let total = values.reduce((sum, next) => sum + next, 0);
  if (typeof andThenMultiplyBy === 'number') {
    total *= andThenMultiplyBy;
  }
  return total;
});

export default add;
```

{% endtab %}
{% tab title="Function-Based (Inferred Signature)" %}

```typescript
import { helper } from '@ember/component/helper';

const add = helper((values: Array<number>, named: { andThenMultiplyBy?: number }) => {
  let total = values.reduce((sum, next) => sum + next, 0);
  if (typeof named.andThenMultiplyBy === 'number') {
    total *= named.andThenMultiplyBy;
  }
  return total;
});

export default add;
```

{% endtab %}
{% endtabs %}

## Modifiers

A modifier's `Args` are split into `Named` and `Positional` as with helpers, but unlike helpers they have no `Return`,
since modifiers don't return a value. Their signtures can, however, specify the type of DOM `Element` they are
compatible with.

{% tabs %}
{% tab title="Class-Based" %}

```typescript
import Modifier from 'ember-modifier';
import { renderToCanvas, VertexArray, RenderOptions } from 'neat-webgl-library';

type Positional = [model: VertexArray];

export interface Render3DModelSignature {
  Element: HTMLCanvasElement;
  Args: {
    Positional: Positional;
    Named: RenderOptions;
  };
}

export default class Render3DModel extends Modifier<Render3DModelSignature> {
  modify(element: HTMLCanvasElement, [model]: Positional, named: RenderOptions) {
    renderToCanvas(element, model, options);
  }
}
```

{% endtab %}
{% tab title="Function-Based" %}

```typescript
import { modifier } from 'ember-modifier';
import { renderToCanvas, RenderOptions, VertexArray } from 'neat-webgl-library';

export interface Render3DModelSignature {
  Element: HTMLCanvasElement;
  Args: {
    Positional: [model: VertexArray];
    Named: RenderOptions;
  };
}

const render3DModel = modifier<Render3DModelSignature>((element, [model], options) => {
  renderToCanvas(element, model, options);
});

export default render3DModel;
```

{% endtab %}
{% tab title="Function-Based (Inferred Signature)" %}

```typescript
import { modifier } from 'ember-modifier';
import { renderToCanvas, RenderOptions, VertexArray } from 'neat-webgl-library';

const render3DModel = modifier<Render3DModelSignature>(
  (element: HTMLCanvasElement, [model]: [model: VertexArray], options: RenderOptions): void => {
    renderToCanvas(element, model, options);
  }
);

export default render3DModel;
```

{% endtab %}
{% endtabs %}


---

To use Glint with [Ember](https://github.com/emberjs/ember.js) v3.24 or higher, you'll need to:
 1. add the `@glint/core`, `@glint/template` and `@glint/environment-ember-loose` packages to your project's `devDependencies`
 2. add a `"glint"` key with appropriate config to your project's `tsconfig.json`
 3. add `import '@glint/environment-ember-loose';` somewhere in your project 

Read on for a more detailed explanation of each of these steps.

{% tabs %}
{% tab title="pnpm" %}

```sh
pnpm add -D @glint/core @glint/template @glint/environment-ember-loose
```

{% endtab %}
{% tab title="Yarn" %}

```sh
pnpm add -D @glint/core @glint/template @glint/environment-ember-loose
```

{% endtab %}
{% tab title="npm" %}

```sh
npm install -D @glint/core @glint/template @glint/environment-ember-loose
```

{% endtab %}
{% endtabs %}

{% code title="tsconfig.json" %}

```javascript
{
  "compilerOptions": { /* ... */ },
  "glint": {
    "environment": "ember-loose"
  }
}
```

{% endcode %}

{% hint style="info" %}

Using `ember-template-imports`? See [Ember: Template Imports][etii] for additional installation steps.

[etii]: ../ember/template-imports.md#installation

{% endhint %}

Note that, by default, Glint will assume you want it to analyze all templates in the codebase that are covered by your `tsconfig.json`. To ignore any type errors up front so that you can incrementally migrate your project to typesafe templates, consider using [the `auto-glint-nocheck` script](https://github.com/typed-ember/glint/tree/main/packages/scripts#auto-glint-nocheck) to add [`@glint-nocheck` comments](../directives.md#glint-nocheck) to your existing templates that would produce errors.

Finally, ensure you've added the following statement somewhere in your project's source files or ambient type declarations:

```typescript
import '@glint/environment-ember-loose';
```

{% hint style="info" %}

When typechecking with vanilla `tsc` or your editor's `tsserver` integration, adding this side-effect `import` statement ensures that TypeScript is aware of the Glint-specific types provided by the environment package. Without this line, you may find that vanilla TypeScript produces spurious errors.

{% endhint %}

## Version Requirements

Because Glint uses your project-local copy of TypeScript and the packages whose types it augments for use in templates, it requires certain minimum versions of those packages for compatibility.

| Package                   | Minimum Version |
| ------------------------- | --------------- |
| `typescript`              | 4.8.0           |
| `@types/ember__component` | 4.0.8           |
| `@glimmer/component`      | 1.1.2           |
| `ember-modifier`          | 3.2.7           |

It's possible to use the 4.x versions of the `@types/ember*` packages even if your project is still using an Ember 3.x LTS. Just note that any deprecated APIs you're using that were removed in 4.0 won't be available in the types, and APIs added later _will_ be present in them.

## Ember CLI TypeScript

If you are using Glint with TypeScript and Ember, visit the [Ember CLI TypeScript documentation](https://docs.ember-cli-typescript.com/) for more information.


---

Templates rendered in tests using `ember-cli-htmlbars`'s `hbs` tag will be checked the same way as standalone `hbs` files.

```typescript
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

test('MyComponent works', async function (assert) {
  // If `@arg` is declared to be a string, you'll get a squiggle here
  await render(hbs`<MyComponent @arg={{123}} />`);

  assert.dom().hasText('...');
});
```

In some TypeScript codebases it's common practice to define per-module (or even per-test) context types that include additional properties. If you do this and need to access these properties in your template, you can include the context type as a parameter to `render`.

```typescript
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import type { TestContext } from '@ember/test-helpers';

interface MyContext extends TestContext {
  message: string;
}

test('MyComponent works', async function (this: MyContext, assert) {
  this.message = 'hello';

  await render<MyContext>(hbs`
    <MyComponent @arg={{this.message}} />
  `);

  assert.dom().hasText('...');
});
```


---

Templates associated with Ember routes and/or controllers will be typechecked against those backing classes without needing to import from Glint-specific paths.

If a controller class exists, then `@model` in the corresponding template will have the type of the controller's declared `model` property, and `{{this}}` will be the type of the controller itself.

```typescript
export default class MyController extends Controller {
  declare model: MyModelType;

  greeting = 'Hello, world!';
}
```

<!-- prettier-ignore -->
```handlebars
{{this}} {{! MyController }}
{{this.greeting}} {{! string }}
{{this.model}} {{! MyModelType }}
{{@model}} {{! MyModelType }}
```

If no controller exists but a route does, then `{{@model}}` will be the return type of the route's `model()` hook (unwrapping any promise if necessary), and `{{this}}` will be the type of an empty controller with a `model` property of the same type as `@model`.

```typescript
export default class MyRoute extends Route {
  async model(): Promise<MyModelType> {
    // ...
  }
}
```

<!-- prettier-ignore -->
```handlebars
{{this}} {{! Controller & { model: MyModelType } }}
{{this.model}} {{! MyModelType }}
{{@model}} {{! MyModelType }}
```

For `error` substate routes, the type of `{{@model}}` will not be automatically inferred. You will need to create a backing class for the route if you consume its model in the corresponding template:

```typescript
export default class ErrorRoute extends Route<Error> {
  // ...
}
```

<!-- prettier-ignore -->
```handlebars
{{@model}} {{! Error }}
```

---

When adding Glint to an Ember project with `ember-template-imports` installed, there are a few additional things to consider.

## Installation

In addition to the `@glint/core`, `@glint/template` and `@glint/environment-ember-loose` packages, you also need to install the `@glint/environment-ember-template-imports` package and configure it in `tsconfig.json` under `glint.environment`:

{% tabs %}
{% tab title="pnpm" %}

```sh
pnpm add -D @glint/core @glint/template @glint/environment-ember-loose @glint/environment-ember-template-imports
```

{% endtab %}
{% tab title="Yarn" %}

```sh
pnpm add -D @glint/core @glint/template @glint/environment-ember-loose @glint/environment-ember-template-imports
```

{% endtab %}
{% tab title="npm" %}

```sh
npm install -D @glint/core @glint/template @glint/environment-ember-loose @glint/environment-ember-template-imports
```

{% endtab %}
{% endtabs %}

{% code title="tsconfig.json" %}

```javascript
{
  "compilerOptions": { /* ... */ },
  "glint": {
    "environment": [
      "ember-loose",
      "ember-template-imports",
    ]
  }
}
```

Additionally, ensure you've added the following statement somewhere in your project's source files or ambient type declarations:

```typescript
import '@glint/environment-ember-template-imports';
```

{% endcode %}

## Template-Only Components

When using `ember-template-imports`, you can declare the type of a `<template>` component using the `TOC` type:

{% code title="app/components/shout.gts %}

```glimmer-ts
import type { TOC } from '@ember/component/template-only';

interface ShoutSignature {
  Element: HTMLDivElement;
  Args: { message: string };
  Blocks: {
    default: [shoutedMessage: string];
  };
}

const louderPlease = (message: string) => message.toUpperCase();

<template>
    <div ...attributes>
        {{yield (louderPlease @message)}}
    </div>
</template> satisfies TOC<ShoutSignature>;
```

{% endcode %}


---

A template-only component is any template for which Ember (and Glint) can't locate a backing TS or JS module. In Glint, these are treated very similarly to a component with an empty signature: it has no args, and it can't yield to blocks or apply `...attributes` anywhere. Additionally, the value of `{{this}}` in such a template will be `void`.

While it's possible to do some simple things like invoking other components from these templates, typically you'll want to create a backing module for your template so you can declare its signature, add it to the template registry, and so on.

```typescript
import templateOnlyComponent from '@ember/component/template-only';

interface ShoutSignature {
  Element: HTMLDivElement;
  Args: { message: string };
  Blocks: {
    default: [shoutedMessage: string];
  };
}

const Shout = templateOnlyComponent<ShoutSignature>();

export default Shout;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Shout: typeof Shout;
  }
}
```

Note that the runtime content of this module (effectively `export default templateOnlyComponent();`) is exactly what Ember generates at build time when creating a backing module for a template-only component.

{% hint style="info" %}

Using `ember-template-imports`? See [Ember: Template Imports][etitoc] on how to declare types for a `<template>`-only component.

[etitoc]: ../ember/template-imports.md#template-only-components
{% endhint %}

Due to the way TypeScript works, it's not possible to have a generic signature for template-only components:

```typescript
import templateOnlyComponent from '@ember/component/template-only';

interface ShoutSignature<T> {
  Args: { message: T };
  Blocks: {
    default: [shoutedMessage: T];
  };
}

const Shout = templateOnlyComponent<ShoutSignature<???>>();
```

If that's needed, you must create an (empty) backing class:

```typescript
import Component from '@glimmer/component';

interface ShoutSignature<T> {
  // same as above
}

export default class Shout<T> extends Component<ShoutSignature<T>> {}
```


---

Because Ember's template resolution occurs dynamically at runtime today, Glint needs a way of mapping the names used in your templates to the actual backing value they'll be resolved to. This takes the form of a "type registry" similar to the one that powers Ember Data's types.

The recommended approach is to include a declaration in each component, modifier or helper module that adds it to the registry, which is the default export of `@glint/environment-ember-loose/registry`.

With [first-class component templates][fccts], the day is coming when we won't need this anymore, because any components/helpers/modifiers you use will already be statically in scope, but for now this approach ensures compatibility with the effective global scope of loose-mode templates.

[fccts]: https://github.com/emberjs/rfcs/pull/779

## Components

{% code title="app/components/greeting.ts" %}

```typescript
import Component from '@glimmer/component';

export default class Greeting extends Component {
  // ...
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Greeting: typeof Greeting;
  }
}
```

{% endcode %}

If you've nested your component inside folder(s), you'll need to add the full "strong" name of the component to the registry. And, if you're expecting to invoke your component with curlies or the `{{component}}` helper, you'll need to add the component to the registry twice—once using the `::` delimiter syntax and once using the `/` delimiter syntax. For example:

{% code title="app/components/grouping/my-component.ts" %}

```typescript
export default class MyComponent extends Component {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Grouping::MyComponent': typeof MyComponent;
    'grouping/my-component': typeof MyComponent;
  }
}
```

{% endcode %}

This would let Glint understand the component if it's invoked in any of the following ways:

```handlebars
<Grouping::MyComponent />

{{grouping/my-component}}

{{#let (component 'grouping/my-component') as |Foo|}}
  <Foo />
{{/let}}
```

## Helpers and Modifiers

Helpers and modifiers can be added to the registry using the `typeof` type operator in much the same way as components:

```typescript
import { helper } from '@ember/component/helper';

const sum = helper((values: Array<number>) => {
  return values.reduce((sum, next) => sum + next, 0);
});

export default sum;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    sum: typeof sum;
  }
}
```


---

Your app likely uses already a lot of addons, and most if not all of them will not ship with Glint-compatible types yet. This means that for all the components, helpers or modifiers that you use, you will need to add some types so Glint can understand them.

The community has begun maintaining a shared [`glint-template-types`] repository with Glint-compatible type declarations for commonly used Ember addons. The README there contains information about how to take advantage of these shared declarations for addons you may use in your Ember projects.

## Typing your dependencies

For addons that neither ship their own types nor are covered by any existing shared ambient declarations as mentioned above, you will need to write their types by yourself. You can do this from a `.d.ts` file.

Here's an example that provides types for the `page-title` helper and the `WelcomePage` component that are present in a newly-generated Ember app:

{% code title="types/global.d.ts" %}

```typescript
import { ComponentLike, HelperLike } from '@glint/template';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    WelcomePage: ComponentLike;
    'page-title': HelperLike<{
      Args: { Positional: [title: string] };
      Return: void;
    }>;
  }
}
```

{% endcode %}

These two entries provide all the type information necessary for the application template in the default app blueprint
to typecheck.

{% code title="app/templates/application.hbs" %}

```handlebars
{{page-title 'MyApp'}}

{{! The following component displays Ember's default welcome message. }}
<WelcomePage />
{{! Feel free to remove this! }}

{{outlet}}
```

{% endcode %}

## Using Glint-enabled addons

For addons that already ship with Glint-compatible types there is only a little to do. Their README might contain some specific instructions, but if the addon follows Glint's recommendations for [authoring addons][authoring], the basic steps are as follows.

If you are already using [strict mode] templates (via [first class component templates]), you are already explicitly importing all the components, helpers and modifiers in use by the template, so Glint already has all the typing information at hand, and nothing more is required!

But more likely you are still using classic `.hbs` template files, for which Glint needs to know e.g. which component _name_ maps to which component _class_ and hence its type. This is managed by the [Template Registry], which needs to be extended for all the components, helpers and modifiers provided by the addon.

By convention according to the [Authoring Guide][authoring], the addon will ship a `template-registry.d.ts` file that exports a type containing all the registry entries for components, helpers and modifiers it exposes. To use these entries, you can declare that the `@glint/environment-ember-loose` registry `extends` the addon registry in the same place you add your local declarations.

{% code title="types/global.d.ts" %}

```typescript
import '@glint/environment-ember-loose';

import type ResponsiveImageRegistry from 'ember-responsive-image/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends ResponsiveImageRegistry, /* other addon registries */ {
    // local entries
  }
}
```

{% endcode %}

In the majority of cases this should be all you need!

However, if you have for example extended or overridden a component of that addon, by having an implementation with the same name in your _app_, but with a somewhat different shape (e.g. additional arguments), then you will need to tweak the registry entries you add, as the ones provided by the addon will not match the type of your replaced component.

Add the registry entry for the replaced component as you would for any other of your app, as described under [Template Registry]. To include everything _except_ a specific component, you can use TypeScript's `Omit` utility type on the original registry to leave that entry out. 

{% code title="types/global.d.ts" %}

```typescript
import type ResponsiveImageRegistry from 'ember-responsive-image/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends Omit<ResponsiveImageRegistry, 'ResponsiveImage'> {
    ResponsiveImage: typeof MyCustomOverriddenResponsiveImage;
    // ...
  }
}
```

{% endcode %}

You can also ignore the registry entirely and instead import and add _only_ individual entries from an addon:

{% code title="types/global.d.ts" %}

```typescript
import type ResponsiveImage from 'ember-responsive-image/components/responsive-image';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ResponsiveImage: typeof ResponsiveImage;
    // ...
  }
}
```

{% endcode %}

[`glint-template-types`]: https://github.com/Gavant/glint-template-types
[authoring]: authoring-addons.md
[strict mode]: http://emberjs.github.io/rfcs/0496-handlebars-strict-mode.html
[first class component templates]: http://emberjs.github.io/rfcs/0779-first-class-component-templates.html
[template registry]: template-registry.md


---

# Ember



---

