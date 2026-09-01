import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const personas: Record<string, { name: string; role: string; channel: string; kind: string }> = {
  sonny: {
    name: "سِراج",
    role: "مدير السوشيال ميديا — يخطط المحتوى، يكتب المنشورات، ويجدول النشر.",
    channel: "instagram",
    kind: "منشور",
  },
  eva: {
    name: "أمَل",
    role: "المساعدة التنفيذية — تفرز البريد، ترتّب المواعيد، وتكتب الردود.",
    channel: "gmail",
    kind: "رد بريد",
  },
  sam: {
    name: "سالم",
    role: "مسؤول المبيعات — يبحث عن العملاء المحتملين ويكتب تسلسلات التواصل.",
    channel: "linkedin",
    kind: "رسالة تواصل",
  },
  nour: {
    name: "نور",
    role: "كاتب المحتوى وتحسين محركات البحث — مقالات وكلمات مفتاحية.",
    channel: "wordpress",
    kind: "مقال",
  },
  dana: {
    name: "دانة",
    role: "المصممة — أفكار بصرية ونصوص إعلانية للتصاميم.",
    channel: "canva",
    kind: "تصميم",
  },
  adam: {
    name: "آدم",
    role: "محلل البيانات — تقارير أداء وتوصيات رقمية.",
    channel: "analytics",
    kind: "تقرير",
  },
};

type Deliverable = {
  title?: string;
  kind?: string;
  channel?: string;
  body?: string;
  scheduled?: string;
};

const input = z.object({
  workspaceId: z.string().uuid(),
  employeeId: z.string().min(1),
  message: z.string().min(1).max(4000),
});

export const askEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => input.parse(data))
  .handler(async ({ data, context }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("مفتاح خدمة الذكاء الاصطناعي غير مهيأ.");

    const supabase = context.supabase;
    const persona = personas[data.employeeId];
    if (!persona) throw new Error("موظف غير معروف.");

    const [{ data: workspace }, { data: brain }, { data: history }] = await Promise.all([
      supabase.from("workspaces").select("*").eq("id", data.workspaceId).maybeSingle(),
      supabase.from("brain_items").select("title, body, kind").eq("workspace_id", data.workspaceId),
      supabase
        .from("messages")
        .select("role, body")
        .eq("workspace_id", data.workspaceId)
        .eq("employee_id", data.employeeId)
        .order("created_at", { ascending: false })
        .limit(12),
    ]);

    if (!workspace) throw new Error("مساحة العمل غير موجودة.");

    const { error: insertUserError } = await supabase.from("messages").insert({
      workspace_id: data.workspaceId,
      employee_id: data.employeeId,
      role: "user",
      body: data.message,
    });
    if (insertUserError) throw new Error(insertUserError.message);

    const brainText = (brain ?? [])
      .map((b) => `- [${b.kind}] ${b.title}${b.body ? `: ${b.body}` : ""}`)
      .join("\n");

    const system = [
      `أنت ${persona.name}، ${persona.role}`,
      `تعمل داخل منصة «سهل» لصالح العلامة: ${workspace.name} (${workspace.industry}).`,
      `نبرة العلامة: ${workspace.tone}.`,
      workspace.banned_words?.length
        ? `كلمات ممنوعة تماماً: ${workspace.banned_words.join("، ")}.`
        : "",
      brainText ? `معرفة العلامة:\n${brainText}` : "",
      "أجب دائماً بالعربية وبإيجاز عملي.",
      'أعد ردك بصيغة JSON فقط بالشكل: {"reply": "نص ردك للمستخدم", "deliverable": {"title": "عنوان المخرج", "kind": "نوع المخرج", "channel": "المنصة", "body": "نص المخرج الجاهز", "scheduled": "متى يُنفّذ"} }',
      'إن لم يطلب المستخدم مخرجاً جاهزاً للنشر أو الإرسال، اجعل "deliverable" القيمة null.',
      `المنصة الافتراضية لك هي ${persona.channel} ونوع مخرجك الشائع ${persona.kind}.`,
    ]
      .filter(Boolean)
      .join("\n");

    const priorMessages = (history ?? [])
      .slice()
      .reverse()
      .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.body }));

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          ...priorMessages,
          { role: "user", content: data.message },
        ],
      }),
    });

    if (res.status === 429) throw new Error("تجاوزت حد الاستخدام مؤقتاً — حاول بعد قليل.");
    if (res.status === 402) throw new Error("رصيد الذكاء الاصطناعي غير كافٍ — أضف رصيداً للمتابعة.");
    if (!res.ok) throw new Error(`تعذّر توليد الرد (${res.status}).`);

    const payload = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = payload.choices?.[0]?.message?.content ?? "";

    let reply = raw;
    let deliverable: Deliverable | null = null;

    try {
      const parsed = JSON.parse(raw) as { reply?: string; deliverable?: Deliverable | null };
      if (parsed.reply) reply = parsed.reply;
      deliverable = parsed.deliverable ?? null;
    } catch {
      deliverable = null;
    }

    const { data: assistantRow, error: assistantError } = await supabase
      .from("messages")
      .insert({
        workspace_id: data.workspaceId,
        employee_id: data.employeeId,
        role: "assistant",
        body: reply,
      })
      .select()
      .single();
    if (assistantError) throw new Error(assistantError.message);

    let createdTaskId: string | null = null;
    if (deliverable?.title && deliverable.body) {
      const { data: task } = await supabase
        .from("tasks")
        .insert({
          workspace_id: data.workspaceId,
          employee_id: data.employeeId,
          title: deliverable.title,
          detail: reply.slice(0, 400),
          kind: deliverable.kind ?? persona.kind,
          channel: deliverable.channel ?? persona.channel,
          status: "review",
          output: deliverable.body,
          scheduled: deliverable.scheduled ?? "بانتظار اعتمادك",
          steps: [
            { label: "فهم الطلب", state: "done" },
            { label: "التنفيذ", state: "done" },
            { label: "مراجعتك", state: "active" },
            { label: "النشر", state: "todo" },
          ],
        })
        .select("id")
        .single();
      createdTaskId = task?.id ?? null;
    }

    return { reply, messageId: assistantRow.id, createdTaskId };
  });
