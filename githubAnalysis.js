const fs = require('fs')
const _ = require('lodash')
const moment = require('moment')
const graphqlClient = require('graphql-client')

let endCursor
let stream

let client = graphqlClient({
	url: 'https://api.github.com/graphql',
	headers: {
		Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
	}
})

module.exports.call = async (ownerName, repoName) => {
	stream = fs.createWriteStream(`${repoName}.csv`)
	writeDataLine('Number,State,Created,Closed,Minutes')
	let response
	let hasNextPage = true
	let processedCount = 0
	let timestampFormat = 'YYYY-MM-DD HH:mm:ss'
	while (hasNextPage) {
		try {
			response = await client.query(getQuery(ownerName, repoName))
		} catch (e) {
			console.log(`Error: ${e}`)
		}
		response = response.data.search
		hasNextPage = response.pageInfo.hasNextPage
		endCursor = response.pageInfo.endCursor
		nodes = response.nodes

		_.forEach(nodes, node => {
			processedCount++
			createdAt = moment(node.createdAt)
			closedAt = moment(node.closedAt)
			writeDataLine(`${node.number},${node.state},${createdAt.format(timestampFormat)},${closedAt.format(timestampFormat)},${closedAt.diff(createdAt,'minutes')}`)
		})
	}
	console.log(`Processed ${processedCount} of ${response.repositoryCount} elements.`)
	stream.end()
}

let writeDataLine = line => {
	stream.write(line + "\n")
}

let getQuery = (ownerName, repoName) => {
	const postData = `
	{
		search(first: 20, ${getAfter()}type: ISSUE, query: "repo:${ownerName}/${repoName} created:2018-01-01..2018-03-15") {
			repositoryCount
			pageInfo {
				hasNextPage
				endCursor
			}
			nodes {
				... on PullRequest {
					number
					createdAt
					closedAt
					state
				}
			}
		}
	}`
	return postData
}

let getAfter = () => {
	console.log(`Getting page ${endCursor}`)
	return endCursor ? `after: "${endCursor}", ` : ''
}
