const nodemailer = require("nodemailer");
const fs = require("fs");
const util = require("util");
const handlebars = require("handlebars");

const readFileAsync = util.promisify(fs.readFile);

var transport = nodemailer.createTransport({
	service: "Gmail",
	auth: {
	    user: "saad26273043@gmail.com",
	    pass: "hdsd agsc ovrm cvdj"
	}
});

let from = "no-reply <saad26273043@gmail.com>";

async function readHTMLFile(path) {
  try {
    const html = await readFileAsync(path, { encoding: "utf-8" });
    return html;
  } catch (err) {
    throw err;
  }
}

module.exports = async function (tempateName, replacements, to, subject) {
  try {
    const html = await readHTMLFile("./emailTemplates/" + tempateName + ".html");
    const template = handlebars.compile(html);
    const htmlToSend = template(replacements);

    const info = await transport.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: htmlToSend,
    });

    console.log(info);
  } catch (err) {
    console.log(err);
  }
};