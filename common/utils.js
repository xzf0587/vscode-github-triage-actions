"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const github_1 = require("@actions/github");
const axios_1 = require("axios");
const fs = require("fs-extra");
const octokit_1 = require("../api/octokit");
exports.getInput = (name) => core.getInput(name) || undefined;
exports.getRequiredInput = (name) => core.getInput(name, { required: true });
exports.normalizeIssue = (issue) => {
    let { body, title } = issue;
    body = body !== null && body !== void 0 ? body : '';
    title = title !== null && title !== void 0 ? title : '';
    const isBug = body.includes('bug_report_template') || /Issue Type:.*Bug.*/.test(body);
    const isFeatureRequest = body.includes('feature_request_template') || /Issue Type:.*Feature Request.*/.test(body);
    const cleanse = (str) => {
        let out = str
            .toLowerCase()
            .replace(/<!--.*-->/gu, '')
            .replace(/.* version: .*/gu, '')
            .replace(/issue type: .*/gu, '')
            .replace(/vs ?code/gu, '')
            .replace(/we have written.*please paste./gu, '')
            .replace(/steps to reproduce:/gu, '')
            .replace(/does this issue occur when all extensions are disabled.*/gu, '')
            .replace(/!?\[[^\]]*\]\([^)]*\)/gu, '')
            .replace(/\s+/gu, ' ')
            .replace(/```[^`]*?```/gu, '');
        while (out.includes(`<details>`) &&
            out.includes('</details>') &&
            out.indexOf(`</details>`) > out.indexOf(`<details>`)) {
            out = out.slice(0, out.indexOf('<details>')) + out.slice(out.indexOf(`</details>`) + 10);
        }
        return out;
    };
    return {
        body: cleanse(body),
        title: cleanse(title),
        issueType: isBug ? 'bug' : isFeatureRequest ? 'feature_request' : 'unknown',
    };
};
exports.loadLatestRelease = async (quality) => (await axios_1.default.get(`https://update.code.visualstudio.com/api/update/darwin/${quality}/latest`)).data;
exports.daysAgoToTimestamp = (days) => +new Date(Date.now() - days * 24 * 60 * 60 * 1000);
exports.daysAgoToHumanReadbleDate = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().replace(/\.\d{3}\w$/, '');
exports.getRateLimit = async (token) => {
    const usageData = (await new github_1.GitHub(token).rateLimit.get()).data.resources;
    const usage = {};
    ['core', 'graphql', 'search'].forEach(async (category) => {
        usage[category] = 1 - usageData[category].remaining / usageData[category].limit;
    });
    return usage;
};
exports.errorLoggingIssue = (() => {
    try {
        const repo = github_1.context.repo.owner.toLowerCase() + '/' + github_1.context.repo.repo.toLowerCase();
        if (repo === 'microsoft/vscode' || repo === 'microsoft/vscode-remote-release') {
            return { repo: 'vscode', owner: 'Microsoft', issue: 93814 };
        }
        else if (/microsoft\//.test(repo)) {
            return { repo: 'vscode-internalbacklog', owner: 'Microsoft', issue: 974 };
        }
        else if (exports.getInput('errorLogIssueNumber')) {
            return { ...github_1.context.repo, issue: +exports.getRequiredInput('errorLogIssueNumber') };
        }
        else {
            return undefined;
        }
    }
    catch (e) {
        console.error(e);
        return undefined;
    }
})();
exports.logErrorToIssue = async (message, ping, token) => {
    // Attempt to wait out abuse detection timeout if present
    await new Promise((resolve) => setTimeout(resolve, 10000));
    const dest = exports.errorLoggingIssue;
    if (!dest)
        return console.log('no error logging repo defined. swallowing error.');
    return new octokit_1.OctoKitIssue(token, { owner: dest.owner, repo: dest.repo }, { number: dest.issue })
        .postComment(`
Workflow: ${github_1.context.workflow}

Error: ${message}

Issue: ${ping ? `${github_1.context.repo.owner}/${github_1.context.repo.repo}#` : ''}${github_1.context.issue.number}

Repo: ${github_1.context.repo.owner}/${github_1.context.repo.repo}

<!-- Context:
${JSON.stringify(github_1.context, null, 2)
        .replace(/<!--/gu, '<@--')
        .replace(/-->/gu, '--@>')
        .replace(/\/|\\/gu, 'slash-')}
-->
`);
};
exports.safeLog = (message, ...args) => {
    const clean = (val) => ('' + val).replace(/:|#/g, '');
    console.log(clean(message), ...args.map(clean));
};
exports.getAccounts = (() => {
    return fs.readJsonSync('../resource/accounts.json');
})();
//# sourceMappingURL=utils.js.map