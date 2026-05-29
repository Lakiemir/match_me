import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatService } from '../services/chatServices';
import { useChatContext } from '../context/chatContext';

// Интерфейс для сообщения (сопоставь с MessageResponse.java на бэкенде)
export interface Message {
  id?: number;
  chatId: number;
  senderId: number;
  content: string;
  createdAt: string;
  isRead?: boolean;
}

export const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { isConnected } = useChatContext();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Реф для автоматического скролла вниз при новых сообщениях
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // TODO: Достань токен и ID текущего пользователя из твоего хранилища
  const token = localStorage.getItem('token') || '';
  const myUserId = parseInt(localStorage.getItem('userId') || '1', 10);

  // 1. Загрузка истории сообщений (REST API)
  useEffect(() => {
    const fetchHistory = async () => {
      if (!chatId || !token) return;
      try {
        setIsLoading(true);
        // Загружаем первую страницу (20 последних сообщений)
        const data = await chatService.getMessages(Number(chatId), token, 0, 50);
        // Предполагаем, что бэкенд возвращает отсортированный массив или Page объект
        // Если бэкенд возвращает Page<ChatMessage>, то данные будут в data.content
        const history = data.content ? data.content : data;
        
        // Разворачиваем массив, чтобы старые были сверху, новые снизу
        setMessages(history.reverse()); 
      } catch (error) {
        console.error('Ошибка загрузки истории:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [chatId, token]);

  // 2. Подписка на WebSocket для получения новых сообщений в реальном времени
  useEffect(() => {
    const numericChatId = Number(chatId);
    
    if (isConnected && numericChatId) {
      chatService.subscribeToChat(numericChatId, (newMessage: Message) => {
        // Добавляем новое сообщение в конец списка
        setMessages((prev) => [...prev, newMessage]);
      });

      // Отписываемся при выходе из чата (unmount компонента)
      return () => {
        chatService.unsubscribeFromChat(numericChatId);
      };
    }
  }, [isConnected, chatId]);

  // 3. Авто-скролл вниз при изменении массива messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 4. Отправка сообщения
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !chatId) return;

    // Отправляем через WebSocket (он попадет в бэкенд, сохранится в БД и рассылкой вернется нам и собеседнику)
    chatService.sendMessage(Number(chatId), myUserId, inputValue.trim());
    
    // Очищаем поле ввода
    setInputValue('');
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-3xl mx-auto bg-gray-50 rounded-lg shadow-md overflow-hidden">
      {/* Шапка чата */}
      <div className="bg-white border-b px-4 py-3 flex items-center shadow-sm">
        <button 
          onClick={() => navigate('/chats')}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          &larr; Назад
        </button>
        <h2 className="text-lg font-semibold">Чат #{chatId}</h2>
      </div>

      {/* Зона сообщений */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="text-center text-gray-400 mt-10">Загрузка сообщений...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">Здесь пока нет сообщений. Напишите первое!</div>
        ) : (
          messages.map((msg, index) => {
            const isMine = msg.senderId === myUserId;
            return (
              <div 
                key={msg.id || `temp-${index}`} 
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                    isMine 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className="break-words">{msg.content}</p>
                  <span className={`text-[10px] block mt-1 text-right ${isMine ? 'text-blue-100' : 'text-gray-400'}`}>
                    {msg.createdAt ? formatMessageTime(msg.createdAt) : '...'}
                  </span>
                </div>
              </div>
            );
          })
        )}
        {/* Невидимый элемент для прокрутки вниз */}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className="bg-white border-t p-3">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Введите сообщение..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full px-6 py-2 font-medium transition-colors"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;