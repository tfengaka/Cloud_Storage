import { gql } from '@apollo/client';

export const GET_USER_BY_ID = gql`
  query ($ID: String!) {
    account_by_pk(id: $ID) {
      id
      fullName
      email
      avatar_url
    }
  }
`;

export const GET_USER_BY_EMAIL = gql`
  query ($email: String!, $actor_id: String!) {
    user: account(where: { email: { _eq: $email }, _not: { id: { _eq: $actor_id } } }) {
      id
      fullName
      email
    }
  }
`;
