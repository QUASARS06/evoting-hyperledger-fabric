# Blockchain Based E-Voting System

Problem Statement - With the rise of democracy, elections have been accused of a lack of transparency and security. The current voting methods are subject to fraud simply because of the centralized structure. Thus, the sense of trust amongst voters is decreasing day by day. The voting system is tiresome for the voters because of long queues and waiting times and is also subject to human errors like voting tally. Therefore, a system that decentralizes the entire process must be developed, thus ensuring that voting frauds cannot be committed because there is no single source of truth. Also, the system should allow the voter to vote from any place at any time without any hassle.

Proposed Solution - The proposed system includes a Hyperledger Fabric-based Permissioned Blockchain Network consisting of two organizations (which mimic Election Wards), namely, Org1 & Org2, each containing 2 Peers. There are 3 Orderer nodes configured in the network which take care of the Consensus, i.e., the RAFT Algorithm. Each Organization is provisioned with a unique root certificate (ca-cert) that binds specific components (peers and orderers) to that Org. Transactions and communications within the network happen over TLS and are signed by an entity's private key and verified using a public key. All the organizations transact on a single voting channel. A channel configuration file is created which contains which ordering nodes can add new blocks to the network, the Consensus Ordering Algorithm, and the policies that define how updates are made on the channel. The entire network is containerized, i.e., every node on the network runs as a Docker Container, which includes the 4 peers, 3 orderers, 2 certificate authorities, 4 CouchDB instances, and the deployed chaincode (smart contracts) containers. Hyperledger Explorer is configured to monitor the Network. The backend is designed using NodeJS, which uses the Node SDK provided by Hyperledger Fabric to interact with the Blockchain.

The entire election process is divided into three phases - Registration Phase, Voting Phase & Tallying Phase. During the Registration Phase, eligible voters can register themselves onto the system to obtain an X.509 Certificate provided by an Admin from each Organization. The Blockchain is permissioned as only the admin can permit users to transact on the network via an MSP. During the Voting Phase, all the registered voters with a valid X.509 certificate are authorized to vote. The voter's identity is hashed and stored to provide anonymity, and the voting data is encrypted using Asymmetric Key Encryption to ensure the security of the data. During the Tally Phase, the Elections results are determined by special Administrators registered on the network.

Innovation - Most Blockchain-based Applications are Permissionless, e.g., Bitcoin, which allows anyone to participate in the network in the capacity of a full node or as a contributing miner. Our Proposed Network is a Permissioned Blockchain where Membership Service Providers issue users X.509 Certificates to carry out certain operations on the network depending on the type of Role authorized to them. Hence there are no anonymous or pseudonymous users.

We have designed a voting procedure that hashes and encrypts the User's voting information, thus maintaining the voter's anonymity. The voter can even verify his voting information after voting. The X.509 certificate information is validated in the Smart Contracts and the Network Backend to prevent MiTM attacks.

The network is highly scalable and modular because there is no POW algorithm and crypto mining in Fabric, and it delivers high scalability and fast transactions. Only the signature read/write sets for the voting data traverse the network, optimizing scalability and enabling performance. Only endorsers and peers committing transactions see these transactions; hence confidentiality of data is optimally maintained. Hyperledger can use pluggable Consensus Protocols that do not require a native cryptocurrency, eliminating the costly mining process; thus, they can work at the same operational cost as any other distributed system.

Our proposed system fulfills all the objectives proposed in Article 324 as set out by the Election Commission of India for the voting procedure to be considered free and fair.

Results - The Average Read Latency obtained was 0.152 secs, and the Average Read Throughput was 399.98 transactions per minute (TPM). The Average Transaction Latency obtained was 0.221 secs, and the Average Transaction Throughput was 271.53  transactions per minute (TPM). We performed Load Testing on our network, and our Single Node Server could handle 400 concurrent transactions successfully.
