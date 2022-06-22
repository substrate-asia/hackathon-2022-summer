import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { Button, Card, Space, Table } from 'antd'
import * as substrate from '../substrate'
import Trigger from './Trigger'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Type',
    align: 'center',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Created Time',
    align: 'center',
    dataIndex: 'createdTime',
    key: 'createdTime',
    render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: 'Trigger Condition',
    align: 'center',
    dataIndex: 'condition',
    key: 'condition',
    render: (text: string, record: any) => {
      if (record.type === 'Timer') { return `Interval：${text} s` }
      else if (record.type === 'Schedule') {
        const time = +text.split(',').join('')
        const timeFormat = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
        return `When：${timeFormat}`
      }
      else if (record.type === 'PriceGT') { return `PriceGT：${text}` }
      else if (record.type === 'PriceLT') { return `PriceLT：${text}` }
    },
  },
  {
    title: 'Indicator',
    align: 'center',
    dataIndex: 'indicator',
    key: 'indicator',
  },
  {
    title: 'Seconds',
    align: 'center',
    dataIndex: 'seconds',
    key: 'seconds',
  },
  {
    title: 'Action',
    align: 'center',
    key: 'action',
    render: () => (
      <Space size="middle">
        <a onClick={() => {}}>Delete</a>
      </Space>
    ),
  },
] as any

const TriggerList = ({ triggers, setTriggers }: { triggers: any; setTriggers: any }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const getTriggers = async () => {
    const triggers = await substrate.getTriggers()

    if (triggers)
      setTriggers(triggers)
  }

  const createTrigger = async (data: any) => {
    setLoading(true)
    const ret = await substrate.createTrigger(data)
    if (ret) {
      setLoading(false)
      getTriggers()
    }
  }

  useEffect(() => {
    getTriggers()
  }, [])

  const showModal = () => {
    setIsModalVisible(true)
  }
  const handleOk = (values: any) => {
    const now = new Date().getTime()
    if (values.triggerType === 'Timer') {
      createTrigger({
        Timer: [now, values.interval],
      })
    }
    else if (values.triggerType === 'Schedule') {
      const schedule = new Date(values.schedule).getTime()
      createTrigger({
        Schedule: [now, schedule],
      })
    }
    else if (values.triggerType === 'PriceGT') {
      createTrigger({
        PriceGT: [now, values.priceGT],
      })
    }
    else if (values.triggerType === 'PriceLT') {
      createTrigger({
        PriceLT: [now, values.priceLT],
      })
    }
    else if (values.triggerType === 'Arh999LT') {
      createTrigger({
        Arh999LT: [now, values.indicator, values.seconds],
      })
    }
    setIsModalVisible(false)
  }

  return (
    <>
      <Card title="Trigger List" style={{ width: '80%', margin: '10px auto' }}>
        <div style={{ marginBottom: 16, textAlign: 'left' }}>
          <Button type="primary" onClick={showModal}>
            Add Trigger
          </Button>
        </div>
        <Table
          loading={loading}
          bordered
          columns={columns}
          dataSource={triggers}
        />
      </Card>

      <Trigger
        visible={isModalVisible}
        onCreate={handleOk}
        onCancel={() => setIsModalVisible(false)}
      />
    </>
  )
}

TriggerList.propTypes = {
  triggers: PropTypes.array.isRequired,
  setTriggers: PropTypes.func.isRequired,
}

export default TriggerList
