import {listByPage, deleteRecord, updateRecord,createRecord} from './service';

const defaultData:any={
};

const Model: any = {
  namespace: 'articleCategoryListModel',

  state: defaultData,

  effects: {
    *getData({ payload , callback }, { call, put }) {
      const response = yield call(listByPage, payload);
      if (callback) callback(response);
    },
    *create({ payload , callback }, { call, put }) {
      const response = yield call(createRecord, payload);
      if (callback) callback(response);
    },
    *update({ payload , callback }, { call, put }) {
      const response = yield call(updateRecord, payload);
      if (callback) callback(response);
    },
    *delete({ payload , callback }, { call, put }) {
      const response = yield call(deleteRecord, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
  },
};

export default Model;
