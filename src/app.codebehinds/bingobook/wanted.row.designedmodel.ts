import $ from 'jquery';
import ITR_Wanted from 'strack-wanted-meta/src/entities/I.tr.wanted';

/**
 * テーブルの構造を基に、画面バインドに適した構造に整形したモデル。
 * BingoBook の １行分。
 */
export default class WantedRowDesignedModel implements ITR_Wanted {

    protected _entity!: ITR_Wanted;

    public uuid!: string;
    public whois!: string;
    public enabled!: string;
    public revision!: number;
    public name!: string;
    public prize_money!: number;
    public image_base64!: string;
    public warning!: string;
    public done!: string;

    public btn_saving_caption = '';

    public is_header!: boolean;
    public is_new!: boolean;

    public EntityToRow(entity: ITR_Wanted, isHeader: boolean) {
        // 初期設定値
        this._entity = entity;
        // 画面バインドフィールド値
        this.uuid = entity.uuid;
        this.whois = entity.whois;
        this.enabled = entity.enabled;
        this.revision = entity.revision;
        this.name = entity.name;
        this.prize_money = entity.prize_money;
        this.image_base64 = entity.image_base64;
        this.warning = entity.warning;
        this.done = entity.done;
        this.is_header = isHeader;
        this.is_new = !isHeader && entity.uuid === '';
        this.btn_saving_caption = this.IsForAddedDataRow ? '新規登録' : '更新';
    }

    // 画像が設定されている？
    public get HasImage(): boolean {
        return this.image_base64 !== null && this.image_base64 !== '';
    }
    // １つ以上の項目が編集されている？
    public get IsDirty(): boolean {
        return this.image_base64 !== this._entity.image_base64 ||
                this.name !== this._entity.name ||
                this.prize_money !== this._entity.prize_money ||
                this.warning !== this._entity.warning;
    }

    // この行は「新規追加」ボタン用の行情報？
    public get IsForButton(): boolean {
        return this.is_header;
    }
    // この行は、新規追加されたブランク行情報？
    public get IsForAddedDataRow(): boolean {
        return this.is_new;
    }
}
