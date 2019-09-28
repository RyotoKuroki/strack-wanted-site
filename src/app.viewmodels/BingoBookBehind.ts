import $ from 'jquery';
import ITR_Wanted from '@/app.entities.interfaces/ITR_Wanted';
import ServerFlow from '@/app.server.flows/ServerFlow';
import TrWanted from '@/app.entities/TrWanted';

export default class BingoBookBehind {
    public rows: Row[] = new Array<Row>();
    constructor() {
        this.SearchWanteds();
    }
    public async SearchWanteds() {
        ServerFlow.Execute({
            post: true,
            url: 'http://localhost:3000/GET/wanteds',
            data: {}
        })
        .then((result: any) => {
            const array = new Array<Row>();

            // for add new-info
            const entity = new TrWanted();
            entity.uuid = Row.UUID_KEY__HEADER_ROW;
            const forNew = new Row();
            forNew.EntityToRow(entity);
            array.push(forNew);
            
            // for edit existing-info
            $.each(result.wanteds, (index: number, entity: any) => {
                const row = new Row();
                row.EntityToRow(entity);
                array.push(row);
            });
            
            this.rows = array;
        })
        .catch((error: any) => {
            console.log(`error at server-request : ${error}`);
        });
    }
    public AddNewRow(ev: any, row: Row) {
        const currentRows = this.rows;
        const hasAddedDataRow = currentRows.findIndex(x => x.IsForAddedDataRow === true) >= 0;
        if(hasAddedDataRow)
            return alert('既に新規追加アイテムが存在します。');
        
        // add new row
        const entity = new TrWanted();
        entity.uuid = Row.UUID_KEY__ADDED_ROW;
        const blank = new Row();
        blank.EntityToRow(entity);
        this.rows.push(blank);
    }
    public DeleteRow(ev: any, row: Row) {
        if(!confirm(`【${row.name}】 をターゲットから除外しますか？\r\n除外後は復元できませんのでご注意下さい。`))
            return false;
        const currentRows = this.rows;
        this.rows = currentRows.filter(x => x.uuid !== row.uuid);

        // 新規登録用の行の場合、DBへの削除処理は不要なためここで終了
        if(row.uuid === Row.UUID_KEY__ADDED_ROW)
            return false;
        
        // DBサーバへ削除リクエスト
        this.DeleteWanteds(row);
    }
    public async DeleteWanteds(row: Row) {
        ServerFlow.Execute({
            post: true,
            url: `http://localhost:3000/DELETE/wanteds?uuid=${row.uuid}`,
            data: {}
        })
        .then((result: any) => {
            const array = new Array<Row>();

            // for add new-info
            const entity = new TrWanted();
            entity.uuid = Row.UUID_KEY__HEADER_ROW;
            const forNew = new Row();
            forNew.EntityToRow(entity);
            array.push(forNew);
            
            // for edit existing-info
            $.each(result.wanteds, (index: number, entity: any) => {
                const row = new Row();
                row.EntityToRow(entity);
                array.push(row);
            });
            
            this.rows = array;
        })
        .catch((error: any) => {
            console.log(`error at server-request : ${error}`);
        });
    }

    protected selectImageLazyEvent: any;
    public ClickRow(ev: any, row: Row) {
        this.selectImageLazyEvent = (changeEvent: any) => {
            const fr = new FileReader();
            const files = ev.target.files || ev.files;
            if(!files || files.length === 0)
                return alert('ファイルを１つ選択して下さい。');
            const file = files[0];
            const filename = `${file.name}`;
            if(!filename.toLowerCase().match('.jpeg$') &&
                !filename.toLowerCase().match('.jpg$') &&
                !filename.toLowerCase().match('.png$') &&
                !filename.toLowerCase().match('.gif$'))
                return alert('画像ファイルを選択して下さい。[.jpeg| .jpg| .png| .gif]');
            fr.onload = (e) => {
                row.image = `${fr.result}`;
            };
            fr.readAsDataURL(files[0]);
        };
    }
    public SelectImage() {
        if(this.selectImageLazyEvent)
            this.selectImageLazyEvent();
    }
    public ClearImage(ev: any, row: Row) {
        row.image = '';
    }
}

export class Row implements ITR_Wanted {

    public static readonly UUID_KEY__HEADER_ROW: string = 'UUID_KEY__HEADER_ROW';
    public static readonly UUID_KEY__ADDED_ROW: string = 'UUID_KEY__ADDED_ROW';

    protected _entity!: ITR_Wanted;

    public uuid!: string;
    public whois!: string;
    public revision!: number;
    public name!: string;
    public prize_money!: number;
    public image!: string;
    public warning!: string;

    public EntityToRow(entity: ITR_Wanted) {
        // 初期設定値
        this._entity = entity;
        // 画面バインドフィールド値
        this.uuid = entity.uuid;
        this.whois = entity.whois;
        this.revision = entity.revision;
        this.name = entity.name;
        this.prize_money = entity.prize_money;
        this.image = entity.image;
        this.warning = entity.warning;
    }

    public get FormattedPrizeMoney(): string {
        return this.prize_money.toLocaleString();
    }

    public get hasImage(): boolean {
        return this.image !== null && this.image !== '';
    }

    // 編集されている？
    public get IsDirty(): boolean {
        return this.image !== this._entity.image ||
                this.name !== this._entity.name ||
                this.prize_money !== this._entity.prize_money ||
                this.warning !== this._entity.warning;
    }

    // この行はヘッダ用？
    public get IsForHeader(): boolean {
        return this.uuid === Row.UUID_KEY__HEADER_ROW;
    }
    // この行情報はブランク（新規登録用）？
    public get IsForAddedDataRow(): boolean {
        return this.uuid === Row.UUID_KEY__ADDED_ROW;
    }
    public get BtnCaption(): string {
        return this.IsForAddedDataRow ? '新規登録' : '更新';
    }
}
