import request from '@/utils/request';
import {article_tag_delete_url, article_tag_list_url, article_tag_update_url} from "@/config/api-config";

export async function listByPage(params: any) {
  return request.post(article_tag_list_url,{data:{...params}});
}
export async function deleteRecord(id: any) {
  return request.delete(`${article_tag_delete_url}/${id}`);
}
export async function updateRecord(params: any) {
  return request.patch(article_tag_update_url,{data:{...params}});
}
