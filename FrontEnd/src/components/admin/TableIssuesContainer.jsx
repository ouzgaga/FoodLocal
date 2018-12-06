import React from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import TableIssues from './TableIssues';

// récupère les issues grâce à apollo
const GET_ISSUES_FROM_REPO = gql`
query RepoIssues($owner: String!, $repo: String!, $state: IssueState!) {
  repository(owner: $owner, name: $repo) {
    issues(first: 100, states: [$state], orderBy: {field: CREATED_AT, direction: DESC}) {
      edges {
        cursor
        node {
          title
          number
          state
          createdAt
          author {
            login
          }
        }
      }
    }
  }
}
`;

/**
 * Fonction récupérant les données des issues et créant le tableau TableIssues
 * @param {*} props
 */
function TableIssuesContainer(props) {
  const {
    username, repo, state,
  } = props;

  return (

    <Query
      query={GET_ISSUES_FROM_REPO}
      variables={{ owner: username, repo, state }}
    >
      {({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error :(</div>;
        const { edges } = data.repository.issues;

        return (
          <TableIssues datas={edges} username={username} repo={repo} state={state} />
        );
      }}
    </Query>
  );
}

TableIssuesContainer.propTypes = {
  username: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
};

export default TableIssuesContainer;
