import request from '@/utils/request';
import {create_article_url} from "@/config/api-config";

export async function createArticle(params: any) {
  return request.post(create_article_url,{data:{...params}});
}
