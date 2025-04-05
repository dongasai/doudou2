# 战斗引擎实现要点

## 核心架构
1. **双端同步架构**:
   - 客户端(Phaser3): 负责表现层和输入采集
   - 服务端(Nodejs): 权威状态计算和指令验证
   - 通讯协议: Protobuf二进制协议

2. **类设计**:
   ```typescript
   // 客户端
   class BattleScene extends Phaser.Scene {
     battleManager: BattleManager;
     // 渲染和输入处理
   }

   // 服务端
   class BattleEngine {
     state: BattleState;
     processFrame(commands: Command[]): void;
   }
   ```

## 关键实现
1. **帧同步机制**:
   - 固定10fps逻辑帧率
   - 每帧状态序列化传输
   - 客户端预测+服务器回滚

2. **指令处理**:
   ```typescript
   // 指令类型
   interface Command {
     type: 'learn_skill' | 'change_position';
     frame: number; // 生效帧
     playerId: number;
     data: any;
   }
   ```

3. **状态管理**:
   - 使用确定性随机种子
   - 状态快照和回放支持
   - 断线重连机制

4. **同步策略**:
   - 关键帧全量同步
   - 非关键帧增量同步
   - 客户端预测移动

## 性能优化
1. 对象池管理战斗实体
2. 四叉树空间分区碰撞检测
3. 基于可见性的渲染优化
4. Protobuf压缩网络数据

## 调试支持
1. 帧同步日志记录
2. 状态校验码(CRC32)
3. 时间轴调试工具
4. 网络延迟模拟