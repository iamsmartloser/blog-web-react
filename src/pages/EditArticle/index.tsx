import React from 'react';
import ReactMarkdown from 'react-markdown';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import {Button, Input} from "antd";
import request from "@/utils/request";
import {create_article_url} from "@/config/api-config";

export default class EditArticle extends React.PureComponent<{}, {}> {

  state = {
    markdown: '### 请输入文章内容'
  };

  // Finish!
  handleEditorChange = ({html, markdown}) => {
    // console.log('handleEditorChange',  text)
    this.setState({markdown})
  };

  handleImageUpload = (file: File): Promise<string> => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = data => {
        // @ts-ignore
        resolve(data.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  // status 文章状态'[0草稿，1发布，2删除，3审批中]'
  // save=(status: number)=>{
  //   const {markdown, title, status}=this.state;
  //   request.post(create_article_url,{data:{markdown, title, status}})
  //     .then((res:any)=>{
  //
  //     })
  // };

  render() {
    return (
        <div>
          <span style={{fontSize: 18, fontWeight: "bold"}} onChange={(e:any)=>this.setState({title: e.target.value})}>标题：</span>
          <Input
          size="large"
          placeholder="请输入文章标题"
          maxLength={50}
          bordered={false}
          style={{width:400}}
          allowClear/>
          <Button.Group style={{float: 'right'}}>
            <Button>保存</Button>
            <Button type={'primary'}>发布</Button>
          </Button.Group>

          {/*<br/>*/}
          <MdEditor
            defaultValue={this.state.markdown}
            style={{height: '500px'}}
            renderHTML={(text) => <ReactMarkdown source={text||this.state.markdown}/>}
            onChange={this.handleEditorChange}
            onImageUpload={this.handleImageUpload}
          />
        </div>
    );
  }
}
