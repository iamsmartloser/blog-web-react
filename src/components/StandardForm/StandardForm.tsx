/**
 * 表单组件
 * @auth liyan
 */
import {Col, Form, Input, InputNumber, Row, DatePicker, Radio, Checkbox, Button, Switch} from 'antd';
import React, {PureComponent} from 'react';
import StandardSelect from "@/components/StandardSelect";
import {dateUtil} from "@/utils/dateFormat";
import {FormInstance} from "antd/lib/form";
import styles from './style.less'
import StandardTreeSelect from "@/components/StandardTreeSelect";
const {RangePicker, TimePicker} = DatePicker;

export interface ConfigItem {
  code: string; // 表单fields
  label: string; // 表单label
  type?: string | undefined; // 默认为input框,类型有(input,number,select,rangePicker,timePicker,dataPicker)
  rules?: any[]; // 表单验证规则
  formatThousands?: boolean // 如果type为number时，指定是否显示千分位格式,
  children?: any  // 如果是下拉组件，则会有childr配置
  btconfig?:any,
  title?:any,// button的字
  btType?:string,
  colConfig?:any
}


interface StandardFormProps {
  config: ConfigItem[]; // 表单项配置
  initialValues?: any; // 表单默认值
  layout?: any;// 所有字段布局占比，有默认值
  onFinish?: (value: any) => void;// 点击查询按钮触发事件
  onReset?: Function;// 点击重置按钮触发事件
  onFinishFailed?: (err: any) => void; // 获取表单失败回调
  onRef?: Function // 获取表单ref回调函数
  colSpan?: any,
  hasSearchBt?:boolean,
}

const defaultLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18}
};

class StandardForm extends PureComponent<StandardFormProps> {

  formRef = React.createRef<FormInstance>();

  componentDidMount() {
    const {onRef} = this.props;
    if (onRef && this.formRef && this.formRef.current) {
      onRef(this.formRef.current)
    }
  }

  // 重置表单数据或切换城市时触发的回调
  handleReset = () => {
    const {config,initialValues,onReset} = this.props;
    const emptyFormValues = {};
    config.map((item: ConfigItem) => {
      emptyFormValues[item.code] = initialValues[item.code]||null
    });
    if (this.formRef && this.formRef.current) {
      this.formRef.current.setFieldsValue(emptyFormValues);
      if (onReset) {
        onReset()
      }
    }
  };

  // 根据配置的type渲染不同的表单组件
  getItemComponent = (item: any) => {
    const {code, type, formatThousands, children, label, ...rest} = item;
    let itemComponent = null;
    switch (type) {
      case 'none':
        itemComponent =<Input allowClear maxLength={50} bordered={false} disabled={true} {...rest} />;
        break;
      case 'check':
        itemComponent =<Checkbox {...rest}/>;
        break;
      //  数字框
      case 'number':
        // 是否转化千分位显示
        const formatterObj = formatThousands ? {
          formatter: (value: number) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          parser: (value: string) => value.replace(/\$\s?|(,*)/g, '')
        } : {};

        itemComponent = <InputNumber
          placeholder={label ? `请输入${label}` : null}
          {...formatterObj}
          style={{width: '100%'}}
          maxLength={9}
          {...rest}
        />;
        break;
      // 下拉选择框
      case 'select':
        itemComponent = <StandardSelect config={children} placeholder={label ? `请选择${label}` : null} {...rest} />;
        break;
      // 下拉树
      case 'treeSelect':
        itemComponent = <StandardTreeSelect config={children} placeholder={label ? `请选择${label}` : null} {...rest} />;
        break;
      case 'rangePicker':
        itemComponent = <RangePicker
          allowClear
          style={{width: '100%'}}
          showTime={{defaultValue: [dateUtil('00:00:00', 'HH:mm:ss'), dateUtil('23:59:59', 'HH:mm:ss')]}}
          {...rest}
        />;
        break;
      case 'timePicker':
        itemComponent = <TimePicker style={{width: '100%'}} placeholder={label ? `请选择${label}` : null} {...rest}
        />;
        break;
      case 'datePicker':
        // console.log('item:',item);
        itemComponent = <DatePicker style={{width: '100%'}} placeholder={label ? `请选择${label}` : null}  {...rest}/>;
        break;
      case 'checkBox':
        itemComponent =
          <Checkbox.Group style={{width: "100%"}} {...rest}>
            <Row>
              {children?children.data ? children.data.map((child: any,i:number) =>
                <Col span={4} key={children.key?child[children.key]:child.key||i}>
                  <Checkbox key={children.key?child[children.key]:child.key||i} value={children.key?child[children.key]:child.key||i}>{children.text?child[children.text]:child.text||item}</Checkbox>
                </Col>
              )
                : children.map((child: any,i:number) =>
                  <Col span={4} key={child.value||i}>
                    <Checkbox key={child.value||i} value={child.value||i}>{child.name||item}</Checkbox>
                  </Col>
                ):null }
            </Row>
          </Checkbox.Group>;
        break;
      case 'radio':
        itemComponent = <Radio.Group style={{width: "100%"}} {...rest}>
          <Row>
            {children?children.data ? children.data.map((child: any,i:number) =>
              <Col span={4} key={children.key?child[children.key]:child.key||i}>
                <Radio key={children.key?child[children.key]:child.key||i} value={children.key?child[children.key]:child.key||i}>{children.text?child[children.text]:child.text||item}</Radio>
              </Col>
            )
              :children.map((child: any,i:number) =>
                <Col span={4} key={child.value||i}>
                  <Radio key={child.value||i} value={child.value||i}>{child.name||item}</Radio>
                </Col>
              )
              : null}
          </Row>
        </Radio.Group>;
        break;
      case 'textArea':
        itemComponent =<Input.TextArea allowClear maxLength={256} placeholder={label ? `请输入${label}` : null} {...rest} />
          break;
      case 'switch':
        itemComponent =<Switch {...rest} />;
        break;
      // 没有配置type则默认渲染Input组件
      default:
        itemComponent = <Input allowClear maxLength={50} placeholder={label ? `请输入${label}` : null} {...rest} />;
        break;
    }
    return itemComponent;
  };

