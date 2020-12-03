import React from 'react';
import ReactMarkdown from 'react-markdown';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import {Button, Form, Input, message, Popconfirm, Row, Modal} from "antd";
import {article_category_all_url, article_tag_all_url} from "@/config/api-config";
import styles from "../style.less";
import {FormInstance} from "antd/lib/form";
import StandardSelect from "@/components/StandardSelect";

export default class EditArticle extends React.PureComponent<{ setEditStatus: Function }, {}> {
  formRef = React.createRef<FormInstance>();

  constructor(props:any){
    super(props);
    this.state = {
      id: props.editRow?props.editRow.id:null,
      initMarkdown:false,
    };
  }

  componentDidMount() {
    this.initData()
  }

  initData = () => {
    const {editRow,dispatch} = this.props;
    if (editRow) {// 如果是编辑已存在的文章，则回填文章信息
      dispatch({type:'articleListModel/getDetail',payload:{Q_eq_id:editRow.id},
      callback:(res:any)=>{
        if(res.code===200&&res.result){
          if (this.formRef && this.formRef.current) {
            const tags=res.result.tags.map((tag:any)=>tag.id);
            const {title, abstract, categoryId}=res.result
            this.formRef.current.setFieldsValue({title, abstract, categoryId,tags});
            this.setState({markdown: res.result.markdown, initMarkdown: true});
          }
        }
      }})
    }else {
      this.setState({markdown:'### 请输入文章内容', initMarkdown: true})
    }
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
    const { markdown, id } = this.state;
    const { dispatch } = this.props;
    const type=id?'articleListModel/update':'articleListModel/create';
    if (this.formRef && this.formRef.current) {
      const values = this.formRef.current.getFieldsValue();
      const params=id?{id,markdown, status, ...values}:{markdown, status, ...values}
      dispatch({
        type: type, payload: params,
        callback: (res: any) => {
          if (res.code === 200) {
            // message.success(status === 0 ? '保存成功' : '发布成功');
            Modal.confirm({
              content: status === 0 ? '保存成功' : '发布成功',
              onOk:()=>{this.props.setEditStatus(0)},
              onCancel:()=> {
                if(res.result&&res.result.id){// 新增时会返回文章id，便于不退出页面再次编辑
                  this.setState({id:res.result.id})
                }
              },
              okText: '返回',
              cancelText: '继续编辑'
            });

          }
        }
      })
    }
  };

  render() {
    return (
      <div>
        <Form
          ref={this.formRef}
          name="standard_form"
          // initialValues={{}}
        >
          <Button.Group style={{float: 'right', borderRadius: 5}}>
            <Popconfirm
              title="返回后编辑数据不做保留，请确定保存后再返回！"
              placement="rightBottom"
              onConfirm={() => this.props.setEditStatus(0)}>
              <Button type='link'>返回</Button>
            </Popconfirm>
            <Button onClick={() => this.save(0)}>保存</Button>
            <Button onClick={() => this.save(1)} type={'primary'}>发布</Button>
          </Button.Group>
          <Form.Item name='title' label={<span className={styles.title_style}>标题：</span>}
                     rules={[{required: true, message: '请输入文章标题'}]}
          >
            <Input
              size="large"
              placeholder="请输入文章标题"
              maxLength={50}
              bordered={false}
              style={{width: '60%'}}
              allowClear/>
          </Form.Item>

          <Row>
            <Form.Item name='categoryId' label={<span className={styles.label_style}>文章分类</span>}
            rules={[{required: true, message: '请选择文章分类'}]}
            >
              <StandardSelect
                placeholder="请选择文章分类"
                // lazy={false}
                style={{width: 220, marginRight: 8}}
                config={{url: article_category_all_url, key: 'id', text: 'name',lazy:false}}
                allowClear/>
            </Form.Item>
            <Form.Item name='tags' label={<span className={styles.label_style}>文章标签</span>}>
              <StandardSelect
                placeholder="请选择文章标签"
                mode="multiple"
                style={{width: 350}}
                config={{url: article_tag_all_url, key: 'id', text: 'name',lazy:false}}
                allowClear/>
            </Form.Item>
          </Row>
          <div>
            <Form.Item name='abstract' label={<span className={styles.label_style}>摘要</span>}
                       rules={[{required: true, message: '请输入文章摘要'}]}
            >
              <Input
                placeholder="请输入文章摘要"
                maxLength={500}
                bordered={false}
                style={{width: '90%'}}
                allowClear/>
            </Form.Item>
          </div>
        </Form>
        {this.state.initMarkdown&&<MdEditor
          defaultValue={this.state.markdown}
          style={{height: 500}}
          renderHTML={(text) => <ReactMarkdown source={text || this.state.markdown}/>}
          onChange={(data: any) => this.handleEditorChange(data)}
          onImageUpload={(file: File) => this.handleImageUpload(file)}
        />}
      </div>
    );
  }
}
