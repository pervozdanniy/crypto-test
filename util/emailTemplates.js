const { EMAIL_TEMPLATE } = require('./enum/EMAIL_TEMPLATE');
const Handlebars = require("handlebars");
const path = require('path');
const fs = require('fs');

exports.templates = {
    [EMAIL_TEMPLATE.VERIFICATION]: {
        subject: 'Please Confirm Your Email Address',
        bodyText: (params) => {
            const templatePath = path.join(__dirname, './emailTemplates/verificationEmail.html');
            const source = fs.readFileSync(templatePath, { encoding: 'utf-8' });
            const template = Handlebars.compile(source);
            const html = template(params);

            return html;
        },
        content: () => {
            const templatePath = path.join(__dirname, './emailTemplates/verificationEmail.html');
            const source = fs.readFileSync(templatePath, { encoding: 'utf-8' });

            return source;
        }
    },
    [EMAIL_TEMPLATE.RESET_PASSWORD]: {
        subject: 'Reset Password',
        bodyText: (params) => {
            const templatePath = path.join(__dirname, './emailTemplates/resetPasswordEmail.html');
            const source = fs.readFileSync(templatePath, { encoding: 'utf-8' });
            const template = Handlebars.compile(source);
            const html = template(params);

            return html;
        },
        content: () => {
            const templatePath = path.join(__dirname, './emailTemplates/resetPasswordEmail.html');
            const source = fs.readFileSync(templatePath, { encoding: 'utf-8' });

            return source;
        }
    },
};