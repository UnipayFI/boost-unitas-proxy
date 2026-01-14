## UPR-1 Lack of Actual Token Amount Verification in UnitasProxy

- The mint/redeem logic invoked by `UnitasProxy` is executed by the **controlled and trusted** `UnitasMintingV2` contract.
- In `UnitasMintingV2`, the output amounts are **explicitly determined by the order fields** and applied directly to `order.beneficiary`:
  - **Mint**: `usdu.mint(order.beneficiary, order.usdu_amount)`, therefore `order.usdu_amount` is exactly the amount of USDu minted to `order.beneficiary` (which is the proxy contract in this context).
  - **Redeem**: `_transferToBeneficiary(order.beneficiary, order.collateral_asset, order.collateral_amount)`, therefore `order.collateral_amount` is exactly the amount of collateral transferred to `order.beneficiary` (the proxy contract in this context).
- Before entering `mintAndStake` / `redeemAndWithdraw`, `UnitasProxy` enforces `order.benefactor == address(this)` and `order.beneficiary == address(this)`, ensuring that the minting/transfer target in `UnitasMintingV2` is always the proxy contract address.

Given the above constraints, when `UnitasProxy` uses `usdu_amount` / `collateral_amount` from the order to perform subsequent `staked.deposit` or `safeTransfer` operations, its behavior is consistent with the actual settlement performed by `UnitasMintingV2`. Therefore, additional checks on the “actual received amounts” are not necessary.

## UPR-2 Discussion on Shared Nonce Namespace for UnitasProxy

- Nonce generation and management is handled by our **centralized signing/matching service**, which maintains a **globally unique and monotonic (non-reused)** nonce namespace for each proxy address (or uses mutually exclusive nonce ranges for different business types). This prevents nonce conflicts between Mint and Redeem flows.
- Even when orders are initiated by different users, they do not share nonces. The backend service guarantees global de-duplication of nonces for the same proxy address.

## UPR-3 Centralization Risks in UnitasProxy

These privileged addresses are either multi-signature wallets or executors running in a TEE environment. Under normal circumstances, they are not expected to be compromised.

## UPR-4 Unrestricted Upgradeability Allows Immediate Malicious Logic Replacement

We plan to transfer the ownership of the ProxyAdmin contract to a multi-signature wallet in a subsequent phase.
