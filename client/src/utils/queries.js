import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  {
    me {
        _id
        username
        email
        savedBooks {
            bookId
            authors
            description
            image
            link
            title
        }
    }
}`