import { LaserBeam } from "../classes/laser-beam";
import AssetManager from "./asset-manager";
import DeathStarManager from "./death-star-manager";
import GameManager from "./game-manager";

export class LaserManager {
    static laserBeams: LaserBeam[] = [];

    static fireLaser = (): void => {

        if (GameManager.isPaused || !AssetManager.flyCamera || !AssetManager.scene) return;

        LaserManager.laserBeams.push(new LaserBeam(AssetManager.flyCamera, AssetManager.scene, (laserBeam) => {
            GameManager.isPaused = true;

            LaserManager.laserBeams.forEach((lb) => {
                lb.laserMesh.dispose();
            });

            LaserManager.laserBeams = [];
            DeathStarManager.blowUp();

            if (AssetManager.explosionSound) {

                const explosionSoundEnded = () => {
                    if (AssetManager.outroAudio) {
                        if (!GameManager.isDeveloperMode) {
                            AssetManager.outroAudio.play(1);
                        } else {
                            AssetManager.outroAudio.play(0, 0, 1);
                        }
                    }

                    GameManager.isPaused = true;
                    GameManager.letGoOfPointer();
                };

                AssetManager.explosionSound.onended = explosionSoundEnded;
            }

            AssetManager.explosionSound?.play();
        }));
    };

    static removeLaser = (laser: LaserBeam): void => {
        const laserIndex: number = LaserManager.laserBeams.indexOf(laser);
        if (laserIndex > -1) {
            LaserManager.laserBeams.splice(laserIndex, 1);
        }
    };

    static advanceLaserBeamPositions = (): void => {
        LaserManager.laserBeams.forEach((lb) => {
            if (lb.laserMesh) {
                lb.advanceBeamPosition();
            }
        });
    };
}