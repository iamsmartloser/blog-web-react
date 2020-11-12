/**
 * 高级查询组件demo
 * @auth liyan
 *
 * 页面访问路由：http://localhost:8000/demo
 */

import React, {PureComponent} from "react";
import AdvancedSearch, {ConfigItem} from "@/components/AdvancedSearch/AdvancedSearch";

interface DemoProps {

}

// 页面访问路由：http://localhost:8000/demo
export default class Demo extends PureComponent<DemoProps> {
  AdvancedSearchInitValues:any={title: '翠屏区', test1: 1438573485.55,select:'11'};

  AdvancedSearchConfig:ConfigItem[]=[
    // 不配置type则默认为input框
    {
      code: 'title',
      label: '归属区域',
    },
    // InputNumber框
    {
      type:'number',
      code:'test1',
      label:'test1',
      formatThousands:true
    },
    // 下拉框
    {
      type: 'select',
      code:'select',
      label: '下拉',
      children: {
        key: 'code',
        text: 'name',
        data: [{
          code: '11',
          name: 'name11'
        },
          {
            code: '22',
            name: 'name22'
          }
        ],
      }
    },
    // 多选框
    {
      type: 'checkBox',
      code:'checkBox',
      label: '多选框',
      children: [
        {
          key: 'mult1',
          text: 'mult1',
        },
        {
          key: 'mult2',
          text: 'mult2',
        },
        {
          key: 'mult3',
          text: 'mult3',
        },
      ],
    },
    // 单选框
    {
      type: 'radio',
      code:'radio',
      label: '单选框',
      children: [
        {
          key: 'radio1',
          text: 'radio1',
        },
        {
          key: 'radio2',
          text: 'radio2',
        },
        {
          key: 'radio3',
          text: 'radio3',
        },
      ],
    },
    {
      type:'dataPicker',
      code:'dataPicker',
      label:'dataPicker',
    },
    {
      type:'timePicker',
      code:'timePicker',
      label:'timePicker',
    },
    {
      type:'rangePicker',
      code:'rangePicker',
      label:'rangePicker',
    },
  ];

  onFinish=(value:any)=>{
    console.log("value:",value)
  };

  render(){
    return <div>
      {/* 查询头 */}
      <AdvancedSearch
        config={this.AdvancedSearchConfig}
        initialValues={this.AdvancedSearchInitValues}
        onFinish={this.onFinish}
      />
    </div>;
  }
}
