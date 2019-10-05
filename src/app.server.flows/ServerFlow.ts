export default class ServerFlow {
    public static Execute(opts: {
                    url: string,
                    data: any,
                    reqMethod?: string/* get, post, put, patch, delete */,
                    timeout?: number
                }): JQuery.jqXHR {

        opts = $.extend(true, {
            reqMethod: 'post',
            timeout: 1000 * 4
        }, opts);
        const ajx = $.ajax({
            url: opts.url,
            type: opts.reqMethod,
            dataType: 'json',
            data: opts.data,
            timeout: opts.timeout,
        });
        return ajx;
    }
}