  // 渲染表单子项
  getFormItem = () => {
    const {config, layout: propsLayout, colSpan,hasSearchBt} = this.props;
    const formItemLayout = propsLayout || defaultLayout;
    const spanConf={xs: 24,sm: 24, md: 12, lg: 8, xl: 8, xxl: 6};
    const cols = config.map((item: any, index: number) => {
      const {type, btconfig, code, label, rules, colConfig, formItemConfig = {},title,btType,...rest} = item;
      const colSpanConf=colConfig||colSpan||spanConf;
      if (type === 'inputBt') {
        return <Col key={`${code}_col_${index}`} {...colSpanConf}>
          <Form.Item label={label} labelAlign="left" {...formItemLayout} {...formItemConfig}>
            <Row gutter={8}>
              <Col span={18}>
                <Form.Item noStyle name={code}>
                  {this.getItemComponent(item)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Button {...btconfig}>{btconfig&&btconfig.text || ''}</Button>
              </Col>
            </Row>
          </Form.Item>
        </Col>;
      }
      if (type === 'inputA') {
        return <Col key={`${code}_col_${index}`} {...colSpanConf}>
          <Form.Item label={label} labelAlign="left" {...formItemLayout} {...formItemConfig}>
            <Row gutter={8}>
              <Col span={18}>
                <Form.Item noStyle name={code}>
                  {this.getItemComponent(item)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <div style={{height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                  <a {...btconfig}>{btconfig&&btconfig.text||''}</a>
                </div>
              </Col>
            </Row>
          </Form.Item>
        </Col>;
      }
      if(type==='button'){
      return  <Col key={`${code}_col_${index}`} {...colSpanConf}>
          <Form.Item  labelAlign="left" {...formItemLayout} {...formItemConfig}>
            <Button type={btType||null} {...rest}>{title}</Button>
          </Form.Item>
        </Col>;
      }
      // 没有配置type则默认渲染Input组件
      return <Col key={`${code}_col_${index}`} {...colSpanConf}>
        <Form.Item label={label} labelAlign="left" {...formItemLayout} {...formItemConfig} name={code}
                   rules={rules || []}>
          {this.getItemComponent(item)}
        </Form.Item>
      </Col>;

    });

    if(hasSearchBt){
      cols.push(<Col key='_col_confirm' {...spanConf} {...colSpan} >
        <Form.Item {...formItemLayout}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{marginLeft: 8}} htmlType="button" onClick={this.handleReset}>
            重置
          </Button>
        </Form.Item>
      </Col>)
    }
    return cols;
  };

  render() {
    const {initialValues,onFinish} = this.props;
    return (
      <Form
        className={styles.standard_form}
        ref={this.formRef}
        name="standard_form"
        initialValues={initialValues || {}}
        onFinish={onFinish}
      >
        <Row gutter={24}>
          {this.getFormItem()}
        </Row>
      </Form>
    );
  }
}


export default StandardForm;
