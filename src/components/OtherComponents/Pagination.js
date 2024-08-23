import React from 'react';
import PropTypes from 'prop-types';
import { Pagination as MuiPagination } from '@mui/material';

const Pagination = ({ count, page, onChange }) => {
  return (
    <MuiPagination
      count={count}
      page={page}
      onChange={onChange}
      color="primary"
      shape="rounded"
    />
  );
};

Pagination.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Pagination;
