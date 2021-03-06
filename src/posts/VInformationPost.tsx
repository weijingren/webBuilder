import * as React from "react";
import { consts } from "consts";
import { observer } from "mobx-react";
import { VPage, Page, List, FA, tv, SearchBox } from "tonva";
import { CPosts } from "./CPosts";
// import classNames from "classnames";
import { observable } from "mobx";
export class VInformationPost extends VPage<CPosts> {
	@observable private isMes: boolean = true;

	async open() {
		this.openPage(this.page)
	}

	render(): JSX.Element {
		return <this.page />;
	}

	private page = observer(() => {
		let { informationpagePosts, informationsearchPostsKey, onScrollBottoms } = this.controller;
		let none = (
			<div className="my-3 mx-2">
				<span className="text-muted small">[{this.t('noposts')}]</span>
			</div>
		);
		let right = (
			<div className="d-flex align-items-center mr-1">
				<SearchBox size="sm" onSearch={(key: string) => informationsearchPostsKey(key, "")} placeholder={this.t('searchpost')} />
			</div>
		);
		return <Page header={'选择贴文'} headerClassName={consts.headerClass} right={right} onScrollBottom={onScrollBottoms}>
			<List before={""} none={none} items={informationpagePosts} item={{ render: this.renderItem }} />
		</Page>;
	});
	private renderItem = (item: any, index: number) => {
		return <this.itemRow {...item} />;
	};

	private itemRow = observer((item: any) => {
		let { user, addInformation } = this.controller;

		if (!user) return;
		let { image, caption, discription, author, emphasis, web, agent, assist, openweb } = item;
		let divUser = user.id === author.id ?
			<span className="text-warning">[自己]</span>
			:
			this.controller.cApp.renderUser(author.id);

		let showImport = emphasis === 1 ?
			<FA className="text-danger ml-3 " name="star" /> : null
		return (
			<div className="pl-2 pl-sm-3 pr-2 pr-sm-3 pt-2 pb-3 d-flex">
				<div className="d-flex flex-fill cursor-pointer" onClick={() => addInformation({ id: item.id, sort: 0 })} >
					<div className="mr-1 w-5c w-min-5c h-5c h-min-5c">
						{tv(
							image,
							values => <div className="w-100 h-100 bg-center-img h-max-6c border rounded"
								style={{ backgroundImage: 'url(' + values.path + ')' }}></div>,
							undefined,
							() => (
								<div className="d-flex align-items-center h-100 justify-content-center bg-light border rounded">
									<FA className="text-info" name="camera" size="lg" />
								</div>
							)
						)}
					</div>
					<div className="d-flex flex-column w-100">
						<div className="ml-1"><b>{caption}</b></div>
						<div className="small ml-1 text-muted py-2 flex-fill">{discription}</div>
						<div className="small d-flex ml-1">
							<div className="flex-fill">
								{divUser}
								{showImport}
							</div>
						</div>
						<div className="small pt-1 nowrap" style={{ overflow: "hidden" }}>
							{(web + agent + assist + openweb) > 0 ? <span className=" text-muted">发布：</span> : <></>}
							{agent === 1 ? <span style={{ borderRadius: "15%/48%" }} className="bg-success mr-1 text-white px-1">{this.t('agent')}</span> : <></>}
							{assist === 1 ? <span style={{ borderRadius: "15%/48%" }} className="bg-warning mr-1 text-white px-1">{this.t('sales')}</span> : <></>}
							{openweb === 1 ? <span style={{ borderRadius: "15%/48%" }} className="bg-info mr-1 text-white px-1">{this.t('publicSite')}</span> : <></>}
							{web === 1 ? <span style={{ borderRadius: "15%/48%" }} className="bg-primary text-white px-1">{this.t('internationSite')}</span> : <></>}
						</div>
					</div>
				</div>
			</div>
		);
	});
}
