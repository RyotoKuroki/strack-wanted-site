import $ from 'jquery';
import ITR_Wanted from 'strack-wanted-meta/src/entities/ITR_Wanted';

/**
 * テーブルの構造を基に、画面バインドに適した構造に整形したモデル。
 * BingoBook の １行分。
 */
export default class WantedRowDesignedModel implements ITR_Wanted {

    public static readonly UUID_KEY__BUTTON_ROW: string = 'UUID_KEY__BUTTON_ROW';
    public static readonly UUID_KEY__ADDED_ROW: string = 'UUID_KEY__ADDED_ROW';

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

    public EntityToRow(entity: ITR_Wanted) {
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
    public get IsForButton(): boolean {
        return this.uuid === WantedRowDesignedModel.UUID_KEY__BUTTON_ROW;
    }
    // この行情報はブランク（新規登録用）？
    public get IsForAddedDataRow(): boolean {
        return this.uuid === WantedRowDesignedModel.UUID_KEY__ADDED_ROW;
    }
}
