import { gql } from '@apollo/client';

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    users: users_aggregate {
      aggregate {
        count
      }
    }
    images: images_aggregate {
      aggregate {
        count
      }
    }
    processing_stats: images_aggregate {
      aggregate {
        count
      }
      nodes {
        status
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users(order_by: { created_at: desc }) {
      id
      email
      role
      credits
      created_at
    }
  }
`;

export const GET_IMAGES = gql`
  query GetImages {
    images(order_by: { created_at: desc }) {
      id
      user_id
      original_url
      processed_url
      status
      created_at
    }
  }
`;