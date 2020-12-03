import React from "react";
import {Tag} from "antd";

export const col=(dataIndex:string,title:string,width=120,sorter:boolean=false,fixed:any=false,render?:Function)=>{

  return {
    dataIndex,
    title,
    width,
    sorter,
    fixed,
    render,
  }
};

export const tagCol=(dataIndex:string,title:string,data:any[],colors:any[],width=120)=>{
  return {
    dataIndex,
    title,
    width,
    render:(text:string)=>{
      <Tag color={colors[data.indexOf(text)]}>{text}</Tag>
    }
  }
};
