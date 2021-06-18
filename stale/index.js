"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("../common/Action");
const utils_1 = require("../common/utils");
const label = utils_1.getRequiredInput('label');
const closeDays = +utils_1.getRequiredInput('close-days');
const closeMessage = utils_1.getRequiredInput('close-message');
class Stale extends Action_1.Action {
    constructor() {
        super(...arguments);
        this.id = 'Greeting';
    }
    async onTriggered(github) {
        const query = `label:"${label}" is:open is:unlocked`;
        for await (const page of github.query({ q: query })) {
            for (const issue of page) {
                const hydrated = await issue.getIssue();
                const lastCommentIterator = await issue.getComments(true).next();
                if (lastCommentIterator.done) {
                    throw Error('Unexpected comment data');
                }
                const lastComment = lastCommentIterator.value[0];
                if (hydrated.open &&
                    hydrated.labels.includes(label)) {
                    if (!lastComment) {
                        if (lastComment) {
                            utils_1.safeLog(`Last comment on ${hydrated.number} by team. Closing.`);
                        }
                        else {
                            utils_1.safeLog(`No comments on ${hydrated.number}. Closing.`);
                        }
                        if (closeMessage) {
                            await issue.postComment(closeMessage);
                        }
                        await issue.closeIssue();
                    }
                    else {
                        if (true) {
                            utils_1.safeLog(`Last comment on ${hydrated.number} by ${lastComment.author}.`);
                            await issue.closeIssue();
                        }
                        else {
                            // safeLog(
                            // 	`Last comment on ${hydrated.number} by rando. Skipping.${
                            // 		hydrated.assignee ? ' cc @' + hydrated.assignee : ''
                            // 	}`,
                            // )
                        }
                    }
                }
                else {
                    // safeLog('Query returned an invalid issue:' + hydrated.number)
                }
            }
        }
    }
}
new Stale().run(); // eslint-disable-line
//# sourceMappingURL=index.js.map