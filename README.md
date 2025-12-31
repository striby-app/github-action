# github-action


function testParamsGetLastFinishedDeployment(): ActionParams {
	return {
		apiKey: 'test',
		operation: 'get-last-finished-deployment',
		payload: {
			environmentName: 'Development'
		}
	}
}

function testParamsStartDeployment(): ActionParams {
	return {
		apiKey: 'test',
		operation: 'start-deployment',
		payload: {
			environmentName: 'Development',
			branch: 'test',
			startCommit: 'test-start',
			endCommit: 'test-end',
			externalDeploymentId: 'external-id'
		}
	}
}

function testParamsUpdateDeployment(): ActionParams {
	return {
		apiKey: 'test',
		operation: 'update-deployment',
		payload: {
			environmentName: 'Development',
			status: 'none',
			externalDeploymentId: 'external-id'
		}
	}
}
