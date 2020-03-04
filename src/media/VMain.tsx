import * as React from "react";
import { consts } from "consts";
import { CMedia } from "./CMedia";
import { observer } from "mobx-react";
import { VPage, Page, FA, List, LMR, EasyTime, SearchBox, Loading } from "tonva";
import copy from 'copy-to-clipboard';

export class VMain extends VPage<CMedia> {
    async open() {
    }

    render(member: any): JSX.Element {
        return <this.page />
    }

    private page = observer(() => {
        let { pageMedia, searchMadiaKey, onAddClick } = this.controller;
        let right = <div className="w-19c d-flex">
            <SearchBox className="w-80 mt-1 mr-2"
                size='sm'
                onSearch={(key: string) => searchMadiaKey(key)}
                placeholder={this.t('searchpicture')} />
            <div onClick={onAddClick}>
                <span className="ml-2 iconfont icon-jiahao1 mr-2"
                    style={{ fontSize: "26px", color: "white" }}>
                </span>
            </div>
        </div>;
        let { items, loading } = pageMedia;
        console.log(items,'items')
        let divItems: any;
        if (!items) {
            divItems = (loading === true) ?
                <div className="m-5"><Loading /></div>
                :
                <div className="my-3 mx-2 text-warning">
                    <span className="text-primary" >{this.t('nopicture')}</span>
                </div>;
        }
        else {
            divItems = items.map((v, index) => {
                return this.renderItem(v, index)
            });
        }
        return <Page header={this.t('picture')} headerClassName={consts.headerClass} right={right} onScrollBottom={this.onScrollBottom}>
            <div className="mx-3">
                <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4">
                    {divItems}
                </div>
            </div>
        </Page>;
    })

    private onScrollBottom = async () => {
        await this.controller.pageMedia.more();
    }

    private copyClick = (e: any) => {
        copy(e.target.previousElementSibling.innerText)
        alert(this.t('copysuccess'))
    }
    private preview = (path: any) => {
        window.open(path, '_blank')
    }

    private renderItem = (item: any, index: number) => {
        let { caption, path, $create, id } = item;
        let { onimgNames } = this.controller
        let imgStyle = {
            backgroundImage: `url(${path})`,
        }
        //let right = <div className="border p-1"><img className="h-4c w-4c" src={path} /></div>;

        let right = <div className="d-flex align-items-center bg-white rounded" onClick={() => this.preview(item.path)}>
            <div className="w-100 h-100 bg-center-img h-min-12c" style={imgStyle}>
            </div>
        </div>;

        return <div key={index} className="col px-3 py-2 border-bottom cursor-pointer text-center">
            <div 
                className="pb-2" 
                style={{ height: "27px", overflow: "hidden" }} 
                onClick={()=>onimgNames(id)} >
                {caption}
            </div>
            {right}

            <div className="smallPath small pt-2">{path}</div>
            <button
                style={{ fontWeight: 550, padding: '0 5px', fontSize: '12px' }}
                className="mt-2 btn btn-outline-primary"
                onClick={this.copyClick}>
                {this.t('copy')}
            </button >
        </div>;

    }
}