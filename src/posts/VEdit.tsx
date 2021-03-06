import * as React from 'react';
import { CPosts } from "./CPosts";
import { VPage, UiSchema, Schema, Page, UiInputItem, UiIdItem, tv, Edit, ItemSchema, FA } from "tonva";
import { observer } from 'mobx-react';
import { consts } from 'consts';
import { setting } from 'configuration';
import classNames from "classnames";
import { observable } from 'mobx';
export class VEdit extends VPage<CPosts> {

    @observable isOn: boolean = true;
    private textarea: HTMLTextAreaElement;
    async open() {
        this.openPage(this.page);
    }

    private onClickSaveButton = async () => {
        let { current } = this.controller;
        let id = current && current.id;
        current.content = this.textarea.value;
        current.emphasis = this.isOn ? 0 : 1;

        await this.controller.saveItem(id, current);
        this.closePage();
    }

    private onItemChanged = async (itemSchema: ItemSchema, newValue: any, preValue: any) => {
        let { name } = itemSchema;
        this.controller.current[name] = newValue;
    }

    private imageContent = (boxId: any) => {
        return tv(boxId, (values) => {
            let { caption } = values;
            return <>{caption}</>;
        });
    }

    private catalogContent = (boxId: any) => {
        if (boxId) {
            let { productCategory } = boxId;

            let aa = tv(productCategory, val => {
                return <>{productCategory.id}</>
            });
            return aa;
        }
    }

    private subjectContent = (boxId: any) => {
        return <>{boxId ? boxId.name : null}</>;
    }

    private uiSchema: UiSchema = {
        items: {
            caption: { widget: 'text', label: this.t('title') },
            discription: {
                widget: 'textarea', label: this.t('describe'), placeholder: this.t('describe'), rows: 3
            } as UiInputItem,

            image: {
                widget: 'id', label: this.t('picture'), pickId: this.controller.pickImage, Templet: this.imageContent
            } as UiIdItem,
            /**
            productcatalog: {
                widget: 'id', label: "目录", pickId: this.controller.pickProductCatalog, Templet: this.catalogContent
            } as UiIdItem,

            subject: {
                widget: 'id', label: "栏目", pickId: this.controller.pickSubject, Templet: this.subjectContent
            } as UiIdItem,
            **/
            submit: { widget: 'button', label: this.t('submit') }
        }
    };

    private schema: Schema = [
        { name: 'caption', type: 'string', required: true },
        { name: 'discription', type: 'string', required: false },
        { name: 'image', type: 'id', required: true },
        /**
        { name: 'productcatalog', type: 'id', required: false },
        { name: 'subject', type: 'id', required: false }
        **/
    ];

    render(): JSX.Element {
        return <this.page />
    }
    private onOff = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.isOn = evt.currentTarget.value === 'general';
    }
    private isimport() {
        let cnButton = ['btn', 'btn-outline-primary', 'btn-sm', 'text-nowrap'];
        return <div className="px-sm-2 d-flex align-items-center">
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                <label className={classNames(cnButton, { active: this.isOn })}>
                    <input type="radio" name="options" value="general " defaultChecked={true} onChange={this.onOff} />
                    <span className="d-inline d-sm-none">{this.t('普 ')}</span>
                    <span className="d-none d-sm-inline">{this.t('general')}</span>
                </label>
                <label className={classNames(cnButton, { active: !this.isOn })}>
                    <input type="radio" name="options" value="veryimport" defaultChecked={false} onChange={this.onOff} />
                    <span className="d-inline d-sm-none">{this.t('重')}</span>
                    <span className="d-none d-sm-inline">{this.t('veryimport')}</span>
                </label>
            </div>
        </div>
    }

    private page = observer(() => {

        let { current, cApp, showPostProductCatalog, showPostSubject, showPickClassroomType, showPostDomain } = this.controller;

        let right = <div>
            <button type="button"
                className="btn btn-sm btn-success mr-3"
                onClick={this.onClickSaveButton} >{this.t('submit')}
            </button>
            <button type="button"
                className="btn btn-sm btn-success mr-3"
                onClick={cApp.cTag.showTag} >{this.t('tag')}
            </button>
        </div>;
        return <Page header={this.t('editorpost')} right={right} headerClassName={consts.headerClass}>
            <div className="mx-3 py-2 h-100 d-flex flex-column">
                <textarea ref={tt => this.textarea = tt} className="flex-fill mb-2" defaultValue={current.content} rows={20} />
                <Edit data={current}
                    schema={this.schema}
                    uiSchema={this.uiSchema}
                    onItemChanged={this.onItemChanged}
                />
                {(setting.BusinessScope !== 2) && branch("目录", showPostProductCatalog)}
                {(setting.BusinessScope !== 2) && branch("栏目", showPostSubject)}
                {(setting.BusinessScope !== 2) && branch("领域", showPostDomain)}
                {(setting.BusinessScope !== 2) && branch("类型", showPickClassroomType)}
                <div className="bg-white py-2 d-flex justify-content-end cursor-pointer "> {this.isimport()}</div>
            </div >
        </Page >
    })
}

function branch(name: string, action: any): JSX.Element {
    return <div className="bg-white py-2 d-flex justify-content-between cursor-pointer mb-1" onClick={action}>
        <div>
            <span className="ml-1 mx-3">{name}</span>
        </div>
        <div >
            <FA name='angle-right  mx-3'></FA>
        </div>
    </div >
}