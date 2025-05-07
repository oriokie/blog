"use client"

import { useEffect, useRef } from "react"

interface EditorProps {
  initialContent: string
  onChange: (content: string) => void
}

export default function Editor({ initialContent, onChange }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent || ""
    }
  }, [initialContent])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  return (
    <div
      ref={editorRef}
      contentEditable
      className="min-h-[400px] p-4 focus:outline-none prose prose-sm dark:prose-invert max-w-none"
      onInput={handleInput}
      dangerouslySetInnerHTML={{ __html: initialContent }}
    />
  )
}
