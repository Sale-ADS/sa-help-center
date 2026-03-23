'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Send, X, Loader2, AlertCircle } from 'lucide-react';

interface FeedbackWidgetProps {
  pagePath: string;
}

export function FeedbackWidget({ pagePath }: FeedbackWidgetProps) {
  const [submitted, setSubmitted] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voteType, setVoteType] = useState<boolean | null>(null);

  const submitFeedback = async (isHelpful: boolean) => {
    setVoteType(isHelpful);
    setError(null);
    
    if (!isHelpful) {
      setShowComment(true);
      return;
    }

    await sendFeedback(isHelpful);
  };

  const sendFeedback = async (isHelpful: boolean, userComment?: string) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pagePath,
          isHelpful,
          comment: userComment,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitComment = async () => {
    if (!comment.trim() || voteType === null) return;
    await sendFeedback(voteType, comment);
  };

  if (submitted) {
    return (
      <div className="mt-8 pt-6 border-t">
        <div className="flex items-center gap-2 text-sm text-green-600">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>¡Gracias por tu feedback! Nos ayuda a mejorar.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {!showComment ? (
        <div>
          <p className="text-sm font-medium mb-3 text-fd-foreground">
            ¿Te fue útil esta página?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => submitFeedback(true)}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-fd-accent transition-colors disabled:opacity-50"
            >
              <ThumbsUp className="h-4 w-4" />
              <span>Sí</span>
            </button>
            <button
              onClick={() => submitFeedback(false)}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-fd-accent transition-colors disabled:opacity-50"
            >
              <ThumbsDown className="h-4 w-4" />
              <span>No</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-fd-foreground">
              ¿Qué podemos mejorar?
            </p>
            <button
              onClick={() => {
                setShowComment(false);
                setVoteType(null);
              }}
              className="text-fd-muted-foreground hover:text-fd-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Cuéntanos cómo podemos mejorar esta página..."
            className="w-full px-3 py-2 text-sm border rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-fd-primary"
          />
          <div className="flex gap-2">
            <button
              onClick={submitComment}
              disabled={isSubmitting || !comment.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-fd-primary text-fd-primary-foreground rounded-lg hover:bg-fd-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>Enviar</span>
            </button>
            <button
              onClick={() => {
                setShowComment(false);
                setVoteType(null);
              }}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-fd-accent transition-colors disabled:opacity-50"
            >
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
