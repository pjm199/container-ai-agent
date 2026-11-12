import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { SUGGESTED_QUESTIONS, replyTo, type AssistantReply } from "@/demo/assistant"
import { useDemo } from "@/demo/demo-context"
import { Panel, SectionHeading } from "@/components/demo-visuals"

type Turn = { question: string; reply: AssistantReply }

export function AssistantPage() {
  const demo = useDemo()
  const [draft, setDraft] = useState("")
  const [turns, setTurns] = useState<Turn[]>([])
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const thread = threadRef.current
    if (!thread) {
      return
    }
    thread.scrollTop = thread.scrollHeight
  }, [turns])

  function ask(question: string) {
    const text = question.trim()
    if (!text) {
      return
    }
    setTurns((current) => [...current, { question: text, reply: replyTo(text, demo.quotes) }])
    setDraft("")
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b px-4 py-3 md:px-6 md:py-5">
        <SectionHeading
          eyebrow="Demo mode — scripted responses, not a live model"
          title="AI business assistant"
          description="Answers are prepared from the sample book. Nothing is sent to an external model."
        />
      </div>
      <div ref={threadRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3 md:px-6" aria-live="polite">
        <div className="flex flex-col gap-2">
          {SUGGESTED_QUESTIONS.map((question) => (
            <button key={question} type="button" className="min-h-11 border bg-card px-3 py-2 text-left text-sm text-pretty hover:bg-muted" onClick={() => ask(question)}>
              {question}
            </button>
          ))}
        </div>
        {turns.length === 0 ? <p className="text-sm text-muted-foreground">Choose a suggested question to see a table, a recommendation and a link into the product.</p> : null}
        {turns.map((turn, index) => (
          <div key={`${turn.question}-${index}`} className="space-y-2">
            <p className="ml-8 rounded-lg bg-muted px-3 py-2 text-sm text-pretty">{turn.question}</p>
            <Panel title={turn.reply.title}>
              <p className="text-sm text-pretty">{turn.reply.narrative}</p>
              {turn.reply.columns && turn.reply.rows ? (
                <div className="mt-3 min-w-0">
                  <table className="data-cards w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground uppercase">
                        {turn.reply.columns.map((column) => <th key={column} className="py-1 pr-3">{column}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {turn.reply.rows.map((row) => (
                        <tr key={row.join("|")} className="border-b last:border-b-0">
                          {row.map((cell, cellIndex) => (
                            <td key={`${cell}-${cellIndex}`} className="py-1 pr-3" data-label={turn.reply.columns?.[cellIndex] ?? ""}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              <p className="mt-3 text-sm text-pretty">{turn.reply.recommendation}</p>
              {turn.reply.href ? <Link className="mt-3 inline-flex min-h-11 items-center text-sm underline-offset-4 hover:underline" to={turn.reply.href.to}>{turn.reply.href.label}</Link> : null}
              <p className="mt-3 text-xs text-muted-foreground">{turn.reply.scope}</p>
              <p className="mt-1 text-xs text-muted-foreground">Scripted demo response. No model is connected.</p>
            </Panel>
          </div>
        ))}
      </div>
      <form
        className="shrink-0 border-t bg-background px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6"
        onSubmit={(event) => {
          event.preventDefault()
          ask(draft)
        }}
      >
        <div className="flex items-end gap-2">
          <input
            aria-label="Ask the demo assistant"
            className="min-h-11 min-w-0 flex-1 border bg-card px-3 text-base outline-none focus-visible:border-ring md:text-sm"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about the sample book"
            enterKeyHint="send"
          />
          <button type="submit" className="min-h-11 shrink-0 bg-primary px-4 text-base text-primary-foreground md:text-sm">Ask</button>
        </div>
      </form>
    </div>
  )
}
