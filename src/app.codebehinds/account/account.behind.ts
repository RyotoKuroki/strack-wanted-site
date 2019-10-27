import $ from 'jquery';
import moment from 'moment';
import Api from '@/app.services/api';
import TrAccount from '@/app.entities/tr.account';
import { BrowserCaches } from '@/app.consts/cache.browser';

export default class AccountBehind {

    /**
     * ユーザ名。
     * これをキーに、紐づくWanted情報を抽出します。
     */
    public UserName: string = '';
    /**
     * ユーザサムネ。
     */
    public ImageBase64: string = '';

    /**
     * 必須項目が入力済みの場合のみ、登録可能とする。
     */
    public get CanRegist(): boolean {
        // return this.UserName !== null && this.UserName !== '';
        return true;
    }

    /**
     * ブラウザキャッシュのユーザ名
     * get/set
     */
    protected get _CachedUserName(): string { return localStorage[BrowserCaches.ACCOUNT_USER_NAME]; }
    protected set _CachedUserName(value: string) { localStorage[BrowserCaches.ACCOUNT_USER_NAME] = this.EscapeNull(this.UserName); }

    /**
     * ブラウザキャシュのサムネ
     * get/set
     */
    protected get _CachedImageBase64(): string { return localStorage[BrowserCaches.ACCOUNT_IMAGE_BASE64]; }
    protected set _CachedImageBase64(value: string) { localStorage[BrowserCaches.ACCOUNT_IMAGE_BASE64] = this.EscapeNull(this.ImageBase64); }
    
    /**
     * コンストラクタ
     */
    constructor() {
        this.RestoreAccount();
    }

    /**
     * 画面表示→ブラウザキャッシュ
     * @param ev 
     */
    public SaveAccount(ev: any) {
        if(!confirm(`アカウント情報をブラウザにキャッシュして良いですか？`))
            return;
        this._CachedUserName = this.EscapeNull(this.UserName);
        this._CachedImageBase64 = this.EscapeNull(this.ImageBase64);
    }

    /**
     * キャッシュ→画面へ表示
     */
    protected RestoreAccount() {
        this.UserName = this._CachedUserName;
        this.ImageBase64 = this._CachedImageBase64;
    }

    /**
     * Null, undefined をブランクに置き換え
     * @param value 
     */
    protected EscapeNull(value: string) {
        return (value === null || value === undefined) ? '' : value;
    }
}
