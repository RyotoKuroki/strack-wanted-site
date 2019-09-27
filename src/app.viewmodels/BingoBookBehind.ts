import TrWanted from '@/app.entities/src/TrWanted';

export default class BingoBookBehind {
    public WantedList: TrWanted[] = new Array<TrWanted>();
    constructor() {
        const hoge = new TrWanted();
        hoge.prize_money = 123456;
        hoge.name = 'ルパンん';
        hoge.uuid = '1'
        hoge.whois = '1';
        hoge.warning = 'wwww---nn';
        this.WantedList = [ hoge, hoge ];
    }
}