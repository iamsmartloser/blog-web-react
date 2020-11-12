/**
 * 后台管理-文章列表
 */
import {Button, Card, message, Spin} from 'antd';
import React, {PureComponent} from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import AdvancedSearch from "@/components/AdvancedSearch/AdvancedSearch";
import style from './style.less'
import {PlusOutlined} from "@ant-design/icons/lib";
import {Dispatch} from "@@/plugin-dva/connect";
import {connect} from "@@/plugin-dva/exports";

class TableList extends PureComponent<{loading: boolean,dispatch:Dispatch }, {data:any}> {

  defaultOrderConfig: any = {
  };

  AdvancedSearchInitValues: any = {};

  AdvancedSearchConfig: any[] = [
    {
      code: '1',
      label: '题目',
    },
    {
      type:'select',
      code:'status',
      label: '状态',
      children:{
        data:['草稿','已发布'],
      }
    },
  ];

  state: any = {
    page:null,
    list:[],
    editRow: null,
    formValue: this.AdvancedSearchInitValues,
    orderConfig: this.defaultOrderConfig
  };

  componentDidMount() {
    this.onReset()
  }

// 获取列表数据
  getList = (params?: any) => {
    const {dispatch}=this.props;
    const {orderConfig, formValue, page} = this.state;
    // 一些默认参数
    const defaultParams: any = {
      ...formValue,
      ...orderConfig,
      page,
      ...params
    };

    dispatch({type:'articleListModel/getData',payload:defaultParams,
    callback:(res:any)=>{
      if(res.code===200){
        this.setState({page: res.page, list: res.result})
      }
    }
    });
  };

// 重置表单数据或切换城市时触发的回调
  onReset = () => {
    this.setState({formValue: this.AdvancedSearchInitValues}, () => this.getList({page: {}}));
  };

// 表单点击查询按钮后的回调事件
  onFinish = (values: any) => {
    this.setState({formValue: values}, () => this.getList({page: {}}))
  };

  handleModalVisible = (visible?: boolean,record?:any) => {
    this.setState({visible: !!visible,editRow:record})
  };

  handleCreateModalVisible = (visible?: boolean) => {
    this.setState({createVisible: !!visible})
  };

  handleEdit = (record: any) => {
    // 弹出修改弹窗
    this.handleModalVisible(true,record)
  };

  onEditOk = (value:any) => {
    const {dispatch} = this.props;
    const {editRow} = this.state;
    dispatch({type: 'partnerResearch/update', payload: {id:editRow.id,...value},
    callback:(res:any)=>{
      if(res&&res.code===0){
        message.success('编辑成功');
        this.handleModalVisible();
        this.getList()
      }else {
        message.error(res&&res.message||'编辑失败请重试');
      }
    }});
  };

// 分页、排序、筛选变化时触发
  handleStandardTableChange = (pagination: any, filtersArg: any, sorter: any) => {
    const params = {
      page: {current: pagination.current, size: pagination.pageSize, total: pagination.total}
    };
    if (sorter.field) {// 如果排序字段存在
      const orderConfig = this.getOrders(sorter.field, sorter.order);
      Object.assign(params);
      this.setState({orderConfig}, () => this.getList(params))
    } else {
      this.getList(params)
    }
  };

// order:1正序，2倒序,按某一字段排序时，其余字段排序设为0
  getOrders = (field: string, order: string) => {
    const {orderConfig} = this.state;
    let result: any = {};
    if (!order) {
      result = this.defaultOrderConfig;
      return result;
    }
    // 所有都先置为0
    Object.keys(orderConfig).map((key: string) => {
      result[key] = 0
    });
    let orderParam = 0;
    if (order === 'ascend') {
      orderParam = 1
    }
    if (order === 'descend') {
      orderParam = 2
    }
    switch (field) {
      case 'price':
        result.priceOrder = orderParam;
        break;
      case 'stockQuantity':
        result.stockQuantityOrder = orderParam;
        break;
      case 'saleCount':
        result.saleCountOrder = orderParam;
        break;
      default:
        break;
    }
    return result
  };

  handleDelete = (record: any) => {

  };

  onViewClick = (record?: any) => {
  };

  columns=()=>{
    return [
      {
        dataIndex: 'title',
        title: '标题',
        width: 120,
      },
      {
        dataIndex: 'abstract',
        title: '摘要',
        width: 120
      },
      {
        dataIndex: 'operate',
        title: '操作',
        width: 120,
        align: 'center',
        render: (text: string, record: any) => {
          return (
            <span>
          <Button type='link' style={{marginRight: 8}} onClick={() => this.handleEdit(record)}>编辑</Button>
          <Button type='link' style={{marginRight: 8}} onClick={() => this.handleDelete(record)}>删除</Button>
          <Button type='link' onClick={() => this.onViewClick(record)}>查看</Button>
         </span>
          )
        }
      },
    ]
  };

  render() {
    const {loading} = this.props;
    const {page, list} = this.state;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={style.page_wrap}>
            <Spin
              tip=''
              spinning={loading}
            >
              {/* 查询头 */}
              <AdvancedSearch
                config={this.AdvancedSearchConfig}
                initialValues={this.AdvancedSearchInitValues}
                onFinish={this.onFinish}
                onReset={this.onReset}
              />
              <StandardTable
                toolBarConfig={{
                  storageId: 'partnerResearch_id',
                  extra: <Button type="primary"
                                 onClick={() => this.handleCreateModalVisible(true)}><PlusOutlined/>新建</Button>
                }}
                data={{page,list}}
                columns={this.columns()}
                onChange={this.handleStandardTableChange}
              />
            </Spin>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({loading}:any)=>({
  loading:loading.effects['articleListModel/getData']
}))(TableList) ;

