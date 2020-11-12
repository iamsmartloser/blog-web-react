import {Alert, Table, Button, Popover, Tooltip} from 'antd';
import {Resizable} from 'react-resizable';
import {ColumnProps, TableRowSelection, TableProps, TablePaginationConfig} from 'antd/es/table';
import React, {PureComponent, Fragment} from 'react';
import {setStore, hasStore, removeStore, getStore} from '@/utils/store';
import CheckboxComp from "@/components/CheckboxComp";
import {TableListItem} from './data.d';
import styles from './index.less';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: StandardTableColumnProps[];
  data: {
    list: TableListItem[];
    page: any;
  };
  selectedRows?: TableListItem[];
  type?: string;
  onSelectRow?: (rows: any) => void;
  // 工具栏配置 storageId筛选记录缓存本地
  toolBarConfig?: {
    storageId: string,
    initFilters?: any[],
    extra?: any
  },
  scroll?:any,
}

export interface StandardTableColumnProps extends ColumnProps<TableListItem> {
  needTotal?: boolean;
  total?: number;
}

function initTotalList(columns: StandardTableColumnProps[]) {
  if (!columns) {
    return [];
  }
  const totalList: StandardTableColumnProps[] = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({...column, total: 0});
    }
  });
  return totalList;
}

interface StandardTableState {
  selectedRowKeys: string[];
  needTotalList: StandardTableColumnProps[];
  columns: any[]
}

const ResizableTitle = (props: any) => {
  const {onResize, width, ...restProps} = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={e => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{enableUserSelectHack: false}}
    >
      <th {...restProps} />
    </Resizable>
  );
};

class StandardTable extends PureComponent<StandardTableProps<TableListItem>, StandardTableState> {

  static getDerivedStateFromProps(nextProps: StandardTableProps<TableListItem>) {
    // clean state
    if (nextProps.selectedRows && nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  constructor(props: StandardTableProps<TableListItem>) {
    super(props);
    const {columns} = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
      columns: this.getColumnsFromFilter()
    };
  }

  handleRowSelectChange: TableRowSelection<TableListItem>['onChange'] = (
    selectedRowKeys: string[],
    selectedRows: TableListItem[],
  ) => {
    const currySelectedRowKeys = selectedRowKeys as string[];
    let {needTotalList} = this.state;
    needTotalList = needTotalList.map((item: any) => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
    }));

