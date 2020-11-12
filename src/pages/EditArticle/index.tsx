import React from 'react';
import ReactMarkdown from 'react-markdown';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import {Button, Form, Input, message} from "antd";
import request from "@/utils/request";
import {create_article_url} from "@/config/api-config";
import styles from "@/components/StandardForm/style.less";
import {FormInstance} from "antd/lib/form";

export default class EditArticle extends React.PureComponent<{}, {}> {
  formRef = React.createRef<FormInstance>();

  state = {
    markdown: '### 请输入文章内容',
  };

  // Finish!
  handleEditorChange = ({html, text}) => {
    // console.log('handleEditorChange', html)
    this.setState({markdown: text})
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
  save = (status: number) => {
    const {markdown} = this.state;
    if(this.formRef&&this.formRef.current){
      const values = this.formRef.current.getFieldsValue();
      console.log('values--',values)
      console.log('values-===-',this.formRef.current.getFieldsValue())
      const {title , abstract} = values;
      request.post(create_article_url, {data: {markdown, title, abstract, status}})
        .then((res: any) => {
          if(res.code===200){
            message.success(status===0?'保存成功':'发布成功')
          }
        })
    }
  };

  render() {
    return (
      <div>
        <Form
          className={styles.standard_form}
          ref={this.formRef}
          name="standard_form"
          // initialValues={{}}
        >
          <div>
            <span style={{fontSize: 18, fontWeight: "bold"}}>标题：</span>
            <Form.Item noStyle name='title'>
              <Input
                size="large"
                placeholder="请输入文章标题"
                maxLength={50}
                bordered={false}
                style={{width: '60%'}}
                allowClear/>
            </Form.Item>
            <Button.Group style={{float: 'right', borderRadius: 5}}>
              <Button onClick={() => this.save(0)}>保存</Button>
              <Button onClick={() => this.save(1)} type={'primary'}>发布</Button>
            </Button.Group>
          </div>
          <div>
            <span style={{fontSize: 14, fontWeight: "bold"}}>摘要：</span>
            <Form.Item noStyle name='abstract'>
              <Input
                placeholder="请输入文章摘要"
                maxLength={500}
                bordered={false}
                style={{width: '90%'}}
                allowClear/>
            </Form.Item>
          </div>
        </Form>
        <MdEditor
          defaultValue={this.state.markdown}
          style={{height: '500px'}}
          renderHTML={(text) => <ReactMarkdown source={text || this.state.markdown}/>}
          onChange={(data: any) => this.handleEditorChange(data)}
          onImageUpload={(file: File) => this.handleImageUpload(file)}
        />
      </div>
    );
  }
}
