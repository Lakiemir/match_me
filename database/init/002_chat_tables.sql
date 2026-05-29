--just for me: -- Таблица для хранения сессий чата между двумя пользователями
CREATE TABLE IF NOT EXISTS chats (
    id BIGSERIAL PRIMARY KEY,
    user_a_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_b_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Гарантируем, что между двумя пользователями существует только один чат
    -- Ограничение CHECK обеспечивает единый порядок ID (меньший всегда первый), что предотвращает дубликаты типа (1,5) и (5,1)
    
    CONSTRAINT chats_users_unique UNIQUE(user_a_id, user_b_id),
    CONSTRAINT chats_order_check CHECK(user_a_id < user_b_id)
);--not me, but retyped letter to letter by me.
-- таблица для хранения самих сообщений
CREATE TABLE IF NOT EXISTS chat_messages(
    id BIGSERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Индекс для ускорения загрузки истории сообщений (пагинация).
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id_created_at ON chat_messages(chat_id, created_at DESC);
-- Индекс для быстрой сортировки списка чатов по времени последнего сообщения.
CREATE INDEX IF NOT EXISTS idx_chat_last_message_at ON chats(last_message_at DESC);








