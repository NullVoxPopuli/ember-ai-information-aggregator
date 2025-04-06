Welcome to the Ember.js Guides! This documentation will take you from total beginner to Ember expert.

With the plethora of libraries readily available for front-end development, sometimes it can be a little confusing to work with a front-end framework like Ember.js, where _everything_ you need to build an application is already included. To that end, we've segmented out each part of the guides so you can focus on just the part you want to work with. This should also make it faster for you to find what you need!

<ul class="list-cards">
	<li class="list-item-card">
		<div class="shape shape--dark"></div>
    <div class="shape shape--accent"></div>
    <div class="shape shape--light"></div>
		<a href="./getting-started/">Ember.js</a>
	</li>
	<li class="list-item-card">
		<div class="shape shape--dark"></div>
    <div class="shape shape--accent"></div>
    <div class="shape shape--light"></div>
		<a href="./models/">EmberData</a>
	</li>
	<li class="list-item-card">
		<div class="shape shape--dark"></div>
    <div class="shape shape--accent"></div>
    <div class="shape shape--light"></div>		
		<a href="https://cli.emberjs.com/release/">Ember CLI</a></li>
	<li class="list-item-card">
		<div class="shape shape--dark"></div>
    <div class="shape shape--accent"></div>
    <div class="shape shape--light"></div>		
		<a href="./ember-inspector/">Ember Inspector</a></li>
</ul>


---

In this section, you will learn about the configurations and libraries that affect an entire application's accessibility.

## Lang Attribute

Declaring the language of the HTML document allows users to better understand your content.

> Both assistive technologies and conventional user agents can render text more accurately when the language of the Web page is identified. Screen readers can load the correct pronunciation rules. Visual browsers can display characters and scripts correctly. Media players can show captions correctly. As a result, users with disabilities will be better able to understand the content.
> [WCAG Success Criterion 3.1.1: Intent](https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html#intent)

A primary language should be defined on the `<html>` element's `lang` attribute. For new apps, you can use the `--lang` option on the `ember new` command to set the language for a new application.

```bash
ember new mon-app --lang fr
```

This command will create your application with French defined as the primary language
on the `<html>` element's `lang` attribute.

For existing Ember apps, a developer may edit the `index.html` file or leverage [ember-intl](https://github.com/ember-intl/ember-intl).

The `html` element may not have multiple `lang` _values_. If an element contains content in a language different from the primary, then you can provide the element its own `lang` attribute.

![For example, the HTML tag may have a lang of "es" while a paragraph may have a lang of "en"](/images/accessibility/application-considerations/lang.png)

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
        To learn more about the lang attribute and how to use it: <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang">https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang</a>. Unsure which language subtag to use? Try <a href="https://r12a.github.io/app-subtags/">the Language Subtag Lookup tool</a>.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Accessibility addons

Any addon that will provide UI elements to the application should be evaluated for accessibility before use.

There are some existing Ember addons that may help you make your app more accessible. Each addon should be evaluated for its own usefulness and merit- you may find in some instances, that it would be better to implement the ideas presented in the addon in your own application.

Here are some examples of accessibility-focused addons created by many people throughout the Ember community:

- [ember-a11y-landmarks](https://github.com/ember-a11y/ember-a11y-landmarks) - Ember addon to help with landmark roles for better accessibility
- [ember-component-focus](https://github.com/ember-a11y/ember-component-focus) - A mixin for adding methods to your Ember components that help you manage the currently focused element.
- [ember-steps](https://github.com/rwjblue/ember-steps) - Declarative create wizards, tabbed UIs, and more
- [ember-page-title](https://github.com/tim-evans/ember-page-title) - Page title management for Ember.js Apps
- [ember-self-focused](https://github.com/linkedin/self-focused/tree/master/packages/ember-self-focused) - Focus on route on transition
- [ember-keyboard](https://github.com/patience-tema-baron/ember-keyboard) - An Ember.js addon for the painless support of keyboard events
- [ember-a11y-testing](https://github.com/ember-a11y/ember-a11y-testing) - A suite of accessibility tests that can be run within the Ember testing framework
- [a11y-announcer](https://github.com/ember-a11y/a11y-announcer) - An accessible ember route change announcer
- [ember-template-lint](https://github.com/ember-template-lint/ember-template-lint) - linter for Ember templates
  ![Template Linting Preview](/images/accessibility/application-considerations/template-lint.png)

While there are quite a few moving parts, here's a cheat sheet to get you started: [Accessibility Cheat Sheet](https://moritzgiessmann.de/accessibility-cheatsheet/)


---

When crafting an accessible component, the first and most important thing is that the component should render valid HTML. 

Both the HTML and ARIA specifications have been written in a way that make them work together. Semantic HTML provides the necessary _context_ to screen readers.

Browsers have implemented the spec in a way that provides functionality for free. 
For example, consider this code sample: 

```html
<button type="submit">Submit Form</button>
```

Here is what would be provided by the browser that the developer would otherwise need to provide: 

- keyboard interactions on interactive elements (i.e., using the `ENTER` key to activate a `<button>` element)
- a machine-readable name 
- a place in the `TAB` order of the page
- the intrinsic role of button 

If the interactive element would be written another way, such as: 

```html
<div>Submit Form</div>
```

The developer would need to write the following additional code: 

- add the role of button (`role="button"`)
- add the button to the tab order (`tabindex="0"`)
- add the keyboard functionality (a JavaScript function to activate the associated action when the `ENTER` key is pressed)

This is just one example of how developers can use HTML's built in features to improve accessibility and reduce the need for custom code. Read more here: ["Just use a button"](https://developer.paciellogroup.com/blog/2011/04/html5-accessibility-chops-just-use-a-button/).

## Focus management in components

Focus is one of the main ways a component can communicate with screen readers.

For example, when you hit tab on a page or click on a form field, a blue border usually appears around the element. This kind of behavior is part of focus.
Developers can use JavaScript to control the focus in their apps, enabling keyboard navigation and usability by screen readers.
For example, if there is a button that launches a modal with interactive elements in it, that button's click handler needs to contain code that brings focus to the new content.

This article is a good launching point for learning more about focus: [Keyboard accessibility](https://webaim.org/techniques/keyboard/)

Here are some other tips to get you started:

- There is a difference between browse mode and focus mode in screen readers- see ["Focus Please"](https://codepen.io/melsumner/live/ZJeYoP).
- Focus should return from whence it came- for example, if a `<button>` element opens a modal, the focus should then be returned to that same trigger button once the modal is closed. 
- Note: `role="presentation"` or `aria-hidden="true"` should not be used on a focusable element.


## Accessible name

All interactive elements must have an accessible name. But what does that mean, exactly? 

Because the code that is written must be readable by other machines (assistive tech like screen readers, for example), there is documentation about how this accessible name is determined: [Accessible Name and Description Computation](https://www.w3.org/TR/accname-1.1/). 

However, the most common methods for providing accessible names can be reviewed here. 

### Adding a label to an input element

Every `<input>` element should have an associated `<label>` element. To do this, the `<input>` element's `id` attribute value should be the same as the `for` attribute value on the `<label>`. Ember has a built-in `unique-id` helper that can generate unique ids that you can use like this:

![Separate input and label elements with a connection established by matching for and id attributes](/images/accessibility/component-considerations/input-for-id.png)

```html
{{#let (unique-id) as |id|}}
  <label for={{id}}>Name:</label>
  <input id={{id}} name="name" value="" type="text" />
{{/let}}
```

It is also valid to wrap the `<label>` element around the `<input />` element: 

![A child input element nested within a parent label element without any for and id attributes](/images/accessibility/component-considerations/input-nested.png)

```html
<label>Name:
  <input name="name" value="" type="text" />
</label>
```

However, this option can be a little harder to apply styles to, so both should be tested before determining which approach to use.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
To dig deeper into accessible input patterns in Ember check out the <a href="https://emberjs-1.gitbook.io/ember-component-patterns/form-components/input">ember-component-patterns article on Input Fields</a>.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>


---

Ember provides a few ways to help developers more easily produce accessible applications, and this section of the guides will more explicitly assist with that. 

![Ember Loves Accessibility](/images/accessibility/index/a11y-mascots.png)

Accessibility should be considered at the start of a project, whether that project has named accessibility an explicit goal or not. Since no one can predict anyone else's future (including whether or not they will need assistive technology at some point), and because in many places around the world it is legally required to make websites digitally accessible, accessibility should be thought about in the same way as performance- a necessity for any web-based product. 

Additionally, it causes less churn to decide to implement basic accessibility considerations at the start of the project, than trying to add it on later or pivoting mid-project. Semantic HTML doesn't take any additional time to write than non-semantic markup, provides a lower cognitive burden for development, typically produces less markup which will help an application be more performant, and is better for SEO. 


## Accessibility Strategy

Digital accessibility regulations vary from country to country, but most at least point to the [WAI-ARIA](https://www.w3.org/WAI/) specification for compliance. 

"100% accessible"- what does that mean? From a practical perspective, accessibility really looks more like 90% coding to the spec and 10% filing browser bugs (or keeping track of existing browser bugs). Keep in mind that if a workaround for a browser bug is implemented, an internal tracking issue in the product backlog should be also filed so as to provide the reminder to follow up on browser bugs at a later date. 

Creating a sensible plan for your product up front can save a great deal of stress down the road. 


---

These accessibility learning resources will provide additional support to the developer looking to improve the quality of the code they write. 

- [MDN Web Docs: Accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility)
- [Using ARIA:](https://www.w3.org/TR/using-aria/) a practical guide for developers on how to add accessibility information to HTML elements
- [Web Content Accessibility Guidelines(WCAG) 2.1](https://www.w3.org/TR/WCAG21/)
- [Accessible Rich Internet Applications (ARIA) 1.1](https://www.w3.org/TR/wai-aria-1.1/) 
- [How to meet WCAG (Quick Reference)](https://www.w3.org/WAI/WCAG21/quickref/)


## Practical Resources

- [Accessibility Insights](https://accessibilityinsights.io/)- Use FastPass to find common, high-impact issues 
- [aXe extension for Chrome](https://chrome.google.com/webstore/detail/axe/lhdoppojpmngadmnindnejefpokejbdd)
- [Accessibility Support](https://a11ysupport.io/)- Find out if your code will work with assistive tech
- [How and where to report accessibility bugs](https://www.digitala11y.com/how-where-to-report-accessibility-bugs/)


### Design 

- [ColorSafe](http://colorsafe.co/)- Empowering designers with beautiful and accessible color palettes based on WCAG Guidelines of text and background contrast ratios
- [Accessible Color Palette Builder](https://toolness.github.io/accessible-color-matrix/)


### Writing

- [Plain Language](https://plainlanguage.gov/) - Learn how to write in a way that makes it easier for people to read and understand. 


### Other Useful Articles

- [The difference between keyboard and screen reader navigation](https://tink.uk/the-difference-between-keyboard-and-screen-reader-navigation/)


---

When considering an application's page or view structure, there are a few primary concerns that should be planned for:

- page title
- skip navigation links
- focus management


## Page Title

Each page (what is rendered for a unique URL) should have a page title. This page title should be unique to that page, and should accurately reflect what that page does.

Consider this format:

`Unique Page Title - Site Title`

<img width="675px" title="Page Title Example" alt="A visual representation of page title in the browser's tab" src="/images/accessibility/page-template-considerations/page-title.png"/>

Note that the unique page title is first. This is because it is the most important piece of information from a contextual perspective. Since a user with a screen reader can interrupt the screen reader as they wish, it introduces less fatigue when the unique page title is first, but provides the additional guidance if it is desired.

A simple way to add page titles is to use the `page-title` helper which comes from the [ember-page-title](https://github.com/ember-cli/ember-page-title) addon that is installed by default in new apps. We can use this helper to set the page title at any point in any template.

For example, if we have a “posts” route, we can set the page title for it like so:


```handlebars {data-filename=app/routes/posts.hbs}
{{page-title "Posts - Site Title"}}

{{outlet}}
```

Extending the example, if we have a “post” route that lives within the “posts” route, we could set its page title like so:

```handlebars {data-filename=app/routes/posts/post.hbs}
{{page-title (concat @model.title " - Site Title")}}

<h1>{{@model.title}}</h1>
```

When your needs become more complex, the following addons facilitate page titles in a more dynamic and maintainable way.

- [ember-cli-head](https://github.com/ronco/ember-cli-head)
- [ember-cli-document-title](https://github.com/kimroen/ember-cli-document-title)

To evaluate more addons to add/manage content in the `<head>` of a page, view this category on [Ember Observer](https://emberobserver.com/categories/header-content).

You can test that page titles are generated correctly by asserting on the value of `document.title` in your tests:

```javascript {data-filename=tests/acceptance/posts-test.js}
import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'my-app-name/tests/helpers';

module('Acceptance | posts', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /posts', async function(assert) {
    await visit('/posts');
    assert.equal(document.title, 'Posts - Site Title');
  });
});
```

## Skip Navigation Links

A skip navigation link, or skip link, is a useful feature for users who want to bypass content that is repeated on multiple pages (i.e., a site header). This can especially helpful to users with assistive technology, who have to browse website content in a more linear fashion, but it can also be useful for power users who prefer to navigate websites only using a keyboard.

<img width="675px" title="Skip Main Content Example" alt="A visual representation of how the skip link works in the browser" src="/images/accessibility/page-template-considerations/skip-main-content.png"/>

To implement a skip link in an application, add an anchor element as close as possible after the opening `<body>` element, and have it link to the beginning of the page's main content area.

To read more about skip links, visit the [MDN docs](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML#Skip_links).


## Focus Management

No single-page application framework provides the appropriate route-level focus for assistive technology in a default manner. This is primarily due to the way `pushState` works, and the lack of an event hook for JavaScript frameworks to tell assistive technology that the page content has changed. This *also* means that the focus is unchanged on route navigation, which in some cases means that it would be lost entirely (if the element that previously had focus is now gone).

Most frameworks have some mechanism for adding the missing functionality to an application. In Ember, there is an attempt to address these two specific shortcomings with [RFC 433](https://github.com/emberjs/rfcs/pull/433); in the meantime there are a few addons that exist to help provide page or view-level focus for your application. All options should be evaluated to determine which is the appropriate use case for your application:

- [ember-a11y](https://github.com/ember-a11y/ember-a11y)
- [ember-self-focused](https://github.com/linkedin/self-focused/tree/master/packages/ember-self-focused)
- [ember-a11y-refocus](https://github.com/MelSumner/ember-a11y-refocus)


---

## Screen Reader and Browser Combinations

It is important to use a screen reader when checking to make sure your application is accessible. 

There are assistive technologies (known as screen readers) available for all common desktop platforms and mobile devices. 

- VoiceOver, integrated in Apple products
- Narrator, integrated in Windows products
- Orca, available for integration in Ubuntu, otherwise available as a download
- JAWS, proprietary software by Freedom Scientific, available for Windows
- NVDA, open source software, available for Windows
- TalkBack, integrated in Android products

While developing and testing for conformance, keep in mind that there are well-known screen reader and browser combinations that were developed in a way that work well together; using combinations different than these may produce false-positive results. It should be noted that these may change over time, so periodic review of this list is recommended. 

- Firefox & NVDA (Windows)
- IE & JAWS (Windows)
- Edge & Narrator (Windows)
- Safari & VoiceOver (MacOS)

The absolute best method for learning how a screen reader works is using one yourself! It might feel a little awkward at first, but understanding how to use a screen reader (and other assistive technology) will help you become a more skilled developer. 


---

As you're developing your Ember app, you are likely to run into common scenarios that aren't addressed by Ember itself.
Perhaps you want to use a CSS preprocessor to write your stylesheets, or you want to use a popular JS library, or maybe
you want to import components written by a different department within your organization.

Ember CLI provides a common format called [Ember Addons](#toc_addons) for distributing reusable libraries to solve some
of these problems.  Additionally, you may want to make use of front-end dependencies like a CSS framework or a JavaScript
datepicker that aren't specific to Ember apps.

## Addons

Addons are JavaScript packages that integrate with Ember. For example, [`ember-cli-sass`](https://github.com/adopted-ember-addons/ember-cli-sass)
is an addon that allows you to use SASS/SCSS in your applications. You can install it using the Ember CLI with the following command:

```bash
ember install ember-cli-sass
```

This will modify your `package.json` (and `package-lock.json` or `yarn.lock` or `pnpm-lock.yaml`), typically bringing in other dependencies. Some addons will also add
additional files to your projects when relevant.

There are many addons that cover all kinds of use cases. For more detail, as well as examples of what addons can do,
we invite you to have a look at the [Ember CLI documentation](https://cli.emberjs.com/release/basic-use/using-addons/).

The Ember community publishes and maintains many addons, and it can be difficult to know if one (or many!) exists that covers
your needs. The website [Ember Observer](https://www.emberobserver.com/) keeps an up-to-date index of Ember Addons, sorted by
categories, and rated according to objective metrics. If you are looking for an addon, we recommend that you start there!

## Regular npm packages

While dependencies can be managed in several ways,
it's worth noting that the process can be greatly simplified for new developers by using ember-auto-import,
which offers zero config imports from npm packages. 
It's built into new Ember apps by default and can be installed in older apps by using `ember install ember-auto-import`.
For further usage instructions, please follow the [project README](https://github.com/ef4/ember-auto-import).

## Other assets

Third-party JavaScript not available as an addon or npm package should be placed in the `vendor/` folder in your project.

Your own assets (such as `robots.txt`, `favicon`, custom fonts, etc) should be placed in the `public/` folder in your project.

## Compiling Assets

When you're using dependencies that are not included in an addon,
you will have to instruct Ember CLI to include your assets in the build.
This is done using the asset manifest file `ember-cli-build.js`.
You should only try to import assets located in the `node_modules` and `vendor` folders.

### Globals provided by JavaScript assets

The globals provided by some assets (like `moment` in the below example) can be used in your application
without the need to `import` them.
Provide the asset path as the first and only argument.

```javascript {data-filename=ember-cli-build.js}
app.import('node_modules/moment/moment.js');
```

You will need to add `"moment"` to the `globals` section in `.eslintrc.js` to prevent ESLint errors
about using an undefined variable.

### Anonymous AMD JavaScript modules

You can transform an anonymous AMD module to a named one by using the `amd` transformation.

```javascript {data-filename=ember-cli-build.js}
app.import('node_modules/moment/moment.js', {
  using: [
    { transformation: 'amd', as: 'moment' }
  ]
});
```

This transformation allows you to `import` moment in your app. (e.g. `import moment from 'moment';`)

### CommonJS JavaScript modules

[ember-cli-cjs-transform](https://github.com/rwjblue/ember-cli-cjs-transform) allows us to import CommonJS modules into
our Ember app. It also does auto-rollup and some nice caching, so it should pull in all the deps that are pulled in
with `require` for you automatically. It is not yet included with Ember CLI by default, so you will need to install it.

```bash
ember install ember-cli-cjs-transform
```

```javascript {data-filename=ember-cli-build.js}
app.import('node_modules/showdown/dist/showdown.js', {
  using: [
    { transformation: 'cjs', as: 'showdown' }
  ]
});
```

You can now `import` them in your app. (e.g. `import showdown from 'showdown';`)

### Environment-Specific Assets

If you need to use different assets in different environments, specify an object as the first parameter.
That object's key should be the environment name, and the value should be the asset to use in that environment.

```javascript {data-filename=ember-cli-build.js}
app.import({
  development: 'node_modules/moment/moment.js',
  production:  'node_modules/moment/min/moment.min.js'
});
```

If you need to import an asset in only one environment you can wrap `app.import` in an `if` statement.
For assets needed during testing, you should also use the `{type: 'test'}` option to make sure they
are available in test mode.

```javascript {data-filename=ember-cli-build.js}
if (app.env === 'development') {
  // Only import when in development mode
  app.import('vendor/ember-renderspeed/ember-renderspeed.js');
}
if (app.env === 'test') {
  // Only import in test mode and place in test-support.js
  app.import('node_modules/sinonjs/sinon.js', { type: 'test' });
  app.import('node_modules/sinon-qunit/lib/sinon-qunit.js', { type: 'test' });
}
```

### CSS

Provide the asset path as the first argument:

```javascript {data-filename=ember-cli-build.js}
app.import('node_modules/foundation/css/foundation.css');
```

All style assets added this way will be concatenated and output as `/assets/vendor.css`.

### Other Assets

All assets located in the `public/` folder will be copied as is to the final output directory, `dist/`.

For example, a `favicon` located at `public/images/favicon.ico` will be copied to `dist/images/favicon.ico`.

All third-party assets, included either manually in `vendor/` or via a package manager like npm, must be added via `app.import()`.

Third-party assets that are not added via `app.import()` will not be present in the final build.

By default, `import`ed assets will be copied to `dist/` as they are, with the existing directory structure maintained.

```javascript {data-filename=ember-cli-build.js}
app.import('node_modules/font-awesome/fonts/fontawesome-webfont.ttf');
```

This example would create the font file in `dist/font-awesome/fonts/fontawesome-webfont.ttf`.

You can also optionally tell `import()` to place the file at a different path.
The following example will copy the file to `dist/assets/fontawesome-webfont.ttf`.

```javascript {data-filename=ember-cli-build.js}
app.import('node_modules/font-awesome/fonts/fontawesome-webfont.ttf', {
  destDir: 'assets'
});
```

If you need to load certain dependencies before others,
you can set the `prepend` property equal to `true` on the second argument of `import()`.
This will prepend the dependency to the vendor file instead of appending it, which is the default behavior.

```javascript {data-filename=ember-cli-build.js}
app.import('node_modules/es5-shim/es5-shim.js', {
  type: 'vendor',
  prepend: true
});
```

<!-- eof - needed for pages that end in a code block  -->


---

---
redirect: addons-and-dependencies/index
---


---

During development, add Ember.js specific extensions to your code editor to expand functionality.
Below is a list of some of the extensions available,
many of which are created and maintained by the developer community:

## Visual Studio Code

Visual Studio Code is a code editor optimized for building and debugging modern web applications.
Visual Studio Code is one of the most popular text editors among Ember developers.

### Extension Pack

Install the extension pack to get everything you need to work on Ember.js projects.

[Ember.js Extension Pack](https://marketplace.visualstudio.com/items?itemName=EmberTooling.emberjs) - It will install the following addons

### Syntax Highlighting

[Glimmer Templates Syntax](https://marketplace.visualstudio.com/items?itemName=lifeart.vscode-glimmer-syntax) -
Syntax formatting for glimmer templates.

### Language Server

[Ember Language Server](https://marketplace.visualstudio.com/items?itemName=EmberTooling.vscode-ember) -
Adds enhanced editor features like auto completion and go to definition.

### Workflow

[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Integrates ESLint into VS Code.

[EditorConfig for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) -
Attempts to override user/workspace settings with settings found in `.editorconfig` files.
The `.editorconfig` file helps developers define
and maintain consistent coding styles between different editors and IDEs.

[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) -
Prettier is an opinionated code formatting tool. It enforces a consistent style by parsing your code and re-printing it with its own rules that take the maximum line length into account, wrapping code when necessary. Prettier supports Handlebars, Ember and Glimmer out of the box.

### Typed Glimmer Templates

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        This is not installed as part of the extension pack but should be considered for Ember projects built with TypeScript. Learn more about <a href="https://typed-ember.gitbook.io/glint/">Glint here</a>.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

[Glint](https://marketplace.visualstudio.com/items?itemName=typed-ember.glint-vscode) is a set of tools to aid in developing code that uses the Glimmer VM for rendering, such as Ember.js v3.24+ and GlimmerX projects.

## Vim and Neovim

Vim is a highly configurable text editor built to make creating and changing any kind of text very efficient.
It is included as "vi" with most UNIX systems and with Apple OS X.
Alternatively, Neovim is a hyper-extensible Vim-based text editor.
Both editors share a range of cross-compatible extensions listed below.

You'll want to remove any linter / completion manager you currently have installed
(or disable them for `.js`, `.ts` or `.hbs` files), and follow the install guides for the following packages:

### Syntax Highlighting

Only one of these solutions is needed, with tree-sitter being the highest fidelity.

[nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter) -
high-fidelity static highlighting with support for `.gjs` and `.gts` and embedded `hbs`.
Use `ensure_installed = { 'glimmer' }`.
Example `nvim-treesitter` config [can be found here](https://github.com/NullVoxPopuli/dotfiles/blob/main/home/.config/nvim/lua/plugins/syntax.lua#L15)

or

[vim-ember-hbs](https://github.com/joukevandermaas/vim-ember-hbs) -
Add Ember template syntax highlighting and indentation to Vim.
To get embedded highlighting will involve these additional plugins:

- [vim-javascript](https://github.com/pangloss/vim-javascript)
- [vim-js-pretty-template](https://github.com/Quramy/vim-js-pretty-template)

### Language Server

Only one of these solutions should be used at a time.

Native LSP with assistance from [Mason.nvim](https://github.com/williamboman/mason.nvim)
Easily install and manage LSP servers, DAP servers, linters, and formatters.
Example mason+LSP config [can be found here](https://github.com/NullVoxPopuli/dotfiles/tree/main/home/.config/nvim/lua)

or

[Conquer for Completion (COC) for Neovim](https://github.com/neoclide/coc.nvim) -
An IntelliSense engine which takes control over all linting, hinting, and language-server integration.
With the ember plugin [coc-ember](https://github.com/NullVoxPopuli/coc-ember) -
Ember.js language server extension including useful configuration instructions.

### Snippets / Workflow

[ember.vim](https://github.com/dsawardekar/ember.vim) -
Shortcuts to navigate related files with Ember.js projects.

[Ember Tools](https://github.com/AndrewRadev/ember_tools.vim) -
Various tools for working with Ember.js projects.

## Atom

Atom is hackable text editor for the 21st Century.

[atom-ide-ember](https://github.com/josa42/atom-ide-ember) -
Atom package to use the Ember Language Server.

[emberjs-atom](https://atom.io/packages/emberjs-atom) -
Atom autocomplete and snippets for Ember.js.

[atom-ember-snippets](https://github.com/mattmcmanus/atom-ember-snippets) -
Ember.js ES6, EmberData & Handlebars snippets for Atom editor.

[language-ember-htmlbars](https://atom.io/packages/language-ember-htmlbars) -
Add Ember template syntax highlighting and indentation to Atom

## Sublime Text

A sophisticated text editor for code, markup and prose.

[ember-cli-sublime-snippets](https://github.com/terminalvelocity/ember-cli-sublime-snippets) -
Ember CLI snippets for Sublime Text 3.

[ember-component-template-split-view](https://github.com/mmitchellgarcia/ember-component-template-split-view) -
Super simple Sublime Text plugin that will let you open corresponding template or route files with Ember.js components.

## CodeLobster IDE

CodeLobster IDE is a smart free cross-platform editor.

[CodeLobster IDE plug-in for Ember](http://www.codelobster.com/emberjs.html) gives autocomplete and tooltips for Ember.js functions, context and dynamic help.


---

---
redirect: applications/index
---


---

Ember applications utilize the [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection)
("DI") design pattern to declare and instantiate classes of objects and dependencies between them.

Generally, [Services](../../services/) are Ember's primary method for sharing
state via dependency injection. In most cases, you shouldn't need to learn about
how to work with Ember's DI system directly, or how to manually register and
setup dependencies. However, there are times when it may be necessary. This
guide covers the details of the system, and how to use it when needed.

## Overview

Applications and application instances each serve a role in Ember's DI implementation.

An [`Application`](https://api.emberjs.com/ember/release/classes/Application) serves as a "registry" for dependency declarations.
Factories (i.e. classes) are registered with an application,
as well as rules about "injecting" dependencies that are applied when objects are instantiated.

An [`ApplicationInstance`](https://api.emberjs.com/ember/release/classes/ApplicationInstance) serves as the "owner" for objects that are instantiated from registered factories.
Application instances provide a means to "look up" (i.e. instantiate and / or retrieve) objects.

> _Note: Although an `Application` serves as the primary registry for an app,
> each `ApplicationInstance` can also serve as a registry.
> Instance-level registrations are useful for providing instance-level customizations,
> such as A/B testing of a feature._

## Factory Registrations

A factory can represent any part of your application, like a _route_, _template_, or custom class.
Every factory is registered with a particular key.
For example, the index template is registered with the key `template:index`,
and the application route is registered with the key `route:application`.

Registration keys have two segments split by a colon (`:`).
The first segment is the framework factory type, and the second is the name of the particular factory.
Hence, the `index` template has the key `template:index`.
Ember has several built-in factory types, such as `service`, `route`, `template`, and `component`.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          You might ask, how can I find the name of a factory?
        </p>
        <p>
          Factories are kebab-cased and directories are followed by a forward slash. For example, a controller <code>app/controllers/users/primary-teachers</code> is registered as <code>controller:users/primary-teachers</code>.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

You can create your own factory type by simply registering a factory with the new type.
For example, to create a `user` type,
you'd simply register your factory with `application.register('user:user-to-register')`.

Factory registrations must be performed either in application
or application instance initializers (with the former being much more common).

For example, an application initializer could register a `Logger` factory with the key `logger:main`:

```javascript {data-filename=app/initializers/logger.js}
import EmberObject from '@ember/object';

export function initialize(application) {
  let Logger = EmberObject.extend({
    log(m) {
      console.log(m);
    }
  });

  application.register('logger:main', Logger);
}

export default {
  name: 'logger',
  initialize: initialize
};
```

### Registering Already Instantiated Objects

By default, Ember will attempt to instantiate a registered factory when it is looked up.
When registering an already instantiated object instead of a class,
use the `instantiate: false` option to avoid attempts to re-instantiate it during lookups.

In the following example, the `logger` is a plain JavaScript object that should
be returned "as is" when it's looked up:

```javascript {data-filename=app/initializers/logger.js}
export function initialize(application) {
  let logger = {
    log(m) {
      console.log(m);
    }
  };

  application.register('logger:main', logger, { instantiate: false });
}

export default {
  name: 'logger',
  initialize: initialize
};
```

### Registering Singletons vs. Non-Singletons

By default, registrations are treated as "singletons".
This simply means that an instance will be created when it is first looked up,
and this same instance will be cached and returned from subsequent lookups.

When you want fresh objects to be created for every lookup,
register your factories as non-singletons using the `singleton: false` option.

In the following example, the `Message` class is registered as a non-singleton:

```javascript {data-filename=app/initializers/notification.js}
import EmberObject from '@ember/object';

export function initialize(application) {
  let Message = EmberObject.extend({
    text: ''
  });

  application.register('notification:message', Message, { singleton: false });
}

export default {
  name: 'notification',
  initialize: initialize
};
```

## Factory Injections

Once a factory is registered, it can be "injected" where it is needed.

Factories can be injected into whole "types" of factories with _type injections_. For example:

```javascript {data-filename=app/initializers/logger.js}
import EmberObject from '@ember/object';

export function initialize(application) {
  let Logger = EmberObject.extend({
    log(m) {
      console.log(m);
    }
  });

  application.register('logger:main', Logger);
  application.inject('route', 'logger', 'logger:main');
}

export default {
  name: 'logger',
  initialize: initialize
};
```

As a result of this type injection,
all factories of the type `route` will be instantiated with the property `logger` injected.
The value of `logger` will come from the factory named `logger:main`.

Routes in this example application can now access the injected logger:

```javascript {data-filename=app/routes/index.js}
import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  activate() {
    // The logger property is injected into all routes
    this.logger.log('Entered the index route!');
  }
}
```

Injections can also be made on a specific factory by using its full key:

```javascript
application.inject('route:index', 'logger', 'logger:main');
```

In this case, the logger will only be injected on the index route.

Injections can be made into any class that requires instantiation.
This includes all of Ember's major framework classes, such as components, helpers, routes, and the router.

### Ad Hoc Injections

Dependency injections can also be declared directly on Ember classes using `inject`.
Currently, `inject` supports injecting controllers (via `import { inject } from '@ember/controller';`)
and services (via `import { service } from '@ember/service';`).

The following code injects the `shopping-cart` service on the `cart-contents` component as the property `cart`:

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class CartContentComponent extends Component {
  @service('shopping-cart') cart;
}
```

If you'd like to inject a service with the same name as the property,
simply leave off the service name (the dasherized version of the name will be used):

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class CartContentComponent extends Component {
  @service shoppingCart;
}
```

## Factory Instance Lookups

To fetch an instantiated factory from the running application you can call the
[`lookup`](https://api.emberjs.com/ember/release/classes/ApplicationInstance/methods/lookup?anchor=lookup) method on an application instance. This method takes a string
to identify a factory and returns the appropriate object.

```javascript
applicationInstance.lookup('factory-type:factory-name');
```

The application instance is passed to Ember's instance initializer hooks and it
is added as the "owner" of each object that was instantiated by the application
instance.

### Using an Application Instance Within an Instance Initializer

Instance initializers receive an application instance as an argument, providing
an opportunity to look up an instance of a registered factory.

```javascript {data-filename=app/instance-initializers/logger.js}
export function initialize(applicationInstance) {
  let logger = applicationInstance.lookup('logger:main');

  logger.log('Hello from the instance initializer!');
}

export default {
  name: 'logger',
  initialize: initialize
};
```

### Getting an Application Instance from a Factory Instance

[`Ember.getOwner`](https://api.emberjs.com/ember/release/classes/@ember%2Fapplication/methods/getOwner?anchor=getOwner) will retrieve the application instance that "owns" an
object. This means that framework objects like components, helpers, and routes
can use [`Ember.getOwner`](https://api.emberjs.com/ember/release/classes/@ember%2Fapplication/methods/getOwner?anchor=getOwner) to perform lookups through their application
instance at runtime.

For example, this component plays songs with different audio services based
on a song's `audioType`.

```javascript {data-filename=app/components/play-audio.js}
import Component from '@glimmer/component';
import { getOwner } from '@ember/application';

// Usage:
//
// <PlayAudio @song=this.song />
//
export default class PlayAudioComponent extends Component {
  get audioService() {
    if (!this.args.song) {
      return null;
    }

    let applicationInstance = getOwner(this);
    let { audioType } = this.args.song;

    return applicationInstance.lookup(`service:audio-${audioType}`);
  }

  click() {
    let player = this.audioService;
    player.play(this.args.song.file);
  }
}
```

<!-- eof - needed for pages that end in a code block  -->


---

## What are Engines?

[Ember Engines](http://ember-engines.com/) allow multiple logical applications to be composed together into a single application from the user's perspective, that provide functionality to their host applications. Engines are isolated, `composable applications`, they have almost all the same features as normal Ember applications, except an [Engine](https://api.emberjs.com/ember/release/classes/Engine) requires a host application to boot it and provide a Router instance.

## Why use Engines?

Large organizations often use Ember.js to power sophisticated web applications. These apps may require collaboration among several teams, sometimes distributed around the world. Typically, responsibility is shared by dividing the application into one or more "sections". How this division is actually implemented varies from team to team. 

Maintaining large monolithic applications poses the following challenges:

* `Side effects` - if you change something, it may be unclear how it could affect the rest of platform.
* `Coordination` - when you develop a new feature or make big changes, many teams may need to be in sync to approve it.
* `Complexity` - with a huge dependency tree and many layers of abstraction, developers cannot iterate quickly, and features suffer as a result.
* `Killing Innovation` - a/b testing a cutting-edge feature is hard to do without disrupting the rest of the app and the teams working on it.
* `Slow Onboarding` - new people coming into the team are overwhelmed.

Engines provide an antidote to these problems by allowing for distributed development, testing, and packaging of logically-grouped pieces of an application.

Engines are good for organizations that have multiple teams, where each team has their own area that is clearly separated from the others. The isolation is good when it matches organizational boundaries, but adds unnecessary complexity when there is not a good match.

Engines are used by a number of large organizations to power sites with millions of users.

If you are considering splitting up your application into engines just to reduce the amount of data that needs to be initially downloaded and increase the performance, Engines are not the right solution. Please check out the section on tree shaking and code splitting in projects like [Embroider](https://github.com/embroider-build/embroider).


---

Every Ember application is represented by a class that extends [`Application`](https://api.emberjs.com/ember/release/classes/Application).
This class is used to declare and configure the many objects that make up your app.

As your application boots,
it creates an [`ApplicationInstance`](https://api.emberjs.com/ember/release/classes/ApplicationInstance) that is used to manage its stateful aspects.
This instance acts as the "owner" of objects instantiated for your app.

Essentially, the `Application` *defines your application*
while the `ApplicationInstance` *manages its state*.

This separation of concerns not only clarifies the architecture of your app,
it can also improve its efficiency.
This is particularly true when your app needs to be booted repeatedly during testing
and / or server-rendering (e.g. via [FastBoot](https://github.com/tildeio/ember-cli-fastboot)).
The configuration of a single `Application` can be done once
and shared among multiple stateful `ApplicationInstance` instances.
These instances can be discarded once they're no longer needed
(e.g. when a test has run or FastBoot request has finished).


---

Initializers provide an opportunity to configure your application as it boots.

There are two types of initializers: application initializers and application instance initializers.

Application initializers are run as your application boots,
and provide the primary means to configure [dependency injections](../dependency-injection/) in your application.

Application instance initializers are run as an application instance is loaded.
They provide a way to configure the initial state of your application,
as well as to set up dependency injections that are local to the application instance
(e.g. A/B testing configurations).

Operations performed in initializers should be kept as lightweight as possible
to minimize delays in loading your application.
Although advanced techniques exist for allowing asynchrony in application initializers
(i.e. `deferReadiness` and `advanceReadiness`), these techniques should generally be avoided.
Any asynchronous loading conditions (e.g. user authorization) are almost always
better handled in your application route's hooks,
which allows for DOM interaction while waiting for conditions to resolve.

## Application Initializers

Application initializers can be created with Ember CLI's `initializer` generator:

```bash
ember generate initializer shopping-cart
```

Let's customize the `shopping-cart` initializer to inject a `cart` property into all the routes in your application:

```javascript {data-filename=app/initializers/shopping-cart.js}
export function initialize(application) {
  application.inject('route', 'cart', 'service:shopping-cart');
};

export default {
  initialize
};
```

## Application Instance Initializers

Application instance initializers can be created with Ember CLI's `instance-initializer` generator:

```bash
ember generate instance-initializer logger
```

Let's add some simple logging to indicate that the instance has booted:

```javascript {data-filename=app/instance-initializers/logger.js}
export function initialize(applicationInstance) {
  let logger = applicationInstance.lookup('logger:main');
  logger.log('Hello from the instance initializer!');
}

export default {
  initialize
};
```

## Specifying Initializer Order

If you'd like to control the order in which initializers run, you can use the `before` and/or `after` options:

```javascript {data-filename=app/initializers/config-reader.js}
export function initialize(application) {
  // ... your code ...
};

export default {
  before: 'websocket-init',
  initialize
};
```

```javascript {data-filename=app/initializers/websocket-init.js}
export function initialize(application) {
  // ... your code ...
};

export default {
  after: 'config-reader',
  initialize
};
```

```javascript {data-filename=app/initializers/asset-init.js}
export function initialize(application) {
  // ... your code ...
};

export default {
  after: ['config-reader', 'websocket-init'],
  initialize
};
```

Note that ordering only applies to initializers of the same type (i.e. application or application instance).
Application initializers will always run before application instance initializers.

## Customizing Initializer Names

By default initializer names are derived from their module name. This initializer will be given the name `logger`:

```javascript {data-filename=app/instance-initializers/logger.js}
export function initialize(applicationInstance) {
  let logger = applicationInstance.lookup('logger:main');
  logger.log('Hello from the instance initializer!');
}

export default { initialize };
```

If you want to change the name you can simply rename the file, but if needed you can also specify the name explicitly:

```javascript {data-filename=app/instance-initializers/logger.js}
export function initialize(applicationInstance) {
  let logger = applicationInstance.lookup('logger:main');
  logger.log('Hello from the instance initializer!');
}

export default {
  name: 'my-logger',
  initialize
};
```

This initializer will now have the name `my-logger`.


---

**Note:**
* _For basic Ember app development scenarios, you don't need to understand the run loop or use it directly. All common paths are paved nicely for you and don't require working with the run loop._
* _However, the run loop will be helpful to understand the internals of Ember and to assist in customized performance tuning by manually batching costly work._

Ember's internals and most of the code you will write in your applications takes place in a run loop.
The run loop is used to batch, and order (or reorder) work in a way that is most effective and efficient.

It does so by scheduling work on specific queues.
These queues have a priority, and are processed to completion in priority order.

The most common case for using the run loop is integrating with a non-Ember API
that includes some sort of asynchronous callback.
For example:

- DOM update and event callbacks
- `setTimeout` and `setInterval` callbacks
- `postMessage` and `messageChannel` event handlers
- fetch or ajax callbacks
- WebSocket callbacks

## Why is the run loop useful?

Very often, batching similar work has benefits.
Web browsers do something quite similar by batching changes to the DOM.

Consider the following HTML snippet:

```html
<div id="foo"></div>
<div id="bar"></div>
<div id="baz"></div>
```

and executing the following code:

```javascript
foo.style.height = '500px' // write
foo.offsetHeight // read (recalculate style, layout, expensive!)

bar.style.height = '400px' // write
bar.offsetHeight // read (recalculate style, layout, expensive!)

baz.style.height = '200px' // write
baz.offsetHeight // read (recalculate style, layout, expensive!)
```

In this example, the sequence of code forced the browser to recalculate style, and relayout after each step.
However, if we were able to batch similar jobs together,
the browser would have only needed to recalculate the style and layout once.

```javascript
foo.style.height = '500px' // write
bar.style.height = '400px' // write
baz.style.height = '200px' // write

foo.offsetHeight // read (recalculate style, layout, expensive!)
bar.offsetHeight // read (fast since style and layout are already known)
baz.offsetHeight // read (fast since style and layout are already known)
```

Interestingly, this pattern holds true for many other types of work.
Essentially, batching similar work allows for better pipelining, and further optimization.

Let's look at a similar example that is optimized in Ember, starting with an `Image` class:

```javascript
import { tracked } from '@glimmer/tracking';

class Image {
  @tracked width;
  @tracked height;

  constructor({ width, height }) {
    this.width = width ?? null;
    this.height = height ?? null;
  }

  get aspectRatio() {
    return this.width / this.height;
  }
}
```

and a template to display its attributes:

```handlebars
{{this.width}}
{{this.aspectRatio}}
```

If we execute the following code without the run loop:

```javascript
let profilePhoto = new Image({ width: 250, height: 500 });
profilePhoto.width = 300;
// profilePhoto.width and profilePhoto.aspectRatio are updated

profilePhoto.height = 300;
// profilePhoto.height and profilePhoto.aspectRatio are updated
```

We see that the browser will rerender the template twice.

However, if we have the run loop in the above code,
the browser will only rerender the template once the attributes have all been set.

```javascript
let profilePhoto = new Image({ width: 250, height: 500 });
profilePhoto.width = 600;
profilePhoto.height = 600;
profilePhoto.width = 300;
profilePhoto.height = 300;
```

In the above example with the run loop, since the user's attributes end up at the same values as before execution,
the template will not even rerender!

It is of course possible to optimize these scenarios on a case-by-case basis,
but getting them for free is much nicer.
Using the run loop, we can apply these classes of optimizations not only for each scenario, but holistically app-wide.

## How does the Run Loop work in Ember?

As mentioned earlier, we schedule work (in the form of function invocations) on queues,
and these queues are processed to completion in priority order.

What are the queues, and what is their priority order?

1. `actions`
2. `routerTransitions`
3. `render`
4. `afterRender`
5. `destroy`

Here, in this list, the "actions" queue has a higher priority than the "render" or "destroy" queue.

## What happens in these queues?

* The `actions` queue is the general work queue and will typically contain scheduled tasks e.g. promises.
* The `routerTransitions` queue contains transition jobs in the router.
* The `render` queue contains jobs meant for rendering, these will typically update the DOM.
* The `afterRender` queue contains jobs meant to be run after all previously scheduled render tasks are complete.
This is often good for 3rd-party DOM manipulation libraries,
that should only be run after an entire tree of DOM has been updated.
* The `destroy` queue contains jobs to finish the teardown of objects other jobs have scheduled to destroy.

## In what order are jobs executed on the queues?
The algorithm works this way:

1. Let the highest priority queue with pending jobs be: `CURRENT_QUEUE`,
if there are no queues with pending jobs the run loop is complete
2. Let a new temporary queue be defined as `WORK_QUEUE`
3. Move jobs from `CURRENT_QUEUE` into `WORK_QUEUE`
4. Process all the jobs sequentially in `WORK_QUEUE`
5. Return to Step 1

## An example of the internals

Rather than writing the higher level app code that internally invokes the various run loop scheduling functions,
we have stripped away the covers, and shown the raw run-loop interactions.

Working with this API directly is not common in most Ember apps,
but understanding this example will help you to understand the run-loops algorithm,
which will make you a better Ember developer.

<iframe src="https://s3.amazonaws.com/emberjs.com/run-loop-guide/index.html" width="678" height="410" style="border:1px solid rgb(170, 170, 170);margin-bottom:1.5em;"></iframe>

## How do I tell Ember to start a run loop?

You should begin a run loop when the callback fires.

The `Ember.run` method can be used to create a run loop.
In this example, `Ember.run` is used to handle an online
event (browser gains internet access) and run some Ember code.

```javascript
window.addEventListener('online', () => {
  Ember.run(() => {  // begin loop
    // Code that results in jobs being scheduled goes here
  }); // end loop, jobs are flushed and executed
});
```



## What happens if I forget to start a run loop in an async handler?

As mentioned above, you should wrap any non-Ember async callbacks in `Ember.run`.
If you don't, Ember will try to approximate a beginning and end for you.
Consider the following callback:

```javascript
window.addEventListener('online', () => {
  console.log('Doing things...');

  Ember.run.schedule('actions', () => {
    // Do more things
  });
});
```

The run loop API calls that _schedule_ work, i.e. [`run.schedule`](https://api.emberjs.com/ember/release/classes/@ember%2Frunloop/methods/schedule?anchor=schedule),
[`run.scheduleOnce`](https://api.emberjs.com/ember/release/classes/@ember%2Frunloop/methods/scheduleOnce?anchor=scheduleOnce),
[`run.once`](https://api.emberjs.com/ember/release/classes/@ember%2Frunloop/methods/once?anchor=once) have the property that they will approximate a run loop for you if one does not already exist.
These automatically created run loops we call _autoruns_.

Here is some pseudocode to describe what happens using the example above:

```javascript
window.addEventListener('online', () => {
  // 1. autoruns do not change the execution of arbitrary code in a callback.
  //    This code is still run when this callback is executed and will not be
  //    scheduled on an autorun.
  console.log('Doing things...');

  Ember.run.schedule('actions', () => {
    // 2. schedule notices that there is no currently available run loop so it
    //    creates one. It schedules it to close and flush queues on the next
    //    turn of the JS event loop.
    if (! Ember.run.hasOpenRunLoop()) {
      Ember.run.begin();
      nextTick(() => {
        Ember.run.end()
      }, 0);
    }

    // 3. There is now a run loop available so schedule adds its item to the
    //    given queue
    Ember.run.schedule('actions', () => {
      // Do more things
    });

  });

  // 4. This schedule sees the autorun created by schedule above as an available
  //    run loop and adds its item to the given queue.
  Ember.run.schedule('afterRender', () => {
    // Do yet more things
  });
});
```

## Where can I find more information?

Check out the [Ember.run](https://api.emberjs.com/ember/release/classes/@ember%2Frunloop) API documentation,
as well as the [Backburner library](https://github.com/ebryn/backburner.js/) that powers the run loop.


---

---
redirect: services
---


---

Component templates can leave one or more placeholders that users can fill with their own HTML.
These are called blocks.
Here's an example that provides a component with the implicit default block.

```handlebars
<ExampleComponent>
  This is the default <b>block content</b> that will
  replace `{{yield}}` (or `{{yield to="default"}}`)
  in the `ExampleComponent` template.
</ExampleComponent>
```

This is equivalent to explicitly naming the default block using the named block syntax.

```handlebars
<ExampleComponent>
  <:default>
    This is the default <b>block content</b> that will
    replace `{{yield}}` (or `{{yield to="default"}}`)
    in the `ExampleComponent` template.
  </:default>
</ExampleComponent>
```

Through Block Content, users of the component can add additional styling and
behavior by using HTML, modifiers, and other components within the block.

To make that more concrete, let's take a look at two similar components
representing different user's messages.

```handlebars {data-filename="app/components/received-message.hbs"}
<aside>
  <div class="avatar is-active" title="Tomster's avatar">T</div>
</aside>
<section>
  <h4 class="username">
    Tomster
    <span class="local-time">their local time is 4:56pm</span>
  </h4>

  <p>
    Hey Zoey, have you had a chance to look at the EmberConf
    brainstorming doc I sent you?
  </p>
</section>
```

```handlebars {data-filename="app/components/sent-message.hbs"}
<aside class="current-user">
  <div class="avatar" title="Zoey's avatar">Z</div>
</aside>
<section>
  <h4 class="username">Zoey</h4>

  <p>Hey!</p>

  <p>
    I love the ideas! I'm really excited about where this year's
    EmberConf is going, I'm sure it's going to be the best one yet.
    Some quick notes:
  </p>

  <ul>
    <li>
      Definitely agree that we should double the coffee budget this
      year (it really is impressive how much we go through!)
    </li>
    <li>
      A blimp would definitely make the venue very easy to find, but
      I think it might be a bit out of our budget. Maybe we could
      rent some spotlights instead?
    </li>
    <li>
      We absolutely will need more hamster wheels, last year's line
      was <em>way</em> too long. Will get on that now before rental
      season hits its peak.
    </li>
  </ul>

  <p>Let me know when you've nailed down the dates!</p>
</section>
```

Instead of having two different components, one for sent messages and one for
received messages, we could instead try to create a single message component.
Inside of this message component, we could substitute the avatar and username
with generic components, too.

Their structure is pretty straightforward and similar, so we can use arguments
and conditionals to handle the differences in content between them (see the
previous chapters for details on how to do this).

```handlebars {data-filename="app/components/message.hbs"}
<Message::Avatar
  @title={{@avatarTitle}}
  @initial={{@avatarInitial}}
  @isActive={{@userIsActive}}
  class="{{if @isCurrentUser "current-user"}}"
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  ...
</section>
```

This works pretty well, but the message content is very different. It's also
pretty long, so it wouldn't really be easy to pass the message content through
as an argument. What we really want is to leave a placeholder for any content
supplied by the `<Message>` tag.

The way to do this in Ember is by using the `{{yield}}` syntax.

```handlebars {data-filename="app/components/message.hbs"}
<Message::Avatar
  @title={{@avatarTitle}}
  @initial={{@avatarInitial}}
  @isActive={{@userIsActive}}
  class="{{if @isCurrentUser "current-user"}}"
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  {{yield}}
</section>
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <code>{{yield}}</code> is named after a similar concept in scripting languages,
        including Ruby, JavaScript and Python. You don't need to understand the connection
        in order to use it, but if you're in the mood for a tangent, check out
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield">
          the yield operator in JavaScript
        </a>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

You can think of using `{{yield}}` as leaving a placeholder for the content of the
`<Message>` tag.

```handlebars {data-filename="app/components/received-message.hbs"}
<Message
  @username="Tomster"
  @userIsActive={{true}}
  @userLocalTime="4:56pm"

  @avatarTitle="Tomster's avatar"
  @avatarInitial="T"
>
  <p>
    Hey Zoey, have you had a chance to look at the EmberConf
    brainstorming doc I sent you?
  </p>
</Message>
```

```handlebars {data-filename="app/components/sent-message.hbs"}
<Message
  @username="Zoey"
  @isCurrentUser={{true}}

  @avatarTitle="Zoey's avatar"
  @avatarInitial="Z"
>
  <p>Hey!</p>

  <p>
    I love the ideas! I'm really excited about where this year's
    EmberConf is going, I'm sure it's going to be the best one yet.
    Some quick notes:
  </p>

  <ul>
    <li>
      Definitely agree that we should double the coffee budget this
      year (it really is impressive how much we go through!)
    </li>
    <li>
      A blimp would definitely make the venue very easy to find, but
      I think it might be a bit out of our budget. Maybe we could
      rent some spotlights instead?
    </li>
    <li>
      We absolutely will need more hamster wheels, last year's line
      was <em>way</em> too long. Will get on that now before rental
      season hits its peak.
    </li>
  </ul>

  <p>Let me know when you've nailed down the dates!</p>
</Message>
```

As shown here, we can pass different content into the tag. The content
of the tag is also referred to as _the block_. The `{{yield}}` syntax
yields to the block once the block is passed into the component.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        You can think of the <code>Message</code> component like a function,
        and the block as a <a href="https://developer.mozilla.org/en-US/docs/Glossary/Callback_function"><em>callback</em></a>
        that you're passing to the component. From this perspective, the <code>{{yield}}</code> syntax
        calls the callback.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Conditional Blocks

Sometimes, we may want to provide some default content if the user of a component
hasn't provided a block. For instance, consider an error message dialog that has
a default message in cases where we don't know what error occurred. We could show
the default message using the `(has-block)` syntax in an `ErrorDialog` component.

```handlebars {data-filename=app/components/error-dialog.hbs}
<dialog>
  {{#if (has-block)}}
    {{yield}}
  {{else}}
    An unknown error occurred!
  {{/if}}
</dialog>
```

Now, if we use our `ErrorDialog` component without a block, we'll get the
default message.

```handlebars
<ErrorDialog/>
```
```html
<!-- rendered -->
<dialog>
  An unknown error occurred!
</dialog>
```

If we had a more detailed message, though, we could use the block to pass it to
the dialog.

```handlebars
<ErrorDialog>
  <Icon type="no-internet" />
  <p>You are not connected to the internet!</p>
</ErrorDialog>
```

## Block Parameters

Blocks can also pass values back into the template, similar to a callback
function in JavaScript. Consider for instance a simple `BlogPost` component.

```handlebars {data-filename=app/components/blog-post.hbs}
<h1>{{@post.title}}</h1>
<h2>{{@post.author}}</h2>

{{@post.body}}
```

```handlebars
<!-- usage -->
<BlogPost @post={{@blogPost}} />
```

We may want to give the user the ability to put extra content before or after
the post, such as an image or a profile. Since we don't know what the
user wants to do with the body of the post, we can instead pass the body back
to them.

```handlebars {data-filename=app/components/blog-post.hbs}
<h1>{{@post.title}}</h1>
<h2>{{@post.author}}</h2>

{{yield @post.body}}
```

```handlebars
<!-- usage -->
<BlogPost @post={{@blogPost}} as |postBody|>
  <img alt="" role="presentation" src="./blog-logo.png">

  {{postBody}}

  <AuthorBio @author={{@blogPost.author}} />
</BlogPost>
```

We can yield back multiple values as well, separated by spaces.

```handlebars {data-filename=app/components/blog-post.hbs}
{{yield @post.title @post.author @post.body }}
```

```handlebars
<!-- usage -->
<BlogPost @post={{@blogPost}} as |postTitle postAuthor postBody|>
  <img alt="" role="presentation" src="./blog-logo.png">

  {{postTitle}}

  {{postBody}}

  <AuthorBio @author={{postAuthor}} />
</BlogPost>
```

## Named Blocks

If you want to yield content to different spots in the same component, you can use named blocks. You just need to specify a name for the yielded block, like this:

```handlebars
{{yield to="somePlace"}}
```

You could also want to pass some values. This is the same process as the default `yield`, but you just have to pass `to` as the last argument. An example would be the popover:

```handlebars {data-filename=app/components/popover.hbs}
<div class="popover">
  <div class="popover__trigger">
    {{yield this.isOpen to="trigger"}}
  </div>
  {{#if this.isOpen}}
    <div class="popover__content">
      {{yield to="content"}}
    </div>
  {{/if}}
</div>
```

Without named blocks, we would certainly have to pass components as `args` to the popover. But this is much more practical!

Here’s how we would call our named blocks as a consumer:

```handlebars
<Popover>
  <:trigger as |open|>
    <button type="button">Click to {{if open "close" "open"}}  the popover!</button>
  </:trigger>
  <:content>
     This is what is shown when I'm opened!
  </:content>
</Popover>
```

We know the state of the popover because we passed it as an argument to the `yield`. To access its value, use the block parameters at the named block scope. It will not be accessible at the `Popover` level, so if you want the value to be available for all the blocks, you will have to pass it for each of them.

Rendering the previous code example would give this as result:

```html
<!-- rendered -->
<div class="popover">
  <div class="popover__trigger">
    <button type="button">Click to close the popover!</button>
  </div>
  <div class="popover__content">
    This is what is showed when I'm opened!
  </div>
</div>
```

Don't worry, you can also still use `yield` by itself, and mix it with named blocks. Let’s take a card example:

```handlebars {data-filename=app/components/card.hbs}
<div class="card">
  {{#if (has-block "title")}}
    <div class="card__title">
      {{yield to="title"}}
    </div>
  {{/if}}
  <div class="card__content">
    {{yield}}
  </div>
</div>
```

A yielded block without a name is called `default`. So to access it, it’s like any other named blocks.

```handlebars
<Card>
  <:title>
    <h3>It's nice to have me. Sometimes</h3>
  </:title>
  <:default>
    The card content will appear here!
  </:default>
</Card>
```

The title being optional when you create a card, you can use the `(has-block)` helper with the named block by adding its name as a first parameter. That means you could also create this card:

```handlebars
<Card>
  I don't want any title, and I only have a default content!
</Card>
```

As you are not using named blocks, you can simply yield the content you would like to add, which becomes the default yield block.



<!-- eof - needed for pages that end in a code block  -->


---

---
redirect: components/block-content
---


---

Out of the box, Ember provides 2 components for building a form:

* [`<Input>`](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Input?anchor=Input)
* [`<Textarea>`](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Textarea?anchor=Textarea)

These components are similar in HTML markup to the native `<input>` or `<textarea>` elements. In contrast to the native elements, `<Input>` and `<Textarea>` automatically update the state of their bound values.


## `<Input>`

We mentioned that the built-in components are similar in HTML markup to their native counterparts. What does this mean?

Consider the following example in a template file.

```handlebars
<label for="user-question">Ask a question about Ember:</label>
<Input
  id="user-question"
  @type="text"
  @value="How do text fields work?"
/>
```

When Ember renders this template, you will see the following HTML code:

```html
<label for="user-question">Ask a question about Ember:</label>
<input id="user-question" type="text" value="How do text fields work?" />
```


### Ways to associate labels and inputs

Every input should be associated with a label. In HTML, there are a few ways to do this. With the built-in `<Input>` component,

1. You can nest the input inside the label.

   ```handlebars
   <label>
     Ask a question about Ember:

     <Input
       @type="text"
       @value={{this.userQuestion}}
     />
   </label>
   ```

2. You can create an ID (globally unique within the webpage), then associate the label to the input with `for` attribute and `id` attribute.

   ```handlebars
   <label for={{this.myUniqueId}}>
     Ask a question about Ember:
   </label>

   <Input
     id={{this.myUniqueId}}
     @type="text"
     @value={{this.userQuestion}}
   />
   ```

3. You can use the `aria-label` attribute to label the input with a string that is visually hidden but still available to assistive technology. 

   ```handlebars
   <Input
     aria-label="Ask a question about Ember"
     @type="text"
     @value={{this.userQuestion}}
   />
   ```

While it is more appropriate to use the `<label>` element, the `aria-label` attribute can be used in instances where visible text content is not possible.


### Setting attributes on `<Input>`

With a few exceptions, you can pass [input attributes](https://developer.mozilla.org/docs/Web/HTML/Element/input#Attributes) as attributes (i.e. do not prepend `@`) to the `<Input>` component.

For example, the `aria-labelledby` attribute may be useful if you have a search input. The search button can serve as the label for the input element:

```handlebars
<Input aria-labelledby="button-search" />
<button id="button-search" type="button">Search</button>
```

If an attribute is set to a quoted string (`"button-search"` in the prior example), its value will be set directly on the element.

You can also bind the attribute value to a property that you own.
In the next example, the `disabled` attribute is bound to the value of `isReadOnly` in the current context.

```handlebars
<label for="input-name">Name:</label>
<Input
  id="input-name"
  @value={{this.name}}
  disabled={{this.isReadOnly}}
  maxlength="50"
/>
```

Recall that there were a few exceptions. The following input attributes must be passed as arguments (i.e. do prepend `@`) to the `<Input>` component:

- `@checked`
- `@type`
- `@value`


### Actions

Starting with Ember Octane, we recommend using the `{{on}}` modifier to call an action on specific events such as the [input event](https://developer.mozilla.org/docs/Web/API/HTMLElement/input_event).

```handlebars
<label for="input-name">Name:</label>
<Input
  id="input-name"
  @value={{this.name}}
  {{on "input" this.validateName}}
/>
```

[Learn more about the `{{on}}` modifier.](../../upgrading/current-edition/action-on-and-fn/#toc_the-on-modifier)

Lastly, Ember also provides custom input events `@enter`, `@insert-newline` and `@escape-press`. These events do not exist on native input elements, but you may find them to be useful for handling keyboard interactions.

The modern, Octane-style way to handle keyboard events is to [write a modifier](../../upgrading/current-edition/glimmer-components/#toc_writing-your-own-modifiers) to separate concerns: The component manages the state, while the modifier manages interactions with the DOM. Your action will receive an actual `event` object.

There are [community-made addons](https://emberobserver.com/?query=keyboard) to help manage keyboard events. For example, with [ember-keyboard](https://github.com/adopted-ember-addons/ember-keyboard), you can write,

```handlebars
{{!-- Before --}}
<Input
  @enter={{this.doSomething}}
  @escape-press={{this.doSomethingElse}}
/>

{{!-- After --}}
<Input
  {{on-key "Enter" this.doSomething}}
  {{on-key "Escape" this.doSomethingElse event="keydown"}}
/>
```

Note, the `keydown` event was used for `Escape` because `keypress` is deprecated.


### Checkboxes

You can use the
[`<Input>`](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Input?anchor=Input)
component to create a checkbox. Set `@type` to the string `"checkbox"`, and use `@checked` instead of `@value`.

```handlebars
<label for="admin-checkbox">Is Admin?</label>
<Input
  id="admin-checkbox"
  @type="checkbox"
  @checked={{this.isAdmin}}
/>
```

To call an action on specific events, use the `{{on}}` modifier:

```handlebars
<label for="admin-checkbox">Is Admin?</label>
<Input
  id="admin-checkbox"
  @type="checkbox"
  @checked={{this.isAdmin}}
  {{on "input" this.validateRole}}
/>
```


## `<Textarea>`

The following example shows how to bind `this.userComment` to a text area's value.

```handlebars
<label for="user-comment">Comment:</label>
<Textarea
  id="user-comment"
  @value={{this.userComment}}
  rows="6"
  cols="80"
/>
```


### Setting attributes on `<Textarea>`

With the exception of `@value` argument, you can use any [attribute](https://developer.mozilla.org/docs/Web/HTML/Element/textarea#Attributes) that `<textarea>` natively supports.


<!--
  TODO:
  Move this section to a dedicated page for how to build forms.
  Please present a solution that does not use `{{mut}}`.
-->
## Binding dynamic attribute

You might need to bind a property dynamically to an input if you're building a
flexible form, for example. To achieve this you need to use the
[`{{get}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/get?anchor=get)
and [`{{mut}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/mut?anchor=mut)
in conjunction like shown in the following example:

```handlebars
<label for="input-name">Name:</label>
<Input
  id="input-name"
  @value={{mut (get this.person this.field)}}
/>
```

The `{{get}}` helper allows you to dynamically specify which property to bind,
while the `{{mut}}` helper allows the binding to be updated from the input. See
the respective helper documentation for more detail:
[`{{get}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/get?anchor=get)
and [`{{mut}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/mut?anchor=mut).


---

Components become useful building blocks of our app if we make them _reusable_. When we reuse components efficiently, we can avoid having to recreate parts of our app again and again. If you want to _reuse_ a component in multiple places, you'll need a way to template out parts of it.

Let's start with two similar but not identical avatar components, that represent
different users:

```handlebars {data-filename="app/components/received-message/avatar.hbs"}
<aside>
  <div class="avatar" title="Tomster's avatar">T</div>
</aside>
```

```handlebars {data-filename="app/components/sent-message/avatar.hbs"}
<aside class="current-user">
  <div class="avatar" title="Zoey's avatar">Z</div>
</aside>
```

The _structure_ of these components is identical, but they have somewhat
different content (the user's first initial) and attributes (the `title` and `class`
attributes).

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-message">
        You may notice that the <code>is-active</code> class on the
        received message avatar from the previous chapters is missing here.
        We'll cover that in the next chapter on
        <a href="../conditional-content">Conditional Content</a>.
      </div>
    </div>
  </div>
</div>

## Arguments

We can create a component that can be used in both situations by _templating_
the parts of the HTML that are different.

```handlebars {data-filename="app/components/avatar.hbs"}
<aside>
  <div class="avatar" title={{@title}}>{{@initial}}</div>
</aside>
```

The syntax `{{@initial}}` means that the contents inside the `<div>` tag are
_dynamic_ and will be specified by the `<Avatar>` tag. Likewise, the
`{{@title}}` syntax means that the contents of the `title` attribute are dynamic
and will be specified in the same way. We can now replace the received message
avatar by using the `<Avatar>` tag and providing it with some arguments.

```handlebars {data-filename="app/components/received-message/avatar.hbs"}
<Avatar @title="Tomster's avatar" @initial="T" />
```

This code includes the `<Avatar>` component, which expects two _arguments_:
`@title` and `@initial`.

You are probably familiar with HTML attributes, which tell the _browser_ how to
draw an HTML element. The syntax `@title=` is similar, but instead of telling
the _browser_ what to do, it's telling your custom tag what to do.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          You might be wondering why Ember uses the `@` syntax for its
          components instead of normal HTML attribute syntax. We'll learn why
          in the next section.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## HTML Attributes

Let's try to use our `<Avatar>` component for the sent message avatar.

```handlebars {data-filename="app/components/sent-message/avatar.hbs"}
<Avatar @title="Zoey's avatar" @initial="Z" />
```

We're really, really close.

```handlebars {data-filename="output" data-diff="-1,+2"}
<aside class="current-user">
<aside>
  <div class="avatar" title="Zoey's avatar">Z</div>
</aside>
```

We're just missing the `current-user` class on the HTML `<aside>` element. To
make that work, we'll specify the HTML attribute `class` on the `<Avatar>` tag.

```handlebars {data-filename="app/components/sent-message/avatar.hbs"}
<Avatar
  @title="Zoey's avatar"
  @initial="Z"
  class="current-user"
/>
```

The avatar component also needs to specify where to put attributes that were
specified on the tag.

```handlebars {data-filename="app/components/avatar.hbs"}
<aside ...attributes>
  <div class="avatar" title={{@title}}>{{@initial}}</div>
</aside>
```

The `...attributes` syntax determines where the attributes from a tag should
appear in the component's template. Any number of attributes can be specified on
the avatar component now, and they will all end up on the element that has
`...attributes`.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          In general, you should place <code>...attributes</code> after any attributes you
          specify to give people using your component an opportunity to override your attribute.
          If <code>...attributes</code> appears <em>after</em> an attribute,
          it overrides that attribute. If it appears <em>before</em> an attribute, it
          does not.</p>
        <p>
          Place <code>...attributes</code>
          <strong>before</strong> your attributes only if you want to disallow tags from
          overriding your attributes. This is likely to be unusual.
        </p>
        <p>
          In addition, the <code>class</code> attribute is special, and will be
          <em>merged</em> with any existing classes on the element rather than
          overwriting them. This allows you to progressively add CSS classes to
          your components, and makes them more flexible overall.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>


---

While you can accomplish a lot in Ember using HTML templating, you'll need
JavaScript to make your application interactive.

Let's start with a small example, a counter component. When the user presses
the `+1` button, the count will increase by 1. When the user presses the `-1`
button, the count will decrease by 1.

First, let's start with the HTML.

```handlebars {data-filename="app/components/counter.hbs"}
<p>0</p>

<button type="button">+1</button>
<button type="button">-1</button>
```

## Tracked Properties

To make this work, we will need to stop hard coding the number, and we will need
to wire up the buttons.

```js {data-filename="app/components/counter.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class CounterComponent extends Component {
  @tracked count = 0;
}
```

There are a few things going on here, but the most important part is
`@tracked count = 0`. This line creates a dynamic value called `count`, which
you can stick inside of the template instead of hard coding it.

```handlebars {data-filename="app/components/counter.hbs" data-diff="-1,+2"}
<p>0</p>
<p>{{this.count}}</p>

<button type="button">+1</button>
<button type="button">-1</button>
```

When we use `{{this.count}}` in the component template, we're referring to a
property that we defined in the JavaScript class.

The output looks the same as before, but now the `0` comes from JavaScript, and
after some more work, we can change its value with the buttons.

## HTML Modifiers and Actions

Next, we want to wire up the buttons. When the user presses `+1`, we want
`this.count` to go up by 1. When the user presses `-1`, we want it to go down
by 1.

To attach an event handler to an HTML tag, we use the `on` HTML modifier. HTML
modifiers are an Ember syntax that allow us to attach logic to a tag.

```handlebars {data-filename="app/components/counter.hbs" data-diff="-3,+4,-5,+6"}
<p>{{this.count}}</p>

<button type="button">+1</button>
<button type="button" {{on "click" this.increment}}>+1</button>
<button type="button">-1</button>
<button type="button" {{on "click" this.decrement}}>-1</button>
```

To make those event handlers do something, we will need to define _actions_ in
the component JavaScript. An action is a JavaScript method that can be used from
a template.

```js {data-filename="app/components/counter.js" data-diff="+3,+8,+9,+10,+11,+13,+14,+15,+16"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0;

  @action
  increment() {
    this.count = this.count + 1;
  }

  @action
  decrement() {
    this.count = this.count - 1;
  }
}
```

Now, when the `+1` and `-1` buttons get clicked, the number displayed will
change.

## Passing Arguments to Actions

Our counter has two different actions, `increment` and `decrement`. But both
actions are mostly doing the same thing. The only difference is that `increment`
changes the count by `+1`, while `decrement` changes it by `-1`.

First, let's turn our `increment` and `decrement` methods into a single `change`
method that takes the amount as a parameter.

```js {data-filename="app/components/counter.js" data-diff="+8,+9,+10,+11,-12,-13,-14,-15,-17,-18,-19,-20"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0;

  @action
  change(amount) {
    this.count = this.count + amount;
  }
  @action
  increment() {
    this.count = this.count + 1;
  }

  @action
  decrement() {
    this.count = this.count - 1;
  }
}
```

Next, we'll update the template to turn the click handler into a function that
passes an amount (for example, 1 and -1) in as an argument, using the `fn`
helper.

```handlebars {data-filename="app/components/counter.hbs" data-diff="-3,+4,-5,+6"}
<p>{{this.count}}</p>

<button type="button" {{on "click" this.increment}}>+1</button>
<button type="button" {{on "click" (fn this.change 1)}}>+1</button>
<button type="button" {{on "click" this.decrement}}>-1</button>
<button type="button" {{on "click" (fn this.change -1)}}>-1</button>
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        An event handler takes a function as its second argument. When there are
        no arguments to the function, you can pass it directly, just like in
        JavaScript. Otherwise, you can build a function inline by using the
        <code>fn</code> syntax.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Computed Values

Let's say we want to add a button to our counter that allows us to double the
current count. Every time we press the button, the current count doubles.

Based on what we've already learned, we'll need:

- A `multiple`, a piece of state that represents the number to multiply the
  `count` by
- An action to double the `multiple`
- A button in the template that calls the action

But we'll also need a way to multiply the `count` by the `multiple` and show it
in the template.

Let's start with what we know already. We'll add the `multiple` tracked property
and an action called `double` that doubles the `multiple`.

```js {data-filename="app/components/counter.js" data-diff="+7,+9,+10,+11,+12"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0;
  @tracked multiple = 1;

  @action
  double() {
    this.multiple = this.multiple * 2;
  }

  @action
  change(amount) {
    this.count = this.count + amount;
  }
}
```

Then, we'll update the template to call the `double` action. We'll also add
`this.multiple` to our output to help us confirm that our button is working.

```handlebars {data-filename="app/components/counter.hbs" data-diff="+2,+7"}
<p>{{this.count}}</p>
<p>× {{this.multiple}}</p>

<button type="button" {{on "click" (fn this.change 1)}}>+1</button>
<button type="button" {{on "click" (fn this.change -1)}}>-1</button>

<button type="button" {{on "click" this.double}}>Double It</button>
```

To get the multiplied number into the template, we'll use a
[JavaScript getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get).

```js {data-filename="app/components/counter.js" data-diff="+9,+10,+11"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0;
  @tracked multiple = 1;

  get total() {
    return this.count * this.multiple;
  }

  @action
  double() {
    this.multiple = this.multiple * 2;
  }

  @action
  change(amount) {
    this.count = this.count + amount;
  }
}
```

**The getter does not need any special annotations.** As long as you've marked
the properties that can change with `@tracked`, you can use JavaScript to
compute new values from those properties.

We can now update the template to use the `total` property:

```handlebars {data-filename="app/components/counter.hbs" data-diff="+3"}
<p>{{this.count}}</p>
<p>× {{this.multiple}}</p>
<p>= {{this.total}}</p>

<button type="button" {{on "click" (fn this.change 1)}}>+1</button>
<button type="button" {{on "click" (fn this.change -1)}}>-1</button>

<button type="button" {{on "click" this.double}}>Double It</button>
```

And we're all done! If we try to click the plus, minus, or double buttons in any
order, we can watch as these three outputs stay up-to-date perfectly.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          You might have been tempted to make <code>total</code> a <code>@tracked</code> property and update it in
          the <code>double</code> and <code>change</code> actions. But this kind of "push-based" approach creates a
          lot of bugs. What happens if you create a new way to update <code>multiple</code> or <code>amount</code>
          properties and forget to update <code>total</code> at the same time?
        </p>
        <p>
          When you use getters and functions to <em>derive</em> the state you need, you're taking advantage of
          the benefits of <strong>declarative</strong> programming. In declarative programming, you describe
          <em>what</em> you need, not <em>how</em> to get it, which reduces the number of places where you can
          make mistakes.
        </p>
        <p>Making a <code>total</code> getter that computed the total from the <code>amount</code> and
        <code>multiple</code> properties was more <strong>declarative</strong> than setting <code>total</code>
        in all of the places that could have affected it. If you had changed <code>total</code> directly, you
        would have taken the <em>"imperative" approach</em>).</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Combining Arguments and State

Instead of allowing the component itself to be responsible for the multiple,
let's allow it to be passed in.

```handlebars {data-filename="app/components/double-it.hbs"}
<Counter @multiple={{this.multiple}} />

<button type="button" {{on "click" this.double}}>Double It</button>
```

```js {data-filename="app/components/double-it.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class DoubleItComponent extends Component {
  @tracked multiple = 1;

  @action
  double() {
    this.multiple = this.multiple * 2;
  }
}
```

In the `Counter` component, instead of tracking the `multiple` internally, we
take it as an argument. In the template, we refer to the argument as
`@multiple`.

```handlebars {data-filename="app/components/counter.hbs"}
<p>{{this.count}}</p>
<p>× {{@multiple}}</p>
<p>= {{this.total}}</p>

<button type="button" {{on "click" (fn this.change 1)}}>+1</button>
<button type="button" {{on "click" (fn this.change -1)}}>-1</button>
```

In templates, we refer to arguments by prefixing them with the `@` sign (in this
case `@multiple`). In order to compute `this.total`, we'll need to refer to the
`multiple` argument from JavaScript.

We refer to a component's argument from JavaScript by prefixing them with
`this.args.`.

In JavaScript, we refer to it as `this.args.multiple`.

```js {data-filename="app/components/counter.js" data-diff="-7,-10,+11"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0;
  @tracked multiple = 1;

  get total() {
    return this.count * this.multiple;
    return this.count * this.args.multiple;
  }

  @action
  change(amount) {
    this.count = this.count + amount;
  }
}
```

The `total` is now computed by multiplying a piece of _local state_
(`this.count`) with an argument (`this.args.multiple`). You can mix and match
local state and arguments however you wish, which allows you to easily break up
a component into smaller pieces.

## Combining Arguments and Actions

We can also pass actions down to components via their arguments, which allows
child components to communicate with their parents and notify them of changes
to state. For instance, if we wanted to add back the doubling button we had
previously, we could using an action passed down via arguments.

```handlebars {data-filename="app/components/counter.hbs"}
<p>{{this.count}}</p>
<p>× {{@multiple}}</p>
<p>= {{this.total}}</p>

<button type="button" {{on "click" (fn this.change 1)}}>+1</button>
<button type="button" {{on "click" (fn this.change -1)}}>-1</button>

<button type="button" {{on "click" this.double}}>Double It</button>
```

```js {data-filename="app/components/counter.js" data-diff="+9,+17,+18,+19,+20"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0;

  get total() {
    return this.count * this.args.multiple;
  }

  @action
  change(amount) {
    this.count = this.count + amount;
  }

  @action
  double() {
    this.args.updateMultiple(this.args.multiple * 2);
  }
}
```

Now, the Counter calls the `updateMultiple` argument (which we expect to be a
function) with the new value for `multiple`, and the parent component can update
the multiple.

```handlebars {data-filename="app/components/double-it.hbs"}
<Counter @multiple={{this.multiple}} @updateMultiple={{this.updateMultiple}} />
```

```js {data-filename="app/components/double-it.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class DoubleItComponent extends Component {
  @tracked multiple = 1;

  @action
  updateMultiple(newMultiple) {
    this.multiple = newMultiple;
  }
}
```

## Learn more

You will frequently create components in an app. Establishing patterns early can help reduce bugs and unforeseen issues. Learn more from the chapter [Patterns for Components](../../in-depth-topics/patterns-for-components/).

Actions are JavaScript methods that you can call from a template. Find out how you can use actions with recommended patterns from the chapter [Patterns for Actions](../../in-depth-topics/patterns-for-actions/).

<!-- eof - needed for pages that end in a code block  -->


---

In a template, you can use `if` to conditionally render content.
There are 2 styles of `if`: **block** and **inline**.

```handlebars
{{#if this.thingIsTrue}}
  Content for the block form of "if"
{{/if}}

<div class={{if this.thingIsTrue "value-if-true" "value-if-false"}}>
  This div used the inline "if" to calculate the class to use.
</div>
```

Additionally, you can use template helpers like `concat` within a conditional. For the example below, if `@color` has a truthy value, such as `'navy'`, the div classes will include `badge-navy`:

```handlebars
<div class="badge {{if @color (concat 'badge-' @color)}}">
  Badge Text
</div>
```

## Block `if`

### Motivation

Let's take a look at two components that display a person's username.

```handlebars {data-filename="app/components/received-message/username.hbs"}
<h4 class="username">
  Tomster
  <span class="local-time">their local time is 4:56pm</span>
</h4>
```

```handlebars {data-filename="app/components/sent-message/username.hbs"}
<h4 class="username">
  Zoey
</h4>
```

The components look similar, don't they?
The first component shows extra information about the user's local time.

Let's say we tried to create a single `username` component.

```handlebars {data-filename="app/components/username.hbs"}
<h4 class="username">
  {{@name}}
  <span class="local-time">their local time is {{@localTime}}</span>
</h4>
```

If the `<Username>` tag doesn't specify a `@localTime` argument,
we will see an extra, incomplete text, `their local time is `, on the screen.

What we need is a way to display the local time if `@localTime` exists.
We can do this with an `if`.

```handlebars {data-filename="app/components/username.hbs"}
<h4 class="username">
  {{@name}}
  {{#if @localTime}}
    <span class="local-time">their local time is {{@localTime}}</span>
  {{/if}}
</h4>
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          Just like in JavaScript, <code>0</code>, <code>false</code>,
          <code>null</code>, <code>undefined</code>, and
          the empty string are falsy in Ember templates.
          Unlike in JavaScript, the empty array is also considered falsy in Ember templates.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Usage

```handlebars {data-filename="app/components/my-component.hbs"}
{{#if condition}}
  {{!-- some content --}}
{{/if}}
```

This is the syntax for an `if` statement in block form.
If the `condition` is true, Ember will render the content that is inside the block.

Like many programming languages, Ember also allows you to write `if else` and
`if else if` statements in a template.

```handlebars {data-filename="app/components/my-component.hbs"}
{{#if condition}}
  {{!-- some content --}}
{{else}}
  {{!-- some other content --}}
{{/if}}

{{#if condition1}}
  ...
{{else if condition2}}
  ...
{{else if condition3}}
  ...
{{else}}
  ...
{{/if}}
```


## Inline `if`

### Motivation

Sometimes, you will want to conditionally set an argument or attribute.

For instance, consider two components that display a user's avatar.
One is for a recipient and the other for a sender.

```handlebars {data-filename="app/components/received-message/avatar.hbs"}
<aside>
  <div
    class="avatar is-active"
    title="Tomster's avatar"
  >
    T
  </div>
</aside>
```

```handlebars {data-filename="app/components/sent-message/avatar.hbs"}
<aside class="current-user">
  <div
    class="avatar"
    title="Zoey's avatar"
  >
    Z
  </div>
</aside>
```

Again, the two components look similar.
The first component has an `is-active` class, while the second a `current-user` class.
How should we unify the components into one?

The `is-active` class is responsible for showing the active icon.
_How_ that icon is rendered may change over time,
so we won't use `...attributes` to apply the `is-active` class.
Instead, we'll pass the argument `@isActive` to dictate _what_ to do (e.g. render the icon).

As for the `current-user` class, it may have been just one of a few classes
that can be applied to the `<aside>` element.
Let's use `...attributes` to apply the `current-user` class.

We take these API designs into account and end up with a reusable component.
The component uses an inline `if` to conditionally apply the `is-active` class.

```handlebars {data-filename="app/components/avatar.hbs"}
<aside ...attributes>
  <div
    class="avatar {{if @isActive "is-active"}}"
    title={{@title}}
  >
    {{@initial}}
  </div>
</aside>
```

Afterwards, we can refactor the initial components.

```handlebars {data-filename="app/components/received-message/avatar.hbs"}
<Avatar
  @isActive={{true}}
  @title="Tomster's avatar"
  @initial="T"
/>
```

```handlebars {data-filename="app/components/sent-message/avatar.hbs"}
<Avatar
  class="current-user"
  @title="Zoey's avatar"
  @initial="Z"
/>
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          When passing a literal JavaScript value to a component,
          we have to wrap the value in double curlies (e.g. <code>@isActive={{true}}</code>).
          A value that isn't wrapped in curlies is assigned as string,
          which matches the behavior in HTML attributes.
          For example, writing <code>@isActive=true</code> will set <code>@isActive</code> to the string <code>'true'</code>.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Usage

```handlebars {data-filename="app/components/my-component.hbs"}
{{if condition value}}
```

This is the syntax for an `if` statement in inline form.
If the `condition` is true, Ember will use `value` at the invocation site.

Ember also allows you to write an `if else` statement in inline form.
It looks similar to a ternary operator.

```handlebars {data-filename="app/components/my-component.hbs"}
{{if condition value1 value2}}
```


## Learn More

Please see the [API documentation of the `if` helper](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/if?anchor=if) for more patterns.


---

---
redirect: components/index
---


---

---
redirect: components/index
---


---

---
redirect: components/component-state-and-actions
---


---

Helper functions are JavaScript functions that you can call from your template.

Ember's template syntax limits what you can express to keep the structure of your application clear at a glance. When you need to compute something using JavaScript, you can use helper functions. It's possible to create your own helpers, locally or just [use the built-in ones](./#toc_built-in-helpers).

Let's take a look at a generic message component from a messaging app.

```handlebars {data-filename="app/components/message.hbs"}
<Message::Avatar
  @title={{@avatarTitle}}
  @initial={{@avatarInitial}}
  @isActive={{@userIsActive}}
  class={{if @isCurrentUser "current-user"}}
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  {{yield}}
</section>
```

```handlebars
<Message
  @username="Tomster"
  @userIsActive={{true}}
  @userLocalTime="4:56pm"
  @avatarTitle="Tomster's avatar"
  @avatarInitial="T"
>
  <p>
    Hey Zoey, have you had a chance to look at the EmberConf
    brainstorming doc I sent you?
  </p>
</Message>
```

By looking at how we use the `<Message>` component, we can see that some of the arguments are fairly repetitive. Both `@avatarTitle` and `@avatarInitial` are based on the user's `@username`, but the title has more text, and the initial is only the first letter of the name. We'd rather just pass a username to the `<Message>` component and _compute_ the value of the title and initial.

Let's update the component to do that. It'll take a `@username` argument and calculate the title and initial.

Since the title is just the `@username` plus some extra stuff, we can replace `@avatarTitle` by _interpolating_ the `@username` argument in a string literal passed to `<Message::Avatar>`.

```handlebars {data-filename="app/components/message.hbs" data-diff="-2,+3"}
<Message::Avatar
  @title={{@avatarTitle}}
  @title="{{@username}}'s avatar"
  @initial={{@avatarInitial}}
  @isActive={{@userIsActive}}
  class={{if @isCurrentUser "current-user"}}
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  {{yield}}
</section>
```

However, to get the first initial of the string, we'll need to use JavaScript. To do that, we'll write a helper function.

In this case we want a helper function that takes three arguments: a string, a starting position, and a length. The function will return a substring of the original string.

## Local Helper Functions

It's possible to use plain functions for helpers and modifiers. A plain helper function can be "local" to or defined on components and controllers.

```js {data-filename="app/components/message.js"}
import Component from '@glimmer/component';
import { setComponentTemplate } from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';

export default class Message extends Component {
  substring = (string, start, end) => string.substring(start, end);
}
```

We can then use this helper in the component's template to get the first letter of the username.

```handlebars {data-filename="app/components/message.hbs" data-diff="-3,+4"}
<Message::Avatar
  @title="{{@username}}'s avatar"
  @initial={{@avatarInitial}}
  @initial={{this.substring @username 0 1}}
  @isActive={{@userIsActive}}
  class={{if @isCurrentUser "current-user"}}
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  {{yield}}
</section>
```

### Named Arguments

Helpers default to using positional arguments, but sometimes it can make the corresponding syntax `{{substring @username 0 1}}` a little hard to read. We see some numbers at the end but can't tell what exactly they mean. We can use _named arguments_ to make the `substring` helper easier to read.

Using named arguments, we could make our template a lot clearer.

```handlebars {data-filename="app/components/message.hbs" data-diff="-3,+4,+5"}
<Message::Avatar
  @title="{{@username}}'s avatar"
  @initial={{substring @username 0 1}}
  {{! This won't work yet! We need to update the substring helper }}
  @initial={{substring @username start=0 end=1}}
  @isActive={{@userIsActive}}
  class={{if @isCurrentUser "current-user"}}
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  {{yield}}
</section>
```

Helpers take _named arguments_ as a JavaScript object. All named arguments are grouped into an "options object" as the last parameter.

```js {data-filename="app/components/message.js" data-diff="-6,+7"}
import Component from '@glimmer/component';
import { setComponentTemplate } from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';

export default class Message extends Component {
  substring = (string, start, end) => string.substring(start, end);
  substring = (string, options) => string.substring(options.start, options.end);
}
```

You can mix positional and named arguments to make your templates easy to read:

```handlebars {data-filename="app/components/calculator.hbs"}
{{this.calculate 1 2 op="add"}}
```

```js {data-filename="app/components/calculator.js"}
export default class Calculator extends Component {
  calculate(first, second, options) {
    // ...
  }
}
```

### Nested Helpers

Sometimes, you might see helpers invoked by placing them inside parentheses,
`()`. This means that a Helper is being used inside of another Helper or
Component. This is referred to as a "nested" Helper Invocation. Parentheses must be used because curly braces `{{}}` cannot be nested.

```handlebars {data-filename=app/templates/application.hbs}
{{this.sum (this.multiply 2 4) 2}}
```

In this example, we are using a helper to multiply `2` and `4` _before_ passing the value into `{{sum}}`.

Thus, the output of these combined helpers is `10`.

As you move forward with these template guides, keep in mind that a helper can be used anywhere a normal value can be used.

Many of Ember's built-in helpers (as well as your custom helpers) can be used in nested form.

## Global Helper Functions

Next to local helpers, ember provides a way to use global helpers. We define global helper functions in the `app/helpers` folder. Once defined, they will be available to use directly inside all templates in your app.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        Before Ember 4.5, using global helpers was the only way to define helpers.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

To implement the helper, we define and export a regular JavaScript function:

```js {data-filename="app/helpers/substring.js"}
export default function substring(string, start, end) {
  return string.substring(start, end);
}
```

We can then use this helper in the component's template to get the first letter of the username.

```handlebars {data-filename="app/components/message.hbs" data-diff="-3,+4"}
<Message::Avatar
  @title="{{@username}}'s avatar"
  @initial={{@avatarInitial}}
  @initial={{substring @username 0 1}}
  @isActive={{@userIsActive}}
  class={{if @isCurrentUser "current-user"}}
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  {{yield}}
</section>
```

### Named arguments

Similar to local helpers, global helpers also can mix positional and named arguments.

```handlebars {data-filename="app/components/message.hbs" data-diff="-3,+4,+5"}
<Message::Avatar
  @title="{{@username}}'s avatar"
  @initial={{substring @username 0 1}}
  {{! This won't work yet! We need to update the substring helper }}
  @initial={{substring @username start=0 end=1}}
  @isActive={{@userIsActive}}
  class={{if @isCurrentUser "current-user"}}
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  {{yield}}
</section>
```

```js {data-filename="app/helpers/substring.js"}
export default function substring(string, { start, end }) {
  return string.substring(start || 0, end);
}
```

### Classic Helpers

Sometimes, you may encounter helpers defined using the `helper` function:

```js {data-filename="app/helpers/substring.js"}
import { helper } from '@ember/component/helper';

function substring(positional, { start, end }) {
  const string = positional[0];
  return string.substring(start || 0, end);
}

export default helper(substring);
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        Before Ember 4.5, this was the only way to define helpers.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

By wrapping the function using the `helper()` function, Ember will extract the
arguments passed from the template. It'll then call your function with an array
(positional arguments passed in the template) and an object (named arguments
passed in the template).

This style mostly exists for backwards compatibility reasons, but the other
advantage is that it makes it easier to untangle the positional and named
arguments (e.g. when your helper accept an arbitrary number of positional
arguments and optionally some named arguments). Note that, however, it also
makes it more difficult to reuse the logic of the helper function from regular
JavaScript code outside of templates. On the other hand, if you define your
helpers as plain JavaScript function, as we have been doing until now, you are
able to import and call them from any JavaScript files in your app.

### Class Helpers

Classic helpers can also be defined using class syntax. For instance, we could
define the substring helper using classes instead.

```js {data-filename="app/helpers/substring.js"}
import Helper from '@ember/component/helper';

export default class Substring extends Helper {
  compute(positional, { start, end }) {
    const string = positional[0];
    return string.substring(start || 0, end);
  }
}
```

Class helpers are useful when the helper logic is fairly complicated, requires
fine-grained control of the helper lifecycle, is _stateful_ (we'll be
discussing state in the next chapter), or requiring access to a [service](../../services/).

## Built-in Helpers

Below you will find some useful template helpers documented.
For the full list of available helpers, you can check the [template helpers API documentation](https://api.emberjs.com/ember/4.5.0/classes/Ember.Templates.helpers/).

### The `get` helper

The [`{{get}}`](https://api.emberjs.com/ember/4.5.0/classes/Ember.Templates.helpers/methods/get?anchor=get)
helper makes it easy to dynamically look up a property on an object or an element in an array. The second argument to `{{get}}` can be a string or a number, depending on the object being accessed.


To access a property on an object with a string key:

```handlebars
{{get this.someObject "object_key"}}
```

To access the first element in an array:

```handlebars
{{get this.someArray 0}}
```

To access a property on an object with a dynamic key:

```handlebars
{{get this.address this.part}}
```

If the `part` getter returns "zip", this will display the result of `this.address.zip`.
If it returns "city", you get `this.address.city`.


### The `concat` helper

We mentioned above that helpers can be nested. This can be
combined with different dynamic helpers. For example, the
[`{{concat}}`](https://api.emberjs.com/ember/4.5.0/classes/Ember.Templates.helpers/methods/concat?anchor=concat)
helper makes it easy to dynamically send a number of parameters to a component
or helper as a single parameter in the format of a concatenated string.

```handlebars
{{get this.foo (concat "item" this.index)}}
```

This will display the result of `this.foo.item1` when index is 1, and
`this.foo.item2` when index is 2, etc.

### The `let` helper

Now let's say your template is starting to get a bit cluttered and you want
to clean up the logic in your templates. This can be achieved with the `let`
block helper.
The [`{{let}}`](https://api.emberjs.com/ember/4.5.0/classes/Ember.Templates.helpers/methods/let?anchor=let)
helper lets you create new bindings (or temporary variables) in your template.

Say your template now looks like this:

```handlebars
Welcome back {{concat (capitalize this.person.givenName) ' ' (capitalize this.person.familyName)}}

Account Details:
Given Name: {{capitalize this.person.givenName}}
Family Name: {{capitalize this.person.familyName}}
```

As mentioned in the previous section, we use the `concat` helper to render both
`person.givenName` and `person.familyName` in one go. But we also want to make
sure that the names are capitalized. It gets a bit repetitive to keep writing
`capitalize` and honestly, we might just forget it at some point. Thankfully, we
can use the `{{let}}` helper to fix this:

```handlebars
{{#let (capitalize this.person.givenName) (capitalize this.person.familyName)
  as |givenName familyName|
}}
  Welcome back {{concat givenName ' ' familyName}}

  Account Details:
  Given Name: {{givenName}}
  Family Name: {{familyName}}
{{/let}}
```

Now, as long as your template is wrapped in the `let` helper, you can access the
capitalized given name and family name as `givenName` and `familyName` instead of
`(capitalize this.person.givenName)`.

### The `array` helper

Using the [`{{array}}`](https://api.emberjs.com/ember/4.5.0/classes/Ember.Templates.helpers/methods/array?anchor=array) helper,
you can pass arrays directly from the template as an argument to your components.

```handlebars
<MyComponent
  @people={{array
    'Tom Dale'
    'Yehuda Katz'
    this.myOtherPerson
  }}
/>
```

In the component's template, you can then use the `people` argument as an array:

```handlebars {data-filename=app/components/my-component/template.hbs}
<ul>
  {{#each @people as |person|}}
    <li>{{person}}</li>
  {{/each}}
</ul>
```

### The `hash` helper

Using the [`{{hash}}`](https://api.emberjs.com/ember/4.5.0/classes/Ember.Templates.helpers/methods/hash?anchor=hash)
helper, you can pass objects directly from the template as an argument to your
components.

```handlebars
<Greeting
  @person={{hash
    givenName='Jen'
    familyName='Weber'
  }}
/>
```

In the component's template, you can then use the `person` object:
```handlebars {data-filename=app/components/greeting/template.hbs}
Hello, {{@person.givenName}} {{@person.familyName}}
```

### The `in-element` helper

Using the [`{{in-element}}`](https://api.emberjs.com/ember/4.5.0/classes/Ember.Templates.helpers/methods/in-element?anchor=in-element) helper, you can render content into a DOM element that is in a _different_ part of the page. For instance, we might want
to render a modal, tooltip, or dropdown.

Suppose we want to show a dropdown menu when the user clicks on a button. The code below shows a `<button>` element, a placeholder `<div>` element, and a dropdown component. The argument `@show`, when set to `true`, will add the dropdown to the placeholder div.
```handlebars {data-filename=app/components/some-component.hbs}
  <button
    type="button"
    {{on "click" this.onClickShowDropdown}}
  >
    More Actions
  </button>
  <div id="dropdown-destination" />

  <MyDropdownComponent
    @show={{this.showDropdown}}
  />
```

When the user clicks on the button, the flag `showDropdown` will be set to `true`.
```js {data-filename=app/components/some-component.js}
  @tracked
  showDropdown = false;

  @action
  onClickShowDropdown() {
    this.showDropdown = true;
  }
```

The dropdown component uses the argument `@show` to activate the `in-element` helper. We must **provide the destination DOM element** to the helper. In other words, where should the helper render its block content?
```handlebars {data-filename=app/components/my-dropdown-component.hbs}
{{#if @show}}
  {{#in-element this.destinationElement}}
    <ul>
      <li>Archive</li>
      <li>Mark as Read</li>
      <li>Report</li>
    </ul>
  {{/in-element}}
{{/if}}
```

```js {data-filename=app/components/my-dropdown-component.js}
  get destinationElement() {
    return document.querySelector('#dropdown-destination');
  }
```

After the user clicks on the button, the final HTML result for the div will be like this:
```html
  <div id="dropdown-destination">
    <ul>
      <li>Archive</li>
      <li>Mark as Read</li>
      <li>Report</li>
    </ul>
  </div>
```

Things to note:
- The destination element needs to exist in the DOM before we use the helper. Otherwise, an error will be thrown if you are in development mode. The error is not thrown in production.
- When the destination element changes, the content defined in `in-element` will re-render completely.
- By default, the `in-element` helper replaces the destination element's existing content with the helper's block content. If you want to instead append the block content, you can pass `insertBefore=null`.


---

At its core, Ember's UIs are _HTML_ driven - every part of the UI that
is shown to the user is defined in an HTML template somewhere in your
application. Because of this, templates are central to Ember, and one of the
most important parts of the framework.

We'll discuss the capabilities and core concepts of templates in the following
chapters, but before we do that, we should get started with the basics. The
simplest way to get started on an Ember template is with some HTML!

## The Application Template

The central template in an Ember application is the `app/templates/application.hbs`
file. We can copy HTML into this file, and it will work without any changes. For
instance, you can copy the following example HTML for a simple messaging app:

```html {data-filename=app/templates/application.hbs}
<div class="messages">
  <aside>
    <div class="avatar is-active" title="Tomster's avatar">T</div>
  </aside>
  <section>
    <h4 class="username">
      Tomster
      <span class="local-time">their local time is 4:56pm</span>
    </h4>

    <p>
      Hey Zoey, have you had a chance to look at the EmberConf brainstorming doc
      I sent you?
    </p>
  </section>

  <aside class="current-user">
    <div class="avatar" title="Zoey's avatar">Z</div>
  </aside>
  <section>
    <h4 class="username">Zoey</h4>

    <p>Hey!</p>

    <p>
      I love the ideas! I'm really excited about where this year's EmberConf is
      going, I'm sure it's going to be the best one yet. Some quick notes:
    </p>

    <ul>
      <li>
        Definitely agree that we should double the coffee budget this year (it
        really is impressive how much we go through!)
      </li>
      <li>
        A blimp would definitely make the venue very easy to find, but I think
        it might be a bit out of our budget. Maybe we could rent some spotlights
        instead?
      </li>
      <li>
        We absolutely will need more hamster wheels, last year's line was
        <em>way</em> too long. Will get on that now before rental season hits
        its peak.
      </li>
    </ul>

    <p>Let me know when you've nailed down the dates!</p>
  </section>

  <form>
    <label for="message">Message</label>
    <input id="message" />
    <button type="submit">
      Send
    </button>
  </form>
</div>
```

You can _serve_ the app by running `ember s` in your terminal, which will make
the local copy of your application available to view in your web browser.

If you serve the app and go to `localhost:4200` in your web browser, you'll see
the HTML rendered. At this point, it will still be unstyled.

To style the application, copy the following CSS into `app/styles/app.css`:

```css {data-filename=styles/app.css}
body {
  max-width: 800px;
  margin: auto;
  padding: 2em;
  font-family: sans-serif;
  background-color: #fdfdfd;
}

.messages {
  display: grid;
  grid-template-columns: 80px 1fr;
  padding: 2em;
  border-radius: 0.5em;
  box-shadow: 0 0.25em 1.5em 0.25em rgba(0, 0, 0, 0.1);
}

.messages > section {
  margin-bottom: 1.5em;
  line-height: 1.5em;
}

.messages p,
.messages ul,
.username {
  margin: 0.5em 0;
}

.local-time {
  font-size: 0.8em;
  color: #da6c4d;
  font-weight: normal;
  margin-left: 10px;
}

.avatar {
  position: relative;
  border-radius: 50%;
  width: 60px;
  height: 60px;

  text-align: center;
  line-height: 60px;

  color: white;
  font-weight: bold;
  background-color: #ff907b;
}

.avatar.is-active:after {
  content: " ";
  height: 14px;
  width: 14px;
  border: solid 3px white;
  border-radius: 50%;
  background-color: #8bc34a;
  position: absolute;
  bottom: 0;
  right: 0;
}

.current-user .avatar {
  background-color: #30aba5;
}

form {
  display: grid;
  grid-template-columns: 1fr 6em;
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  grid-column: span 2;
}

form > label {
  grid-area: 1 / 1 / 2 / 2;
}

form > input {
  padding: 0.5em;
  border-top-left-radius: 0.5em;
  border-bottom-left-radius: 0.5em;
  border: 1px solid #cccccc;
  border-right: none;
  font-size: 1em;
  grid-area: 2 / 1 / 3 / 2;
}

form > button {
  border-top-right-radius: 0.5em;
  border-bottom-right-radius: 0.5em;
  border: 1px solid #cccccc;
  font-size: 1em;
  grid-area: 2 / 2 / 3 / 3; 
}
```

![screenshot of styled message app](/images/ember-core-concepts/messaging-app-1.png)

You start building parts of an Ember application using HTML, so if you already
know HTML and CSS, you know how to build a basic Ember application!

You can even use SVG or web components without any changes. As long as your HTML
is valid, Ember will render it.

## Self-Closing Tags

In addition to normal HTML syntax, Ember allows you to use self-closing syntax
(`<div />`) as a shorthand for an opening and closing tag (`<div></div>`).

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        You don't <strong>need</strong> to use this syntax for <a href="https://html.spec.whatwg.org/multipage/syntax.html#void-elements">"void" HTML
        tags</a> such as <code>img</code> or <code>br</code>, which are already
        defined as self-closing by the HTML specification, but you <strong>can</strong> use this syntax
        as a shorthand for tags that are not self-closing.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Supported Features

This means that all of the following HTML features work as-is:

- Web components
- SVG
- HTML comments
- White space (following the same rules as normal HTML)
- Special HTML elements like `<table>` and `<select>`

## Restrictions

There are a handful of restrictions on the HTML that you can put in an Ember
template:

- Only valid HTML elements in a `<body>` tag can be used
- No `<script>` tags

Other than that, go to town!


---

You _could_ put all of your application HTML into a single file, but in practice, you'll probably want to break it apart into smaller files.

In Ember, those smaller pieces are called _components_.

Let's start with the sample HTML for a messaging app (that we introduced in the previous chapter, if you're reading the guides in order):

```handlebars {data-filename="app/templates/application.hbs"}
<div class="messages">
  <aside>
    <div class="avatar is-active" title="Tomster's avatar">T</div>
  </aside>
  <section>
    <h4 class="username">
      Tomster
      <span class="local-time">their local time is 4:56pm</span>
    </h4>

    <p>
      Hey Zoey, have you had a chance to look at the EmberConf brainstorming doc
      I sent you?
    </p>
  </section>

  <aside class="current-user">
    <div class="avatar" title="Zoey's avatar">Z</div>
  </aside>
  <section>
    <h4 class="username">Zoey</h4>

    <p>Hey!</p>

    <p>
      I love the ideas! I'm really excited about where this year's EmberConf is
      going, I'm sure it's going to be the best one yet. Some quick notes:
    </p>

    <ul>
      <li>
        Definitely agree that we should double the coffee budget this year (it
        really is impressive how much we go through!)
      </li>
      <li>
        A blimp would definitely make the venue very easy to find, but I think
        it might be a bit out of our budget. Maybe we could rent some spotlights
        instead?
      </li>
      <li>
        We absolutely will need more hamster wheels, last year's line was
        <em>way</em> too long. Will get on that now before rental season hits
        its peak.
      </li>
    </ul>

    <p>Let me know when you've nailed down the dates!</p>
  </section>

  <form>
    <label for="message">Message</label>
    <input id="message" />
    <button type="submit">
      Send
    </button>
  </form>
</div>
```

## Breaking it into pieces

Let's take the large template and break it up into smaller pieces. We can see that there are 3 distinct parts:

- The received message (Tomster's message).
- The sent message (Zoey's message).
- The "new message" input.

We'll break apart the larger HTML file into files containing each of these parts.

### The Received Message

First, let's copy Tomster's message into its own component. Components go in the `app/components` directory.

```handlebars {data-filename="app/components/received-message.hbs"}
<aside>
  <div class="avatar is-active" title="Tomster's avatar">T</div>
</aside>
<section>
  <h4 class="username">
    Tomster
    <span class="local-time">their local time is 4:56pm</span>
  </h4>

  <p>
    Hey Zoey, have you had a chance to look at the EmberConf
    brainstorming doc I sent you?
  </p>
</section>
```

We've just created our first component!

We can include our new component into our application by using HTML tag syntax.

```handlebars {data-filename="app/templates/application.hbs" data-diff="-2,-3,-4,-5,-6,-7,-8,-9,-10,-11,-12,-13,-14,-15,+16"}
<div class="messages">
  <aside>
    <div class="avatar is-active" title="Tomster's avatar">T</div>
  </aside>
  <section>
    <h4 class="username">
      Tomster
      <span class="local-time">their local time is 4:56pm</span>
    </h4>

    <p>
      Hey Zoey, have you had a chance to look at the EmberConf
      brainstorming doc I sent you?
    </p>
  </section>
  <ReceivedMessage/>

  <aside class="current-user">
    <div class="avatar" title="Zoey's avatar">Z</div>
  </aside>
  <section>
    <h4 class="username">Zoey</h4>

    <p>Hey!</p>

    <p>
      I love the ideas! I'm really excited about where this year's
      EmberConf is going, I'm sure it's going to be the best one yet.
      Some quick notes:
    </p>

    <ul>
      <li>
        Definitely agree that we should double the coffee budget this
        year (it really is impressive how much we go through!)
      </li>
      <li>
        A blimp would definitely make the venue very easy to find, but
        I think it might be a bit out of our budget. Maybe we could
        rent some spotlights instead?
      </li>
      <li>
        We absolutely will need more hamster wheels, last year's line
        was <em>way</em> too long. Will get on that now before rental
        season hits its peak.
      </li>
    </ul>

    <p>Let me know when you've nailed down the dates!</p>
  </section>

  <form>
    <label for="message">Message</label>
    <input id="message" />
    <button type="submit">
      Send
    </button>
  </form>
</div>
```

A _component_ is kind of like your own custom HTML tag. You can tell that a tag refers to an Ember component because it starts with a capital letter. Built-in HTML tags start with lowercase letters (`<div>`, `<p>`, `<table>`). Our component is called `<ReceivedMessage>`, based on its name on the file system.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        A component's name is derived from its file name.
        We capitalize the first letter and every letter after <code>-</code>, then remove the hyphens.
        This is known as pascal case.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### The Sent Message

Let's do it again. We'll copy the sent message content into a new component, and then include it in our application template.

```handlebars {data-filename="app/components/sent-message.hbs"}
<aside class="current-user">
  <div class="avatar" title="Zoey's avatar">Z</div>
</aside>
<section>
  <h4 class="username">Zoey</h4>

  <p>Hey!</p>

  <p>
    I love the ideas! I'm really excited about where this year's
    EmberConf is going, I'm sure it's going to be the best one yet.
    Some quick notes:
  </p>

  <ul>
    <li>
      Definitely agree that we should double the coffee budget this
      year (it really is impressive how much we go through!)
    </li>
    <li>
      A blimp would definitely make the venue very easy to find, but
      I think it might be a bit out of our budget. Maybe we could
      rent some spotlights instead?
    </li>
    <li>
      We absolutely will need more hamster wheels, last year's line
      was <em>way</em> too long. Will get on that now before rental
      season hits its peak.
    </li>
  </ul>

  <p>Let me know when you've nailed down the dates!</p>
</section>
```

```handlebars {data-filename="app/templates/application.hbs" data-diff="-4,-5,-6,-7,-8,-9,-10,-11,-12,-13,-14,-15,-16,-17,-18,-19,-20,-21,-22,-23,-24,-25,-26,-27,-28,-29,-30,-31,-32,-33,-34,-35,-36,+37"}
<div class="messages">
  <ReceivedMessage />

  <aside>
    <div class="avatar" title="Zoey's avatar">Z</div>
  </aside>
  <section>
    <h4 class="username">Zoey</h4>

    <p>Hey!</p>

    <p>
      I love the ideas! I'm really excited about where this year's
      EmberConf is going, I'm sure it's going to be the best one yet.
      Some quick notes:
    </p>

    <ul>
      <li>
        Definitely agree that we should double the coffee budget this
        year (it really is impressive how much we go through!)
      </li>
      <li>
        A blimp would definitely make the venue very easy to find, but
        I think it might be a bit out of our budget. Maybe we could
        rent some spotlights instead?
      </li>
      <li>
        We absolutely will need more hamster wheels, last year's line
        was <em>way</em> too long. Will get on that now before rental
        season hits its peak.
      </li>
    </ul>

    <p>Let me know when you've nailed down the dates!</p>
  </section>
  <SentMessage />

  <form>
    <label for="message">Message</label>
    <input id="message" />
    <button type="submit">
      Send
    </button>
  </form>
</div>
```

### The New Message Input

We have one last component to extract. Let's pull out the new message input.

```handlebars {data-filename="app/components/new-message-input.hbs"}
<form>
  <label for="message">Message</label>
  <input id="message" />
  <button type="submit">
    Send
  </button>
</form>
```

And include it in our `application.hbs` file.

```handlebars {data-filename="app/templates/application.hbs" data-diff="-6,-7,-8,-9,-10,-11,-12,+13"}
<div class="messages">
  <ReceivedMessage />

  <SentMessage />

  <form>
    <label for="message">Message</label>
    <input id="message" />
    <button type="submit">
      Send
    </button>
  </form>
  <NewMessageInput />
</div>
```

## Breaking Components Down Further

We can use components _within_ other components, so we can continue to break down our template into smaller pieces if we want. For instance, Tomster's avatar could be made into its own component that is then used within the `<ReceivedMessage>`.

```handlebars {data-filename="app/components/received-message-avatar.hbs"}
<aside>
  <div class="avatar is-active" title="Tomster's avatar">T</div>
</aside>
```

```handlebars {data-filename="app/components/received-message.hbs" data-diff="-1,-2,-3,+4"}
<aside>
  <div class="avatar is-active" title="Tomster's avatar">T</div>
</aside>
<ReceivedMessageAvatar />
<section>
  <h4 class="username">
    Tomster
    <span class="local-time">their local time is 4:56pm</span>
  </h4>

  <p>
    Hey Zoey, have you had a chance to look at the EmberConf
    brainstorming doc I sent you?
  </p>
</section>
```

We could also extract the username from the message:

```handlebars {data-filename="app/components/received-message-username.hbs"}
<h4 class="username">
  Tomster
  <span class="local-time">their local time is 4:56pm</span>
</h4>
```

```handlebars {data-filename="app/components/received-message.hbs" data-diff="-3,-4,-5,-6,+7"}
<ReceivedMessageAvatar />
<section>
  <h4 class="username">
    Tomster
    <span class="local-time">their local time is 4:56pm</span>
  </h4>
  <ReceivedMessageUsername />

  <p>
    Hey Zoey, have you had a chance to look at the EmberConf
    brainstorming doc I sent you?
  </p>
</section>
```

We can do the same for the `<SentMessage>` component:

```handlebars {data-filename="app/components/sent-message-avatar.hbs"}
<aside class="current-user">
  <div class="avatar" title="Zoey's avatar">Z</div>
</aside>
```

```handlebars {data-filename="app/components/sent-message-username.hbs"}
<h4 class="username">Zoey</h4>
```

```handlebars {data-filename="app/components/sent-message.hbs" data-diff="-3,+4"}
<SentMessageAvatar />
<section>
  <h4 class="username">Zoey</h4>
  <SentMessageUsername />

  <p>Hey!</p>

  <p>
    I love the ideas! I'm really excited about where this year's
    EmberConf is going, I'm sure it's going to be the best one yet.
    Some quick notes:
  </p>

  <ul>
    <li>
      Definitely agree that we should double the coffee budget this
      year (it really is impressive how much we go through!)
    </li>
    <li>
      A blimp would definitely make the venue very easy to find, but
      I think it might be a bit out of our budget. Maybe we could
      rent some spotlights instead?
    </li>
    <li>
      We absolutely will need more hamster wheels, last year's line
      was <em>way</em> too long. Will get on that now before rental
      season hits its peak.
    </li>
  </ul>

  <p>Let me know when you've nailed down the dates!</p>
</section>
```

Components can be broken down to any level, included in each other and reused.

### Nesting Components in Folders

The avatar and username components are directly related to the sent and received message components. Right now, they're grouped at the top level. As you get more components, this could make a big mess! Instead, we want to group the related components together in the filesystem. We can do this by moving them into subfolders within `app/components`.

```handlebars {data-filename="" data-diff="-4,-5,+6,+7,+8,-9,-10,-11,+12,+13,+14"}
app/
  components/
    received-message.hbs
    received-message-avatar.hbs
    received-message-username.hbs
    received-message/
      avatar.hbs
      username.hbs
    sent-message.hbs
    sent-message-avatar.hbs
    sent-message-username.hbs
    sent-message/
      avatar.hbs
      username.hbs
```

We can then use the `::` separator in templates to access components within a
folder:

```handlebars {data-filename="app/components/received-message.hbs" data-diff="-1,+2,-4,+5"}
<ReceivedMessageAvatar />
<ReceivedMessage::Avatar />
<section>
  <ReceivedMessageUsername />
  <ReceivedMessage::Username />

  <p>
    Hey Zoey, have you had a chance to look at the EmberConf
    brainstorming doc I sent you?
  </p>
</section>
```

```handlebars {data-filename="app/components/sent-message.hbs" data-diff="-1,+2,-4,+5"}
<SentMessageAvatar />
<SentMessage::Avatar />
<section>
  <SentMessageUsername />
  <SentMessage::Username />

  <p>Hey!</p>

  <p>
    I love the ideas! I'm really excited about where this year's
    EmberConf is going, I'm sure it's going to be the best one yet.
    Some quick notes:
  </p>

  <ul>
    <li>
      Definitely agree that we should double the coffee budget this
      year (it really is impressive how much we go through!)
    </li>
    <li>
      A blimp would definitely make the venue very easy to find, but
      I think it might be a bit out of our budget. Maybe we could
      rent some spotlights instead?
    </li>
    <li>
      We absolutely will need more hamster wheels, last year's line
      was <em>way</em> too long. Will get on that now before rental
      season hits its peak.
    </li>
  </ul>

  <p>Let me know when you've nailed down the dates!</p>
</section>
```

If you have a component named `index.hbs`, you can refer to it without the `::Index`. So we can refactor `app/components/received-message.hbs` to `app/components/received-message/index.hbs` and continue to use it as `<ReceivedMessage>` without changing all the tags that refer to it:

```handlebars {data-filename="" data-diff="-3,+5"}
app/
  components/
    received-message.hbs
    received-message/
      index.hbs
      avatar.hbs
      username.hbs
```

Components can be nested in multiple sub folders this way, allowing you to organize them as you see fit.

## Summary

We've taken a big HTML file and broken it up into _components_ to make the content easier to understand and maintain.

A _component_ is a chunk of HTML that can be included in another component using HTML tag syntax.


---

Oftentimes we'll need to repeat a component multiple times in a row, with
different data for each usage of the component. We can use the
[`{{#each}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each?anchor=each)
helper to loop through lists of items like this, repeating a section of template
for each item in the list.

For instance, in a messaging app, we could have a `<Message>` component that we
repeat for each message that the users have sent to each other.

```handlebars {data-filename="app/components/messages.hbs"}
<div class="messages">
  <Message
    @username="Tomster"
    @userIsActive={{true}}
    @userLocalTime="4:56pm"
  >
    <p>
      Hey Zoey, have you had a chance to look at the EmberConf
      brainstorming doc I sent you?
    </p>
  </Message>
  <Message
    @username="Zoey"
    @userIsActive={{true}}
  >
    <p>Hey!</p>

    <p>
      I love the ideas! I'm really excited about where this year's
      EmberConf is going, I'm sure it's going to be the best one yet.
      Some quick notes:
    </p>

    <ul>
      <li>
        Definitely agree that we should double the coffee budget this
        year (it really is impressive how much we go through!)
      </li>
      <li>
        A blimp would definitely make the venue very easy to find, but
        I think it might be a bit out of our budget. Maybe we could
        rent some spotlights instead?
      </li>
      <li>
        We absolutely will need more hamster wheels, last year's line
        was <em>way</em> too long. Will get on that now before rental
        season hits its peak.
      </li>
    </ul>

    <p>Let me know when you've nailed down the dates!</p>
  </Message>

  <NewMessageInput />
</div>
```

First, we would add a component class and extract the parts of each `<Message>`
component that are different into an array on that class. We would extract the
username, active value, local time, and the yielded content for each message.
For the yielded content, since it's plain HTML, we can extract it as a string.

```js {data-filename="app/components/messages.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MessagesComponent extends Component {
  @tracked messages = [
    {
      username: 'Tomster',
      active: true,
      localTime: '4:56pm',
      content: `
        <p>
          Hey Zoey, have you had a chance to look at the EmberConf
          brainstorming doc I sent you?
        </p>
      `
    },
    {
      username: 'Zoey',
      active: true,
      content: `
        <p>Hey!</p>

        <p>
          I love the ideas! I'm really excited about where this year's
          EmberConf is going, I'm sure it's going to be the best one yet.
          Some quick notes:
        </p>

        <ul>
          <li>
            Definitely agree that we should double the coffee budget this
            year (it really is impressive how much we go through!)
          </li>
          <li>
            A blimp would definitely make the venue very easy to find, but
            I think it might be a bit out of our budget. Maybe we could
            rent some spotlights instead?
          </li>
          <li>
            We absolutely will need more hamster wheels, last year's line
            was <em>way</em> too long. Will get on that now before rental
            season hits its peak.
          </li>
        </ul>

        <p>Let me know when you've nailed down the dates!</p>
      `
    }
  ];
}
```

Then, we can add an `{{each}}` helper to the template by passing
`this.messages` to it. `{{each}}` will receive each message as its first block
param, and we can use that item in the template block for the loop.

```handlebars {data-filename="app/components/messages.hbs" data-diff="+2,+3,+4,+5,+6,+7,+8,+9,+10,-11,-12,-13,-14,-15,-16,-17,-18,-19,-20,-21,-22,-23,-24,-25,-26,-27,-28,-29,-30,-31,-32,-33,-34,-35,-36,-37,-38,-39,-40,-41,-42,-43,-44,-45,-46,-47,-48,-49,-50,-51"}
<div class="messages">
  {{#each this.messages as |message|}}
    <Message
      @username={{message.username}}
      @userIsActive={{message.active}}
      @userLocaltime={{message.localTime}}
    >
      {{{message.content}}}
    </Message>
  {{/each}}
  <Message
    @username="Tomster"
    @userIsActive={{true}}
    @userLocalTime="4:56pm"
  >
    <p>
      Hey Zoey, have you had a chance to look at the EmberConf
      brainstorming doc I sent you?
    </p>
  </Message>
  <Message
    @username="Zoey"
    @userIsActive={{true}}
  >
    <p>Hey!</p>

    <p>
      I love the ideas! I'm really excited about where this year's
      EmberConf is going, I'm sure it's going to be the best one yet.
      Some quick notes:
    </p>

    <ul>
      <li>
        Definitely agree that we should double the coffee budget this
        year (it really is impressive how much we go through!)
      </li>
      <li>
        A blimp would definitely make the venue very easy to find, but
        I think it might be a bit out of our budget. Maybe we could
        rent some spotlights instead?
      </li>
      <li>
        We absolutely will need more hamster wheels, last year's line
        was <em>way</em> too long. Will get on that now before rental
        season hits its peak.
      </li>
    </ul>

    <p>Let me know when you've nailed down the dates!</p>
  </Message>

  <NewMessageInput />
</div>
```

Notice that we used triple curly brackets around `{{{message.content}}}`. This
is how Ember knows to insert the content directly as HTML, rather than directly
as a string.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
        Triple curly brackets are a convenient way to put dynamic HTML into Ember templates,
        but are not recommended for production apps.
        Inserting unknown HTML can create unexpected results and security issues.
        Be sure to sanitize the HTML before you render it.
        </p>
        <p>
        We can use the <a href="https://api.emberjs.com/ember/release/functions/@ember%2Ftemplate/htmlSafe">htmlSafe</a>
        function to mark a sanitized HTML as safe, then use double curly brackets to render the HTML.
        We can also create a <a href="../helper-functions">helper</a> that sanitizes the HTML, marks it as safe,
        and returns the output.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Updating Lists

Next, let's add a way for the user to send a new message. First, we need to
add an action for creating the new message. We'll add this to the
`<NewMessageInput />` component:

```handlebars {data-filename="app/components/new-message-input.hbs" data-diff="-1,+2,-3,+4"}
<form>
<form {{on "submit" this.createMessage}}>
  <input>
  <Input @value={{this.message}}>
  <button type="submit">
    Send
  </button>
</form>
```

We're using the `submit` event on the form itself here rather than adding a
`click` event handler to the button since it is about submitting the form as a
whole. We also updated the `input` tag to instead use the built in `<Input>`
component, which automatically updates the value we pass to `@value`. Next,
let's add the component class:

```javascript {data-filename="app/components/new-message-input.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class NewMessageInputComponent extends Component {
  @tracked message;

  @action
  createMessage(event) {
    event.preventDefault();

    if (this.message && this.args.onCreate) {
      this.args.onCreate(this.message);

      // reset the message input
      this.message = '';
    }
  }
}
```

This action uses the `onCreate` argument to expose a public API for defining
what happens when a message is created. This way, the `<NewMessageInput>`
component doesn't have to worry about the external details - it can focus on
getting the new message input.

Next, we'll update the parent component to use this new argument.

```handlebars {data-filename="app/components/messages.hbs" data-diff="-12,+13"}
<div class="messages">
  {{#each this.messages as |message|}}
    <Message
      @username={{message.username}}
      @userIsActive={{message.active}}
      @userLocaltime={{message.localTime}}
    >
      {{{message.content}}}
    </Message>
  {{/each}}

  <NewMessageInput />
  <NewMessageInput @onCreate={{this.addMessage}} />
</div>
```

And in the component class, we'll add the `addMessage` action. This action will
create the new message from the text that the `<NewMessageInput>` component
gives us, and push it into the messages array.

```js {data-filename="app/components/messages.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MessagesComponent extends Component {
  username = 'Zoey';

  @action
  addMessage(messageText) {
    this.messages = [...this.messages, {
      username: this.username,
      active: true,
      content: `<p>${messageText}</p>`
    }];
  }

  @tracked messages = [
    {
      username: 'Tomster',
      active: true,
      localTime: '4:56pm',
      content: `
        <p>
          Hey Zoey, have you had a chance to look at the EmberConf
          brainstorming doc I sent you?
        </p>
      `
    },
    {
      username: 'Zoey',
      active: true,
      content: `
        <p>Hey!</p>

        <p>
          I love the ideas! I'm really excited about where this year's
          EmberConf is going, I'm sure it's going to be the best one yet.
          Some quick notes:
        </p>

        <ul>
          <li>
            Definitely agree that we should double the coffee budget this
            year (it really is impressive how much we go through!)
          </li>
          <li>
            A blimp would definitely make the venue very easy to find, but
            I think it might be a bit out of our budget. Maybe we could
            rent some spotlights instead?
          </li>
          <li>
            We absolutely will need more hamster wheels, last year's line
            was <em>way</em> too long. Will get on that now before rental
            season hits its peak.
          </li>
        </ul>

        <p>Let me know when you've nailed down the dates!</p>
      `
    }
  ];
}
```

Now, whenever we type a value and submit it in the form, a new message object
will be added to the array, and the `{{each}}` will update with the new item.

### Item Indexes

The index of each item in the array is provided as a second block param. This
can be useful at times if you need the index, for instance if you needed to
print positions in a queue

```javascript
import Component from '@glimmer/component';

export default class SomeComponent extends Component {
  queue = [
    { name: 'Yehuda' },
    { name: 'Jen' },
    { name: 'Rob' }
  ];
}
```

```handlebars
<ul>
  {{#each this.queue as |person index|}}
    <li>Hello, {{person.name}}! You're number {{index}} in line</li>
  {{/each}}
</ul>
```

### Empty Lists

The [`{{#each}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each?anchor=each)
helper can also have a corresponding `{{else}}`. The contents of this block will
render if the array passed to `{{#each}}` is empty:

```handlebars
{{#each this.people as |person|}}
  Hello, {{person.name}}!
{{else}}
  Sorry, nobody is here.
{{/each}}
```

## Looping Through Objects

There are also times when we need to loop through the keys and values of an
object rather than an array, similar to JavaScript's `for...in` loop. We can use
the [`{{#each-in}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each-in?anchor=each-in)
helper to do this:

```javascript {data-filename=/app/components/store-categories.js}
import Component from '@glimmer/component';

export default class StoreCategoriesComponent extends Component {
  // Set the "categories" property to a JavaScript object
  // with the category name as the key and the value a list
  // of products.
  categories = {
    'Bourbons': ['Bulleit', 'Four Roses', 'Woodford Reserve'],
    'Ryes': ['WhistlePig', 'High West']
  };
}
```

```handlebars {data-filename=/app/components/store-categories.hbs}
<ul>
  {{#each-in this.categories as |category products|}}
    <li>{{category}}
      <ol>
        {{#each products as |product|}}
          <li>{{product}}</li>
        {{/each}}
      </ol>
    </li>
  {{/each-in}}
</ul>
```

The template inside of the `{{#each-in}}` block is repeated once for each key in the passed object.
The first block parameter (`category` in the above example) is the key for this iteration,
while the second block parameter (`products`) is the actual value of that key.

The above example will print a list like this:

```html
<ul>
  <li>Bourbons
    <ol>
      <li>Bulleit</li>
      <li>Four Roses</li>
      <li>Woodford Reserve</li>
    </ol>
  </li>
  <li>Ryes
    <ol>
      <li>WhistlePig</li>
      <li>High West</li>
    </ol>
  </li>
</ul>
```

### Ordering

An object's keys will be listed in the same order as the array returned from
calling `Object.keys` on that object. If you want a different sort order, you
should use `Object.keys` to get an array, sort that array with the built-in JavaScript
tools, and use the [`{{#each}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each?anchor=each)
helper instead.

### Empty Lists

The [`{{#each-in}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each-in?anchor=each-in)
helper can have a matching `{{else}}`. The contents of this block will render if
the object is empty, null, or undefined:

```handlebars
{{#each-in this.people as |name person|}}
  Hello, {{name}}! You are {{person.age}} years old.
{{else}}
  Sorry, nobody is here.
{{/each-in}}
```

<!-- eof - needed for pages that end in a code block  -->


---

---
redirect: components/component-arguments-and-html-attributes
---


---

For the most part, you should be able to build Ember applications without directly manipulating the DOM. Before considering directly accessing the DOM, it's always best to first consider whether there's an Ember-native way to accomplish your goal.

## Thinking About Updates

In most cases, the best way to think about your component's output is to assume that it will be re-executed from the top every time anything changes in your application.

For example, consider an `Article` component that takes `@title` and `@body` arguments.

```handlebars {data-filename=app/components/article/template.hbs}
<article>
  <header><h1>{{@title}}</h1></header>
  <section>{{@body}}</section>
</article>
```

Assuming an `article` route with a model that looks like:

```json
{
  "title": "Hello world",
  "body": "This is the first article"
}
```

This component would be invoked this way:

```handlebars {data-filename=app/templates/article.hbs}
<Article @title={{@model.title}} @body={{@model.body}}>
```

The first time the `Article` component is rendered, it would produce this output:

```html
<article>
  <header><h1>Hello world</h1></header>
  <section>This is the first article</section>
</article>
```

In a way, this is like substitution: references to `@title` in the component's template are replaced by the value passed in from the outside.

If the model changes to:

```json
{
  "title": "Hello world",
  "body": "This is the first article. [UPDATE] I am so excited!"
}
```

the output will be updated to:

```html
<article>
  <header><h1>Hello world</h1></header>
  <section>This is the first article. [UPDATE] I am so excited!</section>
</article>
```

Think of this as evaluating the template from scratch, substituting in the new values, and updating the output with the new contents.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        In practice, Ember avoids updating parts of the DOM that haven't changed,
        which means that the user's selection state, cursor and scroll position,
        and other state won't change for no reason.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

In general, before reaching for direct DOM manipulation, you should see whether you can model the changes that you want by writing a single template that applies no matter what the input is.

## Manipulating Attributes

The same philosophy that applies to changing text also applies to changing attributes.

For example, let's say we want to enhance our `Article` component to include a `title` attribute on the `<article>` tag.

```handlebars {data-filename=app/components/article/template.hbs}
<article title="{{@title}}">
  <header><h1>{{@title}}</h1></header>
  <section>{{@body}}</section>
</article>
```

With the model:

```json
{
  "title": "Hello world",
  "body": "This is the first article. [UPDATE] I am so excited!"
}
```

the output will be:

```html
<article title="Hello world">
  <header><h1>Hello world</h1></header>
  <section>This is the first article. [UPDATE] I am so excited!</section>
</article>
```

Just like in previous examples, you can think of attribute changes as substitution. If the model changes to:

```json {data-filename="input" data-diff="-2,+3"}
{
  "title": "Hello world",
  "title": "Hello world!",
  "body": "This is the first article. [UPDATE] I am so excited!"
}
```

the output will be updated to:

```html {data-filename="output" data-diff="-1,+2,-3,+4"}
<article title="Hello world">
<article title="Hello world!">
  <header><h1>Hello world</h1></header>
  <header><h1>Hello world!</h1></header>
  <section>This is the first article. [UPDATE] I am so excited!</section>
</article>
```

## Conditional Attributes

So far, we've talked about how to populate an attribute with the value of a variable. But what if we
want the value of an attribute to differ based upon whether the variable is truthy or falsy?

For example, let's say we want the `class` on a `<div>` to be `superuser` if the `@isAdmin` variable
is true, but `standard` if the `@isAdmin` variable is false.

We could accomplish this requirement by using the `if` helper inside of an attribute:

```handlebars
<div class={{if @isAdmin "superuser" "standard"}}>
  Welcome to my app.
</div>
```

Instead of thinking about changing the class imperatively when the `@isAdmin` variable changes, we
can think about how to build a template that produces the right output in both cases, and leave it
up to Ember to figure out how to update the HTML output.

## Summary: The Principle of Substitution

In summary, when you're trying to update a piece of text or an attribute in your component, think
of the Principle of Substitution, and write a template that produces the right HTML when you
substitute all of the variables in the template with the current values of the variables.

Whenever any of those variables change, Ember will automatically update the HTML efficiently without
blowing away browser state unnecessarily.

The advantage to writing components this way is that there is no way to make a mistake and forget to
update the output correctly in some situations. As long as the template produces the right HTML for
its inputs, the output will remain up to date.

This approach works great when you're trying to produce output that can be represented in HTML. But
what about aspects of your component that aren't represented in HTML, like event handlers? In those
cases, Ember tries to stick to the spirit of the Principle of Substitution, and allow you to write
templates as if they only ran one time, and then automatically keep the output up to date for you.

The rest of this guide describes how to enhance your templates with event handlers, custom DOM
properties and other kinds of custom JavaScript.

## Event Handlers

If you want to add an event handler to an HTML element, you can use the `{{on` element modifier.

```js {data-filename="app/components/counter.js"}
import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';

export default class CounterComponent extends Component {
  @tracked count = 0;

  @action
  increment() {
    this.count++;
  }
}
```

```handlebars {data-filename="app/components/counter.hbs"}
<p>{{this.count}}</p>

<button type="button" {{on "click" this.increment}}>+</button>
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Tomster says...</div>
      <div class="cta-note-message">
        "Element modifiers" appear inside free-floating curly braces inside of an opening
        tag. Unlike <strong>attribute syntax</strong>, which works by substitution
        (and therefore affects the HTML output of your page), element modifiers work
        by passing the element to a function that can do anything with it.
      </div>
    </div>
  </div>
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-message">
        Unlike attributes, element modifiers do <strong>not</strong> run on the
        server-side, because there is no general-purpose and complete way to serialize
        the results of an element modifier into HTML.</p>
      </div>
    </div>
    <img src="/images/mascots/tomster.png" role="presentation" alt="">
  </div>
</div>

## Manipulating Properties

Since you're writing an HTML template, you can use dynamic substitution inside of an attribute's value; whenever the value changes, the attribute will change.

Setting properties on an HTML element, on the other hand, is a different story, because there's no way to set a property using HTML syntax.

For example, let's say you want to create an `<audio>` element, but pass it a blob as its [`srcObject`](https://www.w3.org/TR/html52/semantics-embedded-content.html#dom-htmlmediaelement-srcobject).

Since `srcObject` is a property and not an HTML attribute, you can use the `prop` element modifier from [ember-prop-modifier][prop-modifier] like this:

```handlebars
<audio {{prop srcObject=this.blob}} />
```

[prop-modifier]: https://www.npmjs.com/package/ember-prop-modifier

If the value changes, Ember will automatically update the element's property for you.

### How to Know If You Need a Property

If you're looking at a piece of documentation written using HTML syntax, you can use the syntax as-is in your template, and use `{{` to insert dynamic content.

On the other hand, if you're looking at JavaScript documentation that tells you to set a property on an element object, you can use `{{prop` to set the prop

If you want to set a property, you can use the `prop` element modifier.

## Calling Methods On First Render

So far, we've talked about web APIs that work by setting attributes as well as web APIs that work by setting properties. But what about web APIs that work by calling methods, like setting focus on an element?

For example, let's say we want to focus an `<input>` in a form as soon as the form is rendered. The web API for focusing an element is:

```js
inputElement.focus();
```

This code needs to run after the element is rendered.

The simplest way to accomplish this is by using the `did-insert` modifier from [@ember/render-modifiers][render-modifiers].

[render-modifiers]: https://github.com/emberjs/ember-render-modifiers

```handlebars {app/components/edit-form.hbs}
<form>
  <input {{did-insert this.focus}}>
</form>
```

```js {app/components/edit-form.js}
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class EditFormComponent extends Component {
  @action
  focus(element) {
    element.focus();
  }
}
```

The `did-insert` modifier will call a function after its element is added to the DOM. That function receives the element as a parameter.

### Abstracting the Logic Into a Custom Modifier

Using the `did-insert` modifier works well for one-off cases, but if you want to pull this logic into reusable functionality that you can use throughout your app, you can make your _own_ modifier.

The modifier that we're going to build will allow us to say:

```handlebars {data-filename="app/components/edit-form.hbs"}
<form>
  <input {{autofocus}}>
</form>
```

Pretty nice, right?

New Ember apps ship with a dependency on
[ember-modifier](https://github.com/ember-modifier/ember-modifier), which
provides a friendly API for writing your own element modifiers. This library is
in turn based on a low level API named _modifier managers_. Managers are a
framework-development level feature, and not something most developers need to
interact with. You'll see in the following examples that the modifier API is
imported from the `ember-modifier` package.

First generate the `autofocus` modifier for your application:

```bash
ember generate modifier autofocus
```

Now add the functionality to focus the element:

```js {data-filename="app/modifiers/autofocus.js"}
import { modifier } from "ember-modifier";

export default modifier(element => element.focus());
```

And that's it! Now we can use our custom `{{autofocus}}` modifier throughout our application.

Read more about the `ember-modifier` APIs at [ember-modifiers:
Usage](https://github.com/ember-modifier/ember-modifier#usage).

## Communicating Between Elements in a Component

What if you want to handle an event in one part of your component by calling a DOM method on another part? For example, let's say you're creating an audio component:

```handlebars {data-filename="app/components/audio-player.hbs"}
<audio src={{@srcURL}} />

<button type="button">Play</button>
<button type="button">Pause</button>
```

How should we connect clicking the "Play" and "Pause" to calling the audio tag's `play` and `pause` methods?

While we _could_ manage these DOM interactions in the component class (for example, by using `{{did-render}}`), we're better off using a modifier here. It lets us cleanly separate our concerns: the component manages the _state_, and the modifier manages _interactions with the DOM_.

There are three reasons to reach for modifiers for DOM element interactions:

1. A component, by itself, doesn't have direct access to DOM elements. We have to render the page, push an element back up into the component class, and only then can we safely refer to that element. This can sometimes require us to render the component's HTML twice in order for things to start working. Modifiers let us avoid this possible performance issue.
2. By keeping state in the component and handling DOM method calls in a modifier, we can use autotracking and stick to 1-way data flow in the component. Further, we could change the component's own design later _without_ having to change how we interact with the DOM element.
3. The code for calling the audio element's `play` and `pause` can be reused. It isn't tied to this particular audio component. It can be tested independently, too!

Now that we see _why_ we want to use a modifier for our audio component, let's walk through _how_ to create one. We will start with the component (to manage the state) and then implement the modifier (the manage the DOM).

First, we add actions to handle the `click` events for the `Play` and `Pause` buttons:

```handlebars {data-filename="app/components/audio-player.hbs" data-diff="-3,+4,-5,+6"}
<audio src={{@srcURL}} />

<button type="button">Play</button>
<button type="button" {{on "click" this.play}}>Play</button>
<button type="button">Pause</button>
<button type="button" {{on "click" this.pause}}>Pause</button>
```

```js {data-filename="app/components/audio-player.js"}
import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class AudioPlayerComponent extends Component {
  @action
  play() {
    // TODO
  }

  @action
  pause() {
    // TODO
  }
}
```

Recall that our modifier will manage the DOM (i.e. calling the audio element's `play` or `pause` method). All the component needs to do is to track whether the audio is playing:

```js {data-filename="app/components/audio-player.js" data-diff="+2,+6,+7,-10,+11,-16,+17"}
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class AudioPlayerComponent extends Component {
  @tracked isPlaying = false;

  @action
  play() {
    // TODO
    this.isPlaying = true;
  }

  @action
  pause() {
    // TODO
    this.isPlaying = false;
  }
}
```

That's it for the component: we're translating the user's interactions into _state_. Now we need to build a modifier to translate the state into the appropriate DOM method calls!

```bash
ember generate modifier play-when
```

The modifier takes 1 argument, a Boolean that specifies if we should call the element's `play` or `pause` method.

```js {data-filename="app/modifiers/play-when.js"}
import { modifier } from "ember-modifier";

export default modifier((element, [isPlaying]) => {
  if (isPlaying) {
    element.play();
  } else {
    element.pause();
  }
});
```

Last but not least, we attach the modifier to the `audio` element:

```handlebars {data-filename="app/components/audio-player.hbs" data-diff="-1,+2"}
<audio src={{@srcURL}} />
<audio src={{@srcURL}} {{play-when this.isPlaying}} />

<button type="button" {{on "click" this.play}}>Play</button>
<button type="button" {{on "click" this.pause}}>Pause</button>
```

With that, we can now click the buttons to play and pause the audio!

In summary, when you want to allow elements in a component to communicate, see if you can separate the concerns of _managing state_ and _managing DOM interactions_. The component can manage the state, while a modifier can manage the DOM.

The modifier that we made for the audio player component can be reused on _any_ element that implements `play` and `pause` methods. In particular, we can reuse the modifier on any `HTMLMediaElement`, which includes `audio` and `video` elements.

## Out-of-Component Modifications

In most cases, your component should restrict its behavior to its own elements. However, there are cases where a component needs to do something outside of itself. One simple example of this would be an element that wants to handle clicks outside of its DOM, which requires registering a handler on the whole document, and then hit-testing the element.

Let's start with the DOM structure of a super-simple component that would remove its contents when a click occurs outside of the element.

```handlebars {data-filename="app/components/modal.hbs"}
<div class="modal">
  {{yield}}
</div>
```

We don't want to use `{{on "click"}}` here because we want the opposite behavior: do something whenever the user clicks _outside_ of the `<div>`. To accomplish that, we'll register a `click` handler on the entire document and then hit-test it, looking something like this:

```js
document.addEventListener("click", event => {
  if (!element.contains(event.target)) {
    // do something
  }
});
```

The most important difference between this example and the cases we've seen so far is that we need to remove the `click` event handler from the document when this element is destroyed.

To accomplish this, we can use [`ember-modifier`](https://github.com/ember-modifier/ember-modifier) (which is already installed in newly generated Ember apps) to create a `on-click-outside` modifier that sets up the event listener after the element is first inserted and removes the event listener when the element is removed. 

Generate the new modifier:

```bash
ember generate modifier on-click-outside
```

The `on-click-outside` modifier adds the click handler to the `document` and returns _another function_ that should be run when Ember removes the element the modifier is attached to.

```js {data-filename="app/modifiers/on-click-outside.js"}
import { modifier } from "ember-modifier";

export default modifier((element, [callback]) => {
  function handleClick(event) {
    if (!element.contains(event.target)) {
      callback();
    }
  }

  document.addEventListener("click", handleClick);

  return () => {
    document.removeEventListener("click", handleClick);
  };
});
```

Now that we've created this modifier, we can use it in our `modal` component, and add some logic to invoke a passed-in action whenever the user clicks outside the modal.

```handlebars {data-filename="app/components/modal.hbs"}
<div class="modal" {{on-click-outside @clickedOutside}}>
  {{yield}}
</div>
```

We could then use the `modal` component this way:

```handlebars {data-filename="app/components/sidebar.hbs"}
<p class="help-icon" {{on "click" this.showHelp}}>?</p>

{{#if this.showingHelp}}
  <Modal @clickedOutside={{this.hideHelp}}>
    Here's some interesting facts about the sidebar that you can learn.
  </Modal>
{{/if}}
```

```js {data-filename="app/components/sidebar.js"}
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class SidebarComponent extends Component {
  @tracked showingHelp = false;

  @action
  showHelp() {
    this.showingHelp = true;
  }

  @action
  hideHelp() {
    this.showingHelp = false;
  }
}
```

#### Modifiers and `...attributes`

Modifiers can also be applied to components, and when they are, they are also
passed forward and applied to an element with `...attributes`:

```handlebars
<Tooltip {{did-insert this.setupTooltip}}/>
```

```handlebars {data-filename="app/components/tooltip.hbs"}
<div ...attributes>
  ...
</div>
```

In this example, the `div` within the Tooltip component will get the
`did-insert` modifier applied to it.


---

The template tag format is a powerful, new way to write components in Ember. It's a single-file format that combines the component's JavaScript and Glimmer template code. The `<template>` tag is used to keep a clear separation between the template language and the JavaScript around it.

Template tag components use the file extension `.gjs`. This abbreviation is short for "Glimmer JavaScript". The file extension `.gts` is also supported for TypeScript components.

This new format is [the official future of Ember's component authoring story](https://rfcs.emberjs.com/id/0779-first-class-component-templates/), and is stable and usable today. The RFC is currently in the "Accepted" stage, and work is ongoing to get it to "Ready for Release". We expect it to become the recommended and default way of authoring all Ember apps in the near future, once we are satisfied that we have sufficiently polished up all the corners of the implementation.

> Can't wait to get started? Head over to the [installation section](#toc_installation) to begin using template tag components in your apps and addons today.

## Writing template tag components

Just like with separate JavaScript and Glimmer template files, the template tag format has the concept of template-only components and class-based components. Let's take a closer look at how these concepts compare between both component formats in the next section.

### Template-only components

The following template-only component was created in a [previous section](../component-arguments-and-html-attributes/) to extract an avatar layout into a reusable component.

```handlebars {data-filename="app/components/avatar.hbs"}
<aside>
  <div class="avatar" title={{@title}}>{{@initial}}</div>
</aside>
```

This layout can be turned into a template tag component by wrapping the code in a `<template>` tag and changing the file extension to `.gjs`.

```gjs {data-filename="app/components/avatar.gjs"}
<template>
  <aside>
    <div class="avatar" title={{@title}}>{{@initial}}</div>
  </aside>
</template>
```

The top-level template tag is exported as the default component from the file. You *can* write this export explicitly, but it's not necessary. The following example is equivalent to the previous one.

```gjs {data-filename="app/components/avatar.gjs"}
export default <template>
  <aside>
    <div class="avatar" title={{@title}}>{{@initial}}</div>
  </aside>
</template>;
```

### Class-based components

A `<template>` tag can also be embedded inside a class definition of a component. This is useful when you need to add state or other logic to your component. Take for example the following "Avatar" component, where a default title is added when the `title` argument is not provided.

```gjs {data-filename="app/components/avatar.gjs"}
import Component from '@glimmer/component';

export default class Avatar extends Component {
  get titleWithDefault() {
    return this.args.title ?? 'No avatar title provided';
  }

  <template>
    <aside>
      <div class="avatar" title={{this.titleWithDefault}}>{{@initial}}</div>
    </aside>
  </template>
}
```

## Importing components, helpers, and modifiers

In Ember templates, **“invokables”** are things you can *invoke* in a template. These include [components](./introducing-components/), [helpers](./helper-functions/), and [modifiers](./template-lifecycle-dom-and-modifiers/). In the template tag format, these invokables need to be imported before they can be used. This makes it easier to understand where values come from and what they do, as well as unlocks build optimizations.


### Importing invokables from your own app

When making use of the "Avatar" component as defined before in a different component file, it first needs to be imported. This is done using the `import` statement, just like you would import any other JavaScript module.

```gjs {data-filename="app/components/message.gjs"}
import Avatar from './avatar';

<template>
  <Avatar
    @title={{@avatarTitle}}
    @initial={{@avatarInitial}}
  />
  <section>
    {{@message}}
  </section>
</template>
```

The example above demonstrates defining a "Message" template-only component. The import syntax for class-based components is the same.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        The components that are imported are not required to use the new template tag format. This is intentional, and very powerful, as it <strong>allows incremental adoption</strong> of the new format.
        <br><br>
        The only prerequisite is that the component is defined using the <a href="https://rfcs.emberjs.com/id/0481-component-templates-co-location">template-colocation structure</a> instead of splitting up the JavaScript and Glimmer template files into separate folders.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

#### Nested components

Component files can be organized in nested directory structures on the file system. Prior to the template tag format, the file path from the root component directory had be specified before to the component name, separated with `::`.

For example, when moving the "Avatar" component to the `app/components/messages` namespace, referencing it using double colons would be done as follows.

```handlebars {data-filename="app/components/avatar-usage.hbs"}
<Messages::Avatar
  @title="Picture of Zoey"
  @initial="Zoey"
/>
```

This quirk is no longer necessary with the template tag format. Instead, importing now works the same as importing any other JavaScript module.

```gjs {data-filename="app/components/avatar-usage.gjs"}
import Avatar from './messages/avatar';

<template>
  <Avatar
    @title="Picture of Zoey"
    @initial="Zoey"
  />
</template>
```

#### Helpers and modifiers

Importing helpers and modifiers from your own app also follows the same principle of using standard JavaScript import syntax. Instead of importing from `app/components`, the path to import from is `app/helpers` and `app/modifiers` respectively.

Prior to the template tag format, helpers and modifiers were referenced based on their name in the "kebab-case" convention. For example, a `randomNumber` function as helper would be referenced as `{{random-number}}` in a template. In the new way of doing things, standard module import conventions are used. This means that the helper is referenced using the name it is exported as, which is `randomNumber` in this case.

```gjs {data-filename="app/components/random-number.gjs"}
import randomNumber from '../helpers/random-number';

<template>
  {{randomNumber}}
</template>
```

### Importing from addons

Just as with components, helpers, and modifiers from your own app, external invokables from addons also have to be imported. This is done using the same `import` statement, but with a path referencing the addon.

The structure of files within Ember addons is mostly standardized. This means that the path to import from can be derived from the addon's name. For example, an addon that is named `ember-foo` will likely have its components, helpers, and modifiers available as default import from the following locations:

```gjs
ember-foo/components/example-component
ember-foo/helpers/example-helper
ember-foo/modifiers/example-modifier
```

To import the "ExampleComponent" component from the `ember-foo` addon, the following import statement can be used.

```js
import ExampleComponent from 'ember-foo/components/example-component';
```

Some addons may choose to re-export their invokables from the root index as named exports. Usually addons will document this usage in their README, if supported, which may look like:

```js
import { ExampleComponent } from 'ember-foo';
```

### Importing built-ins

The Ember built-in helpers, modifiers, and components are available for import from the following locations.

```js
// Built-in helpers
import { array } from '@ember/helper';
import { concat } from '@ember/helper';
import { fn } from '@ember/helper';
import { get } from '@ember/helper';
import { hash } from '@ember/helper';

// Built-in modifiers
import { on } from '@ember/modifier';

// Built-in components
import { Input } from '@ember/component';
import { LinkTo } from '@ember/routing';
import { Textarea } from '@ember/component';
```

#### Keywords

While most items should be imported into scope explicitly, some of the existing constructs in the language are not importable and are available as keywords instead:

`action`, `debugger`, `each-in`, `each`, `has-block-params`, `has-block`, `hasBlock`, `if`, `in-element`, `let`, `link-to`  (non-block form curly invocations), `loc`, `log`, `mount`, `mut`, `outlet`, `query-params`, `readonly`, `unbound`, `unless`, `with`, and `yield`

These keywords do not have to be imported into scope and will always be available.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        Feeling a bit lost with remembering all import paths?
        <br><br>
        Make sure to look at your editor setup to see if it can help you with auto-completion of import paths. See the <a href="#toc_editor-integrations">Editor Integrations</a> section for more information.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## New capabilities

In the examples above, functionality that was already available before was covered using the template tag format. The template tag format, however, unlocks a number of new capabilities that were not possible before.

### Locally-scoped values

The template tag format follows JavaScript module syntax. Any value that isn't exported is only available locally within the file. This is useful for defining helper functions that are only used within the component, or for defining constants that are used multiple times within the template.

In the following example, a "Square" component is defined that calculates the square of a number. The `value` constant is defined locally, and the `square` helper function is only available within the component.

```gjs {data-filename="app/components/square.gjs"}
const value = 2;

function square(number) {
  return number * number;
}

<template>
  The square of {{value}} equals {{square value}}
</template>
```

This will render to `The square of 2 equals 4`.

### Multiple components per file

The template tag format allows defining multiple components within a single file. This is useful for defining components that are closely related to each other, but are not used in other parts of the app.

The following example defines a "CustomSelect" component that renders a `<select>` element with a list of options. The locally-defined "Option" component is used to render each option in the list.

```gjs {data-filename="app/components/custom-select.gjs"}
const Option = <template>
  <option selected={{@selected}} value={{@value}}>
    {{@value}}
  </option>
</template>;

const CustomSelect = <template>
  <select>
    {{#each @options as |opt|}}
      <Option
        @value={{opt.value}}
        @selected={{eq opt @selectedOption}}
      />
    {{/each}}
  </select>
</template>;

export default CustomSelect;
```

This can be a powerful refactoring technique to break up large components into smaller ones. (where it makes sense!)

## Testing

Historically, Ember's integration tests have been written using the `hbs` tagged template literal. This is no longer necessary with the template tag format. Instead, use the `<template>` tag to define a template to render.

The following example showcases how the "Avatar" component can be tested using the template tag format.

```gjs {data-filename="tests/integration/components/avatar-test.gjs"}
import Avatar from 'app/components/avatar';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';

module('Integration | Component | avatar', function (hooks) {
  setupRenderingTest(hooks);

  test('renders name argument', async function (assert) {
    const initial = 'Zoey';
    await render(
      <template>
        <Avatar @title="Picture of Zoey" @initial={{initial}} />
      </template>
    );
    assert.dom().hasText(initial);
  });
});
```

Notice how the same semantics now apply to tests as well: local values in scope can be referenced directly, and invokables from your own app or addons need to be imported.

## Installation

Install the [ember-template-imports](https://github.com/ember-template-imports/ember-template-imports) addon to start using template tag components. This addon provides all the build tooling required to support the new component authoring format.

```bash
npm add --save-dev ember-template-imports
```

### Integration with external tooling

You may need to upgrade dependency versions or install additional plugins to have proper integration with external tools. The following commonly-used tools are supported:

- [ember-template-lint](https://github.com/ember-template-lint/ember-template-lint): Versions 5.8.0 and up.
- [eslint-plugin-ember](https://github.com/ember-cli/eslint-plugin-ember): Versions 11.6.0 and up.
- [Prettier](https://github.com/prettier/prettier): Versions 3.1.0 and up. This requires installing the [prettier-plugin-ember-template-tag](https://github.com/gitKrystan/prettier-plugin-ember-template-tag).
- [Glint](https://github.com/typed-ember/glint): Requires installing the [environment-ember-template-imports](https://github.com/typed-ember/glint/tree/main/packages/environment-ember-template-imports) plugin.

## Editor Integrations

You may need to configure your editor to get syntax highlighting inside embedded templates and support for the `.gjs` and `.gts` file extension.

### Visual Studio Code

The [Ember.js extension pack](https://marketplace.visualstudio.com/items?itemName=EmberTooling.emberjs) bundles everything you need to get started. More specifically, the [vscode-glimmer-syntax](https://marketplace.visualstudio.com/items?itemName=lifeart.vscode-glimmer-syntax) extension will add support for `glimmer-js` and `glimmer-ts` languages and provide syntax highlighting. The [ember-language-server](https://github.com/lifeart/ember-language-server) extension provides automatic import completions and other useful features.

### Neovim

Here's an [example Neovim Config](https://github.com/NullVoxPopuli/dotfiles/blob/main/home/.config/nvim/lua/plugins/syntax.lua#L52) with support for good highlighting of embedded templates in JS and TS, using:

- [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter)
- [tree-sitter-glimmer](https://github.com/alexlafroscia/tree-sitter-glimmer)

### Other editors

For other editors, you may be able to get support using one of these other syntax definitions:

- [TextMate](https://github.com/lifeart/vsc-ember-syntax/tree/master/syntaxes)
- [TreeSitter](https://github.com/alexlafroscia/tree-sitter-glimmer)



---

---
redirect: components/template-lifecycle-dom-and-modifiers
---


---

---
redirect: components/component-state-and-actions
---


---

---
redirect: components/block-content
---


---

Ember application builds are created by the Ember CLI build pipeline. Just as with your application code,
Ember CLI ships with a sensible set of defaults to compile and bundle the assets that can be deployed
to production. Under the hood, this is accomplished using a series of Broccoli plugins, each of which
can be configured in the `ember-cli-build.js` file at the root of your project.

Ember CLI uses [Babel.js](https://babeljs.io/) for the compile step in this process. If you've used Babel
before, you know that it comes with a large set of options, including the ability to configure
"targets"; i.e. the environments in which your application is expected to run.
For example, if your application is embedded in an [Electron app](https://www.electronjs.org),
you might only care about compiling for the latest Chromium build. Or if your app targets Enterprise
users, you may need to compile your JavaScript to older syntax that runs in IE11.

For any of these cases, you can configure `ember build` to do The Right Thing. You can read more about
this in [the Ember CLI Guides](https://cli.emberjs.com/release/advanced-use/build-targets/)!


---

In addition to configuring your app itself, you can also configure Ember CLI.
These configurations can be made by adding them to the `.ember-cli` file in your application's root. Many can also be made by passing them as arguments to the command line program.

For example, a common desire is to change the port that Ember CLI serves the app from. It's possible to pass the port number from the command line with `ember server --port 8080`, if you want to pass the port to your `npm start` script you would pass it with an extra `--` like this: `npm start -- --port 8080`. To make this configuration permanent, edit your `.ember-cli` file like so:

```json
{
  "port": 8080
}
```

For a full list of command line options, run `ember help`.

More information on configuring the Ember CLI can be found in the [CLI Guides](https://cli.emberjs.com/release/appendix/configuration/).


---

Ember CLI ships with support for managing your application's environment. The runtime environment for the application is defined in `config/environment.js`. Here an object `ENV` is built for each of the three Ember CLI-supported build modes: development, test, and production.

Three notable properties on the `ENV` object are:

- `EmberENV` can be used to define Ember feature flags (see the [Feature Flags guide](../feature-flags/)) to be enabled at runtime.
- `APP` can be used to pass flags or options to the app's `Application` instance.
- `environment` by default contains which of the build environments was selected at build time (`development`, `test`, or `production`).

The `ENV` object is defined at build time, but you can access the `ENV` object
in application code via import from `your-application-name/config/environment`.

For example:

```javascript
import ENV from 'your-application-name/config/environment';

if (ENV.environment === 'development') {
  // ...
}
```

<!-- eof - needed for pages that end in a code block  -->


---

Ember provides a browser extension and several configuration options
to help you debug your application.

## Ember Inspector
The [Ember Inspector](https://github.com/emberjs/ember-inspector) is a browser extension that makes it easy to
understand and debug your Ember.js application. To learn more, check out the [dedicated guide](../../ember-inspector/).

## Routing

### Log router transitions

```javascript {data-filename=app/app.js}
import Application from '@ember/application';

export default class App extends Application {
  // Basic logging, e.g. "Transitioned into 'post'"
  LOG_TRANSITIONS = true;

  // Extremely detailed logging, highlighting every internal
  // step made while transitioning into a route, including
  // `beforeModel`, `model`, and `afterModel` hooks, and
  // information about redirects and aborted transitions
  LOG_TRANSITIONS_INTERNAL = true;
}
```
## Views / Templates

### Log view lookups

```javascript {data-filename=config/environment.js}
ENV.APP.LOG_VIEW_LOOKUPS = true;
```

## Controllers

### Log generated controller

```javascript {data-filename=config/environment.js}
ENV.APP.LOG_ACTIVE_GENERATION = true;
```

## Miscellaneous

### Turn on resolver resolution logging

This option logs all the lookups that are done to the console. Custom objects
you've created yourself have a tick, and Ember generated ones don't.

It's useful for understanding which objects Ember is finding when it does a lookup
and which it is generating automatically for you.

```javascript {data-filename=app/app.js}
import Application from '@ember/application';

export default class App extends Application {
  LOG_RESOLVER = true;
}
```
### Dealing with deprecations

In addition to what is described in the [Handling Deprecations guide](../handling-deprecations/),
you can turn on the following settings:

```javascript
Ember.ENV.RAISE_ON_DEPRECATION = true;
Ember.ENV.LOG_STACKTRACE_ON_DEPRECATION = true;
```

### Implement a window error event listener to log all errors in production

```javascript {data-filename=app/app.js}
import fetch from 'fetch';
// ...
window.addEventListener('error', function(error) {
  fetch('/error-notification', {
    method: 'POST',
    body: JSON.stringify({
      stack: error.stack,
      otherInformation: 'exception message'
    })
  });
});
```

### Errors within `Ember.run.later` Backburner

[Backburner.js](https://github.com/ebryn/backburner.js) has support for stitching the stacktraces together so that you can
track down where an error thrown by `Ember.run.later` is being initiated from. Unfortunately,
this is quite slow and is not appropriate for production or even normal development.

To enable full stacktrace mode in Backburner, and thus determine the stack of the task
when it was scheduled onto the run loop, you can set:

```javascript {data-filename=app/app.js}
import { run } from '@ember/runloop';

run.backburner.DEBUG = true;
```

Once the `DEBUG` value is set to `true`, when you are at a breakpoint you can navigate
back up the stack to the `flush` method in and check the `errorRecordedForStack.stack`
value, which will be the captured stack when this job was scheduled.


---

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
<em>Not</em> disabling prototype extensions is deprecated at Ember 5.10 and will be removed at Ember 6.0. See <a href="https://deprecations.emberjs.com/id/deprecate-array-prototype-extensions">the deprecation guide</a> for more detail.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Historically, Ember.js extended the prototypes of native JavaScript arrays to
implement the `Ember.Enumerable`, `Ember.MutableEnumerable`,
`Ember.MutableArray` and `Ember.Array` interfaces. This is the default behavior
up until 6.0, at which point it will no longer be supported.

To prepare for 6.0, you can disable prototype extensions immediately. To do so,
set the `EmberENV.EXTEND_PROTOTYPES` flag to `false`:

```javascript {data-filename=config/environment.js}
ENV = {
  EmberENV: {
    EXTEND_PROTOTYPES: false
  }
}
```

## Life Without Array Prototype Extension

There are two major differences to how arrays will behave after you disable array prototype extensions.

### No more non-standard methods

Arrays no longer have the non-standard methods listed in the [deprecation guide](https://deprecations.emberjs.com/id/deprecate-array-prototype-extensions) like `pushObject`, etc. Follow the deprecation guide to replace each usage with a standard JavaScript alternative.

### Tracking of Changes in Arrays

If you disable prototype extensions and attempt to use
native arrays with things like a template's `{{#each}}` helper, Ember.js
will have no way to detect changes to the array and the template will
not update as the underlying array changes.

You can restore automatic tracking of changes by replacing your native array with a `TrackedArray` from the 'tracked-built-ins' library.

```javascript
import { TrackedArray } from '@glimmer/tracking';

class Ocean {
  islands = new TrackedArray(['Oahu', 'Kauai']);
  
  addIsland(newIsland) {
    this.islands.push(newIsland);
  }
}
```

Alternatively, you can refactor your code to use an "immutable update" style with tracked properties:

```javascript
import { tracked } from '@glimmer/tracking';

class Ocean {
  @tracked islands = ['Oahu', 'Kauai'];
  
  addIsland(newIsland) {
    this.islands = this.islands.concat(newIsland);
  }
}
```

<!-- eof - needed for pages that end in a code block  -->


---

In most cases, your application's entire UI will be created by templates
that are managed by the router.

But what if you have an Ember.js app that you need to embed into an
existing page, or run alongside other JavaScript frameworks, or serve from the
same domain as another app?

### Changing the Root Element

By default, your application will render the [application template](../../routing/defining-your-routes/#toc_the-application-route)
and attach it to the document's `body` element.

You can tell the application to append the application template to a
different element by specifying its `rootElement` property:

```javascript {data-filename="app/app.js" data-diff="+7"}
import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

export default class App extends Application {
  rootElement = '#app';
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
```

This property can be specified as either an element or a
[jQuery-compatible selector
string](http://api.jquery.com/category/selectors/).

### Disabling URL Management

You can prevent Ember from making changes to the URL by [changing the
router's `location`](../specifying-url-type/) to
`none`:

```javascript {data-filename="config/environment.js" data-diff="-8,+9"}
/* eslint-env node */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'my-blog',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    locationType: 'none',
    …
  };

  …

  return ENV;
}
```

### Specifying a Root URL

If your Ember application is one of multiple web applications served from the same domain, it may be necessary to indicate to the router what the root URL for your Ember application is. By default, Ember will assume it is served from the root of your domain.

For example, if you wanted to serve your blogging application from `http://emberjs.com/blog/`, it would be necessary to specify a root URL of `/blog/`.

This can be achieved by configuring the `rootURL` property on `ENV`:

```javascript {data-filename="config/environment.js" data-diff="-7,+8"}
/* eslint-env node */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'my-blog',
    environment: environment,
    rootURL: '/',
    rootURL: '/blog/',
    locationType: 'auto',
    …
  };
}
```

You will notice that this is then used to configure your application's router:

```javascript {data-filename=app/router.js}
import Router from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
});
```

<!-- eof - needed for pages that end in a code block  -->


---

New features are added to Ember.js within conditional statements.

Code behind these flags can be conditionally enabled
(or completely removed) based on your project's configuration. This
allows newly developed features to be selectively released when the
Ember.js community considers them ready for production use.

## Feature Life-Cycle
A newly-flagged feature is only available in canary builds and can be enabled
at runtime through your project's configuration file.

At the start of a beta cycle, the Ember core team evaluates each new feature.
Features deemed stable are made available in the next beta and enabled by default.

Beta features that receive negative feedback from the community are disabled in the next beta point
release and are not included in the next stable release. They may still be included
in the next beta cycle if the issues/concerns are resolved.

Once the beta cycle has been completed, the next stable release will include any features that
were enabled during the beta cycle. At this point, the feature flags will be removed from
the canary and future beta branches, and the feature becomes part of the framework.

## Flagging Details
The flag status in the generated build is controlled by the [`@ember/canary-features`](https://github.com/emberjs/ember.js/blob/main/packages/@ember/canary-features/index.ts)
package. This package exports a list of all available features and their current status.

A feature can have one of three flags:

* `true` - The feature is **present** and **enabled**: the code behind the flag is always enabled in
  the generated build.
* `null` - The feature is **present** but **disabled** in the build output. It must be enabled at
  runtime.
* `false` - The feature is entirely **disabled**: the code behind the flag is not present in
  the generated build.

The process of removing the feature flags from the resulting build output is
handled by [`defeatureify`](https://github.com/thomasboyt/defeatureify).

## Feature Listing ([`FEATURES.md`](https://github.com/emberjs/ember.js/blob/main/FEATURES.md))

When a developer adds a new feature to the `canary` channel (i.e. the `main` branch on GitHub), they
also add an entry to [`FEATURES.md`](https://github.com/emberjs/ember.js/blob/main/FEATURES.md)
explaining what the feature does, and linking to their originating pull request.
This list is kept current and reflects what is available in each channel
(`release`, `beta`, and `canary`).

## Enabling At Runtime
When using the Ember.js canary or beta builds you can enable a "**present** but **disabled**"
feature by setting its flag value to `true` before your application boots:

```javascript {data-filename=config/environment.js}
let ENV = {
  EmberENV: {
    FEATURES: {
      'LINK_TO': true
    }
  }
};
```

For the truly ambitious developer, setting `ENV.EmberENV.ENABLE_OPTIONAL_FEATURES` to `true` will enable all
experimental features.


---

A valuable attribute of the Ember framework is its use of [Semantic Versioning](http://semver.org/) to aid projects in keeping up with
changes to the framework.  Before any functionality or API is removed it first goes through a deprecation period where the functionality is
still supported, but usage of it generates a warning logged to the browser console.  These warnings can pile up between major releases to a point where the amount of
deprecation warnings that scroll through the console becomes overwhelming.

<img width="675px" title="Deprecations Clouding up the Browser JavaScript Console" src="/images/guides/configuring-ember/handling-deprecations/deprecations-in-console.png"/>

Fortunately, Ember provides a way for projects to deal with deprecations in an organized and efficient manner.

## Filtering Deprecations

When your project has a lot of deprecations, you can start by filtering out deprecations that do not have to be addressed right away.
You can use the [deprecation handlers](https://api.emberjs.com/ember/release/functions/@ember%2Fdebug/registerDeprecationHandler) API to check for what release a deprecated feature will be removed.
An example handler is shown below that filters out all deprecations that are not going away in release 2.0.0.

```javascript {data-filename= app/initializers/main.js}
import { registerDeprecationHandler } from '@ember/debug';

export function initialize() {
  registerDeprecationHandler((message, options, next) => {
    if (options && options.until && options.until !== '2.0.0') {
      return;
    } else {
      next(message, options);
    }
  });
}

export default { initialize };
```

## Deprecation Workflow

Once you've removed deprecations that you may not need to immediately address, you may still be left with many deprecations.
Also, your remaining deprecations may only occur in very specific scenarios that are not obvious.
How then should you go about finding and fixing these?
This is where the [ember-cli-deprecation-workflow](http://emberobserver.com/addons/ember-cli-deprecation-workflow) addon can be extremely helpful.

Once installed, the addon works in 3 steps:

### 1. Gather deprecations into one source

The `ember-cli-deprecation-workflow` addon provides a command that will collect deprecations from your console and generate JavaScript code listing its findings.

To collect deprecations, first run your in-browser test suite by starting your development server and navigating to [`http://localhost:4200/tests`](http://localhost:4200/tests).  If your test suite isn't fully covering your app's functionality, you may also
manually exercise functionality within your app where needed.  Once you've exercised the app to your satisfaction, run the following command within
your browser console: `deprecationWorkflow.flushDeprecations()`.  This will print to the console JavaScript code, which you should then copy to a
new file in your project called `config/deprecation-workflow.js`

<img width="675px" title="Generated Deprecation Code from Browser Console" src="/images/guides/configuring-ember/handling-deprecations/generate-deprecation-code.png"/>

Here's an example of a deprecation-workflow file after generated from the console:

```javascript {data-filename= config/deprecation-workflow.js}
window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchMessage: "Ember.Handlebars.registerHelper is deprecated, please refactor to Ember.Helper.helper." },
    { handler: "silence", matchMessage: "`lookup` was called on a Registry. The `initializer` API no longer receives a container, and you should use an `instanceInitializer` to look up objects from the container." },
    { handler: "silence", matchMessage: "Using `Ember.HTMLBars.makeBoundHelper` is deprecated. Please refactor to using `Ember.Helper` or `Ember.Helper.helper`." },
    { handler: "silence", matchMessage: "Accessing 'template' in <web-directory@component:x-select::ember1381> is deprecated. To determine if a block was specified to <web-directory@component:x-select::ember1381> please use '{{#if hasBlock}}' in the components layout." },
    { handler: "silence", matchMessage: "Accessing 'template' in <web-directory@component:x-select::ember1402> is deprecated. To determine if a block was specified to <web-directory@component:x-select::ember1402> please use '{{#if hasBlock}}' in the components layout." },
    { handler: "silence", matchMessage: "Accessing 'template' in <web-directory@component:x-select::ember1407> is deprecated. To determine if a block was specified to <web-directory@component:x-select::ember1407> please use '{{#if hasBlock}}' in the components layout." }
  ]
};
```

You might notice that you have a lot of duplicated messages in your workflow file, like the 3 messages in the above example that start with
`Accessing 'template' in...`.  This is because some of the deprecation messages provide context to the specific deprecation, making them
different than the same deprecation in other parts of the app.  If you want to consolidate the
duplication, you can use a simple regular expression with a wildcard (`.*`) for the part of the message that varies per instance.

Below is the same deprecation-workflow file as above, now with a regular expression on line 7 to remove some redundant messages. Note that the double quotes around `matchMessage` have also been replaced with forward slashes.

```javascript {data-filename= config/deprecation-workflow.js}
window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchMessage: "Ember.Handlebars.registerHelper is deprecated, please refactor to Ember.Helper.helper." },
    { handler: "silence", matchMessage: "`lookup` was called on a Registry. The `initializer` API no longer receives a container, and you should use an `instanceInitializer` to look up objects from the container." },
    { handler: "silence", matchMessage: "Using `Ember.HTMLBars.makeBoundHelper` is deprecated. Please refactor to using `Ember.Helper` or `Ember.Helper.helper`." },
    { handler: "silence", matchMessage: /Accessing 'template' in .* is deprecated. To determine if a block was specified to .* please use '{{#if hasBlock}}' in the components layout./ }
  ]
};
```

Rerun your test suite as you make updates to your workflow file and you should validate that your deprecations are gone. Once that is completed,
you can proceed with enhancing your application without the sea of deprecation warnings clouding your log.

### 2. Turn on a deprecation

Once you have built your `deprecation-workflow.js` file and your deprecations are silenced, you can begin to work on deprecations one by one
at your own leisure.  To find deprecations, you can change the handler value of that message to either `throw` or `log`.  Throw will
throw an actual exception when the deprecation is encountered, so that tests that use the deprecated feature will fail.  Choosing to log will
simply log a warning to the console as before.  These settings give you some flexibility on how you want to go about fixing the
deprecations.

The code below is the deprecation-workflow file with the first deprecation set to throw an exception on occurrence.  The image demonstrates what
that deprecation looks like when you run your tests.

```javascript {data-filename= config/deprecation-workflow.js}
window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "throw", matchMessage: "Ember.Handlebars.registerHelper is deprecated, please refactor to Ember.Helper.helper." },
    { handler: "silence", matchMessage: "`lookup` was called on a Registry. The `initializer` API no longer receives a container, and you should use an `instanceInitializer` to look up objects from the container." },
    { handler: "silence", matchMessage: "Using `Ember.HTMLBars.makeBoundHelper` is deprecated. Please refactor to using `Ember.Helper` or `Ember.Helper.helper`." },
    { handler: "silence", matchMessage: /Accessing 'template' in .* is deprecated. To determine if a block was specified to .* please use '{{#if hasBlock}}' in the components layout./ }
  ]
};
```
<img width="675px" src="/images/guides/configuring-ember/handling-deprecations/failed-test-from-deprecation.png"/>


### 3. Fix and Repeat
After fixing a deprecation and getting your scenarios working again, you might want to leave the deprecation message in the workflow file with the
throw handler enabled.  This will ensure you haven't missed anything, and ensure no new deprecated calls of that type are introduced to your project.
Next, it's just a matter of going down the list, updating the handler, and fixing each remaining deprecation.

In the end, your deprecations can be fully turned on as "throw" and you should be able to use your application without error.  At this point, you can
go ahead and update your Ember version!  When you upgrade, be sure you remove the deprecations you've fixed from the deprecation workflow file,
so that you can start the process over for the next release.

## Silencing Deprecation Warnings During Compile

As you upgrade between releases, you might also notice that your terminal log begins to stream template-related deprecation warnings during the compile process, making
it difficult to review your compilation logs.

<img width="675px" src="/images/guides/configuring-ember/handling-deprecations/compile-deprecations.png" title="Compile Deprecations Clouding Log"/>

If you are using the deprecation workflow process above, you will likely prefer to gather these warnings during runtime execution instead.  The way to hide these
warnings during compile is to install the [ember-cli-template-lint](http://emberobserver.com/addons/ember-cli-template-lint) addon.  It suppresses
template deprecation warnings during compile in favor of showing them in the browser console during test suite execution or application usage.

## Deprecation Handling in Ember Inspector

Ember Inspector also provides deprecation handling capability.  It can work complimentary to ember-cli-deprecation-workflow.  As you unsilence deprecations to
fix them, the inspector can allow you to more quickly find where in your code a deprecation occurs when you run into it at runtime, reducing the amount of
stack trace browsing you have to do.  For more information on using deprecation handling in Ember Inspector, see its [guides section](../../ember-inspector/deprecations/).


---

While Ember gives you strong defaults so that you might never need to configure anything, it still supports configuring your app if you need to! Ember CLI ships with support for managing your application's environment. The runtime environment for the application is defined in `config/environment.js`. Here an object `ENV` is built for each of the three Ember CLI-supported build modes: development, test, and production.

Three notable properties on the `ENV` object are:

- `EmberENV` can be used to define Ember feature flags (see the [Feature Flags guide](./feature-flags/)) to be enabled at runtime.
- `APP` can be used to pass flags or options to the app's `Application` instance.
- `environment` by default contains which of the build environments was selected at build time (`development`, `test`, or `production`).

The `ENV` object is defined at build time, but you can access the `ENV` object
in application code via import from `your-application-name/config/environment`.

For example:

```javascript
import ENV from 'your-application-name/config/environment';

if (ENV.environment === 'development') {
  // ...
}
```

<!-- eof - needed for pages that end in a code block  -->


---

One of the ways that Ember releases guarantee stability is by following [Semantic Versioning](https://semver.org/) (SemVer).
For the Ember project this means that any feature that is to be removed must first be deprecated,
and only removed when a major version is released.
It also means that new features are introduced in a backwards compatible way.

To give the project a path forward when a breaking change is mandatory, we've released the [`@ember/optional-features`](https://github.com/emberjs/ember-optional-features) addon.

This addon does nothing by default, but provides a command-line interface to enable and disable breaking changes in Ember.

## Installation

To get started with optional features, you must install the addon:

```bash
ember install @ember/optional-features
```

This will make three new commands available to Ember CLI within your project, `feature:list`, `feature:enable`, and `feature:disable`.

## Listing features

The optional features available to your project will depend on the Ember version your project is using.

To see which optional features are available, you can run the following command:

```bash
$ ember feature:list
Usage:

  To list all available features, run ember feature:list.
  To enable a feature, run ember feature:enable some-feature.
  To disable a feature, run ember feature:disable some-feature.

Available features:

  no-implicit-route-model (Default: true)
    Removes the default record loading behavior on Ember's Route.
    More information: https://rfcs.emberjs.com/id/0774-implicit-record-route-loading
```

## Features

Once you see a feature that you would like to toggle for your project you can run one of two commands, `ember feature:enable <feature>` and `ember feature:disable <feature>`.

Let us disable an optional feature to see what happens. Substitute `some-example-feature`
for a real feature name when you run this command.

```bash
$ ember feature:disable no-implicit-route-model
Disabled no-implicit-route-model. Be sure to commit config/optional-features.json to source control!
```

As we can see from the warning, `@ember/optional-features` has created a file in `config/optional-features.json` to store the configuration for your project.
We commit it to our repository and we are off to the races!

### no-implicit-route-model

This feature is related to esoteric features of route model loading that you likely do not use, or know exist, and [have been deprecated](https://deprecations.emberjs.com/id/deprecate-implicit-route-model/) in `5.3.0`. They are due to be removed in `6.0.0`. To clear the deprecation, you can enable this feature.

With this feature disabled, Ember will automatically load a route's model if the `model` hook has not been implemented. In this case, Ember will attempt to try a few things before rendering this route's template.

1. If there is a `store` property on your route, it will attempt to call its `find` method. Assuming you have ember-data installed, you may be expecting this. The arguments will be extracted from the params. For example, if a dynamic segment is `:post_id`, there exists logic to split on the underscore and find a record of type post.

2. As a fallback, it will attempt to define a `find` method and use your Model instance's `find` method to fetch. If a Model cannot be found or if the found Model does not have a find method, an assertion is thrown.

Enabling this optional feature will remove this implicit model loading behavior and leave it to you to implement if and when you need it.



---

The Ember router has four options to manage your application's URL:  `history`,
which uses the HTML5 History API; `hash`, which uses anchor-based URLs; `auto`,
which uses `history` if supported by the user's browser, and falls back to
`hash` otherwise; and `none`, which doesn't update the URL. By default, Ember
CLI configures the router to use `history`. You can change this option in
`config/environment.js` under `ENV.locationType`.

## history

When using `history`, Ember uses the browser's
[history](http://caniuse.com/history) API to produce URLs with a structure like
`/posts/new`.

Given the following router, entering `/posts/new` will take you to the `posts.new`
route.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts', function() {
    this.route('new');
  });
});
```

Keep in mind that your server must serve the Ember app from all the URLs defined in your
`Router.map` function. In other words, if your user directly navigates to
`/posts/new`, your server must be configured to serve your Ember app in
response.

## hash

The `hash` option uses the URL's anchor to load the starting state of your
application and will keep it in sync as you move around. At present, this relies
on a [hashchange](http://caniuse.com/hashchange) event existing in the browser.

In the router example above, entering `/#/posts/new` will take you to the `posts.new`
route.

## none

Finally, if you don't want the browser's URL to interact with your application
at all, you can disable the location API entirely by setting `ENV.locationType`
to `none`. This is useful for
testing, or when you don't want Ember to muck with the URL (for example when you embed your
application in a larger page).


---

Anyone can participate in adding new features to Ember. This guide will
provide some background information for developers who want to
contribute to the core [`ember.js` codebase](https://github.com/emberjs/ember.js).

## RFCs

New features begin as RFCs (Request for Comments).
The RFC process is how community members and core team members
propose changes, such as adding new features or
making deprecations.

For more information about the RFC Process, including seeing the status of
existing RFCs, learning how to write your own RFC, giving feedback to proposed RFCs,
and how to help move accepted RFCs to full completion, visit the
[RFCs Website](https://rfcs.emberjs.com).

## Background information

Here are some tips for working in the [`ember.js` repository](https://github.com/emberjs/ember.js).

To learn how to make a pull request, review the
[`CONTRIBUTING.md`](https://github.com/emberjs/ember.js/blob/master/CONTRIBUTING.md)
instructions.

In general, new feature development should be done on the `master` branch.

Bugfixes should not introduce new APIs or break existing APIs, and do
not need feature flags.

Features can introduce new APIs, and need feature flags. They should not
be applied to the release or beta branches, since SemVer requires
bumping the minor version to introduce new features.

Security fixes should not introduce new APIs, but may, if strictly
necessary, break existing APIs. Such breakages should be as limited as
possible.

## Bug Fixes

### Urgent Bug Fixes

Urgent bugfixes are bugfixes that need to be applied to the existing
release branch. If possible, they should be made on master and prefixed
with `[BUGFIX release]`.

### Beta Bug Fixes

Beta bugfixes are bugfixes that need to be applied to the beta branch.
If possible, they should be made on master and tagged with `[BUGFIX
beta]`.

### Security Fixes

Security fixes need to be applied to the beta branch, the current
release branch, and the previous tag. If possible, they should be made
on master and tagged with `[SECURITY]`.

## Features

Features must always be wrapped in a feature flag. Tests for the feature
must also be wrapped in a feature flag.

Because the build-tools will process feature-flags, flags must use
precisely this format. We are choosing conditionals rather than a block
form because functions change the surrounding scope and may introduce
problems with early return.

```javascript
if (Ember.FEATURES.isEnabled("feature")) {
  // implementation
}
```

Tests will always run with all features on, so make sure that any tests
for the feature are passing against the current state of the feature.

### Commits

Commits related to a specific feature should include  a prefix like
`[FEATURE htmlbars]`. This will allow us to quickly identify all commits
for a specific feature in the future. Features will never be applied to
beta or release branches. Once a beta or release branch has been cut, it
contains all of the new features it will ever have.

If a feature has made it into beta or release, and you make a commit to
master that fixes a bug in the feature, treat it like a bugfix as
described above.

### Feature Naming Conventions

```javascript {data-filename=config/environment.js}
Ember.FEATURES['<packageName>-<feature>'] // if package specific
Ember.FEATURES['container-factory-injections']
Ember.FEATURES['htmlbars']
```

## Builds

The Canary build, which is based off master, will include all features,
guarded by the conditionals in the original source. This means that
users of the canary build can enable whatever features they want by
enabling them before creating their Ember.Application.

```javascript {data-filename=config/environment.js}
module.exports = function(environment) {
  let ENV = {
    EmberENV: {
      FEATURES: {
        htmlbars: true
      }
    },
  }
}
```

### `features.json`

The root of the repository will contain a `features.json` file, which will
contain a list of features that should be enabled for beta or release
builds.

This file is populated when branching, and may not gain additional
features after the original branch. It may remove features.

```javascript
{
  "htmlbars": true
}
```

The build process will remove any features not included in the list, and
remove the conditionals for features in the list.

### Continuous Integration Tests

For a new PR:

1. Tests will run against master with all feature flags on.
2. If a commit is tagged with `[BUGFIX beta]`, the commit will be
   cherry-picked into beta, and the automated tests will be executed on that
   branch. If the commit doesn't apply cleanly or the tests fail, the
   build will fail.
3. If a commit is tagged with `[BUGFIX release]`, the commit will be cherry-picked
   into release, and the tests will be executed on the release branch. If the commit
   doesn't apply cleanly or the tests fail, the build will fail.

For a new commit to master:

1. Tests will be executed as described above.
2. If the build passes, the commits will be cherry-picked into the
   appropriate branches.

The idea is that new commits should be submitted as PRs to ensure they
apply cleanly when a PR is merged.

### Go/No-Go Process

Every six weeks, the core team goes through the following process.

#### Beta Branch

All remaining features on the beta branch are vetted for readiness. If
any feature isn't ready, it is removed from `features.json`.

Once this is done, the beta branch is tagged and merged into release.

#### Master Branch

All features on the master branch are vetted for readiness. In order for
a feature to be considered "ready" at this stage, it must be ready as-is
with no blockers. Features are a no-go even if they are close and
additional work on the beta branch would make it ready.

Because this process happens every six weeks, there will be another
opportunity for a feature to make it soon enough.

Once this is done, the master branch is merged into beta. A
`features.json` file is added with the features that are ready.

### Beta Releases

Every week, we repeat the Go/No-Go process for the features that remain
on the beta branch. Any feature that has become unready is removed from
the `features.json`.

Once this is done, a Beta release is tagged and pushed.


---

Ember is an open source project that succeeds thanks to the help of volunteers. Community members at any level are invited to help out with anything from bug reports to documentation. This guide will give you some tips on how to get started and where to ask for help if you want to get involved. Thanks in advance for your help!

## Types of contributions

Any change that aims to make an improvement is very welcome!

You can create issues to document many things (list is not exhaustive!):

- Bugs
- Ideas for enhancements
- Code quality (e.g. refactoring)
- Improving the documentation (clarifying, rephrasing, providing more examples, fixing typos, adding missing details)

Creating an issue is a great way to start a discussion and gather opinions of other members of the Ember community. Once a decision has been made, you or someone else can volunteer to work on it, and create a pull request with their work.

Apart from creating new issues and pull requests, another way to contribute is comment on existing issues and pull requests. The more reviewers we get for something, the lower the chance we'll overlook potential problems.

## Where to get started

A great place to start is helping improve something you personally ran into. E.g. if you found some of the documentation unclear yourself, please create an issue to highlight it, and optionally suggest how to simplify it.

Have a look at the [list of main repositories](repositories) to learn about the different components of the Ember project.

If you need some inspiration, you can check out the [Help Wanted](https://help-wanted.emberjs.com/) dashboard to browse for issues. If you are a beginner, look out for issues with the "Help wanted" and "Good first issue" labels.

## Updating the API Guides

In the [API Guides](https://api.emberjs.com/ember/release), suppose you found a typo or wish to provide more details for a package, method, or class. Here is how you can make a change.

At the top of the page (for the package, method, or class), you will find the words "Defined in" or "Inherited from". Next to these words is a link to the source code on GitHub.

You can open the link to find a comment block. Make a pull request to update the comment block. The API Guides may take a few weeks to update while the future release is finalized.

Here is an example of updating a method. At the top of the section for [`store.createRecord()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/createRecord?anchor=createRecord), you can find the words "Defined in."

Next to the words is, once again, the link to the source code [`ds-model-store.ts`](https://github.com/emberjs/data/blob/master/packages/store/addon/-private/system/ds-model-store.ts).

Please follow the contributing guide in the specific repo. (Here is an example of the [contributing guide for Ember.js](https://github.com/emberjs/ember.js/blob/master/CONTRIBUTING.md).)
The contributing guide may further describe how you can edit files, commit messages, and run linting and testing.

## Asking for help

Please comment directly on issues and PRs if you need help. This way others will see and can chime in to help.
You can also visit the [Ember.js Community Page](https://emberjs.com/community) to join the Ember.js Discord server. Channels that start with `dev` are for contributors working on the corresponding projects, and they are a great place for questions.

## In conclusion

We would like to reiterate once again - anyone at any skill level can help out! If you have any ideas to improve anything whatsoever, we would love to see your contribution!


---

Ember is made up of several libraries. If you wish to add a feature or fix a bug please file a pull request against the appropriate repository. Be sure to check the libraries listed below before making changes in the Ember repository.

## Main Repositories
**Ember.js** - The main repository for Ember.

* [https://github.com/emberjs/ember.js](https://github.com/emberjs/ember.js)

**Ember CLI** - The command line utility for Ember.

* [https://github.com/ember-cli/ember-cli](https://github.com/ember-cli/ember-cli)

**EmberData** - A data persistence library for Ember.

* [https://github.com/emberjs/data](https://github.com/emberjs/data)

**Ember Website** - Source for [http://emberjs.com](http://emberjs.com)

* [https://github.com/emberjs/website](https://github.com/emberjs/website)

**Ember Deprecations** - Source for [https://deprecations.emberjs.com](https://deprecations.emberjs.com)
* [https://github.com/ember-learn/deprecation-app](https://github.com/ember-learn/deprecation-app)

**Ember Guides** - Source for [http://guides.emberjs.com](http://guides.emberjs.com) which you are currently reading.
* [https://github.com/ember-learn/guides-source](https://github.com/ember-learn/guides-source)
* [https://github.com/ember-learn/cli-guides](https://github.com/ember-learn/cli-guides)

**Help Wanted Issues**
* [https://help-wanted.emberjs.com/](https://help-wanted.emberjs.com/)

**Community**
* [https://emberjs.com/community](https://emberjs.com/community)

## Libraries Used By Ember

These libraries are part of the Ember asset output, but development of them takes place in a separate repository.

## `Backburner`
* **backburner.js** - Implements the Ember run loop.
* [https://github.com/ebryn/backburner.js](https://github.com/ebryn/backburner.js)

## `DAG Map`
* **dag-map** - A directed acyclic graph data structure for JavaScript
* [https://github.com/krisselden/dag-map](https://github.com/krisselden/dag-map)

## `Glimmer 2`
* **glimmer** - Implements the really fast rendering engine now included in Ember
* [https://github.com/glimmerjs/glimmer.js](https://github.com/glimmerjs/glimmer.js)


## `HTMLBars`
* **htmlbars** - The syntax for templating most often used with Ember
* [https://github.com/ember-cli/ember-cli-htmlbars](https://github.com/ember-cli/ember-cli-htmlbars)

## `Route Recognizer`

* **route-recognizer** - A lightweight JavaScript library that matches paths against registered routes.
* [https://github.com/tildeio/route-recognizer](https://github.com/tildeio/route-recognizer)

## `router.js`

* **router.js** - A lightweight JavaScript library that builds on route-recognizer and RSVP to provide an API for handling routes.
* [https://github.com/tildeio/router.js](https://github.com/tildeio/router.js)

## `RSVP`

* **rsvp.js** - Implementation of the of Promises/A+ spec used by Ember.
* [https://github.com/tildeio/rsvp.js](https://github.com/tildeio/rsvp.js)

## Many different ways to contribute
There are many different ways to contribute to Ember in which you'll be able to learn more about the project along the way: For example, you can [write and share an Ember addon with the community](https://ember-cli.com/extending/#developing-addons-and-blueprints) or collaborate with the authors of your favorite addon to make it even better. You can share any of your experiences with Ember by blogging, screencasting or speaking about them at your [local Ember meetup group](https://www.emberjs.com/community/meetups/) or organizing local Ember events on your own. Helping to make Ember even better understood is in itself a great way to contribute to the community.



---

---
redirect: routing/controllers
---


---

The Components tab displays a collapsible representation of the views and components that are currently being rendered.  Selecting a component from the tree will open it in the [Object Inspector](../object-inspector/). 

<img src="/images/guides/ember-inspector/v4.3.4/component-tree-intro.png" width="680">

Components will be displayed as custom elements with angle brackets.

### Scrolling to a Component in the Browser

Clicking the 'markup tag' icon to the right of a component will scroll that component into view in the browser.

<img src="/images/guides/ember-inspector/v4.3.4/component-tree-scroll.png" width="333">

### Expanding and Collapsing Components

Components can have their children hidden and shown by clicking the caret just to the left of the component.

The two icons to the left of the search field will expand or collapse all components.

<img src="/images/guides/ember-inspector/component-tree-toolbar-expand.png" width="680">

### Filtering Components

By typing in the search field you can limit the components that are shown in the tree.

<img src="/images/guides/ember-inspector/v4.3.4/component-tree-filtering.png" width="680">

### Highlighting Templates

#### Hovering over the Component Tree

When you hover over the items in the Component Tree, the related component will be
highlighted in your app. For every highlighted component, you can see the
template name and its associated objects.

<img src="/images/guides/ember-inspector/v4.3.4/component-tree-hover.png" width="680">

#### Hovering over the app

If you want to highlight a component directly within your app, click on the icon to the left of the search bar. As your mouse passes over it, the related component will be
highlighted.

<img src="/images/guides/ember-inspector/component-tree-toolbar-inspect.png" width="500">


If you click on a highlighted template or component, the Inspector will select it. You can then
click on the backing objects to send them to the object inspector.

<img src="/images/guides/ember-inspector/v4.3.4/component-tree-inspect.png">

Click on the `X` button to deselect a template.



---

Every Ember application has a container that maintains object instances for you. You can
inspect these instances using the Container tab. This is useful for objects
that don't fall under a dedicated menu, such as services.

<img src="/images/guides/ember-inspector/v4.3.4/container-screenshot.png" width="680"/>

Click on the Container tab, and you will see a list of instances the container is holding. Click on a type to see the list of all instances of that type maintained by the container.

### Inspecting Instances

Click on a row to inspect a given instance using the Object Inspector.

<img src="/images/guides/ember-inspector/v4.3.4/container-object-inspector.png" width="400"/>

### Filter and Reload

You can reload the container tab by clicking on the reload icon. To search for instances, type a query in the search box.

<img src="/images/guides/ember-inspector/v4.3.4/container-toolbar.png" width="400"/>


---

You can inspect your models by clicking on the `Data` tab. Check out [Building a Data Custom Adapter](#toc_building-a-data-custom-adapter) below if you maintain your own persistence library. When you open the Data tab, you will see a list of model types defined
in your application, along with the number of loaded records.
The Inspector displays the loaded records when you click on a model type.

<img src="/images/guides/ember-inspector/v4.3.4/data-screenshot.png" width="680"/>

### Inspecting Records

Each row in the list corresponds to one record. The first four model attributes are shown in the list view. Clicking on the record will open the Object Inspector for that record, and display all attributes.

<img src="/images/guides/ember-inspector/v4.3.4/data-object-inspector.png"
width="680"/>

### Record States and Filtering

The Data tab is kept in sync with the data loaded in your application.
Any record additions, deletions, or changes are reflected immediately. If you have unsaved
records, they will be displayed in green by clicking on the New pill.

<img src="/images/guides/ember-inspector/v4.3.4/data-new-records.png"
width="680"/>

Click on the Modified pill to display unsaved record modifications.

<img src="/images/guides/ember-inspector/v4.3.4/data-modified-records.png"
width="680"/>

You can also filter records by entering a query in the search box.

### Building a Data Custom Adapter

You can use your own data persistence library with the Inspector. Build a [data adapter](https://github.com/emberjs/ember.js/blob/3ac2fdb0b7373cbe9f3100bdb9035dd87a849f64/packages/ember-extension-support/lib/data_adapter.js), and you can inspect your models
using the Data tab. Use [EmberData's data adapter](https://github.com/emberjs/data/blob/d7988679590bff63f4d92c4b5ecab173bd624ebb/packages/ember-data/lib/system/debug/debug_adapter.js) as an example for how to build your data adapter and [DataAdapter](https://api.emberjs.com/ember/release/classes/DataAdapter) documentation.


---

As part of making your app upgrades as smooth as possible, the Inspector gathers your deprecations, groups them, and displays them in a
way that helps you fix them.

To view the list of deprecations in an app, click on the `Deprecations` menu.

<img src="/images/guides/ember-inspector/v4.3.4/deprecations-screenshot.png" width="680"/>

You can see the total number of deprecations next to the `Deprecations` menu.
You can also see the number of occurrences for each deprecation.

### Ember CLI Deprecation Sources

If you are using Ember CLI and have source maps enabled, you can see a
list of sources for each deprecation. If you are using Chrome or Firefox,
clicking on the source opens the sources panel and takes you to
the code that caused the deprecation message to be displayed.

<img src="/images/guides/ember-inspector/v4.3.4/deprecations-sources-panel.png" width="680"/>

You can send the deprecation message's stack trace to the
console by clicking on `Trace in the console`.


### Transition Plans

Click on the "Transition Plan" link for information on how to remove the deprecation warning, and you'll be taken to a helpful deprecation guide on the Ember website.

<img src="/images/guides/ember-inspector/v4.3.4/deprecations-transition-plan.png" width="680" />


### Filtering and Clearing

You can filter the deprecations by typing a query in the search box.
You can also clear the current deprecations by clicking on the clear icon
at the top.

<img src="/images/guides/ember-inspector/v4.3.4/deprecations-toolbar.png"
width="675"/>


---

The Ember Inspector is a browser add-on designed to help you understand and debug your Ember applications. You can install it on [Google Chrome](installation/#toc_google-chrome), [Firefox](installation/#toc_firefox) and [other browsers](installation/#toc_via-bookmarklet) (via a bookmarklet)

Here's a brief video showcasing some of the features of the Inspector:

<div class="video">
  <iframe src="https://www.youtube.com/embed/9TMaFhYwC6g?showinfo=0" frameborder="0" allowfullscreen></iframe>
</div>


---

To see a list of libraries used in your application, click on the `Info` menu. This view displays the libraries used, along with their version.

<img src="/images/guides/ember-inspector/v4.3.4/info-screenshot.png" width="680"/>

### Registering a Library

If you would like to add your own application or library to the list, you can register it using:

```javascript
Ember.libraries.register(libraryName, libraryVersion);
```

#### Ember CLI

If you're using the [ember-cli-app-version](https://github.com/embersherpa/ember-cli-app-version) addon, your application's name and version will be added to the list automatically.


---

You can install the Inspector on Google Chrome, Firefox, other
browsers (via a bookmarklet), and on mobile devices by following the steps below.

### Google Chrome

You can install the Inspector on Google Chrome as a new Developer
Tool. To begin, visit the Extension page on the [Chrome Web Store](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi).

Click on "Add To Chrome":

<img src="/images/guides/ember-inspector/v4.3.4/installation-chrome-store.png" width="680" />

Once installed, go to an Ember application, open the Developer Tools,
and click on the `Ember` tab at the far right.

<img src="/images/guides/ember-inspector/v4.3.4/installation-chrome-panel.png" width="680">

#### File:// protocol

To use the Inspector with the `file://` protocol, visit `chrome://extensions` in Chrome and check the "Allow access to file URLs" checkbox:

<img src="/images/guides/ember-inspector/v4.3.4/installation-chrome-file-urls.png" width="680">

#### Enable Ember Favicon

You can configure an Ember favicon to show up in Chrome's URL bar whenever you are visiting a site that uses Ember.

Visit `chrome://extensions`, then click on `Options`.

<img src="/images/guides/ember-inspector/v4.3.4/installation-chrome-tomster.png" width="680">

Make sure the "Display the Ember favicon when a site runs Ember.js" checkbox is checked.

<img src="/images/guides/ember-inspector/v4.3.4/installation-chrome-tomster-checkbox.png" width="680">


### Firefox

Visit the Add-on page on the [Mozilla Addons
site](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/).

Click on "Add to Firefox".

<img src="/images/guides/ember-inspector/v4.3.4/installation-firefox-store.png" width="680">

Once installed, go to an Ember application, open the Developer Tools,
and click on the `Ember` tab.

<img src="/images/guides/ember-inspector/v4.3.4/installation-firefox-panel.png" width="680">

#### Enable Ember Favicon

To enable the Ember favicon to show up in the URL bar whenever you are
visiting a site that uses Ember visit `about:addons`.

Click on `Extensions` -> `Preferences`.

<img src="/images/guides/ember-inspector/v4.3.4/installation-firefox-preferences.png" width="680">

Then make sure the "Display the Ember favicon when a site runs Ember.js" checkbox is checked.

<img src="/images/guides/ember-inspector/v4.3.4/installation-firefox-tomster-checkbox.png" width="680">


### Via Bookmarklet

If you are using a browser other than Chrome or Firefox, you can use the
bookmarklet option to use the Inspector.

Add the following bookmark:

<a href="javascript: (function() { var s = document.createElement('script'); s.src = '//ember-extension.s3.amazonaws.com/dist_bookmarklet/load_inspector.js'; document.body.appendChild(s); }());">Bookmark Me</a>

To open the Inspector, click on the new bookmark. Safari blocks popups by default, so you'll need to enable popups before using the bookmarklet.

### Mobile Devices

If you want to run the Inspector on a mobile device,
you can use the [Ember CLI Remote Inspector](https://github.com/joostdevries/ember-cli-remote-inspector) addon.


---

The Inspector includes a panel that allows you to view and interact with your Ember objects.
To open it, click on any Ember object. You can then view the object's properties.


### Viewing Objects

Here's what you see when you click on an object:

<img src="/images/guides/ember-inspector/v4.3.4/object-inspector-controller.png" width="450">

The Inspector displays the parent objects and mixins that are composed into the chosen object, including the inherited properties.

Each property value in this view is bound to your application, so if the value of a
property updates in your app, it will be reflected in the Inspector.

Note, each property is preceded by a letter icon to help you distinguish its type. For example, the letter G for a getter and the letter T for a tracked property. You can hover over the letter icon to learn more about the property.


### Exposing Objects to the Console

#### Sending from the Inspector to the Console

You can expose objects to the console by clicking on the `$E` button within the Inspector.
This will set the global `$E` variable to the chosen object.

<img src="/images/guides/ember-inspector/v4.3.4/object-inspector-$E.png"
width="450">

You can also expose properties to the console. When you hover over an object's properties, a `$E` button will appear
next to every property. Click on it to expose the property's value to the
console.

<img src="/images/guides/ember-inspector/v4.3.4/object-inspector-property-$E.png" width="450">


#### Sending from the Console to the Inspector

You can send Ember objects and arrays to the Inspector by using
`EmberInspector.inspect` within the console.

```javascript
let object = Ember.Object.create();
EmberInspector.inspect(object);
```

Make sure the Inspector is active when you call this method.



### Editing Properties

You can edit `String`, `Number`, and `Boolean` properties in the Inspector.
Your changes will be reflected immediately in your app. Click on a property's value to start editing it.

<img src="/images/guides/ember-inspector/v4.3.4/object-inspector-edit.png"
width="450">

Edit the property and press the `ENTER` key to commit the change, or `ESC` to cancel.

### Navigating the Inspector

In addition to inspecting the properties above, you can inspect properties that hold Ember objects or arrays.
Click on the property's value to inspect it.

<img src="/images/guides/ember-inspector/v4.3.4/object-inspector-object-property.png" width="450">

You can continue drill into the Inspector as long as properties contain either an
Ember object or an array.
In the image below, we clicked on the `model` property first, then clicked
on the `store` property.

<img src="/images/guides/ember-inspector/v4.3.4/object-inspector-nested-objects.png" width="450">

You can see the path to the current object at the top of the
Inspector. You can go back to the previous object by clicking on the
left-facing arrow at the top left.

### Custom Property Grouping

Some properties are not only grouped by inheritance, but also
by framework level semantics. For example, if you inspect an EmberData
model, you can see `Attributes`, `Belongs To`, `Has Many`, and `Flags`
groups.

<img src="/images/guides/ember-inspector/v4.3.4/object-inspector-model.png"
width="450">

Library authors can customize how any object will display in the Inspector.
By defining a `_debugInfo` method, an object can tell the Inspector how it should be rendered.
For an example on how to customize an object's properties, see [EmberData's
customization](https://github.com/emberjs/data/blob/f1be2af71d7402d034bc034d9502733647cad295/packages/ember-data/lib/system/debug/debug_info.js).


---

The Inspector provides a way to look at all Promises created
in your application. Click on the `Promises` menu to start inspecting them.


<img src="/images/guides/ember-inspector/v4.3.4/promises-screenshot.png" width="680" />

You can see a hierarchical list of Promises with labels describing each
Promise, its state, its settled value, and the time it took to
settle.


### Promise States and Filtering

Promises have different colors based on their state.

<img src="/images/guides/ember-inspector/promises-fulfilled.png" width="300"/>

<img src="/images/guides/ember-inspector/promises-pending.png" width="300"/>

<img src="/images/guides/ember-inspector/promises-rejected.png" width="300"/>

You can filter by clicking on the following pills: `Rejected`, `Pending`, `Fulfilled`.

<img src="/images/guides/ember-inspector/v4.3.4/promises-toolbar.png" width="600"/>

You can also search for Promises by typing a query in the search box.

To clear the currently logged Promises, click on the clear icon on the
top left of the tab.

### Inspecting Settled Values

If the fulfillment value of a Promise is an Ember object or an array, you can click
on that object to open it in the Object Inspector.

<img src="/images/guides/ember-inspector/promises-object-inspector.png" width="400"/>

If the rejection value is an `Error` object, you can send its stack trace to
the console.

<img src="/images/guides/ember-inspector/promises-error.png" width="400"/>

You can also click on the `$E` button to send the value to the console.

### Tracing

The Inspector provides a way to view a Promise's stack trace.
Tracing Promises is disabled by default for performance reasons. To
enable tracing, check the `Trace promise` checkbox. You may want to
reload to trace existing Promises.

<img src="/images/guides/ember-inspector/v4.3.4/promises-trace-checkbox.png"
width="680"/>

To trace a Promise, click on the `Trace` button next to the label,
which will send the Promise stack trace to the console.

<img src="/images/guides/ember-inspector/promises-trace.png" width="300"/>

### Labeling Promises

Promises generated by Ember are all labeled by default.
You can also label your own RSVP Promises to find them in the Inspector's Promises tab.
All RSVP methods can take a label as the final argument.

```javascript

let label = 'Find Posts'

new RSVP.Promise(method, label);

RSVP.Promise.resolve(value, label);

RSVP.Promise.reject(reason, label);

RSVP.Promise.all(array, label);

RSVP.Promise.hash(hash, label);

promise.then(success, failure, label);

promise.catch(callback, label);

promise.finally(callback, label);

```

<!-- eof - needed for pages that end in a code block  -->


---

You can use the Inspector to measure your app's render times. Click on `Render Performance` to start inspecting render times.

<img src="/images/guides/ember-inspector/v4.3.4/render-performance-screenshot.png" width="680"/>

### Accuracy

Using the Inspector adds a delay to your rendering, so the durations you see
are not an accurate representation of the speed of your production apps. Use these
times to compare durations and debug rendering bottlenecks, but not as
a way to accurately measure rendering times.

### Toolbar

Click on the "clear" icon to remove existing render logs.

To measure components and templates that are rendered on initial application boot,
click on the "Reload" button at the top. This button ensures that the Inspector starts
measuring render times when your app boots.

To filter the logs, type a query in the search box.


---

The Routes tab displays a list of your application's routes.

For the following code:

```javascript
this.route('posts', function() {
  this.route('new');
});
```

The Inspector displays these routes:

<img src="/images/guides/ember-inspector/v4.3.4/routes-screenshot.png" width="680"/>

As you can see, the Inspector shows the routes you defined as well as the routes
automatically generated by Ember.

### Viewing the Current Route

The Inspector highlights the currently active routes. However, if your app has grown too large for this to be useful, you can use the `Current Route Only`
checkbox to hide all routes except the currently active ones.

<img src="/images/guides/ember-inspector/v4.3.4/routes-current-route.png"
width="680"/>


---

Below are some common issues you may encounter when using the Inspector, along with the
necessary steps to solve them. If your issue is not listed below, please submit an
issue to the Inspector's [GitHub repo](https://github.com/emberjs/ember-inspector).

### Ember Application Not Detected

If the Inspector cannot detect an Ember application, you will see
the following message:

<img
src="/images/guides/ember-inspector/troubleshooting-application-not-detected.png" width="350">

Some of the reasons this may happen:

- This is not an Ember application
- You are using an old Ember version ( < 1.0 ).
- You are using a protocol other than HTTP or HTTPS. For file:// protocol,
follow [these steps](../installation/#toc_file-protocol).
- The Ember application is inside a sandboxed iframe with no URL (if you
  are using JS Bin, follow [these steps](#toc_using-the-inspector-with-js-bin).

### Using the Inspector with JS Bin

Due to the way JS Bin uses iframes, the Inspector doesn't work with edit
mode. To use the Inspector with JS Bin, switch to the "live preview" mode by clicking on
the arrow circled below.

<img src="/images/guides/ember-inspector/troubleshooting-jsbin.png" width="350">

### Application is not Detected Without Reload

If you always have to reload your application after you open the Inspector, that may mean
the application's booted state is corrupt. This happens if you call `advanceReadiness` or
`deferReadiness` after the application has already booted.

### Data Adapter Not Detected

When you click on the Data tab, and see this message:

<img src="/images/guides/ember-inspector/troubleshooting-data-adapter.png" width="350">

It means that the data persistence library you're using does not support the Inspector.
If you are the library's author, [see this section](../data/#toc_building-a-data-custom-adapter) on how to add Inspector support to your library.

### Promises Not Detected

You click on the Promises tab, and see this message:

<img src="/images/guides/ember-inspector/troubleshooting-promises-not-detected.png" width="350">

This happens if you are using a version of Ember < 1.3.

#### Missing Promises

If the Promises tab is working, but there are Promises you can't find,
it's probably because these Promises were created before the
Inspector was activated. To detect Promises the moment the app boots, click on the `Reload` button below:

<img src="/images/guides/ember-inspector/v4.3.4/troubleshooting-promises-toolbar.png" width="680">

#### Inspector Version Old on Firefox

Firefox addons need to go through a review process with each update, so the Inspector is usually one version behind.

Unfortunately we don't have control over the Firefox review process, so if you need
the latest Inspector version, download and install it manually from
[GitHub](https://github.com/emberjs/ember-inspector).


---

Before you start writing any Ember code, it's a good idea to get an overview of how an
Ember application works.

![ember core concepts](/images/ember-core-concepts/ember-core-concepts.svg)

## Router and Route Handlers

Imagine we are writing a web app for a site that lets users list their properties to rent. At any given time, we should be able to answer questions about the current state like _What rental are they looking at?_ and _Are they editing it?_ In Ember, the answer to these questions is determined by the URL.
The URL can be set in a few ways:

* The user loads the app for the first time.
* The user changes the URL manually, such as by clicking the back button or by editing the address bar.
* The user clicks a link within the app.
* Some other event in the app causes the URL to change.

No matter how the URL gets set, the first thing that happens is that the Ember router maps the URL to a route handler.

The route handler then typically does two things:

* It loads a model.
* It renders a template, which has access to the model.

## Models

Models represent persistent state.

For example, a property rentals application would want to save the details of
a rental when a user publishes it, and so a rental would have a model defining
its details, perhaps called the _rental_ model. You may also need a _user_
model to keep track of who is currently logged in.

A model typically persists information to a web server, although models can be
configured to save to anywhere else, such as the browser's Local Storage.

By default new Ember apps include [EmberData](../../models/), which is a
separate data library that integrates with Ember and provides a solid,
conventional model layer. We'll see EmberData in action in the tutorial in
the next section.

You can also provide your own model layer using other data libraries such as
[Redux](https://github.com/ember-redux/ember-redux) or
[Apollo](https://github.com/ember-graphql/ember-apollo-client), or create your
own model layer using the tools that Ember provides for state, such as
[autotracking](../../components/component-state-and-actions/). We'll learn more
about these tools throughout the guides.

## Templates

Ember uses templates to build up the user interface in an application.

If you have written HTML before, you already know how to write a basic Ember
template. For example:

```handlebars {data-filename="app/templates/welcome.hbs"}
<div>Hi, this is a valid Ember template!</div>
```

In addition to static HTML content, Ember uses the syntax of [Handlebars](http://handlebarsjs.com)
to describe dynamic user interface elements.

For example, as mentioned before, the route handler makes the model available
to its template:

```handlebars {data-filename="app/templates/welcome.hbs"}
{{!-- The model for this route is the current user --}}

<div>
  Hi <img src="{{@model.profileImage}}" alt="{{@model.name}}'s profile picture"> {{@model.name}},
  this is a valid Ember template!
</div>

{{#if @model.isAdmin}}
  <div>Remember, with great power comes great responsibility!</div>
{{/if}}
```

This example combines several Handlebars features to create a personalized
experience for the user, something we couldn't do with just static HTML alone.
We used the comment syntax (`{{!-- ... --}}`) to leave a note for future
developers, the double curly braces syntax (`{{...}}`) to include dynamic
values, as well as using the `{{#if}}...{{/if}}` syntax to conditionally render
some extra content.

We will go into more details about each of these template features later on in
this guide.

## Components

Components allow you to break up your templates and organize them into small,
self-contained and reusable pieces.

In its most basic form, a component is just a piece of template that can be
referred to by name. Similar to functions in programming languages, they can
also take _arguments_, allowing them to be customized to the specific context
they are being rendered into.

For example, the example in the previous section is getting a bit long. We can
_extract_ the snippet for rendering the user's name and profile picture into
its own component:

```handlebars {data-filename="app/components/user-profile.hbs"}
<img src="{{@user.profileImage}}" alt="{{@user.name}}'s profile picture"> {{@user.name}}
```

Doing this allows us to simplify the original template like so:

```handlebars {data-filename="app/templates/welcome.hbs"}
{{!-- The model for this route is the current user --}}

<div>
  Hi <UserProfile @user={{@model}} /> this is a valid Ember template!
</div>

{{#if @model.isAdmin}}
  <div>Remember, with great power comes great responsibility!</div>
{{/if}}
```

Not only did we clean up the original template to be more readable, we now
have a `<UserProfile>` component that we can reuse whenever we need to render
information about a given user.

You can think of components as Ember's way for letting you create your own HTML
tags. In addition to rendering content, components can also have JavaScript
code associated with them, allowing you to add _behavior_, such as responding
to a user clicking on your component.

We will cover these advanced component features in a later chapter. For now,
let's see these core concepts in action by building a property rental
application in the next lesson.


---

---
redirect: getting-started/anatomy-of-an-ember-app
---


---

## What is Ember?

Ember.js is a productive, battle-tested JavaScript framework for building modern web applications.
It includes everything you need to build rich UIs that work on any device. It does so by providing
developers many features that are essential to manage complexity in modern web applications,
as well as an integrated development toolkit that enables rapid iteration.

Some of these features that you'll learn about in the guides are:

* [Ember CLI](https://cli.emberjs.com/release/) - A robust development toolkit to create, develop, and build Ember applications. Learn [basic commands](https://cli.emberjs.com/release/basic-use/cli-commands/) from the CLI Guides.
* [Components](../components/) - The fundamental construct used in Ember applications, used to create reusable UI elements and define the layout and the functionality of the app.
* [Routing](../routing/) - A central part of an Ember application. Enables developers to drive the application state from the URL.
* [Services](../services/) - The way to store long-term state in your application and pass it around.
* [EmberData](../models/) - EmberData provides a consistent way to communicate with external APIs and manage application state
* [Ember Inspector](../ember-inspector/) - A browser extension, or bookmarklet, to inspect your application live. It's also useful for spotting Ember applications in the wild.

## Organization

On the left side of each Guides page is a table of contents,
organized into sections that can be expanded to show the topics
they cover. Both the sections and the topics within each section are
ordered from basic to advanced concepts.

The Guides are intended to contain practical explanations of how to
build Ember apps, focusing on the most widely-used features of Ember.js.
For comprehensive documentation of every Ember feature and API, see the
[Ember.js API documentation](https://api.emberjs.com/).

The Guides begin with an explanation of how to get started with Ember,
followed by a tutorial on how to build your first Ember app.
If you're brand new to Ember,
we recommend you start off by following along with these first two sections of the Guides.

## Assumptions

While we try to make the Guides as beginner-friendly as we can, we must
establish a baseline so that the guides can keep focused on Ember.js
functionality. We will try to link to appropriate documentation whenever a
concept is introduced.

To make the most out of the guides, you should have a working knowledge of
**HTML, CSS, and JavaScript** - the building blocks of web pages. You can find
out more about each of these technologies in the [Working with HTML, CSS, and JavaScript](./working-with-html-css-and-javascript)
guide, including some of the special features that Ember uses such as class
fields and decorators.

## Accessibility

If you are using a screen reader while you go through the Guides, we recommend using Firefox and NVDA or Safari and VoiceOver for the best experience.

## Reporting a problem

Typos, missing words, and code samples with errors are all considered
documentation bugs. If you spot one of them, or want to otherwise improve
the existing guides, we are happy to help you help us!

Some of the more common ways to report a problem with the guides are:

* Using the pencil icon on the top-right of each guide page
* Opening an issue or pull request to [the GitHub repository](https://github.com/ember-learn/guides-source/)

Clicking the pencil icon will bring you to GitHub's editor for that
guide so you can edit right away, using the Markdown markup language.
This is the fastest way to correct a typo, a missing word, or an error in
a code sample.

If you wish to make a more significant contribution be sure to check our
[issue tracker](https://github.com/ember-learn/guides-source/issues) to see if your issue is already being addressed. If you don't find an active issue, open a new one.

If you have any questions about styling or the contributing process, you
can check out our [contributing guide](https://github.com/ember-learn/guides-source/blob/master/CONTRIBUTING.md). If your question persists, reach us in the `#dev-ember-learning` channel on the [Ember Community Discord](https://discordapp.com/invite/zT3asNS).

Good luck!


---

---
redirect: getting-started/index
---


---

---
redirect: getting-started/working-with-html-css-and-javascript
---


---

Welcome to Ember! Follow this guide to build a simple web app using HTML, JavaScript, the command line, and some of Ember's best features.
Each step has code you can copy and paste directly or modify to make it your own.
Along the way, you will be introduced to the Ember community so that you know who to ask for help and how to continue your learning journey.

We'll cover these steps:

1. Installing Ember.
2. Creating a new application.
3. Defining a route.
4. Writing a UI component.
5. Building your app to be deployed to production.
6. Deploying your app to Netlify.

## Install Ember

You can install Ember with a single command using npm,
the Node.js package manager.
Type this into your terminal:

```bash
npm install -g ember-cli
```

Don't have npm? [Learn how to install Node.js and npm here](https://docs.npmjs.com/getting-started/installing-node).
For a full list of dependencies necessary for an Ember CLI project, visit the [Ember CLI Guides - Installing](https://cli.emberjs.com/release/basic-use/).

## Create a New Application

Once you've installed Ember CLI via npm,
you will have access to a new `ember` command in your terminal.
You can use the `ember new` command to create a new application.

```bash
ember new ember-quickstart --lang en
```

This one command will create a new directory called `ember-quickstart` and set up a new Ember application inside of it.
The `--lang en` option sets the app's primary language to English to help improve [accessibility](../../accessibility/application-considerations/).
Out of the box, your application will include:

* A development server.
* Template compilation.
* JavaScript and CSS minification.
* Modern features via Babel.

By providing everything you need to build production-ready web applications in an integrated package,
Ember makes starting new projects a breeze.

Let's make sure everything is working properly.
`cd` into the application directory `ember-quickstart` and start the development server by typing:

```bash
cd ember-quickstart
npm start
```

After a few seconds, you should see output that looks like this:

```shell
> ember-quickstart@0.0.0 start
> ember serve

building... 

Build successful (9761ms) – Serving on http://localhost:4200/
```

(To stop the server at any time, type Ctrl-C in your terminal.)

Open [`http://localhost:4200`](http://localhost:4200) in your browser of choice.
You should see an Ember welcome page and not much else.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        If you are having trouble getting this running, other Ember developers would be happy to help!
        Visit <a href="https://emberjs.com/community/"> The Ember Community Page</a> to join chat groups or forums.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Congratulations! You just created and booted your first Ember app.

## Write some HTML in a template

<feature-flag-on-template-tag>

We will start by editing the `application` template.
This template is always on screen while the user has your application loaded.
In your editor, open `app/templates/application.gjs` and change it to the following:

```gjs {data-filename=app/templates/application.gjs}
<template>
  <h1>PeopleTracker</h1>
  {{outlet}}
</template>
```
</feature-flag-on-template-tag>

<feature-flag-off-template-tag>

We will start by editing the `application` template.
This template is always on screen while the user has your application loaded.
In your editor, open `app/templates/application.hbs` and change it to the following:

```handlebars {data-filename=app/templates/application.hbs}
<h1>PeopleTracker</h1>

{{outlet}}
```

</feature-flag-off-template-tag>

Ember detects the changed file and automatically reloads the page for you in the background.
You should see that the welcome page has been replaced by "PeopleTracker".
You also added an `{{outlet}}` to this page,
which means that any route will be rendered in that place.

## Define a Route

Let's build an application that shows a list of scientists.
To do that, the first step is to create a route.
For now, you can think of routes as being the different pages that make up your application.

Ember comes with _generators_ that automate the boilerplate code for common tasks.
To generate a route, type this in a new terminal window in your `ember-quickstart` directory:

```bash
ember generate route scientists
```

You'll see output like this:

<feature-flag-off-template-tag>
```text
installing route
  create app/routes/scientists.js
  create app/templates/scientists.hbs
updating router
  add route scientists
installing route-test
  create tests/unit/routes/scientists-test.js
```
</feature-flag-off-template-tag>
<feature-flag-on-template-tag>
```bash
# 🚧 Under construction 🚧
# `ember generate route` has not been updated to produce GJS files yet.
installing route
  create app/routes/scientists.js
  create app/templates/scientists.gjs
updating router
  add route scientists
installing route-test
  create tests/unit/routes/scientists-test.js
```
</feature-flag-on-template-tag>

That is Ember telling you that it has created:

1. A template to be displayed when the user visits `/scientists`.
2. A `Route` object that fetches the model used by that template.
3. An entry in the application's router (located in `app/router.js`).
4. A unit test for this route.

<feature-flag-off-template-tag>
Open the newly-created template in `app/templates/scientists.hbs` and add the following HTML:

```handlebars {data-filename=app/templates/scientists.hbs}
{{page-title "Scientists"}}
<h2>List of Scientists</h2>
```

In your browser, open [`http://localhost:4200/scientists`](http://localhost:4200/scientists).
You should see the `<h2>` we put in the `scientists.hbs` template right below the `<h1>` from our `application.hbs` template.

</feature-flag-off-template-tag>
<feature-flag-on-template-tag>
Open the newly-created template in `app/templates/scientists.gjs` and add the following HTML:

```gjs {data-filename=app/templates/scientists.gjs}
import { pageTitle } from 'ember-page-title';

<template>
  {{pageTitle "Scientists"}}
  <h2>List of Scientists</h2>
</template>
```

In your browser, open [`http://localhost:4200/scientists`](http://localhost:4200/scientists).
You should see the `<h2>` we put in the `scientists.gjs` template right below the `<h1>` from our `application.gjs` template.

</feature-flag-on-template-tag>

Since the scientist route is nested under the application route, Ember will render its content inside the application route template's `{{outlet}}` directive.

Now that we've got the `scientists` template rendering,
let's give it some data to render.
We do that by specifying a _model_ for that route,
and we can specify a model by editing `app/routes/scientists.js`.

We'll take the code created for us by the generator and add a `model()` method to the `Route`:

```javascript {data-filename="app/routes/scientists.js"}
import Route from '@ember/routing/route';

export default class ScientistsRoute extends Route {
  model() {
    return ['Marie Curie', 'Mae Jemison', 'Albert Hofmann'];
  }
}
```

This code example uses a feature of JavaScript called classes.
Learn more with this [overview of the latest JavaScript features](https://ponyfoo.com/articles/es6).

In a route's `model()` method, you return whatever data you want to make available to the template.
If you need to fetch data asynchronously,
the `model()` method supports any library that uses [JavaScript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

Now let's tell Ember how to turn that array of strings into HTML.
Open the `scientists` template and add the following code to loop through the array and print it:

<feature-flag-off-template-tag>
```handlebars {data-filename="app/templates/scientists.hbs"}
<h2>List of Scientists</h2>

<ul>
  {{#each @model as |scientist|}}
    <li>{{scientist}}</li>
  {{/each}}
</ul>
```
</feature-flag-off-template-tag>

<feature-flag-on-template-tag>
```gjs {data-filename="app/templates/scientists.gjs"}
import { pageTitle } from 'ember-page-title';

<template>
  {{pageTitle "Scientists"}}
  <h2>List of Scientists</h2>
  <ul>
    {{#each @model as |scientist|}}
      <li>{{scientist}}</li>
    {{/each}}
  </ul>
</template>
```
</feature-flag-on-template-tag>

Here, we use the `each` _helper_ to loop over each item in the array we
provided from the `model()` hook. Ember will render the _block_ contained
inside the `{{#each}}...{{/each}}` helper once for each item (each scientist in
our case) in the array. The item (the scientist) that is being rendered
currently will be made available in the `scientist` variable, as denoted by
`as |scientist|` in the `each` helper.

The end result is that there will be one `<li>` element corresponding to each
scientist in the array inside the `<ul>` unordered list.

## Create a UI Component

As your application grows, you will notice you are sharing UI elements between multiple pages,
or using them multiple times on the same page.
Ember makes it easy to refactor your templates into reusable components.

Let's create a `PeopleList` component that we can use in multiple places to show a list of people.

As usual, there's a generator that makes this easy for us.
Make a new component by typing:

```bash
<feature-flag-on-template-tag>
# 🚧 Under construction 🚧
# `ember generate component` has not been updated to produce GJS files yet.
</feature-flag-on-template-tag>
ember generate component people-list
```

<feature-flag-off-template-tag>
Copy and paste the `scientists` template into the `PeopleList` component's template and edit it to look as follows:

```handlebars {data-filename=app/components/people-list.hbs}
<h2>{{@title}}</h2>

<ul>
  {{#each @people as |person|}}
    <li>{{person}}</li>
  {{/each}}
</ul>
```

</feature-flag-off-template-tag>

<feature-flag-on-template-tag>
Copy and paste this part of the `scientists` template into the `PeopleList` component and edit it to look as follows:

```gjs {data-filename=app/components/people-list.gjs}
<template>
  <h2>{{@title}}</h2>

  <ul>
    {{#each @people as |person|}}
      <li>{{person}}</li>
    {{/each}}
  </ul>
</template>
```

</feature-flag-on-template-tag>

Note that we've changed the title from a hard-coded string ("List of Scientists")
to `{{@title}}`. The `@` indicates that `@title` is an argument that will be
passed into the component, which makes it easier to reuse the same component in
other parts of the app we are building.

We've also renamed `scientist` to the more-generic `person`,
decreasing the coupling of our component to where it's used.

<feature-flag-off-template-tag>
Our component is called `PeopleList`, based on its name on the file system. Please note that the letters P and L are capitalized.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        A component's name is derived from its file name.
        We capitalize the first letter and every letter after <code>-</code>, then remove the hyphens.
        This is known as pascal case.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>
</feature-flag-off-template-tag>

Save this template and switch back to the `scientists` template.

We're going to tell our component:

1. What title to use, via the `@title` argument.
2. What array of people to use, via the `@people` argument. We'll
   provide this route's `@model` as the list of people.

We'll need to make some changes to the code we wrote before.

In the rest of the code examples in this tutorial, whenever we add or remove code, we will show a "diff." The lines you need to remove have a minus sign in front of them, and the lines you should add have a plus sign. If you are using a screen reader while you go through the Guides, we recommend using Firefox and NVDA or Safari and VoiceOver for the best experience.

Let's replace all our old code with our new componentized version:

<feature-flag-off-template-tag>
```handlebars {data-filename="app/templates/scientists.hbs" data-diff="-1,-2,-3,-4,-5,-6,-7,+8,+9,+10,+11"}
<h2>List of Scientists</h2>

<ul>
  {{#each @model as |scientist|}}
    <li>{{scientist}}</li>
  {{/each}}
</ul>
<PeopleList 
  @title="List of Scientists" 
  @people={{@model}} 
/>
```
</feature-flag-off-template-tag>

<feature-flag-on-template-tag>
```gjs {data-filename="app/templates/scientists.gjs" data-diff="+2,-6,-7,-8,-9,-10,-11,+12,+13,+14,+15"}
import { pageTitle } from 'ember-page-title';
import PeopleList from '../components/people-list';

<template>
  {{pageTitle "Scientists"}}
  <h2>List of Scientists</h2>
  <ul>
    {{#each @model as |scientist|}}
      <li>{{scientist}}</li>
    {{/each}}
  </ul>
  <PeopleList 
    @title="List of Scientists" 
    @people={{@model}} 
  />
</template>
```
</feature-flag-on-template-tag>

Go back to your browser and you should see that the UI looks identical.
The only difference is that now we've componentized our list into a version that's more reusable and more maintainable.

You can see this in action if you create a new route that shows a different list of people.
As an additional exercise (that we won't cover),
you can try to create a `programmers` route that shows a list of famous programmers.
If you re-use the `PeopleList` component, you can do it with almost no code at all.

## Responding to user interactions

So far, our application is listing data, but there is no way for the user to
interact with the information. In web applications we often want to respond to
user actions like clicks or hovers. Ember makes this easy to do.

First, we can modify the `PeopleList` component to include a button:

<feature-flag-off-template-tag>
```handlebars {data-filename="app/components/people-list.hbs"}
<h2>{{@title}}</h2>

<ul>
  {{#each @people as |person|}}
    <li>
      <button type="button">{{person}}</button>
    </li>
  {{/each}}
</ul>
```
</feature-flag-off-template-tag>
<feature-flag-on-template-tag>
```gjs {data-filename="app/components/people-list.gjs"}
<template>
  <h2>{{@title}}</h2>

  <ul>
    {{#each @people as |person|}}
      <li>
        <button type="button">{{person}}</button>
      </li>
    {{/each}}
  </ul>
</template>
```
</feature-flag-on-template-tag>


Now that we have a button, we need to wire it up to do _something_ when a user
clicks on it. For simplicity, let's say we want to show an `alert` dialog with
the person's name when the button is clicked.

So far, our `PeopleList` component is purely presentational – it takes some
inputs as arguments and renders them using a template. To introduce _behavior_
to our component – handling the button click in this case, we will need to
attach some JavaScript to the component.

<feature-flag-off-template-tag>
In addition to the template, a component can also have a JavaScript file for
this exact purpose. Go ahead and create a `.js` file with the same name and in
the same directory as our template (`app/components/people-list.js`),
and paste in the following content:

```javascript {data-filename="app/components/people-list.js"}
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PeopleListComponent extends Component {
  @action
  showPerson(person) {
    alert(`The person's name is ${person}!`);
  }
}
```

_Note: If you want this file created for you, you may pass the `-gc` flag when running the component generator._

Here, we created a basic component class and added a method that accepts a
person as an argument and brings up an alert dialog with their name. The
`@action` _decorator_ indicates we want to use this method as an _action_
in our template, in response to user interaction.

Now that we have implemented the desired behavior, we can go back to
the component's template and wire everything up:

```handlebars {data-filename="app/components/people-list.hbs" data-diff="-6,+7"}
<h2>{{@title}}</h2>

<ul>
  {{#each @people as |person|}}
    <li>
      <button type="button">{{person}}</button>
      <button type="button" {{on 'click' this.showPerson}}>{{person}}</button>
    </li>
  {{/each}}
</ul>
```

Here, we used the `on` _modifier_ to attach the `this.showPerson` action to
the button in the template.

There is a problem with this though – if you tried this in the browser, you
will quickly discover that clicking on the buttons will bring up an alert
dialog that said "The person's name is `[Object MouseEvent]`!" – eek!

The cause of this bug is that we wrote our action to take an argument – the
person's name – and we forgot to pass it. The fix is easy enough:

```handlebars {data-filename="app/components/people-list.hbs" data-diff="-6,+7"}
<h2>{{@title}}</h2>

<ul>
  {{#each @people as |person|}}
    <li>
      <button type="button" {{on 'click' this.showPerson}}>{{person}}</button>
      <button type="button" {{on 'click' (fn this.showPerson person)}}>{{person}}</button>
    </li>
  {{/each}}
</ul>
```

Instead of passing the action to the `on` modifier directly, we used the `fn`
helper to pass the `person` as an argument which our action expects.

Feel free to try this in the browser. Finally, everything should behave exactly
as we hoped!
</feature-flag-off-template-tag>

<feature-flag-on-template-tag>

Let's use the [`on` modifier](../../components/template-lifecycle-dom-and-modifiers/#toc_event-handlers) to handle click events on the button:

```gjs {data-filename="app/components/people-list.gjs"}
import { on } from '@ember/modifier'

function showPerson(clickEvent) {
  alert(`You clicked on a button labeled ${clickEvent.target.innerHTML}`);
}

<template>
  <h2>{{@title}}</h2>

  <ul>
    {{#each @people as |person|}}
      <li>
        <button type="button" {{on "click" showPerson}}>{{person}}</button>
      </li>
    {{/each}}
  </ul>
</template>
```

Now let's extend our example to pass the Person to our event handler as an argument. We can use the [`fn` helper](../../components/component-state-and-actions/#toc_passing-arguments-to-actions):

```gjs {data-filename="app/components/people-list.gjs"}
import { on } from '@ember/modifier'
import { fn } from '@ember/helper';

function showPerson(person) {
  alert(`You clicked on ${person}`);
}

<template>
  <h2>{{@title}}</h2>

  <ul>
    {{#each @people as |person|}}
      <li>
        <button type="button" {{on "click" (fn showPerson person) }}>{{person}}</button>
      </li>
    {{/each}}
  </ul>
</template>
```

Many components will need to maintain some state. Let's introduce a `currentPerson` that keeps track of which Person the user clicked on last. The idiomatic way to keep state in an Ember component is to use [`@tracked`](../../in-depth-topics/autotracking-in-depth/) on a component class:

```gjs {data-filename="app/components/people-list.gjs"}
import { on } from '@ember/modifier'
import { fn } from '@ember/helper';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

export default class extends Component {
  @tracked currentPerson;

  showPerson = (person) => {
    this.currentPerson = person;
  };

  isCurrentPerson = (person) => {
    return this.currentPerson === person;
  };

  <template>
    <h2>{{@title}}</h2>

    <ul>
      {{#each @people as |person|}}
        <li>
          <button type="button" {{on "click" (fn this.showPerson person) }}>{{person}}</button>
          {{#if (this.isCurrentPerson person) }}
            ⬅️
          {{/if}}
        </li>
      {{/each}}
    </ul>
  </template>
}
```

</feature-flag-on-template-tag>




## Building For Production

Now that we've written our application and verified that it works in development,
it's time to get it ready to deploy to our users.

To do so, run the following command:

```bash
ember build --environment=production
```

The `build` command packages up all of the assets that make up your
application&mdash;JavaScript, templates, CSS, web fonts, images, and
more.

In this case, we told Ember to build for the production environment via the `--environment` flag.
This creates an optimized bundle that's ready to upload to your web host.
Once the build finishes,
you'll find all of the concatenated and minified assets in your application's `dist/` directory.

The Ember community values collaboration and building common tools that everyone relies on.
If you're interested in deploying your app to production in a fast and reliable way,
check out the [Ember CLI Deploy](http://ember-cli-deploy.com/) addon.

If you deploy your application to an Apache web server, first create a new virtual host for the application.
To make sure all routes are handled by `index.html`,
add the following directive to the application's virtual host configuration:

```apacheconf
FallbackResource index.html
```

## Deploying your app to Netlify

[Netlify](http://netlify.com/products) is a one of many ways to deploy your app to the web so you can share it with others!

![About Netlify](/images/quick-guide/netlify/netlify-product.png)

Why Netlify?

It does not require a high level of knowledge for you to deploy your website to production.
Netlify offers a free account option and no credit card is required.
These Guides themselves are hosted on Netlify, while other parts of `emberjs.com` are hosted using Heroku, Fastly, GitHub pages, and AWS.
Overall, Ember developers have many options for how they deploy their apps! Netlify is just one of the many options you have.

Following these steps will help you get your site up and running in minutes:

First you need to [sign up for a Netlify account](https://app.netlify.com/signup) if you do not already have one:

![deploying to Netlify](/images/quick-guide/netlify/create-netlify-account.png)

**Configuring Netlify URL handling**

The next step is to let the web app server know how to handle URLs. There are 2 ways to do so.

One, you can create a file in your `ember-quickstart/public` folder called
`_redirects`. Add `/* /index.html 200` to the first line and save the file. 
This will let the server know to redirect all pages to `index.html` file. 
Once redirected, Ember.js app itself will generate the matching html for URLs such as `/scientists`.

Two, you can use an addon created by the community, such as [ember-cli-netlify](https://github.com/shipshapecode/ember-cli-netlify), to handle URLs.

Now you are ready to deploy your app to production on Netlify platform. There are two ways to do this:

1. Deploying to Netlify using drag and drop
2. Deploying to Netlify using Git (specifically GitHub)

**Deploying to Netlify using drag and drop**

You may need to re-create your `dist` directory to include changes made to `_redirects` file by running this command

```bash
ember build --environment=production
```

Once you are logged-in to your Netlify account and in the "Sites" section, you should see the Netlify drag and drop area

  ![Netlify Drag and Drop Area](/images/quick-guide/netlify/drag-and-drop/02.png)

Next, locate your `dist` folder on your local machine and drag and drop it into this area

When your files have been successfully uploaded, you should see the status of your deployment in the "Getting started" section

![Getting Started using Drag and Drop on Netlify](/images/quick-guide/netlify/drag-and-drop/03.png)

Once you see "Your site is deployed" as shown above, your website is now live and you can click on the link provided above the "Getting started" section to view your site

![View your site on Netlify](/images/quick-guide/netlify/drag-and-drop/04.png)

Congratulations! Your site is now live and in production!

**Deploying to Netlify using Git (specifically GitHub)**

Make sure you are logged-in to your Netlify account and in the "Sites" section

Click the button that says "New site from Git".

![Netlify Continuous Deployment Git](/images/quick-guide/netlify/github/new-site-from-git.png)

Click the "GitHub" button under "Continuous Deployment" to connect to your GitHub account. Please note you will be taken to a series of GitHub login screens and asked to select your GitHub preferences related to Netlify

![Netlify choose your GitHub repository to deploy](/images/quick-guide/netlify/github/connect-to-github.png)

Once you have successfully connected your GitHub account with Netlify, you should see a list of repositories to choose from. Select or search for your GitHub repository that you wish to deploy

![Netlify Ember Default Deploy Settings](/images/quick-guide/netlify/github/select-github-repo.png)

If you have successfully selected your repo and it is an Ember application, Netlify will automatically generate the deploy settings as shown below. These instructions assume you do not want to change any of the default settings generated by Netlify. So if everything looks good to you, go ahead and click the "Deploy site" button

![Netlify GitHub Deploy Overview](/images/quick-guide/netlify/github/github-create-new-site.png)

Once you click the "Deploy site" button, you will be taken to your website "Overview" and you should see the status of your deployment

![Netlify GitHub Deploy Confirmation](/images/quick-guide/netlify/github/github-deploy-confirmation.png)

Once you see "Your site is deployed" as shown above, your website is now live and you can click on the link provided above the "Getting started" section to view your site

![View your site on Netlify](/images/quick-guide/netlify/github/github-live.png)

Congratulations! Your site is now live and in production!
  
## Next steps

Now that your app is deployed, what should you do next?

### Advance to the next level

There is an official, free tutorial here in the Guides that delves deeper into some of the features you used today.
[Give it a try!](../../tutorial/part-1/)

### Explore the ecosystem

Now that you have the basics down, are you feeling creative and adventurous?
The Ember community has created hundreds of addons that you can use for free in your app.
Addons let you quickly add features like calendars, navbars, payments, authentication, themes, and more.
Visit [Ember Observer](https://emberobserver.com) to browse the possibilities!

### Style it up

That app we made is a bit plain. Do you know any CSS? Put your styles in `app/styles/app.css`, which is automatically included in your app build.

### Connect with the Ember Community

One thing that makes Ember special is that every app you create has a _lot_ in common with apps that other people have made.
This means that chances are good that you can connect with other developers who share both your interests and technical challenges.
Visit the [Ember Community page](https://emberjs.com/community/) to learn about the ways you can get connected. Find a nearby meetup, ask questions, follow a newsletter, and more!
We hope to see you around!


---

Ember is a framework for building applications that run in the browser, which
means that they are made with HTML, CSS, and JavaScript. It is very helpful to
be familiar with these technologies. If you find yourself getting stuck or
confused as you learn Ember, come back to this page and see if there is a
general topic below that you could explore.

## HTML

Hypertext Markup Language (HTML) is a language for specifying the layout of web
pages. It is a markup language that defines the structure of your content
declaratively, which makes it very powerful. Ember provides a templating
language that extends HTML and provides tools for making that structure dynamic.

If you're new to HTML, we recommend [Mozilla's HTML Tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics)
is fairly comprehensive, and the MDN site is one of the best resources for
learning about web APIs.

## CSS

CSS (Cascading Style Sheets) are used to style HTML. While HTML lays out the
basic structure, CSS provides the rules for how that structure should display in
the browser.

If you're new to CSS, we recommend [the MDN guide for learning it](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps),
as it is fairly comprehensive and up to date.

## JavaScript

JavaScript is the primary scripting language of the web. Most Ember apps have
some amount of JavaScript code in them.

Since Ember is a template-oriented framework, not all developers need to
use JavaScript when working on Ember apps. Some developers may be more
focused on the structure of an app's templates, its styles, or the
accessibility of an app. However, it's good to have some
general knowledge of JavaScript for the places where it is used.

If you're new to JavaScript, here are some excellent introductory materials:

- [Mozilla's JavaScript Tutorial](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)
  is pretty comprehensive, and the MDN documentation is the go-to source for
  learning about JavaScript and web APIs.
- [javascript.info](https://javascript.info) is a detailed interactive guide
  that takes you through from the basics to the details. This one is pretty good
  for beginners with no programming experience, since it starts from scratch and
  ramps up.
- [ES6 for humans](https://github.com/metagrover/ES6-for-humans) is a great
  resource if you're already familiar with JavaScript in general, but haven't
  had a chance to get to know some of its latest features that were finalized in 2015.

We recommend familiarizing yourself with the following concepts in particular to
make the most out of these guides and of Ember:

* **Classes** - classes are one of the most fundamental constructs
  in JavaScript, and are used frequently in Ember. See the next section for more
  details on them.
* **Modules** - you will better understand [Ember CLI's](https://ember-cli.com/)
  project structure and import paths if you are comfortable with
  [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
* **Events** - The native way to deal with user input in browser based web
  applications. Events are not part of the language of JavaScript itself, but
  they are part of the browser environment that JavaScript runs in, and they are
  used commonly in Ember. You can read the [MDN introduction to events](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events)
  for more details.
* **Promises** - the native way to deal with asynchrony in your JavaScript code.
  See the relevant [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  section. In addition, modern [`async/await` function syntax](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)
  is good to know.

## JavaScript Classes

Ember uses [JavaScript classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
for many of its constructs, such as Components, Routes, Services, and more:

```js
export default class PermissionController extends Controller {
  @tracked isAdmin = false;
  @tracked isManager = false;

  get canEdit() {
    return this.isAdmin || this.isManager;
  }
}
```

Some of the features that Ember relies on, such as [class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Field_declarations)
and [decorators](https://github.com/tc39/proposal-decorators) have not yet been
fully finalized in JavaScript just yet, so we'll cover these here with the
assumption that you've had a chance to familiarize yourself with classes before.
If you haven't, you can also check out [our detailed class primer](../../in-depth-topics/native-classes-in-depth/).

### Fields

Class fields allow you to assign properties to an instance of the class on
construction. You can define a field like this:

```js
class Permission {
  canEdit = false;
}
```

This is very similar to defining the `Permission` class with a constructor like
this:

```js
class Permission {
  constructor() {
    this.canEdit = false;
  }
}
```

Class fields are somewhat like object properties, but they have some key
differences. They are created and assigned to every instance of the class,
meaning that instance gets a _unique_ version of the field. This doesn't matter
if the field is a primitive, like a string or a number, but does matter if it's
an object or an array:

```js
class Permission {
  roles = [];
}

let tom = new Permission();
let yehuda = new Permission();

tom.roles === yehuda.roles;
// false, they're different arrays
```

Fields can also access the class instance using `this` when they are being
assigned:

```js
class Child {
  constructor(parent) {
    this.parent = parent;
  }
}

class Parent {
  child = new Child(this);
}
```

Fields are assigned before any code in the `constructor` method is run, which is
why we can rely on them being assigned correctly by the time it runs. Fields do
_not_ exist on the class itself, nor do they exist on the class's prototype,
they only exist on the _instance_ of the class. However, they can be added to
the class directly using the `static` keyword, like other class elements.

### Decorators

Decorators are user defined modifiers that can be applied to a class or class
element such as a field or method to change its behavior. For instance, you
could create a `@cache` decorator that caches the return value of a getter the
first time it is calculated:

```js
import { cache } from 'my-cache-decorator';

class Counter {
  _count = 0;

  @cache
  get count() {
    return this._count++;
  }
}

let counter = new Counter();

console.log(counter.count); // 0
console.log(counter.count); // 0
```

Decorators are _normal_ JavaScript functions that get applied with a special
syntax, which is why you import them like any other function, but you use the
`@` symbol when applying them. Decorators come in a variety of flavors, and some
can be applied to classes directly as well:

```js
@observable
class Permission {}
```

Some decorators can also receive arguments:

```js
class Permission {
  canEdit = false;

  @alias('canEdit') editable;
}

let current = new Permission();
console.log(current.editable); // false
```

Ember provides a number of decorators, such as the `@tracked` decorator, that
will be described in greater detail later on in the guides.

> _Note: Decorators are still being actively developed in JavaScript, which means
> that there may be small changes in the future. The decorators provided by
> Ember should remain stable through these changes, but it is recommended that
> you exercise caution if using any external decorator libraries which may not
> have the same stability guarantees._

### Classic Classes

Classic classes are deprecated, but it is still useful to be able
to recognize them when looking at older code or blog posts.
Ember used its own custom class syntax before native JavaScript classes existed,
which looks like this:

```js
export default Controller.extend({
  isAdmin: tracked({ value: false }),
  isManager: tracked({ value: false }),

  canEdit: descriptor({
    get() {
      return this.isAdmin || this.isManager;
    },
  }),
});
```

This syntax is known as _classic class_ syntax. You can check out the
[pre-Octane guides on classic classes](../../../v3.12.0/object-model/)
for more information on how to convert a classic class to modern Ember.

## Cross-Browser Support

Just like the JavaScript language changes over time, web browsers change too!
Ember helps you to write code that can work across many different browsers and
their versions.

Behind the scenes, Ember uses [Babel](https://babeljs.io/) to compile modern
JavaScript to something that can work on _all_ browsers. Without this step, you
could accidentally end up shipping code that works for your version of Chrome but
breaks for someone using Edge. Ember has you covered and let you write modern
JavaScript and use the latest features without any additional setup!

> _Note: Some features require you to [enable the Babel polyfill](https://github.com/babel/ember-cli-babel#polyfill).
> This adds some extra weight to your application, but ensures you'll be
> compatible with any new features that are added to JavaScript._


---

Joining a web development community can be a challenge within itself, especially when all the resources you visit assume you're familiar with other technologies that you're not familiar with.

Our goal is to help you avoid that mess and come up to speed as fast as possible; you can consider us your internet friend.

## CDN
Content Delivery Network

This is typically a paid service you can use to get great performance for your app. Many CDNs act as caching proxies to your origin server; some require you to upload your assets to them. They give you a URL for each resource in your app. This URL will resolve differently for folks depending on where they're browsing.

Behind the scenes, the CDN will distribute your content geographically with the goal of end-users being able to fetch your content with the lowest latency possible. For example, if a user is in India, they'd likely get content served from India faster than from the United States.


## CoffeeScript, TypeScript
These are both languages that compile to JavaScript. You're able to write your code using the syntax they offer and when ready you compile your TypeScript or CoffeeScript into JavaScript.

[CoffeeScript vs TypeScript](http://www.stoutsystems.com/articles/coffeescript-versus-typescript/)


## CRUD
Create, Read, Update, and Destroy

These are changes that could be made to data on a server. Ember data adapters define what these requests to a server look like.

[CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)


## Evergreen browsers
Browsers that update themselves (without user intervention).

[Evergreen Browsers](http://tomdale.net/2013/05/evergreen-browsers/)


## ES3, ES5, ES5.1, ES6 (aka ES2015), etc
ES stands for ECMAScript, which is the specification that JavaScript is based on. The number that follows is the version of the specification.

Most browsers support at least ES5, and some even have ES6 (also known as ES2015) support. You can check each browser's support (including yours) here:

* [ES5 support](http://kangax.github.io/compat-table/es5/)
* [ES6 support](http://kangax.github.io/compat-table/es6/)

[ECMAScript](https://en.wikipedia.org/wiki/ECMAScript)


## LESS, Sass
Both LESS and Sass are types of CSS preprocessor markup intended to give you much more control over your CSS. During the build process, the LESS or Sass resources compile down to vanilla CSS (which can be executed in a browser).

[Sass/Less Comparison](https://gist.github.com/chriseppstein/674726)


## Linter, linting
A validation tool which checks for common issues in your JavaScript. You'd usually use this in your build process to enforce quality in your codebase. A great example of something to check for: *making sure you've always got your semicolons*.

An example of some of the options you can configure:
[ESLint](http://eslint.org/docs/rules/)
[JSLint](http://jshint.com/docs/options/)


## Polyfill
This is a concept that typically means providing JavaScript which tests for features that are missing (prototypes not defined, etc) and "fills" them by providing an implementation.


## Promise
Asynchronous calls typically return a promise (or deferred). This is an object which has a state: it can be given handlers for when it's fulfilled or rejected.

Ember makes use of these in places like the model hook for a route. Until the promise resolves, Ember is able to put the route into a "loading" state.

* [An open standard for sound, interoperable JavaScript promises](https://promisesaplus.com/)
* [emberjs.com - A word on promises](../getting-started/js-primer/#toc_promises)


## SSR
Server-Side Rendering

[Inside FastBoot: The Road to Server-Side Rendering](http://emberjs.com/blog/2014/12/22/inside-fastboot-the-road-to-server-side-rendering.html)


## Transpile
When related to JavaScript, this can be part of your build process which "transpiles" (converts) your ES6 syntax JavaScript to JavaScript that is supported by current browsers.

Besides ES6, you'll see a lot of content about compiling/transpiling CoffeeScript, a short-hand language which can "compile" to JavaScript.

* Ember CLI specifically uses [Babel](https://babeljs.io/) via the [ember-cli-babel](https://github.com/babel/ember-cli-babel) plugin.


## UI
UI stands for User Interface and is essentially what the user sees and interacts with on a device. In terms of the web, the UI is generally composed of a series of pages containing visual elements such as buttons and icons that a user can interact with to perform a specific function.


## Shadow DOM
Not to be confused with Virtual DOM. Shadow DOM is still a work in progress, but basically a proposed way to have an "isolated" DOM encapsulated within your app's DOM.

Creating a re-usable "widget" or control might be a good use-case for this. Browsers implement some of their controls using their own version of a shadow DOM.

* [W3C Working Draft](http://www.w3.org/TR/shadow-dom/)
* [What the Heck is Shadow DOM?](http://glazkov.com/2011/01/14/what-the-heck-is-shadow-dom/)


## Virtual DOM
Not to be confused with Shadow DOM. The concept of a virtual DOM means abstracting your code (or in our case, Ember) away from using the browser's DOM in favor of a "virtual" DOM that can easily be accessed for read/writes or even serialized.


---

---
redirect: glossary/index
---


---

Autotracking is how Ember's _reactivity_ model works - how it decides what to
rerender, and when. This guide covers tracking in more depth, including how it
can be used in various types of classes, and how it interacts with arrays and
POJOs.

## Autotracking Basics

When Ember first renders a component, it renders the initial _state_ of that
component - the state of the instance, and state of the arguments that are
passed to it:

```handlebars {data-filename=app/components/hello.hbs}
{{this.greeting}}, {{@name}}!
```

```js {data-filename=app/components/hello.js}
import Component from '@glimmer/component';

export default class HelloComponent extends Component {
  language = 'en';

  get greeting() {
    switch (this.language) {
      case 'en':
        return 'Hello';
      case 'de':
        return 'Hallo';
      case 'es':
        return 'Hola';
    }
  }
}
```

```handlebars {data-filename=app/templates/application.hbs}
<Hello @name="Jen Weber">
```

When Ember renders this template, we get:

```html
Hello, Jen Weber!
```

By default, Ember assumes that none of the values that are rendered will ever
change. In some cases this is clearly true - for instance, the punctuation in
the template will always be the same, so Ember doesn't need to do anything to
update it. These are static, state-less parts of the template. In other cases,
like `this.greeting` or `@name` argument, that's less clear. It appears
`language` might be something we want to update, and if we do, then `greeting`
should probably change, right? At the least, we should _check_ to see if it
should change.

In order to tell Ember a value might change, we need to mark it as _trackable_.
Trackable values are values that:

1. Can change over their component’s lifetime and
2. Should cause Ember to rerender if and when they change

We can do this by marking the field with the `@tracked` decorator:

```js {data-filename=app/components/hello.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class HelloComponent extends Component {
  @tracked language = 'en';

  get greeting() {
    switch (this.language) {
      case 'en':
        return 'Hello';
      case 'de':
        return 'Hallo';
      case 'es':
        return 'Hola';
    }
  }
}
```

When Ember renders a value like `{{this.greeting}}` in the template, it takes
note of any tracked properties that it encounters, in this case `language`. If
these values change in the future, it schedules a rerender, and then updates
_only_ the values that could have changed. This means that when `language`
changes, only the `Hello` text in the browser will rerender - Ember leaves the
`, Jen Weber!` portion completely alone!

Arguments, like `{{@name}}`, are automatically tracked, so if they change and
are used somewhere in your component, the component will update accordingly.

## Updating Tracked Properties

Tracked properties can be updated like any other property, using standard
JavaScript syntax. For instance, we could update a tracked property via an
action, as in this example component.

```handlebars {data-filename=app/components/hello.hbs}
{{this.greeting}}, {{@name}}!

<select {{on "change" this.updateLanguage}}>
  <option value="en">English</option>
  <option value="de">German</option>
  <option value="sp">Spanish</option>
</select>
```

```js {data-filename=app/components/hello.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class HelloComponent extends Component {
  @tracked language = 'en';

  get greeting() {
    switch (this.language) {
      case 'en':
        return 'Hello';
      case 'de':
        return 'Hallo';
      case 'es':
        return 'Hola';
    }
  }

  @action
  updateLanguage(event) {
    this.language = event.target.value;
  }
}
```

Now, whenever we change the value of the `select`, it'll call the action method,
which will set the value of `language`. Since `language` is marked as tracked,
and was used in rendering `greeting`, Ember will know that `greeting` needs to
be re-rendered in the template, and will update.

Another way that a tracked property could be updated is asynchronously, if
you're sending a request to the server. For instance, maybe we would want to
load the user's preferred language:

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class HelloComponent extends Component {
  constructor() {
    super(...arguments);

    fetch('/api/preferences')
      .then(r => r.json()) // convert the response to a JS object
      .then(response => {
        this.language = response.preferredLanguage;
      });
  }

  @tracked language = 'en';

  get greeting() {
    switch (this.language) {
      case 'en':
        return 'Hello';
      case 'de':
        return 'Hallo';
      case 'es':
        return 'Hola';
    }
  }
}
```

This will also trigger a rerender. No matter where the update occurs, updating
a tracked property will let Ember know to rerender any affected portion of the
app.

### Tracking Through Methods

So far we've only shown tracked properties working through getters, but tracking
works through _methods_ or _functions_ as well:

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class HelloComponent extends Component {
  @tracked language = 'en';
  @tracked supportedLanguages = ['en', 'de', 'es'];

  isSupported(language) {
    return this.supportedLanguages.includes(language);
  }

  get greeting() {
    if (!this.isSupported(this.language)) {
      return 'Unsupported Language';
    }

    switch (this.language) {
      case 'en':
        return 'Hello';
      case 'de':
        return 'Hallo';
      case 'es':
        return 'Hola';
    }
  }
}
```

if `supportedLanguages` changes here, `greeting` will update as well! This
code could likely be refactored to use getters, but in cases where a function or
method makes more sense, tracked properties will still work.

### Tracked Properties in Custom Classes

Tracked properties can also be applied to your own custom classes, and used
within your components and routes:

```js {data-filename=src/utils/person.js}
export default class Person {
  @tracked title;
  @tracked name;

  constructor(title, name) {
    this.title = title;
    this.name = name;
  }

  get fullName() {
    return `${this.title} ${this.name}`;
  }
}
```

```js {data-filename=app/routes/application.js}
import Route from '@ember/routing/route';
import Person from '../../../../utils/person';

export default class ApplicationRoute extends Route {
  model() {
    return new Person('Dr.', 'Zoey');
  }
}
```

```js {data-filename=app/controllers/application.js}
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @action
  updateName(title, name) {
    this.model.title = title;
    this.model.name = name;
  }
}
```

```handlebars {data-filename=app/templates/application.hbs}
{{@model.fullName}}

<button type="button" {{on "click" (fn this.updateName 'Prof.' 'Tomster')}}>
  Update Name
</button>
```

As long as the properties are tracked, and accessed when rendering the template
directly or indirectly, everything should update as expected

### Plain Old JavaScript Objects (POJOs)

Generally, you should try to create classes with their tracked properties
enumerated and decorated with `@tracked`, instead of relying on dynamically
created POJOs. In some cases however, if your usage of properties on POJOs is
too dynamic, you may not be able to enumerate every single property that could
be tracked. In this case, you can use `TrackedObject` from `tracked-built-ins`:

```js
import { TrackedObject } from 'tracked-built-ins';

let obj = new TrackedObject({
  a: 1,
  b: 2,
})

// This change is tracked
obj.c = 3;
```

All property reading and writing on this object is automatically tracked.
`TrackedObject` is "shallowly" tracked. `obj.c = 4` would be tracked, but
`obj.c.somethingDeeper = 5` would not be tracked unless you've also made sure
that the contents of `obj.c` is itself another `TrackedObject`.


#### Arrays

When you want to track the contents of an Array, you can use `TrackedArray` from
`tracked-built-ins`:

```js
import { TrackedArray } from 'tracked-built-ins';

class ShoppingList {
  items = new TrackedArray([]);

  addItem(item) {
    this.items.push(item);
  }
}
```

`TrackedArray` supports all the normal native `Array` methods, ensuring that
their reads and writes are tracked.

## Caching of tracked properties

In contrast to computed properties from pre-Octane, tracked properties are not
cached. A tracked property can also be recomputed even though its dependencies
haven't changed. The following example shows this behavior:

```js
import { tracked } from '@glimmer/tracking';

let count = 0;

class Photo {
  @tracked width = 600;
  @tracked height = 400;

  get aspectRatio() {
    count++;
    return this.width / this.height;
  }
}

let photo = new Photo();

console.log(photo.aspectRatio); // 1.5
console.log(count); // 1
console.log(photo.aspectRatio); // 1.5
console.log(count); // 2

photo.width = 800;

console.log(photo.aspectRatio); // 2
console.log(count); // 3
```

From the value of `count`, we see that `aspectRatio` was calculated 3 times.

Recomputing is fine in most cases. If the computation that happens in the
getter is very expensive, however, you will want to cache the value and
retrieve it when the dependencies haven't changed. You want to recompute only
if a dependency has been updated.

Ember's [@cached decorator](https://github.com/ember-polyfills/ember-cache-primitive-polyfill) lets
you cache (or "memoize") a getter by simply marking it as `@cached`.

With this in mind, let's introduce caching to `aspectRatio`:

```js
import { cached, tracked } from '@glimmer/tracking';

let count = 0;

class Photo {
  @tracked width = 600;
  @tracked height = 400;

  @cached
  get aspectRatio() {
    count++;
    return this.width / this.height;
  }
}

let photo = new Photo();

console.log(photo.aspectRatio); // 1.5
console.log(count); // 1
console.log(photo.aspectRatio); // 1.5
console.log(count); // 1

photo.width = 800;

console.log(photo.aspectRatio); // 2
console.log(count); // 2
```

From the value of `count`, we see that, this time, `aspectRatio` was calculated
only twice.

In general, you should avoid using @cached unless you have confirmed that the getter you are decorating is computationally expensive, since @cached adds a small amount of overhead to the getter.

The @cached decorator was released in Ember 4.1. If you want to leverage this API between versions 3.13 and 4.1, you can install [ember-cached-decorator-polyfill](https://github.com/ember-polyfills/ember-cached-decorator-polyfill) to your project.

<!-- eof - needed for pages that end in a code block  -->


---

---
redirect: in-depth-topics/autotracking-in-depth
---


---

Ember developers have great options for how they handle data from
back end APIs. Ember itself works with any type of back end: REST,
JSON:API, GraphQL, or anything else. This guide will summarize how
and where to make API requests.
Follow the links within it to see examples and learn more.

## How to make API requests

Some common tools for making [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) (create, read, update, delete) requests in Ember include:

- [EmberData](../../models/) is the official data persistence library for Ember. It has a powerful set of tools
for formatting requests, normalizing responses, and efficiently
managing a local cache of data. 
It is included by default in new Ember apps.
- Native JavaScript methods like [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). Install [`ember-fetch`](https://github.com/ember-cli/ember-fetch) in order to provide support for older browsers, and `import fetch from 'fetch'` to use it.
- [jQuery Ajax](https://api.jquery.com/jquery.ajax/) requests. See [the guide for optional features](../../configuring-ember/optional-features/) in order to be able to `import jQuery from 'jquery'` in your app.
- Other Ember-specific addons for data loading. Search for them on [Ember Observer](https://emberobserver.com)
- ...and many more general JavaScript data fetching libraries, which you can install following [this guide](../../addons-and-dependencies/managing-dependencies/).

## Where to make API requests

API requests can be made almost anywhere in an Ember app, however the most common place is the `model` hook of a Route.

### Requests in a Route's `model` hook

In almost every case, this is where your app should load data. You can see examples and more information in [Specifying a Route's Model](../../routing/specifying-a-routes-model/).

These are the main reasons to load data in a `model` hook:

- Respecting the URL results in better user experience
- Proper use of loading and error states result in better user experience
- Dealing with concurrency is a big source of bugs
- The router is designed to solve those problems for you in the majority of common situations

### Requests in Components

Some people choose to load data in their Components.
The drawback is that requires more work from developers to handle async, rendering,
errors, concurrency, and URL state themselves - functionality they would get automatically if
they used a Route's `model` hook.
However there are valid use cases for loading data in a component, for developers who are
comfortable handling the router's features themselves.

Some common use cases include:

- UI elements whose data is independent of a route. For example, a modal that could appear on many different routes, and the modal has its own unique data.
- loading data in parallel within deeply nested routes
- highly interactive loading, like a search bar with its own loading state, error handling, etc.

These Guides do not cover how to load data in components, since the majority
of data fetching should be done in a route's `model`.

### Requests in Services

If someone is connecting to a third-party API, such as a service for payment or mapping, and they need that state across many routes, a [Service](../../services/) might be a good place to make requests. Some common use cases include polling for data and managing websocket connections.

Requests in services have the same drawbacks as Components. Functions and state in a Service can be used almost anywhere in the app.

## Simulating API requests

You don't need to build a back end in order to see how your app might work once it has real data loading in!
Check out the [official Ember.js Tutorials](https://emberjs.com/learn) to learn how to simulate API requests
in an app and test your data loading.

## Things to know

Here are some top things to know if you are new to making API requests in a front end framework:

- Never store API keys or any sensitive data in a front end application
- Learn about the difference between the front end, API, and database. Front end frameworks connect to APIs, not directly to a database.
- If your app seems slow to load, check if the delay is caused by a slow response from the back end API. Use your browser's developer tools to investigate.
- Always check to see if someone has already written an addon or library that helps connect to your API host or style
- Read some blog posts about data loading in Ember. Apps and APIs come in so many different shapes and sizes that it's helpful to seek out examples that are similar to your goals before digging into the details.
- Visit each page of your app and refresh. Does it still work as expected? If not, you may need to refactor where your app makes data requests or use query params to track state.


---

Native classes were first added to JavaScript in ES2015 (also known as ES6).
They are defined using the `class` keyword, and look like this:

```js
class Person {
  helloWorld() {
    console.log('Hello, world!');
  }
}
```

This guide will go over the basics of classes, along with two new features that
are still in development in JavaScript: [class fields][5] and [decorators][6].
We use these features in Ember because they are very useful and make writing
class code much easier, and they have made it far enough along the process of
being added to JavaScript to depend on in production applications.

[5]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Field_declarations
[6]: https://github.com/tc39/proposal-decorators

## Defining Classes

Classes are defined using the `class` keyword:

```js
class Person {}
```

Once defined, a class exists like a variable does in the current scope:

```js
function definePerson() {
  class Person {}
  console.log(Person);
}

definePerson(); // class Person {}
console.log(Person); // Error: Person is not defined
```

You can choose not to give your class a name, making it an _anonymous_ class.
For instance, you could do a default export like this, but it is not
recommended:

```js
// Not recommended 🛑
export default class {}
```

The reasons being:

1. Giving your class a name makes it easier to search for in general, and is
   better for code editors and documentation tools.
2. Giving your class a name gives it a name in the debugger, making your life
   easier later on.

You can create a new _instance_ of the class using the `new` keyword:

```js
let tom = new Person();
```

Instances are like Plain Old JavaScript Objects (POJOs) in many ways. You can
assign values to them however you like, and generally treat them the same:

```js
let tom = new Person();
let yehuda = {};

tom.name = 'Tom Dale';
yehuda.name = 'Yehuda Katz';

console.log(tom); // Person {name: "Tom Dale"}
console.log(yehuda); // {name: "Yehuda Katz"}
```

The difference is that instances of classes _inherit_ elements that are defined
in the class definition. For instance, we can define a _method_ on the person
class, and then call it from the instance:

```js
class Person {
  helloWorld() {
    console.log(`${this.name} says: Hello, world!`);
  }
}

let tom = new Person();
tom.name = 'Tom Dale';
tom.helloWorld(); // Tom Dale says: Hello, world!
```

This allows you to define different _kinds_ of objects, which have their own
methods, properties, fields, and more. This is essentially Object Oriented
Programming - you define different types of objects that handle different
problems and concerns, keeping your code organized.

> _Note: Object Oriented Programming is a fundamental part of JavaScript, but it's not the only part -
> JavaScript is a multi-paradigm language, and supports Object Oriented Programming patterns along with
> Functional Programming, Event Driven programming, and imperative
> programming. You may see strong adherents to different styles both inside and
> outside of the Ember ecosystem, and that's OK! JavaScript is flexible, and
> allows you to choose the patterns that work well for you, so don't feel like
> all of your code needs to be written in a class, and likewise, don't feel like
> everything needs to be a function._

There are 4 major types of elements that can be defined in a class:

- The `constructor` function
- Methods
- Fields
- Accessors, also known as getters and setters

Along with two types of modifiers that can be applied to methods, accessors,
and fields:

- `static`
- Decorators

### Constructor

The `constructor` method is a special method in classes. It's run when you
create a new instance of the class, and can be used to setup the class:

```js
class Person {
  constructor() {
    this.name = 'Tom Dale';
  }
}

let tom = new Person();
console.log(tom.name); // 'Tom Dale'
```

You can also pass arguments to the `constructor` when creating instances with
`new`:

```js
class Person {
  constructor(name) {
    this.name = name;
  }
}

let tom = new Person('Tom Dale');
console.log(tom.name); // 'Tom Dale'
```

The `constructor` can't be called in any other way. It doesn't exist on the
class or instances:

```js
class Person {
  constructor(name) {
    this.name = name;
  }
}

let tom = new Person('Tom Dale');
console.log(tom.constructor()); // Error: undefined is not a function
```

### Methods

Methods are functions that are defined on the class, and usable by instances:

```js
class Person {
  constructor(name) {
    this.name = name;
  }

  helloWorld() {
    console.log(`${this.name} says: Hello, world!`);
  }
}

let stefan = new Person('Stefan Penner');
stefan.helloWorld(); // Stefan Penner says: Hello, world!
```

Like functions declared on objects, they can access the instance using `this`,
so they can store and access variables on the instance.

Methods do _not_ exist on the class itself by default:

```js
class Person {
  helloWorld() {
    console.log('Hello, world!');
  }
}

Person.helloWorld(); // Error: undefined is not a function
```

They exist on the class's _prototype_, and are only readily callable by
instances. However, they can be added to the class directly using the `static`
keyword, which is described in more detail below.

> _Note: if you don't know what a "prototype" is, don't worry - it's how
> JavaScript does inheritance. Most of the details of prototypes are made
> simpler by native class syntax, and while it's useful to know, you don't need
> to dig into them to continue learning Ember or to be productive. If you are
> curious about them, you can check out the [MDN docs for more details][4]._

[4]: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes

### Fields

Class fields allow you to assign properties to an instance of the class on
construction. You can define a field like this:

```js
class Person {
  name = 'Yehuda Katz';
}
```

This is the very similar to defining the `Person` class with a constructor like
this:

```js
class Person {
  constructor() {
    this.name = 'Yehuda Katz';
  }
}
```

Class fields are somewhat like object properties, but they have some key
differences. They are created and assigned to every instance of the class,
meaning that instance gets a _unique_ version of the field. This doesn't matter
if the field is a primitive, like a string or a number, but does matter if it's
an object or an array:

```js
class Person {
  friends = [];
}

let tom = new Person();
let yehuda = new Person();

tom.friends === yehuda.friends;
// false, they're different arrays
```

Fields can also access the class instance using `this` when they are being
assigned:

```js
class Child {
  constructor(parent) {
    this.parent = parent;
  }
}

class Parent {
  child = new Child(this);
}
```

However, relying on state should generally be avoided in field initializers,
since it can make your classes brittle and error prone, especially when
refactoring:

```js
// Avoid this 🛑
class Person {
  title = 'Prof.';
  name = 'Tomster';

  fullName = `${this.title} ${this.name}`;
}

// because it breaks if you change the order
class Person {
  fullName = `${this.title} ${this.name}`;

  title = 'Prof.';
  name = 'Tomster';
}

let yehuda = new Person();
console.log(yehuda.fullName); // undefined undefined

// This is ok, works no matter what the order is ✅
class Person {
  constructor() {
    this.fullName = `${this.title} ${this.name}`;
  }

  title = 'Prof.';
  name = 'Tomster';
}
```

Fields are assigned before any code in the `constructor` method is run, which is
why we can rely on them being assigned correctly by the time it runs. As with
methods, fields do _not_ exist on the class itself, nor do they exist on the
class's prototype, they only exist on the _instance_ of the class. However, they
can be added to the class directly using the `static` keyword, which is
described in more detail below.

### Accessors

Accessors, also known as getters/setters, allow you to define a special function
that is _accessed_ like a property. For example:

```js
class Person {
  get name() {
    return 'Melanie Sumner';
  }
}

let melanie = new Person();
console.log(melanie.name); // 'Melanie Sumner'
```

Even though `get name` is a method, we can treat it like a normal property.
However, if we try to set the name property to a new value, we get an error:

```js
melanie.name = 'Melanie Sumner';
// Cannot set property name of #<Person> which has only a getter
```

We need to add a _setter_ in order to be able to set it. Generally, the setter
function stores the value somewhere, and the getter function retrieves it:

```js
class Person {
  _name = 'Melanie Sumner';

  get name() {
    return this._name;
  }

  set name(newName) {
    this._name = newName;
  }
}

let melanie = new Person();
console.log(melanie.name); // 'Melanie Sumner'
console.log(melanie._name); // 'Melanie Sumner'

melanie.name = 'Melanie Autumn';
console.log(melanie.name); // 'Melanie Autumn'
console.log(melanie._name); // 'Melanie Autumn'
```

Getters can also be used on their own to calculate values dynamically:

```js
class Person {
  title = 'Dr.';
  name = 'Zoey';

  get fullName() {
    return `${this.title} ${this.name}`;
  }
}
```

These values are recalculated every time the property is accessed:

```js
class Counter {
  _count = 0;

  get count() {
    return this._count++;
  }
}

let counter = new Counter();
console.log(counter.count); // 0
console.log(counter.count); // 1
console.log(counter.count); // 2
```

This is why getters should generally _avoid_ mutating state on the instance, and
you should be aware of their performance cost since they'll rerun the code every
time.

Like methods, accessors do _not_ exist on the class itself, and instead are on
the class prototype. As such, they are only readily accessible on _instances_ of
the class. However, they can be added to the class directly using the `static`
keyword, which is described in more detail below.

### `static`

As we mentioned above, for all intents and purposes the methods, fields, and
accessors are only usable on _instances_ of the class. However, sometimes you
may want to place them _directly_ on the class, for instance if you want to
share some state between all instances of the class. You can do this by adding
the `static` keyword in front of the definition:

```js
class Vehicle {
  constructor() {
    Vehicle.incrementCount();
  }

  static incrementCount() {
    this.count++;
  }

  static count = 0;
}

console.log(Vehicle.count); // 0

let car = new Vehicle();

console.log(Vehicle.count); // 1
```

Static class elements are _not_ available on instances, and are only available
directly on the class itself.

```js
class Alert {
  static helloWorld() {
    return 'Hello, world!';
  }
}

console.log(Alert.helloWorld()); // Hello, world!

let alert = new Alert();

console.log(alert.helloWorld()); // Error: undefined is not a function
```

### Decorators

Decorators are user defined modifiers that can be applied to a class or class
element such as a field or method to change its behavior. For instance, you
could create a `@cache` decorator that caches the return value of a getter the
first time it is calculated:

```js
import { cache } from 'my-cache-decorator';

class Counter {
  _count = 0;

  @cache
  get count() {
    return this._count++;
  }
}

let counter = new Counter();

console.log(counter.count); // 0
console.log(counter.count); // 0
```

Decorators are _normal_ JavaScript functions that get applied with a special
syntax, which is why you import them like any other function, but you use the
`@` symbol when applying them. Decorators come in a variety of flavors, and some
can be applied to classes directly as well:

```js
@observable
class Person {}
```

Some decorators can also receive arguments:

```js
class Person {
  fullName = 'Matthew Beale';

  @alias('fullName') name;
}

let matt = new Person();
console.log(matt.name); // Matthew Beale
```

Ember provides [a number of decorators](https://api.emberjs.com/ember/release/modules/@ember%2Fobject#functions), such as the [`@tracked` decorator](https://api.emberjs.com/ember/release/functions/@glimmer%2Ftracking/tracked), that
will be described in greater detail later on in the guides.

> Note: Decorators are still being actively developed in JavaScript, which means
> that there may be small changes in the future. The decorators provided by
> Ember should remain stable through these changes, but it is recommended that
> you exercise caution if using any external decorator libraries which may not
> have the same stability guarantees.

### Using injection

Instances can also make use of injection if they are embedded into the application container. To achieve this, you need to call [`setOwner`](https://api.emberjs.com/ember/3.27/functions/@ember%2Fapplication/setOwner) on the instance and supply the container. You can access the container by calling [`getOwner`](https://api.emberjs.com/ember/3.27/functions/@ember%2Fapplication/getOwner) on any framework object (components, services, routes, etc.).

```js
import { service } from '@ember/service';
import { getOwner, setOwner } from '@ember/application';
 
class Item {
  @service('shopping-cart') cart;

  function addToCart() {
    this.cart.add(this);
  }
}

// On any framework object...
let item = new Item();
setOwner(item, getOwner(this));
item.addToCart();
```

Alternatively, you can call `setOwner` in the class constructor and simply supply the caller as an argument to the constructor.
```js
import { service } from '@ember/service';
import { getOwner, setOwner } from '@ember/application';

class Item {
  @service('shopping-cart') cart;

  constructor(context) {
    setOwner(this, getOwner(context));
  }

  function addToCart() {
    this.cart.add(this);
  }
}

// On any framework object...
let item = new Item(this);
item.addToCart();
```

## Extending Classes

You can create classes that extend existing classes, inheriting all of their
elements, using the `extends` keyword:

```js
class Vehicle {
  move() {
    console.log('moving!');
  }
}

class Aircraft extends Vehicle {
  fly() {
    console.log('flying!');
  }
}

let airbus = new Aircraft();
airbus.move(); // moving!
airbus.fly(); // flying!
```

Static class elements are also inherited this way:

```js
class Vehicle {
  static count = 0;
}

class Aircraft extends Vehicle {
  static id = 1;
}

console.log(Aircraft.count); // 0
console.log(Aircraft.id); // 1
```

Defining subclasses is otherwise the same as defining a base class in most ways,
with the exception of the `constructor` function where you _must_ use the
`super` keyword (discussed in more detail below). Class elements that are
redefined by the child class will be _overridden_, and their values will be fully
replaced on the child:

```js
class Vehicle {
  move() {
    console.log('moving');
  }
}

class Aircraft extends Vehicle {
  move() {
    console.log('flying!');
  }
}

let airbus = new Aircraft();
airbus.move(); // flying!
```

However, child classes can use the `super` keyword to access the parent, and use
its methods and accessors. Class fields are always overwritten on the instance,
so the values on the parent class cannot be accessed by the child if they are
redefined.

### `constructor` in extends

When extending a class, if you define a `constructor` function you _must_ call
`super` in the constructor, and you must do it _before_ you access the class
with `this`. This will call the parent class's constructor, ensuring that the
class is setup properly:

```js
class Vehicle {
  constructor() {
    console.log('vehicle made!');
  }
}

class Aircraft extends Vehicle {
  constructor() {
    super();
    console.log('aircraft made!');
  }
}

let airbus = new Aircraft();
// vehicle made!
// aircraft made!
```

In general, it's a good idea to pass along any arguments to the parent class in
the call to `super`, since they'll probably be necessary for setting up the
class.

```js
class TodoComponent extends Component {
  constructor() {
    super(...arguments);

    // setup the component...
  }
}
```

### Using `super`

`super` must be used in subclass constructors, but it can also be used in other
class methods or accessors. When being used in any other method, you must
explicitly specify the method you're calling on the super class:

```js
class Vehicle {
  move() {
    console.log(`moving!`);
  }
}

class Aircraft extends Vehicle {
  move() {
    super.move();
    console.log('flying!');
  }
}

let airbus = new Aircraft();
airbus.move(); // moving! flying!
```

You can also call _different_ methods on the super class if you want, allowing
you to change behaviors or alias methods:

```js
class Vehicle {
  moveType = 'moving';

  move() {
    console.log(`${this.moveType}!`);
  }
}

class Aircraft extends Vehicle {
  moveType = 'flying';

  fly() {
    super.move();
  }
}

let airbus = new Aircraft();
airbus.fly(); // flying!
```

If the method does not exist on the parent class, it will throw an error:

```js
class Vehicle {
  moveType = 'moving';

  move() {
    console.log(`${this.moveType}!`);
  }
}

class Aircraft extends Vehicle {
  moveType = 'flying';

  fly() {
    super.fly();
  }
}

let airbus = new Aircraft();
airbus.fly(); // Error: undefined is not a function
```

In certain cases, you will want to pass arguments to the super method before or
after overriding. This allows the super class method to continue operating as it
normally would.

One common example is when overriding the
[`normalizeResponse()`](https://api.emberjs.com/ember-data/release/classes/JSONAPISerializer/methods/normalizeResponse?anchor=normalizeResponse)
hook in one of EmberData's serializers.

A handy shortcut for this is to use a "spread operator", like `...arguments`:

```javascript
normalizeResponse(store, primaryModelClass, payload, id, requestType)  {
  // Customize my JSON payload for Ember-Data
  return super.normalizeResponse(...arguments);
}
```

The above example returns the original arguments (after your customizations)
back to the parent class, so it can continue with its normal operations.


---

Actions are the primary method for updating state in an Ember application, and
as such they have lots of uses and patterns. This guide covers some of the more
common action patterns that can be used in Ember.

## Action Fundamentals

Imagine we're building an application where users can have accounts. We need to
build the UI for users to delete their account. Because we don't want users to
accidentally delete their accounts, we'll build a button that requires the user
to confirm in order to trigger some action.

We'll call this the `ButtonWithConfirmation` component. We can start off with a
normal component definition, like we've seen before:

```handlebars {data-filename=app/components/button-with-confirmation.hbs}
<button type="button">{{@text}}</button>

{{#if this.isConfirming}}
  <div class="confirm-dialog">
    <button type="button" class="confirm-submit">
      OK
    </button>
    <button type="button" class="confirm-cancel">
      Cancel
    </button>
  </div>
{{/if}}
```

```js {data-filename=app/components/button-with-confirmation.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ButtonWithConfirmationComponent extends Component {
  @tracked isConfirming = false;
}
```

Now we have a button that can receive some text as an argument, with a modal
confirmation that will show conditionally based on its `isConfirming`
property. You'll notice this property is decorated with the `@tracked`
decorator - this is known as a _tracked property_, and indicates to Ember that
the field will change in value over the lifetime of the component. You can learn
more about tracked properties in the [Autotracking In-Depth](../autotracking-in-depth/)
guide.

Next, we need to hook up the button to toggle that property. We'll
do this with an _action_:

```js {data-filename=app/components/button-with-confirmation.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ButtonWithConfirmationComponent extends Component {
  @tracked isConfirming = false;

  @action
  launchConfirmDialog() {
    this.isConfirming = true;
  }
}
```

```handlebars
<button type="button" {{on "click" this.launchConfirmDialog}}>
  {{@text}}
</button>

{{#if this.isConfirming}}
  <div class="confirm-dialog">
    <button type="button" class="confirm-submit">
      OK
    </button>
    <button type="button" class="confirm-cancel">
      Cancel
    </button>
  </div>
{{/if}}
```

Now if we click the button, it will show the confirmation dialog - our first
interactive component! We'll also want the modal to close when we click either
of the modal buttons, so we can add a couple more actions to handle that:

```js {data-filename=app/components/button-with-confirmation.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ButtonWithConfirmationComponent extends Component {
  @tracked isConfirming = false;

  @action
  launchConfirmDialog() {
    this.isConfirming = true;
  }

  @action
  submitConfirm() {
    this.isConfirming = false;
  }

  @action
  cancelConfirm() {
    this.isConfirming = false;
  }
}
```

```handlebars
<button type="button" {{on "click" this.launchConfirmDialog}}>
  {{@text}}
</button>

{{#if this.isConfirming}}
  <div class="confirm-dialog">
    <button
      type="button"
      class="confirm-submit"
      {{on "click" this.submitConfirm}}
    >
      OK
    </button>
    <button
      type="submit"
      class="confirm-cancel"
      {{on "click" this.cancelConfirm}}
    >
      Cancel
    </button>
  </div>
{{/if}}
```

Now we can open and close the modal dialog at will! Next, we'll setup the
component to send its _own_ events when the user clicks the "OK" and "Cancel"
buttons.

## Exposing Actions as Public API

Let's create a parent component, the `UserProfile` component, where the user can
delete their profile:

```handlebars {data-filename=app/components/user-profile.hbs}
<ButtonWithConfirmation
  @text="Click OK to delete your account."
/>
```

First we'll define what we want to happen when the user clicks the button and
then confirms. In the first case, we'll find the user's account and delete it.

We'll implement an action on the parent component called
`deleteAccount()` that, when called, gets a hypothetical `login`
[service](../../services/) and calls the service's `deleteUser()`
method. We'll go over services later on - for now, think of it as an API
that manages the user's login and information.

```javascript {data-filename=app/components/user-profile.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class UserProfileComponent extends Component {
  @service login;

  @action
  deleteAccount() {
    this.login.deleteUser();
  }
}
```

Now we've implemented our action, but we have not told Ember when we want this
action to be triggered. In order to trigger the action when the user clicks "OK"
in the `ButtonWithConfirmation` component, we'll need to pass the action _down_
to it as an argument:

```handlebars {data-filename=app/components/user-profile.hbs}
<ButtonWithConfirmation
  @text="Click OK to delete your account."
  @onConfirm={{this.deleteAccount}}
/>
```

Next, in the child component we will implement the logic to confirm that the
user wants to take the action they indicated by clicking the button:

```javascript {data-filename=app/components/button-with-confirmation.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ButtonWithConfirmationComponent extends Component {
  @tracked isConfirming = false;

  @action
  launchConfirmDialog() {
    this.isConfirming = true;
  }

  @action
  submitConfirm() {
    if (this.args.onConfirm) {
      this.args.onConfirm();
    }

    this.isConfirming = false;
  }

  @action
  cancelConfirm() {
    this.isConfirming = false;
  }
}
```

Now, when we click on the confirm button, the `submitConfirm` action will also
call the `deleteAccount` action, which was passed down as an argument to
the confirmation button component. In this way, the `@onConfirm` argument is
like an event which our `ButtonWithConfirmation` component triggers.

## Handling Action Completion

Often actions perform asynchronous tasks, such as making an ajax request to a
server. Since actions are functions that can be passed in by a parent component,
they are able to return values when called. The most common scenario is for an
action to return a promise so that the component can handle the action's
completion.

In our `ButtonWithConfirmation` component we want to leave the confirmation
modal open until we know that the operation has completed successfully. This is
accomplished by expecting a promise to be returned from `onConfirm`. Upon
resolution of the promise, we set a property used to indicate the visibility of
the confirmation modal. We can use an `async` function to handle that promise:

```javascript {data-filename=app/components/button-with-confirmation.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ButtonWithConfirmationComponent extends Component {
  @tracked isConfirming = false;

  @action
  launchConfirmDialog() {
    this.isConfirming = true;
  }

  @action
  async submitConfirm() {
    if (this.args.onConfirm) {
      await this.args.onConfirm();
    }

    this.isConfirming = false;
  }

  @action
  cancelConfirm() {
    this.isConfirming = false;
  }
}
```

## Passing Arguments

Sometimes the parent component invoking an action has some context needed for
the action that the child component doesn't. Consider, for example, the case
where the `ButtonWithConfirmation` component we've defined is used within
`SendMessage`. The `sendMessage` action that we pass to the child component may
expect a message type parameter to be provided as an argument:

```javascript {data-filename=app/components/send-message.js}
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SendMessageComponent extends Component {
  @action
  async sendMessage(messageType) {
    // send message here and return a promise
  }
}
```

However, the `ButtonWithConfirmation` component invoking the action doesn't know
or care what type of message it's collecting. In cases like this, the parent
template can provide the required parameter when the action is passed to the
child. For example, if we want to use the button to send a message of type
`"info"`:

```handlebars {data-filename=app/components/send-message.hbs}
<ButtonWithConfirmation
  @text="Click to send your message."
  @onConfirm={{fn this.sendMessage "info"}}
/>
```

Within `ButtonWithConfirmation`, the code in the `submitConfirm` action does not
change. It will still invoke `onConfirm` without explicit arguments:

```javascript {data-filename=app/components/button-with-confirmation.js}
await this.args.onConfirm();
```

However the expression `{{fn this.sendMessage "info"}}` used in passing the
action to the component creates a closure and partially applies the given parameter to the new function. So now when the action is invoked, that parameter will automatically be passed as its argument,
effectively calling `sendMessage("info")`, despite the argument not appearing in
the calling code.

So far in our example, the action we have passed to `ButtonWithConfirmation` is
a function that accepts one argument, `messageType`. Suppose we want to extend
this by allowing `sendMessage` to take a second argument, the actual text of the
message the user is sending:

```javascript {data-filename=app/components/send-message.js}
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SendMessageComponent extends Component {
  @action
  async sendMessage(messageType, messageText) {
    // send message here and return a promise
  }
}
```

We want to arrange for the action to be invoked from within
`ButtonWithConfirmation` with both arguments. We've seen already that if we
provide a `messageType` value to the `fn` helper when we insert
`ButtonWithConfirmation` into its parent `SendMessage` template, that value will
be passed to the `sendMessage` action as its first argument automatically when
invoked as `onConfirm`. If we subsequently pass a single additional argument to
`onConfirm` explicitly, that argument will be passed to `sendMessage` as its
second argument (This ability to provide arguments to a function one at a time
is known as [partial application](https://en.wikipedia.org/wiki/Partial_application)).

In our case, the explicit argument that we pass to `onConfirm` will be the
required `messageText`. However, remember that internally our
`ButtonWithConfirmation` component does not know or care that it is being used
in a messaging application. Therefore within the component's JavaScript file, we
will use a property `confirmValue` to represent that argument and pass it to
`onConfirm` as shown here:

```javascript {data-filename=app/components/button-with-confirmation.js}
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ButtonWithConfirmationComponent extends Component {
  @action
  async submitConfirm() {
    if (this.args.onConfirm) {
      // call `onConfirm` with a second argument
      await this.args.onConfirm(this.confirmValue);
    }

    this.isConfirming = false;
  }

  //...
}
```

In order for `confirmValue` to take on the value of the message text, we'll bind
the property to the value of a user input field that will appear when the button
is clicked. To accomplish this, we'll first modify the component so that it can
be used in block form and we will pass `confirmValue` as a
[block parameter](../../components/block-content/) within the confirm dialog
element:

```handlebars {data-filename=app/components/button-with-confirmation.hbs}
<button type="button" {{on "click" this.launchConfirmDialog}}>
  {{this.text}}
</button>

{{#if this.isConfirming}}
  <div class="confirm-dialog">
    {{yield this.confirmValue}}

    <button type="button"
      class="confirm-submit"
      {{on "click" this.submitConfirm}}
    >
      OK
    </button>
    <button type="button"
      class="confirm-cancel"
      {{on "click" this.cancelConfirm}}
    >
      Cancel
    </button>
  </div>
{{/if}}
```

With this modification, we can now use the component in `SendMessage` to wrap a
text input element whose `value` attribute is set to `confirmValue`:

```handlebars {data-filename=app/components/send-message.hbs}
<ButtonWithConfirmation
  @text="Click to send your message."
  @onConfirm={{fn this.sendMessage "info"}}
as |confirmValue|>
  <Input @value={{confirmValue}} />
</ButtonWithConfirmation>
```

When the user enters their message into the input field, the message text will
now be available to the component as `confirmValue`. Then, once they click the
"OK" button, the `submitConfirm` action will be triggered, calling `onConfirm`
with the provided `confirmValue`, thus invoking the `sendMessage` action in
`SendMessage` with both the `messageType` and `messageText` arguments.

## Invoking Actions Directly on Component Collaborators

Actions can be invoked on objects other than the component directly from the
template. For example, in our `SendMessage` component we might include a service
that processes the `sendMessage` logic.

```javascript {data-filename=app/components/send-message.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class SendMessageComponent extends Component {
  @service messaging;

  // component implementation
}
```

We can tell the action to invoke the `sendMessage` action directly on the
messaging service.

```handlebars {data-filename=app/components/send-message.hbs}
<ButtonWithConfirmation
  @text="Click to send your message."
  @onConfirm={{fn this.messaging.sendMessage "info"}}
as |confirmValue|>
  <Input @value={{confirmValue}} />
</ButtonWithConfirmation>
```

The interesting part is that the action from the service just works, because
it's auto-bound to that service.

```javascript {data-filename=app/services/messaging.js}
import Service from '@ember/service';
import { action } from '@ember/object';

export default class Messaging extends Service {
  @action
  async sendMessage(messageType, text) {
    // handle message send and return a promise
  }
}
```

## Destructuring Objects Passed as Action Arguments

A component will often not know what information a parent needs to process an
action, and will just pass all the information it has. For example, our
`UserProfile` component is going to notify its parent,
`SystemPreferencesEditor`, that a user's account was deleted, and passes along
with it the full user profile object.

```javascript {data-filename=app/components/user-profile.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class UserProfileComponent extends Component {
  @service login;

  @action
  async deleteAccount() {
    await this.login.deleteUser();

    this.args.didDelete(this.login.currentUserObj);
  }
}
```

All our `SystemPreferencesEditor` component really needs to process a user
deletion is an account ID. For this case, the `fn` helper provides the value
via partial application to allow a parent component to dig into the passed
object to pull out only what it needs.

```handlebars {data-filename=app/components/system-preferences-editor.hbs}
<UserProfile @didDelete={{fn this.userDeleted this.login.currentUser.id}} />
```

Now when the `SystemPreferencesEditor` handles the delete action, it receives
only the user's account `id` string.

```javascript {data-filename=app/components/system-preferences-editor.js}
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SystemPreferencesEditorComponent extends Component {
  @action
  userDeleted(idStr /* , native clickEvent */) {
    // respond to deletion
  }
}
```

## Calling Actions Up Multiple Component Layers

When your components go multiple template layers deep, it is common to need to
handle an action several layers up the tree.

<!-- Note about prop drilling / anti-patterns?-->

Parent components can pass actions to child components through templates alone without
adding JavaScript code to those child components.

For example, say we want to move account deletion from the `UserProfile`
component to its parent `SystemPreferencesEditor`.

First we would move the `deleteUser` action from `user-profile.js` to
the parent `system-preferences-editor.js`.

```javascript {data-filename=app/components/system-preferences-editor.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class SystemPreferencesEditorComponent extends Component {
  @service login;

  @action
  deleteUser(idStr) {
    return this.login.deleteUserAccount(idStr);
  }
}
```

Then our `SystemPreferencesEditor` template passes its local `deleteUser`
action into the `UserProfile` as that component's `deleteCurrentUser` argument.

```handlebars {data-filename=app/components/system-preferences-editor.hbs}
<UserProfile
  @deleteCurrentUser={{fn this.deleteUser this.login.currentUser.id}}
/>
```

The `deleteUser` action is prepended with `this.`, since
`SystemPreferencesEditor` is where the action is defined now. If the action
was passed from a parent, then it might have looked like `@deleteUser` instead.

In our `user-profile.hbs` template we change our action to call
`deleteCurrentUser` as passed above.

```handlebars {data-filename=app/components/user-profile.hbs}
<ButtonWithConfirmation
  @text="Click OK to delete your account."
  @onConfirm={{@deleteCurrentUser}}
/>
```

Note that `deleteCurrentUser` is now prepended with `@` as opposed to `this.`
[previously](#toc_passing-the-action-to-the-component).

Now when you confirm deletion, the action goes straight to the
`SystemPreferencesEditor` to be handled in its local context.


---

This guide assumes that you have read the [component guides](../../components/)
and are familiar with how Ember components work. We'll cover components in more
depth in this section. At the end, we'll present recommended component patterns.

## Argument Defaults

At some point, you may want to add default values to your arguments if one
wasn't passed to your component. Arguments are not mutable, so if you attempt to
reassign a value on `this.args`, it'll fail. Instead, you should define a getter
on your component that provides the default value if the argument was not
provided.

For instance, if you wanted to create a tooltip icon that had a standard icon
and class, you could do it like so:

```javascript {data-filename=app/components/tooltip.js}
import Component from '@glimmer/component';

export default class TooltipComponent extends Component {
  get icon() {
    return this.args.icon ?? 'icon-info';
  }

  get tooltipClass() {
    return this.args.tooltipClass + ' tooltip';
  }
}
```

```handlebars {data-filename=app/components/tooltip.hbs}
<div class={{this.tooltipClass}}>
  <i class={{this.icon}}></i>
  {{@content}}
</div>
```

Now when called like so:

```handlebars
<Tooltip @content="I'm a tooltip!"/>
```

The result will be:

```html
<div class="tooltip">
  <i class="icon-info"></i>
  I'm a tooltip!
</div>
```

Note that because arguments are prefixed with `@` in templates, and placed on
`args` in the component definition, we can use the same name for our `icon` and
`tooltipClass` getters, which is pretty convenient. We can also tell clearly
when we look at the template for the tooltip that `this.tooltipClass` and
`this.icon` are values that come from the class definition, and that means they
probably have been used in some kind of dynamic code (in this case, our
defaulting logic).

## Attributes

### Attribute Ordering

The positioning of `...attributes` matters, with respect to the other attributes
in the element it is applied to. Attributes that come _before_ `...attributes`
can be overridden, but attributes that come _after_ cannot:

```handlebars
<p
  data-overridable="you can override me"
  ...attributes
  data-non-overridable="but you can't override me!"
>
  ...
</p>
```

There is one exception to this, which is the `class` attribute. `class` will get
merged, since its more often the case that users of the component want to _add_
a class than completely override the existing ones. For `class`, the order of
`...attributes` will determine the order of merging. Putting it before:

```handlebars
<p ...attributes class="friend-greeting">
  Hello {{@friend}}, I'm {{this.name}}!
</p>
```

Results in:

```html
<p class="red-alert friend-greeting">
  Hello {{@friend}}, I'm {{this.name}}!
</p>
```

And putting it after:

```handlebars
<p class="friend-greeting" ...attributes>
  Hello {{@friend}}, I'm {{this.name}}!
</p>
```

Results in:

```html
<p class="friend-greeting red-alert">
  Hello {{@friend}}, I'm {{this.name}}!
</p>
```

### `aria` Attributes

There are some `aria` attributes that can have multiple values **and** the order of those values matter.
The most frequently used of these is `aria-describedby` and `aria-labelledby`.

In these cases, make sure to declare _all_ of the relevant values in the correct order.

```handlebars
<MyInput @input-label="Password" aria-describedby="text-help-0 text-help-1" />
```

To learn more about `aria` roles and accessibility in Ember, check out the [Accessibility Guide](../../reference/accessibility-guide/).

## Contextual Components

The [`{{component}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/component?anchor=component)
helper can be used to defer the selection of a component to runtime. The
`<MyComponent />` syntax always renders the same component, while using the
`{{component}}` helper allows choosing a component to render on the fly. This is
useful in cases where you want to interact with different external libraries
depending on the data. Using the `{{component}}` helper would allow you to keep
different logic well separated.

The first parameter of the helper is the name of a component to render, as a
string. So `{{component 'blog-post'}}` is the same as using `<BlogPost />`.

The real value of [`{{component}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/component?anchor=component)
comes from being able to dynamically pick the component being rendered. Below is
an example of using the helper as a means of choosing different components for
displaying different kinds of posts:

```handlebars {data-filename=app/components/foo-component.hbs}
<h3>Hello from foo!</h3>
<p>{{this.post.body}}</p>
```

```handlebars {data-filename=app/components/bar-component.hbs}
<h3>Hello from bar!</h3>
<div>{{this.post.author}}</div>
```

```handlebars {data-filename=app/templates/index.hbs}
{{#each this.myPosts as |post|}}
  {{!-- either foo-component or bar-component --}}
  {{component post.postType post=post}}
{{/each}}
```

or

```handlebars {data-filename=app/templates/index.hbs}
{{#each this.myPosts as |post|}}
  {{!-- either foo-component or bar-component --}}
  {{#let (component post.postType) as |Post|}}
    <Post @post={{post}} />
  {{/let}}
{{/each}}
```

Or, for example the layout for a SuperForm component might be implemented as:

```handlebars {data-filename=app/components/super-form.hbs}
<form>
  {{yield (hash
    Input=(component "super-input" form=this model=this.model)
    Textarea=(component "super-textarea" form=this model=this.model)
    Submit=(component "super-submit" form=this model=this.model)
  )}}
</form>
```

And be used as:

```handlebars {data-filename=app/templates/index.hbs}
<SuperForm @model={{this.post}} as |f|>
  <f.Input @name="title" />
  <f.Textarea @name="body" />
  <f.Submit />
</SuperForm>
```

When the parameter passed to `{{component}}` evaluates to `null` or `undefined`,
the helper renders nothing. When the parameter changes, the currently rendered
component is destroyed and the new component is created and brought in.

Picking different components to render in response to the data allows you to
have a different template and behavior for each case. The `{{component}}` helper
is a powerful tool for improving code modularity.

### Contextual helpers & modifiers

We can even use helpers and modifiers in the same way. Let's extend the SuperForm component:

```handlebars {data-filename=app/components/super-form.hbs}
<form>
  {{yield (hash

    Input=(component "super-input" form=this model=this.model)
    Textarea=(component "super-textarea" form=this model=this.model)
    Submit=(component "super-submit" form=this model=this.model)

    is-valid=(helper "super-is-valid" form=this model=this.model)
    error-for=(helper "super-error-for" form=this model=this.model)

    auto-resize=(modifier "super-auto-resize")

  )}}
</form>
```

And be used as:

```handlebars {data-filename=app/templates/index.hbs}
<SuperForm @model={{this.post}} as |f|>

  {{! Invoke a contextual component }}
  <f.Input @name="title" />

  {{! Invoke contextual helpers }}
  {{#unless (f.is-valid "title")}}
    <div class="error">This field {{f.error-for "title"}}</div>
  {{/unless}}

  {{! Invoke a contextual modifier on a contextual component invocation }}
  <f.Textarea @name="body" {{f.auto-resize maxHeight="500"}} />

  <f.Submit />
</SuperForm>
```

These APIs open the doors for the creation of new, more powerful UI abstractions.

## Learn More

To keep this guide concise, we built a separate site for [component patterns in Ember](https://emberjs-1.gitbook.io/ember-component-patterns/).
This project also addresses anti-patterns and accessibility for components.

[![ember-component-patterns](/images/ember-component-patterns.png)](https://emberjs-1.gitbook.io/ember-component-patterns/)


---

In Ember, rendering occurs via syntax, rather than by value -- so _anything_ can be a modifier, helper, or component.

## Modifiers

For Modifiers, there is a specific syntax that only modifiers may reside in

```handlebars
<div {{someModifier}}>
```
or via property on some object

```handlebars
<div {{this.property.someModifier}}>
```
or via an argument passed to a component

```handlebars
<div {{@someModifier}}>
```

Modifiers can be curried with the `modifier` helper:

```handlebars
{{! In a component called "Example" }}
{{yield (modifier someModifier "arguments" "here")}}

{{! Usage: }}
<Example as |theModifier|>
  <div {{theModifier}}>
</Example>
```


## Helpers

For Helpers, there is a specific syntax that only helpers may reside in
```handlebars
{{ (theHelper) }}
```
or nested in a sub-expression
```handlebars
{{yield (hash key=(theHelper) key2=(theHelper with args)) }}
```
or via property on some object
```handlebars
{{ (this.property.theHelper) }}
```
or via an argument passed to a component
```handlebars
{{ (@theHelper) }}
```

Helpers can be curried with the `helper` helper:
```handlebars
{{! In a component called "Example" }}
{{yield (helper someHelper "arguments" "here")}}

{{! Usage: }}
<Example as |theHelper|>
  {{ (theHelper) }}
</Example>
```

## Components

For Components, there is a specific syntax that only components may reside in
```handlebars
<AComponent />
```
or via a property on some object
```handlebars
<this.someComponent />
```
or via an argument passed to a component
```handlebars
<@someComponent />
```

Components can be curried with the `component` helper:
```handlebars
{{!
  In a component called "Example".
  Note that components may only receive named arguments
}}
{{yield (component someComponent foo="arguments" bar="here")}}

{{! Usage: }}
<Example as |theComponent|>
  <theComponent />
</Example>
```


---

## Creating Records

You can create records by calling the
[`createRecord()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/createRecord?anchor=createRecord)
method on the store.

```javascript
this.store.createRecord('post', {
  title: 'Rails is Omakase',
  body: 'Lorem ipsum'
});
```

To make `store` available, you can [inject the `store` service](../#toc_injecting-the-store).

## Updating Records

Making changes to EmberData records is as simple as setting the attribute you
want to change:

```javascript
this.store.findRecord('post', 1).then(function(post) {
  // ...after the record has loaded
  post.title = 'A new post';
});
```

## Persisting Records

Records in EmberData are persisted on a per-instance basis.
Call [`save()`](https://api.emberjs.com/ember-data/release/classes/Model/methods/save?anchor=save)
on any instance of `Model` and it will make a network request.

EmberData takes care of tracking the state of each record for
you. This allows EmberData to treat newly created records differently
from existing records when saving.

By default, EmberData will `POST` newly created records to their type URL.

```javascript
let post = store.createRecord('post', {
  title: 'Rails is Omakase',
  body: 'Lorem ipsum'
});

post.save(); // => POST to '/posts'
```

Records that already exist on the backend are updated using the HTTP `PATCH` verb.

```javascript
store.findRecord('post', 1).then(function(post) {
  post.title; // => "Rails is Omakase"

  post.title = 'A new post';

  post.save(); // => PATCH to '/posts/1'
});
```

You can tell if a record has outstanding changes that have not yet been
saved by checking its
[`hasDirtyAttributes`](https://api.emberjs.com/ember-data/release/classes/Model/properties/hasDirtyAttributes?anchor=hasDirtyAttributes)
property. You can also see which parts of
the record were changed and what the original value was using the
[`changedAttributes()`](https://api.emberjs.com/ember-data/release/classes/Model/methods/changedAttributes?anchor=changedAttributes)
method. `changedAttributes` returns an object, whose keys are the changed
properties and values are an array of values `[oldValue, newValue]`.

```javascript
person.isAdmin; // => false
person.hasDirtyAttributes; // => false
person.isAdmin = true;
person.hasDirtyAttributes; // => true
person.changedAttributes(); // => { isAdmin: [false, true] }
```

At this point, you can either persist your changes via `save()` or you can roll back your changes using [`rollbackAttributes()`](https://api.emberjs.com/ember-data/release/classes/Model/methods/rollbackAttributes?anchor=rollbackAttributes).

```javascript
person.hasDirtyAttributes; // => true
person.changedAttributes(); // => { isAdmin: [false, true] }

person.rollbackAttributes();

person.hasDirtyAttributes; // => false
person.isAdmin; // => false
person.changedAttributes(); // => {}
```

## Handling Validation Errors

If the backend server returns validation errors after trying to save, they will
be available on the `errors` property of your model. Here's how you might display
the errors from saving a blog post in your template:

```handlebars
{{#each this.post.errors.title as |error|}}
  <div class="error">{{error.message}}</div>
{{/each}}
{{#each this.post.errors.body as |error|}}
  <div class="error">{{error.message}}</div>
{{/each}}
```

## Promises

[`save()`](https://api.emberjs.com/ember-data/release/classes/Model/methods/save?anchor=save) returns
a promise, which makes it easy to asynchronously handle success and failure
scenarios. Here's a common pattern:

```javascript
// Assumed to have already injected the router and store services
const newPost = this.store.createRecord('post', {
  title: 'Rails is Omakase',
  body: 'Lorem ipsum'
});

try {
  await newPost.save();
  this.router.transitionTo('posts.show', newPost.id);
} catch (error) {
  // Handle error
}
```

## Deleting Records

Deleting records is as straightforward as creating records. Call [`deleteRecord()`](https://api.emberjs.com/ember-data/release/classes/Model/methods/deleteRecord?anchor=deleteRecord)
on any instance of `Model`. This flags the record as `isDeleted`. The
deletion can then be persisted using `save()`. Alternatively, you can use
the [`destroyRecord`](https://api.emberjs.com/ember-data/release/classes/Model/methods/destroyRecord?anchor=destroyRecord) method to delete and persist at the same time.

```javascript
let post = store.peekRecord('post', 1);
post.deleteRecord();
post.isDeleted; // => true
post.save(); // => DELETE to /posts/1

// OR
post = store.peekRecord('post', 2);
post.destroyRecord(); // => DELETE to /posts/2
```

<!-- eof - needed for pages that end in a code block  -->


---

In EmberData, an Adapter determines how data is persisted to a
backend data store. Things such as the backend host, URL format
and headers used to talk to a REST API can all be configured
in an adapter.

EmberData's default Adapter has some built-in assumptions about
how a [REST API should look](http://jsonapi.org/). If your backend conventions
differ from those assumptions, EmberData allows either slight adjustments
or you can switch to a different adapter if your backend works noticeably
differently.

_(If you're looking to adjust how the data sent to the backend is formatted,
check the [serializer](../customizing-serializers/) page.)_

Extending Adapters is a natural process in EmberData. Ember takes the
position that you should extend an adapter to add different
functionality. This results in code that is
more testable, easier to understand and reduces bloat for people who
may want to subclass your adapter.

If your backend has some consistent rules you can define an
`adapter:application`. The `adapter:application` will get priority over
the default Adapter, however it will still be superseded by model
specific Adapters.

```javascript {data-filename=app/adapters/application.js}
import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  // Application specific overrides go here
}
```

If there is a model that does not follow the backend's typical conventions, you
can create an adapter that is specific to that model. The model-specific adapter
will override the rules in the `application` adapter.

To create a model-specific adapter, run the command `ember generate adapter <model-name>`.
For example, suppose there is a `post` model that needs to talk to the `v1` API
in the backend. We can run `ember generate adapter post` to create the adapter,
then specify the `post` adapter's namespace:

```javascript {data-filename=app/adapters/post.js}
import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class PostAdapter extends JSONAPIAdapter {
  namespace = 'api/v1';
}
```

EmberData comes with several built-in adapters.
Feel free to use these adapters as a starting point for creating your own custom adapter.

- [`Adapter`](https://api.emberjs.com/ember-data/release/classes/Adapter) is the basic adapter
with no functionality. It is generally a good starting point if you
want to create an adapter that is radically different from the other
Ember adapters.

- [`JSONAPIAdapter`](https://api.emberjs.com/ember-data/release/classes/JSONAPIAdapter)
The `JSONAPIAdapter` is the default adapter and follows JSON:API
conventions to communicate with an HTTP server by transmitting JSON
via XHR.

- [`RESTAdapter`](https://api.emberjs.com/ember-data/release/classes/RESTAdapter)
The `RESTAdapter` allows your store to communicate with an HTTP server
by transmitting JSON via XHR. Before EmberData 2.0 this adapter was the default.


## Customizing the JSONAPIAdapter

The
[JSONAPIAdapter](https://api.emberjs.com/ember-data/release/classes/JSONAPIAdapter)
has a handful of hooks that are commonly used to extend it to work
with non-standard backends.

### URL Conventions

The `JSONAPIAdapter` is smart enough to determine the URLs it
communicates with based on the name of the model. For example, if you
ask for a `Post` by ID:

```javascript
store.findRecord('post', 1).then(function(post) {
});
```

The JSON:API adapter will automatically send a `GET` request to `/posts/1`.

The actions you can take on a record map onto the following URLs in the
JSON:API adapter:

<table>
  <thead>
    <tr><th>Action</th><th>HTTP Verb</th><th>URL</th></tr>
  </thead>
  <tbody>
    <tr><th>Find</th><td>GET</td><td>/posts/123</td></tr>
    <tr><th>Find All</th><td>GET</td><td>/posts</td></tr>
    <tr><th>Update</th><td>PATCH</td><td>/posts/123</td></tr>
    <tr><th>Create</th><td>POST</td><td>/posts</td></tr>
    <tr><th>Delete</th><td>DELETE</td><td>/posts/123</td></tr>
  </tbody>
</table>

#### Pluralization Customization

To facilitate pluralizing model names when generating route URLs Ember
Data comes bundled with
[Ember Inflector](https://github.com/stefanpenner/ember-inflector), an
ActiveSupport::Inflector compatible library for inflecting words
between plural and singular forms. Irregular or uncountable
pluralizations can be specified via `Ember.Inflector.inflector`.

To do this, create an [Initializer](../../applications/initializers/) file containing your customizations. The Ember CLI's `initializer` generator can be used `ember generate initializer custom-inflector-rules` to create the file. Update its content as follows:

```javascript {data-filename=app/initializers/custom-inflector-rules.js}
import Inflector from 'ember-inflector';

export function initialize(/* application */) {
  const inflector = Inflector.inflector;

  // Tell the inflector that the plural of "campus" is "campuses"
  inflector.irregular('campus', 'campuses');

  // Tell the inflector that the plural of "advice" is "advice"
  inflector.uncountable('advice');
}

export default {
  name: 'custom-inflector-rules',
  initialize
};
```

The JSON:API adapter will now make requests for `Campus` models to
`/campuses` and `/campuses/1` (instead of `/campus/` and `/campus/1`),
and requests for `advice` to `/advice` and `/advice/1` (instead of
`/advices/` and `/advices/1`).

When specifying irregular inflection rules for compound words, only the final word or phrase should be specified. For example, to specify the plural of `redCow` as `redKine` or `red-cow` as `red-kine`, only the final word segments `cow` and `kine` should be specified:

```javascript
inflector.irregular('cow', 'kine');
```

#### Endpoint Path Customization

The `namespace` property can be used to prefix requests with a
specific URL namespace.

```javascript {data-filename=app/adapters/application.js}
import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = 'api/1';
}
```

Requests for `person` would now target `https://api.emberjs.com/api/1/people/1`.


#### Host Customization

By default, the adapter will target the current domain. If you would
like to specify a new domain you can do so by setting the `host`
property on the adapter.

```javascript {data-filename=app/adapters/application.js}
import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  host = 'https://api.example.com';
}
```

Requests for `person` would now target `https://api.example.com/people/1`.


#### Path Customization

By default, the `JSONAPIAdapter` will attempt to pluralize and dasherize
the model name to generate the path name. If this convention does not
conform to your backend you can override the `pathForType` method.

For example, if you did not want to pluralize model names and needed
underscore_case instead of dash-case you could override the
`pathForType` method like this:

```javascript {data-filename=app/adapters/application.js}
import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  pathForType(type) {
    return type.replace(/-/g, '_'); // blog-post-comment becomes blog_post_comment 
  }
}
```

Requests for `person` would now target `/person/1`.
Requests for `user-profile` would now target `/user_profile/1`.

#### Headers customization

Some APIs require HTTP headers, e.g. to provide an API key. Arbitrary
headers can be set as key/value pairs on the `JSONAPIAdapter`'s `headers`
object and EmberData will send them along with each ajax request.

```javascript {data-filename=app/adapters/application.js}
import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  headers = {
    'API_KEY': 'secret key',
    'ANOTHER_HEADER': 'Some header value'
  };
}
```

You can combine tracked properties with ES6 getters to make `headers` dynamic. For example, you may have a `session` service with a tracked property called `authToken`:

```javascript {data-filename=app/adapters/application.js}
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { service } from '@ember/service';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service session;

  get headers() {
    return {
      'API_KEY': this.session.authToken,
      'ANOTHER_HEADER': 'Some header value'
    };
  }
}
```

[Getters](../../in-depth-topics/autotracking-in-depth/) recompute with each
access, so you could just as easily rely upon another dynamic value such as
`document.cookie`.

```javascript {data-filename=app/adapters/application.js}
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { get } from '@ember/object';

export default class ApplicationAdapter extends JSONAPIAdapter {
  get headers() {
    return {
      'API_KEY': get(document.cookie.match(/apiKey\=([^;]*)/), '1'),
      'ANOTHER_HEADER': 'Some header value'
    };
  }
}
```

## Community Adapters

If none of the built-in EmberData Adapters work for your backend,
be sure to check out some of the community maintained EmberData
Adapters. Some good places to look for EmberData Adapters include:

- [Ember Observer](http://emberobserver.com/categories/data)
- [GitHub](https://github.com/search?q=ember+data+adapter&ref=cmdform)


---

In EmberData, serializers format the data sent to and received from
the backend store. By default, EmberData serializes data using the
[JSON:API](http://jsonapi.org/) format. If your backend uses a different
format, EmberData allows you to customize the serializer or use a
different serializer entirely.

EmberData ships with 3 serializers. The
[`JSONAPISerializer`](https://api.emberjs.com/ember-data/release/classes/JSONAPISerializer)
is the default serializer and works with JSON:API backends. The
[`JSONSerializer`](https://api.emberjs.com/ember-data/release/classes/JSONSerializer)
is a simple serializer for working with single JSON object or arrays of records. The
[`RESTSerializer`](https://api.emberjs.com/ember-data/release/classes/RESTSerializer)
is a more complex serializer that supports sideloading and was the default
serializer before 2.0.

## JSONAPISerializer Conventions

When requesting a record, the `JSONAPISerializer` expects your server
to return a JSON representation of the record that conforms to the
following conventions.


### JSON:API Document

The `JSONAPISerializer` expects the backend to return a JSON:API
Document that follows the JSON:API specification and the conventions
of the examples found in the [JSON:API spec](http://jsonapi.org/format/). This means all
type names should be pluralized and attribute and relationship names
should be dash-cased. For example, if you request a record from
`/people/123`, the response should look like this:

```json
{
  "data": {
    "type": "people",
    "id": "123",
    "attributes": {
      "given-name": "Jeff",
      "family-name": "Atwood"
    }
  }
}
```

A response that contains multiple records may have an array in its
`data` property.

```json
{
  "data": [{
    "type": "people",
    "id": "123",
    "attributes": {
      "given-name": "Jeff",
      "family-name": "Atwood"
    }
  }, {
    "type": "people",
    "id": "124",
    "attributes": {
      "given-name": "Yehuda",
      "family-name": "Katz"
    }
  }]
}
```

### Sideloaded Data

Data that is not a part of the primary request but includes linked
relationships should be placed in an array under the `included`
key. For example, if you request `/articles/1` and the backend also
returned any comments associated with that person the response
should look like this:

```json
{
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON:API paints my bikeshed!"
    },
    "links": {
      "self": "http://example.com/articles/1"
    },
    "relationships": {
      "comments": {
        "data": [
          { "type": "comments", "id": "5" },
          { "type": "comments", "id": "12" }
        ]
      }
    }
  },
  "included": [{
    "type": "comments",
    "id": "5",
    "attributes": {
      "body": "First!"
    },
    "links": {
      "self": "http://example.com/comments/5"
    }
  }, {
    "type": "comments",
    "id": "12",
    "attributes": {
      "body": "I like XML better"
    },
    "links": {
      "self": "http://example.com/comments/12"
    }
  }]
}
```

## Customizing Serializers

EmberData uses the `JSONAPISerializer` by default, but you can
override this default by defining a custom serializer. There are two
ways to define a custom serializer. First, you can define a custom
serializer for your entire application by defining an "application"
serializer.

```javascript {data-filename=app/serializers/application.js}
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
}
```

You can also define a serializer for a specific model. For example, if
you had a `post` model you could also define a `post` serializer:

```javascript {data-filename=app/serializers/post.js}
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class PostSerializer extends JSONAPISerializer {
}
```

To change the format of the data that is sent to the backend store, you can use
the [`serialize()`](https://api.emberjs.com/ember-data/release/classes/JSONAPISerializer/methods/serialize?anchor=serialize)
hook. Let's say that we have this JSON:API response from EmberData:

```json
{
  "data": {
    "id": "1",
    "type": "product",
    "attributes": {
      "name": "My Product",
      "amount": 100,
      "currency": "SEK"
    }
  }
}
```

But our server expects data in this format:

```json
{
  "data": {
    "id": "1",
    "type": "product",
    "attributes": {
      "name": "My Product",
      "cost": {
        "amount": 100,
        "currency": "SEK"
      }
    }
  }
}
```

Here's how you can change the data:

```javascript {data-filename=app/serializers/application.js}
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
  serialize(snapshot, options) {
    let json = super.serialize(...arguments);

    json.data.attributes.cost = {
      amount: json.data.attributes.amount,
      currency: json.data.attributes.currency
    };

    delete json.data.attributes.amount;
    delete json.data.attributes.currency;

    return json;
  }
}
```

Similarly, if your backend store provides data in a format other than JSON:API,
you can use the
[`normalizeResponse()`](https://api.emberjs.com/ember-data/release/classes/JSONAPISerializer/methods/normalizeResponse?anchor=normalizeResponse)
hook. Using the same example as above, if the server provides data that looks
like:

```json
{
  "data": {
    "id": "1",
    "type": "product",
    "attributes": {
      "name": "My Product",
      "cost": {
        "amount": 100,
        "currency": "SEK"
      }
    }
  }
}
```

And we need to change it to look like this:

```json
{
  "data": {
    "id": "1",
    "type": "product",
    "attributes": {
      "name": "My Product",
      "amount": 100,
      "currency": "SEK"
    }
  }
}
```

Here's how we could do it:

```javascript {data-filename=app/serializers/application.js}
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    payload.data.attributes.amount = payload.data.attributes.cost.amount;
    payload.data.attributes.currency = payload.data.attributes.cost.currency;

    delete payload.data.attributes.cost;

    return super.normalizeResponse(...arguments);
  }
}
```

To normalize only a single model, you can use the
[`normalize()`](https://api.emberjs.com/ember-data/release/classes/JSONAPISerializer/methods/normalize?anchor=normalize)
hook similarly.

For more hooks to customize the serializer with, see the [EmberData serializer
API documentation](https://api.emberjs.com/ember-data/release/classes/JSONAPISerializer).

### IDs

In order to keep track of unique records in the store EmberData
expects every record to have an `id` property in the payload. Ids
should be unique for every unique record of a specific type. If your
backend uses a key other than `id` you can use the
serializer's `primaryKey` property to correctly transform the id
property to `id` when serializing and deserializing data.

```javascript {data-filename=app/serializers/application.js}
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
  primaryKey = '_id';
}
```

### Attribute Names

In EmberData the convention is to camelize attribute names on a
model. For example:

```javascript {data-filename=app/models/person.js}
import Model, { attr } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('string') givenName;
  @attr('string') familyName;
  @attr('boolean') isPersonOfTheYear;
}
```

However, the `JSONAPISerializer` expects attributes to be dasherized
in the document payload returned by your server:

```json
{
  "data": {
    "id": "44",
    "type": "people",
    "attributes": {
      "given-name": "Zaphod",
      "family-name": "Beeblebrox",
      "is-person-of-the-year": true
    }
  }
}
```

If the attributes returned by your server use a different convention
you can use the serializer's
[`keyForAttribute()`](https://api.emberjs.com/ember-data/release/classes/JSONAPISerializer/methods/keyForAttribute?anchor=keyForAttribute)
method to convert an attribute name in your model to a key in your JSON
payload. For example, if your backend returned attributes that are
`under_scored` instead of `dash-cased` you could override the `keyForAttribute`
method like this.

```javascript {data-filename=app/serializers/application.js}
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
  keyForAttribute(attr) {
    return attr.replace(/_/g, '-'); // blog_post_comment becomes blog-post-comment 
  }
}
```

Irregular keys can be mapped with a custom serializer. The `attrs`
object can be used to declare a simple mapping between property names
on `Model` records and payload keys in the serialized JSON object
representing the record. An object with the property key can also be
used to designate the attribute's key on the response payload.


If the JSON for `person` has a key of `familyNameOfPerson`, and the
desired attribute name is simply `familyName`, then create a custom
Serializer for the model and override the `attrs` property.

```javascript {data-filename=app/models/person.js}
import Model, { attr } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('string') familyName;
}
```

```javascript {data-filename=app/serializers/person.js}
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class PersonSerializer extends JSONAPISerializer {
  attrs = {
    familyName: 'familyNameOfPerson'
  };
}
```

### Relationships

References to other records should be done by ID. For example, if you
have a model with a `hasMany` relationship:

```javascript {data-filename=app/models/post.js}
import Model, { hasMany } from '@ember-data/model';

export default class PostModel extends Model {
  @hasMany('comment', { async: true }) comments;
}
```

The JSON should encode the relationship as an array of IDs and types:

```json
{
  "data": {
    "type": "posts",
    "id": "1",
    "relationships": {
      "comments": {
        "data": [
          { "type": "comments", "id": "1" },
          { "type": "comments", "id": "2" },
          { "type": "comments", "id": "3" }
        ]
      }
    }
  }
}
```

`Comments` for a `post` can be loaded by `post.get('comments')`. The
JSON:API adapter will send 3 `GET` requests to `/comments/1/`,
`/comments/2/` and `/comments/3/`.

Any `belongsTo` relationships in the JSON representation should be the
dasherized version of the property's name. For example, if you have
a model:

```javascript {data-filename=app/models/comment.js}
import Model, { belongsTo } from '@ember-data/model';

export default class CommentModel extends Model {
  @belongsTo('post') originalPost
}
```

The JSON should encode the relationship as an ID to another record:

```json
{
  "data": {
    "type": "comment",
    "id": "1",
    "relationships": {
      "original-post": {
        "data": { "type": "post", "id": "5" },
      }
    }
  }
}
```
If needed these naming conventions can be overwritten by implementing
the
[`keyForRelationship()`](https://api.emberjs.com/ember-data/release/classes/JSONAPISerializer/methods/keyForRelationship?anchor=keyForRelationship)
method.

```javascript {data-filename=app/serializers/application.js}
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
  keyForRelationship(key, relationship) {
    return key + 'Ids';
  }
}
```


## Creating Custom Transformations

In some circumstances, the built-in attribute types of `string`,
`number`, `boolean`, and `date` may be inadequate. For example, a
server may return a non-standard date format.

EmberData can have new JSON transforms
registered for use as attributes:

```javascript {data-filename=app/transforms/coordinate-point.js}
import Transform from '@ember-data/serializer/transform';
import EmberObject from '@ember/object';

export default class CoordinatePointTransform extends Transform {
  serialize(value) {
    return [value.get('x'), value.get('y')];
  }
  deserialize(value) {
    return EmberObject.create({ x: value[0], y: value[1] });
  }
}
```

```javascript {data-filename=app/models/cursor.js}
import Model, { attr } from '@ember-data/model';

export default class Cursor extends Model {
  @attr('coordinate-point') position;
}
```

When `coordinatePoint` is received from the API, it is
expected to be an array:

```json
{
  cursor: {
    position: [4,9]
  }
}
```

But once loaded on a model instance, it will behave as an object:

```javascript
let cursor = store.findRecord('cursor', 1);
cursor.get('position.x'); //=> 4
cursor.get('position.y'); //=> 9
```

If `position` is modified and saved, it will pass through the
`serialize` function in the transform and again be presented as
an array in JSON.

## JSONSerializer

Not all APIs follow the conventions that the `JSONAPISerializer` uses
with a data namespace and sideloaded relationship records. Some
legacy APIs may return a simple JSON payload that is just the requested
resource or an array of serialized records. The `JSONSerializer` is a
serializer that ships with EmberData that can be used alongside the
`RESTAdapter` to serialize these simpler APIs.

To use it in your application you will need to define a
`serializer:application` that extends the `JSONSerializer`.

```javascript {data-filename=app/serializers/application.js}
import JSONSerializer from '@ember-data/serializer/json';

export default class ApplicationSerializer extends JSONSerializer {
  // ...
}
```

For requests that are only expected to return 1 record
(e.g. `store.findRecord('post', 1)`) the `JSONSerializer` expects the response
to be a JSON object that looks similar to this:

```json
{
  "id": "1",
  "title": "Rails is omakase",
  "tag": "rails",
  "comments": ["1", "2"]
}
```

For requests that are only expected to return 0 or more records
(e.g. `store.findAll('post')` or `store.query('post', { filter: { status: 'draft' } })`)
the `JSONSerializer` expects the response to be a JSON array that
looks similar to this:

```json
[{
  "id": "1",
  "title": "Rails is omakase",
  "tag": "rails",
  "comments": ["1", "2"]
}, {
  "id": "2",
  "title": "I'm Running to Reform the W3C's Tag",
  "tag": "w3c",
  "comments": ["3"]
}]
```

The `JSONAPISerializer` is built on top of the `JSONSerializer` so they share
many of the same hooks for customizing the behavior of the
serialization process. Be sure to check out the
[API docs](https://api.emberjs.com/ember-data/release/classes/JSONSerializer)
for a full list of methods and properties.


## EmbeddedRecordMixin

Although EmberData encourages you to sideload your relationships,
sometimes when working with legacy APIs you may discover you need to
deal with JSON that contains relationships embedded inside other
records. The `EmbeddedRecordsMixin` is meant to help with this problem.

To set up embedded records, include the mixin when extending a
serializer then define and configure embedded relationships.

For example, if your `post` model contained an embedded `author` record
that looks similar to this:


```json
{
  "id": "1",
  "title": "Rails is omakase",
  "tag": "rails",
  "authors": [
    {
      "id": "2",
      "name": "Steve"
    }
  ]
}
```

You would define your relationship like this:

```javascript {data-filename=app/serializers/post.js}
import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class PostSerializer extends JSONSerializer.extend(EmbeddedRecordsMixin) {
  attrs = {
    authors: {
      serialize: 'records',
      deserialize: 'records'
    }
  };
}
```

If you find yourself needing to both serialize and deserialize the
embedded relationship you can use the shorthand option of `{ embedded:
'always' }`. The example above could therefore be expressed as such:

```javascript {data-filename=app/serializers/post.js}
import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class PostSerializer extends JSONSerializer.extend(EmbeddedRecordsMixin) {
  attrs = {
    authors: { embedded: 'always' }
  };
}
```


The `serialize` and `deserialize` keys support 3 values:

* `records` is used to signal that the entire record is expected
* `ids` is used to signal that only the id of the record is expected
* `false` is used to signal that the record is not expected

For example you may find that you want to read an embedded record when
extracting a JSON payload but only include the relationship's id when
serializing the record. This is possible by using the `serialize:
'ids'` option. You can also opt out of serializing a relationship by
setting `serialize: false`.

```javascript {data-filename=app/serializers/post.js}
import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class PostSerializer extends JSONSerializer.extend(EmbeddedRecordsMixin) {
  attrs = {
    author: {
      serialize: false,
      deserialize: 'records'
    },
    comments: {
      deserialize: 'records',
      serialize: 'ids'
    }
  };
}
```

### EmbeddedRecordsMixin Defaults

If you do not overwrite `attrs` for a specific relationship, the
`EmbeddedRecordsMixin` will behave in the following way:

belongsTo: `{ serialize: 'id', deserialize: 'id' }`
hasMany   `{ serialize: false, deserialize: 'ids' }`


There is an option of not embedding JSON in the serialized payload by
using serialize: 'ids'. If you do not want the relationship sent at
all, you can use `serialize: false`.

## Authoring Serializers

If you would like to create a custom serializer, it is recommended that you
start with the `JSONAPISerializer` or `JSONSerializer` and extend one of
those to match your needs.
However, if your payload is extremely different from one of these
serializers you can create your own by extending the `Serializer`
base class.

A serializer has two main roles in EmberData.
First, it is responsible for taking a response from an adapter and
serializing it into the normalized JSON format that EmberData
understands.
Secondly, it transforms snapshots of records into a payload the
adapter will send to the server when creating, updating, or deleting a
record.

### EmberData's Normalized JSON Format

The normalized JSON format that EmberData expects is a
[JSON:API](http://jsonapi.org/) document with a couple of additional
restrictions.

First, it is important to make sure that the `type` name of a record
in the normalized JSON object exactly matches the filename of the
model defined for this record type.
By convention Model names are singular in EmberData, however, the
example type names shown in the
[JSON:API spec](http://jsonapi.org/format/) are pluralized.
The JSON:API spec itself is agnostic about inflection rules, however,
EmberData's own `JSONAPISerializer` assumes types are plural and it
will automatically singularize the types.

Second, attribute and relationship names in the JSON:API document
should exactly match the name and casing of the `@attr`,
`@belongsTo` and `@hasMany`, properties defined on the
Model.

By convention these property names are camelCase in EmberData models.
As with the `type` names, this is different from the example attribute
and relationship names shown in the
[JSON:API spec](http://jsonapi.org/format/).
The examples in the spec use dash-case for attribute and relationship
names. However, the spec does not require attribute or relationship
names to follow any specific casing convention.
If you are using EmberData's own `JSONAPISerializer` it will assume
the attribute and relationship names from your API are dash-case and
automatically transform them to camelCase when it creates the
normalized JSON object.

Other than these two restrictions, EmberData's normalized JSON object
follows the [JSON:API](http://jsonapi.org/) specification.

Example: given this `post` model.

```javascript {data-filename=app/models/post.js}
import Model, { attr, hasMany } from '@ember-data/model';

export default class Post extends Model {
  @attr('string') title;
  @attr('string') tag;
  @hasMany('comment', { async: false }) comments;
  @hasMany('post') relatedPosts;
}
```

The normalized JSON object that EmberData expects a serializer to
return looks like this:

```json
{
  data: {
    id: "1",
    type: "post",
    attributes: {
      title: "Rails is omakase",
      tag: "rails",
    },
    relationships: {
      comments: {
        data: [{ id: "1", type: "comment" },
               { id: "2", type: "comment" }],
      },
      relatedPosts: {
        links: {
          related: "/api/v1/posts/1/related-posts/"
        }
      }
    }
}
```

Note that the type is `"post"` to match the post model and the
`relatedPosts` relationship in the document matches the
`relatedPosts: hasMany('post')` on the model.

### Normalizing adapter responses

When creating a custom serializer you will need to define a
[normalizeResponse](https://api.emberjs.com/ember-data/release/classes/Serializer/methods/normalizeResponse?anchor=normalizeResponse)
method to transform the response from the adapter into the normalized
JSON object described above.

This method receives the `store`, the Model class for the request, the
payload, the id of the record request (or `null` if there is
no id associated with the request), and the request type (a string with
the possible values of: `'findRecord'`, `'queryRecord'`, `'findAll'`,
`'findBelongsTo'`, `'findHasMany'`, `'findMany'`, `'query'`,
`'createRecord'`, `'deleteRecord'`, and `'updateRecord'`) as arguments.

A custom serializer will also need to define a
[normalize](https://api.emberjs.com/ember-data/release/classes/Serializer/methods/normalize?anchor=normalize)
method.
This method is called by `store.normalize(type, payload)` and is often
used for normalizing requests made outside of EmberData because they
do not fall into the normal CRUD flow that the adapter provides.

### Serializing records

Finally a serializer will need to implement a
[serialize](https://api.emberjs.com/ember-data/release/classes/Serializer/methods/serialize?anchor=serialize)
method.
EmberData will provide a record snapshot and an options hash and this
method should return an object that the adapter will send to the
server when creating, updating or deleting a record.


## Community Serializers

If none of the built-in EmberData Serializers work for your backend,
be sure to check out some of the community maintained EmberData
Adapters and Serializers.
A good place to search for them is
[Ember Observer](http://emberobserver.com/categories/data).


---

A model is a class that defines the properties and behavior of the
data that you present to the user. Anything that the user expects to see
if they leave your app and come back later (or if they refresh the page)
should be represented by a model.

When you want a new model for your application you need to create a new file
under the models folder and extend from `Model`. This is more conveniently
done by using one of Ember CLI's generator commands. For instance, let's create
a `person` model:

```bash
ember generate model person
```

This will generate the following file:

```javascript {data-filename=app/models/person.js}
import Model from '@ember-data/model';

export default class PersonModel extends Model {
}
```

After you have defined a model class, you can start [finding](../finding-records/)
and [working with records](../creating-updating-and-deleting-records/) of that type.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        EmberData models are normally setup using the singular form (which is why we use `person` instead of `people` here)
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Defining Attributes

The `person` model we generated earlier didn't have any attributes. Let's
add first and last name, as well as the birthday, using [`attr`](https://api.emberjs.com/ember-data/release/functions/@ember-data%2Fmodel/attr):

```javascript {data-filename=app/models/person.js}
import Model, { attr } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr title;
  @attr name;
  @attr birthday;
}
```

Attributes are used when turning the JSON payload returned from your
server into a record, and when serializing a record to save back to the
server after it has been modified.

You can use attributes like any other property, including from within [getter functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get).

```javascript {data-filename=app/models/person.js}
import Model, { attr } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr title;
  @attr name;

  get fullName() {
    return `${this.title} ${this.name}`;
  }
}
```

### Transforms

You may find the type of an attribute returned by the server does not
match the type you would like to use in your JavaScript code. Ember
Data allows you to define simple serialization and deserialization
methods for attribute types called transforms. You can specify that
you would like a transform to run for an attribute by providing the
transform name as the first argument to the `attr` method. EmberData
supports attribute types of `string`, `number`, `boolean`, and `date`,
which coerce the value to the JavaScript type that matches its name.

```javascript {data-filename=app/models/person.js}
import Model, { attr } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('string') name;
  @attr('number') age;
  @attr('boolean') admin;
  @attr('date') birthday;
}
```

The `date` transform will transform an
[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) string to a JavaScript
date object.

The `boolean` transform can handle values other than `true` or
`false`. The strings `"true"` or `"t"` in any casing, `"1"`, and the number
`1` will all coerce to `true`, and `false` otherwise.

Transforms are not required. If you do not specify a transform name
EmberData will do no additional processing of the value.

#### Custom Transforms

You can also create custom transforms with Ember CLI's `transform` generator:

```bash
ember generate transform dollars
```

Here is a simple transform that converts values between cents and US dollars.

```javascript {data-filename=app/transforms/dollars.js}
import Transform from '@ember-data/serializer/transform';

export default class DollarsTransform extends Transform {
  deserialize(serialized) {
    return serialized / 100; // returns dollars
  }

  serialize(deserialized) {
    return deserialized * 100; // returns cents
  }
}
```

A transform has two functions: `serialize` and `deserialize`. Deserialization
converts a value to a format that the client expects. Serialization does the
reverse and converts a value to the format expected by the persistence layer.

You would use the custom `dollars` transform like this:

```javascript {data-filename=app/models/product.js}
import Model, { attr } from '@ember-data/model';

export default class ProductModel extends Model {
  @attr('dollars') spent;
}
```

### Options

`attr` can also take a hash of options as a second parameter. At the moment
the only option available is `defaultValue`, which can use a value or a function
to set the default value of the attribute if one is not supplied.

In the following example we define that `verified` has a default value of
`false` and `createdAt` defaults to the current date at the time of the model's
creation:

```javascript {data-filename=app/models/user.js}
import Model, { attr } from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') username;
  @attr('string') email;
  @attr('boolean', { defaultValue: false }) verified;
  @attr('date', {
    defaultValue() { return new Date(); }
  }) createdAt;
}
```

### Read-only Attributes

When the API returns a deeply nested, read-only object or array,
there is no need to create multiple models with `attr('hasMany')` or `attr('belongsTo')`
relationships. This could result in a potentially large amount of unnecessary
code. You can access these objects in the template without transforming them. This can be
done by using `@attr` without specifying a transform:

```javascript {data-filename=app/models/place.js}
import Model, { attr } from '@ember-data/model';

export default class PlaceModel extends Model {
  @attr location; // a read-only object
  @attr tags; // a read-only array
}
```

```handlebars
{{@model.location.latitude}}
```

<!-- eof - needed for pages that end in a code block  -->


---

The EmberData store provides an interface for retrieving records of a single type.

### Retrieving a Single Record

Use [`store.findRecord()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/findRecord?anchor=findRecord) to retrieve a record by its type and ID.
This will return a promise that fulfills with the requested record:

```javascript
// GET /blog-posts/1
this.store.findRecord('blog-post', 1)  // => GET /blog-posts/1
  .then(function(blogPost) {
      // Do something with `blogPost`
  });
```

Use [`store.peekRecord()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/peekRecord?anchor=peekRecord) to retrieve a record by its type and ID, without making a network request.
This will return the record only if it is already present in the store:

```javascript
let blogPost = this.store.peekRecord('blog-post', 1); // => no network request
```

### Retrieving Multiple Records

Use [`store.findAll()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/findAll?anchor=findAll) to retrieve all of the records for a given type:

```javascript
// GET /blog-posts
this.store.findAll('blog-post') // => GET /blog-posts
  .then(function(blogPosts) {
    // Do something with `blogPosts`
  });
```

Use [`store.peekAll()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/peekAll?anchor=peekAll) to retrieve all of the records for a given type that are already loaded into the store, without making a network request:

```javascript
let blogPosts = this.store.peekAll('blog-post'); // => no network request
```

`store.findAll()` returns a `PromiseArray` that fulfills to a `RecordArray` and `store.peekAll` directly returns a `RecordArray`.

It's important to note that `RecordArray` is not a JavaScript array, it's an object that implements [`MutableArray`](https://api.emberjs.com/ember/release/classes/MutableArray).
This is important because, for example, if you want to retrieve records by index,
the `[]` notation will not work--you'll have to use `objectAt(index)` instead.

### Querying for Multiple Records

EmberData provides the ability to query for records that meet certain criteria.
Calling [`store.query()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/query?anchor=query) will make a `GET` request with the passed object serialized as query params.
This method returns a `PromiseArray` in the same way as `findAll`.

For example, we could search for all `person` models who have the name of
`Peter`:

```javascript
// GET to /persons?filter[name]=Peter
this.store.query('person', {
  filter: {
    name: 'Peter'
  }
}).then(function(peters) {
  // Do something with `peters`
});
```

### Querying for A Single Record

If you are using an adapter that supports server requests capable of returning a single model object,
EmberData provides a convenience method [`store.queryRecord()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/queryRecord?anchor=queryRecord) that will return a promise that resolves with that single record.
The request is made via a method `queryRecord()` defined by the adapter.

For example, if your server API provides an endpoint for the currently logged in user:

```text
// GET /api/current_user
{
  user: {
    id: 1234,
    username: 'admin'
  }
}
```

And if the adapter for the `User` model defines a `queryRecord()` method that targets that endpoint:

```javascript {data-filename=app/adapters/user.js}
import Adapter from '@ember-data/adapter';
import fetch from 'fetch';

export default class UserAdapter extends Adapter {
  queryRecord(store, type, query) {
    return fetch('/api/current_user');
  }
}
```

Then, calling [`store.queryRecord()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/queryRecord?anchor=queryRecord) will retrieve that object from the server:

```javascript
store.queryRecord('user', {}).then(function(user) {
  let username = user.get('username');
  console.log(`Currently logged in as ${username}`);
});
```

As in the case of `store.query()`, a query object can also be passed to `store.queryRecord()` and is available for the adapter's `queryRecord()` to use to qualify the request.
However the adapter must return a single model object, not an array containing one element,
otherwise EmberData will throw an exception.

Note that Ember's default [JSON:API adapter](https://api.emberjs.com/ember-data/release/classes/JSONAPIAdapter) does not provide the functionality needed to support `queryRecord()` directly as it relies on REST request definitions that return result data in the form of an array.

If your server API or your adapter only provides array responses but you wish to retrieve just a single record, you can alternatively use the `query()` method as follows:

```javascript
// GET to /users?filter[email]=tomster@example.com
tom = store.query('user', {
  filter: {
    email: 'tomster@example.com'
  }
}).then(function(users) {
  return users[0]; // the first object
});
```

<!-- eof - needed for pages that end in a code block  -->


---

Along with the records returned from your store, you'll likely need to handle some kind of metadata. _Metadata_ is data that goes along with a specific _model_ or _type_ instead of a record.

Pagination is a common example of using metadata. Imagine a blog with far more posts than you can display at once. You might query it like so:

```javascript
let result = this.store.query('post', {
  limit: 10,
  offset: 0
});
```

To get different _pages_ of data, you'd simply change your offset in increments of 10. So far, so good. But how do you know how many pages of data you have? Your server would need to return the total number of records as a piece of metadata.

Each serializer will expect the metadata to be returned differently. For example, EmberData's JSON deserializer looks for a `meta` key:

```javascript
{
  "post": {
    "id": 1,
    "title": "Progressive Enhancement is Dead",
    "comments": ["1", "2"],
    "links": {
      "user": "/people/tomdale"
    },
    // ...
  },

  "meta": {
    "total": 100
  }
}
```

Regardless of the serializer used, this metadata is extracted from the response. You can then read it with `.meta`.

This can be done on the result of a `store.query()` call:

```javascript
store.query('post').then(result => {
  let meta = result.meta;
});
```

On a belongsTo relationship:

```javascript
let post = store.peekRecord('post', 1);

let author = await post.author;
let meta = author.meta;
```

Or on a hasMany relationship:

```javascript
let post = store.peekRecord('post', 1);

let comments = await post.comments;
let meta = comments.meta;
```

After reading it, `meta.total` can be used to calculate how many pages of posts you'll have.

To use the `meta` data outside of the `model` hook, you need to return it:

```javascript {data-filename=app/routes/users.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class UsersRoute extends Route {
  @service store;
  
  model() {
    return this.store.query('user', {}).then((results) => {
      return {
        users: results,
        meta: results.meta
      };
    });
  }
  setupController(controller, { users, meta }) {
    super.setupController(controller, users);
    controller.meta = meta;
  }
}
```

To customize metadata extraction, check out the documentation for your serializer.


---

This section of the Guides describes the essential features of Ember
Data, a powerful set of tools
for formatting requests, normalizing responses, and efficiently
managing a local cache of data.

Ember.js itself works with any type of back end: REST,
JSON:API, GraphQL, or anything else.
To learn about other ways to handle data and to find extensions,
check out the guide for [making API requests](../in-depth-topics/making-api-requests/),
look for plugins on [Ember Observer](https://www.emberobserver.com/), and search
for community-made tutorials.

## What are EmberData models?

In EmberData, models are objects that represent the underlying data
that your application presents to the user.
Note that EmberData models are a different concept than the
[`model`](../routing/specifying-a-routes-model/) method on Routes,
although they share the same name.

Different apps may have very
different models, depending on what problems they're trying to solve.
For example, a photo sharing application might have a `Photo`
model to represent a particular photo, and a `PhotoAlbum` that
represents a group of photos. In contrast, an online shopping app would
probably have different models, like `ShoppingCart`, `Invoice`, or
`LineItem`.

Models tend to be _persistent_. That means the user does not expect
model data to be lost when they close their browser window. To make sure
no data is lost, if the user makes changes to a model, you need to store
the model data somewhere that it will not be lost.

Typically, most models are loaded from and saved to a server that uses a
database to store data. Usually you will send JSON representations of
models back and forth to an HTTP server that you have written. However,
Ember makes it easy to use other durable storage, such as saving to the
user's hard disk with [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), or hosted storage solutions that let you
avoid writing and hosting your own servers.

Once you've loaded your models from storage, components know how to
translate model data into a UI that your user can interact with. For
more information about how components get model data, see the
[Specifying a Route's Model](../routing/specifying-a-routes-model/)
guide.

At first, using EmberData may feel different than the way you're used
to writing JavaScript applications. Many developers are familiar with
using Ajax to fetch raw JSON data from an endpoint, which may appear
easy at first. Over time, however, complexity leaks out into your
application code, making it hard to maintain.

With EmberData, managing models as your application grows becomes both
simpler _and_ easier.

Once you have an understanding of EmberData, you will have a much
better way to manage the complexity of data loading in your application.
This will allow your code to evolve and grow, with better maintainability.

## EmberData flexibility

Thanks to its use of the _adapter pattern_, EmberData can be configured
to work with many different kinds of backends. There is [an entire ecosystem of adapters](http://emberobserver.com/categories/ember-data-adapters)
and several [built-in adapters](./customizing-adapters/)
that allow your Ember app to talk to different types of servers.

By default, EmberData is designed to work out of the box with [JSON:API](http://jsonapi.org).
JSON:API is a formal specification for building conventional, robust, and performant
APIs that allow clients and servers to communicate model data.

JSON:API standardizes how JavaScript applications talk to servers, so
you decrease the coupling between your frontend and backend, and have
more freedom to change pieces of your stack.

If you need to integrate your Ember.js app with a server that does not
have an [adapter](http://emberobserver.com/categories/ember-data-adapters) available (for example, you hand-rolled an API server
that does not adhere to any JSON specification), EmberData is designed
to **be configurable** to work with whatever data your server returns.

EmberData is also designed to work with streaming servers, like those
powered by WebSockets. You can open a socket to your server and push
changes into EmberData whenever they occur, giving your app a real-time
user interface that is always up-to-date.

## The Store and a Single Source of Truth

One common way of building web applications is to tightly couple user
interface elements to data fetching. For example, imagine you are
writing the admin section of a blogging app, which has a feature that
lists the drafts for the currently logged in user.

You might be tempted to make the component responsible for fetching that
data and storing it:

```javascript {data-filename=app/components/list-of-drafts.js}
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import fetch from "fetch";

export default class ListOfDraftsComponent extends Component {
  @tracked drafts;

  constructor() {
    super(...arguments);

    fetch("/drafts").then((data) => {
      this.drafts = data;
    });
  }
}
```

You could then show the list of drafts in your component's template like
this:

```handlebars {data-filename=app/components/list-of-drafts.hbs}
<ul>
  {{#each this.drafts key="id" as |draft|}}
    <li>{{draft.title}}</li>
  {{/each}}
</ul>
```

This works great for the `list-of-drafts` component. However, your app
is likely made up of many different components. On another page you
may want a component to display the number of drafts. You may be
tempted to copy and paste your existing `willRender` code into the new
component.

```javascript {data-filename=app/components/drafts-button.js}
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import fetch from "fetch";

export default class DraftsButtonComponent extends Component {
  @tracked drafts;

  constructor() {
    super(...arguments);

    fetch("/drafts").then((data) => {
      this.drafts = data;
    });
  }
}
```

```handlebars {data-filename=app/components/drafts-button.hbs}
<LinkTo @route="drafts">
  Drafts ({{this.drafts.length}})
</LinkTo>
```

Unfortunately, the app will now make two separate requests for the
same information. Not only is the redundant data fetching costly in
terms of wasted bandwidth and affecting the perceived speed of your
app, it's easy for the two values to get out-of-sync. You yourself
have probably used a web application where the list of items gets out
of sync with the counter in a toolbar, leading to a frustrating and
inconsistent experience.

There is also a _tight coupling_ between your application's UI and the
network code. If the URL or the format of the JSON payload changes, it
is likely to break all of your UI components in ways that are hard to
track down.

The SOLID principles of good design tell us that objects should have a
single responsibility. The responsibility of a component should be
presenting model data to the user, not fetching the model.

Good Ember apps take a different approach. EmberData gives you a single
**store** that is the central repository of models in your application.
Routes and their corresponding controllers can ask the store for models, and the store is
responsible for knowing how to fetch them.

It also means that the store can detect that two different components
are asking for the same model, allowing your app to only fetch the data
from the server once. You can think of the store as a read-through cache
for your app's models. Both routes and their corresponding controllers have access to
this shared store; when they need to display or modify a model, they
first ask the store for it.

### Injecting the store

EmberData provides a store service that you can inject into routes, components, services and other classes, that enables you to access the store directly.

To do this, import the [`service` decorator](https://api.emberjs.com/ember/release/functions/@ember%2Fservice/service) and inject a `store` property into your class. Let's see an example using a route:

```javascript
import Route from "@ember/routing/route";
import { service } from "@ember/service";

export default class BlogPostsIndexRoute extends Route {
  @service store;

  model() {
    return this.store.findAll("posts");
  }
}
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        You can read more about service injection in the <a href="../services/#toc_accessing-services"><i>Accessing Services</i></a> guide.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Models

In EmberData, each model is represented by a subclass of `Model` that
defines the attributes, relationships, and behavior of the data that you
present to the user.

Models define the type of data that will be provided by your server. For
example, a `Person` model might have a `name` attribute that is a
string, and a `birthday` attribute that is a date:

```javascript {data-filename=app/models/person.js}
import Model, { attr } from "@ember-data/model";

export default class PersonModel extends Model {
  @attr("string") name;
  @attr("date") birthday;
}
```

A model also describes its relationships with other objects. For
example, an `order` may have many `line-items`, and a
`line-item` may belong to a particular `order`.

```javascript {data-filename=app/models/order.js}
import Model, { hasMany } from "@ember-data/model";

export default class OrderModel extends Model {
  @hasMany("line-item") lineItems;
}
```

```javascript {data-filename=app/models/line-item.js}
import Model, { belongsTo } from "@ember-data/model";

export default class LineItemModel extends Model {
  @belongsTo("order") order;
}
```

Models don't have any data themselves, they define the attributes,
relationships and behavior of specific instances, which are called
**records**.

## Records

A **record** is an instance of a model that contains data loaded from a
server. Your application can also create new records and save them back
to the server.

A record is uniquely identified by its model **type** and **ID**.

For example, if you were writing a contact management app, you might
have a `Person` model. An individual record in your app might
have a type of `person` and an ID of `1` or `steve-buscemi`.

```javascript
this.store.findRecord("person", 1); // => { id: 1, name: 'steve-buscemi' }
```

An ID is usually assigned to a record by the server when you save it for
the first time, but you can also generate IDs client-side.

## Adapter

An **adapter** is an object that translates requests from Ember (such as
"find the user with an ID of 1") into requests to a server.

For example, if your application asks for a `Person` with an ID of
`1`, how should Ember load it? Over HTTP or a WebSocket? If
it's HTTP, is the URL `/person/1` or `/resources/people/1`?

The adapter is responsible for answering all of these questions.
Whenever your app asks the store for a record that it doesn't have
cached, it will ask the adapter for it. If you change a record and save
it, the store will hand the record to the adapter to send the
appropriate data to your server and confirm that the save was
successful.

Adapters let you completely change how your API is implemented without
impacting your Ember application code.

## Caching

The store will automatically cache records for you. If a record had already
been loaded, asking for it a second time will always return the same
object instance. This minimizes the number of round-trips to the
server, and allows your application to render its UI to the user as fast as
possible.

For example, the first time your application asks the store for a
`person` record with an ID of `1`, it will fetch that information from
your server.

However, the next time your app asks for a `person` with ID `1`, the
store will notice that it had already retrieved and cached that
information from the server. Instead of sending another request for the
same information, it will give your application the same record it had
provided it the first time. This feature—always returning the same
record object, no matter how many times you look it up—is sometimes
called an _identity map_.

Using an identity map is important because it ensures that changes you
make in one part of your UI are propagated to other parts of the UI. It
also means that you don't have to manually keep records in sync—you can
ask for a record by ID and not have to worry about whether other parts
of your application have already asked for and loaded it.

One downside to returning a cached record is you may find the state of
the data has changed since it was first loaded into the store's
identity map. In order to prevent this stale data from being a problem
for long, EmberData will automatically make a request in the
background each time a cached record is returned from the store. When
the new data comes in, the record is updated, and if there have been
changes to the record since the initial render, the template is
re-rendered with the new information.

## Architecture Overview

The first time your application asks the store for a record, the store
sees that it doesn't have a local copy and requests it from your
adapter. Your adapter will go and retrieve the record from your
persistence layer; typically, this will be a JSON representation of the
record served from an HTTP server.

![Diagram showing process for finding an unloaded record](/images/guides/models/finding-unloaded-record-step1-diagram.png)

As illustrated in the diagram above, the adapter cannot always return the
requested record immediately. In this case, the adapter must make an
_asynchronous_ request to the server, and only when that request finishes
loading can the record be created with its backing data.

Because of this asynchronicity, the store immediately returns a
_promise_ from the `findRecord()` method. Similarly, any request that the
store makes to the adapter also returns promises.

Once the request to the server returns with a JSON payload for the
requested record, the adapter resolves the promise it returned to the
store with the JSON.

The store then takes that JSON, initializes the record with the
JSON data, and resolves the promise returned to your application
with the newly-loaded record.

![Diagram showing process for finding an unloaded record after the payload has returned from the server](/images/guides/models/finding-unloaded-record-step2-diagram.png)

Let's look at what happens if you request a record that the store
already has in its cache.

![Diagram showing process for finding an unloaded record after the payload has returned from the server](/images/guides/models/finding-loaded-record-diagram.png)

In this case, because the store already knew about the record, it
returns a promise that it resolves with the record immediately. It does
not need to ask the adapter (and, therefore, the server) for a copy
since it already has it saved locally.

---

Models, records, adapters and the store are the core concepts you
should understand to get the most out of EmberData. The following
sections go into more depth about each of these concepts, and how to
use them together.


---

One way to think about the store is as a cache of all of the records
that have been loaded by your application. If a route or a controller in
your app asks for a record, the store can return it immediately if it is
in the cache. Otherwise, the store must ask the adapter to load it,
which usually means a trip over the network to retrieve it from the
server.

Instead of waiting for the app to request a record, however, you can
push records into the store's cache ahead of time.

This is useful if you have a good sense of what records the user
will need next. When they click on a link, instead of waiting for a
network request to finish, Ember.js can render the new template
immediately. It feels instantaneous.

Another use case for pushing in records is if your application has a
streaming connection to a backend. If a record is created or modified,
you want to update the UI immediately.

### Pushing Records

To push a record into the store, call the store's [`push()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/push?anchor=push) method.

For example, imagine we want to preload some data into the store when
the application boots for the first time.

We can use the `route:application` to do so. The `route:application` is
the top-most route in the route hierarchy, and its `model` hook gets
called once when the app starts up.

```javascript {data-filename=app/models/album.js}
import Model, { attr } from '@ember-data/model';

export default class AlbumModel extends Model {
  @attr title;
  @attr artist;
  @attr songCount;
}
```

```javascript {data-filename=app/routes/application.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service store;
  
  model() {
    this.store.push({
      data: [{
        id: 1,
        type: 'album',
        attributes: {
          title: 'Fewer Moving Parts',
          artist: 'David Bazan',
          songCount: 10
        },
        relationships: {}
      }, {
        id: 2,
        type: 'album',
        attributes: {
          title: 'Calgary b/w I Can\'t Make You Love Me/Nick Of Time',
          artist: 'Bon Iver',
          songCount: 2
        },
        relationships: {}
      }]
    });
  }
}
```

The store's `push()` method is a low level API which accepts a JSON
API document with a few important differences from the JSON:API
document that the JSONAPISerializer accepts. The type name in the JSON
API document must match the type name of the model exactly (In the
example above the type is `album` because the model is defined in
`app/models/album.js`). Attributes and relationship names must match
the casing of the properties defined on the Model class.

If you would like the data to be normalized by the model's default
serializer before pushing it into the store, you can use the
[`store.pushPayload()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/pushPayload?anchor=pushPayload) method.

```javascript {data-filename=app/serializers/album.js}
import RESTSerializer from '@ember-data/serializer/rest';

export default class AlbumSerializer extends RESTSerializer {
  normalize(typeHash, hash) {
    hash['songCount'] = hash['song_count']
    delete hash['song_count']
    return super.normalize(typeHash, hash);
  }
}
```

```javascript {data-filename=app/routes/application.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service store;

  model() {
    this.store.pushPayload({
      albums: [
        {
          id: 1,
          title: 'Fever Moving Parts',
          artist: 'David Bazan',
          song_count: 10
        },
        {
          id: 2,
          title: 'Calgary b/w I Can\'t Make You Love Me/Nick Of Time',
          artist: 'Bon Iver',
          song_count: 2
        }
      ]
    });
  }
}
```

The `push()` method is also important when working with complex
endpoints. You may find your application has an endpoint that performs
some business logic then creates several records. This likely does not
map cleanly to EmberData's existing `save()` API which is structured
around persisting a single record. Instead you should make your own
custom network request and push the resulting model data into the store
so it can be accessed by other parts of your application.


```javascript {data-filename=app/routes/confirm-payment.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';
import fetch from 'fetch';

export default class ConfirmPaymentRoute extends Route {
  @service store;
  @service router;
  
  @action
  confirm(data) {
    fetch('process-payment', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(digitalInventory => {
      this.store.push(digitalInventory);
      this.router.transitionTo('thank-you');
    });
  }
}
```

Properties that are defined on the model but are omitted in the
normalized JSON:API document object will not be updated. Properties
that are included in the normalized JSON:API document object but not
defined on the Model will be ignored.


---

EmberData includes several built-in relationship types to help you
define how your models relate to each other.

### One-to-One

To declare a one-to-one relationship between two models, use
`belongsTo`:

```javascript {data-filename=app/models/user.js}
import Model, { belongsTo } from '@ember-data/model';

export default class UserModel extends Model {
  @belongsTo('profile') profile;
}
```

```javascript {data-filename=app/models/profile.js}
import Model, { belongsTo } from '@ember-data/model';

export default class ProfileModel extends Model {
  @belongsTo('user') user;
}
```

### One-to-Many

To declare a one-to-many relationship between two models, use
`belongsTo` in combination with `hasMany`, like this:

```javascript {data-filename=app/models/blog-post.js}
import Model, { hasMany } from '@ember-data/model';

export default class BlogPostModel extends Model {
  @hasMany('comment') comments;
}
```

```javascript {data-filename=app/models/comment.js}
import Model, { belongsTo } from '@ember-data/model';

export default class CommentModel extends Model {
  @belongsTo('blog-post') blogPost;
}
```

### Many-to-Many

To declare a many-to-many relationship between two models, use
`hasMany`:

```javascript {data-filename=app/models/blog-post.js}
import Model, { hasMany } from '@ember-data/model';

export default class BlogPostModel extends Model {
  @hasMany('tag') tags;
}
```

```javascript {data-filename=app/models/tag.js}
import Model, { hasMany } from '@ember-data/model';

export default class TagModel extends Model {
  @hasMany('blog-post') blogPosts;
}
```

### Explicit Inverses

EmberData will do its best to discover which relationships map to one
another. In the one-to-many code above, for example, EmberData can figure out that
changing the `comments` relationship should update the `blogPost`
relationship on the inverse because `blogPost` is the only relationship to
that model.

However, sometimes you may have multiple `belongsTo`/`hasMany`s for
the same type. You can specify which property on the related model is
the inverse using `belongsTo` or `hasMany`'s `inverse`
option. Relationships without an inverse can be indicated as such by
including `{ inverse: null }`.

```javascript {data-filename=app/models/comment.js}
import Model, { belongsTo } from '@ember-data/model';

export default class CommentModel extends Model {
  @belongsTo('blog-post', { inverse: null }) onePost;
  @belongsTo('blog-post') twoPost;
  @belongsTo('blog-post') redPost;
  @belongsTo('blog-post') bluePost;
}
```

```javascript {data-filename=app/models/blog-post.js}
import Model, { hasMany } from '@ember-data/model';

export default class BlogPostModel extends Model {
  @hasMany('comment', {
    inverse: 'redPost'
  })
  comments;
}
```

### Reflexive Relations

When you want to define a reflexive relation (a model that has a relationship to
itself), you must explicitly define the inverse relationship. If there
is no inverse relationship then you can set the inverse to `null`.

Here's an example of a one-to-many reflexive relationship:

```javascript {data-filename=app/models/folder.js}
import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class FolderModel extends Model {
  @hasMany('folder', { inverse: 'parent' }) children;
  @belongsTo('folder', { inverse: 'children' }) parent;
}
```

Here's an example of a one-to-one reflexive relationship:

```javascript {data-filename=app/models/user.js}
import Model, { attr, belongsTo } from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') name;
  @belongsTo('user', { inverse: 'bestFriend' }) bestFriend;
}
```

You can also define a reflexive relationship that doesn't have an inverse:

```javascript {data-filename=app/models/folder.js}
import Model, { belongsTo } from '@ember-data/model';

export default class FolderModel extends Model {
  @belongsTo('folder', { inverse: null }) parent;
}
```

### Polymorphism

Polymorphism is a powerful concept which allows a developer
to abstract common functionality into a base class. Consider the
following example: a user with multiple payment methods. They
could have a linked PayPal account, and a couple credit cards on
file.

Note that, for polymorphism to work, EmberData expects a
"type" declaration polymorphic type via the reserved `type`
property on the model. Confused? See the API response below.

First, let's look at the model definitions:

```javascript {data-filename=app/models/user.js}
import Model, { hasMany } from '@ember-data/model';

export default class UserModel extends Model {
  @hasMany('payment-method', { polymorphic: true }) paymentMethods;
}
```

```javascript {data-filename=app/models/payment-method.js}
import Model, { belongsTo } from '@ember-data/model';

export default class PaymentMethodModel extends Model {
  @belongsTo('user', { inverse: 'paymentMethods' }) user;
}
```

```javascript {data-filename=app/models/payment-method-cc.js}
import { attr } from '@ember-data/model';
import PaymentMethod from './payment-method';

export default class PaymentMethodCcModel extends PaymentMethod {
  @attr last4;

  get obfuscatedIdentifier() {
    return `**** **** **** ${this.last4}`;
  }
}
```

```javascript {data-filename=app/models/payment-method-paypal.js}
import { attr } from '@ember-data/model';
import PaymentMethod from './payment-method'

export default class PaymentMethodPaypalModel extends PaymentMethod {
  @attr linkedEmail;

  get obfuscatedIdentifier() {
    let last5 = this.linkedEmail
      .split('')
      .reverse()
      .slice(0, 5)
      .reverse()
      .join('');

    return `••••${last5}`;
  }
}
```

And our API might setup these relationships like so:

```json
{
  "data": {
    "id": "8675309",
    "type": "user",
    "attributes": {
      "name": "Anfanie Farmeo"
    },
    "relationships": {
      "payment-methods": {
        "data": [
          {
            "id": "1",
            "type": "payment-method-paypal"
          },
          {
            "id": "2",
            "type": "payment-method-cc"
          },
          {
            "id": "3",
            "type": "payment-method-apple-pay"
          }
        ]
      }
    }
  },
  "included": [
    {
      "id": "1",
      "type": "payment-method-paypal",
      "attributes": {
        "linked-email": "ryan@gosling.io"
      }
    },
    {
      "id": "2",
      "type": "payment-method-cc",
      "attributes": {
        "last4": "1335"
      }
    },
    {
      "id": "3",
      "type": "payment-method-apple-pay",
      "attributes": {
        "last4": "5513"
      }
    }
  ]
}
```

### Readonly Nested Data

Some models may have properties that are deeply nested objects of
readonly data. The naïve solution would be to define models for each
nested object and use `hasMany` and `belongsTo` to recreate the nested
relationship. However, since readonly data will never need to be
updated and saved this often results in the creation of a great deal
of code for very little benefit. An alternate approach is to define
these relationships using an attribute with no transform
(`@attr`). This makes it easy to access readonly values in
other objects and templates without the overhead of defining
extraneous models.

### Creating Records

Let's assume that we have a `blog-post` and a `comment` model. A single blog post can have several comments linked to it. The correct relationship is shown below:

```javascript {data-filename=app/models/blog-post.js}
import Model, { hasMany } from '@ember-data/model';

export default class BlogPostModel extends Model {
  @hasMany('comment') comments;
}
```

```javascript {data-filename=app/models/comment.js}
import Model, { belongsTo } from '@ember-data/model';

export default class CommentModel extends Model {
  @belongsTo('blog-post') blogPost;
}
```

Now, suppose we want to add comments to an existing blogPost. We can do this in two ways, but for both of them, we first need to look up a blog post that is already loaded in the store, using its id:

```javascript
let myBlogPost = this.store.peekRecord('blog-post', 1);
```

Now we can either set the `belongsTo` relationship in our new comment, or, update the blogPost's `hasMany` relationship. As you might observe, we don't need to set both `hasMany` and `belongsTo` for a record. EmberData will do that for us.

First, let's look at setting the `belongsTo` relationship in our new comment:

```javascript
let comment = this.store.createRecord('comment', {
  blogPost: myBlogPost
});
comment.save();
```

In the above snippet, we have referenced `myBlogPost` while creating the record. This will let Ember know that the newly created comment belongs to `myBlogPost`.
This will create a new `comment` record and save it to the server. EmberData will also update `myBlogPost` to include our newly created comment in its `comments` relationship.

The second way of doing the same thing is to link the two records together by updating the blogPost's `hasMany` relationship as shown below:

```javascript
let comment = this.store.createRecord('comment', {});
let comments = await myBlogPost.comments;
comments.push(comment);
comment.save().then(function() {
  myBlogPost.save();
});
```

In this above case, the new comment's `belongsTo` relationship will be automatically set to the parent blogPost.

Although `createRecord` is fairly straightforward, the only thing to watch out for
is that you cannot assign a promise as a relationship, currently.

For example, if you want to set the `author` property of a blogPost, this would **not** work
if the `user` with id isn't already loaded into the store:

```javascript
this.store.createRecord('blog-post', {
  title: 'Rails is Omakase',
  body: 'Lorem ipsum',
  author: this.store.findRecord('user', 1)
});
```

However, you can easily set the relationship after the promise has fulfilled:

```javascript
let blogPost = this.store.createRecord('blog-post', {
  title: 'Rails is Omakase',
  body: 'Lorem ipsum'
});

this.store.findRecord('user', 1).then(function(user) {
  blogPost.author = user;
});
```

### Retrieving Related Records

When you request data from the server for a model that has relationships with one or more others,
you may want to retrieve records corresponding to those related models at the same time.
For example, when retrieving a blog post, you may need to access the comments associated
with the post as well.
The [JSON:API specification allows](http://jsonapi.org/format/#fetching-includes)
servers to accept a query parameter with the key `include` as a request to
include those related records in the response returned to the client.
The value of the parameter should be a comma-separated list of names of the
relationships required.

If you are using an adapter that supports JSON:API, such as Ember's default [`JSONAPIAdapter`](https://api.emberjs.com/ember-data/release/classes/JSONAPIAdapter),
you can easily add the `include` parameter to the server requests created by
the `findRecord()`, `findAll()`,
`query()` and `queryRecord()` methods.

`findRecord()` and `findAll()` each take an `options` argument in which you can
specify the `include` parameter.
For example, given a `post` model that has a `hasMany` relationship with a `comment` model,
when retrieving a specific post we can have the server also return that post's comments
as follows:

```javascript {data-filename=app/routes/post.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PostRoute extends Route {
  @service store;
  model(params) {
    return this.store.findRecord('post', params.post_id, {
      include: 'comments'
    });
  }
}
```

The post's comments would then be available in your template as `model.comments`.

Nested relationships can be specified in the `include` parameter as a dot-separated sequence of relationship names.
So to request both the post's comments and the authors of those comments the request
would look like this:

```javascript {data-filename=app/routes/post.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PostRoute extends Route {
  @service store;
  model(params) {
    return this.store.findRecord('post', params.post_id, {
      include: 'comments,comments.author'
    });
  }
}
```

The `query()` and `queryRecord()` methods each take a `query` argument that is
serialized directly into the URL query string and the `include` parameter may
form part of that argument.
For example:

```javascript {data-filename=app/routes/adele.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdeleRoute extends Route {
  @service store;
  model() {
    // GET to /artists?filter[name]=Adele&include=albums
    return this.store
      .query('artist', {
        filter: { name: 'Adele' },
        include: 'albums'
      })
      .then(function(artists) {
        return artists[0];
      });
  }
}
```

### Updating Existing Records

Sometimes we want to set relationships on already existing records. We can simply set a `belongsTo` relationship:

```javascript
let blogPost = this.store.peekRecord('blog-post', 1);
let comment = this.store.peekRecord('comment', 1);
comment.blogPost = blogPost;
comment.save();
```

Alternatively, we could update the `hasMany` relationship by pushing a record into the relationship:

```javascript
let blogPost = this.store.peekRecord('blog-post', 1);
let comment = this.store.peekRecord('comment', 1);
let comments = await blogPost.comments;
comments.push(comment);
blogPost.save();
```

### Removing Relationships

To remove a `belongsTo` relationship, we can set it to `null`, which will also remove it from the `hasMany` side:

```javascript
let comment = this.store.peekRecord('comment', 1);
comment.blogPost = null;
comment.save();
```

It is also possible to remove a record from a `hasMany` relationship:

```javascript
let blogPost = this.store.peekRecord('blog-post', 1);
let commentToRemove = this.store.peekRecord('comment', 1);
let comments = await blogPost.comments;
blogPost.comments = comments.filter((comment) => comment !== commentToRemove);
blogPost.save();
```

As in the earlier examples, the comment's `belongsTo` relationship will also be cleared by EmberData.

### Relationships as Promises

While working with relationships it is important to remember that they return promises.

For example, if we were to work on a blogPost's asynchronous comments, we would have to wait until the promise has fulfilled:

```javascript
let blogPost = this.store.peekRecord('blog-post', 1);

let comments = await blogPost.comments;
// now we can work with the comments
```

The same applies to `belongsTo` relationships:

```javascript
let comment = this.store.peekRecord('comment', 1);

let blogPost = await comment.blogPost;
// the blogPost is available here
```

Handlebars templates will automatically be updated to reflect a resolved promise. We can display a list of comments in a blogPost like so:

```handlebars
<ul>
  {{#each this.blogPost.comments as |comment|}}
    <li>{{comment.id}}</li>
  {{/each}}
</ul>
```

EmberData will query the server for the appropriate records and re-render the template once the data is received.


---

---
redirect: components/component-state-and-actions
---


---

---
redirect: components/component-state-and-actions
---


---

---
redirect: components/looping-through-lists
---


---

---
redirect: components/component-state-and-actions
---


---

---
redirect: components/looping-through-lists
---


---

---
redirect: components/index
---


---

---
redirect: components/component-state-and-actions
---


---

---
redirect: components/component-state-and-actions
---


---

---
redirect: accessibility/index
---


---

---
redirect: upgrading/current-edition/templates
---


---

---
redirect: upgrading/current-edition/templates
---


---

This section covers some more advanced features of the router and its
capability for handling complex async logic within your app.

### A Word on Promises...

Ember's approach to handling asynchronous logic in the router makes
heavy use of the concept of Promises. In short, promises are objects that
represent an eventual value. A promise can either _fulfill_
(successfully resolve the value) or _reject_ (fail to resolve the
value). The way to retrieve this eventual value, or handle the cases
when the promise rejects, is via the promise's [`then()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) method, which
accepts two optional callbacks, one for fulfillment and one for
rejection. If the promise fulfills, the fulfillment handler gets called
with the fulfilled value as its sole argument, and if the promise rejects,
the rejection handler gets called with a reason for the rejection as its
sole argument. For example:


```javascript
let promise = fetchTheAnswer();

promise.then(fulfillCallback, rejectCallback);

function fulfillCallback(answer) {
  console.log(`The answer is ${answer}`);
}

function rejectCallback(reason) {
  console.log(`Couldn't get the answer! Reason: ${reason}`);
}
```

Much of the power of promises comes from the fact that they can be
chained together to perform sequential asynchronous operations:

```javascript
import fetch from 'fetch';

let usernamesPromise = fetch('/usernames.json');

usernamesPromise.then(response => response.json())
                .then(fetchPhotosOfUsers)
                .then(applyInstagramFilters)
                .then(uploadTrendyPhotoAlbum)
                .then(displaySuccessMessage, handleErrors);
```

In the above example, if any of the methods
`fetchPhotosOfUsers`, `applyInstagramFilters`, or
`uploadTrendyPhotoAlbum` returns a promise that rejects,
`handleErrors` will be called with
the reason for the failure. In this manner, promises approximate an
asynchronous form of try-catch statements that prevent the rightward
flow of nested callback after nested callback and facilitate a saner
approach to managing complex asynchronous logic in your applications.

### The Router Pauses for Promises

When transitioning between routes, the Ember router collects all of the
models (via the `model` hook) that will be passed to the route's
controllers at the end of the transition. If the `model` hook (or the related
`beforeModel` or `afterModel` hooks) return normal (non-promise) objects or
arrays, the transition will complete immediately. But if the `model` hook
(or the related `beforeModel` or `afterModel` hooks) returns a promise (or
if a promise was provided as an argument to `transitionTo`), the transition
will pause until that promise fulfills or rejects.

The router considers any object with a `then()` method
defined on it to be a promise.

If the promise fulfills, the transition will pick up where it left off and
begin resolving the next (child) route's model, pausing if it too is a
promise, and so on, until all destination route models have been
resolved. The values passed to the [`setupController()`](https://api.emberjs.com/ember/release/classes/Route/methods/setupController?anchor=setupController) hook for each route
will be the fulfilled values from the promises.


A basic example:

```javascript {data-filename=app/routes/tardy.js}
import Route from '@ember/routing/route';
import { later } from '@ember/runloop';

export default class TardyRoute extends Route {
  model() {
    return new Promise(function(resolve) {
      later(function() {
        resolve({ msg: 'Hold Your Horses' });
      }, 3000);
    });
  }

  setupController(controller, model) {
    console.log(model.msg); // "Hold Your Horses"
  }
}
```

When transitioning into `route:tardy`, the `model()` hook will be called and
return a promise that won't resolve until 3 seconds later, during which time
the router will be paused in mid-transition. When the promise eventually
fulfills, the router will continue transitioning and eventually call
`route:tardy`'s `setupController()` hook with the resolved object.

This pause-on-promise behavior is extremely valuable for when you need
to guarantee that a route's data has fully loaded before displaying a
new template.

### When Promises Reject...

We've covered the case when a model promise fulfills, but what if it rejects?

By default, if a model promise rejects during a transition, the transition is
aborted, no new destination route templates are rendered, and an error
is logged to the console.

You can configure this error-handling logic via the `error` handler. When a
promise rejects, an `error` event will be fired on that route and bubble up
to `route:application`'s default error handler unless it is handled by a
custom error handler along the way, e.g.:

```javascript {data-filename=app/routes/good-for-nothing.js}
import Route from '@ember/routing/route';
import { action } from '@ember/object';
// import { service } from '@ember/service';

export default class GoodForNothingRoute extends Route {
  // @service router;

  model() {
    return Promise.reject("FAIL");
  }

  @action
  error(reason) {
    alert(reason); // "FAIL"

    // Can transition to another route here, e.g.
    // this.router.transitionTo('index');

    // Uncomment the line below to bubble this error event:
    // return true;
  }
}
```

In the above example, the error event would stop right at
`route:good-for-nothing`'s error handler and not continue to bubble. To
make the event continue bubbling up to `route:application`, you can
`return true;` from the error handler.

### Recovering from Rejection

Rejected model promises halt transitions, but because promises are chainable,
you can catch promise rejects within the `model` hook itself and convert
them into fulfills that won't halt the transition.

```javascript {data-filename=app/routes/funky.js}
import Route from '@ember/routing/route';

export default class FunkyRoute extends Route {
  model() {
    return iHopeThisWorks().catch(function() {
      // Promise rejected, fulfill with some default value to
      // use as the route's model and continue on with the transition
      return { msg: 'Recovered from rejected promise' };
    });
  }
}
```

<!-- eof - needed for pages that end in a code block  -->


---

### What is a Controller?

A [Controller](https://api.emberjs.com/ember/release/classes/Ember.Controller) is routable object which receives a single property from the Route – `model` – which is the return value of the Route's [`model()`](https://api.emberjs.com/ember/release/classes/Route/methods/model?anchor=model) method.

The model is passed from the Route to the Controller by default using the [`setupController()`](https://api.emberjs.com/ember/release/classes/Route/methods/setupController?anchor=setupController) function. The Controller is then often used to decorate the model with display properties such as retrieving the full name from a name model.

A Controller is usually paired with an individual Route of the same name.

[Routing Query Parameters](../query-params/) should be defined within a controller.

### Defining a Controller

We only need to generate a Controller file if we want to customize the properties or provide any actions to the Route. If we have no customizations, Ember will provide a default Controller instance for us at run time.

To generate a controller, run
```bash
ember generate controller my-controller-name
```

This creates a controller file at `app/controllers/my-controller-name.js`, and a unit test file at `tests/unit/controllers/my-controller-name-test.js`.

The controller name `my-controller-name` must match the name of the Route that renders it. So if the Route is named `blog-post`, it should have a matching Controller named `blog-post`. The matching file names of the Controller and the Route signals to Ember that this Controller must be used when landing on the `blog-post` Route.

### Where and When to use Controllers?

Controllers are used as an extension of the model loaded from the Route. Any attributes or actions that we want to share with components used on that Route could be defined on the Controller and passed down through the Route’s template.

Controllers are singletons so we should avoid keeping state that does not derive from either the Model or Query Parameters since these would persist in between activations such as when a user leaves the Route and then re-enters it.

Controllers can also contain actions, Query Parameters, Tracked Properties, and more.

### Basic Controller Example

Let's explore these concepts using an example of a route displaying a blog post. Assume that the route returns a `BlogPost` model that is presented in the template.

The `BlogPost` model would have properties like:

* `title`
* `intro`
* `body`
* `author`

In the example below, we can see how the template is using the model properties to display some data.

```handlebars {data-filename=app/templates/blog-post.hbs}
<h1>{{@model.title}}</h1>
<h2>by {{@model.author}}</h2>

<div class="intro">
  {{@model.intro}}
</div>
<hr>
<div class="body">
  {{@model.body}}
</div>
```

Consider the example where we want to have a controller for a `blog-post` route. In this controller, we are looking to keep track if the user has expanded the body or not.

```javascript {data-filename=app/controllers/blog-post.js}
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class BlogPostController extends Controller {
  isExpanded = false

  @action
  toggleBody() {
    this.toggleProperty('isExpanded');
  }
}
```

The property `isExpanded` keeps track if the user has expanded the body or not. The action `toggleBody()` provides a way for the user to provide their setting. Both of them are used in the updated template below.

```handlebars {data-filename=app/templates/blog-post.hbs}
<h1>{{@model.title}}</h1>
<h2>by {{@model.author}}</h2>

<div class='intro'>
  {{@model.intro}}
</div>
<hr>

{{#if this.isExpanded}}
  <button type="button" {{on "click" this.toggleBody}}>Hide Body</button>
  <div class="body">
    {{@model.body}}
  </div>
{{else}}
  <button type="button" {{on "click" this.toggleBody}}>Show Body</button>
{{/if}}
```

We can see that if the property `isExpanded` is toggled to true, we will show the body property of the model to the user. This `isExpanded` is stored in the controller.

### Common questions

#### Should we use controllers in my application? I've heard they're going away!

Yes! Controllers are still an integral part of an Ember application architecture, and generated by the framework even if you don't declare a Controller module explicitly.

#### When should we create a Controller?

* We want to pass down actions or variables to share with a Route’s child components
* We need to compute a value based on the results of the model hook
* We need to support query parameters


---

When your application starts, the router matches the current URL to the _routes_
that you've defined. The routes, in turn, are responsible for displaying
templates, loading data, and setting up application state.

To define a route, run

```bash
ember generate route route-name
```

This creates a route file at `app/routes/route-name.js`, a template for the route at `app/templates/route-name.hbs`,
and a unit test file at `tests/unit/routes/route-name-test.js`.
It also adds the route to the router.

## Basic Routes

The [`map()`](https://api.emberjs.com/ember/release/classes/EmberRouter/methods/map?anchor=map) method
of your Ember application's router can be invoked to define URL mappings. When
calling `map()`, you should pass a function that will be invoked with the value
`this` set to an object which you can use to create routes.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('about', { path: '/about' });
  this.route('favorites', { path: '/favs' });
});
```

Now, when the user visits `/about`, Ember will render the `about`
template. Visiting `/favs` will render the `favorites` template.

You can leave off the path if it is the same as the route
name. In this case, the following is equivalent to the above example:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('about');
  this.route('favorites', { path: '/favs' });
});
```

Inside your templates, you can use [`<LinkTo />`](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/LinkTo?anchor=LinkTo) to navigate between
routes, using the name that you provided to the `route` method.

```handlebars
<LinkTo @route="index">
  <img class="logo">
</LinkTo>

<nav>
  <LinkTo @route="about">About</LinkTo>
  <LinkTo @route="favorites">Favorites</LinkTo>
</nav>
```

The `<LinkTo />` component will also add an `active` class to the link that
points to the currently active route.

Multi-word route names are conventionally dasherized, such as:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('blog-post', { path: '/blog-post' });
});
```

The route defined above will by default use the `blog-post.js` route handler,
the `blog-post.hbs` template, and be referred to as `blog-post` in any
`<LinkTo />` components.

Multi-word route names that break this convention, such as:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('blog_post', { path: '/blog-post' });
});
```

will still by default use the `blog-post.js` route handler and the
`blog-post.hbs` template, but will be referred to as `blog_post` in any
`<LinkTo />` components.

## Nested Routes

Often you'll want to have a template that displays inside another template.
For example, in a blogging application, instead of going from a list of blog
posts to creating a new post, you might want to have the post creation page
display next to the list.

In these cases, you can use nested routes to display one template inside
of another.

You can define nested routes by passing a callback to `this.route`:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts', function() {
    this.route('new');
  });
});
```

Assuming you have already generated the `posts` route, to generate the above nested route you would run:

```bash
ember generate route posts/new
```

And then add the `{{outlet}}` helper to your template where you want the nested
template to display. You can also add a page title with the current page name (using [page-title helper](../../accessibility/page-template-considerations/#toc_page-title)), this will help users with assistive technology know where they are in the website.

```handlebars {data-filename=templates/posts.hbs}
{{page-title "Posts - Site Title"}}
<h1>Posts</h1>
{{!-- Display posts and other content --}}
{{outlet}}
```

This generates a route for `/posts` and for `/posts/new`. When a user
visits `/posts`, they'll simply see the `posts.hbs` template. (Below, [index
routes](#toc_index-routes) explains an important addition to this.) When the
user visits `posts/new`, they'll see the `posts/new.hbs` template rendered into
the `{{outlet}}` of the `posts` template.

A nested route name includes the names of its ancestors.
If you want to transition to a route (either
via `transitionTo` or `<LinkTo />`), make sure to use the full route
name (`posts.new`, not `new`).

## The application route

The `application` route is entered when your app first boots up. Like other
routes, it will load a template with the same name (`application` in
this case) by default.
You should put your header, footer, and any other decorative content
here. All other routes will render
their templates into the `application.hbs` template's `{{outlet}}`.

This route is part of every application, so you don't need to
specify it in your `app/router.js`.

## Index Routes

At every level of nesting (including the top level), Ember
automatically provides a route for the `/` path named `index`.
To see when a new level of nesting occurs, check the router,
whenever you see a `function`, that's a new level.

For example, if you write a simple router like this:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('favorites');
});
```

It is the equivalent of:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('index', { path: '/' });
  this.route('favorites');
});
```

The `index` template will be rendered into the `{{outlet}}` in the
`application` template. If the user navigates to `/favorites`,
Ember will replace the `index` template with the `favorites`
template.

A nested router like this:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts', function() {
    this.route('favorites');
  });
});
```

Is the equivalent of:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('index', { path: '/' });
  this.route('posts', function() {
    this.route('index', { path: '/' });
    this.route('favorites');
  });
});
```

Likewise, if the user navigates to `/posts`, the current route will be
`posts.index`, and the `posts/index` template
will be rendered into the `{{outlet}}` of the `posts` template.

If the user then navigates to `/posts/favorites`, Ember will
replace the `{{outlet}}` in the `posts` template with the
`posts/favorites` template.

The following scenarios may help with understanding the `index` route:

- The top-level index route is analogous to `index.html`. For example, when someone visits `https://some-ember-app.com`, the contents of the `template/index.hbs` file will be rendered. There is no need to add an entry `this.route('index', { path: '/' });` in `app/router.js` file. The `index` route is implicitly included in order to help reduce verbose declarations in the `app/router.js`. The `app/router.js` file could be empty, and the `index` would still be shown:

```javascript {data-filename=app/router.js}
Router.map(function() {
});
```
- When a user navigates to `/posts`, the contents of `index.hbs` will be rendered. This is similar to a user navigating to the child route of `/posts`. `/posts/index` is a child route like `/posts/comments` or `/posts/likes`.

### When to use an index route

The index route is most helpful for rendering a view when the route has [dynamic segments](#toc_dynamic-segments) defined in it or there are nested routes. In other words, an `index` template is used to show content that should not be present on sibling and child routes. For example, a blog app might have an `index` route that shows a list of all posts, but if a user clicks on a post, they should only see the content for the individual post. Here is how that looks in practice:

A `templates/posts.hbs` file has the following:

```handlebars {data-filename=templates/posts.hbs}
{{page-title "Posts"}}
<h1>This is the posts template, containing headers to show on all child routes</h1>
{{outlet}}
```

The `templates/posts/index.hbs` file has the following:

```handlebars {data-filename=templates/posts/index.hbs}
{{page-title "Posts"}}
<p>This is the posts/index template with a list of posts</p>
```

The `templates/posts/post.hbs` file has the following:

```handlebars {data-filename=templates/posts/post.hbs}
{{page-title "Post"}}
<p>This is an individual post, from the posts/post template, used when we enter the /posts/:post_id route</p>
```

This is equivalent to having the following entry in `app/router.js` file

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts', function() {
    this.route('post', { path: '/:post_id' });
    this.route('index', { path: '/' });
  })
});
```

When the user navigates to `/posts/123`, the following markup will be seen:

```handlebars {data-filename=templates/posts/post.hbs}
{{page-title "Posts"}}
<h1>This is the posts template, containing headers to show on all child routes</h1>
<p>This is an individual post, from the posts/post template, used when we enter the /posts/:post_id route</p>
```

When the user navigates to `/posts/`, the following markup will be seen:

```handlebars {data-filename=templates/posts/index.hbs}
{{page-title "Posts"}}
<h1>This is the posts template, containing headers to show on all child routes</h1>
<p>This is the posts/index template with a list of posts</p>
```

## Dynamic Segments

One of the responsibilities of a route is to load a model.

For example, if we have the route `this.route('posts');`, our
route might load all of the blog posts for the app.

Because `/posts` represents a fixed model, we don't need any
additional information to know what to retrieve.  However, if we want a route
to represent a single post, we would not want to have to hardcode every
possible post into the router.

Enter _dynamic segments_.

A dynamic segment is a portion of a URL that starts with a `:` and is followed by an identifier.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts');
  this.route('post', { path: '/post/:post_id' });
});
```

If the user navigates to `/post/5`, the route will then have the `post_id` of
`5` to use to load the correct post.
Ember follows the convention of `:model-name_id` because `params` is an object, and can only have one value associated with a key.
To put it in code, the following will _not_ work properly:

```javascript {data-filename=app/router.js}
// This won't work! The dynamic segments will collide.
Router.map(function() {
  this.route('photo', { path: '/photo/:id' }, function() {
    this.route('comment', { path: '/comment/:id' });
  });
});
```

But the following will:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('photo', { path: '/photo/:photo_id' }, function() {
    this.route('comment', { path: '/comment/:comment_id' });
  });
});
```

In the next section, [Specifying a Route's Model](../specifying-a-routes-model/), you will learn more about how to load a model.

## Wildcard / globbing routes

You can define wildcard routes that will match multiple URL segments.
This could be used, for example, if you'd like a catch-all route which is useful when the user enters an incorrect URL not managed by your app.
Wildcard routes begin with an asterisk.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('not-found', { path: '/*path' });
});
```

```handlebars {data-filename=app/templates/not-found.hbs}
{{page-title "Not found"}}
<p>Oops, the page you're looking for wasn't found</p>
```

In the above example we have successfully used a wildcard route to handle all routes not managed by our application
so that when a user navigates to `/a/non-existent/path` they will be shown a message that says the page they're looking for wasn't found.

Note that if you want to manually transition to this wildcard route, you need to pass an arbitrary (not empty) argument. For example, using EmberData to find a record:

```javascript {data-filename=app/routes/some-route.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class SomeRouteRoute extends Route {
  @service store;
  @service router;
  // …
  @action
  async visitUserProfile(id) {
    this.store.findRecord('user', id).then(function (user) {
      // Success callback
      this.router.transitionTo('user.profile', user);
    }).catch(function () {
      // Error callback
      this.router.transitionTo('not-found', 404);
    }
  }
}
```
## Route Handlers

To have your route do something beyond render a template with the same name, you'll
need to create a route handler. The following guides will explore the different
features of route handlers. For more information on routes, see the API documentation
for [the router](https://api.emberjs.com/ember/release/classes/EmberRouter) and for [route
handlers](https://api.emberjs.com/ember/release/classes/Route).

## Transitioning Between Routes
Once the routes are defined, how do we go about transitioning between them within our application? It depends on where the transition needs to take place:

- From a template, use [`<LinkTo />`](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/LinkTo?anchor=LinkTo) as mentioned above
- From anywhere else in your application, such as a component, inject the [Router Service](https://api.emberjs.com/ember/release/classes/RouterService) and use the [`transitionTo()`](https://api.emberjs.com/ember/release/classes/RouterService/methods/transitionTo?anchor=transitionTo) method


---

Imagine we are writing a web app for managing a blog. At any given time, we
should be able to answer questions like _What post are they looking at?_ and
_Are they editing it?_ In Ember.js, the answer to these questions is determined
by the URL.

The URL can be set in a few ways:

* The user loads the app for the first time.
* The user changes the URL manually, such as by clicking the back button or by
editing the address bar.
* The user clicks a link within the app.
* Some other event in the app causes the URL to change.

Regardless of how the URL becomes set, the Ember router then maps the current
URL to one or more route handlers. A route handler can do several things:

* It can render a template.
* It can load a model that is then available to the template.
* It can redirect to a new route, such as if the user isn't allowed to visit
that part of the app.
* It can handle actions that involve changing a model or transitioning to a new route.


---

It is important to be able to switch between routes and link to different parts of
your application. We can do this declaratively in templates using the `<LinkTo>`
component.

## The `<LinkTo />` Component

You create a link to a route using the
[`<LinkTo />`](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/LinkTo?anchor=LinkTo)
component.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('photos', function(){
    this.route('edit', { path: '/:photo_id' });
  });
});
```

```handlebars {data-filename=app/templates/photos.hbs}
<ul>
  {{#each this.photos as |p|}}
    <li>
      <LinkTo @route="photos.edit" @model={{p}}>{{p.title}}</LinkTo>
    </li>
  {{/each}}
</ul>
```

The `@route` argument is the name of the route to link to, and the `@model`
argument is a model object to fill in the [dynamic segment](../../routing/defining-your-routes/#toc_dynamic-segments)
for the route.

For example, if `this.photos` is a list of three photos, the rendered HTML
would look something like this:

```html
<ul>
  <li>
    <a href="/photos/1">Happy Kittens</a>
  </li>
  <li>
    <a href="/photos/2">Puppy Running</a>
  </li>
  <li>
    <a href="/photos/3">Mountain Landscape</a>
  </li>
</ul>
```

By default, Ember.js will replace each dynamic segment in the URL with the
model object's `id` property. In the example above, the `@model` argument
is the `photo` objects, and their `id` properties are used to fill in the
dynamic segment in the URL; in this case, either `1`, `2`, or `3`. This
behavior can be customized within `PhotoEditRoute`'s `serialize` hook.

Alternatively, you can explicitly provide a serialized `id`, in place of
passing a model object:

```handlebars {data-filename=app/templates/photos.hbs}
<LinkTo @route="photos.edit" @model="1">First Photo Ever</LinkTo>
```

In this case, the provided `id` will be used to populate the URL's dynamic
segment directly, bypassing the `serialize` hook entirely:

```html
<a href="/photos/1">First Photo Ever</a>
```

When the user clicks on the link, Ember will run the `PhotoEditRoute`'s `model`
hook with `params.photo_id = 1`. On the other hand, if a model object was
passed instead of the `id`, the model hook will _not_ run.

### Active CSS Class

When the generated link matches the current URL, then the generated link tag
will be given the `active` CSS class. For example, if you were at the URL
`/photos/2`, the first example above would render as:

```html
<ul>
  <li>
    <a href="/photos/1">Happy Kittens</a>
  </li>
  <li>
    <a href="/photos/2" class="active">Puppy Running</a>
  </li>
  <li>
    <a href="/photos/3">Mountain Landscape</a>
  </li>
</ul>
```

### Multiple Dynamic Segments

Sometimes, you may need to generate links for nested routes which can
have multiple [dynamic segments](../../routing/defining-your-routes/#toc_dynamic-segments).
For example, consider the following route definitions:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('photos', function(){
    this.route('photo', { path: '/:photo_id' }, function(){
      this.route('comments');
      this.route('comment', { path: '/comments/:comment_id' });
    });
  });
});
```

Here, the `photos.photo.comment` route have two dynamic segments:
`:photo_id` and `:comment_id`.

When passing a `@model` object to the `<LinkTo />` component, that single model
object will be used to populate the innermost dynamic segment. In this case,
that would be `:comment_id`. The `:photo_id` will be inferred from the current
URL.

For example, if we are currently on `/photos/2`, then the following template:

```handlebars {data-filename=app/templates/photos/photo.hbs}
{{#each this.photo.comments as |comment|}}
  <LinkTo @route="photos.photo.comment" @model={{comment}}>
    {{excerpt comment.body}}...
  </LinkTo>
{{/each}}
```

...will render something like this:

```html
<a href="/photos/2/comment/37">
  Aww this is...
</a>
<a href="/photos/2/comment/44">
  Great puppy...
</a>
<a href="/photos/2/comment/45">
  5/5 would pet...
</a>
```

Note that while `:comment_id` is populated with each comment's `id` (based on
the `@model` argument), the `:photo_id` segment is automatically assumed to be
the same as the corresponding segment in current URL, i.e. `2`.

Ember is only able to infer the dynamic segments because the `photo` route is
currently active. If we were to invoke the `<LinkTo />` component for the same
`photos.photo.comment` route, but from the `photos` route's template, it will
result in an error, as we did not pass enough model objects to populate all the
dynamic segments needed to generate the URL.

To solve this problem, or maybe to cross-link comments from photos other than
the currently active one, you can pass an array of model objects using the
`@models` argument and the `{{array}}` helper:

```handlebars {data-filename=app/templates/photos.hbs}
<h1>Latest Comments</h1>

<ul>
  {{#each this.latestComments as |comment|}}
    <li>
      <LinkTo @route="photos.photo.comment" @models={{array comment.photo comment}}>
        {{excerpt comment.body}}...
      </LinkTo>
    </li>
  {{/each}}
</ul>
```

Here, we are passing an array of model objects (the photo, then the comment),
which is exactly what is needed to populate all the dynamic segments.

The `@model` argument is merely a special case for the more general `@models`
argument. Therefore, it is an error to pass _both_ arguments at the same time.

### Query Params

The `@query` argument, along with the `{{hash}}` helper, can be used to set
query params on a link:

```handlebars
// Explicitly set target query params
<LinkTo @route="posts" @query={{hash direction="asc"}}>Sort</LinkTo>

// Binding is also supported
<LinkTo @route="posts" @query={{hash direction=this.otherDirection}}>Sort</LinkTo>
```

For more information on how to use query parameters see the [query parameters](../../routing/query-params/) section in Routing.

### HTML Attributes

When generating a link, you may want to customize its HTML attributes. For
example, it is quite common to want to add additional CSS classes to the
generated link tag, or specifying the appropriate ARIA attributes. You can
simply pass them along with the invocation:

```handlebars {data-filename=app/templates/photos/edit.hbs}
<LinkTo @route="photos" class="btn btn-primary" role="button" aria-pressed="false">
  Discard Changes
</LinkTo>
```

CSS classes passed this way will be _in addition to_ the standard `ember-view`
and possibly `active` classes.

### Replacing history entries

The default behavior for the `<LinkTo />` component is to add entries to the
browser's history when transitioning between routes. However, to replace the
current entry in the browser's history instead, you can use the `@replace`
option:

```handlebars
<LinkTo @route="photo.comment" @model={{this.topComment}} @replace={{true}}>
  Top comment for the current photo
</Link>
```

<!-- eof - needed for pages that end in a code block  -->


---

The Ember Router allows you to provide feedback that a route is loading, as well
as when an error occurs in loading a route.

The `error` and `loading` substates exist as a part of each route, so they
should not be added to your `router.js` file. To utilize a substate, the route, controller,
and template may be optionally defined as desired.

## `loading` substates

During the `beforeModel`, `model`, and `afterModel` hooks, data may take some
time to load. Technically, the router pauses the transition until the promises
returned from each hook fulfill.

Consider the following:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('slow-model');
});
```

```javascript {data-filename=app/routes/slow-model.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SlowModelRoute extends Route {
  @service store;

  model() {
    return this.store.findAll('slow-model');
  }
}
```

If you navigate to `slow-model`, in the `model` hook using [EmberData](../../models/),
the query may take a long time to complete.
During this time, your UI isn't really giving you any feedback as to
what's happening. If you're entering this route after a full page
refresh, your UI will be entirely blank, as you have not actually
finished fully entering any route and haven't yet displayed any
templates. If you're navigating to `slow-model` from another
route, you'll continue to see the templates from the previous route
until the model finish loading, and then, boom, suddenly all the
templates for `slow-model` load.

So, how can we provide some visual feedback during the transition?

Simply define a template called `loading` (and optionally a corresponding route)
that Ember will transition to. The
intermediate transition into the loading substate happens immediately
(synchronously), the URL won't be updated, and, unlike other transitions, the
currently active transition won't be aborted.

Once the main transition into `slow-model` completes, the `loading`
route will be exited and the transition to `slow-model` will continue.

For nested routes, like:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('user', function() {
    this.route('about', function() {
      this.route('slow-model');
    });
  });
});
```

Each of the following assumes a transition from the application or index route.

When accessing `user.about.slow-model` route then Ember will alternate trying to
find a `routeName-loading` or `loading` template in the hierarchy starting with
`user.about.slow-model-loading`:

1. `user.about.slow-model-loading`
2. `user.about.loading` or `user.about-loading`
3. `user.loading` or `user-loading`
4. `loading` or `application-loading`

It's important to note that for `slow-model` itself, Ember will not try to
find a `slow-model.loading` template but for the rest of the hierarchy either
syntax is acceptable. This can be useful for creating a custom loading screen
for a leaf route like `slow-model`.

When accessing `user.about` route then Ember will search for:

1. `user.about-loading`
2. `user.loading` or `user-loading`
3. `loading` or `application-loading`

It's important to note that `user.about.loading` template is not considered now.

Ember will *not* look above the common parent in a transition between child
routes. For example, if the user transitions from `user.about.index` to
`user.about.slow-model` the following search for template will happen:

1. `user.about.slow-model-loading`
2. `user.about.loading` or `user.about-loading`

Notice that `user.loading`, `user-loading`, `loading`, and `application-loading`
are not included here, Since `about` is the common parent for `index` and `slow-model`. This means we'll need to handle loading at every level
within the route hierarchy where loading feedback is important.


### The `loading` event

If the various `beforeModel`/`model`/`afterModel` hooks
don't immediately resolve, a [`loading`](https://api.emberjs.com/ember/release/classes/Route/events/loading?anchor=loading) event will be fired on that route.

```javascript {data-filename=app/routes/user-slow-model.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class UserSlowModelRoute extends Route {
  @service store;
  
  model() {
    return this.store.findAll('slow-model');
  }

  @action
  loading(transition, originRoute) {
    let controller = this.controllerFor('foo');
    controller.set('currentlyLoading', true);
    return true; // allows the loading template to be shown
  }
}
```

If the `loading` handler is not defined at the specific route,
the event will continue to bubble above a transition's parent
route, providing the `application` route the opportunity to manage it.

When using the `loading` handler, we can make use of the transition promise to know when the loading event is over:

```javascript {data-filename=app/routes/user-slow-model.js}
import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class UserSlowModelRoute extends Route {
  // ...
  @action
  async loading(transition, originRoute) {
    let controller = this.controllerFor('foo');
    controller.set('currentlyLoading', true);
    transition.promise.finally(function() {
        controller.set('currentlyLoading', false);
    });
  }
};
```

In case we want both custom logic and the default behavior for the loading substate,
we can implement the `loading` action and let it bubble by returning `true`.

```javascript {data-filename=app/routes/user-slow-model.js}
import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class UserSlowModelRoute extends Route {
  // ...
  @action
  loading(transition) {
    let start = new Date();
    transition.promise.finally(() => {
      this.notifier.notify(`Took ${new Date() - start}ms to load`);
    });

    return true;
  }
};
```

## `error` substates

Ember provides an analogous approach to `loading` substates in
the case of errors encountered during a transition.

Similar to how the default `loading` event handlers are implemented,
the default `error` handlers will look for an appropriate error substate to
enter, if one can be found.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('articles', function() {
    this.route('overview');
  });
});
```

As with the `loading` substate, on a thrown error or rejected promise returned
from the `articles.overview` route's `model` hook (or `beforeModel` or
`afterModel`) Ember will look for an error template or route in the following
order:

1. `articles.overview-error`
2. `articles.error` or `articles-error`
3. `error` or `application-error`

If one of the above is found, the router will immediately transition into
that substate (without updating the URL). The "reason" for the error
(i.e. the exception thrown or the promise reject value) will be passed
to that error state as its `model`.

The model hooks (`beforeModel`, `model`, and `afterModel`) of an error substate
are not called. Only the `setupController` method of the error substate is
called with the `error` as the model. See example below:

```javascript
setupController(controller, error) {
  console.log(error.message);
  super.setupController(...arguments)
}
```

If no viable error substates can be found, an error message will be
logged.

### The `error` event

If the `articles.overview` route's `model` hook returns a promise that rejects
(for instance the server returned an error, the user isn't logged in,
etc.), an [`error`](https://api.emberjs.com/ember/release/classes/Route/events/error?anchor=error) event will fire from that route and bubble upward.
This `error` event can be handled and used to display an error message,
redirect to a login page, etc.

```javascript {data-filename=app/routes/articles-overview.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ArticlesOverviewRoute extends Route {
  @service store;
  @service router;

  model(params) {
    return this.store.findAll('privileged-model');
  }

  @action
  error(error, transition) {
    if (error.status === '403') {
      this.router.replaceWith('login');
    } else {
      // Let the route above this handle the error.
      return true;
    }
  }
};
```

Analogous to the `loading` event, you could manage the `error` event
at the application level to avoid writing the same code for multiple routes.

In case we want to run some custom logic and have the default behavior of rendering the error template,
we can handle the `error` event and let it bubble by returning `true`.

```javascript {data-filename=app/routes/articles-overview.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ArticlesOverviewRoute extends Route {
  @service store;
  
  model(params) {
    return this.get('store').findAll('privileged-model');
  }

  @action
  error(error) {
    this.notifier.error(error);
    return true;
  }
};
```

<!-- eof - needed for pages that end in a code block  -->


---

During a route transition, the Ember Router passes a transition
object to the various hooks on the routes involved in the transition.
Any hook that has access to this transition object has the ability
to immediately abort the transition by calling `transition.abort()`,
and if the transition object is stored, it can be re-attempted at a
later time by calling `transition.retry()`.

### Preventing Transitions via `routeWillChange`

When a transition is attempted, whether via `<LinkTo />`, `transitionTo`,
or a URL change, a `routeWillChange` event is fired on the [`RouterService`](https://api.emberjs.com/ember/release/classes/RouterService/events). This gives each active route, starting with the leaf-most
route, the opportunity to decide whether or not the transition should occur.

Imagine your app is in a route that's displaying a complex form for the user
to fill out and the user accidentally navigates backwards. Unless the
transition is prevented, the user might lose all of the progress they
made on the form, which can make for a pretty frustrating user experience.

Here's one way this situation could be handled:

```javascript {data-filename=app/routes/form.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class FormRoute extends Route {
  @service router;

  constructor() {
    super(...arguments);
    
    this.router.on('routeWillChange', (transition) => {
      if (!transition.to.find(route => route.name === this.routeName) && 
        !confirm('Are you sure you want to abandon progress?')) {
        transition.abort();
      }
    });
  }
};
```

When the user clicks on a `<LinkTo />` component, or when the app initiates a
transition by using `transitionTo`, the transition will be aborted and the URL
will remain unchanged. However, if the browser back button is used to
navigate away from `route:form`, or if the user manually changes the URL, the
new URL will be navigated to before the `routeWillChange` action is
called. This will result in the browser displaying the new URL, even if
`routeWillChange` calls `transition.abort()`.

### Aborting Transitions Within `model`, `beforeModel`, `afterModel`

The `model`, `beforeModel`, and `afterModel` hooks described in
[Asynchronous Routing](../asynchronous-routing/)
each get called with a transition object. This makes it possible for
destination routes to abort attempted transitions.

```javascript {data-filename=app/routes/disco.js}
import Route from '@ember/routing/route';

export default class DiscoRoute extends Route {
  beforeModel(transition) {
    if (new Date() > new Date('January 1, 1980')) {
      alert('Sorry, you need a time machine to enter this route.');
      transition.abort();
    }
  }
}
```

### Storing and Retrying a Transition

Aborted transitions can be retried at a later time. A common use case
for this is having an authenticated route redirect the user to a login
page, and then redirecting them back to the authenticated route once
they've logged in.

```javascript {data-filename=app/routes/some-authenticated.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SomeAuthenticatedRoute extends Route {
  @service router;

  beforeModel(transition) {
    if (!this.controllerFor('auth').userIsLoggedIn) {
      let loginController = this.controllerFor('login');
      loginController.previousTransition = transition;
      this.router.transitionTo('login');
    }
  }
}
```

```javascript {data-filename=app/controllers/login.js}
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class LoginController extends Controller {
  @service router;

  @action
  login() {
    // Log the user in, then reattempt previous transition if it exists.
    let previousTransition = this.previousTransition;
    if (previousTransition) {
      this.previousTransition = null;
      previousTransition.retry();
    } else {
      // Default back to homepage
      this.router.transitionTo('index');
    }
  }
}
```

<!-- eof - needed for pages that end in a code block  -->


---

Query parameters are optional key-value pairs that appear to the right of
the `?` in a URL. For example, the following URL has two query params,
`sort` and `page`, with respective values `ASC` and `2`:

```text
http://example.com/articles?sort=ASC&page=2
```

Query params allow for additional application state to be serialized
into the URL that can't otherwise fit into the _path_ of the URL (i.e.
everything to the left of the `?`). Common use cases for query params include
representing the current page number in a paginated collection, filter criteria, or sorting criteria.

In web development, query parameters are used within a URL as described above but can also be used
in API requests that retrieve data. Ember treats these as _two_ different concepts. This section
describes how routing query parameters are used in Ember. See [finding records](../../models/finding-records/#toc_querying-for-multiple-records) to see how query parameters are
applied to API requests in EmberData.

### Specifying Query Parameters

Query params are declared on route-driven controllers. For example, to
configure query params that are active within the `articles` route,
they must be declared on `controller:articles`.

To add a `category`
query parameter that will filter out all the articles that haven't
been categorized as popular we'd specify `'category'`
as one of `controller:articles`'s `queryParams`:

```javascript {data-filename=app/controllers/articles.js}
import Controller from '@ember/controller';

export default class ArticlesController extends Controller {
  queryParams = ['category'];
  
  category = null;
}
```

This sets up a binding between the `category` query param in the URL,
and the `category` property on `controller:articles`. In other words,
once the `articles` route has been entered, any changes to the
`category` query param in the URL will update the `category` property
on `controller:articles`, and vice versa.
Note that you can't make `queryParams` be a dynamically generated property (neither computed property, nor property getter); they
have to be values.

Now we need to define a getter for our category-filtered
array, which the `articles` template will render. For the getter to recompute when values change, `category` and `model` should be marked as tracked properties:

```javascript {data-filename=app/controllers/articles.js}
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class ArticlesController extends Controller {
  queryParams = ['category'];
  
  @tracked category = null;

  @tracked model;

  get filteredArticles() {
    let category = this.category;
    let articles = this.model;

    if (category) {
      return articles.filter((article) => article.category === category);
    } else {
      return articles;
    }
  }
}
```

With this code, we have established the following behaviors:

1. If the user navigates to `/articles`, `category` will be `null`, so
   the articles won't be filtered.
2. If the user navigates to `/articles?category=recent`,
   `category` will be set to `"recent"`, so articles will be filtered.
3. Once inside the `articles` route, any changes to the `category`
   property on `controller:articles` will cause the URL to update the
   query param. By default, a query param property change won't cause a
   full router transition (i.e. it won't call `model` hooks and
   `setupController`, etc.); it will only update the URL.

### `<LinkTo />` component

The `<LinkTo />` component supports specifying query params using the `@query`
argument, along with the `{{hash}}` helper:

```handlebars
// Explicitly set target query params
<LinkTo @route="posts" @query={{hash direction="asc"}}>Sort</LinkTo>

// Binding is also supported
<LinkTo @route="posts" @query={{hash direction=this.otherDirection}}>Sort</LinkTo>

```

In the above examples, `direction` is presumably a query param property
on the `posts` controller, but it could also refer to a `direction` property
on any of the controllers associated with the `posts` route hierarchy,
matching the leaf-most controller with the supplied property name.

The `<LinkTo />` component takes into account query parameters when determining
its "active" state, and will set the class appropriately. The active state
is determined by calculating whether the query params end up the same after
clicking a link. You don't have to supply all of the current,
active query params for this to be true.

### transitionTo

`Router#transitionTo` accepts a final argument, which is an object with the key `queryParams`.

```javascript {data-filename=app/routes/some-route.js}
this.router.transitionTo('post', object, { queryParams: { showDetails: true }});
this.router.transitionTo('posts', { queryParams: { sort: 'title' }});

// if you want to transition the query parameters without changing the route
this.router.transitionTo({ queryParams: { direction: 'asc' }});
```

You can also add query params to URL transitions:

```javascript {data-filename=app/routes/some-route.js}
this.router.transitionTo('/posts/1?sort=date&showDetails=true');
```

### Opting into a full transition

When you change query params through a transition (`transitionTo` and `<LinkTo />`),
it is not considered a full transition.
This means that the controller properties associated with the query params will be updated,
as will the URL, but no `Route` method hook like `model` or `setupController` will be called.

If you need a query param change to trigger a full transition, and thus the method hooks,
you can use the optional `queryParams` configuration hash on the `Route`.
If you have a `category` query param and you want it to trigger a model refresh,
you can set it as follows:

```javascript {data-filename=app/routes/articles.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ArticlesRoute extends Route {
  @service store;

  queryParams = {
    category: {
      refreshModel: true
    }
  };

  model(params) {
    // This gets called upon entering 'articles' route
    // for the first time, and we opt into refiring it upon
    // query param changes by setting `refreshModel:true` above.

    // params has format of { category: "someValueOrJustNull" },
    // which we can forward to the server.
    return this.store.query('article', params);
  }
}
```

```javascript {data-filename=app/controllers/articles.js}
import Controller from '@ember/controller';

export default class ArticlesController extends Controller {
  queryParams = ['category'];
  
  category = null;
}
```

### Update URL with `replaceState` instead

By default, Ember will use `pushState` to update the URL in the
address bar in response to a controller query param property change.
If you would like to use `replaceState` instead, which prevents an
additional item from being added to your browser's history,
you can specify this as follows:

```javascript {data-filename=app/routes/articles.js}
import Route from '@ember/routing/route';

export default class ArticlesRoute extends Route {
  queryParams = {
    category: {
      replace: true
    }
  };
}
```

This behavior is similar to `<LinkTo />`,
which also lets you opt into a `replaceState` transition via `replace=true`.

### Map a controller's property to a different query param key

By default, specifying `foo` as a controller query param property will
bind to a query param whose key is `foo`, e.g. `?foo=123`.
You can also map a controller property to a different query param key using the following configuration syntax:

```javascript {data-filename=app/controllers/articles.js}
import Controller from '@ember/controller';

export default class ArticlesController extends Controller {
  queryParams = [{
    category: 'articles_category'
  }];

  category = null;
}
```

This will cause changes to the `controller:articles`'s `category`
property to update the `articles_category` query param, and vice versa.

Query params that require additional customization can
be provided along with strings in the `queryParams` array.

```javascript {data-filename=app/controllers/articles.js}
import Controller from '@ember/controller';

export default class ArticlesController extends Controller {
  queryParams = ['page', 'filter', {
    category: 'articles_category'
  }];

  category = null;
  page = 1;
  filter = 'recent';
}
```

### Default values and deserialization

In the following example,
the controller query param property `page` is considered to have a default value of `1`.

```javascript {data-filename=app/controllers/articles.js}
import Controller from '@ember/controller';

export default class ArticlesController extends Controller {
  queryParams = ['page'];
  
  page = 1;
}
```

This affects query param behavior in two ways:

1. Query param values are cast to the same datatype as the default
   value, e.g. a URL change from `/?page=3` to `/?page=2` will set
   `controller:articles`'s `page` property to the number `2`, rather than
   the string `"2"`. The same also applies to boolean default values. If the
   default value is an array, the string will be parsed using `JSON.parse`.
2. When a controller's query param property is currently set to its
   default value, this value won't be serialized into the URL. So in the
   above example, if `page` is `1`, the URL might look like `/articles`,
   but once someone sets the controller's `page` value to `2`, the URL
   will become `/articles?page=2`.

### Sticky Query Param Values

The query params are defined per route/controller. They are not global to the app. 
For example, if a route `first-route` has a query param `firstParam` associated with it and we try to navigate to `first-route` by using `<LinkTo />` component from a different route `second-route`, like in the following handlebar template, the `firstParam` will be omitted.

```handlebars
<LinkTo @route="first-route" @query={{hash secondParam="asc"}}>Sort</LinkTo>
```

By default, query param values in Ember are "sticky",
in that if you make changes to a query param and then leave and re-enter the route,
the new value of that query param will be preserved (rather than reset to its default).
This is a particularly handy default for preserving sort/filter parameters as you navigate back and forth between routes.

Furthermore, these sticky query param values are remembered/restored according to the model loaded into the route.
So, given a `team` route with dynamic segment `/:team_name` and controller query param "filter",
if you navigate to `/badgers` and filter by `"rookies"`,
then navigate to `/bears` and filter by `"best"`,
and then navigate to `/potatoes` and filter by `"worst"`,
then given the following nav bar links:

```handlebars
<LinkTo @route="team" @model="badgers">Badgers</LinkTo>
<LinkTo @route="team" @model="bears">Bears</LinkTo>
<LinkTo @route="team" @model="potatoes">Potatoes</LinkTo>
```

the generated links would be:

```html
<a href="/badgers?filter=rookies">Badgers</a>
<a href="/bears?filter=best">Bears</a>
<a href="/potatoes?filter=worst">Potatoes</a>
```

This illustrates that once you change a query param,
it is stored and tied to the model loaded into the route.

If you wish to reset a query param, you have two options:

1. explicitly pass in the default value for that query param into
   `<LinkTo />` or `transitionTo`.
2. use the `Route.resetController` hook to set query param values back to
   their defaults before exiting the route or changing the route's model.

In the following example, the controller's `page` query param is reset to 1,
_while still scoped to the pre-transition `ArticlesRoute` model_.
The result of this is that all links pointing back into the exited route will use the newly reset value `1` as the value for the `page` query param.

```javascript {data-filename=app/routes/articles.js}
import Route from '@ember/routing/route';

export default class ArticlesRoute extends Route {
  resetController(controller, isExiting, transition) {
    if (isExiting) {
      // isExiting would be false if only the route's model was changing
      controller.set('page', 1);
    }
  }
}
```

In some cases, you might not want the sticky query param value to be
scoped to the route's model but would rather reuse a query param's value
even as a route's model changes. This can be accomplished by setting the
`scope` option to `"controller"` within the controller's `queryParams`
config hash:

```javascript {data-filename=app/controllers/articles.js}
import Controller from '@ember/controller';

export default class ArticlesController extends Controller {
  queryParams = [{
    showMagnifyingGlass: {
      scope: 'controller'
    }
  }];
}
```

The following demonstrates how you can override both the scope and the query param URL key of a single controller query param property:

```javascript {data-filename=app/controllers/articles.js}
import Controller from '@ember/controller';

export default class ArticlesController extends Controller {
  queryParams = ['page', 'filter', {
    showMagnifyingGlass: {
      scope: 'controller',
      as: 'glass'
    }
  }];
}
```

<!-- eof - needed for pages that end in a code block  -->


---

Sometimes you want to redirect a user to a different page than what they requested for.

For example, if they're not logged in, you might want to prevent them from editing their profile, accessing private information,
or checking out items in their shopping cart.
Usually you want to redirect them to the login page, and after they have successfully logged in, take them back to the page they originally wanted to access.

There are many other reasons you probably want to have the last word on whether a user can or cannot access a certain page.
Ember allows you to control that access with a combination of hooks and methods in your route.

One of the methods is [`transitionTo()`](https://api.emberjs.com/ember/release/classes/RouterService/methods/transitionTo?anchor=transitionTo).
Calling `transitionTo()` on the router service will stop any transitions currently in progress and start a new one, functioning as a redirect.

The other one is [`replaceWith()`](https://api.emberjs.com/ember/release/classes/RouterService/methods/replaceWith?anchor=replaceWith) which works the same way as `transitionTo()`.
The only difference between them is how they manage history.
`replaceWith()` substitutes the current route entry and replaces it with that of the route we are redirecting to,
while `transitionTo()` leaves the entry for the current route and creates a new one for the redirection.

If the new route has dynamic segments, you need to pass either a _model_ or an _identifier_ for each segment.
Passing a model will skip the route's `model()` hook since the model is already loaded.

## Transitioning Before the Model is Known

Since a route's [`beforeModel()`](https://api.emberjs.com/ember/release/classes/Route/methods/beforeModel?anchor=beforeModel) executes before the `model()` hook,
it's a good place to do a redirect if you don't need any information that is contained in the model.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts');
});
```

```javascript {data-filename=app/routes/index.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service router;

  beforeModel(/* transition */) {
    this.router.transitionTo('posts'); // Implicitly aborts the on-going transition.
  }
}
```

`beforeModel()` receives the current transition as an argument, which we can store and retry later.
This allows us to return the user back to the original route.
For example, we might redirect a user to the login page when they try to edit their profile, and immediately redirect
them back to the edit page once they have successfully logged in.
See [Storing and Retrying a Transition](../preventing-and-retrying-transitions/#toc_storing-and-retrying-a-transition)
for how to do that.

If you need to examine some application state to figure out where to redirect,
you might use a [service](../../services/).

## Transitioning After the Model is Known

If you need information about the current model in order to decide about redirection, you can use the [`afterModel()`](https://api.emberjs.com/ember/release/classes/Route/methods/afterModel?anchor=afterModel) hook.
It receives the resolved model as the first parameter and the transition as the second one.
For example:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts');
  this.route('post', { path: '/post/:post_id' });
});
```

```javascript {data-filename=app/routes/posts.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PostsRoute extends Route {
  @service router;

  afterModel(model, transition) {
    if (model.get('length') === 1) {
      this.router.transitionTo('post', model[0]);
    }
  }
}
```

When transitioning to the `posts` route if it turns out that there is only one post,
the current transition will be aborted in favor of redirecting to the `PostRoute`
with the single post object being its model.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        If you attempt to redirect with the `queryParams` option, make sure
        that the query params are defined on the controller!
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>


### Child Routes

Let's change the router above to use a nested route, like this:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts', function() {
    this.route('post', { path: '/:post_id' });
  });
});
```

If we redirect to `posts.post` in the `afterModel` hook, `afterModel`
essentially invalidates the current attempt to enter this route. So the `posts`
route's `beforeModel`, `model`, and `afterModel` hooks will fire again within
the new, redirected transition. This is inefficient, since they just fired
before the redirect.

Instead, we can use the [`redirect()`](https://api.emberjs.com/ember/release/classes/Route/methods/redirect?anchor=redirect) method, which will leave the original
transition validated, and not cause the parent route's hooks to fire again:

```javascript {data-filename=app/routes/posts.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PostsRoute extends Route {
  @service router;

  redirect(model, transition) {
    if (model.get('length') === 1) {
      this.router.transitionTo('posts.post', model[0]);
    }
  }
}
```

<!-- eof - needed for pages that end in a code block  -->


---

One job of a route handler is rendering the appropriate template to the screen.

By default, a route handler will render the template with the same name as the
route. Take this router:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts', function() {
    this.route('new');
  });
});
```

Here, the `posts` route will render the `posts.hbs` template, and
the `posts.new` route will render `posts/new.hbs`.

Each template will be rendered into the `{{outlet}}` of its parent route's
template. For example, the `posts.new` route will render its template into the
`posts.hbs`'s `{{outlet}}`, and the `posts` route will render its template into
the `application.hbs`'s `{{outlet}}`.


---

A route's JavaScript file is one of the best places in an app to make requests to an API.
In this section of the guides, you'll learn how to use the
[`model`](https://api.emberjs.com/ember/release/classes/Route/methods/model?anchor=model)
method to fetch data by making a HTTP request, and render it in a route's `hbs` template, or pass it down to a component.

For example, take this router:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('favorite-posts');
});
```

In Ember, functions that automatically run during rendering or setup are commonly referred to as "hooks".
When a user first visits the `/favorite-posts` route, the `model` hook in `app/routes/favorite-posts.js` will automatically run.
Here's an example of a model hook in use within a route:

```javascript {data-filename=app/routes/favorite-posts.js}
import Route from '@ember/routing/route';

export default class FavoritePostsRoute extends Route {
  model() {
    console.log('The model hook just ran!');
    return 'Hello Ember!';
  }
}
```

`model` hooks have some special powers:

1. When you return data from this model, it becomes automatically available in the route's `.hbs` file as `@model` and in the route's controller as `this.model`.
2. A `model` hook can return just about any type of data, like a string, object, or array, but the most common pattern is to return a JavaScript [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).
3. If you return a Promise from the model hook, your route will wait for the Promise to resolve before it renders the template.
4. Since the `model` hook is Promise-aware, it is great for making API requests (using tools like [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)) and returning the results.
5. When using the `model` hook to load data, you can take advantage of other niceties that Ember provides, like [automatic route transitions](../preventing-and-retrying-transitions/) after the data is returned, [loading screens, error handling](../loading-and-error-substates/), and more.
6. The `model` hook may automatically re-run in certain conditions, as you'll read about below.

## Using the `model` hook

To start, here's an example of returning a simple array from the `model` hook. Even if we eventually plan to fetch this data over a network, starting with something simple makes initial development of a new route quick and easy.

```javascript {data-filename=app/routes/favorite-posts.js}
import Route from '@ember/routing/route';

export default class FavoritePostsRoute extends Route {
  model() {
    return [
      { title: 'Ember Roadmap' },
      { title: 'Accessibility in Ember' },
      { title: 'EmberConf Recap' }
    ];
  }
}
```

Now that data can be used in the `favorite-posts` template:

```handlebars {data-filename=app/templates/favorite-posts.hbs}
{{#each @model as |post|}}
  <div>
    {{post.title}}
  </div>
{{/each}}
```

Behind the scenes, what is happening is that the [route's controller](https://api.emberjs.com/ember/release/classes/Route/methods/setupController?anchor=setupController) receives the results of the model hook, and Ember makes the model hook results available to the template. Your app may not have a controller file for the route, but the behavior is the same regardless.

Let's compare some examples using the model hook to make asynchronous HTTP requests to a server somewhere.

### Fetch example

First, here's an example using a core browser API called [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), which returns a Promise.

```javascript {data-filename=app/routes/photos.js}
import Route from '@ember/routing/route';

export default class PhotosRoute extends Route {
  async model() {
    const response = await fetch('/my-cool-end-point.json');
    const photos = await response.json();

    return { photos };
  }
}
```

### EmberData example

EmberData is a powerful (but optional) library included by default in new Ember apps.
In the next example, we will use EmberData's [`findAll`](https://api.emberjs.com/ember-data/release/classes/Store/methods/findAll?anchor=findAll) method, which returns a Promise, and resolves with an array of [EmberData records](../../models/).

```javascript {data-filename=app/routes/favorite-posts.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class FavoritePostsRoute extends Route {
  @service store;

  model() {
    return this.store.findAll('post');
  }
}
```

Note that EmberData also has a feature called a [`Model`](https://api.emberjs.com/ember-data/release/classes/Model), but it's a separate concept from a route's [`model`](https://api.emberjs.com/ember/release/classes/Route/methods/model?anchor=model) hook.

## Multiple Models

What should you do if you need the `model` to return the results of multiple API requests?

Multiple models can be returned through an
[RSVP.hash](https://api.emberjs.com/ember/release/classes/rsvp/methods/hash?anchor=hash).
The `RSVP.hash` method takes an object containing multiple promises.
If all of the promises resolve, the returned promise will resolve to an object that contains the results of each request. For example:

```javascript {data-filename=app/routes/songs.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

export default class SongsRoute extends Route {
  @service store;

  model() {
    return RSVP.hash({
      songs: this.store.findAll('song'),
      albums: this.store.findAll('album')
    });
  }
}
```

In the `songs` template, we can specify both models and use the `{{#each}}` helper to display
each record in the song model and album model:

```handlebars {data-filename=app/templates/songs.hbs}
<h1>Playlist</h1>

<ul>
  {{#each @model.songs as |song|}}
    <li>{{song.name}} by {{song.artist}}</li>
  {{/each}}
</ul>

<h1>Albums</h1>

<ul>
  {{#each @model.albums as |album|}}
    <li>{{album.title}} by {{album.artist}}</li>
  {{/each}}
</ul>
```

## Dynamic Models

In the examples above, we showed a route that will always return the same data, a collection of favorite posts. Even when the user leaves and re-enters the `/posts` route, they will see the same thing.
But what if you need to request different data after user interaction?
What if a specific post should load based on the URL that the user visited, like `posts/42`?
In Ember, this can be accomplished by defining routes with [dynamic
segments](../defining-your-routes/#toc_dynamic-segments), or by using [query parameters](../query-params/), and then using the dynamic data to make requests.

In the previous Guides topic, we showed making a dynamic segment in the app's `router.js`:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts');
  this.route('post', { path: '/post/:post_id' });
});
```

Whatever shows up in the URL at the `:post_id`, the dynamic segment, will be available in the params for the route's `model` hook:

```javascript {data-filename=app/routes/post.js}
import Route from '@ember/routing/route';

export default class PostRoute extends Route {
  model(params) {
    console.log('This is the dynamic segment data: ' + params.post_id);
    // make an API request that uses the id
  }
}
```

In the `model` hook for routes with dynamic segments, it's your job to
turn the ID (something like `47` or `post-slug`) into a model that can
be rendered by the route's template.

In the above example, we could use the post's ID (`params.post_id`) as
an argument to EmberData's `findRecord` method.

```javascript {data-filename=app/routes/post.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PostRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('post', params.post_id);
  }
}
```

Note that currently, if `model` is not specified, Ember will attempt
to automatically find a store and use it for lookup. This behavior
is a common source of confusion and will be removed in future Ember versions.

### Linking to a dynamic segment

There are two ways to link to a dynamic segment from an `.hbs` template using [`<LinkTo>`](../../templates/links/).
Depending on which approach you use, it will affect whether that route's `model` hook is run.
To learn how to link to a dynamic segment from within the JavaScript file, see the API documentation on
[`transitionTo`](https://api.emberjs.com/ember/release/classes/RouterService/methods/transitionTo?anchor=transitionTo)
instead.

When you provide a string or number to the `<LinkTo>`, the dynamic segment's `model` hook will run when the app transitions to the new route.
In this example, `photo.id` might have an id of `4`:

```handlebars {data-filename=app/templates/photos.hbs}
{{#each @model as |photo|}}
  <LinkTo @route="photo" @model={{photo.id}}>
    link text to display
  </LinkTo>
{{/each}}
```

However, if you provide the entire model context, the model hook for that URL segment will _not_ be run.
For this reason, many Ember developers choose to pass only ids to `<LinkTo>` so that the behavior is consistent.

Here's what it looks like to pass the entire `photo` record:

```handlebars {data-filename=app/templates/photos.hbs}
{{#each @model as |photo|}}
  <LinkTo @route="photo" @model={{photo}}>
    link text to display
  </LinkTo>
{{/each}}
```

If you decide to pass the entire model, be sure to cover this behavior in your [application tests](../../testing/testing-application/).

If a route you are trying to link to has multiple dynamic segments, like `/photos/4/comments/18`, be sure to specify all the necessary information for each segment:

```handlebars
<LinkTo @route="photos.photo.comments.comment" @models={{array 4 18}}>
  link text to display
</LinkTo>
```

Routes without dynamic segments will always execute the model hook.

## Reusing Route Context

Sometimes you need to fetch a model, but your route doesn't have the parameters, because it's
a child route and the route directly above or a few levels above has the parameters that your route
needs.
You might run into this if you have a URL like `/album/4/songs/18`, and when you're in the songs route, you need an album ID.

In this scenario, you can use the `paramsFor` method to get the parameters of a parent route.

```javascript {data-filename=app/routes/album/index.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AlbumIndexRoute extends Route {
  @service store;

  model() {
    let { album_id } = this.paramsFor('album');

    return this.store.query('song', { album: album_id });
  }
}
```

This is guaranteed to work because the parent route is loaded. But if you tried to
do `paramsFor` on a sibling route, you wouldn't have the results you expected.

This is a great way to use the parent context to load something that you want.
Using `paramsFor` will also give you the query params defined on that route's controller.
This method could also be used to look up the current route's parameters from an action
or another method on the route, and in that case we have a shortcut: `this.paramsFor(this.routeName)`.

In our case, the parent route had already loaded its songs, so we would be writing unnecessary fetching logic.
Let's rewrite the same route, but use `modelFor`, which works the same way, but returns the model
from the parent route.

```javascript {data-filename=app/routes/album/index.js}
import Route from '@ember/routing/route';

export default class AlbumIndexRoute extends Route {
  model() {
    let { songs } = this.modelFor('album');

    return songs;
  }
}
```

In the case above, the parent route looked something like this:

```javascript {data-filename=app/routes/album.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

export default class AlbumRoute extends Route {
  @service store;

  model({ album_id }) {
    return RSVP.hash({
      album: this.store.findRecord('album', album_id),
      songs: this.store.query('song', { album: album_id })
    });
  }
}
```

And calling `modelFor` returned the result of the `model` hook.

## Debugging models

If you are having trouble getting a model's data to show up in the template, here are some tips:

- Use the [`{{debugger}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/debugger?anchor=debugger) or [`{{log}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/log?anchor=log) helper to inspect the `{{@model}}` from the template
- return hard-coded sample data as a test to see if the problem is really in the model hook, or elsewhere down the line
- study JavaScript Promises in general, to make sure you are returning data from the Promise correctly
- make sure your `model` hook has a `return` statement
- check to see whether the data returned from a `model` hook is an object, array, or JavaScript Primitive. For example, if the result of `model` is an array, using `{{@model}}` in the template won't work. You will need to iterate over the array with an [`{{#each}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each?anchor=each) helper. If the result is an object, you need to access the individual attribute like `{{@model.title}}` to render it in the template.
- use your browser's development tools to examine the outgoing and incoming API responses and see if they match what your code expects
- If you are using EmberData, use the [Ember Inspector](../../ember-inspector/) browser plugin to explore the View Tree/Model and Data sections.


---

A [`Service`](https://api.emberjs.com/ember/release/classes/Service) is an Ember object that lives for the duration of the application, and can be made available in different parts of your application.

Services are useful for features that require shared state or persistent connections. Example uses of services might
include:

* User/session authentication.
* Geolocation.
* WebSockets.
* Server-sent events or notifications.
* Server-backed API calls that may not fit EmberData.
* Third-party APIs.
* Logging.

### Defining Services

Services can be generated using Ember CLI's `service` generator.
For example, the following command will create the `ShoppingCart` service:

```bash
ember generate service shopping-cart
```

Services must extend the [`Service`](https://api.emberjs.com/ember/release/classes/Service) base class:

```javascript {data-filename=app/services/shopping-cart.js}
import Service from '@ember/service';

export default class ShoppingCartService extends Service {
}
```

Like any Ember object, a service is initialized and can have properties and methods of its own.
Below, the shopping cart service manages an items array that represents the items currently in the shopping cart.

```javascript {data-filename=app/services/shopping-cart.js}
import { TrackedArray } from 'tracked-built-ins';
import Service from '@ember/service';

export default class ShoppingCartService extends Service {
  items = new TrackedArray([]);

  add(item) {
    this.items.push(item);
  }

  remove(item) 
    this.items.splice(this.items.indexOf(item), 1);
  }

  empty() {
    this.items.splice(0, this.items.length);
  }
}
```

### Accessing Services

To access a service,
you can inject it into any container-resolved object such as a component or another service using the `service` decorator from the `@ember/service` module.
There are two ways to use this decorator.
You can either invoke it with no arguments, or you can pass it the registered name of the service.
When no arguments are passed, the service is loaded based on the name of the decorated property.
You can load the shopping cart service with no arguments like below.

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class CartContentsComponent extends Component {
  // Will load the service defined in: app/services/shopping-cart.js
  @service shoppingCart;
}
```

This injects the shopping cart service into the component and makes it available as the `shoppingCart` property.

Another way to inject a service is to provide the name of the service as an argument to the decorator.

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class CartContentsComponent extends Component {
  // Will load the service defined in: app/services/shopping-cart.js
  @service('shopping-cart') cart;
}
```

This injects the shopping cart service into the component and makes it available as the `cart` property.

Sometimes a service may or may not exist, like when an initializer conditionally registers a service.
Since normal injection will throw an error if the service doesn't exist,
you must look up the service using Ember's [`getOwner`](https://api.emberjs.com/ember/release/classes/@ember%2Fapplication/methods/getOwner?anchor=getOwner) instead.

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { getOwner } from '@ember/application';

export default class CartContentsComponent extends Component {
  // Will load the service defined in: app/services/shopping-cart.js
  get cart() {
    return getOwner(this).lookup('service:shopping-cart');
  }
}
```

Injected properties are lazy loaded; meaning the service will not be instantiated until the property is explicitly called.

Once loaded, a service will persist until the application exits.

Below we add a remove action to the `cart-contents` component.

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class CartContentsComponent extends Component {
  @service('shopping-cart') cart;

  @action
  remove(item) {
    this.cart.remove(item);
  }
}
```

Once injected into a component, a service can also be used in the template.
Note `cart` being used below to get data from the cart.

```handlebars {data-filename=app/components/cart-contents.hbs}
<ul>
  {{#each this.cart.items as |item|}}
    <li>
      {{item.name}}
      <button type="button" {{on "click" (fn this.remove item)}}>Remove</button>
    </li>
  {{/each}}
</ul>
```

<!-- eof - needed for pages that end in a code block  -->


---

---
redirect: components/component-state-and-actions
---


---

---
redirect: components/component-arguments-and-html-attributes
---


---

---
redirect: components/helper-functions
---


---

---
redirect: components/conditional-content
---


---

---
redirect: ember-inspector/index
---


---

---
redirect: components/looping-through-lists
---


---

---
redirect: components/looping-through-lists
---


---

---
redirect: components/index
---


---

---
redirect: components/index
---


---

---
redirect: components/built-in-components
---


---

---
redirect: routing/linking-between-routes
---


---

---
redirect: components/helper-functions
---


---

---
redirect: testing/testing-application
---


---

Ember gives you **the power to write tests and be productive from day one**. You can be confident that your app will be correct today and years from now. A question remains: _How_ should you write tests?

Since tests are a core part of the Ember framework and your development cycle, we will dedicate several sections to learning how to write tests.

In this section, we will cover why testing is important and how to run, debug and filter your tests.

## Why Do I Need Tests?

Writing tests is a necessary ingredient if you want to guarantee users and stakeholders that your app, whether small or large, will function as intended at any given time. The larger your app, the more costly and error-prone manual testing becomes.

Writing tests is also a fun activity, a nice change of pace from delivering features daily, and a way to help you refactor code and improve as a developer. Tests can also serve as a living documentation — a key element in onboarding new developers.

## How to Run Tests

You have a few options for running tests.

First, you can run the test suite by entering the command `ember test`, or `ember t`, in your terminal. This will run the suite just once.

Running a local development server (through `npm start`), you can visit the `/tests` URI. This will render the `tests/index.html` template. This will also auto-update as you are changing files in your app.

```bash
# Run all tests once
ember test
ember t
```

### How to Filter Tests

When you are working on a single component or page, you will want only a small subset of tests to run after every file change. To specify which tests to run, you can add `--module` or `--filter` option to your command.

The `--module` option allows you to select a **module**—a group of tests that you specified in `module()` in QUnit.

```bash
# Button component example
ember test --module="Integration | Component | simple-button"

# Run tests for a location service
ember t -m="Unit | Service | location"
```

The `--filter` option is more versatile. You can provide a phrase to match against the modules and test descriptions. A test description is what appears in `test()` in QUnit.

```bash
# Button component example
ember test --filter="should show icon and label"

# Test everything related to your dashboard
ember t -f="Dashboard"

# Run integration tests
ember t -f="Integration"
```

In QUnit, you can exclude tests by adding an exclamation point to the beginning of the filter, e.g. `ember test --filter="!Acceptance"`.

To learn more about options for testing, you can visit [Ember CLI Documentation](https://ember-cli.com/testing) or type `ember help test` in the command line.

## How to Debug Tests

When you are writing tests or application code, the execution of your tests may fail.

To find out the problem, you can add [`debugger`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/debugger) to your code to check the intermediate state. You can add this line to both test and application code.

Thanks to Ember's setup, you can also use [`pauseTest()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#pausetest) and [`resumeTest()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#resumetest) to debug your tests. `pauseTest` allows you to inspect the DOM easily, but can only be used in the test code.

Simply add `await pauseTest();` to your test code, then save. When the test reaches this line, it will pause, allowing you to inspect the state of your application. When you are done, type `resumeTest()` in the browser console to continue the test.

## Summary

Ember considers testing a first-class citizen. In addition, it provides various inbuilt functionalities to run, filter and debug tests.

In the next section, we will see what tools can help you with testing and how to get started with them.


---

Ember provides 3 types of tests out of the box:

- Unit tests
- Rendering tests (previously known as integration tests)
- Application tests (previously known as acceptance tests)

Broadly speaking, these tests differ in two aspects:

- Which parts of your app they check for correctness. Having different types of tests help separate testing concerns.
- How fast they execute.

Let's take a look at each type and when you might use one over another.


## Unit Tests

### Definition

Unit tests check the **correctness of individual methods and functions**. Given an input, does the method return the right output? Since unit tests can check code at the method level, they can form the **foundation of your test suite**. Unit tests are also **extremely fast** by nature.

Unit tests get created automatically when you use Ember CLI to create [adapters](../../models/customizing-adapters/), controllers, initializers, [models](../../models/defining-models/), [serializers](../../models/customizing-serializers/), [services](../../services/), and utilities. We encourage you to read the rest of the documentation to learn writing tests for each.

### Why Use Them?

The benefits of having unit tests are threefold.

One, unit tests are typically isolated and focus on individual methods and functions, so it is easy to debug when your tests fail.

Two, unit tests allow you to focus on small pieces of logic that might be difficult to exercise in higher-level tests.

Finally, unit tests run extremely fast, so you can check many permutations of arguments with minimal impact on your test suite performance.

### Examples

The code below shows how unit tests check individual methods. Imagine that our app has a utility that helps us work with numbers.

```javascript {data-filename=tests/unit/math-library-test.js}
import { module, test } from 'qunit';
import { getDivisors, isPrime } from 'our-app-name/utils/math-library';

module('Unit | Utility | math-library', function() {
  test('should check if a number is prime', function(assert) {
    assert.strictEqual(isPrime(1), false);
    assert.strictEqual(isPrime(2), true);
    assert.strictEqual(isPrime(3), true);
    assert.strictEqual(isPrime(4), false);
    assert.strictEqual(isPrime(5), true);
    assert.strictEqual(isPrime(6), false);
  });

  test('should get all divisors of a number', function(assert) {
    assert.deepEqual(getDivisors(1), [1]);
    assert.deepEqual(getDivisors(2), [1, 2]);
    assert.deepEqual(getDivisors(3), [1, 3]);
    assert.deepEqual(getDivisors(4), [1, 2, 4]);
    assert.deepEqual(getDivisors(5), [1, 5]);
    assert.deepEqual(getDivisors(6), [1, 2, 3, 6]);
  });
});
```

Here are more examples where unit tests are ideal:

- Inside a controller, a computed property continues to filter `this.model` correctly after an action is taken
- Check how [`normalize()`](https://api.emberjs.com/ember-data/release/classes/JSONAPISerializer/methods/normalize?anchor=normalize) in a serializer receives data
- Check how [`serialize()`](https://api.emberjs.com/ember-data/release/classes/JSONAPISerializer/methods/serialize?anchor=serialize) in a serializer sends data
- A [cron](https://en.wikipedia.org/wiki/Cron) utility parses an input string into an object that can be used for UI

### What to Watch Out for

When unit tests involve the Ember framework, you must import and call [`setupTest()`](https://github.com/emberjs/ember-qunit#setup-tests), then pass the `hooks` object. (Don't worry. [Ember CLI](../#toc_ember-cli) will do this for you!)

For example, consider a service that keeps an array of messages, to be shown to the user at a later time:

```javascript {data-filename=tests/unit/services/flash-messages-test.js}
import { setupTest } from 'my-app-name/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Service | flash-messages', function(hooks) {
  setupTest(hooks);

  test('should be able to buffer messages', function(assert) {
    let service = this.owner.lookup('service:flash-messages');

    service.add('Hello');
    service.add('World!');

    assert.deepEqual(service.get('messages'), ['Hello', 'World!']);
  });
});
```

By calling `setupTest()`, you gain access to a few things. First is Ember's [Dependency Injection](../../applications/dependency-injection/) system. In short, you can [look up](https://api.emberjs.com/ember/release/classes/ApplicationInstance/methods/lookup?anchor=lookup) anything in your application, with a little help from `this.owner`. Second, you gain access to some common utility functions, `this.get()` and `this.set()`, in your tests. Finally, you can use `pauseTest()` to [debug your tests](../#toc_how-to-debug-tests).


## Rendering Tests

### Definition

Rendering tests (integration tests) check how a **component looks and behaves**. Ember CLI creates rendering tests for [components](../../components/defining-a-component/) and [helpers](../../templates/writing-helpers/).

In terms of performance, rendering tests sit in the middle, between unit and application tests.

### Why Use Them?

Since your app is made up of multiple components, you want to ensure that each is correct before testing them as a group. If a component is reusable, you want to guarantee that it works for all (if not, many) permutations of [arguments](../../components/component-arguments-and-html-attributes/) and [actions](../../components/component-state-and-actions/).

Rendering tests let you test components using Ember's rendering engine. This means, a component created in your rendering test will behave as it would in the real app. You are guaranteed that the component will follow its lifecycle hooks. You can also interact with the component like an end-user would.

### Examples

Consider a button component. For simplicity, assume that the component keeps track of the number of clicks and displays it as label. (In other words, this component doesn't allow arguments or actions to be passed.)

```javascript {data-filename=tests/integration/components/simple-button-test.js}
import { click, render } from '@ember/test-helpers';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

module('Integration | Component | simple-button', function(hooks) {
  setupRenderingTest(hooks);

  test('should keep track of clicks', async function(assert) {
    await render(hbs`<SimpleButton />`);
    assert.dom('[data-test-label]').hasText('0 clicks');

    await click('[data-test-button]');
    assert.dom('[data-test-label]').hasText('1 click');

    await click('[data-test-button]');
    assert.dom('[data-test-label]').hasText('2 clicks');
  });
});
```

Note, we imported `render` and `click` from [@ember/test-helpers](https://github.com/emberjs/ember-test-helpers/blob/master/API.md) to show and interact with the component. We also imported `hbs` from [ember-cli-htmlbars](https://github.com/ember-cli/ember-cli-htmlbars) to help with inline template definitions. With these methods, we can check if clicking on the component correctly updates its output to the user.

Here are more examples where rendering tests are ideal:

* A blog post component allows two modes—view and edit
* A button component satisfies accessibility for various arguments and actions
* A navigation component recursively renders child nav items
* A helper, which uses [`Intl.NumberFormat`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat), formats a price depending on the currency and number of digits to show


### What to Watch Out for

In order for rendering tests to work, you must call [`setupRenderingTest()`](https://github.com/emberjs/ember-qunit#setup-rendering-tests) and pass the `hooks` object.

What does `setupRenderingTest()` do? First, it uses `setupTest()` behind the scenes. Just like in [Unit Tests](../test-types/#toc_what-to-watch-out-for), you have access to `this.owner`, `this.get()`, `this.set()`, and `pauseTest()`.

In addition, `setupRenderingTest()` allows Ember's renderer to use helpers for rendering and DOM interaction, such as `render`, `click`, and `fillIn`. You can also use `this.element` to access the DOM element that results from `render`.


## Application Tests

### Definition

You can use application tests (acceptance tests) to **verify user stories and features from an end-user perspective**. You interact with the application in the same way as a user would—from visiting the homepage, to authenticating oneself, to navigating to a different page, to filling out a form, etc.

Application tests are slower than unit and rendering tests because they create an instance of the Ember application.

### Why Use Them?

Application tests help you see how well different components interact with each other. For nested or contextual components, you can get by with rendering tests. If components are unrelated, however, application tests may be the only way.

You can also use application tests to check routing. Can the user navigate from one page to another? Will they see the right components when the page is loaded? It's easy to check these in application tests.

Finally, if your application receives and sends data, you want to guarantee that you can take these actions successfully. You also want to prove that you can handle the error states correctly. Application tests are a great place to check these, since you have to interact with the app just like the user would.

### Examples

Let's continue with the blog post example from [Rendering Tests](../test-types/#toc_examples-1). Recall that our blog post component allows two modes—view and edit. The following test checks one way for creating a blog post:

```javascript {data-filename=tests/acceptance/posts-test.js}
import { click, currentURL, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'my-app-name/tests/helpers';
import { module, test } from 'qunit';

module('Acceptance | posts', function(hooks) {
  setupApplicationTest(hooks);

  test('The user can create a blog post', async function(assert) {
    await visit('/posts/new');
    await fillIn('[data-test-field="Title"]', 'My New Post');
    await fillIn('[data-test-field="Content"]', 'Lorem ipsum dolor sit amet');
    await click('[data-test-button="Save"]');

    // The user is redirected to their new post
    assert.strictEqual(currentURL(), '/posts/1');
    assert.dom('[data-test-field="Title"]').hasText('My New Post');
    assert.dom('[data-test-field="Content"]').hasText('Lorem ipsum dolor sit amet');
  });
});
```

What are other things that you can test for?

- The user can read, update, and delete blog posts (possibly in a batch operation)
- The user can make comments on a blog post
- The user can share a blog post
- The user should be authorized to take actions on a blog
- The user receives feedback if there is an error

### What to Watch Out for

There are a few things to look out for.

First is the time that application tests take to run. For small apps, its impact is minimal. However, for large apps, maintaining a short feedback loop becomes critical. In these cases, if you can verify a scenario in your app using unit or rendering tests, you may want to consider them instead.

Second, you can use Ember CLI to create an application test. Because application tests can cover anything in your app, you will want to organize the files in some natural manner. This will help you quickly find tests and prevent writing duplicates.

One way to organize is to mimic the folder structure of `app/routes`. In other words, for every route, you create an application test file. If this would result in too many files, you can instead create a file for each parent route.

Finally, in order for application tests to work, you must call [`setupApplicationTest()`](https://github.com/emberjs/ember-qunit#setup-application-tests) and pass the `hooks` object. In addition to the usual goodness of `setupTest()`, this method creates an application instance so that you can test the app from an end-user perspective. It also lets you use test helpers for routing and DOM interaction, such as `currentURL`, `visit`, `click`, and `fillIn`.


## Summary

We learned that, by default, Ember provides 3 types of tests: unit, rendering, and application tests.

These tests differ in how many parts of your app they integrate to help you arrive at a logical conclusion. On one end, unit tests let you check a section of your code in isolation. On the other, application tests let you experience your entire application as end-user.

A corollary is that these tests differ in performance. The more parts used (the closer to the real app), the slower the tests. As your app gets bigger, you will want to maintain a healthy mix of unit, rendering, and application tests so that you can enjoy both broad test coverage and short feedback loop.

In the next section, we will take a look at best practices for writing tests.


---

To create an application test, run `ember generate acceptance-test <name>`.
For example:

```bash
ember g acceptance-test login
```

This generates this file:

```javascript {data-filename=tests/acceptance/login-test.js}
import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'my-app-name/tests/helpers';

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /login', async function(assert) {
    await visit('/login');
    assert.equal(currentURL(), '/login');
  });
});
```

`module` allows you to scope your tests: Any test setup that is done inside of this scope will
apply to all test cases contained in this module.
Scoping your tests with `module` also allows you to execute your tests independently from other tests.
For example, to only run your tests from your `login` module, run `ember test --module='Acceptance | login'`.
`setupApplicationTest` deals with application setup and teardown.
The `test` function contains an example test.

Almost every test has a pattern of visiting a route, interacting with the page
(using the helpers), and checking for expected changes in the DOM.

For example:

```javascript {data-filename=tests/acceptance/new-post-appears-first-test.js}
import { module, test } from 'qunit';
import { click, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'my-app-name/tests/helpers';

module('Acceptance | posts', function(hooks) {
  setupApplicationTest(hooks);

  test('should add new post', async function(assert) {
    await visit('/posts/new');
    await fillIn('[data-test-field="Title"]', 'My new post');
    await click('[data-test-button="Save"]');
    assert
      .dom('[data-test-post-title]')
      .hasText('My new post', 'The user sees the correct title.');
  });
});
```

## Test Helpers

One of the major issues in testing web applications is that all code is
event-driven and therefore has the potential to be asynchronous (i.e. output can
happen out of sequence from input). This has the ramification that code can be
executed in any order.

An example may help here: Let's say a user clicks two buttons, one after another
and both load data from different servers. They take different times to respond.

When writing your tests, you need to be keenly aware of the fact that you cannot
be sure that the response will return immediately after you make your requests,
therefore your assertion code (the "tester") needs to wait for the thing being
tested (the "testee") to be in a synchronized state. In the example above, that
would be when both servers have responded and the test code can go about its
business checking the data (whether it is mock data, or real data).

This is why all Ember's test helpers are wrapped in code that ensures Ember is
back in a synchronized state when it makes its assertions. It saves you from
having to wrap everything in code that does that, and it makes it easier to read
your tests because there's less boilerplate in them.

Ember includes several helpers to facilitate application testing. There are two
types of helpers: **asynchronous** and **synchronous**.

### Asynchronous Helpers

Asynchronous helpers are "aware" of (and wait for) asynchronous behavior within
your application, making it much easier to write deterministic tests.

Some of these handy helpers are:

* [`click(selector)`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#click)
  - Clicks an element and triggers any actions triggered by the element's `click`
    event and returns a promise that fulfills when all resulting async behavior
    is complete.
* [`fillIn(selector, value)`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#fillin)
  - Fills in the selected input with the given value and returns a promise that
     fulfills when all resulting async behavior is complete. Works with `<select>` elements as well as `<input>` elements. Keep in mind that with `<select>` elements, `value` must be set to the _value_ of the `<option>` tag, rather than its _content_ (for example, `true` rather than `"Yes"`).
* [`triggerKeyEvent(selector, type, keyCode)`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#triggerkeyevent)
  - Simulates a key event type, e.g. `keypress`, `keydown`, `keyup` with the
    desired keyCode on element found by the selector.
* [`triggerEvent(selector, type, options)`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#triggerevent)
  - Triggers the given event, e.g. `blur`, `dblclick` on the element identified
    by the provided selector.
* [`visit(url)`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#visit)
  - Visits the given route and returns a promise that fulfills when all resulting
     async behavior is complete.

You can find the full list of helpers in the [API Documentation of ember-test-helpers](https://github.com/emberjs/ember-test-helpers/blob/master/API.md).

The asynchronous test helpers from `@ember/test-helpers` are meant to be used together with the [ES2017 feature async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) to write easy-to-read tests which
deal with asynchronous behavior as follows:

Mark the callback passed to the `test` function as asynchronous using the `async` keyword:

```javascript {data-filename=tests/acceptance/new-post-appears-first-test.js}
  test('should add new post', async function(assert) {

  });
```
Before making an assertion, wait for the execution of each asynchronous helper to finish with the `await` keyword:

```javascript {data-filename=tests/acceptance/new-post-appears-first-test.js}
  test('should add new post', async function(assert) {
    await visit('/posts/new');
    await fillIn('[data-test-field="Title"]', 'My new post');
    await click('[data-test-button="Save"]');
    assert.dom('[data-test-post-title]').hasText('My new post');
  });
```

Once we `await` the execution of the asynchronous helpers this way, we will ensure that all subsequent assertions are always made **after** the
previous steps in the test have completed.

### Synchronous Helpers

Synchronous helpers are performed immediately when triggered.

* [`currentRouteName()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#currentroutename): returns the currently active route name.
* [`currentURL()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#currenturl): returns the current URL.
* [`find(selector)`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#find): finds one element within the app's root element
  that matches the given selector. Scoping to the root element is useful
  to avoid conflicts with the test framework's reporter.
* [`findAll(selector)`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#findall): like `find(selector)`, but finds all elements
  that match the given selector. Equivalent to calling querySelectorAll()
  on the test root element. Returns an array of matched elements.

## Debugging Your Tests

During the development of your tests or when you refactor your application's code, the execution of your tests may fail. In order to help you understand why, [`pauseTest()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#pausetest) and [`resumeTest()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#resumetest) can help you.

To try them out, do the following steps:

1. Add `await pauseTest();` in your test code.
2. Run `npm start`.
3. Visit `http://localhost:4200/tests` in your browser

When the execution of the test come upon `await pauseTest()`, the test will be paused, allowing you to inspect the state of your application.

You can now type `resumeTest()` in the console of your browser to continue the test execution.


---

Components can be tested easily with a rendering test.
Let's see how this plays out in a specific example:

Let's assume we have a component with a `style` property that is updated whenever the value of the `name` property changes.
The `style` attribute of the component is bound to its `style` property.

> You can follow along by generating your own component with `ember generate
> component pretty-color`.

```javascript {data-filename="app/components/pretty-color.js"}
import Component from '@glimmer/component';

export default class PrettyColorComponent extends Component {
  get style() {
    return `color: ${this.args.name}`;
  }
}
```

```handlebars {data-filename="app/components/pretty-color.hbs"}
<div style={{this.style}}>
  Pretty Color: {{@name}}
</div>
```

The `module` from QUnit will scope your tests into groups of tests which can be configured and run independently.
Make sure to call the `setupRenderingTest` function together with the `hooks` parameter first in your new module.
This will do the necessary setup for testing your component for you,
including setting up a way to access the rendered DOM of your component later on in the test,
and cleaning up once your tests in this module are finished.

```javascript {data-filename="tests/integration/components/pretty-color-test.js"}
import { module } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';

module('Integration | Component | pretty-color', function(hooks) {
  setupRenderingTest(hooks);

});
```

Inside of your `module` and after setting up the test, we can now start to create our first test case.
Here, we can use the `QUnit.test` helper and we can give it a descriptive name:

```javascript {data-filename="tests/integration/components/pretty-color-test.js"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';

module('Integration | Component | pretty-color', function(hooks) {
  setupRenderingTest(hooks);

  test('should change colors', async function(assert) {


  });
});
```

Also note how the callback function passed to the test helper is marked with the keyword `async`.
The [ECMAScript 2017 feature async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) allows us to write asynchronous code in an easy-to-read,
seemingly synchronous manner.
We can better see what this means, once we start writing out our first test case:

```javascript {data-filename="tests/integration/components/pretty-color-test.js"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | pretty-color', function(hooks) {
  setupRenderingTest(hooks);

  test('should change colors', async function(assert) {
    // set the outer context to red
    this.set('colorValue', 'red');

    await render(hbs`<PrettyColor @name={{this.colorValue}} />`);

    assert.equal(this.element.querySelector('div').getAttribute('style'), 'color: red', 'starts as red');
  });
});
```

Each test can use the `render()` function imported from the `@ember/test-helpers` package to create a new instance of the component by declaring the component in template syntax,
as we would in our application.
Also notice, the keyword `await` in front of the call to `render`.
It allows the test which we marked as `async` earlier to wait for any asynchronous behavior to complete before executing the rest of the code below.
In this case our first assertion will correctly execute after the component has fully rendered.

Next we can test that changing the component's `name` property updates the
component's `style` attribute and is reflected in the rendered HTML:

```javascript {data-filename="tests/integration/components/pretty-color-test.js"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | pretty-color', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // set the outer context to red
    this.set('colorValue', 'red');

    await render(hbs`<PrettyColor @name={{this.colorValue}} />`);

    assert.equal(this.element.querySelector('div').getAttribute('style'), 'color: red', 'starts as red');

    this.set('colorValue', 'blue');

    assert.equal(this.element.querySelector('div').getAttribute('style'), 'color: blue', 'updates to blue');  });
});
```

We might also test this component to ensure that the content of its template is being rendered properly:

```javascript {data-filename="tests/integration/components/pretty-color-test.js"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | pretty-color', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('colorValue', 'orange');

    await render(hbs`<PrettyColor @name={{this.colorValue}} />`);

    assert.equal(this.element.textContent.trim(), 'Pretty Color: orange', 'text starts as orange');

    this.set('colorValue', 'green');

    assert.equal(this.element.textContent.trim(), 'Pretty Color: green', 'text switches to green');
  });
});
```

### Testing User Interaction

Components are a great way to create powerful, interactive, and self-contained custom HTML elements.
It is important to test the component's methods _and_ the user's interaction with the component.

Imagine you have the following component that changes its title when a button is clicked on:

> You can follow along by generating your own component with `ember generate
> component magic-title`.

```javascript {data-filename="app/components/magic-title.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MagicTitleComponent extends Component {
  @tracked title = 'Hello World';

  @action
  updateTitle() {
    this.title = 'This is Magic';
  }
}
```

```handlebars {data-filename="app/components/magic-title.hbs"}
<h2>{{this.title}}</h2>

<button type="button" class="title-button" {{on "click" this.updateTitle}}>
  Update Title
</button>
```

And our test might look like this:

```javascript {data-filename="tests/integration/components/magic-title-test.js"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | magic-title', function(hooks) {
  setupRenderingTest(hooks);

  test('should update title on button click', async function(assert) {
    await render(hbs`<MagicTitle />`);

    assert.equal(this.element.querySelector('h2').textContent.trim(), 'Hello World', 'initial text is hello world');

    // Click on the button
    await click('.title-button');

    assert.equal(this.element.querySelector('h2').textContent.trim(), 'This is Magic', 'title changes after click');
  });
});
```

Note how we make use of the `click` helper from [`ember-test-helpers`](https://github.com/emberjs/ember-test-helpers) to interact with the component DOM to trigger the `updateTitle` action.
You can find many other helpful helpers for simulating user interaction in rendering tests in the [API documentation of ember-test-helpers](https://github.com/emberjs/ember-test-helpers/blob/master/API.md).

### Testing Actions

Components starting in Ember 2 utilize closure actions.
Closure actions allow components to directly invoke functions provided by outer components.

For example, imagine you have a comment form component that invokes a `submitComment` action when the form is submitted,
passing along the form's data:

> You can follow along by generating your own component with `ember generate
> component comment-form`.

```javascript {data-filename="app/components/comment-form.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CommentFormComponent extends Component {
  @tracked comment = '';

  @action
  submitComment() {
    this.args.submitComment({ comment: this.comment });
  }
}
```

```handlebars {data-filename="app/components/comment-form.hbs"}
<form {{on "submit" this.submitComment}}>
  <label for="comment">Comment:</label>
  <Textarea id="comment" @value={{this.comment}} />
  <input class="comment-input" type="submit" value="Submit"/>
</form>
```

Here's an example test that asserts that the specified `externalAction` function is invoked when the component's internal `submitComment` action is triggered by making use of a test double (dummy function).
The value from the external action is captured in a shared variable (if and when it is called),
so that it can be explicitly asserted directly in the test function at the time where we
expect the closure action to have been called.

```javascript {data-filename="tests/integration/components/comment-form-test.js"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { click, fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | comment-form', function(hooks) {
  setupRenderingTest(hooks);

  test('should trigger external action on form submit', async function(assert) {
    // test double for the external action
    let actual;
    this.set('externalAction', (data) => {
      actual = data;
    });

    await render(hbs`<CommentForm @submitComment={{this.externalAction}} />`);

    // fill out the form and force an onchange
    await fillIn('textarea', 'You are not a wizard!');

    // click the button to submit the form
    await click('.comment-input');

    let expected = { comment: 'You are not a wizard!' };
    assert.deepEqual(actual, expected, 'submitted value is passed to external action');
  });
});
```

### Stubbing Services

In cases where components have dependencies on Ember services,
it is possible to stub these dependencies for rendering tests.
You stub non-Ember services by using the built-in `register()` function to register your stub service in place of the default.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
If you are thinking of stubbing the router service in a unit or integration test, consider writing an acceptance test instead. Acceptance tests let you navigate through many routes in your app, and the router does not need to be stubbed in them. If you choose to stub the router, you will need to stub multiple methods.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Imagine you have the following component that uses a location service to display the city and country of your current location:

> You can follow along by generating your own component with `ember generate
> component location-indicator`.

```javascript {data-filename="app/components/location-indicator.js"}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class LocationIndicatorComponent extends Component {
  @service location;

  // when the coordinates change, call the location service to get the current city and country
  get city() {
    return this.location.getCurrentCity();
  }

  get country() {
    return this.location.getCurrentCountry();
  }
}
```

```handlebars {data-filename="app/components/location-indicator.hbs"}
You currently are located in {{this.city}}, {{this.country}}
```

To stub the location service in your test, create a local stub object that extends `Service` from `@ember/service`,
and register the stub as the service your tests need in the beforeEach function.
In this case we initially force location to "New York".

```javascript {data-filename="tests/integration/components/location-indicator-test.js"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

// Stub location service
class LocationStub extends Service {
  city = 'New York';
  country = 'USA';
  currentLocation = {
    x: 1234,
    y: 5678
  };

  getCurrentCity() {
    return this.city;
  }

  getCurrentCountry() {
    return this.country;
  }
}

module('Integration | Component | location-indicator', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function(assert) {
    this.owner.register('service:location-service', LocationStub);
  });
});
```

Once the stub service is registered,
the test needs to check that the stub data from the service is reflected in the component output.

```javascript {data-filename="tests/integration/components/location-indicator-test.js" data-diff="+30,+31,+32,+33,+34,+35"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

// Stub location service
class LocationStub extends Service {
  city = 'New York';
  country = 'USA';
  currentLocation = {
    x: 1234,
    y: 5678
  };

  getCurrentCity() {
    return this.city;
  }
  
  getCurrentCountry() {
    return this.country;
  }
}

module('Integration | Component | location-indicator', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function(assert) {
    this.owner.register('service:location-service', LocationStub);
  });

  test('should reveal current location', async function(assert) {
    await render(hbs`<LocationIndicator />`);
    assert.equal(this.element.textContent.trim(),
     'You currently are located in New York, USA');
  });
});
```

In the next example, we'll add another test that validates that the display changes when we modify the values on the service.

```javascript {data-filename="tests/integration/components/location-indicator-test.js" data-diff="+36,+37,+38,+39,+40,+41,+42,+43,+44,+45,+46,+47,+48,+49,+50"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

// Stub location service
class LocationStub extends Service {
  city = 'New York';
  country = 'USA';
  currentLocation = {
    x: 1234,
    y: 5678
  };

  getCurrentCity() {
    return this.city;
  }
  
  getCurrentCountry() {
    return this.country;
  }
}

module('Integration | Component | location-indicator', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function(assert) {
    this.owner.register('service:location-service', LocationStub);
  });

  test('should reveal current location', async function(assert) {
    await render(hbs`<LocationIndicator />`);
    assert.equal(this.element.textContent.trim(),
     'You currently are located in New York, USA');
  });

  test('should change displayed location when current location changes', async function (assert) {
    await render(hbs`<LocationIndicator />`);

    assert.equal(this.element.textContent.trim(),
     'You currently are located in New York, USA', 'origin location should display');

    this.locationService = this.owner.lookup('service:location-service');
    this.set('locationService.city', 'Beijing');
    this.set('locationService.country', 'China');
    this.set('locationService.currentLocation', { x: 11111, y: 222222 });

    assert.equal(this.element.textContent.trim(),
     'You currently are located in Beijing, China', 'location display should change');
  });
});
```

### Waiting on Asynchronous Behavior

Often, interacting with a component will cause asynchronous behavior to occur, such as HTTP requests, or timers.
The module `@ember/test-helpers` provides you with several [useful helpers](https://github.com/emberjs/ember-test-helpers/blob/master/API.md) that will allow you to wait for any asynchronous behavior to complete that is triggered by a DOM interaction induced by those.
To use them in your tests, you can `await` any of them to make sure that subsequent assertions are executed once the asynchronous behavior has fully settled:

```javascript
await click('button.submit-button'); // clicks a button and waits for any async behavior initiated by the click to settle
assert.equal(this.element.querySelector('.form-message').textContent, 'Your details have been submitted successfully.');
```

Nearly all of the helpers for DOM interaction from `@ember/test-helpers` return a call to `settled` - a function
that ensures that any Promises, operations in Ember's `run` loop, timers or network requests have already resolved.
The `settled` function itself returns a Promise that resolves once all async operations have come to an end.

You can use `settled` as a helper in your tests directly and `await` it for all async behavior to settle deliberately.

Imagine you have a typeahead component that uses [`Ember.run.debounce`](https://api.emberjs.com/ember/release/classes/@ember%2Frunloop/methods/debounce?anchor=debounce) to limit requests to the server, and you want to verify that results are displayed after typing a character.

> You can follow along by generating your own component with `ember generate
> component delayed-typeahead`.

```javascript {data-filename="app/components/delayed-typeahead.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { debounce } from '@ember/runloop';

export default class DelayedTypeaheadComponent extends Component {
  @tracked searchValue = '';

  @action
  handleTyping() {
    // The fetchResults function is passed into the component from its parent
    debounce(this, this.args.fetchResults, this.searchValue, 250);
  }
};
```

```handlebars {data-filename="app/components/delayed-typeahead.hbs"}
<label for="search">Search</label>
<Input id="search" @value={{this.searchValue}} {{on 'keyup' this.handleTyping}} />
<ul>
  {{#each @results as |result|}}
    <li class="result">{{result.name}}</li>
  {{/each}}
</ul>
```

In your test, use the `settled` helper to wait until your debounce timer is up and then assert that the page is rendered appropriately.

```javascript {data-filename="tests/integration/components/delayed-typeahead-test.js"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | delayed-typeahead', function(hooks) {
  setupRenderingTest(hooks);

  const stubResults = [
    { name: 'result 1' },
    { name: 'result 2' }
  ];

  test('should render results after typing a term', async function(assert) {
    this.set('results', []);

    let value;
    this.set('fetchResults', (data) => {
      value = data;
      this.set('results', stubResults);
    });

    await render(hbs`<DelayedTypeahead @fetchResults={{this.fetchResults}} @results={{this.results}} />`);
    this.element.querySelector('input').value = 'test';
    this.element.querySelector('input').dispatchEvent(new Event('keyup'));

    await settled();
    assert.equal(value, 'test', 'fetch closure action called with search value');

    assert.equal(this.element.querySelectorAll('.result').length, 2, 'two results rendered');
  });
});
```

<!-- eof - needed for pages that end in a code block  -->


---

_Container testing methods and computed properties follow previous patterns shown
in [Testing Basics](../unit-testing-basics/) because Ember.Controller extends Ember.Object._

Controllers can be tested using the `setupTest` helper which is part
of the ember-qunit framework. The tests written for instances like `Ember.Controller` are
also described as container tests.

### Testing Controller Actions

Here we have a controller `PostsController` with two properties, a method that
sets one of those properties, and an action named `setProps`.

> You can follow along by generating your own controller with `ember generate controller posts`.

```javascript {data-filename=app/controllers/posts.js}
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class PostsController extends Controller {
  propA = 'You need to write tests';
  propB = 'And write one for me too';

  setPropB(str) {
    this.propB = str;
  }

  @action
  setProps(str) {
    this.propA = 'Testing is cool';
    this.setPropB(str);
  }
}
```

The `setProps` action directly sets one property, and calls the method to set the other.
In our generated test file, Ember CLI already uses the `module` and the `setupTest` helpers to set up a test
container:

```javascript {data-filename=tests/unit/controllers/posts-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';

module('Unit | Controller | posts', function(hooks) {
  setupTest(hooks);
});
```

Next we use the owner API to gain access to the controller we'd like to test.
Using the `this.owner.lookup` method we get the instance of the `PostsController` and can check the action in our test.
The `this.owner.lookup` helper returns objects generated by the framework in your applications
and is also exposed in tests for your usage. Here it will return a singleton instance of the `PostsController`.

```javascript {data-filename=tests/unit/controllers/posts-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';

module('Unit | Controller | posts', function(hooks) {
  setupTest(hooks);

  test('should update A and B on setProps action', function(assert) {
    assert.expect(4);

    // get the controller instance
    let controller = this.owner.lookup('controller:posts');

    // check the properties before the action is triggered
    assert.equal(
      controller.propA,
      'You need to write tests',
      'propA initialized'
    );
    assert.equal(
      controller.propB,
      'And write one for me too',
      'propB initialized'
    );

    // trigger the action on the controller by using the `send` method,
    // passing in any params that our action may be expecting
    controller.send('setProps', 'Testing Rocks!');

    // finally we assert that our values have been updated
    // by triggering our action.
    assert.equal(controller.propA, 'Testing is cool', 'propA updated');
    assert.equal(controller.propB, 'Testing Rocks!', 'propB updated');
  });
});
```

<!-- eof - needed for pages that end in a code block  -->


---

_Testing helpers follows previous patterns shown in [Testing Components](../testing-components/),
because helpers are rendered to templates just like components._

Helpers are best tested with rendering tests, but can also be tested with unit
tests. Rendering tests will provide better coverage for helpers, as it more
closely simulates the lifecycle of a helper than in isolation.

We're going to demonstrate how to test helpers by testing the `format-currency`
helper from [Writing Helpers](../../templates/writing-helpers/).

> You can follow along by generating your own helper with `ember generate helper
> format-currency`.

```javascript {data-filename=app/helpers/format-currency.js}
import { helper } from '@ember/component/helper';

export function formatCurrency([value, ...rest], namedArgs) {
  let dollars = Math.floor(value / 100);
  let cents = value % 100;
  let sign = namedArgs.sign === undefined ? '$' : namedArgs.sign;

  if (cents.toString().length === 1) { cents = '0' + cents; }
  return `${sign}${dollars}.${cents}`;
}

export default helper(formatCurrency);
```

Let's start by testing the helper by showing a simple unit test and then move on
to testing with a rendering test afterwards.

Helpers are functions, which can be easily tested through `module` alone.

```javascript {data-filename=tests/unit/helpers/format-currency-test.js}
import { formatCurrency } from 'my-app/helpers/format-currency';
import { module, test } from 'qunit';

module('Unit | Helper | format currency', function(hooks) {
  test('formats 199 with $ as currency sign', function(assert) {
    assert.equal(formatCurrency([199], { sign: '$' }), '$1.99');
  });
});
```

As seen in the [Writing Helpers](../../templates/writing-helpers/) guide. 
The helper function expects the unnamed arguments as an array as the 
first argument. It expects the named arguments as
an object as the second argument.

Now we can move on to a more complex test case that ensures our helper is rendered 
correctly as well. This can be done with the `setupRenderingTest` helper, as shown 
in [Testing Components](../testing-components/).

```javascript {data-filename=tests/integration/helpers/format-currency-test.js}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | format currency', function(hooks) {
  setupRenderingTest(hooks);

  test('formats 199 with $ as currency sign', async function(assert) {
    this.set('value', 199);
    this.set('sign', '$');

    await render(hbs`{{format-currency value sign=sign}}`);

    assert.equal(this.element.textContent.trim(), '$1.99');
  });
});
```

We can now also properly test if a helper will respond to property changes.

```javascript {data-filename=tests/integration/helpers/format-currency-test.js}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | format currency', function(hooks) {
  setupRenderingTest(hooks);

  test('formats 199 with $ as currency sign', async function(assert) {
    this.set('value', 199);
    this.set('sign', '$');

    await render(hbs`{{format-currency value sign=sign}}`);

    assert.equal(this.element.textContent.trim(), '$1.99');

    this.set('sign', '€');

    assert.equal(this.element.textContent.trim(), '€1.99', 'Value is formatted with €');
  });
});
```

<!-- eof - needed for pages that end in a code block  -->


---

_Container testing methods and computed properties follow previous patterns shown
in [Testing Basics](../unit-testing-basics/) because DS.Model extends Ember.Object._

[EmberData](https://github.com/emberjs/data) Models can be tested in a module that uses the `setupTest` helper.

Let's assume we have a `Player` model that has `level` and `levelName`
attributes. We want to call `levelUp()` to increment the `level` and assign a
new `levelName` when the player reaches level 5.

> You can follow along by generating your own model with `ember generate model player`.

```javascript {data-filename=app/models/player.js}
import Model, { attr } from '@ember-data/model';

export default class Player extends Model {
  @attr('number', { defaultValue: 0 }) level;
  @attr('string', { defaultValue: 'Noob' }) levelName;

  levelUp() {
    let newLevel = this.level++;
    if (newLevel === 5) {
      this.levelName = 'Professional';
    }
  }
}
```

Now let's create a test which will call `levelUp` on the player when they are
level 4 to assert that the `levelName` changes. We will use `module` together with the `setupTest` helper method:

```javascript {data-filename=tests/unit/models/player-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';
import { run } from '@ember/runloop';

module('Unit | Model | player', function(hooks) {
  setupTest(hooks);

  // Specify the other units that are required for this test.
  test('should increment level when told to', function(assert) {
    const player = run(() =>
      this.owner.lookup('service:store').createRecord('player')
    );

    // wrap asynchronous call in run loop
    run(() => player.levelUp());

    assert.equal(player.level, 5, 'level gets incremented');
    assert.equal(
      player.levelName,
      'Professional',
      'new level is called professional'
    );
  });
});
```

Also note, how both creating a record and updating properties on the record through the `levelUp` method requires
us to wrap these operations into a `run` function. You can read more the Ember run loop [over here](../../applications/run-loop/).

## Testing Relationships

For relationships you probably only want to test that the relationship
declarations are setup properly.

Assume that a `User` can own a `Profile`.

> You can follow along by generating your own user and profile models with `ember generate model user` and `ember generate model profile`.

```javascript {data-filename=app/models/profile.js}
import Model from '@ember-data/model';

export default class ProfileModel extends Model {}
```

```javascript {data-filename=app/models/user.js}
import Model, { belongsTo } from '@ember-data/model';

export default class UserModel extends Model {
  @belongsTo('profile') profile;
}
```

Then you could test that the relationship by looking it up on the `user` model which it is part of.

```javascript {data-filename=tests/unit/models/user-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';
import { get } from '@ember/object';

module('Unit | Model | user', function(hooks) {
  setupTest(hooks);

  test('should own a profile', function(assert) {
    const User = this.owner.lookup('service:store').modelFor('user');

    // lookup the relationship on the user model
    const relationship = get(User, 'relationshipsByName').get('profile');

    assert.equal(relationship.key, 'profile', 'has relationship with profile');
    assert.equal(
      relationship.kind,
      'belongsTo',
      'kind of relationship is belongsTo'
    );
  });
});
```

_EmberData contains extensive tests around the functionality of
relationships, so you probably don't need to duplicate those tests. You could
look at the [EmberData tests](https://github.com/emberjs/data/tree/master/packages/-ember-data/tests) for examples of deeper relationship testing if you
feel the need to do it._


---

_Container testing methods and computed properties follow previous patterns shown
in [Testing Basics](../unit-testing-basics/) because Ember.Route extends Ember.Object._

Testing routes can be done both via application tests or container tests. Application tests
will likely provide better coverage for routes because routes are typically used
to perform transitions and load data, both of which are tested more easily in
full context rather than isolation.

That being said, sometimes it is important to test your routes in a smaller scope. For example,
let's say we'd like to have an alert that can be triggered from anywhere within
our application. The alert function `displayAlert` should be put into the
`ApplicationRoute` because all actions and events bubble up to it from
sub-routes and controllers.

> By default, Ember CLI does not generate a file for its application route.  To
> extend the behavior of the ember application route we will run the command
> `ember generate route application`.  Ember CLI does however generate an application
> template, so when asked whether we want to overwrite `app/templates/application.hbs`
> we will answer 'n'.

```javascript {data-filename=app/routes/application.js}
import Route from '@ember/route';
import { action } from '@ember/object';

export default class ApplicationRoute extends Route {
  @action
  displayAlert(text) {
    this._displayAlert(text);
  }

  _displayAlert(text) {
    alert(text);
  }
}
```

In this route we've [separated our concerns](http://en.wikipedia.org/wiki/Separation_of_concerns):
The action `displayAlert` contains the code that is called when the action is
received, and the private function `_displayAlert` performs the work. While not
necessarily obvious here because of the small size of the functions, separating
code into smaller chunks (or "concerns") allows it to be more readily isolated
for testing, which in turn allows you to catch bugs more easily.

Here is an example of test this route in an isolated test case:

```javascript {data-filename=tests/unit/routes/application-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';

let originalAlert;

module('Unit | Route | application', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function(assert) {
    originalAlert = window.alert; // store a reference to window.alert
  });

  hooks.afterEach(function(assert) {
    window.alert = originalAlert; // restore window.alert
  });

  test('should display an alert', function(assert) {
    assert.expect(2);

    // get the route instance
    let route = this.owner.lookup('route:application');

    // stub window.alert to perform a qunit test
    const expectedTextFoo = 'foo';
    window.alert = (text) => {
      assert.equal(text, expectedTextFoo, `expect alert to display ${expectedTextFoo}`);
    };

    // call the _displayAlert function which triggers the qunit test above
    route._displayAlert(expectedTextFoo);

    // set up a second stub to perform a test with the actual action
    const expectedTextBar = 'bar';
    window.alert = (text) => {
      assert.equal(text, expectedTextBar, `expected alert to display ${expectedTextBar}`);
    };

    // Now use the routes send method to test the actual action
    route.send('displayAlert', expectedTextBar);
  });
});
```

<!-- eof - needed for pages that end in a code block  -->


---

Ember comes with great testing tools out of the box and popular addons which you can use as your testing game evolves.

In this section, we will go through various tools, that you can use while building an Ember app.

## What Tools Can Help Me?

### QUnit, QUnit DOM

Every Ember app comes with [QUnit](http://qunitjs.com/) and [QUnit DOM](https://github.com/simplabs/qunit-dom). QUnit is a testing framework, and QUnit DOM is a library that helps you **write tests that are concise and readable**.

To see the power of QUnit DOM, consider this code snippet. It checks whether our button component shows the right label and the right attributes.

```javascript {data-filename=tests/integration/components/simple-button-test.js}
/*
  For simplicity, the import, module, and setup statements
  are omitted here. Our component accepts two arguments,
  label (string) and isDisabled (boolean).
*/
test("should show label", async function (assert) {
  await render(hbs`
    <SimpleButton
      @label="Hello world!"
    />
  `);
  let button = this.element.querySelector("button");

  // QUnit
  assert.strictEqual(button.textContent.trim(), "Hello world!");

  // QUnit DOM
  assert.dom(button).hasText("Hello world!");
});

test("should allow disabling the button", async function (assert) {
  await render(hbs`
    <SimpleButton
      @label="Hello world!"
      @isDisabled={{true}}
    />
  `);
  let button = this.element.querySelector("button");

  // QUnit
  assert.strictEqual(button.disabled, true);
  assert.ok(button.classList.contains("is-disabled"));

  // QUnit DOM
  assert.dom(button).hasAttribute("disabled");
  assert.dom(button).hasClass("is-disabled");
});
```

### Ember CLI

When you use [Ember CLI](https://ember-cli.com/generators-and-blueprints) to generate an Ember "object" (e.g. component, model, service), it will create a test file with a setup that correctly addresses your testing framework and the [type of test that you should write](../test-types/).

You can also use Ember CLI to create the test file separately from the object. For example, if you enter the following lines in the terminal:

```bash
ember g model-test student
ember g component-test student
ember g acceptance-test students
```

you get a unit test for the `student` model, a rendering test (integration test) for the `student` component, and an application test (acceptance test) that can be used to check the `students` route and its subroutes.

### Ember Test Selectors

You want to be able to grab DOM elements in your tests. Since Ember is just JavaScript, you can use [`querySelector`](https://developer.mozilla.org/docs/Web/API/Element/querySelector) and [`querySelectorAll`](https://developer.mozilla.org/docs/Web/API/Element/querySelectorAll) to do so. These methods require you to pass a **selector**, a string that identifies the element(s) that you want.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Tomster says...</div>
      <div class="cta-note-message">
        While you can use CSS classes as selectors, a best practice for testing is to <strong>separate the concerns between styling and testing</strong>. Class names and DOM structure change over time—for the better—by you, your team, and addon developers. If you rely on CSS classes, your tests will break and need a significant rewrite.
      </div>
    </div>
    <img src="/images/mascots/tomster.png" role="presentation" alt="">
  </div>
</div>

[Ember Test Selectors](https://github.com/simplabs/ember-test-selectors) is an addon that helps you **write tests that are more resilient to DOM changes**. You use `data-test-*` attributes to mark the elements that will be used in your tests. The addon works with QUnit DOM and helpers from [@ember/test-helpers](https://github.com/emberjs/ember-test-helpers/). It also removes the `data-test-*` attributes in the production build.

Consider the example of a button component again. This time, our component can display a Material icon in addition to the label.

```handlebars {data-filename=app/components/simple-button.hbs}
<button data-test-button={{@label}} type="button">
  {{#if @icon}}
    <i data-test-icon aria-hidden="true" class="material-icons">
      {{@icon}}
    </i>
  {{/if}}

  <span data-test-label>{{@label}}</span>
</button>
```

```javascript {data-filename=tests/integration/components/simple-button-test.js}
test("should show icon and label", async function (assert) {
  await render(hbs`
    <SimpleButton
      @icon="face"
      @label="Hello world!"
    />
  `);

  // Bad
  assert.strictEqual(
    this.element.querySelector(".material-icons").textContent.trim(),
    "face",
    "The user sees the correct icon."
  );

  assert.strictEqual(
    this.element.querySelector("span").textContent.trim(),
    "Hello world!",
    "The user sees the correct label."
  );

  // Good
  assert.strictEqual(
    this.element.querySelector("[data-test-icon]").textContent.trim(),
    "face",
    "The user sees the correct icon."
  );

  assert.strictEqual(
    this.element.querySelector("[data-test-label]").textContent.trim(),
    "Hello world!",
    "The user sees the correct label."
  );

  // Great!
  assert
    .dom("[data-test-icon]")
    .hasText("face", "The user sees the correct icon.");

  assert
    .dom("[data-test-label]")
    .hasText("Hello world!", "The user sees the correct label.");
});
```

### Ember CLI Mirage

If your application receives and sends data, you want to show that you can take these actions successfully. You also want to prove that you can handle the error states correctly.

[Ember CLI Mirage](https://www.ember-cli-mirage.com/) is an addon that allows you to create a mock server. You can also use it to test your app against various server states. To learn more about using Mirage in tests, we encourage you to [visit the official website](https://www.ember-cli-mirage.com/docs/testing/acceptance-tests).

### Ember Exam

You want your tests to finish fast. A fast run means you get to try out a different solution and iterate many more times.

[Ember Exam](https://github.com/ember-cli/ember-exam) is an addon that allows you to parallelize the run. If you have many rendering and application tests, this can dramatically speed up your testing.

Ember Exam also lets you randomize how the tests are run. Why would you want to do so? When you don't properly set up and tear down a test, you can create dependencies among tests. Randomizing the order helps you catch these inadvertent bugs.

### Percy

Last but not least, [Percy](https://percy.io/) is a **visual regression testing** tool that ensures consistent user interfaces across different browsers and devices by identifying visual bugs. It captures screenshots of web pages at different development stages and compares them pixel-by-pixel to detect any visual differences.

Visual regression testing is useful for maintaining visual consistency and quality in your app. Check out the [Percy documentation](https://www.browserstack.com/docs/percy/integrate/ember) to set it up in an Ember app.

While we don't recommend this practice in general, you might also use Percy in lieu of application tests to capture complex workflows.

## Summary

Ember provides easy paths to integrate QUnit and it also supports a variety of addons and debugging tools to improve your developer experience in testing.

In the next section, we will study 3 types of tests that Ember supports—unit, rendering, and application tests. We will look at each type and when you might use one over another.


---

Unit tests (as well as container tests) are generally used to test a small piece of code
and ensure that it is doing what was intended.
Unlike application tests, they are narrow in scope and do not require the Ember application to be running.

Let's have a look at a common use case - testing a service - to understand the basic principles of testing in Ember.
This will set the foundation for other parts of your Ember application such as controllers, components, helpers and others.
Testing a service is as simple as creating a container test,
looking up the service on the application's container and running assertions against it.

### Testing Computed Properties

Let's start by creating a service that has a `computedFoo` computed property
based on a `foo` property.

```javascript {data-filename=app/services/some-thing.js}
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SomeThingService extends Service {
  @tracked foo = 'bar';

  get computedFoo() {
    return `computed ${this.foo}`;
  }
}
```

Within the test for this object, we'll lookup the service instance, update the `foo` property (which
should trigger the computed property), and assert that the logic in our
computed property is working correctly.

```javascript {data-filename=tests/unit/services/some-thing-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';

module('Unit | Service | some thing', function(hooks) {
  setupTest(hooks);

  test('should correctly concat foo', function(assert) {
    const someThing = this.owner.lookup('service:some-thing');
    someThing.foo = 'baz';

    assert.equal(someThing.computedFoo, 'computed baz');
  });
});
```

See that first, we are creating a new testing module using the [`QUnit.module`](http://api.qunitjs.com/QUnit/module) function.
This will scope all of our tests together into one group that can be configured
and run independently from other modules defined in our test suite.
Also, we have used `setupTest`, one of the several test helpers provided by [ember-qunit](https://github.com/emberjs/ember-qunit).
The `setupTest` helper provides us with some conveniences, such as the `this.owner` object, that helps us to create or lookup objects
which are needed to setup our test.
In this example, we use the `this.owner` object to lookup the service instance that becomes our test subject: `someThing`.
Note that in a unit test you can customize any object under test by setting its properties accordingly.
We can use the `set` method of the test object to achieve this.

### Testing Object Methods

Next let's look at testing logic found within an object's method. In this case
the `testMethod` method alters some internal state of the object (by updating
the `foo` property).

```javascript {data-filename=app/services/some-thing.js}
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SomeThingService extends Service {
  @tracked foo = 'bar';

  testMethod() {
    this.foo = 'baz';
  }
}
```

To test it, we create an instance of our class `SomeThing` as defined above,
call the `testMethod` method and assert that the internal state is correct as a
result of the method call.

```javascript {data-filename=tests/unit/services/some-thing-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';

module('Unit | Service | some thing', function(hooks) {
  setupTest(hooks);

  test('should update foo on testMethod', function(assert) {
    const someThing = this.owner.lookup('service:some-thing');

    someThing.testMethod();

    assert.equal(someThing.foo, 'baz');
  });
});
```

In case the object's method returns a value, you can simply assert that the
return value is calculated correctly. Suppose our object has a `calc` method
that returns a value based on some internal state.

```javascript {data-filename=app/services/some-thing.js}
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SomeThingService extends Service {
  @tracked count = 0;

  calc() {
    this.count += 1;
    return `count: ${this.count}`;
  }
}
```

The test would call the `calc` method and assert it gets back the correct value.

```javascript {data-filename=tests/unit/services/some-thing-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';

module('Unit | Service | some thing', function(hooks) {
  setupTest(hooks);

  test('should return incremented count on calc', function(assert) {
    const someThing = this.owner.lookup('service:some-thing');

    assert.equal(someThing.calc(), 'count: 1');
    assert.equal(someThing.calc(), 'count: 2');
  });
});
```

### Skipping tests

Some times you might be working on a feature, but know that a certain test will fail so you might want to skip it.
You can do it by using `skip`:

```javascript
import { test, skip } from 'qunit';

test('run this test', function(assert) {
  assert.ok(true);
});

skip('skip this test', function(assert) {
  assert.ok(true);
});
```

### Stubs

Unit tests are often testing methods that call other methods or work with other objects.
A stub is a substitute method or object to be used during the test.
This isolates a unit test to the actual method under test.

#### Stubbing a method

```javascript {data-filename=app/services/some-thing.js}
import Service from '@ember/service';

export default class SomeThingService extends Service {
  someComplicatedOtherMethod(x) {
    return x * 2;
  }

  testMethod(y) {
    let z = this.someComplicatedOtherMethod(y);
    return `Answer: ${z}`;
  }
}
```

`someComplicatedOtherMethod` might have complex behavior that you do not want failing your
unit test for `testMethod`, because you know `testMethod` works otherwise.
Isolating unit tests is best practice because the tests that are failing should directly
point to the method that is failing, allowing you to quickly fix it rather than figuring
out which method the error is in. In we stub the other method:

```javascript {data-filename=tests/unit/services/some-thing-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';

module('Unit | Service | some thing', function(hooks) {
  setupTest(hooks);

  test('testMethod should return result of someComplicatedOtherFunction', function(assert) {
    const someThing = this.owner.lookup('service:some-thing');
    const originalSomeComplicatedOtherMethod =
      someThing.someComplicatedOtherMethod;
    someThing.someComplicatedOtherMethod = function() {
      return 4;
    };

    assert.equal(someThing.testMethod(2), 'Answer 4', 'testMethod is working');

    someThing.someComplicatedOtherMethod = originalSomeComplicatedOtherMethod;
  });
});
```

#### Stubbing an object

You can also stub an object:

```javascript {data-filename=app/services/employees.js}
import Service from '@ember/service';

export default class EmployeesService extends Service {
  employees = [];

  hire(person) {
    person.addJob();
    this.employees.push(person);
    return `${person.title} ${person.name} is now an employee`;
  }
}
```

Here, you need to pass a person object, which could be a complex class.
The `addJob` method in `Person` could be complex as well, perhaps requiring another class.
Instead, create a simple object and pass it instead.

```javascript {data-filename=tests/unit/services/employees-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';

module('Unit | Service | employees', function(hooks) {
  setupTest(hooks);

  test('hire adds a person to employees array', function(assert) {
    const someThing = this.owner.lookup('service:some-thing');

    class MockPerson {
      title = 'Dr.';
      name = 'Zoey';
      addJob() {}
    }

    let person = new MockPerson();

    assert.equal(someThing.hire(person), 'Dr. Zoey is now an employee');
  });
});
```

<!-- eof - needed for pages that end in a code block  -->


---

---
redirect: tutorial/part-1/automated-testing/
---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/acceptance-test.md -->


---

---
redirect: tutorial/part-1
---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/autocomplete-component.md -->


---

---
redirect: tutorial/part-1
---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/deploying.md -->


---

---
redirect: tutorial/part-1/orientation/
---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/ember-cli.md -->


---

---
redirect: tutorial/part-2/ember-data/
---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/ember-data.md -->


---

---
redirect: tutorial/part-1/component-basics
---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/hbs-helper.md -->


---

---
redirect: tutorial/part-1
---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/index.md -->


---

---
redirect: tutorial/part-1
---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/installing-addons.md -->


---

---
redirect: tutorial/part-2/route-params
---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/model-hook.md -->


---

---
redirect: tutorial/part-1/component-basics
---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/routes-and-templates.md -->


---

---
redirect: tutorial/part-2/service-injection
---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/service.md -->


---

---
redirect: tutorial/part-1/component-basics
---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/simple-component.md -->


---

---
redirect: tutorial/part-2/route-params
---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/subroutes.md -->


---

## Create a New TypeScript Application

To start a new Ember project with TypeScript, add the `--typescript` flag when you run [`ember new`][ember-new]:

```shell
ember new my-typescript-app --typescript
```

Using the `--typescript` flag changes the output of `ember new` in a few ways:

### TypeScript Project Files

Project files will be generated with `.ts` extensions instead of `.js`.

### Packages to Support TypeScript

In addition to the usual packages added with `ember new`, the following packages will be added at their current "latest" value:

- `typescript` – tooling to support TypeScript type checking and compilation.
- `@tsconfig/ember` – a shared TypeScript configuration for Ember apps.
- `@typescript-eslint/*` – ESLint support for TypeScript.
- `@types/qunit` - TypeScript type definitions for QUnit.
- `@types/rsvp` - TypeScript type definitions for RSVP.
- `@warp-drive/core-types` - shared core types, type utilities and constants for the WarpDrive and EmberData packages.

<!--
TODO: Uncomment this line when we add Glint docs
- `@glint/*` – a set of packages to support type-checking in templates.
  -->

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          Ember and EmberData publish their own native types compiled directly from their source code, so you do not need to install any <code>@types/ember</code> or <code>@types/ember-data</code> packages. These packages should be considered legacy, are only lightly maintained, and will conflict with the native types.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Files and Config to Support TypeScript

In addition to the usual files added with `ember new`, we also add:

- [`tsconfig.json`][tsconfig] – configuration to set up TypeScript for your project
- [`types/global.d.ts`][global-types] – the location for any global type declarations you need to write
- [`app/config/environment.d.ts`][environment-types] – a basic set of types defined for the contents of your `config/environment.js` file

Additionally:

- `package.json` will have a `lint:types` script to check types with the command line.
- `ember-cli-build.js` will be configured to transform TypeScript at build-time.
- `.ember-cli` has `isTypeScriptProject` set to true, which will force the blueprint generators to generate TypeScript rather than JavaScript by default.
- `.eslintrc.js` will be configured for TypeScript.

## Convert an Existing App to TypeScript

To convert an existing app to TypeScript, you'll need to make the changes described above manually (for now). To facilitate this, we've included a [converting guide][converting].

<!-- Internal links -->

[converting]: ../application-development/converting-an-app/
[ember-new]: ../../getting-started/quick-start/
[environment-types]: ../additional-resources/faq/#toc_environment-configuration-typings
[global-types]: ../additional-resources/faq/#toc_global-types-for-your-project
[tsconfig]: ../application-development/configuration/#toc_tsconfigjson

<!-- External links -->


---

This guide is designed to help you get up and running with TypeScript in an Ember app.

This is _not_ an introduction to TypeScript _or_ Ember. Throughout this guide, we'll link back to [the TypeScript docs][typescript-docs] and to other sections of [the Ember Guides][ember-guides] when there are specific concepts that we will not explain here but which are important for understanding what we're covering!

Not sure where to get started? Here's an overview of the content within:

- If you're totally new to using TypeScript with Ember, start with [Core Concepts: TypeScript and Ember][core-concepts].
- To create a new Ember app or addon with TypeScript, check out [Getting Started with TypeScript][getting-started] and [Building Addons in TypeScript][addons].
- If you're looking to convert an existing Ember app to TypeScript, check out [Converting an Existing Ember App to TypeScript][converting-an-app].
- If you're working with legacy (pre-Octane) Ember and TypeScript together, you should read [TypeScript and Ember Classic][legacy].
- Not ready to switch to TypeScript? You can get many of TypeScript's benefits by [adding types with JSDoc comments][types-with-jsdoc]. We'll talk a bit about this over in the [Signatures][] section.
- Looking for type-checking in Ember templates? Check out [Glint][].

## Why TypeScript?

What is TypeScript, and why should you adopt it?

> TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
>
> — [typescriptlang.org][typescript]

TypeScript lets you build _ambitious web applications_ with confidence—so it's a perfect fit for Ember apps!

- Get rid of `undefined is not a function` and `null is not an object` once and for all.
- Enjoy API docs… that are always up-to-date.
- Experience better developer productivity through top-notch editor support, including incredible autocomplete, guided refactoring, automatic imports, and more.

<!-- Internal links -->

[addons]: ./application-development/addons/
[converting-an-app]: ./application-development/converting-an-app
[core-concepts]: ./core-concepts
[ember-guides]: ..
[getting-started]: ./getting-started
[legacy]: ./additional-resources/legacy
[signatures]: ./core-concepts/invokables/#toc_signature-basics

<!-- External links -->

[glint]: https://typed-ember.gitbook.io/glint/
[types-with-jsdoc]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
[typescript]: http://www.typescriptlang.org
[typescript-docs]: https://www.typescriptlang.org/docs/


---

When someone says they are "upgrading" their Ember app, it could mean one of several things, especially if they say that they are "upgrading to Octane."
This Guide will help fill in the blanks about how to upgrade your app's version, get access to the latest and greatest features, and form a strategy for using Octane's features in your existing apps.

## Details about recent releases

You can learn about what changed in every release by reading the 
[official Ember blog](https://blog.emberjs.com).

## Routine minor version maintenance upgrades

Let's say you are upgrading an app from `v3.4` to `v3.8`.
Although you heard there are some new features, your main goal is to keep up with security updates.
To do this kind of version upgrade, follow the instructions [here in the CLI Guides](https://cli.emberjs.com/release/basic-use/upgrading/).
That process will make sure that any peer dependencies of the `ember.js` core codebase get upgraded too.
Automated tools will help you make the right changes to `package.json` and other files.
The point of a minor version bump is that you shouldn't need to change anything in your app when you upgrade - it should all keep working, whether or not you choose to adopt new syntaxes and features.

## Using new features

Once you have upgraded an app's version, some new features may be available out of the box.
On the other hand, some features will require that you enable them specifically in your app's configuration, since they may change the app's default behavior.

The best way to discover new features is to read the [release blog posts](https://blog.emberjs.com/tags/releases.html).
If a new feature requires you to opt-in, it's called an optional feature.
Follow [the optional features guide](../configuring-ember/optional-features/) to learn which optional features are available in your app's version of Ember, and how to enable them.
In many cases, codemods will be available to help you make syntax-related updates.
A codemod is a tool that rewrites your existing code into a new syntax.
When they are available, they can save a lot of time that you would spend making edits by hand.

## Managing deprecations

If an API you are using will be going away in the next major version of Ember, you will see a deprecation warning in the developer console.
Sometimes, they will be deprecation warnings caused by code in your app, and other times, they may be caused by an addon.

For more guidance on what to do with deprecations, visit [Handling Deprecations](../configuring-ember/handling-deprecations/), check out the Ember Inspector [tools for deprecations](../ember-inspector/deprecations/), or read about the specifics in the [Deprecations Guides](https://deprecations.emberjs.com/).


---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/03-automated-testing.md -->

In this chapter, you will use Ember's built-in testing framework to write some automated tests for your app. By the end of this chapter, we will have an automated test suite that we can run to ensure our app is working correctly:

<img src="/images/tutorial/part-1/automated-testing/pass-2@2x.png" alt="The Super Rentals test suite by the end of the chapter" width="1024" height="512">

In the process, you will learn about:

- The purpose of automated testing
- Writing acceptance tests
- Using generators in Ember CLI
- Testing with the QUnit test framework
- Working with Ember's test helpers
- Practicing the testing workflow

## The Purpose of Automated Testing

We accomplished a lot in the last few chapters! Let's recap—we started with a blank canvas, added a few pages of content, styled everything to look pretty, dropped in a picture of Tomster, added links between our pages and amazingly, everything worked together flawlessly!

But do we _really_ know that everything is actually working? Sure, we clicked around a bit to confirm that things look as expected. But do we feel confident that we checked _every_ page after the most recent change that we made?

After all, most of us have experienced (or heard horror stories about) making a Small Tweak™ in one area of the app that inadvertently broke _everything else_ when we weren't looking.

Maybe we can write a checklist somewhere of all the things to check after making changes to our site. But surely, this will get out of hand as we add more features to our app. It is also going to get old really quickly—repetitive tasks like that are best left to robots.

Hmm, robots. That's an idea. What if we can write this checklist and just get the computer to check everything for us? I think we just invented the idea of _[automated testing](../../../testing/)_! Okay, maybe we were not the first to come up with the concept, but we independently discovered it so we still deserve some credit.

## Adding Acceptance Tests with Generators

Once we are done patting ourselves on the back, go ahead and run the following command in the terminal:

```shell
$ ember generate acceptance-test super-rentals
installing acceptance-test
  create tests/acceptance/super-rentals-test.js

Running "lint:fix" script...
```

This is called a _[generator](https://cli.emberjs.com/release/basic-use/cli-commands/#generatemorefiles)_ command in Ember CLI. Generators automatically create files for us based on Ember's conventions and populate them with the appropriate boilerplate content, similar to how `ember new` initially created a skeleton app for us. It typically follows the pattern `ember generate <type> <name>`, where `<type>` is the kind of thing we are generating, and `<name>` is what we want to call it.

In this case, we generated an _[acceptance test](../../../testing/test-types/#toc_application-tests)_ located at `tests/acceptance/super-rentals-test.js`.

Generators aren't required; we _could_ have created the file ourselves which would have accomplished the exact same thing. But, generators certainly save us a lot of typing. Go ahead and take a peek at the acceptance test file and see for yourself.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>Want to save even more typing? <code>ember generate ...</code> can be shortened into <code>ember g ...</code>. That's 7 fewer characters!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Writing Acceptance Tests

Acceptance tests, also known as _application tests_, are one of a few types of automated testing at our disposal in Ember. We will learn about the other types later, but what makes acceptance tests unique is that they test our app from the user's perspective—they are an automated version of the "click around and see if it works" testing we did earlier, which is exactly what we need.

Let's open the generated test file and replace the boilerplate test with our own:

```js { data-filename="tests/acceptance/super-rentals-test.js" data-diff="-2,+3,-9,-10,+11,+12,-14,+15,+16,+17,+18,+19,+20,+21" }
import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'super-rentals/tests/helpers';

module('Acceptance | super rentals', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /super-rentals', async function (assert) {
    await visit('/super-rentals');
  test('visiting /', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/super-rentals');
    assert.strictEqual(currentURL(), '/');
    assert.dom('h2').hasText('Welcome to Super Rentals!');

    assert.dom('.jumbo a.button').hasText('About Us');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });
});
```

First, we instruct the test robot to navigate to the `/` URL of our app by using the `visit` _test helper_ provided by Ember. This is akin to us typing `http://localhost:4200/` in the browser's address bar and hitting the `enter` key.

Because the page is going to take some time to load, this is known as an _[async](https://developer.mozilla.org/docs/Learn/JavaScript/Asynchronous/Concepts)_ (short for _asynchronous_) step, so we will need to tell the test robot to wait by using JavaScript's `await` keyword. That way, it will wait until the page completely finishes loading before moving on to the next step.

This is almost always the behavior we want, so we will almost always use `await` and `visit` as a pair. This applies to other kinds of simulated interaction too, such as clicking on a button or a link, as they all take time to complete. Even though sometimes these actions may seem imperceptibly fast to us, we have to remember that our test robot has really, really fast hands, as we will see in a moment.

After navigating to the `/` URL and waiting for things to settle, we check that the current URL matches the URL that we expect (`/`). We can use the `currentURL` test helper here, as well as `equal` _[assertion](https://github.com/emberjs/ember-test-helpers/blob/master/API.md)_. This is how we encode our "checklist" into code—by specifying, or asserting how things _should_ behave, we will be alerted if our app does _not_ behave in the way that we expect.

Next, we confirmed that the page has an `<h2>` tag that contains the text "Welcome to Super Rentals!". Knowing this is true means that we can be quite certain that the correct template has been rendered, without errors.

Then, we looked for a link with the text `About Us`, located using the _[CSS selector](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors)_ `.jumbo a.button`. This is the same syntax we used in our stylesheet, which means "look inside the tag with the `jumbo` class for an `<a>` tag with the `button` class." This matches up with the HTML structure in our template.

Once the existence of this element on the page was confirmed, we told the test robot to click on this link. As mentioned above, this is a user interaction, so it needs to be `await`-ed.

Finally, we asserted that clicking on the link should bring us to the `/about` URL.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>Here, we are writing the tests in a framework called QUnit, which is where the functions <code>module</code>, <code>test</code> and <code>assert</code> come from. We also have additional helpers like <code>click</code>, <code>visit</code>, and <code>currentURL</code> provided by the <code>@ember/test-helpers</code> package. You can tell what comes from which package based on the <code>import</code> paths at the top of the file. Knowing this will be helpful when you need to search for documentation on the Internet or ask for help.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

We can put our automated test into motion by running the _test server_ using the `ember test --server` command, or `ember t -s` for short. This server behaves much like the development server, but it is explicitly running for our tests. It may automatically open a browser window and take you to the test UI, or you can open `http://localhost:7357/` yourself.

If you watch really carefully, you can see our test robot roaming around our app and clicking links:

<!-- TODO: make this a gif instead -->

<img src="/images/tutorial/part-1/automated-testing/pass@2x.png" alt="All tests passing" width="1024" height="512">

It happens really quickly though—blink and you might miss it! In fact, I had to slow this animation down by a hundred times just so you can see it in action. I told you the robot has really, really fast hands!

As much as I enjoy watching this robot hard at work, the important thing here is that the test we wrote has _passed_, meaning everything is working exactly as we expect and the test UI is all green and happy. If you want, you can go to `index.hbs`, delete the `<LinkTo>` component and see what things look like when we have _a failing test_.

<img src="/images/tutorial/part-1/automated-testing/fail@2x.png" alt="A failing test" width="1024" height="768">

Don't forget to put that line back in when you are done!

## Practicing the Testing Workflow

Let's practice what we learned by adding tests for the remaining pages:

```js { data-filename="tests/acceptance/super-rentals-test.js" data-diff="+19,+20,+21,+22,+23,+24,+25,+26,+27,+28,+29,+30,+31,+32,+33,+34,+35,+36,+37,+38,+39,+40,+41,+42" }
import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'super-rentals/tests/helpers';

module('Acceptance | super rentals', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');
    assert.dom('h2').hasText('Welcome to Super Rentals!');

    assert.dom('.jumbo a.button').hasText('About Us');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });

  test('visiting /about', async function (assert) {
    await visit('/about');

    assert.strictEqual(currentURL(), '/about');
    assert.dom('h2').hasText('About Super Rentals');

    assert.dom('.jumbo a.button').hasText('Contact Us');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/getting-in-touch');
  });

  test('visiting /getting-in-touch', async function (assert) {
    await visit('/getting-in-touch');

    assert.strictEqual(currentURL(), '/getting-in-touch');
    assert.dom('h2').hasText('Contact Us');

    assert.dom('.jumbo a.button').hasText('About');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });
});
```

As with the development server, the test UI should automatically reload and rerun the entire test suite as you save the files. It is recommended that you keep this page open as you develop your app. That way, you will get immediate feedback if you accidentally break something.

<img src="/images/tutorial/part-1/automated-testing/pass-2@2x.png" alt="Tests still passing with the new tests" width="1024" height="512">

For the rest of the tutorial, we will continue to add more automated tests as we develop new features. Testing is optional but highly recommended. Tests don't affect the functionality of your app, they just protect it from _regressions_, which is just a fancy way of saying "accidental breakages."

If you are in a hurry, you can skip over the testing sections in this tutorial and still be able to follow along with everything else. But don't you find it super satisfying—_oddly satisfying_—to watch a robot click on things really, really fast?


---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/02-building-pages.md -->

In this chapter, you will build the first few pages of your Ember app and set up links between them. By the end of this chapter, you should have two new pages – an about page and a contact page. These pages will be linked to from your landing page:

<img src="/images/tutorial/part-1/building-pages/index-with-link@2x.png" alt="The Super Rentals app (homepage) by the end of the chapter" width="1024" height="251">

<img src="/images/tutorial/part-1/building-pages/about-with-link@2x.png" alt="The Super Rentals app (about page) by the end of the chapter" width="1024" height="275">

<img src="/images/tutorial/part-1/building-pages/contact-with-link@2x.png" alt="The Super Rentals app (contact page) by the end of the chapter" width="1024" height="445">

While building these pages, you will learn about:

- Defining routes
- Using route templates
- Customizing URLs
- Linking pages with the `<LinkTo>` component
- Passing arguments and attributes to components

## Defining Routes

With our [first page](../orientation/) down, let's add another one!

This time, we would like the page to be served on the `/about` URL. In order to do this, we will need to tell Ember about our plan to add a page at that location. Otherwise, Ember will think we have visited an invalid URL!

The place to manage what pages are available is the _router_. Go ahead and open `app/router.js` and make the following change:

```js { data-filename="app/router.js" data-diff="-9,+10,+11,+12" }
import EmberRouter from '@ember/routing/router';
import config from 'super-rentals/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {});
Router.map(function () {
  this.route('about');
});
```

This adds a _[route](../../../routing/defining-your-routes/)_ named "about", which is served at the `/about` URL by default.

## Using Route Templates

With that in place, we can create a new `app/templates/about.hbs` template with the following content:

```handlebars { data-filename="app/templates/about.hbs" }
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>About Super Rentals</h2>
  <p>
    The Super Rentals website is a delightful project created to explore Ember.
    By building a property rental site, we can simultaneously imagine traveling
    AND building Ember applications.
  </p>
</div>
```

To see this in action, navigate to `http://localhost:4200/about`.

<img src="/images/tutorial/part-1/building-pages/about@2x.png" alt="About page" width="1024" height="250">

With that, our second page is done!

## Defining Routes with Custom Paths

We're on a roll! While we're at it, let's add our third page. This time, things are a little bit different. Everyone at the company calls this the "contact" page. However, the old website we are replacing already has a similar page, which is served at the legacy URL `/getting-in-touch`.

We want to keep the existing URLs for the new website, but we don't want to have to type `getting-in-touch` all over the new codebase! Fortunately, we can have the best of both worlds:

```js { data-filename="app/router.js" data-diff="+11" }
import EmberRouter from '@ember/routing/router';
import config from 'super-rentals/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('about');
  this.route('contact', { path: '/getting-in-touch' });
});
```

Here, we added the `contact` route, but explicitly specified a path for the route. This allows us to keep the legacy URL, but use the new, shorter name for the route, as well as the template filename.

Speaking of the template, let's create that as well. We'll add a `app/templates/contact.hbs` file:

```handlebars { data-filename="app/templates/contact.hbs" }
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>Contact Us</h2>
  <p>
    Super Rentals Representatives would love to help you<br>
    choose a destination or answer any questions you may have.
  </p>
  <address>
    Super Rentals HQ
    <p>
      1212 Test Address Avenue<br>
      Testington, OR 97233
    </p>
    <a href="tel:503.555.1212">+1 (503) 555-1212</a><br>
    <a href="mailto:superrentalsrep@emberjs.com">superrentalsrep@emberjs.com</a>
  </address>
</div>
```

Ember comes with strong _conventions_ and sensible defaults—if we were starting from scratch, we wouldn't mind the default `/contact` URL. However, if the defaults don't work for us, it is no problem at all to customize Ember for our needs!

Once you have added the route and the template above, we should have the new page available to us at `http://localhost:4200/getting-in-touch`.

<img src="/images/tutorial/part-1/building-pages/contact@2x.png" alt="Contact page" width="1024" height="395">

## Linking Pages with the `<LinkTo>` Component

We just put so much effort into making these pages, we need to make sure people can find them! The way we do that on the web is by using _[hyperlinks](https://developer.mozilla.org/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks)_, or _links_ for short.

Since Ember offers great support for URLs out-of-the-box, we _could_ just link our pages together using the `<a>` tag with the appropriate `href`. However, clicking on those links would require the browser to make a _full-page refresh_, which means that it would have to make a trip back to the server to fetch the page, and then load everything from scratch again.

With Ember, we can do better than that! Instead of the plain-old `<a>` tag, Ember provides an alternative called `<LinkTo>`. For example, here is how you would use it on the pages we just created:

```handlebars { data-filename="app/templates/index.hbs" data-diff="+5" }
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</div>
```

```handlebars { data-filename="app/templates/about.hbs" data-diff="+9" }
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>About Super Rentals</h2>
  <p>
    The Super Rentals website is a delightful project created to explore Ember.
    By building a property rental site, we can simultaneously imagine traveling
    AND building Ember applications.
  </p>
  <LinkTo @route="contact" class="button">Contact Us</LinkTo>
</div>
```

```handlebars { data-filename="app/templates/contact.hbs" data-diff="+17" }
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>Contact Us</h2>
  <p>
    Super Rentals Representatives would love to help you<br>
    choose a destination or answer any questions you may have.
  </p>
  <address>
    Super Rentals HQ
    <p>
      1212 Test Address Avenue<br>
      Testington, OR 97233
    </p>
    <a href="tel:503.555.1212">+1 (503) 555-1212</a><br>
    <a href="mailto:superrentalsrep@emberjs.com">superrentalsrep@emberjs.com</a>
  </address>
  <LinkTo @route="about" class="button">About</LinkTo>
</div>
```

There is quite a bit going on here, so let's break it down.

`<LinkTo>` is an example of a _[component](../../../components/introducing-components/)_ in Ember—you can tell them apart from regular HTML tags because they start with an uppercase letter. Along with regular HTML tags, components are a key building block that we can use to build up an app's user interface.

We have a lot more to say about components later, but for now, you can think of them as a way to provide _custom tags_ to supplement the built-in ones that came with the browser.

The `@route=...` part is how we pass _[arguments](../../../components/component-arguments-and-html-attributes/)_ into the component. Here, we use this argument to specify _which_ route we want to link to. (Note that this should be the _name_ of the route, not the path, which is why we specified `"about"` instead of `"/about"`, and `"contact"` instead of `"/getting-in-touch"`.)

In addition to arguments, components can also take the usual HTML attributes as well. In our example, we added a `"button"` class for styling purposes, but we could also specify other attributes as we see fit, such as the [ARIA](https://webaim.org/techniques/aria/) [`role` attribute](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles). These are passed without the `@` symbol (`class=...` as opposed to `@class=...`), so that Ember will know they are just regular HTML attributes.

Under the hood, the `<LinkTo>` component generates a regular `<a>` tag for us with the appropriate `href` for the specific route. This `<a>` tag works just fine with _[screen readers](https://webaim.org/projects/screenreadersurvey/)_, as well as allowing our users to bookmark the link or open it in a new tab.

However, when clicking on one of these special links, Ember will intercept the click, render the content for the new page, and update the URL—all performed locally without having to wait for the server, thus avoiding a full page refresh.

<!-- TODO: make this a gif instead -->

<img src="/images/tutorial/part-1/building-pages/index-with-link@2x.png" alt="Index page after adding the link" width="1024" height="251">

<img src="/images/tutorial/part-1/building-pages/about-with-link@2x.png" alt="About page after adding the link" width="1024" height="275">

<img src="/images/tutorial/part-1/building-pages/contact-with-link@2x.png" alt="Contact page after adding the link" width="1024" height="445">

We will learn more about how all of this works soon. In the meantime, go ahead and click on the link in the browser. Did you notice how snappy that was?

Congratulations, you are well on your way to becoming a master page-crafter!


---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/04-component-basics.md -->

In this chapter, you will _[refactor](../../../components/introducing-components/#toc_breaking-it-into-pieces)_ your existing templates to use components. We will also be adding a site-wide navigation bar:

<img src="/images/tutorial/part-1/component-basics/index-with-nav@2x.png" alt="The Super Rentals app by the end of the chapter" width="1024" height="315">

In doing so, you will learn about:

- Extracting markup into components
- Invoking components
- Passing content to components
- Yielding content with the `{{yield}}` keyword
- Refactoring existing code
- Writing component tests
- Using the application template and `{{outlet}}`s

## Extracting Markup into Components

In a [previous chapter](../building-pages/), we got a light introduction to _[components](../../../components/introducing-components/)_ when using `<LinkTo>` to connect our pages. To recap, we said that components are Ember's way of creating _custom tags_ to supplement the built-in HTML tags from the browser. Now, we are going to create our own components!

During the course of developing an app, it is pretty common to reuse the same UI element across different parts of the app. For example, we have been using the same "jumbo" header in all three pages so far. On every page we worked to follow the same basic structure:

```html
<div class="jumbo">
  <div class="right tomster"></div>
  <!-- page specific content -->
</div>
```

Since it is not a lot of code, it may not seem like a big deal to duplicate this structure on each page. However, if our designer wanted us to make a change to the header, we would have to find and update every single copy of this code. As our app gets bigger, this will become even more of a problem.

Components are the perfect solution to this. In its most basic form, a component is just a piece of template that can be referred to by name. Let's start by creating a new file at `app/components/jumbo.hbs` with markup for the "jumbo" header:

```handlebars { data-filename="app/components/jumbo.hbs" }
<div class="jumbo">
  <div class="right tomster"></div>
  {{yield}}
</div>
```

That's it, we have created our first component! We can now _invoke_ this component anywhere in our app, using `<Jumbo>` as the tag name.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>Remember, when invoking components, we need to capitalize their names so Ember can tell them apart from regular HTML elements. The <code>jumbo.hbs</code> template corresponds to the <code>&#x3C;Jumbo></code> tag, just like <code>super-awesome.hbs</code> corresponds to <code>&#x3C;SuperAwesome></code>.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Passing Content to Components with `{{yield}}`

When invoking a component, Ember will replace the component tag with the content found in the component's template. Just like regular HTML tags, it is common to pass _[content](../../../components/block-content/)_ to components, like `<Jumbo>some content</Jumbo>`. We can enable this using the `{{yield}}` keyword, which will be replaced with the content that was passed to the component.

Let's try it out by editing the index template:

```handlebars { data-filename="app/templates/index.hbs" data-diff="-1,-2,+3,+7,-8" }
<div class="jumbo">
  <div class="right tomster"></div>
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>
</div>

```

## Refactoring Existing Code

After saving the changes, your page should automatically reload, and, _voilà_... nothing changed? Well, that's exactly what we wanted to happen this time! We successfully _[refactored](../../../components/introducing-components/#toc_breaking-components-down-further)_ our index template to use the `<Jumbo>` component, and everything still works as expected. And the tests still pass!

<img src="/images/tutorial/part-1/component-basics/index@2x.png" alt="Index page – nothing changed" width="1024" height="251">

<img src="/images/tutorial/part-1/component-basics/pass@2x.png" alt="Tests still passing after the refactor" width="1024" height="512">

Let's do the same for our other two pages as well.

```handlebars { data-filename="app/templates/about.hbs" data-diff="-1,-2,+3,+11,-12" }
<div class="jumbo">
  <div class="right tomster"></div>
<Jumbo>
  <h2>About Super Rentals</h2>
  <p>
    The Super Rentals website is a delightful project created to explore Ember.
    By building a property rental site, we can simultaneously imagine traveling
    AND building Ember applications.
  </p>
  <LinkTo @route="contact" class="button">Contact Us</LinkTo>
</Jumbo>
</div>
```

```handlebars { data-filename="app/templates/contact.hbs" data-diff="-1,-2,+3,+19,-20" }
<div class="jumbo">
  <div class="right tomster"></div>
<Jumbo>
  <h2>Contact Us</h2>
  <p>
    Super Rentals Representatives would love to help you<br>
    choose a destination or answer any questions you may have.
  </p>
  <address>
    Super Rentals HQ
    <p>
      1212 Test Address Avenue<br>
      Testington, OR 97233
    </p>
    <a href="tel:503.555.1212">+1 (503) 555-1212</a><br>
    <a href="mailto:superrentalsrep@emberjs.com">superrentalsrep@emberjs.com</a>
  </address>
  <LinkTo @route="about" class="button">About</LinkTo>
</Jumbo>
</div>
```

After saving, everything should look exactly the same as before, and all the tests should still pass. Very nice!

<img src="/images/tutorial/part-1/component-basics/about@2x.png" alt="About page – nothing changed" width="1024" height="275">

<img src="/images/tutorial/part-1/component-basics/contact@2x.png" alt="Contact page – nothing changed" width="1024" height="445">

<img src="/images/tutorial/part-1/component-basics/pass-2@2x.png" alt="Tests still passing another round of refactor" width="1024" height="512">

While it may not save you a lot of characters in this case, _[encapsulating](../../../components/component-arguments-and-html-attributes/)_ the implementation of the "jumbo" header into its own component makes the template slightly easier to read, as it allows the reader to focus on things that are unique to just that page. Further, if we need to make a change to the header, we can make it in a single place. Feel free to give that a try!

## Writing Component Tests

Before we move on to the next component, let's write an automated test for our `<Jumbo>` component. Run this command in your terminal:

```shell
$ ember generate component-test jumbo
installing component-test
  create tests/integration/components/jumbo-test.js

Running "lint:fix" script...
```

Here, we used the generator to generate a _[component test](../../../testing/testing-components/)_, also known as a rendering test. These are used to render and test a single component at a time. This is in contrast to the acceptance tests that we wrote earlier, which have to navigate and render entire pages worth of content.

Let's replace the boilerplate code that was generated for us with our own test:

```js { data-filename="tests/integration/components/jumbo-test.js" data-diff="-9,-10,-11,+12,+13,-15,-16,-17,-18,-19,-20,-21,-22,-23,-24,-25,-26,+27,+28,+29" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | jumbo', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
  test('it renders the content inside a jumbo header with a tomster', async function (assert) {
    await render(hbs`<Jumbo>Hello World</Jumbo>`);

    await render(hbs`<Jumbo />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <Jumbo>
        template block text
      </Jumbo>
    `);

    assert.dom().hasText('template block text');
    assert.dom('.jumbo').exists();
    assert.dom('.jumbo').hasText('Hello World');
    assert.dom('.jumbo .tomster').exists();
  });
});
```

Instead of navigating to a URL, we start the test by rendering our `<Jumbo>` component on the test page. This is useful because it may otherwise require a lot of setup and interaction just to get to a page where your component is used. Component tests allows us to skip all of that and focus exclusively on testing the component in isolation.

Just like visit and click, which we used earlier, render is also an async step, so we need to pair it with the `await` keyword. Other than that, the rest of the test is very similar to the acceptance tests we wrote in the previous chapter. Make sure the test is passing by checking the tests UI in the browser.

<img src="/images/tutorial/part-1/component-basics/pass-3@2x.png" alt="Tests still passing with our component test" width="1024" height="512">

We've been refactoring our existing code for a while, so let's change gears and implement a new feature: the site-wide navigation bar.

We can create a `<NavBar>` component at `app/components/nav-bar.hbs`:

```handlebars { data-filename="app/components/nav-bar.hbs" }
<nav class="menu">
  <LinkTo @route="index" class="menu-index">
    <h1>SuperRentals</h1>
  </LinkTo>
  <div class="links">
    <LinkTo @route="about" class="menu-about">
      About
    </LinkTo>
    <LinkTo @route="contact" class="menu-contact">
      Contact
    </LinkTo>
  </div>
</nav>
```

Next, we will add our `<NavBar>` component to the top of each page:

```handlebars { data-filename="app/templates/about.hbs" data-diff="+1" }
<NavBar />
<Jumbo>
  <h2>About Super Rentals</h2>
  <p>
    The Super Rentals website is a delightful project created to explore Ember.
    By building a property rental site, we can simultaneously imagine traveling
    AND building Ember applications.
  </p>
  <LinkTo @route="contact" class="button">Contact Us</LinkTo>
</Jumbo>
```

```handlebars { data-filename="app/templates/contact.hbs" data-diff="+1" }
<NavBar />
<Jumbo>
  <h2>Contact Us</h2>
  <p>
    Super Rentals Representatives would love to help you<br>
    choose a destination or answer any questions you may have.
  </p>
  <address>
    Super Rentals HQ
    <p>
      1212 Test Address Avenue<br>
      Testington, OR 97233
    </p>
    <a href="tel:503.555.1212">+1 (503) 555-1212</a><br>
    <a href="mailto:superrentalsrep@emberjs.com">superrentalsrep@emberjs.com</a>
  </address>
  <LinkTo @route="about" class="button">About</LinkTo>
</Jumbo>
```

```handlebars { data-filename="app/templates/index.hbs" data-diff="+1" }
<NavBar />
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>
```

Voilà, we made another component!

<img src="/images/tutorial/part-1/component-basics/index-with-nav@2x.png" alt="Index page with nav" width="1024" height="315">

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p><code>&#x3C;NavBar /></code> is a shorthand for <code>&#x3C;NavBar>&#x3C;/NavBar></code>. Component tags must always be closed properly, even when you are not passing any content to them, as in this case. Since this is pretty common, Ember provides the alternative self-closing shorthand to save you some typing!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Everything looks great in the browser, but as we know, we can never be too sure. So let's write some tests!

But what kind of test? We _could_ write a component test for the `<NavBar>` by itself, like we just did for the `<Jumbo>` component. However, since the job of `<NavBar>` is to _navigate_ us around the app, it would not make a lot of sense to test this particular component in isolation. So, let's go back to writing some acceptance tests!

```js { data-filename="tests/acceptance/super-rentals-test.js" data-diff="+12,+13,+26,+27,+40,+41,+49,+50,+51,+52,+53,+54,+55,+56,+57,+58,+59,+60,+61,+62,+63,+64,+65,+66" }
import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'super-rentals/tests/helpers';

module('Acceptance | super rentals', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('Welcome to Super Rentals!');

    assert.dom('.jumbo a.button').hasText('About Us');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });

  test('visiting /about', async function (assert) {
    await visit('/about');

    assert.strictEqual(currentURL(), '/about');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('About Super Rentals');

    assert.dom('.jumbo a.button').hasText('Contact Us');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/getting-in-touch');
  });

  test('visiting /getting-in-touch', async function (assert) {
    await visit('/getting-in-touch');

    assert.strictEqual(currentURL(), '/getting-in-touch');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('Contact Us');

    assert.dom('.jumbo a.button').hasText('About');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });

  test('navigating using the nav-bar', async function (assert) {
    await visit('/');

    assert.dom('nav').exists();
    assert.dom('nav a.menu-index').hasText('SuperRentals');
    assert.dom('nav a.menu-about').hasText('About');
    assert.dom('nav a.menu-contact').hasText('Contact');

    await click('nav a.menu-about');
    assert.strictEqual(currentURL(), '/about');

    await click('nav a.menu-contact');
    assert.strictEqual(currentURL(), '/getting-in-touch');

    await click('nav a.menu-index');
    assert.strictEqual(currentURL(), '/');
  });
});
```

We updated the existing tests to assert that a `<nav>` element exists on each page. This is important for accessibility since screen readers will use that element to provide navigation. Then, we added a new test that verifies the behavior of the `<NavBar>` links.

All tests should pass at this point!

<img src="/images/tutorial/part-1/component-basics/pass-4@2x.png" alt="Tests still passing with our &lt;NavBar&gt; tests" width="1024" height="512">

## Using the Application Template and `{{outlet}}`s

Before we move on to the next feature, there is one more thing we could clean up. Since the `<NavBar>` is used for site-wide navigation, it really needs to be displayed on _every_ page in the app. So far, we have been adding the component on each page manually. This is a bit error-prone, as we could easily forget to do this the next time that we add a new page.

We can solve this problem by moving the nav-bar into a special template called `application.hbs`. You may remember that it was generated for us when we first created the app but we deleted it. Now, it's time for us to bring it back!

This template is special in that it does not have its own URL and cannot be navigated to on its own. Rather, it is used to specify a common layout that is shared by every page in your app. This is a great place to put site-wide UI elements, like a nav-bar and a site footer.

While we are at it, we will also add a container element that wraps around the whole page, as requested by our designer for styling purposes.

```handlebars { data-filename="app/templates/application.hbs" }
<div class="container">
  <NavBar />
  <div class="body">
    {{outlet}}
  </div>
</div>
```

```handlebars { data-filename="app/templates/index.hbs" data-diff="-1" }
<NavBar />
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>
```

```handlebars { data-filename="app/templates/contact.hbs" data-diff="-1" }
<NavBar />
<Jumbo>
  <h2>Contact Us</h2>
  <p>
    Super Rentals Representatives would love to help you<br>
    choose a destination or answer any questions you may have.
  </p>
  <address>
    Super Rentals HQ
    <p>
      1212 Test Address Avenue<br>
      Testington, OR 97233
    </p>
    <a href="tel:503.555.1212">+1 (503) 555-1212</a><br>
    <a href="mailto:superrentalsrep@emberjs.com">superrentalsrep@emberjs.com</a>
  </address>
  <LinkTo @route="about" class="button">About</LinkTo>
</Jumbo>
```

```handlebars { data-filename="app/templates/about.hbs" data-diff="-1" }
<NavBar />
<Jumbo>
  <h2>About Super Rentals</h2>
  <p>
    The Super Rentals website is a delightful project created to explore Ember.
    By building a property rental site, we can simultaneously imagine traveling
    AND building Ember applications.
  </p>
  <LinkTo @route="contact" class="button">Contact Us</LinkTo>
</Jumbo>
```

The `{{outlet}}` keyword denotes the place where our site's pages should be rendered into, similar to the `{{yield}}` keyword we saw [earlier](#toc_passing-content-to-components-with-yield).

This is much nicer! We can run our test suite, which confirms that everything still works after our refactor. We are ready to move on to the next feature!

<img src="/images/tutorial/part-1/component-basics/pass-5@2x.png" alt="Tests still passing with {{outlet}}" width="1024" height="512">


---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/index.md -->

Welcome to the Ember Tutorial!

In this tutorial, we will use Ember to build an application called Super Rentals. This will be a website for browsing interesting places to stay during your next vacation. Check out the [finished app](https://ember-super-rentals.netlify.app) to get a sense of the scope of the project.

<img src="/images/tutorial/part-2/provider-components/homepage-with-rentals-component@2x.png" alt="The finished Super Rentals app" width="1024" height="1328">

Along the way, you will learn everything you need to know to build a basic Ember application. If you get stuck at any point during the tutorial, feel free to download <https://github.com/ember-learn/super-rentals/tree/super-rentals-tutorial-output> for a complete working example.

This tutorial is structured into two parts. The first part covers the following basic concepts:

- Using Ember CLI
- Navigating the file and folder structure of an Ember app
- Building and linking between pages
- Templates and components
- Automated testing
- Working with server data

The second part of the tutorial builds upon these concepts and takes things to the next level.

Let's dive right in!


---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/06-interactive-components.md -->

In this chapter, you will add interactivity to the page, allowing the user to click an image to enlarge or shrink it:

<!-- TODO: make this a gif instead -->

<img src="/images/tutorial/part-1/interactive-components/rental-image-default@2x.png" alt="The Super Rentals app by the end of the chapter (default image size)" width="1024" height="1130">

<img src="/images/tutorial/part-1/interactive-components/rental-image-large@2x.png" alt="The Super Rentals app by the end of the chapter (large image size)" width="1024" height="1500">

While doing so, you will learn about:

- Adding behavior to components with classes
- Accessing instance states from templates
- Managing state with tracked properties
- Using conditionals syntaxes in templates
- Responding to user interaction with actions
- Invoking element modifiers
- Testing user interactions

## Adding Behavior to Components with Classes

So far, all the components we have written are purely _presentational_—they are simply reusable snippets of markup. That's pretty cool! But in Ember, components can do so much more.

Sometimes, you want to associate some _[behavior](https://developer.mozilla.org/docs/Learn/JavaScript/Building_blocks/Events)_ with your components so that they can do more interesting things. For example, `<LinkTo>` can respond to clicks by changing the URL and navigating us to a different page.

Here, we are going to do just that! We are going to implement the "View Larger" and "View Smaller" functionality, which will allow our users to click on a property's image to view a larger version, and click on it again to return to the smaller version.

In other words, we want a way to _toggle_ the image between one of the two _[states](../../../components/component-state-and-actions/)_. In order to do that, we need a way for the component to store two possible states, and to be aware of which state it is currently in.

Ember optionally allows us to associate JavaScript code with a component for exactly this purpose. We can add a JavaScript file for our `<Rental::Image>` component by running the `component-class` generator:

```shell
$ ember generate component-class rental/image
installing component-class
  create app/components/rental/image.js

Running "lint:fix" script...
```

This generated a JavaScript file with the same name as our component's template at `app/components/rental/image.js`. It contains a _[JavaScript class](https://javascript.info/class)_, _[inheriting](https://javascript.info/class-inheritance)_ from `@glimmer/component`.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p><code>@glimmer/component</code>, or <em><a href="../../../upgrading/current-edition/glimmer-components/">Glimmer component</a></em>, is one of the several component classes available to use. They are a great starting point whenever you want to add behavior to your components. In this tutorial, we will be using Glimmer components exclusively.</p>        
<p>In general, Glimmer components should be used whenever possible. However, you may also see <code>@ember/components</code>, or <em><a href="https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/">classic components</a></em>, used in older apps. You can tell them apart by looking at their import path (which is helpful for looking up the respective documentation, as they have different and incompatible APIs).</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Ember will create an _instance_ of the class whenever our component is invoked. We can use that instance to store our state:

```js { data-filename="app/components/rental/image.js" data-diff="-3,+4,+5,+6,+7,+8,+9" }
import Component from '@glimmer/component';

export default class RentalImage extends Component {}
export default class RentalImage extends Component {
  constructor(...args) {
    super(...args);
    this.isLarge = false;
  }
}
```

Here, in the _component's constructor_, we _initialized_ the _instance variable_ `this.isLarge` with the value `false`, since this is the default state that we want for our component.

## Accessing Instance States from Templates

Let's update our template to use this state we just added:

```handlebars { data-filename="app/components/rental/image.hbs" data-diff="-1,-2,-3,+4,+5,+6,+7,+8,+9,+10,+11,+12,+13,+14" }
<div class="image">
  <img ...attributes>
</div>
{{#if this.isLarge}}
  <div class="image large">
    <img ...attributes>
    <small>View Smaller</small>
  </div>
{{else}}
  <div class="image">
    <img ...attributes>
    <small>View Larger</small>
  </div>
{{/if}}
```

In the template, we have access to the component's instance variables. The `{{#if ...}}...{{else}}...{{/if}}` _[conditionals](../../../components/conditional-content/)_ syntax allows us to render different content based on a condition (in this case, the value of the instance variable `this.isLarge`). Combining these two features, we can render either the small or the large version of the image accordingly.

We can verify this works by temporarily changing the initial value in our JavaScript file. If we change `app/components/rental/image.js` to initialize `this.isLarge = true;` in the constructor, we should see the large version of the property image in the browser. Cool!

<img src="/images/tutorial/part-1/interactive-components/is-large-true@2x.png" alt="&lt;Rental::Image&gt; with this.isLarge set to true" width="1024" height="1500">

Once we've tested this out, we can change `this.isLarge` back to `false`.

Since this pattern of initializing instance variables in the constructor is pretty common, there happens to be a much more concise syntax for it:

```js { data-filename="app/components/rental/image.js" data-diff="-4,-5,-6,-7,+8" }
import Component from '@glimmer/component';

export default class RentalImage extends Component {
  constructor(...args) {
    super(...args);
    this.isLarge = false;
  }
  isLarge = false;
}
```

This does exactly the same thing as before, but it's much shorter and less to type!

Of course, our users cannot edit our source code, so we need a way for them to toggle the image size from the browser. Specifically, we want to toggle the value of `this.isLarge` whenever the user clicks on our component.

## Managing State with Tracked Properties

Let's modify our class to add a _[method](../../../in-depth-topics/native-classes-in-depth/#toc_methods)_ for toggling the size:

```js { data-filename="app/components/rental/image.js" data-diff="+2,+3,-6,+7,+8,+9,+10,+11" }
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RentalImage extends Component {
  isLarge = false;
  @tracked isLarge = false;

  @action toggleSize() {
    this.isLarge = !this.isLarge;
  }
}
```

We did a few things here, so let's break it down.

First, we added the `@tracked` _[decorator](../../../in-depth-topics/native-classes-in-depth/#toc_decorators)_ to the `isLarge` instance variable. This annotation tells Ember to monitor this variable for updates. Whenever this variable's value changes, Ember will automatically re-render any templates that depend on its value.

In our case, whenever we assign a new value to `this.isLarge`, the `@tracked` annotation will cause Ember to re-evaluate the `{{#if this.isLarge}}` conditional in our template, and will switch between the two _[blocks](../../../components/conditional-content/#toc_block-if)_ accordingly.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>Don't worry! If you reference a variable in the template but forget to add the <code>@tracked</code> decorator, you will get a helpful development mode error when you change its value!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Responding to User Interaction with Actions

Next, we added a `toggleSize` method to our class that switches `this.isLarge` to the opposite of its current state (`false` becomes `true`, or `true` becomes `false`).

Finally, we added the `@action` decorator to our method. This indicates to Ember that we intend to use this method from our template. Without this, the method will not function properly as a callback function (in this case, a click handler).

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>If you forget to add the <code>@action</code> decorator, you will also get a helpful error when clicking on the button in development mode!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

With that, it's time to wire this up in the template:

```handlebars { data-filename="app/components/rental/image.hbs" data-diff="-2,+3,-6,+7,-9,+10,-13,+14" }
{{#if this.isLarge}}
  <div class="image large">
  <button type="button" class="image large" {{on "click" this.toggleSize}}>
    <img ...attributes>
    <small>View Smaller</small>
  </div>
  </button>
{{else}}
  <div class="image">
  <button type="button" class="image" {{on "click" this.toggleSize}}>
    <img ...attributes>
    <small>View Larger</small>
  </div>
  </button>
{{/if}}
```

We changed two things here.

First, since we wanted to make our component interactive, we switched the containing tag from `<div>` to `<button>` (this is important for accessibility reasons). By using the correct semantic tag, we will also get focusability and keyboard interaction handling "for free".

Next, we used the `{{on}}` _[modifier](../../../components/template-lifecycle-dom-and-modifiers/#toc_event-handlers)_ to attach `this.toggleSize` as a click handler on the button.

With that, we have created our first _interactive_ component. Go ahead and try it in the browser!

<!-- TODO: make this a gif instead -->

<img src="/images/tutorial/part-1/interactive-components/rental-image-default@2x.png" alt="&lt;Rental::Image&gt; (default size)" width="1024" height="1130">

<img src="/images/tutorial/part-1/interactive-components/rental-image-large@2x.png" alt="&lt;Rental::Image&gt; (large size)" width="1024" height="1500">

## Testing User Interactions

Finally, let's write a test for this new behavior:

```js { data-filename="tests/integration/components/rental/image-test.js" data-diff="-3,+4,+24,+25,+26,+27,+28,+29,+30,+31,+32,+33,+34,+35,+36,+37,+38,+39,+40,+41,+42,+43,+44,+45,+46,+47" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental/image', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the given image', async function (assert) {
    await render(hbs`
      <Rental::Image
        src="/assets/images/teaching-tomster.png"
        alt="Teaching Tomster"
      />
    `);

    assert
      .dom('.image img')
      .exists()
      .hasAttribute('src', '/assets/images/teaching-tomster.png')
      .hasAttribute('alt', 'Teaching Tomster');
  });

  test('clicking on the component toggles its size', async function (assert) {
    await render(hbs`
      <Rental::Image
        src="/assets/images/teaching-tomster.png"
        alt="Teaching Tomster"
      />
    `);

    assert.dom('button.image').exists();

    assert.dom('.image').doesNotHaveClass('large');
    assert.dom('.image small').hasText('View Larger');

    await click('button.image');

    assert.dom('.image').hasClass('large');
    assert.dom('.image small').hasText('View Smaller');

    await click('button.image');

    assert.dom('.image').doesNotHaveClass('large');
    assert.dom('.image small').hasText('View Larger');
  });
});
```

<img src="/images/tutorial/part-1/interactive-components/pass@2x.png" alt="Tests passing with the new &lt;Rental::Image&gt; test" width="1024" height="512">

Let's clean up our template before moving on. We introduced a lot of duplication when we added the conditional in the template. If we look closely, the only things that are different between the two blocks are:

1. The presence of the `"large"` CSS class on the `<button>` tag.
2. The "View Larger" and "View Smaller" text.

These changes are buried deep within the large amount of duplicated code. We can reduce the duplication by using an `{{if}}` _[expression](../../../components/conditional-content/#toc_inline-if)_ instead:

```handlebars { data-filename="app/components/rental/image.hbs" data-diff="-1,-2,-3,+4,+5,+6,-8,-9,-10,-11,+12,-14,-15,+16,+17" }
{{#if this.isLarge}}
  <button type="button" class="image large" {{on "click" this.toggleSize}}>
    <img ...attributes>
<button type="button" class="image {{if this.isLarge "large"}}" {{on "click" this.toggleSize}}>
  <img ...attributes>
  {{#if this.isLarge}}
    <small>View Smaller</small>
  </button>
{{else}}
  <button type="button" class="image" {{on "click" this.toggleSize}}>
    <img ...attributes>
  {{else}}
    <small>View Larger</small>
  </button>
{{/if}}
  {{/if}}
</button>
```

The expression version of `{{if}}` takes two arguments. The first argument is the condition. The second argument is the expression that should be evaluated if the condition is true.

Optionally, `{{if}}` can take a third argument for what the expression should evaluate into if the condition is false. This means we could rewrite the button label like so:

```handlebars { data-filename="app/components/rental/image.hbs" data-diff="-3,-4,-5,-6,-7,+8" }
<button type="button" class="image {{if this.isLarge "large"}}" {{on "click" this.toggleSize}}>
  <img ...attributes>
  {{#if this.isLarge}}
    <small>View Smaller</small>
  {{else}}
    <small>View Larger</small>
  {{/if}}
  <small>View {{if this.isLarge "Smaller" "Larger"}}</small>
</button>
```

Whether or not this is an improvement in the clarity of our code is mostly a matter of taste. Either way, we have significantly reduced the duplication in our code, and made the important bits of logic stand out from the rest.

Run the test suite one last time to confirm our refactor didn't break anything unexpectedly, and we will be ready for the next challenge!

<img src="/images/tutorial/part-1/interactive-components/pass-2@2x.png" alt="Tests still passing after the refactor" width="1024" height="512">


---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/05-more-about-components.md -->

It's time to finally work on the rentals listing:

<img src="/images/tutorial/part-1/more-about-components/rental-image@2x.png" alt="The Super Rentals app by the end of the chapter" width="1024" height="1130">

While building this list of rental properties, you will learn about:

- Generating components
- Organizing code with namespaced components
- Forwarding HTML attributes with `...attributes`
- Determining the appropriate amount of test coverage

## Generating Components

Let's start by creating the `<Rental>` component. This time, we will use the component generator to create the template and test file for us:

```shell
$ ember generate component rental
installing component
  create app/components/rental.hbs
  skip app/components/rental.ts
  tip to add a class, run `ember generate component-class rental`
installing component-test
  create tests/integration/components/rental-test.js

Running "lint:fix" script...
```

The generator created two new files for us, a component template at `app/components/rental.hbs`, and a component test file at `tests/integration/components/rental-test.js`.

We will start by editing the template. Let's _[hard-code](https://en.wikipedia.org/wiki/Hard_coding)_ the details for one rental property for now, and replace it with the real data from the server later on.

```handlebars { data-filename="app/components/rental.hbs" data-diff="-1,+2,+3,+4,+5,+6,+7,+8,+9,+10,+11,+12,+13,+14,+15,+16,+17,+18" }
{{yield}}
<article class="rental">
  <div class="details">
    <h3>Grand Old Mansion</h3>
    <div class="detail owner">
      <span>Owner:</span> Veruca Salt
    </div>
    <div class="detail type">
      <span>Type:</span> Standalone
    </div>
    <div class="detail location">
      <span>Location:</span> San Francisco
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span> 15
    </div>
  </div>
</article>
```

Then, we will write a test to ensure all of the details are present. We will replace the boilerplate test generated for us with our own assertions, just like we did for the `<Jumbo>` component earlier:

```js { data-filename="tests/integration/components/rental-test.js" data-diff="-9,-10,-11,-12,+13,-16,-17,-18,-19,-20,-21,-22,-23,-24,-25,+26,+27,+28,+29,+30,+31" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

  test('it renders information about a rental property', async function (assert) {
    await render(hbs`<Rental />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <Rental>
        template block text
      </Rental>
    `);

    assert.dom().hasText('template block text');
    assert.dom('article').hasClass('rental');
    assert.dom('article h3').hasText('Grand Old Mansion');
    assert.dom('article .detail.owner').includesText('Veruca Salt');
    assert.dom('article .detail.type').includesText('Standalone');
    assert.dom('article .detail.location').includesText('San Francisco');
    assert.dom('article .detail.bedrooms').includesText('15');
  });
});
```

The test should pass.

<img src="/images/tutorial/part-1/more-about-components/pass@2x.png" alt="Tests passing with the new &lt;Rental&gt; test" width="1024" height="512">

Finally, let's invoke this a couple of times from our index template to populate the page.

```handlebars { data-filename="app/templates/index.hbs" data-diff="+6,+7,+8,+9,+10,+11,+12,+13" }
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>

<div class="rentals">
  <ul class="results">
    <li><Rental /></li>
    <li><Rental /></li>
    <li><Rental /></li>
  </ul>
</div>
```

With that, we should see the `<Rental>` component showing our Grand Old Mansion three times on the page:

<img src="/images/tutorial/part-1/more-about-components/three-old-mansions@2x.png" alt="Three Grand Old Mansions" width="1024" height="1130">

Things are looking pretty convincing already; not bad for just a little bit of work!

## Organizing Code with Namespaced Components

Next, let's add the image for the rental property. We will use the component generator for this again:

```shell
$ ember generate component rental/image
installing component
  create app/components/rental/image.hbs
  skip app/components/rental/image.ts
  tip to add a class, run `ember generate component-class rental/image`
installing component-test
  create tests/integration/components/rental/image-test.js

Running "lint:fix" script...
```

This time, we had a `/` in the component's name. This resulted in the component being created at `app/components/rental/image.hbs`, which can be invoked as `<Rental::Image>`.

Components like these are known as _[namespaced](https://en.wikipedia.org/wiki/Namespace)_ components. Namespacing allows us to organize our components by folders according to their purpose. This is completely optional—namespaced components are not special in any way.

## Forwarding HTML Attributes with `...attributes`

Let's edit the component's template:

```handlebars { data-filename="app/components/rental/image.hbs" data-diff="-1,+2,+3,+4" }
{{yield}}
<div class="image">
  <img ...attributes>
</div>
```

Instead of hard-coding specific values for the `src` and `alt` attributes on the `<img>` tag, we opted for the `...attributes` keyword instead, which is also sometimes referred to as the _["splattributes"](../../../components/component-arguments-and-html-attributes/#toc_html-attributes)_ syntax. This allows arbitrary HTML attributes to be passed in when invoking this component, like so:

```handlebars { data-filename="app/components/rental.hbs" data-diff="+2,+3,+4,+5" }
<article class="rental">
  <Rental::Image
    src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg"
    alt="A picture of Grand Old Mansion"
  />
  <div class="details">
    <h3>Grand Old Mansion</h3>
    <div class="detail owner">
      <span>Owner:</span> Veruca Salt
    </div>
    <div class="detail type">
      <span>Type:</span> Standalone
    </div>
    <div class="detail location">
      <span>Location:</span> San Francisco
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span> 15
    </div>
  </div>
</article>
```

We specified a `src` and an `alt` HTML attribute here, which will be passed along to the component and attached to the element where `...attributes` is applied in the component template. You can think of this as being similar to `{{yield}}`, but for HTML attributes specifically, rather than displayed content. In fact, we have already used this feature [earlier](../building-pages/) when we passed a `class` attribute to `<LinkTo>`.

<img src="/images/tutorial/part-1/more-about-components/rental-image@2x.png" alt="The &lt;Rental::Image&gt; component in action" width="1024" height="1130">

This way, our `<Rental::Image>` component is not coupled to any specific rental property on the site. Of course, the hard-coding problem still exists (we simply moved it to the `<Rental>` component), but we will deal with that soon. We will limit all the hard-coding to the `<Rental>` component, so that we will have an easier time cleaning it up when we switch to fetching real data.

In general, it is a good idea to add `...attributes` to the primary element in your component. This will allow for maximum flexibility, as the invoker may need to pass along classes for styling or ARIA attributes to improve accessibility.

Let's write a test for our new component!

```js { data-filename="tests/integration/components/rental/image-test.js" data-diff="-9,-10,-11,-12,-13,-14,-15,-16,-17,+18,-20,-21,-22,+23,+24,+25,+26,-29,+30,+31,+32,+33,+34" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental/image', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Rental::Image />`);

    assert.dom().hasText('');

    // Template block usage:
  test('it renders the given image', async function (assert) {
    await render(hbs`
      <Rental::Image>
        template block text
      </Rental::Image>
      <Rental::Image
        src="/assets/images/teaching-tomster.png"
        alt="Teaching Tomster"
      />
    `);

    assert.dom().hasText('template block text');
    assert
      .dom('.image img')
      .exists()
      .hasAttribute('src', '/assets/images/teaching-tomster.png')
      .hasAttribute('alt', 'Teaching Tomster');
  });
});
```

## Determining the Appropriate Amount of Test Coverage

Finally, we should also update the tests for the `<Rental>` component to confirm that we successfully invoked `<Rental::Image>`.

```js { data-filename="tests/integration/components/rental-test.js" data-diff="+18" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders information about a rental property', async function (assert) {
    await render(hbs`<Rental />`);

    assert.dom('article').hasClass('rental');
    assert.dom('article h3').hasText('Grand Old Mansion');
    assert.dom('article .detail.owner').includesText('Veruca Salt');
    assert.dom('article .detail.type').includesText('Standalone');
    assert.dom('article .detail.location').includesText('San Francisco');
    assert.dom('article .detail.bedrooms').includesText('15');
    assert.dom('article .image').exists();
  });
});
```

Because we already tested `<Rental::Image>` extensively on its own, we can omit the details here and keep our assertion to the bare minimum. That way, we won't  _also_ have to update the `<Rental>` tests whenever we make changes to `<Rental::Image>`.

<img src="/images/tutorial/part-1/more-about-components/pass-2@2x.png" alt="Tests passing with the new &lt;Rental::Image&gt; test" width="1024" height="512">


---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/01-orientation.md -->

In this chapter, you will install _[Ember CLI](https://cli.emberjs.com/release/)_, use it to generate a new Ember project, and add some basic templates and styles to your new app. By the end of this chapter, you should have a landing page with Professor Tomster's cute little face featured on it:

<img src="/images/tutorial/part-1/orientation/styled-with-tomster@2x.png" alt="The Super Rentals app by the end of the chapter" width="1024" height="250">

While building your landing page, you will learn about:

- Installing Ember CLI
- Creating a new Ember app with Ember CLI
- Starting and stopping the development server
- Editing files and live reload
- Working with HTML, CSS and assets in an Ember app

## Installing Ember CLI

You can install the latest version of Ember CLI by running the following command. If you've already done this by following the [Quick Start](../../../getting-started/quick-start/) guide, feel free to skip ahead!

```shell
$ npm install -g ember-cli
```

To verify that your installation was successful, run:

```shell
$ ember --version
ember-cli: 6.0.1
node: 18.20.5
os: linux x64
```

If a version number is shown, you're ready to go.

## Creating a New Ember App with Ember CLI

We can create a new project using Ember CLI's `new` command. It follows the pattern `ember new <project-name>`. In our case, the project name would be `super-rentals`. We will also include a `--lang en` option. This sets our app's primary language to English and improves the website's [accessibility](../../../accessibility/application-considerations/).

```shell
$ ember new super-rentals --lang en
installing app
Ember CLI v6.0.1

Creating a new Ember app in /home/runner/work/super-rentals-tutorial/super-rentals-tutorial/dist/code/super-rentals:
  create .editorconfig
  create .ember-cli
  create .eslintignore
  create .eslintrc.js
  create .github/workflows/ci.yml
  create .prettierignore
  create .prettierrc.js
  create .stylelintignore
  create .stylelintrc.js
  create .template-lintrc.js
  create .watchmanconfig
  create README.md
  create app/app.js
  create app/components/.gitkeep
  create app/controllers/.gitkeep
  create app/helpers/.gitkeep
  create app/index.html
  create app/models/.gitkeep
  create app/router.js
  create app/routes/.gitkeep
  create app/styles/app.css
  create app/templates/application.hbs
  create config/ember-cli-update.json
  create config/environment.js
  create config/optional-features.json
  create config/targets.js
  create ember-cli-build.js
  create .gitignore
  create package.json
  create public/robots.txt
  create testem.js
  create tests/helpers/index.js
  create tests/index.html
  create tests/integration/.gitkeep
  create tests/test-helper.js
  create tests/unit/.gitkeep

Installing packages... This might take a couple of minutes.
npm: Installing dependencies ...
npm: Installed dependencies

Initializing git repository.
Git: successfully initialized.

Successfully created project super-rentals.
Get started by typing:

  $ cd super-rentals
  $ npm start

Happy coding!
```

This should have created a new folder for us called `super-rentals`. We can navigate into it using the `cd` command.

```shell
$ cd super-rentals
```

For the rest of the tutorial, all commands should be run within the `super-rentals` folder. This folder has the following structure:

```plain
super-rentals
├── .github
│   └── workflows
│       └── ci.yml
├── app
│   ├── components
│   │   └── .gitkeep
│   ├── controllers
│   │   └── .gitkeep
│   ├── helpers
│   │   └── .gitkeep
│   ├── models
│   │   └── .gitkeep
│   ├── routes
│   │   └── .gitkeep
│   ├── styles
│   │   └── app.css
│   ├── templates
│   │   └── application.hbs
│   ├── app.js
│   ├── index.html
│   └── router.js
├── config
│   ├── ember-cli-update.json
│   ├── environment.js
│   ├── optional-features.json
│   └── targets.js
├── public
│   └── robots.txt
├── tests
│   ├── helpers
│   │   └── index.js
│   ├── integration
│   │   └── .gitkeep
│   ├── unit
│   │   └── .gitkeep
│   ├── index.html
│   └── test-helper.js
├── .editorconfig
├── .ember-cli
├── .eslintcache
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .prettierignore
├── .prettierrc.js
├── .stylelintignore
├── .stylelintrc.js
├── .template-lintrc.js
├── .watchmanconfig
├── README.md
├── ember-cli-build.js
├── package.json
├── package-lock.json
└── testem.js

16 directories, 37 files
```

We'll learn about the purposes of these files and folders as we go. For now, just know that we'll spend most of our time working within the `app` folder.

## Starting and Stopping the Development Server

Ember CLI comes with a lot of different commands for a variety of development tasks, such as the `ember new` command that we saw earlier. It also comes with a _development server_, which we can launch within the project with the `npm start` command:

```shell
$ npm start

> super-rentals@0.0.0 start
> ember serve

building... 

Build successful (9761ms) – Serving on http://localhost:4200/
```

The development server is responsible for compiling our app and serving it to the browsers. It may take a while to boot up. Once it's up and running, open your favorite browser and head to <http://localhost:4200>. You should see the following welcome page:

<img src="/images/tutorial/part-1/orientation/welcome@2x.png" alt="Welcome to Ember!" width="1024" height="919">

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>The <code>localhost</code> address in the URL means that you can only access the development server from your local machine. If you would like to share your work with the world, you will have to <em><a href="https://cli.emberjs.com/release/basic-use/deploying/">deploy</a></em> your app to the public Internet. We'll cover how to do that in Part 2 of the tutorial.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

You can exit out of the development server at any time by typing `Ctrl + C` into the terminal window where `npm start` is running. That is, typing the "C" key on your keyboard _while_ holding down the "Ctrl" key at the same time. Once it has stopped, you can start it back up again with the same `npm start` command. We recommend having two terminal windows open: one to run the server in background, another to type other Ember CLI commands.

## Editing Files and Live Reload

The development server has a feature called _live reload_, which monitors your app for file changes, automatically re-compiles everything, and refreshes any open browser pages. This comes in really handy during development, so let's give that a try!

As text on the welcome page pointed out, the source code for the page is located in `app/templates/application.hbs`. Let's try to edit that file and replace it with our own content:

```handlebars { data-filename="app/templates/application.hbs" data-diff="-1,-2,-3,-4,-5,-6,-7,+8" }
{{page-title "SuperRentals"}}

{{outlet}}

{{! The following component displays Ember's default welcome message. }}
<WelcomePage />
{{! Feel free to remove this! }}
Hello World!!!
```

Soon after saving the file, your browser should automatically refresh and render our greetings to the world. Neat!

<img src="/images/tutorial/part-1/orientation/hello-world@2x.png" alt="Hello World!!!" width="1024" height="250">

When you are done experimenting, go ahead and delete the `app/templates/application.hbs` file. We won't be needing this for a while, so let's start afresh. We can add it back later when we have a need for it.

Again, if you still have your browser tab open, your tab will automatically re-render a blank page as soon as you delete the file. This reflects the fact that we no longer have an application template in our app.

## Working with HTML, CSS and Assets in an Ember App

Create a `app/templates/index.hbs` file and paste the following markup.

```handlebars { data-filename="app/templates/index.hbs" }
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
</div>
```

If you are thinking, "Hey, that looks like HTML!", then you would be right! In their simplest form, Ember templates are really just HTML. If you are already familiar with HTML, you should feel right at home here.

Of course, unlike HTML, Ember templates can do a lot more than just displaying static content. We will see that in action soon.

After saving the file, your browser tab should automatically refresh, showing us the welcome message we just worked on.

<img src="/images/tutorial/part-1/orientation/unstyled@2x.png" alt="Welcome to Super Rentals! (unstyled)" width="1024" height="250">

Before we do anything else, let's add some styling to our app. We spend enough time staring at the computer screen as it is, so we must protect our eyesight against unstyled markup!

Fortunately, our designer sent us some CSS to use, so we can <a href="/downloads/style.css" download="app.css">download the stylesheet file</a> and copy it into `app/styles/app.css`. This file has all the styles we need for building the rest of the app.

```css { data-filename="app/styles/app.css" }
@import url(https://fonts.googleapis.com/css?family=Lato:300,300italic,400,700,700italic);

/**
 * Base Elements
 */

* {
  margin: 0;
  padding: 0;
}

body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
div,
span,
a,
button {
  font-family: 'Lato', 'Open Sans', 'Helvetica Neue', 'Segoe UI', Helvetica, Arial, sans-serif;
  line-height: 1.5;
}

body {
  background: #f3f3f3;
}

/* ...snip... */
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>The CSS file is pretty long, so we didn't show the entire file here. Be sure to use the link above to download the complete file!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

If you are familiar with CSS, feel free to customize these styles to your liking! Just keep in mind that you may see some visual differences going forward, should you choose to do so.

When you are ready, save the CSS file; our trusty development server should pick it up and refresh our page right away. No more unstyled content!

<img src="/images/tutorial/part-1/orientation/styled@2x.png" alt="Welcome to Super Rentals! (styled)" width="1024" height="250">

To match the mockup from our designer, we will also need to download the `teaching-tomster.png` image, which was referenced from our CSS file:

```css { data-filename=app/styles/app.css }
.tomster {
  background: url(../assets/images/teaching-tomster.png);
  /* ...snip... */
}
```

As we learned earlier, the Ember convention is to place your source code in the `app` folder. For other assets like images and fonts, the convention is to put them in the `public` folder. We will follow this convention by <a href="/downloads/teaching-tomster.png" download="teaching-tomster.png">downloading the image file</a> and saving it into `public/assets/images/teaching-tomster.png`.

Both Ember CLI and the development server understand these folder conventions and will automatically make these files available to the browser.

You can confirm this by navigating to
`http://localhost:4200/assets/images/teaching-tomster.png`. The image should also show up in the welcome page we have been working on. You may need to do a manual refresh for the browser to pick up the new file.

<img src="/images/tutorial/part-1/orientation/styled-with-tomster@2x.png" alt="Welcome to Super Rentals! (with Tomster)" width="1024" height="250">


---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/recap.md -->

Congratulations, you finished the first part of this tutorial!

It was quite a journey! To recap, here is what you have learned:

<!-- Using ### [Chapter 1](../orientation/) triggers some sort of rendering bug -->

<h3><a href="../orientation/">Chapter 1</a></h3>

- Installing Ember CLI
- Creating a new Ember app with Ember CLI
- Starting and stopping the development server
- Editing files and live reload
- Working with HTML, CSS and assets in an Ember app

<h3><a href="../building-pages/">Chapter 2</a></h3>

- Defining routes
- Using route templates
- Customizing URLs
- Linking pages with the `<LinkTo>` component
- Passing arguments and attributes to components

<h3><a href="../automated-testing/">Chapter 3</a></h3>

- The purpose of automated testing
- Writing acceptance tests
- Using generators in Ember CLI
- Testing with the QUnit test framework
- Working with Ember's test helpers
- Practicing the testing workflow

<h3><a href="../component-basics/">Chapter 4</a></h3>

- Extracting markup into components
- Invoking components
- Passing content to components
- Yielding content with the `{{yield}}` keyword
- Refactoring existing code
- Writing component tests
- Using the application template and `{{outlet}}`s

<h3><a href="../more-about-components/">Chapter 5</a></h3>

- Generating components
- Organizing code with namespaced components
- Forwarding HTML attributes with `...attributes`
- Determining the appropriate amount of test coverage

<h3><a href="../interactive-components/">Chapter 6</a></h3>

- Adding behavior to components with classes
- Accessing instance states from templates
- Managing state with tracked properties
- Using conditionals syntaxes in templates
- Responding to user interaction with actions
- Invoking element modifiers
- Testing user interactions

<h3><a href="../reusable-components/">Chapter 7</a></h3>

- Managing application-level configurations
- Parameterizing components with arguments
- Accessing component arguments
- Interpolating values in templates
- Overriding HTML attributes in `...attributes`
- Refactoring with getters and auto-track
- Getting JavaScript values into the test context

<h3><a href="../working-with-data/">Chapter 8</a></h3>

- Working with route files
- Returning local data from the model hook
- Accessing route models from templates
- Mocking server data with static JSON files
- Fetching remote data from the model hook
- Adapting server data
- Loops and local variables in templates with `{{#each}}`

That's a lot! At this point, you are well equipped to perform a wide variety of development tasks in Ember!

Go ahead and take a break, or experiment with creating your own unique Ember app using the skills you just learned.

When you come back, we build upon what we learned in Part 1 and take things to the next level!


---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/07-reusable-components.md -->

The last missing feature for the `<Rental>` component is a map to show the location of the rental, which is what we're going to work on next:

<img src="/images/tutorial/part-1/reusable-components/three-old-mansions@2x.png" alt="The Super Rentals app by the end of the chapter" width="1024" height="1130">

While adding the map, you will learn about:

- Managing application-level configurations
- Parameterizing components with arguments
- Accessing component arguments
- Interpolating values in templates
- Overriding HTML attributes in `...attributes`
- Refactoring with getters and auto-track
- Getting JavaScript values into the test context

## Managing Application-level Configurations

We will use the [Mapbox](https://www.mapbox.com) API to generate maps for our rental properties. You can [sign up](https://www.mapbox.com/signup/) for free and without a credit card.

Mapbox provides a [static map images API](https://docs.mapbox.com/api/maps/#static-images), which serves map images in PNG format. This means that we can generate the appropriate URL for the parameters we want and render the map using a standard `<img>` tag. Pretty neat!

If you're curious, you can explore the options available on Mapbox by using the [interactive playground](https://docs.mapbox.com/help/interactive-tools/static-api-playground/).

Once you have signed up for the service, grab your _[default public token](https://account.mapbox.com/access-tokens/)_ and paste it into `config/environment.js`:

```js { data-filename="config/environment.js" data-diff="+48,+49" }
'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'super-rentals',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      RAISE_ON_DEPRECATION: true,
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  ENV.MAPBOX_ACCESS_TOKEN = 'paste your Mapbox access token here';

  return ENV;
};
```

As its name implies, `config/environment.js` is used to _configure_ our app and store API keys like these. These values can be accessed from other parts of our app, and they can have different values depending on the current environment (which might be development, test, or production).

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>If you prefer, you can <a href="https://account.mapbox.com/access-tokens/">create different Mapbox access tokens</a> for use in different environments. At a minimum, the tokens will each need to have the "styles:tiles" scope in order to use Mapbox's static images API.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

After saving the changes to our configuration file, we will need to restart our development server to pick up these file changes. Unlike the files we have edited so far, `config/environment.js` is not automatically reloaded.

<!-- TODO: https://github.com/ember-cli/ember-cli/issues/8782 -->

You can stop the server by finding the terminal window where `npm start` is running, then type `Ctrl + C`. That is, typing the "C" key on your keyboard _while_ holding down the "Ctrl" key at the same time. Once it has stopped, you can start it back up again with the same `npm start` command.

```shell
$ npm start

> super-rentals@0.0.0 start
> ember serve

building... 

Build successful (13286ms) – Serving on http://localhost:4200/
```

## Generating a Component with a Component Class

With the Mapbox API key in place, let's generate a new component for our map.

```shell
$ ember generate component map --with-component-class
installing component
  create app/components/map.js
  create app/components/map.hbs
installing component-test
  create tests/integration/components/map-test.js

Running "lint:fix" script...
```

Since not every component will necessarily have some defined behavior associated with it, the component generator does not generate a JavaScript file for us by default. As we saw earlier, we can always use the `component-class` generator to add a JavaScript file for a component later on.

However, in the case of our `<Map>` component, we are pretty sure that we are going to need a JavaScript file for some behavior that we have yet to define! To save a step later, we can pass the `--with-component-class` flag to the component generator so that we have everything we need from the get-go.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>Too much typing? Use <code>ember g component map -gc</code> instead. The <code>-gc</code> flag stands for <strong>G</strong>limmer <strong>c</strong>omponent, but you may also remember it as <strong>g</strong>enerate <strong>c</strong>lass.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Parameterizing Components with Arguments

Let's start with our JavaScript file:

```js { data-filename="app/components/map.js" data-diff="+2,-4,+5,+6,+7,+8,+9" }
import Component from '@glimmer/component';
import ENV from 'super-rentals/config/environment';

export default class Map extends Component {}
export default class Map extends Component {
  get token() {
    return encodeURIComponent(ENV.MAPBOX_ACCESS_TOKEN);
  }
}
```

Here, we import the access token from the config file and return it from a `token` _[getter](https://javascript.info/property-accessors)_. This allows us to access our token as `this.token` both inside the `Map` class body, as well as the component's template. It is also important to [URL-encode](https://javascript.info/url#encoding-strings) the token, just in case it contains any special characters that are not URL-safe.

## Interpolating Values in Templates

Now, let's move from the JavaScript file to the template:

```handlebars { data-filename="app/components/map.hbs" data-diff="-1,+2,+3,+4,+5,+6,+7,+8,+9" }
{{yield}}
<div class="map">
  <img
    alt="Map image at coordinates {{@lat}},{{@lng}}"
    ...attributes
    src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/{{@lng}},{{@lat}},{{@zoom}}/{{@width}}x{{@height}}@2x?access_token={{this.token}}"
    width={{@width}} height={{@height}}
  >
</div>
```

First, we have a container element for styling purposes.

Then we have an `<img>` tag to request and render the static map image from Mapbox.

Our template contains several values that don't yet exist—`@lat`, `@lng`, `@zoom`, `@width`, and `@height`. These are _[arguments](../../../components/component-arguments-and-html-attributes/#toc_arguments)_ to the `<Map>` component that we will supply when invoking it.

By _parameterizing_ our component using arguments, we made a reusable component that can be invoked from different parts of the app and customized to meet the needs for those specific contexts. We have already seen this in action when using the `<LinkTo>` component [earlier](../building-pages/); we had to specify a `@route` argument so that it knew what page to navigate to.

We supplied a reasonable default value for the `alt` attribute based on the values of the `@lat` and `@lng` arguments. You may notice that we are directly _interpolating_ values into the `alt` attribute's value. Ember will automatically concatenate these interpolated values into a final string value for us, including doing any necessary HTML-escaping.

## Overriding HTML Attributes in `...attributes`

Next, we used `...attributes` to allow the invoker to further customize the `<img>` tag, such as passing extra attributes such as `class`, as well as _overriding_ our default `alt` attribute with a more specific or human-friendly one.

_The ordering is important here!_ Ember applies the attributes in the order that they appear. By assigning the default `alt` attribute first (_before_ `...attributes` is applied), we are explicitly providing the invoker the _option_ to provide a more tailored `alt` attribute according to their use case.

Since the passed-in `alt` attribute (if any exists) will appear _after_ ours, it will override the value we specified. On the other hand, it is important that we assign `src`, `width`, and `height` after `...attributes`, so that they don't get accidentally overwritten by the invoker.

The `src` attribute interpolates all the required parameters into the URL format for Mapbox's [static map image API](https://docs.mapbox.com/api/maps/#static-images), including the URL-escaped access token from `this.token`.

Finally, since we are using the `@2x` "retina" image, we should specify the `width` and `height` attributes. Otherwise, the `<img>` will be rendered at twice the size than what we expected!

We just added a lot of behavior into a single component, so let's write some tests! In particular, we should make sure to have some _[test coverage](../../../testing/)_ for the overriding-HTML-attributes behavior we discussed above.

```js { data-filename="tests/integration/components/map-test.js" data-diff="-3,+4,+6,-11,-12,-13,+14,+15,+16,+17,+18,+19,+20,+21,-23,+24,+25,+26,+27,+28,+29,+30,-32,+33,+34,-36,-37,-38,-39,-40,-41,+42,+43,+44,+45,-47,+48,+49,+50,+51,+52,+53,+54,+55,+56,+57,+58,+59,+60,+61,+62,+63,+64,+65,+66,+67,+68,+69,+70,+71,+72,+73,+74,+75,+76,+77,+78,+79,+80,+81,+82,+83,+84,+85,+86,+87,+88,+89,+90,+91,+92,+93" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { render, find } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import ENV from 'super-rentals/config/environment';

module('Integration | Component | map', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
  test('it renders a map image for the specified parameters', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
    />`);

    await render(hbs`<Map />`);
    assert
      .dom('.map img')
      .exists()
      .hasAttribute('alt', 'Map image at coordinates 37.7797,-122.4184')
      .hasAttribute('src')
      .hasAttribute('width', '150')
      .hasAttribute('height', '120');

    assert.dom().hasText('');
    let { src } = find('.map img');
    let token = encodeURIComponent(ENV.MAPBOX_ACCESS_TOKEN);

    // Template block usage:
    await render(hbs`
      <Map>
        template block text
      </Map>
    `);
    assert.ok(
      src.startsWith('https://api.mapbox.com/'),
      'the src starts with "https://api.mapbox.com/"',
    );

    assert.dom().hasText('template block text');
    assert.ok(
      src.includes('-122.4184,37.7797,10'),
      'the src should include the lng,lat,zoom parameter',
    );

    assert.ok(
      src.includes('150x120@2x'),
      'the src should include the width,height and @2x parameter',
    );

    assert.ok(
      src.includes(`access_token=${token}`),
      'the src should include the escaped access token',
    );
  });

  test('the default alt attribute can be overridden', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
      alt="A map of San Francisco"
    />`);

    assert.dom('.map img').hasAttribute('alt', 'A map of San Francisco');
  });

  test('the src, width and height attributes cannot be overridden', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
      src="/assets/images/teaching-tomster.png"
      width="200"
      height="300"
    />`);

    assert
      .dom('.map img')
      .hasAttribute('src', /^https:\/\/api\.mapbox\.com\//)
      .hasAttribute('width', '150')
      .hasAttribute('height', '120');
  });
});
```

Note that the `hasAttribute` test helper from [`qunit-dom`](https://github.com/simplabs/qunit-dom/blob/master/API.md) supports using _[regular expressions](https://javascript.info/regexp-introduction)_. We used this feature to confirm that the `src` attribute starts with `https://api.mapbox.com/`, as opposed to requiring it to be an exact match against a string. This allows us to be reasonably confident that the code is working correctly, without being overly-detailed in our tests.

_Fingers crossed..._ Let's run our tests.

<img src="/images/tutorial/part-1/reusable-components/pass@2x.png" alt="Tests passing with the new &lt;Map&gt; tests" width="1024" height="768">

Hey, all the tests passed! But does that mean it actually works in practice? Let's find out by invoking the `<Map>` component from the `<Rental>` component's template:

```handlebars { data-filename="app/components/rental.hbs" data-diff="+21,+22,+23,+24,+25,+26,+27,+28" }
<article class="rental">
  <Rental::Image
    src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg"
    alt="A picture of Grand Old Mansion"
  />
  <div class="details">
    <h3>Grand Old Mansion</h3>
    <div class="detail owner">
      <span>Owner:</span> Veruca Salt
    </div>
    <div class="detail type">
      <span>Type:</span> Standalone
    </div>
    <div class="detail location">
      <span>Location:</span> San Francisco
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span> 15
    </div>
  </div>
  <Map
    @lat="37.7749"
    @lng="-122.4194"
    @zoom="9"
    @width="150"
    @height="150"
    alt="A map of Grand Old Mansion"
  />
</article>
```

Hey! That's a map!

<img src="/images/tutorial/part-1/reusable-components/three-old-mansions@2x.png" alt="Three Grand Old Mansions" width="1024" height="1130">

<!-- TODO: https://github.com/ember-cli/ember-cli/issues/8782 -->

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>If the map image failed to load, make sure you have the correct <code>MAPBOX_ACCESS_TOKEN</code> set in <code>config/environment.js</code>. Don't forget to restart the development and test servers after editing your config file!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

For good measure, we will also add an assertion to the `<Rental>` tests to make sure we rendered the `<Map>` component successfully.

```js { data-filename="tests/integration/components/rental-test.js" data-diff="+19" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders information about a rental property', async function (assert) {
    await render(hbs`<Rental />`);

    assert.dom('article').hasClass('rental');
    assert.dom('article h3').hasText('Grand Old Mansion');
    assert.dom('article .detail.owner').includesText('Veruca Salt');
    assert.dom('article .detail.type').includesText('Standalone');
    assert.dom('article .detail.location').includesText('San Francisco');
    assert.dom('article .detail.bedrooms').includesText('15');
    assert.dom('article .image').exists();
    assert.dom('article .map').exists();
  });
});
```

## Refactoring with Getters and Auto-track

At this point, a big part of our `<Map>` template is devoted to the `<img>` tag's `src` attribute, which is getting pretty long. One alternative is to move this computation into the JavaScript class instead.

From within our JavaScript class, we have access to our component's arguments using the `this.args.*` API. Using that, we can move the URL logic from the template into a new getter.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p><code>this.args</code> is an API provided by the Glimmer component superclass. You may come across other component superclasses, such as "classic" components in legacy codebases, that provide different APIs for accessing component arguments from JavaScript code.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

```js { data-filename="app/components/map.js" data-diff="+4,+5,+7,+8,+9,+10,+11,+12,+13,+14,+15,+16" }
import Component from '@glimmer/component';
import ENV from 'super-rentals/config/environment';

const MAPBOX_API = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static';

export default class Map extends Component {
  get src() {
    let { lng, lat, width, height, zoom } = this.args;

    let coordinates = `${lng},${lat},${zoom}`;
    let dimensions = `${width}x${height}`;
    let accessToken = `access_token=${this.token}`;

    return `${MAPBOX_API}/${coordinates}/${dimensions}@2x?${accessToken}`;
  }

  get token() {
    return encodeURIComponent(ENV.MAPBOX_ACCESS_TOKEN);
  }
}
```

```handlebars { data-filename="app/components/map.hbs" data-diff="-5,+6" }
<div class="map">
  <img
    alt="Map image at coordinates {{@lat}},{{@lng}}"
    ...attributes
    src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/{{@lng}},{{@lat}},{{@zoom}}/{{@width}}x{{@height}}@2x?access_token={{this.token}}"
    src={{this.src}}
    width={{@width}} height={{@height}}
  >
</div>
```

Much nicer! And all of our tests still pass!

<img src="/images/tutorial/part-1/reusable-components/pass-2@2x.png" alt="Tests passing after the src getter refactor" width="1024" height="768">

Note that we did not mark our getter as `@tracked`. Unlike instance variables, getters cannot be "assigned" a new value directly, so it does not make sense for Ember to monitor them for changes.

That being said, the values _produced_ by getters can certainly change. In our case, the value produced by our `src` getter depends on the values of `lat`, `lng`, `width`, `height` and `zoom` from `this.args`. Whenever these _dependencies_ get updated, we would expect `{{this.src}}` from our template to be updated accordingly.

Ember does this by automatically tracking any variables that were accessed while computing a getter's value. As long as the dependencies themselves are marked as `@tracked`, Ember knows exactly when to invalidate and re-render any templates that may potentially contain any "stale" and outdated getter values. This feature is also known as _[auto-track](../../../in-depth-topics/autotracking-in-depth/)_. All arguments that can be accessed from `this.args` (in other words, `this.args.*`) are implicitly marked as `@tracked` by the Glimmer component superclass. Since we inherited from that superclass, everything Just Works™.

## Getting JavaScript Values into the Test Context

Just to be sure, we can add a test for this behavior:

```js { data-filename="tests/integration/components/map-test.js" data-diff="+51,+52,+53,+54,+55,+56,+57,+58,+59,+60,+61,+62,+63,+64,+65,+66,+67,+68,+69,+70,+71,+72,+73,+74,+75,+76,+77,+78,+79,+80,+81,+82,+83,+84,+85,+86,+87,+88,+89,+90,+91,+92,+93,+94,+95,+96,+97,+98,+99,+100,+101,+102,+103,+104,+105,+106,+107,+108,+109,+110,+111" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render, find } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import ENV from 'super-rentals/config/environment';

module('Integration | Component | map', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a map image for the specified parameters', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
    />`);

    assert
      .dom('.map img')
      .exists()
      .hasAttribute('alt', 'Map image at coordinates 37.7797,-122.4184')
      .hasAttribute('src')
      .hasAttribute('width', '150')
      .hasAttribute('height', '120');

    let { src } = find('.map img');
    let token = encodeURIComponent(ENV.MAPBOX_ACCESS_TOKEN);

    assert.ok(
      src.startsWith('https://api.mapbox.com/'),
      'the src starts with "https://api.mapbox.com/"',
    );

    assert.ok(
      src.includes('-122.4184,37.7797,10'),
      'the src should include the lng,lat,zoom parameter',
    );

    assert.ok(
      src.includes('150x120@2x'),
      'the src should include the width,height and @2x parameter',
    );

    assert.ok(
      src.includes(`access_token=${token}`),
      'the src should include the escaped access token',
    );
  });

  test('it updates the `src` attribute when the arguments change', async function (assert) {
    this.setProperties({
      lat: 37.7749,
      lng: -122.4194,
      zoom: 10,
      width: 150,
      height: 120,
    });

    await render(hbs`<Map
      @lat={{this.lat}}
      @lng={{this.lng}}
      @zoom={{this.zoom}}
      @width={{this.width}}
      @height={{this.height}}
    />`);

    let img = find('.map img');

    assert.ok(
      img.src.includes('-122.4194,37.7749,10'),
      'the src should include the lng,lat,zoom parameter',
    );

    assert.ok(
      img.src.includes('150x120@2x'),
      'the src should include the width,height and @2x parameter',
    );

    this.setProperties({
      width: 300,
      height: 200,
      zoom: 12,
    });

    assert.ok(
      img.src.includes('-122.4194,37.7749,12'),
      'the src should include the lng,lat,zoom parameter',
    );

    assert.ok(
      img.src.includes('300x200@2x'),
      'the src should include the width,height and @2x parameter',
    );

    this.setProperties({
      lat: 47.6062,
      lng: -122.3321,
    });

    assert.ok(
      img.src.includes('-122.3321,47.6062,12'),
      'the src should include the lng,lat,zoom parameter',
    );

    assert.ok(
      img.src.includes('300x200@2x'),
      'the src should include the width,height and @2x parameter',
    );
  });

  test('the default alt attribute can be overridden', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
      alt="A map of San Francisco"
    />`);

    assert.dom('.map img').hasAttribute('alt', 'A map of San Francisco');
  });

  test('the src, width and height attributes cannot be overridden', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
      src="/assets/images/teaching-tomster.png"
      width="200"
      height="300"
    />`);

    assert
      .dom('.map img')
      .hasAttribute('src', /^https:\/\/api\.mapbox\.com\//)
      .hasAttribute('width', '150')
      .hasAttribute('height', '120');
  });
});
```

Using the special `this.setProperties` testing API, we can pass arbitrary values into our component.

Note that the value of `this` here does _not_ refer to the component instance. We are not directly accessing or modifying the component's internal states (that would be extremely rude!).

Instead, `this` refers to a special _test context_ object, which we have access to inside the `render` helper. This provides a "bridge" for us to pass dynamic values, in the form of arguments, into our invocation of the component. This allows us to update these values as needed from the test function.

With all our tests passing, we are ready to move on!

<img src="/images/tutorial/part-1/reusable-components/pass-3@2x.png" alt="All our tests are passing" width="1024" height="768">


---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/08-working-with-data.md -->

In this chapter, we will remove the hard-coded data from our `<Rental>` component. By the end, your app would finally be displaying real data that came from the server:

<img src="/images/tutorial/part-1/working-with-data/three-properties@2x.png" alt="The Super Rentals app by the end of the chapter" width="1024" height="1130">

In this chapter, you will learn about:

- Working with route files
- Returning local data from the model hook
- Accessing route models from templates
- Mocking server data with static JSON files
- Fetching remote data from the model hook
- Adapting server data
- Loops and local variables in templates with `{{#each}}`

## Working with Route Files

So far, we've been hard-coding everything into our `<Rental>` component. But that's probably not very sustainable, since eventually, we want our data to come from a server instead. Let's go ahead and move some of those hard-coded values out of the component in preparation for that.

We want to start working towards a place where we can eventually fetch data from the server, and then render the requested data as dynamic content from the templates. In order to do that, we will need a place where we can write the code for fetching data and loading it into the routes.

In Ember, _[route files](../../../routing/defining-your-routes/)_ are the place to do that. We haven't needed them yet, because all our routes are essentially just rendering static pages up until this point, but we are about to change that.

Let's start by creating a route file for the index route. We will create a new file at `app/routes/index.js` with the following content:

```js { data-filename="app/routes/index.js" }
import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  async model() {
    return {
      title: 'Grand Old Mansion',
      owner: 'Veruca Salt',
      city: 'San Francisco',
      location: {
        lat: 37.7749,
        lng: -122.4194,
      },
      category: 'Estate',
      type: 'Standalone',
      bedrooms: 15,
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
      description: 'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
    };
  }
}
```

There's a lot happening here that we haven't seen before, so let's walk through this. First, we're importing the _[`Route` class](https://api.emberjs.com/ember/release/classes/Route)_ into the file. This class is used as a starting point for adding functionality to a route, such as loading data.

Then, we are extending the `Route` class into our _own_ `IndexRoute`, which we also _[`export`](https://javascript.info/import-export#export-default)_ so that the rest of the application can use it.

## Returning Local Data from the Model Hook

So far, so good. But what's happening inside of this route class? We implemented an _[async](https://developer.mozilla.org/docs/Learn/JavaScript/Asynchronous/Concepts)_ method called `model()`. This method is also known as the _model hook_.

The model hook is responsible for fetching and preparing any data that you need for your route. Ember will automatically call this hook when entering a route, so that you can have an opportunity to run your own code to get the data you need. The object returned from this hook is known as the _[model](../../../routing/specifying-a-routes-model/)_ for the route (surprise!).

Usually, this is where we'd fetch data from a server. Since fetching data is usually an asynchronous operation, the model hook is marked as `async`. This gives us the option of using the `await` keyword to wait for the data fetching operations to finish.

We'll get to that bit later on. At the moment, we are just returning the same hard-coding model data, extracted from the `<Rental>` component, but in a _[JavaScript object](https://developer.mozilla.org/docs/Learn/JavaScript/Objects/Basics)_ format.

## Accessing Route Models from Templates

So, now that we've prepared some model data for our route, let's use it in our template. In route templates, we can access the model for the route as `@model`. In our case, that would contain the POJO returned from our model hook.

To test that this is working, let's modify our template and try to render the `title` property from our model:

```handlebars { data-filename="app/templates/index.hbs" data-diff="+7,+8" }
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>

<h1>{{@model.title}}</h1>

<div class="rentals">
  <ul class="results">
    <li><Rental /></li>
    <li><Rental /></li>
    <li><Rental /></li>
  </ul>
</div>
```

If we look at our page in the browser, we should see our model data reflected as a new header.

<img src="/images/tutorial/part-1/working-with-data/model-header@2x.png" alt="New header using the @model data" width="1024" height="512">

Awesome!

Okay, now that we know that we have a model to use at our disposal, let's remove some of the hard-coding that we did earlier! Instead of explicitly hard-coding the rental information into our `<Rental>` component, we can pass the model object to our component instead.

Let's try it out.

First, let's pass in our model to our `<Rental>` component as the `@rental` argument. We will also remove the extraneous `<h1>` tag we added earlier, now that we know things are working:

```handlebars { data-filename="app/templates/index.hbs" data-diff="-7,-8,-11,-12,-13,+14,+15,+16" }
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>

<h1>{{@model.title}}</h1>

<div class="rentals">
  <ul class="results">
    <li><Rental /></li>
    <li><Rental /></li>
    <li><Rental /></li>
    <li><Rental @rental={{@model}} /></li>
    <li><Rental @rental={{@model}} /></li>
    <li><Rental @rental={{@model}} /></li>
  </ul>
</div>
```

By passing in `@model` into the `<Rental>` component as the `@rental` argument, we will have access to our "Grand Old Mansion" model object in the `<Rental>` component's template! Now, we can replace our hard-coded values in this component by using the values that live on our `@rental` model.

```handlebars { data-filename="app/components/rental.hbs" data-diff="-3,-4,+5,+6,-9,+10,-12,+13,-16,+17,-20,+21,-24,+25,-29,-30,+31,+32,-36,+37" }
<article class="rental">
  <Rental::Image
    src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg"
    alt="A picture of Grand Old Mansion"
    src={{@rental.image}}
    alt="A picture of {{@rental.title}}"
  />
  <div class="details">
    <h3>Grand Old Mansion</h3>
    <h3>{{@rental.title}}</h3>
    <div class="detail owner">
      <span>Owner:</span> Veruca Salt
      <span>Owner:</span> {{@rental.owner}}
    </div>
    <div class="detail type">
      <span>Type:</span> Standalone
      <span>Type:</span> {{@rental.type}}
    </div>
    <div class="detail location">
      <span>Location:</span> San Francisco
      <span>Location:</span> {{@rental.city}}
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span> 15
      <span>Number of bedrooms:</span> {{@rental.bedrooms}}
    </div>
  </div>
  <Map
    @lat="37.7749"
    @lng="-122.4194"
    @lat={{@rental.location.lat}}
    @lng={{@rental.location.lng}}
    @zoom="9"
    @width="150"
    @height="150"
    alt="A map of Grand Old Mansion"
    alt="A map of {{@rental.title}}"
  />
</article>
```

Since the model object contains exactly the same data as the previously-hard-coded "Grand Old Mansion", the page should look exactly the same as before the change.

<img src="/images/tutorial/part-1/working-with-data/using-model-data@2x.png" alt="New header using the @model data" width="1024" height="512">

Now, we have one last thing to do: update the tests to reflect this change.

Because component tests are meant to render and test a single component in isolation from the rest of the app, they do not perform any routing, which means we won't have access to the same data returned from the `model` hook.

Therefore, in our `<Rental>` component's test, we will have to feed the data into it some other way. We can do this using the `setProperties` we learned about from the [previous chapter](../reusable-components/).

```js { data-filename="tests/integration/components/rental-test.js" data-diff="-10,+11,+12,+13,+14,+15,+16,+17,+18,+19,+20,+21,+22,+23,+24,+25,+26,+27,+28,+29,+30" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders information about a rental property', async function (assert) {
    await render(hbs`<Rental />`);
    this.setProperties({
      rental: {
        title: 'Grand Old Mansion',
        owner: 'Veruca Salt',
        city: 'San Francisco',
        location: {
          lat: 37.7749,
          lng: -122.4194,
        },
        category: 'Estate',
        type: 'Standalone',
        bedrooms: 15,
        image:
          'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
        description:
          'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
      },
    });

    await render(hbs`<Rental @rental={{this.rental}} />`);

    assert.dom('article').hasClass('rental');
    assert.dom('article h3').hasText('Grand Old Mansion');
    assert.dom('article .detail.owner').includesText('Veruca Salt');
    assert.dom('article .detail.type').includesText('Standalone');
    assert.dom('article .detail.location').includesText('San Francisco');
    assert.dom('article .detail.bedrooms').includesText('15');
    assert.dom('article .image').exists();
    assert.dom('article .map').exists();
  });
});
```

Notice that we also need to update the invocation of the `<Rental>` component in the `render` function call to also have a `@rental` argument passed into it. If we run our tests now, they should all pass!

<img src="/images/tutorial/part-1/working-with-data/pass@2x.png" alt="All our tests are passing" width="1024" height="768">

## Mocking Server Data with Static JSON Files

Now that we have things in place, let's do the fun part of removing _all_ our hard-coded values from the model hook and actually fetch some data from the server!

In a production app, the data that we'd fetch would most likely come from a remote API server. To avoid setting up an API server just for this tutorial, we will put some JSON data into the `public` folder instead. That way, we can still request this JSON data with regular HTTP requests—just like we would with a real API server —but without having to write any server logic.

But where will the data come from? You can <a href="/downloads/data.zip" download="data.zip">download this data file</a>, where we have prepared some JSON data and bundled it into a `.zip` file format. Extract its content into the `public` folder.

When you are done, your `public` folder should now have the following content:

```plain
public
├── api
│   ├── rentals
│   │   ├── downtown-charm.json
│   │   ├── grand-old-mansion.json
│   │   └── urban-living.json
│   └── rentals.json
├── assets
│   └── images
│       └── teaching-tomster.png
└── robots.txt

4 directories, 6 files
```

You can verify that everything is working correctly by navigating to `http://localhost:4200/api/rentals.json`.

<img src="/images/tutorial/part-1/working-with-data/data@2x.png" alt="Our server serving up our rental properties as JSON data" width="1024" height="512">

Awesome! Our "server" is now up and running, serving up our rental properties as JSON data.

## Fetching Remote Data from the Model Hook

Now, let's turn our attention to our model hook again. We need to change it so that we actually fetch the data from the server.

```js { data-filename="app/routes/index.js" data-diff="-5,-6,-7,-8,-9,-10,-11,-12,-13,-14,-15,-16,-17,-18,+19,+20,+21" }
import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  async model() {
    return {
      title: 'Grand Old Mansion',
      owner: 'Veruca Salt',
      city: 'San Francisco',
      location: {
        lat: 37.7749,
        lng: -122.4194,
      },
      category: 'Estate',
      type: 'Standalone',
      bedrooms: 15,
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
      description: 'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
    };
    let response = await fetch('/api/rentals.json');
    let parsed = await response.json();
    return parsed;
  }
}
```

What's happening here?

First off, we're using the browser's _[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)_ to request that JSON data from our server's API at `public/api/rentals.json`, the same URL we visited earlier.

As mentioned above, fetching data from the server is usually an asynchronous operation. The Fetch API takes this into account, which is why `fetch` is an `async` function, just like our model hook. To consume its response, we will have to pair it with the `await` keyword.

The Fetch API returns a _[response object](https://developer.mozilla.org/docs/Web/API/Response)_ asynchronously. Once we have this object, we can convert the server's response into whatever format we need; in our case, we knew the server sent the data using the JSON format, so we can use the `json()` method to _[parse](https://developer.mozilla.org/docs/Web/API/Body/json)_ the response data accordingly. Parsing the response data is _also_ an asynchronous operation, so we'll just use the `await` keyword here, too.

## Adapting Server Data

Before we go any further, let's pause for a second to look at the server's data again.

```json { data-filename="public/api/rentals.json" }
{
  "data": [
    {
      "type": "rental",
      "id": "grand-old-mansion",
      "attributes": {
        "title": "Grand Old Mansion",
        "owner": "Veruca Salt",
        "city": "San Francisco",
        "location": {
          "lat": 37.7749,
          "lng": -122.4194
        },
        "category": "Estate",
        "bedrooms": 15,
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg",
        "description": "This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests."
      }
    },
    {
      "type": "rental",
      "id": "urban-living",
      "attributes": {
        "title": "Urban Living",
        "owner": "Mike Teavee",
        "city": "Seattle",
        "location": {
          "lat": 47.6062,
          "lng": -122.3321
        },
        "category": "Condo",
        "bedrooms": 1,
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/20/Seattle_-_Barnes_and_Bell_Buildings.jpg",
        "description": "A commuters dream. This rental is within walking distance of 2 bus stops and the Metro."
      }
    },
    {
      "type": "rental",
      "id": "downtown-charm",
      "attributes": {
        "title": "Downtown Charm",
        "owner": "Violet Beauregarde",
        "city": "Portland",
        "location": {
          "lat": 45.5175,
          "lng": -122.6801
        },
        "category": "Apartment",
        "bedrooms": 3,
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f7/Wheeldon_Apartment_Building_-_Portland_Oregon.jpg",
        "description": "Convenience is at your doorstep with this charming downtown rental. Great restaurants and active night life are within a few feet."
      }
    }
  ]
}
```

This data follows the _[JSON:API](https://jsonapi.org/)_ format, which is _slightly_ different than the hard-coded data that we were returning from the model hook before.

First off, the JSON:API format returns an array nested under the `"data"` key, rather than just the data for a single rental property. If we think about this, though, it makes sense; we now want to show a whole list of rental properties that are coming from our server, not just one, so an array of rental property objects is just what we need.

The rental property objects contained in the array also have a slightly different structure. Every data object has a `type` and `id`, which we don't intend to use in our template (yet!). For now, the only data we really need is nested within the `attributes` key.

There's one more key difference here, which perhaps only those with very sharp eyes will be able to catch: the data coming from the server is missing the `type` property, which previously existed on our hard-coded model object. The `type` property could either be `"Standalone"` or `"Community"`, depending on the type of rental property, which is required by our `<Rental>` component.

In [Part 2](../../part-2/) of this tutorial, we will learn about a more convenient way to consume data in the JSON:API format. For now, we can just fix up the data and deal with these differences in formats ourselves.

We can handle it all in our model hook:

```js { data-filename="app/routes/index.js" data-diff="+3,+4,-8,-9,+10,+11,+12,+13,+14,+15,+16,+17,+18,+19,+20,+21,+22,+23" }
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];

export default class IndexRoute extends Route {
  async model() {
    let response = await fetch('/api/rentals.json');
    let parsed = await response.json();
    return parsed;
    let { data } = await response.json();

    return data.map((model) => {
      let { attributes } = model;
      let type;

      if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
        type = 'Community';
      } else {
        type = 'Standalone';
      }

      return { type, ...attributes };
    });
  }
}
```

After parsing the JSON data, we extracted the nested `attributes` object, added back the missing `type` attribute manually, then returned it from the model hook. That way, the rest of our app will have no idea that this difference ever existed.

Awesome! Now we're in business.

## Loops and Local Variables in Templates with `{{#each}}`

The last change we'll need to make is to our `index.hbs` route template, where we invoke our `<Rental>` components. Previously, we were passing in `@rental` as `@model` to our components. However, `@model` is no longer a single object, but rather, an array! So, we'll need to change this template to account for that.

Let's see how.

```handlebars { data-filename="app/templates/index.hbs" data-diff="-9,-10,-11,+12,+13,+14" }
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>

<div class="rentals">
  <ul class="results">
    <li><Rental @rental={{@model}} /></li>
    <li><Rental @rental={{@model}} /></li>
    <li><Rental @rental={{@model}} /></li>
    {{#each @model as |rental|}}
      <li><Rental @rental={{rental}} /></li>
    {{/each}}
  </ul>
</div>
```

We can use the `{{#each}}...{{/each}}` syntax to iterate and loop through the array returned by the model hook. For each iteration through the array—for each item in the array—we will render the block that is passed to it once. In our case, the block is our `<Rental>` component, surrounded by `<li>` tags.

Inside of the block we have access to the item of the _current_ iteration with the `{{rental}}` variable. But why `rental`? Well, because we named it that! This variable comes from the `as |rental|` declaration of the `each` loop. We could have just as easily called it something else, like `as |property|`, in which case we would have to access the current item through the `{{property}}` variable.

Now, let's go over to our browser and see what our index route looks like with this change.

<img src="/images/tutorial/part-1/working-with-data/three-properties@2x.png" alt="Three different rental properties" width="1024" height="1130">

Hooray! Finally we're seeing different rental properties in our list. And we got to play with `fetch` and write a loop. Pretty productive, if you ask me.

Better yet, all of our tests are still passing too!

<img src="/images/tutorial/part-1/working-with-data/pass-2@2x.png" alt="All our tests are passing" width="1024" height="768">


---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-2/11-ember-data.md -->

In this chapter, we will work on removing some code duplication in our route handlers, by switching to using EmberData to manage our data. The end result looks exactly the same as before:

<img src="/images/tutorial/part-2/ember-data/homepage@2x.png" alt="The Super Rentals app by the end of the chapter" width="1024" height="1130">

During this refactor, you will learn about:

- EmberData models
- Testing models
- Loading models in routes
- The EmberData Store and RequestManager
- Working with Request builders and handlers

## What is EmberData?

Now that we've added some features, it's time to do some clean up again!

A while back, we added the `rental` route. If memory serves us well, we didn't do anything too fancy when we added that new route; we just copy-pasted a lot of the same logic from the `index` route.

```js { data-filename="app/routes/index.js" }
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];

export default class IndexRoute extends Route {
  async model() {
    let response = await fetch('/api/rentals.json');
    let { data } = await response.json();

    return data.map((model) => {
      let { id, attributes } = model;
      let type;

      if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
        type = 'Community';
      } else {
        type = 'Standalone';
      }

      return { id, type, ...attributes };
    });
  }
}
```

```js { data-filename="app/routes/rental.js" }
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];

export default class RentalRoute extends Route {
  async model(params) {
    let response = await fetch(`/api/rentals/${params.rental_id}.json`);
    let { data } = await response.json();

    let { id, attributes } = data;
    let type;

    if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
      type = 'Community';
    } else {
      type = 'Standalone';
    }

    return { id, type, ...attributes };
  }
}
```

This duplication incurred a bit of _technical debt_ for us, making our code base harder to maintain in the long run. For example, if we wanted to change something about how our data-fetching logic worked, we'd have to change it in _both_ the `index` and `rental` routes. If we changed things in one place, but forgot about the other spot, we could end up with really subtle bugs in our app! Yikes!

Chances are, as we keep working on this app, we will need to add more routes that fetch data from the server. Since all of our server's API endpoints follow the [JSON:API](https://jsonapi.org/) format, we'd have to keep copying this boilerplate for every single new route we add to the app!

Fortunately, we're not going to do any of that. As it turns out, there's a much better solution here: we can use EmberData! As its name implies, [EmberData](../../../models/) is a library that helps manage data and _application state_ in Ember applications.

There's a lot to learn about EmberData, but let's start by uncovering features that help with our immediate problem.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>RequestManager is available starting with the EmberData 4.12 LTS release. EmberData works with multiple versions of Ember, please refer to the Compatibility section of the <a href="https://github.com/emberjs/data/blob/main/README.md#compatibility">EmberData README</a> while doing your application upgrade.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## EmberData Models

EmberData is built around the idea of organizing your app's data into _[model objects](../../../models/defining-models/)_. These objects represent units of information that our application presents to the user. For example, the rental property data we have been working with would be a good candidate.

Enough talking, why don't we give that a try!

```js { data-filename="app/models/rental.js" }
import Model, { attr } from '@ember-data/model';

const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];

export default class RentalModel extends Model {
  @attr title;
  @attr owner;
  @attr city;
  @attr location;
  @attr category;
  @attr image;
  @attr bedrooms;
  @attr description;

  get type() {
    if (COMMUNITY_CATEGORIES.includes(this.category)) {
      return 'Community';
    } else {
      return 'Standalone';
    }
  }
}
```

Here, we created a `RentalModel` class that extends EmberData's `Model` superclass. When fetching the listing data from the server, each individual rental property will be represented by an instance (also known as a _[record](../../../models/finding-records/)_) of our `RentalModel` class.

We used the `@attr` decorator to declare the attributes of a rental property. These attributes correspond directly to the `attributes` data we expect the server to provide in its responses:

```json { data-filename="public/api/rentals/grand-old-mansion.json" }
{
  "data": {
    "type": "rental",
    "id": "grand-old-mansion",
    "attributes": {
      "title": "Grand Old Mansion",
      "owner": "Veruca Salt",
      "city": "San Francisco",
      "location": {
        "lat": 37.7749,
        "lng": -122.4194
      },
      "category": "Estate",
      "bedrooms": 15,
      "image": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg",
      "description": "This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests."
    }
  }
}
```

We can access these attributes for an instance of `RentalModel` using standard dot notation, such as `model.title` or `model.location.lat`. In addition to the attributes we declared here, there will always be an implicit _id_ attribute as well, which is used to uniquely identify the model object and can be accessed using `model.id`.

Model classes in EmberData are no different than any other classes we've worked with so far, in that they allow for a convenient place for adding custom behavior. We took advantage of this feature to move our `type` logic (which is a major source of unnecessary duplication in our route handlers) into a getter on our model class. Once we have everything working here, we will go back to clean that up.

Attributes declared with the `@attr` decorator work with the auto-track feature (which we learned about [in a previous chapter](../../part-1/reusable-components/)). Therefore, we are free to reference any model attributes in our getter (`this.category`), and Ember will know when to invalidate its result.

## Testing Models

So far, we haven't had a good place to write tests for the rental property's `type` logic. Now that we have found a home for it in the model class, it also made it easy to test this behavior. We can add a test file for our model using the `model-test` generator:

```shell
$ ember generate model-test rental
installing model-test
  create tests/unit/models/rental-test.js

Running "lint:fix" script...
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>We could also have used the <code>ember generate model rental</code> command in the first place, which would have created both the model and test file for us.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

The generator created some boilerplate code for us, which serves as a pretty good starting point for writing our test:

```js { data-filename="tests/unit/models/rental-test.js" data-diff="-7,-8,+9,-11,-12,+13,+14,+15,+16,+17,+18,+19,+20,+21,+22,+23,+24,+25,+26,+27,+28,+29,+30,+31,+32,+33,+34,+35,+36,+37,+38,+39,+40,+41,+42" }
import { setupTest } from 'super-rentals/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Model | rental', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
  test('it has the right type', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('rental', {});
    assert.ok(model, 'model exists');
    let rental = store.createRecord('rental', {
      id: 'grand-old-mansion',
      title: 'Grand Old Mansion',
      owner: 'Veruca Salt',
      city: 'San Francisco',
      location: {
        lat: 37.7749,
        lng: -122.4194,
      },
      category: 'Estate',
      bedrooms: 15,
      image:
        'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
      description:
        'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
    });

    assert.strictEqual(rental.type, 'Standalone');

    rental.category = 'Condo';
    assert.strictEqual(rental.type, 'Community');

    rental.category = 'Townhouse';
    assert.strictEqual(rental.type, 'Community');

    rental.category = 'Apartment';
    assert.strictEqual(rental.type, 'Community');

    rental.category = 'Estate';
    assert.strictEqual(rental.type, 'Standalone');
  });
});
```

This model test is also known as a _[unit test](../../../testing/testing-models/)_. Unlike any of the other tests that we've written thus far, this test doesn't actually _render_ anything. It just instantiates the rental model object and tests the model object directly, manipulating its attributes and asserting their value.

It is worth pointing out that EmberData provides a `store` _[service](../../../services/)_, also known as the EmberData store. In our test, we used the `this.owner.lookup('service:store')` API to get access to the EmberData store. The store provides a `createRecord` method to instantiate our model object for us. To make this `store` service available, we must add the following file:

```js { data-filename="app/services/store.js" }
export { default } from 'ember-data/store';
```

Running the tests in the browser confirms that everything is working as intended:

<img src="/images/tutorial/part-2/ember-data/pass-1@2x.png" alt="All the tests pass!" width="1024" height="1024">

## Loading Models in Routes

Alright, now that we have our model set up, it's time to refactor our route handlers to use EmberData and remove the duplication!

```js { data-filename="app/routes/index.js" data-diff="-2,-3,+4,+5,-8,-9,-10,-11,-12,-13,-14,+15,-17,-18,-19,-20,-21,-22,-23,-24,+25,+26,+27" }
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];
import { service } from '@ember/service';
import { query } from '@ember-data/json-api/request';

export default class IndexRoute extends Route {
  async model() {
    let response = await fetch('/api/rentals.json');
    let { data } = await response.json();

    return data.map((model) => {
      let { id, attributes } = model;
      let type;
  @service store;

      if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
        type = 'Community';
      } else {
        type = 'Standalone';
      }

      return { id, type, ...attributes };
    });
  async model() {
    const { content } = await this.store.request(query('rental'));
    return content.data;
  }
}
```

```js { data-filename="app/routes/rental.js" data-diff="-2,-3,+4,+5,-8,-9,-10,-11,-12,-13,+14,-16,-17,-18,-19,-20,-21,-22,+23,+24,+25,+26,+27" }
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];
import { service } from '@ember/service';
import { findRecord } from '@ember-data/json-api/request';

export default class RentalRoute extends Route {
  async model(params) {
    let response = await fetch(`/api/rentals/${params.rental_id}.json`);
    let { data } = await response.json();

    let { id, attributes } = data;
    let type;
  @service store;

    if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
      type = 'Community';
    } else {
      type = 'Standalone';
    }

    return { id, type, ...attributes };
  async model(params) {
    const { content } = await this.store.request(
      findRecord('rental', params.rental_id),
    );
    return content.data;
  }
}
```

Wow... that removed a lot of code! This is all possible thanks to the power of conventions!

## The EmberData Store

As mentioned above, EmberData provides a `store` service, which we can inject into our route using the `@service store;` declaration, making the EmberData store available as `this.store`. It provides the `request` method for making fetch requests using `RequestManager`. As its name implies: the `RequestManager` is request centric. Instead of answering questions about specific records or types of records, we ask it about the status of a specific request. To initiate a request, we use the `request` method on the store, passing in a request object. The request object is created using builders from `@ember-data/json-api/request`. Specifically, the [`findRecord` builder](../../../models/finding-records/#toc_retrieving-a-single-record) takes a model type (`rental` in our case) and a model ID (for us, that would be `params.rental_id` from the URL) as arguments and builds fetch options for a single record. On the other hand, the [`query` builder](../../../models/finding-records/#toc_retrieving-multiple-records) takes the model type as an argument and builds fetch options to query for all records of that type.

EmberData can do many things, and in default setup it provides caching. EmberData's store caches server responses, allowing instant access to previously fetched data. If the data is already cached, you don't need to wait for the server to respond again. If not, the store fetches it for you.

That's a lot of theory, but is this going to work in our app? Let's run the tests and find out!

<img src="/images/tutorial/part-2/ember-data/fail-1@2x.png" alt="A few tests failed!" width="1024" height="960">

Darn, there were a couple of failing tests! At the same time, it's great that we were made aware of the potential problems – yay, regression tests!

Looking at the failure messages, the problem appears to be that the store went to the wrong URLs when fetching data from the server, resulting in some 404 errors. Specifically:

- When building the `query('rental')` request, the resulted `url` in request options was `/rentals`, instead of `/api/rentals.json`.
- When building the `findRecord('rental', 'grand-old-mansion')` request, the resulted `url` in request options was `/rentals/grand-old-mansion`, instead of `/api/rentals/grand-old-mansion.json`.

Hm, okay, so we have to teach EmberData to fetch data from the correct location. But how does EmberData know how to fetch data from our server in the first place?

## Working with Request builders and Handlers

Let's start customizing the things that didn't work for us by default. Specifically:

- Our resource URLs have an extra `/api` _namespace_ prefix.
- Our resource URLs have a `.json` extension at the end.

The first thing we want to do is have our builder respect a configurable default host and/or namespace. Adding a namespace prefix happens to be pretty common across Ember apps, so EmberData provides a global config mechanism for host and namespace. Typically you will want to do this either in your store file or app file.

```js { data-filename="app/app.js" data-diff="+5,+6,+7,+8,+9" }
import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'super-rentals/config/environment';
import { setBuildURLConfig } from '@ember-data/request-utils';

setBuildURLConfig({
  namespace: 'api',
});

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
```

Adding the `.json` extension is a bit less common, and doesn't have a declarative configuration API of its own. We could just modify request options directly in place of use, but that would be a bit messy. Instead, let's create a handler to do this for us.

```js { data-filename="app/utils/handlers.js" }
export const JsonSuffixHandler = {
  request(context, next) {
    const { request } = context;
    const updatedRequest = Object.assign({}, request, {
      url: request.url + '.json',
    });

    return next(updatedRequest);
  },
};
```

As you can see, the handler appends `.json` to the URL of each request. Pretty simple, right? Then it calls the `next` function with the modified copy of the request object (because it is immutable). This is how we can chain multiple handlers together to build up a request.

The next step that we need to do, is to configure `RequestManager` to use this handler. Let's create the request-manager service.

```js { data-filename="app/services/request-manager.js" }
import BaseRequestManager from '@ember-data/request';
import Fetch from '@ember-data/request/fetch';
import { JsonSuffixHandler } from 'super-rentals/utils/handlers';

export default class RequestManager extends BaseRequestManager {
  constructor(args) {
    super(args);

    this.use([JsonSuffixHandler, Fetch]);
  }
}
```

Notice that we are using the `JsonSuffixHandler` we created earlier. We also use the `Fetch` handler, which is a built-in handler that makes the actual fetch request. The `use` method is used to add handlers to the request manager. The order in which handlers are added is important, as they will be executed in the order they were added.

Lastly, let's update our `store` service to use the new `RequestManager` we created.

```js { data-filename="app/services/store.js" data-diff="-1,+2,+3,+4,+5,+6,+7" }
export { default } from 'ember-data/store';
import BaseStore from 'ember-data/store';
import { service } from '@ember/service';

export default class Store extends BaseStore {
  @service requestManager;
}
```

With our new EmberData configuration in place, all our tests should pass again.

<img src="/images/tutorial/part-2/ember-data/pass-2@2x.png" alt="Once again, all the tests are passing again!" width="1024" height="1024">

The UI works exactly the same as before as well, just with much less code!

<img src="/images/tutorial/part-2/ember-data/homepage@2x.png" alt="The homepage works exactly the same as before, but with much less code!" width="1024" height="1130">

<img src="/images/tutorial/part-2/ember-data/detailed@2x.png" alt="The details page works exactly the same as before, but with much less code!" width="1024" height="1382">

EmberData offers many, many features (like managing the _relationships_ between different models) and there's a lot more we can learn about it. For example, if your backend's have some inconsistencies across different endpoints, EmberData allows you to define request specific handlers and builders! We are just scratching the surface here. If you want to learn more about EmberData, check out [its own dedicated section](../../../models/) in the guides!


---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-2/index.md -->

Hooray, you've made it to the second part of the tutorial! In the following sections, we'll build on the core concepts that we learned in the first part of the tutorial.

Along the way, we'll also add some new features to our Super Rentals app. By the end of this section, we'll have implemented some search functionality and refactored a good bit of our code to use some new Ember concepts

<img src="/images/tutorial/part-2/provider-components/filtered-results@2x.png" alt="Search functionality in the Super Rentals app" width="1024" height="833">

In part two, we'll cover the following concepts:

- Dynamic segments
- Ember services
- EmberData
- Adapters and serializers
- The provider component pattern

We're going to cover a lot of ground, so let's get learning!


---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-2/12-provider-components.md -->

In this chapter, we'll work on adding a new search feature, and refactor our `index.hbs` template into a new component along the way. We'll learn about a new pattern for passing data around between components, too! Once we're done, our page will look like this:

<!-- TODO: make this a gif instead -->

<img src="/images/tutorial/part-2/provider-components/filtered-results@2x.png" alt="The Super Rentals app by the end of the chapter" width="1024" height="833">

During this refactor, you will learn about:

- Using forms
- The provider component pattern
- Using block parameters when invoking components
- Yielding data to caller components

## Add input

As our app grows and as we add more features to it, one thing that would be really nice to have is some search functionality. It would be great if our users could just type a word into a search box and our app could just respond with matching and relevant rentals. So how could we go about implementing this feature?

Well, we can start simple. Before we worry about implementing the "search" part of this feature, let's just get something on the page. The first step is to add a form with an `<input>` tag to our `index` page, and make it look pretty with a class.

```handlebars { data-filename="app/templates/index.hbs" data-diff="+8,+9,+10,+11,+12,+13,+14" }
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>

<div class="rentals">
  <form>
    <label>
      <span>Where would you like to stay?</span>
      <input class="light">
    </label>
  </form>

  <ul class="results">
    {{#each @model as |rental|}}
      <li><Rental @rental={{rental}} /></li>
    {{/each}}
  </ul>
</div>
```

Now if we refresh the UI, it has an `<input>` element on the page.

<img src="/images/tutorial/part-2/provider-components/homepage-with-inert-search@2x.png" alt="The homepage with a search box, but it doesn't work yet." width="1024" height="1328">

Awesome, one step done. Now, this input looks great, but it doesn't actually _do_ anything.

## Refactoring the index template into a component

In order to make our search box actually work, we are going to need to retain and store the text that the user types in when they use the search box. This text is the search query, and it is a piece of _[state](../../../components/component-state-and-actions/)_ that is going to change whenever the user types something into the search box.

But where are we going to put this newly-introduced piece of state? In order to wire up the search box, we need a place to store the search query. At the moment, our search box lives on the `index.hbs` route template, which doesn't have a good place to store this search query state. Darn, this would be so much easier to do if we had a component, because we could just store the state directly on the component!

Wait...why don't we just refactor the search box into a component? Once we do that, this will all be a bit easier—hooray!

Let's start simple again and begin our refactor by creating a new template for our component, which we will call `rentals.hbs`.

```handlebars { data-filename="app/components/rentals.hbs" }
<div class="rentals">
  <form>
    <label>
      <span>Where would you like to stay?</span>
      <input class="light">
    </label>
  </form>

  <ul class="results">
    {{#each @rentals as |rental|}}
      <li><Rental @rental={{rental}} /></li>
    {{/each}}
  </ul>
</div>
```

There is one minor change to note here: while extracting our markup into a component, we also renamed the `@model` argument to be `@rentals` instead, just in order to be a little more specific about what we're iterating over in our `{{#each}}` loop. Otherwise, all we're doing here is copy-pasting what was on our `index.hbs` page into our new component template. Now we just need to actually use our new component in the index template where we started this whole refactor! Let's render our `<Rentals>` component in our `index.hbs` template.

```handlebars { data-filename="app/templates/index.hbs" data-diff="-7,-8,-9,-10,-11,-12,-13,-14,-15,-16,-17,-18,-19,-20,+21" }
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>

<div class="rentals">
  <form>
    <label>
      <span>Where would you like to stay?</span>
      <input class="light">
    </label>
  </form>

  <ul class="results">
    {{#each @model as |rental|}}
      <li><Rental @rental={{rental}} /></li>
    {{/each}}
  </ul>
</div>
<Rentals @rentals={{@model}} />
```

Remember the small change we made in the markup when we extracted our `<Rentals>` component? We renamed the `@model` argument to be `@rentals`. Because we made that change in our component, we now need to pass the `@model` argument into the `<Rentals>` component as `@rentals`. Once we do this, everything should be wired up properly so that the `@model` is passed into `<Rentals>` as `@rentals`, just as we expect.

Let's check our UI as well to make sure that we didn't break anything during this refactor...

<img src="/images/tutorial/part-2/provider-components/homepage-with-rentals-component@2x.png" alt="The homepage looks exactly the same as before!" width="1024" height="1328">

Awesome, it looks exactly the same!

Now that we've finished our refactor and tried it out in the UI, let's write a test for it as well.

```js { data-filename="tests/integration/components/rentals-test.js" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rentals', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders all given rental properties by default', async function (assert) {
    this.setProperties({
      rentals: [
        {
          id: 'grand-old-mansion',
          title: 'Grand Old Mansion',
          owner: 'Veruca Salt',
          city: 'San Francisco',
          location: {
            lat: 37.7749,
            lng: -122.4194,
          },
          category: 'Estate',
          type: 'Standalone',
          bedrooms: 15,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
          description:
            'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
        },
        {
          id: 'urban-living',
          title: 'Urban Living',
          owner: 'Mike Teavee',
          city: 'Seattle',
          location: {
            lat: 47.6062,
            lng: -122.3321,
          },
          category: 'Condo',
          type: 'Community',
          bedrooms: 1,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/2/20/Seattle_-_Barnes_and_Bell_Buildings.jpg',
          description:
            'A commuters dream. This rental is within walking distance of 2 bus stops and the Metro.',
        },
        {
          id: 'downtown-charm',
          title: 'Downtown Charm',
          owner: 'Violet Beauregarde',
          city: 'Portland',
          location: {
            lat: 45.5175,
            lng: -122.6801,
          },
          category: 'Apartment',
          type: 'Community',
          bedrooms: 3,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/f/f7/Wheeldon_Apartment_Building_-_Portland_Oregon.jpg',
          description:
            'Convenience is at your doorstep with this charming downtown rental. Great restaurants and active night life are within a few feet.',
        },
      ],
    });

    await render(hbs`<Rentals @rentals={{this.rentals}} />`);

    assert.dom('.rentals').exists();
    assert.dom('.rentals input').exists();

    assert.dom('.rentals .results').exists();
    assert.dom('.rentals .results li').exists({ count: 3 });

    assert
      .dom('.rentals .results li:nth-of-type(1)')
      .containsText('Grand Old Mansion');

    assert
      .dom('.rentals .results li:nth-of-type(2)')
      .containsText('Urban Living');

    assert
      .dom('.rentals .results li:nth-of-type(3)')
      .containsText('Downtown Charm');
  });
});
```

Now, if we try running our tests, they should all pass after making this change.

<img src="/images/tutorial/part-2/provider-components/pass-1@2x.png" alt="The new test is passing." width="1024" height="1024">

## Using a `form`

Now that we have our component all set up, we can finally wire up our search box and store our search query! First things first: let's create a component class to store our query state and handle events from the `form` element:

```js { data-filename="app/components/rentals.js" }
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class Rentals extends Component {
  @tracked query = '';

  @action
  updateQuery(event) {
    let formData = new FormData(event.currentTarget);
    this.query = formData.get('rental-search-term');
  }

  @action
  handleSubmit(event) {
    event.preventDefault();
    this.updateQuery(event);
  }
}
```

Next, we'll wire up our query state in the component template.

```handlebars { data-filename="app/components/rentals.hbs" data-diff="-2,+3,-6,+7,+9" }
<div class="rentals">
  <form>
  <form {{on "input" this.updateQuery}} {{on "submit" this.handleSubmit}}>
    <label>
      <span>Where would you like to stay?</span>
      <input class="light">
      <input name="rental-search-term" class="light">
    </label>
    <p>The results below will update as you type.</p>
  </form>

  <ul class="results">
    {{#each @rentals as |rental|}}
      <li><Rental @rental={{rental}} /></li>
    {{/each}}
  </ul>
</div>
```

[`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) is a built-in JavaScript object for handling forms. It requires the `name` attribute on the `input`. We handle both `submit` and `input` events for the form so that the query updates both when the user types into the input and when they submit the form.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>If you want to see this in action, try adding <code>&#x3C;p>{{this.query}}&#x3C;/p></code> to the component template and watch it update live as you type!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Adding the `<Rentals::Filter>` Provider Component

Now that our search query is wired up to our `<Rentals>` component, we can get into the really fun stuff! Namely, we can make our component _filter_ results based on our search query. In order to encapsulate this functionality, we'll create another component called `<Rentals::Filter>`.

```js { data-filename="app/components/rentals/filter.js" }
import Component from '@glimmer/component';

export default class RentalsFilter extends Component {
  get results() {
    let { rentals, query } = this.args;

    if (query) {
      rentals = rentals.filter((rental) => rental.title.includes(query));
    }

    return rentals;
  }
}
```

```handlebars { data-filename="app/components/rentals/filter.hbs" }
{{yield this.results}}
```

In the `<Rentals::Filter>` component class, we have created a getter to do the work of filtering through our rentals based on two arguments: `@rentals` and `@query`. Inside of our getter function, we have these arguments accessible to us from `this.args`.

In our component template, we are not actually _rendering_ anything. Instead, we're yielding to something, using the `{{yield}}` keyword, a syntax that [we have seen before](../../part-1/component-basics/). As we might recall, the purpose of `{{yield}}` is to render the _block_ that is passed in by the component's _caller_, which is the thing that is invoking the current component (a template or another component, for example). But in this specific case, we don't just have a `{{yield}}` keyword. Instead, we have `this.results` _inside_ of our `{{yield}}` keyword. What is that doing, exactly?

Well, in order to answer this question, let's look at how the data that we're yielding is being used in the `<Rentals>` component.

```handlebars { data-filename="app/components/rentals.hbs" data-diff="-11,-12,-13,+14,+15,+16,+17,+18" }
<div class="rentals">
  <form {{on "input" this.updateQuery}} {{on "submit" this.handleSubmit}}>
    <label>
      <span>Where would you like to stay?</span>
      <input name="rental-search-term" class="light">
    </label>
    <p>The results below will update as you type.</p>
  </form>

  <ul class="results">
    {{#each @rentals as |rental|}}
      <li><Rental @rental={{rental}} /></li>
    {{/each}}
    <Rentals::Filter @rentals={{@rentals}} @query={{this.query}} as |results|>
      {{#each results as |rental|}}
        <li><Rental @rental={{rental}} /></li>
      {{/each}}
    </Rentals::Filter>
  </ul>
</div>
```

Here, we're invoking `<Rentals::Filter>` similar to how we've invoked other components. We're passing in `@rentals` and `@query` as arguments, and we're also passing in a block. The block is the content that is enclosed in between the component's opening and closing tags (`<Rentals::Filter>...</Rentals::Filter>`). We have seen both of these before.

However, the main difference here is the use of `as |results|` when we are invoking our `<Rentals::Filter>` component. Incidentally, this new syntax goes hand-in-hand with the `{{yield this.results}}` syntax we were introduced to in the component template.

The `as |results|` syntax might look a little new to us, but it isn't the first time that we've seen this feature in action. Back when we first learned about the `{{#each}}` syntax, which we use to loop over a collection, we wrote something like this: `{{#each @items as |item|}}...some content here...{{/each}}`.

When we use this syntax, we are passing a block—the `...some content here...` in our example—to `{{#each}}`. Ember will iterate through the array we provided (`@items`) and render our block _once per item_ in the array.

Inside of our block, we need to be able to access the current item _somehow_. The `{{#each}}` syntax provides the item to our block via the `as |item|` declaration, which creates a local variable `item`, also known as a _[block parameter](../../../components/looping-through-lists/)_. In other words, as we iterate through `@items`, we will have access to the current item that we're looping over through the block parameter (`item`) The block parameter is only accessible from within inside of the block. Ember will fill in the block parameter with the current item of the iteration, and it will do this each time that it renders our block.

The need to provide some data to a block is not unique to the `{{#each}}` syntax. In this case, our `<Rentals::Filter>` component wants to take the unfiltered list of rental properties and match them against the user's query. Once the component has matched the rentals against the query, it will need to provide a filtered list of rental properties to its caller (the `<Rentals>` component).

As it turns out, this ability to provide block params is not a superpower that only built-in syntaxes like `{{#each}}` can use. We can do this with our own components as well. In fact, Ember allows us to pass arbitrary data to blocks in the form of passing in additional arguments to the `{{yield}}` keyword. Indeed, this is exactly what we did with `{{yield this.results}}` in the `<Rentals::Filter>` component.

In our `<Rentals>` component, we used the `as |results|` syntax when invoking `<Rentals::Filter>`. Just like with the `{{#each}}` syntax, this block parameter syntax allowed our block to access the yielded data using the local variable `results`. The yielded data came from `{{yield this.results}}`, where `this.results` is our filtered list of rental properties.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>The local variable name <code>results</code> is arbitrary, and isn't special in any way! You could name it anything: <code>as |data|</code>, <code>as |filtered|</code>, or even <code>as |banana|</code>! In fact, the <code>... as |banana|</code> syntax is the same as declaring a local variable in JavaScript.
Just as we can create a variable like <code>let banana = ...</code>, and then have access to that variable whenever we call <code>banana</code>, we can also have access to the yielded item by using whatever variable name we gave to our block parameter. The important thing here is that however you name the block param is how you will have access to the yielded data from inside the block.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Interestingly, if we take a look at our `<Rentals::Filter>` component template, we see that we don't actually render any content. Instead, this component's only responsibility is to set up some piece of state (`this.results`, the list of filtered rental properties), and then yield that state back up to its caller (`<Rentals>`) in the form of a block parameter (`as |results|`).

This is called the _provider component pattern_, which we see in action with one component providing data up to its caller.

Okay, now that we have a better sense of which component is rendering what and the theory behind why all of this is happening, let's answer the big unanswered question: does this even work? If we try out our search box in the UI, what happens?

<img src="/images/tutorial/part-2/provider-components/filtered-results@2x.png" alt="Trying out the search box." width="1024" height="833">

Hooray, it works! Awesome. Now that we've tried this out manually in the UI, let's write a test for this new behavior as well.

```js { data-filename="tests/integration/components/rentals-test.js" data-diff="-3,+4,-10,+11,+67,+69,+90,+91,+92,+93,+94,+95,+96,+97,+98,+99,+100,+101,+102,+103,+104,+105,+106,+107,+108" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { render, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rentals', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders all given rental properties by default', async function (assert) {
  hooks.beforeEach(function () {
    this.setProperties({
      rentals: [
        {
          id: 'grand-old-mansion',
          title: 'Grand Old Mansion',
          owner: 'Veruca Salt',
          city: 'San Francisco',
          location: {
            lat: 37.7749,
            lng: -122.4194,
          },
          category: 'Estate',
          type: 'Standalone',
          bedrooms: 15,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
          description:
            'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
        },
        {
          id: 'urban-living',
          title: 'Urban Living',
          owner: 'Mike Teavee',
          city: 'Seattle',
          location: {
            lat: 47.6062,
            lng: -122.3321,
          },
          category: 'Condo',
          type: 'Community',
          bedrooms: 1,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/2/20/Seattle_-_Barnes_and_Bell_Buildings.jpg',
          description:
            'A commuters dream. This rental is within walking distance of 2 bus stops and the Metro.',
        },
        {
          id: 'downtown-charm',
          title: 'Downtown Charm',
          owner: 'Violet Beauregarde',
          city: 'Portland',
          location: {
            lat: 45.5175,
            lng: -122.6801,
          },
          category: 'Apartment',
          type: 'Community',
          bedrooms: 3,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/f/f7/Wheeldon_Apartment_Building_-_Portland_Oregon.jpg',
          description:
            'Convenience is at your doorstep with this charming downtown rental. Great restaurants and active night life are within a few feet.',
        },
      ],
    });
  });

  test('it renders all given rental properties by default', async function (assert) {
    await render(hbs`<Rentals @rentals={{this.rentals}} />`);

    assert.dom('.rentals').exists();
    assert.dom('.rentals input').exists();

    assert.dom('.rentals .results').exists();
    assert.dom('.rentals .results li').exists({ count: 3 });

    assert
      .dom('.rentals .results li:nth-of-type(1)')
      .containsText('Grand Old Mansion');

    assert
      .dom('.rentals .results li:nth-of-type(2)')
      .containsText('Urban Living');

    assert
      .dom('.rentals .results li:nth-of-type(3)')
      .containsText('Downtown Charm');
  });

  test('it updates the results according to the search query', async function (assert) {
    await render(hbs`<Rentals @rentals={{this.rentals}} />`);

    assert.dom('.rentals').exists();
    assert.dom('.rentals input').exists();

    await fillIn('.rentals input', 'Downtown');

    assert.dom('.rentals .results').exists();
    assert.dom('.rentals .results li').exists({ count: 1 });
    assert.dom('.rentals .results li').containsText('Downtown Charm');

    await fillIn('.rentals input', 'Mansion');

    assert.dom('.rentals .results').exists();
    assert.dom('.rentals .results li').exists({ count: 1 });
    assert.dom('.rentals .results li').containsText('Grand Old Mansion');
  });
});
```

Great! In the process of adding this test, we'll notice that we also extracted our setup (`setProperties`) into the before hooks. We also used the `fillIn` test helper in our newly-added test.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>This search functionality is not perfect. Ideally, it would also be case-insensitive, and also allow you to search by city, category, type, or description. If you're looking for a challenge, see if you can improve on our search!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

<img src="/images/tutorial/part-2/provider-components/pass-2@2x.png" alt="The new test is passing." width="1024" height="1024">


---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-2/recap.md -->

Congratulations, you finished the second part of the tutorial!

There was a lot of concepts to cover in part two. To recap, here is what you learned:

<h3><a href="../route-params/">Chapter 9</a></h3>

- Routes with dynamic segments
- Links with dynamic segments
- Component tests with access to the router
- Accessing parameters from dynamic segments
- Sharing common setup code between tests

<h3><a href="../service-injection/">Chapter 10</a></h3>

- Splattributes and the `class` attribute
- The router service
- Ember services vs. global variables
- Mocking services in tests

<h3><a href="../ember-data/">Chapter 11</a></h3>

- EmberData models
- Testing models
- Loading models in routes
- The EmberData store
- Working with adapters and serializers

<h3><a href="../provider-components/">Chapter 12</a></h3>

- Using Ember's built-in `<Input>` component
- The provider component pattern
- Using block parameters when invoking components
- Yielding data to caller components

Awesome! The concepts you learned about in part 2 of the tutorial are ones that you'll find in many production-level Ember apps. You've now taken your knowledge to the next level—and you've also finished the entire tutorial, hooray!

If you're curious to learn more, you can check out the rest of the guides and learn more about the concepts we've covered in even more depth! If you want to practice some of the ideas we've covered, you can also try building your own Ember app.

Happy coding!


---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-2/09-route-params.md -->

Now that we are fetching real data from our "server", let's add a new feature — dedicated pages for each of our rentals:

<img src="/images/tutorial/part-2/route-params/grand-old-mansion@2x.png" alt="The Super Rentals app (rentals page) by the end of the chapter" width="1024" height="1382">

While adding these rental pages, you will learn about:

- Routes with dynamic segments
- Links with dynamic segments
- Component tests with access to the router
- Accessing parameters from dynamic segments
- Sharing common setup code between tests

## Routes with Dynamic Segments

It would be great for our individual rental pages to be available through predictable URLs like `/rentals/grand-old-mansion`. Also, since these pages are dedicated to individual rentals, we can show more detailed information about each property on this page. It would also be nice to be able to have a way to bookmark a rental property, and share direct links to each individual rental listing so that our users can come back to these pages later on, after they are done browsing.

But first things first: we need to add a route for this new page. We can do that by adding a `rental` route to the router.

```js { data-filename="app/router.js" data-diff="+12" }
import EmberRouter from '@ember/routing/router';
import config from 'super-rentals/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('about');
  this.route('contact', { path: '/getting-in-touch' });
  this.route('rental', { path: '/rentals/:rental_id' });
});
```

Notice that we are doing something a little different here. Instead of using the default path (`/rental`), we're specifying a custom path. Not only are we using a custom path, but we're also passing in a `:rental_id`, which is what we call a _[dynamic segment](../../../routing/defining-your-routes/#toc_dynamic-segments)_. When these routes are evaluated, the `rental_id` will be substituted with the `id` of the individual rental property that we are trying to navigate to.

## Links with Dynamic Segments

Now that we have this route in place, we can update our `<Rental>` component to actually _link_ to each of our detailed rental properties!

```handlebars { data-filename="app/components/rental.hbs" data-diff="-7,+8,+9,+10,+11,+12" }
<article class="rental">
  <Rental::Image
    src={{@rental.image}}
    alt="A picture of {{@rental.title}}"
  />
  <div class="details">
    <h3>{{@rental.title}}</h3>
    <h3>
      <LinkTo @route="rental" @model={{@rental}}>
        {{@rental.title}}
      </LinkTo>
    </h3>
    <div class="detail owner">
      <span>Owner:</span> {{@rental.owner}}
    </div>
    <div class="detail type">
      <span>Type:</span> {{@rental.type}}
    </div>
    <div class="detail location">
      <span>Location:</span> {{@rental.city}}
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span> {{@rental.bedrooms}}
    </div>
  </div>
  <Map
    @lat={{@rental.location.lat}}
    @lng={{@rental.location.lng}}
    @zoom="9"
    @width="150"
    @height="150"
    alt="A map of {{@rental.title}}"
  />
</article>
```

Since we know that we're linking to the `rental` route that we just created, we also know that this route requires a dynamic segment. Thus, we need to pass in a `@model` argument so that the `<LinkTo>` component can generate the appropriate URL for that model.

Let's see this in action. If we go back to our browser and refresh the page, we should see our links, but something isn't quite right yet!

<img src="/images/tutorial/part-2/route-params/broken-links@2x.png" alt="Broken links" width="1024" height="1130">

The links are all pointing to `/rentals/undefined`. Yikes! This is because `<LinkTo>` tries to use the `id` property from our model in order to replace the dynamic segment and generate the URL.

So what's the problem here? Well, our model doesn't actually have an `id` property! So _of course_ the `<LinkTo>` component isn't going to be able to find it and use it to generate the URL. Oops!

Thankfully, we can fix this pretty easily. As it turns out, the data that is returned by our server—the JSON data that lives in our `public/api` folder—actually does have an `id` attribute on it. We can double check this by going to `http://localhost:4200/api/rentals.json`.

<img src="/images/tutorial/part-2/route-params/data@2x.png" alt="Our data do have an id attribute" width="1024" height="512">

If we look at the JSON data here, we can see that the `id` is included right alongside the `attributes` key. So we have access to this data; the only trouble is that we're not including it in our model! Let's change our model hook in the `index` route so that it includes the `id`.

```js { data-filename="app/routes/index.js" data-diff="-11,+12,-21,+22" }
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];

export default class IndexRoute extends Route {
  async model() {
    let response = await fetch('/api/rentals.json');
    let { data } = await response.json();

    return data.map((model) => {
      let { attributes } = model;
      let { id, attributes } = model;
      let type;

      if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
        type = 'Community';
      } else {
        type = 'Standalone';
      }

      return { type, ...attributes };
      return { id, type, ...attributes };
    });
  }
}
```

Now that we've included our model's `id`, we should see the correct URLs to each rental property on our index page after refreshing the page.

## Component Tests with Access to the Router

Alright, we have just one more step left here: updating the tests. We can add an `id` to the rental that we defined in our test using `setProperties` and add an assertion for the expected URL, too.

```js { data-filename="tests/integration/components/rental-test.js" data-diff="+12,+34,+35,+36" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders information about a rental property', async function (assert) {
    this.setProperties({
      rental: {
        id: 'grand-old-mansion',
        title: 'Grand Old Mansion',
        owner: 'Veruca Salt',
        city: 'San Francisco',
        location: {
          lat: 37.7749,
          lng: -122.4194,
        },
        category: 'Estate',
        type: 'Standalone',
        bedrooms: 15,
        image:
          'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
        description:
          'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
      },
    });

    await render(hbs`<Rental @rental={{this.rental}} />`);

    assert.dom('article').hasClass('rental');
    assert.dom('article h3').hasText('Grand Old Mansion');
    assert
      .dom('article h3 a')
      .hasAttribute('href', '/rentals/grand-old-mansion');
    assert.dom('article .detail.owner').includesText('Veruca Salt');
    assert.dom('article .detail.type').includesText('Standalone');
    assert.dom('article .detail.location').includesText('San Francisco');
    assert.dom('article .detail.bedrooms').includesText('15');
    assert.dom('article .image').exists();
    assert.dom('article .map').exists();
  });
});
```

If we run the tests in the browser, everything should just pass!

<img src="/images/tutorial/part-2/route-params/pass@2x.png" alt="Tests are passing" width="1024" height="768">

## Accessing Parameters from Dynamic Segments

Awesome! We're making such great progress.

Now that we have our `rental` route, let's finish up our `rental` page. The first step to doing this is making our route actually _do_ something. We added the route, but we haven't actually implemented it. So let's do that first by creating the route file.

```js { data-filename="app/routes/rental.js" }
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];

export default class RentalRoute extends Route {
  async model(params) {
    let response = await fetch(`/api/rentals/${params.rental_id}.json`);
    let { data } = await response.json();

    let { id, attributes } = data;
    let type;

    if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
      type = 'Community';
    } else {
      type = 'Standalone';
    }

    return { id, type, ...attributes };
  }
}
```

We'll notice that the model hook in our `RentalRoute` is _almost_ the same as our `IndexRoute`. There is one major difference between these two routes, and we can see that difference reflected here.

Unlike the `IndexRoute`, we have a `params` object being passed into our model hook. This is because we need to fetch our data from the `/api/rentals/${id}.json` endpoint, _not_ the `/api/rentals.json` endpoint we were previously using. We already know that the individual rental endpoints fetch a single rental object, rather than an array of them, and that the route uses a `/:rental_id` dynamic segment to figure out which rental object we're trying to fetch from the server.

But how does the dynamic segment actually get to the `fetch` function? Well, we have to pass it into the function. Conveniently, we have access to the value of the `/:rental_id` dynamic segment through the `params` object. This is why we have a `params` argument in our model hook here. It is being passed through to this hook, and we use the `params.rental_id` attribute to figure out what data we want to `fetch`.

Other than these minor differences though, the rest of the route is pretty much the same to what we had in our index route.

## Displaying Model Details with a Component

Next, let's make a `<Rental::Detailed>` component.

```shell
$ ember generate component rental/detailed
installing component
  create app/components/rental/detailed.hbs
  skip app/components/rental/detailed.ts
  tip to add a class, run `ember generate component-class rental/detailed`
installing component-test
  create tests/integration/components/rental/detailed-test.js

Running "lint:fix" script...
```

```handlebars { data-filename="app/components/rental/detailed.hbs" data-diff="-1,+2,+3,+4,+5,+6,+7,+8,+9,+10,+11,+12,+13,+14,+15,+16,+17,+18,+19,+20,+21,+22,+23,+24,+25,+26,+27,+28,+29,+30,+31,+32,+33,+34,+35,+36,+37,+38,+39,+40,+41,+42,+43,+44,+45" }
{{yield}}
<Jumbo>
  <h2>{{@rental.title}}</h2>
  <p>Nice find! This looks like a nice place to stay near {{@rental.city}}.</p>
  <a href="#" target="_blank" rel="external nofollow noopener noreferrer" class="share button">
    Share on Twitter
  </a>
</Jumbo>

<article class="rental detailed">
  <Rental::Image
    src={{@rental.image}}
    alt="A picture of {{@rental.title}}"
  />

  <div class="details">
    <h3>About {{@rental.title}}</h3>

    <div class="detail owner">
      <span>Owner:</span> {{@rental.owner}}
    </div>
    <div class="detail type">
      <span>Type:</span> {{@rental.type}} – {{@rental.category}}
    </div>
    <div class="detail location">
      <span>Location:</span> {{@rental.city}}
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span> {{@rental.bedrooms}}
    </div>
    <div class="detail description">
      <p>{{@rental.description}}</p>
    </div>
  </div>

  <Map
    @lat={{@rental.location.lat}}
    @lng={{@rental.location.lng}}
    @zoom="12"
    @width="894"
    @height="600"
    alt="A map of {{@rental.title}}"
    class="large"
  />
</article>
```

This component is similar to our `<Rental>` component, except for the following differences.

- It shows a banner with a share button at the top (Implementation to come later).
- It shows a bigger image by default, with some additional detailed information.
- It shows a bigger map.
- It shows a description.

## Sharing Common Setup Code Between Tests

Now that we have this template in place, we can add some tests for this new component of ours.

```handlebars { data-filename="tests/integration/components/rental/detailed-test.js" data-diff="-9,-10,-11,+12,+13,+14,+15,+16,+17,+18,+19,+20,+21,+22,+23,+24,+25,+26,+27,+28,+29,+30,+31,+32,-34,+35,+36,-38,+39,+40,+41,+42,+43,+44,+45,-47,-48,-49,-50,-51,-52,+53,+54,-56,+57,+58,+59,+60,+61,+62,+63,+64" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental/detailed', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
  hooks.beforeEach(function () {
    this.setProperties({
      rental: {
        id: 'grand-old-mansion',
        title: 'Grand Old Mansion',
        owner: 'Veruca Salt',
        city: 'San Francisco',
        location: {
          lat: 37.7749,
          lng: -122.4194,
        },
        category: 'Estate',
        type: 'Standalone',
        bedrooms: 15,
        image:
          'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
        description:
          'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
      },
    });
  });

    await render(hbs`<Rental::Detailed />`);
  test('it renders a header with a share button', async function (assert) {
    await render(hbs`<Rental::Detailed @rental={{this.rental}} />`);

    assert.dom().hasText('');
    assert.dom('.jumbo').exists();
    assert.dom('.jumbo h2').containsText('Grand Old Mansion');
    assert
      .dom('.jumbo p')
      .containsText('a nice place to stay near San Francisco');
    assert.dom('.jumbo a.button').containsText('Share on Twitter');
  });

    // Template block usage:
    await render(hbs`
      <Rental::Detailed>
        template block text
      </Rental::Detailed>
    `);
  test('it renders detailed information about a rental property', async function (assert) {
    await render(hbs`<Rental::Detailed @rental={{this.rental}} />`);

    assert.dom().hasText('template block text');
    assert.dom('article').hasClass('rental');
    assert.dom('article h3').containsText('About Grand Old Mansion');
    assert.dom('article .detail.owner').containsText('Veruca Salt');
    assert.dom('article .detail.type').containsText('Standalone – Estate');
    assert.dom('article .detail.location').containsText('San Francisco');
    assert.dom('article .detail.bedrooms').containsText('15');
    assert.dom('article .image').exists();
    assert.dom('article .map').exists();
  });
});
```

We can use the `beforeEach` hook to share some boilerplate code, which allows us to have two tests that each focus on a different, single aspect of the component. This feels similar to other tests that we've already written—hopefully it feels easy, too!

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>As its name implies, the <code>beforeEach</code> hook runs <em>once</em> before each <code>test</code> function is executed. This hook is the ideal place to set up anything that might be needed by all test cases in the file. On the other hand, if you need to do any cleanup after your tests, there is an <code>afterEach</code> hook!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

<img src="/images/tutorial/part-2/route-params/pass-2@2x.png" alt="Tests are passing as expected" width="1024" height="768">

## Adding a Route Template

Finally, let's add a `rental` template to actually _invoke_ our `<Rental::Detailed>` component, as well as adding an acceptance test for this new behavior in our app.

```handlebars { data-filename="app/templates/rental.hbs" }
<Rental::Detailed @rental={{@model}} />
```

```js { data-filename="tests/acceptance/super-rentals-test.js" data-diff="+22,+23,+24,+25,+26,+27,+28,+29,+30,+31,+32,+33,+34,+35,+36,+37,+38,+39" }
import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'super-rentals/tests/helpers';

module('Acceptance | super rentals', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('Welcome to Super Rentals!');

    assert.dom('.jumbo a.button').hasText('About Us');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });

  test('viewing the details of a rental property', async function (assert) {
    await visit('/');
    assert.dom('.rental').exists({ count: 3 });

    await click('.rental:first-of-type a');
    assert.strictEqual(currentURL(), '/rentals/grand-old-mansion');
  });

  test('visiting /rentals/grand-old-mansion', async function (assert) {
    await visit('/rentals/grand-old-mansion');

    assert.strictEqual(currentURL(), '/rentals/grand-old-mansion');
    assert.dom('nav').exists();
    assert.dom('h1').containsText('SuperRentals');
    assert.dom('h2').containsText('Grand Old Mansion');
    assert.dom('.rental.detailed').exists();
  });

  test('visiting /about', async function (assert) {
    await visit('/about');

    assert.strictEqual(currentURL(), '/about');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('About Super Rentals');

    assert.dom('.jumbo a.button').hasText('Contact Us');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/getting-in-touch');
  });

  test('visiting /getting-in-touch', async function (assert) {
    await visit('/getting-in-touch');

    assert.strictEqual(currentURL(), '/getting-in-touch');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('Contact Us');

    assert.dom('.jumbo a.button').hasText('About');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });

  test('navigating using the nav-bar', async function (assert) {
    await visit('/');

    assert.dom('nav').exists();
    assert.dom('nav a.menu-index').hasText('SuperRentals');
    assert.dom('nav a.menu-about').hasText('About');
    assert.dom('nav a.menu-contact').hasText('Contact');

    await click('nav a.menu-about');
    assert.strictEqual(currentURL(), '/about');

    await click('nav a.menu-contact');
    assert.strictEqual(currentURL(), '/getting-in-touch');

    await click('nav a.menu-index');
    assert.strictEqual(currentURL(), '/');
  });
});
```

Now, when we visit `http://localhost:4200/rentals/grand-old-mansion`, this is what we see:

<img src="/images/tutorial/part-2/route-params/grand-old-mansion@2x.png" alt="A dedicated page for the Grand Old Mansion" width="1024" height="1382">

And if we run our tests now...

<img src="/images/tutorial/part-2/route-params/pass-3@2x.png" alt="All tests passing!" width="1024" height="768">

...they all pass! Great work!

This page _looks_ done, but we have a share button that doesn't actually work. We'll address this in the next chapter.


---

<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-2/10-service-injection.md -->

As promised, we will now work on implementing the share button!

<!-- TODO: make this a gif instead -->

<img src="/images/tutorial/part-2/service-injection/share-button@2x.png" alt="The working share button by the end of the chapter" width="1024" height="1382">

While adding the share button, you will learn about:

- Splattributes and the `class` attribute
- The router service
- Ember services vs. global variables
- Mocking services in tests

## Scoping the Feature

In order to be able to share on Twitter, we'll need to make use of the Twitter [Web Intent API](https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent.html).

Conveniently, this API doesn't require us to procure any API keys; all we need to do is link to `https://twitter.com/intent/tweet`. This link will prompt the user to compose a new tweet. The API also supports us pre-populating the tweet with some text, hashtag suggestions, or even a link, all through the use of special query params.

For instance, let's say we would like to suggest a tweet with the following content:

```plain
Check out Grand Old Mansion on Super Rentals! https://super-rentals.example/rentals/grand-old-mansion
#vacation #travel #authentic #blessed #superrentals via @emberjs
```

We could open a new page to the <a href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fsuper-rentals.example%2Frentals%2Fgrand-old-mansion&text=Check+out+Grand+Old+Mansion+on+Super+Rentals%21&hashtags=vacation%2Ctravel%2Cauthentic%2Cblessed%2Csuperrentals&via=emberjs" target="_blank" rel="external nofollow noopener noreferrer">following URL</a>:

```plain
https://twitter.com/intent/tweet?
  url=https%3A%2F%2Fsuper-rentals.example%2Frentals%2Fgrand-old-mansion&
  text=Check+out+Grand+Old+Mansion+on+Super+Rentals%21&
  hashtags=vacation%2Ctravel%2Cauthentic%2Cblessed%2Csuperrentals&
  via=emberjs
```

Of course, the user will still have the ability to edit the tweet, or they can decide to just not tweet it at all.

For our app, it probably makes the most sense for our share button to automatically share the current page's URL.

## Splattributes and the `class` Attribute

Now that we have a better understanding of the scope of this feature, let's get to work and generate a `share-button` component.

```shell
$ ember generate component share-button --with-component-class
installing component
  create app/components/share-button.js
  create app/components/share-button.hbs
installing component-test
  create tests/integration/components/share-button-test.js

Running "lint:fix" script...
```

Let's start with the template that was generated for this component. We already have some markup for the share button in the `<Rental::Detailed>` component we made earlier, so let's just copy that over into our new `<ShareButton>` component.

```handlebars { data-filename="app/components/share-button.hbs" data-diff="-1,+2,+3,+4,+5,+6,+7,+8,+9,+10" }
{{yield}}
<a
  ...attributes
  href={{this.shareURL}}
  target="_blank"
  rel="external nofollow noopener noreferrer"
  class="share button"
>
  {{yield}}
</a>
```

Notice that we added `...attributes` to our `<a>` tag here. As [we learned earlier](../../part-1/reusable-components/) when working on our `<Map>` component, the order of `...attributes` relative to other attributes is significant. We don't want to allow `href`, `target`, or `rel` to be overridden by the invoker, so we specified those attributes after `...attributes`.

But what happens to the `class` attribute? Well, as it turns out, the `class` attribute is the one exception to how these component attributes are overridden! While all other HTML attributes follow the "last-write wins" rule, the values for the `class` attribute are merged together (concatenated) instead. There is a good reason for this: it allows the component to specify whatever classes that _it_ needs, while allowing the invokers of the component to freely add any extra classes that _they_ need for styling purposes.

We also have a `{{yield}}` inside of our `<a>` tag so that we can customize the text for the link later when invoking the `<ShareButton>` component.

## Accessing the Current Page URL

Whew! Let's look at the JavaScript class next.

```js { data-filename="app/components/share-button.js" data-diff="-3,+4,+5,+6,+7,+8,+9,+10,+11,+12,+13,+14,+15,+16,+17,+18,+19,+20,+21,+22,+23,+24,+25,+26,+27,+28,+29,+30" }
import Component from '@glimmer/component';

export default class ShareButton extends Component {}
const TWEET_INTENT = 'https://twitter.com/intent/tweet';

export default class ShareButton extends Component {
  get currentURL() {
    return window.location.href;
  }

  get shareURL() {
    let url = new URL(TWEET_INTENT);

    url.searchParams.set('url', this.currentURL);

    if (this.args.text) {
      url.searchParams.set('text', this.args.text);
    }

    if (this.args.hashtags) {
      url.searchParams.set('hashtags', this.args.hashtags);
    }

    if (this.args.via) {
      url.searchParams.set('via', this.args.via);
    }

    return url;
  }
}
```

The key functionality of this class is to build the appropriate URL for the Twitter Web Intent API, which is exposed to the template via the `this.shareURL` getter. It mainly involves "gluing together" the component's arguments and setting the appropriate query params on the resulting URL. Conveniently, the browser provides a handy [`URL` class](https://javascript.info/url) that handles escaping and joining of query params for us.

The other notable functionality of this class has to do with getting the current page's URL and automatically adding it to the Twitter Intent URL. To accomplish this, we defined a `currentURL` getter that simply used the browser's global [`Location` object](https://developer.mozilla.org/en-US/docs/Web/API/Window/location), which we could access at `window.location`. Among other things, it has a `href` property (`window.location.href`) that reports the current page's URL.

Let's put this component to use by invoking it from the `<Rental::Detailed>` component!

```handlebars { data-filename="app/components/rental/detailed.hbs" data-diff="-4,+5,+6,+7,+8,+9,-11,+12" }
<Jumbo>
  <h2>{{@rental.title}}</h2>
  <p>Nice find! This looks like a nice place to stay near {{@rental.city}}.</p>
  <a href="#" target="_blank" rel="external nofollow noopener noreferrer" class="share button">
  <ShareButton
    @text="Check out {{@rental.title}} on Super Rentals!"
    @hashtags="vacation,travel,authentic,blessed,superrentals"
    @via="emberjs"
  >
    Share on Twitter
  </a>
  </ShareButton>
</Jumbo>

<article class="rental detailed">
  <Rental::Image
    src={{@rental.image}}
    alt="A picture of {{@rental.title}}"
  />

  <div class="details">
    <h3>About {{@rental.title}}</h3>

    <div class="detail owner">
      <span>Owner:</span> {{@rental.owner}}
    </div>
    <div class="detail type">
      <span>Type:</span> {{@rental.type}} – {{@rental.category}}
    </div>
    <div class="detail location">
      <span>Location:</span> {{@rental.city}}
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span> {{@rental.bedrooms}}
    </div>
    <div class="detail description">
      <p>{{@rental.description}}</p>
    </div>
  </div>

  <Map
    @lat={{@rental.location.lat}}
    @lng={{@rental.location.lng}}
    @zoom="12"
    @width="894"
    @height="600"
    alt="A map of {{@rental.title}}"
    class="large"
  />
</article>
```

With that, we should have a working share button!

<img src="/images/tutorial/part-2/service-injection/share-button@2x.png" alt="A share button that works!" width="1024" height="1382">

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>Feel free to try sending the tweet! However, keep in mind that your followers cannot access your local server at <code>http://localhost:4200/</code>.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Why We Can't Test `window.location.href`

To be sure, let's add some tests! Let's start with an acceptance test:

```js { data-filename="tests/acceptance/super-rentals-test.js" data-diff="-2,+3,+39,+40,+41,+42,+43,+44,+45,+46,+47,+48,+49" }
import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { click, find, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'super-rentals/tests/helpers';

module('Acceptance | super rentals', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('Welcome to Super Rentals!');

    assert.dom('.jumbo a.button').hasText('About Us');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });

  test('viewing the details of a rental property', async function (assert) {
    await visit('/');
    assert.dom('.rental').exists({ count: 3 });

    await click('.rental:first-of-type a');
    assert.strictEqual(currentURL(), '/rentals/grand-old-mansion');
  });

  test('visiting /rentals/grand-old-mansion', async function (assert) {
    await visit('/rentals/grand-old-mansion');

    assert.strictEqual(currentURL(), '/rentals/grand-old-mansion');
    assert.dom('nav').exists();
    assert.dom('h1').containsText('SuperRentals');
    assert.dom('h2').containsText('Grand Old Mansion');
    assert.dom('.rental.detailed').exists();
    assert.dom('.share.button').hasText('Share on Twitter');

    let button = find('.share.button');

    let tweetURL = new URL(button.href);
    assert.strictEqual(tweetURL.host, 'twitter.com');

    assert.strictEqual(
      tweetURL.searchParams.get('url'),
      `${window.location.origin}/rentals/grand-old-mansion`,
    );
  });

  test('visiting /about', async function (assert) {
    await visit('/about');

    assert.strictEqual(currentURL(), '/about');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('About Super Rentals');

    assert.dom('.jumbo a.button').hasText('Contact Us');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/getting-in-touch');
  });

  test('visiting /getting-in-touch', async function (assert) {
    await visit('/getting-in-touch');

    assert.strictEqual(currentURL(), '/getting-in-touch');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('Contact Us');

    assert.dom('.jumbo a.button').hasText('About');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });

  test('navigating using the nav-bar', async function (assert) {
    await visit('/');

    assert.dom('nav').exists();
    assert.dom('nav a.menu-index').hasText('SuperRentals');
    assert.dom('nav a.menu-about').hasText('About');
    assert.dom('nav a.menu-contact').hasText('Contact');

    await click('nav a.menu-about');
    assert.strictEqual(currentURL(), '/about');

    await click('nav a.menu-contact');
    assert.strictEqual(currentURL(), '/getting-in-touch');

    await click('nav a.menu-index');
    assert.strictEqual(currentURL(), '/');
  });
});
```

The main thing we want to confirm here, from an acceptance test level, is that 1) there is a share button on the page, and 2) it correctly captures the current page's URL. Ideally, we would simulate clicking on the button to confirm that it actually works. However, that would navigate us away from the test page and stop the test!

Therefore, the best we could do is to look at the `href` attribute of the link, and check that it has roughly the things we expect in there. To do that, we used the `find` test helper to find the element, and used the browser's `URL` API to parse its `href` attribute into an object that is easier to work with.

The `href` attribute contains the Twitter Intent URL, which we confirmed by checking that the `host` portion of the URL matches `twitter.com`. We could be _more_ specific, such as checking that it matches `https://twitter.com/intent/tweet` exactly. However, if we include too many specific details in our acceptance test, it may fail unexpectedly in the future as the `<ShareButton>` component's implementation evolves, resulting in a _brittle_ test that needs to be constantly updated. Those details are better tested in isolation with component tests, which we will add later.

The main event here is that we wanted to confirm the Twitter Intent URL includes a link to our current page's URL. We checked that by comparing its `url` query param to the expected URL, using `window.location.origin` to get the current protocol, hostname and port, which should be `http://localhost:4200`.

If we run the tests in the browser, everything should...

<img src="/images/tutorial/part-2/service-injection/fail@2x.png" alt="The test failed" width="1024" height="768">

...wait a minute, our tests didn't work...again!

Looking at the failure closely, the problem seems to be that the component had captured `http://localhost:4200/tests` as the "current page's URL". The issue here is that the `<ShareButton>` component uses `window.location.href` to capture the current URL. Because we are running our tests at `http://localhost:4200/tests`, that's what we got. _Technically_ it's not wrong, but this is certainly not what we meant. Gotta love computers!

This brings up an interesting question – why does the `currentURL()` test helper not have the same problem? In our test, we have been writing assertions like `assert.strictEqual(currentURL(), '/about');`, and those assertions did not fail.

It turns out that this is something Ember's router handled for us. In an Ember app, the router is responsible for handling navigation and maintaining the URL. For example, when you click on a `<LinkTo>` component, it will ask the router to execute a _[route transition](../../../routing/preventing-and-retrying-transitions/)_. Normally, the router is set up to update the browser's address bar whenever it transitions into a new route. That way, your users will be able to use the browser's back button and bookmark functionality just like any other webpage.

However, during tests, the router is configured to maintain the "logical" URL internally, without updating the browser's address bar and history entries. This way, the router won't confuse the browser and its back button with hundreds of history entries as you run through your tests. The `currentURL()` taps into this piece of internal state in the router, instead of checking directly against the actual URL in the address bar using `window.location.href`.

## The Router Service

To fix our problem, we would need to do the same. Ember exposes this internal state through the _[router service](https://api.emberjs.com/ember/release/classes/RouterService)_, which we can _[inject](../../../services/#toc_accessing-services)_ into our component:

```js { data-filename="app/components/share-button.js" data-diff="+1,+7,+8,-10,+11" }
import { service } from '@ember/service';
import Component from '@glimmer/component';

const TWEET_INTENT = 'https://twitter.com/intent/tweet';

export default class ShareButton extends Component {
  @service router;

  get currentURL() {
    return window.location.href;
    return new URL(this.router.currentURL, window.location.origin);
  }

  get shareURL() {
    let url = new URL(TWEET_INTENT);

    url.searchParams.set('url', this.currentURL);

    if (this.args.text) {
      url.searchParams.set('text', this.args.text);
    }

    if (this.args.hashtags) {
      url.searchParams.set('hashtags', this.args.hashtags);
    }

    if (this.args.via) {
      url.searchParams.set('via', this.args.via);
    }

    return url;
  }
}
```

Here, we added the `@service router;` declaration to our component class. This injects the router service into the component, making it available to us as `this.router`. The router service has a `currentURL` property, providing the current "logical" URL as seen by Ember's router. Similar to the test helper with the same name, this is a relative URL, so we would have to join it with `window.location.origin` to get an absolute URL that we can share.

With this change, everything is now working the way we intended.

<img src="/images/tutorial/part-2/service-injection/pass-1@2x.png" alt="The previously failing test is now green" width="1024" height="960">

## Ember Services vs. Global Variables

In Ember, services serve a similar role to global variables, in that they can be easily accessed by any part of your app. For example, we can inject any available service into components, as opposed to having them passed in as an argument. This allows deeply nested components to "skip through" the layers and access things that are logically global to the entire app, such as routing, authentication, user sessions, user preferences, etc. Without services, every component would have to pass through a lot of the same arguments into every component it invokes.

A major difference between services and global variables is that services are scoped to your app, instead of all the JavaScript code that is running on the same page. This allows you to have multiple scripts running on the same page without interfering with each other.

More importantly, services are designed to be easily _swappable_. In our component class, all we did was request that Ember inject the service named `router`, without specifying where that service comes from. This allows us to _replace_ Ember's router service with a different object at runtime.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>By default, Ember infers the name of an injected service from the name of the property. If you would like the router service to be available at, say, <code>this.emberRouter</code>, you can specify <code>@service('router') emberRouter;</code> instead. <code>@service router;</code> is simply a shorthand for <code>@service('router') router;</code>.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Mocking Services in Tests

We will take advantage of this capability in our component test:

```js { data-filename="tests/integration/components/share-button-test.js" data-diff="+3,-7,-8,+9,+10,+11,+12,-14,-15,-16,+17,+18,+19,+20,+21,-23,+24,+25,-27,+28,+29,+30,-32,-33,-34,-35,-36,-37,+38,+39,-41,+42,+43,+44,+45,+46,+47,+48,+49,+50,+51,+52" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | share-button', function (hooks) {
  setupRenderingTest(hooks);
const MOCK_URL = new URL(
  '/foo/bar?baz=true#some-section',
  window.location.origin,
);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
class MockRouterService extends Service {
  get currentURL() {
    return '/foo/bar?baz=true#some-section';
  }
}

    await render(hbs`<ShareButton />`);
module('Integration | Component | share-button', function (hooks) {
  setupRenderingTest(hooks);

    assert.dom().hasText('');
  hooks.beforeEach(function () {
    this.owner.register('service:router', MockRouterService);
  });

    // Template block usage:
    await render(hbs`
      <ShareButton>
        template block text
      </ShareButton>
    `);
  test('basic usage', async function (assert) {
    await render(hbs`<ShareButton>Tweet this!</ShareButton>`);

    assert.dom().hasText('template block text');
    assert
      .dom('a')
      .hasAttribute('target', '_blank')
      .hasAttribute('rel', 'external nofollow noopener noreferrer')
      .hasAttribute(
        'href',
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(MOCK_URL.href)}`
      )
      .hasClass('share')
      .hasClass('button')
      .containsText('Tweet this!');
  });
});
```

In this component test, we _[registered](../../../applications/dependency-injection/#toc_factory-registrations)_ our own router service with Ember in the `beforeEach` hook. When our component is rendered and requests the router service to be injected, it will get an instance of our `MockRouterService` instead of the built-in router service.

This is a pretty common testing technique called _mocking_ or _stubbing_. Our `MockRouterService` implements the same interface as the built-in router service – the part that we care about anyway; which is that it has a `currentURL` property that reports the current "logical" URL. This allows us to fix the URL at a pre-determined value, making it possible to easily test our component without having to navigate to a different page. As far as our component can tell, we are currently on the page `/foo/bar/baz?some=page#anchor`, because that's the result it would get when querying the router service.

By using service injections and mocks, Ember allows us to build _loosely coupled_ components that can each be tested in isolation, while acceptance tests provide end-to-end coverage that ensures that these components do indeed work well together.

While we are here, let's add some more tests for the various functionalities of the `<ShareButton>` component:

```js { data-filename="tests/integration/components/share-button-test.js" data-diff="-4,+5,+24,+25,+26,+27,+28,+29,-39,-40,-41,-42,+43,+47,+48,+49,+50,+51,+52,+53,+54,+55,+56,+57,+58,+59,+60,+61,+62,+63,+64,+65,+66,+67,+68,+69,+70,+71,+72,+73,+74,+75,+76,+77,+78,+79,+80,+81,+82,+83,+84,+85,+86,+87,+88,+89,+90,+91,+92,+93,+94" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { find, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

const MOCK_URL = new URL(
  '/foo/bar?baz=true#some-section',
  window.location.origin,
);

class MockRouterService extends Service {
  get currentURL() {
    return '/foo/bar?baz=true#some-section';
  }
}

module('Integration | Component | share-button', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:router', MockRouterService);

    this.tweetParam = (param) => {
      let link = find('a');
      let url = new URL(link.href);
      return url.searchParams.get(param);
    };
  });

  test('basic usage', async function (assert) {
    await render(hbs`<ShareButton>Tweet this!</ShareButton>`);

    assert
      .dom('a')
      .hasAttribute('target', '_blank')
      .hasAttribute('rel', 'external nofollow noopener noreferrer')
      .hasAttribute(
        'href',
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(MOCK_URL.href)}`
      )
      .hasAttribute('href', /^https:\/\/twitter\.com\/intent\/tweet/)
      .hasClass('share')
      .hasClass('button')
      .containsText('Tweet this!');

    assert.strictEqual(this.tweetParam('url'), MOCK_URL.href);
  });

  test('it supports passing @text', async function (assert) {
    await render(
      hbs`<ShareButton @text="Hello Twitter!">Tweet this!</ShareButton>`,
    );

    assert.strictEqual(this.tweetParam('text'), 'Hello Twitter!');
  });

  test('it supports passing @hashtags', async function (assert) {
    await render(
      hbs`<ShareButton @hashtags="foo,bar,baz">Tweet this!</ShareButton>`,
    );

    assert.strictEqual(this.tweetParam('hashtags'), 'foo,bar,baz');
  });

  test('it supports passing @via', async function (assert) {
    await render(hbs`<ShareButton @via="emberjs">Tweet this!</ShareButton>`);
    assert.strictEqual(this.tweetParam('via'), 'emberjs');
  });

  test('it supports adding extra classes', async function (assert) {
    await render(
      hbs`<ShareButton class="extra things">Tweet this!</ShareButton>`,
    );

    assert
      .dom('a')
      .hasClass('share')
      .hasClass('button')
      .hasClass('extra')
      .hasClass('things');
  });

  test('the target, rel and href attributes cannot be overridden', async function (assert) {
    await render(
      hbs`<ShareButton target="_self" rel="" href="/">Not a Tweet!</ShareButton>`,
    );

    assert
      .dom('a')
      .hasAttribute('target', '_blank')
      .hasAttribute('rel', 'external nofollow noopener noreferrer')
      .hasAttribute('href', /^https:\/\/twitter\.com\/intent\/tweet/);
  });
});
```

The main goal here is to test the key functionalities of the component individually. That way, if any of these features regresses in the future, these tests can help pinpoint the source of the problem for us. Because a lot of these tests require parsing the URL and accessing its query params, we setup our own `this.tweetParam` test helper function in the `beforeEach` hook. This pattern allows us to easily share functionality between tests. We were even able to refactor the previous test using this new helper!

With that, everything should be good to go, and our `<ShareButton>` component should now work everywhere!

<img src="/images/tutorial/part-2/service-injection/pass-2@2x.png" alt="All the tests pass!" width="1024" height="960">


---

## What about missing types?

### Gradually typing your app

See ["Gradual Typing Hacks"][gradual-typing-hacks] for strategies for incrementally adding types to your app.

### Install types for libraries

You'll want to use library type definitions as much as possible. Many packages ship their own type definitions, and many others have community-maintained definitions from [DefinitelyTyped][], available in the `@types` name space. The first thing you should do is to look for types from other libraries: it will mean using fewer ["Gradual Typing Hacks"][gradual-typing-hacks] and getting a lot more help both from your editor and from the compiler.

### The `types` directory

During installation, we create a `types` directory in the root of your application and add a [`"paths"`][tsconfig-paths] mapping to your `tsconfig.json` that includes that directory in any type lookups TypeScript tries to do. This is convenient for a few things:

- global types for your project (see the next section)
- writing types for libraries that do not have any types

These are all fallbacks, of course, you should use the types supplied directly with a package when possible.

#### Global types for your project

At the root of your application or addon, we include a `types/<your project>` directory with an `index.d.ts` file in it. Anything which is part of your project but which must be declared globally can go in this file. For example, if you have data attached to the `Window` object when the page is loaded (for bootstrapping or whatever other reason), this is a good place to declare it.

We automatically configure `index.d.ts` to be ready for [Glint][], which will make type checking work with Ember's templates. The default configuration only supports Ember's classic pairing of separate `.ts` and `.hbs` files, but Glint also supports the `<template>` format with `.gts` files. See the [corresponding package README][glint-environment-ember-template-imports] for more details. (Once Ember enables `<template>` by default, so will our Glint configuration!)

### Environment configuration typings

Along with the `@types/` files mentioned above, we add a starter interface for `config/environment.js` in `app/config/environment.d.ts`. This interface will likely require some changes to match your app.

We install this file because the actual `config/environment.js` is (a) not actually identical with the types as you inherit them in the content of an application, but rather a superset of what an application has access to, and (b) not in the same location as the path at which you look it up. The actual `config/environment.js` file executes in Node during the build, and Ember CLI writes its result as `<my-app>/config/environment` into your build for consumption at runtime.

## Type Narrowing with Ember Debug Assert

Ember's `assert` function from `@ember/debug` is super useful for ["type narrowing"][type-narrowing]—TypeScript's process of refining types to more specific types than originally declared. If you're not familiar with `assert`, you might want to take a look at its [API docs][debug-assert]! It's a development-and-test-only helper that gets stripped from production builds, and is very helpful for this kind of thing!

For example, let's pretend we're writing an addon that provides a `totalLength` helper to tally up the total length of an array of strings passed to it. Because addon authors cannot guarantee that their users will be using TypeScript, we've typed the positional arguments as an array of `unknown` so that TypeScript will ensure we've handled every possible valid or invalid argument a user might pass.

We can use `assert` to ensure that if a user passes an array containing non-string values, our addon will error in tests and development.

```typescript
import { assert } from '@ember/debug';

function totalLength(positional: unknown[]) {
  assert(
    'all positional args to `total-length` must be strings',
    positional.every((arg): arg is string => typeof arg === 'string')
  );

  // TypeScript now knows that `positional` is a `string[]` because we asserted above
  return positional.reduce((sum, s) => sum + s.length, 0);
}
```

And, the types for `assert` ensure that TypeScript can use the condition you pass to properly narrow the types, because `assert` is typed as an [assertion function][assertion-function].

```typescript
export interface AssertFunc {
  (desc: string, condition: unknown): asserts condition;
  (desc: string): never;
}
```

## Strictness

You can enable TypeScript's current strictest configuration by including the `@tsconfig/strictest` base _before_ the `@tsconfig/ember` base in your `tsconfig.json`:

```json5 {data-filename="tsconfig.json" data-diff="+3"}
{
  extends: [
    '@tsconfig/strictest/tsconfig.json',
    '@tsconfig/ember/tsconfig.json',
  ],
  // ...
}
```

<!-- Internal links -->

[gradual-typing-hacks]: ../../application-development/converting-an-app/#toc_gradual-typing-hacks

<!-- External links -->

[assertion-function]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions
[debug-assert]: https://api.emberjs.com/ember/release/functions/@ember%2Fdebug/assert
[DefinitelyTyped]: https://github.com/DefinitelyTyped/DefinitelyTyped
[glint-environment-ember-template-imports]: https://github.com/typed-ember/glint/tree/main/packages/environment-ember-template-imports#readme
[glint]: https://typed-ember.gitbook.io/glint
[tsconfig-paths]: https://www.typescriptlang.org/tsconfig#paths
[type-narrowing]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html


---

This section covers the common details and "gotchas" of using TypeScript with Ember.

## Registries

Ember makes heavy use of string-based APIs to allow for a high degree of dynamicness. With some [limitations][get-set], you can nonetheless use TypeScript very effectively to get auto-complete/IntelliSense as well as to accurately type-check your applications by using **registries**.

Here's an example defining a Shopping Cart Service in the Ember Service registry:

```typescript {data-filename="app/services/shopping-cart.ts"}
export default class ShoppingCartService extends Service {
  //...
}

declare module '@ember/service' {
  interface Registry {
    'shopping-cart': ShoppingCartService;
  }
}
```

This registry definition allows for type-safe lookups in string-based APIs. For example, [the `Owner.lookup` method][owner-lookup] uses this "registration"—a mapping from the string `'shopping-cart'` to the service type, `ShoppingCartService`—to provide the correct type:

```typescript
import type Owner from '@ember/owner';

function dynamicLookup(owner: Owner) {
  let cart = owner.lookup('service:shopping-cart');
  cart.add('hamster feed');
}
```

For examples, see:

- [Service][service] registry
- [Controller][controller] registry

## Decorators

Ember makes heavy use of decorators, and TypeScript does not support deriving type information from Ember's legacy decorators.

As a result, whenever using a decorator to declare a class field the framework sets up for you, you should mark it with [`declare`][declare]. That includes all service injections (`@service`), controller injections (`@inject`) as well as all EmberData attributes (`@attr`) and relationships (`@belongsTo` and `@hasMany`).

Normally, `TypeScript` determines whether a property is definitely not `null` or `undefined` by checking what you do in the constructor. In the case of legacy decorators, though, TypeScript does not have visibility into how the decorated properties are initialized. The `declare` annotation informs TypeScript that a declaration is defined somewhere else, outside its scope.

Additionally, _you_ are responsible to write the type correctly. TypeScript does not use legacy decorator information at all in its type information. If you write `@service foo` or even `@service('foo') foo`, _Ember_ knows that this resolves at runtime to the service `Foo`, but TypeScript does not and—for now—_cannot_.

This means that you are responsible to provide this type information, and that you are responsible to make sure that the information remains correct and up-to-date.

For examples, see:

- [`@service`][service]
- [`@inject`][controller]
- EmberData [`@attr`][model-attr]
- EmberData [`@belongsTo`][model-belongsto]
- EmberData [`@hasMany`][model-hasmany]

## Templates

Templates are currently totally non-type-checked. This means that you lose any safety when moving into a template context, even if using a Glimmer `Component` in Ember Octane. (Looking for type-checking in templates? Try [Glint][]!)

For example, TypeScript won't detect a mismatch between this action and the corresponding call in the template:

```typescript {data-filename="app/components/my-game.ts"}
import Component from '@ember/component';
import { action } from '@ember/object';

export default class MyGame extends Component {
  @action turnWheel(degrees: number) {
    // ...
  }
}
```

```handlebars {data-filename="app/components/my-game.hbs"}
<button {{on 'click' (fn this.turnWheel 'potato')}}>
  Click Me
</button>
```

## Hook Types and Autocomplete

Let's imagine a component which just logs the names of its arguments when it is first constructed. First, we must define the [Signature][] and pass it into our component, then we can use the `Args` member in our Signature to set the type of `args` in the constructor:

```typescript {data-filename="app/components/args-display.ts"}
import Component from '@glimmer/component';

const log = console.log.bind(console);

export interface ArgsDisplaySignature {
  Args: {
    arg1: string;
    arg2: number;
    arg3: boolean;
  };
}

export default class ArgsDisplay extends Component<ArgsDisplaySignature> {
  constructor(owner: unknown, args: ArgsDisplaySignature['Args']) {
    super(owner, args);
    Object.keys(args).forEach(log);
  }
}
```

Notice that we have to start by calling `super` with `owner` and `args`. This may be a bit different from what you're used to in Ember or other frameworks, but is normal for sub-classes in TypeScript today. If the compiler just accepted any `...arguments`, a lot of potentially _very_ unsafe invocations would go through. So, instead of using `...arguments`, we explicitly pass the _specific_ arguments and make sure their types match up with what the super-class expects.

The types for `owner` here and `args` line up with what the `constructor` for Glimmer components expects. The `owner` is specified as `unknown` because this is a detail we explicitly _don't_ need to know about. The `args` are the `Args` from the Signature we defined.

Additionally, the types of the arguments passed to subclassed methods will _not_ autocomplete as you may expect. This is because in JavaScript, a subclass may legally override a superclass method to accept different arguments. Ember's lifecycle hooks, however, are called by the framework itself, and thus the arguments and return type should always match the superclass. Unfortunately, TypeScript does not and _cannot_ know that, so we have to provide the types directly.

Accordingly, we have to provide the types for hooks ourselves:

```typescript {data-filename="app/routes/my.ts"}
import Route from '@ember/routing/route';
import Transition from '@ember/routing/transition';

export default class MyRoute extends Route {
  beforeModel(transition: Transition) {
    // ...
  }
}
```

<!-- Internal links -->

[controller]: ../../core-concepts/routing/#toc_controller-injections-and-lookups
[get-set]: ../../additional-resources/legacy/#toc_classic-get-or-set-methods
[model-attr]: ../../core-concepts/ember-data/#toc_attr
[model-belongsto]: ../../core-concepts/ember-data/#toc_belongsto
[model-hasmany]: ../../core-concepts/ember-data/#toc_hasMany
[owner-lookup]: https://api.emberjs.com/ember/release/classes/Owner/methods/lookup?anchor=lookup
[service]: ../../core-concepts/services/#toc_using-services
[signature]: ../../core-concepts/invokables/#toc_signature-basics

<!-- External links -->

[declare]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier
[glint]: https://typed-ember.gitbook.io/glint/


---

Here are some additional resources that should be useful for using Ember with TypeScript:

- Tips for working with (pre-Octane) [Ember Classic][legacy] and TypeScript together.
- Common details and ["gotchas"][gotchas] of using TypeScript with Ember.
- [Troubleshooting][gotchas] common issues when using TypeScript with Ember.
- [Frequently Asked Questions][faq] users have when using TypeScript with Ember.
- Miscellaneous [tips][faq] for using TypeScript with Ember.
- Looking for type-checking in Ember templates? Check out [Glint][].

<!-- Internal links -->

[faq]: ./faq
[gotchas]: ./gotchas
[legacy]: ./legacy

<!-- External links -->

[glint]: https://typed-ember.gitbook.io/glint/


---

In the rest of this guide, we emphasize the happy path of working with Ember in the [Octane Edition][octane]. However, there are times you'll need to understand these details:

1. Most existing applications make heavy use of the pre-Octane (“legacy”) Ember programming model, and we support that model—with caveats.
2. Several parts of Ember Octane (specifically: routes, controllers, services, and class-based helpers) continue to use these concepts under the hood, and our types support that—so understanding them may be important at times.

The rest of this page is dedicated to helping you understand how Ember's types and the classic Ember system interact.

## Classic Ember Components

Many of the same considerations as discussed in the [TypeScript Guides for Glimmer Components][components] apply to classic Ember Components. However, there are several additional considerations:

- Classic Ember Components support both named and positional arguments. If you supply `Args` in the component signature as an object shape the same way you would for a Glimmer component, those arguments will be treated as _named_ arguments. If you are using _positional_ arguments, you must specify the `Positional` key in the `Args` interface and specify any named arguments under the `Named` key.

- Classic Ember component arguments are merged with the properties on the class, rather than being supplied separately as `this.args`. As a result, they require more boilerplate to incorporate: we must use [interface merging][merge] to represent that the arguments and the properties of the class are the same. (This also means that there is no support for type-powered completion with JSDoc for classic Ember Components, because TypeScript does not support interface merging with JSDoc.)

- The `Element` for a classic Ember component should be the same as the [`tagName`][tagName] for the component—but this is not type-checked.

If the `AudioPlayer` component shown above were a classic Ember component, we would define its signature and backing class like this:

```typescript {data-filename="app/components/audio-player.ts"}
import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface AudioPlayerNamedArgs {
  /** The url for the audio to be played */
  srcUrl: string;
}

interface AudioPlayerSignature {
  Args: AudioPlayerNamedArgs;
  Blocks: {
    fallback: [srcUrl: string];
    title: [];
  };
  Element: HTMLAudioElement;
}

export default interface AudioPlayer extends AudioPlayerNamedArgs {}
export default class AudioPlayer extends Component<AudioPlayerSignature> {
  tagName = 'audio';

  @tracked isPlaying = false;

  @action
  play() {
    this.isPlaying = true;
  }

  @action
  pause() {
    this.isPlaying = false;
  }
}
```

And if we add a positional argument, things get even funkier because there isn't a way to splat the `Positional` arguments tuple onto the class interface:

```typescript {data-filename="app/components/audio-player.ts"}
import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface AudioPlayerNamedArgs {
  /** The url for the audio to be played */
  srcUrl: string;
}

interface AudioPlayerSignature {
  Args: {
    Named: AudioPlayerNamedArgs;
    Positional: [myPositionalArg: string];
  };
  Blocks: {
    fallback: [srcUrl: string];
    title: [];
  };
  Element: HTMLAudioElement;
}

export default interface AudioPlayer extends AudioPlayerNamedArgs {}
export default class AudioPlayer extends Component<AudioPlayerSignature> {
  tagName = 'audio';
  static positionalParams = ['myPositionalArg'];
  declare myPositionalArg: string;

  // ...the same code as before
}
```

In general, while we do support classic Ember Components for the sake of backwards compatibility and migration, we strongly recommend that you [migrate away from classic Ember Components][migrating-from-classic-components] to Glimmer Components.

## EmberObject

When working with the legacy Ember object model, `EmberObject`, there are a number of caveats and limitations you need to be aware of. For today, these caveats and limitations apply to any classes which extend directly from `EmberObject`, or which extend classes which _themselves_ extend `EmberObject`.

Additionally, Ember's mixin system is deeply linked to the semantics and implementation details of `EmberObject`, and it has the most caveats and limitations.

### Failure Modes

When using mixins and classic class syntax, you will often need to define `this` in actions hashes, computed properties, etc. That in turn often leads to problems with self-referential `this`: TypeScript simply cannot figure out how to stop recursing through the definitions of the type.

Additionally, even when you get past the endlessly-recursive type definition problems, when enough mixins are resolved, TypeScript will occasionally just give up because it cannot resolve the property or method you're interested in across the many shared base classes.

Finally, when you have "zebra-striping" of your classes between classic classes and native classes, your types will often stop resolving.

### Mixins

The Ember mixin system is the legacy Ember construct TypeScript supports _least_ well. Mixins are fundamentally hostile to robust typing with TypeScript. While you can supply types for them, you will regularly run into problems with self-referentiality in defining properties within the mixins.

As a stopgap, you can refer to the type of a mixin using the `typeof` operator. In general, however, we strongly recommend you [migrate away from mixins][migrate-from-mixins] before attempting to convert code which relies on them to TypeScript.

### Classic Class Syntax

While this may not be intuitively obvious, the classic class syntax simply _is_ the mixin system. Every classic class creation is a case of mixing together multiple objects to create a new base class with a shared prototype. The result is that any time you see the classic `.extend({ ... })` syntax, regardless of whether there is a named mixin involved, you are dealing with Ember's legacy mixin system. This in turn means that you are dealing with the parts of Ember which TypeScript is _least_ able to handle well.

While we describe here how to use types with classic (mixin-based) classes insofar as they _do_ work, there are many failure modes. As a result, we strongly recommend you [migrate away from classic classes][migrating-from-classic-classes] as quickly as possible. This is the direction the Ember ecosystem as a whole is moving, but it is _especially_ important for TypeScript users.

## Computed Properties

There are two variants of Ember's computed properties you may encounter:

- the decorator form used with native classes
- the callback form used with classic classes (based on `EmberObject`)

### Decorator form

```typescript {data-filename="app/components/user-profile.ts"}
import Component from '@ember/component';
import { computed } from '@ember/object/computed';

export default class UserProfile extends Component {
  name = 'Chris';
  age = 33;

  @computed('name', 'age')
  get bio() {
    return `${this.name} is `${this.age}` years old!`;
  }
}
```

Note that it is impossible for `@computed` to know whether the keys you pass to it are allowed or not. For this reason, we recommend you [migrate away from computed properties][migrate-from-computed].

### Callback form

Computed properties in the classic object model take a callback instead. In these cases, you will need to explicitly write out a `this` type for computed property callbacks for `get` and `set` to type-check correctly:

```typescript {data-filename="app/components/user-profile.ts" data-diff="-8,+9"}
import Component from '@ember/component';
import { computed } from '@ember/object/computed';

const UserProfile = Component.extend({
  name: 'Chris',
  age: 32,

  bio: computed('name', 'age', function() {
  bio: computed('name', 'age', function(this: UserProfile) {
    return `${this.get('name')} is `${this.get('age')}` years old!`;
  }),
})

export default UserProfile;
```

The [`this` type][this], tells TS to use `UserProfile` for `get` and `set` lookups; otherwise `this.get` would not know the types of `'name'` or `'age'` or even be able to suggest them for autocompletion.

Note that this _does not always work_: you may get warnings from TypeScript about the item being defined in terms of itself.

For this reason, we strongly recommend you [migrate away from computed properties][migrate-from-computed] and [migrate away from classic classes][migrating-from-classic-classes] before converting to TypeScript.

## Classic `get` or `set` methods

In general, the `this.get` and `this.set` methods on `EmberObject` subclasses and the standalone `get` and `set` functions will work as you'd expect _if_ you're doing lookups only a single layer deep. We do not provide support for deep key lookups like `get(someObj, 'a.b.c')`, because normal property access works correctly across the whole Ember ecosystem since at least Ember and EmberData 3.28.

Since regular property access “just works”, you should migrate to using normal property access instead. TypeScript will help make this a smooth process by identifying where you need to handle null and undefined intermediate properties.

In the few cases where you _do_ need to use `get`, you can chain `get` calls instead of using deep key lookups. So `this.get('a.b.c')` becomes `this.get('a').get('b').get('c')`. In reality, though, it's unlikely you've got that many nested proxies, so the code might end up looking more like `this.get('a').b.c`.

## Prototype Extensions

You can enable types for Ember's prototype extensions by adding the following to your [global types][global-types]:

```typescript {data-filename="types/global.d.ts"}
declare global {
  interface Array<T> extends Ember.ArrayPrototypeExtensions<T> {}
  interface Function extends Ember.FunctionPrototypeExtensions {}
}
```

<!-- Internal links -->

[components]: ../../core-concepts/invokables/#toc_glimmer-components
[global-types]: ../../additional-resources/faq/#toc_global-types-for-your-project
[migrate-from-computed]: ../../../upgrading/current-edition/tracked-properties/
[migrate-from-mixins]: ../../../upgrading/current-edition/native-classes/#toc_mixins
[migrating-from-classic-classes]: ../../../upgrading/current-edition/native-classes/
[migrating-from-classic-components]: ../../../upgrading/current-edition/glimmer-components/

<!-- External links -->

[merge]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
[octane]: https://emberjs.com/editions/octane/
[tagName]: https://api.emberjs.com/ember/release/classes/Component#html-tag
[this]: https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function


---

Building addons in TypeScript offers many of the same benefits as building apps in TypeScript: it puts an extra tool at your disposal to help document your code and ensure its correctness. For addons, though, there's one additional bonus: publishing type information for your addons enables autocomplete and inline documentation for your consumers, even if they're not using TypeScript themselves.

## Create a New TypeScript Addon

To start a new Ember addon with TypeScript, add the `--typescript` flag when you run [`ember addon`][ember-addon]:

```shell
ember addon my-typescript-addon --typescript
```

Using the `--typescript` flag changes the output of `ember addon` in a few ways:

### TypeScript Project Files

Project files will be generated with `.ts` extensions instead of `.js`.

### Packages to Support TypeScript

In addition to the usual packages added with `ember addon`, the following packages will be added at their current "latest" value:

- `typescript` – tooling to support TypeScript type checking and compilation.
- `@tsconfig/ember` – a shared TypeScript configuration for Ember apps.
- `@typescript-eslint/*` – ESLint support for TypeScript.
- `@types/qunit` - TypeScript type definitions for QUnit.
- `@types/rsvp` - TypeScript type definitions for RSVP.
- `@warp-drive/core-types` - shared core types, type utilities and constants for the WarpDrive and EmberData packages.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        Ember and EmberData publish their own native types compiled directly from their source code, so you do not need to install any <code>@types/ember</code> or <code>@types/ember-data</code> packages. These packages should be considered legacy, are only lightly maintained, and will conflict with the native types.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Files and Config to Support TypeScript

In addition to the usual files added with `ember addon`, we also add:

- [`tsconfig.json`][tsconfig] – configuration to set up TypeScript for your project
- `tsconfig.declarations.json` (v1 addons only) – configures the compiler options for emitting declaration files as described below in ["Publishing Notes for V1 Addons"][publishing-v1]
- [`types/global.d.ts`][global-types] (v1 addons only) or `unpublished-development-types/index.d.ts` (v2 addons only) – the location for any global type declarations you need to write

Additionally:

- `package.json` will have a `lint:types` script to check types with the command line.
- (v1 addons only) `package.json` will also have a `prepack` script, a `postpack` script, and a default entry for `typesVersions` as described below in ["Publishing Notes for V1 Addons"][publishing-v1].
- `ember-cli-build.js` (v1 addons) or `babel.config.json` (v2 addons) will be configured to transform TypeScript at build-time.
- `.ember-cli` has `isTypeScriptProject` set to true, which will force the blueprint generators to generate TypeScript rather than JavaScript by default.
- `.eslintrc.js` will be configured for TypeScript.

## Publishing

When you publish an addon written in TypeScript, the `.ts` files will be consumed and transpiled by Babel as part of building the host application the same way `.js` files are, in order to meet the requirements of the application's `config/targets.js`. This means that no special steps are required for your source code to be consumed by users of your addon.

### Publishing Notes for V1 Addons

Even though you publish the source `.ts` files, by default your consumers who also use TypeScript won't be able to benefit from those types, because the TS compiler isn't aware of how `ember-cli` resolves import paths for addon files. For instance, if you write `import { foo } from 'my-addon/bar';`, the typechecker has no way to know that the actual file on disk for that import path is at `my-addon/addon/bar.ts`.

Because addons have no control over how files in `app/` are transpiled, **you cannot have `.ts` files in your addon's `app/` folder**.

In order for your addon's users to benefit from type information from your addon, you need to put [`.d.ts` _declaration files_][dts] at the location on disk where the compiler expects to find them. This addon provides two scripts to help with that: `prepack` and `postpack`. Additionally, the entry for [`typesVersions`][typesVersions] added to your `package.json` tell consuming apps where to find the types for the addon.

The `prepack` script will populate the overall structure of your package with `.d.ts` files laid out to match their import paths. For example, `addon/index.ts` would produce an `index.d.ts` file in the root of your package.

The `postpack` script will remove the generated `.d.ts` files, leaving your working directory back in a pristine state.

The TypeScript compiler has very particular rules when generating declaration files to avoid letting private types leak out unintentionally. You may find it useful to run `prepack` yourself as you're getting a feel for these rules to ensure everything will go smoothly when you publish.

## Linking V1 Addons

Often when developing an addon, it can be useful to run that addon in the context of some other host app so you can make sure it will integrate the way you expect, e.g. using [`yarn link`][yarn-link] or [`npm link`][npm-link].

When you do this for a TypeScript addon, the source files will be picked up in the host app build and everything will execute at runtime as you'd expect. If the host app is also using TypeScript, though, it won't be able to resolve imports from your addon by default, for the reasons outlined above in the ["Publishing Notes for V1 Addons"][publishing-v1] section.

You could run `prepack` in your addon any time you change a file, but for development a simpler option is to temporarily update the `paths` configuration in the host application so that it knows how to resolve types from your linked addon.

Add entries for `<addon-name>` and `<addon-name>/*` in your `tsconfig.json` like so:

```json {data-filename="tsconfig.json"}
"compilerOptions": {
  // ...other options
  "paths": {
    // ...other paths, e.g. for your app/ and tests/ trees
    // resolve: import x from 'my-addon';
    "my-addon": [
      "node_modules/my-addon/addon"
    ],
    // resolve: import y from 'my-addon/utils/y';
    "my-addon/*": [
      "node_modules/my-addon/addon/*"
    ]
  }
}
```

## In-Repo V1 Addons

[In-repo addons][] work in much the same way as linked ones. Their `.ts` files are managed automatically by `ember-cli-typescript` in their `dependencies`, and you can ensure imports resolve correctly from the host by adding entries in `paths` in the base `tsconfig.json` file.

```json {data-filename="tsconfig.json"}
{
  // ...other options
  "compilerOptions": {
    // ...other options
    "paths": {
      // ...other paths, e.g. for your tests/ tree
      "my-app": [
        "app/*",
        // add addon app directory that will be merged with the host application
        "lib/my-addon/app/*"
      ],
      // resolve: import x from 'my-addon';
      "my-addon": ["lib/my-addon/addon"],
      // resolve: import y from 'my-addon/utils/y';
      "my-addon/*": ["lib/my-addon/addon/*"]
    }
  }
}
```

One difference as compared to regular published addons: you know whether or not the host app is also using TypeScript, and if it is, **you can safely put `.ts` files in an in-repo addon's `app/` folder**.

## Templates

Templates are _currently_ totally non-type-checked. (Looking for type-checking in templates? Try [Glint][]!) This means that you lose any safety when moving into a template context.

Addons need to import templates from the associated `.hbs` file to bind to the layout of any components they export. The TypeScript compiler will report that it cannot resolve the module, since it does not know how to resolve files ending in `.hbs`. To resolve this, you can provide this set of definitions to `my-addon/types/global.d.ts`, which will allow the import to succeed:

```typescript {data-filename="my-addon/types/global.d.ts"}
declare module '*/template' {
  import { TemplateFactory } from 'ember-cli-htmlbars';
  const template: TemplateFactory;
  export default template;
}

declare module 'app/templates/*' {
  import { TemplateFactory } from 'ember-cli-htmlbars';
  const template: TemplateFactory;
  export default template;
}

declare module 'addon/templates/*' {
  import { TemplateFactory } from 'ember-cli-htmlbars';
  const template: TemplateFactory;
  export default template;
}
```

<!-- Internal links -->

[global-types]: ../../additional-resources/faq/#toc_global-types-for-your-project
[publishing-v1]: ./#toc_publishing-notes-for-v1-addons
[tsconfig]: ../configuration/#toc_tsconfigjson

<!-- External links -->

[dts]: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
[ember-addon]: https://cli.emberjs.com/release/writing-addons/
[glint]: https://typed-ember.gitbook.io/glint/
[In-repo addons]: https://cli.emberjs.com/release/writing-addons/in-repo-addons/
[npm-link]: https://docs.npmjs.com/cli/link
[typesVersions]: https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#version-selection-with-typesversions
[yarn-link]: https://classic.yarnpkg.com/en/docs/cli/link


---

## `tsconfig.json`

If you use the `--typescript` flag when generating your Ember app, we generate a good default [`tsconfig.json`][tsconfig], which will usually make everything _Just Work™_:

```json {data-filename="tsconfig.json"}
{
  "extends": "@tsconfig/ember/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "my-app/tests/*": ["tests/*"],
      "my-app/*": ["app/*"],
      "*": ["types/*"]
    },
    "types": [
      "ember-source/types",
      "ember-data/unstable-preview-types",
      // ...more ember-data types...
      "@warp-drive/core-types/unstable-preview-types"
  }
}
```

The default `tsconfig.json` extends the [`"@tsconfig/ember/tsconfig.json"`][ember-tsconfig] base, which includes TypeScript compiler options to enable TypeScript development in an Ember app plus some useful default configurations for strictness to ensure type-safety and compatibility with Ember's types.

Additionally, the generated `tsconfig.json` includes [`"baseUrl"`][tsconfig-baseUrl] and [`"paths"`][tsconfig-paths] configuration specific to your app. This configuration allows Ember's classic package layout, which is not resolvable with the Node resolution algorithm, to work with TypeScript.

In general, you may customize your TypeScript build process as usual using the `tsconfig.json` file. There are a few things worth noting, however, if you're looking to make further or more advanced customizations (but _most_ users can just ignore this section!):

1. The Ember build pipeline uses Babel's TypeScript support instead of the TypeScript compiler. For this reason, the generated `tsconfig.json` file does not set [`"outDir"`][tsconfig-outDir] and sets [`"noEmit"`][tsconfig-noEmit] to `true`. This configuration allows you to run editors which use the compiler without creating extraneous `.js` files throughout your codebase, leaving the compilation to Babel to manage.

   You _can_ still customize `"outDir"` and `"noEmit"` if your use case requires it, however. For example, to see the output of the compilation in a separate folder you are welcome to set `"outDir"` to some path and set `"noEmit"` to `false`. Then tools which use the TypeScript compiler (e.g. the watcher tooling in JetBrains IDEs) will now generate files at that location.

   Note that any changes you _do_ make to `"outDir"` and `"noEmit"` won't have any effect on how _Ember_ builds your application. The build pipeline will continue to use its own temp folder.

1. Since your application is built by Babel, and only _type-checked_ by TypeScript, we set the [`"target"`][tsconfig-target] key in [`"@tsconfig/ember/tsconfig.json"`][ember-tsconfig] to the current version of the ECMAScript standard so that type-checking uses the latest and greatest from the JavaScript standard library. The Babel configuration in your app's `config/targets.js` and any included polyfills will determine the final build output.

1. If you make changes to the paths included in or excluded from the build via your `tsconfig.json` (using the [`"include"`][tsconfig-include], [`"exclude"`][tsconfig-exclude], or [`"files"`][tsconfig-files] keys), you will need to restart the server to take the changes into account: the build pipeline does not currently watch the `tsconfig.json` file.

## Enabling Sourcemaps

To enable TypeScript sourcemaps, you'll need to add the corresponding configuration for Babel to your `ember-cli-build.js` file:

```javascript {data-filename="ember-cli-build.js" data-diff="+3"}
const app = new EmberApp(defaults, {
  "ember-cli-babel": { enableTypeScriptTransform: true },
  babel: { sourceMaps: "inline" },
});
```

(Note that this _will_ noticeably slow down your app rebuilds.)

If you are using [Embroider][], you might need to include [`devtool`][devtool] in your webpack configuration:

```javascript {data-filename="ember-cli-build.js" data-diff="+4"}
return require('@embroider/compat').compatBuild(app, Webpack, {
  packagerOptions: {
    webpackConfig: {
      devtool: 'source-map'
    }
  }
}
```

<!-- Internal links -->

<!-- External links -->

[devtool]: https://webpack.js.org/configuration/devtool/
[ember-tsconfig]: https://www.npmjs.com/package/@tsconfig/ember
[embroider]: https://github.com/embroider-build/embroider
[tsconfig-baseUrl]: https://www.typescriptlang.org/tsconfig#baseUrl
[tsconfig-exclude]: https://www.typescriptlang.org/tsconfig#exclude
[tsconfig-files]: https://www.typescriptlang.org/tsconfig#files
[tsconfig-include]: https://www.typescriptlang.org/tsconfig#include
[tsconfig-noEmit]: https://www.typescriptlang.org/tsconfig#noEmit
[tsconfig-outDir]: https://www.typescriptlang.org/tsconfig#outDir
[tsconfig-paths]: https://www.typescriptlang.org/tsconfig#paths
[tsconfig-target]: https://www.typescriptlang.org/tsconfig#target
[tsconfig]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html


---

These directions are for converting an _existing_ Ember app to TypeScript. If you are starting a new app, you can use the directions in [Getting Started][].

## Enable TypeScript Features

### Install TypeScript and Related Packages

See [Getting Started: Packages to Support TypeScript][packages] for descriptions of these packages.

```shell
npm add --save-dev typescript @tsconfig/ember
npm add --save-dev @types/qunit @types/rsvp
npm add --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm remove @babel/plugin-proposal-decorators @babel/eslint-parser
```

### Add TypeScript Configuration

Add a `tsconfig.json` file to the root of your project. Copy its contents from the [current output from the Ember CLI blueprints][tsconfig.json].

### Set Up TypeScript for EmberData

Follow the instructions in the [EmberData Typescript Guides][ED-ts-guides].

### Enable TypeScript Transpilation for Builds

To enable TypeScript transpilation in your app, simply add the corresponding configuration for Babel to your `ember-cli-build.js` file.

```javascript {data-filename="ember-cli-build.js" data-diff="+3"}
module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    "ember-cli-babel": { enableTypeScriptTransform: true },
    // ...
  });

  return app.toTree();
};
```

### Enable Type Checking in CI

To easily check types with the command line, add the `lint:types` script as shown [here][lint-types].

The default `lint` script generated by Ember CLI will include the `lint:types` script automatically.

### Configure Blueprint Generators to Use TypeScript

With the following configuration, project files will be generated with `.ts` extensions instead of `.js`:

```javascript {data-filename=".ember-cli" data-diff="-2,+3"}
{
  "isTypeScriptProject": false,
  "isTypeScriptProject": true,
}
```

```js {data-filename="config/ember-cli-update.json" data-diff="+12"}
{
  // ...
  "packages": [
    {
      "name": "ember-cli",
      // ...
      "blueprints": [
        {
          // ...
          "options": [
            // ...
            "--typescript"
          ]
        }
      ]
    }
  ]
}
```

### Configure ESLint

Then, update your `eslint.config.mjs` to include the [current output from the Ember CLI blueprints][eslintrc]. You might consider using ESLint [overrides][] configuration to separately configure your JavaScript and TypeScript files during the migration.

### Add Initial Type Declarations

Add types for your `config/environment.js` file by creating a type declaration file at `app/config/environment.d.ts`. You can find an example file in the [current output from the Ember CLI blueprints][environment.d.ts].

## Migrate Existing Code to TypeScript

Once you have set up TypeScript following the guides above, you can begin to migrate your files incrementally by changing their extensions from `.js` to `.ts`. Fortunately, TypeScript allows for gradual typing. This means that you can use TypeScript and JavaScript files interchangeably, so you can convert your app piecemeal.

Some specific tips for success on the technical front:

### Strictness

Use the [_strictest_ strictness][strictness] settings that our typings allow. While it may be tempting to start with the _loosest_ strictness settings and then to tighten them down as you go, this will actually mean that "getting your app type-checking" will become a repeated process—getting it type-checking with every new strictness setting you enable—rather than something you do just once.

### Gradual Typing Hacks

Many of your files might reference types in other files that haven't been converted yet. There are several strategies you can employ to avoid a chain-reaction resulting in having to convert your entire app at once:

The [`unknown`][unknown] type—You can sometimes get pretty far just by annotating types as `unknown`. If `unknown` is too wide of a type, however, you'll need a more robust solution.

[TypeScript declaration files][dts] (`.d.ts`)—These files are a straightforward way to document TypeScript types for JavaScript files without converting them. One downside of declaration files, however, is that they can easily get out-of-sync with the corresponding JavaScript file, so we only recommend this option as a temporary step.

[JSDoc][] and [`allowJs`][allowJs]—Another way to document TypeScript types for JavaScript files without converting them is to add JSDoc "type hints" to the files and enable the `allowJs` compiler option in your `tsconfig.json`. While the JSDoc type syntax can be a bit cumbersome, it is much more likely to stay in sync. You can even type-check your JavaScript files using the [`@ts-check`][ts-check] directive.

The [`any`][any] type—Opt out of type checking altogether for a value by annotating it as `any`.

The [`@ts-expect-error`][ts-expect-error] directive—A better strategy than `any`, however, is to mark offending parts of your code with a `@ts-expect-error` directive. This comment will ignore a type-checking error and allow the TypeScript compiler to assume that the value is of the type `any`. If the code stops triggering the error, TypeScript will let you know.

### Outer Leaves First

A good approach to gradual typing is to start at your outer "leaf" modules (the ones that don't import anything else from your app, only from Ember or third-party libraries) and then work your way "inward" (toward the modules with many internal imports). Often the highest-value modules are your EmberData models and any core services that are used everywhere else in the app–and those are also the ones that tend to have the most cascading effects (having to update _tons_ of other places in your app) when you type them later in the process. By starting with the outer leaves, you won't have to use as many of our gradual typing hacks.

### Prefer Octane Idioms

In general, we recommend migrating to Octane idioms before, or in conjunction with, your migration to TypeScript. See ["Working With Ember Classic"][legacy] for more details.

## ember-cli-typescript

The `ember-cli-typescript` package was used to add TypeScript support to Ember apps before Ember's native TypeScript support was available. You do _not_ need `ember-cli-typescript` installed for new apps or addons.

If you're migrating from `ember-cli-typescript` to Ember's native TypeScript support, most of your existing configuration will still be relevant. Just read through the steps of this guide and ensure that your config matches the expected config as described above.

<!-- Internal links -->

[ED-ts-guides]: ../../core-concepts/ember-data/#toc_adding-emberdata-types-to-an-existing-typescript-app
[getting started]: ../../getting-started/
[legacy]: ../../additional-resources/legacy/
[packages]: ../../getting-started/#toc_packages-to-support-typescript
[strictness]: ../../additional-resources/faq/#toc_strictness

<!-- External links -->

[allowJs]: https://www.typescriptlang.org/tsconfig/#allowJs
[any]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any
[dts]: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
[environment.d.ts]: https://github.com/ember-cli/editor-output/blob/stackblitz-app-output-typescript/app/config/environment.d.ts
[eslintrc]: https://github.com/ember-cli/editor-output/blob/stackblitz-app-output-typescript/eslint.config.mjs
[lint-types]: https://github.com/ember-cli/editor-output/blob/stackblitz-app-output-typescript/package.json
[JSDoc]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#handbook-content
[overrides]: https://eslint.org/docs/latest/use/configure/configuration-files#configuration-based-on-glob-patterns
[ts-check]: https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html#ts-check
[ts-expect-error]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html
[tsconfig.json]: https://github.com/ember-cli/editor-output/blob/stackblitz-app-output-typescript/tsconfig.json
[unknown]: https://www.typescriptlang.org/docs/handbook/2/functions.html


---

Once you've got your Ember project up and running with TypeScript, this chapter can help you with:

- Advanced [configuration][] of your TypeScript project.
- [Testing][] of your TypeScript project.

Alternatively, you may have an existing Ember project, and you're wondering how to convert it to TypeScript. In that case, check out ["Converting an Existing Ember App to TypeScript"][converting-an-app].

Or perhaps, you're creating an addon and you'd like it to be written in TypeScript. We've got you covered [here][addons].

<!-- Internal links -->

[addons]: ./addons
[configuration]: ./configuration
[converting-an-app]: ./converting-an-app
[testing]: ./testing


---

When working with TypeScript in [Ember tests][testing], your workflow will be essentially the same as testing with JavaScript. There will be a few differences in your testing experience, however, and there will also be differences in how you should handle testing app code vs. addon code.

## Testing Experience

### The `TestContext`

A common scenario in Ember tests, especially integration tests, is setting some value on the `this` context of the tests, so that it can be used in the context of the test. The Ember types refer to this as the `TestContext`.

For example, we might need to set up a `User` type to pass into a `Profile` component. We're going to start by defining a basic `User` and `Profile` so that we have a good idea of what we're testing. The `User` type is very simple, just an `interface`:

```typescript {data-filename="app/types/user.ts"}
export default interface User {
  displayName: string;
  avatarUrl?: string;
}
```

Then our component might be defined like this:

```handlebars {data-filename="app/components/profile.hbs"}
<div class='user-profile' ...attributes>
  <img
    src={{this.avatarUrl}}
    alt={{this.description}}
    class='avatar'
    data-test-avatar
  />
  <span class='name' data-test-name>{{@user.displayName}}</span>
</div>
```

```typescript {data-filename="app/components/profile.ts"}
import Component from '@glimmer/component';
import type User from 'app/types/user';
import { randomAvatarURL } from 'app/utils/avatar';

interface ProfileSignature {
  Args: {
    user: User;
  };
}

export default class Profile extends Component<ProfileSignature> {
  get avatarUrl() {
    return this.args.user.avatarUrl ?? randomAvatarURL();
  }

  get description() {
    return this.args.user.avatarUrl
      ? `${this.args.user.displayName}'s custom profile picture`
      : 'a randomly generated placeholder avatar';
  }
}
```

To test the `Profile` component, we need to set up a `User` on `this` to pass into the component as an argument. With TypeScript on our side, we can even make sure our user actually has the correct type!

```typescript {data-filename="tests/integration/components/profile.ts"}
import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { setupRenderingTest } from 'app/tests/helpers';
import type User from 'app/types/user';

module('Integration | Component | Profile', function (hooks) {
  setupRenderingTest(hooks);

  test('given a user with an avatar', async function (assert) {
    const user: User = {
      displayName: 'Rey',
      avatarUrl: 'https://example.com/star-wars/rey',
    };
    this.user = user;

    await render(hbs`<Profile @user={{this.user}}`);

    assert.dom('[data-test-name]').hasText(this.user.displayName);
    assert
      .dom('[data-test-avatar]')
      .hasAttribute('src', this.user.avatarUrl!)
      .hasAttribute('alt', `${this.user.displayName}'s custom profile picture`);
  });

  test('given a user without an avatar', async function (assert) {
    const user: User = {
      displayName: 'Rey',
    };
    this.user = user;

    await render(hbs`<Profile @user={{this.user}}`);

    assert.dom('[data-test-name]').hasText(this.user.displayName);
    assert
      .dom('[data-test-avatar]')
      .hasAttribute('src', /rando-avatars-yo/)
      .hasAttribute('alt', 'a randomly generated placeholder avatar');
  });
});
```

This is a lovely test. Unfortunately, though, it won't type-check. TypeScript reports that `Property 'user' does not exist on type 'TestContext'`. Now, TypeScript _does_ know that QUnit sets up that helpfully-named `TestContext`—so a lot of the things we can do in tests work out of the box—but we haven't told TypeScript that `this` now has a `user` property on it.

To inform TypeScript about this, we need to tell it that the type of `this` in each test assertion includes the `user` property, of type `User`. We'll start by importing the `TestContext` defined by Ember's test helpers, and extending it:

```typescript {data-filename="tests/integration/components/profile.ts"}
import type { TestContext } from '@ember/test-helpers';
import type User from 'app/types/user';

interface Context extends TestContext {
  user: User;
}
```

Then, in every `test` callback, we need to specify the [`this` type][this]:

```typescript
test('...', function (this: Context, assert) {});
```

Putting it all together, this is what our updated test definition would look like:

```typescript {data-filename="tests/integration/components/profile.ts"}
import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import type { TestContext } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { setupRenderingTest } from 'app/tests/helpers';
import type User from 'app/types/user';

interface Context extends TestContext {
  user: User;
}

module('Integration | Component | Profile', function (hooks) {
  setupRenderingTest(hooks);

  test('given a user with an avatar', async function (this: Context, assert) {
    this.user = {
      displayName: 'Rey',
      avatarUrl: 'https://example.com/star-wars/rey',
    };

    await render(hbs`<Profile @user={{this.user}}`);

    assert.dom('[data-test-name]').hasText(this.user.displayName);
    assert
      .dom('[data-test-avatar]')
      .hasAttribute('src', this.user.avatarUrl!)
      .hasAttribute('alt', `${this.user.displayName}'s custom profile picture`);
  });

  test('given a user without an avatar', async function (this: Context, assert) {
    this.user = {
      displayName: 'Rey',
    };

    await render(hbs`<Profile @user={{this.user}}`);

    assert.dom('[data-test-name]').hasText(this.user.displayName);
    assert
      .dom('[data-test-avatar]')
      .hasAttribute('src', /rando-avatars-yo/)
      .hasAttribute('alt', 'a randomly generated placeholder avatar');
  });
});
```

Now everything type-checks, and we get the nice auto-completion we're used to when dealing with `this.user` in the test body.

There are still a couple things to be careful about here, however. First, we didn't specify that the `this.user` property was _optional_. That means that TypeScript won't warn you if you do `this.user` _before_ assigning to it. Second, every test in our module gets the same `Context`. Depending on what you're doing, that may be fine, but you may end up needing to define multiple distinct test context extensions. If you _do_ end up needing to define a bunch of different test context extensions, that may be a sign that this particular set of tests is doing too much. That in turn is probably a sign that this particular _component_ is doing too much!

## Testing Philosophy

### App tests

One major difference when working with TypeScript in _app_ code is that **once your app is _fully_ converted**, there is a whole category of tests you no longer need to write: bad inputs to functions. We'll use an admittedly silly and contrived example here, an `add` function to add two numbers together, so that we can focus on the differences between JavaScript and TypeScript, rather than getting hung up on the details of this particular function.

First, the function we're testing might look like this:

```javascript {data-filename="app/utils/math.js"}
import { assert } from '@ember/debug';

export function add(a, b) {
  assert(
    'arguments must be numbers',
    typeof a === number && typeof b === number
  );

  return a + b;
}
```

Note that before we add `b` to `a`, we first check that both values are numbers using [`assert` from `@ember/debug`][assert].

The test for our function might look something like this:

```javascript {data-filename="tests/unit/utils/math-test.js"}
import { module, test } from 'qunit';
import { add } from 'app/utils/math';

module('the `add` function', function (hooks) {
  test('adds numbers correctly', function (assert) {
    assert.strictEqual(add(2, 2), 4, '2 + 2 = 4');
  });

  test('throws an error with strings', function (assert) {
    assert.throws(
      () => add('nope', 1),
      'throws when the first arg is a string and the second is a number'
    );
    assert.throws(
      () => add(0, 'nope'),
      'throws when the first arg is a number and the second is a string'
    );
    assert.throws(
      () => add('nope', 'also nope'),
      'throws when both args are strings'
    );
  });
});
```

In the TypeScript version of the function, we simply add the types to the function declaration:

```typescript {data-filename="app/utils/math.ts"}
export function add(a: number, b: number): number {
  return a + b;
}
```

We can also drop the assertion from our function definition, because the _compiler_ will check this for us. In this example, testing bad inputs to the function wouldn't make any sense at all because, once again, the _compiler_ will check this for us. We would still write tests, however, to make sure we actually got back what we expected:

```typescript {data-filename="tests/unit/utils/math-test.ts"}
import { module, test } from 'qunit';
import { add } from 'app/utils/math';

module('the `add` function', function (hooks) {
  test('adds numbers correctly', function (assert) {
    assert.strictEqual(add(2, 2), 4, '2 + 2 = 4');
  });
});
```

### Addon tests

Note, however, that only _app code_ can omit this category of tests. If you're writing an Ember addon (or any other library), you cannot assume that everyone consuming your code is using TypeScript, so you still need to account for these kinds of cases.

Let's return to our silly example with an `add` function. Our setup will look a lot like it did in the JavaScript-only example—but with some extra type coercion along the way so that we can invoke it the way JavaScript-only users might.

First, notice that in this case we've added back in our `assert` in the body of the function. The inputs to our function here will get checked for us by any TypeScript users, but this way we are still doing the work of helping out our JavaScript users.

```typescript {data-filename="app/utils/math.ts"}
import { assert } from '@ember/debug';

function add(a: number, b: number): number {
  assert(
    'arguments must be numbers',
    typeof a === number && typeof b === number
  );

  return a + b;
}
```

Now, in our test file, we're similarly back to testing all those extra scenarios, but here TypeScript would actually stop us from passing the bad inputs _at all_. Working around this will require you to do something that might feel uncomfortable for some enthusiastic TypeScript users: casting a bunch of values [`as any`][any] for your tests to throw away what TypeScript knows about our code!

```typescript {data-filename="tests/unit/utils/math-test.ts"}
import { module, test } from 'qunit';
import { add } from 'app/utils/math';

module('the `add` function', function (hooks) {
  test('adds numbers correctly', function (assert) {
    assert.strictEqual(add(2, 2), 4, '2 + 2 = 4');
  });

  test('throws an error with strings', function (assert) {
    assert.throws(
      () => add('nope' as any, 1),
      'throws when the first arg is a string and the second is a number'
    );
    assert.throws(
      () => add(0, 'nope' as any),
      'throws when the first arg is a number and the second is a string'
    );
    assert.throws(
      () => add('nope' as any, 'also nope' as any),
      'throws when both args are strings'
    );
  });
});
```

<!-- Internal links -->

[assert]: ../../additional-resources/faq/#toc_type-narrowing-with-ember-debug-assert
[testing]: ../../../testing/

<!-- External links -->

[any]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any
[this]: https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function


---

In this section, we cover how to use TypeScript effectively with specific EmberData APIs (anything you'd find under the `@ember-data` package namespace).

We do _not_ cover general usage of EmberData; instead, we assume that as background knowledge. Please see the [EmberData Guides][ED-guides] and [API docs][ED-api-docs]!

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
        The following content applies to the native EmberData types, which are currently considered "unstable" (though in practice, they've been pretty stable as of late). These guides may change as the EmberData types are finalized.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Models

EmberData models are normal TypeScript classes, but with properties decorated to define how the model represents an API resource and relationships to other resources. The decorators the library supplies "just work" with TypeScript at runtime, but require type annotations to be useful with TypeScript. Additionally, you must include the model's ["brand"][brand] to ensure that the EmberData store APIs return the correct types.

For example, here we add the `Type` brand to the `user` model:

```ts {data-filename="app/models/user.ts" data-diff="+2,+5"}
import Model from "@ember-data/model";
import type { Type } from "@warp-drive/core-types/symbols";

export default class User extends Model {
  declare [Type]: "user";
}
```

EmberData will never access Type as an actual value, these brands are _purely_ for type inference.

### Attributes

The type returned by the `@attr` [decorator][] is determined by whatever [Transform][transform-api-docs] is applied via the invocation. See our [overview of Transforms][transforms] for more information.

If you supply no argument to `@attr`, the value is passed through without transformation.

If you supply one of the built-in transforms, you will get back a corresponding type:

- `@attr('string')` → `string | null`
- `@attr('number')` → `number | null`
- `@attr('boolean')` → `boolean | null`
- `@attr('date')` → `Date | null`

If you supply a custom transform, you will get back the type returned by your transform.

So, for example, you might write a class like this:

```typescript {data-filename="app/models/user.ts"}
import Model, { attr } from "@ember-data/model";
import type { Type } from "@warp-drive/core-types/symbols";
import CustomType from "@my-app/transforms/custom-transform";

export default class User extends Model {
  @attr declare name?: string;

  @attr("number") declare age?: number | null;

  @attr("boolean") declare isAdmin?: boolean | null;

  @attr("custom-transform") declare myCustomThing?: CustomType;

  declare [Type]: "user";
}
```

Even more than with decorators in general, you should be careful when deciding whether to mark a property as [optional `?`][optional] or definitely present (no annotation): EmberData will default to leaving a property empty if it is not supplied by the API or by a developer when creating it. That is: the _default_ for EmberData corresponds to an optional field on the model.

The _safest_ type you can write for an EmberData model, therefore, leaves every property optional: this is how models _actually_ behave. If you choose to mark properties as definitely present by leaving off the `?`, you should take care to guarantee that this is a guarantee your API upholds, and that ever time you create a record from within the app, _you_ uphold those guarantees.

One way to make this safer is to supply a default value using the `defaultValue` on the options hash for the attribute:

```typescript {data-filename="app/models/user.ts"}
import Model, { attr } from "@ember-data/model";
import type { Type } from "@warp-drive/core-types/symbols";
import CustomType from "@my-app/transforms/custom-transform";

export default class User extends Model {
  @attr declare name?: string;

  @attr("number", { defaultValue: 13 }) declare age: number;

  @attr("boolean", { defaultValue: false }) declare isAdmin: boolean;

  declare [Type]: "user";
}
```

### Async BelongsTo Relationships

If the `@belongsTo` is `{ async: true }` (the default), the type is `AsyncBelongsTo<Model>`, where `Model` is the type of the model you are creating a relationship to. Additionally, pass the `Model` type as a generic to the `@belongsTo` decorator to ensure that the inverse relationship is validated.

```ts {data-filename="app/models/user.ts"}
import Model, { belongsTo, AsyncBelongsTo } from "@ember-data/model";
import type Address from "./address";
import type { Type } from "@warp-drive/core-types/symbols";

export default class User extends Model {
  @belongsTo<Address>("address", { async: true, inverse: null })
  declare address: AsyncBelongsTo<Address>;

  declare [Type]: "user";
}
```

Async BelongsTo relationships are type-safe to define as always present. Accessing an async relationship will _always_ return an `AsyncBelongsTo<Model>` object, which itself may or may not ultimately resolve to a value—depending on the API response—but will always be present itself.

### Sync BelongsTo Relationships

If the `@belongsTo` is `{ async: false }`, the type you should use is `Model | null`, where `Model` is the type of the model you are creating a relationship to. Again, you should pass the `Model` type as a generic to the `@belongsTo` decorator to ensure that the inverse relationship is validated.

```ts {data-filename="app/models/user.ts"}
import Model, { belongsTo } from "@ember-data/model";
import type Address from "./address";
import type { Type } from "@warp-drive/core-types/symbols";

export default class User extends Model {
  @belongsTo<Address>("address", { async: false, inverse: null })
  declare address: Address | null;

  declare [Type]: "user";
}
```

### Async HasMany Relationships

If the `@hasMany` is `{ async: true }` (the default), the type is `AsyncHasMany<Model>`, where `Model` is the type of the model you are creating a relationship to. Additionally, pass the `Model` type as a generic to the `@hasMany` decorator to ensure that the inverse relationship is validated.

```ts {data-filename="app/models/user.ts"}
import Model, { hasMany, AsyncHasMany } from "@ember-data/model";
import type Post from "./post";
import type { Type } from "@warp-drive/core-types/symbols";

export default class User extends Model {
  @hasMany<Post>("post", { async: true, inverse: "author" })
  declare posts: AsyncHasMany<Post>;

  declare [Type]: "user";
}
```

### Sync HasMany Relationships

If the `@hasMany` is `{ async: false }`, the type is `HasMany<Model>`, where `Model` is the type of the model you are creating a relationship to. Additionally, pass the `Model` type as a generic to the `@hasMany` decorator to ensure that the inverse relationship is validated.

```ts {data-filename="app/models/user.ts"}
import Model, { hasMany, HasMany } from "@ember-data/model";
import type Post from "./post";
import type { Type } from "@warp-drive/core-types/symbols";

export default class User extends Model {
  @hasMany<Post>("post", { async: false, inverse: "author" })
  declare posts: HasMany<Post>;

  declare [Type]: "user";
}
```

### A Note About Recursive Imports

Relationships between models in EmberData rely on importing the related models, like `import User from './user';`. This, naturally, can cause a recursive loop, as `/app/models/post.ts` imports `User` from `/app/models/user.ts`, and `/app/models/user.ts` imports `Post` from `/app/models/post.ts`. Recursive importing triggers an [`import/no-cycle`][import-no-cycle] error from ESLint.

To avoid these errors, use [type-only imports][type-only-imports]:

```typescript
import type User from "./user";
```

### A Note About Open Types

When accessing `this.belongsTo` or `this.hasMany` from within a model, you'll need to pass the relationship `Model` type and the string key as generics, like so:

```ts {data-filename="app/models/user.ts"}
import Model, { hasMany, AsyncHasMany } from "@ember-data/model";
import type Post from "./post";
import type { Type } from "@warp-drive/core-types/symbols";

export default class User extends Model {
  @hasMany<Post>("post", { async: true, inverse: "author" })
  declare posts: AsyncHasMany<Post>;

  get postIdList(): string[] {
    return this.hasMany<Post, "posts">("posts").ids();
  }

  declare [Type]: "user";
}
```

The reason is that `this.belongsTo` and `this.hasMany` will infer an 'open' type for `this`, meaning that `this` can still be modified. For this reason, it's not able to index the keys of the model. As a workaround, pass in the 'concrete' or `closed` type for proper resolution.

## Transforms

In EmberData, `@attr` defines an [attribute on a Model][model-attrs]. By default, attributes are passed through as-is, however you can specify an optional type to have the value automatically transformed. EmberData ships with four basic transform types: `string`, `number`, `boolean` and `date`.

EmberData [Transforms][transform-guides] are normal TypeScript classes. The return type of `deserialize` method becomes type of the model class property.

Transforms with a `Type` brand will have their type and options validated.

### Example: Typing a Transform

```ts {data-filename="app/transforms/big-int.ts"}
import type { Type } from "@warp-drive/core-types/symbols";

export default class BigIntTransform {
  deserialize(serialized: string): BigInt | null {
    return !serialized || serialized === "" ? null : BigInt(serialized + "n");
  }
  serialize(deserialized: BigInt | null): string | null {
    return !deserialized ? null : String(deserialized);
  }

  declare [Type]: "big-int";

  static create() {
    return new this();
  }
}
```

### Example: Using Transforms

```ts {data-filename="app/models/user.ts"}
import Model, { attr } from "@ember-data/model";
import type { StringTransform } from "@ember-data/serializer/transforms";
import type { Type } from "@warp-drive/core-types/symbols";

export default class User extends Model {
  @attr<StringTransform>("string") declare name: string;

  declare [Type]: "user";
}
```

## Serializers and Adapters

EmberData serializers and adapters are normal TypeScript classes.

```typescript {data-filename="app/serializers/user-meta.ts"}
import Serializer from "@ember-data/serializer";

export default class UserMeta extends Serializer {}
```

```typescript {data-filename="app/adapters/user.ts"}
import Adapter from "@ember-data/adapter";

export default class User extends Adapter {}
```

## Adding EmberData Types to an Existing TypeScript App

The process for adding EmberData types to an existing TypeScript app is a work in progress. You can find the latest docs in the [EmberData repository][ED-ts-guides].

<!-- Internal links -->

[decorator]: ../../additional-resources/gotchas/#toc_decorators
[ED-guides]: ../../../models/
[model-attrs]: ../../../models/defining-models/
[transforms]: ./#toc_transforms
[transform-guides]: ../../../models/defining-models/#toc_custom-transforms

<!-- External links -->

[brand]: https://github.com/emberjs/data/blob/main/guides/typescript/2-why-brands.md
[ED-api-docs]: https://api.emberjs.com/ember-data/release
[ED-ts-guides]: https://github.com/emberjs/data/blob/main/guides/typescript/index.md
[import-no-cycle]: https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md
[optional]: https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties
[transform-api-docs]: https://api.emberjs.com/ember-data/release/classes/Transform
[type-only-imports]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html


---

In the next sections, we will cover how to use TypeScript effectively with specific Ember.js APIs.

We do _not_ cover general usage of Ember; instead, we assume that as background knowledge. Please see other sections of the [Ember Guides][ember-guides] and [API docs][api-docs]!

<!-- Internal links -->

[ember-guides]: ../../

<!-- External links -->

[api-docs]: https://api.emberjs.com


---

In Ember templates, **“invokables”** are things you can _invoke_ in a template. These include [components][], [helpers][], and [modifiers][].

The same way that functions have [signatures][fn-sig] which define the arguments they take and the values they return, so do Ember template invokables.

In this chapter, we will walk through how to use TypeScript with each type of invokable. But first, we'll discuss signatures in more detail.

## Signature Basics

Ember template invokables have a shared set of potential API features, each of which is captured in the signature:

- `Args`—the arguments the invokable accepts (which may be positional or named)
- `Return`—the value(s) the invokable returns
- `Blocks`—the block(s) yielded by the invokable
- `Element`—the element associated with the invokable

```typescript
interface InvokableSignature {
  Args?: {
    Positional?: Array<unknown>;
    Named?: {
      [argName: string]: unknown;
    };
  };
  Return?: unknown;
  Blocks?: {
    [blockName: string]: {
      Params?: {
        Positional?: Array<unknown>;
      };
    };
  };
  Element?: Element | null;
}
```

Ember uses the signature to provide both editor support for the invokable with TypeScript and [Glint][] and documentation using any tool which understands type annotations or JSDoc.

A few things to note about these signatures:

First, while you _can_ write a full signature like this for any invokable, you never _need_ to. Different kinds of invokables care about different subsets of this set of features:

- Helpers may have arguments and return values, but do not yield blocks and do not have an associated element.
- Components may have arguments, blocks, and an associated element, but never return values.
- Modifiers may have arguments and always have an associated element, but do not return values or have blocks.
- Accordingly, we supply simpler forms of signatures appropriate to each type of invokable.

Second, any given component, modifier, or helper may only use a subset of the items it _can_ use, so many signatures will be even simpler.

And last, a signature can be defined in both TypeScript types and JSDoc annotations. The examples below will show each.

## Glimmer Components

Glimmer Components are defined in one of three ways:

- with templates only,
- with a template and a backing class,
- or with only a backing class (i.e. a [provider component][provider-component]).

As always, you should start by reading and understanding the [Ember Guide on Components][components]!

When using a backing class, you get a first-class experience using TypeScript with a component signature. For type-checking Glimmer templates as well, see [Glint][].

The normal form of a Glimmer component signature is:

```typescript
interface ComponentSignature {
  Args: {
    [argName: string]: unknown;
  };
  Blocks: {
    [blockName: string]: Array<unknown>;
  };
  Element: Element;
}
```

This signature handles all aspects of a Glimmer component: its arguments, any blocks it yields, and the element to which it will apply `...attributes`.

For example, consider the `AudioPlayer` described in the
[Communicating Between Elements in a Component][audio-player-section] of the [Template Lifecycle, DOM, and Modifiers guide][modifiers].

There, we defined component which accepted a `srcUrl` argument and used a `play-when` modifier to manage the behavior of the element:

```typescript {data-filename="app/components/audio-player.ts"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AudioPlayer extends Component {
  @tracked isPlaying = false;

  @action
  play() {
    this.isPlaying = true;
  }

  @action
  pause() {
    this.isPlaying = false;
  }
}
```

```handlebars {data-filename="app/components/audio-player.hbs"}
<audio src={{@srcURL}} {{play-when this.isPlaying}} />

<button type='button' {{on 'click' this.play}}>Play</button>
<button type='button' {{on 'click' this.pause}}>Pause</button>
```

What elements do we need to build a signature for this component?

- It takes a single argument, the `srcUrl` for the `audio` element.
- It does not use `...attributes`, so it does not need an `Element`.
- It does not yield any blocks, so it also does not need `Blocks`.

We can define a signature with those `Args` on it and apply it to the component definition by adding it as a type parameter to the `extends Component` clause:

```typescript {data-filename="app/components/audio-player.ts" data-diff="+5,+6,+7,+8,+9,+10,+11,-12,+13"}
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

interface AudioPlayerSignature {
  Args: {
    /** The url for the audio to be played */
    srcUrl: string;
  };
}

export default class AudioPlayer extends Component {
export default class AudioPlayer extends Component<AudioPlayerSignature> {
  @tracked isPlaying = false;

  @action
  play() {
    this.isPlaying = true;
  }

  @action
  pause() {
    this.isPlaying = false;
  }
}
```

Now, let's expand on this example to give callers the ability to apply attributes to the audio element with an `Element`:

```typescript {data-filename="app/components/audio-player.ts" data-diff="+10"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface AudioPlayerSignature {
  Args: {
    /** The url for the audio to be played */
    srcUrl: string;
  };
  Element: HTMLAudioElement;
}

export default class AudioPlayer extends Component<AudioPlayerSignature> {
  @tracked isPlaying = false;

  @action
  play() {
    this.isPlaying = true;
  }

  @action
  pause() {
    this.isPlaying = false;
  }
}
```

```handlebars {data-filename="app/components/audio-player.hbs" data-diff="-1,+2"}
<audio src={{@srcURL}} {{play-when this.isPlaying}} />
<audio ...attributes src={{@srcURL}} {{play-when this.isPlaying}} />

<button type='button' {{on 'click' this.play}}>Play</button>
<button type='button' {{on 'click' this.pause}}>Pause</button>
```

We can also let the user provide a fallback for the case where the audio element does not load, using the default block. We have to name the default block explicitly in the new `Blocks` type we add to our signature. Since blocks yield out a list of items, we can use a [tuple type][tuple] to represent them. In this case, we will just yield out the same URL we loaded, to let the caller use it for the fallback.

```typescript {data-filename="app/components/audio-player.ts" data-diff="+10,+11,+12"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface AudioPlayerSignature {
  Args: {
    /** The url for the audio to be played */
    srcUrl: string;
  };
  Blocks: {
    default: [srcUrl: string];
  };
  Element: HTMLAudioElement;
}

export default class AudioPlayer extends Component<AudioPlayerSignature> {
  @tracked isPlaying = false;

  @action
  play() {
    this.isPlaying = true;
  }

  @action
  pause() {
    this.isPlaying = false;
  }
}
```

```handlebars {data-filename="app/components/audio-player.hbs" data-diff="-1,+2,+3,+4"}
<audio ...attributes src={{@srcURL}} {{play-when this.isPlaying}} />
<audio ...attributes src={{@srcURL}} {{play-when this.isPlaying}}>
  {{yield @srcUrl}}
</audio>

<button type='button' {{on 'click' this.play}}>Play</button>
<button type='button' {{on 'click' this.pause}}>Pause</button>
```

Let's go one step further and switch to supporting for two [named blocks][named-blocks]: an optional `title` block for a caption for the audio element, and a `fallback` block for the audio fallback where we previously used a `default` block.

```handlebars {data-filename="app/components/audio-player.hbs" data-diff="+1,+2,+3,+4,+5,-7,+8"}
<figure>
  {{#if (has-block 'title')}}
    <figcaption>{{yield to='title'}}</figcaption>
  {{/if}}

  <audio ...attributes src={{@srcUrl}} {{play-when this.isPlaying}}>
    {{yield @srcUrl}}
    {{yield @srcUrl to='fallback'}}
  </audio>
</figure>

<button type='button' {{on 'click' this.play}}>Play</button>
<button type='button' {{on 'click' this.pause}}>Pause</button>
```

To represent this, we will update the `default` block to be named `fallback` instead and add the `title` block. We do not yield anything to the `title` block, so we use an empty tuple, `[]`, to represent it.

```typescript {data-filename="app/components/audio-player.ts" data-diff="-11,+12,+13"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface AudioPlayerSignature {
  Args: {
    /** The url for the audio to be played */
    srcUrl: string;
  };
  Blocks: {
    default: [srcUrl: string];
    fallback: [srcUrl: string];
    title: [];
  };
  Element: HTMLAudioElement;
}

export default class AudioPlayer extends Component<AudioPlayerSignature> {
  @tracked isPlaying = false;

  @action
  play() {
    this.isPlaying = true;
  }

  @action
  pause() {
    this.isPlaying = false;
  }
}
```

### Types in JavaScript with JSDoc

When working in JavaScript, we can provide the exact same information using JSDoc comments. Here is how our final component definition would look if it were written in JavaScript rather than TypeScript, and using comments for this documentation information:

```js {data-filename="app/components/audio-player.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

/**
 * @typedef AudioPlayerSignature
 * @property {AudioPlayerArgs} Args
 * @property {AudioPlayerBlocks} Blocks
 * @property {HTMLAudioElement} Element
 */

/**
 * @typedef AudioPlayerArgs
 * @property {string} src
 */

/**
 * @typedef AudioPlayerBlocks
 * @property {[srcUrl: string]} audio
 * @property {[]} title
 */

/**
 * @extends Component<AudioPlayerSignature>
 */
export default class AudioPlayer extends Component {
  @tracked isPlaying = false;

  @action
  play() {
    this.isPlaying = true;
  }

  @action
  pause() {
    this.isPlaying = false;
  }
}
```

## Classic Ember Components

See ["Working With Ember Classic"][classic-components].

## Helpers

Helpers in Ember are just functions or classes with a well-defined interface, which means they largely Just Work™ with TypeScript. However, there are a couple things you'll want to watch out for.

(As always, you should start by reading and understanding the [Ember Guide on Helpers][helpers]!)

The signature for a helper includes its named and/or positional arguments and its return type:

```typescript
interface HelperSignature {
  Args?: {
    Positional?: Array<unknown>;
    Named?: {
      [argName: string]: unknown;
    };
  };
  Return?: unknown;
}
```

### Function-based helpers

You never have to write a signature when working with function-based helpers—whether using a standalone function as a helper or using the legacy `helper()` definition. Instead, you can write a function definition as usual, providing types and documentation for its arguments and return types the way you would any other function. Tools like Glint and documentation generators can synthesize all the information required from those definitions, and in general work _better_ with normal function definitions than with signatures for function-based helpers.

For example, you might define a `parseInt` helper like this using a normal function:

- In TypeScript:

      ```typescript {data-filename="app/helpers/parse-int.ts"}
      /**
       * @param value - the value to parse
       * @param options - how to parse the value
       */
      function parseInt(value: string, options: { radix?: number }): number {
        let radix = options?.radix ?? 10;
        return Number.parseInt(value, radix);
      }
      ```

- With JSDoc:

      ```js {data-filename="app/helpers/parse-int.js"}
      /**
       * @param {string} value - the value to parse
       * @param {{ radix?: number }} named - how to parse the value
       * @returns {number}
       */
      export default function parseInt(value, named) {
        let radix = named?.radix ?? 10;
        return Number.parseInt(value, radix);
      }
      ```

Using `helper()`, you would define it very similarly:

- In TypeScript:

      ```typescript {data-filename="app/helpers/parse-int.ts"}
      import { helper } from '@ember/component/helper';

      export default helper(function parseInt(
        positional: [string],
        named: { radix?: number }
      ): number {
        let value = positional[0];
        let radix = named.radix ?? 10;
        return Number.parseInt(value, radix);
      });
      ```

- With JSDoc:

      ```typescript {data-filename="app/helpers/parse-int.js"}
      import { helper } from '@ember/component/helper';

      export default helper(
        /**
         * @param {string} value - the value to parse
         * @param {{ radix?: number }} named - how to parse the value
         * @returns {number}
         */
        function parseInt(positional, named): number {
          let value = positional[0];
          let radix = named.radix ?? 10;
          return Number.parseInt(value, radix);
        }
      );
      ```

For completeness and backwards-compatibility, helpers defined with `helper()` do accept signatures as a type parameter as well. The `parseInt` helper might look like this if using an explicit signature:

```typescript {data-filename="app/helpers/parse-int.ts"}
import { helper } from '@ember/component/helper';

interface ParseIntSignature {
  Args: {
    Positional: [
      /** The value to parse */
      string
    ];
    Named: {
      /** The radix to use when parsing the value */
      radix?: number;
    };
  };
  Return: number;
}

export default helper<ParseIntSignature>(function parseInt(positional, named) {
  let value = positional[0];
  let radix = named.radix ?? 10;
  return Number.parseInt(value, radix);
});
```

However, you _cannot_ provide a signature for the `helper()` definition from with JSDoc. This is an additional reason to avoid signatures with function-based helpers, and to prefer using normal function declarations and definitions.

### Class-based helpers

Signatures are more useful for class-based helpers, where they are the only way to provide the type information for Glint/TypeScript.

Consider here a helper for formatting strings, which uses an injected `locale` service. (This kind of service injection is one of the main reasons to use a class-based helper.) Assume that the `locale` service has a `format` method which accepts a string to format and an optional locale override.

Our helper will accept the same arguments, so we will use it like this:

```handlebars
{{format 'some-string'}}
{{format 'some-string' localeOverride='en-GB'}}
```

```typescript {data-filename="app/helpers/format.ts"}
import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import type LocaleService from '../services/locale';

interface FormatSignature {
  Args: {
    Positional: [string];
    Named: {
      locale?: string;
    };
  };
  Return: string;
}

export default class Format extends Helper<FormatSignature> {
  @service declare locale: LocaleService;

  compute(positional: [string], named: { locale?: string }): string {
    let [value] = positional;
    return this.locale.format(value, { override: named.locale });
  }
}
```

Here, the arguments and return type for `compute` match the types in `Args` in `FormatSignature`.

You might be wondering: Given that we already have a signature, can TypeScript infer the types for the method from the signature, like it can for the `helper()` form?

```typescript
export default class Format extends Helper<FormatSignature> {
  @service declare locale: LocaleService;

  compute(positional, named): string {
    let [value] = positional;
    return this.locale.format(value, { override: named.locale });
  }
}
```

Unfortunately, TypeScript does not infer the types for class methods like this. As a result, we have to write out the full types for the method, and have to keep these definitions in sync manually.

From a type checking perspective, these types must be _compatible_ with the types in the signature, though they do not have to be identical. The rule for “compatibility” here is that your function signature types must be more general (“wider” in TypeScript terms) than the corresponding parts of the signature type.

<!-- TODO: Glint will type check that any types you write to make sure they are compatible. -->

For example, we could define the type of the positional arguments in the method body as `Array<unknown>` instead of `[string]`, while keeping the original signature's `Positional: [string]`:

```typescript
  compute(positional: Array<unknown>, named: { locale?: string }): string {
    // ...
  }
```

Because the signature set on the class, callers would still have to pass a single string argument, but we would need to change the behavior of the body to [narrow the type][narrowing] for the first item in the array.

Accordingly, the best practice is to keep the types matching.

## Modifiers

Modifiers in Ember are just functions or classes with a well-defined interface, which means they largely Just Work™ with TypeScript. However, there are a couple things you'll want to watch out for.

(As always, you should start by reading and understanding the [Ember Guide on Modifiers][modifiers]!)

The signature for a modifier consists of any named or positional arguments along with the kind of element it can be applied to. The arguments are optional, but the element is required.

```typescript
interface ModifierSignature {
  Args?: {
    Positional?: Array<unknown>;
    Named?: {
      [argName: string]: unknown;
    };
  };
  Element: Element;
}
```

### Function-based modifiers

Function-based modifiers do not require writing out a signature manually. Instead, you can—and should!—write the types directly on the function which defines them.

Using our `play-when` modifier example used with the `AudioPlayer` above, we might define the modifier like this:

- In TypeScript:

      ```typescript {data-filename="app/modifiers/play-when.ts"}
      import { modifier } from 'ember-modifier';

      export default modifier(function playWhen(
        element: HTMLAudioElement,
        positional: [shouldPlay: boolean]
      ): void {
        let [shouldPlay] = positional;
        if (shouldPlay) {
          element.play();
        } else {
          element.pause();
        }
      });
      ```

- With JSDoc:

      ```js {data-filename="app/modifiers/play-when.js"}
      import { modifier } from 'ember-modifier';

      export default modifier(
        /**
         * @param {HTMLAudioElement} element
         * @param {[shouldPlay: boolean]} positional
         */
        (element, positional): void => {
          let [shouldPlay] = positional;
          if (shouldPlay) {
            element.play();
          } else {
            element.pause();
          }
        }
      );
      ```

For the sake of backward compatibility and completeness, using a signature explicitly as a type parameter to `modifier()` is also supported. In that case, we could write the modifier like this:

```typescript {data-filename="app/modifiers/play-when.ts"}
import { modifier } from 'ember-modifier';

interface Signature {
  Args: {
    Positional: [shouldPlay: boolean];
  };
  Element: HTMLAudioElement;
}

export default modifier<Signature>((element, positional) => {
  let [shouldPlay] = positional;
  if (shouldPlay) {
    element.play();
  } else {
    element.pause();
  }
});
```

### Class-based modifiers

Signatures are more useful for class-based modifiers, where they are the only way to provide the type information for Glint/TypeScript. For example, when using `IntersectionObserver`s, you might want to improve your app's performance by observing (`.observe()`) multiple elements in the same `IntersectionObserver`, all coordinated by a service.

Given an `IntersectionObserverManager` service with an `observe` method, we might provide a signature defining `onEnter` and `onExit` callbacks and an `options` object to specify the `IntersectionObserver` options. Then we would supply the signature on the class definition with a type parameter to the super class. With all the pieces put together, we would have this:

```typescript {data-filename="app/modifiers/did-intersect.ts"}
import Modifier from 'ember-modifier';
import { service } from '@ember/service';
import type IntersectionObserverManager from '../services/intersection-observer-manager';

interface DidIntersectSignature {
  Args: {
    Named: {
      onEnter: (entry: IntersectionObserverEntry) => void;
      onExit: (entry: IntersectionObserverEntry) => void;
      options: IntersectionObserverInit;
    };
  };
  Element: Element;
}

export default class DidIntersect extends Modifier<DidIntersectSignature> {
  @service declare manager: IntersectionObserverManager;

  modify(el: Element, _: [], named: DidIntersectSignature['Args']['Named']) {
    let { onEnter, onExit, options } = named;
    this.manager.observe(el, options, { onEnter, onExit });
  }
}
```

Notice that we can just skip the positional arguments entirely in this case, and give them a name like `_` to indicate we are doing nothing with it. If we had positional arguments, we would supply them like normal.

## Advanced signature techniques

We can also define signatures in more complicated ways using more advanced TypeScript features.
Nearly anything you can do with a “regular” TypeScript function or class, you can also do with signatures for Glimmer invokables.
We can make a component accept a [generic][generic] type, or use [union][union] types.
With these tools at our disposal, we can even define our signatures to [make illegal states un-representable][illegal].

To see this in practice, consider a list component which yields back out instances of the same type it provides, and provides the appropriate element target based on a `type` argument.
Yielding back out the same type passed in will use generics, and providing an appropriate element target for `...attributes` can use a union type.

Here is how that might look, using a class-backed component rather than a template-only component, since the only places TypeScript allows us to name new generic types are on functions and classes:

```typescript
import Component from '@glimmer/component';

interface OrderedList<T> {
  Args: {
    items: Array<T>;
    type: 'ordered';
  };
  Blocks: {
    default: [item: T];
  };
  Element: HTMLOListElement;
}

interface UnorderedList<T> {
  Args: {
    items: Array<T>;
    type: 'unordered';
  };
  Blocks: {
    default: [item: T];
  };
  Element: HTMLUListElement;
}

type ListSignature<T> = OrderedList<T> | UnorderedList<T>;

export default class List<T> extends Component<ListSignature<T>> {
  <template>
    {{#if (isOrdered @type)}}
      <ol ...attributes>
        {{#each @items as |item|}}
          <li>{{yield item}}</li>
        {{/each}}
      </ol>
    {{else}}
      <ul ...attributes>
        {{#each @items as |item|}}
          <li>{{yield item}}</li>
        {{/each}}
      </ul>
    {{/if}}
  </template>
}

function isOrdered(type: 'ordered' | 'unordered'): type is 'ordered' {
  return type === 'ordered';
}
```

If you are using Glint, when this component is invoked, the `@type` argument will determine what kinds of modifiers are legal to apply to it. For example, if you defined a modifier `reverse` which required an `HTMLOListElement`, this invocation would be rejected:

```handlebars
<List @items={{array 1 2 3}} @type='unordered' {{reverse}} as |item|>
  The item is
  {{item}}.
</List>
```

The same approach with generics works for class-based helpers and class-based modifiers.
Function-based helpers and modifiers can also use generics, but by using them on the function definition rather than via a signature.
One caveat: particularly complicated union types in signatures can sometimes become too complex for Glint/TypeScript to resolve when invoking in a template.
In those cases, your best bet is to find a simpler way to structure the types while preserving type safety.

<!-- Internal links -->

[audio-player-section]: ../../../components/template-lifecycle-dom-and-modifiers/#toc_communicating-between-elements-in-a-component
[classic-components]: ../../additional-resources/legacy/#toc_classic-ember-components
[components]: ../../../components/introducing-components/
[helpers]: ../../../components/helper-functions/
[modifiers]: ../../../components/template-lifecycle-dom-and-modifiers/
[named-blocks]: ../../../components/block-content/
[provider-component]: ../../../tutorial/part-2/provider-components/

<!-- External links -->

[fn-sig]: https://developer.mozilla.org/en-US/docs/Glossary/Signature/Function
[generic]: https://www.typescriptlang.org/docs/handbook/2/generics.html
[glint]: https://github.com/typed-ember/glint
[illegal]: https://v5.chriskrycho.com/journal/making-illegal-states-unrepresentable-in-ts/
[narrowing]: http://www.typescriptlang.org/docs/handbook/2/narrowing.html
[tuple]: https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
[union]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types


---

## Routes

Since Ember [Routes][] are just regular JavaScript classes with a few special Ember lifecycle hooks and properties available, TypeScript should "Just Work." Ember's types supply the definitions for the various methods available within route subclasses, which will provide autocomplete and type-checking along the way.

## Controllers

Like routes, [Controllers][] are just normal JavaScript classes with a few special Ember lifecycle hooks and properties available.

The main thing to be aware of is special handling around query params. In order to provide type safety for query param configuration, Ember's types specify that when defining a query param's `type` attribute, you must supply one of the allowed types: `'boolean'`, `'number'`, `'array'`, or `'string'` (the default). However, if you supply these types as you would in JS, like this:

```typescript {data-filename="app/controllers/my.ts"}
import Controller from '@ember/controller';

export default class MyController extends Controller {
  queryParams = [
    {
      category: { type: 'array' },
    },
  ];
}
```

Then you will see a type error like this:

```text
Property 'queryParams' in type 'MyController' is not assignable to the same property in base type 'Controller'.
  Type '{ category: { type: string; }; }[]' is not assignable to type '(string | Record<string, string | QueryParamConfig | undefined>)[]'.
    Type '{ category: { type: string; }; }' is not assignable to type 'string | Record<string, string | QueryParamConfig | undefined>'.
      Type '{ category: { type: string; }; }' is not assignable to type 'Record<string, string | QueryParamConfig | undefined>'.
        Property 'category' is incompatible with index signature.
          Type '{ type: string; }' is not assignable to type 'string | QueryParamConfig | undefined'.
            Type '{ type: string; }' is not assignable to type 'QueryParamConfig'.
              Types of property 'type' are incompatible.
                Type 'string' is not assignable to type '"string" | "number" | "boolean" | "array" | undefined'.ts(2416)
```

This is because TS currently infers the type of `type: "array"` as `type: string`. You can work around this by supplying [`as const`][const-assertions] after the declaration:

```typescript {data-filename="app/controllers/my.ts", data-diff="-6,+7"}
import Controller from '@ember/controller';

export default class MyController extends Controller {
  queryParams = [
    {
      category: { type: 'array' },
      category: { type: 'array' as const },
    },
  ];
}
```

Now it will type-check.

## Working with Route Models

We often use routes' models throughout our application, since they're a core ingredient of our application's data. As such, we want to make sure that we have good types for them!

We can start by defining a type utility to let us get the resolved value returned by a route's model hook:

```typescript {data-filename="app/lib/type-utils.ts"}
import type Route from '@ember/routing/route';

/** Get the resolved model value from a route. */
export type ModelFrom<R extends Route> = Awaited<ReturnType<R['model']>>;
```

How that works:

- [`Awaited<P>`][awaited] says "if this is a promise, the type here is whatever the promise resolves to; otherwise, it's just the value"
- [`ReturnType<T>`][return-type] gets the return value of a given function
- `R['model']` (where `R` has to be `Route` itself or a subclass) says "the property named `model` on Route `R`"

`ModelFrom<Route>` ends up giving you the resolved value returned from the `model` hook for a given route. We can use this functionality to guarantee that the `model` on a `Controller` is always exactly the type returned by `Route::model` by writing something like this:

```typescript {data-filename="app/controllers/controller-with-model.ts"}
import Controller from '@ember/controller';
import MyRoute from 'my-app/routes/my-route';
import { ModelFrom } from 'my-app/lib/type-utils';

export default class ControllerWithModel extends Controller {
  declare model: ModelFrom<MyRoute>;
}
```

Now, our controller's `model` property will _always_ stay in sync with the corresponding route's model hook.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
        The <code>ModelFrom</code> type utility <i>only</i> works if you do not mutate the <code>model</code> in either the <code>afterModel</code> or <code>setupController</code> hooks on the route! That's generally considered to be a bad practice anyway.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Controller Injections and Lookups

If you are using controller injections via the `@inject` decorator from `@ember/controller`, see the ["Decorators"][decorators] documentation.

If you need to lookup a controller with `Owner.lookup`, you'll need to first register your controller in Ember's TypeScript Controller registry as described in ["Registries"][registries]:

```typescript {data-filename="app/controllers/my.ts"}
import Controller from '@ember/controller';

export default class MyController extends Controller {
  //...
}

declare module '@ember/controller' {
  interface Registry {
    my: MyController;
  }
}
```

<!-- Internal links -->

[controllers]: ../../../routing/controllers/
[decorators]: ../../additional-resources/gotchas/#toc_decorators
[registries]: ../../additional-resources/gotchas/#toc_registries
[routes]: ../../../routing/defining-your-routes/

<!-- External links -->

[awaited]: https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype
[const-assertions]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
[return-type]: https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype


---

Ember [Services][] are global singleton classes that can be made available to different parts of an Ember application via dependency injection. Due to their global, shared nature, writing services in TypeScript gives you a build-time-enforceable API for some of the most central parts of your application.

## A Basic Service

Let's take this example from elsewhere in the [Ember Guides][example-location]:

```typescript {data-filename="app/services/shopping-cart.ts"}
import Service from '@ember/service';
import { TrackedSet } from 'tracked-built-ins';

export default class ShoppingCartService extends Service {
  items = new TrackedSet();

  add(item) {
    this.items.add(item);
  }

  remove(item) {
    this.items.remove(item);
  }

  empty() {
    this.items.clear();
  }
}
```

Just making this a TypeScript file gives us some type safety without having to add any additional type information. We'll see this when we use the service elsewhere in the application.

## Using Services

Ember looks up services with the `@service` decorator at runtime, using the name of the service being injected as the default value—a clever bit of metaprogramming that makes for a nice developer experience. TypeScript cannot do this, because the name of the service to inject isn't available at compile time in the same way.

Since legacy decorators do not have access to enough information to produce an appropriate type by themselves, we need to import and add the type explicitly. Also, we must use the [`declare`][declare] property modifier to tell the TypeScript compiler to trust that this property will be set up by something outside this component—namely, the decorator. (Learn more about using Ember's decorators with TypeScript [here][decorators].) Here's an example using the `ShoppingCartService` we defined above in a component:

```typescript {data-filename="app/components/cart-contents.ts"}
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

import ShoppingCartService from 'my-app/services/shopping-cart';

export default class CartContentsComponent extends Component {
  @service declare shoppingCart: ShoppingCartService;

  @action
  remove(item) {
    this.shoppingCart.remove(item);
  }
}
```

Any attempt to access a property or method not defined on the service will fail type-checking:

```typescript {data-filename="app/components/cart-contents.ts"}
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

import ShoppingCartService from 'my-app/services/shopping-cart';

export default class CartContentsComponent extends Component {
  @service declare shoppingCart: ShoppingCartService;

  @action
  remove(item) {
    // Error: Property 'saveForLater' does not exist on type 'ShoppingCartService'.
    this.shoppingCart.saveForLater(item);
  }
}
```

Services can also be loaded from the dependency injection container manually:

```typescript {data-filename="app/components/cart-contents.ts"}
import Component from '@glimmer/component';
import { getOwner } from '@ember/owner';
import { action } from '@ember/object';

export default class CartContentsComponent extends Component {
  get cart() {
    return getOwner(this)?.lookup('service:shopping-cart');
  }

  @action
  remove(item) {
    this.cart.remove(item);
  }
}
```

In order for TypeScript to infer the correct type for the `ShoppingCartService` from the call to `Owner.lookup`, we must first [register][registries] the `ShoppingCartService` type with `declare module`:

```typescript {data-filename="app/services/shopping-cart.ts"}
export default class ShoppingCartService extends Service {
  //...
}

declare module '@ember/service' {
  interface Registry {
    'shopping-cart': ShoppingCartService;
  }
}
```

<!-- Internal links -->

[example-location]: ../../../services/#toc_defining-services
[decorators]: ../../additional-resources/gotchas/#toc_decorators
[registries]: ../../additional-resources/gotchas/#toc_registries
[services]: ../../../services/

<!-- External links -->

[declare]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier


---

---
redirect: upgrading/current-edition
---


---

---
redirect: upgrading/current-edition
---


---

---
redirect: upgrading/current-edition
---


---

Octane is Ember's current edition.

The next edition, which is a work-in-progress, is called [Polaris](https://emberjs.com/editions/polaris/).

## How do I migrate to Octane?

If you have an older app that you are trying to upgrade, there is a [step by step guide in an earlier version of the Ember Guides](/v5.12.0/upgrading/current-edition/).

If you are generating a new app, congratulations, you are already using Ember Octane! Follow the [Quick start and Tutorials](https://emberjs.com/learn) to get started writing your Ember app.

## What is an edition?

Learn more about Editions and upcoming major development of Ember in our [Editions page](https://emberjs.com/editions/).

## What is Ember Octane?

Octane, Ember's first Edition, was [released in December 2019](https://blog.emberjs.com/ember-3-15-released)

Ember Octane introduced a programming model in Ember that brought major gains in productivity and performance, incrementally via a series of minor (non-breaking) releases.
This allows for new apps to have the best features enabled automatically, while teams working on existing apps can migrate over time and continue updating their app's dependency versions.

To learn more about the Octane Edition, visit [the Octane Edition page](https://emberjs.com/editions/octane/).


---

---
redirect: upgrading/current-edition
---


---

---
redirect: upgrading/current-edition
---


---

---
redirect: upgrading/current-edition
---


---