    const {onSelectRow} = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({selectedRowKeys: currySelectedRowKeys, needTotalList});
  };

  handleTableChange: TableProps<TableListItem>['onChange'] = (
    page,
    filters,
    sorter,
    ...rest
  ) => {
    const {onChange} = this.props;
    if (onChange) {
      onChange(page, filters, sorter, ...rest);
    }
  };

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], []);
    }
  };

  // 将列配置信息缓存到localstorage里
  setColumnsFilter = (checkedListKeys: any) => {
    const {toolBarConfig} = this.props || {};
    if (toolBarConfig && toolBarConfig.storageId) {
      if (hasStore(`${toolBarConfig.storageId}`)) {
        removeStore(`${toolBarConfig.storageId}`)
      }
      setStore(`${toolBarConfig.storageId}`, checkedListKeys);

      this.setState({columns: this.getColumnsFromFilter()})
    }
  };

  // 将列配置信息从localstorage里读取出来
  getColumnsFromFilter = () => {
    const {toolBarConfig, columns} = this.props || {};
    let tempColumns: any[] = columns || [];
    if (toolBarConfig && toolBarConfig.storageId) {
      if (hasStore(`${toolBarConfig.storageId}`)) {
        const checkedListKeys = getStore(`${toolBarConfig.storageId}`);
        tempColumns = tempColumns.filter((item: any) => checkedListKeys.includes(item.dataIndex))
      }
    }
    return tempColumns;
  };

  getColumnsFiltersLayout = () => {
    const {columns, toolBarConfig} = this.props;
    const {columns: stateColumns} = this.state;
    const {initFilters} = toolBarConfig;
    const data = columns ? columns.map((col: any) => {
      return {...col, name: col.title, value: col.dataIndex}
    }) : [];
    const defaultValue = stateColumns ? stateColumns.map((col: any) => {
      return {...col, name: col.title, value: col.dataIndex}
    }) : [];
    return (<CheckboxComp
      data={data}
      onChange={this.setColumnsFilter}
      defaultValue={defaultValue}// 本地保存的默认值
      initValue={initFilters || data}// 重置的最最初始的值
    />)
  };

  getTotalWidth = (columns: any) => {
    // const { columns } = this.state;
    let sum: any = 0;
    for (const col of columns) {
      if (col.width) {
        sum += col.width
      } else {
        sum = null;
        break;
      }
    }
    return sum;
  };

  //用户手动拉列宽度
  handleResize = (index: number) => (e: any, {size}: any) => {
    this.setState(({columns}) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return {columns: nextColumns};
    });
  };

  render() {

    const {selectedRowKeys, needTotalList, columns} = this.state;
    const {data, rowKey, type, toolBarConfig, scroll, columns: propsCol, components, ...rest} = this.props;
    const {list = [], page = null} = data || {};

    const col = columns.map((item: any, index: number) => {
      return {
        ...item,
        onHeaderCell: (column: any) => ({
          width: column.width || 500,
          onResize: this.handleResize(index),
        }),
        render: item.render ? item.render
          : (val: any) => {
            return (<Tooltip
              title={(val === undefined || val === null || val === '') ? '_' : val}
              trigger='hover'
              // placement='right'
            >
              <span>{(val === undefined || val === null || val === '') ? '_' : val}</span>
            </Tooltip>)
          }
      }
    });

    const pageInfo: any = !page ? {
      current: 1, pageSize: 10, total: 0,
    } : {
      pageSize: page.size,
      total: page.total,
      current: page.current
    };

    const defaultPagination: TablePaginationConfig = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number) => `共 ${total} 条`,
      size: 'default',
      ...pageInfo,
    };
    const paginationProps = page === false ? false : defaultPagination;
    let rowSelection: any = null;
    if (this.props.onSelectRow) {
      rowSelection = {
        selectedRowKeys,
        onChange: this.handleRowSelectChange,
        getCheckboxProps: (record: TableListItem) => ({
          disabled: record.disabled,
        }),
        type: type || "checkbox",
      };
    }
    list.forEach((item, index) => {
      if (!item.id) {
        item.id = index;
      }
    });
    const selectable = !!rowSelection;

    return (
      <div className={styles.standardTable}>
        {/* 工具栏 */}
        {toolBarConfig && <div className={styles.toolBar}>
          {/* 一般为新建按钮 */}
          {toolBarConfig.extra && <span className={styles.toolItem}>{toolBarConfig.extra}</span>}
          {/* 字段显示筛选按钮 */}
          {toolBarConfig.storageId &&
          <Popover placement="rightTop" title="请选择显示字段" content={this.getColumnsFiltersLayout()} trigger="click">
              <Button className={styles.toolItem}>筛选</Button>
          </Popover>}
        </div>}
        {
          selectable
          && <div className={styles.tableAlert}>
              <Alert
                  message={
                    <Fragment>
                      已选择 <a style={{fontWeight: 600}}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                      {needTotalList.map((item, index) => (
                        <span style={{marginLeft: 8}} key={`select_${item.dataIndex}`}>
                    {item.title}
                          总计&nbsp;
                          <span style={{fontWeight: 600}}>
                      {item.render
                        ? item.render(item.total, item as TableListItem, index)
                        : item.total}
                    </span>
                  </span>
                      ))}
                      <a onClick={this.cleanSelectedKeys} style={{marginLeft: 24}}>
                        清空
                      </a>
                    </Fragment>
                  }
                  type="info"
                  showIcon
              />
          </div>
        }

        <Table
          bordered
          size='small'
          rowKey={rowKey || 'id'}
          rowSelection={rowSelection as any}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={scroll!==undefined ? scroll : {x: this.getTotalWidth(col)}}
          components={{...components, header: {cell: ResizableTitle}}}
          columns={col}
          {...rest}
        />

      </div>
    );
  }
}

export default StandardTable;
