import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Space, Table } from 'antd'
import * as substrate from '../substrate'
import Recipe from './Recipe'

const RecipeList = ({ triggers, actions }: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)

  const getRecipes = async () => {
    const recipes = await substrate.getRecipes() as any
    setRecipes(recipes)
  }

  const createRecipe = async (actionId: number, triggerId: number) => {
    setLoading(true)
    const recipe = await substrate.createRecipe(actionId, triggerId)

    if (recipe) {
      setLoading(false)
      getRecipes()
    }
  }

  const recipeTurnOn = async (id: number) => {
    setLoading(true)
    const ret = await substrate.recipeTurnOn(id)

    if (ret) {
      setLoading(false)
      getRecipes()
    }
  }

  const recipeTurnOff = async (id: number) => {
    setLoading(true)
    const ret = await substrate.recipeTurnOff(id)

    if (ret) {
      setLoading(false)
      getRecipes()
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'TrigerID',
      dataIndex: 'trigerId',
      key: 'trigerId',
      align: 'center',
    },
    {
      title: 'ActionID',
      dataIndex: 'actionId',
      key: 'actionId',
      align: 'center',
    },
    {
      title: 'Done/Doing',
      dataIndex: 'done',
      key: 'done',
      align: 'center',
      render: (text: boolean) => (text ? 'Done' : 'Doing'),
    },
    {
      title: 'Times',
      dataIndex: 'times',
      key: 'times',
      align: 'center',
    },
    {
      title: 'enable/disable',
      dataIndex: 'enable',
      key: 'enable',
      align: 'center',
      render: (text: boolean) => (text ? 'enable' : 'disable'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <a onClick={() => { recipeTurnOn(record.id) }}>TurnOn</a>
          <a onClick={() => { recipeTurnOff(record.id) }}>TurnOff</a>
        </Space>
      ),
    },
  ] as any

  useEffect(() => {
    getRecipes()
  }, [])

  const showModal = () => {
    setIsModalVisible(true)
  }
  const handleOk = (values: any) => {
    createRecipe(values.action, values.trigger)
    setIsModalVisible(false)
  }

  return (
    <>
      <Card title="Recipe List" style={{ width: '80%', margin: '10px auto' }}>
        <div style={{ marginBottom: 16, textAlign: 'left' }}>
          <Button type="primary" onClick={showModal}>
            Add recipe
          </Button>
        </div>
        <Table loading={loading} bordered columns={columns} dataSource={recipes} />
      </Card>

      <Recipe
        visible={isModalVisible}
        triggers={triggers}
        actions={actions}
        onCreate={handleOk}
        onCancel={() => setIsModalVisible(false)}
      />
    </>
  )
}

RecipeList.propTypes = {
  triggers: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
}

export default RecipeList
