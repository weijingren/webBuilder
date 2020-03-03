import _ from "lodash";
import { CUqBase } from "../CBase";
import { VMe } from "./VMe";
import { observer } from "mobx-react";
import { observable, isObservable } from "mobx";
import { PageItems, Query, nav } from "tonva";
import { VCompileImg } from "./VCompileImg";
import { VSetDetails } from "./VSetDetails";
import { VAbout } from "./VAbout";

class PageMedia extends PageItems<any> {
    private searchMediaQuery: Query;
    constructor(searchQuery: Query) {
        super();
        this.firstSize = this.pageSize = 14;
        this.searchMediaQuery = searchQuery;
    }

    protected async load(
        param: any,
        pageStart: any,
        pageSize: number
    ): Promise<any[]> {
        if (pageStart === undefined) pageStart = 0;
        let ret = await this.searchMediaQuery.page(param, pageStart, pageSize);
        return ret;
    }
    protected setPageStart(item: any): any {
        this.pageStart = item === undefined ? 0 : item.id;
    }
}

export class CMe extends CUqBase {
    @observable pageMedia: PageMedia;
    @observable items: any[];
    @observable current: any;
    @observable PostTotal: any = 0;
    @observable PageTotal: any = 0;
    @observable pagePosts: any[];

    searchMadiaKey = async (key: string) => {
        this.pageMedia = new PageMedia(this.uqs.webBuilder.SearchImage);
        this.pageMedia.first({ key: key });
    };
    protected async internalStart() { }

    onSet = () => {
        this.openVPage(VSetDetails);

    };

    showAbout = () => {
        this.openVPage(VAbout);
    };

    loadList = async () => {
        // post用浏览量
        let postTotal = await this.uqs.webBuilder.SearchTotalBrowsing.query({});

        if (postTotal.ret.length && (postTotal.ret.length > 0)) {
            console.log(1)
            this.PostTotal = postTotal.ret[0].PostTotal;
            console.log(this.PostTotal, 777)
        }

        // page用户总浏览量
        let pageTotal = await this.uqs.webBuilder.SearchTotalBrowsing.query({});
        if (pageTotal.ret.length && (pageTotal.ret.length > 0)) {
            this.PageTotal = pageTotal.ret[0].PageTotal;
        }

        await this.searchTeam();
    };

    onAlterImg = () => {
        this.current = undefined;
        this.openVPage(VCompileImg);
    };

    saveItem = async (id: any, param: any) => {
        param.author = this.user.id;
        let ret = await this.uqs.webBuilder.Image.save(id, param);
        if (id) {
            let item = this.items.find(v => v.id === id);
            if (item !== undefined) {
                _.merge(item, param);
                item.$update = new Date();
            }
            this.current = item;
        } else {
            param.id = ret.id;
            param.$create = new Date();
            param.$update = new Date();
            this.items.unshift(param);
            this.current = param;
        }
        this.searchMadiaKey("");
    };

    searchTeam = async () => {
        let team = await this.uqs.hr.SearchTeam.table({ key: "" });
    }

    render = observer(() => {
        return this.renderView(VMe);
    });
    tab = () => this.renderView(VMe);
}
