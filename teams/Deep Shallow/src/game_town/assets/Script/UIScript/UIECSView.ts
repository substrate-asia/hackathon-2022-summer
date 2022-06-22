import UIECSView_Auto from "../AutoScripts/UIECSView_Auto";
import FormMgr from "../UIFrame/FormMgr";
import { UIScreen } from "../UIFrame/UIForm";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIECSView extends UIScreen {

    view: UIECSView_Auto;
    // onLoad () {}

    start () {
        this.view.Back.addClick(() => {
            FormMgr.backScene();
        }, this);

    }

    // update (dt) {}
}
