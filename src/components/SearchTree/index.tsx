import React, {PureComponent} from "react";
import styles from "./index.less";
import {Tree, Input} from "antd";
import {isEqual} from 'lodash';
import {TreeProps} from "antd/lib/tree";
import {DownOutlined, FileOutlined, FolderOpenOutlined, FolderOutlined} from "@ant-design/icons/lib";

const {Search} = Input;

const defaultProps = {
  title: '',// 树控件的左上角标题，可传入自定义布局
  extra: null,// 树控件的右上角操作组建（查询框、按钮等），可传入自定义布局
  showSearch: true,// 是否显示查询框，默认显示
  searchPlaceholder: '输入关键字查询',// 查询框默认提示信息
  checkedKeys: [],// （受控）选中复选框的树节点
  reader: {// 树控件行项目显示字段配置，
    key:'id',
    name: 'title',// name为主要显示字段，不传入默认为name字段
    childCode: 'children',// 树的子节点的代码，因为有些数据源的子节点叫child有些又叫children
    nameSuffix: null,// name的后缀显示内容，不传入不显示,传入形如[{beforeDesc:'(',afterDesc:')',code:'code'}]
    description: null,  // description为辅助显示字段,形如[{beforeDesc:'(',afterDesc:')',code:'code'}]
  },
};

interface Props extends TreeProps {
  title?: any,  // 树控件的左上角标题，可传入自定义布局
  extra?: any,   // 树控件的右上角操作组建（查询框、按钮等），可传入自定义布局
  showSearch?: boolean,   // 是否显示查询框，默认显示
  checkedKeys?: any[],// （受控）选中复选框的树节点（注意：父子节点有关联，如果传入父节点 key，
  // 则子节点自动选中；相应当子节点 key 都传入，父节点也自动选中。当设置checkable和checkStrictly，
  // 它是一个有checked和halfChecked属性的对象，并且父子节点的选中与否不再关联
  searchPlaceholder?: string,  // 查询框默认提示信息
  dataSource: any[],  // 树控件源数据
  // 树控件行项目显示字段配置，，
  reader: {
    key?: string,
    name?: string,   // name为主要显示字段，不传入默认为name字段
    childCode?: string,  // 树的子节点的代码，因为有些数据源的子节点叫child有些又叫children
    nameSuffix?: any[],// name的后缀显示内容，不传入不显示,传入形如[{beforeDesc:'(',afterDesc:')',code:'code'}]
    description?: any[],   // (此字段不推荐配置，不符合常规的页面展示) description为辅助显示字段，
    // 不传入不显示,形如[{beforeDesc:'(',afterDesc:')',code:'code'}]
  } ,
  onSelect?: any,  // 单选时调用的方法
  onCheck?: any,  // 多选时调用的方法
  onDrop?: any,  // 拖动时调用的方法
}

type SearchTreeProps=Props& Partial<typeof defaultProps>;

interface SearchTreeState {
  dataSource: any[],
  dataList:any[],
  searchValue: string,
  findResultData: any[],
  autoExpandParent: boolean,
  expandedKeys: any[],
  selectedKeys:any [],
  selectedNodes: any,
  loading: boolean,
  yHeight: any,
}

class SearchTree extends PureComponent<SearchTreeProps,SearchTreeState> {

  static defaultProps = defaultProps;

  state:SearchTreeState = {
    dataSource: [],
    searchValue: '',
    findResultData: [],
    autoExpandParent: true,
    expandedKeys: [],
    selectedKeys: [],
    selectedNodes: {},
    loading: false,
    yHeight: null,
    dataList:[],
  };

  componentDidUpdate(prevProps: SearchTreeProps) {
    const {dataSource} = this.props;
    const {dataSource: preDataSource} = prevProps;
    if (!isEqual(preDataSource, dataSource)) {
      this.init(dataSource)
    }
  }

