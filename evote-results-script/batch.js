const axios = require('axios');
const parties = ['BJP', 'INC', 'NCP', 'AITC', 'SS', 'NOTA'];

const fs = require('fs');

const names = fs.readFileSync('names.txt').toString().split('\n');

const registerUsers = async () => {
  let data = {};

  let total = 0;
  for (let i = 400; i < 600; i++) {
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

  // console.log('Total:', total);

  return await data;
};

registerUsers().then(async (res) => {
  const keys = Object.keys(res);
  const BATCH_SIZE = 50;
  const num_of_batches = Math.ceil(keys.length / BATCH_SIZE);

  let total_time = 0;
  let total_latency = 0;

  console.log('\nNumber of Requests:', keys.length);
  console.log('Batch Size:', BATCH_SIZE);

  for (let i = 0; i < num_of_batches; i++) {

    console.log('-------------- BATCH', (i+1), '--------------');

    const key_slice = keys.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
    // console.log(key_slice);

    const loop_date_start = new Date();

    let count = 0;
    await new Promise((resolve) => {
      key_slice.forEach(async (key) => {
        try {
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

          // console.log('Trying... ');
          // let date1 = new Date();

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

          // let date2 = new Date();
          // let diff = date2 - date1;
          // console.log('Trying... Ended', voteRes);
        } catch (e) {
          console.log('ERR', e);
        } finally {
          count += 1;
          if (count === key_slice.length) {
            resolve();
          }
        }
      });
    });

    const loop_date_end = new Date();
    const loop_time = (loop_date_end - loop_date_start) / 1000;
    const latency_per_req = loop_time / BATCH_SIZE;
    console.log('Runtime for', BATCH_SIZE, 'requests:', loop_time);
    console.log('Latency per Request:', latency_per_req);

    total_time += loop_time;
    total_latency += latency_per_req;

    console.log('\n');

  }

  console.log('Avg Time to Process Requests:', total_time / keys.length);
  console.log('Latency - Invoke:', total_latency / num_of_batches, 's');
  console.log('Throughput - Invoke:', (keys.length*60) / total_time, 'transactions per minute');
});