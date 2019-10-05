import $ from 'jquery';
import moment from 'moment';
import ServerFlow from '@/app.server.flows/ServerFlow.ts';
import TrWanted from '@/app.entities/TrWanted.ts';
import WantedPaperDesignedModel from '@/app.codebehinds/strackout/WantedPaper.designedmodel.ts';

export default class StrackOutBehind {

    public papers: WantedPaperDesignedModel[] = new Array<WantedPaperDesignedModel>();

    constructor() {
        this.SearchWanteds();
    }
    
    public SearchWanteds() {
        ServerFlow.Execute({
            // reqMethod: 'post',
            url: 'http://localhost:3000/get-wanteds',
            data: {}
        })
        .done((result: any) => {
            const array = new Array<WantedPaperDesignedModel>();
            $.each(result.wanteds, (index: number, entity: any) => {
                const row = new WantedPaperDesignedModel();
                row.EntityToRow(entity);
                array.push(row);
            });
            this.papers = array;
        })
        .catch((error: any) => {
            alert(`error(get-wanteds)`);
        });
    }

    public SaveDone(paper: WantedPaperDesignedModel) {
        const doneAlready = paper.IsDone;
        const msg = doneAlready
            ? 'ターゲット脱走！？'
            :　`${moment(new Date()).format('HH時mm分、')}ターゲット確保〜！？`;
        if(!confirm(msg))
            return;
        const wanted = new TrWanted();
        wanted.uuid = paper.uuid;
        wanted.revision = paper.revision;
        wanted.done = doneAlready ? '' : 'done';
        // wanted.whois = paper.whois;
        ServerFlow.Execute({
            // reqMethod: 'post',
            url: 'http://localhost:3000/done-wanteds',
            data: { wanteds: [wanted] }
        })
        .done((result: any) => {
            const currentRows: WantedPaperDesignedModel[] = this.papers;
            const target: TrWanted = result.wanteds[0];
            const targetRow = currentRows.find(r => r.uuid === target.uuid);
            if(targetRow)
                targetRow.EntityToRow(target);
        })
        .catch((error: any) => {
            alert(`error(done-wanteds)`);
        });
    }
}
