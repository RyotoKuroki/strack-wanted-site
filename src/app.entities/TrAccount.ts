import ITR_Account from 'strack-wanted-meta/src/entities/I.tr.account';
import { EntityEnableStates } from 'strack-wanted-meta/dist/consts/states/states.entity.enabled';

export default class TrAccount implements ITR_Account {
    public uuid: string = '';
    public whois: string = '';
    public enabled: string = EntityEnableStates.ENABLE;
    public revision: number = 0;
    public user_name: string = '';
    public image_base64!: string;
}
