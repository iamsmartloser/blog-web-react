import request from '@/utils/request';
import {
  article_delete_url, article_find_one_url,
  article_list_by_page_url,
  article_update_url, create_article_url
} from "@/config/api-config";

export async function articleListByPage(params: any) {
  return request.post(article_list_by_page_url,{data:{...params}});
}
export async function deleteRecord(id: any) {
  return request.delete(`${article_delete_url}/${id}`);
}
export async function createRecord(params: any) {
  return request.post(create_article_url,{data:{...params}});
}
export async function updateRecord(params: any) {
  return request.patch(article_update_url,{data:{...params}});
}
export async function getDetail(params: any) {
  return request.post(article_find_one_url,{data:{...params}});
}
