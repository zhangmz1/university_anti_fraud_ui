import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CaseinfoVO, CaseinfoForm, CaseinfoQuery } from '@/api/case/caseinfo/types';

/**
 * 查询案例信息列表
 * @param query
 * @returns {*}
 */

export const listCaseinfo = (query?: CaseinfoQuery): AxiosPromise<CaseinfoVO[]> => {
  return request({
    url: '/case/caseinfo/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询案例信息详细
 * @param caseId
 */
export const getCaseinfo = (caseId: string | number): AxiosPromise<CaseinfoVO> => {
  return request({
    url: '/case/caseinfo/' + caseId,
    method: 'get'
  });
};

/**
 * 新增案例信息
 * @param data
 */
export const addCaseinfo = (data: CaseinfoForm) => {
  return request({
    url: '/case/caseinfo',
    method: 'post',
    data: data
  });
};

/**
 * 修改案例信息
 * @param data
 */
export const updateCaseinfo = (data: CaseinfoForm) => {
  return request({
    url: '/case/caseinfo',
    method: 'put',
    data: data
  });
};

/**
 * 删除案例信息
 * @param caseId
 */
export const delCaseinfo = (caseId: string | number | Array<string | number>) => {
  return request({
    url: '/case/caseinfo/' + caseId,
    method: 'delete'
  });
};
