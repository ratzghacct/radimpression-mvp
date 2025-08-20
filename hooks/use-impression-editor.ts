"use client"

import { useState, useRef } from "react"
import { formatText, saveToUndoStack, handleEditorInput } from "@/lib/impression-utils"

export const useImpressionEditor = () => {
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const editorRef = useRef<HTMLDivElement>(null)

  const handleUndo = (impression: string, setImpression: (value: string) => void) => {
    if (undoStack.length > 0 && editorRef.current) {
      const previousState = undoStack[undoStack.length - 1]
      setRedoStack((prev) => [...prev, impression])
      setUndoStack((prev) => prev.slice(0, -1))
      setImpression(previousState)
      editorRef.current.innerHTML = previousState
    }
  }

  const handleRedo = (impression: string, setImpression: (value: string) => void) => {
    if (redoStack.length > 0 && editorRef.current) {
      const nextState = redoStack[redoStack.length - 1]
      setUndoStack((prev) => [...prev, impression])
      setRedoStack((prev) => prev.slice(0, -1))
      setImpression(nextState)
      editorRef.current.innerHTML = nextState
    }
  }

  const applyFormatting = (
    command: string,
    value?: string,
    impression: string,
    setImpression: (value: string) => void,
  ) => {
    const newUndoStack = saveToUndoStack(impression, undoStack)
    setUndoStack(newUndoStack)
    setRedoStack([])

    const success = formatText(editorRef, command, value)

    if (success && editorRef.current) {
      setImpression(editorRef.current.innerHTML)
    }
  }

  const onEditorInput = (setImpression: (value: string) => void) => {
    const newContent = handleEditorInput(editorRef)
    setImpression(newContent)
  }

  return {
    editorRef,
    undoStack,
    redoStack,
    handleUndo,
    handleRedo,
    applyFormatting,
    onEditorInput,
  }
}
