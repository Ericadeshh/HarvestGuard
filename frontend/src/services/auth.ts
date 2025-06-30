const API_BASE_URL = "http://localhost:8000/api/v1";

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export async function login(
  username: string,
  password: string
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username,
      password,
    }),
  });
  if (!response.ok) throw new Error("Login failed");
  const data: TokenResponse = await response.json();
  return data.access_token;
}
