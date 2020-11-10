import React, { lazy } from 'react';
import ReactMarkdown from 'react-markdown';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { Col, Row } from 'antd';

// const MdEditor=lazy(()=>import('react-markdown-editor-lite'))
export default class EditArticle extends React.PureComponent<{}, {}> {

  state = {};

  // Finish!
  handleEditorChange = ({ html, text }) => {
    // console.log('handleEditorChange', html, text)
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

  render() {
    return (
            <MdEditor
              style={{ height: '500px' }}
              renderHTML={(text) => <ReactMarkdown source={text}/>
              }
              onChange={this.handleEditorChange}
              onImageUpload={this.handleImageUpload}
            />
    );
  }
}
