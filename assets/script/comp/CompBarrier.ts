import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Label, Node, randomRangeInt, RigidBody2D } from 'cc';
import { BarrierType, BoxTag } from '../game/Enums';
import { Game } from '../game/Game';
const { ccclass, property } = _decorator;

@ccclass('CompBarrier')
export class CompBarrier extends Component {

    @property({ type: BarrierType })
    type: BarrierType = BarrierType.BALL;

    private spr: Node = null;
    private text: Label = null;
    private body: RigidBody2D = null;
    private collider: Collider2D = null;

    private game: Game = null;

    private _num: number = 0;
    private get num(): number {
        return this._num;
    }
    private set num(v: number) {
        this._num = v;
        this.text && (this.text.string = v.toString());
    }

    protected start(): void {
        this.spr = this.node.getChildByName('spr');
        this.text = this.spr.getComponentInChildren(Label);
        this.body = this.getComponent(RigidBody2D);
        this.collider = this.getComponent(Collider2D);
        this.num = randomRangeInt(2, 8);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    protected onDestroy(): void {

        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this.num > 0 && otherCollider.tag == BoxTag.BALL) {
            this.num--;
            if (this.num <= 0) {
                this.recycle();
            }
        }
    }

    reuse(num: number) {
        this.node.active = true;
        this.num = num;
    }

    unuse() {
        this.node.active = false;
    }

    private recycle() {
        this.scheduleOnce(() => {
            // if (this.Game) {
            //     this.Game.unUseBall(this.node);
            // } else {
            this.node.destroy();
            // }
        }, 0);
    }

}


