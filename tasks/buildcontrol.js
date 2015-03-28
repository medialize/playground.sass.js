module.exports = {
	options: {
		dir: 'dist',
		commit: true,
		message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
	},
	ghpages: {
		remote: 'git@github.com:varemenos/sass.js-playground.git',
		branch: 'gh-pages'
	}
};
