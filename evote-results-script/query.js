const axios = require('axios');

const fs = require('fs');

const names = fs.readFileSync('names.txt').toString().split('\n');

const registerUsers = async () => {
  let data = {};

  let total = 0;
  for (let i = 0; i < 200; i++) {
    const x = Math.floor(Math.random() * 2) == 0;
    let org = x ? 'Org1' : 'Org2';
    const bodyParameters = {
      username: names[i],
      orgName: org,
    };

    console.log('Num',i, names[i]);

    let res = await axios
    .post('http://localhost:4000/login', bodyParameters)
    .then((response) => {
      const res = response.data;
      const obj = { orgName: org, token: res.message.token };
      return obj;
    })
    .catch((err) => console.log(err));

    if(!res.token){
      org = org === 'Org1' ? 'Org2' : 'Org1';
      const bodyParameters = {
        username: names[i],
        orgName: org,
      };

      res = await axios
      .post('http://localhost:4000/login', bodyParameters)
      .then((response) => {
        const res = response.data;
        const obj = { orgName: org, token: res.message.token };
        return obj;
      })
      .catch((err) => console.log(err));
    }

    data[names[i]] = res;
  }

  return await data;
};

registerUsers().then(async (res) => {

  let n = Object.keys(res).length;

  let date1 = new Date();
  let count = 0;

  console.log('\nNumber of Requests:', n);
  await new Promise((resolve) => {
    Object.keys(res).forEach(async (key)=>{
      try{
        const isAuthenticated = res[key].token;
        const config = {
          headers: { Authorization: `Bearer ${isAuthenticated}` },
          params: {
            args: JSON.stringify([]),
            peer: 'peer0.org1.example.com',
            fcn: 'queryVoteById',
          },
        };    

        let voteRes = await axios
        .get('http://localhost:4000/channels/mychannel/chaincodes/fabcar', config)
        .then((response) => {
          return response.data;
        })
        .catch((err) => console.log(err));
      } catch (e) {
        console.log('ERR', e);
      } finally {
        count += 1;
        // console.log('c=',count);
        if (count === n) {
          resolve();
        }
      }
    });
  });

  let date2 = new Date();
  let time_taken = (date2 - date1)/1000;

  console.log('Latency - Query:', time_taken / n, 's');
  console.log('Throughput - Query:', (n*60) / time_taken, 'transactions per minute');
  
});
