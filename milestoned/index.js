"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("../common/Action");
const utils_1 = require("../common/utils");
const milestoneId = +utils_1.getRequiredInput('milestoneId');
class Milestoned extends Action_1.Action {
    constructor() {
        super(...arguments);
        this.id = 'Milestoned';
    }
    async onMilestoned(issue) {
        const content = await issue.getIssue();
        if (content.milestoneId === milestoneId) {
            const accounts = utils_1.getAccounts();
            utils_1.safeLog(`got a milestoned ${content.milestoneId} ${accounts.x} issue`);
        }
    }
}
new Milestoned().run(); // eslint-disable-line
//# sourceMappingURL=index.js.map