import {articleListByPage, getExcel, queryRule} from './service';

const defaultData:any={
};

const Model: any = {
  namespace: 'articleListModel',

  state: defaultData,

  effects: {
    *getData({ payload , callback }, { call, put }) {
      const response = yield call(articleListByPage, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
  },
};

export default Model;
