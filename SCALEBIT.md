## UPR-1 Lack of Actual Token Amount Verification in UnitasProxy

- `UnitasProxy` 调用的铸造/赎回逻辑由**受控且可信**的 `UnitasMintingV2` 执行。
- 在 `UnitasMintingV2` 中，输出数量**明确由订单字段决定**，并直接对 `order.beneficiary` 执行：
  - **Mint**：`usdu.mint(order.beneficiary, order.usdu_amount)`，因此 `order.usdu_amount` 即为铸造给 `order.beneficiary`（本场景为 Proxy 合约）的 USDu 数量。
  - **Redeem**：`_transferToBeneficiary(order.beneficiary, order.collateral_asset, order.collateral_amount)`，因此 `order.collateral_amount` 即为转给 `order.beneficiary`（本场景为 Proxy 合约）的抵押资产数量。
- `UnitasProxy` 在进入 `mintAndStake` / `redeemAndWithdraw` 前，已强制校验 `order.benefactor == address(this)` 且 `order.beneficiary == address(this)`，确保 `UnitasMintingV2` 的铸造/转账目标为 Proxy 合约地址。

基于以上约束，`UnitasProxy` 使用订单中的 `usdu_amount` / `collateral_amount` 进行后续 `staked.deposit` 或 `safeTransfer` 的行为，与 `UnitasMintingV2` 的实际结算是一致的，因此不需要额外校验“实际到账数量”。

## UPR-2 Discussion on Shared Nonce Namespace for UnitasProxy

- nonce 的生成与管理由我们的**中心化签名/撮合服务**统一负责，针对 Proxy 地址维护**全局唯一且单调/不复用**的 nonce（或确保不同业务类型使用互斥的 nonce 区间），因此不会出现 Mint 与 Redeem 之间 nonce 冲突。
- 即使不同用户发起的订单，也不会共享 nonce；服务端会保证同一 Proxy 地址下的 nonce 全局去重。

## UPR-3 Centralization Risks in UnitasProxy

这几个权限地址要么是 多签 地址，要么是 tee 环境的执行者，一般不会出问题

## UPR-4 Unrestricted Upgradeability Allows Immediate Malicious Logic Replacement

后续会将ProxyAdmin 转入多签地址