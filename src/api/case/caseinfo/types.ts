export interface CaseinfoVO {
  /**
   * 案例id
   */
  caseId: string | number;

  /**
   * 案例标题
   */
  title: string;

  /**
   * 图片地址
   */
  imageUrl: string;

  /**
   * 信息
   */
  info: string;

  /**
   * 审核状态（0审核中 1审核通过 2审核失败）
   */
  start: string;

  /**
   * 视频地址
   */
  videoUrl: string | number;

}

export interface CaseinfoForm extends BaseEntity {
  /**
   * 案例id
   */
  caseId?: string | number;

  /**
   * 案例标题
   */
  title?: string;

  /**
   * 图片地址
   */
  imageUrl?: string;

  /**
   * 信息
   */
  info?: string;

  /**
   * 审核状态（0审核中 1审核通过 2审核失败）
   */
  start?: string;

  /**
   * 视频地址
   */
  videoUrl?: string | number;

}

export interface CaseinfoQuery extends PageQuery {

  /**
   * 案例标题
   */
  title?: string;

  /**
   * 图片地址
   */
  imageUrl?: string;

  /**
   * 信息
   */
  info?: string;

  /**
   * 审核状态（0审核中 1审核通过 2审核失败）
   */
  start?: string;

  /**
   * 视频地址
   */
  videoUrl?: string | number;

  /**
   * 日期范围参数
   */
  params?: any;
}
