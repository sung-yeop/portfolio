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
    const groundGeometry = new THREE.PlaneGeometry(2000, 2000)
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 'green' })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -10
    return ground
  }
}
