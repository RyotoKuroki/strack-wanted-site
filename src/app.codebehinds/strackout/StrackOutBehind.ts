import $ from 'jquery';
import moment from 'moment';
import ServerFlow from '@/app.server.flows/ServerFlow.ts';
import TrWanted from '@/app.entities/TrWanted.ts';
import WantedPaperDesignedModel from '@/app.codebehinds/strackout/WantedPaper.designedmodel.ts';
import { BrowserCacheDifinitions } from '../../app.consts/difinitions';
import { DoneStates } from 'strack-wanted-meta/dist/consts/states/states.done';

export default class StrackOutBehind {

    /**
     * 誰の情報を抽出するかの指定。
     * Account ページのユーザ名。
     * エンティティの Whois フィールドを標的にする。
     */
    protected get _Whois(): string {
        const temp = localStorage[BrowserCacheDifinitions.ACCOUNT_USER_NAME];
        return !temp ? '' : temp;
    }

    /**
     * 表示モデルリスト
     */
    public papers: WantedPaperDesignedModel[] = new Array<WantedPaperDesignedModel>();

    /**
     * コンストラクタ
     */
    constructor() {
        this.SearchWanteds();
    }
    
    public SearchWanteds() {
        ServerFlow.Execute({
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
            this.papers = array;
        })
        .catch((error: any) => {
            alert(`error(get-wanteds)`);
        });
    }

    public SaveDone(paper: WantedPaperDesignedModel) {
        const doneAlready = paper.IsDone;
        const msg = doneAlready
            ? 'ターゲット脱走！？'
            :　`${moment(new Date()).format('HH時mm分、')}ターゲット確保〜！？`;
        if(!confirm(msg))
            return;
        const wanted = new TrWanted();
        wanted.uuid = paper.uuid;
        wanted.revision = paper.revision;
        wanted.done = doneAlready ? DoneStates.YET : DoneStates.DONE;
        // wanted.whois = paper.whois;
        ServerFlow.Execute({
            // reqMethod: 'post',
            url: 'done-wanteds',
            data: {
                whois: this._Whois,
                wanteds: [wanted]
            }
        })
        .done((result: any) => {
            const target: TrWanted = result.wanteds[0];
            paper.EntityToRow(target);
        })
        .catch((error: any) => {
            alert(`error(done-wanteds)`);
        });
    }
}
