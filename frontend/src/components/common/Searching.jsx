import { useQuery } from '@apollo/client';
import { faDownload, faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import React, { useEffect, useRef, useState } from 'react';

import { UploadLoading } from 'components/common';
import Icons from 'components/Icons';
import { useAuth } from 'contexts/AuthContext';
import { GET_SEARCHING_RESULT } from 'features/storage/graphql/query';
import useDebounce from 'hooks/useDebounce';
import { download } from 'utils';

function Searching() {
  const [searchString, setSearchQuery] = useState('');
  const debounceQuery = useDebounce(searchString, 300);
  const { user } = useAuth();
  const { loading, data, refetch } = useQuery(GET_SEARCHING_RESULT, {
    variables: {
      user: user.id,
      regex: debounceQuery,
      limit: 5,
    },
  });
  const [searchResult, setSearchResult] = useState([]);

  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!debounceQuery.trim()) {
      setSearchResult([]);
      return;
    }
    refetch({ regex: debounceQuery });
    if (data?.files.length > 0) {
      setSearchResult([...data.files]);
    }
  }, [data, debounceQuery, refetch]);

  const handleChangeInput = (event) => {
    const searchValue = event.target.value;
    if (!searchValue.startsWith(' ')) {
      setSearchQuery(searchValue);
    }
  };
  const handleClearInput = () => {
    setSearchQuery('');
    searchInputRef.current.focus();
  };
  return (
    <div>
      <HeadlessTippy
        visible={searchResult.length > 0}
        interactive
        placement='bottom-start'
        offset={[0, 3]}
        render={(attrs) => (
          <div className='search_result' tabIndex={-1} {...attrs}>
            <div className='search_result_header'>
              <h4>Kết quả tìm kiếm</h4>
            </div>
            <div className='search_result_list'>
              {data?.files.map((file) => (
                <SearchItem key={file.id} {...file} />
              ))}
            </div>
          </div>
        )}
      >
        <div className='header_search'>
          <FontAwesomeIcon size='lg' icon={faMagnifyingGlass} className='icon' />
          <input
            type='text'
            spellCheck={false}
            placeholder='Tìm thư mục hoặc tệp tin...'
            className='header_search-input'
            value={searchString}
            onChange={handleChangeInput}
            ref={searchInputRef}
          />
          <div className='header_search_btn'>
            {loading ? (
              <UploadLoading />
            ) : (
              <button onClick={() => handleClearInput()}>
                <FontAwesomeIcon icon={faX} />
              </button>
            )}
          </div>
        </div>
      </HeadlessTippy>
    </div>
  );
}

const SearchItem = ({ name, extension, url }) => {
  return (
    <div className='search_result-item' onClick={() => download(url)}>
      <div className='icon'>{Icons[extension] || Icons.blank}</div>
      <div className='info'>
        <span className='info_name'>{name}</span>
        <div className='info_desc'>
          <FontAwesomeIcon icon={faDownload} className='info_desc_icon' />
          <span>Nhấn để tải xuống</span>
        </div>
      </div>
    </div>
  );
};

export default Searching;
