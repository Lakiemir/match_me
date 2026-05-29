import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatContext } from '../context/chatContext';
import type { Chat } from '../context/chatContext';
// import { useAuth } from '../context/AuthContext'; // Раскомментируй, если у тебя есть такой хук

export const ChatsPage: React.FC = () => {
  const navigate = useNavigate();
  const { chats, loadChats } = useChatContext();
  
  // TODO: Достань токен авторизации из твоего хранилища/контекста
  // const { token } = useAuth(); 
  const token = localStorage.getItem('token') || ''; // Временная заглушка

  // Загружаем список чатов при открытии страницы
  useEffect(() => {
    if (token) {
      loadChats(token);
    }
  }, [token, loadChats]);

  // Функция для форматирования времени (например: "15:30" или "Вчера")
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Мои сообщения</h1>

      {chats.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p>У вас пока нет активных диалогов.</p>
          <p className="text-sm mt-2">Перейдите в профиль пользователя, чтобы начать общение.</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          {chats.map((chat: Chat) => (
            <div 
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="flex items-center p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {/* Аватарка (заглушка, если нет реальной) */}
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg mr-4 flex-shrink-0">
                {chat.companionName ? chat.companionName.charAt(0).toUpperCase() : '?'}
              </div>

              {/* Инфо чата */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h2 className="text-lg font-semibold truncate text-gray-900">
                    {chat.companionName || `Пользователь #${chat.companionId}`}
                  </h2>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatTime(chat.lastMessageAt)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 truncate">
                  {chat.lastMessageContent || 'Нет сообщений'}
                </p>
              </div>

              {/* Индикатор непрочитанных (красная точка/счетчик) */}
              {chat.unreadCount !== undefined && chat.unreadCount > 0 && (
                <div className="ml-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatsPage;