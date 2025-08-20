import type React from "react"
import { toast } from "@/hooks/use-toast"

export const copyToClipboard = async (text: string) => {
  try {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = text
    const plainText = tempDiv.textContent || tempDiv.innerText || ""

    await navigator.clipboard.writeText(plainText)
    toast({
      title: "Copied!",
      description: "Impression copied to clipboard",
    })
  } catch (error) {
    toast({
      title: "Copy Failed",
      description: "Failed to copy to clipboard",
      variant: "destructive",
    })
  }
}

export const formatText = (editorRef: React.RefObject<HTMLDivElement>, command: string, value?: string) => {
  if (!editorRef.current) return false

  editorRef.current.focus()

  try {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      const range = document.createRange()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }

    const success = document.execCommand(command, false, value)

    if (!success) {
      console.warn(`Command ${command} failed`)
    }

    return success
  } catch (error) {
    console.error("Formatting error:", error)

    setTimeout(() => {
      try {
        editorRef.current?.focus()
        document.execCommand(command, false, value)
      } catch (e) {
        console.error("Fallback formatting failed:", e)
      }
    }, 10)

    return false
  }
}

export const saveToUndoStack = (impression: string, undoStack: string[]) => {
  if (impression) {
    return [...undoStack.slice(-9), impression]
  }
  return undoStack
}

export const handleEditorInput = (editorRef: React.RefObject<HTMLDivElement>) => {
  if (editorRef.current) {
    return editorRef.current.innerHTML
  }
  return ""
}
