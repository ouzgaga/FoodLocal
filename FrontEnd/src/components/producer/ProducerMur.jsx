
import React, { Component, Fragment } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import ProducerPost from './ProducerPost';
import Loading from '../Loading';
import { List, ListItem } from '@material-ui/core';


class ProducerMur extends Component {

  render() {
    if (!this.props.entries && this.props.loading) return <p>Loading....</p>;
    const repos = this.props.entries.edges || [];
    console.log(this.props);
    return (
      <List>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => this.props.onLoadMore()}
          hasMore={this.props.entries.pageInfo.hasNextPage}
        >
          {repos.map(({ node }) => (
            <ListItem key={node.id}>
              <ProducerPost
                firstname={node.producer.firstname}
                lastname={node.producer.lastname}
                date={node.publicationDate}
                image={node.producer.image}
                address={node.address}
                post={node.text}
              />
            </ListItem>
          ))
          }

        </InfiniteScroll>

        {this.props.loading && <h2>Loading...</h2>}
      </List>
    );
  }
}

export default ProducerMur;
