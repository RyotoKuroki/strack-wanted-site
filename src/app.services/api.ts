import $ from 'jquery';

export default class Api {
    public static Execute(opts: {
                    url: string,
                    data: any,
                    reqMethod?: string/* get, post, put, patch, delete */,
                    timeout?: number
                }): JQuery.jqXHR {

        opts = $.extend(true, {
            reqMethod: 'post',
            timeout: 1000 * 11 // 暫定で11秒
        }, opts);
        const ajx = $.ajax({
            url: `http://localhost:3000/${opts.url}`,
            type: opts.reqMethod,
            dataType: 'json',
            data: opts.data,
            timeout: opts.timeout,
        });
        return ajx;
    }
}