import request from '@/utils/request';
import {register_url} from "@/config/api-config";

export async function register(params:any): Promise<any> {
  return request.post(register_url,{data:params});
}

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
