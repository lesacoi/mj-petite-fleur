# mj-petite-fleur

Musical Juggling Website showing how to juggle "Petite Fleur"

## Information

This project uses:

-   [Typescript](https://www.typescriptlang.org/) to be able to use types in javascript.
-   [Vite](https://vitejs.dev/) for local production and bundling.
-   [pnpm](https://pnpm.io/) as the javascript packet manager.
-   [Threejs](https://threejs.org/) as 3D javascript library.
-   [ESLint](https://eslint.org/) as a Javascript / Typescript linter.
-   [Prettier](https://prettier.io/) as a Javascript / Typescript formatter.

## Local install (dev)

It is assumed you have pnpm installed on your machine. See the [installation page](https://pnpm.io/installation) in their documentation. The rest of the installation should also work with npm, although pnpm version locking isn't accessible to npm.

Simply fork this repository, and then use :

```
pnpm install
```

And _voilà_, all dependencies have been installed.

Command shortcuts (specified in `package.json`) are available to start the project locally :

```
pnpm dev
```

and to build the project :

```
pnpm build
```

### Note to VSCode users :

-   It is strongly advised to install the ESLint and Prettier extensions.
-   We use the so-called flat layout to configure ESLint's rules, which are not active by default in VSCode's ESLint extension. The `eslint.experimental.useFlatConfig` flag should be set to true.
-   We strongly advise to enable the `editor.formatOnSave` flag to automatically format a document on save.

## TODO

-   [Git hooks ?](https://prettier.io/docs/en/install#git-hooks)
-   [Confifurer les règles pour prettier](https://prettier.io/)
-   [Experience with vite to compile project](https://vitejs.dev/guide/)
-   React at some point ?

NB : There is an `index.html` file at root as Vite needs it as its main entry point. In that file, it also assumes the presence of /src/ before file imports, hence the weirdnesses. Find a better solution at some point ?
