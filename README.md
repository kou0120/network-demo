# 交互式网络图生成器 (Network Demo)

这是一个基于 D3.v5 开发的交互式网络图生成器，支持上传 JSON 文件并实时渲染。

[![Netlify Status](https://api.netlify.com/api/v1/badges/4a4566e4-aa78-4f89-b494-194b459f1955/deploy-status)](https://app.netlify.com/projects/network-d3-demo/deploys)

[Live Demo on Netlify](https://network-d3-demo.netlify.app)

## 功能特点
- **JSON 文件上传**：通过上传按钮选择本地 JSON 文件。
- **实时交互**：支持节点拖拽交互。
- **自定义配置**：
  - 支持切换不同的节点配色方案（NPG, NEJM, JAMA 等）。
  - 支持切换连线配色方案（BrBG, PiYG 等）。
  - 支持动态调整 Top N 节点过滤显示。

## 数据格式
JSON 文件需要包含 `nodes` 和 `links` 数组。
```json
{
  "nodes": [
    { "id": "Node1", "group": "GroupA", "value": 10, "sort": 1 },
    ...
  ],
  "links": [
    { "source": "Node1", "target": "Node2", "value": 0.8 },
    ...
  ]
}
```
Network graph using D3
