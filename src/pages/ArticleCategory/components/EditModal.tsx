import React, {PureComponent} from 'react';
import {Modal} from 'antd';
import StandardForm from "@/components/StandardForm/StandardForm";

interface PProps {
  modalVisible: boolean;
  handleModalVisible: Function;
  data: any,
  onOk: any,
  confirmLoading: boolean,
}

class EditModal extends PureComponent<PProps, any> {
  formRef: any = null;

  initValues: any = {};

  formConfig: any = [
    {
      code: 'name',
      label: '中文名',
      rules:[{required: true, message: '中文名！'}]
    },
    {
      code: 'enName',
      label: '英文名',
      rules:[{required: true, message: '请输入英文名！'}]
    },
  ];

  constructor(props: any) {
    super(props);
    const {data} = props;
    this.initValues = data || {};
  }

  handleOk = () => {
    const {onOk} = this.props;
    if (this.formRef) {
      this.formRef.validateFields().then((value: any) => {
        if (onOk) {
          onOk(value)
        }
      }).catch((err: any) => {
        console.error("err", err)
      });
    }
  };

  render() {
    const {modalVisible, handleModalVisible, confirmLoading,data} = this.props;
    const title = data?'编辑文章分类':'新增文章分类';
    return (
      <Modal
        destroyOnClose
        title={title}
        width={400}
        visible={modalVisible}
        onOk={this.handleOk}
        closable
        onCancel={() => handleModalVisible(false)}
        confirmLoading={confirmLoading}
      >
        <StandardForm
          onRef={(ref: any) => this.formRef = ref}
          colSpan={{sm: 24, md: 24, lg: 24, xl: 24, xxl: 24}}
          config={this.formConfig}
          initialValues={this.initValues}
        />
      </Modal>
    )
  }
}

export default EditModal;
