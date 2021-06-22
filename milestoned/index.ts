import { OctoKitIssue } from '../api/octokit'
import { Action } from '../common/Action'
import { getRequiredInput, safeLog } from '../common/utils'

const milestoneId = +getRequiredInput('milestoneId')

class Milestoned extends Action {
	id = 'Milestoned'

	async onMilestoned(issue: OctoKitIssue) {
		const content = await issue.getIssue()
		if (content.milestoneId === milestoneId) {
			safeLog(`got a milestoned ${content.milestoneId} issue`)
		}
	}
}

new Milestoned().run() // eslint-disable-line
