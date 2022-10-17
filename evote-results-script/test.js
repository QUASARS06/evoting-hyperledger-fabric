const axios = require('axios');
const parties = ['BJP', 'INC', 'NCP', 'AITC', 'SS', 'NOTA'];

const fs = require('fs');

const names = fs.readFileSync('names.txt').toString().split('\n');

const registerUsers = async () => {
  let data = {};

  let total = 0;
  for (let i = 0; i < 400; i++) {
    const x = Math.floor(Math.random() * 2) == 0;
    let org = x ? 'Org1' : 'Org2';
    const bodyParameters = {
      username: names[i],
      orgName: org,
    };

    let date1 = new Date();
    console.log('Num',i, names[i]);

    let res = await axios
      .post('http://localhost:4000/register', bodyParameters)
      .then((response) => {
        const res = response.data;
        const obj = { orgName: org, token: res.token };
        return obj;
      })
      .catch((err) => console.log(err));

    data[names[i]] = res;

    let date2 = new Date();
    let diff = date2 - date1;
    total += diff;
  }

  console.log('Total:', total);

  return await data;
};

registerUsers().then((res) => {
  let num_vo = 0;
  Object.keys(res).forEach(async (key)=>{
    const x = parseInt(Math.floor(Math.random() * 6));
    const isAuthenticated = res[key].token;
    const config = {
      headers: { Authorization: `Bearer ${isAuthenticated}` },
    };
    const bodyParameters = {
      fcn: 'voteCar',
      peers: JSON.stringify([
        'peer0.org1.example.com',
        'peer0.org2.example.com',
      ]),
      chaincodeName: 'fabcar',
      channelName: 'mychannel',
      args: [parties[x]],
    };

    console.log('Trying... ');
    let date1 = new Date();

    let voteRes = await axios
      .post(
        'http://localhost:4000/channels/mychannel/chaincodes/fabcar',
        bodyParameters,
        config
      )
      .then((response) => {
        return response.data;
      })
      .catch((err) => console.log(err));

    let date2 = new Date();
    let diff = date2 - date1; 
    console.log('Trying... Ended', diff, voteRes);

    num_vo+=1;
    // console.log(voteRes);
    console.log('N=',num_vo);
  });
  
});
