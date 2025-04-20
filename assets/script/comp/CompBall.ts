import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, RigidBody2D, v2, Vec2 } from 'cc';
import { BoxTag } from '../game/Enums';
import { Game } from '../game/Game';
const { ccclass, property } = _decorator;

@ccclass('CompBall')
export class CompBall extends Component {

    private body: RigidBody2D = null;
    private collider: Collider2D = null;

    private Game: Game = null;

    start() {
        this.body = this.getComponent(RigidBody2D);
        this.collider = this.getComponent(Collider2D);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    protected onDestroy(): void {
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (!this.node.active) return;

        if ((otherCollider.tag === BoxTag.BARRIER || otherCollider.tag === BoxTag.WALL) && contact) {

            const worldManifold = contact.getWorldManifold();
            const normal = worldManifold.normal; // 碰撞法线（单位向量）
            const velocity = this.body.linearVelocity.clone(); // 一定要 clone！

            // 如果速度过小就不反弹，防止除0或卡死
            if (velocity.length() < 0.01) return;

            // 计算反射向量 r = v - 2*(v·n)*n
            const dot = velocity.dot(normal);
            let reflect = velocity.subtract(normal.clone().multiplyScalar(2 * dot));

            // ======== 角度矫正 =========
            const minAngle = 10; // 最小角度（度）
            const angle = Math.atan2(reflect.y, reflect.x) * 180 / Math.PI;

            const speed = velocity.length(); // 保留原速度大小

            if (Math.abs(angle) < minAngle || Math.abs(angle) > (180 - minAngle)) {
                // 太水平
                const signY = reflect.y >= 0 ? 1 : -1;
                reflect.y = Math.tan(minAngle * Math.PI / 180) * Math.abs(reflect.x) * signY;
            } else if (Math.abs(Math.abs(angle) - 90) < minAngle) {
                // 太垂直
                const signX = reflect.x >= 0 ? 1 : -1;
                reflect.x = Math.tan(minAngle * Math.PI / 180) * Math.abs(reflect.y) * signX;
            }

            // 归一后乘回原速度
            reflect = reflect.normalize().multiplyScalar(speed);

            this.body.linearVelocity = reflect;
        }

        if (otherCollider.tag === BoxTag.GROUND) {
            this.recycle();
        }
    }

    reuse(data) {
        this.Game = data[0];
        this.node.active = true;
    }

    unuse() {
        this.node.active = false;
    }

    /** 回收 */
    private recycle() {
        this.body.linearVelocity = Vec2.ZERO;
        this.scheduleOnce(() => {
            if (this.Game) {
                this.Game.unUseBall(this.node);
            } else {
                this.node.destroy();
            }
        }, 0);
    }

}
