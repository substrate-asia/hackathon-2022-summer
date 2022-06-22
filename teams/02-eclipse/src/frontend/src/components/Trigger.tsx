import { DatePicker, Form, Input, Modal, Select } from 'antd'
import PropTypes from 'prop-types'

const Trigger = ({ visible, onCreate, onCancel }: any) => {
  const [form] = Form.useForm()

  return (
    <Modal
      title="Create Trigger"
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
        name="TriggerForm"
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        initialValues={{ triggerType: '' }}
        autoComplete="off"
        style={{ padding: '20px' }}
      >
        <Form.Item
          label="触发类型"
          name="triggerType"
          rules={[{ required: true, message: 'Please input your triggerType!' }]}
        >
          <Select placeholder="Select a trigger type">
            <Select.Option value="Timer">间隔触发</Select.Option>
            <Select.Option value="Schedule">定时触发</Select.Option>
            <Select.Option value="PriceGT">价格上限触发</Select.Option>
            <Select.Option value="PriceLT">价格下限触发</Select.Option>
            <Select.Option value="Arh999LT">Arh999 less than</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.triggerType !== currentValues.triggerType}
        >
          {({ getFieldValue }) => {
            const triggerType = getFieldValue('triggerType')
            if (triggerType === 'Timer') {
              return (
                <Form.Item
                  label="间隔时间"
                  name="interval"
                  rules={[{ required: true, message: 'Please input timer!' }]}
                >
                  <Input placeholder="Interval" addonAfter="秒" />
                </Form.Item>
              )
            }
            else if (triggerType === 'Schedule') {
              return (
                <Form.Item
                  label="定时时间"
                  name="schedule"
                  rules={[{ required: true, message: 'Please input schedule!' }]}
                >
                  <DatePicker showTime />
                </Form.Item>
              )
            }
            else if (triggerType === 'PriceGT') {
              return (
                <Form.Item
                  label="价格上限"
                  name="priceGT"
                  rules={[{ required: true, message: 'Please input priceGT!' }]}
                >
                  <Input placeholder="PriceGT" />
                </Form.Item>
              )
            }
            else if (triggerType === 'PriceLT') {
              return (
                <Form.Item
                  label="价格下限"
                  name="priceLT"
                  rules={[{ required: true, message: 'Please input priceLT!' }]}
                >
                  <Input placeholder="PriceLT" />
                </Form.Item>
              )
            }
            else if (triggerType === 'Arh999LT') {
              return (
                <>
                  <Form.Item
                    label="indicator"
                    name="indicator"
                    rules={[{ required: true, message: 'Please input indicator!' }]}
                  >
                    <Input placeholder="Arh999LT indicator" />
                  </Form.Item>

                  <Form.Item
                    label="seconds"
                    name="seconds"
                    rules={[{ required: true, message: 'Please input seconds!' }]}
                  >
                    <Input placeholder="Minimum seconds between buy" />
                  </Form.Item>
              </>
              )
            }
          }}
        </Form.Item>
      </Form>
    </Modal>

  )
}

Trigger.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default Trigger
