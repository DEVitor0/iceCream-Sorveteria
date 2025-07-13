const { validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const cleanErrorMessages = errors.array().map(error => {
            let msg = error.msg;

            if (msg.includes('<br>') || msg.includes('\n')) {
                msg = msg.split('<br>')[0].split('\n')[0].trim();
            }

            if (msg.includes('(') && msg.includes(')')) {
                msg = msg.split('(')[0].trim();
            }

            return msg;
        });

        const finalErrorMessage = cleanErrorMessages.join(', ');

        throw new ApiError(400, finalErrorMessage);
    }
    next();
};
