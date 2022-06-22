
import ButtonPlus from "./../Common/Components/ButtonPlus"

const {ccclass, property} = cc._decorator;
@ccclass
export default class UIGame_Auto extends cc.Component {
	@property(ButtonPlus)
	Back: ButtonPlus = null;

	@property(ButtonPlus)
    GuideNode: ButtonPlus=null;

	@property(cc.Label)
    LblTip: cc.Label=null;

	@property(cc.Node)
    guidNode: cc.Node=null;

	@property(ButtonPlus)
    toMap: ButtonPlus=null;

	@property(cc.Node)
    items: cc.Node=null;

	@property(cc.Node)
    buldtool: cc.Node=null;
 
}