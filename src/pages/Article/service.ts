import request from '@/utils/request';
import {article_list_by_page_url} from "@/config/api-config";

export async function articleListByPage(params: any) {
  return request.post(article_list_by_page_url,{data:{...params}});
}
