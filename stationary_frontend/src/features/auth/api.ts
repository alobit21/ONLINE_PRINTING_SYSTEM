import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      token
      refreshToken
      user {
        id
        email
        role
        isVerified
        avatar
      }
      response {
        success
        message
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $role: String!, $phoneNumber: String) {
    registerUser(email: $email, password: $password, role: $role, phoneNumber: $phoneNumber) {
      response {
        success
        message
      }
      user {
        id
        email
        role
      }
    }
  }
`;
