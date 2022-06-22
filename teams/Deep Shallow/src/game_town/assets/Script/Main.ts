import UIConfig from "./UIConfig";
import FormMgr from "./UIFrame/FormMgr";
import UINavigator from "./UIScript/UINavigator";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    
    onLoad() {

    }

    start () {
        // UINavigator.open();
        FormMgr.open(UIConfig.UIHome);
    }
    
    onDestroy() {
        
    }
}