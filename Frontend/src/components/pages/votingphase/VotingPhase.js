import React, { useState, useEffect } from 'react';
import AlreadyVoted from './AlreadyVoted';
import ToVote from './ToVote';
import Error from '../Error';
import axios from 'axios';

const VotingPhase = () => {
  const [err, setErr] = useState(null);

  const [hasVoted, setHasVoted] = useState(null);
  const [votedFor, setVotedFor] = useState(null);

  useEffect(() => {
    //eslint-disable-next-line

    const isAuthenticated = localStorage.getItem('jwttoken');
    const config = {
      headers: { Authorization: `Bearer ${isAuthenticated}` },
      params: {
        args: JSON.stringify([]),
        peer: 'peer0.org1.example.com',
        fcn: 'queryVoteById',
      },
    };

    axios
      .get('http://localhost:4000/channels/mychannel/chaincodes/fabcar', config)
      .then((response) => {
        const res = response.data.result.data;
        // console.log(response.data);
        console.log(res);
        if (res === null) {
          setErr(null);
          setHasVoted(false);
        } else {
          const vote_for = Object.keys(res);
          console.log('VV', vote_for[0]);
          setErr(null);
          setVotedFor(vote_for[0]);
          setHasVoted(true);
        }
      })
      .catch((err) => {
        setErr(err);
        console.log(err);
      });
    setErr(null);
    setHasVoted(false);
  }, []);

  return (
    <div>
      {err === null ? (
        hasVoted ? (
          <AlreadyVoted voted={votedFor} />
        ) : (
          <ToVote />
        )
      ) : (
        <Error />
      )}
    </div>
  );
};

export default VotingPhase;
