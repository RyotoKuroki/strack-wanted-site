import $ from 'jquery';
import ITR_Wanted from '@/app.entities.interfaces/ITR_Wanted';
import ServerFlow from '@/app.server.flows/ServerFlow';
import TrWanted from '@/app.entities/TrWanted';
import WantedRowDesignedModel from '@/app.codebehinds/bingobook/WantedRow.designedmodel';

export default class BingoBookBehind {
    
    public rows: WantedRowDesignedModel[] = new Array<WantedRowDesignedModel>();

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
            const array = new Array<WantedRowDesignedModel>();

            // for add new-info
            const entity = new TrWanted();
            entity.uuid = WantedRowDesignedModel.UUID_KEY__HEADER_ROW;
            const forNew = new WantedRowDesignedModel();
            forNew.EntityToRow(entity);
            array.push(forNew);
            
            // for edit existing-info
            $.each(result.wanteds, (index: number, entity: any) => {
                const row = new WantedRowDesignedModel();
                row.EntityToRow(entity);
                array.push(row);
            });
            this.rows = array;
        })
        .catch((error: any) => {
            console.log(`error at server-request : ${error}`);
        });
    }
    public AddNewRow(ev: any, row: WantedRowDesignedModel) {
        const currentRows = this.rows;
        const hasAddedDataRow = currentRows.findIndex(x => x.IsForAddedDataRow === true) >= 0;
        if(hasAddedDataRow)
            return alert('既に新規追加アイテムが存在します。');
        
        // add new row
        const entity = new TrWanted();
        entity.uuid = WantedRowDesignedModel.UUID_KEY__ADDED_ROW;
        const blank = new WantedRowDesignedModel();
        blank.EntityToRow(entity);
        this.rows.push(blank);
    }
    public DeleteRow(ev: any, row: WantedRowDesignedModel) {
        if(!confirm(`【${row.name}】 をターゲットから除外しますか？\r\n除外後は復元できませんのでご注意下さい。`))
            return false;
        
        const currentRows = this.rows;

        // 新規追加行の削除は画面上だけの対応でOK
        if(row.uuid === WantedRowDesignedModel.UUID_KEY__ADDED_ROW) {
            this.rows = currentRows.filter(x => x.uuid !== row.uuid);
            return;
        }

        // DBサーバへ削除リクエスト
        // 既存データの削除はサーバへ削除リクエス込み
        this.DeleteWanteds(row);
    }
    public DeleteWanteds(row: WantedRowDesignedModel) {
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
    public SaveWanteds(event: any, row: WantedRowDesignedModel) {
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
            const currentRows: WantedRowDesignedModel[] = this.rows;
            const target: TrWanted = result.wanteds[0];
            const targetRow: WantedRowDesignedModel | undefined = currentRows.find(r => r.uuid === target.uuid);
            if(targetRow) {
                targetRow.EntityToRow(target);
            }
        })
        .catch((error: any) => {
            alert('error');
        });
    }

    protected allowedImgExts = ['.jpeg', '.jpg', '.png', '.gif', ];
    protected selectImageLazyEvent: any;
    public ClickRow(ev: any, row: WantedRowDesignedModel) {
        this.selectImageLazyEvent = (changeEvent: any) => {
            const fr = new FileReader();
            const files = ev.target.files || ev.files;
            if(!files || files.length === 0)
                return alert('ファイルを１つ選択して下さい。');
            const file = files[0];
            const filename = `${file.name}`;
            const niceFile = this.allowedImgExts.findIndex(x => filename.toLowerCase().endsWith(x)) >= 0;
            if(!niceFile)
                return alert(`画像ファイルを選択して下さい。\r\n[ ${this.allowedImgExts.join(' | ')} ]`);
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
    public ClearImage(ev: any, row: WantedRowDesignedModel) {
        row.image_base64 = '';
    }
}
