import { Enum } from "cc";

export enum BarrierType {
    BALL = 0,
    CIRCLE,
    POLYGON3,
    POLYGON4,
    POLYGON5,
};
Enum(BarrierType);

export enum BoxTag {
    BALL = 0,
    WALL = 1,
    GROUND = 2,
    BARRIER = 3,
}


