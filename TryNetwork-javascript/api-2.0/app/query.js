const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const util = require('util');

const { X509 } = require('jsrsasign');
const crypto = require('crypto');
const passphrase = 'this is a very very secret key so keep it safe';

const helper = require('./register');
const invoke = require('./invoke');
const query = async (
  channelName,
  chaincodeName,
  args,
  fcn,
  username,
  org_name
) => {
  try {
    // load the network configuration

    const ccp = await helper.getCCP(org_name);

    // Create a new file system based wallet for managing identities.
    const walletPath = await helper.getWalletPath(org_name);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    // console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    let identity = await wallet.get(username);
    if (!identity) {
      console.log(
        `An identity for the user ${username} does not exist in the wallet, so registering user`
      );
      await helper.getRegisteredUser(username, org_name, true);
      identity = await wallet.get(username);
      console.log('Run the registerUser.js application before retrying');
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: username,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);

    // Get the contract from the network.
    const contract = network.getContract(chaincodeName);
    let result;

    if (fcn === 'queryAllVotes') {
      result = await contract.evaluateTransaction(fcn);
    } else if (fcn === 'queryVoteById') {
      const certificate = identity.credentials.certificate;

      const keyId = await getId(certificate);
      console.log('ID:', keyId.id);

      result = await contract.evaluateTransaction(fcn, keyId.id);
    } else if (fcn === 'queryPhase') {
      result = await contract.evaluateTransaction(fcn);
    } else if (fcn === 'getAllVotesClient') {
      result = await contract.evaluateTransaction(fcn);
    } else {
      return `Invocation requires queryAllVotes as function but got ${fcn}`;
    }

    await gateway.disconnect();

    // console.log(
    //   `Transaction has been evaluated, result is: ${result.toString()}`
    // );

    result = JSON.parse(result.toString());

    console.log('RES:', result);
    if (
      fcn != 'queryPhase' &&
      fcn != 'getAllVotesClient' &&
      result.data &&
      Object.keys(result.data).length > 0
    ) {
      result = decryptVotes(Object.values(JSON.parse(result.data)));
    }

    if (fcn === 'queryAllVotes') {
      console.log(JSON.stringify(result.data));
      console.log(args);
      args[0] = JSON.stringify(result.data);
      console.log(args);

      invoke.invokeTransaction(
        channelName,
        chaincodeName,
        'countVotes',
        args,
        username,
        org_name,
        null
      );
    }

    // console.log(JSON.parse(result.data).phase);

    return result;
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    return error.message;
  }
};

const getId = async (certificate) => {
  const cert = new X509();
  cert.readCertPEM(certificate);
  const issuer = cert.getIssuerString();
  const serial = cert.getSerialNumberHex();

  const unique = issuer + '~' + serial;

  var hash = crypto.createHash('sha256');
  const data = hash.update(unique, 'utf-8');
  const gen_hash = data.digest('hex');

  return { id: gen_hash };
};

const decryptVotes = (votes) => {
  // console.log(votes);

  // if (votes[0] === '{') {
  //   return;
  // }

  const privateKey = fs.readFileSync(
    '/home/quasars/Desktop/TryNetwork-javascript/api-2.0/app/keypairs/pri.pem'
  );

  var occurrences = {};

  // console.log(occurrences); // {ab: 3, pq: 1, mn: 2}
  // console.log(occurrences['mn']); // 2

  for (const vote of votes) {
    // console.log('V', vote);

    const decryptedData = crypto.privateDecrypt(
      {
        key: privateKey,
        // In order to decrypt the data, we need to specify the
        // same hashing function and padding scheme that we used to
        // encrypt the data in the previous step
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
        passphrase: passphrase,
      },
      Buffer.from(vote, 'base64')
    );

    const decryptedDataStr = decryptedData.toString();

    // The decrypted data is of the Buffer type, which we can convert to a
    // string to reveal the original data
    // console.log('decrypted data: ', decryptedDataStr);

    const votedFor = decryptedDataStr.split('~')[1];
    occurrences[votedFor] = (occurrences[votedFor] || 0) + 1;
  }

  return { mssg: 'Success.', data: occurrences };
};

exports.query = query;
