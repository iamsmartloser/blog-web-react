import React from 'react';
import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { Card, Typography, Alert } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

export default ({children}): React.ReactNode => (
  <PageHeaderWrapper
    // content=" 这个页面只有 admin 权限才能查看"
  >
    <Card>
      {children}
    </Card>
  </PageHeaderWrapper>
);
