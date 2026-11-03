import { apiBase, type Endpoint } from "../data/endpoints";

export type SnippetLanguage = "curl" | "python" | "javascript";

const sampleKey = "kz_live_xxxxxxxxxxxxxxxx";

function samplePath(endpoint: Endpoint) {
  return endpoint.path.replace("{agent_id}", "agent-quality").replace("{workflow_id}", "wf-6");
}

/** A ready-to-copy call of one endpoint. */
export function snippet(endpoint: Endpoint, language: SnippetLanguage): string {
  const url = `${apiBase}${samplePath(endpoint)}`;
  const body = endpoint.request ? JSON.stringify(endpoint.request, null, 2) : "";
  if (language === "curl") {
    return [`curl -X ${endpoint.method} "${url}" \\`, `  -H "Authorization: Bearer ${sampleKey}" \\`, `  -H "Content-Type: application/json"${body ? " \\" : ""}`, ...(body ? [`  -d '${JSON.stringify(endpoint.request)}'`] : [])].join("\n");
  }
  if (language === "python") {
    return [
      "import os, requests",
      "",
      `resp = requests.${endpoint.method.toLowerCase()}(`,
      `    "${url}",`,
      '    headers={"Authorization": f"Bearer {os.environ[\'KARIZ_API_KEY\']}"},',
      ...(body ? [`    json=${body.replace(/\n/g, "\n    ")},`] : []),
      "    timeout=60,",
      ")",
      "resp.raise_for_status()",
      "print(resp.json())",
    ].join("\n");
  }
  return [
    `const resp = await fetch("${url}", {`,
    `  method: "${endpoint.method}",`,
    "  headers: {",
    "    Authorization: `Bearer ${process.env.KARIZ_API_KEY}`,",
    '    "Content-Type": "application/json",',
    "  },",
    ...(body ? [`  body: JSON.stringify(${body.replace(/\n/g, "\n  ")}),`] : []),
    "});",
    "console.log(await resp.json());",
  ].join("\n");
}

export const sdkExamples: { id: string; title: string; language: string; install: string; code: string }[] = [
  {
    id: "python", title: "Python", language: "python", install: "pip install kariz",
    code: `from kariz import Kariz

client = Kariz()  # کلید از KARIZ_API_KEY خوانده می‌شود

# پرسش از عامل کیفیت
run = client.agents.run("agent-quality", input="علت مردودی بچ B-1405-212؟")
print(run.output, run.sources)

# جست‌وجو در دانش سازمانی
for hit in client.knowledge.search("QC-SOP-07 نمونه‌برداری", top_k=3):
    print(hit.document, hit.score)

# شروع جریان سفارش مواد و منتظر ماندن برای نتیجه
result = client.workflows.trigger("wf-6").wait()
print(result.status)`,
  },
  {
    id: "javascript", title: "JavaScript / TypeScript", language: "javascript", install: "npm install @kariz/sdk",
    code: `import { Kariz } from "@kariz/sdk";

const kariz = new Kariz({ apiKey: process.env.KARIZ_API_KEY });

const reply = await kariz.chat.completions.create({
  model: "auto",
  messages: [{ role: "user", content: "خلاصه‌ی شیفت شب خط ۲" }],
});
console.log(reply.choices[0].message.content);

// تأیید امضای webhook
const ok = kariz.webhooks.verify(rawBody, req.headers["x-kariz-signature"], process.env.KARIZ_WEBHOOK_SECRET);`,
  },
  {
    id: "webhook", title: "دریافت webhook (Python / Flask)", language: "python", install: "pip install kariz flask",
    code: `from flask import Flask, request, abort
from kariz.webhooks import verify

app = Flask(__name__)

@app.post("/hooks/kariz")
def kariz_hook():
    if not verify(request.data, request.headers["X-Kariz-Signature"], SECRET):
        abort(401)
    event = request.json
    if event["type"] == "run.completed":
        print("جریان تمام شد:", event["run_id"])
    return "", 204`,
  },
];
