# SubQuery - Gear Data Processor

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