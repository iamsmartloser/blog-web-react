import * as moment from 'moment';
import 'moment/locale/zh-cn';
import {Moment} from "moment";

moment.locale('zh-cn');

type durationType = (
  "year" | "years" | "y" |
  "month" | "months" | "M" |
  "week" | "weeks" | "w" |
  "day" | "days" | "d" |
  "hour" | "hours" | "h" |
  "minute" | "minutes" | "m" |
  "second" | "seconds" | "s" |
  "millisecond" | "milliseconds" | "ms"
);


// const dateUtil = {moment};

export const dateUtil= moment;
/**
 * 格式化日期
 * @param date 可指定日期
 * @param format 格式化的格式
 */
export const format = (date?: Date | string| Moment| null, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  if (date) {
    return moment(date).format(format);
  }
  return moment().format(format);
}

/**
 * 距离当前和指定日期多久以前
 * @param date
 */
export const fromNow = (date?: Date | string| Moment| null): string => {
  if (date) {
    return moment(date).fromNow();
  }
  return moment().fromNow();
}

/**
 * 计算两个日期的差值
 * @param diffDate 需要比较的日期
 * @param date  默认比较的日期
 * @param duration 比较的范围
 */
export const diff = (diffDate: Date | string| Moment| null, date?: Date | string, duration: durationType = 'seconds'): number => {
  if (date) {
    return moment(date).diff(diffDate, duration)
  }
  return moment().diff(diffDate, duration);
}

/**
 * 获取到指定日期的开始日期  比如 获取当月的开始日期 3.1
 * @param date
 * @param duration
 */
export const startOf = (date?: Date | string| Moment| null, duration: durationType = 'month') => {
  if(date){
    return moment(date).startOf(duration)
  }
  return moment().startOf(duration)
}

/**
 * 获取到指定日期的结束日期  比如 获取当月的开始日期 3.30
 * @param date
 * @param duration
 */
export const endOf = (date?: Date | string| Moment| null, duration: durationType = 'month') => {
  if(date){
    return moment(date).endOf(duration)
  }
  return moment().endOf(duration)
}

/**
 * 在指定或者当前日期上加 指定的 天 月 ..... for durationType
 * @param val 需要加的数值
 * @param date 指定的日期
 * @param duration durationType
 * @param format 格式化的日期格式
 */
export const addDate = (val: number, date?: Date | string| Moment| null, duration: durationType = 'month', format: string = 'YYYY-MM-DD HH:mm:ss') => {
  if(date) {
    return moment(date).add(val, duration).format(format);
  }
  return moment().add(val, duration).format(format);
}

/**
 * 在指定或者当前日期上减 指定的 天 月 ..... for durationType
 * @param val 需要减的数值
 * @param date 指定的日期
 * @param duration durationType
 * @param format 格式化的日期格式
 */
export const subtractDate = (val: number, date?: Date | string| Moment| null, duration: durationType = 'month', format: string = 'YYYY-MM-DD HH:mm:ss') => {
  if(date) {
    return moment(date).subtract(val, duration).format(format);
  }
  return moment().subtract(val, duration).format(format);
}

/**
 * 查询指定日期是否在当前或者指定日期之前
 * @param diffDate 需要查询的日期
 * @param date 指定比较的日期 or 当前日期
 * @param duration 比较的精度
 */
export const isBefore = (diffDate: Date | string| Moment| null, date?: Date | string, duration: durationType = 'month'): boolean => {
  if(date) {
    return moment(date).isBefore(diffDate, duration)
  }
  return moment().isBefore(diffDate, duration);
}

/**
 * 查询指定日期是否和当前或者指定日期相同
 * @param diffDate 需要查询的日期
 * @param date 指定比较的日期 or 当前日期
 * @param duration 比较的精度
 */
export const isSame = (diffDate: Date | string| Moment| null, date?: Date | string, duration: durationType = 'month'): boolean => {
  if(date) {
    return moment(date).isSame(diffDate, duration)
  }
  return moment().isSame(diffDate, duration);
};

export const getTimeFromSecond = (val: any, format:string = '无') => {
  if(!val || val == 0) return format;
  let h: number | string = Math.floor(val / 3600);
  let m: number | string = Math.floor((val % 3600) / 60);
  let s: number | string = ((val % 3600) % 60);
  h = h > 0 ? h >= 10 ? `${h}小时` : `0${h}小时` : '';
  // h = h >= 10 ? `${h}` : `0${h}`
  m = m > 0 ? m >= 10 ? `${m}分钟` : `0${m}分钟` : '';
  s = s > 0 ? s >= 10 ? `${s}秒` : `0${s}秒` : '';
  return `${h}${m}${s}`
};
