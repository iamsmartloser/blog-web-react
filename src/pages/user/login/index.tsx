import {
  LockTwoTone,
  UserOutlined,
} from '@ant-design/icons';
import {Alert, Form, message, Tabs} from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { connect, Dispatch, useIntl, FormattedMessage } from 'umi';
import { StateType } from '@/models/login';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';

import styles from './index.less';

interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [type, setType] = useState<string>('account');
  const intl = useIntl();
  const [form] = Form.useForm();

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    if(type==='account'){// 登录
      dispatch({
        type: 'login/login',
        payload: { ...values },
      });
    }else if(type==='register'){// 注册
      const params = {
        account: values.registerAccount,
        password:values.password1,
        name: values.name,
        nickName:values.nickName,
        phone: values.phone,
      };
      dispatch({
        type: 'user/register',
        payload: { ...params },
        callback:(res:any)=>{
          if(res.code===200){// 注册成功
            message.success(res.message||'注册成功');
            setType('account')
            form.setFieldsValue(params)
          }
        }
      });
    }

  };

  const validatorPassword = (_:any, value:string) => {
    if (form && form.getFieldValue) {
      const newValue1 = form.getFieldValue('password1');
      const newValue2 = form.getFieldValue('password2');
      switch (_.field) {
        case 'password1':
          if (value && newValue2 && value !== newValue2) {
            return Promise.reject(`两次输入的新密码不一致！`)
          }
          break;
        case 'password2':
          if (value && newValue1 && value !== newValue1) {
            return Promise.reject(`两次输入的新密码不一致！`)
          }
          break;
        default:
          break;
      }
    }
    return Promise.resolve();
  };

  return (
    <div className={styles.main}>
      <ProForm
        initialValues={{
          autoLogin: true,
        }}
        form={form}
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={async (values) => {
          handleSubmit(values);
        }}
      >
        <Tabs activeKey={type} onChange={setType}>
          <Tabs.TabPane
            key="account"
            tab={intl.formatMessage({
              id: 'pages.login.accountLogin.tab',
              defaultMessage: '账户密码登录',
            })}
          />
          {/*<Tabs.TabPane*/}
          {/*  key="register"*/}
          {/*  tab={intl.formatMessage({*/}
          {/*    id: 'pages.login.register.tab',*/}
          {/*    defaultMessage: '注册',*/}
          {/*  })}*/}
          {/*/>*/}
        </Tabs>

        {status !== 200 && loginType === 'account' && !submitting && (
          <LoginMessage
            content={intl.formatMessage({
              id: 'pages.login.accountLogin.errorMessage',
              defaultMessage: '账户或密码错误',
            })}
          />
        )}
        {type === 'account' && (
          <>
            <ProFormText
              name="account"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.username.placeholder',
                defaultMessage: '输入账号或手机号',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="请输入账号或手机号!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockTwoTone className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.password.placeholder',
                defaultMessage: '输入密码',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="请输入密码！"
                    />
                  ),
                },
              ]}
            />
            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
              </ProFormCheckbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
              </a>
            </div>
          </>

        )}

        {status !== 200 && loginType === 'register' && !submitting && (
          <LoginMessage content="验证码错误" />
        )}
        {type === 'register' && (
          <>
            <>
              <ProFormText
                name="registerAccount"
                fieldProps={{
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder= '输入账号'
                rules={[
                  {
                    required: true,
                    message: "请输入账号!",
                  },
                ]}
              />
              <ProFormText
                name="name"
                placeholder= '输入姓名'
                rules={[
                  {
                    required: true,
                    message: "请输入姓名!",
                  },
                ]}
              />
              <ProFormText
                name="nickName"
                placeholder= '输入昵称'
                rules={[
                  {
                    required: true,
                    message: "请输入输入昵称!",
                  },
                ]}
              />
              <ProFormText
                name="phone"
                placeholder= '输入手机号'
                rules={[
                  {
                    required: false,
                    message: "请输入手机号!",
                  },
                ]}
              />
              <ProFormText.Password
                name="password1"
                fieldProps={{
                  prefix: <LockTwoTone className={styles.prefixIcon} />,
                }}
                placeholder= '输入密码'
                rules={[
                  {
                    required: true,
                    message: "请输入密码！",
                  },
                  {validator:validatorPassword}
                ]}
              />
              <ProFormText.Password
                name="password2"
                fieldProps={{
                  prefix: <LockTwoTone className={styles.prefixIcon} />,
                }}
                placeholder= '再次输入密码'
                rules={[
                  {
                    required: true,
                    message: "请再次输入密码！",
                  },
                  {validator:validatorPassword}
                ]}
              />
            </>
          </>
        )}

      </ProForm>
      {/*<Space className={styles.other}>*/}
      {/*  <FormattedMessage id="pages.login.loginWith" defaultMessage="其他登录方式" />*/}
      {/*  <AlipayCircleOutlined className={styles.icon} />*/}
      {/*  <TaobaoCircleOutlined className={styles.icon} />*/}
      {/*  <WeiboCircleOutlined className={styles.icon} />*/}
      {/*</Space>*/}
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
