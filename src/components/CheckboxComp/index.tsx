import React, { PureComponent } from 'react';
import { Checkbox,Radio} from 'antd';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

interface CheckBoxCompProps {
  data: any[];
  defaultValue?: any[];// 本地保存的默认值 有表格的时候可能需要两个初始值
  initValue?:any[];// 重置的最最初始选择的值 有表格的时候可能需要两个初始值
  onChange?:Function;
  onOk?:Function; // 点击确定事件，传了才会显示确定按钮
  type?:string;// 单选或多选
}

interface CheckBoxCompState {
  allListKeys:any[];
  checkedListKeys: any[];
  targetValue:any
}

export default class Index extends PureComponent<CheckBoxCompProps, CheckBoxCompState>{
  constructor(props: any) {
    super(props);
    const { data ,defaultValue } = props;
    this.state = {
      allListKeys:data?data.map((item:any)=>item.value):[],
      checkedListKeys: defaultValue?defaultValue.map((item:any)=>item.value):[],
      targetValue:null
    };
  }

  // CheckGroup选择变化事件
  onChange = (checkedListKeys: any[]) => {
    const { onChange}=this.props;
    this.setState({
      checkedListKeys,
    },()=>{
      if(onChange){
        onChange(checkedListKeys)
      }
    });

  };

  // RadioGroup选择变化事件
  onRadioChange=(e:any)=>{
    const { onChange}=this.props;
    this.setState({targetValue:e.target.value},()=>{
      if(onChange){
        onChange(e.target.value)
      }
    })
  };

  // 全选按钮变化事件
  onCheckAllChange = (e: any) => {
    const {onChange}=this.props;
    const {allListKeys}=this.state;
    this.setState({
      checkedListKeys: e.target.checked ? allListKeys : [],
    },()=>{
      const {checkedListKeys}=this.state;
      if(onChange){
        onChange(checkedListKeys)
      }
    });
  };

  resetChecks=()=>{
    const {onChange,initValue,type}=this.props;
    if(type==='radio'){
      this.setState({targetValue:null},()=>{
        if(onChange){
          onChange(null)
        }
      })
    }else{
      this.setState({checkedListKeys:initValue?initValue.map((item:any)=>item.value):[]},()=>{
        const {checkedListKeys}=this.state;
        if(onChange){
          onChange(checkedListKeys)
        }
      })
    }


  };

  onOk=()=>{
    const {onOk,type} = this.props;
    const {checkedListKeys,targetValue}=this.state;
    if(onOk){
      if(type==='radio'){
        onOk(targetValue)
      }else{
        onOk(checkedListKeys)
      }
    }
  };

  render() {
    const {data ,onOk,type} = this.props;
    const {checkedListKeys,targetValue}=this.state;
    return type==='radio'?(
        <div>
          <div style={{display:'flex',justifyContent:'space-between',
            borderBottom:'1px solid #e9e9e999',marginBottom:8,paddingBottom:8}}>
            <a style={{marginRight:'8px'}} onClick={this.resetChecks}>重置</a>
            {onOk&&<a onClick={this.onOk}>确定</a>}
          </div>
          <RadioGroup
            value={targetValue}
            onChange={this.onRadioChange}
          >
            {
              data&&data.map((item: any,index:number) => {
                return <span key={`checkbox${index}`}>
                <Radio
                  style={{marginBottom:'8px'}}
                  value={item.value}
                  disabled={false}
                >{item.name}</Radio>
                <br />
              </span>
              })
            }
          </RadioGroup>
        </div>
      )
      : (
      <div>
        <div style={{display:'flex',justifyContent:'space-between',
        borderBottom:'1px solid #e9e9e999',marginBottom:8,paddingBottom:8}}>
          <Checkbox
            indeterminate={checkedListKeys.length>0&&checkedListKeys.length<data.length}
            onChange={this.onCheckAllChange}
            checked={checkedListKeys.length===data.length}
          >
            全选
          </Checkbox>
          <span style={{alignSelf:'flex-end'}}>
            <a style={{marginRight:'8px'}} onClick={this.resetChecks}>重置</a>
            {onOk&&<a onClick={this.onOk}>确定</a>}
          </span>
        </div>
        <CheckboxGroup
          value={checkedListKeys}
          onChange={this.onChange}
        >
          {
            data&&data.map((item: any,index:number) => {
              return <span key={`checkbox${index}`}>
                <Checkbox
                style={{marginBottom:'8px'}}
                value={item.value}
                disabled={false}
                >{item.name}</Checkbox>
                <br />
              </span>
            })
          }
        </CheckboxGroup>
      </div>
    );
  }
}
