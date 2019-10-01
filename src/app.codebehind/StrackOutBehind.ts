import $ from 'jquery';
import ITR_Wanted from '@/app.entities.interfaces/ITR_Wanted';
import ServerFlow from '@/app.server.flows/ServerFlow';
import TrWanted from '@/app.entities/TrWanted';

export default class StrackOutBehind {

    //protected serverFlow: ServerFlow = new ServerFlow();
    public papers: Paper[] = new Array<Paper>();

    constructor() {
        this.SearchWanteds();
    }
    
    public SearchWanteds() {
        ServerFlow.Execute({
            reqMethod: 'get',
            url: 'http://localhost:3000/GET/wanteds',
            data: {}
        })
        .done((result: any) => {
            const array = new Array<Paper>();
            $.each(result.wanteds, (index: number, entity: any) => {
                const row = new Paper();
                row.EntityToRow(entity);
                array.push(row);
            });
            this.papers = array;
        })
        .catch((error: any) => {
            console.log(`error at server-request : ${error}`);
        });
    }
}

export class Paper implements ITR_Wanted {
    
    protected _entity!: ITR_Wanted;

    public BG_IMAGE = '/src/assets/logo.png';
    public uuid!: string;
    public whois!: string;
    public revision!: number;
    public name!: string;
    public prize_money!: number;
    //public image!: Blob;
    public image_base64!: string;
    public warning!: string;

    public btn_saving_caption = '';

    public EntityToRow(entity: ITR_Wanted) {
        // 初期設定値
        this._entity = entity;
        // 画面バインドフィールド値
        this.uuid = entity.uuid;
        this.whois = entity.whois;
        this.revision = entity.revision;
        this.name = entity.name;
        this.prize_money = entity.prize_money;
        // this.image = entity.image;
        this.image_base64 = entity.image_base64;
        this.warning = entity.warning;
        // this.btn_saving_caption = this.IsForAddedDataRow ? '新規登録' : '更新';
    }

}