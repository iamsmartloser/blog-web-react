import React, {FC, useEffect, useState} from 'react';
import pinyin from 'pinyin';
import {Select, Spin} from 'antd'
import {isEqual} from 'lodash'
import request from "@/utils/request";

const {Option} = Select;

interface StandardSelectProps {
  style?:any,
  value?: any;
  onChange?: Function;
  config: {
    data: any[];  // 源数据
    key?: string;  // 字段的key值
    text?: string;  // 字段主要显示内容
    desc?: string;  // 字段扩展描述
    fields?:any[];
    parseFields?:any[],
    url?:string,// 远程请求路径
    params?:any,// 远程请求参数
    // initData:any
  };
  form?:any
}

const StandardSelect: FC<StandardSelectProps> = (props: StandardSelectProps) => {
  const {config, onChange,form,...rest} = props;
  const {data, key, fields, parseFields, desc, text,url,params} = config;
  const [dataSource, setDataSource] = useState<any[]>();// 源数据，可从props传入，也可传入一个service向后台获取
  const [selectValue, setSelectValue] = useState<any>();
  const [paramsValue, setParamsValue] = useState<any>(params);
  const [loading, setLoading] = useState<any>(false);

  const getDataSourceFromService=()=>{
    if(url&&(!dataSource||isEqual(dataSource,data))){
      setLoading(true);
      request.post(url,params).then((res:any)=>{
        if(res&&res.code===0&&res.result){
          setDataSource(res.result)
        }
      }).catch((err:any)=>{
        console.error(err)
      }).finally(()=>{
        setLoading(false);
      })
    }
  };

  useEffect(() => {
    if (!isEqual(dataSource, data)) {
      setDataSource(data)
    }
  }, [data]);

  // 联动参数
  useEffect(() => {
    if (params&&!isEqual(paramsValue, params)) {
      setParamsValue(params);
      getDataSourceFromService()
    }
  }, [params]);

  const getRecord=(k:any)=>{
    let res:any={};
    const index=dataSource?dataSource.findIndex((item:any)=>item[key]===k):-1;
    if(index>-1){
      const record=dataSource[index];
      res=record;
      if(fields&&form&&form.current){
        const fieldsValue={};
        fields.map((field:any,i:number)=>{
          fieldsValue[parseFields&&parseFields[i]?parseFields[i]:field]=record[field];
        });
        form.current.setFieldsValue(fieldsValue)
      }
    }
    return res
  };

  const handleChange = (val: any) => {
    setSelectValue(val);
    if (onChange) {
      onChange(val,getRecord(val),)
    }
  };

  const onDropdownVisibleChange=(open:boolean)=>{
    if(open){
      getDataSourceFromService()
    }
  };



  const renderOptions = () => {
    return dataSource&&dataSource.length&&dataSource.map((item: any, index:number) => {
      const value:any=key?item[key]:index;
      const title:any=text?item[text]:item;
      return item?<Option key={`select_option_${value}`}
                          value={value}
                          pin-yin={pinyin(title, { style: pinyin.STYLE_NORMAL }).join('')}
      >
        <div>{title}</div>
        {desc && <div>{item[desc]}</div>}
      </Option>:null
    })
  };

  // 根据下拉框的用户输入进行查询支持拼音和汉字
  const filterOption=(input: string, option: any)=> {
    return (
      option.props.children.indexOf(input) > -1 ||
      option.props['pin-yin'].toLowerCase().indexOf(input.toLowerCase()) > -1
    );
  };

  return (
    <Select
      allowClear
      showSearch
      optionFilterProp="children"
      filterOption={filterOption}
      value={selectValue}
      onChange={handleChange}
      onDropdownVisibleChange={onDropdownVisibleChange}
      dropdownRender={menu => (
        <Spin tip='' spinning={loading}>{menu}</Spin>
      )}
      {...rest}
    >
      {renderOptions()}
    </Select>
  );
};

export default StandardSelect;
