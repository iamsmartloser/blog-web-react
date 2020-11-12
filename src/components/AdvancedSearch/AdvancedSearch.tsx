/**
 * 全局高级查询表单组件
 * @auth liyan
 */
import {Button, Col, Form, Input, InputNumber, Row, DatePicker, Radio, Checkbox} from 'antd';
import React, {FC, useState} from 'react';
import {DownOutlined, UpOutlined} from '@ant-design/icons';
import StandardSelect from "@/components/StandardSelect";
import {dateUtil} from "@/utils/dateFormat";
import styles from './style.less'

const {RangePicker, TimePicker} = DatePicker;

export interface ConfigItem {
  code: string; // 表单fields
  label: string; // 表单label
  type?: string | undefined; // 默认为input框,类型有(input,number,select,rangePicker,timePicker,dataPicker)
  rules?: any[]; // 表单验证规则
  formatThousands?: boolean // 如果type为number时，指定是否显示千分位格式,
  children?: any  // 如果是下拉组件，则会有childr配置
}


interface AdvancedSearchProps {
  config: ConfigItem[]; // 表单项配置
  initialValues?: any; // 表单默认值
  layout?: any;// 所有字段布局占比，有默认值
  onFinish?: (value: any) => void;// 点击查询按钮触发事件
  onReset?: Function;// 点击重置按钮触发事件
  onFinishFailed?: (err: any) => void; // 获取表单失败回调
}

const defaultLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 17}
};

const AdvancedSearch: FC<AdvancedSearchProps> = (props) => {
  const [form] = Form.useForm();
  const [expand, setExpand] = useState<boolean>(false);
  const {onReset, onFinish, onFinishFailed, config, layout: propsLayout, initialValues} = props;

  // 重置表单数据或切换城市时触发的回调
  const handleReset = () => {
    const emptyFormValues = {};
    config.map((item: ConfigItem) => {
      emptyFormValues[item.code] = initialValues[item.code] || null
    });
    form.setFieldsValue(emptyFormValues);
    // form && form.resetFields();
    if (onReset) {
      onReset()
    }
  };

  // 根据配置的type渲染不同的表单组件,没有配置type则默认渲染Input组件
  const getItemComponent = (item: any) => {
    const {code, type, formatThousands, children, label, ...rest} = item;
    let itemComponent = null;
    switch (type) {
      case 'none':
        itemComponent =<Input allowClear maxLength={50} bordered={false} disabled={true} {...rest} />;
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
      case 'rangeNumber':
        itemComponent = '';
        break;
      // 下拉选择框
      case 'select':
        itemComponent = <StandardSelect config={children} placeholder={label ? `请选择${label}` : null} {...rest} />;
        break;
      case 'rangePicker':
        itemComponent = <RangePicker
          allowClear
          style={{width: '100%'}}
          showTime={{defaultValue: [dateUtil('00:00:00', 'HH:mm:ss'), dateUtil('23:59:59', 'HH:mm:ss')]}}
          {...rest}
        />;
        break;
      case 'monthPicker':
        itemComponent = <DatePicker.MonthPicker
          allowClear
          style={{width: '100%'}}
          {...rest}
        />;
        break;
      case 'timePicker':
        itemComponent = <TimePicker
          style={{width: '100%'}}
          placeholder={label ? `请选择${label}` : null}
          format={'HH:mm:ss'}
          {...rest}
        />;
        break;
      case 'datePicker':
        // console.log('item:',item);
        itemComponent = <DatePicker style={{width: '100%'}} placeholder={label ? `请选择${label}` : null}  {...rest}/>;
        break;
      case 'checkBox':
        itemComponent =
          <Checkbox.Group style={{width: "100%"}} {...rest}>
            {children ? children.map((child: any) => <Checkbox key={child.key}
                                                               value={child.key}>{child.text}</Checkbox>) : null}
          </Checkbox.Group>;
        break;
      case 'radio':
        itemComponent = <Radio.Group {...rest}>
          {children ? children.map((child: any) => <Radio key={child.key}
                                                          value={child.key}>{child.text}</Radio>) : null}
        </Radio.Group>;
        break;
      // 没有配置type则默认渲染Input组件
      default:
        itemComponent = <Input allowClear maxLength={50} placeholder={label ? `请输入${label}` : null} {...rest} />;
        break;
    }
    return itemComponent;
  };

  // 渲染表单子项
  const getFormItem = () => {
    const formItemLayout = propsLayout || defaultLayout;
    const cols = config.map((item: any, index: number) => {
      const {code, label, rules, colConfig = {}, formItemConfig = {}, type} = item;
      if (type === 'rangeNumber') {
        return <Col key={`${code}_col_${index}`} xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}
                    style={{display: index > 2 && !expand ? 'none' : 'block'}} {...colConfig}>
          <Form.Item label={label} labelAlign="left" {...formItemLayout} {...formItemConfig}>
            {item.children&&item.children[0]&& <Form.Item name={item.children[0].code} rules={rules || []} noStyle>
              {getItemComponent(item.children[0])}
            </Form.Item>}
            <span style={{width:'10%'}}>~</span>
            {item.children&&item.children[1]&&<Form.Item name={item.children[1].code} rules={rules || []} noStyle>
              {getItemComponent(item.children[1])}
            </Form.Item>}
          </Form.Item>
        </Col>;
      } else {
        return <Col key={`${code}_col_${index}`} xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}
                    style={{display: index > 2 && !expand ? 'none' : 'block'}} {...colConfig}>
          <Form.Item label={label} labelAlign="left" {...formItemLayout} {...formItemConfig} name={code}
                     rules={rules || []}>
            {getItemComponent(item)}
          </Form.Item>
        </Col>;
      }
    });
    cols.push(<Col key="search_bt_col_" xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
      <div style={{marginBottom: '24px'}}>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
        <Button style={{marginLeft: 8}} htmlType="button" onClick={handleReset}>
          重置
        </Button>
        {config && config.length > 3 && <a
            style={{fontSize: 12, marginLeft: 8}}
            onClick={() => {
              setExpand(!expand);
            }}
        >
          {expand ? <UpOutlined/> : <DownOutlined/>} {expand ? '收起' : '展开'}
        </a>}
      </div>
    </Col>);
    return cols;
  };

  return (
    <Form
      className={styles.advance_search}
      form={form}
      name="advanced_search"
      initialValues={initialValues || []}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row gutter={24}>
        {getFormItem()}
      </Row>
    </Form>
  );
};


export default AdvancedSearch;
