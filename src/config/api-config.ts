const { NODE_ENV } = process.env;

// 接口url
export const base_service = NODE_ENV==='development'? '/base_service' : 'http://127.0.0.1:7001';

// 登陆注册url
export const register_url = base_service + '/users/register';
export const login_url = base_service + '/users/login';

export const file_url = base_service + '/file/certificate';
export const create_article_url = base_service + '/article/create';
