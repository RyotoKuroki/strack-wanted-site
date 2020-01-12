import $ from 'jquery';
import moment from 'moment';
import Api from '@/app.services/api';
import TrWanted from '@/app.entities/tr.wanted';
import WantedPaperDesignedModel from '@/app.codebehinds/strackout/wanted.paper.designedmodel';
import { BrowserCaches } from '../../app.consts/cache.browser';
import { DoneStates } from 'strack-wanted-meta/dist/consts/states/states.done';

export default class StrackOutBehind {

    /**
     * 誰の情報を抽出するかの指定。
     * Account ページのユーザ名。
     * エンティティの Whois フィールドを標的にする。
     */
    protected get _Whois(): string {
        const temp = localStorage[BrowserCaches.ACCOUNT_USER_NAME];
        return !temp ? '' : temp;
    }

    /**
     * 表示モデルリスト
     */
    public Papers: WantedPaperDesignedModel[] = new Array<WantedPaperDesignedModel>();

    /**
     * コンストラクタ
     */
    constructor() {
        this.SearchWanteds();
    }
    
    public SearchWanteds() {
        Api.Execute({
            // reqMethod: 'post',
            url: 'get-wanteds',
            data: {
                whois: this._Whois,
            }
        })
        .done((result: any) => {
            const array = new Array<WantedPaperDesignedModel>();
            $.each(result.wanteds, (index: number, entity: any) => {
                const row = new WantedPaperDesignedModel();
                row.EntityToRow(entity);
                array.push(row);
            });
            this.Papers = array;
        })
        .catch((result: any) => {
            console.log(result.error);
        });
    }

    public SaveDone(paper: WantedPaperDesignedModel) {
        const doneAlready = paper.IsDone;
        const msg = doneAlready
            ? 'ターゲット脱走！？'
            :　`${moment(new Date()).format('HH時mm分、')}ターゲット確保〜！？`;
        if(!confirm(msg))
            return;
        const _paper = $.extend(true, {}, paper);
        _paper.done = doneAlready ? DoneStates.YET : DoneStates.DONE;
        Api.Execute({
            // reqMethod: 'post',
            url: 'done-wanteds',
            data: {
                whois: this._Whois,
                wanteds: [_paper]
            }
        })
        .done((result: any) => {
            const target: TrWanted = result.wanteds[0];
            paper.EntityToRow(target);
        })
        .catch((result: any) => {
            console.log(result.error);
        });
    }
}
