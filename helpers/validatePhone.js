module.exports = (phone) => {
     const networks = ["9230", "9231", "9232", "9233", "9234", "9235"];
     let error = null;
     if (!phone) {
       error = "Phone number is required";
     }
   
     if (!phone.startsWith("92")) error = "Phone number must start with 92";
    //  console.log(networks.some((network) => phone.startsWith(network)));
    //  if (!networks.some((network) => phone.startsWith(network))) {
    //    error = "Only Ufone numbers are allowed";
    //  }
   
     if (phone.length !== 12) {
       error = "Please enter a valid phone number";
     }
     return error;
};