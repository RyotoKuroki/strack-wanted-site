import $ from 'jquery';
// import TrWanted from '@/app.entities/src/TrWanted';
import ITR_Wanted from '@/app.entities.interfaces/ITR_Wanted';
// import BingoBookSearchWantedsFlow from '@/app.server.flows/BingoBook.SearchWanteds';
import ServerFlow from '@/app.server.flows/ServerFlow';
// import TrWanted from '@/app.db/src/TrWanted';

export default class BingoBookBehind {
    public rows: Row[] = new Array<Row>();
    constructor() {
        // super();
        this.SearchWanteds();
    }
    public async SearchWanteds() {
        ServerFlow.Execute({
            post: false,
            url: 'http://localhost:3000/wanteds/find',
            data: {}
        })
        .then((result: any) => {
            const array = new Array<Row>();
            $.each(result.wanteds, (index, entity) => {
                const row = new Row();
                row.EntityToRow(entity);
                array.push(row);
                this.rows.push(row);
            });
        })
        .catch((error: any) => {
            console.log(`error at server-request : ${error}`);
        });
    }
    protected lazyImageSelectEvent: any;
    public ClickRow(ev: any, row: Row) {
        this.lazyImageSelectEvent = (changeEvent: any) => {
            const fr = new FileReader();
            const files = ev.target.files || ev.files;
            if(!files || files.length == 0)
                return alert('ファイルを選択して下さい。');
            fr.onload = (e) => row.image = `${fr.result}`;
            fr.readAsDataURL(files[0]);
        };
    }
    public SelectImage(ev: any, ev2: any) {
        if(this.lazyImageSelectEvent)
            this.lazyImageSelectEvent();
    }
}

export class Row implements ITR_Wanted {

    protected _entity!: ITR_Wanted;

    public uuid: string = '';
    public whois: string = '';
    public revision: number = 0;
    public name: string = '';
    public prize_money: number = 0;
    public image: string = '';
    public warning: string = '';

    public EntityToRow(entity: ITR_Wanted) {
        this._entity = entity;
        this.uuid = entity.uuid;
        this.whois = entity.whois;
        this.revision = entity.revision;
        this.name = entity.name;
        this.prize_money = entity.prize_money;
        this.image = entity.image;
        this.warning = entity.warning;
    }

    public get FormattedPrizeMoney(): number {
        // return `\\ ${this.prize_money}`;
        return this.prize_money;
    }

    /*
    // 現在のデータ状態を保存
    public SnapShot() {
        this._RowSnapped = $.extend(true, {}, this);
    }
    protected _RowSnapped!: Row;
    */

    // 値が編集されているかどうか！
    // 現在状態 と スナップショット状態 を比較して判定
    public IsDirty(): boolean {
        return this.name !== this._entity.name ||
                this.prize_money !== this._entity.prize_money ||
                this.image !== this._entity.image ||
                this.warning !== this._entity.warning;
    }
}
