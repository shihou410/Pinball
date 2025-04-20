import { _decorator, Component, instantiate, Node, Prefab, resources } from 'cc';
import MgrLoad from './manager/MgrLoad';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    game: Node = null;

    start() {
        this.game = this.node.getChildByName('Game');

        this.LoadRes();
    }

    async LoadRes() {
        let arr = await MgrLoad.loadDir('prefab');
        console.log(arr);
        resources.load('scene/GameScene', (err, prefab: Prefab) => {
            if (err) {
                console.error(err);
                return;
            }
            let scene: Node = instantiate(prefab);
            this.game.addChild(scene);
        });
    }


}


