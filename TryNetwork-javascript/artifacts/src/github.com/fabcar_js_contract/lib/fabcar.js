/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;
const { X509 } = require('jsrsasign');
const crypto = require('crypto');

class FabCar extends Contract {
  async initLedger(ctx) {
    console.info('============= START : Initialize Ledger ===========');

    // const globalData = {};
    const votingPhase = { phase: 'registration' };
    const voteTally = { BJP: 0, INC: 0, NCP: 0, AITC: 0, SS: 0, NOTA: 0 };

    // await ctx.stub.putState(
    //   'GlobalData',
    //   Buffer.from(JSON.stringify(globalData))
    // );

    await ctx.stub.putState(
      'VotingPhase',
      Buffer.from(JSON.stringify(votingPhase))
    );

    await ctx.stub.putState(
      'VoteTally',
      Buffer.from(JSON.stringify(voteTally))
    );

    console.info('============= END : Initialize Ledger ===========');
  }

  async queryVoteById(ctx, key) {
    let cid = new ClientIdentity(ctx.stub);
    const type = cid.getAttributeValue('hf.Type');

    let mssg = 'Failure, Access Denied to Non-Clients.';
    let data = null;

    if (type === 'client') {
      const clientVoteAsBytes = await ctx.stub.getState(key);
      const clientVote = clientVoteAsBytes.toString();

      if (clientVote.length !== 0) {
        data = {};
        data[key] = clientVote;
        data = JSON.stringify(data);
      }

      mssg = 'Success.';
    }

    return { mssg, data };
  }

  async queryAllVotes(ctx) {
    let cid = new ClientIdentity(ctx.stub);
    const type = cid.getAttributeValue('hf.Type');

    let mssg = 'Failure, Access Denied.';
    let data = null;

    if (type === 'admin') {
      const startKey = '';
      const endKey = '';
      const allResults = {};
      for await (const { key, value } of ctx.stub.getStateByRange(
        startKey,
        endKey
      )) {
        if (
          key === 'VoteTally' ||
          key === 'VotingPhase' ||
          key === 'GlobalData'
        )
          continue;

        const strValue = Buffer.from(value).toString('utf8');
        allResults[key] = strValue;
      }
      console.info(allResults);
      // return JSON.stringify(allResults);

      data = JSON.stringify(allResults);

      mssg = 'Success.';
    }

    return { mssg, data };
  }

  async queryPhase(ctx) {
    let mssg = 'Failure, Access Denied.';
    let data = null;

    const currentVotingPhaseAsBytes = await ctx.stub.getState('VotingPhase');

    if (!currentVotingPhaseAsBytes) {
      throw new Error('Voting Phase does not Exist.');
    }

    const currentVotingPhase = JSON.parse(currentVotingPhaseAsBytes.toString());
    data = JSON.stringify(currentVotingPhase);

    mssg = 'Success.';

    return { mssg, data };
  }

  async getAllVotesClient(ctx) {
    let mssg = 'Failure, Something went wrong.';
    let data = null;

    const voteTallyAsBytes = await ctx.stub.getState('VoteTally');
    if (!voteTallyAsBytes) {
      throw new Error('Vote Tally does not exist');
    }
    const voteTallyObj = JSON.parse(voteTallyAsBytes.toString());

    data = JSON.stringify(voteTallyObj);

    mssg = 'Success.';

    return { mssg, data };
  }

  async countVotes(ctx, votingData) {
    let mssg = 'Tally Phase has not started yet.';
    let data = null;

    const voteTallyAsBytes = await ctx.stub.getState('VoteTally');
    if (!voteTallyAsBytes) {
      throw new Error('Vote Tally does not exist');
    }
    const voteTallyObj = JSON.parse(voteTallyAsBytes.toString());
    const votingDataObj = JSON.parse(votingData);

    Object.keys(votingDataObj).forEach((key) => {
      voteTallyObj[key] = votingDataObj[key];
    });

    await ctx.stub.putState(
      'VoteTally',
      Buffer.from(JSON.stringify(voteTallyObj))
    );

    mssg = 'Success.';

    return { mssg, data };
  }

