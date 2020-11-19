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
export const create_article_url = base_service + '/article/create';// 新建
export const article_list_by_page_url = base_service + '/article/findByPage';// 列表
export const article_update_url = base_service + '/article/update';// 修改
export const article_delete_url = base_service + '/article/delete';// 删除
// 文章类型管理
export const create_article_category_url = base_service + '/category/create';// 新建
export const article_category_all_url = base_service + '/category/findAll';// 列表
export const article_category_list_url = base_service + '/category/findByPage';// 列表
export const article_category_update_url = base_service + '/category/update';// 修改
export const article_category_delete_url = base_service + '/category/delete';// 删除
// 文章标签管理
export const create_article_tag_url = base_service + '/tag/create';// 新建
export const article_tag_list_url = base_service + '/tag/findByPage';// 列表
export const article_tag_update_url = base_service + '/tag/update';// 修改
export const article_tag_delete_url = base_service + '/tag/delete';// 删除
