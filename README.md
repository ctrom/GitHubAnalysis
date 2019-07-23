# GitHub Analysis

[![Greenkeeper badge](https://badges.greenkeeper.io/ctrom/GitHubAnalysis.svg)](https://greenkeeper.io/)

Tools for querying GitHub for data and doing some simple analysis on that data.

I haven't taken the time to parameterize the code very well. You will probably want to modify the `postData` string in the `getQuery()` function of `githubAnalysis.js` and the `ownerName` and `repoName` in the `index.js`.

# How to run
1. Clone the repo
2. Fetch the dependencies with `npm i`
3. Run with `GITHUB_TOKEN=<YOUR GITHUB TOKEN HERE> npm start`
