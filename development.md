Notes for development.

## Install

- Install NodeJS (>= 8.9).

```sh
# Set up this repository.

git clone git@github.com:vain0x/website.git website
cd website
npm install

# Configure Git.

git remote add gh-pages git@github.com:vain0x/vain0x.github.io.git
git branch release origin/release

# Check.
npm build
npm clean
```

## Deploy

```sh
# On master branch.

npm run deploy
```
