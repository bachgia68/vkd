/**
 * Chatbot Embed Component
 * Displays Gradio chatbot as iframe
 */

import React, { useEffect, useState } from 'react';

interface ChatbotEmbedProps {
  title?: string;
  gradioUrl?: string;
  height?: number;
}

export const ChatbotEmbed: React.FC<ChatbotEmbedProps> = ({
  title = 'Chatbot',
  gradioUrl = process.env.NEXT_PUBLIC_GRADIO_URL || 'http://localhost:7860',
  height = 600,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Gradio is accessible
    const checkHealth = async () => {
      try {
        const response = await fetch(`${gradioUrl}/config`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Gradio health check failed: ${response.status}`);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Gradio connection error:', err);
        setError(
          'Chatbot không thể kết nối. Vui lòng thử lại sau!'
        );
        setIsLoading(false);
      }
    };

    checkHealth();
  }, [gradioUrl]);

  if (error) {
    return (
      <div className="w-full p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-center">{error}</p>
        <p className="text-red-500 text-sm text-center mt-2">
          Hotline: 0984999309
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full p-6 bg-gray-50 rounded-lg animate-pulse">
        <div className="h-20 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <iframe
          src={`${gradioUrl}?standalone=true`}
          width="100%"
          height={height}
          frameBorder="0"
          allowFullScreen
          className="rounded-lg"
          title="TA Chatbot"
        />
      </div>

      <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <p className="font-semibold mb-2">💡 Mẹo sử dụng:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Hỏi về giá, vận chuyển, cách dùng sâm</li>
          <li>Trợ lý sẽ trả lời ngay lập tức</li>
          <li>Khiếu nại? Liên hệ <strong>0984999309</strong></li>
        </ul>
      </div>
    </div>
  );
};

export default ChatbotEmbed;
