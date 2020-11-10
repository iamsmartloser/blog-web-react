const { NODE_ENV } = process.env;

// 接口url
export const base_service = NODE_ENV==='development'? '/base_service' : 'http://127.0.0.1:7001';

export const file_url = base_service + '/file/certificate';
