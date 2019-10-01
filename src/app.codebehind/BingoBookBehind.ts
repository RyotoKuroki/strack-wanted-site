import $ from 'jquery';
import ITR_Wanted from '@/app.entities.interfaces/ITR_Wanted';
import ServerFlow from '@/app.server.flows/ServerFlow';
import TrWanted from '@/app.entities/TrWanted';

export default class BingoBookBehind {
    
    public rows: Row[] = new Array<Row>();

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

        // 新規追加行の削除は画面上だけの対応でOK
        if(row.uuid === Row.UUID_KEY__ADDED_ROW) {
            this.rows = currentRows.filter(x => x.uuid !== row.uuid);
            return;
        }

        // DBサーバへ削除リクエスト
        // 既存データの削除はサーバへ削除リクエス込み
        this.DeleteWanteds(row);
    }
    public DeleteWanteds(row: Row) {
        ServerFlow.Execute({
            reqMethod: 'delete',
            url: `http://localhost:3000/DELETE/wanteds?uuid=${row.uuid}`,
            data: {}
        })
        .done((result: any) => {
            const currentRows = this.rows;
            this.rows = currentRows.filter(x => x.uuid !== row.uuid);
        })
        .catch((error: any) => {
            console.log(`error at server-request : ${error}`);
        });
    }
    public SaveWanteds(event: any, row: Row) {
        // check
        const check = (judge: boolean, msgPart: string): boolean => {
            // OK
            if(judge)
                return true;
            // NG
            alert(`${msgPart}を設定して下さい。`);
            return false;
        };
        if (!check(row.hasImage, '画像') ||
            !check(row.name !== null && row.name !== '', 'ターゲット名') ||
            !check(row.prize_money !== null && row.prize_money !== 0, '懸賞金額') ||
            !check(row.warning !== null && row.warning !== '', '要注意情報'))
            return;
        // save
        row.uuid = row.IsForAddedDataRow ? '' : row.uuid;
        const urlPart = row.IsForAddedDataRow ? `POST` : `PUT`;
        ServerFlow.Execute({
            // TODO: reqMethod: 'put',
            reqMethod: 'post',
            url: `http://localhost:3000/${urlPart}/wanteds`,
            data: {
                wanteds: [row]
            }
        })
        .done((result: any, textStatus: any, jqXHR: any, ) => {
            const currentRows: Row[] = this.rows;
            const target: TrWanted = result.wanteds[0];
            const targetRow: Row | undefined = currentRows.find(r => r.uuid === target.uuid);
            if(targetRow) {
                targetRow.EntityToRow(target);
            }
        })
        .catch((error: any) => {
            // console.log(`error at server-request : ${JSON.stringify(error)}`);
            alert('error');
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
                row.image_base64 = `${fr.result}`;
            };
            fr.readAsDataURL(file);
        };
    }
    public SelectImage() {
        if(this.selectImageLazyEvent)
            this.selectImageLazyEvent();
    }
    public ClearImage(ev: any, row: Row) {
        row.image_base64 = '';
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
        this.btn_saving_caption = this.IsForAddedDataRow ? '新規登録' : '更新';
    }

    public get FormattedPrizeMoney(): string {
        return this.prize_money.toLocaleString();
    }

    public get hasImage(): boolean {
        return this.image_base64 !== null && this.image_base64 !== '';
    }
    // 編集されている？
    public get IsDirty(): boolean {
        return this.image_base64 !== this._entity.image_base64 ||
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
}
