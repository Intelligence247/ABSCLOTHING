"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, RefreshCcw } from "lucide-react"
import { useAdminData } from "@/lib/admin-data-context"

export default function AdminMessagesPage() {
  const {
    contactMessages,
    contactMessagesLoading,
    contactMessagesError,
    refreshContactMessages,
    replyToContactMessage,
  } = useAdminData()
  const [draftReplies, setDraftReplies] = useState<Record<string, string>>({})
  const [replyingId, setReplyingId] = useState("")
  const [replyError, setReplyError] = useState("")

  const handleReply = async (id: string) => {
    const reply = (draftReplies[id] || "").trim()
    if (reply.length < 2) {
      setReplyError("Please enter a proper reply before sending.")
      return
    }
    setReplyError("")
    setReplyingId(id)
    try {
      await replyToContactMessage(id, reply)
      setDraftReplies((prev) => ({ ...prev, [id]: "" }))
    } catch (e) {
      setReplyError(e instanceof Error ? e.message : "Could not send reply.")
    } finally {
      setReplyingId("")
    }
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#1A1A1A] mb-2">Messages</h1>
          <p className="text-[#666666]">
            Contact form inbox. Replying here sends an email response to the customer.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refreshContactMessages()}
          className="inline-flex items-center gap-2 border border-[#E8E6E3] bg-white px-4 py-2 text-sm text-[#1A1A1A] hover:border-[#0A3D2E]"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </motion.div>

      {replyError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {replyError}
        </div>
      )}
      {contactMessagesError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {contactMessagesError}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-[#E8E6E3] p-6"
      >
        {contactMessagesLoading ? (
          <p className="text-[#666666]">Loading messages...</p>
        ) : contactMessages.length === 0 ? (
          <div className="text-center py-14">
            <Mail className="w-10 h-10 text-[#666666] mx-auto mb-3" />
            <p className="text-[#666666]">No contact messages yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contactMessages.map((m) => (
              <div key={m.id} className="border border-[#E8E6E3] rounded-lg p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-[#1A1A1A]">{m.subject}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      m.status === "replied"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {m.status === "replied" ? "Replied" : "New"}
                  </span>
                </div>
                <p className="text-sm text-[#666666] mb-1">
                  {m.name} ({m.email}) {m.phone ? `• ${m.phone}` : ""}
                </p>
                <p className="text-sm text-[#666666] mb-2">
                  {new Date(m.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-[#1A1A1A] whitespace-pre-wrap mb-3">{m.message}</p>
                {m.adminReply ? (
                  <div className="mb-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 whitespace-pre-wrap">
                    <strong>Sent reply:</strong> {m.adminReply}
                  </div>
                ) : null}
                <textarea
                  value={draftReplies[m.id] ?? ""}
                  onChange={(e) => setDraftReplies((prev) => ({ ...prev, [m.id]: e.target.value }))}
                  placeholder="Type your reply to customer..."
                  className="w-full min-h-[90px] border border-[#E8E6E3] rounded px-3 py-2 text-sm"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => void handleReply(m.id)}
                    disabled={replyingId === m.id}
                    className="bg-[#0A3D2E] text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
                  >
                    {replyingId === m.id ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