  init = (dataSource: any) => {
    const {reader}=this.props;
    const {childCode}=reader;
    const dataList:any=[];
    const generateList = (tree: any) => {
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        dataList.push(node);
        if (node[childCode]) {
          generateList(node[childCode]);
        }
      }
    };
    generateList(dataSource);
    this.setState({dataSource,dataList},()=>{})
  };

  getParentKey:any = (pKey:any, tree:any) => {
    const {reader}=this.props;
    const {key,childCode}=reader;
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node[childCode]) {
        if (node[childCode].some((item:any) => item[key] === pKey)) {
          parentKey = node[key];
        } else if (this.getParentKey(pKey, node[childCode])) {
          parentKey = this.getParentKey(pKey, node[childCode]);
        }
      }
    }
    return parentKey;
  };

  onExpand = (expandedKeys:any) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  };

  /**
   * 通过key值查找节点信息
   * @param dataSource
   * @param key
   * @returns {*|void}
   */
  getNodeByKey:any = (dataSource:any, pKey:any) => {
    const {reader}=this.props;
    const {key,childCode}=reader;
    for (let item of dataSource) {
      if (item[key] === pKey) {
        return item;
      } else {
        if (item[childCode] && item[childCode].length > 0) {
          if (this.getNodeByKey(item[childCode], pKey)) {
            return this.getNodeByKey(item[childCode], pKey);
          }
        }
      }
    }
  };

  /**
   * 通过多个key值查找多个节点信息
   * @param dataSource
   * @param keys
   * @returns {*}
   */
  getNodesByKeys(dataSource:any, keys:any) {
    let nodes = [];
    if (keys instanceof Array) {
      for (let key of keys) {
        let node = this.getNodeByKey(dataSource, key);
        nodes.push(node);
      }
    } else {
      return this.getNodeByKey(dataSource, keys);
    }
    return nodes;
  }

  /**
   * 树节点选择触发
   * @param selectedKeys
   */
  onSelect = (selectedKeys:any) => {
    const { onSelect } = this.props;
    const { dataSource } = this.state;
    this.setState({ selectedKeys });
    let selectedNodes = this.getNodesByKeys(dataSource, selectedKeys);
    if (onSelect) {
      onSelect(selectedKeys, selectedNodes);
    }
  };

  onChange = (e:any) => {
    const {reader}=this.props;
    const {key,name}=reader;
    const {value} = e.target;
    const {dataList,dataSource}=this.state;
    const expandedKeys = dataList
      .map((item:any) => {
        if (item[name].indexOf(value) > -1) {
          return this.getParentKey(item[key], dataSource);
        }
        return null;
      })
      .filter((item: any, i: number, self: any) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true
    });
  };

  render() {
    const {searchValue, expandedKeys, autoExpandParent, dataSource} = this.state;
    const {reader,title,extra,searchPlaceholder, showSearch, ...rest}=this.props;
    const {key,name,childCode}=reader;

    const loop = (data: any) =>
      data.map((item: any) => {
        const index = item[name].indexOf(searchValue);
        const beforeStr = item[name].substr(0, index);
        const afterStr = item[name].substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className={styles.site_tree_search_value}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item[name]}</span>
          );
        if (item[childCode]) {
          return {
            title, key: item[key],
            children: loop(item[childCode]),
            icon:(params:any)=>{
              const {expanded}=params;
              // console.log('params:',params)
              return expanded?<FolderOpenOutlined />: <FolderOutlined />
              },
          };
        }

        return {
          icon:<FileOutlined />,
          title,
          key: item[key]
        };
      });
    return (
      <div className={styles.search_tree}>
        <div className={styles.toolbar}>
          <span className={styles.toolbar_left}>{title}</span>
          <span className={styles.toolbar_right}>
            {showSearch && <Search
                placeholder={searchPlaceholder}
                onChange={this.onChange}
                allowClear
                className={styles.search}
            />}
            {extra?extra:''}
          </span>
        </div>
        <div className={styles.content}>
          <Tree
            showIcon
            switcherIcon={<DownOutlined />}
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={loop(dataSource)}
            { ...rest}
            onSelect={this.onSelect}
          />
        </div>
      </div>
    );
  }
}

export default SearchTree;
