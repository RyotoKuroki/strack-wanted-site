import $ from 'jquery';
import moment from 'moment';
import ServerFlow from '@/app.server.flows/ServerFlow.ts';
import TrWanted from '@/app.entities/TrWanted.ts';
import WantedRowDesignedModel from '@/app.codebehinds/bingobook/WantedRow.designedmodel.ts';

export default class BingoBookBehind {
    
    public rows: WantedRowDesignedModel[] = new Array<WantedRowDesignedModel>();

    constructor() {
        this.SearchWanteds();
    }
    
    public SearchWanteds() {
        ServerFlow.Execute({
            // reqMethod: 'post',
            url: 'get-wanteds',
            data: {}
        })
        .done((result: any) => {
            const array = new Array<WantedRowDesignedModel>();

            // for edit existing-info
            $.each(result.wanteds, (index: number, entity: any) => {
                const row = new WantedRowDesignedModel();
                row.EntityToRow(entity);
                array.push(row);
            });
            // for add new-info
            const entity = new TrWanted();
            entity.uuid = WantedRowDesignedModel.UUID_KEY__BUTTON_ROW;
            const forNew = new WantedRowDesignedModel();
            forNew.EntityToRow(entity);
            array.push(forNew);
            
            this.rows = array;
        })
        .catch((error: any) => {
            alert(`error(get-wanteds)`);
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
        // 明細の末尾（追加行よりは上）に追加
        this.rows.splice(this.rows.length-1, 0, blank);
        // 最下部へスクロール！
        $('html, body').animate({ scrollTop: $(document).height() }, 900);
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
            // reqMethod: 'post',
            url: `delete-wanteds`,
            data: { wanteds: [row] }
        })
        .done((result: any) => {
            const currentRows: WantedRowDesignedModel[] = this.rows;
            const entity: TrWanted = result.wanteds[0];
            // 削除情報をマージ
            const row = currentRows.find(r => r.uuid === entity.uuid) ||
                        currentRows.find(r => r.uuid === '');
            if(row)
                row.EntityToRow(entity);
            // 表示上から削除
            this.rows = currentRows.filter(x => x.enabled !== 'disable');
        })
        .catch((error: any) => {
            alert(`error(delete-wanteds)`);
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
            !check(row.name !== null && row.name !== '', 'ターゲット名'))
            return;
        // save
        row.uuid = row.IsForAddedDataRow ? '' : row.uuid;
        ServerFlow.Execute({
            // reqMethod: 'post',
            url: `upsert-wanteds`,
            data: {
                wanteds: [row]
            }
        })
        .done((result: any, textStatus: any, jqXHR: any, ) => {
            const currentRows: WantedRowDesignedModel[] = this.rows;
            const entity: TrWanted = result.wanteds[0];
            // 修正行を抽出
            const row = currentRows.find(r => r.uuid === entity.uuid) ||
                        currentRows.find(r => r.uuid === '');
            if(row)
                row.EntityToRow(entity);
        })
        .catch((error: any) => {
            alert(`error(upsert-wanteds)`);
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
