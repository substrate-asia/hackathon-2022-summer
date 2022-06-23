# Substrate Wasm Contract Support (with Gear)

## Challenge

SubQuery has a goal of providing support for all execution environments in Substrate/Polkadot, including on chain data, smart contracts in EVM, and smart contracts in WebAssembly (Wasm). This will allow all application developers to leverage the same excellent infrastructure tools across the ecosystem to build the next generation of applications.

## Basic Information
Project Name: **Gear Data Processor**

Date:
__05/21/2022__ - May 21, 2022

## Overall Project Description

This project creates a new instance of a data processor for SubQuery, similar to the existing Substrate processor. It could support Gear Wasm for the block, event and extrinsic processing. It is to connect to the Gear Wasm contract platform (and ideally work on other Wasm contract platforms as well) and process messages from the Substrate Frontier EVM processor in a similar manner to Processing messages from the Wasm implementation. Users can then use these messages in the handler, just like a traditional SubQuery project.

## Plan and Completion


Here is a very rough preliminary estimate. (Since we need to evaluate before making detailed plans, this will require team discussion and research.)

**Blockchain side**

`Gear message format research`
- [x] Understanding the message format of Gear;
- [x] Understand the principle of substrate EVM frontier implementation;
- [x] Evaluate the conversion steps needed based on the results of the above two parts.

`SubQuery adaptation`
- [x] Study the source code of subql to find the insertion points for adaptation;
- [x] Implement the data structure declaration (TypeScript) that subql can use;
- [x] Implement Gear's event adapter;
- [x] Introduce the adapter into the project as a lib;
- [ ] Write Gear test contract for testing (Currently Gear's Wasm smart contract support is still under development. After Gear's evaluation, Wasm parsing is still unstable and needs to wait for stability to be developed.)

**community contribution**
- [x] Due to the update of Gear system and API, some of the API test samples provided by GearFans before have been outdated, we have updated some of the test samples, details can be referred to: https://github.com/only4sim/GearFansexample


## Preparation

#### Environment

- [Typescript](https://www.typescriptlang.org/)

- [Node](https://nodejs.org/en/)
     

#### Install the SubQuery CLI

Install SubQuery CLI globally on your terminal by using NPM:

```
npm install -g @subql/cli
```

Run help to see available commands and usage provide by CLI
```
subql help
```

## Clone the project

```
git clone ** // Add the github link of the project.
```

Under the project directory, run following command to install all the dependency.
```
yarn install
```


## Configure your project

- The Manifest in `project.yaml`
- The GraphQL Schema in `schema.graphql`
- The Mapping functions in `src/mappings/` directory


### Code generation

In order to index your SubQuery project, it is mandatory to build your project first.
Run this command under the project directory.

````
subql codegen
````

## Build the project

In order to deploy your SubQuery project to our hosted service, it is mandatory to pack your configuration before upload.

```
subql build
```

## Indexing and Query

### Run required systems in docker

Start the docker desktop or cli.

Under the project directory run following command:

```
docker-compose pull && docker-compose up
```
Please note that since the ports of both test nets currently provided by Gear are pruning nodes, it may cause docker startup failure or query failure because the history state may not exist, please set the ```startBlock``` at project.yaml for a more recent block height. Of course, even if the ```startBlock``` is set to the latest 1000 blocks, it may still fail due to pruning. We are coordinating with Gear to solve this problem.

### Query the project

Open your browser and head to `http://localhost:3000`.

Finally, you should see a GraphQL playground is showing in the explorer and the schemas that ready to query.

You can try to query with the following code to get a taste of how it works.


````graphql
{
  query{
    starterEntities(first:10){
      nodes{
        field1,
        field2,
        field3
      }
    }
  }
}
````

## Contributor
li @ [github.com/only4sim](https://github.com/only4sim)

willson.wang @ [github.com/whtoo2](https://github.com/whtoo2)

## Reference
* [[$4,000] Substrate Wasm Contract Support (with Gear) #25](https://github.com/subquery/grants/issues/25)
* [Substrate EVM Support](https://university.subquery.network/build/substrate-evm.html#)
* [subquery/datasource-processors](https://github.com/subquery/datasource-processors)
* [subquery/tutorials-frontier-evm-starter](https://github.com/subquery/tutorials-frontier-evm-starter)
* [subquery/subql](https://github.com/subquery/subql/tree/main/packages/common-substrate/src/project)
* [gear-tech/gear-js](https://github.com/gear-tech/gear-js/blob/master/api/src/GearApi.ts)