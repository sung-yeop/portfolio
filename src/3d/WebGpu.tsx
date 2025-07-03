'use client'

import { useEffect, useRef, useState } from 'react'
import { useWebGpuSetting } from './useWebGpuSetting'

export default function WebGpu() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const {
    message,
    requestAdapter,
    requestDevice,
    createContext,
    contextConfig,
  } = useWebGpuSetting()
  const [adapter, setAdapter] = useState<GPUAdapter>()
  const [device, setDevice] = useState<GPUDevice>()
  const [context, setContext] = useState<GPUCanvasContext>()

  const handleSetting = async () => {
    try {
      const adapter = await requestAdapter()
      setAdapter(adapter)
      const device = await requestDevice(adapter)
      setDevice(device)
      const context = createContext({ ref: canvasRef })
      setContext(context)
      contextConfig({ context, device })

      renderWithParams(adapter, device, context)
    } catch (error) {
      console.error('WebGPU 초기화 실패 : ', error)
    }
  }

  const vertexShader = () => {
    return `
    @vertex
    fn vs_main(@location(0) position: vec2f) -> @builtin(position) vec4f {
      return vec4f(position, 0.0, 1.0); 
    }`
  }

  const fragmentShader = () => {
    return `
      @group(0) @binding(0) var<uniform> time: f32;

      @fragment
      fn fs_main() -> @location(0) vec4f {
        return vec4f(sin(time), cos(time), 0.5, 1.0);
      }
    `
  }

  const triangleVertices = new Float32Array([0.0, 0.8, -0.8, -0.8, 0.8, -0.8])

  const createVertexBuffer = (device: GPUDevice) => {
    const buffer = device.createBuffer({
      size: triangleVertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    })
    device.queue.writeBuffer(buffer, 0, triangleVertices)
    return buffer
  }

  const createUniformBuffer = (device: GPUDevice) => {
    const buffer = device.createBuffer({
      size: 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })
    return buffer
  }

  const createBindGroup = (
    device: GPUDevice,
    pipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer
  ) => {
    return device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: uniformBuffer,
          },
        },
      ],
    })
  }

  const createRenderPipeline = (device: GPUDevice) => {
    const vertexModule = device.createShaderModule({
      code: vertexShader(),
    })
    const fragmentModule = device.createShaderModule({
      code: fragmentShader(),
    })

    return device.createRenderPipeline({
      vertex: {
        module: vertexModule,
        entryPoint: 'vs_main',
        buffers: [
          {
            arrayStride: 8,
            attributes: [
              {
                format: 'float32x2',
                offset: 0,
                shaderLocation: 0,
              },
            ],
          },
        ],
      },
      fragment: {
        module: fragmentModule,
        entryPoint: 'fs_main',
        targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
      },
      primitive: {
        topology: 'triangle-list',
      },
      layout: 'auto',
    })
  }

  const renderWithParams = (
    adapter: GPUAdapter,
    device: GPUDevice,
    context: GPUCanvasContext
  ) => {
    console.log('Rendering with params:', { adapter, device, context })

    const encoder = device.createCommandEncoder()
    const buffer = createVertexBuffer(device)
    const uniformBuffer = createUniformBuffer(device)
    const pipeline = createRenderPipeline(device)
    const bindGroup = createBindGroup(device, pipeline, uniformBuffer)
    const renderPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          clearValue: { r: 0.2, g: 0.2, b: 0.8, a: 1 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    })
    renderPass.setPipeline(pipeline)
    renderPass.setBindGroup(0, bindGroup)
    renderPass.setVertexBuffer(0, buffer)
    renderPass.draw(3)
    renderPass.end()
    device.queue.submit([encoder.finish()])
  }

  const render = () => {
    console.log('Render called:', { adapter, device, context })
    if (!adapter || !device || !context) {
      console.error('Missing:', {
        adapter: !!adapter,
        device: !!device,
        context: !!context,
      })
      return null
    }
    renderWithParams(adapter, device, context)
  }

  useEffect(() => {
    handleSetting()
  }, [])

  return (
    <div className='border-amber-200 border rounded-md'>
      <canvas ref={canvasRef} width={800} height={600} />
      {message}
    </div>
  )
}
