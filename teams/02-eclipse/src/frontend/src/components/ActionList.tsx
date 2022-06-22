import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Space, Table, Tag } from 'antd'
import * as substrate from '../substrate'
import Action from './Action'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    render: (text: string) => `${text}`,
  },
  {
    title: 'URL',
    dataIndex: 'url',
    key: 'url',
    align: 'center',
  },
  {
    title: 'Token',
    dataIndex: 'token',
    key: 'token',
    align: 'center',
  },
  {
    title: 'Receiver',
    dataIndex: 'receiver',
    key: 'receiver',
    align: 'center',

  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    align: 'center',
  },
  {
    title: 'Body',
    dataIndex: 'body',
    key: 'body',
    align: 'center',
  },
  {
    title: 'TokenName',
    dataIndex: 'token_name',
    key: 'token_name',
    align: 'center',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    align: 'center',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    render: (_: any) => (
      <Space size="middle">
        <a>Delete</a>
      </Space>
    ),
  },
] as any

const ActionList = ({ actions, setActions }: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const getActions = async () => {
    const actions = await substrate.getActions()
    setActions(actions)
  }

  const createAction = async (data: any) => {
    setLoading(true)
    const action = await substrate.createAction(data)

    if (action) {
      setLoading(false)
      getActions()
    }
  }

  useEffect(() => {
    getActions()
  }, [])

  const showModal = () => {
    setIsModalVisible(true)
  }
  const handleOk = (values: any) => {
    if (values.actionType === 'MailWithToken') {
      createAction({
        MailWithToken: [values.url, values.token, values.receiver, values.title, values.body],
      })
    }
    else if (values.actionType === 'Oracle') {
      createAction({
        Oracle: [values.url, values.name],
      })
    }
    else if (values.actionType === 'BuyToken') {
      createAction({
        BuyToken: [values.address, values.token_name, values.amount],
      })
    }
    setIsModalVisible(false)
  }

  return (
    <>
      <Card title="Action List" style={{ width: '80%', margin: '10px auto' }}>
        <div style={{ marginBottom: 16, textAlign: 'left' }}>
          <Button type="primary" onClick={showModal}>
            Add Action
          </Button>
        </div>
        <Table loading={loading} bordered columns={columns} dataSource={actions} />
      </Card>

      <Action
        visible={isModalVisible}
        onCreate={handleOk}
        onCancel={() => setIsModalVisible(false)}
      />
    </>
  )
}

ActionList.propTypes = {
  actions: PropTypes.array,
  setActions: PropTypes.func,
}

export default ActionList
