import React, { useState, useEffect } from 'react';
import AlreadyVoted from './AlreadyVoted';
import ToVote from './ToVote';
import axios from 'axios';

const VotingPhase = () => {
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState(null);

  useEffect(() => {
    //eslint-disable-next-line

    const isAuthenticated = localStorage.getItem('jwttoken');
    const config = {
      headers: { Authorization: `Bearer ${isAuthenticated}` },
      params: {
        args: [],
        peer: 'peer0.org1.example.com',
        fcn: 'queryVoteById',
      },
    };

    axios
      .get('http://localhost:4000/channels/mychannel/chaincodes/fabcar', config)
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err));

    setHasVoted(false);
  }, []);

  return <div>{hasVoted ? <AlreadyVoted voted={votedFor} /> : <ToVote />}</div>;
};

export default VotingPhase;
