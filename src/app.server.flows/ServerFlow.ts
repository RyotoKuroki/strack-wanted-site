export default class ServerFlow {
    public static Execute(opts: {
        post: boolean,
        url: string,
        data: any,
        timeout?: number,
    }): JQuery.jqXHR {
        opts = $.extend(true, {
            timeout: 1000 * 16, // timeout=16sec
        }, opts)
        const ajx = $.ajax({
            url: opts.url,
            type: opts.post ? 'post' : 'get',
            dataType: 'json',
            data: opts.data,
            timeout: opts.timeout,
        });
        return ajx;
    }
}