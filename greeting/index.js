"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("../common/Action");
const utils_1 = require("../common/utils");
const issueMessage = utils_1.getRequiredInput('issue-message');
class Greeting extends Action_1.Action {
    constructor() {
        super(...arguments);
        this.id = 'Greeting';
    }
    async onOpened(issue) {
        await issue.postComment(issueMessage);
        issue.getIssue;
    }
}
new Greeting().run(); // eslint-disable-line
//# sourceMappingURL=index.js.map