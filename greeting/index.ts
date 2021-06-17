import { OctoKitIssue } from '../api/octokit'
import { Action } from '../common/Action'
import { getRequiredInput } from '../common/utils';

const issueMessage = getRequiredInput('issue-message')

class Greeting extends Action {
	id = 'EnglishPlease'

	async onOpened(issue: OctoKitIssue) {
		await issue.postComment(issueMessage)
	}
}

new Greeting().run() // eslint-disable-line
