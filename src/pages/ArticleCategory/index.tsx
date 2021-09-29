/**
 * 后台管理-文章分类列表
 */
import {Button, Card, message, Popconfirm, Spin} from 'antd';
import React, {PureComponent} from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import AdvancedSearch from "@/components/AdvancedSearch/AdvancedSearch";
import style from './style.less'
import {PlusOutlined} from "@ant-design/icons/lib";
import {Dispatch} from "@@/plugin-dva/connect";
import {connect} from "@@/plugin-dva/exports";
import EditModal from "@/pages/ArticleCategory/components/EditModal";

class TableList extends PureComponent<{ loading: boolean, confirmLoading:boolean,dispatch: Dispatch }, { data: any }> {

  defaultOrderConfig: any = {};

  AdvancedSearchInitValues: any = {};

  AdvancedSearchConfig: any[] = [
    {
      code: 'Q_eq_name',
      label: '名称',
    },
    {
      code: 'Q_eq_enName',
      label: '英文名',
    },
  ];

  state: any = {
    page: null,
    list: [],
    editRow: null,
    formValue: this.AdvancedSearchInitValues,
    orderConfig: this.defaultOrderConfig
  };

  componentDidMount() {
    this.onReset()
  }

// 获取列表数据
  getList = (params?: any) => {
    const {dispatch} = this.props;
    const {orderConfig, formValue, page} = this.state;
    // 一些默认参数
    const defaultParams: any = {
      ...formValue,
      ...orderConfig,
      page,
      ...params
    };

    dispatch({
      type: 'articleCategoryListModel/getData', payload: defaultParams,
      callback: (res: any) => {
        if (res.code === 200) {
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

  handleModalVisible = (visible?: boolean, record?: any) => {
    this.setState({visible: !!visible, editRow: record})
  };

  onEditOk = (value: any) => {
    const {dispatch} = this.props;
    const {editRow} = this.state;
    const params=value;
    let type:string = 'articleCategoryListModel/create'
    if(editRow&&editRow.id){
      params.id=editRow.id
      type = 'articleCategoryListModel/update'
    }
    dispatch({
      type,
      payload: params,
      callback: (res: any) => {
        if (res.code === 200) {
          this.onReset();
          this.handleModalVisible()
          message.success(res.message || '操作成功')
        } else {
          message.error(res.message || '操作失败')
        }
      }
    })
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
    const {dispatch} = this.props;
    dispatch({
      type: 'articleCategoryListModel/delete', payload: record.id,
      callback: (res: any) => {
        if (res.code === 200) {
          this.onReset();
          message.success(res.message || '删除成功')
        } else {
          message.error(res.message || '删除失败')
        }
      }
    })
  };

  onViewClick = (record?: any) => {
  };

  columns = () => {
    return [
      {
        dataIndex: 'name',
        title: '名称',
        width: 120,
      },
      {
        dataIndex: 'enName',
        title: '英文名',
        width: 120
      },
      {
        dataIndex: 'operate',
        title: '操作',
        width: 120,
        align: 'center',
        render: (text: string, record: any) => {
          return (
            <>
              <Button type='link' style={{marginRight: 8}} onClick={() => this.handleModalVisible(true,record)}>编辑</Button>
              <Popconfirm
                title="删除后数据不可恢复，请确认您是否要删除?"
                placement="rightBottom"
                onConfirm={() => this.handleDelete(record)}>
                <Button type='link' style={{marginRight: 8}}>删除</Button>
              </Popconfirm>
            </>
          )
        }
      },
    ]
  };

  render() {
    const {loading,confirmLoading} = this.props;
    const {page, list,visible,editRow,} = this.state;

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
                  storageId: 'article_category_list_id',
                  extra: <Button type="primary"
                                 onClick={() => this.handleModalVisible(true)}><PlusOutlined/>新建</Button>
                }}
                data={{page, list}}
                columns={this.columns()}
                onChange={this.handleStandardTableChange}
              />
              {visible&&<EditModal
                modalVisible={visible}
                handleModalVisible={this.handleModalVisible}
                data={editRow}
                onOk={this.onEditOk}
                confirmLoading={confirmLoading}/>}
            </Spin>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({loading}: any) => ({
  loading: loading.effects['articleCategoryListModel/getData']?loading.effects['articleCategoryListModel/delete']:false,
  confirmLoading: loading.effects['articleCategoryListModel/update']||loading.effects['articleCategoryListModel/create'],
}))(TableList);

