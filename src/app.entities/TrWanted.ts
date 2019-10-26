import ITR_Wanted from 'strack-wanted-meta/src/entities/I.tr.wanted';
import { EntityEnableStates } from 'strack-wanted-meta/dist/consts/states/states.entity.enabled';

export default class TrWanted implements ITR_Wanted {
    public uuid: string = '';
    public whois: string = '';
    public enabled: string = EntityEnableStates.ENABLE;
    public revision: number = 0;
    public name: string = '';
    public prize_money: number = 0;
    public image_base64!: string;
    public warning: string = '';
    public done: string = '';
}
