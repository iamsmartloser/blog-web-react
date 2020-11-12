import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect, ConnectProps } from 'umi';
import { stringify } from 'querystring';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import {getStore} from "@/utils/store";

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  currentUser?: CurrentUser;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    // 从缓存中获取用户信息，设置到state里
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/saveCurrentUser',
      payload:getStore('userInfo')});
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, currentUser } = this.props;
    const token=getStore('token');
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const queryString = stringify({
      redirect: window.location.href,
    });
    // console.log('isLogin--------',currentUser)
    if ((!token && !currentUser) || !isReady) {
      return <PageLoading />;
    }
    if (!token && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />;
    }
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
