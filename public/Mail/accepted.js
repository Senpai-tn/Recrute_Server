const welcomeEmail = (clientName, username) =>
  `<p>Welcome ${clientName}, your username is ${username}.</p>`;
const responseOffer = (offer) =>
  `<p>Welcome ${offer.hr}, your offer is ${offer.state} by admin. </p>`;
const createdOffer = (offer) =>
  `<p>Welcome , a new offer  ${offer._id} was created .<a href="http://localhost:3000/checkoffer/${offer._id}">Check It</a> </p>`;
module.exports = { welcomeEmail, responseOffer, createdOffer };
