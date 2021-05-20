# Contributing

The League of Extraordinary Foundry VTT Developers needs your help maintaining this community module! Feel free to reach out on our [Discord server](https://discord.gg/W4jxqrJtAT) if you'd like to learn more about how you can contribute.

## Installing Dependencies

From the root of this project, run the following to set up development environment:

```
npm install
```

## Linting

This project leverages `prettier` and `eslint`.

```
npm run lint
```

## Compiling the CSS

From the root of this project, run the following to rebuild `swade-community-sheet.css`:

```
npm run css
```

With the Gulp CLI installed, you can engage watch mode by simply running `gulp` from the root of the project.

## Release

To release a new version, this repository leverages Github Actions to construct a module.json and module.zip and attach those to a created Github Release. Simply create a new release from the Github UI and all the rest will be handled for you. For more information, check out the documentation [here](https://github.com/League-of-Foundry-Developers/FoundryVTT-Module-Template).

The benefits of this setup are explained in detail on the [Foundry Wiki](https://foundryvtt.wiki/en/development/guides/releases-and-history).

## Pull Requests are welcome!
