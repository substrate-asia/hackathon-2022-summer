import UIGame_Auto from "../AutoScripts/UIGame_Auto";
import { GuideConfig } from "../config/GuideConfig";
import UIConfig from "../UIConfig";
import FormMgr from "../UIFrame/FormMgr";
import { UIScreen } from "../UIFrame/UIForm";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIGame extends UIScreen {


    view: UIGame_Auto;
    // onLoad () {}

    start () {
        this.view.Back.addClick(() => {
            FormMgr.backScene();
        }, this);

        this.view.toMap.addClick(() => {
            FormMgr.open(UIConfig.UIECSView);
        }, this);


        this.view.GuideNode.addClick(this.onBtnGuide.bind(this),this);
        this.onBtnGuide(); 


        for (let index = 1; index < 14; index++) {
            // const element = array[index];
            let key = "jianzhu"
            if(index<10){
                key = key+"0"+index
            }else{
                key = key+index
            }
            let ksp = cc.sys.localStorage.getItem(key)
            let sp = this.view.items.getChildByName(key)
            if(ksp==null){
                sp.getComponent(cc.Sprite).enabled = false;
            }else{
                sp.getComponent(cc.Sprite).enabled = true;
            }
        }
    }

    onBtnGuide(){
        let guideIdx = cc.sys.localStorage.getItem("guidxIdx")
        if(guideIdx==null){
            cc.sys.localStorage.setItem("guidxIdx",0);
            guideIdx = 0;
        }
        let txt = GuideConfig[Number(guideIdx)];
        if(txt != null){
           this.view.LblTip.string = txt;
           ++guideIdx;
           cc.sys.localStorage.setItem("guidxIdx",guideIdx);
        }else{
            this.view.guidNode.active = false;
        }
    }

    onBuildItem(ev, dat){
        let target = ev.target;
        // console.log(target)
        let key = target.name;
        let ksp = cc.sys.localStorage.getItem(key)
        if(ksp==null){
            this.view.buldtool.active = true;
            this.view.buldtool.position = target.position;
            this.view.buldtool.getComponent(cc.Animation).play();
            cc.tween(this.node)
            .delay(1.5)
            .call(()=>{
                this.view.buldtool.active = false;
                target.getComponent(cc.Sprite).enabled=true;
                cc.sys.localStorage.setItem(key,1);
            }).start();
        }
    }

    // update (dt) {}
}
