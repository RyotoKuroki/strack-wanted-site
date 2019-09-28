import $ from 'jquery';
// import TrWanted from '@/app.entities/src/TrWanted';
import ITR_Wanted from '@/app.entities.interfaces/ITR_Wanted';
// import BingoBookSearchWantedsFlow from '@/app.server.flows/BingoBook.SearchWanteds';
import ServerFlow from '@/app.server.flows/ServerFlow';
// import TrWanted from '@/app.db/src/TrWanted';

export default class BingoBookBehind {
    public Rows: Row[] = new Array<Row>();
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
                this.Rows.push(row);
            });
            // this.Rows = array;
            /*
            const hoge = new Row();
            const inf = new TrWanted();
            inf.uuid = '1';
            inf.whois = '1';
            inf.name = '1';
            inf.prize_money = 123;
            inf.revision = 1;
            inf.warning = '1';
            hoge.EntityToRow(inf);
            // hoge.SnapShot();
            array.push(hoge);
            this.Rows = array;
            */
        })
        .catch((error: any) => {
            console.log(`error at server-request : ${error}`);
        });
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
