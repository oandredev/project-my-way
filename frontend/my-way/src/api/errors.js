const MESSAGES = {
  "Email already in use": "Este e-mail já está em uso.",
  "Email or password are invalid": "E-mail ou senha inválidos.",
  "This account was archived": "Esta conta foi arquivada.",
};

const STATUS_FALLBACKS = {
  400: "Dados inválidos. Revise os campos.",
  401: "Sessão inválida ou expirada. Entre novamente.",
  403: "Você não tem permissão para fazer isso.",
  404: "Recurso não encontrado.",
  409: "Não foi possível concluir: há um conflito com os dados existentes.",
};

//---------------------------------------------------------------------------

export function parseApiError(error) {
  if (!error.response) {
    return error.code === "ECONNABORTED"
      ? "O servidor demorou para responder."
      : "Não foi possível conectar ao servidor. Verifique sua rede.";
  }

  const { status, data } = error.response;

  if (data?.message && MESSAGES[data.message]) {
    return MESSAGES[data.message];
  }

  // Fallback
  if (STATUS_FALLBACKS[status]) return STATUS_FALLBACKS[status];
  if (status >= 500) return "Erro no servidor. Tente novamente mais tarde.";

  return "Ocorreu um erro inesperado.";
}
