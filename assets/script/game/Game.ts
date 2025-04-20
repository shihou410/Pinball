import { _decorator, Component, Contact2DType, ERigidBody2DType, EventTouch, Input, input, instantiate, math, Node, NodePool, Prefab, randomRangeInt, resources, RigidBody2D, v2, Vec2, Vec3 } from 'cc';
import { CompBarrier } from '../comp/CompBarrier';
import { CompBall } from '../comp/CompBall';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {

    private instance: Node = null;
    private allow: Node = null;

    private ballPool: NodePool = null;
    private barrierPool: NodePool = null;

    /** 小球初始速度 */
    private ballSpeed: number = 80;

    /** 小球数量 */
    private ballCount: number = 3;

    start() {

        this.instance = this.node.getChildByName('instance');
        this.allow = this.node.getChildByName('allow');

        this.ballPool = new NodePool(CompBall);
        this.barrierPool = new NodePool(CompBarrier);

        input.on(Input.EventType.TOUCH_START, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.initBallPool(20);

    }

    private initBallPool(count: number) {
        let ballprefab = resources.get('prefab/GameBall') as Prefab;
        for (let i = 0; i < count; i++) {
            let node = instantiate(ballprefab);
            this.ballPool.put(node);
        }
    }

    private clearBallPool() {
        let node = this.ballPool.get();
        while (node) {
            node.destroy();
            node = this.ballPool.get();
        }
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_START, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.clearBallPool();
    }

    private onTouchMove(e: EventTouch) {
        let r = Math.atan2(e.getLocation().y - this.allow.worldPosition.y, e.getLocation().x - this.allow.worldPosition.x);
        this.allow.angle = math.toDegree(r);
    }

    private onTouchEnd(e: EventTouch) {
        let pos = e.getLocation();
        let dir = v2(pos.x - this.allow.worldPosition.x, pos.y - this.allow.worldPosition.y).normalize();

        console.log(dir.x, dir.y);
        this.emitBall(this.ballCount, dir);
    }

    /** 发球 */
    private emitBall(count: number, direction: Vec2) {
        for (let i = 0; i < count; i++) {
            this.scheduleOnce(() => {
                this.createrBall(direction.clone());
            }, i * 0.05);
        }
    }

    /** 创建一个球 */
    createrBall(dir: Vec2) {
        let node = this.ballPool.get(this);
        if (!node) {
            this.initBallPool(20);
            node = this.ballPool.get(this);
        }

        this.instance.addChild(node);
        node.worldPosition = this.allow.worldPosition.clone();
        let body = node.getComponent(RigidBody2D);
        body.type = ERigidBody2DType.Dynamic;
        body.linearVelocity = dir.multiplyScalar(this.ballSpeed);
    }

    /** 回收球 */
    public unUseBall(ball: Node) {
        this.ballPool.put(ball);
    }

}


