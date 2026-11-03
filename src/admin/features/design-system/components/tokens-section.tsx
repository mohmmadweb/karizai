import { PreviewGroup, PreviewSection } from "./preview-section";
import { TokenColorGrid } from "./token-color-grid";
import { TokenScales } from "./token-scales";

export function TokensSection() {
  return (
    <PreviewSection
      id="tokens"
      title="توکن‌ها"
    >
      <PreviewGroup title="رنگ‌های معنایی و وضعیت، همراه با کنتراست">
        <TokenColorGrid />
      </PreviewGroup>
      <TokenScales />
    </PreviewSection>
  );
}
