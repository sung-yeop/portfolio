'use client'

import * as THREE from 'three'

export class CreateObject {
  static createMainCharacter() {
    const sphereGeometry = new THREE.SphereGeometry(10, 10, 10)
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 'blue' })
    const character = new THREE.Mesh(sphereGeometry, sphereMaterial)
    character.position.y = 0
    return character
  }

  static createGround() {
    const gridHelper = new THREE.GridHelper(2000, 100, 0x444444, 0x444444)
    gridHelper.position.y = -10
    return gridHelper
  }
}
