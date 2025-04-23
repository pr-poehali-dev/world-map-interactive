/// <reference types="vite/client" />

declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, Object3D } from 'three';

  export class OrbitControls {
    constructor(camera: Camera, domElement: HTMLElement);
    update(): void;
    addEventListener(type: string, listener: (event: any) => void): void;
    removeEventListener(type: string, listener: (event: any) => void): void;
    dispose(): void;
    enableDamping: boolean;
    dampingFactor: number;
    rotateSpeed: number;
    minDistance: number;
    maxDistance: number;
    target: Object3D;
  }
}
