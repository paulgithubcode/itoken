#!/usr/bin/env bash
# ==============================================================================
# Script Konfigurasi Otomatis Developer (npx pecut-opus setup)
# Mengatur OPENAI_BASE_URL dan OPENAI_API_KEY di ~/.bashrc, ~/.zshrc & Cursor/Cline
# ==============================================================================

set -e

GATEWAY_URL="https://api.pecut-opus.io/v1"

echo "=========================================================="
echo "    PecutOpus AI Gateway - Quick Setup Wizard            "
echo "    Satu API Key, 40+ Model AI untuk Cursor & Cline      "
echo "=========================================================="
echo ""

# Input API Key jika tidak dipassing lewat argumen
if [ -z "$1" ]; then
    read -p "Masukkan API Key PecutOpus Anda (sk_live_...): " USER_KEY
else
    USER_KEY="$1"
fi

if [[ ! "$USER_KEY" =~ ^sk_live_ ]]; then
    echo "❌ Format key tidak valid. Kunci harus diawali dengan sk_live_..."
    exit 1
fi

echo ""
echo "⚙️  Mengonfigurasi Environment Variables..."

# 1. Update .bashrc jika ada
if [ -f "$HOME/.bashrc" ]; then
    sed -i.bak '/OPENAI_BASE_URL/d' "$HOME/.bashrc" 2>/dev/null || true
    sed -i.bak '/OPENAI_API_KEY/d' "$HOME/.bashrc" 2>/dev/null || true
    echo "export OPENAI_BASE_URL=\"$GATEWAY_URL\"" >> "$HOME/.bashrc"
    echo "export OPENAI_API_KEY=\"$USER_KEY\"" >> "$HOME/.bashrc"
    echo "✓ Diperbarui: ~/.bashrc"
fi

# 2. Update .zshrc jika ada
if [ -f "$HOME/.zshrc" ]; then
    sed -i.bak '/OPENAI_BASE_URL/d' "$HOME/.zshrc" 2>/dev/null || true
    sed -i.bak '/OPENAI_API_KEY/d' "$HOME/.zshrc" 2>/dev/null || true
    echo "export OPENAI_BASE_URL=\"$GATEWAY_URL\"" >> "$HOME/.zshrc"
    echo "export OPENAI_API_KEY=\"$USER_KEY\"" >> "$HOME/.zshrc"
    echo "✓ Diperbarui: ~/.zshrc"
fi

# 3. Buat snippet config untuk Cursor IDE
mkdir -p "$HOME/.cursor" 2>/dev/null || true
cat <<EOF > "$HOME/.cursor/pecutopus_config.json"
{
  "openai.baseUrl": "$GATEWAY_URL",
  "openai.apiKey": "$USER_KEY"
}
EOF
echo "✓ File konfigurasi Cursor disimpan: ~/.cursor/pecutopus_config.json"

echo ""
echo "🎉 Berhasil diatur! Silakan jalankan 'source ~/.zshrc' atau restart IDE Anda."
echo "Sekarang Anda dapat menggunakan model gpt-4o, claude-3-5-sonnet, atau deepseek-chat langsung di Cursor!"
