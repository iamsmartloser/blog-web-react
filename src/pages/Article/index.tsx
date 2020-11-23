/**
 * 后台管理-文章列表
 */
import {Button, message, Popconfirm, Spin} from 'antd';
import React, {PureComponent} from 'react';
import StandardTable from '@/components/StandardTable';
import AdvancedSearch from "@/components/AdvancedSearch/AdvancedSearch";
import style from './style.less'
import {PlusOutlined} from "@ant-design/icons/lib";
import {Dispatch} from "@@/plugin-dva/connect";
import {connect} from "@@/plugin-dva/exports";
import EditArticle from "@/pages/Article/components/EditArticle";

class TableList extends PureComponent<{ loading: boolean, dispatch: Dispatch }, { data: any }> {

  defaultOrderConfig: any = {};

  AdvancedSearchInitValues: any = {};

  AdvancedSearchConfig: any[] = [
    {
      code: '1',
      label: '题目',
    },
    {
      type: 'select',
      code: 'status',
      label: '状态',
      children: {
        data: ['草稿', '已发布'],
      }
    },
  ];

  state: any = {
    editStatus: 0,
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
      type: 'articleListModel/getData', payload: defaultParams,
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

  // 0:不在编辑新增状态（列表页），1：add，2：edit
  setEditStatus = (editStatus: number,record=null) => {
    this.setState({editStatus, editRow:record})
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
      type: 'articleListModel/delete', payload: record.id,
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
        dataIndex: 'category.name',
        title: '分类',
        width: 120,
        render:(text,record)=>{
          return record.category.name
        }
      },
      {
        dataIndex: 'tags',
        title: '标签',
        width: 120,
        render:(text,record)=>{
         return  record.tags.reduce((res,tag,index)=>{
            return res+tag.name+','
          },'')
        }
      },
      {
        dataIndex: 'createdAt',
        title: '创建时间',
        width: 120
      },
      {
        dataIndex: 'updatedAt',
        title: '更新时间',
        width: 120
      },
      {
        dataIndex: 'publishAt',
        title: '发布时间',
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
              <a style={{marginRight: 8}} onClick={() => this.setEditStatus(2,record)}>编辑</a>
              <Popconfirm
                title="删除后数据不可恢复，请确认您是否要删除?"
                placement="rightBottom"
                onConfirm={() => this.handleDelete(record)}>
                <a style={{marginRight: 8}}>删除</a>
              </Popconfirm>
              <a onClick={() => this.onViewClick(record)}>查看</a>
            </>
          )
        }
      },
    ]
  };

  render() {
    const {loading} = this.props;
    const {page, list, editStatus, editRow} = this.state;

    return (
      <Spin
        tip=''
        spinning={loading}
      >
        {editStatus !== 0 ? <EditArticle
            {...this.props}
            editRow={editRow}
            setEditStatus={this.setEditStatus}
          />
        : <div className={style.page_wrap}>

          {/* 查询头 */}
          <AdvancedSearch
            config={this.AdvancedSearchConfig}
            initialValues={this.AdvancedSearchInitValues}
            onFinish={this.onFinish}
            onReset={this.onReset}
          />
          <StandardTable
            toolBarConfig={{
              storageId: 'article_list_id',
              extra: <Button type="primary"
                             onClick={() => this.setEditStatus(1)}><PlusOutlined/>新建</Button>
            }}
            data={{page, list}}
            columns={this.columns()}
            onChange={this.handleStandardTableChange}
          />

        </div>}
      </Spin>
    );
  }
}

export default connect(({loading}: any) => ({
  loading: !!loading.effects['articleListModel/getData']  ||!!loading.effects['articleListModel/update']
    ||!!loading.effects['articleListModel/create']||!!loading.effects['articleListModel/delete']
    ||!!loading.effects['articleListModel/getDetail'],

}))(TableList);

