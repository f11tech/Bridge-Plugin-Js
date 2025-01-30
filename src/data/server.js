const createGithubServer = require('./')
const { Octokit } = require("@octokit/rest");
const path = require('path');
const http = require('http');
const fs = require('fs');

const GITHUB_TOKEN = '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';  // Add your personal access token
const REPO_OWNER = 'f11tech';  // Add the repository owner
const REPO_NAME = 'Bridge-Plugin-Js';  // Add your repository name

// Read allowed users from users.json
const allowedUsers = JSON.parse(fs.readFileSync('users.json', 'utf8'));

function getGithubObject() {
    return new Octokit({ auth: GITHUB_TOKEN });
}

function getRepoOptions() {
    return {
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: 'heads/master'
    };
}

// Simple authentication middleware
function authenticateUser(email) {
    return allowedUsers.includes(email);
}

const server = http.createServer();

createGithubServer(getGithubObject(), getRepoOptions(), { authenticateUser })
    .listen(8080, () => console.log("Server running on http://localhost:8080"));
