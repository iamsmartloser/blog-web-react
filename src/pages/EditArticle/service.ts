import request from '@/utils/request';
import {file_url} from "@/config/api-config";

export async function certificate(params: any) {
  return request.post(file_url, {
    data: {
      ...params,
    },
  });
}
