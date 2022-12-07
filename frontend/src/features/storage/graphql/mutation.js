import { gql } from '@apollo/client';

export const UPLOAD_FILE = gql`
  mutation ($name: String!, $extension: String!, $download_url: String!, $path: String!, $size: Int!) {
    uploadFile(data: { name: $name, extension: $extension, path: $path, url: $download_url, size: $size }) {
      createdBy
      path
      url
      id
      layer
    }
  }
`;
export const RENAME_FILE = gql`
  mutation ($id: String!, $newData: String!) {
    update_files_by_pk(pk_columns: { id: $id }, _set: { name: $newData }) {
      id
      name
    }
  }
`;

export const SHARE_FILE = gql`
  mutation ($emails: [String], $path: String!) {
    shareFile(data: { emails: $emails, path: $path }) {
      message
    }
  }
`;

export const SOFT_DELETE_FILE = gql`
  mutation ($id: String!) {
    deleted_item: update_files_by_pk(pk_columns: { id: $id }, _set: { status: "soft_deleted" }) {
      id
      name
    }
  }
`;

export const MOVE_FILE = gql`
  mutation ($from: String!, $to: String!) {
    moveFile(data: { from_path: $from, to_path: $to }) {
      message
    }
  }
`;

export const REMOVE_SHARED_FILE = gql`
  mutation ($path: String!) {
    delete_shares(where: { file: { path: { _similar: $path } } }) {
      affected_rows
    }
  }
`;

export const RESTORE_FILE = gql`
  mutation ($file_id: String!) {
    update_files_by_pk(pk_columns: { id: $file_id }, _set: { status: "active" }) {
      status
    }
  }
`;

export const PERMANENTLY_DELETE_FILE = gql`
  mutation ($file_id: String!) {
    delete_files_by_pk(id: $file_id) {
      status
    }
  }
`;
