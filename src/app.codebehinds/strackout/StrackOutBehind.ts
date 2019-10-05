import $ from 'jquery';
import moment from 'moment';
// import ITR_Wanted from '@/app.entities.interfaces/ITR_Wanted';
import ServerFlow from '@/app.server.flows/ServerFlow.ts';
import TrWanted from '@/app.entities/TrWanted.ts';
import WantedPaperDesignedModel from '@/app.codebehinds/strackout/WantedPaper.designedmodel.ts';

export default class StrackOutBehind {

    //protected serverFlow: ServerFlow = new ServerFlow();
    public papers: WantedPaperDesignedModel[] = new Array<WantedPaperDesignedModel>();

    constructor() {
        this.SearchWanteds();
    }
    
    public SearchWanteds() {
        ServerFlow.Execute({
            reqMethod: 'post',
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
            console.log(`error at server-request : ${error}`);
        });
    }

    public SaveDone(paper: WantedPaperDesignedModel) {
        if(!confirm(`${moment(new Date()).format('HH時mm分、')}ターゲット確保〜！？`))
            return;
        paper.done = 'done';
        ServerFlow.Execute({
            reqMethod: 'post',
            url: 'http://localhost:3000/done-wanteds',
            data: { wanteds: paper }
        })
        .done((result: any) => {
            const currentRows: WantedPaperDesignedModel[] = this.papers;
            const target: TrWanted = result.wanteds[0];
            const targetRow: WantedPaperDesignedModel | undefined = currentRows.find(r => r.uuid === target.uuid);
            if(targetRow) {
                targetRow.EntityToRow(target);
            }
        })
        .catch((error: any) => {
            console.log(`error at server-request : ${error}`);
        });
    }
}
