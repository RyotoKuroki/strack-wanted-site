import ITR_Account from 'strack-wanted-meta/src/entities/I.tr.account';
import { EntityEnabledStates } from '@/app.consts/states/states.entity.enabled';

export default class TrAccount implements ITR_Account {
    public uuid: string = '';
    public whois: string = '';
    // TODO: use static
    public enabled: string = new EntityEnabledStates().ENABLED;
    public revision: number = 0;
    public user_name: string = '';
    public image_base64!: string;
}
