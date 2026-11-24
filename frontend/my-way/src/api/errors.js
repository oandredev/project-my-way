const MESSAGES = {
  // Usuário
  "Email already in use": "Este e-mail já está em uso.",
  "Email or password are invalid": "E-mail ou senha inválidos.",
  "This account was archived": "Esta conta foi arquivada.",
  "User not found": "Usuário não encontrado. Entre novamente.",
  "Current password is required": "Digite a senha atual.",
  "Current password is incorrect": "Senha atual incorreta.",

  // Categorias
  "Category name already in use by this user":
    "Você já tem uma categoria com esse nome.",
  "Category not found": "Categoria não encontrada.",

  // Itens
  "Study item not found": "Item não encontrado.",
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
