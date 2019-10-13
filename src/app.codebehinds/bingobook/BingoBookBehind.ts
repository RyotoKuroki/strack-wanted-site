import $ from 'jquery';
import moment from 'moment';
import ServerFlow from '@/app.server.flows/ServerFlow.ts';
import TrWanted from '@/app.entities/TrWanted.ts';
import WantedRowDesignedModel from '@/app.codebehinds/bingobook/WantedRow.designedmodel.ts';

export default class BingoBookBehind {
    
    /**
     * 表示データ１行分のモデル
     */
    public rows: WantedRowDesignedModel[] = new Array<WantedRowDesignedModel>();

    /**
     * コンストラクタ
     */
    constructor() {
        this.SearchWanteds();
    }
    /**
     * 表示データ検索
     */
    public SearchWanteds() {
        ServerFlow.Execute({
            // reqMethod: 'post',
            url: 'get-wanteds',
            data: {}
        })
        .done((result: any) => {
            const array = new Array<WantedRowDesignedModel>();

            // 取得データを、画面バインド用情報へマージ
            $.each(result.wanteds, (index: number, entity: any) => {
                const row = new WantedRowDesignedModel();
                row.EntityToRow(entity);
                array.push(row);
            });
            // 「新規追加」ボタンを表示するためのモックデータを作成
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
    /**
     * 新行追加。
     * ただし、既に新行が存在する場合はNGとする。。。
     * @param ev 
     * @param row 
     */
    public AddNewRow(ev: any, row: WantedRowDesignedModel) {
        const currentRows = this.rows;
        const hasAddedDataRow = currentRows.findIndex(x => x.IsForAddedDataRow === true) >= 0;
        if(hasAddedDataRow)
            return alert('既に新規追加アイテムが存在します。');
        
        // 最下行（「新規追加」ボタンよりは上）に、ブランク行を追加
        const entity = new TrWanted();
        entity.uuid = WantedRowDesignedModel.UUID_KEY__ADDED_ROW;
        const blank = new WantedRowDesignedModel();
        blank.EntityToRow(entity);
        this.rows.splice(this.rows.length-1, 0, blank);

        // 最下部へスクロール！
        $('html, body').animate({ scrollTop: $(document).height() }, 900);
    }
    /**
     * 行削除。
     * 新規追加された行を削除する場合は、画面上から消すだけ（サーバへリクエストはしない）。
     * 既存データ行を削除する場合は、サーバにリクエストも実施。
     * @param ev 
     * @param row 
     */
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
    /**
     * 行削除のサーバリクエスト部分。
     * @param row 
     */
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
    /**
     * 行データ登録。
     * @param event 
     * @param row 
     */
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
        if (!check(row.HasImage, '画像') ||
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

    /**
     * アップロードの許可された画像拡張子リスト。
     */
    protected allowedImgExts = ['.jpeg', '.jpg', '.png', '.gif', ];
    /**
     * 画像アップロード処理のイベントハンドラ。
     * 必要な理由・・
     * 　「画像選択」をクリック時、まず ①Click イベントが発生した後、ファイル選択ダイアログが起動する。
     * 　そして、ファイル選択ダイアログで画像を選択した際、②Change イベントが発生する。
     * 　ここで問題になるのが・・・
     * 　　②Change イベントの引数には、行を特定する情報がないこと！
     * 　　そのため、画像を選択したものの、「どの行に適用するか」が特定できなくなる！！
     * 　そこで・・・
     * 　　①Click イベントの時点で、『行の特定 ＋ 画像が選択された際の画像バインド処理』をハンドラに登録しておくことにする。
     * 　　これで、②Change処理時に、上記の『行の特定 ＋ 画像が…』を呼び出すだけで、適切に画面にイメージ反映できるようになる、という算段！
     */
    protected selectImageLazyEventHandler: any;
    /**
     * 「画像選択」クリック時イベント。
     * Changeイベント発火時に実施するべき処理をハンドルする。
     * @param ev 
     * @param row 
     */
    public ClickRow(ev: any, row: WantedRowDesignedModel) {

        // イベントハンドラに処理を登録
        this.selectImageLazyEventHandler = (changeEvent: any) => {
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
    /**
     * 「画像選択」クリック時イベント
     */
    public SelectImage() {
        // Clickイベント内でハンドルされた処理を実施。
        if(this.selectImageLazyEventHandler)
            this.selectImageLazyEventHandler();
    }
    /**
     * 画像クリア処理
     * @param ev 
     * @param row 
     */
    public ClearImage(ev: any, row: WantedRowDesignedModel) {
        row.image_base64 = '';
    }
}
