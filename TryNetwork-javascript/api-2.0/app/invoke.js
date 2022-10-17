const {
  Gateway,
  Wallets,
  DefaultEventHandlerStrategies,
} = require('fabric-network');
const fs = require('fs');
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const util = require('util');

const { X509 } = require('jsrsasign');
const crypto = require('crypto');

const helper = require('./register');

const invokeTransaction = async (
  channelName,
  chaincodeName,
  fcn,
  args,
  username,
  org_name,
  transientData
) => {
  try {
    logger.debug(
      util.format(
        '\n============ invoke transaction on channel %s ============\n',
        channelName
      )
    );

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

    const connectOptions = {
      wallet,
      identity: username,
      discovery: { enabled: true, asLocalhost: true },
      eventHandlerOptions: {
        commitTimeout: 100,
        endorseTimeout: 10000,
        strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX,
      },
    };

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    const d1 = new Date();
    try {
      console.log('Trying to Connect to Gateway...');
      await gateway.connect(ccp, connectOptions);
    } catch (err_gate) {
      console.log('Gate', err_gate);
    }

    const d2 = new Date();
    console.log('Connect Done...', d2 - d1);

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);

    const contract = network.getContract(chaincodeName);

    let result;
    let message;

    if (fcn === 'voteCar') {
      const certificate = identity.credentials.certificate;
      const votePair = await getVotingData(certificate, args[0]);
      // console.log(votePair);

      console.log('Trying for', username);
      result = await contract.submitTransaction(
        fcn,
        votePair.key,
        votePair.value
      );

      message = 'Successfully executed the request';
    } else if (fcn === 'countVotes') {
      result = await contract.submitTransaction(fcn, args[0]);
    } else if (fcn === 'changePhase') {
      result = await contract.submitTransaction(fcn, args[0]);
    } else {
      return `Invocation requires voteCar as function but got ${fcn}`;
    }

    await gateway.disconnect();

    result = JSON.parse(result.toString());

    // console.log(Buffer.from(result.clientIDBytes).toString('utf-8'));
    // console.log(result);

    let response = {
      message: message,
      result,
    };

    return response;
  } catch (error) {
    console.log(`Getting error: ${error}`);
    return error.message;
  }
};

const getVotingData = async (certificate, voteFor) => {
  const cert = new X509();
  cert.readCertPEM(certificate);
  const issuer = cert.getIssuerString();
  const serial = cert.getSerialNumberHex();

  const unique = issuer + '~' + serial;

  var hash = crypto.createHash('sha256');
  const data = hash.update(unique, 'utf-8');
  const gen_hash = data.digest('hex');

  const dataToEncrpt = gen_hash + '~' + voteFor;

  const publicKey =
    '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1LkZRACF722sr68nhB+F\nHkNSF6WiU/HUIeTTR8/v9to6C9UtmS90RogZOw2P/Y86SLAraaOj8hAQ9BrI/HWD\nXEUPJG4uRB1lzlgpQTVBA9rZaqe66cBjPr3zmkwrcYgSShM+vfbhGFiXLM15UIj4\no77zltUQXp0geI+eOuA/P/GJtbO/MmCGslgzWTJQoRabWuOt0lSon1U719fKN00o\nCY5QWrBSP7sBkFnMx6E3KSgTjIzxKD6HJJkGD+UVO1Gon+BeBT36+KrAwF7HjSK9\nMAOe8b6NUpX5ex+8dUbw8nE4S595hUvoDVT4enktKYrBnVECetX03R0wX2It9vn+\n9wIDAQAB\n-----END PUBLIC KEY-----';
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from(dataToEncrpt)
  );

  // The encrypted data is in the form of bytes, so we print it in base64 format
  // so that it's displayed in a more readable form
  const encryptedDataStr = encryptedData.toString('base64');

  return { key: gen_hash, value: encryptedDataStr };
};

exports.invokeTransaction = invokeTransaction;
