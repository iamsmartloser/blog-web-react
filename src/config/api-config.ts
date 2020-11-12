const { NODE_ENV } = process.env;

// 接口url
export const base_service = NODE_ENV==='development'? '/base_service' : 'http://127.0.0.1:7001';

// 登陆\注册\注销url
export const register_url = base_service + '/users/register';
export const login_url = base_service + '/users/login';
export const login_out_url = base_service + '/users/loginOut';
// 文件存储相关接口
export const file_url = base_service + '/file/certificate';
// 文章相关接口
export const create_article_url = base_service + '/article/create';// 文章新建
export const article_list_by_page_url = base_service + '/article/findByPage';// 文章列表
export const article_update_url = base_service + '/article/create';// 文章修改
export const article_delete_url = base_service + '/article/delete';// 文章删除
