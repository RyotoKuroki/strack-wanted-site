export default class ServerFlow {
    public static Execute(opts: {
                    reqMethod: string/* get, post, put, patch, delete */,
                    url: string,
                    data: any,
                    timeout?: number
                }): JQuery.jqXHR {

        opts = $.extend(true, { timeout: 1000 * 16 }, opts);
        const ajx = $.ajax({
            url: opts.url,
            // type: opts.post ? 'post' : 'get',
            type: opts.reqMethod,
            dataType: 'json',
            data: opts.data,
            timeout: opts.timeout,
        });
        return ajx;
    }
}