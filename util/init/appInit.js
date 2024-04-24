const refreshTokenService = require('../../service/refreshTokenService');

const init = async () => {
    await refreshTokenService.neutralizeRefreshToken();
}

module.exports = {
    init
}