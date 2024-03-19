const Models = require("../models");
const apiResponse = require("../helpers/apiResponse");

function toTitleCase(str) {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
      return match.toUpperCase();
    });
  }

