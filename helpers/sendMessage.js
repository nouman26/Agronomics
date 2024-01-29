const axios = require('axios');

module.exports = async function (phone, text) {
  try {
    const url = `https://secure.h3techs.com/sms/api/send?email=greenageservices@gmail.com&key=${process.env.SMS_KEY}&mask=81478&to=${phone}&message=${text}`;
    const { status, data } = await axios.post(url);
    return { status, data };
  } catch (error) {
    console.error(error);
    throw error; // Optional: Rethrow the error for handling at a higher level
  }
};