  async changePhase(ctx, newPhase) {
    let cid = new ClientIdentity(ctx.stub);
    const type = cid.getAttributeValue('hf.Type');

    let mssg = 'Failure, Access Denied.';
    let data = null;

    if (type === 'admin') {
      const currentVotingPhaseAsBytes = await ctx.stub.getState('VotingPhase');

      if (!currentVotingPhaseAsBytes) {
        throw new Error('Voting Phase does not Exist.');
      }

      const currentVotingPhase = JSON.parse(
        currentVotingPhaseAsBytes.toString()
      );
      currentVotingPhase['phase'] = newPhase;

      await ctx.stub.putState(
        'VotingPhase',
        Buffer.from(JSON.stringify(currentVotingPhase))
      );

      mssg = 'Success.';
    }

    return { mssg, data };
  }

  async voteCar(ctx, key, value) {
    console.info('============= START : voteCar ===========');

    let message = "Can't vote more than once, Request Denied.";

    let cid = new ClientIdentity(ctx.stub);

    const clientID = cid.getID();
    const clientIDBytes = cid.getIDBytes();
    const type = cid.getAttributeValue('hf.Type');

    if (type !== 'client') {
      message = 'Only Clients are allowed to Vote!';

      const nonClientOutput = { message, clientID, type };

      console.info('============= END : voteCar ===========');
      return JSON.stringify(nonClientOutput);
    }

    const currentVotingPhaseAsBytes = await ctx.stub.getState('VotingPhase');

    if (!currentVotingPhaseAsBytes) {
      throw new Error('Voting Phase does not Exist.');
    }

    const currentVotingPhase = JSON.parse(currentVotingPhaseAsBytes.toString());
    const curr_phase = currentVotingPhase.phase;

    if (curr_phase != 'voting') {
      message =
        curr_phase === 'registration'
          ? "Voting Phase hasn't started yet, Can't Vote !!!"
          : "Voting Phase is over, You can't vote anymore";

      const phaseOutput = { message, clientID, type };

      console.info('============= END : voteCar ===========');
      return JSON.stringify(phaseOutput);
    }

    const certificate = Buffer.from(clientIDBytes).toString('utf-8');

    const cert = new X509();
    cert.readCertPEM(certificate);
    const issuer = cert.getIssuerString();
    const serial = cert.getSerialNumberHex();

    const unique = issuer + '~' + serial;

    var hash = crypto.createHash('sha256');
    const data = hash.update(unique, 'utf-8');
    const gen_hash = data.digest('hex');

    // console.info(gen_hash);
    // console.info(key);

    if (gen_hash === key) {
      console.info('Identity Verified.');
    } else {
      message = 'Malicious Request Detected.';

      const nonKeyOutput = { message, clientID, type };

      console.info('============= END : voteCar ===========');
      return JSON.stringify(nonKeyOutput);
    }

    const currentGlobalDataAsBytes = await ctx.stub.getState(key);
    console.info('Key:', key);
    console.info('Value:', value);
    console.info('Data:', currentGlobalDataAsBytes.toString(), '|');
    const currentGlobalData = currentGlobalDataAsBytes.toString();
    console.info('Len:', currentGlobalData.length);
    if (currentGlobalData.length === 0) {
      // Means the voter has NOT voted so Register a Vote
      message = 'Vote Successfully Registered.';

      console.info('Inside:');

      await ctx.stub.putState(key, Buffer.from(value));
    }

    // ============================= BEFORE ==================================
    // const currentGlobalDataAsBytes = await ctx.stub.getState('GlobalData');
    // if (!currentGlobalDataAsBytes) {
    //   throw new Error('Global Data does not Exist.');
    // }

    // const currentGlobalData = JSON.parse(currentGlobalDataAsBytes.toString());

    // if (!currentGlobalData.hasOwnProperty(key)) {
    //   // Means the voter has NOT voted so Register a Vote
    //   currentGlobalData[key] = value;
    //   message = 'Vote Successfully Registered.';

    //   await ctx.stub.putState(
    //     'GlobalData',
    //     Buffer.from(JSON.stringify(currentGlobalData))
    //   );
    // }
    // ============================= BEFORE ====================================

    // console.info(cid);

    const output = { message, clientID, type };

    console.info('============= END : voteCar ===========');

    return JSON.stringify(output);
  }
}

module.exports = FabCar;
