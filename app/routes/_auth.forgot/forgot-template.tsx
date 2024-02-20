interface ForgotTemplateProps {
  name: string;
  resetLink: string;
}

export function ForgotTemplate({ name, resetLink }: ForgotTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>
        Recuperação de Senha
      </h2>
      <p>Olá, {name}!</p>
      <p>
        Você solicitou uma redefinição de senha. Por favor, clique no link
        abaixo para criar uma nova senha:
      </p>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <a
          href={resetLink}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "5px",
            textDecoration: "none",
          }}
        >
          Redefinir Senha
        </a>
      </div>
      <p>
        Se você não solicitou esta redefinição de senha, por favor ignore este
        e-mail.
      </p>
      <p>Obrigado,</p>
      <p>A equipe de suporte Meu Form</p>
    </div>
  );
}
