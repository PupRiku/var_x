/* eslint-disable */
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { graphql } from 'gatsby';

import Layout from '../components/ui/layout';
import DynamicToolbar from '../components/product-list/DynamicToolbar';

export default function ProductList({
  pageContext: { filterOptions, name, description },
  data,
}) {
  console.log(data);
  return (
    <Layout>
      <Grid container direction='column' alignItems='center'>
        <DynamicToolbar
          filterOptions={filterOptions}
          name={name}
          description={description}
        />
      </Grid>
    </Layout>
  );
}

export const quesry = graphql`
  query GetCategoryProducts($id: String!) {
    allStrapiProduct(filter: { category: { id: { eq: $id } } }) {
      edges {
        node {
          strapiId
          name
          variants {
            color
            id
            price
            size
            style
            images {
              url
            }
          }
        }
      }
    }
  }
`;
