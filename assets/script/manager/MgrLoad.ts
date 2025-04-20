import { Asset, AudioClip, Prefab, resources, SpriteFrame } from "cc";

export default class MgrLoad {


    /**
     * 加载通用资源
     * @param path 资源路径（resources 文件夹下的相对路径）
     */
    static load<T extends Asset>(path: string): Promise<T> {
        return new Promise((res, rej) => {
            resources.load(path, (err, asset: T) => {
                if (err) {
                    console.error(`资源加载失败: ${path}`, err);
                    rej(err);
                    return;
                }
                res(asset);
            });
        });
    }

    static loadDir<T extends Asset>(path: string): Promise<T[]> {

        return new Promise((res, rej) => {
            resources.loadDir(path, (err, data) => {
                if (err) {
                    rej(err);
                    return;
                }
                res(data as T[]);
            });
        });

    }


    /**
     * 加载 prefab 预制体
     * @param path prefab 的路径
     */
    static loadPrefab(path: string): Promise<Prefab> {
        return this.load<Prefab>(path);
    }

    /**
     * 加载 spriteFrame 精灵帧
     * @param path spriteFrame 的路径
     */
    static loadSpriteFrame(path: string): Promise<SpriteFrame> {
        return this.load<SpriteFrame>(path);
    }

    /**
     * 加载 audioClip 音频
     * @param path audioClip 的路径
     */
    static loadAudioClip(path: string): Promise<AudioClip> {
        return this.load<AudioClip>(path);
    }


}

