import bump from 'release.js'

exports.preCommit = ({version}) => {
    bump({version, deploy})
}