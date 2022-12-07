import { gql } from '@apollo/client';

export const SIGN_UP = gql`
  mutation ($email: String!, $password: String!, $fullName: String!) {
    createAccount(data: { email: $email, password: $password, fullName: $fullName, role: "user" }) {
      access_token
      refresh_token
    }
  }
`;

export const SIGN_IN = gql`
  mutation ($email: String!, $type: String!, $password: String, $avatar: String, $fullName: String) {
    login(data: { email: $email, loginType: $type, password: $password, avatar: $avatar, fullName: $fullName }) {
      access_token
      refresh_token
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation ($accessToken: String!, $refreshToken: String!) {
    refreshToken(data: { access_token: $accessToken, refresh_token: $refreshToken }) {
      access_token
      refresh_token
    }
  }
`;
