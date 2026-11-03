/** Text the organization never lets out, whatever the model. Other sensitive values are masked by the saved policies. */
export function checkForbidden(text: string): string | null {
  if (/(کلید خصوصی|private key)/i.test(text)) {
    return "این پیام شامل کلید خصوصی است و طبق قوانین سازمان نباید فرستاده شود. آن را از پیام حذف کنید.";
  }
  return null;
}
