import { OctoKit, OctoKitIssue } from '../api/octokit'
import { Action } from '../common/Action'
import { getRequiredInput, safeLog } from '../common/utils';

const label = getRequiredInput('label')
const closeDays = +getRequiredInput('close-days')
const closeMessage = getRequiredInput('close-message')

class Stale extends Action {
	id = 'Greeting'

	async onTriggered(github: OctoKit) {
	
		const query = `label:"${label}" is:open is:unlocked`
	
		for await (const page of github.query({ q: query })) {
			for (const issue of page) {
				const hydrated = await issue.getIssue()
				const lastCommentIterator = await issue.getComments(true).next()
				if (lastCommentIterator.done) {
					throw Error('Unexpected comment data')
				}
				const lastComment = lastCommentIterator.value[0]

				if (
					hydrated.open &&
					hydrated.labels.includes(label)
				) {
					if (!lastComment) {
						if (lastComment) {
							safeLog(`Last comment on ${hydrated.number} by team. Closing.`)
						} else {
							safeLog(`No comments on ${hydrated.number}. Closing.`)
						}
						if (closeMessage) {
							await issue.postComment(closeMessage)
						}
						await issue.closeIssue()
					} else {
						if (true) {
							safeLog(
								`Last comment on ${hydrated.number} by ${lastComment.author}.`,
							)
							await issue.closeIssue()
						} else {
							// safeLog(
							// 	`Last comment on ${hydrated.number} by rando. Skipping.${
							// 		hydrated.assignee ? ' cc @' + hydrated.assignee : ''
							// 	}`,
							// )
						}
					}
				} else {
					// safeLog('Query returned an invalid issue:' + hydrated.number)
				}
			}
		}
	}
}

new Stale().run() // eslint-disable-line
