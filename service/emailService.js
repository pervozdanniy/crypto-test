const { ses } = require('../config/ses');
const emailConfig = require("../config/email.config");
const { templates } = require('../util/emailTemplates');

const sendEmail = async (toAddr, templateName, bodyParams) => {

    const template = templates[templateName];

    const params = {
        // toAddr is an array, can send to multiple addresses
        Destination: {ToAddresses: toAddr},
        Content: {
            Simple: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: template.bodyText(bodyParams)
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: template.bodyText(bodyParams)
                    }
                },
                Subject: {Charset: 'UTF-8', Data: template.subject}
            }
        },
        FromEmailAddress: emailConfig.fromEmailAddress
    };

    await sesSendEmailWrapper(params)
        .catch((err) => {throw new Error(err)});
}

const sesSendEmailWrapper = async (params) => {
    return new Promise((resolve, reject) => {
        ses.sendEmail(params, (err, data) => {
            if (err) {
                console.log(err, err.stack)
                reject(err.message);
            } else {
                resolve(null);
            }
        });
    });
}

module.exports = {
    sendEmail,
}