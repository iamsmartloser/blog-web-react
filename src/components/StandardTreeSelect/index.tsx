import React from 'react';
import {Empty, TreeSelect} from 'antd';

interface StandardTreeSelectProps {
  style?: any,
  value?: any;
  onChange?: Function;
  config: {
    data?: any[];  // 源数据
    key?: string;  // 字段的key值
    text?: string;  // 字段主要显示内容
    childCode?: string; //默认为‘children’
    service?: Function,// 远程请求service
    params?: any,// 联动请求参数
  };
}

interface StandardTreeSelectState {
  dataSource?: any[],
  selectValue?: any,
  hasLoadFromService?: boolean,
}

const {TreeNode} = TreeSelect;

class StandardTreeSelect extends React.Component<StandardTreeSelectProps, StandardTreeSelectState> {

  constructor(props: StandardTreeSelectProps) {
    super(props);
    // console.log('props.value:', props.value)
    this.state = {};
  }

  componentDidMount() {
    this.init();
    // this.loadDataSourceByService()
  }

  init = () => {
    const {value} = this.props;
    const {config: {key = 'id', text = 'title', data}} = this.props;
    // 如果表单回显时没有传dataSource或是没有异步请求dataSource的情况下，需要传一个包含key、text的value对象来展示
    if (value && value.key && value.text) {
      this.setState({dataSource: [{[key]: value.key, [text]: value.text}], selectValue: value.key})
    } else {
      this.setState({dataSource: data || [], selectValue: value || null})
    }
  };

  componentDidUpdate(prevProps: StandardTreeSelectProps, prevState: StandardTreeSelectState): void {
    // const {prevData}=prevProps;
    // const {data}=this.props;
  }

  loadDataSourceByService = () => {
    const {config: {service}} = this.props;
    if (!service) return;
    service().then((res: any) => {
      if (res.code === 0) {
        let result: any = null;
        if (!res.result) {
          result = []
        } else if (res.result instanceof Array) {
          result = res.result
        } else {
          result = [res.result]
        }
        // console.log('result:',result)
        this.setState({dataSource: result, hasLoadFromService: true})
      }
    })
  };

  getNodeByKey = (treeData: any, key: any): any => {
    const {config: {childCode = 'children'}} = this.props;
    for (let item of treeData) {
      if (item.id === key) {
        return item
      } else {
        if (item[childCode] && item[childCode].length > 0) {
          if (this.getNodeByKey(item[childCode], key)) {
            return this.getNodeByKey(item[childCode], key);
          }
        }
      }
    }
  };
  getNodesByKeys = (keys: any): any => {
    const {dataSource} = this.state;
    let nodes = [];
    if (keys instanceof Array) {
      for (let key of keys) {
        let node = this.getNodeByKey(dataSource, key);
        nodes.push(node)
      }
    } else {
      return this.getNodeByKey(dataSource, keys)
    }
    return nodes;
  };

  onChange = (value: any) => {
    // console.log('value:', value)
    this.setState({selectValue: value}, () => {
      const {onChange} = this.props;
      if (onChange) {
        onChange(value, this.getNodesByKeys(value));
      }
    })
  };

  //展开时是否重新加载数据
  onDropdownVisibleChange = (open: boolean) => {
    const {hasLoadFromService} = this.state;
    if (open && !hasLoadFromService) {
      this.loadDataSourceByService()
    }
  };

  renderTreeNode = (treeData: any): any => {
    const {config: {key = 'id', text = 'title', childCode = 'children'}} = this.props;
    let treeNodeArray = [];
    if(treeData&&treeData.length>0){
      for (let i = 0; i < treeData.length; i++) {
        let treeNode = treeData[i];
        if (treeNode[childCode] && treeNode[childCode].length > 0) {
          treeNodeArray.push(<TreeNode value={treeNode[key]} title={treeNode[text]} key={treeNode[key]}>
            {this.renderTreeNode(treeNode[childCode])}</TreeNode>)
        } else {
          treeNodeArray.push(<TreeNode value={treeNode[key]} isLeaf title={treeNode[text]} key={treeNode[key]}/>)
        }
      }
    }
    return treeNodeArray;
  };

  render() {
    const {selectValue,dataSource} = this.state;
    // console.log('dataSource:',this.state.dataSource)
    return (
      <TreeSelect
        showSearch
        style={{width: '100%'}}
        value={selectValue}
        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
        allowClear
        treeDefaultExpandAll
        onChange={this.onChange}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
      >
        {this.renderTreeNode(dataSource)}
      </TreeSelect>
    );
  }
}

export default StandardTreeSelect;
