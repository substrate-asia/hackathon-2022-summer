import { ApiPromise, WsProvider } from '@polkadot/api'
import { Keyring } from '@polkadot/keyring'
import dayjs from 'dayjs'

// 如没有运行 node-template，也可试连到波卡主网上： `wss://rpc.polkadot.io`.
// const provider = new WsProvider('ws://127.0.0.1:9944')
// const provider = new WsProvider('wss://difttt.dmb.top/ws')
const provider = new WsProvider('wss://39.108.194.248:9944')
const api = await ApiPromise.create({ provider })

// 获取用户
function getUser(userName: string) {
  const keyring = new Keyring({ type: 'sr25519' })
  const user = keyring.addFromUri(`//${userName}`)
  return user
}
const Alice = getUser('Alice')

async function getChainInfo() {
  // 1. 查看本条链的信息
  const [chain, nodeName, nodeVersion, metadata] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
    api.rpc.state.getMetadata(),
  ])

  return {
    metadata,
    chain,
    nodeName,
    nodeVersion,
  }
}

// 转账
async function transfer(to: string, from: any, amount: number) {
  const tx = api.tx.balances.transfer(to, amount)
  const hash = tx.signAndSend(from)
  return hash
}

async function createTrigger(data: any) {
  return new Promise((resolve) => {
    api.tx.diftttModule.createTriger(data).signAndSend(Alice, ({ events = [], status }) => {
      if (status.isFinalized)
        resolve({ events, status })

      events.forEach(({ phase, event: { data, method, section } }) => {
        console.log(`${phase.toString()} : ${section}.${method} ${data.toString()}`)
      })
    })
  })
}

async function getTriggers() {
  const exposures = await api.query.diftttModule.trigerOwner.entries(Alice.address)

  const triggers = []

  for (const [key] of exposures) {
    const id = +key.args[1]
    const t = await api.query.diftttModule.mapTriger(id)
    const trigger = t.toHuman() as any
    const { Timer, Schedule, PriceGT, PriceLT, Arh999LT } = trigger

    const res = {} as any
    if (Timer) {
      res.type = 'Timer'
      res.data = Timer
      res.condition = res.data[1]
    }
    else if (Schedule) {
      res.type = 'Schedule'
      res.data = Schedule
      res.condition = res.data[1]
    }
    else if (PriceGT) {
      res.type = 'PriceGT'
      res.data = PriceGT
      res.condition = res.data[1]
    }
    else if (PriceLT) {
      res.type = 'PriceLT'
      res.data = PriceLT
      res.condition = res.data[1]
    }
    else if (Arh999LT) {
      res.type = 'Arh999LT'
      res.data = Arh999LT
      res.indicator = res.data[1]
      res.seconds = res.data[2]
    }

    const time = +res.data[0].split(',').join('')
    res.createdTime = dayjs(time).format('YYYY-MM-DD HH:mm:ss')

    triggers.push({
      ...res,
      key: id,
      id,
    })
  }

  return triggers
}

async function createAction(data: any) {
  return new Promise((resolve) => {
    api.tx.diftttModule.createAction(data).signAndSend(Alice, ({ events = [], status }) => {
      if (status.isFinalized)
        resolve({ events, status })

      else
        console.log(`Status of transfer: ${status.type}`)

      events.forEach(({ phase, event: { data, method, section } }) => {
        console.log(`${phase.toString()} : ${section}.${method} ${data.toString()}`)
      })
    })
  })
}

async function getActions() {
  const exposures = await api.query.diftttModule.actionOwner.entries(Alice.address)

  const actions = []

  for (const [key] of exposures) {
    const id = +key.args[1]
    const t = await api.query.diftttModule.mapAction(id)
    const action = t.toHuman() as any
    const { MailWithToken, Oracle, BuyToken } = action

    if (MailWithToken) {
      action.type = 'MailWithToken'
      action.url = MailWithToken[0]
      action.token = MailWithToken[1]
      action.receiver = MailWithToken[2]
      action.title = MailWithToken[3]
      action.body = MailWithToken[4]
    }
    else if (Oracle) {
      action.type = 'Oracle'
      action.url = Oracle[0]
      action.token_name = Oracle[1]
    }
    else if (BuyToken) {
      action.type = 'BuyToken'
      action.address = BuyToken[0]
      action.token_name = BuyToken[1]
      action.amount = BuyToken[2]
    }

    actions.push({
      ...action,
      key: id,
      id,
    })
  }

  return actions
}

async function createRecipe(actionId: number, triggerId: number) {
  return new Promise((resolve) => {
    api.tx.diftttModule
      .createRecipe(actionId, triggerId)
      .signAndSend(Alice, ({ events = [], status }) => {
        if (status.isFinalized)
          resolve({ events, status })

        events.forEach(({ phase, event: { data, method, section } }) => {
          console.log(`${phase.toString()} : ${section}.${method} ${data.toString()}`)
        })
      })
  })
}

async function getRecipes() {
  const exposures = await api.query.diftttModule.recipeOwner.entries(Alice.address)

  const recipes = []

  for (const [key] of exposures) {
    const id = +key.args[1]
    const t = await api.query.diftttModule.mapRecipe(id)
    const recipe = t.toHuman() as object
    recipes.push({
      ...recipe,
      key: id,
      id,
    })
  }

  return recipes
}

async function recipeTurnOn(id: number) {
  return new Promise((resolve) => {
    api.tx.diftttModule
      .turnOnRecipe(id)
      .signAndSend(Alice, ({ events = [], status }) => {
        if (status.isFinalized)
          resolve({ events, status })

        events.forEach(({ phase, event: { data, method, section } }) => {
          console.log(`${phase.toString()} : ${section}.${method} ${data.toString()}`)
        })
      })
  })
}

async function recipeTurnOff(id: number) {
  return new Promise((resolve) => {
    api.tx.diftttModule
      .turnOffRecipe(id)
      .signAndSend(Alice, ({ events = [], status }) => {
        if (status.isFinalized)
          resolve({ events, status })

        events.forEach(({ phase, event: { data, method, section } }) => {
          console.log(`${phase.toString()} : ${section}.${method} ${data.toString()}`)
        })
      })
  })
}

export {
  getChainInfo,
  transfer,
  createTrigger,
  getTriggers,
  createAction,
  getActions,
  createRecipe,
  getRecipes,
  recipeTurnOn,
  recipeTurnOff,
}
