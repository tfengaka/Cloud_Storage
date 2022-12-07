import { gql } from '@apollo/client';

export const GET_MY_STORE = gql`
  query ($owner_id: String!, $layer: Int!, $path: String) {
    files(
      where: {
        extension: { _neq: "folder" }
        owner: { id: { _eq: $owner_id } }
        layer: { _eq: $layer }
        path: { _regex: $path, _neq: $path }
        status: { _eq: "active" }
      }
      order_by: { createdAt: asc }
    ) {
      id
      name
      url
      size
      extension
      path
      owner {
        id
        fullName
      }
    }
    folders: files(
      where: {
        extension: { _eq: "folder" }
        layer: { _eq: $layer }
        owner: { id: { _eq: $owner_id } }
        path: { _regex: $path, _neq: $path }
        status: { _eq: "active" }
      }
      order_by: { createdAt: asc }
    ) {
      id
      name
      path
      layer
      owner {
        id
        fullName
      }
    }
  }
`;

export const GET_MY_SHARED = gql`
  query ($user_id: String!, $layer: Int!, $path: String) {
    files(
      where: {
        extension: { _neq: "folder" }
        shared: { account: { id: { _eq: $user_id } } }
        layer: { _eq: $layer }
        path: { _regex: $path, _neq: $path }
        status: { _eq: "active" }
      }
      order_by: { createdAt: asc }
    ) {
      id
      name
      extension
      size
      url
      owner {
        id
        fullName
      }
    }
    folders: files(
      where: {
        extension: { _eq: "folder" }
        shared: { account: { id: { _eq: $user_id } } }
        layer: { _eq: $layer }
        path: { _regex: $path, _neq: $path }
        status: { _eq: "active" }
      }
      order_by: { createdAt: asc }
    ) {
      id
      name
      layer
      path
      owner {
        id
        fullName
      }
    }
  }
`;

export const GET_MY_TRASH = gql`
  query ($owner_id: String!, $layer: Int!, $path: String) {
    files(
      where: {
        extension: { _neq: "folder" }
        owner: { id: { _eq: $owner_id } }
        layer: { _eq: $layer }
        path: { _regex: $path, _neq: $path }
        status: { _eq: "soft_deleted" }
      }
      order_by: { createdAt: asc }
    ) {
      id
      name
      url
      size
      extension
      path
      owner {
        id
        fullName
      }
    }
    folders: files(
      where: {
        extension: { _eq: "folder" }
        layer: { _eq: $layer }
        owner: { id: { _eq: $owner_id } }
        path: { _regex: $path, _neq: $path }
        status: { _eq: "soft_deleted" }
      }
      order_by: { createdAt: asc }
    ) {
      id
      name
      path
      layer
      owner {
        id
        fullName
      }
    }
  }
`;

export const GET_MY_FOLDER_TREE = gql`
  query ($owner_id: String!, $layer: Int!, $path: String!, $item_id: String!) {
    folders: files(
      where: {
        id: { _neq: $item_id }
        owner: { id: { _eq: $owner_id } }
        layer: { _eq: $layer }
        extension: { _eq: "folder" }
        status: { _eq: "active" }
        path: { _regex: $path, _neq: $path }
      }
    ) {
      id
      name
      layer
      path
    }
  }
`;

export const GET_SEARCHING_RESULT = gql`
  query ($user: String!, $regex: String, $limit: Int!) {
    files(
      where: {
        owner: { id: { _eq: $user } }
        name: { _regex: $regex }
        extension: { _neq: "folder" }
        status: { _eq: "active" }
      }
      limit: $limit
    ) {
      id
      name
      extension
      url
      size
    }
  }
`;
