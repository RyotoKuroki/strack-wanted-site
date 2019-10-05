import ITR_Wanted from '../app.entities.interfaces/ITR_Wanted';

export default class TrWanted /*extends BaseEntity*/implements ITR_Wanted {
    public uuid: string = '';
    public whois: string = '';
    public enabled: string = 'enable';
    public revision: number = 0;
    public name: string = '';
    public prize_money: number = 0;
    public image_base64!: string;
    public warning: string = '';
    public done: string = '';
}
