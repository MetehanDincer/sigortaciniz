-- GÖRÜŞME SONLANDIRMA ONAYI İÇİN DURUM EKLEME
-- Bu kodu Supabase SQL Editor'de çalıştırın.

-- session_status enum tipine 'closing_requested' durumunu ekleyelim
ALTER TYPE session_status ADD VALUE IF NOT EXISTS 'closing_requested' AFTER 'active';
