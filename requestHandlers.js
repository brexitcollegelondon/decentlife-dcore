const dcorejs = require('dcorejs');
const constants = require('./constants');

const dctId = '1.3.0';

module.exports = {
  POST: {
    transfer(data) {
      const {payer, payee, amount} = JSON.parse(data);
      const payerPromise = dcorejs.account().getAccountByName(payer);
      const payeePromise = dcorejs.account().getAccountByName(payee);
      const payerPrivateKey = constants.privateKeys[payer];
      return Promise.all([payerPromise, payeePromise, payerPrivateKey])
        .then(([payer, payee]) => dcorejs.account().transfer(amount, dctId, payer.id, payee.id, "decentlife", payerPrivateKey, true))
        .then(res => ({ statusCode: 200, contentType: "text/plain", result: "all good" }))
        .catch(err => ({statusCode: 500, contentType: "text/plain", result: err.toString()}));
    },

    sendMessage(data) {
      const{sender, recipient, message} = JSON.parse(data);
      const senderPromise = dcorejs.account().getAccountByName(sender);
      const recipientPromise = dcorejs.account().getAccountByName(recipient);
      const senderPrivateKey = constants.privateKeys[sender];
      return Promise.all([senderPromise, recipientPromise, senderPrivateKey])
        .then(([sender, recipient]) => dcorejs.messaging().sendMessage(sender.id, recipient.id, message, senderPrivateKey, true))
        .then(res => ({ statusCode: 200, contentType: "text/plain", result: "all good" }))
        .catch(err => ({statusCode: 500, contentType: "text/plain", result: err.toString()}));
    }
  },

  GET: {
    getAllMessages(_, urlRest) {
      // Uses get all sent messages - this is a hack
      const sender = urlRest.match(/\/(.+)/)[1];
      const senderPromise = dcorejs.account().getAccountByName(sender);
      const senderPrivateKey = constants.privateKeys[sender];
      return senderPromise
        .then(senderObj => {
          return dcorejs.messaging().getSentMessages(senderObj.id, senderPrivateKey, 100);
        })
        .then(messagesData => {
          const messages = messagesData.map(messageData => messageData.text);
          return {statusCode: 200, contentType: "application/json", result: JSON.stringify(messages)};
        })
        .catch(err => ({statusCode: 500, contentType: "text/plain", result: err.toString()}));
    }
  }
};
