import { Form, Modal, Select } from 'antd'
import PropTypes from 'prop-types'
const Recipe = ({ visible, triggers, actions, onCreate, onCancel }: any) => {
  const [form] = Form.useForm()

  return (
    <Modal
      title="Create Recipe"
      getContainer={false}
      maskClosable={false}
      visible={visible}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onCreate(values)
          })
          .catch((info) => {
            console.error('Validate Failed:', info)
          })
      }}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          label="Trigger"
          name="trigger"
        >
          <Select placeholder="Select a trigger">
            {
              triggers.map((trigger: any) => {
                return (
                  <Select.Option key={trigger.id} value={trigger.id}>
                    {trigger.id}
                  </Select.Option>
                )
              })
            }
          </Select>
        </Form.Item>

        <Form.Item
          label="Action"
          name="action"
        >
          <Select placeholder="Select a action">
            {
              actions.map((action: any) => {
                return (
                  <Select.Option key={action.id} value={action.id}>
                    {action.id}
                  </Select.Option>
                )
              })
            }
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

Recipe.propTypes = {
  visible: PropTypes.bool.isRequired,
  triggers: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default Recipe
